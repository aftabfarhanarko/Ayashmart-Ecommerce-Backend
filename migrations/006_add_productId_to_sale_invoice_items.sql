-- Add productId column to sale_invoice_items for product relation
-- Add deliveryStatus and fulfillmentStatus to sale_invoices if not exists

-- sale_invoice_items: add productId
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sale_invoice_items' AND column_name = 'productId'
  ) THEN
    ALTER TABLE sale_invoice_items ADD COLUMN "productId" integer;
  END IF;
END $$;

-- sale_invoices: add deliveryStatus
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sale_invoices' AND column_name = 'deliveryStatus'
  ) THEN
    ALTER TABLE sale_invoices ADD COLUMN "deliveryStatus" character varying;
  END IF;
END $$;

-- sale_invoices: add fulfillmentStatus
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sale_invoices' AND column_name = 'fulfillmentStatus'
  ) THEN
    ALTER TABLE sale_invoices ADD COLUMN "fulfillmentStatus" character varying;
  END IF;
END $$;
