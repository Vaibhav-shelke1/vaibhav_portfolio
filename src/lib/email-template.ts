/**
 * Confirmation email sent to the person who contacted Vaibhav.
 */
export function getConfirmationEmailHTML(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Thanks for reaching out!</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0e1a;font-family:'Segoe UI',Tahoma,Geneva,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0e1a;padding:48px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- TOP BAR -->
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#00ff88,#00d4ff,#9d4edd);border-radius:3px 3px 0 0;"></td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td style="background-color:#0d1117;border:1px solid #1e293b;border-top:none;padding:28px 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-family:'Courier New',monospace;color:#00ff88;font-size:20px;font-weight:700;letter-spacing:-0.5px;">
                    &gt; vaibhav.shelke
                  </p>
                  <p style="margin:4px 0 0;font-family:'Courier New',monospace;color:#475569;font-size:12px;">
                    Full Stack Developer &nbsp;·&nbsp; v2.0.25
                  </p>
                </td>
                <td align="right">
                  <span style="display:inline-block;font-family:'Courier New',monospace;font-size:10px;color:#00ff88;border:1px solid rgba(0,255,136,0.35);background:rgba(0,255,136,0.07);padding:4px 10px;border-radius:20px;">
                    ● ONLINE
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#111827;border:1px solid #1e293b;border-top:none;padding:40px;">

            <!-- Status comment -->
            <p style="margin:0 0 6px;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
              // HTTP 200 OK &nbsp;·&nbsp; message_received
            </p>

            <!-- Greeting -->
            <h1 style="margin:0 0 20px;color:#e2e8f0;font-size:30px;font-weight:700;line-height:1.2;">
              Hi ${name}! 👋
            </h1>

            <!-- Message -->
            <p style="margin:0 0 16px;color:#94a3b8;font-size:15px;line-height:1.8;">
              Thanks for reaching out — your message has been received and saved successfully.
            </p>
            <p style="margin:0 0 32px;color:#94a3b8;font-size:15px;line-height:1.8;">
              I'll review it and get back to you within
              <strong style="color:#00ff88;">24 hours</strong>.
              In the meantime, feel free to explore my work or connect with me below.
            </p>

            <!-- Receipt card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d1117;border:1px solid #1e293b;border-radius:8px;margin-bottom:36px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 12px;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
                    // receipt.json
                  </p>
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="font-family:'Courier New',monospace;color:#4ade80;font-size:13px;padding:4px 0;">
                        ✓ &nbsp;<span style="color:#64748b;">Message saved to database</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Courier New',monospace;color:#4ade80;font-size:13px;padding:4px 0;">
                        ✓ &nbsp;<span style="color:#64748b;">Notification sent to Vaibhav</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Courier New',monospace;color:#4ade80;font-size:13px;padding:4px 0;">
                        ✓ &nbsp;<span style="color:#64748b;">Response ETA: &lt; 24 hours</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Connect heading -->
            <p style="margin:0 0 16px;font-family:'Courier New',monospace;color:#475569;font-size:11px;">
              // connect_with_me
            </p>

            <!-- Social buttons -->
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:12px;padding-bottom:10px;">
                  <a href="https://www.linkedin.com/in/vaibhav-shelke-264ba22b7"
                    style="display:inline-block;background-color:#0d1117;border:1px solid rgba(0,212,255,0.4);color:#00d4ff;text-decoration:none;padding:11px 22px;border-radius:6px;font-family:'Courier New',monospace;font-size:12px;font-weight:600;">
                    in &nbsp; LinkedIn
                  </a>
                </td>
                <td style="padding-right:12px;padding-bottom:10px;">
                  <a href="https://github.com/Vaibhav-shelke1"
                    style="display:inline-block;background-color:#0d1117;border:1px solid #1e293b;color:#94a3b8;text-decoration:none;padding:11px 22px;border-radius:6px;font-family:'Courier New',monospace;font-size:12px;">
                    ⌥ &nbsp; GitHub
                  </a>
                </td>
                <td style="padding-bottom:10px;">
                  <a href="mailto:shelkevaibhav218@gmail.com"
                    style="display:inline-block;background-color:#0d1117;border:1px solid #1e293b;color:#94a3b8;text-decoration:none;padding:11px 22px;border-radius:6px;font-family:'Courier New',monospace;font-size:12px;">
                    @ &nbsp; Email
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#0d1117;border:1px solid #1e293b;border-top:none;border-radius:0 0 10px 10px;padding:20px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0;font-family:'Courier New',monospace;color:#334155;font-size:11px;">
                    Vaibhav Shelke &nbsp;·&nbsp; +91-8010161242 &nbsp;·&nbsp; shelkevaibhav218@gmail.com
                  </p>
                  <p style="margin:4px 0 0;font-family:'Courier New',monospace;color:#1e293b;font-size:10px;">
                    This is an automated reply. Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}
