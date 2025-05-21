import { json, type RequestHandler } from "@sveltejs/kit";
import { VITE_OPENWEATHER_API_KEY } from "$env/static/private";
import type { GeocodingResponse } from "$lib/services/geocoding/types";
import { createGeocodingService } from "$lib/services/geocoding";

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get("q");
  const limit = url.searchParams.get("limit");
  const apiKey = VITE_OPENWEATHER_API_KEY;
  
  if (!query) {
    return json({ error: "Missing query parameter"});
  }

  const geocodingService = createGeocodingService({ apiKey});

  try {
    const locationData: GeocodingResponse = await geocodingService.getCoordinates(query);
    return json(locationData);
  } catch (error) {
    console.error("Geocoding API error:", error);
    return json({ error: "Failed to fetch location data" }, { status: 500 });
  }
};
