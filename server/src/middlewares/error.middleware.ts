import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/error";

const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);

  const statusCode = (err as CustomError).statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export default errorHandler;
