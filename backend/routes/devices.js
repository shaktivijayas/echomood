const express = require('express');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user devices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const devices = await getAllRows(
      'SELECT * FROM devices WHERE user_id = ? ORDER BY last_seen DESC',
      [req.user.userId]
    );

    res.json({ devices });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Register new device
router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { deviceName, deviceType, deviceId } = req.body;

    if (!deviceName || !deviceType || !deviceId) {
      return res.status(400).json({ error: 'Device name, type, and ID are required' });
    }

    // Check if device already exists
    const existingDevice = await getRow(
      'SELECT id FROM devices WHERE device_id = ?',
      [deviceId]
    );

    if (existingDevice) {
      // Update existing device
      await runQuery(
        'UPDATE devices SET device_name = ?, device_type = ?, last_seen = datetime("now"), is_active = TRUE WHERE device_id = ?',
        [deviceName, deviceType, deviceId]
      );

      // Log activity
      await runQuery(
        'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
        [req.user.userId, 'device_updated', `Device updated: ${deviceName}`, JSON.stringify({ deviceName, deviceType, deviceId })]
      );

      res.json({ message: 'Device updated successfully' });
    } else {
      // Create new device
      const result = await runQuery(
        'INSERT INTO devices (user_id, device_name, device_type, device_id) VALUES (?, ?, ?, ?)',
        [req.user.userId, deviceName, deviceType, deviceId]
      );

      // Log activity
      await runQuery(
        'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
        [req.user.userId, 'device_registered', `Device registered: ${deviceName}`, JSON.stringify({ deviceId: result.lastID, deviceName, deviceType, deviceId })]
      );

      res.status(201).json({
        message: 'Device registered successfully',
        device: {
          id: result.lastID,
          deviceName,
          deviceType,
          deviceId
        }
      });
    }
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({ error: 'Device registration failed' });
  }
});

// Update device status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    // Check if device belongs to user
    const device = await getRow(
      'SELECT * FROM devices WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Update device status
    await runQuery(
      'UPDATE devices SET is_active = ?, last_seen = datetime("now") WHERE id = ?',
      [isActive, id]
    );

    // Log activity
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, isActive ? 'device_activated' : 'device_deactivated', 
       `Device ${isActive ? 'activated' : 'deactivated'}: ${device.device_name}`, 
       JSON.stringify({ deviceId: id, deviceName: device.device_name, isActive })]
    );

    res.json({ message: `Device ${isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) {
    console.error('Update device status error:', error);
    res.status(500).json({ error: 'Failed to update device status' });
  }
});

// Remove device
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if device belongs to user
    const device = await getRow(
      'SELECT * FROM devices WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Delete device
    await runQuery(
      'DELETE FROM devices WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    // Log activity
    await runQuery(
      'INSERT INTO activity_log (user_id, action, description, metadata) VALUES (?, ?, ?, ?)',
      [req.user.userId, 'device_removed', `Device removed: ${device.device_name}`, JSON.stringify({ deviceId: id, deviceName: device.device_name })]
    );

    res.json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ error: 'Failed to remove device' });
  }
});

// Get device details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const device = await getRow(
      'SELECT * FROM devices WHERE id = ? AND user_id = ?',
      [id, req.user.userId]
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.json({ device });
  } catch (error) {
    console.error('Get device error:', error);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

module.exports = router;
