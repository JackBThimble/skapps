<script lang="ts"> 
    import ThemeSelector from '$lib/components/ThemeSelector.svelte';    import '../app.css'
            /** @type {{children: import('svelte').Snippet}} */
    let { children } = $props();
</script>
<header class="w-screen">
    <div class="navbar bg-base-200 text-primary">
        <div class="navbar-start">
            <span class="material-symbols-outlined">menu</span>
        </div>
        <div class="navbar-center">
            <h1 class="text-3xl font-bold"><a href="/">SK Apps</a></h1>
        </div>
        <div class="navbar-end">
            <ThemeSelector/>
        </div>
    </div>
</header>

<main>
    {@render children()}
</main>