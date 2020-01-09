import Cell from "./cell.js";
import { shapeBank, options, directions } from "../config.js";

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

    /** @param {KeyboardEvent} event */
    rotate(event) {
        if (event.type === 'keydown' && this.canRotate) {
            let direction = '';

            if (event.key === 'z') direction = directions.left;
            if (event.key === 'x') direction = directions.right;

            if (direction !== '') {
                const newContent = new Array(this.content[0].length);
                for (let i = 0; i < newContent.length; i++) newContent[i] = new Array(this.content.length);

                this.content.forEach((row, y) => {
                    row.forEach((cell, x) => {
                        if (direction === directions.right)
                            newContent[x][this.content.length - 1 - y] = cell;
                        else if (direction === directions.left)
                            newContent[row.length - 1 - x][y] = cell;
                    });
                });

                this.content = newContent;
            }
        }
        else if (event.type === 'keyup') this.canRotate = true;
    }
}

export default Shape;