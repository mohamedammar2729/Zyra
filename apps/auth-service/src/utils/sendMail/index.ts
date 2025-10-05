import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render an EJS Email Template

const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, any>
): Promise<string> => {
  // process.cwd() → gives the current working directory (the main root of your project).
  // "auth-service/src/utils/email-templates/" → the folder where templates are stored.
  const templatePath = path.join(
    process.cwd(),
    "apps",
    "auth-service",
    "src",
    "utils",
    "email-templates",
    `${templateName}.ejs`
  );
  const template = await ejs.renderFile(templatePath, data);
  return template;
};

// Send an Email using nodemailer
export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string, // name of the template file without .ejs extension
  templateData: Record<string, any>
) => {
  try {
    const html = await renderEmailTemplate(templateName, templateData);
    await transporter.sendMail({
      from: `<${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.log("Error sending email:", error);
    return false;
  }
};
