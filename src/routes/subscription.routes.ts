import { Router } from "express";
import authorize from "../middleware/auth.middleware.ts";
import {
    cancelSubscriptions,
  createSubscription,
  deletingSubscriptions,
  getAllSubscriptions,
  getSubscriptionsById,
  getUserSubscriptions,
  upcommingSubscriptions,
  updateSubscriptions,
} from "../controller/subscription.controller.ts";

const subscriptionRouter: Router = Router();

// getting all subscriptions for authenticated users
subscriptionRouter.get("/", authorize, getAllSubscriptions);
// getting upcomming renewals
subscriptionRouter.get("/upcomming-renewals", authorize, upcommingSubscriptions);
// getting single subscriptions by id
subscriptionRouter.get("/:id", authorize, getSubscriptionsById);
//creating any new subscriptions
subscriptionRouter.post("/", authorize, createSubscription);
// updating subscription
subscriptionRouter.put("/:id", authorize, updateSubscriptions);
// getting user subscriptions through id
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
// canceling any subscriptions
subscriptionRouter.get("/:id/cancel", authorize, cancelSubscriptions);
// deleteing subscriptions
subscriptionRouter.delete("/:id", authorize, deletingSubscriptions);

export default subscriptionRouter;
