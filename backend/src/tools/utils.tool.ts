import z from "zod";
import { RoomType } from "../interfaces/room.interface";
import { BookingStatus } from "../interfaces/booking.interface";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";

const roomSchema = z.object({
  id: z.string(),
  number: z.string(),
  type: z.nativeEnum(RoomType),
  price: z.number(),
  amenities: z.array(z.string()),
  availability: z.boolean(),
  description: z.string(),
  images: z.array(z.string()),
});

const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  roomId: z.string(),
  checkInDate: z.string(),
  checkOutDate: z.string(),
  totalPrice: z.number(),
  status: z.nativeEnum(BookingStatus),
});

export const finalResponseSchema = z.object({
  message: z
    .string()
    .describe("The final response message to be sent to the user"),
  data: z
    .object({
      // action: z
      //   .string()
      //   .describe(
      //     "The action to be taken by the user, e.g., 'bookRoom', 'getPolicy', 'searchRooms', etc.",
      //   ),
      rooms: z
        .array(roomSchema)
        .optional()
        .describe(
          "Optional list of rooms relevant to the action, if applicable",
        ),
      bookingDetails: z
        .object({
          id: z.string(),
          userId: z.string(),
          roomId: z.string(),
          checkInDate: z.string(),
          checkOutDate: z.string(),
          totalPrice: z.number(),
          status: z.nativeEnum(BookingStatus),
        })
        .optional()
        .describe(
          "Optional booking details relevant to the action, if applicable",
        ),
    })
    .optional()
    .describe("Optional data payload containing action results"),
});

export type FinalResponse = z.infer<typeof finalResponseSchema>;

export const getFinalResponse = (response: FinalResponse): FinalResponse => {
  // Default response structure
  return response;
};

export const createFinalResponse: DynamicStructuredTool<
  typeof finalResponseSchema
> = tool(
  function (response: FinalResponse) {
    return finalResponseSchema.parse({
      message: response.message,
      data: {
        ...(response.data?.rooms && { rooms: response.data.rooms }),
        ...(response.data?.bookingDetails && {
          bookingDetails: response.data.bookingDetails,
        }),
      },
    });
  },
  {
    name: "createFinalResponse",
    description:
      "Creates a structured final response object to be sent to the user, containing a message and optional data related to the action taken.",
  },
);

export const utilTools = [createFinalResponse]