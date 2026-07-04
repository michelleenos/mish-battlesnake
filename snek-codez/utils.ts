import type { Coord } from '../types'

export type Direction = 'up' | 'down' | 'left' | 'right'
type MoveFn = (c: Coord) => Coord
export const dirs: Record<Direction, MoveFn> = {
    left: ({ x, y }) => ({ x: x - 1, y }),
    right: ({ x, y }) => ({ x: x + 1, y }),
    up: ({ x, y }) => ({ x, y: y + 1 }),
    down: ({ x, y }) => ({ x, y: y - 1 }),
}

export const cellsEqual = (c1: Coord, c2: Coord) => c1.x === c2.x && c1.y === c2.y

export const getDir = (start: Coord, next: Coord): Direction => {
    if (next.x > start.x) return 'right'
    if (next.x < start.x) return 'left'
    if (next.y > start.y) return 'up'
    if (next.y < start.y) return 'down'
    return 'up'
}

export type NodeKey = `${number}-${number}`

export const coordToKey = (c: Coord): NodeKey => `${c.x}-${c.y}`
export const keyToCoord = (k: NodeKey): Coord => {
    let arr = k.split('-')
    return { x: +arr[0], y: +arr[1] }
}

export const manhattanDistance = (c1: Coord, c2: Coord) => {
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y)
}
