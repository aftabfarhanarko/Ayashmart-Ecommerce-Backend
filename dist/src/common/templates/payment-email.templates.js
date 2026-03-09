"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentRejectionEmail = exports.generatePaymentConfirmationEmail = void 0;
const generatePaymentConfirmationEmail = (customerName, invoiceNumber, totalAmount, paidAmount, bankName, paymentDate, companyName) => {
    const totalAmountNum = Number(totalAmount);
    const paidAmountNum = Number(paidAmount);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Confirmation - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f5f5f5, #000000 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); padding: 22px 26px 18px; text-align: left; color: #f5f5f5;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #f5f5f5; opacity: 0.9;">
                ${companyName}
              </div>
              <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                Payment confirmed
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #e5e5e5;">
                Your payment has been successfully verified and added to your account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5; line-height: 1.6;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 16px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                We are pleased to confirm that your payment has been successfully verified and processed.
              </p>

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
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Payment Method:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          Bank Transfer (${bankName})
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Payment Amount:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${paidAmountNum.toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Total Invoice Amount:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${totalAmountNum.toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 6px 0;">Payment Date:</td>
                        <td style="font-size: 13px; color: #f5f5f5; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${paymentDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #cccccc; padding: 10px 0 0; border-top: 1px solid #444444;">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid #444444;">
                          <span style="background-color: #111111; color: #ffffff; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 14px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                Thank you for your payment. Your invoice has been updated and the payment has been credited to your account.
              </p>

              <p style="margin: 0; font-size: 13px; color: #999999; line-height: 1.6;">
                If you have any questions about this payment or your invoice, please contact our support team.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #000000; padding: 14px 26px 20px; text-align: center; border-top: 1px solid #444444;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #777777;">
                This is an automated confirmation email.
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
exports.generatePaymentConfirmationEmail = generatePaymentConfirmationEmail;
const generatePaymentRejectionEmail = (customerName, invoiceNumber, bankName, amount, reason, companyName) => {
    const amountNum = Number(amount);
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Update - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f5f5f5, #000000 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); padding: 22px 26px 18px; text-align: left; color: #f5f5f5;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #f5f5f5; opacity: 0.9;">
                ${companyName}
              </div>
              <h1 style="margin: 6px 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">
                Payment update required
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5; line-height: 1.6;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 16px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                We were unable to verify the payment details submitted for invoice <strong>${invoiceNumber}</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(0,0,0,0.1); border-radius: 14px; margin-bottom: 20px; border: 1px solid #444444;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <p style="margin: 0 0 10px; font-size: 13px; color: #f5f5f5;">
                      <strong>Submitted Payment Details:</strong>
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #f5f5f5; line-height: 1.6;">
                      Bank: ${bankName}<br>
                      Amount: ${amountNum.toFixed(2)} BDT
                    </p>
                    ${reason
        ? `<p style="margin: 12px 0 0; font-size: 13px; color: #f5f5f5;"><strong>Reason:</strong> ${reason}</p>`
        : ''}
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 14px; color: #cccccc; line-height: 1.7;">
                <strong>What to do next:</strong>
              </p>
              
              <ul style="margin: 0 0 18px; padding-left: 20px; font-size: 13px; color: #cccccc; line-height: 1.8;">
                <li>Please verify the payment details and resubmit if necessary</li>
                <li>Ensure the bank transfer was completed successfully</li>
                <li>Contact our support team if you need assistance</li>
              </ul>

              <p style="margin: 0; font-size: 13px; color: #999999;">
                Once we receive the correct information, we will review and update your payment status.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #000000; padding: 14px 26px 20px; text-align: center; border-top: 1px solid #444444;">
              <p style="margin: 0 0 4px; font-size: 11px; color: #777777;">
                Need help? Contact our support team.
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
exports.generatePaymentRejectionEmail = generatePaymentRejectionEmail;
//# sourceMappingURL=payment-email.templates.js.map