export interface Booking {
    id: string;
    userId: string;
    roomId: string;
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