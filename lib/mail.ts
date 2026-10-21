import nodemailer from "nodemailer";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

function gmailPassword(value: string | undefined) {
  return value?.replace(/\s+/g, "") ?? "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function mailSettings() {
  const user = process.env.GMAIL_USER?.trim() ?? "";
  const pass = gmailPassword(process.env.GMAIL_APP_PASSWORD);
  const to = process.env.CONTACT_TO?.trim() || user;
  if (!user || !pass || !to) return null;
  return { user, pass, to };
}

export function contactEmailHtml(input: ContactMessage) {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeHtml(input.message).replaceAll("\n", "<br />");
  const sentAt = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>New contact message</title>
  </head>
  <body style="margin:0;padding:0;background-color:#e8eef8;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#e8eef8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(17,43,83,0.12);">
            <tr>
              <td style="background:linear-gradient(135deg,#112b53 0%,#1d4ed8 100%);padding:28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:10px;background-color:#3b82f6;color:#ffffff;font-size:16px;font-weight:700;vertical-align:middle;">T</span>
                      <span style="display:inline-block;margin-left:10px;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.02em;vertical-align:middle;">TechLab</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:18px;">
                      <p style="margin:0;color:#bfdbfe;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;">Contact form</p>
                      <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.25;letter-spacing:-0.03em;">New message received</h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0 0 20px;color:#64748b;font-size:14px;line-height:1.55;">
                  Someone submitted the public contact form. Reply to this email to answer them directly.
                </p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #e2e8f0;">
                      <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Name</p>
                      <p style="margin:0;color:#0f172a;font-size:16px;font-weight:600;">${name}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;border-bottom:1px solid #e2e8f0;">
                      <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Email</p>
                      <p style="margin:0;">
                        <a href="mailto:${email}" style="color:#1d4ed8;font-size:16px;font-weight:600;text-decoration:none;">${email}</a>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:18px 20px;">
                      <p style="margin:0 0 4px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Sent</p>
                      <p style="margin:0;color:#0f172a;font-size:15px;">${escapeHtml(sentAt)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 32px;">
                <p style="margin:0 0 10px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Message</p>
                <div style="padding:20px;background-color:#ffffff;border:1px solid #e2e8f0;border-left:4px solid #2563eb;border-radius:12px;color:#1e293b;font-size:15px;line-height:1.65;">
                  ${message}
                </div>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                  <tr>
                    <td style="border-radius:10px;background-color:#2563eb;">
                      <a href="mailto:${email}?subject=${encodeURIComponent(`Re: your TechLab message`)}" style="display:inline-block;padding:12px 20px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${name}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
                <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;text-align:center;">
                  TechLab · student shop, courses, and workspace
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

export function contactEmailText(input: ContactMessage) {
  return [
    "New TechLab contact form message",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
}

export async function sendContactEmail(input: ContactMessage) {
  const settings = mailSettings();
  if (!settings) {
    throw new Error(
      "Mail is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env, then restart the app.",
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: settings.user,
      pass: settings.pass,
    },
  });

  await transporter.sendMail({
    from: { name: "TechLab", address: settings.user },
    to: settings.to,
    replyTo: { name: input.name, address: input.email },
    subject: `Contact form: ${input.name}`,
    text: contactEmailText(input),
    html: contactEmailHtml(input),
  });
}
