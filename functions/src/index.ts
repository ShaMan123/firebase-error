import * as cors from 'cors';
import * as express from 'express';
import * as functions from "firebase-functions";
import 'source-map-support/register';

const app = express();
app.use(cors({ origin: true }));

export function useSSE<T>(req: express.Request<T>, res: express.Response, next: express.NextFunction) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        //  https://stackoverflow.com/questions/59900466/server-sent-events-sse-problem-with-ssl-https
        'X-Accel-Buffering': 'no'
    });
    res.flushHeaders();
    next();
}

export function writeSSE(res: express.Response, data: object) {
    res.write(`id: global-vars or local-vars?\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
}

let i = 0;
let j = 0;
let k = 0;

app.get('*', useSSE, async (req, res, next) => {
    setInterval(() => {
        i++;
        functions.logger.info("Global scope vars", { i, j, k });
        writeSSE(res, { i, j, k });
        next()
    }, 1000);
});

export const subscribe = functions.region('europe-west1').https.onRequest(app);

export const subscribe2 = functions.region('europe-west1').https.onRequest((req, res) => {
    useSSE(req, res, () => {
        setInterval(() => {
            j++
            functions.logger.info("Global scope vars", { i, j, k });
            writeSSE(res, { i, j, k });
        }, 1000);
    });
});

/**
 * This is the only function that persists global variable values
 * Is it because it completes while the SSE functions timeout?
 */
export const increment = functions.region('europe-west1').https.onRequest((req, res) => {
    setTimeout(() => {
        k++;
        functions.logger.info("Global scope vars", { i, j, k });
        res.json({ i, j, k });
    }, 1000);
});

