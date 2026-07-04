import type { SnekConfig } from './snek-codez/snek.js'

export const sneks = {
    hangry: {
        name: 'hangry',
        customizations: {
            color: '#365aff',
            head: 'bendr',
            tail: 'hook',
        },
        attackMaxCost: 7,
        couldEatThreshold: 100,
        shouldEatThreshold: 100,
        avoidWalls: 0,
        avoidBodies: 2,
    },
    angry: {
        name: 'angry',
        customizations: {
            color: '#ff3609',
            head: 'evil',
            tail: 'tiger-tail',
        },
        attackMaxCost: 10,
        couldEatThreshold: 100,
        shouldEatThreshold: 10,
        avoidWalls: 5,
        avoidBodies: 1,
    },
    chill: {
        name: 'chill',
        customizations: {
            color: '#36ffbf',
            head: 'rudolph',
            tail: 'curled',
        },
        attackMaxCost: 3,
        couldEatThreshold: 60,
        shouldEatThreshold: 30,
        avoidWalls: 1,
        avoidBodies: 2,
    },
    peaceful: {
        name: 'peaceful',
        customizations: {
            color: '#ff5eef',
            head: 'safe',
            tail: 'curled',
        },
        attackMaxCost: 0,
        couldEatThreshold: 50,
        shouldEatThreshold: 30,
        avoidWalls: 5,
        avoidBodies: 6,
    },
} satisfies { [key: string]: SnekConfig }
