import { sendEmail } from "./mailer";

export async function sendWelcomeEmail({
  email,
  username,
  method,
}: {
  email: string;
  username: string;
  method: "Email & Password" | "Google" | "GitHub";
}) {
  await sendEmail({
    to: email,
    subject: "Welcome to VERITAS — your scanner workspace is ready",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Welcome to VERITAS</title>
  <style>
    @media only screen and (max-width:540px) {
      .wrap { padding: 24px 12px !important; }
      .card { border-radius: 12px !important; }
      .pad  { padding-left: 24px !important; padding-right: 24px !important; }
      .h1   { font-size: 20px !important; }
      .body { font-size: 13px !important; }
      .btn  { padding: 13px 28px !important; font-size: 13px !important; }
      .logo { height: 28px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#050B14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">

<table class="wrap" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050B14;">
  <tr>
    <td align="center" style="padding:48px 16px;">

      <!-- CARD -->
      <table class="card" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#0A1428;border-radius:16px;border:1px solid #152545;">

        <!-- top accent line -->
        <tr>
          <td height="3" style="padding:0;border-radius:16px 16px 0 0;background:linear-gradient(90deg,#0088FF,#00CCFF,#0088FF);font-size:0;line-height:0;">&nbsp;</td>
        </tr>

        <!-- HEADER -->
        <tr>
          <td class="pad" align="center" style="padding:40px 40px 0;">
            <img class="logo" src="https://saifuliqbal.dev/veritaslogo.png" alt="VERITAS" width="160" height="32" style="display:block;border:0;outline:none;height:32px;width:auto;max-width:100%;">
          </td>
        </tr>

        <!-- GREETING -->
        <tr>
          <td class="pad" align="center" style="padding:28px 40px 0;">
            <p style="margin:0;font-size:11px;color:#0088FF;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Welcome${username ? `, ${username}` : ""}</p>
            <h1 class="h1" style="margin:10px 0 0;font-size:24px;font-weight:600;color:#ffffff;line-height:1.3;letter-spacing:-0.2px;">
              Your workspace is ready
            </h1>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td class="pad" align="left" style="padding:16px 40px 0;">
            <p class="body" style="margin:0;font-size:14px;color:#94A3B8;line-height:1.7;">
              You're now signed in with <strong style="color:#00CCFF;font-weight:600;">${method}</strong>. Your VERITAS workspace is configured and ready — no setup required.
            </p>
            <p class="body" style="margin:14px 0 0;font-size:14px;color:#94A3B8;line-height:1.7;">
              Launch your first scan to discover vulnerabilities, capture visual proof, and receive AI-generated remediation patches — all within minutes.
            </p>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td class="pad" align="center" style="padding:26px 40px 0;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="border-radius:10px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth"
                     class="btn"
                     style="display:inline-block;padding:14px 40px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;background:linear-gradient(135deg,#0088FF,#00CCFF);">
                    Go to workspace
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
          <td class="pad" align="center" style="padding:36px 40px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="height:1px;background-color:#152545;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="pad" align="center" style="padding:18px 40px 32px;">
            <p style="margin:0;font-size:11px;color:#334155;letter-spacing:2px;text-transform:uppercase;">
              Scan &nbsp;&middot;&nbsp; Prove &nbsp;&middot;&nbsp; Patch
            </p>
            <p style="margin:10px 0 0;font-size:10px;color:#1E293B;line-height:1.5;">
              VERITAS &mdash; Web Vulnerability Scanner &amp; AI Remediation
            </p>
          </td>
        </tr>

      </table>

      <!-- LEGAL -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
        <tr>
          <td align="center" style="padding:20px 16px 0;">
            <p style="margin:0;font-size:10px;color:#1E293B;line-height:1.4;">
              You received this email because an account was created for VERITAS using this address.
            </p>
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>

</body>
</html>`,
  });
}
