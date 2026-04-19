export function getAdminNotificationEmailHTML(
  name: string,
  email: string,
  message: string
): string {
  const escapedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#09090b;padding:24px 32px;">
              <p style="margin:0;font-family:'Courier New',monospace;color:#00ff88;font-size:17px;font-weight:700;">&gt; vaibhav.shelke / alerts</p>
              <p style="margin:4px 0 0;color:#71717a;font-size:12px;">New contact message · ${timestamp} IST</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 20px;color:#09090b;font-size:20px;font-weight:700;">New message from ${name}</h2>

              <!-- Sender info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:6px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;color:#52525b;font-size:14px;"><strong style="color:#09090b;">Name:</strong> ${name}</p>
                    <p style="margin:0;color:#52525b;font-size:14px;"><strong style="color:#09090b;">Email:</strong> <a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></p>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:#71717a;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
                    <p style="margin:0;color:#3f3f46;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>

              <!-- Reply button -->
              <a href="mailto:${email}?subject=Re: Your message to Vaibhav Shelke"
                style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f5;padding:14px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:11px;">Portfolio admin alert · do not forward</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
