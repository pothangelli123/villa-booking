# Troubleshooting Guide for Villa Booking Website

This document provides solutions for common issues you might encounter while setting up or running the Villa Booking website.

## Supabase Connection Issues

### Issue: Cannot connect to Supabase

**Symptoms:**
- `npm run setup-supabase` fails
- Error messages about connection failure
- Tables not being created

**Solutions:**

1. **Check environment variables**
   ```
   npx dotenv -p NEXT_PUBLIC_SUPABASE_URL
   npx dotenv -p NEXT_PUBLIC_SUPABASE_ANON_KEY
   npx dotenv -p SUPABASE_SERVICE_KEY
   ```
   Make sure all variables are set correctly in the `.env.local` file.

2. **Use the simplified setup script**
   ```
   npm run simple-setup-supabase
   ```
   This script will test the connection and provide SQL that you can manually run in the Supabase SQL Editor.

3. **Create tables manually** 
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Paste and run the SQL shown by the simple-setup-supabase script

4. **Check Supabase service status**
   - Visit [Supabase Status](https://status.supabase.com/) to check if there are any ongoing issues

## Development Server Issues

### Issue: Cannot start the development server

**Symptoms:**
- `npm run dev` fails
- Errors about missing modules
- Port conflicts

**Solutions:**

1. **Reinstall dependencies**
   ```
   npm ci
   ```
   This performs a clean install based on your package-lock.json.

2. **Clear Next.js cache**
   ```
   npx rimraf .next
   ```
   Then try running `npm run dev` again.

3. **Port conflict resolution**
   If port 3000 is in use, you can specify a different port:
   ```
   npx next dev -p 3001
   ```

4. **Check for TypeScript errors**
   ```
   npx tsc --noEmit
   ```
   Fix any type errors that are detected.

## Image Loading Issues

### Issue: Images not showing up

**Symptoms:**
- Broken image links
- 404 errors for image paths

**Solutions:**

1. **Run the image download script**
   ```
   npm run download-images
   ```
   This will download placeholder images to the correct locations.

2. **Check image paths**
   Ensure image paths in the database match the actual file structure in `public/images/`.

3. **Create image directories manually**
   ```
   mkdir -p public/images
   ```

4. **Add placeholder images manually**
   You can create your own placeholder images using services like:
   - [Placeholder.com](https://placeholder.com/)
   - [DummyImage.com](https://dummyimage.com/)
   - [PlaceIMG.com](https://placeimg.com/)

## Deployment Issues

### Issue: Build fails

**Symptoms:**
- `npm run build` fails
- TypeScript errors
- Missing environment variables

**Solutions:**

1. **Verify environment variables**
   Ensure all required environment variables are set in your deployment environment.

2. **Run lint and fix errors**
   ```
   npm run lint -- --fix
   ```

3. **Check for type errors**
   ```
   npx tsc --noEmit
   ```

4. **Create a minimal build**
   If you're still having issues, try creating a minimal version:
   ```
   npx next build
   ```

## Project Structure Issues

### Issue: Missing files or directories

**Solutions:**

1. **Check project structure**
   Compare your directory structure with the expected structure in PROJECT_SUMMARY.md.

2. **Regenerate missing directories**
   ```
   mkdir -p components pages/api public/images styles utils scripts
   ```

3. **Clone a fresh copy**
   If possible, clone a fresh copy of the repository to ensure you have all files.

## Need More Help?

If you continue to experience issues:

1. Check the GitHub repository issues section for similar problems
2. Consult the Next.js documentation at [nextjs.org/docs](https://nextjs.org/docs)
3. Consult the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
4. Open an issue on the project repository with detailed information about the problem 