# Deploying to Vercel

This guide explains how to deploy the NestJS backend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. PostgreSQL database (you can use services like Supabase, Railway, or Neon)

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Set up Environment Variables

Before deploying, you need to set up environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

**Required Environment Variables:**
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)

**Optional Environment Variables:**
- `NODE_ENV` - Set to `production`
- `PORT` - Server port (Vercel handles this automatically)

### 4. Deploy to Vercel

From the `pharmacy-Backend` directory:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No** (for first deployment)
- What's your project's name? **pharmacy-backend** (or your preferred name)
- In which directory is your code located? **./** (current directory)

### 5. Update Environment Variables in Vercel Dashboard

After the first deployment, go to your project settings in Vercel and add all required environment variables.

### 6. Redeploy

After adding environment variables, redeploy:

```bash
vercel --prod
```

## Important Notes

### Database Connection

- Make sure your PostgreSQL database allows connections from Vercel's IP addresses
- For cloud databases (Supabase, Railway, Neon), you may need to whitelist Vercel's IPs or allow all IPs for development

### Prisma Setup

The deployment will automatically:
1. Run `npm run vercel-build` which includes:
   - `npm run build` - Builds the NestJS application
   - `npm run db:generate` - Generates Prisma client

### Database Migrations

You need to run migrations manually before the first deployment or set up a migration script:

```bash
# Run migrations on your production database
npx prisma migrate deploy
```

Or add a postinstall script to run migrations automatically.

### CORS Configuration

The CORS is configured to allow:
- Localhost origins (for development)
- Vercel preview deployments (`*.vercel.app`)
- Your frontend URL (from `FRONTEND_URL` env variable)

Update the CORS configuration in `api/index.ts` if you need to add more allowed origins.

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check that all dependencies are in `package.json` (not just `devDependencies`)
2. Ensure TypeScript compiles without errors: `npm run build`
3. Check Vercel build logs for specific errors

### Database Connection Issues

1. Verify `DATABASE_URL` is correctly set in Vercel
2. Check that your database allows external connections
3. Ensure SSL is enabled if required by your database provider

### Runtime Errors

1. Check Vercel function logs
2. Ensure Prisma client is generated (`npm run db:generate`)
3. Verify all environment variables are set

## Production Considerations

1. **Database**: Use a managed PostgreSQL service (Supabase, Railway, Neon, etc.)
2. **Environment Variables**: Never commit `.env` files
3. **CORS**: Update allowed origins for production
4. **Logging**: Consider adding proper logging service
5. **Monitoring**: Set up error tracking (Sentry, etc.)

## Updating the Deployment

To update your deployment:

```bash
vercel --prod
```

Or push to your connected Git repository (if configured).

## Local Testing

You can test the Vercel build locally:

```bash
vercel dev
```

This will start a local server that mimics Vercel's serverless environment.

