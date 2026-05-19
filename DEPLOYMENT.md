# Deployment Guide

This guide covers different deployment options for the Mood Helper Cloud Sync Dashboard.

## 🐳 Docker Compose Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 10GB disk space

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd mood-helper

# Copy environment file
cp env.example .env

# Edit environment variables
nano .env

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### Environment Configuration
```env
# Required: Get from Google AI Studio
GEMINI_API_KEY=your-gemini-api-key-here

# Required: Change for production
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database (defaults work for development)
DB_HOST=db
DB_PORT=3306
DB_NAME=mood_helper
DB_USER=mood_helper
DB_PASSWORD=mood_helper_password

# Nextcloud (defaults work for development)
NEXTCLOUD_URL=http://nextcloud:8080
NEXTCLOUD_USERNAME=admin
NEXTCLOUD_PASSWORD=admin
```

### Production Deployment
```bash
# Set production environment
export NODE_ENV=production
export FLASK_ENV=production

# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Enable SSL with Let's Encrypt
docker-compose -f docker-compose.prod.yml -f docker-compose.ssl.yml up -d
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes 1.20+
- kubectl configured
- Ingress controller (nginx recommended)
- 8GB RAM minimum
- 20GB disk space

### Cluster Requirements
```yaml
# Minimum resource requirements
resources:
  requests:
    memory: "4Gi"
    cpu: "2"
  limits:
    memory: "8Gi"
    cpu: "4"
```

### Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace mood-helper

# Apply secrets (update with your values)
kubectl apply -f k8s/secret.yaml

# Apply configuration
kubectl apply -f k8s/configmap.yaml

# Deploy database
kubectl apply -f k8s/mysql.yaml

# Deploy Redis
kubectl apply -f k8s/redis.yaml

# Deploy backend
kubectl apply -f k8s/backend.yaml

# Deploy Flask AI service
kubectl apply -f k8s/flask-gemini.yaml

# Deploy frontend
kubectl apply -f k8s/frontend.yaml

# Deploy ingress
kubectl apply -f k8s/ingress.yaml
```

### Using Kustomize
```bash
# Deploy everything at once
kubectl apply -k k8s/

# Check deployment status
kubectl get all -n mood-helper

# View logs
kubectl logs -n mood-helper deployment/backend-deployment
kubectl logs -n mood-helper deployment/flask-gemini-deployment
kubectl logs -n mood-helper deployment/frontend-deployment
```

### Update Secrets
```bash
# Update JWT secret
kubectl create secret generic mood-helper-secrets \
  --from-literal=JWT_SECRET=your-new-jwt-secret \
  --dry-run=client -o yaml | kubectl apply -f -

# Update Gemini API key
kubectl create secret generic mood-helper-secrets \
  --from-literal=GEMINI_API_KEY=your-gemini-api-key \
  --dry-run=client -o yaml | kubectl apply -f -
```

## 🌐 Cloud Provider Deployment

### AWS EKS
```bash
# Create EKS cluster
eksctl create cluster --name mood-helper --region us-west-2 --nodes 3

# Deploy application
kubectl apply -k k8s/

# Configure load balancer
kubectl apply -f k8s/aws-loadbalancer.yaml
```

### Google GKE
```bash
# Create GKE cluster
gcloud container clusters create mood-helper \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-standard-2

# Deploy application
kubectl apply -k k8s/

# Configure ingress
kubectl apply -f k8s/gke-ingress.yaml
```

### Azure AKS
```bash
# Create AKS cluster
az aks create \
  --resource-group mood-helper-rg \
  --name mood-helper-cluster \
  --node-count 3 \
  --node-vm-size Standard_D2s_v3

# Deploy application
kubectl apply -k k8s/

# Configure ingress
kubectl apply -f k8s/azure-ingress.yaml
```

## 🔒 SSL/TLS Configuration

### Let's Encrypt with Cert-Manager
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f k8s/cert-manager-issuer.yaml

# Update ingress with SSL
kubectl apply -f k8s/ingress-ssl.yaml
```

### Custom SSL Certificate
```bash
# Create TLS secret
kubectl create secret tls mood-helper-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem \
  -n mood-helper

