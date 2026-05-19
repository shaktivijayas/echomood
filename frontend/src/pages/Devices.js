import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Clock,
  Wifi,
  WifiOff,
  MoreVertical
} from 'lucide-react';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'mobile',
    id: ''
  });

  useEffect(() => {
    // Fetch devices from API
    fetch('/api/devices')
      .then(res => res.json())
      .then(data => setDevices(data.devices || []))
      .catch(() => {
        // Mock data for development
        setDevices([
          {
            id: 1,
            device_name: 'iPhone 15 Pro',
            device_type: 'mobile',
            device_id: 'iphone-15-pro-001',
            last_seen: '2024-01-15T10:30:00Z',
            is_active: true,
            created_at: '2024-01-10T08:00:00Z'
          },
          {
            id: 2,
            device_name: 'MacBook Pro',
            device_type: 'laptop',
            device_id: 'macbook-pro-001',
            last_seen: '2024-01-15T09:15:00Z',
            is_active: true,
            created_at: '2024-01-08T14:30:00Z'
          },
          {
            id: 3,
            device_name: 'iPad Air',
            device_type: 'tablet',
            device_id: 'ipad-air-001',
            last_seen: '2024-01-14T16:45:00Z',
            is_active: false,
            created_at: '2024-01-05T11:20:00Z'
          }
        ]);
      });
  }, []);

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-6 w-6" />;
      case 'laptop':
        return <Laptop className="h-6 w-6" />;
      case 'desktop':
        return <Monitor className="h-6 w-6" />;
      case 'tablet':
        return <Tablet className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const getDeviceTypeLabel = (type) => {
    switch (type) {
      case 'mobile':
        return 'Mobile';
      case 'laptop':
        return 'Laptop';
      case 'desktop':
        return 'Desktop';
      case 'tablet':
        return 'Tablet';
      default:
        return 'Device';
    }
  };

  const formatLastSeen = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const handleAddDevice = async (e) => {
    e.preventDefault();
    
    if (!newDevice.name || !newDevice.id) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/devices/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newDevice)
      });

      if (response.ok) {
        const data = await response.json();
        setDevices(prev => [...prev, data.device]);
        setNewDevice({ name: '', type: 'mobile', id: '' });
        setShowAddDevice(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add device');
      }
    } catch (error) {
      console.error('Error adding device:', error);
      alert('Failed to add device');
    }
  };

  const handleToggleDevice = async (deviceId, isActive) => {
    try {
      const response = await fetch(`/api/devices/${deviceId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        setDevices(prev => prev.map(device => 
          device.id === deviceId 
            ? { ...device, is_active: !isActive }
            : device
        ));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update device');
      }
    } catch (error) {
      console.error('Error updating device:', error);
      alert('Failed to update device');
    }
  };

  const handleRemoveDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to remove this device?')) {
      return;
    }

    try {
      const response = await fetch(`/api/devices/${deviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setDevices(prev => prev.filter(device => device.id !== deviceId));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove device');
      }
    } catch (error) {
      console.error('Error removing device:', error);
      alert('Failed to remove device');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
          <p className="text-muted-foreground">
            Manage your connected devices and sync settings
          </p>
        </div>
        <Button onClick={() => setShowAddDevice(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Add Device Modal */}
      {showAddDevice && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Device</CardTitle>
            <CardDescription>
              Register a new device to sync with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Device Name</label>
                <Input
                  placeholder="e.g., My iPhone"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Device Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                >
                  <option value="mobile">Mobile</option>
                  <option value="laptop">Laptop</option>
                  <option value="desktop">Desktop</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Device ID</label>
                <Input
                  placeholder="e.g., device-unique-id-123"
                  value={newDevice.id}
                  onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Add Device</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddDevice(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Devices Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getDeviceIcon(device.device_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{device.device_name}</CardTitle>
                    <CardDescription>{getDeviceTypeLabel(device.device_type)}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveDevice(device.id)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="flex items-center space-x-2">
                    {device.is_active ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={`text-sm font-medium ${
                      device.is_active ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {device.is_active ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Seen</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{formatLastSeen(device.last_seen)}</span>
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    variant={device.is_active ? "destructive" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleDevice(device.id, device.is_active)}
                  >
                    {device.is_active ? (
                      <>
                        <PowerOff className="h-3 w-3 mr-1" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <Power className="h-3 w-3 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveDevice(device.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Smartphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No devices connected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your first device to start syncing your files across all your devices.
            </p>
            <Button onClick={() => setShowAddDevice(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
