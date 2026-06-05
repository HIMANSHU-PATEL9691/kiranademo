import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// Standard Vite config with Tailwind v3 via PostCSS (postcss.config.js)
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist/client",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-select", "@radix-ui/react-dropdown-menu"],
          charts: ["recharts"],
        },
      },
    },
  },
});
