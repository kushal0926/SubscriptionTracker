import express from "express";
import type { Express, Request, Response } from "express";
import { PORT } from "./config/env.ts";
import authRouter from "./routes/auth.routes.ts";
import subscriptionRouter from "./routes/subscription.routes.ts";
import userRouter from "./routes/user.routes.ts";
import connectToDatabase from "./database/mongodb.ts";
import errorMiddlware from "./middleware/error.middleware.ts";
import cookieParser from "cookie-parser";
import arjectMiddleware from "./middleware/arject.middleware.ts";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(errorMiddlware);
app.use(arjectMiddleware);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`making the subscription tracking app using typescript`);
});

app.listen(PORT, async () => {
  console.log(
    `THE SUBSCRIPTION TRACKER APP API IS RUNNING IN PORT:http://localhost:${PORT}`,
  );

  await connectToDatabase();
});

export default app;
