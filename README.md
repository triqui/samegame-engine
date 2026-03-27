# SameGame Engine

![license](https://img.shields.io/badge/license-MIT-blue)
![typescript](https://img.shields.io/badge/TypeScript-5.x-blue)
![status](https://img.shields.io/badge/status-active-brightgreen)

A headless SameGame engine written in TypeScript.

This library implements the core mechanics of the classic SameGame puzzle:
remove groups of adjacent tiles with the same value, apply gravity, and compact the board.

------------------------------------------------------------------------

## Features

- generic tile type (T)
- flood-fill region detection
- 4-direction gravity (down, up, left, right)
- normal and endless modes
- full board change tracking:
  - removed tiles
  - moved tiles (gravity)
  - shifted tiles (compaction)
  - spawned tiles (endless mode)
- completely headless (no rendering)

------------------------------------------------------------------------

## Demo

Live demo: https://triqui.github.io/samegame-engine/examples/

Explore all examples directly in your browser:
- basic board
- board with complex tiles
- region detection
- gravity
- board rotation
- endless board

------------------------------------------------------------------------

## Installation

Clone the repository:

    git clone https://github.com/triqui/samegame-engine.git

Or copy the source files into your project:

    src/FloodFill2D.ts
    src/SameGame.ts

------------------------------------------------------------------------

## Usage

```ts
import { SameGame } from './src/SameGame';

const game = new SameGame<number>(
    8,
    8,
    'down',
    'normal',
    () => Math.floor(Math.random() * 5),
    true
);

const change = game.removeRegion(0, 0);

console.log(change);
```

------------------------------------------------------------------------

## Board Change Model

Every move returns a full description of what happened:

SameGameBoardChange<T>

Includes:

- removed → cleared tiles
- moved → tiles falling due to gravity
- shifted → rows/columns compacted
- spawned → new tiles (endless mode)

This makes the engine ideal for animations and rendering layers.

------------------------------------------------------------------------

## API Overview

### Constructor

    new SameGame<T>(
    rows,
    cols,
    gravity,
    mode,
    generator,
    ensurePlayable?,
    comparator?
    )

------------------------------------------------------------------------

### Core Methods

getGrid()
getTile(row, col)
setTile(row, col, value)
randomize(generator)

------------------------------------------------------------------------

### Gameplay

getRegion(row, col)
getAllRegions()
getLargestRegion()
removeRegion(row, col)
hasMoves()

------------------------------------------------------------------------

### Game State

getBoardStats()

------------------------------------------------------------------------

### Configuration

setGravity(gravity, instantApply?)
getGravity()

setMode(mode)
getMode()

------------------------------------------------------------------------

### Board Manipulation

    rotateClockwise()
    rotateCounterClockwise()

------------------------------------------------------------------------

## Types

### SameGameGravity
'down' | 'up' | 'left' | 'right'

### SameGameMode
'normal' | 'endless'

### SameGamePosition
{ row, col }

### SameGameBoardStats
{ tiles, empty, regions, largestRegion }

### SameGameBoardChange<T>
{ removed, moved, shifted, spawned }

------------------------------------------------------------------------

## Design Goals

- deterministic behavior
- UI-agnostic (headless)
- easy to integrate in any framework:
  - DOM
  - Canvas
  - Phaser
  - React
- reusable core logic

------------------------------------------------------------------------

## Project Structure

src/        → engine core  
examples/   → interactive demos  

------------------------------------------------------------------------

## License

MIT License. See the [LICENSE](LICENSE) file for details.
