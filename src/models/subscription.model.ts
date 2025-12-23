import { Schema, model, Document, Types } from "mongoose";

export interface ISubscription {
  name: string;
  price: number;
  currency: "USD" | "EUR" | "NPR";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  category:
    | "entertainment"
    | "lifestyle"
    | "sports"
    | "technology"
    | "news"
    | "software"
    | "finance"
    | "politics"
    | "others";
  paymentMethod: string;
  status: "active" | "expired" | "cancelled";
  startDate: Date;
  renewalDate: Date;
  user: string | Types.ObjectId;
}

export type SubscriptionDocument = ISubscription & Document;

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minLength: 4,
      maxLength: 100,
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "NPR"],
      default: "USD",
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "entertainment",
        "lifestyle",
        "sports",
        "technology",
        "news",
        "software",
        "finance",
        "politics",
        "others",
      ],
      required: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Please select your payment method"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "Select your start date"],
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: "Your start date must be in the past",
      },
    },
    renewalDate: {
      type: Date,
      required: [false, "Select your renewal date"],
      validate: {
        validator: function (value: Date) {
          if (!value) return true;
          const doc = this as SubscriptionDocument;
          return doc.startDate && value > doc.startDate;
        },
        message: "Renewal date must be after the start date",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// auto calculating renewal date if missing
subscriptionSchema.pre("save", async function (this: SubscriptionDocument) {
  if (!this.renewalDate) {
    const renewalPeriods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      yearly: 365,
    };
    const freq = this.frequency || "monthly"; // fallback
    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[freq]);
  }

  // updating the status if renewal date has been passed
  if (this.renewalDate < new Date()) {
    this.status = "expired";
  }
});

const SubscriptionModel = model<SubscriptionDocument>(
  "Subscription",
  subscriptionSchema,
);

export default SubscriptionModel;
