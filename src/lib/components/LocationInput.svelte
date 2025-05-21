<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import type {
        GeocodingResponse,
    } from "$lib/services/api/geocoding/types";

    type LocationInputProps = {
        onSuccess: (result: GeocodingResponse) => void;
        onError: (error: { message: string }) => void;
        onSearchStart: () => void;
        onSearchEnd: () => void;
        apiKey?: string;
        placeholder?: string;
        inputClass?: string;
    };

    let {
        onSuccess,
        onError,
        onSearchStart,
        onSearchEnd,
        apiKey = "",
        placeholder = "Enter location (ZIP, city, city+state, or city+country)",
        inputClass = "",
    }: LocationInputProps = $props();

    
    let locationInput = $state("");
    let isLoading = $state(false);
    let error = $state("");
    let geocodingResponse: GeocodingResponse | GeocodingError = $state({});
    async function handleSearch() {
        if (!locationInput.trim()) {
            error = "Please enter a location";
            onError({ message: error });
            return;
        }
        error = "";
        isLoading = true;
        onSearchStart();
        try {
            geocodingResponse = await fetch(`/api/geocoding?q=${locationInput}`);
            onSuccess(await geocodingResponse.json());
        } catch (e) {
            error =
                e instanceof GeocodingError
                    ? e.message
                    : `Error: ${(e as Error).message}`;
            onError({ message: error });
        } finally {
            isLoading = false;
            onSearchEnd();
        }
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter") handleSearch();
    }
</script>

<div class="form w-full">
    <div class="relative">
        <input
            type="text"
            bind:value={locationInput}
            onkeypress={handleKeyPress}
            {placeholder}
            disabled={isLoading}
            class={`input input-bordered w-full ${inputClass}`}
            aria-label="Location input"
        />
        {#if isLoading}
            <div
                class="absolute right-3 top-1/2 -translate-y-1/2 loading loading-spinner text-primary"
                aria-hidden="true"
            ></div>
        {/if}
    </div>
    {#if error}
        <label class="label" for="e">
            <div class="label-text-alt text-error">{error}</div>
        </label>
    {/if}
</div>
