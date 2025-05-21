import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // 允许访问 packages 目录
      allow: ["./packages"],
    },
  },
});
