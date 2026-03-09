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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f5f5f5, #000000 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); padding: 22px 26px 18px; text-align: left; color: #f5f5f5;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #f5f5f5; opacity: 0.9;">
                ${companyName} · Admin alert
              </div>
              <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                New invoice created
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 14px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                A new invoice has been created in the system.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; border-radius: 14px; margin-bottom: 20px; border: 1px solid #444444;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #ffffff;">
                      Invoice Details
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Invoice Number:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Transaction ID:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0; font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                          ${transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Amount:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(totalAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Amount Type:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${amountType.toUpperCase()}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Created Date:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${createdDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 10px 0 0; border-top: 1px solid #444444;">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid #444444;">
                          <span style="background-color: #111111; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            PENDING
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(0,0,0,0.1); border-radius: 14px; margin-bottom: 16px; border: 1px solid #444444;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #ffffff;">
                      Customer Information
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Name:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Email:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerEmail}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 12px 0 0; font-size: 12px; color: #999999;">
                Please review and take action from the admin panel if needed.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #000000; padding: 14px 26px 20px; text-align: center; border-top: 1px solid #444444;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #777777;">
                This is an automated admin notification.
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f5f5f5, #000000 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); padding: 22px 26px 18px; text-align: left; color: #f5f5f5;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #f5f5f5; opacity: 0.9;">
                ${companyName} · Admin alert
              </div>
              <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                Bank payment needs verification
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 14px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                A customer has submitted bank payment details that require your verification.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(0,0,0,0.1); border-radius: 14px; margin-bottom: 20px; border-left: 4px solid #555555;">
                <tr>
                  <td style="padding: 16px 18px 14px;">
                    <p style="margin: 0; font-size: 13px; color: #f5f5f5; font-weight: 500;">
                      ⏰ Action Required: Please verify this payment in your bank account
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; border-radius: 14px; margin-bottom: 20px; border: 1px solid #444444;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #ffffff;">
                      Payment Details
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Invoice Number:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Transaction ID:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0; font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                          ${transactionId}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Bank Name:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${bankName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Payment Amount:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(paymentAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Invoice Total:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${Number(totalAmount).toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Account Last 4 Digits:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ****${accLastDigit}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Submitted Date:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${submittedDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 10px 0 0; border-top: 1px solid #444444;">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid #444444;">
                          <span style="background-color: #111111; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            PENDING VERIFICATION
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(0,0,0,0.1); border-radius: 14px; margin-bottom: 16px; border: 1px solid #444444;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #ffffff;">
                      Customer Information
                    </h2>
                    
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Name:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerName}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Email:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${customerEmail}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 12px 0 0; font-size: 12px; color: #999999;">
                Please verify this payment in your bank portal and then update the invoice status from the admin panel.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #000000; padding: 14px 26px 20px; text-align: center; border-top: 1px solid #444444;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #777777;">
                This is an automated admin notification.
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
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