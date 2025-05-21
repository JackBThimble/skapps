import { json, type RequestHandler } from "@sveltejs/kit";
import type { GeocodingResponse } from "$lib/services/geocoding/types";
import { createGeocodingService } from "$lib/services/geocoding";

const VITE_OPENWEATHER_API_KEY = process.env["VITE_OPENWEATHER_API_KEY"];
export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get("q");
  const limit = url.searchParams.get("limit");
  const apiKey = VITE_OPENWEATHER_API_KEY;

  if (!query) {
    return json({ error: "Missing query parameter" });
  }

  const geocodingService = createGeocodingService({ apiKey: apiKey ?? "" });

  try {
    const locationData: GeocodingResponse =
      await geocodingService.getCoordinates(query);
    console.log({locationData: JSON.stringify(locationData)});
    return json(locationData);
  } catch (error) {
    console.error("Geocoding API error:", error);
    return json({ error: "Failed to fetch location data" }, { status: 500 });
  }
};
