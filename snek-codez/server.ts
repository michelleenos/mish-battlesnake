import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import type { GameState, InfoResponse, MoveResponse } from '../types'
import { getMove, type SnekConfig } from './snek.js'

export interface BattlesnakeHandlers {
    info: () => InfoResponse
    start: (state: GameState) => void
    move: (state: GameState) => MoveResponse
    end: (state: GameState) => void
}

export default function runServer(snek: SnekConfig, port: number) {
    const app = express()
    app.use(express.json())

    app.get('/', (_req: Request, res: Response<InfoResponse>) => {
        res.send({
            apiversion: '1',
            author: 'mish',
            ...snek.customizations,
        })
    })

    app.post('/start', (_req: Request, res: Response) => {
        console.log(`GAME START: ${snek.name}`)
        res.send('ok')
    })

    app.post('/move', (req: Request, res: Response) => {
        const state = req.body
        const move = getMove(state, snek)
        console.log(`${snek.name} MOVE ${state.turn}: ${move}`)
        res.send({ move })
    })

    app.post('/end', (_req: Request, res: Response) => {
        console.log(`GAME END: ${snek.name}`)
        res.send('ok')
    })

    app.use(function (_req: Request, res: Response, next: NextFunction) {
        res.set('Server', 'mish-snek-friend')
        next()
    })

    const host = '0.0.0.0'

    app.listen(port, host, () => {
        console.log(`Running Battlesnake ${snek.name} at http://${host}:${port}...`)
    })
}
