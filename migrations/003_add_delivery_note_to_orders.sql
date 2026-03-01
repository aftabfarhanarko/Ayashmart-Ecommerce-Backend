-- Add deliveryNote column to orders table
-- Run this if the column doesn't exist (e.g. schema out of sync with entity)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS "deliveryNote" VARCHAR(500);
