import { options } from "../config.js";
import Cell from "./cell.js";
import Shape from "./shape.js";

/** @returns {Cell[][]} */
function generateMap() {
    const map = [];

    for (let y = 0; y < options.MAP_HEIGHT; y++) {
        const row = [];
        // for (let x = 0; x < options.MAP_WIDTH; x++) row.push(new Cell(x, y, 'rgba(230, 30, 30, 1)'));
        for (let x = 0; x < options.MAP_WIDTH; x++) row.push(null);

        map.push(row);
    }

    return map;
}

/**
 * @param {CanvasRenderingContext2D} context
 * @param {Cell} cell
 * @param {number} x
 * @param {number} y
 */
function paintCells(context, cell, x, y) {
    const { PIXEL_DIMENSION: pd } = options;
    const cellFactor = 6;

    context.fillStyle = cell.color;
    context.fillRect(x * pd, y * pd, pd, pd);

    context.fillStyle = 'white';
    context.fillRect(
        (x * pd) + cellFactor,
        (y * pd) + cellFactor,
        pd - (cellFactor * 2),
        pd - (cellFactor * 2)
    );

    context.fillStyle = cell.color.replace('1)', '0.5)');
    context.fillRect(
        (x * pd) + cellFactor,
        (y * pd) + cellFactor,
        pd - (cellFactor * 2),
        pd - (cellFactor * 2)
    );

    context.strokeStyle = 'white';
    context.strokeRect(x * pd, y * pd, pd, pd);
}

class Game {
    constructor() {
        /** @type {HTMLCanvasElement} */
        this.gameCanvas = document.querySelector('canvas#game');
        /** @type {HTMLCanvasElement} */
        this.shapeCanvas = document.querySelector('canvas#shape');

        this.gameContext = this.gameCanvas.getContext('2d');
        this.shapeContext = this.shapeCanvas.getContext('2d');

        /** @type {Shape} */
        this.actualShape = null;
        this.nextShape = new Shape();
        this.score = 0;

        this.map = generateMap();
        this.gameInterval = NaN;
    }

    initialize() {
        const { PIXEL_DIMENSION, SHAPE_CANVAS_DIMENSION } = options;

        this.gameCanvas.width = options.MAP_WIDTH * PIXEL_DIMENSION;
        this.gameCanvas.height = options.MAP_HEIGHT * PIXEL_DIMENSION;

        this.shapeCanvas.width = SHAPE_CANVAS_DIMENSION * PIXEL_DIMENSION;
        this.shapeCanvas.height = SHAPE_CANVAS_DIMENSION * PIXEL_DIMENSION;

        document.addEventListener('keydown', e => {
            if (this.actualShape) {
                this.actualShape.move(e, this.map);
                this.actualShape.rotate(e, this.map)
            }
        });

        document.addEventListener('keyup', e => {
            if (this.actualShape) {
                this.actualShape.move(e, this.map);
                this.actualShape.rotate(e, this.map)
            }
        });

        this.gameInterval = setInterval(() => {
            this.update();
            this.render();
        }, options.GAME_INTERVAL);
    }

    render() {
        const { PIXEL_DIMENSION: pd, SHAPE_CANVAS_DIMENSION: scd } = options;

        // PAINTING BOARD
        this.gameContext.fillStyle = '#000';
        this.gameContext.fillRect(0, 0, options.MAP_WIDTH * pd, options.MAP_HEIGHT * pd);

        this.map.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) paintCells(this.gameContext, cell, x, y);
            });
        });

        // PAINTING NEXT SHAPE
        this.shapeContext.fillStyle = '#000';
        this.shapeContext.fillRect(0, 0, scd * pd, scd * pd);

        this.nextShape.content.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) paintCells(this.shapeContext, cell, x, y);
            });
        });

        // PAINTING ACTUAL SHAPE
        if (this.actualShape) {
            this.actualShape.content.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) paintCells(this.gameContext, cell, this.actualShape.x + x, this.actualShape.y + y);
                });
            });
        }

        //PAINTING SCORE
        document.querySelector('span#score').textContent = '' + this.score;
    }

    migrateCells() {
        const { actualShape } = this;

        actualShape.content.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) this.map[actualShape.y + y][actualShape.x + x] = cell;
            });
        });

        this.actualShape = null;
    }

    /**
     * @param {number[]} rowIndexes
     */
    destroyRows(rowIndexes) {
        const len = rowIndexes.length;
        this.score += len;

        for (let i = len - 1; i >= 0; i--) {
            this.map.splice(rowIndexes[i], 1);
        }

        for (let y = 0; y < len; y++) {
            const row = [];
            for (let x = 0; x < options.MAP_WIDTH; x++) row.push(null);

            this.map.splice(0, 0, row);
        }
    }

    verifyCollision() {
        /** @type {number[]} */
        const rowsToDestroy = [];

        this.map.forEach((row, rowIndex) => {
            let destroyRow = true;

            row.forEach(cell => {
                if (!cell) destroyRow = false;
            });

            if (destroyRow) rowsToDestroy.push(rowIndex);
        });

        this.destroyRows(rowsToDestroy);
    }

    gameOver() {
        clearInterval(this.gameInterval);

        alert('Game over, final score: ' + this.score);
        window.location.href = window.location.href;
    }

    update() {
        if (!this.actualShape) {
            this.actualShape = new Shape(this.nextShape.content);
            this.actualShape.setFallPosition();
            this.nextShape.generate();

            if (this.actualShape.isCollide(this.map)) this.gameOver();
        }
        else {
            this.actualShape.fall(this.map, isFallen => {
                if (isFallen) {
                    this.migrateCells();
                    this.verifyCollision();
                }
            });
        }
    }
}

export default Game;