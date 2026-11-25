import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MessageChannel, Worker, receiveMessageOnPort, } from 'node:worker_threads';
import { moduleResolve } from '@dual-bundle/import-meta-resolve';
import { tryExtensions, findUp, cjsRequire, isPkgAvailable } from '@pkgr/core';
import { NODE_OPTIONS, NOTIFY_INDEX, createSharedBufferView, getFlag, getFlagValues, } from '../shared.cjs';
import { compareNodeVersion } from './common.js';
import { DEFAULT_EXEC_ARGV, DEFAULT_GLOBAL_SHIMS, DEFAULT_GLOBAL_SHIMS_PRESET, DEFAULT_TIMEOUT, DEFAULT_TS_RUNNER, DEFAULT_TYPES_NODE_VERSION, IMPORT_FLAG, IMPORT_FLAG_SUPPORTED, LOADER_FLAG, LOADER_FLAGS, MTS_SUPPORTED, NO_STRIP_TYPES, NO_STRIP_TYPES_FLAG, REQUIRE_ABBR_FLAG, REQUIRE_FLAGS, STRIP_TYPES_FLAG, STRIP_TYPES_NODE_VERSION, TRANSFORM_TYPES_FLAG, TRANSFORM_TYPES_NODE_VERSION, TS_ESM_PARTIAL_SUPPORTED, TsRunner, } from './constants.js';
export const isFile = (path) => {
    try {
        return !!fs.statSync(path, { throwIfNoEntry: false })?.isFile();
    }
    catch {
        return false;
    }
};
const isPkgAvailableFrom = (pkg, base) => {
    try {
        createRequire(base).resolve(pkg);
        return true;
    }
    catch {
        return false;
    }
};
const CONDITIONS_FLAGS = new Set(['--conditions', '-C']);
const requireModuleByDefault = compareNodeVersion('22.12.0') >= 0 ||
    (compareNodeVersion('20.19.0') >= 0 && compareNodeVersion('21') < 0);
const hasRequireModule = (execArgv) => getFlag('--no-experimental-require-module', undefined, execArgv) == null &&
    (getFlag('--experimental-require-module', undefined, execArgv) != null ||
        requireModuleByDefault);
