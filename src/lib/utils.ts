export function isZipCode(input: string): boolean {
  // Common zip code patterns:
  // US: 5 digits or 5+4 (12345 or 12345-6789)
  // UK: Alphanumeric format like "SW1A 1AA"
  // Canada: Letter-Number-Letter Number-Letter-Number (A1A 1A1)

  const zipPatterns = [
    /^\d{5}(-\d{4})?$/,
    /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/i,
    /^[A-Z]\d[A-Z] \d[A-Z]\d$/i,
    /^\d{4,6}$/,
  ];

  return zipPatterns.some((pattern) => pattern.test(input.trim()));
}

export function parseLocationInput(input: string): {
  type: "zip" | "city" | "coordinates";
  query: string;
  country?: string;
  state?: string;
} {
  const trimmedInput = input.trim();

  const coordPattern = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
  const coordMatch = trimmedInput.match(coordPattern);
  if (coordMatch) {
    return {
      type: "coordinates",
      query: trimmedInput,
    };
  }

  if (isZipCode(trimmedInput)) {
    return {
      type: "zip",
      query: trimmedInput,
    };
  }

  const parts = trimmedInput.split(",").map((part) => part.trim());
  const query = parts[0];

  let state: string | undefined;
  let country: string | undefined;

  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (
      lastPart.length === 2 ||
      ["USA", "UK", "UAE"].includes(lastPart.toUpperCase())
    ) {
      country = lastPart;

      if (parts.length > 2) {
        state = parts[parts.length - 2];
      }
    } else {
      country = lastPart;

      if (parts.length > 2) {
        state = parts[1];
      }
    }
  }

  return {
    type: "city",
    query,
    state,
    country,
  };
}
