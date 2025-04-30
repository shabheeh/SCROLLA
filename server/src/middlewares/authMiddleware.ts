import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import CustomError from "../utils/error";

export interface CustomRequest extends Request {
  userId?: string;
}

export const authenticate = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Unauthenticated", 401);
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    throw new CustomError("Invalid or expired token", 401);
  }

  req.userId = decoded.userId;
  next();
};
