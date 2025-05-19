<script lang="ts">
    import { onMount } from "svelte";

    import type {
        GeocodingResponse,
        GeocodingService,
    } from "$lib/services/api/geocoding/types";
    import LocationInput from "$lib/components/LocationInput.svelte";
    import type {
        CurrentWeather,
        Daily,
        Hourly,
        OneCallResponse,
        UnitSystem,
    } from "$lib/services/api/weather/types";
    import weatherService from "$lib/services/api/weather";
    import { goto } from "$app/navigation";
    import { createGeocodingService } from "$lib/services/api/geocoding";

    let data = $props();
    type Coordinates = {
        latitude: number;
        longitude: number;
    };

    let city: string | null = $state(null);
    let userCoords: Coordinates | undefined = $state();
    let weather: OneCallResponse | null = $state(null);
    let currentWeather: CurrentWeather | null = $state(null);
    let dailyForecast: Daily[] | undefined = $state([]);
    let hourlyForecast: Hourly[] | undefined = $state([]);
    let unitSystem: UnitSystem = $state("imperial");
    let loading: boolean = $state(true);
    let error: string | null = null;
    let locationError: string | null = $state(null);
    let isloadingLocation = $state(true);
    let geocodingService: GeocodingService | null = $state(null);

    const formatTemp = (temp: number) =>
        `${Math.round(temp)}°${unitSystem === "imperial" ? "F" : "C"}`;

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            locationError = "Geolocation not supported by your browser";
            return;
        }

        isloadingLocation = true;
        locationError = null;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                userCoords!.longitude = longitude;
                userCoords!.latitude = latitude;
                isloadingLocation = false;
            },
            (error) => {
                isloadingLocation = false;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        locationError =
                            "User denied the request for geolocation";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        locationError = "Location information unavailable";
                        break;
                    case error.TIMEOUT:
                        locationError =
                            "The request to get user location timed out";
                        break;
                    default:
                        locationError = "An unknown error occured";
                        break;
                }
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0,
            },
        );
    };

    async function handleSearch() {
        if (!city) return;
        try {
        } catch {}
    }
    onMount(() => {
        geocodingService = createGeocodingService({
            apiKey: import.meta.env.VITE_OPENWEATHERMAP_API_KEY,
        });

        try {
            getUserLocation();
            if (userCoords) {
                loadWeatherData();
            }
        } catch {}
    });
</script>

<div class="container p-4 mx-auto">
    <h1 class="text-3xl font-bold text-base-content">Weather</h1>

    <div>
        <LocationInput
            onSuccess={(result) => {
                loadWeatherData(result.lat, result.lon);
            }}
            onError={(e) => {
                locationError = e.message;
            }}
            onSearchEnd={() => {}}
            onSearchStart={() => {}}
        />
    </div>

    {#if weather}
        <p>Timezone: {weather.timezone}</p>
        <p>Longitude: {weather.lon}</p>
        <p>Latitude: {weather.lat}</p>
        <p>Timezone offset: {weather.timezone_offset}</p>
    {/if}
</div>
