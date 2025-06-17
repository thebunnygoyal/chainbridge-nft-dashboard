# ChainBridge NFT Dashboard - Complete Deployment Guide

## 🚀 Azure Deployment (Recommended - Under $20/month)

### Prerequisites
- Azure CLI installed
- GitHub account with the repository forked
- Node.js 18+ installed locally

### Option 1: Azure Static Web Apps (FREE)

```bash
# Login to Azure
az login

# Create resource group
az group create --name chainbridge-rg --location eastus2

# Create Static Web App (FREE tier)
az staticwebapp create \
  --name chainbridge-app \
  --resource-group chainbridge-rg \
  --source https://github.com/YOUR_USERNAME/chainbridge-nft-dashboard \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "" \
  --output-location ".next" \
  --token $GITHUB_TOKEN

# Cost: $0/month
```

### Option 2: Container Instance B1 ($13/month)

```bash
# Build Docker image
docker build -t chainbridge-app .

# Create container registry
az acr create --resource-group chainbridge-rg \
  --name chainbridgeacr --sku Basic

# Push image
az acr build --registry chainbridgeacr \
  --image chainbridge-app .

# Deploy container
az container create \
  --resource-group chainbridge-rg \
  --name chainbridge-container \
  --image chainbridgeacr.azurecr.io/chainbridge-app:latest \
  --cpu 0.5 --memory 1.5 \
  --ip-address public \
  --ports 80 443 \
  --environment-variables \
    NEXT_PUBLIC_COVALENT_API_KEY=$COVALENT_KEY \
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$WC_ID

# Cost: ~$13/month
```

### Option 3: Function App ($0-5/month)

```bash
# Create storage account
az storage account create \
  --name chainbridgestorage \
  --location eastus2 \
  --resource-group chainbridge-rg \
  --sku Standard_LRS

# Create function app
az functionapp create \
  --resource-group chainbridge-rg \
  --consumption-plan-location eastus2 \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name chainbridge-functions \
  --storage-account chainbridgestorage

# Deploy
func azure functionapp publish chainbridge-functions

# Cost: $0-5/month based on usage
```

## 💰 Cost Monitoring

```bash
# Check current usage
az consumption usage list \
  --start-date 2025-06-01 \
  --end-date 2025-06-30

# Set up budget alert
az consumption budget create \
  --budget-name chainbridge-budget \
  --amount 20 \
  --time-grain monthly \
  --resource-group chainbridge-rg
```

## 🌐 Domain Setup

### Recommended Domains (Monthly Cost)
- chainbridge.xyz - $1/month
- bridgenft.io - $3/month  
- nftbridge.app - $2/month
- crosschain.games - $2/month

### DNS Configuration
```bash
# After purchasing domain
# Add A record pointing to Azure IP
# Add CNAME for www subdomain
```

## 🔧 Environment Variables

```bash
# Required
NEXT_PUBLIC_COVALENT_API_KEY=cqt_rQ8... # Get from covalenthq.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=abc123... # Get from cloud.walletconnect.com

# Optional
NEXT_PUBLIC_ALCHEMY_API_KEY=alch_... # For additional chain support
OPENAI_API_KEY=sk-... # For AI features
```

## 📦 n8n Integration (Your Premium Server)

```javascript
// n8n Webhook for Analytics
const webhookUrl = 'https://n8n-app.livelypebble-c844ad2d.eastus2.azurecontainerapps.io/webhook/chainbridge-analytics'

// Send user events
fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'bridge_analysis',
    user: address,
    chains: selectedChains,
    timestamp: Date.now()
  })
})
```

## 🚀 Launch Checklist

- [ ] Fork repository
- [ ] Set up API keys
- [ ] Deploy to Azure (choose option)
- [ ] Configure domain (optional)
- [ ] Test wallet connections
- [ ] Verify multi-chain data loading
- [ ] Test AI bridge optimizer
- [ ] Monitor costs (stay under $20)
- [ ] Submit to grant programs

## 📊 Performance Optimization

### Next.js Optimizations
```javascript
// next.config.js additions
module.exports = {
  images: {
    domains: ['...'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### Caching Strategy
```javascript
// Enable ISR for static pages
export async function getStaticProps() {
  return {
    props: { ... },
    revalidate: 3600 // 1 hour
  }
}
```

## 🔒 Security Hardening

1. **API Key Protection**
   - Never commit .env files
   - Use Azure Key Vault for production
   - Implement rate limiting

2. **CORS Configuration**
   ```javascript
   // api/cors.ts
   const allowedOrigins = [
     'https://chainbridge.xyz',
     'https://www.chainbridge.xyz'
   ]
   ```

3. **Content Security Policy**
   ```javascript
   // next.config.js
   const securityHeaders = [{
     key: 'Content-Security-Policy',
     value: "default-src 'self'; script-src 'self' 'unsafe-eval';"
   }]
   ```

## 🔄 Continuous Deployment

### GitHub Actions (Auto-deploy on push)
```yaml
# .github/workflows/azure-deploy.yml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: 'upload'
          app_location: '/'
          output_location: '.next'
```

## 🎆 Scaling Strategy

### When to Scale (Monthly Costs)
1. **0-1K users**: Static Web App (FREE)
2. **1K-10K users**: Container B1 ($13/mo)
3. **10K-50K users**: Container B2 ($26/mo) - Requires approval
4. **50K+ users**: App Service Plan ($50+/mo) - Grant funded

### Monitoring Triggers
- Response time > 3s
- Error rate > 1%
- Monthly cost approaching $20
- Grant funding secured

---

**💰 Total Monthly Cost**: $0-18 (domain + hosting)
**⏱ Deployment Time**: 15 minutes
**🚀 Time to Live**: Immediate after deployment
