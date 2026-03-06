import { FloodFill2D } from '../src/FloodFill2D';

enum CellType {
    Empty = 0,
    Wall = 1,
    Fill = 2
}

const GRID_SIZE: number = 30;
const CELL_SIZE: number = 20;

let grid: CellType[][] = [];

const flood: FloodFill2D<CellType> = new FloodFill2D<CellType>();

const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const densitySlider: HTMLInputElement = document.getElementById('density') as HTMLInputElement;

const colors: Record<CellType, string> = {
    [CellType.Empty]: '#eeeeee',
    [CellType.Wall]: '#444',
    [CellType.Fill]: '#4caf50'
};

function createGrid(): void {
    const density: number = Number(densitySlider.value) / 100;
    grid = [];
    for (let i: number = 0; i < GRID_SIZE; i++) {
        const row: CellType[] = [];
        for (let j: number = 0; j < GRID_SIZE; j++) {
            const value: CellType = Math.random() < density ? CellType.Wall : CellType.Empty;
            row.push(value);
        }
        grid.push(row);
    }
}

function removeFill(): void {
    for (let i: number = 0; i < GRID_SIZE; i++) {
        for (let j: number = 0; j < GRID_SIZE; j++) {
            const value: CellType = grid[i][j];
            if (value === CellType.Fill) {
                grid[i][j] = CellType.Empty;
            }
        }
    }
}

function draw(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i: number = 0; i < GRID_SIZE; i++) {
        for (let j: number = 0; j < GRID_SIZE; j++) {
            const value: CellType = grid[i][j];
            const color: string = colors[value];
            const x: number = j * CELL_SIZE;
            const y: number = i * CELL_SIZE;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

canvas.addEventListener('click', (event: MouseEvent): void => {
    const rect: DOMRect = canvas.getBoundingClientRect();
    const x: number = Math.floor((event.clientX - rect.left) / CELL_SIZE);
    const y: number = Math.floor((event.clientY - rect.top) / CELL_SIZE);
    if (grid[y][x] === CellType.Wall) {
        return;
    }
    flood.replaceRegion(grid, x, y, CellType.Fill);
    draw();
});

const generateButton: HTMLButtonElement = document.getElementById("generate") as HTMLButtonElement;

generateButton.addEventListener("click", (): void => {
    createGrid();
    draw();
});

const clearButton: HTMLButtonElement = document.getElementById("clear") as HTMLButtonElement;

clearButton.addEventListener("click", (): void => {
    removeFill();
    draw();
});

createGrid();
draw();