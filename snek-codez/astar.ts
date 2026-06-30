import type { Coord } from '../types'
import { MapGraph, type BattleMap } from './graph'
import { cellsEqual, getDir, type Direction } from './utils'

function heuristic(c1: Coord, c2: Coord) {
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y)
}

export type AStarResult = {
    dir: Direction
    costToNext: number
    costToGoal: number
}

export function aStar(map: BattleMap, start: Coord, goal: Coord): null | AStarResult {
    const frontier: { c: Coord; priority: number }[] = [{ c: start, priority: 0 }]
    // const cameFrom = new Map<NodeKey, NodeKey | undefined>()
    const cameFrom = new MapGraph<Coord | null>(map.width, map.height, () => null)
    const costSoFar = new MapGraph<number | null>(map.width, map.height, () => null)

    while (frontier.length > 0) {
        const current = frontier.sort((a, b) => a.priority - b.priority).shift()!.c

        if (current === goal) break

        map.neighbors(current).forEach((next) => {
            const nextCost = costSoFar.get(next)
            const newCost = (nextCost || 1) + map.getDanger(next)
            if (nextCost === null || newCost < nextCost) {
                costSoFar.set(next, newCost)
                const priority = newCost + heuristic(next, goal)
                frontier.push({ c: next, priority })
                cameFrom.set(next, current)
            }
        })
    }

    const path = constructPath(cameFrom, start, goal)

    const nextMove = path[0]
    if (!nextMove) {
        console.log('no path found :(')
        return null
    }

    const dir = getDir(start, nextMove)
    return {
        dir,
        costToNext: costSoFar.get(nextMove) || 0,
        costToGoal: costSoFar.get(goal) || 0,
    }
}

export function constructPath(cameFrom: MapGraph<Coord | null>, start: Coord, goal: Coord) {
    let current = goal
    const path: Coord[] = []
    if (cameFrom.get(goal) === null) return []

    while (!cellsEqual(current, start)) {
        path.push(current)
        const next = cameFrom.get(current)
        if (next === null) return []
        current = next
    }

    path.reverse()
    return path
}
