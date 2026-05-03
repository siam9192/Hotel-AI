import { Response,NextFunction } from "express";
import { RequestWithAuthInfo } from "../interfaces/utils.interface";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

type AsyncHandler = (
  req: RequestWithAuthInfo,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const catchAsync = (fn: AsyncHandler) => {
  return (
    req: RequestWithAuthInfo,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};