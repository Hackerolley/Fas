import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config keeps the React dev server fast and simple.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
