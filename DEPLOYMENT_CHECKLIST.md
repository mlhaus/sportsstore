# Vercel Deployment Checklist ✅

## Fixes Applied ✓
- [x] Updated `vercel.json` to include templates and products.json
- [x] Created `.vercelignore` to protect critical files
- [x] Fixed file path resolution in `core.ts` using `process.cwd()`
- [x] Created `production.server.config.json` with safe defaults
- [x] All changes committed to git

## Before Redeploying to Vercel

### Step 1: Verify Environment Variables
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables (if not already set):

```
MONGODB_URI = [Your MongoDB Atlas Connection String]
GOOGLE_CLIENT_ID = [Your Google OAuth Client ID]
GOOGLE_CLIENT_SECRET = [Your Google OAuth Secret]
COOKIE_SECRET = [Your Session Secret]
NODE_ENV = production
```

**Getting Your MongoDB URI:**
1. Go to MongoDB Atlas → Your Cluster → Connect
2. Click "Drivers"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Paste into MONGODB_URI in Vercel

### Step 2: Push to Repository
```bash
git push origin main
```

Vercel will automatically redeploy on push if you have automatic deployments enabled.

### Step 3: Monitor Deployment

1. Go to Vercel Dashboard → Deployments
2. Click on the latest deployment
3. Check "Runtime Logs" for:
    - ✓ "Connected to MongoDB"
    - ✓ No "ENOENT" errors
    - ✓ No template lookup errors

### Step 4: Test the Application

1. Visit your Vercel deployment URL
2. Test these features:
    - Browse products (catalog loads)
    - Add items to cart
    - Try to checkout (tests MongoDB writes)
    - Admin area (tests authentication)

## Common Errors & Fixes

### ❌ "Failed to lookup view 'not_found'"
**Solution**: Verify `vercel.json` has `templates/**` in includeFiles, then redeploy

### ❌ "ENOENT: products.json not found"
**Solution**: Verify `.vercelignore` protects the file, check it's committed to git

### ❌ "Failed to connect to MongoDB"
**Solution**:
- Check MONGODB_URI is set in Vercel env vars
- Verify connection string is correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0

### ❌ Cold Start Timeout
**Solution**: First request after deployment takes 5-10s. This is normal for Vercel.

## Files Modified

```
.vercelignore                     (NEW - protects files from being ignored)
production.server.config.json     (NEW - production settings)
vercel.json                       (MODIFIED - includes templates & products.json)
src/data/orm/core.ts            (MODIFIED - fixed path resolution)
```

## Rollback If Needed

If something goes wrong:
```bash
vercel rollback
```

This reverts to the previous deployment.

## Success Indicators

After deployment, you should see:
- ✓ Application loads without errors
- ✓ MongoDB connection established
- ✓ Templates render correctly
- ✓ Products display in catalog
- ✓ Cart functionality works
- ✓ Database operations succeed

## Questions?

Refer to `VERCEL_DEPLOYMENT_GUIDE.md` in session files for detailed troubleshooting.
