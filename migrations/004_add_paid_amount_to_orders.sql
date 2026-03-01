-- Add paidAmount column to orders table for partial payment support
-- Run this if the column doesn't exist (e.g. schema out of sync with entity)

ALTER TABLE orders ADD COLUMN IF NOT EXISTS "paidAmount" DECIMAL(12,2) DEFAULT 0;
