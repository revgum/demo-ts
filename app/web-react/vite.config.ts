import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3000,
    },
    watch: {
      usePolling: true, // <-- forces polling
      interval: 100, // optional: tuning (ms)
    },
  },
});
