import { AuthUser } from "../middlewares/auth.middleware";
import { Request } from "express";
export interface RequestWithAuthInfo extends Request {
    user?:AuthUser
}