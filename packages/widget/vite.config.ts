import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   port: 5174,
  //   proxy: {
  //     "/api": {
  //       target: "http://172.16.5.111:8081",
  //       changeOrigin: true,
  //       rewrite: (p) => p.replace("/^/api/", ""),
  //     },
  //     "/api/ws": {
  //       target: "ws://172.16.5.111:8081",
  //       changeOrigin: true,
  //     },
  //   },
  // },
});
