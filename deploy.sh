#!/bin/bash

# Oak & Ember - Manual Deployment Script
# This script handles SSH agent setup and deploys to GitHub Pages

echo "🚀 Starting Oak & Ember deployment..."

# Start SSH agent if not running
if [ -z "$SSH_AUTH_SOCK" ]; then
    echo "🔑 Starting SSH agent..."
    eval "$(ssh-agent -s)"
fi

# Add SSH key to agent (you'll only need to enter passphrase once per session)
echo "🔐 Adding SSH key to agent..."
ssh-add -k ~/.ssh/id_rsa 2>/dev/null || ssh-add ~/.ssh/id_ed25519 2>/dev/null || echo "No SSH key found, using HTTPS"

# Build and deploy
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📤 Deploying to GitHub Pages..."
    npm run deploy

    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🌐 Your site will be available at: https://tsri-code.github.io/cafe-site/"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi