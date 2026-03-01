-- Create order_status_history table for tracking status changes
-- Run this if the table doesn't exist (e.g. synchronize: false in production)

CREATE TABLE IF NOT EXISTS order_status_history (
  id SERIAL PRIMARY KEY,
  "orderId" INTEGER NOT NULL,
  "previousStatus" VARCHAR(255),
  "newStatus" VARCHAR(255) NOT NULL,
  comment VARCHAR(500),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_status_history_order FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history("orderId");
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history("createdAt");
