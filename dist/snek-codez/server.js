import express from 'express';
export default function runServer(handlers) {
    const app = express();
    app.use(express.json());
    app.get('/', (_req, res) => {
        res.send(handlers.info());
    });
    app.post('/start', (req, res) => {
        handlers.start(req.body);
        res.send('ok');
    });
    app.post('/move', (req, res) => {
        res.send(handlers.move(req.body));
    });
    app.post('/end', (req, res) => {
        handlers.end(req.body);
        res.send('ok');
    });
    app.use(function (_req, res, next) {
        res.set('Server', 'battlesnake/github/starter-snake-typescript');
        next();
    });
    const host = '0.0.0.0';
    const port = parseInt(process.env.PORT || '8000');
    app.listen(port, host, () => {
        console.log(`Running Battlesnake at http://${host}:${port}...`);
    });
}
//# sourceMappingURL=server.js.map