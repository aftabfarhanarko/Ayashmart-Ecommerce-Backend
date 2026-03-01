-- Add RESELLER value to system_users_role_enum if it does not already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'system_users_role_enum'
      AND e.enumlabel = 'RESELLER'
  ) THEN
    ALTER TYPE system_users_role_enum ADD VALUE 'RESELLER';
  END IF;
END
$$;

