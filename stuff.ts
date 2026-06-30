import { aStar } from './snek-codez/astar'
import { BattleMap } from './snek-codez/graph'
import type { GameState } from './types'

const sampleState: GameState = {
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
                ],
                head: {
                    x: 9,
                    y: 9,
                },
                length: 4,
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
        ],
        head: {
            x: 9,
            y: 9,
        },
        length: 4,
        shout: '',
        // squad: '',
        customizations: {
            color: '#365aff',
            head: 'beluga',
            tail: 'curled',
        },
    },
}

const state = sampleState
function doStuff() {
    const food = state.board.food[0]
    const you = state.you.head
    // const result = aStar(sampleState, you, food)
    const map = new BattleMap(state.board.width, state.board.height)

    state.board.snakes.forEach((snek) => {
        snek.body.forEach((b) => map.setBlocked(b))
        const headNeighbors = map.neighbors(snek.head)
        headNeighbors.forEach((c) => map.setDanger(c, 30))
    })

    const result = aStar(map, you, food)
    console.log(result)
}

doStuff()
