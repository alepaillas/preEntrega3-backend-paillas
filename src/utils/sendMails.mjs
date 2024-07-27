import nodemailer from "nodemailer";
import envConfig from "../config/env.config.mjs";

export const sendMail = async (email, subject, message, template) => {
  const attachmentURI = new URL("../public/img/gatito.jpg", import.meta.url);
  const attachmentPath = attachmentURI.pathname;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: "alepaillas@gmail.com",
      pass: envConfig.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "alepaillas@gmail.com",
    to: email,
    subject,
    text: message,
    html: template,
    attachments: [
      {
        filename: "gatito.jpg",
        path: attachmentPath,
        cid: "gatito",
      },
    ],
  });
};
