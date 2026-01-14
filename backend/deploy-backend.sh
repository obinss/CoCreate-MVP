#!/bin/bash

# CoCreate Backend Deployment Script for Google Cloud Run
# This script deploys the Django backend to Cloud Run

set -e  # Exit on error

echo "========================================="
echo "CoCreate Backend - Cloud Run Deployment"
echo "========================================="
echo ""

# Configuration
PROJECT_ID="cocreate-27eda"
SERVICE_NAME="cocreate-backend"
REGION="us-central1"
PORT=8080

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: gcloud CLI is not installed"
    echo ""
    echo "Please install gcloud CLI:"
    echo "  https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "Or use Google Cloud Shell (no installation needed):"
    echo "  https://console.cloud.google.com/cloudshell"
    exit 1
fi

echo "✅ gcloud CLI found"
echo ""

# Set project
echo "Setting Google Cloud project: $PROJECT_ID"
gcloud config set project $PROJECT_ID

echo ""
echo "Deploying to Cloud Run..."
echo "  Service: $SERVICE_NAME"
echo "  Region: $REGION"
echo "  Port: $PORT"
echo ""

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
    --source . \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port $PORT \
    --set-env-vars "DJANGO_ENV=production" \
    --set-env-vars "PORT=$PORT" \
    --max-instances 10 \
    --min-instances 0 \
    --memory 512Mi \
    --cpu 1 \
    --timeout 300

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo "Your backend is live at:"
echo "  $SERVICE_URL"
echo ""
echo "Next steps:"
echo "  1. Test API: curl $SERVICE_URL/api/v1/products/"
echo "  2. Update frontend config.js with this URL"
echo "  3. Redeploy frontend to Firebase"
echo ""
