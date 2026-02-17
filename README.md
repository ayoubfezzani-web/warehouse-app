# Warehouse Management System

A simple part withdrawal logging app for internal warehouse use.

## Passwords

| Role  | Default Password  | Where to change it         |
|-------|-------------------|----------------------------|
| Team  | `team2024`        | `src/App.jsx` line 4       |
| Admin | `warehouse2024`   | `src/App.jsx` line 3       |

---

## How to Deploy to Vercel (step by step)

### Step 1 — Create a GitHub account
Go to https://github.com and sign up for free if you don't have an account.

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it `warehouse-app`
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload these files
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL files and folders from this zip into the upload area
   - Make sure the `src/` folder is included with `App.jsx` and `main.jsx` inside
3. Click **Commit changes**

### Step 4 — Deploy on Vercel
1. Go to https://vercel.com and sign up free (use your GitHub account)
2. Click **Add New Project**
3. Find and select your `warehouse-app` repository
4. Vercel will auto-detect it as a Vite project — don't change any settings
5. Click **Deploy**

### Step 5 — Get your link
After ~1 minute, Vercel gives you a live URL like:
`https://warehouse-app-xxxx.vercel.app`

Share that link with your team. Done!

---

## How to update passwords later
1. Open `src/App.jsx` in GitHub (click the file → pencil icon to edit)
2. Change `USER_PASSWORD` or `ADMIN_PASSWORD` at the top
3. Click **Commit changes**
4. Vercel auto-redeploys within 1 minute

## Features
- Password protected entry for team members
- Log part withdrawals with: name, part number, description, quantity, purpose
- Admin panel with full log view (separate password)
- Search and sort all entries
- Export to CSV for manual OpenBOM updates
