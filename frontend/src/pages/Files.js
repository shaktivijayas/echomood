import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Upload, 
  Download, 
  Folder, 
  File, 
  Search, 
  MoreVertical,
  Grid,
  List,
  SortAsc,
  Filter
} from 'lucide-react';

export default function Files() {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Fetch files from API
    fetch('/api/files')
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(() => {
        // Mock data for development
        setFiles([
          { id: 1, name: 'Documents', type: 'folder', size: null, modified: '2024-01-15', synced: true },
          { id: 2, name: 'Photos', type: 'folder', size: null, modified: '2024-01-14', synced: true },
          { id: 3, name: 'project-report.pdf', type: 'file', size: '2.4 MB', modified: '2024-01-15', synced: true },
          { id: 4, name: 'vacation-photo.jpg', type: 'file', size: '1.8 MB', modified: '2024-01-14', synced: false },
          { id: 5, name: 'presentation.pptx', type: 'file', size: '5.2 MB', modified: '2024-01-13', synced: true },
          { id: 6, name: 'notes.txt', type: 'file', size: '12 KB', modified: '2024-01-12', synced: true },
        ]);
      });
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // Handle file upload logic
    console.log('Uploading files:', files);
  };

  const handleFileDownload = (file) => {
    // Handle file download logic
    console.log('Downloading file:', file);
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">
            Manage your synchronized files and folders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button asChild>
              <span>Select Files</span>
            </Button>
          </label>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
        {(filteredFiles || []).map((file) => (
          <Card
            key={file.id}
            className={`cursor-pointer transition-colors hover:bg-accent ${
              selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => toggleFileSelection(file.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {file.type === 'folder' ? (
                    <Folder className="h-8 w-8 text-blue-500" />
                  ) : (
                    <File className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{file.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {file.size || 'Folder'} • {file.modified}
                  </p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      file.synced ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-xs text-muted-foreground">
                      {file.synced ? 'Synced' : 'Syncing...'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle file actions
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchQuery ? 'No files match your search criteria.' : 'Upload some files to get started.'}
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
