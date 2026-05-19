import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { 
  HardDrive, 
  Smartphone, 
  Activity, 
  Upload, 
  Download, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    storageUsed: 0,
    storageTotal: 100,
    devicesConnected: 0,
    filesSynced: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Fetch dashboard data
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {
        // Mock data for development
        setStats({
          storageUsed: 45,
          storageTotal: 100,
          devicesConnected: 3,
          filesSynced: 1247,
          recentActivity: [
            { id: 1, action: 'File uploaded', file: 'document.pdf', time: '2 minutes ago' },
            { id: 2, action: 'Device connected', device: 'iPhone 15', time: '1 hour ago' },
            { id: 3, action: 'File synced', file: 'photo.jpg', time: '3 hours ago' },
            { id: 4, action: 'Device disconnected', device: 'MacBook Pro', time: '1 day ago' },
          ]
        });
      });
  }, []);

  const storagePercentage = (stats.storageUsed / stats.storageTotal) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your cloud sync.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageUsed}GB</div>
            <p className="text-xs text-muted-foreground">
              of {stats.storageTotal}GB used
            </p>
            <Progress value={storagePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices Connected</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.devicesConnected}</div>
            <p className="text-xs text-muted-foreground">
              active devices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Synced</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.filesSynced?.toLocaleString() || '0'}</div>
            <p className="text-xs text-muted-foreground">
              total files
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">
              all devices synced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest sync activities and device events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats.recentActivity || []).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.action.includes('upload') ? (
                      <Upload className="h-4 w-4 text-blue-600" />
                    ) : activity.action.includes('download') ? (
                      <Download className="h-4 w-4 text-green-600" />
                    ) : activity.action.includes('device') ? (
                      <Smartphone className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Activity className="h-4 w-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.file || activity.device}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Upload Files</p>
                    <p className="text-sm text-muted-foreground">Add new files to sync</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Manage Devices</p>
                    <p className="text-sm text-muted-foreground">View connected devices</p>
                  </div>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Activity</p>
                    <p className="text-sm text-muted-foreground">Check sync history</p>
                  </div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
