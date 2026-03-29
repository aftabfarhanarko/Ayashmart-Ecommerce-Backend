-- Migration: 013_create_cash_incomes
-- Creates tbl_cash_incomes table for per-company manual income tracking

CREATE TABLE IF NOT EXISTS tbl_cash_incomes (
  id SERIAL PRIMARY KEY,
  "companyId" VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category VARCHAR(255),
  note TEXT,
  date DATE NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "deletedAt" TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cash_incomes_company ON tbl_cash_incomes("companyId");
