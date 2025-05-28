import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "./",
    plugins: [react(), tailwindcss()],
    logLevel: "warning",
    build: {
        rollupOptions: {
            inlineDynamicImports: true,
            output: {
                entryFileNames: "main.[hash].js",
                assetFileNames: "[name].[hash].[ext]",
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});

