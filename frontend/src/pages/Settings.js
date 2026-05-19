import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  HardDrive,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    notifications: {
      emailNotifications: true,
      deviceAlerts: true,
      syncNotifications: true,
      weeklyReports: false
    },
    sync: {
      autoSync: true,
      syncInterval: '5',
      maxFileSize: '100',
      compressionEnabled: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '24',
      loginAlerts: true
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load user settings
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/user/settings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(settings[section])
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'sync', label: 'Sync', icon: HardDrive },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'devices', label: 'Devices', icon: Smartphone }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Update your personal information and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={settings.profile.name}
                      onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={settings.profile.currentPassword}
                        onChange={(e) => handleInputChange('profile', 'currentPassword', e.target.value)}
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <Input
                      type="password"
                      value={settings.profile.newPassword}
                      onChange={(e) => handleInputChange('profile', 'newPassword', e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <Input
                      type="password"
                      value={settings.profile.confirmPassword}
                      onChange={(e) => handleInputChange('profile', 'confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('profile')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Device Alerts</h3>
                      <p className="text-sm text-muted-foreground">Get notified when devices connect/disconnect</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.deviceAlerts}
                      onChange={(e) => handleInputChange('notifications', 'deviceAlerts', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Sync Notifications</h3>
                      <p className="text-sm text-muted-foreground">Get notified about sync activities</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.syncNotifications}
                      onChange={(e) => handleInputChange('notifications', 'syncNotifications', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Weekly Reports</h3>
                      <p className="text-sm text-muted-foreground">Receive weekly activity summaries</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.weeklyReports}
                      onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('notifications')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'sync' && (
            <Card>
              <CardHeader>
                <CardTitle>Sync Settings</CardTitle>
                <CardDescription>
                  Configure your file synchronization preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Auto Sync</h3>
                      <p className="text-sm text-muted-foreground">Automatically sync files when changes are detected</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sync.autoSync}
                      onChange={(e) => handleInputChange('sync', 'autoSync', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Sync Interval (minutes)</label>
                    <select
                      value={settings.sync.syncInterval}
                      onChange={(e) => handleInputChange('sync', 'syncInterval', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="1">1 minute</option>
                      <option value="5">5 minutes</option>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
                    <Input
                      type="number"
                      value={settings.sync.maxFileSize}
                      onChange={(e) => handleInputChange('sync', 'maxFileSize', e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Compression</h3>
                      <p className="text-sm text-muted-foreground">Compress files to save bandwidth</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.sync.compressionEnabled}
                      onChange={(e) => handleInputChange('sync', 'compressionEnabled', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('sync')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleInputChange('security', 'twoFactorAuth', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Session Timeout (hours)</label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="1">1 hour</option>
                      <option value="8">8 hours</option>
                      <option value="24">24 hours</option>
                      <option value="168">1 week</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Login Alerts</h3>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleInputChange('security', 'loginAlerts', e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
                  <div className="space-y-2">
                    <Button variant="destructive" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave('security')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'devices' && (
            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>
                  Manage your connected devices and their permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Smartphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Device Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Go to the Devices page to manage your connected devices.
                  </p>
                  <Button onClick={() => window.location.href = '/devices'}>
                    View Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
