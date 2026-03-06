# FloodFill2D

![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Tests](https://img.shields.io/badge/tests-vitest-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A lightweight, fully typed **2D flood fill utility for rectangular
grids**.

Ideal for:

-   game development (tilemaps, match‑3, regions)
-   image processing
-   grid‑based simulations
-   puzzle games

Features:

-   4‑direction or 8‑direction connectivity
-   non‑destructive region detection
-   destructive replace mode
-   custom equality comparator
-   strict TypeScript types
-   fully tested with Vitest

------------------------------------------------------------------------

# Demo

Run the interactive demo locally:

npm install
npm run demo

------------------------------------------------------------------------

# Installation

Clone the repository:

    git clone https://github.com/yourname/floodfill2d.git

Or copy the single source file into your project:

src/FloodFill2D.ts

------------------------------------------------------------------------

# Basic Usage

``` ts
import { FloodFill2D } from "./FloodFill2D";

const grid = [
  [1, 1, 0],
  [1, 0, 0],
  [0, 0, 1]
];

const flood = new FloodFill2D<number>();

const region = flood.getConnectedRegion(grid, 0, 0);

console.log(region);
```

Output:

    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 }
    ]

------------------------------------------------------------------------

# Replace Region (Destructive)

``` ts
flood.replaceRegion(grid, 0, 0, 9);
```

Grid becomes:

    9 9 0
    9 0 0
    0 0 1

------------------------------------------------------------------------

# Diagonal Connectivity

Enable 8‑direction flood fill:

``` ts
flood.getConnectedRegion(grid, 0, 0, {
  allowDiagonals: true
});
```

------------------------------------------------------------------------

# Custom Comparator

Useful when grid cells are objects.

``` ts
type Tile = { type: string };

const region = flood.getConnectedRegion(grid, 0, 0, {
  equals: (a, b) => a.type === b.type
});
```

------------------------------------------------------------------------

# Game Development Example

Typical use cases:

### Match‑3 detection

Find clusters of same tiles.

### Tilemap region detection

Detect areas of terrain.

### Territory / zone filling

Used in strategy or puzzle games.

------------------------------------------------------------------------

# API

### getConnectedRegion

Returns all connected cells starting from a coordinate.

Non‑destructive.

### replaceRegion

Replaces all connected cells with a new value.

Destructive operation.

------------------------------------------------------------------------

# Complexity

Time complexity: **O(n)**\
Memory complexity: **O(n)**

Where `n` is the number of grid cells.

------------------------------------------------------------------------

# Requirements

-   rectangular grid (non jagged)
-   TypeScript 5+
-   ES modules

------------------------------------------------------------------------

# Running Tests

Install dependencies and run the test suite:

    npm install
    npm run test

The project uses **Vitest** for unit testing.

------------------------------------------------------------------------

# License

MIT License. See the [LICENSE](LICENSE) file for details.