import { Router } from "express";
import type { Request, Response } from "express";
const subscriptionRouter: Router = Router();

subscriptionRouter.post("/", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for all" });
});

subscriptionRouter.get("/:id", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for ids" });
});

subscriptionRouter.post("/", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for creating" });
});

subscriptionRouter.put("/:id", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for update" });
});

subscriptionRouter.delete("/:id", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for delete" });
});

subscriptionRouter.get("/user/:id", (req: Request, res: Response) => {
  res.send({ title: "subscription routes for user ids" });
});

subscriptionRouter.get("/:id/cancel", (req: Request, res: Response) => {
  res.send({ title: "subscription routes cancelling" });
});

subscriptionRouter.get("/upcomming-renewals", (req: Request, res: Response) => {
  res.send({ title: "subscription routes cancelling" });
});

export default subscriptionRouter;
