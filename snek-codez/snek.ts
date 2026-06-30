import type { Battlesnake, Coord, Game, GameState } from '../types'
import { aStar, type AStarResult } from './astar'
import { BattleMap } from './graph'
import { dirs, cellsEqual } from './utils'

export interface Moves {
    up: boolean
    down: boolean
    left: boolean
    right: boolean
}

function checkWalls(width: number, height: number, head: Coord, moves: Moves) {
    if (head.x === width - 1) moves.right = false
    if (head.y === height - 1) moves.up = false
    if (head.x === 0) moves.left = false
    if (head.y === 0) moves.down = false

    return moves
}

function checkSnek(you: Battlesnake, other: Battlesnake, moves: Moves) {
    const head = you.head

    for (const obs of other.body) {
        if (cellsEqual(dirs.left(head), obs)) moves.left = false
        if (cellsEqual(dirs.right(head), obs)) moves.right = false
        if (cellsEqual(dirs.up(head), obs)) moves.up = false
        if (cellsEqual(dirs.down(head), obs)) moves.down = false
    }

    return moves
}

export function getSafeMoves(state: GameState) {
    const moves = { up: true, down: true, right: true, left: true }
    checkWalls(state.board.width, state.board.height, state.you.head, moves)

    state.board.snakes.forEach((s) => checkSnek(state.you, s, moves))

    return moves
}

function getMovesFromMap(map: BattleMap, you: Battlesnake) {
    const moves = { up: true, down: true, right: true, left: true }

    checkWalls(map.width, map.height, you.head, moves)

    if (moves.up && map.get(dirs.up(you.head)).blocked) moves.up = false
    if (moves.down && map.get(dirs.down(you.head)).blocked) moves.down = false
    if (moves.left && map.get(dirs.left(you.head)).blocked) moves.left = false
    if (moves.right && map.get(dirs.right(you.head)).blocked) moves.right = false

    return moves
}

function buildMap(state: GameState) {
    const map = new BattleMap(state.board.width, state.board.height)

    state.board.snakes.forEach((snek) => {
        snek.body.forEach((b) => map.setBlocked(b))

        if (snek.id !== state.you.id) {
            const headNeighbors = map.neighbors(snek.head)
            headNeighbors.forEach((c) => map.setDanger(c, 30))
            snek.body.forEach((body) => {
                const bodyNeighbors = map.neighbors(body)
                bodyNeighbors.forEach((n) => map.setDanger(n, 10))
            })
        }
    })

    const head = state.you.head
    const neck = state.you.body[1]
    const tail = state.you.body[state.you.body.length - 1]
    if (!cellsEqual(head, tail) && !cellsEqual(head, neck) && !cellsEqual(neck, tail)) {
        // TODO investigate this bit
        // it's ok to move to where our tail is... i think??? (hmm... what if you eat a food and grow tho?)
        map.setBlocked(tail, false)
    }

    return map
}

function getClosestFoods(state: GameState, map: BattleMap, max = 3, maxDanger = 0) {
    const head = state.you.head
    const foods = state.board.food
    const nearestFoods = foods
        .filter((food) => {
            const danger = map.getDanger(food)
            if (danger > maxDanger) return false
            return true
        })
        .sort((a, b) => {
            return (
                Math.abs(a.x - head.x) +
                Math.abs(a.y - head.y) -
                (Math.abs(b.x - head.x) + Math.abs(b.y - head.y))
            )
        })
        .slice(0, max)
    return nearestFoods
}

function moveToFood(state: GameState, map: BattleMap) {
    const nearestFood = getClosestFoods(state, map)
    if (nearestFood.length === 0) return null

    const pathResults = nearestFood.map((f) => aStar(map, state.you.head, f))
    const validResults = pathResults.filter((r) => r !== null && r.costToNext < 3) as AStarResult[]
    validResults.sort((a, b) => a.costToGoal - b.costToGoal)

    if (validResults.length === 0) return null

    return validResults[0].dir
}

function moveToTail(state: GameState, map: BattleMap) {
    const tail = state.you.body[state.you.body.length - 1]
    const pathResults = aStar(map, state.you.head, tail)
    if (pathResults === null) return null
    return pathResults.dir
}

export function getMove(state: GameState) {
    console.log(state.you.length)
    const health = state.you.health
    const map = buildMap(state)

    const toFood = moveToFood(state, map)
    if (toFood !== null) return toFood

    const toTail = moveToTail(state, map)
    if (toTail !== null) return toTail

    // const toTail = move

    console.log(`couldn't find a path to food, defaulting to safest moves`)
    const moves = getMovesFromMap(map, state.you)
    const movesStrings = (Object.keys(moves) as (keyof typeof moves)[]).filter((key) => moves[key])
    if (movesStrings.length === 0) {
        console.log('no safe moves!!!')
        return 'up'
    }
    return movesStrings[Math.floor(Math.random() * movesStrings.length)]
}
