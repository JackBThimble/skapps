<script lang="ts">
    import { onMount } from "svelte";

    import LocationInput from "$lib/components/LocationInput.svelte";
    import type {
        CurrentWeather,
        Daily,
        Hourly,
        OneCallResponse,
        UnitSystem,
    } from "$lib/services/api/weather/types";
    import { goto } from "$app/navigation";

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
    let weatherType: string = $state("all");

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
        console.log("Requesting user location...");
        if (!navigator.geolocation) {
            locationError = "Geolocation not supported by your browser";
            console.log(locationError);
            return;
        }

        isloadingLocation = true;
        locationError = null;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                userCoords.longitude = longitude;
                userCoords.latitude = latitude;
                console.log(`User location: ${latitude}, ${longitude}`);
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
                console.log(locationError);
            },
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0,
            },
        );
    };

    const loadWeatherData = async() => {
        console.log("Loading weather data...");
        loading = true;
        try {
            const response = await fetch(`/api/weather?lat=${userCoords.latitude}&lon=${userCoords.longitude}&q=${weatherType}&units=${unitSystem}`);
            if (!response.ok) {
                throw new Error("Failed to fetch weather data");
            }
            if (weatherType === "all") {
                weather = await response.json();
                currentWeather = weather.current;
                dailyForecast = weather.daily;
                hourlyForecast = weather.hourly;
            } else if (weatherType === "current") {
                currentWeather = await response.json();
            } else if (weatherType === "daily") {
                dailyForecast = await response.json();
            } else if (weatherType === "hourly") {
                hourlyForecast = await response.json();
            } else {
                throw new Error("Invalid weather type");
            }
            console.log(weather);
        }
        catch (e) {
            error = e.message;
            console.log(error);
        }
        finally {
            loading = false;
        } 
        
    }
    onMount(() => {
        console.log("Mounted");
        try {
            getUserLocation();
            if (userCoords.latitude && userCoords.longitude) {
                loadWeatherData();
                console.log({userCoords});
            }
        } catch {
            error = "Failed to load weather data";
        }
    });
</script>

<div class="container p-4 mx-auto">
    <h1 class="text-3xl font-bold text-base-content">Weather</h1>

    <div>
        <LocationInput
            onSuccess={(result) => {
                userCoords = {
                    latitude: result.lat,
                    longitude: result.lon
                }
                loadWeatherData();
            }}
            onError={(e) => {
                locationError = e.message;
            }}
            onSearchEnd={() => {isloadingLocation = false}}
            onSearchStart={() => {isloadingLocation = true}}
        />
    </div>

    {#if loading}
        <div class="loading loading-spinner" ></div>
    {/if}
    {#if weather}
        <p>Timezone: {weather.timezone}</p>
        <p>Longitude: {weather.lon}</p>
        <p>Latitude: {weather.lat}</p>
        <p>Timezone offset: {weather.timezone_offset}</p>
    {/if}
</div>
