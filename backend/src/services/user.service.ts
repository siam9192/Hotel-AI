import { UserModel, IUser } from "../models/user.model";
import { UserRole } from "../interfaces/user.interface";
import { AppError } from "../utils/error.utils";

export class UserService {
  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }

  async findById(id: string): Promise<IUser> {
    const user = await UserModel.findOne({ id });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  async findAll(): Promise<IUser[]> {
    return UserModel.find();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findOneAndUpdate({ id }, data, { new: true });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async delete(id: string): Promise<IUser> {
    const user = await UserModel.findOneAndDelete({ id });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async findByRole(role: UserRole): Promise<IUser[]> {
    return UserModel.find({ role });
  }
}

export const userService = new UserService();
