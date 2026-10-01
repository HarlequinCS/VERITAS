import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST!,
  port: Number(process.env.MAIL_PORT!),
  secure: false,
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.MAIL_HOST || !process.env.MAIL_FROM) {
    throw new Error("Mail is not configured. Set MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, and MAIL_FROM.");
  }
  await transporter.sendMail({
    from: `"VERITAS" <${process.env.MAIL_FROM!}>`,
    to,
    subject,
    html,
  });
}
