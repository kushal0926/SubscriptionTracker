import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
  quiet: true, // disabling the tips of dotenv shown in the console
});

// export environment variables
export const PORT: string = process.env.PORT || "5500";
export const SERVER_URL: string = process.env.SERVER_URL || "http://localhost:5500";
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const MONGODB_URI: string = process.env.MONGODB_URI || "";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "";
export const ARJECT_KEY: string = process.env.ARJECT_KEY || "";
export const ARJECT_ENV: string = process.env.ARJECT_KEY || "development";
export const QSTASH_URL: string = process.env.QSTASH_URL || "";
export const QSTASH_TOKEN: string = process.env.QSTASH_TOKEN || "";
export const QSTASH_CURRENT_SIGNING_KEY: string =
  process.env.QSTASH_CURRENT_SIGNING_KEY || "";
export const QSTASH_NEXT_SIGNING_KEY: string =
  process.env.QSTASH_NEXT_SIGNING_KEY || "";
