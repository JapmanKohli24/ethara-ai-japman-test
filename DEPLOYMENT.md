# Deployment Guide - ETHARA AI HRMS

This guide covers deploying the HRMS application with:
- **Frontend**: Vercel
- **Backend**: Render
- **CI/CD**: GitHub Actions

---

## Prerequisites

1. GitHub account with repository created
2. Vercel account (free tier works)
3. Render account (free tier works)
4. MongoDB Atlas account (free tier - M0 cluster)

---

## Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user with password
4. Add `0.0.0.0/0` to IP Access List (for Render)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/ethara-hrms?retryWrites=true&w=majority
   ```

---

## Step 2: Push Code to GitHub

```bash
# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/ethara-ai.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: HRMS application with frontend and backend"

# Push to main branch
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and create the service
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string

### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ethara-ai-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
6. Click **Create Web Service**

### Get Your Backend URL

After deployment, your backend URL will be:
```
https://ethara-ai-backend.onrender.com
```

### Set Up Deploy Hook (for CI/CD)

1. In Render dashboard, go to your service → **Settings**
2. Scroll to **Deploy Hook**
3. Copy the hook URL
4. Add it as a GitHub secret: `RENDER_DEPLOY_HOOK_URL`

---

## Step 4: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: `https://ethara-ai-backend.onrender.com`
6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://ethara-ai-backend.onrender.com

# Deploy to production
vercel --prod
```

---

## Step 5: Configure GitHub Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `RENDER_DEPLOY_HOOK_URL` | `https://api.render.com/deploy/srv-...` | From Render dashboard |
| `NEXT_PUBLIC_API_URL` | `https://ethara-ai-backend.onrender.com` | Your Render backend URL |

---

## Step 6: Verify CI/CD

1. Make a small change to the code
2. Push to GitHub
3. Check **Actions** tab in GitHub to see workflows running
4. Verify:
   - Backend CI runs and triggers Render deploy
   - Frontend CI runs and Vercel auto-deploys

---

## Environment Variables Summary

### Backend (Render)

| Variable | Example | Required |
|----------|---------|----------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/ethara-hrms` | Yes |
| `NODE_ENV` | `production` | Yes |
| `PORT` | `10000` | Auto-set by Render |

### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_API_URL` | `https://ethara-ai-backend.onrender.com` | Yes |

---

## Troubleshooting

### Backend Issues

**"MongoDB connection failed"**
- Verify `MONGODB_URI` is correct
- Check IP Access List in MongoDB Atlas (add `0.0.0.0/0`)
- Ensure database user has correct permissions

**"Service is spinning down"**
- Free tier Render services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading to paid tier for production

### Frontend Issues

**"API calls failing"**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check that backend is running (visit `/api/health`)
- Check browser console for CORS errors

**"Build failed"**
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles without errors

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | `https://your-project.vercel.app` |
| Backend | `https://ethara-ai-backend.onrender.com` |
| Health Check | `https://ethara-ai-backend.onrender.com/api/health` |

---

## Updating the Application

Simply push to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

GitHub Actions will:
1. Run CI checks
2. If backend changed → Trigger Render deploy
3. If frontend changed → Vercel auto-deploys

---

## Cost Considerations

### Free Tier Limitations

**Render Free Tier:**
- Services sleep after 15 min inactivity
- 750 hours/month
- Cold starts ~30 seconds

**Vercel Free Tier:**
- 100GB bandwidth/month
- Serverless function limits apply

**MongoDB Atlas Free Tier (M0):**
- 512MB storage
- Shared RAM
- No dedicated support

### Recommended for Production

- Render Starter ($7/month) - No sleep, faster
- Vercel Pro ($20/month) - More bandwidth, analytics
- MongoDB M2 ($9/month) - Better performance
