import { UserRole } from "../interfaces/user.interface";
import {  AuthUser } from "../middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
