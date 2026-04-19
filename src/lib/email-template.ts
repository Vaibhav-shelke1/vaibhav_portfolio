export function getConfirmationEmailHTML(name: string, message: string): string {
  const escapedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out!</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Tahoma,Geneva,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e4e4e7;">

          <!-- Header -->
          <tr>
            <td style="background:#09090b;padding:24px 32px;">
              <p style="margin:0;font-family:'Courier New',monospace;color:#00ff88;font-size:17px;font-weight:700;">&gt; vaibhav.shelke</p>
              <p style="margin:4px 0 0;color:#71717a;font-size:12px;font-family:'Courier New',monospace;">Full Stack Developer</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <h2 style="margin:0 0 12px;color:#09090b;font-size:22px;font-weight:700;">Hi ${name},</h2>
              <p style="margin:0 0 20px;color:#52525b;font-size:15px;line-height:1.7;">
                Thanks for reaching out! I've received your message and will get back to you within <strong>24 hours</strong>.
              </p>

              <!-- Message recap -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 8px;color:#71717a;font-size:11px;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:0.05em;">Your message</p>
                    <p style="margin:0;color:#3f3f46;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapedMessage}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;color:#52525b;font-size:14px;line-height:1.6;">
                In the meantime, feel free to explore my work or connect with me:
              </p>

              <!-- Links -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <a href="https://github.com/Vaibhav-shelke1" style="display:inline-block;background:#09090b;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">GitHub</a>
                  </td>
                  <td>
                    <a href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7" style="display:inline-block;background:#0a66c2;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:600;">LinkedIn</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f5;padding:16px 32px;border-top:1px solid #e4e4e7;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">Vaibhav Shelke · shelkevaibhav218@gmail.com</p>
              <p style="margin:4px 0 0;color:#d4d4d8;font-size:11px;">This is an automated reply — please do not respond to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
