<script lang="ts">
    import { onMount } from 'svelte';
    let dataTheme = $state('');
    let menuOpen: boolean = $state(false);
    let headerHeight = $state(0);
    let themes = $state([
        'Light', 'Dark', 'Cupcake', 'Bumblebee', 'Emerald', 'Corporate', 'Synthwave', 'Retro', 'Cyberpunk', 'Valentine', 'Halloween', 'Garden', 'Forest', 'Aqua', 'Lofi', 'Pastel', 'Fantasy', 'Wireframe', 'Black', 'Luxury', 'Dracula', 'Cmyk', 'Autumn', 'Business', 'Acid', 'Lemonade', 'Night', 'Coffee', 'Sunset', 'Winter', 'Dim', 'Nord', 'Sunrise', 'Abyss', 'Silk', 'Caramellatte'
    ]);
    onMount(() => {
        let prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let storedTheme = localStorage.getItem('theme');
        dataTheme = storedTheme ? storedTheme.charAt(0).toUpperCase() + storedTheme.slice(1) : prefersDark ? 'Dark' : 'Light';
        menuOpen = false;
        headerHeight = document.querySelector('header').clientHeight || 0;
    })
</script>
 <div class="flex grow justify-end px-2">
    <div class="flex items-stretch">
      <div class="dropdown dropdown-end">
        <div tabindex={0} role="button" class="btn btn-ghost rounded-field"><span class="material-symbols-outlined">palette</span></div>
        <ul
          tabindex={0}
          class="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm max-h-screen max-h-[calc(100vh - {headerHeight})] overflow-y-auto" >
          {#each themes as theme, i}
              <li>
                  <input
        type="radio"
        name="theme-dropdown"
        class="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start {dataTheme.toLowerCase() === theme.toLowerCase() ? 'btn-active' : ''}"
        aria-label="{theme}"
        value={theme}
        onclick={() => {
            localStorage.setItem('theme', themes[i].toLowerCase());
            dataTheme = theme;
            document.documentElement.setAttribute('data-theme', themes[i].toLowerCase());
        }}
                     />
              </li>
          {/each}
        </ul>
      </div>
    </div>
 </div>

