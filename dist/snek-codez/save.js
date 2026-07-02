import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
export function saveGameState(gameState) {
    const dir = join(process.cwd(), 'game-states');
    mkdirSync(dir, { recursive: true });
    const file = join(dir, `${gameState.game.id}-turn-${gameState.turn}.json`);
    writeFileSync(file, JSON.stringify(gameState, null, 2));
    console.log(`Saved game state to ${file}`);
}
//# sourceMappingURL=save.js.map