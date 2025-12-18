import User from "../models/user.model.ts";
import type { Request, Response, NextFunction } from "express";

// custom error
type CustomError = Error & {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
  name?: string;
};

//
// getting all users
//
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

//
// getting only one user by Id
//
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error: CustomError = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
