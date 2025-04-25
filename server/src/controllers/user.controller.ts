import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model";
import CustomError from "../utils/error";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ResponseMessage } from "../constants/responseMessages";

export const userSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = req.body;

  const email = req.body.email;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new CustomError("User with this email already exists", 400);
  }

  const password = userData.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  userData.password = hashedPassword;

  await userModel.create(userData);

  res.status(HttpStatusCode.CREATED).json({ success: true });
};

export const userSigin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid Credentials", 400);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("Invalid Credentials", 400);
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HttpStatusCode.OK).json({
    success: true,
    messsage: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    user: user,
    token: accessToken,
  });
};

export const getRefreshToken = (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new CustomError("Refresh token not found", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new CustomError("Invalid or expired token", 401);
  }

  const newAccessToken = generateAccessToken(decoded.userId);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    token: newAccessToken,
  });
};
