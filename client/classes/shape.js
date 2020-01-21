import Cell from "./cell.js";
import { shapeBank, options, directions } from "../config.js";

/**
 * @param {number} xPos
 * @param {number} yPos
 * @param {Cell[][]} content
 * @param {Cell[][]} map
 * @returns {boolean}
 */
const verifyCollision = (xPos, yPos, content, map) => {
    let isCollision = false;

    content.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellPos = { x: xPos + x, y: yPos + y };

            let b = (cellPos.x < 0 || cellPos.x >= options.MAP_WIDTH) ||
                cellPos.y >= options.MAP_HEIGHT;

            if (b) isCollision = true;
        });
    });

    return isCollision;
}

class Shape {
    /**
     * @param {Cell[][]} content
     */
    constructor(content = null) {
        /** @type {Cell[][]} */
        this.content = null;

        this.x = 0;
        this.y = 0;
        this.canMove = true;
        this.canRotate = true;

        if (content) this.content = content;
        else this.generate();
    }

    generate() {
        this.content = shapeBank[Math.floor(Math.random() * (shapeBank.length - 1))];
    }

    setFallPosition() {
        this.x = options.MAP_WIDTH / 2;
        this.y = 0;
    }

    /**
     * @param {Cell[][]} map
     * @param {(isFallen: boolean) => void} callback
     */
    fall(map, callback) {
        let canFall = true;

        this.content.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const xPos = this.x + x;
                    const yPos = this.y + y;

                    if (!map[yPos + 1] || map[yPos + 1][xPos]) canFall = false;
                }
            });
        });

        if (canFall) this.y++;
        callback(!canFall);
    }

    /**
     * @param {Cell[][]} map
     * @returns {boolean}
     */
    isCollide(map) {
        let res = false;

        this.content.forEach((row, y) => {
            row.forEach((cell, x) => {
                const pos = { x: this.x + x, y: this.y + y };
                if (map[pos.y][pos.x]) res = true;
            });
        });

        return res;
    }

    /**
     * @param {KeyboardEvent} event
     * @param {Cell[][]} map
     */
    move(event, map) {
        if (event.type === 'keydown' && this.canMove) {
            let movement = 0;
            let canMove = true;

            if (event.key === 'ArrowRight') movement = 1;
            if (event.key === 'ArrowLeft') movement = -1;

            this.content.forEach((row, y) => {
                row.forEach((cell, x) => {
                    const futureXPos = this.x + x + movement;
                    const yPos = this.y + y;

                    if (cell && (
                        (futureXPos >= options.MAP_WIDTH || futureXPos < 0) ||
                        map[yPos][futureXPos]
                    ))
                        canMove = false;
                });
            });

            if (canMove) this.x += movement;

            this.canMove = false;
        }
        else if (event.type === 'keyup') this.canMove = true;
    }

    /**
     * @param {KeyboardEvent} event
     * @param {Cell[][]} map
     * */
    rotate(event, map) {
        if (event.type === 'keydown' && this.canRotate) {
            const { x, y, content } = this;
            let direction = '';

            if (event.key === 'z') direction = directions.left;
            if (event.key === 'x') direction = directions.right;

            if (direction !== '') {
                /** @type {Cell[][]} */
                const newContent = new Array(content[0].length);
                for (let i = 0; i < newContent.length; i++) newContent[i] = new Array(content.length);

                content.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (direction === directions.right) newContent[x][content.length - 1 - y] = cell;
                        else if (direction === directions.left) newContent[row.length - 1 - x][y] = cell;
                    });
                });

                if (!verifyCollision(x, y, newContent, map)) this.content = newContent;
            }
        }
        else if (event.type === 'keyup') this.canRotate = true;
    }
}

export default Shape;