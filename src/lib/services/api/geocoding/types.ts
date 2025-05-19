import { z } from "zod";
import { GeocodingResponseSchema } from "./schemas";

export interface GeocodingService {
  /**
   * Parse location input and get coordinates
   * @param input User input string (ZIP code, city name, city + state, city + country)
   * @returns Promise with coordinates
   */
  getCoordinates(input: string): Promise<GeocodingResponse>;

  /**
   * Determines if the input string resembles a postal code for the given country
   * @param input The input string to check
   * @param countryCode The ISO 3166 country code to check
   * @returns Boolean indicating if the input matches the postal code pattern
   */
  isPostalCode(input: string, countryCode?: string): boolean;
}

/**
 * Geocoding API response for location lookup
 */
export type GeocodingResponse = z.infer<typeof GeocodingResponseSchema>;

/**
 * Configuration type
 */
export type GeocodingConfig = {
  apiKey: string;
  baseUrl?: string;
};

export const POSTAL_CODE_PATTERNS: Record<string, RegExp> = {
  // North America
  US: /^\d{5}(-\d{4})?$/, // United States: 12345 or 12345-6789
  CA: /^[ABCEGHJKLMNPRSTVXY]\d[A-Z]\s?\d[A-Z]\d$/i, // Canada: A1A 1A1
  MX: /^\d{5}$/, // Mexico: 12345

  // Europe
  GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, // UK: AA1 1AA, A1 1AA, A1A 1AA
  DE: /^\d{5}$/, // Germany: 12345
  FR: /^\d{5}$/, // France: 12345
  IT: /^\d{5}$/, // Italy: 12345
  ES: /^\d{5}$/, // Spain: 12345
  NL: /^\d{4}\s?[A-Z]{2}$/i, // Netherlands: 1234 AB
  AT: /^\d{4}$/, // Austria: 1234
  BE: /^\d{4}$/, // Belgium: 1234
  CH: /^\d{4}$/, // Switzerland: 1234
  DK: /^\d{4}$/, // Denmark: 1234
  FI: /^\d{5}$/, // Finland: 12345
  GR: /^\d{3}\s?\d{2}$/, // Greece: 123 45
  IE: /^[A-Z]\d{2}\s?[A-Z\d]{4}$/i, // Ireland: A12 B345
  NO: /^\d{4}$/, // Norway: 1234
  PT: /^\d{4}-\d{3}$/, // Portugal: 1234-567
  SE: /^\d{3}\s?\d{2}$/, // Sweden: 123 45

  // Asia
  JP: /^\d{3}-\d{4}$/, // Japan: 123-4567
  CN: /^\d{6}$/, // China: 123456
  IN: /^\d{6}$/, // India: 123456
  KR: /^\d{5}$/, // South Korea: 12345
  SG: /^\d{6}$/, // Singapore: 123456
  TH: /^\d{5}$/, // Thailand: 12345
  MY: /^\d{5}$/, // Malaysia: 12345

  // Australia/Oceania
  AU: /^\d{4}$/, // Australia: 1234
  NZ: /^\d{4}$/, // New Zealand: 1234

  // South America
  BR: /^\d{5}-\d{3}$/, // Brazil: 12345-678
  AR: /^[A-Z]\d{4}[A-Z]{3}$/i, // Argentina: C1234ABC
  CL: /^\d{7}$/, // Chile: 1234567

  // Middle East
  IL: /^\d{5}(\d{2})?$/, // Israel: 12345 or 1234567
  SA: /^\d{5}(-\d{4})?$/, // Saudi Arabia: 12345 or 12345-6789
  AE: /^\d{5}$/, // UAE: 12345

  // Default pattern as a fallback for unlisted countries
  DEFAULT: /^[A-Z0-9\s-]{3,10}$/i, // Reasonably flexible default pattern
};
