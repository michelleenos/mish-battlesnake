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
export function floodFillMap(map) {
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            let coord = { x, y };
            let cell = map.get(coord);
            if (cell.blocked)
                continue;
            if (cell.fill !== undefined)
                continue;
            let cells = floodFillCells(map, coord);
            cells.forEach((cell) => {
                map.setFill(keyToCoord(cell), cells.size);
            });
        }
    }
}
//# sourceMappingURL=floodfill.js.map