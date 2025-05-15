<script lang="ts">
    import { onMount } from 'svelte';
    let dataTheme = $state('');
    let menuOpen: boolean = $state(false);
    let themes = $state([
        'Light', 'Dark', 'Cupcake', 'Bumblebee', 'Emerald', 'Corporate', 'Synthwave', 'Retro', 'Cyberpunk', 'Valentine', 'Halloween', 'Garden', 'Forest', 'Aqua', 'Lofi', 'Pastel', 'Fantasy', 'Wireframe', 'Black', 'Luxury', 'Dracula', 'Cmyk', 'Autumn', 'Business', 'Acid', 'Lemonade', 'Night', 'Coffee', 'Sunset', 'Winter', 'Dim', 'Nord', 'Sunrise', 'Abyss', 'Silk', 'Caramellatte'
    ]);

    function setTheme(theme: string) {
        const lowerTheme = theme.toLowerCase();
        localStorage.setItem('theme', lowerTheme);
        dataTheme = theme;
        document.documentElement.setAttribute('data-theme', lowerTheme);
    }

    onMount(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setTheme(storedTheme.charAt(0).toUpperCase() + storedTheme.slice(1));
        } else {
            setTheme(prefersDark ? 'Dark' : 'Light');
        }
    });
</script>

<div class="flex grow justify-end px-2">
    <div class="flex items-stretch">
        <div class="dropdown dropdown-end">
            <div tabindex={0} role="button" class="btn btn-ghost rounded-field">
                <span class="material-symbols-outlined">palette</span>
            </div>
            <ul tabindex={0} class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm max-h-screen max-w-[250px] overflow-y-scroll overflow-x-hidden">
                {#each themes as theme}
                    <li>
                        <label class="label cursor-pointer justify-start gap-2">
                            <input
                                type="radio"
                                name="theme-dropdown"
                                class="radio radio-primary"
                                aria-label="{theme}"
                                value={theme}
                                checked={dataTheme.toLowerCase() === theme.toLowerCase()}
                                on:change={() => {
                                    setTheme(theme);
                                }}
                            />
                            <span class="label-text">{theme}</span>
                        </label>
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>