const esmConditions = (execArgv) => new Set([
    'node',
    'import',
    ...(getFlag('--no-addons', undefined, execArgv) == null
        ? ['node-addons']
        : []),
    ...(hasRequireModule(execArgv) ? ['module-sync'] : []),
    ...getFlagValues(CONDITIONS_FLAGS, execArgv),
]);
const resolveEsmImport = (specifier, workerPath, conditions) => {
    if (process.versions.pnp) {
        const pnp = createRequire(workerPath)('pnpapi');
        const resolved = pnp.resolveRequest(specifier, workerPath, { conditions });
        return resolved == null ? specifier : pathToFileURL(resolved).href;
    }
    return moduleResolve(specifier, pathToFileURL(workerPath), conditions, false)
        .href;
};
const isPkgImportableFrom = (pkg, workerPath, conditions) => {
    try {
        resolveEsmImport(pkg, workerPath, conditions);
        return true;
    }
    catch {
        return false;
    }
};
export const dataUrl = (code) => new URL(`data:text/javascript,${encodeURIComponent(code)}`);
export { extractProperties } from '../shared.cjs';
const withProperties = (error, properties) => error && typeof error === 'object' ? Object.assign(error, properties) : error;
const EMPTY_PORT_READS = 100000;
const EMPTY_PORT_READ_SLICE = 10;
const FALLBACK_WARNING_CODE = 'SYNCKIT_GUARD_ORDERING';
const abortRequest = (mainPort, id) => {
    const abortMsg = { id, cmd: 'abort' };
    mainPort.postMessage(abortMsg);
};
const noteEmptyRead = (sharedBufferView, emptyReads, deadline, remaining, mainPort, expectedId) => {
    if (deadline != null && Date.now() >= deadline) {
        abortRequest(mainPort, expectedId);
        throw new Error('Internal error: Atomics.wait() failed: timed-out');
    }
    const reads = emptyReads + 1;
    if (reads % EMPTY_PORT_READS === 0) {
        Atomics.wait(sharedBufferView, NOTIFY_INDEX, Atomics.load(sharedBufferView, NOTIFY_INDEX), Math.min(remaining ?? EMPTY_PORT_READ_SLICE, EMPTY_PORT_READ_SLICE));
    }
    return reads;
};
export const hasRequireFlag = (execArgv) => execArgv.some(execArg => REQUIRE_FLAGS.has(execArg));
export const hasImportFlag = (execArgv) => execArgv.includes(IMPORT_FLAG);
export const hasLoaderFlag = (execArgv) => execArgv.some(execArg => LOADER_FLAGS.has(execArg));
const resolvePnpApiPath = () => {
    if (!process.versions.pnp) {
        return undefined;
    }
    try {
        return cjsRequire.resolve('pnpapi');
    }
    catch {
        return undefined;
    }
};
export const setupTsRunner = (workerPath, { execArgv = DEFAULT_EXEC_ARGV, tsRunner, } = {}) => {
    let ext = path.extname(workerPath);
    if (!/([/\\])node_modules\1/.test(workerPath) &&
        (!ext || /^\.[cm]?js$/.test(ext))) {
        const workPathWithoutExt = ext
            ? workerPath.slice(0, -ext.length)
            : workerPath;
        let extensions;
        switch (ext) {
            case '.cjs': {
                extensions = ['.cts', '.cjs'];
                break;
            }
            case '.mjs': {
                extensions = ['.mts', '.mjs'];
                break;
            }
            default: {
                extensions = ['.ts', '.js'];
                break;
            }
        }
        const found = tryExtensions(workPathWithoutExt, extensions);
        let differentExt;
        if (found && (!ext || (differentExt = found !== workPathWithoutExt))) {
            workerPath = found;
            if (differentExt) {
                ext = path.extname(workerPath);
            }
        }
    }
    const isTs = /\.[cm]?ts$/.test(workerPath);
    let jsUseEsm = ext === '.mjs';
    let tsUseEsm = ext === '.mts';
    if (isTs) {
        if (!tsUseEsm && ext !== '.cts') {
            const pkg = findUp(workerPath);
            if (pkg) {
                tsUseEsm = cjsRequire(pkg).type === 'module';
            }
        }
        const stripTypesIndex = execArgv.indexOf(STRIP_TYPES_FLAG);
        const transformTypesIndex = execArgv.indexOf(TRANSFORM_TYPES_FLAG);
        const noStripTypesIndex = execArgv.indexOf(NO_STRIP_TYPES_FLAG);
        const execArgvNoStripTypes = noStripTypesIndex > stripTypesIndex ||
            noStripTypesIndex > transformTypesIndex;
        const noStripTypes = execArgvNoStripTypes ||
            (stripTypesIndex === -1 && transformTypesIndex === -1 && NO_STRIP_TYPES);
        if (tsRunner == null) {
            if (process.versions.bun) {
                tsRunner = TsRunner.Bun;
            }
            else if (!noStripTypes &&
                compareNodeVersion(STRIP_TYPES_NODE_VERSION) >= 0) {
                tsRunner = TsRunner.Node;
            }
            else if (isPkgAvailable(TsRunner.TsNode)) {
                tsRunner = TsRunner.TsNode;
            }
        }
        switch (tsRunner) {
            case TsRunner.Bun: {
                break;
            }
            case TsRunner.Node: {
                if (compareNodeVersion(STRIP_TYPES_NODE_VERSION) < 0) {
                    throw new Error('type stripping is not supported in this node version');
                }
                if (noStripTypes) {
                    throw new Error('type stripping is disabled explicitly');
                }
                if (compareNodeVersion(DEFAULT_TYPES_NODE_VERSION) >= 0) {
                    break;
                }
                if (compareNodeVersion(TRANSFORM_TYPES_NODE_VERSION) >= 0 &&
                    !execArgv.includes(TRANSFORM_TYPES_FLAG)) {
                    execArgv = [TRANSFORM_TYPES_FLAG, ...execArgv];
                }
                else if (compareNodeVersion(STRIP_TYPES_NODE_VERSION) >= 0 &&
                    !execArgv.includes(STRIP_TYPES_FLAG)) {
                    execArgv = [STRIP_TYPES_FLAG, ...execArgv];
                }
                break;
            }
            case TsRunner.TsNode: {
                if (tsUseEsm) {
                    if (!execArgv.includes(LOADER_FLAG)) {
                        execArgv = [LOADER_FLAG, `${TsRunner.TsNode}/esm`, ...execArgv];
                    }
                }
                else if (!hasRequireFlag(execArgv)) {
                    execArgv = [
                        REQUIRE_ABBR_FLAG,
                        `${TsRunner.TsNode}/register`,
                        ...execArgv,
                    ];
                }
                break;
            }
            case TsRunner.EsbuildRegister: {
                if (tsUseEsm) {
                    if (!hasLoaderFlag(execArgv)) {
                        execArgv = [
                            LOADER_FLAG,
                            `${TsRunner.EsbuildRegister}/loader`,
                            ...execArgv,
                        ];
                    }
                }
                else if (!hasRequireFlag(execArgv)) {
                    execArgv = [REQUIRE_ABBR_FLAG, TsRunner.EsbuildRegister, ...execArgv];
                }
                break;
            }
            case TsRunner.EsbuildRunner: {
                if (!hasRequireFlag(execArgv)) {
                    execArgv = [
                        REQUIRE_ABBR_FLAG,
                        `${TsRunner.EsbuildRunner}/register`,
                        ...execArgv,
                    ];
                }
                break;
            }
            case TsRunner.OXC: {
                if (!execArgv.includes(IMPORT_FLAG)) {
                    execArgv = [
                        IMPORT_FLAG,
                        `@${TsRunner.OXC}-node/core/register`,
                        ...execArgv,
                    ];
                }
                break;
            }
            case TsRunner.SWC: {
                if (tsUseEsm) {
                    if (IMPORT_FLAG_SUPPORTED) {
                        if (!hasImportFlag(execArgv)) {
                            execArgv = [
                                IMPORT_FLAG,
                                `@${TsRunner.SWC}-node/register/esm-register`,
                                ...execArgv,
                            ];
                        }
                    }
                    else if (!hasLoaderFlag(execArgv)) {
                        execArgv = [
                            LOADER_FLAG,
                            `@${TsRunner.SWC}-node/register/esm`,
                            ...execArgv,
                        ];
                    }
                }
                else if (!hasRequireFlag(execArgv)) {
                    execArgv = [
                        REQUIRE_ABBR_FLAG,
                        `@${TsRunner.SWC}-node/register`,
                        ...execArgv,
                    ];
                }
                break;
            }
            case TsRunner.TSX: {
                if (IMPORT_FLAG_SUPPORTED) {
                    if (!execArgv.includes(IMPORT_FLAG)) {
                        execArgv = [IMPORT_FLAG, TsRunner.TSX, ...execArgv];
                    }
                }
                else if (!execArgv.includes(LOADER_FLAG)) {
                    execArgv = [LOADER_FLAG, TsRunner.TSX, ...execArgv];
                }
                break;
            }
            default: {
                throw new Error(`Unknown ts runner: ${String(tsRunner)}`);
            }
        }
    }
    else if (!jsUseEsm && ext !== '.cjs') {
        const pkg = findUp(workerPath);
        if (pkg) {
            jsUseEsm = cjsRequire(pkg).type === 'module';
        }
    }
    const pnpApiPath = resolvePnpApiPath();
    let resolvedPnpLoaderPath;
    if (pnpApiPath !== undefined &&
        !getFlag(REQUIRE_FLAGS, pnpApiPath) &&
        !execArgv.includes(pnpApiPath)) {
        const pnpLoaderPath = path.resolve(pnpApiPath, '../.pnp.loader.mjs');
        if (isFile(pnpLoaderPath)) {
            const pnpLoaderUrl = pathToFileURL(pnpLoaderPath).href;
            const pnpLoaderRealPath = fs.realpathSync(pnpLoaderPath);
            const inheritedPnpLoader = getFlagValues(LOADER_FLAGS).some(value => {
                if (value === pnpLoaderUrl) {
                    return true;
                }
                try {
                    const loaderPath = value.startsWith('file:')
                        ? fileURLToPath(value)
                        : path.resolve(value);
                    return fs.realpathSync(loaderPath) === pnpLoaderRealPath;
                }
                catch {
                    return false;
                }
            });
            if (!inheritedPnpLoader) {
                resolvedPnpLoaderPath = pnpLoaderUrl;
                execArgv = [LOADER_FLAG, resolvedPnpLoaderPath, ...execArgv];
            }
        }
    }
    return {
        ext,
        isTs,
        jsUseEsm,
        tsRunner,
        tsUseEsm,
        workerPath,
        pnpApiPath,
        pnpLoaderPath: resolvedPnpLoaderPath,
        execArgv,
    };
};
export const md5Hash = (text) => createHash('md5').update(text).digest('hex');
export const encodeImportModule = (moduleNameOrGlobalShim, type = 'import') => {
    const { moduleName, globalName, named, conditional } = typeof moduleNameOrGlobalShim === 'string'
        ? { moduleName: moduleNameOrGlobalShim }
        : moduleNameOrGlobalShim;
    const importStatement = type === 'import'
        ? `import${globalName
            ? ' ' +
                (named === null
                    ? '* as ' + globalName
                    : named?.trim()
                        ? `{${named}}`
                        : globalName) +
                ' from'
            : ''} ${JSON.stringify(path.isAbsolute(moduleName) ? pathToFileURL(moduleName) : moduleName)}`
        : `${globalName
            ? 'const ' + (named?.trim() ? `{${named}}` : globalName) + '='
            : ''}require(${JSON.stringify(moduleName)})`;
    if (!globalName) {
        return importStatement;
    }
    const overrideStatement = `globalThis.${globalName}=${named?.trim() ? named : globalName}`;
    return (importStatement +
        (conditional === false
            ? `;${overrideStatement}`
            : `;if(!globalThis.${globalName})${overrideStatement}`));
};
export const _generateGlobals = (globalShims, type) => globalShims.reduce((acc, shim) => `${acc}${acc ? ';' : ''}${encodeImportModule(shim, type)}`, '');
const _dirname = typeof __dirname === 'undefined'
    ? path.dirname(fileURLToPath(import.meta.url))
    : __dirname;
