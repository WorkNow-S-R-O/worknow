import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // eslint-disable-next-line no-undef
  host: process.env.SMTP_HOST,
  // eslint-disable-next-line no-undef
  port: process.env.SMTP_PORT || 465,
  secure: true,
  auth: {
    // eslint-disable-next-line no-undef
    user: process.env.SMTP_USER,
    // eslint-disable-next-line no-undef
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to, subject, html) {
  return transporter.sendMail({
    // eslint-disable-next-line no-undef
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
} 