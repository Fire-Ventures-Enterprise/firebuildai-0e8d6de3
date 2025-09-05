-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- The digest function should now be available from pgcrypto
-- Let's verify by testing it (this will create the extension if needed)
SELECT digest('test', 'sha256');