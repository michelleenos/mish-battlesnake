import express from 'express';
import { getMove } from './snek.js';
export default function runServer(snek, port) {
    const app = express();
    app.use(express.json());
    app.get('/', (_req, res) => {
        res.send({
            apiversion: '1',
            author: 'mish',
            ...snek.customizations,
        });
    });
    app.post('/start', (_req, res) => {
        console.log(`GAME START: ${snek.name}`);
        res.send('ok');
    });
    app.post('/move', (req, res) => {
        const state = req.body;
        const move = getMove(state, snek);
        console.log(`${snek.name} MOVE ${state.turn}: ${move}`);
        res.send({ move });
    });
    app.post('/end', (_req, res) => {
        console.log(`GAME END: ${snek.name}`);
        res.send('ok');
    });
    app.use(function (_req, res, next) {
        res.set('Server', 'mish-snek-friend');
        next();
    });
    const host = '0.0.0.0';
    app.listen(port, host, () => {
        console.log(`Running Battlesnake ${snek.name} at http://${host}:${port}...`);
    });
}
//# sourceMappingURL=server.js.map