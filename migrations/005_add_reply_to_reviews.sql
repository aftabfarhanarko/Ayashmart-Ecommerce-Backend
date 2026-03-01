-- Add reply column to tbl_reviews for merchant/admin replies to customer reviews
-- Run this if the column doesn't exist (e.g. schema out of sync with entity)

ALTER TABLE tbl_reviews ADD COLUMN IF NOT EXISTS "reply" TEXT;
