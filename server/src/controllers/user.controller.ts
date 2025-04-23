import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs"
import { userModel } from "../models/user.model";
import CustomError from "../utils/error";

export const userSignup = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userData } = req.body;

        const email = userData.email

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            throw new CustomError("User with this email already exists", 400)
        }

        const password = userData.password;

        const hashedPassword = bcrypt.hash(password, 10);

        
    } catch (error) {
        
    }
}