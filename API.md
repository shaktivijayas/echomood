# API Documentation

This document provides comprehensive API documentation for the Mood Helper Cloud Sync Dashboard.

## Base URLs

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": null
}
```

Error responses:

```json
{
  "success": false,
  "data": null,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Authentication Endpoints

### Register User
**POST** `/api/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User created successfully"
}
```

### Login User
**POST** `/api/auth/login`

Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Verify Token
**GET** `/api/auth/verify`

Verify JWT token and return user information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Logout
**POST** `/api/auth/logout`

Logout user (client-side token removal).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## File Management Endpoints

### List Files
**GET** `/api/files`

Get paginated list of user files.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search query

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": 1,
        "file_name": "document.pdf",
        "file_path": "/uploads/1/document.pdf",
        "file_size": 2457600,
        "file_type": "application/pdf",
        "created_at": "2024-01-15T10:30:00Z",
        "last_modified": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1,
      "pages": 1
    }
  }
}
```

### Upload File
**POST** `/api/files/upload`

Upload a new file.

**Request Body:** `multipart/form-data`
- `file`: File to upload

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": 1,
      "name": "document.pdf",
      "size": 2457600,
      "type": "application/pdf",
      "path": "/uploads/1/document.pdf"
    }
  },
  "message": "File uploaded successfully"
}
```

### Download File
**GET** `/api/files/download/:id`

Download a file by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:** File binary data

### Get File Info
**GET** `/api/files/:id`

Get file information by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "file": {
      "id": 1,
      "file_name": "document.pdf",
      "file_path": "/uploads/1/document.pdf",
      "file_size": 2457600,
      "file_type": "application/pdf",
      "created_at": "2024-01-15T10:30:00Z",
      "last_modified": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Delete File
**DELETE** `/api/files/:id`

Delete a file by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

## Device Management Endpoints

### List Devices
**GET** `/api/devices`

Get list of user devices.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "devices": [
      {
        "id": 1,
        "device_name": "iPhone 15 Pro",
        "device_type": "mobile",
        "device_id": "iphone-15-pro-001",
        "last_seen": "2024-01-15T10:30:00Z",
        "is_active": true,
        "created_at": "2024-01-10T08:00:00Z"
      }
    ]
  }
}
```

### Register Device
**POST** `/api/devices/register`

Register a new device.

**Request Body:**
```json
{
  "deviceName": "iPhone 15 Pro",
  "deviceType": "mobile",
  "deviceId": "iphone-15-pro-001"
}
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": 1,
      "deviceName": "iPhone 15 Pro",
      "deviceType": "mobile",
      "deviceId": "iphone-15-pro-001"
    }
  },
  "message": "Device registered successfully"
}
```

### Update Device Status
**PUT** `/api/devices/:id/status`

Update device active status.

**Request Body:**
```json
{
  "isActive": true
}
```

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Device activated successfully"
}
```

### Get Device Details
**GET** `/api/devices/:id`

Get device details by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device": {
      "id": 1,
      "device_name": "iPhone 15 Pro",
      "device_type": "mobile",
      "device_id": "iphone-15-pro-001",
      "last_seen": "2024-01-15T10:30:00Z",
      "is_active": true,
      "created_at": "2024-01-10T08:00:00Z"
    }
  }
}
```

### Remove Device
**DELETE** `/api/devices/:id`

Remove a device.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Device removed successfully"
}
```

## Dashboard Endpoints

### Get Dashboard Stats
**GET** `/api/dashboard/stats`

Get dashboard statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "storageUsed": 45.2,
    "storageTotal": 100,
    "devicesConnected": 3,
    "filesSynced": 1247,
    "recentActivity": [
      {
        "id": 1,
        "action": "File Uploaded",
        "description": "File uploaded: document.pdf",
        "metadata": {
          "fileId": 1,
          "fileName": "document.pdf",
          "fileSize": 2457600
        },
        "time": "2 minutes ago"
      }
    ]
  }
}
```

### Get Activity Log
**GET** `/api/dashboard/activity`

Get paginated activity log.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "action": "File Uploaded",
        "description": "File uploaded: document.pdf",
        "metadata": {
          "fileId": 1,
          "fileName": "document.pdf",
          "fileSize": 2457600
        },
        "time": "2 minutes ago",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "pages": 3
    }
  }
}
```

### Get Storage Breakdown
**GET** `/api/dashboard/storage-breakdown`

Get storage usage breakdown by file type.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "breakdown": [
      {
        "category": "Images",
        "fileCount": 150,
        "totalSize": 10737418240,
        "totalSizeGB": 10.0
      },
      {
        "category": "Documents",
        "fileCount": 25,
        "totalSize": 52428800,
        "totalSizeGB": 0.05
      }
    ]
  }
}
```

## Mood AI Endpoints

### Send Mood to AI
**POST** `/gemini`

Send mood text to Gemini AI for empathetic response.

**Request Body:**
```json
{
  "mood": "I feel anxious about my upcoming presentation"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I understand that presentations can feel overwhelming. It's completely normal to feel anxious about speaking in front of others. Take some deep breaths and remember that you've prepared well. You've got this!",
    "user_mood": "I feel anxious about my upcoming presentation",
    "timestamp": "STOP"
  }
}
```

### Health Check
**GET** `/health`

Check service health status.

**Response:**
```json
{
  "status": "OK",
  "service": "gemini-mood-ai",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing JWT token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 413 | Payload Too Large - File too large |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Service temporarily unavailable |

## Rate Limiting

- **Authentication endpoints**: 10 requests per minute per IP
- **File upload**: 5 requests per minute per user
- **General API**: 100 requests per 15 minutes per IP
- **Mood AI**: 20 requests per minute per user

## File Upload Limits

- **Maximum file size**: 100MB
- **Allowed file types**: All (configurable)
- **Maximum files per request**: 1
- **Storage per user**: 100GB (configurable)

## WebSocket Events (Future)

Real-time updates for file sync status and device connections.

### Events
- `file.uploaded` - File upload completed
- `file.synced` - File synced to device
- `device.connected` - Device connected
- `device.disconnected` - Device disconnected
- `sync.progress` - Sync progress update

### Example
```javascript
const ws = new WebSocket('ws://localhost:5000/ws');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data.type, data.payload);
};
```

## SDK Examples

### JavaScript/Node.js
```javascript
const api = {
  baseURL: 'http://localhost:5000',
  token: localStorage.getItem('token'),
  
  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    return response.json();
  },
  
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/api/files/upload', {
      method: 'POST',
      body: formData,
      headers: {}
    });
  }
};
```

### Python
```python
import requests

class MoodHelperAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def upload_file(self, file_path):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            headers = {'Authorization': f'Bearer {self.token}'}
            response = requests.post(
                f'{self.base_url}/api/files/upload',
                files=files,
                headers=headers
            )
        return response.json()
```

---

For more information, see the main [README.md](README.md) file.
