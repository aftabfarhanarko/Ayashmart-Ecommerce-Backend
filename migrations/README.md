# Database Migrations

## Order Status History

If the `order_status_history` table doesn't exist (e.g. when `synchronize` is disabled in production), run:

```bash
psql $DATABASE_URL -f migrations/001_create_order_status_history.sql
```

If you get `column Order.customerEmail does not exist`, run:

```bash
psql $DATABASE_URL -f migrations/002_add_customer_email_to_orders.sql
```

If you get `column Order.deliveryNote does not exist`, run:

```bash
psql $DATABASE_URL -f migrations/003_add_delivery_note_to_orders.sql
```

If you get `column Order.paidAmount does not exist` (for partial payment support), run:

```bash
psql $DATABASE_URL -f migrations/004_add_paid_amount_to_orders.sql
```

If you get `column SaleInvoice__SaleInvoice_items.productId does not exist`, run:

```bash
node scripts/run-migration.js migrations/006_add_productId_to_sale_invoice_items.sql
```

If you get `column Order.cancelNote does not exist`, run:

```bash
psql $DATABASE_URL -f migrations/007_add_cancel_note_to_orders.sql
```

If you get `column SystemUser.custom_domain_verified_at does not exist`, run:

```bash
psql $DATABASE_URL -f migrations/008_add_custom_domain_verified_columns.sql
```

Or connect to your PostgreSQL database and run the SQL manually.
