import express from "express";
import type { Express, Request, Response } from "express";
import { PORT } from "./config/env.ts"

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send(`making the subscription tracking app using typescript`);
});

app.listen(PORT, () => {
  console.log(`THE SUBSCRIPTION TRACKER APP API IS RUNNING IN PORT: http://localhost:${PORT}`);
});

export default app;