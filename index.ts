import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import runServer from './snek-codez/server'
import { getMove } from './snek-codez/snek'
import type { Game, GameState, InfoResponse, MoveResponse } from './types'

function saveGameState(gameState: GameState): void {
    const dir = join(process.cwd(), 'game-states')
    mkdirSync(dir, { recursive: true })
    const file = join(dir, `${gameState.game.id}-turn-${gameState.turn}.json`)
    writeFileSync(file, JSON.stringify(gameState, null, 2))
    console.log(`Saved game state to ${file}`)
}

function info(): InfoResponse {
    return {
        apiversion: '1',
        author: 'mish',
        color: '#365aff',
        head: 'beluga',
        tail: 'curled',
    }
}

function start(gameState: GameState): void {
    console.log('GAME START')
}

// end is called when your Battlesnake finishes a game
function end(gameState: GameState): void {
    console.log('GAME OVER\n')
}

let i = 0

function move(gameState: GameState): MoveResponse {
    // const moves = getSafeMoves(gameState)

    // const safeMoves = (Object.keys(moves) as (keyof typeof moves)[]).filter((key) => moves[key])
    // if (safeMoves.length === 0) {
    //     console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`)
    //     return { move: 'down' }
    // }
    // // Choose a random move from the safe moves
    // const nextMove = safeMoves[Math.floor(Math.random() * safeMoves.length)]

    const nextMove = getMove(gameState)

    console.log(`MOVE ${gameState.turn}: ${nextMove}`)
    return { move: nextMove }
}

runServer({ info, start, move, end })
