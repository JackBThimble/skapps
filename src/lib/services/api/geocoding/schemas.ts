import { z } from "zod";

/**
 * Zod schema for geocoding response
 */
export const GeocodingResponseSchema = z.object({
  name: z.string(),
  local_names: z.record(z.string(), z.string()).optional(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  state: z.string().optional(),
});

/**
 * Zod shcme for ZIP code response (which has a slightly different format)
 */
export const GeocodingZIPResponseSchema = z.object({
  name: z.string(),
  lat: z.number(),
  lon: z.number(),
  country: z.string(),
  zip: z.string(),
});
