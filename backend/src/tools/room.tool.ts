import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { roomService } from "../services/room.service";
import { bookingService } from "../services/booking.service";
import { RoomType } from "../interfaces/room.interface";
import { BookingStatus } from "../interfaces/booking.interface";
import { AppError } from "../utils/error.utils";
import { RoomModel } from "../models/room.model";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";
/**
 * Get rooms with optional filters - uses database queries with filters
 * @param options - Filter options for rooms
 * @returns Array of matching rooms
 */
const getRoomsSchema = z.object({
  roomNumbers: z.array(z.number()).optional(),
  roomType: z.string().optional(),
  priceRange: z.array(z.number()).optional(),
  amenities: z.array(z.string()).optional(),
  availability: z.boolean().optional(),
});

export const getRoomsTool: DynamicStructuredTool<typeof getRoomsSchema> = tool(
  async function ({
    roomNumbers,
    roomType,
    priceRange,
    amenities,
    availability,
  }: {
    roomNumbers?: number[];
    roomType?: string;
    priceRange?: number[];
    amenities?: string[];
    availability?: boolean;
  }): Promise<any> {
    try {
      const filter: any = {};

      if (roomType) {
        filter.type = roomType as RoomType;
      }

      if (availability !== undefined) {
        filter.availability = availability;
      }

      if (priceRange && priceRange.length === 2) {
        filter.price = { $gte: priceRange[0], $lte: priceRange[1] };
      }

      if (roomNumbers && roomNumbers.length > 0) {
        filter.number = { $in: roomNumbers.map(String) };
      }

      if (amenities && amenities.length > 0) {
        filter.amenities = { $all: amenities };
      }

      const rooms = await RoomModel.find(filter);

      return {
        success: true,
        count: rooms.length,
        rooms: rooms.map((room) => ({
          id: room.id,
          number: room.number,
          type: room.type,
          price: room.price,
          amenities: room.amenities,
          availability: room.availability,
          description: room.description,
        })),
      };
    } catch (error) {
      return `Error: Failed to get rooms. ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "getRooms",
    description:
      "Get rooms with optional filters. You can filter by room numbers, type, price range, amenities, and availability.",
  },
);
