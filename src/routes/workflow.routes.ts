import { Router } from "express";
import { setReminders } from "../controller/workflow.controller.ts";

const workflowRouter: Router = Router();

workflowRouter.get("/subscription/reminders", setReminders);

export default workflowRouter;
