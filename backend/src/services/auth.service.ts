import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel, IUser } from "../models/user.model";
import { AppError } from "../utils/error.utils";
import { UserRole } from "../interfaces/user.interface";
import { config } from "../config";
import { objectId } from "../utils/helpers";

interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = config.jwtSecret as string;
    this.jwtExpiresIn = config.jwtExpiresIn as string;
  }

  private generateToken(user: IUser): string {
    const payload: AuthPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return  jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn as any });
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
  
    const user = await UserModel.create({
      
      name,
      email: email.toLowerCase(),
      hashedPassword,
      role: UserRole.Guest,
    });

    const token = this.generateToken(user);
    return { user, token };
  }

  async signin(
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await UserModel.findOne({ _id: objectId(userId) });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.hashedPassword,
    );
    if (!isValidPassword) {
      throw new AppError("Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.hashedPassword = hashedPassword;
    await user.save();
  }

  async getMe(userId: string): Promise<IUser> {
    const user = await UserModel.findOne({ _id: objectId(userId) });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  verifyToken(token: string): AuthPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthPayload;
    } catch {
      throw new AppError("Invalid token", 401);
    }
  }
}

export const authService = new AuthService();
