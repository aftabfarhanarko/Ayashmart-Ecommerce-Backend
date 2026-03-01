"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBankPaymentAdminNotification = exports.generateNewInvoiceAdminNotification = exports.generatePaymentRejectionEmail = exports.generatePaymentConfirmationEmail = void 0;
var payment_email_templates_1 = require("./payment-email.templates");
Object.defineProperty(exports, "generatePaymentConfirmationEmail", { enumerable: true, get: function () { return payment_email_templates_1.generatePaymentConfirmationEmail; } });
Object.defineProperty(exports, "generatePaymentRejectionEmail", { enumerable: true, get: function () { return payment_email_templates_1.generatePaymentRejectionEmail; } });
var admin_notification_templates_1 = require("./admin-notification.templates");
Object.defineProperty(exports, "generateNewInvoiceAdminNotification", { enumerable: true, get: function () { return admin_notification_templates_1.generateNewInvoiceAdminNotification; } });
Object.defineProperty(exports, "generateBankPaymentAdminNotification", { enumerable: true, get: function () { return admin_notification_templates_1.generateBankPaymentAdminNotification; } });
//# sourceMappingURL=index.js.map