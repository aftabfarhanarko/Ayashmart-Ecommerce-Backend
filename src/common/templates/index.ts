// Export all email templates

// Customer emails
export {
  generatePaymentConfirmationEmail,
  generatePaymentRejectionEmail,
} from './payment-email.templates';

// Admin notifications
export {
  generateNewInvoiceAdminNotification,
  generateBankPaymentAdminNotification,
} from './admin-notification.templates';
