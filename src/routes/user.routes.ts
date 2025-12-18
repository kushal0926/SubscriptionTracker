import { Router } from "express";
import type { Request, Response } from "express";
import { getUser, getUsers } from "../controller/user.controller.ts";
import authorize from "../middleware/auth.middleware.ts";

const userRouter: Router = Router();

userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUser);

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
