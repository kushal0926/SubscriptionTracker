import { Router } from "express";
import { setReminders } from "../controller/workflow.controller.ts";

const workflowRouter: Router = Router();

workflowRouter.post("/subscription/reminder", setReminders);

export default workflowRouter;
