import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "./",
    plugins: [react(), tailwindcss()],
    server: {
        port: 8080,
        proxy: {
            "/api": {
                target: "https://devm.genikids.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
