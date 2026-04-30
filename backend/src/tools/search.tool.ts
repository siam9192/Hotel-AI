// filepath: src/tools/search.tool.ts
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";

const searchSchema = z.object({
  query: z.string(),
  type: z.enum(["general", "room", "service", "policy"]).optional(),
  limit: z.number().optional(),
});

/**
 * Search for hotel-related information
 * In production, this would integrate with a real search service (e.g., Elasticsearch)
 */
export const searchTool: DynamicStructuredTool<typeof searchSchema> = tool(
  async function ({
    query,
    type = "general",
    limit = 10,
  }: z.infer<typeof searchSchema>): Promise<any> {
    // Simulated search results - in production, replace with real search
    const mockResults: Record<
      string,
      Array<{ title: string; url: string; snippet: string }>
    > = {
      general: [
        {
          title: "Hotel Amenities",
          url: "/amenities",
          snippet:
            "Discover our world-class amenities including spa, pool, and fitness center.",
        },
        {
          title: "Dining Options",
          url: "/dining",
          snippet: "Experience fine dining at our award-winning restaurants.",
        },
        {
          title: "Room Service",
          url: "/room-service",
          snippet: "24/7 in-room dining with a diverse menu.",
        },
        {
          title: "Concierge Services",
          url: "/concierge",
          snippet: "Our concierge team is here to assist with all your needs.",
        },
        {
          title: "Special Offers",
          url: "/offers",
          snippet: "Current promotions and special packages.",
        },
      ],
      room: [
        {
          title: "Deluxe Suite",
          url: "/rooms/deluxe-suite",
          snippet: "Spacious suite with city views and premium amenities.",
        },
        {
          title: "Executive Room",
          url: "/rooms/executive",
          snippet: "Modern room designed for business travelers.",
        },
        {
          title: "Family Room",
          url: "/rooms/family",
          snippet: "Spacious accommodations for the whole family.",
        },
        {
          title: "Room Booking",
          url: "/book-room",
          snippet: "Easy online reservation system.",
        },
      ],
      service: [
        {
          title: "Spa & Wellness",
          url: "/spa",
          snippet: "Rejuvenate with our range of spa treatments.",
        },
        {
          title: "Fitness Center",
          url: "/fitness",
          snippet: "State-of-the-art gym open 24/7.",
        },
        {
          title: "Pool & Beach",
          url: "/pool",
          snippet: "Outdoor pool and private beach access.",
        },
        {
          title: "Business Center",
          url: "/business",
          snippet: "Full-service business facilities.",
        },
      ],
      policy: [
        {
          title: "Check-in/Check-out",
          url: "/policy/checkin",
          snippet: "Check-in: 3 PM, Check-out: 11 AM.",
        },
        {
          title: "Cancellation Policy",
          url: "/policy/cancellation",
          snippet: "Free cancellation up to 24 hours before check-in.",
        },
        {
          title: "Pet Policy",
          url: "/policy/pets",
          snippet: "Pet-friendly rooms available upon request.",
        },
      ],
    };

    const results = mockResults[type] || mockResults.general;
    const filteredResults = results.slice(0, limit);

    return {
      success: true,
      query,
      type,
      count: filteredResults.length,
      results: filteredResults,
    };
  },
  {
    name: "search",
    description:
      "Search for hotel information including rooms, services, amenities, and policies. Specify the search type for better results.",
  },
);
