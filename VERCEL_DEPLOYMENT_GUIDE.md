# Vercel Deployment Guide

## Issues Fixed

This document addresses the errors you experienced after deploying to Vercel:
1. ❌ `Error: Failed to lookup view "not_found" in views directory "templates"`
2. ❌ `Error: ENOENT: no such file or directory, open 'products.json'`
3. ❌ `Failed to connect to MongoDB`

## Root Causes

### 1. Template Files Not Deployed
- **Problem**: Vercel doesn't include the `templates` directory by default
- **Solution**: Updated `vercel.json` to include `templates/**` in `includeFiles`

### 2. Products.json Path Not Resolved
- **Problem**: Relative paths don't work correctly in Vercel serverless environment
- **Solution**: Updated `core.ts` to use `resolve(process.cwd(), config.seed_file)`

### 3. MongoDB Connection Not Configured
- **Problem**: Environment variables must be set in Vercel dashboard
- **Solution**: Added environment variable reference in `vercel.json`

## Deployment Configuration

### Updated vercel.json
```json
{
  "version": 2,
  "builds": [{
    "src": "dist/server.js",
    "use": "@vercel/node",
    "config": {
      "includeFiles": [
        "server.config.json",
        "products.json",
        "templates/**"
      ]
    }
  }],
  "rewrites": [{
    "source": "/(.*)",
    "destination": "/dist/server.js"
  }],
  "env": {
    "MONGODB_URI": "@mongodb_uri"
  }
}
```

### Production Configuration
- Created `production.server.config.json` with `reset_db: false` to prevent data loss
- Disabled logging in production for better performance

### .vercelignore
Created to ensure important files are included:
```
!templates/**
!products.json
!server.config.json
!*.db
```

## Step-by-Step Deployment Instructions

### 1. Set Environment Variables in Vercel Dashboard

Go to your Vercel project settings:

1. Navigate to **Settings** → **Environment Variables**
2. Add these variables:

| Variable Name | Value | Type |
|---|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string | Plain Text |
| `GOOGLE_CLIENT_ID` | From Google OAuth | Plain Text |
| `GOOGLE_CLIENT_SECRET` | From Google OAuth | Encrypted |
| `COOKIE_SECRET` | Your session cookie secret | Encrypted |
| `NODE_ENV` | `production` | Plain Text |

### 2. Get Your MongoDB URI

From MongoDB Atlas:
1. Click **Connect** on your cluster
2. Select **Drivers**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Add to Vercel as `MONGODB_URI`

### 3. Deploy

```bash
# Commit changes
git add -A
git commit -m "Fix Vercel deployment issues"

# Push to your repository
git push origin main

# Vercel automatically deploys on push if connected
```

### 4. Monitor Logs

In Vercel dashboard:
1. Go to **Deployments** → **Recent Deployment**
2. Click **Runtime Logs** to see real-time output
3. Check for connection success: `Connected to MongoDB`

## Configuration Priority

The application loads config in this order:

1. `server.config.json` (base configuration)
2. `{environment}.server.config.json` (overrides for that environment)
    - `development.server.config.json` (dev)
    - `production.server.config.json` (production)

On Vercel (production):
- Uses `production.server.config.json`
- `reset_db: false` prevents clearing production data
- Logging disabled for cleaner logs

## Common Issues & Solutions

### Template Still Not Found

**Problem**: `Failed to lookup view "not_found"`

**Solution**:
- Verify `templates/**` is in `vercel.json` `includeFiles`
- Check that template files exist locally
- Redeploy after updating `vercel.json`

### MongoDB Connection Fails

**Problem**: `Failed to connect to MongoDB: Error: ...`

**Debugging**:
```bash
# Check if MONGODB_URI is set
vercel env ls

# Redeploy to apply new environment variables
vercel deploy --prod
```

**Solution**:
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas (should include 0.0.0.0/0 or Vercel's IPs)
- Test connection string locally first

### Products.json Not Found

**Problem**: `ENOENT: no such file or directory, open 'products.json'`

**Solution**:
- Verify `products.json` exists in project root
- Check `includeFiles` in `vercel.json` includes `products.json`
- Verify file is committed to git and pushed

## Production Best Practices

### Database Settings

On production (Vercel), the config automatically sets:
```json
{
  "catalog": {
    "orm_repo": {
      "logging": false,
      "reset_db": false,  // IMPORTANT: Never reset production data!
      "seed_file": "products.json"
    }
  }
}
```

⚠️ **NEVER set `reset_db: true` in production!**

### Environment-Specific Logging

- **Development**: Verbose logging enabled
- **Production**: Logging disabled for performance

## Vercel-Specific Gotchas

1. **Working Directory**: Always use `process.cwd()` for relative paths
2. **Cold Starts**: First request may take 5-10s while function initializes
3. **File System**: Only `/tmp` is writable (but we use MongoDB)
4. **Env Variables**: Changes require redeployment
5. **Timeout**: Default 60s, increase if needed in `vercel.json`

## Monitoring Your Deployment

### Check Status
```bash
vercel status
```

### View Logs
```bash
vercel logs [deployment-url]
```

### List Environment Variables
```bash
vercel env ls
```

## Rollback

If something goes wrong:
```bash
# Revert to previous deployment
vercel rollback
```

## Support

If you still encounter issues:

1. Check Vercel Runtime Logs (most detailed)
2. Verify environment variables are set
3. Test locally: `npm run build && npm start`
4. Check MongoDB Atlas connection status
5. Review application logs: `vercel logs`
