import type { Coord } from '../types'
import { BattleMap } from './graph.js'
import { coordToKey, type NodeKey } from './utils.js'

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
