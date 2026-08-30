const express = require('express');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get storage usage
    const storageResult = await getRow(
      'SELECT COALESCE(SUM(file_size), 0) as used_storage FROM files WHERE user_id = ?',
      [userId]
    );
    const usedStorage = storageResult.used_storage;
    const totalStorage = 100 * 1024 * 1024 * 1024; // 100GB in bytes
    const storageUsedGB = Math.round((usedStorage / (1024 * 1024 * 1024)) * 100) / 100;
    const storageTotalGB = 100;

    // Get device count
    const deviceResult = await getRow(
      'SELECT COUNT(*) as device_count FROM devices WHERE user_id = ? AND is_active = TRUE',
      [userId]
    );
    const devicesConnected = deviceResult.device_count;

    // Get file count
    const fileResult = await getRow(
      'SELECT COUNT(*) as file_count FROM files WHERE user_id = ?',
      [userId]
    );
    const filesSynced = fileResult.file_count;

    // Get recent activity (last 10 activities)
    const activityResult = await getAllRows(
      `SELECT action, description, metadata, created_at 
       FROM activity_log 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );

    const recentActivity = activityResult.map(activity => ({
      id: activity.id,
      action: activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: activity.description,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
      time: formatTimeAgo(activity.created_at)
    }));

    res.json({
      storageUsed: storageUsedGB,
      storageTotal: storageTotalGB,
      devicesConnected,
      filesSynced,
      recentActivity
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Get activity log with pagination
router.get('/activity', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const activities = await getAllRows(
      `SELECT action, description, metadata, created_at 
       FROM activity_log 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const countResult = await getRow(
      'SELECT COUNT(*) as total FROM activity_log WHERE user_id = ?',
      [req.user.id]
    );
    const total = countResult.total;

    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      action: activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: activity.description,
      metadata: activity.metadata ? JSON.parse(activity.metadata) : null,
      time: formatTimeAgo(activity.created_at),
      timestamp: activity.created_at
    }));

    res.json({
      activities: formattedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

// Get storage breakdown by file type
router.get('/storage-breakdown', authenticateToken, async (req, res) => {
  try {
    const breakdown = await getAllRows(
      `SELECT 
        CASE 
          WHEN file_type LIKE 'image/%' THEN 'Images'
          WHEN file_type LIKE 'video/%' THEN 'Videos'
          WHEN file_type LIKE 'audio/%' THEN 'Audio'
          WHEN file_type LIKE 'application/pdf' THEN 'Documents'
          WHEN file_type LIKE 'text/%' THEN 'Text Files'
          ELSE 'Other'
        END as category,
        COUNT(*) as file_count,
        SUM(file_size) as total_size
       FROM files 
       WHERE user_id = ? 
       GROUP BY category 
       ORDER BY total_size DESC`,
      [req.user.id]
    );

    const formattedBreakdown = breakdown.map(item => ({
      category: item.category,
      fileCount: item.file_count,
      totalSize: item.total_size,
      totalSizeGB: Math.round((item.total_size / (1024 * 1024 * 1024)) * 100) / 100
    }));

    res.json({ breakdown: formattedBreakdown });
  } catch (error) {
    console.error('Get storage breakdown error:', error);
    res.status(500).json({ error: 'Failed to fetch storage breakdown' });
  }
});

// Helper function to format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

module.exports = router;
