import mongoose, { Document, Schema } from "mongoose";
import { User, UserRole } from "../interfaces/user.interface";


export interface IUser extends Document, User {}

const UserSchema: Schema<IUser> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    profilePictureUrl: {
      type: String,
      default: undefined,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Guest,
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = mongoose.model<IUser>("User", UserSchema);
