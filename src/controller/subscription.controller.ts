import type { Request, Response, NextFunction } from "express";
import SubscriptionModel from "../models/subscription.model.ts";
import type {ISubscription, SubscriptionDocument } from "../models/subscription.model.ts";
import { workflowClient } from "../config/upstash.ts";
import { SERVER_URL } from "../config/env.ts";
import { Types } from "mongoose";  

// custom error
type CustomError = Error & {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
  name?: string;
};

//
// creating a new subscription
//
export const createSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
      const subscription: SubscriptionDocument = await SubscriptionModel.create({
          ...req.body as ISubscription,
          user: req.user._id,
      });
    
   try {
       await workflowClient.trigger({
           url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
           body: {
               subscriptionId: subscription._id.toString(),
           },
           headers: {
               "content-type": "application/json",
           },
       })   
   } catch (err) {
      console.error("Workflow trigger failed:", err);
   } 
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

//
// get all subscriptions for the authenticated user
//
export const getAllSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const subscriptions = await SubscriptionModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

//
// getting  user Subscription by Id
//
export const getUserSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid user id format",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // Check if user is accessing their own subscriptions
    if (req.user._id.toString() !== id) {
      return res.status(403).json({
        success: false,
        error: "You can only view your own subscriptions",
      });
    }

    const subscriptions = await SubscriptionModel.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

//
// getting subscriptions by id
//
export const getSubscriptionsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription ID format",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const subscription = await SubscriptionModel.findById(id);

    if (!subscription) {
      const error: CustomError = new Error("Subscriptions not found");
      error.statusCode = 404;
      throw error;
    }

    //verefying if user owns this subscriptions
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Forbidden: You can only view your own subscriptions",
      });
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

//
// updating any subscriptions
//
export const updateSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription id",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const updateData = {
      name: req.body.name,
      price: req.body.price,
      frequency: req.body.frequency,
      category: req.body.category,
      paymentMethod: req.body.paymentMethod,
    };

    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found or unauthorized",
      });
    }

    res.status(200).json({ success: true, data: updatedSubscription });
  } catch (error) {
    next(error);
  }
};

//
// deleting an subscriptions
//
export const deletingSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription id",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    // checking if subscription exists and belongs to user
    const subscription = await SubscriptionModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found or unauthorized",
      });
    }

    await SubscriptionModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Subscription deleted succesfully" });
  } catch (error) {
    next(error);
  }
};

//
// cancellig an subscriptions or settings its status to cancelled
//
export const cancelSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription ID",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const subscription = await SubscriptionModel.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: "Subscription not found or unauthorized",
      });
    }

    if (subscription.status === "cancelled") {
      return res.status(400).json({
        success: false,
        error: "Subscription is already cancelled",
      });
    }

    subscription.status = "cancelled";
    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

//
// getting upcomming subscriptions within the span of 7 days
//
export const upcommingSubscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        error: "Authentication is required",
      });
    }

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingSubscription = await SubscriptionModel.find({
      // Fixed typo
      user: req.user._id,
      status: "active",
      renewalDate: {
        $gte: today,
        $lte: nextWeek,
      },
    }).sort({ renewalDate: 1 });

    return res.status(200).json({
      success: true,
      count: upcomingSubscription.length,
      data: upcomingSubscription,
    });
  } catch (error) {
    next(error);
  }
};
