# Vercel Deployment Fix

## Issue
Vercel was auto-detecting NestJS and trying to use `@vercel/nestjs` builder, which was causing build failures.

## Solution
Updated `vercel.json` to explicitly use `@vercel/node` builder and configure the build process correctly.

## Changes Made

1. **vercel.json** - Updated to:
   - Explicitly set `framework: null` to prevent auto-detection
   - Use `@vercel/node` builder
   - Configure build command to run `npm run vercel-build`
   - Include necessary files in the function bundle

2. **package.json** - Updated `vercel-build` script:
   - Changed from: `npm run build && npm run db:generate`
   - Changed to: `prisma generate && npm run build`
   - This ensures Prisma client is generated before building

3. **api/index.ts** - Serverless function handler:
   - Imports from `../src/` (TypeScript files are compiled by `@vercel/node`)
   - Caches the Express app instance for better performance
   - Configures CORS to allow Vercel domains

## Build Process

The build process now:
1. Installs dependencies (`npm install`)
2. Generates Prisma client (`prisma generate`)
3. Builds NestJS app (`nest build`)
4. Creates serverless function from `api/index.ts`

## Environment Variables Required

Make sure these are set in Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - Your frontend URL (optional, for CORS)

## Next Steps

1. Commit and push these changes
2. Redeploy on Vercel
3. The build should now use `@vercel/node` instead of `@vercel/nestjs`

## Troubleshooting

If you still see `@vercel/nestjs` being used:
1. Check that `vercel.json` is in the root of the backend directory
2. Ensure `framework: null` is set
3. Try removing any `.vercel` cache and redeploying

