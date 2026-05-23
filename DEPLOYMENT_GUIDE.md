# ShelfMart Complete Deployment Guide

This guide will walk you through deploying ShelfMart to the internet for free. We'll deploy the Database and Backend API to **Render**, and both React Frontends to **Vercel**.

## Phase 1: Preparing the Backend

Before deploying, your Python backend needs a list of dependencies so Render knows what to install, and a production server (`gunicorn`) to run the app.

1. **Open your terminal** and navigate to the backend folder:
   ```bash
   cd e:\ShelfMart\backend
   ```
2. **Activate your virtual environment** (if it isn't already):
   ```bash
   .\venv\Scripts\activate
   ```
3. **Install Gunicorn** (the production web server for Flask):
   ```bash
   pip install gunicorn
   ```
4. **Generate the requirements.txt file**:
   ```bash
   pip freeze > requirements.txt
   ```
5. **Commit everything to GitHub**: Make sure all your latest changes, including the new `requirements.txt` file, are pushed to your GitHub repository.

---

## Phase 2: Deploying the PostgreSQL Database

Render gives you a free managed PostgreSQL database.

1. Go to [Render.com](https://render.com) and create an account.
2. Click **New +** and select **PostgreSQL**.
3. Fill in the details:
   - **Name**: `shelfmart-db` (or similar)
   - **Database**: `shelfmart`
   - **User**: (leave as default)
   - **Region**: Select the one closest to you.
   - **Instance Type**: Free
4. Click **Create Database**.
5. Once created, scroll down to the **Connections** section and copy the **Internal Database URL** (for Render-to-Render communication) and the **External Database URL** (just in case). Keep this tab open.

---

## Phase 3: Deploying the Flask Backend

Now we deploy the API to Render and connect it to the new database.

1. In the Render Dashboard, click **New +** and select **Web Service**.
2. Connect your GitHub account and select your `ShelfMart` repository.
3. Fill in the setup details:
   - **Name**: `shelfmart-api`
   - **Root Directory**: `backend` (This is crucial! It tells Render where your Python app lives).
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn "run:app"`
   - **Instance Type**: Free
4. Scroll down to **Environment Variables** and click **Add Environment Variable**. Add the following:
   - Key: `DATABASE_URL` | Value: *Paste the Internal Database URL you copied earlier.*
   - Key: `JWT_SECRET_KEY` | Value: `your-super-secret-key-here` (make up a random string)
   - Key: `SECRET_KEY` | Value: `another-random-string`
5. Click **Create Web Service**.
6. Render will now build and deploy your backend. It might take a few minutes.
7. **Important**: Once deployed, copy your backend's live URL (e.g., `https://shelfmart-api.onrender.com`).

---

## Phase 4: Deploying the Frontends (Vercel)

Vercel is perfect for our Vite/React frontends. We'll deploy the main site and the admin dashboard separately.

### Deploying the Customer Site (`frontend`)
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `ShelfMart` repository.
4. In the configuration screen:
   - **Project Name**: `shelfmart-store`
   - **Framework Preset**: Vite
   - **Root Directory**: Click **Edit** and select the `frontend` folder.
5. Expand the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://shelfmart-api.onrender.com/api` *(Use the actual Render URL from Phase 3, keeping the `/api` at the end)*
6. Click **Deploy**. Vercel will build and host your customer storefront!

### Deploying the Admin Dashboard (`admin-frontend`)
1. Go back to the Vercel Dashboard and click **Add New...** -> **Project**.
2. Import the `ShelfMart` repository again.
3. In the configuration screen:
   - **Project Name**: `shelfmart-admin`
   - **Framework Preset**: Vite
   - **Root Directory**: Click **Edit** and select the `admin-frontend` folder.
4. Expand the **Environment Variables** section and add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://shelfmart-api.onrender.com/api` *(Same as before)*
5. Click **Deploy**. Vercel will build your admin portal!

---

## Final Checklist

- [ ] Is your database running on Render?
- [ ] Is your Flask backend deployed and showing 'Live' on Render?
- [ ] Are both React frontends successfully deployed on Vercel?
- [ ] Did you set the `VITE_API_URL` correctly in Vercel to point to the live Render backend?

Congratulations! Your full-stack application is now live!
