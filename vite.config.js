import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://wohngluk-api.onrender.com",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [tailwindcss()],
});

// add
