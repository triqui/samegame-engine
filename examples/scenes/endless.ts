import { SameGame } from '../../src/SameGame';
import type { SameGamePosition, SameGameBoardChange } from '../../src/SameGame';

interface Tile {
    type: string;
    color: string;
    points: number;
}

export function run(): void {

    setDescription('Endless board<br />Tiles are replaced after removal.');

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
    const game: SameGame<Tile> = new SameGame(rows, columns, 'down', 'endless', generator, true, equals);
    renderBoard(game, container);
}

function renderBoard(game: SameGame<Tile>, container: HTMLElement): void {
    container.innerHTML = '';
    const grid: (Tile | null)[][] = game.getGrid();
    const elementArray: HTMLDivElement[][] = [];
    for (let i: number = 0; i < grid.length; i++) {
        const row: HTMLDivElement = document.createElement('div');
        elementArray[i] = [];
        row.className = 'row';
        for (let j: number = 0; j < grid[i].length; j++) {
            const tile: Tile | null = grid[i][j];
            const cell: HTMLDivElement = document.createElement('div');
            cell.className = 'cell';
            if (tile !== null) {
                cell.style.backgroundColor = tile.color;
                cell.title = tile.type + ' (' + tile.points + ' pts)';
            }
            cell.addEventListener('mouseenter', () => {
                const region: SameGamePosition[] = game.getRegion(i, j);
                if (region.length >= 2) {
                    region.forEach((cell: SameGamePosition) => {
                        elementArray[cell.row][cell.col].classList.add('highlight');    
                    }) 
                }
            });
            cell.addEventListener('mouseleave', () => {
                const region: SameGamePosition[] = game.getRegion(i, j);
                if (region.length >= 2) {
                    region.forEach((cell: SameGamePosition) => {
                        elementArray[cell.row][cell.col].classList.remove('highlight');    
                    }) 
                }
            });
            elementArray[i][j] = cell;
            cell.addEventListener('click', () => {
                const change: SameGameBoardChange<Tile> = game.removeRegion(i, j);
                let logString: string = '';
                if (change.removed.length > 0) {
                    logString += '<div><strong>Removed</strong></div><div>';
                    change.removed.forEach((removed: SameGamePosition, index: number) => {
                        if (index > 0) {
                            logString += '; ';
                        }
                        logString += `(${removed.row}, ${removed.col})`;
                    })    
                    logString += '</div>';
                }
                if (change.moved.length > 0) {
                    logString += '<div><strong>Moved</strong></div><div>';
                    change.moved.forEach((move: { from: SameGamePosition, to: SameGamePosition, value: Tile }, index: number) => {
                        if (index > 0) {
                            logString += '; ';
                        }
                        logString += `(${move.from.row}, ${move.from.col}) &raquo; (${move.to.row}, ${move.to.col})`;
                    })    
                    logString += '</div>';
                }
                if (change.shifted.length > 0) {
                    logString += '<div><strong>Shifted</strong></div><div>';
                    change.shifted.forEach((shift: { from: SameGamePosition, to: SameGamePosition, value: Tile }, index: number) => {
                        if (index > 0) {
                            logString += '; ';
                        }
                        logString += `(${shift.from.row}, ${shift.from.col}) &raquo; (${shift.to.row}, ${shift.to.col})`;
                    })    
                    logString += '</div>';
                }
                if (change.spawned.length > 0) {
                    logString += '<div><strong>Spawned</strong></div><div>';
                    change.spawned.forEach((spawn: { at: SameGamePosition, value: Tile }, index: number) => {
                        if (index > 0) {
                            logString += '; ';
                        }
                        logString += `(${spawn.at.row}, ${spawn.at.col}): ${spawn.value.type}`;
                    })    
                    logString += '</div>';
                }
                renderBoard(game, container);
                setLog(logString);
            });
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}