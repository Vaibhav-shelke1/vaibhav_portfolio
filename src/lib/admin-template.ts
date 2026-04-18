/**
 * Admin notification email sent to Vaibhav when someone contacts him.
 */
export function getAdminNotificationEmailHTML(
  name: string,
  email: string,
  message: string
): string {
  const escapedMessage = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Segoe UI',Tahoma,Geneva,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e1a;padding:48px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- ALERT TOP BAR -->
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#ffd32a,#ff6b35);border-radius:3px 3px 0 0;"></td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td style="background-color:#0d1117;border:1px solid #1e293b;border-top:none;padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-family:'Courier New',monospace;color:#00ff88;font-size:18px;font-weight:700;">
                    &gt; vaibhav.shelke / alerts
                  </p>
                  <p style="margin:4px 0 0;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
                    Portfolio Admin Dashboard
                  </p>
                </td>
                <td align="right">
                  <span style="display:inline-block;font-family:'Courier New',monospace;font-size:10px;color:#ffd32a;border:1px solid rgba(255,211,42,0.4);background:rgba(255,211,42,0.07);padding:4px 10px;border-radius:20px;">
                    ⚡ NEW MESSAGE
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#111827;border:1px solid #1e293b;border-top:none;padding:40px;">

            <!-- Alert title -->
            <h2 style="margin:0 0 8px;color:#e2e8f0;font-size:22px;font-weight:700;">
              You have a new message 📬
            </h2>
            <p style="margin:0 0 32px;color:#64748b;font-size:13px;font-family:'Courier New',monospace;">
              Received: ${timestamp} IST
            </p>

            <!-- Sender info card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#0d1117;border:1px solid #1e293b;border-radius:8px;margin-bottom:20px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
                    // sender_info
                  </p>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="padding:6px 0;border-bottom:1px solid #1e293b;">
                        <span style="font-family:'Courier New',monospace;color:#64748b;font-size:12px;display:inline-block;width:80px;">Name</span>
                        <span style="font-family:'Courier New',monospace;color:#00d4ff;font-size:13px;font-weight:600;">${name}</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <span style="font-family:'Courier New',monospace;color:#64748b;font-size:12px;display:inline-block;width:80px;">Email</span>
                        <a href="mailto:${email}"
                          style="font-family:'Courier New',monospace;color:#00ff88;font-size:13px;font-weight:600;text-decoration:none;">
                          ${email}
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Message card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background-color:#0d1117;border:1px solid #1e293b;border-radius:8px;margin-bottom:32px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 14px;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
                    // message_body
                  </p>
                  <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.8;white-space:pre-wrap;">
${escapedMessage}
                  </p>
                </td>
              </tr>
            </table>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;">
                  <a href="mailto:${email}?subject=Re: Your message to Vaibhav Shelke"
                    style="display:inline-block;background-color:#00ff88;color:#0a0e1a;text-decoration:none;padding:12px 28px;border-radius:6px;font-family:'Courier New',monospace;font-size:13px;font-weight:700;">
                    → Reply Now
                  </a>
                </td>
                <td>
                  <a href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
                    style="display:inline-block;background-color:#0d1117;border:1px solid rgba(0,212,255,0.4);color:#00d4ff;text-decoration:none;padding:12px 24px;border-radius:6px;font-family:'Courier New',monospace;font-size:13px;">
                    LinkedIn
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- DB INFO -->
        <tr>
          <td style="background-color:#0d1117;border:1px solid #1e293b;border-top:none;padding:16px 40px;">
            <p style="margin:0;font-family:'Courier New',monospace;color:#334155;font-size:11px;">
              ✓ &nbsp;Saved to <span style="color:#475569;">neondb → contact_messages</span>
              &nbsp;·&nbsp; portfolio.db
            </p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0d1117;border:1px solid #1e293b;border-top:1px solid #111827;border-radius:0 0 10px 10px;padding:16px 40px;">
            <p style="margin:0;font-family:'Courier New',monospace;color:#1e293b;font-size:10px;">
              vaibhav.shelke portfolio &nbsp;·&nbsp; automated admin alert &nbsp;·&nbsp; do not forward
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
