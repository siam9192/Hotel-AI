import { RoomModel } from "../models/room.model";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";
import { RoomType } from "../interfaces/room.interface";
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

export const getRoomDetailsSchema = z.object({
  roomId: z.string().optional(),
  roomNumber: z.number().optional(),
});

export const getRoomDetailsTool: DynamicStructuredTool<
  typeof getRoomDetailsSchema
> = tool(
  async function ({
    roomId,
    roomNumber,
  }: {
    roomId?: string;
    roomNumber?: number;
  }): Promise<any> {
    try {
      let room;

      if (roomId) {
        room = await RoomModel.findById(roomId);
      } else if (roomNumber) {
        room = await RoomModel.findOne({ number: String(roomNumber) });
      } else {
        return "Error: Please provide either roomId or roomNumber.";
      }

      if (!room) {
        return `Error: Room not found.`;
      }

      return {
        success: true,
        room: {
          id: room.id,
          number: room.number,
          type: room.type,
          price: room.price,
          amenities: room.amenities,
          availability: room.availability,
          description: room.description,
        },
      };
    } catch (error) {
      return `Error: Failed to get room details. ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "getRoomDetails",
    description: "Get details of a specific room by room ID or room number.",
  },
);

export const roomTools = [getRoomsTool, getRoomDetailsTool];
