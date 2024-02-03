import env from "@/env";

const nodemailer = require("nodemailer");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.NODEMAILER_EMAIL,
    pass: env.NODEMAILER_PW,
  },
});
