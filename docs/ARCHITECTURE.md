# FireBuildAI Architecture

This document captures **current** and **target** architecture for FireBuildAI.

---

## Current State (Single Deploy, Route-Separated)

```mermaid
flowchart LR
  subgraph Frontend["Single React App Deployment"]
    MKT["firebuildai.com\nMarketing: /, /signup, /login"]
    APP["app.firebuildai.com\nApp: /app/* (auth required)"]
    ADM["/secure-admin-2024-fb-portal/*\nAdmin routes hidden/guarded"]
  end

  MKT -->|auth (Supabase)| SUP["Supabase Project"]
  APP -->|auth + data| SUP
  ADM -->|admin auth + data| SUP

  SUP -->|Stripe customers/subs| STR["Stripe"]
  SUP -->|Storage (files)| STO["Supabase Storage"]

  classDef node fill:#eef,stroke:#669,stroke-width:1px;
  classDef svc fill:#efe,stroke:#6a6,stroke-width:1px;
  class MKT,APP,ADM node;
  class SUP,STR,STO svc;
```

### Current Implementation Details

- **Single Deployment**: All routes (marketing, app, admin) served from one React build
- **Authentication**: Unified through Supabase Auth
- **Admin Access**: Protected routes at `/secure-admin-2024-fb-portal/*`
- **Data Layer**: Supabase handles all database, auth, and storage needs
- **Payments**: Stripe integration for subscriptions and billing

---

## Target State (Split Admin Deploy + Enhanced Features)

```mermaid
flowchart LR
  subgraph Public["Public"]
    MKT2["firebuildai.com\nMarketing SPA"]
  end

  subgraph Product["Product"]
    APP2["app.firebuildai.com\nMain App SPA\nJobs • job-based Chat • POs • Analytics"]
  end

  subgraph Internal["Internal"]
    ADM2["admin-firebuildai.com\nAdmin SPA\nUsers • Billing • System Analytics"]
  end

  MKT2 -->|signup/login redirect| APP2

  APP2 -->|user auth (profiles)| SUP2["Supabase"]
  ADM2 -->|admin auth (admin_users)| SUP2

  APP2 -. webhooks/api .-> STR2["Stripe"]
  ADM2 -->|billing mgmt| STR2
  APP2 --> STO2["Supabase Storage"]
  ADM2 --> STO2

  subgraph CI_CD["CI/CD"]
    GH["Repo / Monorepo"]
    PIPE["Build & Deploy per app"]
    GH --> PIPE
    PIPE --> MKT2
    PIPE --> APP2
    PIPE --> ADM2
  end

  classDef node fill:#eef,stroke:#669,stroke-width:1px;
  classDef svc fill:#efe,stroke:#6a6,stroke-width:1px;
  classDef infra fill:#ffe,stroke:#aa6,stroke-width:1px;
  class MKT2,APP2,ADM2 node;
  class SUP2,STR2,STO2 svc;
  class GH,PIPE infra;
```

---

## Key Changes in Target Architecture

### 1. **Admin Portal Separation**
- Deploy to separate domain: `admin-firebuildai.com`
- Independent build pipeline and deployment
- Complete code isolation from customer-facing app
- Reduced attack surface

### 2. **Job-Based Chat System**
- Chat rooms scoped to individual jobs at `/jobs/[id]/chat`
- Member management per job
- Integration with job calendar and scope
- Persistent chat history per job

### 3. **Enhanced Purchase Order System**
- Full vendor management with dedicated Vendors tab
- Automatic PO numbering (PO-YYYY-#####)
- Payment method and status tracking
- Job linkage for cost tracking
- Integration with financial analytics

### 4. **Complete Route Implementation**
- All dashboard buttons and tabs properly routed
- Consistent navigation structure
- Deep linking support for all modules

### 5. **Theme System**
- Light/Dark mode toggle in header
- User preference persistence
- Consistent theming across all components
- Chart/graph color scheme adaptation

---

## Implementation Roadmap

### Phase 1: Foundation (Current - Completed)
- ✅ Basic app structure with marketing, app, and admin routes
- ✅ Supabase integration for auth and data
- ✅ Stripe billing integration
- ✅ Core job management features
- ✅ Theme toggle implementation

### Phase 2: Enhancement (In Progress)
- 🔄 Job-based chat system
- 🔄 Enhanced PO system with vendor management
- 🔄 Complete route wiring for all features

### Phase 3: Separation (Planned)
- ⏳ Split admin portal to separate domain
- ⏳ Independent CI/CD pipelines
- ⏳ Microservices architecture preparation

---

## Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context + React Query
- **Build**: Vite

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions
- **Payments**: Stripe API

### Infrastructure
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions (planned)
- **Hosting**: Lovable Platform (current), Self-hosting ready
- **Domains**: 
  - Main: `firebuildai.com`
  - Admin: `admin-firebuildai.com` (target)

---

## Security Architecture

### Authentication & Authorization
- **Customer Auth**: Supabase Auth with profiles table
- **Admin Auth**: Separate admin_users table with role-based access
- **RLS Policies**: Row-level security on all tables
- **Session Management**: JWT tokens with refresh capability

### Data Protection
- **Encryption**: TLS for all data in transit
- **Storage**: Encrypted at rest in Supabase
- **Secrets**: Environment variables for sensitive config
- **Audit Logging**: All admin actions logged

### Deployment Security
- **Environment Isolation**: Separate dev/staging/prod environments
- **Domain Separation**: Admin on separate domain (target)
- **CORS Configuration**: Strict origin policies
- **Rate Limiting**: API rate limits per user

---

## Ownership & Responsibilities

### Data Ownership
- **Auth & User Data**: Supabase (profiles, admin_users)
- **Business Data**: Supabase (jobs, invoices, estimates, etc.)
- **File Storage**: Supabase Storage
- **Payment Data**: Stripe (PCI compliant)

### Code Ownership
- **Repository**: GitHub (single repo, monorepo structure planned)
- **Documentation**: This file is the canonical architecture reference
- **Dependencies**: package.json managed via npm

### Service Dependencies
- **Critical**: Supabase, Stripe
- **Analytics**: Built-in analytics module
- **Communications**: Email via Supabase Edge Functions

---

## Monitoring & Observability

### Current
- Console logging for debugging
- Supabase dashboard for database monitoring
- Stripe dashboard for payment monitoring

### Planned
- Application performance monitoring (APM)
- Error tracking and alerting
- Custom dashboards for business metrics
- Uptime monitoring

---

## Disaster Recovery

### Backup Strategy
- **Database**: Supabase automatic daily backups
- **Code**: GitHub version control
- **Configuration**: Environment variables documented

### Recovery Time Objectives
- **RTO**: 4 hours for critical services
- **RPO**: 24 hours for data recovery

---

## Future Considerations

### Scalability
- Horizontal scaling via load balancing
- Database read replicas for performance
- CDN for static assets
- Caching layer implementation

### Extensibility
- Plugin architecture for third-party integrations
- API gateway for external access
- Webhook system for real-time events
- Mobile app consideration

---

## Change Management

This document is the **source of truth** for FireBuildAI architecture. Any architectural changes must:

1. Be documented here BEFORE implementation
2. Include diagrams updates when structure changes
3. Update the roadmap section with completion status
4. Be reviewed in pull requests

Last Updated: December 2024
Next Review: January 2025