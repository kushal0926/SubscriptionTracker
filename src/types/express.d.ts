import type { IUser } from "../models/user.model";
import type { HydratedDocument } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<IUser>;
    }
  }
}

export {};
