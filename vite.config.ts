import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({

    base: process.env.NODE_ENV === "production"
        ? "/samegame-engine/"
        : "/",

    build: {
        outDir: "docs",
        rollupOptions: {
            input: {
                demo: resolve(__dirname, "examples/scenes/index.html")
            }
        }
    },

    server: {
        open: "/examples/scenes/"
    }

});