-- Add resellerId column to tbl_categories for reseller-owned categories
ALTER TABLE "tbl_categories"
  ADD COLUMN IF NOT EXISTS "resellerId" integer;

