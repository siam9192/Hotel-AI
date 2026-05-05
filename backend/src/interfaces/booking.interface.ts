import { Types } from "mongoose";

export interface Booking {
    userId: string;
    roomId: Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    totalPrice: number;
    status: BookingStatus;
}

export enum BookingStatus {
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Completed = "Completed"
}