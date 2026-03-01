export const generatePaymentConfirmationEmail = (
  customerName: string,
  invoiceNumber: string,
  totalAmount: number,
  paidAmount: number,
  bankName: string,
  paymentDate: string,
  companyName: string,
) => {
  // Convert to numbers in case they come as strings from database (TypeORM decimal issue)
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
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #22c55e, #020617 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #020617; border-radius: 18px; overflow: hidden; border: 1px solid rgba(148,163,184,0.5);">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #22c55e, #16a34a); padding: 22px 26px 18px; text-align: left;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #dcfce7; opacity: 0.9;">
                ${companyName}
              </div>
              <h1 style="margin: 6px 0 0; color: #ecfdf5; font-size: 22px; font-weight: 600;">
                Payment confirmed
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #bbf7d0;">
                Your payment has been successfully verified and added to your account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 10px; font-size: 15px; color: #e5e7eb; line-height: 1.6;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 16px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                We are pleased to confirm that your payment has been successfully verified and processed.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020617; border-radius: 14px; margin-bottom: 20px; border: 1px solid rgba(55,65,81,0.9);">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <h2 style="margin: 0 0 10px; font-size: 15px; color: #bfdbfe;">
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
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Payment Method:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          Bank Transfer (${bankName})
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Payment Amount:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${paidAmountNum.toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Total Invoice Amount:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${totalAmountNum.toFixed(2)} BDT
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 6px 0;">Payment Date:</td>
                        <td style="font-size: 13px; color: #e5e7eb; font-weight: 500; text-align: right; padding: 6px 0;">
                          ${paymentDate}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #9ca3af; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">Status:</td>
                        <td style="font-size: 13px; text-align: right; padding: 10px 0 0; border-top: 1px solid rgba(55,65,81,0.9);">
                          <span style="background-color: #16a34a; color: #ecfdf5; padding: 4px 10px; border-radius: 999px; font-weight: 500; font-size: 11px;">
                            VERIFIED
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 14px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                Thank you for your payment. Your invoice has been updated and the payment has been credited to your account.
              </p>

              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.6;">
                If you have any questions about this payment or your invoice, please contact our support team.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020617; padding: 14px 26px 20px; text-align: center; border-top: 1px solid rgba(55,65,81,0.9);">
              <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280;">
                This is an automated confirmation email.
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

export const generatePaymentRejectionEmail = (
  customerName: string,
  invoiceNumber: string,
  bankName: string,
  amount: number,
  reason?: string,
  companyName?: string,
) => {
  // Convert to number in case it comes as string from database (TypeORM decimal issue)
  const amountNum = Number(amount);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Update - ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: radial-gradient(circle at top, #f97316, #020617 55%); padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #020617; border-radius: 18px; overflow: hidden; border: 1px solid rgba(148,163,184,0.5);">

          <tr>
            <td style="background: radial-gradient(circle at 0% 0%, #fb923c, #ea580c); padding: 22px 26px 18px; text-align: left;">
              <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; color: #ffedd5; opacity: 0.9;">
                ${companyName}
              </div>
              <h1 style="margin: 6px 0 0; color: #fff7ed; font-size: 22px; font-weight: 600;">
                Payment update required
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 24px 26px 26px;">
              <p style="margin: 0 0 10px; font-size: 15px; color: #e5e7eb; line-height: 1.6;">
                Dear <strong>${customerName}</strong>,
              </p>
              
              <p style="margin: 0 0 16px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                We were unable to verify the payment details submitted for invoice <strong>${invoiceNumber}</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(248,250,252,0.02); border-radius: 14px; margin-bottom: 20px; border: 1px solid #f97316;">
                <tr>
                  <td style="padding: 18px 20px 16px;">
                    <p style="margin: 0 0 10px; font-size: 13px; color: #fed7aa;">
                      <strong>Submitted Payment Details:</strong>
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #fed7aa; line-height: 1.6;">
                      Bank: ${bankName}<br>
                      Amount: ${amountNum.toFixed(2)} BDT
                    </p>
                    ${
                      reason
                        ? `<p style="margin: 12px 0 0; font-size: 13px; color: #fed7aa;"><strong>Reason:</strong> ${reason}</p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                <strong>What to do next:</strong>
              </p>
              
              <ul style="margin: 0 0 18px; padding-left: 20px; font-size: 13px; color: #9ca3af; line-height: 1.8;">
                <li>Please verify the payment details and resubmit if necessary</li>
                <li>Ensure the bank transfer was completed successfully</li>
                <li>Contact our support team if you need assistance</li>
              </ul>

              <p style="margin: 0; font-size: 13px; color: #6b7280;">
                Once we receive the correct information, we will review and update your payment status.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #020617; padding: 14px 26px 20px; text-align: center; border-top: 1px solid rgba(55,65,81,0.9);">
              <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280;">
                Need help? Contact our support team.
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
