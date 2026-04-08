-- Migration: 014_add_paid_total_earning_to_system_users
-- Adds paidTotalEarning to system_users with default zero

ALTER TABLE system_users
ADD COLUMN IF NOT EXISTS "paidTotalEarning" NUMERIC DEFAULT 0;
