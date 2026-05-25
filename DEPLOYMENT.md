# Vercel Deployment

Deploy this repo as two separate Vercel projects.

## Backend

Create a Vercel project with:

- Root Directory: `car/server`
- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `npm install`

Add these Environment Variables in Vercel:

- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN=https://smartmobile-client.vercel.app,https://www.autosmartmaroc.com,https://autosmartmaroc.com`

After deploy, test:

```text
https://smartmobile-server.vercel.app/api/health
```

## Frontend

Create a second Vercel project with:

- Root Directory: `car/client`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this Environment Variable in Vercel:

- `VITE_API_URL=https://smartmobile-server.vercel.app`

Redeploy the frontend after the backend URL is added.

## Notes

The backend currently stores uploaded images on local disk. On Vercel this is temporary storage, so uploaded images are not permanent. For production, move image uploads to Cloudinary, S3, or another persistent storage service.
