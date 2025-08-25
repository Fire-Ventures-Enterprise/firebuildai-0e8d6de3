// Admin Portal Environment Configuration
// This file contains instructions for deploying the admin portal separately

## Admin Portal Deployment Options

### Option 1: Subdomain (Recommended)
Deploy the admin portal to: `admin.firebuildai.com`

### Option 2: Separate Domain
Deploy to a completely different domain like: `firebuildai-admin.com`

### Option 3: Port-based separation
Run admin on different port: `firebuildai.com:3001`

## Security Implementation

1. **Separate Authentication**
   - Admin portal has its own login at `/admin/login`
   - Only users in `admin_users` table can access
   - Regular customers cannot see or access admin routes

2. **Database Security**
   - Row Level Security (RLS) policies ensure only admins can view data
   - Admin check functions are SECURITY DEFINER for proper isolation
   - All admin actions are logged

3. **URL Structure**
   - Main app: `firebuildai.com/app/*`
   - Admin portal: `firebuildai.com/admin/*` (or separate subdomain)
   - Marketing site: `firebuildai.com`

## Deployment Steps for Separate Subdomain

1. In your hosting provider (Vercel/Netlify):
   - Create a new deployment for `admin.firebuildai.com`
   - Set environment variables for Supabase
   - Configure DNS for the subdomain

2. Optional: Create separate build with only admin routes:
   - Remove marketing and app routes
   - Keep only `/admin/*` routes
   - Reduces bundle size and attack surface

## Current Implementation

The admin portal is currently accessible at:
- Login: `/admin/login`
- Dashboard: `/admin`

This is completely separate from:
- Customer app: `/app/*`
- Customer login: `/login`

Regular users CANNOT access `/admin` even if they're logged in.
Only users explicitly added to `admin_users` table can access.