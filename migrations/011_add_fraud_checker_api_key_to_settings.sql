-- Migration 011: Add fraudCheckerApiKey column to tbl_settings
ALTER TABLE tbl_settings ADD COLUMN IF NOT EXISTS "fraudCheckerApiKey" varchar(500);
