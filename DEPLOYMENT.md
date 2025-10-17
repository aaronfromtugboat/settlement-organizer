# Settlement Organizer - Deployment Guide

## Quick Start

This guide walks you through deploying the Settlement Organizer app to Cloudflare Pages with GitHub integration.

## Prerequisites

✅ Node.js 18+ installed  
✅ Cloudflare account (free tier works)  
✅ GitHub account  
✅ Wrangler CLI: `npm install -g wrangler`

## Step-by-Step Deployment

### 1. Create GitHub Repository

```bash
cd /Users/aaronmooney/Development/Settlement_Organizer

# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Settlement Organizer app"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/settlement-organizer.git
git branch -M main
git push -u origin main
```

### 2. Set Up Cloudflare D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create D1 database
wrangler d1 create settlement-organizer-db
```

**Copy the database ID from the output** and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "settlement-organizer-db"
database_id = "YOUR_DATABASE_ID_HERE"  # ← Replace this
```

Run migrations:

```bash
# Local development
wrangler d1 execute settlement-organizer-db --file=./migrations/001_init_schema.sql

# Production (after Pages setup)
wrangler d1 execute settlement-organizer-db --remote --file=./migrations/001_init_schema.sql
```

### 3. Create Cloudflare R2 Bucket

```bash
wrangler r2 bucket create settlement-organizer-documents
```

### 4. Deploy to Cloudflare Pages

#### Option A: Via Cloudflare Dashboard (Recommended)

1. **Log in to Cloudflare Dashboard**: https://dash.cloudflare.com
2. **Navigate to Pages**: Workers & Pages → Create application → Pages → Connect to Git
3. **Select Repository**: Choose `settlement-organizer` from your GitHub repos
4. **Configure Build Settings**:
   - **Project name**: `settlement-organizer`
   - **Production branch**: `main`
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)

5. **Save and Deploy** (initial deployment will complete)

6. **Add Bindings** (Critical!):
   - Go to your Pages project → **Settings** → **Functions** → **Bindings**
   
   **D1 Database Binding:**
   - Click **Add binding** → **D1 database**
   - Variable name: `DB`
   - D1 database: Select `settlement-organizer-db`
   
   **R2 Bucket Binding:**
   - Click **Add binding** → **R2 bucket**
   - Variable name: `DOCUMENTS`
   - R2 bucket: Select `settlement-organizer-documents`

7. **Redeploy** after adding bindings:
   - Go to **Deployments** → **Retry deployment** on the latest deployment

#### Option B: Via Wrangler CLI

```bash
# Deploy to Pages
wrangler pages deploy dist --project-name=settlement-organizer

# Note: You'll still need to configure bindings in the dashboard
```

### 5. Verify Deployment

1. Visit your deployed app: `https://settlement-organizer.pages.dev`
2. Check that the dashboard loads correctly
3. Test API endpoints: `/api/policy`, `/api/payments`, `/api/documents`

### 6. Production Database Migration

Run the schema migration against production:

```bash
wrangler d1 execute settlement-organizer-db --remote --file=./migrations/001_init_schema.sql
```

### 7. (Optional) Custom Domain

1. Go to Pages project → **Custom domains** → **Set up a custom domain**
2. Add your domain (e.g., `settlement.yourdomain.com`)
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Continuous Deployment

✅ **Automatic**: Every push to `main` branch triggers a new deployment  
✅ **Preview Deployments**: Pull requests get unique preview URLs  
✅ **Rollback**: Easily rollback to any previous deployment in the dashboard

## Troubleshooting

### Functions Return "Method not allowed"

**Cause**: Bindings not configured  
**Fix**: Add D1 and R2 bindings in Settings → Functions → Bindings, then redeploy

### Database Queries Fail

**Cause**: Schema not applied to production database  
**Fix**: Run `wrangler d1 execute settlement-organizer-db --remote --file=./migrations/001_init_schema.sql`

### Build Fails

**Cause**: Missing dependencies  
**Fix**: Ensure `package.json` is committed and all dependencies are listed

### Files Not Uploading

**Cause**: R2 bucket not bound  
**Fix**: Add R2 binding with variable name `DOCUMENTS`

## Environment Variables

This app uses Cloudflare bindings instead of environment variables:

- `DB` - D1 database binding (configured in Pages settings)
- `DOCUMENTS` - R2 bucket binding (configured in Pages settings)

## Monitoring

- **Deployment logs**: Pages → Deployments → View build logs
- **Function logs**: Real-time logs in Pages → Functions → Logs
- **Analytics**: Built-in analytics in Pages → Analytics

## Security

Security headers are configured in `_headers` file:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Local Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

For local testing with D1 and R2, you'll need to configure local bindings with Wrangler.

## Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **D1 Documentation**: https://developers.cloudflare.com/d1
- **R2 Documentation**: https://developers.cloudflare.com/r2

## Next Steps

After deployment:

1. ✅ Create your first policy
2. ✅ Add payment checkpoints
3. ✅ Upload payment documentation
4. ✅ Share with policyholders

---

**Your app is now live!** 🎉

Visit: `https://settlement-organizer.pages.dev`

