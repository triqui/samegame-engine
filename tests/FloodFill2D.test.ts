import { describe, it, expect } from "vitest";
import { FloodFill2D } from "../src/FloodFill2D";
import type { Grid2D  } from "../src/FloodFill2D";

describe("FloodFill2D", () => {

    it("detects 4-connected region", () => {

        const grid: Grid2D<number> = [
            [1, 1, 0],
            [1, 0, 0],
            [0, 0, 1]
        ];

        const flood: FloodFill2D<number> = new FloodFill2D<number>();
        const region = flood.getConnectedRegion(grid, 0, 0);

        expect(region.length).toBe(3);
    });

    it("detects 8-connected region with diagonals", () => {

        const grid: Grid2D<number> = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];

        const flood = new FloodFill2D<number>();

        const region = flood.getConnectedRegion(grid, 0, 0, {
            allowDiagonals: true
        });

        expect(region.length).toBe(3);
    });

    it("replaces region destructively", () => {

        const grid: Grid2D<number> = [
            [2, 2, 0],
            [2, 0, 0],
            [0, 0, 2]
        ];

        const flood = new FloodFill2D<number>();

        const replaced = flood.replaceRegion(grid, 0, 0, 9);

        expect(replaced.length).toBe(3);
        expect(grid[0][0]).toBe(9);
        expect(grid[1][0]).toBe(9);
    });

    it("does not mutate grid when using getConnectedRegion", () => {

        const grid: Grid2D<number> = [
            [5, 5],
            [5, 0]
        ];

        const original = JSON.stringify(grid);

        const flood = new FloodFill2D<number>();
        flood.getConnectedRegion(grid, 0, 0);

        expect(JSON.stringify(grid)).toBe(original);
    });

    it("supports custom comparator", () => {

        type Tile = { type: string };

        const grid: Grid2D<Tile> = [
            [{ type: "A" }, { type: "A" }],
            [{ type: "A" }, { type: "B" }]
        ];

        const flood = new FloodFill2D<Tile>();

        const region = flood.getConnectedRegion(grid, 0, 0, {
            equals: (a: Tile, b: Tile): boolean => a.type === b.type
        });

        expect(region.length).toBe(3);
    });

    it("returns empty array for out of bounds start", () => {

        const grid: Grid2D<number> = [
            [1, 1],
            [1, 1]
        ];

        const flood = new FloodFill2D<number>();

        const region = flood.getConnectedRegion(grid, -1, -1);

        expect(region.length).toBe(0);
    });

});