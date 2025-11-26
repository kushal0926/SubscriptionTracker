import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
  quiet: true // disabling the tips of dotenv shown in the console
});

// export environment variables
export const PORT: string = process.env.PORT || "5500";
export const NODE_ENV = process.env;