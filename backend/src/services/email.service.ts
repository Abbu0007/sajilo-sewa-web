import nodemailer from "nodemailer";
import { config } from "../config";

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendOtpEmail(to: string, subject: string, otp: string) {
    const appName = process.env.APP_NAME || "Sajilo Sewa";

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>${appName}</h2>
        <p>${subject}</p>
        <p style="font-size:20px;letter-spacing:2px;"><b>${otp}</b></p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject: `${appName} - ${subject}`,
      html,
    });
  }
}