export const generateGlobals = (workerPath, globalShims, type = 'import', execArgv = []) => {
    if (globalShims.length === 0) {
        return '';
    }
    if (type === 'require') {
        return _generateGlobals(globalShims, 'require');
    }
    const conditions = esmConditions(execArgv);
    return _generateGlobals(globalShims.map(shim => ({
        ...shim,
        moduleName: resolveEsmImport(shim.moduleName, workerPath, conditions),
    })), 'import');
};
const requireGlobalsFromWorker = (workerPath, globals) => globals
    ? `{const require=globalThis.require('node:module').createRequire(${JSON.stringify(workerPath)});${globals}}`
    : globals;
const workerPreload = path.resolve(_dirname, '../register.cjs');
export function startWorkerThread(workerPath, { timeout = DEFAULT_TIMEOUT, execArgv = DEFAULT_EXEC_ARGV, tsRunner = DEFAULT_TS_RUNNER, transferList = [], globalShims = DEFAULT_GLOBAL_SHIMS, } = {}) {
    const { port1: mainPort, port2: workerPort } = new MessageChannel();
    const forwardedPnpApiPath = resolvePnpApiPath();
    execArgv =
        forwardedPnpApiPath !== undefined &&
            execArgv[0] === REQUIRE_ABBR_FLAG &&
            execArgv[1] === forwardedPnpApiPath
            ? execArgv.slice(2)
            : execArgv;
    execArgv =
        execArgv[0] === REQUIRE_ABBR_FLAG && execArgv[1] === workerPreload
            ? execArgv.slice(2)
            : execArgv;
    const { isTs, ext, jsUseEsm, tsUseEsm, tsRunner: finalTsRunner, workerPath: finalWorkerPath, pnpApiPath, pnpLoaderPath, execArgv: finalExecArgv, } = setupTsRunner(workerPath, { execArgv, tsRunner });
    const workerPathUrl = pathToFileURL(finalWorkerPath);
    if (/\.[cm]ts$/.test(finalWorkerPath)) {
        const isTsxSupported = !tsUseEsm || TS_ESM_PARTIAL_SUPPORTED;
        if (!finalTsRunner) {
            throw new Error('No ts runner specified, ts worker path is not supported');
        }
        else if ([
            TsRunner.EsbuildRegister,
            TsRunner.EsbuildRunner,
            ...(TS_ESM_PARTIAL_SUPPORTED
                ? [
                    TsRunner.OXC,
                    TsRunner.SWC,
                ]
                : []),
            ...(isTsxSupported ? [] : [TsRunner.TSX]),
        ].includes(finalTsRunner)) {
            throw new Error(`${finalTsRunner} is not supported for ${ext} files yet` +
                (isTsxSupported
                    ? ', you can try [tsx](https://github.com/esbuild-kit/tsx) instead'
                    : MTS_SUPPORTED
                        ? ', you can try [oxc](https://github.com/oxc-project/oxc-node) or [swc](https://github.com/swc-project/swc-node/tree/master/packages/register) instead'
                        : ''));
        }
    }
    const isCjsWorker = isTs ? !tsUseEsm : !jsUseEsm;
    const esmWorkerConditions = esmConditions(finalExecArgv);
    const finalGlobalShims = (globalShims === true
        ? DEFAULT_GLOBAL_SHIMS_PRESET
        : Array.isArray(globalShims)
            ? globalShims
            : []).filter(({ moduleName }) => isCjsWorker
        ? isPkgAvailableFrom(moduleName, finalWorkerPath)
        : isPkgImportableFrom(moduleName, finalWorkerPath, esmWorkerConditions));
    const sharedBufferView = createSharedBufferView();
    const useGlobals = finalGlobalShims.length > 0;
    const useEval = isTs ? !tsUseEsm : !jsUseEsm && useGlobals;
    const workerEntry = (jsUseEsm && useGlobals) || (tsUseEsm && finalTsRunner === TsRunner.TsNode)
        ? dataUrl(`${generateGlobals(finalWorkerPath, finalGlobalShims, 'import', finalExecArgv)};import ${JSON.stringify(String(workerPathUrl))}`)
        : useEval
            ? `${requireGlobalsFromWorker(finalWorkerPath, generateGlobals(finalWorkerPath, finalGlobalShims, 'require'))};${encodeImportModule(finalWorkerPath, 'require')}`
            : workerPathUrl;
    const workerOptions = {
        eval: useEval,
        workerData: { sharedBufferView, workerPort, pnpLoaderPath },
        transferList: [workerPort, ...transferList],
    };
    const guardLeads = REQUIRE_FLAGS.has(NODE_OPTIONS[0]) && NODE_OPTIONS[1] === workerPreload;
    const pnpThenGuardLeads = pnpApiPath !== undefined &&
        REQUIRE_FLAGS.has(NODE_OPTIONS[0]) &&
        NODE_OPTIONS[1] === pnpApiPath &&
        REQUIRE_FLAGS.has(NODE_OPTIONS[2]) &&
        NODE_OPTIONS[3] === workerPreload;
    const inheritsGuard = guardLeads || pnpThenGuardLeads;
    const pnpPreload = pnpApiPath
        ? `${REQUIRE_ABBR_FLAG} ${JSON.stringify(pnpApiPath)} `
        : '';
    const guardExecArgv = [
        ...(pnpApiPath ? [REQUIRE_ABBR_FLAG, pnpApiPath] : []),
        REQUIRE_ABBR_FLAG,
        workerPreload,
        ...finalExecArgv,
    ];
    let worker;
    try {
        worker = new Worker(workerEntry, {
            ...workerOptions,
            env: inheritsGuard
                ? undefined
                : {
                    ...process.env,
                    NODE_OPTIONS: `${pnpPreload}${REQUIRE_ABBR_FLAG} ${JSON.stringify(workerPreload)}${process.env.NODE_OPTIONS ? ` ${process.env.NODE_OPTIONS}` : ''}`,
                },
            execArgv: inheritsGuard ? guardExecArgv : finalExecArgv,
        });
    }
    catch (error) {
        if (error.code !== 'ERR_WORKER_INVALID_EXEC_ARGV') {
            throw error;
        }
        process.emitWarning('synckit: this Node rejected the worker environment, so the failure guard loads after ' +
            'inherited `NODE_OPTIONS` preloads; a failure in one of those cannot be reported. Set ' +
            '`SYNCKIT_TIMEOUT` to bound the wait.', { code: FALLBACK_WARNING_CODE });
        worker = new Worker(workerEntry, {
            ...workerOptions,
            execArgv: guardExecArgv,
        });
    }
    let nextID = 0;
    let workerFailure;
    const spendNotification = () => {
        if (Atomics.load(sharedBufferView, NOTIFY_INDEX) > 0) {
            Atomics.sub(sharedBufferView, NOTIFY_INDEX, 1);
        }
    };
    const waitForMessage = (abortId, remaining) => {
        const status = Atomics.wait(sharedBufferView, NOTIFY_INDEX, 0, remaining);
        if (!['ok', 'not-equal'].includes(status)) {
            abortRequest(mainPort, abortId);
            throw new Error('Internal error: Atomics.wait() failed: ' + status);
        }
        const result = receiveMessageOnPort(mainPort);
        const msg = result?.message;
        if (!msg) {
            return;
        }
        spendNotification();
        if ('workerFailure' in msg) {
            if (msg.fatal) {
                workerFailure = msg;
            }
            throw withProperties(msg.error, msg.properties);
        }
        return msg;
    };
    const receiveMessageWithId = (expectedId, waitingTimeout) => {
        const deadline = waitingTimeout == null ? undefined : Date.now() + waitingTimeout;
        let remaining = waitingTimeout == null ? undefined : Math.max(0, waitingTimeout);
        let emptyReads = 0;
        for (;;) {
            const msg = waitForMessage(expectedId, remaining);
            if (msg == null || msg.id < expectedId) {
                if (msg == null) {
                    emptyReads = noteEmptyRead(sharedBufferView, emptyReads, deadline, remaining, mainPort, expectedId);
                }
                remaining =
                    deadline == null ? undefined : Math.max(0, deadline - Date.now());
                continue;
            }
            if (expectedId !== msg.id) {
                throw new Error(`Internal error: Expected id ${expectedId} but got id ${msg.id}`);
            }
            return msg;
        }
    };
    const syncFn = (...args) => {
        if (workerFailure) {
            throw withProperties(workerFailure.error, workerFailure.properties);
        }
        const id = nextID++;
        const msg = { id, args };
        worker.postMessage(msg);
        const message = receiveMessageWithId(id, timeout);
        for (const { type, chunk, encoding } of message.stdio) {
            process[type].write(chunk, encoding);
        }
        if ('error' in message) {
            throw withProperties(message.error, message.properties);
        }
        return message.result;
    };
    worker.unref();
    return syncFn;
}
export const overrideStdio = (stdio) => {
    for (const type of ['stdout', 'stderr']) {
        process[type]._writev = (chunks, callback) => {
            for (const { chunk, encoding, } of chunks) {
                stdio.push({
                    type,
                    chunk,
                    encoding,
                });
            }
            callback();
        };
    }
};
//# sourceMappingURL=helpers.js.map