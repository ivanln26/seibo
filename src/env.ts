import { z } from "zod";

const env = z.object({
  DATABASE_URL: z.string(),
  NODEMAILER_EMAIL: z.string().email(),
  NODEMAILER_PW: z.string(),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof env> {}
  }
}

const variables = env.parse(process.env);

export default variables;
