import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { catchAsync } from "../utils/error.utils";

export class AuthController {
  signup = catchAsync(async (req, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    const { user, token } = await authService.signup(name, email, password);
    res.status(201).json({ user, token });
  });

  signin = catchAsync(async (req, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const { user, token } = await authService.signin(email, password);
    res.json({ user, token });
  });

  changePassword = catchAsync(async (req, res: Response) => {
    const { id } = req.params as { id: string };
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new Error("Current password and new password are required");
    }

    await authService.changePassword(id, currentPassword, newPassword);
    res.json({ message: "Password changed successfully" });
  });

  getMe = catchAsync(async (req, res: Response) => {
    const { id } = req.params as { id: string };
    const user = await authService.getMe(id);
    res.json(user);
  });
}

export const authController = new AuthController();
