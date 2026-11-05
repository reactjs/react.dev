import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parentPort, workerData, } from 'node:worker_threads';
import { markWorkerRegistered } from '../register.cjs';
import { NOTIFY_INDEX } from '../shared.cjs';
import { extractProperties, overrideStdio, startWorkerThread, } from './helpers.js';
export * from './common.js';
export * from './constants.js';
export * from './helpers.js';
export * from './types.js';
let syncFnCache;
export function createSyncFn(workerPath, timeoutOrOptions) {
    syncFnCache ?? (syncFnCache = new Map());
    if (typeof workerPath !== 'string' || workerPath.startsWith('file://')) {
        workerPath = fileURLToPath(workerPath);
    }
    const cachedSyncFn = syncFnCache.get(workerPath);
    if (cachedSyncFn) {
        return cachedSyncFn;
    }
    if (!path.isAbsolute(workerPath)) {
        throw new Error('`workerPath` must be absolute');
    }
    const syncFn = startWorkerThread(workerPath, typeof timeoutOrOptions === 'number'
        ? { timeout: timeoutOrOptions }
        : timeoutOrOptions);
    syncFnCache.set(workerPath, syncFn);
    return syncFn;
}
export function runAsWorker(fn) {
    if (!workerData) {
        return;
    }
    const stdio = [];
    overrideStdio(stdio);
    const { workerPort, sharedBufferView } = workerData;
    markWorkerRegistered(sharedBufferView);
    parentPort.on('message', ({ id, args }) => {
        ;
        (async () => {
            let isAborted = false;
            const handleAbortMessage = (msg) => {
                if (msg.id === id && msg.cmd === 'abort') {
                    isAborted = true;
                }
            };
            workerPort.on('message', handleAbortMessage);
            let msg;
            try {
                msg = { id, stdio, result: await fn(...args) };
            }
            catch (error) {
                msg = { id, stdio, error, properties: extractProperties(error) };
            }
            workerPort.off('message', handleAbortMessage);
            if (isAborted) {
                stdio.length = 0;
                return;
            }
            try {
                workerPort.postMessage(msg);
                Atomics.add(sharedBufferView, NOTIFY_INDEX, 1);
                Atomics.notify(sharedBufferView, NOTIFY_INDEX);
            }
            finally {
                stdio.length = 0;
            }
        })();
    });
}
//# sourceMappingURL=index.js.map