import { SameGame } from '../../src/SameGame';
import type { SameGameBoardStats, SameGamePosition } from '../../src/SameGame';

interface Tile {
    type: string;
    color: string;
    points: number;
}

export function run(): void {

    const rotatebuttons: HTMLElement | null = document.getElementById('rotation');
    if (rotatebuttons) {
        rotatebuttons.style.display = 'block';
    }

    setDescription('Use buttons to rotate the table<br />Gravity is always from top to bottom.');

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
    const buttons = document.querySelectorAll('.rotate');
    buttons.forEach((button: Element) => {
        if (button instanceof HTMLElement) {  
            button.onclick = () => {
                const rotation: string | undefined = button.dataset.rotation;
                if (rotation == 'clockwise') {
                    game.rotateClockwise();
                }
                else {
                    game.rotateCounterClockwise();
                }
                game.setGravity('down', true);
                renderBoard(game, container);
            };
        }
    });
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
                    game.removeRegion(i, j);
                    renderBoard(game, container);
                });
                row.appendChild(cell);
            }
            container.appendChild(row);
        }
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
}