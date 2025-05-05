import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model";
import CustomError from "../utils/error";
import { HttpStatusCode } from "../constants/httpStatusCodes";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { ResponseMessage } from "../constants/responseMessages";
import { CustomRequest } from "src/middlewares/authMiddleware";
import { deleteData, retrieveData, storeData } from "../utils/cacheService";
import { sendEmail } from "../utils/mailer";
import { generateOTP } from "../helpers/otpGenerator";

export const userSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userData = req.body;

  const email = req.body.email;

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new CustomError(
      "User with this email already exists",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const password = userData.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  userData.password = hashedPassword;

  const otp = generateOTP();

  userData.otp = otp;

  await storeData(userData.email, JSON.stringify(userData), 600);

  await sendEmail(
    userData.email,
    "Verify Your Email",
    undefined,
    `<h1>OTP Verification</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
     <p>This OTP will expire in 5 minutes.</p>`
  );

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    email,
  });
};

export const verfiyOtp = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  const userData = await retrieveData(email);

  if (!userData) {
    throw new CustomError(
      "session timed out retry again",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const parsedUserData = JSON.parse(userData);

  const isOtpMatch = parsedUserData.otp === otp;

  if (!isOtpMatch) {
    throw new CustomError("Incorrect otp", HttpStatusCode.BAD_REQUEST);
  }

  await deleteData(email);

  await userModel.create(parsedUserData);
  res.status(HttpStatusCode.CREATED).json({ success: true });
};

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const userData = await retrieveData(email);

  if (!userData) {
    throw new CustomError(
      "Session Timed out please try again",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const parsedUserData = JSON.parse(userData);

  const otp = generateOTP();

  parsedUserData.otp = otp;

  await storeData(parsedUserData.email, JSON.stringify(parsedUserData), 600);

  await sendEmail(
    parsedUserData.email,
    "Verify Your Email",
    undefined,
    `<h1>OTP Verification</h1>
    <p>Your OTP is: <strong>${otp}</strong></p>
     <p>This OTP will expire in 5 minutes.</p>`
  );

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
  });
};

export const userSignin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid Credentials", HttpStatusCode.BAD_REQUEST);
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new CustomError("Invalid Credentials", HttpStatusCode.BAD_REQUEST);
  }

  const accessToken = generateAccessToken((user._id as string).toString());
  const refreshToken = generateRefreshToken((user._id as string).toString());

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(HttpStatusCode.OK).json({
    success: true,
    messsage: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    user: user,
    token: accessToken,
  });
};

export const getRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new CustomError(
      "Refresh token not found",
      HttpStatusCode.UNAUTHORIZED
    );
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new CustomError(
      "Invalid or expired token",
      HttpStatusCode.UNAUTHORIZED
    );
  }

  const newAccessToken = generateAccessToken(decoded.userId);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    token: newAccessToken,
  });
};

export const getUser = async (req: CustomRequest, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Unauthenticated", HttpStatusCode.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new CustomError("Token found Found", HttpStatusCode.NOT_FOUND);
  }
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new CustomError("Invalid or expired token", HttpStatusCode.FORBIDDEN);
  }

  req.userId = decoded.userId;

  const user = await userModel.findById(req.userId).select("-password");

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
    user,
  });
};

export const userSignout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("refreshToken");

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
  });
};

export const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userData = req.body;
  const userId = req.userId;

  const updatedUser = await userModel.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.RESOURCE_UPDATED,
    user: updatedUser,
  });
};

export const changePassword = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new CustomError(
      "Missing required fileds",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) {
    throw new CustomError(
      "Incorrect current passwrod",
      HttpStatusCode.BAD_REQUEST
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userModel.findByIdAndUpdate(userId, { password: hashedPassword });

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: ResponseMessage.SUCCESS.OPERATION_SUCCESSFUL,
  });
};
