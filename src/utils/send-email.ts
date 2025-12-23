import dayjs from "dayjs";
import transporter, { accountEmail } from "../config/nodemailer.config.ts";
import type { EmailTemplateData } from "./email-template.ts";
import  { emailTemplates } from "./email-template.ts";


interface SendReminderEmailParams {
  to: string;
  type: string;
  subscription: Subscription;
};

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


export const sendReminderEmail = async({to, type, subscription}: SendReminderEmailParams): Promise<void> => {
    if (!to || !type) throw new Error("Missing required parameters");
    
    const template = emailTemplates.find((t) => t.label === type);
    
    if (!template) throw new Error("Invalid Email Type");
    
    const mailInfo: Omit<EmailTemplateData, "daysLeft"> = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
        accountSettingsLink: "https://primevideo.com/settings", 
        supportLink: "https://primevideo.com/support",
    };
    
    const message = template.generateBody(mailInfo as EmailTemplateData);
    const subject = template.generateSubject(mailInfo as EmailTemplateData);
    
    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, "Error sending email");
        console.log("Email sent:" + info.response)
    })
}