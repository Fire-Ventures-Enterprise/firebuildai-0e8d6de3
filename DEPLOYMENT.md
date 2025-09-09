# FireBuildAI Deployment Pipeline

## Overview

This project uses GitHub Actions for CI/CD with automatic deployments to production environments.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         GitHub Repository                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Push to main branch triggers:                               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Marketing  │  │     App      │  │    Admin     │      │
│  │   Changes    │  │   Changes    │  │   Changes    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Build & Test │  │ Build & Test │  │ Build & Test │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────────────────────────────────────────┐       │
│  │              Deploy to Hosting Provider           │       │
│  └──────────────────────────────────────────────────┘       │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  firebuild.ai    app.firebuild.ai   admin.firebuild.ai │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Targets

| Environment | URL | Description | Path Filter |
|------------|-----|-------------|-------------|
| **Marketing** | [firebuild.ai](https://firebuild.ai) | Public marketing site | `src/pages/marketing/**`, `src/pages/Index.tsx` |
| **App** | [app.firebuild.ai](https://app.firebuild.ai) | Main application | `src/**` |
| **Admin** | [admin.firebuild.ai](https://admin.firebuild.ai) | Admin portal | `src/pages/admin/**`, `src/components/admin/**` |
| **Functions** | Supabase Edge Functions | Backend APIs | `supabase/functions/**` |

## Workflow Files

### Production Deployment (`deploy-production.yml`)
- **Trigger**: Push to `main` branch
- **Actions**: 
  - Detects changed files
  - Builds and deploys only affected components
  - Updates deployment status

### Preview Deployment (`preview-deployment.yml`)
- **Trigger**: Pull requests
- **Actions**:
  - Creates preview deployments
  - Comments PR with preview URLs
  - Runs tests and validations

### CI Pipeline (`ci.yml`)
- **Trigger**: All PRs and pushes to `main`
- **Actions**:
  - Linting (ESLint)
  - TypeScript checking
  - Security audits
  - Build verification

## Required GitHub Secrets & Environments

### GitHub Environments
Configure two environments in Settings → Environments:
1. **production** - For main branch deployments
2. **preview** - For PR preview deployments

### Core Infrastructure Secrets (Both Environments)
- `SUPABASE_ACCESS_TOKEN` - Supabase CLI access token
- `SUPABASE_PROJECT_REF` - Supabase project reference
- `VITE_SUPABASE_URL` - Supabase API URL  
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Payment Provider Secrets
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (browser)
- `STRIPE_SECRET_KEY` - Stripe secret key (edge functions)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `VITE_PAYPAL_CLIENT_ID` - PayPal client ID (optional)
- `PAYPAL_CLIENT_SECRET` - PayPal secret (optional)
- `PAYPAL_WEBHOOK_ID` - PayPal webhook ID (optional)

### Email Service Secrets
- `RESEND_API_KEY` - Resend API key (or alternatives below)
- `POSTMARK_API_TOKEN` - Postmark token (alternative)
- `SENDGRID_API_KEY` - SendGrid key (alternative)
- `EMAIL_FROM` - Default from address
- `EMAIL_REPLY_TO` - Reply-to address

### Testing Secrets (For Playwright E2E)
- `APP_URL` - Application URL for testing
- `TEST_EMAIL` - Test user email
- `TEST_PASSWORD` - Test user password

### Hosting Provider Configuration

#### For Vercel
- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Organization ID
- `VERCEL_PROJECT_ID_APP` - App project ID
- `VERCEL_PROJECT_ID_MARKETING` - Marketing project ID  
- `VERCEL_PROJECT_ID_ADMIN` - Admin project ID

#### For Netlify
- `NETLIFY_AUTH_TOKEN` - Netlify API token
- `NETLIFY_SITE_ID_APP` - App site ID
- `NETLIFY_SITE_ID_MARKETING` - Marketing site ID
- `NETLIFY_SITE_ID_ADMIN` - Admin site ID

### GitHub Variables
- `DEPLOY_PROVIDER` - Set to either `vercel` or `netlify`

## Local Development

### Setup
```bash
# Clone repository
git clone https://github.com/your-org/firebuildai.git
cd firebuildai

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your local values

# Start development server
npm run dev
```

### Building Locally
```bash
# Build for production
npm run build

# Build specific mode
VITE_APP_MODE=marketing npm run build
VITE_APP_MODE=admin npm run build

# Preview production build
npm run preview
```

### Testing Deployment Locally
```bash
# Test Supabase functions
supabase functions serve

# Test production build
npm run build && npm run preview
```

## Deployment Process

### Automatic Deployment (Recommended)
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit
3. Push branch: `git push origin feature/my-feature`
4. Create PR - preview deployments are created automatically
5. Merge PR - production deployment triggers automatically

### Manual Deployment
1. Go to GitHub Actions tab
2. Select "Deploy to Production" workflow
3. Click "Run workflow"
4. Select branch and click "Run"

### Rollback Process
1. Find the last working deployment in GitHub Actions
2. Note the commit SHA
3. Create a revert PR: `git revert <commit-sha>`
4. Merge to trigger deployment of previous version

## Monitoring & Status

### Build Status Badges
Add these to your README:
```markdown
![Marketing](https://github.com/your-org/firebuildai/actions/workflows/deploy-production.yml/badge.svg?branch=main)
![App](https://github.com/your-org/firebuildai/actions/workflows/deploy-production.yml/badge.svg?branch=main)
![CI](https://github.com/your-org/firebuildai/actions/workflows/ci.yml/badge.svg)
```

### Deployment Verification
Each deployment includes a deployment ID in the format: `YYYYMMDD-HHMMSS-<commit-sha>`

To verify deployment:
1. Check GitHub Actions for successful workflow run
2. Visit the deployment URL
3. Check browser console for: `console.log('Deployment:', process.env.VITE_DEPLOYMENT_ID)`
4. Verify in deployment provider dashboard

### Notifications
- **GitHub**: Automatic status checks on PRs
- **Email**: GitHub Actions failures (configure in GitHub settings)
- **Slack**: Add webhook URL to secrets for Slack notifications

## Troubleshooting

### Build Failures
1. Check GitHub Actions logs
2. Verify all secrets are set correctly
3. Ensure dependencies are up to date
4. Check for TypeScript errors: `npx tsc --noEmit`

### Deployment Failures
1. Verify hosting provider credentials
2. Check deployment provider quotas/limits
3. Ensure DNS is configured correctly
4. Check for environment variable issues

### Function Deployment Issues
1. Verify `SUPABASE_ACCESS_TOKEN` is valid
2. Check function syntax: `supabase functions serve <function-name>`
3. Ensure `supabase/config.toml` is valid
4. Check Supabase dashboard for function logs

## Security Considerations

1. **Secrets Management**: All sensitive values stored in GitHub Secrets
2. **Branch Protection**: Enable required status checks on `main`
3. **Code Review**: Require PR reviews before merge
4. **Audit Logging**: All deployments tracked in GitHub Actions
5. **Environment Isolation**: Separate deployments for each environment

## Support

For deployment issues:
1. Check [GitHub Actions Documentation](https://docs.github.com/actions)
2. Review hosting provider docs (Vercel/Netlify)
3. Check [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
4. Contact DevOps team

---

Last Updated: {{CURRENT_DATE}}
Deployment Version: 1.0.0