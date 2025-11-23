# Vercel Deployment Troubleshooting

## Common Issues and Solutions

### 1. Serverless Function Crashes (500 Error)

**Symptoms:**
- `500: INTERNAL_SERVER_ERROR`
- `FUNCTION_INVOCATION_FAILED`

**Possible Causes:**

#### Missing Environment Variables
Make sure these are set in Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL` - PostgreSQL connection string (REQUIRED)
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED)
- `FRONTEND_URL` - Your frontend URL (optional, for CORS)

#### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP addresses
- For cloud databases (Supabase, Railway, Neon), check firewall/network settings
- Ensure SSL is enabled if required: `?sslmode=require` in connection string

#### Prisma Client Not Generated
- The build should run `prisma generate` automatically
- Check build logs to ensure Prisma client generation succeeded
- Verify `node_modules/.prisma/client` exists after build

### 2. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Click on the function that's failing
5. Check "Logs" tab for detailed error messages

### 3. Common Error Messages

#### "Cannot find module '@prisma/client'"
- Solution: Ensure `prisma generate` runs during build
- Check that `@prisma/client` is in `package.json` dependencies

#### "P1001: Can't reach database server"
- Solution: Check `DATABASE_URL` and database network settings
- Ensure database is accessible from the internet

#### "P2002: Unique constraint failed"
- This is a runtime error, not a deployment issue
- Check your database schema and data

### 4. Testing Locally

Test the serverless function locally:
```bash
vercel dev
```

This will:
- Use your local `.env` file
- Mimic Vercel's serverless environment
- Help debug issues before deploying

### 5. Debug Steps

1. **Check Build Logs**
   - Verify build completes successfully
   - Check for TypeScript errors
   - Ensure Prisma client is generated

2. **Check Function Logs**
   - Look for initialization errors
   - Check for database connection errors
   - Look for missing environment variables

3. **Verify Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set
   - Redeploy after adding/changing variables

4. **Test Database Connection**
   - Use a database client to verify connection string works
   - Test from a different location to ensure network access

5. **Check Prisma Schema**
   - Ensure `schema.prisma` is correct
   - Run `prisma validate` locally
   - Run migrations if needed: `prisma migrate deploy`

### 6. Quick Fixes

**If function keeps crashing:**
1. Clear Vercel cache and redeploy
2. Check function logs for specific error
3. Verify all environment variables are set
4. Ensure database is accessible

**If build fails:**
1. Check TypeScript compilation errors
2. Ensure all dependencies are in `package.json`
3. Verify `tsconfig.build.json` excludes test files

### 7. Getting More Detailed Logs

Add console.log statements in `api/index.ts` to debug:
```typescript
console.log('Environment check:', {
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasJwtSecret: !!process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
});
```

### 8. Contact Support

If issues persist:
1. Check Vercel Status: https://vercel-status.com
2. Review Vercel Documentation: https://vercel.com/docs
3. Check Vercel Community: https://github.com/vercel/vercel/discussions

