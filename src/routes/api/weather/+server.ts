import { json, type RequestHandler } from "@sveltejs/kit";
import { OPENWEATHERMAP_API_KEY } from "$env/static/private";

export const GET: RequestHandler = async ({ url }) => {
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  if (!lat || !lon) {
    return json(
      { error: "Missing latitude or longitude parameters" },
      { status: 400 },
    );
  }

  const exclude = url.searchParams.get("exclude");
  const units = url.searchParams.get("units") || "imperial";

  const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=${exclude}&units=${units}&appid=${OPENWEATHERMAP_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { error: errorData.message || "Failed to fetch weather data" },
        { status: response.status },
      );
    }

    const weatherData = await response.json();
    return json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
};
