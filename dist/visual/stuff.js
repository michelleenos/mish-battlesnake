import { aStar } from '../snek-codez/astar.js';
import { BattleMap } from '../snek-codez/graph.js';
import { buildMap } from '../snek-codez/snek.js';
import { dirs } from '../snek-codez/utils.js';
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
                // royale: {
                //     shrinkEveryNTurns: 0,
                // },
                // squad: {
                //     allowBodyCollisions: false,
                //     sharedElimination: false,
                //     sharedHealth: false,
                //     sharedLength: false,
                // },
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
            {
                id: 'gs_Skqck87mrPDTjmmJFMHMSRrB',
                name: 'snek snek',
                latency: '88',
                health: 92,
                body: [
                    {
                        x: 9,
                        y: 9,
                    },
                    {
                        x: 8,
                        y: 9,
                    },
                    {
                        x: 7,
                        y: 9,
                    },
                    {
                        x: 6,
                        y: 9,
                    },
                    {
                        x: 5,
                        y: 9,
                    },
                    {
                        x: 5,
                        y: 10,
                    },
                    {
                        x: 4,
                        y: 10,
                    },
                    { x: 3, y: 10 },
                ],
                head: {
                    x: 9,
                    y: 9,
                },
                length: 8,
                shout: '',
                // squad: '',
                customizations: {
                    color: '#365aff',
                    head: 'beluga',
                    tail: 'curled',
                },
            },
            {
                id: 'gs_4B8gKqkHWVjCpTxSYMtDrqM6',
                name: 'Hungry Bot',
                latency: '1',
                health: 98,
                body: [
                    {
                        x: 3,
                        y: 5,
                    },
                    {
                        x: 4,
                        y: 5,
                    },
                    {
                        x: 5,
                        y: 5,
                    },
                    {
                        x: 5,
                        y: 4,
                    },
                    {
                        x: 5,
                        y: 3,
                    },
                    {
                        x: 5,
                        y: 2,
                    },
                ],
                head: {
                    x: 3,
                    y: 5,
                },
                length: 6,
                shout: '',
                // squad: '',
                customizations: {
                    color: '#00cc00',
                    head: 'alligator',
                    tail: 'alligator',
                },
            },
            {
                id: 'gs_DYHjv6hrh8bRyGQKdPxhrrTW',
                name: 'Scared Bot',
                latency: '1',
                health: 90,
                body: [
                    {
                        x: 0,
                        y: 0,
                    },
                    {
                        x: 0,
                        y: 1,
                    },
                    {
                        x: 0,
                        y: 2,
                    },
                ],
                head: {
                    x: 0,
                    y: 0,
                },
                length: 3,
                shout: '',
                // squad: '',
                customizations: {
                    color: '#000000',
                    head: 'bendr',
                    tail: 'curled',
                },
            },
        ],
        food: [
            {
                x: 0,
                y: 4,
            },
            {
                x: 3,
                y: 7,
            },
            {
                x: 8,
                y: 7,
            },
            {
                x: 5,
                y: 8,
            },
        ],
        hazards: [],
    },
    you: {
        id: 'gs_Skqck87mrPDTjmmJFMHMSRrB',
        name: 'snek snek',
        latency: '88',
        health: 92,
        body: [
            {
                x: 9,
                y: 9,
            },
            {
                x: 8,
                y: 9,
            },
            {
                x: 7,
                y: 9,
            },
            {
                x: 6,
                y: 9,
            },
            {
                x: 5,
                y: 9,
            },
            {
                x: 5,
                y: 10,
            },
            {
                x: 4,
                y: 10,
            },
            {
                x: 3,
                y: 10,
            },
        ],
        head: {
            x: 9,
            y: 9,
        },
        length: 8,
        shout: '',
        // squad: '',
        customizations: {
            color: '#365aff',
            head: 'beluga',
            tail: 'curled',
        },
    },
};
const state = sampleState;
function doStuff() {
    const food = state.board.food[0];
    const you = state.you.head;
    // const result = aStar(sampleState, you, food)
    const map = new BattleMap(state.board.width, state.board.height);
    state.board.snakes.forEach((snek) => {
        snek.body.forEach((b) => map.setBlocked(b));
        const headNeighbors = map.neighbors(snek.head);
        headNeighbors.forEach((c) => map.setDanger(c, 30));
    });
    const result = aStar(map, you, food);
    console.log(result);
}
doStuff();
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const W = 500;
const H = 500;
const PAD_BOTTOM = 30; // room for the result summary text
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
const map = buildMap(state);
// head is at (9,9); path to the far corner instead of the nearest food
const goal = { x: 3, y: 1 };
const aStarResult = aStar(map, state.you.head, goal);
// color a cell by its danger weight: 0 = white, higher = deeper red
const dangerColor = (danger) => {
    if (danger <= 0)
        return '#ffffff';
    const t = Math.min(danger / 30, 1);
    const g = Math.round(255 - t * 180);
    const b = Math.round(255 - t * 200);
    return `rgb(255, ${g}, ${b})`;
};
// cells that lie on the chosen path, for highlighting
const pathKeys = new Set((aStarResult?.path ?? []).map((c) => `${c.x}-${c.y}`));
const costMap = aStarResult?.costMap;
// 1. draw each cell shaded by danger weight; overlay the aStar cost from costMap
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
        const cell = map.get({ x, y });
        const danger = cell.danger || 0;
        const onPath = pathKeys.has(`${x}-${y}`);
        ctx.fillStyle = cell.blocked ? '#333333' : dangerColor(danger);
        ctx.fillRect(px(x), py(y), cellW, cellH);
        ctx.strokeStyle = '#cccccc';
        ctx.strokeRect(px(x), py(y), cellW, cellH);
        // tint cells that A* chose as the path
        if (onPath) {
            ctx.fillStyle = 'rgba(0, 68, 255, 0.18)';
            ctx.fillRect(px(x), py(y), cellW, cellH);
        }
        if (cell.blocked)
            continue;
        // accumulated cost A* computed for this cell (null = never explored)
        const cost = costMap ? costMap.get({ x, y }) : null;
        if (cost !== null && cost !== undefined) {
            ctx.fillStyle = '#0044aa';
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(String(cost), cx(x), cy(y) - 6);
        }
        // danger weight shown smaller, below the cost
        if (danger > 0) {
            ctx.fillStyle = '#aa0000';
            ctx.font = '9px sans-serif';
            ctx.fillText(`d${danger}`, cx(x), cy(y) + 7);
        }
    }
}
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
// 3b. draw the goal we're pathing to
ctx.beginPath();
ctx.arc(cx(goal.x), cy(goal.y), cellW * 0.28, 0, Math.PI * 2);
ctx.fillStyle = '#ff3b3b';
ctx.fill();
ctx.strokeStyle = '#000000';
ctx.lineWidth = 2;
ctx.stroke();
ctx.lineWidth = 1;
// 4. draw the aStar result: an arrow from our head in the chosen direction
if (aStarResult) {
    const { dir, costToNext, costToGoal } = aStarResult;
    const head = state.you.head;
    const delta = dirs[dir](head);
    const fromX = cx(head.x);
    const fromY = cy(head.y);
    const toX = cx(delta.x);
    const toY = cy(delta.y);
    ctx.strokeStyle = '#0044ff';
    ctx.fillStyle = '#0044ff';
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
    // result summary text below the board
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = '14px sans-serif';
    ctx.fillText(`dir: ${dir}   costToNext: ${costToNext}   costToGoal: ${costToGoal}`, 4, H + 18);
}
else {
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = '14px sans-serif';
    ctx.fillText('aStar found no path to the target food', 4, H + 18);
}
//# sourceMappingURL=stuff.js.map