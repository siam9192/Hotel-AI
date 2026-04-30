// filepath: src/tools/weather.tool.ts
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import z from "zod";

const weatherSchema = z.object({
  location: z.string(),
  units: z.enum(["celsius", "fahrenheit"]).optional(),
});

const forecastSchema = z.object({
  location: z.string(),
  days: z.number().min(1).max(7).optional(),
  units: z.enum(["celsius", "fahrenheit"]).optional(),
});

/**
 * Get current weather for a location
 * In production, this would integrate with a weather API (e.g., OpenWeatherMap)
 */
export const weatherTool: DynamicStructuredTool<typeof weatherSchema> = tool(
  async function ({
    location,
    units = "fahrenheit",
  }: z.infer<typeof weatherSchema>): Promise<any> {
    // Simulated weather data - in production, replace with real API
    const celsius = Math.floor(Math.random() * 15) + 15; // 15-30°C
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);

    const conditions = [
      "Sunny",
      "Partly Cloudy",
      "Cloudy",
      "Light Rain",
      "Clear",
    ];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];

    const conditions_zh: Record<string, string> = {
      Sunny: "晴天",
      "Partly Cloudy": "多云",
      Cloudy: "阴天",
      "Light Rain": "小雨",
      Clear: "晴朗",
    };

    return {
      success: true,
      location,
      current: {
        temperature: units === "celsius" ? celsius : fahrenheit,
        temperatureUnit: units === "celsius" ? "°C" : "°F",
        condition,
        condition_zh: conditions_zh[condition],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
        feelsLike:
          units === "celsius"
            ? celsius + Math.floor(Math.random() * 4) - 2
            : fahrenheit + Math.floor(Math.random() * 4) - 2,
      },
      updatedAt: new Date().toISOString(),
    };
  },
  {
    name: "weather",
    description:
      "Get current weather information for a location. Useful for providing weather updates to guests.",
  },
);

/**
 * Get weather forecast for a location
 */
export const forecastTool: DynamicStructuredTool<typeof forecastSchema> = tool(
  async function ({
    location,
    days = 3,
    units = "fahrenheit",
  }: z.infer<typeof forecastSchema>): Promise<any> {
    const forecast = [];
    const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"];
    const conditions_zh: Record<string, string> = {
      Sunny: "晴天",
      "Partly Cloudy": "多云",
      Cloudy: "阴天",
      "Light Rain": "小雨",
    };

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const baseCelsius = Math.floor(Math.random() * 10) + 18;
      const highCelsius = baseCelsius + Math.floor(Math.random() * 5) + 3;
      const lowCelsius = baseCelsius - Math.floor(Math.random() * 5);

      const condition =
        conditions[Math.floor(Math.random() * conditions.length)];

      forecast.push({
        date: date.toISOString().split("T")[0],
        high:
          units === "celsius"
            ? highCelsius
            : Math.round((highCelsius * 9) / 5 + 32),
        low:
          units === "celsius"
            ? lowCelsius
            : Math.round((lowCelsius * 9) / 5 + 32),
        unit: units === "celsius" ? "°C" : "°F",
        condition,
        condition_zh: conditions_zh[condition],
        precipitationChance: Math.floor(Math.random() * 50),
      });
    }

    return {
      success: true,
      location,
      forecast,
    };
  },
  {
    name: "forecast",
    description:
      "Get weather forecast for a location for the next few days. Useful for planning outdoor activities.",
  },
);

export const weatherTools = [weatherTool, forecastTool];
