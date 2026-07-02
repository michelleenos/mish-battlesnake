import { coordToKey, dirs } from './utils.js';
export class MapGraph {
    width;
    height;
    map;
    constructor(width, height, initItem) {
        this.width = width;
        this.height = height;
        this.map = new Map();
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.map.set(coordToKey({ x, y }), initItem(x, y));
            }
        }
    }
    get(c) {
        if (!this.map.has(coordToKey(c)))
            throw new Error(`out of bounds coord: ${c.x}, ${c.y}`);
        const item = this.map.get(coordToKey(c));
        return item;
    }
    set(c, val) {
        this.map.set(coordToKey(c), val);
    }
    has(c) {
        return this.map.has(coordToKey(c));
    }
}
export class BattleMap extends MapGraph {
    constructor(width, height) {
        super(width, height, () => ({}));
        this.width = width;
        this.height = height;
    }
    setBlocked(c, blocked = true) {
        const cell = this.get(c);
        cell.blocked = blocked;
    }
    setDanger(c, danger, overwrite = false) {
        const cell = this.get(c);
        const current = cell.danger;
        if (current !== undefined) {
            if (overwrite)
                cell.danger = danger;
            else
                cell.danger = Math.max(current, danger);
        }
        else {
            cell.danger = danger;
        }
        // cell.danger =
        //     current !== undefined ? (overwrite ? danger : Math.max(danger, current)) : danger
    }
    getDanger(c) {
        return this.get(c).danger || 0;
    }
    neighbors(c) {
        return Object.values(dirs)
            .map((move) => move(c))
            .filter((n) => {
            return this.has(n) && !this.get(n).blocked;
        });
    }
}
//# sourceMappingURL=graph.js.map