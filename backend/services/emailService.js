// backend/services/emailService.js
require("dotenv").config();
const nodemailer = require("nodemailer");

let sendGridApiKey = process.env.SENDGRID_API_KEY;
let FROM_EMAIL = process.env.FROM_EMAIL || "noreply@yourapp.com";

async function sendWithSendGrid(to, subject, html) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(sendGridApiKey);
  const msg = {
    to,
    from: FROM_EMAIL,
    subject,
    html,
  };
  return sgMail.send(msg);
}

async function sendWithSMTP(to, subject, html) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });
}

/**
 * sendEmail: auto-select SendGrid if available, else SMTP.
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 */
async function sendEmail(to, subject, html) {
  if (sendGridApiKey) {
    return sendWithSendGrid(to, subject, html);
  } else {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      throw new Error(
        "No email provider configured. Set SENDGRID_API_KEY or SMTP_* env vars."
      );
    }
    return sendWithSMTP(to, subject, html);
  }
}

module.exports = { sendEmail };
