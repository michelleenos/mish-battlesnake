import { sneks } from '../configs.js';
import { aStar } from '../snek-codez/astar.js';
import { floodFillCells } from '../snek-codez/floodfill.js';
import { buildMap, getClosestFoods, moveToFood } from '../snek-codez/snek.js';
import { dirs } from '../snek-codez/utils.js';
// script to visualize the results of a* algorithm, for debugging purposes
// ai wrote this part, mostly. it did not write my snake code!
const config = sneks.hangry;
config.avoidWalls = 2;
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
const enemyBody1 = [
    { x: 8, y: 0 },
    { x: 8, y: 1 },
    { x: 8, y: 2 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
    { x: 10, y: 3 },
];
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
const enemyBody3 = [
    { x: 5, y: 6 },
    { x: 6, y: 6 },
    { x: 7, y: 6 },
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
const sampleYou = sampleSnek(sampleBody, '#365aff');
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
            sampleSnek(enemyBody1, '#ff00ff'),
            sampleSnek(enemyBody2, '#00ff00'),
            sampleSnek(enemyBody3, '#ffff00'),
        ],
        food: [
            { x: 7, y: 10 },
            // { x: 8, y: 5 },
            { x: 0, y: 5 },
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
const map = buildMap(state, config);
console.log(map);
// mirror what moveToFood does: take the closest foods and A* to each of them
const targetFoods = getClosestFoods(state, map);
const foodResults = targetFoods
    .map((food) => ({ food, result: aStar(map, state.you.head, food) }))
    .filter((fr) => fr.result !== null);
// replicate moveToFood's selection so we can highlight the winning path/costMap
const rankedFoodResults = [...foodResults]
    .filter((fr) => fr.result.costToNext < 20)
    .sort((a, b) => a.result.costToGoal - b.result.costToGoal);
const chosen = rankedFoodResults[0] ?? null;
// the direction moveToFood actually returns
const chosenDir = moveToFood(state, map);
const tail = state.you.body[state.you.body.length - 1];
const resultToTail = aStar(map, state.you.head, tail);
// a distinct color per candidate food/path
const pathColors = ['#0044ff', '#e6194b', '#3cb44b', '#f58231', '#911eb4'];
const colorFor = (i) => pathColors[i % pathColors.length];
// flood fill seeds: a couple sit inside the sealed corner pockets, one in open space
const fillSeeds = [
    { at: { x: 1, y: 1 }, color: '#00b3b3', label: 'bottom-left pocket' },
    { at: { x: 9, y: 1 }, color: '#c71585', label: 'bottom-right pocket' },
    { at: { x: 6, y: 5 }, color: '#7a7a00', label: 'open area' },
];
const fillResults = fillSeeds.map((seed) => ({
    ...seed,
    cells: floodFillCells(map, seed.at),
}));
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
    fr.result.path.forEach((c) => pathCellColor.set(`${c.x}-${c.y}`, colorFor(i)));
});
if (resultToTail) {
    resultToTail.path.forEach((c) => pathCellColor.set(`${c.x}-${c.y}`, colorFor(4)));
}
const costMaps = foodResults.map(({ result }) => {
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
        if (x === 10 && y === 9)
            console.log({ cost });
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
// 1b. overlay each flood fill region: hatch its reachable cells in the seed's color
//     and mark the seed cell with the reachable-cell count
fillResults.forEach(({ at, color, cells }) => {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.22;
    cells.forEach((key) => {
        const [fx, fy] = key.split('-').map(Number);
        ctx.fillRect(px(fx), py(fy), cellW, cellH);
    });
    ctx.globalAlpha = 1;
    // seed marker + count
    ctx.beginPath();
    ctx.arc(cx(at.x), cy(at.y), cellW * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(String(cells.size), cx(at.x), cy(at.y));
});
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
    const isChosen = chosen?.food === fr.food;
    // line from head through every cell on the path
    ctx.strokeStyle = color;
    ctx.lineWidth = isChosen ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(cx(head.x), cy(head.y));
    fr.result.path.forEach((c) => ctx.lineTo(cx(c.x), cy(c.y)));
    ctx.stroke();
    // ring the target food
    ctx.beginPath();
    ctx.arc(cx(fr.food.x), cy(fr.food.y), cellW * 0.3, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = isChosen ? 4 : 2;
    ctx.stroke();
});
ctx.lineWidth = 1;
// 4. draw the move moveToFood actually returns: an arrow from our head
if (chosenDir) {
    const delta = dirs[chosenDir](head);
    const fromX = cx(head.x);
    const fromY = cy(head.y);
    const toX = cx(delta.x);
    const toY = cy(delta.y);
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    // arrow head
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const ah = 9;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - ah * Math.cos(angle - Math.PI / 6), toY - ah * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - ah * Math.cos(angle + Math.PI / 6), toY - ah * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 1;
}
// 5. result summary text below the board: one line per candidate food
ctx.textAlign = 'left';
ctx.font = '13px sans-serif';
if (foodResults.length === 0) {
    ctx.fillStyle = '#000000';
    ctx.fillText('moveToFood found no reachable food', 4, H + 16);
}
else {
    ctx.fillStyle = '#000000';
    ctx.fillText(`moveToFood picks: ${chosenDir ?? 'none'}`, 4, H + 14);
    foodResults.forEach((fr, i) => {
        const { dir, costToNext, costToGoal } = fr.result;
        const chosenMark = chosen?.food === fr.food ? '  ← chosen' : '';
        ctx.fillStyle = colorFor(i);
        ctx.fillText(`(${fr.food.x},${fr.food.y}) dir:${dir} next:${costToNext} goal:${costToGoal}${chosenMark}`, 4, H + 30 + i * 15);
    });
}
// 6. flood fill legend on the right side of the summary strip
const legendX = W - 220;
ctx.fillStyle = '#000000';
ctx.font = 'bold 13px sans-serif';
ctx.fillText('floodFill (reachable cells):', legendX, H + 14);
ctx.font = '13px sans-serif';
fillResults.forEach(({ color, label, cells, at }, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(legendX, H + 22 + i * 15, 10, 10);
    ctx.fillText(`(${at.x},${at.y}) ${label}: ${cells.size}`, legendX + 16, H + 30 + i * 15);
});
//# sourceMappingURL=visuals.js.map