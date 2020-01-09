import Cell from "./classes/cell.js";

const shapeBank = [
    {
        color: 'rgba(244, 67, 54, 1)',
        shape: [
            [1],
            [1],
            [1],
            [1]
        ]
    },
    {
        color: 'rgba(191, 54, 12, 1)',
        shape: [
            [1, 1],
            [1, 1]
        ]
    },
    {
        color: 'rgba(0, 150, 136, 1)',
        shape: [
            [1, 1, 1],
            [0, 1, 0]
        ]
    },
    {
        color: 'rgba(63, 81, 181, 1)',
        shape: [
            [1, 1, 1],
            [1, 0, 0]
        ]
    },
    {
        color: 'rgba(47, 127, 51, 1)',
        shape: [
            [1, 1, 1],
            [0, 0, 1]
        ]
    },
    {
        color: 'rgba(233, 30, 99, 1)',
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    {
        color: 'rgba(175, 180, 43, 1)',
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ]
    }
];

/** @type {Cell[][][]} */
const shapeBankTransformed = shapeBank.map(s => {
    const map = [];

    s.shape.forEach((row, y) => {
        map.push(row.map((v, x) => {
            if (v === 0) return null;
            else return new Cell(s.color);
        }));
    });

    return map;
});

const options = {
    PIXEL_DIMENSION: 30,
    MAP_WIDTH: 10,
    MAP_HEIGHT: 20,
    SHAPE_CANVAS_DIMENSION: 4,
    GAME_INTERVAL: 150
}

const directions = {
    left: 'left',
    right: 'right'
};

export { options, shapeBankTransformed as shapeBank, directions };