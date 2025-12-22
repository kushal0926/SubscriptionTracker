// responsible for sending reminders
import dayjs from "dayjs";
import { serve } from "@upstash/workflow/express";
import SubscriptionModel from "../models/subscription.model.ts";
import { WorkflowContext } from "@upstash/workflow";

const REMINDERS = [7, 5, 2, 1];

interface RequestPayload {
  subscriptionId: string;
}

interface Subscription {
  _id: string;
  status: string;
  renewalDate: Date;
  user?: {
    name: string;
    email: string;
  };
}

export const setReminders = serve<RequestPayload>(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date has passed for Subscription ${subscriptionId}. Stopping workflow`,
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    // Skip past reminders
    if (reminderDate.isBefore(dayjs())) {
      continue;
    }

    const label = `Reminder-${subscriptionId}-${daysBefore}`;

    await sleepUntilReminder(context, label, reminderDate);
    await triggerReminder(context, label);
  }
});

export const fetchSubscription = async (
  context: WorkflowContext<RequestPayload>,
  subscriptionId: string,
): Promise<Subscription | null> => {
  return await context.run("get Subscription", async () => {
    return SubscriptionModel.findById(subscriptionId)
      .populate("user", "name email")
      .lean<Subscription>(); // using lean to return a plain js object
  });
};

const sleepUntilReminder = async (
  context: WorkflowContext<RequestPayload>,
  label: string,
  date: dayjs.Dayjs,
) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);

  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: WorkflowContext<RequestPayload>,
  label: string,
) => {
  return await context.run(label, () => {
    console.log(`Triggering ${label} reminder`);
  });
};
