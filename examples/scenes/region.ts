import { SameGame } from '../../src/SameGame';
import type { SameGamePosition } from '../../src/SameGame';

interface Tile {
    type: string;
    color: string;
    points: number;
}

export function run(): void {

    setDescription('Click a tile to print the connected region and highlight it on the board.<br />Tiles are objects with color and metadata.');

    const tileTypes: Tile[] = [
        { type: 'ruby', color: '#e74c3c', points: 10 },
        { type: 'sapphire', color: '#3498db', points: 15 },
        { type: 'emerald', color: '#2ecc71', points: 20 },
        { type: 'gold', color: '#f1c40f', points: 25 },
        { type: 'amethyst', color: '#9b59b6', points: 30 }
    ];

    const rows: number = 7;
    const columns: number = 9;
    const container: HTMLElement = document.getElementById('board') as HTMLElement;
    const generator = (): Tile => {
        const index: number = Math.floor(Math.random() * tileTypes.length);
        const base: Tile = tileTypes[index];
        return {
            type: base.type,
            color: base.color,
            points: base.points
        };
    };
    const equals = (a: Tile | null, b: Tile | null): boolean => {
        return a !== null && b !== null && a.type === b.type;
    }
    const game: SameGame<Tile> = new SameGame(rows, columns, 'down', 'normal', generator, true, equals);
    renderBoard(game, [], container);
}

function renderBoard(game: SameGame<Tile>, highlightedRegion: SameGamePosition[], container: HTMLElement): void {
    container.innerHTML = '';
    const grid: (Tile | null)[][] = game.getGrid();
    for (let i: number = 0; i < grid.length; i++) {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'row';
        for (let j: number = 0; j < grid[i].length; j++) {
            const tile: Tile | null = grid[i][j];
            const cell: HTMLDivElement = document.createElement('div');
            cell.className = 'cell';
            if (tile !== null) {
                cell.style.backgroundColor = tile.color;
                cell.title = tile.type + ' (' + tile.points + ' pts)';
            }
            if (isPointInRegion(i, j, highlightedRegion)) {
                cell.classList.add('highlight');
            }
            cell.addEventListener('click', () => {
                const region: SameGamePosition[] = game.getRegion(i, j);
                let logString: string = `<div><strong>Region size</strong>: ${region.length}</div>`;
                region.forEach((cell: SameGamePosition, index: number) => {
                    logString += `(${cell.row}, ${cell.col})`;
                    if (index < region.length - 1) {
                        logString += '; ';
                    }
                });
                setLog(logString);
                renderBoard(game, region, container);

            });
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function isPointInRegion(row: number, col: number, region: SameGamePosition[]): boolean {
    for (let i: number = 0; i < region.length; i++) {
        const point: SameGamePosition = region[i];
        if (point.row === row && point.col === col) {
            return true;
        }
    }
    return false;
}