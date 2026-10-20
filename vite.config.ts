import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({

    base: process.env.NODE_ENV === "production"
        ? "/samegame-engine/"
        : "/",

    build: {
        outDir: "docs",
        rolldownOptions: {
            input: {
                demo: resolve(import.meta.dirname, "examples/index.html")
            }
        }
    },

    server: {
        open: "/examples/scenes/"
    }

});