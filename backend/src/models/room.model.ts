import mongoose, { Document, Schema } from "mongoose";
import { Room, RoomType } from "../interfaces/room.interface";

export interface IRoom extends Document, Room {}

const RoomSchema: Schema<IRoom> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(RoomType),
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const RoomModel = mongoose.model<IRoom>("Room", RoomSchema);
