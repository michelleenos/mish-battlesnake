import type { Coord } from '../types'
import { BattleMap } from './graph.js'
import { coordToKey, keyToCoord, type NodeKey } from './utils.js'

export function floodFillCells(map: BattleMap, coord: Coord) {
    const visited = new Set<NodeKey>()

    const checkCoord = (c: Coord) => {
        if (visited.has(coordToKey(c))) return
        visited.add(coordToKey(c))

        const neighbors = map.neighbors(c)
        neighbors.forEach((neighbor) => {
            checkCoord(neighbor)
        })
    }

    checkCoord(coord)

    return visited
}

export function floodFill(map: BattleMap, coord: Coord) {
    return floodFillCells(map, coord).size
}

export function floodFillMap(map: BattleMap) {
    for (let x = 0; x < map.width; x++) {
        for (let y = 0; y < map.height; y++) {
            let coord = { x, y }
            let cell = map.get(coord)
            if (cell.blocked) continue
            if (cell.fill !== undefined) continue

            let cells = floodFillCells(map, coord)
            cells.forEach((cell) => {
                map.setFill(keyToCoord(cell), cells.size)
            })
        }
    }
}
