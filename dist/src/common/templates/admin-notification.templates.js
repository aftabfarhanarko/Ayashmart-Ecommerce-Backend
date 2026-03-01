"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBankPaymentAdminNotification = exports.generateNewInvoiceAdminNotification = void 0;
const generateNewInvoiceAdminNotification = (customerName, customerEmail, invoiceNumber, transactionId, totalAmount, amountType, createdDate, companyName) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Invoice Created - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #22c55e, #020617 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #020617; border-radius: 18px; overflow: hidden; border: 1px solid rgba(148,163,184,0.5);">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #22c55e, #16a34a); padding: 22px 26px 18px; text-align: left;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #dcfce7; opacity: 0.9;">
                ${companyName} · Admin alert
              </div>
              <h1 style="margin: 6px 0 0; color: #ecfdf5; font-size: 22px; font-weight: 600;">
                New invoice created
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 14px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                A new invoice has been created in the system.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(55,65,81,0.9);">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #bbf7d0;">
                      Invoice Details
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Invoice Number:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Transaction ID:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0; font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                          ${transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Amount:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(totalAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Amount Type:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${amountType.toUpperCase()}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Created Date:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${createdDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">
                          <span style="background-color: #fbbf24; color: #111827; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            PENDING
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(37,99,235,0.08); border-radius: 14px; margin-bottom: 16px; border: 1px solid rgba(37,99,235,0.4);">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #bfdbfe;">
                      Customer Information
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Name:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Email:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerEmail}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">
                Please review and take action from the admin panel if needed.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020617; padding: 14px 26px 20px; text-align: center; border-top: 1px solid rgba(55,65,81,0.9);">
              <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280;">
                This is an automated admin notification.
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.generateNewInvoiceAdminNotification = generateNewInvoiceAdminNotification;
const generateBankPaymentAdminNotification = (customerName, customerEmail, invoiceNumber, transactionId, totalAmount, bankName, paymentAmount, accLastDigit, submittedDate, companyName) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bank Payment Submitted - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f97316, #020617 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #020617; border-radius: 18px; overflow: hidden; border: 1px solid rgba(148,163,184,0.5);">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #fb923c, #ea580c); padding: 22px 26px 18px; text-align: left;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #ffedd5; opacity: 0.9;">
                ${companyName} · Admin alert
              </div>
              <h1 style="margin: 6px 0 0; color: #fff7ed; font-size: 22px; font-weight: 600;">
                Bank payment needs verification
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 14px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                A customer has submitted bank payment details that require your verification.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(248,250,252,0.02); border-radius: 14px; margin-bottom: 20px; border-left: 4px solid #facc15;">
                <tr>
                  <td style="padding: 16px 18px 14px;">
                    <p style="margin: 0; font-size: 13px; color: #fed7aa; font-weight: 500;">
                      ⏰ Action Required: Please verify this payment in your bank account
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(55,65,81,0.9);">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #fed7aa;">
                      Payment Details
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Invoice Number:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Transaction ID:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0; font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                          ${transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Bank Name:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${bankName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Payment Amount:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(paymentAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Invoice Total:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(totalAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Account Last 4 Digits:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ****${accLastDigit}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Submitted Date:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${submittedDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">
                          <span style="background-color: #fbbf24; color: #111827; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            PENDING VERIFICATION
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(37,99,235,0.08); border-radius: 14px; margin-bottom: 16px; border: 1px solid rgba(37,99,235,0.4);">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #bfdbfe;">
                      Customer Information
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Name:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Email:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerEmail}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 12px 0 0; font-size: 12px; color: #6b7280;">
                Please verify this payment in your bank portal and then update the invoice status from the admin panel.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020617; padding: 14px 26px 20px; text-align: center; border-top: 1px solid rgba(55,65,81,0.9);">
              <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280;">
                This is an automated admin notification.
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999;">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
exports.generateBankPaymentAdminNotification = generateBankPaymentAdminNotification;
//# sourceMappingURL=admin-notification.templates.js.map