import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

// Disable wayfinder in Docker builds (no PHP artisan available)
const isDockerBuild = process.env.DOCKER_BUILD === 'true';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // Only include wayfinder when not in Docker build
        ...(!isDockerBuild ? [wayfinder({ formVariants: true })] : []),
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
