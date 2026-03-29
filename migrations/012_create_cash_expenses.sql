-- Migration: 012_create_cash_expenses
-- Creates tbl_cash_expenses table for per-company internal expense tracking

CREATE TABLE IF NOT EXISTS tbl_cash_expenses (
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

CREATE INDEX IF NOT EXISTS idx_cash_expenses_company ON tbl_cash_expenses("companyId");
