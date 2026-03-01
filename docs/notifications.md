## Customer Notifications Service

This feature lets admins broadcast email and SMS messages to customers through the backend. It exposes simple REST endpoints and reuses the shared Nodemailer transport plus a pluggable SMS HTTP provider.

### Key Endpoints

| Method | Path                             | Description                                                 |
| ------ | -------------------------------- | ----------------------------------------------------------- |
| `POST` | `/notifications/email/customers` | Broadcasts an email to all active customers automatically.  |
| `POST` | `/notifications/sms/customers`   | Sends an SMS message to all active customers automatically. |

Both endpoints return `202 Accepted` with a summary payload:

```json
{
  "statusCode": 202,
  "message": "Customer email broadcast triggered",
  "data": {
    "channel": "email",
    "totalRecipients": 25,
    "delivered": 23,
    "failed": 2,
    "failedRecipients": [
      { "userId": 14, "contact": "bob@example.com", "reason": "Mailbox full" }
    ]
  }
}
```

### Request Payloads

#### Email (`POST /notifications/email/customers`)

```json
{
  "subject": "Flash Sale Starts Now",
  "body": "Plain-text fallback message",
  "html": "<p><strong>Flash Sale</strong> is live!</p>"
}
```

- `subject` and `body` are required.
- `html` is optional rich content.
- Recipients are always all active customers; no selection is needed.

#### SMS (`POST /notifications/sms/customers`)

```json
{
  "message": "Your order is ready for pickup. Show code #A92."
}
```

- `message` is required (max 480 chars enforced by DTO).
- Recipients are always all active customers.

### Recipient Selection Rules

- Only users with `role = 'customer'` qualify.
- Users must be active (backend automatically filters out inactive accounts).
- Email broadcasts skip customers without an email address; SMS skips customers without a phone number.
- If no valid recipients remain after filtering, API responds with `404` and message “No customers … were found.”

### Environment Requirements

| Variable                                                         | Purpose                                                      |
| ---------------------------------------------------------------- | ------------------------------------------------------------ |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM?` | Existing Nodemailer transport (already configured globally). |
| `SMS_API_URL`                                                    | Base URL of the SMS provider REST endpoint.                  |
| `SMS_API_KEY`                                                    | Bearer token used in the `Authorization` header.             |
| `SMS_SENDER_ID` (optional)                                       | Overrides default sender ID (`ECOMM`).                       |

When `SMS_API_URL` or `SMS_API_KEY` is missing the backend returns `503 ServiceUnavailable`.

### Frontend Integration Tips

1. **Forms**
   - Email form: subject, body, optional HTML editor. No customer selector required.
   - SMS form: message textarea with char counter. No customer selector required.
2. **Validation**
   - Match backend rules (non-empty strings, SMS length).
   - Ask for confirmation when broadcasting to large audiences.
3. **API Calls**
   - `POST` with `Content-Type: application/json`.
   - Include auth headers (JWT/session) required by the backend.
   - Surface response summary to the user; highlight failures.
4. **Preview & Auditing**
   - Provide preview for HTML emails.
   - Log admin, timestamp, payload summary in UI or audit trail (optional).

### Error Handling Reference

| Status                   | Reason                                                       |
| ------------------------ | ------------------------------------------------------------ |
| `400 BadRequest`         | DTO validation failed (missing subject, SMS too long, etc.). |
| `404 NotFound`           | No customers matched the filters with valid contact info.    |
| `503 ServiceUnavailable` | SMS provider not configured.                                 |

### Future Enhancements (Optional Ideas)

- Queue-based dispatch to handle very large recipient sets.
- Attachments or template IDs for emails.
- Rich delivery logs accessible via API.
- Multi-language templates keyed by customer locale.
