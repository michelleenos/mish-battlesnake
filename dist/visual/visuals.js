import { sneks } from '../configs.js';
import { aStar } from '../snek-codez/astar.js';
import { buildMap, getClosestFoods, getMove, moveToFood, } from '../snek-codez/snek.js';
import { dirs, keyToCoord } from '../snek-codez/utils.js';
// script to visualize the results of a* algorithm, for debugging purposes
// ai wrote this part, mostly. it did not write my snake code!
const config = sneks.chill;
// @ts-ignore
const sampleBody = [
    // { x: 10, y: 9 },
    // { x: 10, y: 8 },
    { x: 9, y: 8 },
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
    { x: 5, y: 9 },
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
];
// @ts-ignore
const sampleBody2 = [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 1, y: 7 },
    { x: 0, y: 7 },
    { x: 0, y: 8 },
    { x: 0, y: 9 },
    { x: 1, y: 9 },
    { x: 2, y: 9 },
    { x: 3, y: 9 },
    { x: 4, y: 9 },
    { x: 4, y: 10 },
];
// @ts-ignore
const sampleEnemyNextTo2Head = [
    { x: 5, y: 3 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
    { x: 8, y: 3 },
    { x: 8, y: 4 },
    { x: 8, y: 5 },
    { x: 9, y: 5 },
    { x: 9, y: 6 },
    { x: 9, y: 7 },
    { x: 9, y: 8 },
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
    { x: 6, y: 9 },
    { x: 5, y: 9 },
    // { x: 5, y: 8 },
    // { x: 5, y: 7 },
    // { x: 4, y: 7 },
    // { x: 3, y: 7 },
    // { x: 2, y: 7 },
];
// @ts-ignore
const smallSampleBody = [
    { x: 2, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 2 },
    // { x: 3, y: 0 },
    // { x: 3, y: 1 },
    // { x: 3, y: 2 },
];
// @ts-ignore
const slightlySmallEnemy = [
    { x: 2, y: 2 },
    { x: 1, y: 2 },
    { x: 1, y: 3 },
    { x: 1, y: 4 },
    { x: 1, y: 5 },
    { x: 1, y: 6 },
    { x: 0, y: 6 },
    { x: 0, y: 5 },
];
// @ts-ignore
const longBody = [
    { x: 6, y: 10 },
    { x: 6, y: 9 },
    { x: 5, y: 9 },
    { x: 4, y: 9 },
    { x: 3, y: 9 },
    { x: 2, y: 9 },
    { x: 2, y: 10 },
    { x: 1, y: 10 },
    { x: 1, y: 9 },
    { x: 0, y: 9 },
    { x: 0, y: 8 },
    { x: 1, y: 8 },
    { x: 1, y: 7 },
    { x: 1, y: 6 },
    { x: 2, y: 6 },
    { x: 3, y: 6 },
    { x: 4, y: 6 },
    { x: 5, y: 6 },
    { x: 5, y: 5 },
    { x: 5, y: 4 },
    { x: 5, y: 3 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 10, y: 2 },
    { x: 10, y: 1 },
    { x: 10, y: 0 },
    { x: 9, y: 0 },
    { x: 9, y: 1 },
    { x: 8, y: 1 },
    { x: 7, y: 1 },
    { x: 6, y: 1 },
    { x: 5, y: 1 },
    { x: 4, y: 1 },
    { x: 3, y: 1 },
    { x: 2, y: 1 },
    { x: 1, y: 1 },
];
// @ts-ignore
const enemyBody1 = [
    { x: 8, y: 0 },
    { x: 8, y: 1 },
    { x: 8, y: 2 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
    { x: 10, y: 3 },
];
// @ts-ignore
const enemyBody2 = [
    // { x: 0, y: 0 },
    // { x: 0, y: 1 },
    // { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 3, y: 2 },
    { x: 3, y: 1 },
    { x: 3, y: 0 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
];
// @ts-ignore
const enemyBody3 = [
    { x: 6, y: 6 },
    { x: 7, y: 6 },
    { x: 8, y: 6 },
];
const sampleSnek = (body, color) => {
    return {
        id: `${Math.random() * 10}`,
        name: 'snek',
        latency: '90',
        health: 92,
        body,
        head: body[0],
        length: body.length,
        shout: '',
        customizations: { color, head: '', tail: '' },
    };
};
const sampleYou = sampleSnek(smallSampleBody, '#365aff');
const sampleState = {
    game: {
        id: '1da8404e-a0ba-4b0a-9e85-e88daf242921',
        ruleset: {
            name: 'standard',
            version: 'v1.2.3',
            settings: {
                foodSpawnChance: 15,
                minimumFood: 1,
                hazardDamagePerTurn: 0,
                hazardMap: '',
                hazardMapAuthor: '',
            },
        },
        map: 'standard',
        timeout: 500,
        source: 'custom',
    },
    turn: 10,
    board: {
        height: 11,
        width: 11,
        snakes: [
            sampleYou,
            // sampleSnek(enemyBody1, '#ff00ff'),
            // sampleSnek(enemyBody2, '#00ff00'),
            // sampleSnek(slightlySmallEnemy, '#00eeff'),
            sampleSnek(sampleEnemyNextTo2Head, '#ffb300'),
            // sampleSnek(enemyBody3, '#ffff00'),
        ],
        food: [
            { x: 7, y: 10 },
            // { x: 8, y: 5 },
            { x: 0, y: 3 },
        ],
        hazards: [],
    },
    you: sampleYou,
};
const state = sampleState;
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const W = 500;
const H = 500;
const PAD_BOTTOM = 80; // room for the result summary text (one line per candidate food)
canvas.width = W * 2;
canvas.height = (H + PAD_BOTTOM) * 2;
canvas.style.width = `${W}px`;
canvas.style.height = `${H + PAD_BOTTOM}px`;
const ctx = canvas.getContext('2d');
ctx.scale(2, 2);
const { width, height } = state.board;
const cellW = W / width;
const cellH = H / height;
// Battlesnake uses y=0 at the bottom; canvas uses y=0 at the top, so flip y.
const px = (x) => x * cellW;
const py = (y) => (height - 1 - y) * cellH;
const cx = (x) => px(x) + cellW / 2;
const cy = (y) => py(y) + cellH / 2;
const { map, fillRegions } = buildMap(state, config);
const closestFoods = getClosestFoods(state, map, 10);
const foodPathResults = closestFoods.map((f) => aStar(map, state.you.head, f));
const foodResults = foodPathResults.filter((r) => r !== null && r.costToNext < 3);
foodResults.sort((a, b) => {
    return a.costToGoal - b.costToGoal;
});
// const fillRegions = floodFillMap(map)
// // mirror what moveToFood does: take the closest foods and A* to each of them
// const targetFoods = getClosestFoods(state, map)
// const foodResults = targetFoods
//     .map((food) => ({ food, result: aStar(map, state.you.head, food) }))
//     .filter((fr): fr is { food: Coord; result: AStarResult } => fr.result !== null)
// // replicate moveToFood's selection so we can highlight the winning path/costMap
// const rankedFoodResults = [...foodResults]
//     // .filter((fr) => fr.result.costToNext < 20)
//     .sort((a, b) => a.result.costToGoal - b.result.costToGoal)
// const chosen = rankedFoodResults[0] ?? null
const chosenFood = moveToFood(state, map);
const finalMove = getMove(state, config);
const tail = state.you.body[state.you.body.length - 1];
const resultToTail = aStar(map, state.you.head, tail);
const pathColors = ['#0044ff', '#e6194b', '#3cb44b', '#f58231', '#911eb4'];
const colorFor = (i) => pathColors[i % pathColors.length];
// color a cell by its danger weight: 0 = white, higher = deeper red
const dangerColor = (danger) => {
    if (danger <= 0)
        return '#ffffff';
    const t = Math.min(danger / 30, 1);
    const g = Math.round(255 - t * 180);
    const b = Math.round(255 - t * 200);
    return `rgb(255, ${g}, ${b})`;
};
// map each cell on a candidate path to the color of that path (later foods win ties,
// but the winning path is redrawn on top afterwards so it stays visible)
const pathCellColor = new Map();
foodResults.forEach((fr, i) => {
    fr.path.forEach((c) => pathCellColor.set(`${c.x}-${c.y}`, colorFor(i)));
});
if (resultToTail) {
    resultToTail.path.forEach((c) => pathCellColor.set(`${c.x}-${c.y}`, colorFor(4)));
}
const costMaps = foodResults.map((result) => {
    return result.costMap;
});
if (resultToTail)
    costMaps.push(resultToTail.costMap);
const getCost = (c) => {
    for (let i = 0; i < costMaps.length; i++) {
        let costFromMap = costMaps[i].get(c);
        if (costFromMap !== null)
            return costFromMap;
    }
};
// const costMap = chosen?.result.costMap
// const tailCostMap = resultToTail?.costMap
// 1. draw each cell shaded by danger weight; overlay the aStar cost from costMap
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const cell = map.get({ x, y });
        const danger = cell.danger || 0;
        const pathColor = pathCellColor.get(`${x}-${y}`);
        ctx.fillStyle = cell.blocked ? '#333333' : dangerColor(danger);
        ctx.fillRect(px(x), py(y), cellW, cellH);
        ctx.strokeStyle = '#cccccc';
        ctx.strokeRect(px(x), py(y), cellW, cellH);
        // tint cells that lie on one of the candidate food paths
        if (pathColor) {
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = pathColor;
            ctx.fillRect(px(x), py(y), cellW, cellH);
            ctx.globalAlpha = 1;
        }
        if (cell.blocked)
            continue;
        ctx.textAlign = 'center';
        // accumulated cost A* computed for this cell (null = never explored)
        let cost = getCost({ x, y });
        if (cost !== undefined) {
            ctx.fillStyle = '#0044aa';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(String(cost), cx(x) - 10, cy(y) - 6);
        }
        // danger weight shown smaller, below the cost
        if (danger > 0) {
            ctx.fillStyle = '#aa0000';
            ctx.font = '9px sans-serif';
            ctx.fillText(`d${danger}`, cx(x), cy(y) + 7);
        }
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(`${x}, ${y}`, cx(x) - 17, cy(y) + 15);
    }
}
fillRegions.regions.forEach((region, i) => {
    // const size = region.size
    const coords = [...region].map((key) => keyToCoord(key));
    const color = colorFor(i) + '44';
    coords.forEach(({ x, y }) => {
        ctx.fillStyle = color;
        ctx.fillRect(px(x), py(y), cellW, cellH);
    });
});
// 1b. overlay each flood fill region: hatch its reachable cells in the seed's color
//     and mark the seed cell with the reachable-cell count
// fillResults.forEach(({ at, color, cells }) => {
//     ctx.fillStyle = color
//     ctx.globalAlpha = 0.22
//     cells.forEach((key) => {
//         const [fx, fy] = key.split('-').map(Number)
//         ctx.fillRect(px(fx), py(fy), cellW, cellH)
//     })
//     ctx.globalAlpha = 1
//     // seed marker + count
//     ctx.beginPath()
//     ctx.arc(cx(at.x), cy(at.y), cellW * 0.34, 0, Math.PI * 2)
//     ctx.fillStyle = color
//     ctx.fill()
//     ctx.fillStyle = '#ffffff'
//     ctx.font = 'bold 13px sans-serif'
//     ctx.fillText(String(cells.size), cx(at.x), cy(at.y))
// })
// 2. draw snake bodies using each snake's color, with heads outlined
state.board.snakes.forEach((snek) => {
    snek.body.forEach((b, i) => {
        ctx.fillStyle = snek.customizations.color;
        ctx.globalAlpha = i === 0 ? 1 : 0.5;
        const pad = cellW * 0.15;
        ctx.fillRect(px(b.x) + pad, py(b.y) + pad, cellW - pad * 2, cellH - pad * 2);
        ctx.globalAlpha = 1;
    });
    // outline the head
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(px(snek.head.x) + 3, py(snek.head.y) + 3, cellW - 6, cellH - 6);
    ctx.lineWidth = 1;
});
// 3. draw food as plain markers
state.board.food.forEach((f) => {
    ctx.beginPath();
    ctx.arc(cx(f.x), cy(f.y), cellW * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#ff9d3b';
    ctx.fill();
});
// 3b. draw the full A* path to each candidate food as a colored line,
//     and ring each target food in its path color (thicker for the chosen one)
const head = state.you.head;
foodResults.forEach((fr, i) => {
    const color = colorFor(i);
    const isChosen = foodResults[0] === fr;
    // line from head through every cell on the path
    ctx.strokeStyle = color;
    ctx.lineWidth = isChosen ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx(head.x), cy(head.y));
    fr.path.forEach((c) => ctx.lineTo(cx(c.x), cy(c.y)));
    ctx.stroke();
    const goal = fr.path[fr.path.length - 1];
    // ring the target food
    ctx.beginPath();
    ctx.arc(cx(goal.x), cy(goal.y), cellW * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = isChosen ? 4 : 2;
    ctx.stroke();
});
ctx.lineWidth = 1;
// 4. draw the move getMove would actually choose: an arrow from our head
const fromX = cx(head.x);
const delta = dirs[finalMove.dir](head);
const fromY = cy(head.y);
const toX = cx(delta.x);
const toY = cy(delta.y);
ctx.strokeStyle = '#00cc00';
ctx.fillStyle = '#00cc00';
ctx.lineWidth = 4;
ctx.beginPath();
ctx.moveTo(fromX, fromY);
ctx.lineTo(toX, toY);
ctx.stroke();
// arrow head
const angle = Math.atan2(toY - fromY, toX - fromX);
const ah = 11;
ctx.beginPath();
ctx.moveTo(toX, toY);
ctx.lineTo(toX - ah * Math.cos(angle - Math.PI / 6), toY - ah * Math.sin(angle - Math.PI / 6));
ctx.lineTo(toX - ah * Math.cos(angle + Math.PI / 6), toY - ah * Math.sin(angle + Math.PI / 6));
ctx.closePath();
ctx.fill();
ctx.lineWidth = 1;
// 5. result summary text below the board: the strategy getMove picked and its move
ctx.textAlign = 'left';
ctx.font = 'bold 13px sans-serif';
ctx.fillStyle = '#008800';
ctx.fillText(`getMove chooses: ${finalMove.name} → ${finalMove.dir}`, 4, H + 14);
ctx.font = '13px sans-serif';
ctx.fillStyle = '#000000';
ctx.fillText(`moveToFood picks: ${chosenFood ?? 'none'}`, 4, H + 30);
// 6. flood fill legend on the right side of the summary strip
const legendX = W - 220;
ctx.fillStyle = '#000000';
ctx.font = 'bold 13px sans-serif';
ctx.fillText('floodFill (reachable cells):', legendX, H + 14);
ctx.font = '13px sans-serif';
// fillResults.forEach(({ color, label, cells, at }, i) => {
//     ctx.fillStyle = color
//     ctx.fillRect(legendX, H + 22 + i * 15, 10, 10)
//     ctx.fillText(`(${at.x},${at.y}) ${label}: ${cells.size}`, legendX + 16, H + 30 + i * 15)
// })
//# sourceMappingURL=visuals.js.map