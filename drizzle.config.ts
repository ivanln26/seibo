import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config());

export default {
  schema: "./src/db/schema.ts",
  connectionString: process.env.DATABASE_URL,
} satisfies Config;
