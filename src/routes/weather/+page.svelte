<script lang="ts">
    let location = $state('');
    let userLatitude = $state(0);
    let userLongitude = $state(0);
    let weatherData = $state({});
    let error = $state(''); 
    function useMyLocation() {
        const success = (position) => {
            userLatitude = positikn.coords.latitude;
            userLongitude = position.coords.longitude;
        }
        const failure = () => {
            error = "Unable to retrieve user's location";
            alert(error);
            return;
        }

        if (!navigator.geolocation) {
            error = "Geolocation is not supported by your browser";
            alert(error);
            return;
        }

        navigator.geolocation.getCurrentPosition(success, failure);

        if (userLatitude && userLongitude) {
            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${userLatitude}&lon=${userLongitude}&appid=${process.env.OPENWEATHERMAP_API_KEY}`)
        }
    }
</script>

<div class="container p-4 mx-auto">
    <h1 class="text-3xl font-bold text-base-content">Weather</h1>
    <label class="text-base-content mt-2" for="location-search">Location</label>
    <input type="text" name="location-search" placeholder="New York City, New York" class="input input-primary placeholder:text-base-content placeholder:italic mt-1" />
    <button class="btn btn-primary mt-2" onclick={() => useMyLocation()}>
        Use my location
    </button>
    <p></p>
</div>