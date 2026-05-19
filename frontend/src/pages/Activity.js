import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Activity, 
  Upload, 
  Download, 
  Smartphone, 
  File, 
  Folder,
  Search,
  Filter,
  Clock,
  User,
  Calendar,
  RefreshCw
} from 'lucide-react';

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivities();
  }, [currentPage, filterType]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard/activity?page=${currentPage}&limit=20`);
      const data = await response.json();
      setActivities(data.activities || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Mock data for development
      setActivities([
        {
          id: 1,
          action: 'File Uploaded',
          description: 'File uploaded: project-report.pdf',
          metadata: { fileId: 1, fileName: 'project-report.pdf', fileSize: 2457600 },
          time: '2 minutes ago',
          timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          action: 'Device Connected',
          description: 'Device registered: iPhone 15 Pro',
          metadata: { deviceId: 1, deviceName: 'iPhone 15 Pro', deviceType: 'mobile' },
          time: '1 hour ago',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          action: 'File Synced',
          description: 'File synced: vacation-photo.jpg',
          metadata: { fileId: 2, fileName: 'vacation-photo.jpg', fileSize: 1800000 },
          time: '3 hours ago',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          action: 'Device Disconnected',
          description: 'Device disconnected: MacBook Pro',
          metadata: { deviceId: 2, deviceName: 'MacBook Pro', deviceType: 'laptop' },
          time: '1 day ago',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          action: 'File Deleted',
          description: 'File deleted: old-document.docx',
          metadata: { fileId: 3, fileName: 'old-document.docx', fileSize: 512000 },
          time: '2 days ago',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('upload')) {
      return <Upload className="h-4 w-4 text-blue-600" />;
    } else if (actionLower.includes('download')) {
      return <Download className="h-4 w-4 text-green-600" />;
    } else if (actionLower.includes('device')) {
      return <Smartphone className="h-4 w-4 text-purple-600" />;
    } else if (actionLower.includes('file')) {
      return <File className="h-4 w-4 text-orange-600" />;
    } else if (actionLower.includes('folder')) {
      return <Folder className="h-4 w-4 text-indigo-600" />;
    } else {
      return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (action) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('upload') || actionLower.includes('sync')) {
      return 'text-blue-600 bg-blue-50';
    } else if (actionLower.includes('download')) {
      return 'text-green-600 bg-green-50';
    } else if (actionLower.includes('device')) {
      return 'text-purple-600 bg-purple-50';
    } else if (actionLower.includes('delete')) {
      return 'text-red-600 bg-red-50';
    } else {
      return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredActivities = (activities || []).filter(activity => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    
    const actionLower = activity.action.toLowerCase();
    if (filterType === 'files') {
      return matchesSearch && (actionLower.includes('file') || actionLower.includes('upload') || actionLower.includes('download'));
    } else if (filterType === 'devices') {
      return matchesSearch && actionLower.includes('device');
    } else if (filterType === 'sync') {
      return matchesSearch && actionLower.includes('sync');
    }
    
    return matchesSearch;
  });

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground">
            Monitor your sync activities and device events
          </p>
        </div>
        <Button variant="outline" onClick={fetchActivities} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Activities</option>
              <option value="files">Files</option>
              <option value="devices">Devices</option>
              <option value="sync">Sync</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activity List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading activities...</span>
            </CardContent>
          </Card>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getActivityColor(activity.action)}`}>
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        {activity.action}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    {activity.metadata && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activity.metadata.fileName && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <File className="h-3 w-3 mr-1" />
                            {activity.metadata.fileName}
                          </span>
                        )}
                        {activity.metadata.fileSize && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {formatFileSize(activity.metadata.fileSize)}
                          </span>
                        )}
                        {activity.metadata.deviceName && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            <Smartphone className="h-3 w-3 mr-1" />
                            {activity.metadata.deviceName}
                          </span>
                        )}
                        {activity.metadata.deviceType && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                            {activity.metadata.deviceType}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No activities found</h3>
              <p className="text-muted-foreground text-center">
                {searchQuery || filterType !== 'all' 
                  ? 'No activities match your current filters.' 
                  : 'Your activity log will appear here as you use the service.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
