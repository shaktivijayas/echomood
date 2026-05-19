# Mood Helper - Cloud Sync Dashboard with AI

A comprehensive cross-platform cloud synchronization service with integrated Gemini AI mood-response feature. Built with React, Node.js, Flask, and deployed using Docker and Kubernetes.

## 🌟 Features

### Core Functionality
- **User Authentication**: JWT-based login/signup system
- **File Management**: Upload, download, and sync files across devices
- **Device Management**: Register and manage multiple devices
- **Activity Monitoring**: Track sync activities and device events
- **Storage Analytics**: Monitor storage usage and file breakdowns

### AI Integration
- **Mood AI**: Chat with Gemini AI to express feelings and get empathetic responses
- **Quick Mood Selection**: Pre-defined mood buttons for easy expression
- **Conversation History**: Persistent chat interface with AI

### Technical Features
- **Modern UI**: Built with React + TailwindCSS + shadcn/ui
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live sync status and activity monitoring
- **Secure**: JWT authentication, input validation, and security headers
- **Scalable**: Microservices architecture with Docker and Kubernetes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Flask AI      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (Gemini)      │
│   Port: 3000    │    │   Port: 5000    │    │   Port: 5001    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │   Database      │
         │              │   (MySQL)       │
         │              │   Port: 3306    │
         │              └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Nextcloud     │
│   (File Storage)│
│   Port: 8080    │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- MySQL 8.0+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mood-helper
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Get your Gemini API key from Google AI Studio
GEMINI_API_KEY=your-gemini-api-key-here

# Change JWT secret for production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..

# Install Flask dependencies
cd flask-gemini && pip install -r requirements.txt && cd ..
```

### 4. Start with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Flask AI**: http://localhost:5001
- **Nextcloud**: http://localhost:8080

## 🛠️ Development

### Local Development
```bash
# Start all services in development mode
npm run dev

# Or start individual services
npm run frontend:dev  # React dev server
npm run backend:dev   # Node.js with nodemon
npm run flask:dev     # Flask development server
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - User logout

#### Files
- `GET /api/files` - List user files
- `POST /api/files/upload` - Upload file
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file

#### Devices
- `GET /api/devices` - List user devices
- `POST /api/devices/register` - Register device
- `PUT /api/devices/:id/status` - Update device status
- `DELETE /api/devices/:id` - Remove device

#### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get activity log
- `GET /api/dashboard/storage-breakdown` - Get storage breakdown

#### Mood AI
- `POST /gemini` - Send mood to Gemini AI
- `GET /health` - Health check

## 🐳 Docker Deployment

### Build Images
```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend
docker-compose build flask-gemini
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export FLASK_ENV=production

# Start services
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Ingress controller (nginx recommended)

### Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -f k8s/

# Or use kustomize
kubectl apply -k k8s/

# Check deployment status
kubectl get pods -n mood-helper
kubectl get services -n mood-helper
```

### Access the Application
```bash
# Port forward for local access
kubectl port-forward -n mood-helper service/frontend-service 3000:3000
kubectl port-forward -n mood-helper service/backend-service 5000:5000
kubectl port-forward -n mood-helper service/flask-gemini-service 5001:5001

# Or configure ingress for external access
kubectl get ingress -n mood-helper
```

## 🔧 Configuration

### Database Setup
The application automatically creates the required database tables on first run. For manual setup:

```sql
CREATE DATABASE mood_helper;
CREATE USER 'mood_helper'@'%' IDENTIFIED BY 'mood_helper_password';
GRANT ALL PRIVILEGES ON mood_helper.* TO 'mood_helper'@'%';
FLUSH PRIVILEGES;
```

### Gemini AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new project
3. Generate an API key
4. Add the key to your `.env` file

### Nextcloud Integration
1. Access Nextcloud at http://localhost:8080
2. Login with admin/admin
3. Configure the API credentials in your `.env` file

## 📱 Usage

### Getting Started
1. **Register**: Create a new account or login
2. **Add Device**: Register your first device
3. **Upload Files**: Start syncing files across devices
4. **Mood AI**: Share your feelings with the AI assistant

### File Management
- Upload files by clicking the upload button
- View files in grid or list mode
- Search and filter files
- Download or delete files as needed

### Device Management
- Register new devices with unique IDs
- Monitor device connection status
- Enable/disable device sync
- Remove old devices

### Mood AI
- Express your feelings in natural language
- Use quick mood buttons for common emotions
- Get empathetic AI responses
- Continue conversations with context

## 🔒 Security

### Authentication
- JWT tokens with 7-day expiration
- Password hashing with bcrypt
- Token verification on protected routes

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers
- CORS configuration

### File Security
- User-specific file isolation
- File type validation
- Size limits and compression
- Secure file serving

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database status
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Gemini AI Not Working
```bash
# Check API key
echo $GEMINI_API_KEY

# Test Flask service
curl http://localhost:5001/health
```

#### File Upload Issues
```bash
# Check upload directory permissions
ls -la backend/uploads/

# Check backend logs
docker-compose logs backend
```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs flask-gemini
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Express.js](https://expressjs.com/) - Backend framework
- [Flask](https://flask.palletsprojects.com/) - Python web framework
- [Google Gemini](https://ai.google.dev/) - AI language model
- [Nextcloud](https://nextcloud.com/) - File storage platform

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Made with ❤️ for better cloud sync and mental wellness**
