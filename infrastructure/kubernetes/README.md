# Kubernetes Manifests

This directory contains Kubernetes manifests for production deployment.

## Contents

- Deployment configurations
- Service definitions
- Ingress rules
- ConfigMaps and Secrets
- Persistent Volume Claims

## Deployment

```bash
# Apply all manifests
kubectl apply -f .

# Check deployment status
kubectl get pods
kubectl get services
```

## Organization

- `backend/` - Backend service manifests
- `frontend/` - Frontend service manifests
- `databases/` - Database configurations
- `ingress/` - Ingress and routing rules
