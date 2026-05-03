
import { roomService } from "../services/room.service";
import { bookingService } from "../services/booking.service";

import { BookingStatus } from "../interfaces/booking.interface";
import { AppError } from "../utils/error.utils";
import { RoomModel } from "../models/room.model";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";

/**
 * Book a room - uses database for storage
 * @param options - Booking details
 * @returns Booking confirmation
 */

const bookRoomSchema = z.object({
  roomNumber: z.number(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  guestId: z.string(),
});

export const bookRoomTool: DynamicStructuredTool<typeof bookRoomSchema> = tool(
  async function ({
    roomNumber,
    checkInDate,
    checkOutDate,
    guestId,
  }: z.infer<typeof bookRoomSchema>): Promise<any> {
    try {
      // Validate dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const now = new Date();

      if (checkIn < now) {
        return `Error: Check-in date cannot be in the past. Please select a future date.`;
      }

      if (checkOut <= checkIn) {
        return `Error: Check-out date must be after check-in date.`;
      }

      // Find the room by number
      const room = await roomService.findByNumber(String(roomNumber));
      if (!room) {
        return `Error: Room ${roomNumber} not found.`;
      }

      if (!room.availability) {
        return `Error: Room ${roomNumber} is not available.`;
      }

      // Check for conflicting bookings
      const isAvailable = await bookingService.isRoomAvailable(
        room.id,
        checkIn,
        checkOut,
      );
      if (!isAvailable) {
        return `Error: Room ${roomNumber} is not available for selected dates.`;
      }

      // Calculate total price
      const nights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalPrice = room.price * nights;

      // Create booking in database
      const bookingId = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const booking = await bookingService.create({
        id: bookingId,
        userId: guestId,
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice,
        status: BookingStatus.Confirmed,
      });

      // Mark room as unavailable
      await roomService.toggleAvailability(room.id);

      return {
        success: true,
        booking: {
          id: booking.id,
          roomNumber: room.number,
          roomId: room.id,
          checkInDate: booking.checkInDate.toISOString(),
          checkOutDate: booking.checkOutDate.toISOString(),
          guestId: booking.userId,
          status: booking.status,
          totalPrice: booking.totalPrice,
          nights,
          createdAt: (booking as any).createdAt?.toISOString(),
        },
      };
    } catch (error) {
      return `Error: Failed to book room. ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "bookRoom",
    description:
      "Book a room by providing room number, check-in date, check-out date, and guest ID. Dates should be in ISO format (YYYY-MM-DD).",
  },
);

/**
 * Cancel a booking - uses database
 * @param options - Booking cancellation details
 * @returns Cancellation confirmation
 */
const cancelBookingSchema = z.object({
  bookingId: z.string(),
  guestId: z.string(),
});

export const cancelBookingTool: DynamicStructuredTool<
  typeof cancelBookingSchema
> = tool(
  async function ({
    bookingId,
    guestId,
  }: z.infer<typeof cancelBookingSchema>): Promise<any> {
    try {
      // Fetch booking from database
      const booking = await bookingService.findById(bookingId);

      if (!booking) {
        return `Error: Booking not found.`;
      }

      // Verify guest owns the booking
      if (booking.userId !== guestId) {
        return `Error: Unauthorized to cancel this booking.`;
      }

      // Check if booking can be cancelled
      if (booking.status === BookingStatus.Cancelled) {
        return `Error: Booking is already cancelled.`;
      }

      if (booking.status === BookingStatus.Completed) {
        return `Error: Cannot cancel a completed booking.`;
      }

      // Update booking status in database
      await bookingService.updateStatus(bookingId, BookingStatus.Cancelled);

      // Make room available again
      const room = await roomService.findById(booking.roomId);
      if (room && !room.availability) {
        await roomService.toggleAvailability(room.id);
      }

      return {
        success: true,
        message: "Booking cancelled successfully",
        booking: {
          id: booking.id,
          status: BookingStatus.Cancelled,
          cancelledAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      return `Error: Failed to cancel booking. ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "cancelBooking",
    description:
      "Cancel an existing booking by providing the booking ID and guest ID.",
  },
);

/**
 * Get booking details - uses database with filters
 * @param options - Booking lookup details
 * @returns Booking details
 */
const getBookingDetailsSchema = z.object({
  bookingId: z.string(),
  guestId: z.string(),
});

export const getBookingDetailsTool: DynamicStructuredTool<
  typeof getBookingDetailsSchema
> = tool(
  async function ({
    bookingId,
    guestId,
  }: z.infer<typeof getBookingDetailsSchema>): Promise<any> {
    try {
      // Fetch booking from database
      const booking = await bookingService.findById(bookingId);

      if (!booking) {
        return `Error: Booking not found.`;
      }

      // Verify guest owns the booking
      if (booking.userId !== guestId) {
        return `Error: Unauthorized to view this booking.`;
      }

      // Get room details
      const room = await roomService.findById(booking.roomId);

      return {
        success: true,
        booking: {
          id: booking.id,
          room: room
            ? {
                id: room.id,
                number: room.number,
                type: room.type,
                description: room.description,
                amenities: room.amenities,
              }
            : null,
          checkInDate: booking.checkInDate.toISOString(),
          checkOutDate: booking.checkOutDate.toISOString(),
          guestId: booking.userId,
          status: booking.status,
          totalPrice: booking.totalPrice,
          createdAt: (booking as any).createdAt?.toISOString(),
        },
      };
    } catch (error) {
      return `Error: Failed to get booking details. ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "getBookingDetails",
    description:
      "Get details of a specific booking by providing the booking ID and guest ID.",
  },
);

/**
 * Get all bookings for a guest - uses database with filters
 * @param options - Guest booking lookup
 * @returns Array of guest bookings
 */
const getGuestBookingsSchema = z.object({
  guestId: z.string(),
  status: z.enum(["Confirmed", "Cancelled", "Completed"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const getGuestBookingsTool: DynamicStructuredTool<
  typeof getGuestBookingsSchema
> = tool(
  async function ({
    guestId,
    status,
    startDate,
    endDate,
  }: z.infer<typeof getGuestBookingsSchema>): Promise<any> {
    try {
      // Build filters object
      const filters: any = {};
      if (status) {
        filters.status = status as BookingStatus;
      }
      if (startDate || endDate) {
        filters.startDate = startDate ? new Date(startDate) : undefined;
        filters.endDate = endDate ? new Date(endDate) : undefined;
      }

      // Fetch bookings from database with filters
      const bookings = await bookingService.findByUserId(guestId, filters);

      // Get room details for each booking
      const bookingsWithRooms = await Promise.all(
        bookings.map(async (booking) => {
          const room = await roomService.findById(booking.roomId);
          return {
            id: booking.id,
            roomId: booking.roomId,
            room: room
              ? {
                  number: room.number,
                  type: room.type,
                }
              : null,
            checkInDate: booking.checkInDate.toISOString(),
            checkOutDate: booking.checkOutDate.toISOString(),
            status: booking.status,
            totalPrice: booking.totalPrice,
            createdAt: (booking as any).createdAt?.toISOString(),
          };
        }),
      );

      return {
        success: true,
        count: bookingsWithRooms.length,
        bookings: bookingsWithRooms,
      };
    } catch (error) {
      throw new AppError(`Failed to get guest bookings: ${error}`, 500);
    }
  },
  {
    name: "getGuestBookings",
    description:
      "Get all bookings for a guest. You can filter by status (Confirmed, Cancelled, Completed) and date range.",
  },
);

/**
 * Update a booking (e.g., change dates) - uses database
 * @param options - Booking update details
 * @returns Updated booking
 */
const updateBookingSchema = z.object({
  bookingId: z.string(),
  guestId: z.string(),
  checkInDate: z.string().optional(),
  checkOutDate: z.string().optional(),
});

export const updateBookingTool: DynamicStructuredTool<
  typeof updateBookingSchema
> = tool(
  async function ({
    bookingId,
    guestId,
    checkInDate,
    checkOutDate,
  }: z.infer<typeof updateBookingSchema>): Promise<any> {
    try {
      // Fetch booking from database
      const booking = await bookingService.findById(bookingId);

      if (!booking) {
        throw new AppError("Booking not found", 404);
      }

      // Verify guest owns the booking
      if (booking.userId !== guestId) {
        throw new AppError("Unauthorized to update this booking", 403);
      }

      // Check if booking can be updated
      if (booking.status === BookingStatus.Cancelled) {
        throw new AppError("Cannot update a cancelled booking", 400);
      }

      if (booking.status === BookingStatus.Completed) {
        throw new AppError("Cannot update a completed booking", 400);
      }

      // Build update data
      const updateData: any = {};

      if (checkInDate) {
        const newCheckIn = new Date(checkInDate);
        if (newCheckIn < new Date()) {
          throw new AppError("Check-in date cannot be in the past", 400);
        }
        updateData.checkInDate = newCheckIn;
      }

      if (checkOutDate) {
        const newCheckOut = new Date(checkOutDate);
        const effectiveCheckIn = updateData.checkInDate || booking.checkInDate;
        if (newCheckOut <= effectiveCheckIn) {
          throw new AppError("Check-out date must be after check-in date", 400);
        }
        updateData.checkOutDate = newCheckOut;
      }

      // Check room availability for new dates
      if (checkInDate || checkOutDate) {
        const newCheckIn = updateData.checkInDate || booking.checkInDate;
        const newCheckOut = updateData.checkOutDate || booking.checkOutDate;
        const isAvailable = await bookingService.isRoomAvailable(
          booking.roomId,
          newCheckIn,
          newCheckOut,
          bookingId,
        );
        if (!isAvailable) {
          throw new AppError("Room is not available for selected dates", 400);
        }
      }

      // Recalculate total price if dates changed
      if (checkInDate || checkOutDate) {
        const room = await roomService.findById(booking.roomId);
        if (room) {
          const newCheckIn = updateData.checkInDate || booking.checkInDate;
          const newCheckOut = updateData.checkOutDate || booking.checkOutDate;
          const nights = Math.ceil(
            (newCheckOut.getTime() - newCheckIn.getTime()) /
              (1000 * 60 * 60 * 24),
          );
          updateData.totalPrice = room.price * nights;
        }
      }

      // Update booking in database
      const updatedBooking = await bookingService.update(bookingId, updateData);

      return {
        success: true,
        message: "Booking updated successfully",
        booking: {
          id: updatedBooking.id,
          checkInDate: updatedBooking.checkInDate.toISOString(),
          checkOutDate: updatedBooking.checkOutDate.toISOString(),
          totalPrice: updatedBooking.totalPrice,
          status: updatedBooking.status,
        },
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Failed to update booking: ${error}`, 500);
    }
  },
  {
    name: "updateBooking",
    description:
      "Update an existing booking's dates. Provide booking ID, guest ID, and optionally new check-in and check-out dates in ISO format (YYYY-MM-DD).",
  },
);

export const bookingTools = [
  bookRoomTool,
  cancelBookingTool,
  getBookingDetailsTool,
  getGuestBookingsTool,
  updateBookingTool,
];
