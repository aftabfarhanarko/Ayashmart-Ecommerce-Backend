"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderPlacedEmail = generateOrderPlacedEmail;
exports.generateOrderProcessingEmail = generateOrderProcessingEmail;
exports.generateOrderShippedEmail = generateOrderShippedEmail;
exports.generateOrderDeliveredEmail = generateOrderDeliveredEmail;
const baseStyles = {
    wrapper: 'margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #000000; color: #ffffff;',
    outerTable: 'background: radial-gradient(circle at top, #f5f5f5, #000000 55%); padding: 24px 0;',
    container: 'background-color: #000000; border-radius: 18px; overflow: hidden; max-width: 640px; width: 100%; border: 1px solid #444444;',
    header: 'padding: 20px 26px 16px;',
    content: 'padding: 24px 26px 26px;',
    footer: 'background-color: #000000; padding: 16px 26px 20px; text-align: center; border-top: 1px solid #444444;',
};
function generateOrderPlacedEmail(customerName, orderId, totalAmount, productList, storeName) {
    const amount = Number(totalAmount);
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Received</title></head>
<body style="${baseStyles.wrapper}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${baseStyles.outerTable}">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="${baseStyles.container}">
        <tr>
          <td style="${baseStyles.header}; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.9;">
              ${storeName}
            </div>
            <div style="margin-top: 6px; font-size: 22px; font-weight: 600; color: #ffffff;">
              Order received ✓
            </div>
            <p style="margin: 6px 0 0; font-size: 13px; color: #dddddd;">
              Thank you for shopping with us. Your order is now in queue.
            </p>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.content}">
            <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5;">Hi ${customerName},</p>
            <p style="margin: 0 0 16px; font-size: 14px; color: #cccccc; line-height: 1.7;">
              We have received your order <strong>#${orderId}</strong>. You will get updates as soon as the status changes.
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 14px; overflow: hidden; border: 1px solid #444444; background-color: #000000;">
              <tr>
                <td style="padding: 16px 18px 14px;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #ffffff;">Order summary</h3>
                  <p style="margin: 3px 0; font-size: 13px; color: #f5f5f5;">
                    <strong>Order ID:</strong> #${orderId}
                  </p>
                  <p style="margin: 6px 0 10px; font-size: 13px; color: #cccccc; line-height: 1.6;">
                    ${productList}
                  </p>
                  <p style="margin: 0; font-size: 14px; color: #ffffff; font-weight: 600;">
                    Total: ${amount.toFixed(2)} BDT
                  </p>
                </td>
              </tr>
            </table>

            <p style="margin: 18px 0 0; font-size: 12px; color: #999999;">
              You will receive another email when your order is processed and shipped.
            </p>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.footer}">
            <p style="margin: 0; font-size: 11px; color: #777777;">
              © ${new Date().getFullYear()} ${storeName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
function generateOrderProcessingEmail(customerName, orderId, storeName, trackingUrl, trackingId) {
    const trackingCta = trackingUrl
        ? `<table cellpadding="0" cellspacing="0" style="margin-top: 16px;">
        <tr>
          <td>
            <a href="${trackingUrl}" style="display: inline-block; padding: 10px 18px; border-radius: 999px; background: linear-gradient(to right, #ffffff, #111111); color: #000000; font-size: 13px; font-weight: 600; text-decoration: none;">
              Track your order${trackingId ? ` (#${trackingId})` : ""}
            </a>
          </td>
        </tr>
      </table>`
        : "";
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Processing</title></head>
<body style="${baseStyles.wrapper}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${baseStyles.outerTable}">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="${baseStyles.container}">
        <tr>
          <td style="${baseStyles.header}; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.9; color: #f5f5f5;">
              ${storeName}
            </div>
            <div style="margin-top: 6px; font-size: 22px; font-weight: 600; color: #ffffff;">
              Order is being processed
            </div>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.content}">
            <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5;">Hi ${customerName},</p>
            <p style="margin: 0 0 16px; font-size: 14px; color: #cccccc; line-height: 1.7;">
              Great news! Your order <strong>#${orderId}</strong> is now being prepared for shipment.
            </p>

            <div style="margin-top: 4px; padding: 14px 16px; border-radius: 12px; border: 1px solid #444444; background-color: #111111;">
              <p style="margin: 0; font-size: 13px; color: #f5f5f5;">
                We’ll send you another email with tracking details as soon as your package is on the way.
              </p>
            </div>

            ${trackingCta}

            <p style="margin: 18px 0 0; font-size: 12px; color: #999999;">
              Thank you for your patience.
            </p>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.footer}">
            <p style="margin: 0; font-size: 11px; color: #777777;">
              © ${new Date().getFullYear()} ${storeName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
function generateOrderShippedEmail(customerName, orderId, trackingId, provider, storeName, trackingUrl) {
    const trackingInfo = trackingId
        ? `<p style="margin: 10px 0 0; font-size: 13px; color: #e5e7eb;">Tracking ID: <strong>${trackingId}</strong>${provider ? ` (${provider})` : ''}</p>`
        : '';
    const trackingCta = trackingUrl
        ? `<table cellpadding="0" cellspacing="0" style="margin-top: 14px;">
        <tr>
          <td>
            <a href="${trackingUrl}" style="display: inline-block; padding: 10px 18px; border-radius: 999px; background: linear-gradient(to right, #ffffff, #111111); color: #000000; font-size: 13px; font-weight: 600; text-decoration: none;">
              Track your order${trackingId ? ` (#${trackingId})` : ""}
            </a>
          </td>
        </tr>
      </table>`
        : '';
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Shipped</title></head>
<body style="${baseStyles.wrapper}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${baseStyles.outerTable}">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="${baseStyles.container}">
        <tr>
          <td style="${baseStyles.header}; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.9; color: #f5f5f5;">
              ${storeName}
            </div>
            <div style="margin-top: 6px; font-size: 22px; font-weight: 600; color: #ffffff;">
              Your order is on the way 🚚
            </div>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.content}">
            <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5;">Hi ${customerName},</p>
            <p style="margin: 0 0 14px; font-size: 14px; color: #cccccc; line-height: 1.7;">
              Your order <strong>#${orderId}</strong> has been shipped and is on its way to you.
            </p>

            <div style="margin-top: 6px; padding: 14px 16px; border-radius: 12px; border: 1px solid #444444; background-color: #111111;">
              <p style="margin: 0; font-size: 13px; color: #f5f5f5;">
                Estimated delivery time may vary based on the courier. You can use the tracking details below to follow your package.
              </p>
              ${trackingInfo}
              ${trackingCta}
            </div>

            <p style="margin: 18px 0 0; font-size: 12px; color: #999999;">
              Thank you for choosing ${storeName}.
            </p>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.footer}">
            <p style="margin: 0; font-size: 11px; color: #777777;">
              © ${new Date().getFullYear()} ${storeName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
function generateOrderDeliveredEmail(customerName, orderId, storeName) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Delivered</title></head>
<body style="${baseStyles.wrapper}">
  <table width="100%" cellpadding="0" cellspacing="0" style="${baseStyles.outerTable}">
    <tr><td align="center">
      <table cellpadding="0" cellspacing="0" style="${baseStyles.container}">
        <tr>
          <td style="${baseStyles.header}; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
            <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.9; color: #f5f5f5;">
              ${storeName}
            </div>
            <div style="margin-top: 6px; font-size: 22px; font-weight: 600; color: #ffffff;">
              Order delivered ✓
            </div>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.content}">
            <p style="margin: 0 0 10px; font-size: 15px; color: #f5f5f5;">Hi ${customerName},</p>
            <p style="margin: 0 0 14px; font-size: 14px; color: #cccccc; line-height: 1.7;">
              Your order <strong>#${orderId}</strong> has been delivered successfully.
            </p>

            <p style="margin: 0 0 18px; font-size: 14px; color: #f5f5f5;">
              We hope everything arrived in perfect condition. Your feedback helps us improve your experience.
            </p>

            <p style="margin: 0; font-size: 12px; color: #999999;">
              Thank you for shopping with ${storeName}.
            </p>
          </td>
        </tr>
        <tr>
          <td style="${baseStyles.footer}">
            <p style="margin: 0; font-size: 11px; color: #777777;">
              © ${new Date().getFullYear()} ${storeName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
//# sourceMappingURL=order-status-email.templates.js.map