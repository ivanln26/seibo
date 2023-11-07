import Link from "next/link";
import { getUserSchools } from "@/db/queries";
import Button from "@/components/button";
import { redirect } from "next/dist/server/api-utils";

var nodemailer = require("nodemailer");

async function sendMail(subject: string, toEmail: string, otpText: string) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PW,
    },
  });

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail,
    subject: subject,
    text: otpText,
  };

  return await transporter.sendMail(mailOptions);
}

export const revalidate = 0;

export default async function Page() {
  const schools = await getUserSchools();

  async function sape(data: FormData){
    "use server"
    const subject = String(data.get("subject"))
    const toEmail = String(data.get("email"))
    const optText = String(data.get("optText"))
    if (!subject) return;
    const res = await sendMail(subject, toEmail, optText)
    if(res.accepted.length !== 1){
      console.log("error al enviar el mail")
      return;
    }
    console.log(res)
  }

  return (
    <main className="flex justify-center items-center w-full h-[100svh]">
      <section className="flex flex-col justify-center items-center gap-y-8 px-4 py-8 bg-primary-100 dark:bg-primary-700 rounded-xl">
        <h1 className="text-4xl text-primary-900 dark:text-primary-100">
          Enviar mail
        </h1>
        <form action={sape}>
          <input name="email" type="email" />
          <input name="subject" type="text" />
          <input name="optText" type="text" />
          <Button type="submit">enviar</Button>
        </form>
      </section>
    </main>
  );
}
