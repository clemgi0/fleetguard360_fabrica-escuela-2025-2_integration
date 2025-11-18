import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8081,
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
