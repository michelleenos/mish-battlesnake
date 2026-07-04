import { BattleMap } from './graph.js';
import { coordToKey, keyToCoord } from './utils.js';
export function floodFillCells(map, coord) {
    const visited = new Set();
    const checkCoord = (c) => {
        if (visited.has(coordToKey(c)))
            return;
        visited.add(coordToKey(c));
        const neighbors = map.neighbors(c);
        neighbors.forEach((neighbor) => {
            checkCoord(neighbor);
        });
    };
    checkCoord(coord);
    return visited;
}
export function floodFill(map, coord) {
    return floodFillCells(map, coord).size;
}
export function floodFillMap(map, state) {
    const regions = [];
    let min = Infinity;
    let max = -Infinity;
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            const coord = { x, y };
            const cell = map.get(coord);
            if (cell.blocked)
                continue;
            if (cell.fill !== undefined)
                continue;
            const cells = floodFillCells(map, coord);
            regions.push(cells);
            if (cells.size < min)
                min = cells.size;
            if (cells.size > max)
                max = cells.size;
            cells.forEach((cell) => {
                map.setFill(keyToCoord(cell), cells.size);
            });
        }
    }
    const amTooBig = max < state.you.length;
    const mid = (max - min) / 2 + min;
    map.getAll().forEach((coord) => {
        const cell = map.get(coord);
        if (cell.fill && cell.fill < state.you.length) {
            if (amTooBig) {
                if (cell.fill < mid) {
                    map.setDanger(coord, 30);
                }
                else if (cell.fill < max) {
                    map.setDanger(coord, 10);
                }
                else {
                    // fill === max, do nothing since this is ideal in this case
                }
            }
            else {
                map.setDanger(coord, 30);
            }
        }
    });
    return { regions, min, max };
}
//# sourceMappingURL=floodfill.js.map