# Apply SSL ingress
kubectl apply -f k8s/ingress-ssl.yaml
```

## 📊 Monitoring and Logging

### Prometheus + Grafana
```bash
# Install Prometheus
kubectl apply -f k8s/monitoring/prometheus.yaml

# Install Grafana
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana
kubectl port-forward -n monitoring service/grafana 3000:3000
```

### ELK Stack
```bash
# Install Elasticsearch
kubectl apply -f k8s/logging/elasticsearch.yaml

# Install Logstash
kubectl apply -f k8s/logging/logstash.yaml

# Install Kibana
kubectl apply -f k8s/logging/kibana.yaml
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to K8s
        run: |
          kubectl apply -k k8s/
```

### GitLab CI
```yaml
# .gitlab-ci.yml
deploy:
  stage: deploy
  script:
    - kubectl apply -k k8s/
  only:
    - main
```

## 🚨 Troubleshooting

### Common Issues

#### Pods Not Starting
```bash
# Check pod status
kubectl get pods -n mood-helper

# Check pod logs
kubectl logs -n mood-helper <pod-name>

# Check pod events
kubectl describe pod -n mood-helper <pod-name>
```

#### Database Connection Issues
```bash
# Check database pod
kubectl get pods -n mood-helper | grep mysql

# Check database logs
kubectl logs -n mood-helper deployment/mysql-deployment

# Test database connection
kubectl exec -it -n mood-helper deployment/mysql-deployment -- mysql -u root -p
```

#### Service Discovery Issues
```bash
# Check services
kubectl get services -n mood-helper

# Check endpoints
kubectl get endpoints -n mood-helper

# Test service connectivity
kubectl run test-pod --image=busybox -it --rm -- nslookup backend-service.mood-helper.svc.cluster.local
```

#### Ingress Issues
```bash
# Check ingress
kubectl get ingress -n mood-helper

# Check ingress controller
kubectl get pods -n ingress-nginx

# Test ingress
curl -H "Host: mood-helper.local" http://localhost
```

### Performance Optimization

#### Resource Limits
```yaml
# Update resource limits in deployments
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

#### Horizontal Pod Autoscaling
```bash
# Create HPA
kubectl autoscale deployment backend-deployment \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n mood-helper
```

#### Database Optimization
```sql
-- Optimize MySQL settings
SET GLOBAL innodb_buffer_pool_size = 1G;
SET GLOBAL max_connections = 200;
SET GLOBAL query_cache_size = 64M;
```

## 📈 Scaling

### Horizontal Scaling
```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=5 -n mood-helper

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n mood-helper

# Scale Flask AI
kubectl scale deployment flask-gemini-deployment --replicas=3 -n mood-helper
```

### Vertical Scaling
```bash
# Update resource limits
kubectl patch deployment backend-deployment \
  -p '{"spec":{"template":{"spec":{"containers":[{"name":"backend","resources":{"limits":{"memory":"2Gi","cpu":"1000m"}}}]}}}}' \
  -n mood-helper
```

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
kubectl exec -n mood-helper deployment/mysql-deployment -- mysqldump -u root -p mood_helper > backup.sql

# Restore backup
kubectl exec -i -n mood-helper deployment/mysql-deployment -- mysql -u root -p mood_helper < backup.sql
```

### File Storage Backup
```bash
# Backup uploads
kubectl exec -n mood-helper deployment/backend-deployment -- tar -czf /tmp/uploads.tar.gz /app/uploads

# Copy backup
kubectl cp mood-helper/backend-deployment-xxx:/tmp/uploads.tar.gz ./uploads-backup.tar.gz
```

## 📋 Maintenance

### Rolling Updates
```bash
# Update backend
kubectl set image deployment/backend-deployment backend=mood-helper-backend:v2.0.0 -n mood-helper

# Update frontend
kubectl set image deployment/frontend-deployment frontend=mood-helper-frontend:v2.0.0 -n mood-helper
```

### Health Checks
```bash
# Check application health
curl http://localhost:3000/health
curl http://localhost:5000/health
curl http://localhost:5001/health

# Check Kubernetes health
kubectl get pods -n mood-helper
kubectl top pods -n mood-helper
```

---

For more detailed information, see the main [README.md](README.md) file.
