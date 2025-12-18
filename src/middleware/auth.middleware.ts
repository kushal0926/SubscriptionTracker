import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.ts";
import type { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/env.ts";

type CustomError = Error & {
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message: string }>;
  name?: string;
};

const authorize = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        
        if(!token) {
            return res.status(401).json({ message: "Unauthorized"})
            
        }
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        
        const user = await User.findById(decoded.userId)
        
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        
        req.user = user;
        
    next()
    } catch (error) {
        const err = error as CustomError;
        res.status(400).json({ message: "Unauthorized", error: err.message });
    }
}


export default authorize;