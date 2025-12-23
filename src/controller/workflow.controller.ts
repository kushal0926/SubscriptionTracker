// responsible for sending reminders
import dayjs from "dayjs";
import { serve } from "@upstash/workflow/express";
import SubscriptionModel from "../models/subscription.model.ts";
import { WorkflowContext } from "@upstash/workflow";
import { sendReminderEmail } from "../utils/send-email.ts";

const REMINDERS = [7, 5, 2, 1];

interface Subscription {
 user: {
   name: string;
   email: string;
 };
 name: string;
 status: string; 
 renewalDate: Date | string;
 currency: string;
 price: number | string;
 frequency: string;
 paymentMethod: string;
};

interface RequestPayload {
  subscriptionId: string;
}

export const setReminders = serve<RequestPayload>(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if (!subscription || subscription.status !== "active") return;
  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
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
): Promise<void> => {
  console.log(`Sleeping until ${label} reminder at ${date}`);

  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (
  context: WorkflowContext<RequestPayload>,
  label: string,
  subscription: Subscription,
): Promise<void> => {
    return await context.run(label, async () => {
       console.log(`Triggering ${label} reminder`);
       
       if (!subscription.user?.email) {
             throw new Error("Subscription user email is missing");
        };
        
        if(!subscription) {
            throw new Error("Subscription not found");
        };
           
           
       await sendReminderEmail({
         to: subscription.user.email,
         type: label,
         subscription,
       })
  });
};
