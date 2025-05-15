import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
        plugins: [tailwindcss(), sveltekit()],
        server: {
                port: 3000,
                allowedHosts: [
                        "61be07cd-7823-4b84-960c-2e481396258f-00-3j3hr6t3x0vgi.janeway.replit.dev"
                ]
        }
});