import { Client as WorkflowClient } from "@upstash/workflow";

import { QSTASH_URL, QSTASH_TOKEN } from "./env.ts";

export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});
