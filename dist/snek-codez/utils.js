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
export const isWall = (c, width, height) => {
    return c.x === 0 || c.x === width - 1 || c.y === 0 || c.y === height - 1;
};
export const isBaby = (body) => {
    if (body.length > 3)
        return false;
    const head = body[0];
    const neck = body[1];
    const tail = body[2];
    if (cellsEqual(head, neck) || cellsEqual(head, tail) || cellsEqual(neck, tail))
        return true;
    return false;
};
//# sourceMappingURL=utils.js.map