export const dirs = {
    left: ({ x, y }) => ({ x: x - 1, y }),
    right: ({ x, y }) => ({ x: x + 1, y }),
    up: ({ x, y }) => ({ x, y: y + 1 }),
    down: ({ x, y }) => ({ x, y: y - 1 }),
};
export const cellsEqual = (c1, c2) => c1.x === c2.x && c1.y === c2.y;
export const getDir = (start, next) => {
    if (next.x > start.x)
        return 'right';
    if (next.x < start.x)
        return 'left';
    if (next.y > start.y)
        return 'up';
    if (next.y < start.y)
        return 'down';
    return 'up';
};
export const coordToKey = (c) => `${c.x}-${c.y}`;
export const keyToCoord = (k) => {
    let arr = k.split('-');
    return { x: +arr[0], y: +arr[1] };
};
export const manhattanDistance = (c1, c2) => {
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
};
//# sourceMappingURL=utils.js.map