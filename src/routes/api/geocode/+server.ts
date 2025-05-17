import { json, type RequestHandler } from "@sveltejs/kit";
import { OPENWEATHERMAP_API_KEY } from "$env/static/private";
import type { GeocodingResult } from "$lib/types/types";

export const GET: RequestHandler = async ({ url }) => {
  const city = url.searchParams.get("city");
  const state_code = url.searchParams.get("state");
  const country_code = url.searchParams.get("country") || "us";
  const coordinates = url.searchParams.get("coordinates");
  const zip = url.searchParams.get("zip");

  let apiUrl: string;

  if (coordinates) {
    const [lat, lon] = coordinates
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lon)) {
      return json({ error: "Invalid coordinates format" }, { status: 400 });
    }

    return json({
      name: `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
      lat,
      lon,
      country: "",
    });
  } else if (city) {
    let query = city;
    if (state_code) query += `,${state_code}`;
    if (country_code) query += `,${country_code}`;

    apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${OPENWEATHERMAP_API_KEY}`;
  } else if (zip) {
    apiUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zip)},${country_code}&appid=${OPENWEATHERMAP_API_KEY}`;
  } else {
    return json({ error: "Missing location parameters" }, { status: 400 });
  }

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { error: errorData.message || "Failed to fetch location data" },
        { status: response.status },
      );
    }
    const data = await response.json();

    if (Array.isArray(data) && data.length === 0) {
      return json({ error: "Location not found" }, { status: 404 });
    }

    const locationData: GeocodingResult = Array.isArray(data) ? data[0] : data;

    return json(locationData);
  } catch (error) {
    console.error("Geocoding API error:", error);
    return json({ error: "Failed to fetch location data" }, { status: 500 });
  }
};
