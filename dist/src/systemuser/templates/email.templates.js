"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = void 0;
class EmailTemplates {
    static formatFeatureName(feature) {
        return feature
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    static getUserUpdateTemplate(user, newPassword) {
        const companyName = (user && user.companyName) || '';
        const packageInfo = user.package
            ? `
            <h3 style="font-size: 15px; margin: 0 0 10px; color: #111111;">Your Package</h3>
            <ul style="padding-left: 18px; margin: 0; font-size: 13px; color: #444444;">
              <li><strong>Package Name:</strong> ${user.package.name}</li>
              <li><strong>Description:</strong> ${user.package.description}</li>
              <li><strong>Price:</strong> $${user.package.price}</li>
              ${user.package.discountPrice
                ? `<li><strong>Discount Price:</strong> $${user.package.discountPrice}</li>`
                : ''}
              ${user.package.features && user.package.features.length > 0
                ? `<li><strong>Features / Permissions:</strong>
                      <ul style="margin: 6px 0 0 14px; padding: 0;">
                        ${user.package.features
                    .map((f) => `<li style="margin: 2px 0;">${this.formatFeatureName(f)}</li>`)
                    .join('')}
                      </ul>
                    </li>`
                : ''}
            </ul>
          `
            : '';
        const passwordSection = newPassword
            ? `
              <div style="margin-top: 18px; padding: 16px 18px; border-radius: 12px; border: 1px solid #444444; background-color: #f9f9f9;">
                <h3 style="margin: 0 0 8px; font-size: 15px; color: #111111;">Your updated login credentials</h3>
                <p style="margin: 4px 0; font-size: 13px; color: #222222;">
                  <strong>Email:</strong>
                  <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont;">${user.email}</span>
                </p>
                <p style="margin: 4px 0 10px; font-size: 13px; color: #222222;">
                  <strong>New password:</strong>
                  <span style="font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background-color: #eeeeee; padding: 4px 10px; border-radius: 999px; font-size: 13px; display: inline-block;">
                    ${newPassword}
                  </span>
                </p>
                <p style="margin: 0; font-size: 12px; color: #666666;">
                  For security, please update this password from your account settings after login.
                </p>
              </div>
            `
            : '';
        return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password updated - ${companyName}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111111;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f5f5f5; padding: 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.18);">
            <tr>
              <td style="padding: 20px 28px; background: radial-gradient(circle at 0% 0%, #ffffff, #111111); color: #f5f5f5;">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.9;">
                  ${companyName}
                </div>
                <div style="margin-top: 6px; font-size: 18px; font-weight: 600; color: #ffffff;">
                  Password updated successfully
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 26px 28px 28px; color: #111111;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #111111;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="margin: 0 0 16px; font-size: 14px; color: #444444; line-height: 1.7;">
                  Your account password for <strong>${companyName}</strong> has been updated.
                  Below are your current account details.
                </p>

                ${passwordSection}

                <div style="margin-top: 20px; padding: 16px 18px; border-radius: 12px; border: 1px solid #dddddd; background-color: #f9f9f9;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #111111;">Account information</h3>
                  <p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Email:</strong> ${user.email}</p>
                  <p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Company ID:</strong> ${user.companyId}</p>
                  <p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Company name:</strong> ${companyName}</p>
                  ${user.phone
            ? `<p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Phone:</strong> ${user.phone}</p>`
            : ''}
                  ${user.branchLocation
            ? `<p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Branch location:</strong> ${user.branchLocation}</p>`
            : ''}
                </div>

                ${user.package
            ? `
                <div style="margin-top: 18px; padding: 15px 16px; border-radius: 12px; border: 1px solid #dddddd; background-color: #ffffff;">
                  ${packageInfo}
                </div>
                `
            : ''}

                <div style="margin-top: 18px; padding: 14px 16px; border-radius: 12px; border: 1px solid #dddddd; background-color: #f9f9f9;">
                  <p style="margin: 0; font-size: 12px; color: #333333;">
                    If you did not request this change, please contact the ${companyName} support team immediately.
                  </p>
                </div>

                <p style="margin: 20px 0 0; font-size: 13px; color: #666666;">
                  Best regards,<br />
                  <span style="font-weight: 500;">${companyName} Team</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 28px 20px; background-color: #f9f9f9; border-top: 1px solid #dddddd; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #777777;">
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
    }
    static getWelcomeEmailTemplate(user, password) {
        const companyName = (user && user.companyName) || '';
        const packageInfo = user.package
            ? `
            <h3 style="font-size: 15px; margin: 0 0 10px; color: #111827;">Your package details</h3>
            <ul style="padding-left: 18px; margin: 0; font-size: 13px; color: #4b5563;">
              <li><strong>Package Name:</strong> ${user.package.name}</li>
              <li><strong>Description:</strong> ${user.package.description}</li>
              <li><strong>Price:</strong> $${user.package.price}</li>
              ${user.package.discountPrice
                ? `<li><strong>Discount Price:</strong> $${user.package.discountPrice}</li>`
                : ''}
              ${user.package.features && user.package.features.length > 0
                ? `<li><strong>Features / Permissions:</strong>
                      <ul style="margin: 6px 0 0 14px; padding: 0;">
                        ${user.package.features
                    .map((f) => `<li style="margin: 2px 0;">${this.formatFeatureName(f)}</li>`)
                    .join('')}
                      </ul>
                    </li>`
                : ''}
            </ul>
          `
            : '';
        return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to ${companyName}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding: 28px 0; background: radial-gradient(circle at top, #f5f5f5, #000000 55%);">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">
            <tr>
              <td style="padding: 20px 26px 16px; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.14em; opacity: 0.95;">
                  ${companyName}
                </div>
                <div style="margin-top: 6px; font-size: 22px; font-weight: 600; color: #f9fafb;">
                  Welcome on board
                </div>
                <p style="margin: 6px 0 0; font-size: 13px; color: #c7d2fe;">
                  Your account has been created successfully. Sign in and start managing your store.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 26px 26px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #e5e7eb;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="margin: 0 0 18px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                  Here are your account credentials and company details. Keep them in a safe place.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-radius: 14px; overflow: hidden; border: 1px solid rgba(55, 65, 81, 0.9); background: radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.06), transparent 50%);">
                  <tr>
                    <td style="padding: 18px 20px 16px;">
                      <h3 style="margin: 0 0 10px; font-size: 15px; color: #f9fafb;">Login credentials</h3>
                      <p style="margin: 4px 0; font-size: 13px; color: #e5e7eb;">
                        <strong>Email:</strong>
                        <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont;">${user.email}</span>
                      </p>
                      <p style="margin: 4px 0 8px; font-size: 13px; color: #e5e7eb;">
                        <strong>Password:</strong>
                        <span style="font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background-color: #020617; padding: 4px 10px; border-radius: 999px; border: 1px solid rgba(55, 65, 81, 0.9); font-size: 13px; display: inline-block;">
                          ${password}
                        </span>
                      </p>
                      <p style="margin: 10px 0 0; font-size: 12px; color: #9ca3af;">
                        For your security, please change this password after your first login.
                      </p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 18px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(55, 65, 81, 0.8); background-color: #020617;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <h3 style="margin: 0 0 8px; font-size: 15px; color: #f9fafb;">Company profile</h3>
                      <p style="margin: 3px 0; font-size: 13px; color: #e5e7eb;">
                        <strong>Company name:</strong> ${companyName}
                      </p>
                      <p style="margin: 3px 0; font-size: 13px; color: #e5e7eb;">
                        <strong>Company ID:</strong> ${user.companyId}
                      </p>
                      ${user.branchLocation
            ? `<p style="margin: 3px 0; font-size: 13px; color: #e5e7eb;"><strong>Branch location:</strong> ${user.branchLocation}</p>`
            : ''}
                      ${user.phone
            ? `<p style="margin: 3px 0; font-size: 13px; color: #e5e7eb;"><strong>Phone:</strong> ${user.phone}</p>`
            : ''}
                    </td>
                  </tr>
                </table>

                ${user.package
            ? `
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 18px; border-radius: 14px; overflow: hidden; border: 1px solid rgba(55, 65, 81, 0.7); background-color: #020617;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      ${packageInfo}
                    </td>
                  </tr>
                </table>
                `
            : ''}

                <p style="margin: 20px 0 0; font-size: 13px; color: #9ca3af;">
                  Best regards,<br />
                  <span style="font-weight: 500; color: #e5e7eb;">${companyName} Team</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 26px 20px; background-color: #020617; border-top: 1px solid rgba(55, 65, 81, 0.9); text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #6b7280;">
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
    }
    static getPasswordResetTemplate(user, resetLink) {
        const companyName = (user && user.companyName) || '';
        return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password reset request - ${companyName}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding: 28px 0; background: radial-gradient(circle at top, #f5f5f5, #000000 55%);">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #000000; border-radius: 18px; overflow: hidden; border: 1px solid #444444;">
            <tr>
              <td style="padding: 20px 24px 16px; background: radial-gradient(circle at 0% 0%, #f5f5f5, #111111); color: #f5f5f5;">
                <div style="font-size: 14px; font-weight: 600;">
                  ${companyName} password reset
                </div>
                <p style="margin: 4px 0 0; font-size: 13px; color: #dcfce7;">
                  We received a request to reset your account password.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 22px 24px 24px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #e5e7eb;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="margin: 0 0 16px; font-size: 14px; color: #9ca3af; line-height: 1.7;">
                  Click the button below to set a new password for your account.
                  This link will expire in <strong>1 hour</strong>.
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 10px auto 4px;">
                  <tr>
                    <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #ffffff, #111111);">
                      <a href="${resetLink}" style="display: inline-block; padding: 11px 32px; text-decoration: none; color: #000000; font-size: 14px; font-weight: 600;">
                        Reset password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 12px 0 0; font-size: 11px; color: #6b7280; text-align: center;">
                  If the button does not work, copy and paste this URL into your browser:
                </p>
                <p style="margin: 4px 0 0; font-size: 11px; color: #9ca3af; word-break: break-all; text-align: center;">
                  ${resetLink}
                </p>

                <div style="margin-top: 18px; padding: 12px 14px; border-radius: 12px; border: 1px solid #444444; background-color: rgba(0, 0, 0, 0.15);">
                  <p style="margin: 0; font-size: 11px; color: #f5f5f5;">
                    If you did not request a password reset, you can safely ignore this email.
                  </p>
                </div>

                <p style="margin: 18px 0 0; font-size: 12px; color: #9ca3af;">
                  Best regards,<br />
                  <span style="font-weight: 500; color: #e5e7eb;">${companyName} Team</span>
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
    }
    static getInvoicePaidStoreReadyTemplate(user, password, subdomainUrl) {
        const companyName = (user && user.companyName) || '';
        return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your store is ready - ${companyName}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding: 26px 0; background-color: #e5e7eb;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);">
            <tr>
              <td style="padding: 22px 28px 18px; background: linear-gradient(135deg, #ffffff, #111111); color: #f5f5f5;">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.9;">
                  ${companyName} · Store setup complete
                </div>
                <div style="margin-top: 6px; font-size: 20px; font-weight: 600;">
                  Your store is now ready
                </div>
                <p style="margin: 6px 0 0; font-size: 13px; color: #f5f5f5;">
                  You can log in and start customizing your storefront immediately.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 28px 26px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #111827;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563; line-height: 1.7;">
                  Your payment has been confirmed and your store subdomain is ready. Use the details below to access your admin panel.
                </p>

                <div style="margin-top: 8px; padding: 16px 18px; border-radius: 12px; border: 1px solid #dddddd; background-color: #f9f9f9;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #111111;">Login details</h3>
                  <p style="margin: 4px 0; font-size: 13px; color: #222222;">
                    <strong>Email:</strong>
                    <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont;">${user.email}</span>
                  </p>
                  <p style="margin: 4px 0; font-size: 13px; color: #222222;">
                    <strong>Temporary password:</strong>
                    <span style="font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background-color: #eeeeee; padding: 4px 10px; border-radius: 999px; font-size: 13px; display: inline-block;">
                      ${password}
                    </span>
                  </p>
                  <p style="margin: 8px 0 0; font-size: 12px; color: #444444;">
                    Please change this password from your profile settings after you log in.
                  </p>
                </div>

                <div style="margin-top: 16px; padding: 16px 18px; border-radius: 12px; border: 1px solid #dddddd; background-color: #f9f9f9;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #111111;">Store URL</h3>
                  <p style="margin: 4px 0 10px; font-size: 13px; color: #222222;">
                    <strong>Subdomain:</strong>
                  </p>
                  <p style="margin: 0; font-size: 13px;">
                    <a href="${subdomainUrl}" style="color: #000000; text-decoration: underline; font-weight: 500;">
                      ${subdomainUrl}
                    </a>
                  </p>
                </div>

                <p style="margin: 20px 0 0; font-size: 13px; color: #6b7280;">
                  Best wishes for your business,<br />
                  <span style="font-weight: 500;">${companyName} Team</span>
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
    }
    static getPackageUpgradeTemplate(user, oldPackage, newPackage) {
        const companyName = (user && user.companyName) || '';
        return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Package upgraded - ${companyName}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #e5e7eb; padding: 24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.16);">
            <tr>
              <td style="padding: 20px 28px; background: linear-gradient(135deg, #ffffff, #111111); color: #f5f5f5;">
                <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; opacity: 0.9;">
                  ${companyName}
                </div>
                <div style="margin-top: 6px; font-size: 20px; font-weight: 600; color: #ffffff;">
                  Package upgraded
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 24px 28px 26px; color: #111827;">
                <p style="margin: 0 0 12px; font-size: 15px; color: #111827;">
                  Hi ${user.name || 'there'},
                </p>
                <p style="margin: 0 0 16px; font-size: 14px; color: #4b5563; line-height: 1.7;">
                  Your subscription package has been successfully upgraded. Here’s a quick summary of the change.
                </p>

                ${oldPackage
            ? `
                <div style="margin-top: 8px; padding: 14px 16px; border-radius: 12px; border: 1px solid #fed7aa; background-color: #fffbeb;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #92400e;">Previous package</h3>
                  <p style="margin: 3px 0; font-size: 13px; color: #92400e;">
                    <strong>${oldPackage.name}</strong> – $${oldPackage.price}
                  </p>
                </div>
                `
            : ''}

                <div style="margin-top: 14px; padding: 14px 16px; border-radius: 12px; border: 1px solid #dddddd; background-color: #f9f9f9;">
                  <h3 style="margin: 0 0 8px; font-size: 15px; color: #111111;">New package</h3>
                  <p style="margin: 3px 0; font-size: 13px; color: #222222;">
                    <strong>${newPackage.name}</strong> – $${newPackage.price}
                  </p>
                  ${newPackage.discountPrice
            ? `<p style="margin: 3px 0; font-size: 13px; color: #222222;"><strong>Discount Price:</strong> $${newPackage.discountPrice}</p>`
            : ''}
                  ${newPackage.features && newPackage.features.length > 0
            ? `<div style="margin-top: 6px; font-size: 13px; color: #222222;">
                          <strong>Features / Permissions:</strong>
                          <ul style="margin: 6px 0 0 16px; padding: 0;">
                            ${newPackage.features
                .map((f) => `<li style="margin: 2px 0;">${this.formatFeatureName(f)}</li>`)
                .join('')}
                          </ul>
                        </div>`
            : ''}
                </div>

                <p style="margin: 20px 0 0; font-size: 13px; color: #6b7280;">
                  Thank you for choosing ${companyName}. We’re excited to support the next stage of your growth.
                </p>

                <p style="margin: 10px 0 0; font-size: 13px; color: #6b7280;">
                  Best regards,<br />
                  <span style="font-weight: 500;">${companyName} Team</span>
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
    }
}
exports.EmailTemplates = EmailTemplates;
//# sourceMappingURL=email.templates.js.map