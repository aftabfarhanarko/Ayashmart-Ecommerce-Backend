# Email Templates

Shared email templates used across the application.

## Location
`src/common/templates/`

## Available Templates

### 1. Payment Email Templates (Customer)

**File:** `payment-email.templates.ts`

#### 1. Payment Confirmation Email
```typescript
generatePaymentConfirmationEmail(
  customerName: string,
  invoiceNumber: string,
  totalAmount: number,
  paidAmount: number,
  bankName: string,
  paymentDate: string,
)
```

**Used for:** Confirming verified bank payments

**Features:**
- Beautiful gradient header with checkmark
- Payment details table
- Verified status badge
- Professional footer

---

#### 2. Payment Rejection Email
```typescript
generatePaymentRejectionEmail(
  customerName: string,
  invoiceNumber: string,
  bankName: string,
  amount: number,
  reason?: string,
)
```

**Used for:** Notifying customers of rejected payments

**Features:**
- Warning-styled header
- Payment details with rejection reason
- Resubmit instructions
- Support contact information

---

### 2. Admin Notification Templates

**File:** `admin-notification.templates.ts`

#### 1. New Invoice Admin Notification
```typescript
generateNewInvoiceAdminNotification(
  customerName: string,
  customerEmail: string,
  invoiceNumber: string,
  totalAmount: number,
  amountType: string,
  createdDate: string,
)
```

**Used for:** Notifying admin when a new invoice is created

**Features:**
- Invoice details
- Customer information
- Amount and type
- Pending status badge
- View Invoice button

---

#### 2. Bank Payment Admin Notification
```typescript
generateBankPaymentAdminNotification(
  customerName: string,
  customerEmail: string,
  invoiceNumber: string,
  totalAmount: number,
  bankName: string,
  paymentAmount: number,
  accLastDigit: string,
  submittedDate: string,
)
```

**Used for:** Notifying admin when bank payment needs verification

**Features:**
- Action required alert
- Payment details with bank info
- Customer information
- Account last 4 digits
- Verify/Reject action buttons

---

## Usage

### Import from index
```typescript
import {
  generatePaymentConfirmationEmail,
  generatePaymentRejectionEmail,
  generateNewInvoiceAdminNotification,
  generateBankPaymentAdminNotification,
} from '../common/templates';
```

### Or import directly
```typescript
import {
  generatePaymentConfirmationEmail,
} from '../common/templates/payment-email.templates';
```

---

## Template Structure

All email templates are:
- ✅ Responsive HTML
- ✅ Inline CSS (for email client compatibility)
- ✅ Professional design
- ✅ Mobile-friendly
- ✅ 600px width (email standard)

---

## Adding New Templates

1. Create a new file in `src/common/templates/`
2. Export functions that return HTML strings
3. Add exports to `index.ts`
4. Document in this README

---

## Email Client Compatibility

Templates are designed to work with:
- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Mobile email clients

Using:
- Inline CSS
- Table-based layouts
- Safe color codes
- Web-safe fonts
