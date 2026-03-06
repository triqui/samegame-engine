/**
    * represents a 2D coordinate inside a grid
*/
export interface Point {
    /**
        * horizontal coordinate (column index)
    */
    x: number;

    /**
        * vertical coordinate (row index)
    */
    y: number;
}

/**
    * represents a two-dimensional grid structure
    * first index is the row (y), second index is the column (x)
    *  
    * all rows are expected to have the same length
    * jagged arrays are not supported
*/
export type Grid2D<T> = T[][];

/**
    * defines a custom equality comparison between two values of type T
    * useful when T is an object and reference equality is not sufficient
*/
export type EqualityComparator<T> = (a: T, b: T) => boolean;

/**
    * configuration options for flood fill operations
*/
export interface FloodFillOptions<T> {

    /**
        * if true, diagonal neighbors are included (8-directional flood fill)
        * if false or undefined, only orthogonal neighbors are considered (4-directional)
    */
    allowDiagonals?: boolean;

    /**
        * explicit value to match during the flood operation
        * if undefined, the value at the starting coordinate is used
    */
    targetValue?: T;

    /**
        * custom equality comparator used to compare grid values
        * defaults to strict equality (===) if not provided
    */
    equals?: EqualityComparator<T>;
}

/**
    * utility class providing 2D flood fill operations on rectangular grids
    *
    * the class is stateless and can be reused across multiple grids
    * all methods assume the provided grid is rectangular (non jagged)
*/
export class FloodFill2D<T> {

    /**
        * orthogonal neighbor directions (4-connectivity)
        * up, down, left, right
    */
    private static readonly DIRECTIONS_4: ReadonlyArray<Point> = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 }
    ];

    /**
        * orthogonal + diagonal neighbor directions (8-connectivity)
        * includes the four diagonals in addition to the orthogonal directions
    */
    private static readonly DIRECTIONS_8: ReadonlyArray<Point> = [
        { x: 0, y: -1 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: 1 },
        { x: 1, y: 1 }
    ];

    /**
        * performs a non-destructive flood fill starting from the given coordinate
        * and returns all connected points matching the target value
        *
        * the method does not mutate the provided grid
        *
        * connectivity can be either 4-directional (orthogonal) or 8-directional
        * depending on the provided options
        *
        * the starting value is determined as follows:
        * - if options.targetValue is defined, that value is used
        * - otherwise, the value at (startX, startY) is used
        *
        * a custom equality comparator can be provided through options.equals.
        * if omitted, strict equality (===) is used.
        *
        * if the grid is invalid, empty, non-rectangular, or the starting
        * coordinate is outside bounds, an empty array is returned.
        *
        * @param grid rectangular 2D grid (non jagged)
        * @param startX starting column index
        * @param startY starting row index
        * @param options optional flood fill configuration
        *
        * @returns array of connected points belonging to the same region
        *
        * @complexity O(n) in the worst case, where n is the number of cells
        * in the grid
    */
    public getConnectedRegion(grid: Grid2D<T>, startX: number, startY: number, options: FloodFillOptions<T> = {}): Point[] {

        if (!this.isValidGrid(grid)) {
            return [];
        }

        const height: number = grid.length;
        const width: number = grid[0].length;

        if (!this.isInside(startX, startY, width, height)) {
            return [];
        }

        const allowDiagonals: boolean = options.allowDiagonals ?? false;
        const equals: EqualityComparator<T> = options.equals ?? ((a: T, b: T): boolean => a === b);

        const startValue: T = options.targetValue !== undefined ? options.targetValue : grid[startY][startX];

        const directions: ReadonlyArray<Point> = allowDiagonals ? FloodFill2D.DIRECTIONS_8 : FloodFill2D.DIRECTIONS_4;

        const visited: boolean[][] = this.createVisitedGrid(width, height);
        const stack: Point[] = [{ x: startX, y: startY }];
        const region: Point[] = [];

        while (stack.length > 0) {

            const current: Point = stack.pop() as Point;
            const x: number = current.x;
            const y: number = current.y;

            if (!this.isInside(x, y, width, height)) {
                continue;
            }

            if (visited[y][x]) {
                continue;
            }

            if (!equals(grid[y][x], startValue)) {
                continue;
            }

            visited[y][x] = true;

            region.push({ x: x, y: y });

            for (let i: number = 0; i < directions.length; i++) {

                const dir: Point = directions[i];
                const nx: number = x + dir.x;
                const ny: number = y + dir.y;

                if (this.isInside(nx, ny, width, height) && !visited[ny][nx]) {
                    stack.push({ x: nx, y: ny });
                }
            }
        }

        return region;
    }

    /**
        * performs a destructive flood fill starting from the given coordinate
        * and replaces all connected cells with the provided new value
        *
        * this method mutates the provided grid in place
        *
        * region detection follows the same rules as getConnectedRegion:
        * - if options.targetValue is defined, it is used as the match value
        * - otherwise, the value at (startX, startY) is used
        * - connectivity can be 4-directional or 8-directional
        * - a custom equality comparator can be provided
        *
        * if the grid is invalid or the starting coordinate is outside bounds,
        * the grid remains unchanged and an empty array is returned
        *
        * @param grid rectangular 2D grid (non jagged)
        * @param startX starting column index
        * @param startY starting row index
        * @param newValue value that will replace all cells in the detected region
        * @param options optional flood fill configuration
        *
        * @returns array of points that were replaced
        *
        * @complexity O(n) in the worst case, where n is the number of cells
        * in the grid
        *
        * @memory O(n) due to the visited matrix used during region detection
    */
    public replaceRegion(grid: Grid2D<T>, startX: number, startY: number, newValue: T, options: FloodFillOptions<T> = {}): Point[] {

        const region: Point[] = this.getConnectedRegion(grid, startX, startY, options);

        for (let i: number = 0; i < region.length; i++) {
            const point: Point = region[i];
            grid[point.y][point.x] = newValue;
        }

        return region;
    }

    /**
        * validates that the provided grid is a non-empty rectangular structure
        *
        * requirements:
        * - grid must be an array
        * - grid must contain at least one row
        * - first row must be an array
        * - first row must contain at least one column
        *
        * note: this method does not deeply validate rectangularity
        * it assumes all rows have the same length as grid[0]
        *
        * @param grid candidate 2D grid
        * @returns true if the grid is structurally valid
    */
    private isValidGrid(grid: Grid2D<T>): boolean {
        return (Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0);
    }

    /**
        * checks whether the given coordinate lies within the grid bounds
        *
        * @param x column index
        * @param y row index
        * @param width total number of columns
        * @param height total number of rows
        *
        * @returns true if (x, y) is inside the grid boundaries
    */
    private isInside(x: number, y: number, width: number, height: number): boolean {
        return x >= 0 && x < width && y >= 0 && y < height;
    }

    /**
        * creates a boolean matrix used to track visited cells
        * during flood fill traversal
        *
        * the matrix has the same dimensions as the grid:
        * height rows and width columns
        *
        * all entries are initialized to false
        *
        * @param width number of columns
        * @param height number of rows
        *
        * @returns a height x width boolean matrix
    */
    private createVisitedGrid(width: number, height: number): boolean[][] {

        const visited: boolean[][] = new Array<boolean[]>(height);

        for (let i: number = 0; i < height; i++) {

            visited[i] = new Array<boolean>(width);

            for (let j: number = 0; j < width; j++) {
                visited[i][j] = false;
            }
        }

        return visited;
    }
}