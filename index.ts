import runServer from './snek-codez/server.js'
import { getMove } from './snek-codez/snek.js'
import type { GameState, InfoResponse, MoveResponse } from './types'

function info(): InfoResponse {
    return {
        apiversion: '1',
        author: 'mish',
        color: '#365aff',
        head: 'tongue',
        tail: 'curled',
    }
}

function start(_gameState: GameState): void {
    console.log('GAME START')
}

// end is called when your Battlesnake finishes a game
function end(_gameState: GameState): void {
    console.log('GAME OVER\n')
}

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
