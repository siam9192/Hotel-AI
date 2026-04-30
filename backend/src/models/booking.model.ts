import mongoose, { Document, Schema } from "mongoose";
import { Booking, BookingStatus } from "../interfaces/booking.interface";

export interface IBooking extends Document, Booking {}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Confirmed,
    },
  },
  {
    timestamps: true,
  },
);

// Index for querying bookings by user
BookingSchema.index({ userId: 1, createdAt: -1 });
// Index for querying bookings by room
BookingSchema.index({ roomId: 1, status: 1 });

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
