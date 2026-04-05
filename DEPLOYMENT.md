# Deployment Guide: Portfolio Website

This guide outlines the steps to deploy your portfolio website to **Vercel** with a **MongoDB Atlas** database.

## 1. Prerequisites
- A [Vercel](https://vercel.com/) account.
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (Free tier is fine).
- Your project pushed to a Git repository (GitHub/GitLab/Bitbucket).

## 2. Environment Variables
You must configure the following environment variables in the Vercel Dashboard (**Settings > Environment Variables**):

| Variable | Description | Example/Value |
| :--- | :--- | :--- |
| `MONGODB_URI` | Your MongoDB Atlas connection string. | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio` |
| `ADMIN_SECRET` | A long, random string for admin API authentication. | `generate-a-very-strong-secret` |
| `JWT_ACCESS_SECRET`| Secret used to sign JWT access tokens. | `your-long-random-access-string` |
| `JWT_REFRESH_SECRET`| Secret used to sign JWT refresh tokens. | `your-long-random-refresh-string` |
| `NEXT_PUBLIC_API_URL`| Your production domain URL. | `https://your-portfolio.vercel.app` |
| `EMAIL_USER` | Email address for sending notifications. | `your-email@gmail.com` |
| `EMAIL_PASS` | App password for the email account. | `your-app-password` |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary Cloud Name for media. | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key. | `your-api-key` |
| `CLOUDINARY_API_SECRET`| Cloudinary API Secret. | `your-api-secret` |

> [!IMPORTANT]
> Ensure `NEXT_PUBLIC_API_URL` does NOT have a trailing slash.

## 3. Vercel Configuration
The project includes a `vercel.json` file that sets up security headers. No additional configuration is required.

## 4. Deployment Steps
1.  **Import Project**: In Vercel, click "**New Project**" and import your repository.
2.  **Configure Build**:
    -   **Framework Preset**: Next.js
    -   **Root Directory**: `./` (leave default)
    -   **Build Command**: `npm run build`
    -   **Output Directory**: `.next` (leave default)
3.  **Add Environment Variables**: Copy the values from your `.env` (or `.env.local`) to Vercel's environment variables section as described in Step 2.
4.  **Deploy**: Click "**Deploy**".

## 5. Post-Deployment
-   **Database Access**: Ensure your MongoDB Atlas cluster allows connections from Vercel's IP addresses (or whitelist `0.0.0.0/0` for simplicity, though less secure).
-   **SSL**: Vercel automatically provides SSL for your deployment.

## 6. Troubleshooting
-   **Build Errors**: If you encounter errors related to `next build`, check the build logs in Vercel.
-   **API 401/500**: Check that all `JWT` secrets and the `MONGODB_URI` are correctly set.
-   **Middleware Issues**: Ensure you are using `jose` for any JWT logic in `middleware.ts` as it's compatible with Vercel Edge functions.
