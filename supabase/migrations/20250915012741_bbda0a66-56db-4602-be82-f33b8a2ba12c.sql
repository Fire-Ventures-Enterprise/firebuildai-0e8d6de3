-- Drop all enums if they exist and recreate them
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS project_status CASCADE;
DROP TYPE IF EXISTS estimate_status CASCADE;
DROP TYPE IF EXISTS proposal_status CASCADE;
DROP TYPE IF EXISTS invoice_status CASCADE;
DROP TYPE IF EXISTS work_order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;

-- Create all enum types
CREATE TYPE user_role AS ENUM ('project_owner', 'contractor', 'subcontractor');
CREATE TYPE project_status AS ENUM ('planning', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE estimate_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'signed', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'partial', 'paid', 'overdue');
CREATE TYPE work_order_status AS ENUM ('pending', 'assigned', 'in_progress', 'completed', 'verified');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');