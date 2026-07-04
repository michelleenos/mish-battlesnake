import { aStar } from './astar.js';
import { floodFillMap } from './floodfill.js';
import { BattleMap } from './graph.js';
import { cellsEqual, dirs, getDir, isWall, manhattanDistance } from './utils.js';
export function buildMap(state, config) {
    const map = new BattleMap(state.board.width, state.board.height);
    state.board.snakes.forEach((otherSnek) => {
        otherSnek.body.forEach((b) => map.setBlocked(b));
        if (otherSnek.id !== state.you.id) {
            const headNeighbors = map.neighbors(otherSnek.head);
            const amBigger = state.you.length > otherSnek.length + 1;
            const body = otherSnek.body.slice(1);
            body.forEach((body) => {
                const bodyNeighbors = map.neighbors(body);
                bodyNeighbors.forEach((n) => {
                    map.setDanger(n, config.avoidBodies);
                });
            });
            headNeighbors.forEach((c) => map.setDanger(c, amBigger ? 0 : 30, amBigger));
        }
    });
    const head = state.you.head;
    const neck = state.you.body[1];
    const tail = state.you.body[state.you.body.length - 1];
    if (!cellsEqual(head, tail) && !cellsEqual(head, neck) && !cellsEqual(neck, tail)) {
        if (state.you.health < 100) {
            // because i thinkkkk health = 100 means i just ate? and if so, i will grow and then will be crashing into my tail
            map.setBlocked(tail, false);
        }
    }
    const fillRegions = floodFillMap(map, state);
    if (config.avoidWalls > 0) {
        for (let x = 0; x < state.board.width; x++) {
            map.setDanger({ x, y: 0 }, config.avoidWalls);
            map.setDanger({ x, y: state.board.height - 1 }, config.avoidWalls);
        }
        for (let y = 0; y < state.board.height; y++) {
            map.setDanger({ x: 0, y }, config.avoidWalls);
            map.setDanger({ x: state.board.width - 1, y }, config.avoidWalls);
        }
    }
    return { map, fillRegions };
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
function attackWeakerSneks(state, map, config) {
    const { weakerSnekHeads } = getWeakerSneks(state);
    const pathResults = weakerSnekHeads.map((h) => aStar(map, state.you.head, h));
    const validResults = pathResults.filter((r) => r !== null && r.costToNext <= config.attackMaxCost);
    validResults.sort((a, b) => a.costToGoal - b.costToGoal);
    if (validResults.length === 0)
        return null;
    return validResults[0].dir;
}
export function getClosestFoods(state, _map) {
    const head = state.you.head;
    const foods = state.board.food;
    const nearestFoods = foods
        // .filter((food) => {
        //     const danger = map.getDanger(food)
        //     if (danger > maxDanger) return false
        //     return true
        // })
        .sort((a, b) => {
        return manhattanDistance(a, head) - manhattanDistance(b, head);
    });
    return nearestFoods;
}
export function moveToFood(state, map) {
    const nearestFood = getClosestFoods(state, map);
    if (nearestFood.length === 0)
        return null;
    const pathResults = nearestFood.map((f) => aStar(map, state.you.head, f));
    const validResults = pathResults.filter((r) => r !== null && r.costToNext < 3);
    validResults.sort((a, b) => {
        return a.costToGoal - b.costToGoal;
    });
    if (validResults.length === 0)
        return null;
    return validResults[0];
}
export function moveToTail(state, map) {
    const tail = state.you.body[state.you.body.length - 1];
    const pathResults = aStar(map, state.you.head, tail);
    if (pathResults === null)
        return null;
    return pathResults;
}
export function getMove(state, config) {
    const health = state.you.health;
    const { map } = buildMap(state, config);
    const shouldEat = health < config.shouldEatThreshold;
    const couldEat = health < config.couldEatThreshold;
    const toFood = moveToFood(state, map);
    if (shouldEat && toFood !== null) {
        console.log(`moving ${toFood} to a food`);
        return toFood.dir;
    }
    const toWeakSnek = config.attackMaxCost > 0 ? attackWeakerSneks(state, map, config) : null;
    if (toWeakSnek !== null) {
        console.log(`moving ${toWeakSnek} to attack a weak snek`);
        return toWeakSnek;
    }
    const toTail = moveToTail(state, map);
    if (couldEat && toFood !== null) {
        if (toTail !== null && toFood.costToNext <= toTail.costToNext) {
            return toFood.dir;
        }
        const foodNext = dirs[toFood.dir](state.you.head);
        if (toFood.path.length === 1 && isWall(foodNext, state.board.width, state.board.height)) {
            const foodNextCell = map.get(foodNext);
            if (foodNextCell.danger === config.avoidWalls) {
                // don't avoid a food right next to our head only because it's on a wall
                return toFood.dir;
            }
        }
    }
    if (toTail !== null) {
        return toTail.dir;
    }
    const neighbors = map
        .neighbors(state.you.head)
        .sort((a, b) => map.getDanger(a) - map.getDanger(b));
    if (neighbors.length === 0) {
        console.log(`no safe moves :(`);
        return 'up';
    }
    console.log(`choosing the least dangerous direction?`);
    return getDir(state.you.head, neighbors[0]);
    // const moves = getMovesFromMap(map, state.you)
    // const movesStrings = (Object.keys(moves) as (keyof typeof moves)[]).filter((key) => moves[key])
    // if (movesStrings.length === 0) {
    //     console.log('no safe moves!!!')
    //     return 'up'
    // }
    // return movesStrings[Math.floor(Math.random() * movesStrings.length)]
}
//# sourceMappingURL=snek.js.map