import { aStar } from './astar.js';
import { floodFill } from './floodfill.js';
import { BattleMap } from './graph.js';
import { dirs, cellsEqual } from './utils.js';
function checkWalls(width, height, head, moves) {
    if (head.x === width - 1)
        moves.right = false;
    if (head.y === height - 1)
        moves.up = false;
    if (head.x === 0)
        moves.left = false;
    if (head.y === 0)
        moves.down = false;
    return moves;
}
function checkSnek(you, other, moves) {
    const head = you.head;
    for (const obs of other.body) {
        if (cellsEqual(dirs.left(head), obs))
            moves.left = false;
        if (cellsEqual(dirs.right(head), obs))
            moves.right = false;
        if (cellsEqual(dirs.up(head), obs))
            moves.up = false;
        if (cellsEqual(dirs.down(head), obs))
            moves.down = false;
    }
    return moves;
}
export function getSafeMoves(state) {
    const moves = { up: true, down: true, right: true, left: true };
    checkWalls(state.board.width, state.board.height, state.you.head, moves);
    state.board.snakes.forEach((s) => checkSnek(state.you, s, moves));
    return moves;
}
function getMovesFromMap(map, you) {
    const moves = { up: true, down: true, right: true, left: true };
    checkWalls(map.width, map.height, you.head, moves);
    if (moves.up && map.get(dirs.up(you.head)).blocked)
        moves.up = false;
    if (moves.down && map.get(dirs.down(you.head)).blocked)
        moves.down = false;
    if (moves.left && map.get(dirs.left(you.head)).blocked)
        moves.left = false;
    if (moves.right && map.get(dirs.right(you.head)).blocked)
        moves.right = false;
    return moves;
}
export function buildMap(state) {
    const map = new BattleMap(state.board.width, state.board.height);
    state.board.snakes.forEach((otherSnek) => {
        otherSnek.body.forEach((b) => map.setBlocked(b));
        if (otherSnek.id !== state.you.id) {
            const headNeighbors = map.neighbors(otherSnek.head);
            const amBigger = state.you.length > otherSnek.length + 1;
            otherSnek.body.forEach((body) => {
                const bodyNeighbors = map.neighbors(body);
                bodyNeighbors.forEach((n) => map.setDanger(n, 10));
            });
            headNeighbors.forEach((c) => map.setDanger(c, amBigger ? 0 : 30, amBigger));
        }
    });
    const head = state.you.head;
    const neck = state.you.body[1];
    const tail = state.you.body[state.you.body.length - 1];
    if (!cellsEqual(head, tail) && !cellsEqual(head, neck) && !cellsEqual(neck, tail)) {
        if (state.you.health < 100) {
            // i think this means did i just eat? because if so, i will grow and then will be crashing into my tail
            map.setBlocked(tail, false);
        }
    }
    const allCells = map.getAll();
    const allFloodFills = [];
    let min = Infinity;
    let max = -Infinity;
    allCells.forEach((coord) => {
        const fill = floodFill(map, coord);
        allFloodFills.push({ coord, fill });
        if (fill < min)
            min = fill;
        if (fill > max)
            max = fill;
    });
    const mid = (max - min) / 2 + min;
    allFloodFills.forEach(({ coord, fill }) => {
        if (fill < mid) {
            map.setDanger(coord, 20);
        }
    });
    return map;
}
export function getWeakerSneks(state) {
    const you = state.you;
    const weakerSneks = state.board.snakes.filter((otherSnek) => {
        if (otherSnek.id === you.id)
            return false;
        if (otherSnek.length + 1 < you.length)
            return true;
        return false;
    });
    const weakerSnekHeads = weakerSneks.map((weakSnek) => weakSnek.head);
    return { weakerSneks, weakerSnekHeads };
}
export function getClosestFoods(state, map, max = 3, maxDanger = 0) {
    const head = state.you.head;
    const foods = state.board.food;
    const nearestFoods = foods
        .filter((food) => {
        const danger = map.getDanger(food);
        if (danger > maxDanger)
            return false;
        return true;
    })
        .sort((a, b) => {
        return (Math.abs(a.x - head.x) +
            Math.abs(a.y - head.y) -
            (Math.abs(b.x - head.x) + Math.abs(b.y - head.y)));
    })
        .slice(0, max);
    return nearestFoods;
}
function attackWeakerSneks(state, map) {
    const { weakerSnekHeads } = getWeakerSneks(state);
    const pathResults = weakerSnekHeads.map((h) => aStar(map, state.you.head, h));
    const validResults = pathResults.filter((r) => r !== null && r.costToNext < 3);
    validResults.sort((a, b) => a.costToGoal - b.costToGoal);
    if (validResults.length === 0)
        return null;
    return validResults[0].dir;
}
export function moveToFood(state, map) {
    const nearestFood = getClosestFoods(state, map);
    if (nearestFood.length === 0)
        return null;
    const pathResults = nearestFood.map((f) => aStar(map, state.you.head, f));
    const validResults = pathResults.filter((r) => r !== null && r.costToNext < 3);
    validResults.sort((a, b) => {
        // const fillA = floodFill(map, dirs[a.dir](state.you.head))
        // const fillB = floodFill(map, dirs[b.dir](state.you.head))
        // if (fillA < fillB )
        return a.costToGoal - b.costToGoal;
    });
    if (validResults.length === 0)
        return null;
    return validResults[0].dir;
}
function moveToTail(state, map) {
    const tail = state.you.body[state.you.body.length - 1];
    const pathResults = aStar(map, state.you.head, tail);
    if (pathResults === null)
        return null;
    return pathResults.dir;
}
export function getMove(state) {
    const health = state.you.health;
    const map = buildMap(state);
    if (health > 50) {
        const toWeakSnek = attackWeakerSneks(state, map);
        if (toWeakSnek !== null) {
            console.log(`moving ${toWeakSnek} to attack a weak snek`);
            return toWeakSnek;
        }
    }
    const toFood = moveToFood(state, map);
    if (toFood !== null) {
        console.log(`moving ${toFood} to a food`);
        return toFood;
    }
    const toTail = moveToTail(state, map);
    if (toTail !== null) {
        console.log(`moving ${toTail} toward my tail?`);
        return toTail;
    }
    console.log(`couldn't find a path to food, defaulting to safest moves`);
    const moves = getMovesFromMap(map, state.you);
    const movesStrings = Object.keys(moves).filter((key) => moves[key]);
    if (movesStrings.length === 0) {
        console.log('no safe moves!!!');
        return 'up';
    }
    return movesStrings[Math.floor(Math.random() * movesStrings.length)];
}
//# sourceMappingURL=snek.js.map