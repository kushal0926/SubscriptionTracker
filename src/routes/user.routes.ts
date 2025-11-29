import { Router } from "express";
import type { Request, Response } from "express";

const userRouter: Router = Router();

userRouter.get("/", (req: Request, res: Response) => {
  res.send({ title: "user routes to get all users" });
});

userRouter.get("/:id", (req: Request, res: Response) => {
  res.send({ title: "user routes to get details" });
});

userRouter.post("/", (req: Request, res: Response) => {
  res.send({ title: "user routes to creating new users" });
});

userRouter.put("/:id", (req: Request, res: Response) => {
  res.send({ title: "user routes to updating new users" });
});

userRouter.delete("/:id", (req: Request, res: Response) => {
  res.send({ title: "user routes to deleting users" });
});

export default userRouter;
