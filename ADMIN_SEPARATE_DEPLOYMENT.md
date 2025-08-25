# Admin Portal Deployment Guide - firebuildai-admin.com

## Overview
This guide explains how to deploy the admin portal as a completely separate domain for total isolation from the main FireBuildAI application.

## Architecture

**Main App**: `firebuildai.com` (customer-facing)
- Marketing pages
- Customer login (`/login`)
- Customer dashboard (`/app/*`)
- Customer portal features

**Admin Portal**: `firebuildai-admin.com` (admin-only)
- Admin login only
- Admin dashboard
- Subscriber management
- Payment tracking
- Complete isolation from customer app

## Deployment Steps

### Step 1: Create Separate Lovable Project for Admin

1. **Remix this project** to create a new copy:
   - Click project name → Settings → "Remix this project"
   - Name it "FireBuildAI Admin Portal"

2. **In the NEW admin project**, switch to use `AdminApp.tsx`:
   - Rename `src/App.tsx` to `src/App.backup.tsx`
   - Rename `src/AdminApp.tsx` to `src/App.tsx`

3. **Remove customer-facing code** from admin project:
   - Delete `/pages/marketing/*`
   - Delete `/pages/app/*` (except admin folder)
   - Delete customer components not needed for admin
   - Keep all admin components and database access

### Step 2: Clean Up Main Project

In your ORIGINAL project (firebuildai.com):
1. Remove admin routes from `src/App.tsx`
2. Delete `/pages/admin/*` folder
3. Delete `/components/admin/*` folder
4. This ensures customers can never access admin code

### Step 3: Configure Domain for Admin Portal

1. **Register domain**: Purchase `firebuildai-admin.com` from your registrar
2. **In Admin Lovable project**:
   - Go to Settings → Domains
   - Click "Connect Domain"
   - Enter `firebuildai-admin.com`
   - Follow DNS setup instructions

### Step 4: Configure Supabase

Both projects use the SAME Supabase backend:
- Same database
- Same authentication
- Same edge functions
- Just different frontends

No changes needed - admin portal will connect to existing Supabase project.

### Step 5: Environment Variables

In the admin project, ensure these are set:
- Same Supabase URL
- Same Supabase Anon Key
- Same Stripe keys

## Security Benefits

1. **Complete URL Isolation**
   - Customers never see admin domain
   - No shared cookies between domains
   - Separate SSL certificates

2. **Code Isolation**
   - Admin code not in customer bundle
   - Smaller attack surface
   - Can't accidentally expose admin routes

3. **Deployment Isolation**
   - Deploy admin updates without affecting customers
   - Different CI/CD pipelines
   - Separate monitoring and logs

## Admin Access URLs

After deployment:
- **Admin Login**: `https://firebuildai-admin.com/login`
- **Admin Dashboard**: `https://firebuildai-admin.com/dashboard`
- **Customer App**: `https://firebuildai.com` (completely separate)

## Testing Locally

To test the admin-only version:
1. Use `src/AdminApp.tsx` as your main App
2. Routes will be:
   - `/` → redirects to `/login`
   - `/login` → admin login
   - `/dashboard` → admin dashboard

## Notes

- Only users in `admin_users` table can login to admin portal
- Regular customers get "Access Denied" even if they find the domain
- All admin actions are logged in database
- Consider using IP whitelisting for additional security