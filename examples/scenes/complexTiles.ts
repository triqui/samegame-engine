import { SameGame } from '../../src/SameGame';
import type { SameGameBoardStats, SameGamePosition } from '../../src/SameGame';

interface Tile {
    type: string;
    color: string;
    points: number;
}

export function run(): void {

    setDescription('Each tile has a color, a type and a score value (mouse over to see properties).<br />Regions are detected using a custom equality comparator.');

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
    renderBoard(game, container);
    const stats: SameGameBoardStats = game.getBoardStats();
    let logString: string = `<div><strong>Tiles</strong>: ${stats.tiles}</div>`;
    logString += `<div><strong>Regions</strong>: ${stats.regions.length}</div>`;
    stats.regions.forEach((region: SameGamePosition[], index: number) => {   
        logString += `<div><strong>Region ${index}</strong>: `
        region.forEach((cell: SameGamePosition, index: number) => {
            logString += `(${cell.row}, ${cell.col})`;
            if (index < region.length - 1) {
                logString += '; ';
            }
        });
        logString += '</div>';
    })
    setLog(logString);
}

function renderBoard(game: SameGame<Tile>, container: HTMLElement): void {
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
                cell.style.background = tile.color;
                cell.title = tile.type + ' (' + tile.points + ' pts)';
            }
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}