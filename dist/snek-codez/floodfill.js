import { BattleMap } from './graph.js';
import { coordToKey } from './utils.js';
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
//# sourceMappingURL=floodfill.js.map