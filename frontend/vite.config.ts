import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

<<<<<<< HEAD:frontend/vite.config.ts
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
=======
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8081,
>>>>>>> dfc84cce5568d2c5f0695b52a46ac7f061e52408:front/vite.config.ts
    },
    plugins: [react(), isDev && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      ...(isDev && {
        __BASE_URL__: JSON.stringify("http://localhost:8080"),
        __API_BASE_URL__: JSON.stringify("http://localhost:8080/api"),
      }),
    },
  };
});
