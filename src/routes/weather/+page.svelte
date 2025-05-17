<script lang="ts">
    import { onMount } from "svelte";
    import type {
        WeatherData,
        LocationCoords,
        GeocodingResult,
        LocationInputType,
    } from "$lib/types/types";
    import { parseLocationInput } from "$lib/utils";
    import { parse } from "svelte/compiler";

    let weather = $state<WeatherData | null>();
    let error = $state<string | null>();
    let loading = $state(false);
    let userInput = $state("");
    let manualLat = $state<number | null>();
    let manualLon = $state<number | null>();
    let userCoords = $state<LocationCoords>();
    let placeName = $state("");
    let locationStatus = $state<"idle" | "requesting" | "granted" | "denied">(
        "idle",
    );
    let units = $state<"imperial" | "metric">("imperial");

    let hasGeolocation =
        typeof navigator !== "undefined" && "geolocation" in navigator;

    async function getUserLocation(): Promise<void> {
        locationStatus = "requesting";

        try {
            const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0,
                    });
                },
            );
            userCoords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };

            locationStatus = "granted";

            await fetchWeather(userCoords.latitude, userCoords.longitude);
            await fetchPlaceName(userCoords.latitude, userCoords.longitude);
        } catch (err) {
            locationStatus = "denied";
            error =
                "Unable to access location. Please enter your location manually";
            console.error("Geolocation error:", err);
        }
    }

    async function fetchPlaceName(lat: number, lon: number): Promise<void> {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${import.meta.env.VITE_OPENWEATHERMAP_API_KEY}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch place name");
            }

            const data = await response.json();

            if (data && data.length > 0) {
                placeName = `${data[0].name}${data[0].state_code ? ", " + data[0].state_code : ""}${data[0].country ? ", " + data[0].country : ""}`;
            }
        } catch (err) {
            console.error(`Error fetching place name:`, err);
        }
    }

    async function processLocationInput(): Promise<{
        lat: number;
        lon: number;
    } | null> {
        if (!userInput.trim()) {
            error = "Please enter a location";
            return null;
        }

        const parsedInput = parseLocationInput(userInput);

        if (parsedInput.type === "coordinates") {
            const [lat, lon] = parsedInput.query
                .split(",")
                .map((coord) => parseFloat(coord.trim()));
            placeName = `Location at ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            return { lat, lon };
        }

        let url = "/api/geocode?";

        if (parsedInput.type === "zip") {
            url += `zip=${encodeURIComponent(parsedInput.query)}`;
            if (parsedInput.country) {
                url += `&country=${encodeURIComponent(parsedInput.country)}`;
            }
        } else {
            url += `city=${encodeURIComponent(parsedInput.query)}`;
            if (parsedInput.state) {
                url += `&state=${encodeURIComponent(parsedInput.state)}`;
            }
            if (parsedInput.country) {
                url += `&country=${encodeURIComponent(parsedInput.country)}`;
            }
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Location not found");
            }

            const locationData: GeocodingResult = await response.json();
            placeName = `${locationData.name}, ${locationData.country}${locationData.state ? ", " + locationData.state : ""}`;

            return {
                lat: locationData.lat,
                lon: locationData.lon,
            };
        } catch (err) {
            error =
                err instanceof Error ? err.message : "Failed to find location";
            return null;
        }
    }

    async function fetchWeather(lat: number, lon: number): Promise<void> {
        loading = true;
        error = null;

        try {
            const response = await fetch(
                `/api/weather?lat=${lat}&lon=${lon}&units=${units}`,
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to fetch weather data",
                );
            }

            weather = await response.json();
        } catch (err) {
            error =
                err instanceof Error ? err.message : "Unknown error occured";
            weather = null;
        } finally {
            loading = false;
        }
    }

    async function handleSubmit(): Promise<void> {
        error = null;

        const coords = await processLocationInput();
        if (coords) {
            await fetchWeather(coords.lat, coords.lon);
        }
    }

    function formatData(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleString();
    }

    function formatTime(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }
</script>

<div class="container p-4 mx-auto">
    <h1 class="text-3xl font-bold text-base-content">Weather</h1>

    <div class="search-container">
        <form onsubmit={handleSubmit}>
            <label class="text-base-content mt-2" for="location-search"
                >Location</label
            >
            <input
                type="text"
                name="location-search"
                placeholder="New York City, New York"
                class="input input-primary placeholder:text-base-content placeholder:italic mt-1"
                bind:value={userInput}
            />
            <button
                type="submit"
                disabled={loading || !userInput.trim()}
                class="btn btn-accent"
            >
                <span class="material-symbols-outlined">search</span>
            </button>
            <div class="input-examples">
                <p>
                    Examples: "London", "90210", "New York, NY", "Tokyo, JP",
                    "51.5074, -0.1278"
                </p>
            </div>
        </form>

        {#if hasGeolocation}{/if}
    </div>
</div>
