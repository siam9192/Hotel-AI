import { BookingModel, IBooking } from "../models/booking.model";
import { BookingStatus } from "../interfaces/booking.interface";
import { AppError } from "../utils/error.utils";

export class BookingService {
  /**
   * Create a new booking
   */
  async create(data: Partial<IBooking>): Promise<IBooking> {
    const booking = new BookingModel(data);
    return booking.save();
  }

  /**
   * Find booking by ID
   */
  async findById(id: string): Promise<IBooking | null> {
    return BookingModel.findOne({ id });
  }

  /**
   * Find bookings by user ID with filters
   */
  async findByUserId(
    userId: string,
    filters?: {
      status?: BookingStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<IBooking[]> {
    const query: any = { userId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      query.checkOutDate = {};
      if (filters.startDate) {
        query.checkOutDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.checkOutDate.$lte = filters.endDate;
      }
    }

    return BookingModel.find(query).sort({ createdAt: -1 });
  }

  /**
   * Find bookings by room ID with filters
   */
  async findByRoomId(
    roomId: string,
    filters?: {
      status?: BookingStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<IBooking[]> {
    const query: any = { roomId };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      query.checkInDate = {};
      if (filters.startDate) {
        query.checkInDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.checkInDate.$lte = filters.endDate;
      }
    }

    return BookingModel.find(query).sort({ createdAt: -1 });
  }

  /**
   * Find bookings with multiple filters
   */
  async findWithFilters(filters: {
    userId?: string;
    roomId?: string;
    status?: BookingStatus;
    startDate?: Date;
    endDate?: Date;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<IBooking[]> {
    const query: any = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.roomId) {
      query.roomId = filters.roomId;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.startDate || filters.endDate) {
      query.checkInDate = {};
      if (filters.startDate) {
        query.checkInDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.checkInDate.$lte = filters.endDate;
      }
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.totalPrice = {};
      if (filters.minPrice !== undefined) {
        query.totalPrice.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.totalPrice.$lte = filters.maxPrice;
      }
    }

    return BookingModel.find(query).sort({ createdAt: -1 });
  }

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: BookingStatus): Promise<IBooking> {
    const booking = await BookingModel.findOneAndUpdate(
      { id },
      { status },
      { new: true },
    );
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    return booking;
  }

  /**
   * Update booking
   */
  async update(id: string, data: Partial<IBooking>): Promise<IBooking> {
    const booking = await BookingModel.findOneAndUpdate({ id }, data, {
      new: true,
    });
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    return booking;
  }

  /**
   * Delete booking
   */
  async delete(id: string): Promise<IBooking> {
    const booking = await BookingModel.findOneAndDelete({ id });
    if (!booking) {
      throw new AppError("Booking not found", 404);
    }
    return booking;
  }

  /**
   * Check if room is available for date range
   */
  async isRoomAvailable(
    roomId: string,
    checkInDate: Date,
    checkOutDate: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const query: any = {
      roomId,
      status: { $ne: BookingStatus.Cancelled },
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate },
        },
      ],
    };

    if (excludeBookingId) {
      query.id = { $ne: excludeBookingId };
    }

    const conflictingBookings = await BookingModel.find(query);
    return conflictingBookings.length === 0;
  }

  /**
   * Get booking statistics for a user
   */
  async getUserBookingStats(userId: string): Promise<{
    total: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  }> {
    const stats = await BookingModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };

    stats.forEach((s) => {
      result[s._id as keyof typeof result] = s.count;
      result.total += s.count;
    });

    return result;
  }
}

export const bookingService = new BookingService();
