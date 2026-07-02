import type { Coord } from '../types'
import { coordToKey, dirs, type NodeKey } from './utils.js'

export class MapGraph<T> {
    width: number
    height: number
    map: Map<NodeKey, T>

    constructor(width: number, height: number, initItem: (x: number, y: number) => T) {
        this.width = width
        this.height = height
        this.map = new Map()

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.map.set(coordToKey({ x, y }), initItem(x, y))
            }
        }
    }

    get(c: Coord): T {
        if (!this.map.has(coordToKey(c))) throw new Error(`out of bounds coord: ${c.x}, ${c.y}`)
        const item = this.map.get(coordToKey(c))!
        return item
    }

    set(c: Coord, val: T) {
        this.map.set(coordToKey(c), val)
    }

    has(c: Coord) {
        return this.map.has(coordToKey(c))
    }
}

type WeightedCell = {
    blocked?: Boolean
    danger?: number
}

export class BattleMap extends MapGraph<WeightedCell> {
    constructor(width: number, height: number) {
        super(width, height, () => ({}))
        this.width = width
        this.height = height
    }

    setBlocked(c: Coord, blocked = true) {
        const cell = this.get(c)
        cell.blocked = blocked
    }

    setDanger(c: Coord, danger: number, overwrite = false) {
        const cell = this.get(c)
        const current = cell.danger
        if (current !== undefined) {
            if (overwrite) cell.danger = danger
            else cell.danger = Math.max(current, danger)
        } else {
            cell.danger = danger
        }
        // cell.danger =
        //     current !== undefined ? (overwrite ? danger : Math.max(danger, current)) : danger
    }

    getDanger(c: Coord) {
        return this.get(c).danger || 0
    }

    neighbors(c: Coord): Coord[] {
        return Object.values(dirs)
            .map((move) => move(c))
            .filter((n) => {
                return this.has(n) && !this.get(n).blocked
            })
    }
}
