import { SameGame } from '../../src/SameGame';
import type { SameGameBoardStats, SameGamePosition } from '../../src/SameGame';

export function run(): void {

    setDescription('Random 7x9 board with 6 tile types. <strong>getBoardStats</strong> returns board information.');
      
    const rows: number = 7;
    const columns: number = 9;
    const container: HTMLElement = document.getElementById('board') as HTMLElement;
    const generator = (): number => Math.floor(Math.random() * 6)

    const game: SameGame<number> = new SameGame(rows, columns, 'down', 'normal', generator, true);
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

function renderBoard(game: SameGame<number>, container: HTMLElement): void {
    container.innerHTML = '';
    const grid = game.getGrid();
    const colors: string[] = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f', '#9b59b6', '#e67e22'];
    for (let i: number = 0; i < grid.length; i++) {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'row';
        for (let j: number = 0; j < grid[i].length; j++) {
            const value: number | null = grid[i][j];
            const cell: HTMLDivElement = document.createElement('div');
            cell.className = 'cell';
            if (value !== null) {
                cell.style.background = colors[value];
            }
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}