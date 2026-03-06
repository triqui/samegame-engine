import { defineConfig } from "vite";
import { resolve } from "path";
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                demo: resolve(__dirname, "demo/index.html")
            }
        }
    },
    server: {
        open: "/demo/"
    }
});