# Backend Deployment Guide for Vercel

## MongoDB Connection Setup

The 500 error is typically caused by missing or incorrect MongoDB connection string. Follow these steps:

### 1. Set MongoDB URI in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following environment variable:

   **Variable Name:** `MONGODB_URI`
   
   **Value:** Your MongoDB connection string
   
   - **For MongoDB Atlas (Cloud):**
     ```
     mongodb+srv://username:password@cluster.mongodb.net/contactmanagement?retryWrites=true&w=majority
     ```
   
   - **For Local MongoDB (not recommended for production):**
     ```
     mongodb://localhost:27017/contactmanagement
     ```

4. Select **Production**, **Preview**, and **Development** environments
5. Click **Save**

### 2. MongoDB Atlas Setup (Recommended)

If you don't have MongoDB Atlas:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user:
   - Go to **Database Access** → **Add New Database User**
   - Choose **Password** authentication
   - Save the username and password
5. Whitelist IP addresses:
   - Go to **Network Access** → **Add IP Address**
   - Click **Allow Access from Anywhere** (for Vercel) or add specific IPs
6. Get connection string:
   - Go to **Clusters** → **Connect** → **Connect your application**
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `contactmanagement`

### 3. Redeploy

After adding the environment variable:
1. Go to **Deployments** tab
2. Click the **⋯** menu on the latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger automatic deployment

### 4. Verify Connection

Test the health endpoint:
```
https://your-backend-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "mongodb": "connected"
}
```

### 5. Test API Endpoints

- **Get Contacts:** `GET https://your-backend-url.vercel.app/api/contacts`
- **Create Contact:** `POST https://your-backend-url.vercel.app/api/contacts`
- **Health Check:** `GET https://your-backend-url.vercel.app/api/health`

## Troubleshooting

### Error: "MongoDB Connection Error"
- Check if `MONGODB_URI` is set correctly in Vercel
- Verify MongoDB Atlas network access allows Vercel IPs
- Check database user credentials

### Error: 500 Internal Server Error
- Check Vercel function logs: **Deployments** → Click deployment → **Functions** tab
- Verify MongoDB connection string format
- Ensure database name is correct

### Error: "Cannot GET /"
- This is normal for API-only backends
- Use `/api/contacts` or `/api/health` endpoints instead

## Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `PORT` - Optional (Vercel sets this automatically)
- [ ] `NODE_ENV` - Optional (set to "production" for production)

## Local Development

For local development, create a `.env` file in the `backend` folder:

```env
MONGODB_URI=mongodb://localhost:27017/contactmanagement
PORT=5000
NODE_ENV=development
```

Then run:
```bash
npm install
npm start
```

