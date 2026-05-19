const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `uploads/${req.user.id}`;
    fs.mkdir(uploadDir, { recursive: true }).then(() => {
      cb(null, uploadDir);
    }).catch(err => {
      cb(err);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now, but you can add restrictions here
    cb(null, true);
  }
});

// Get user files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT * FROM files WHERE user_id = ?';
    let params = [req.user.userId];

    if (search) {
      query += ' AND file_name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const files = await getAllRows(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM files WHERE user_id = ?';
    let countParams = [req.user.userId];

    if (search) {
      countQuery += ' AND file_name LIKE ?';
      countParams.push(`%${search}%`);
    }

    const countResult = await getRow(countQuery, countParams);
    const total = countResult.total;

    res.json({
      files,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, filename, path: filePath, size, mimetype } = req.file;

    // Save file info to database
    const result = await runQuery(
      'INSERT INTO files (user_id, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?)',
      [req.user.userId, originalname, filePath, size, mimetype]
    );

    // Log activity
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'file_uploaded', `File uploaded: ${originalname}`, JSON.stringify({ fileId: result.lastID, fileName: originalname, fileSize: size })]
    );

    res.json({
      message: 'File uploaded successfully',
      file: {
        id: result.lastID,
        name: originalname,
        size: size,
        type: mimetype,
        path: filePath
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Download file
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await getRow(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, req.user.userId]
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if file exists on disk
    try {
      await fs.access(file.file_path);
    } catch (error) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    // Log activity
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'file_downloaded', `File downloaded: ${file.file_name}`, JSON.stringify({ fileId: file.id, fileName: file.file_name })]
    );

    res.download(file.file_path, file.file_name);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'File download failed' });
  }
});

// Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;

    const file = await getRow(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, req.user.userId]
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file from disk
    try {
      await fs.unlink(file.file_path);
    } catch (error) {
      console.warn('File not found on disk:', file.file_path);
    }

    // Delete from database
    await runQuery(
      'DELETE FROM files WHERE id = ? AND user_id = ?',
      [fileId, req.user.userId]
    );

    // Log activity
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'file_deleted', `File deleted: ${file.file_name}`, JSON.stringify({ fileId: file.id, fileName: file.file_name })]
    );

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'File deletion failed' });
  }
});

// Get file info
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const fileId = req.params.id;

    const [files] = await pool.execute(
      'SELECT * FROM files WHERE id = ? AND user_id = ?',
      [fileId, req.user.id]
    );

    if (files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ file: files[0] });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to fetch file info' });
  }
});

module.exports = router;
