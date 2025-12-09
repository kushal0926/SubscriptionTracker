import type { Request, Response, NextFunction} from "express";
import mongoose, { Types } from "mongoose";
import User from "../models/user.model.ts";
import jwt, { SignOptions} from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.ts";

// request body types
interface SignUpRequestBody { // for signUp
    name: string;
    email: string;
    password: string;
};

interface SignInRequestBody { // for signIN
    email: string;
    password: string;
};

// extending request interface with typed body
interface TypedRequest<T> extends Request {
    body: T;
}

// custom error
type CustomError = Error & {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
    name?: string;
}

export const signUp = async (req: TypedRequest<SignUpRequestBody>, res: Response, next: NextFunction) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // checking if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error: CustomError = new Error("User already exists.");
            error.statusCode = 409;
            throw error;
        }

        // hashing password or securing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new users
        const newUsers = new User({ name, email, password: hashedPassword, _id: new Types.ObjectId(), });
        await newUsers.save({ session });

        // Ensure JWT_SECRET is defined
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined.");
        }

        // generate JWT token 
        const token = jwt.sign(
            { userId: newUsers._id },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN } as SignOptions
        );
      

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
            }
        })

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }


};

export const signIn = async (req: TypedRequest<SignInRequestBody>, res: Response, next: NextFunction) => {
    console.log(` ${req}, ${res} ${next}`)

};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    console.log(` ${req}, ${res} ${next}`)

};