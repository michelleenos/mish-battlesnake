import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { GameState } from '../types'

export function saveGameState(gameState: GameState): void {
    const dir = join(process.cwd(), 'game-states')
    mkdirSync(dir, { recursive: true })
    const file = join(dir, `${gameState.game.id}-turn-${gameState.turn}.json`)
    writeFileSync(file, JSON.stringify(gameState, null, 2))
    console.log(`Saved game state to ${file}`)
}
