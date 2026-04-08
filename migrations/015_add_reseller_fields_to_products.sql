-- Migration: 015_add_reseller_fields_to_products
-- Purpose:
-- 1) Ensure tbl_products has resellerId column for reseller-created products
-- 2) Ensure product status enum contains 'pending' for approval workflow

ALTER TABLE "tbl_products"
  ADD COLUMN IF NOT EXISTS "resellerId" integer;

CREATE INDEX IF NOT EXISTS "idx_tbl_products_resellerId"
  ON "tbl_products" ("resellerId");

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type t
    WHERE t.typname = 'tbl_products_status_enum'
  ) THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_enum e
      JOIN pg_type t ON t.oid = e.enumtypid
      WHERE t.typname = 'tbl_products_status_enum'
        AND e.enumlabel = 'pending'
    ) THEN
      ALTER TYPE "tbl_products_status_enum" ADD VALUE 'pending';
    END IF;
  END IF;
END
$$;
