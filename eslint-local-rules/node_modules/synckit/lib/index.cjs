Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let node_path = require("node:path");
node_path = __toESM(node_path, 1);
let node_url = require("node:url");
let node_worker_threads = require("node:worker_threads");
let register_cjs = require("../register.cjs");
let shared_cjs = require("../shared.cjs");
let node_crypto = require("node:crypto");
let node_fs = require("node:fs");
node_fs = __toESM(node_fs, 1);
let node_module = require("node:module");
let _dual_bundle_import_meta_resolve = require("@dual-bundle/import-meta-resolve");
let _pkgr_core = require("@pkgr/core");
//#region src/common.ts
const hasFlag = (flag) => (0, shared_cjs.getFlag)(flag) != null;
//#endregion
//#region src/constants.ts
const TsRunner = {
	Node: "node",
	Bun: "bun",
	TsNode: "ts-node",
	EsbuildRegister: "esbuild-register",
	EsbuildRunner: "esbuild-runner",
	OXC: "oxc",
	SWC: "swc",
	TSX: "tsx"
};
const { SYNCKIT_EXEC_ARGV = "", SYNCKIT_GLOBAL_SHIMS, SYNCKIT_TIMEOUT, SYNCKIT_TS_RUNNER } = process.env;
const TS_ESM_PARTIAL_SUPPORTED = (0, shared_cjs.compareNodeVersion)("16") >= 0 && (0, shared_cjs.compareNodeVersion)("18.19") < 0;
const MTS_SUPPORTED = (0, shared_cjs.compareNodeVersion)("20.8") >= 0;
const MODULE_REGISTER_SUPPORTED = MTS_SUPPORTED || (0, shared_cjs.compareNodeVersion)("18.19") >= 0;
const STRIP_TYPES_NODE_VERSION = "22.6";
const TRANSFORM_TYPES_NODE_VERSION = "22.7";
const FEATURE_TYPESCRIPT_NODE_VERSION = "22.10";
const DEFAULT_TYPES_NODE_VERSION = "23.6";
const STRIP_TYPES_FLAG = "--experimental-strip-types";
const TRANSFORM_TYPES_FLAG = "--experimental-transform-types";
const NO_STRIP_TYPES_FLAG = "--no-experimental-strip-types";
const NO_STRIP_TYPES = hasFlag("--no-experimental-strip-types") && ((0, shared_cjs.compareNodeVersion)("22.10") >= 0 ? process.features.typescript === false : !hasFlag("--experimental-strip-types") && !hasFlag("--experimental-transform-types"));
const DEFAULT_TIMEOUT = SYNCKIT_TIMEOUT ? +SYNCKIT_TIMEOUT : void 0;
const DEFAULT_EXEC_ARGV = SYNCKIT_EXEC_ARGV.split(",");
const DEFAULT_TS_RUNNER = SYNCKIT_TS_RUNNER;
const DEFAULT_GLOBAL_SHIMS = ["1", "true"].includes(SYNCKIT_GLOBAL_SHIMS);
const DEFAULT_GLOBAL_SHIMS_PRESET = [{
	moduleName: "node-fetch-native",
	globalName: "fetch",
	named: "fetch"
}, {
	moduleName: "node:perf_hooks",
	globalName: "performance",
	named: "performance"
}];
const IMPORT_FLAG = "--import";
const REQUIRE_FLAG = "--require";
const REQUIRE_ABBR_FLAG = "-r";
const REQUIRE_FLAGS = /* @__PURE__ */ new Set([REQUIRE_FLAG, "-r"]);
const LOADER_FLAG = "--loader";
const EXPERIMENTAL_LOADER_FLAG = "--experimental-loader";
const LOADER_FLAGS = /* @__PURE__ */ new Set([LOADER_FLAG, EXPERIMENTAL_LOADER_FLAG]);
const IMPORT_FLAG_SUPPORTED = (0, shared_cjs.compareNodeVersion)("20.6") >= 0;
//#endregion
//#region src/helpers.ts
const isFile = (path) => {
	try {
		var _fs$statSync;
		return !!((_fs$statSync = node_fs.default.statSync(path, { throwIfNoEntry: false })) === null || _fs$statSync === void 0 ? void 0 : _fs$statSync.isFile());
	} catch {
		/* istanbul ignore next */
		return false;
	}
};
/**
* Whether a package can be resolved from a file the way a `require` would.
*
* `isPkgAvailable` resolves from `@pkgr/core`'s own location, which is only one of the places a
* global shim may live. The CommonJS eval path loads the shims with a `require` bound to the
* worker, so availability has to be judged from there or a shim which only exists beside the worker
* is filtered out before it can be loaded, and one that `require` cannot reach is kept and then
* fails.
*
* @param pkg - The module name to resolve.
* @param base - The absolute path of the file the resolution starts from.
*/
const isPkgAvailableFrom = (pkg, base) => {
	try {
		(0, node_module.createRequire)(base).resolve(pkg);
		return true;
	} catch {
		return false;
	}
};
const CONDITIONS_FLAGS = /* @__PURE__ */ new Set(["--conditions", "-C"]);
/**
* Whether `require(esm)` — and with it the `module-sync` condition — is on by default for this
* Node.
*
* The 20.x line got the backport in 20.19, the 22.x line in 22.12, and 23 and later started with it.
* 21.x never had it, and 22.0–22.11 needed `--experimental-require-module`.
*/
const requireModuleByDefault = (0, shared_cjs.compareNodeVersion)("22.12.0") >= 0 || (0, shared_cjs.compareNodeVersion)("20.19.0") >= 0 && (0, shared_cjs.compareNodeVersion)("21") < 0;
/**
* Whether `require(esm)` is on for the worker, which is what enables the `module-sync` condition.
*
* It follows the worker's argv merged over this thread's and otherwise the default above.
*
* @param execArgv - The argv the worker is started with.
*/
const hasRequireModule = (execArgv) => (0, shared_cjs.getFlag)("--no-experimental-require-module", void 0, execArgv) == null && ((0, shared_cjs.getFlag)("--experimental-require-module", void 0, execArgv) != null || requireModuleByDefault);
/**
* The export conditions the worker's own `import` resolves with.
*
* `node` and `import` are always there, `node-addons` unless `--no-addons` is set, `module-sync`
* once `require(esm)` is on, and whatever `--conditions` adds. They are read from this thread's argv
* and the argv the worker is started with, which is merged on top of it.
*
* @param execArgv - The argv the worker is started with.
*/
const esmConditions = (execArgv) => /* @__PURE__ */ new Set([
	"node",
	"import",
	...(0, shared_cjs.getFlag)("--no-addons", void 0, execArgv) == null ? ["node-addons"] : [],
	...hasRequireModule(execArgv) ? ["module-sync"] : [],
	...(0, shared_cjs.getFlagValues)(CONDITIONS_FLAGS, execArgv)
]);
/**
* Resolves an ESM specifier the way the worker's own `import` would.
*
* `import` resolves against the importing module, and the generated entry is a `data:` URL with no
* directory of its own, so this has to answer from the worker's path, with the worker's conditions.
* Node's own resolver did not take a parent before 20.16 and cannot see the PnP map, so the ponyfill
* covers `node_modules` and `pnpapi` covers PnP, both with the worker as the parent.
*
* @param specifier - The module name to resolve.
* @param workerPath - The absolute path of the worker module.
* @param conditions - The export conditions the worker resolves with.
* @returns The absolute URL to import, or the specifier itself for a builtin.
* @throws When the specifier cannot be resolved from the worker.
*/
const resolveEsmImport = (specifier, workerPath, conditions) => {
	if (process.versions.pnp) {
		const resolved = (0, node_module.createRequire)(workerPath)("pnpapi").resolveRequest(specifier, workerPath, { conditions });
		return resolved == null ? specifier : (0, node_url.pathToFileURL)(resolved).href;
	}
	return (0, _dual_bundle_import_meta_resolve.moduleResolve)(specifier, (0, node_url.pathToFileURL)(workerPath), conditions, false).href;
};
/**
* Whether a package can be resolved from a file the way an `import` would.
*
* Judged with {@link resolveEsmImport}, so the check cannot keep a shim the generated statements
* cannot import, or drop one they could.
*
* @param pkg - The module name to resolve.
* @param workerPath - The absolute path of the worker module.
* @param conditions - The export conditions the worker resolves with.
*/
const isPkgImportableFrom = (pkg, workerPath, conditions) => {
	try {
		resolveEsmImport(pkg, workerPath, conditions);
		return true;
	} catch {
		return false;
	}
};
const dataUrl = (code) => new URL(`data:text/javascript,${encodeURIComponent(code)}`);
const withProperties = (error, properties) => error && typeof error === "object" ? Object.assign(error, properties) : error;
const EMPTY_PORT_READS = 1e5;
const EMPTY_PORT_READ_SLICE = 10;
const FALLBACK_WARNING_CODE = "SYNCKIT_GUARD_ORDERING";
/**
* Tells a worker to stop working on a request this thread has given up waiting for, so that its
* late answer is not posted at all.
*
* @param mainPort - The port the worker answers on.
* @param id - The id of the abandoned request.
*/
const abortRequest = (mainPort, id) => {
	const abortMsg = {
		id,
		cmd: "abort"
	};
	mainPort.postMessage(abortMsg);
};
/**
* Handles one empty port read: reports a deadline that has passed, and once the spin bound is
* reached sleeps a bounded slice on the value the counter holds. Waiting on that value rather than
* on `0` keeps a pending notification — whose message may still arrive — from being spent before it
* does, and a new notification changes the value and returns early. Nothing here touches the
* counter, so it cannot drift.
*
* @param sharedBufferView - This worker's slice of the shared buffer.
* @param emptyReads - How many consecutive empty reads there have been.
* @param deadline - When the call's budget runs out, or `undefined` when it has none.
* @param remaining - Milliseconds left of that budget, or `undefined`.
* @param mainPort - The port the worker answers on, for the abort a passed deadline sends.
* @param expectedId - The id of the request this call is waiting for.
* @returns The new count of consecutive empty reads.
*/
const noteEmptyRead = (sharedBufferView, emptyReads, deadline, remaining, mainPort, expectedId) => {
	if (deadline != null && Date.now() >= deadline) {
		abortRequest(mainPort, expectedId);
		throw new Error("Internal error: Atomics.wait() failed: timed-out");
	}
	const reads = emptyReads + 1;
	if (reads % EMPTY_PORT_READS === 0) Atomics.wait(sharedBufferView, shared_cjs.NOTIFY_INDEX, Atomics.load(sharedBufferView, shared_cjs.NOTIFY_INDEX), Math.min(remaining ?? EMPTY_PORT_READ_SLICE, EMPTY_PORT_READ_SLICE));
	return reads;
};
const hasRequireFlag = (execArgv) => execArgv.some((execArg) => REQUIRE_FLAGS.has(execArg));
const hasImportFlag = (execArgv) => execArgv.includes(IMPORT_FLAG);
const hasLoaderFlag = (execArgv) => execArgv.some((execArg) => LOADER_FLAGS.has(execArg));
/**
* The PnP API's own path, or `undefined` when this process does not run under PnP.
*
* Both ends need it: `setupTsRunner` preloads the API ahead of the load guard, and
* `startWorkerThread` recognizes the PnP-plus-guard prefix a nested worker can forward. Resolving it
* once per call is cheap — the module cache answers — so it is shared rather than spelled twice.
*/
const resolvePnpApiPath = () => {
	/* istanbul ignore if -- https://github.com/facebook/jest/issues/5274 */
	if (!process.versions.pnp) return;
	try {
		/** @see https://github.com/facebook/jest/issues/9543 */
		return _pkgr_core.cjsRequire.resolve("pnpapi");
	} catch {
		return;
	}
};
const setupTsRunner = (workerPath, { execArgv = DEFAULT_EXEC_ARGV, tsRunner } = {}) => {
	let ext = node_path.default.extname(workerPath);
	if (!/([/\\])node_modules\1/.test(workerPath) && (!ext || /^\.[cm]?js$/.test(ext))) {
		const workPathWithoutExt = ext ? workerPath.slice(0, -ext.length) : workerPath;
		let extensions;
		switch (ext) {
			case ".cjs":
				extensions = [".cts", ".cjs"];
				break;
			case ".mjs":
				extensions = [".mts", ".mjs"];
				break;
			default: extensions = [".ts", ".js"];
		}
		const found = (0, _pkgr_core.tryExtensions)(workPathWithoutExt, extensions);
		let differentExt;
		if (found && (!ext || (differentExt = found !== workPathWithoutExt))) {
			workerPath = found;
			if (differentExt) ext = node_path.default.extname(workerPath);
		}
	}
	const isTs = /\.[cm]?ts$/.test(workerPath);
	let jsUseEsm = ext === ".mjs";
	let tsUseEsm = ext === ".mts";
	if (isTs) {
		if (!tsUseEsm && ext !== ".cts") {
			const pkg = (0, _pkgr_core.findUp)(workerPath);
			if (pkg) tsUseEsm = (0, _pkgr_core.cjsRequire)(pkg).type === "module";
		}
		const stripTypesIndex = execArgv.indexOf(STRIP_TYPES_FLAG);
		const transformTypesIndex = execArgv.indexOf(TRANSFORM_TYPES_FLAG);
		const noStripTypesIndex = execArgv.indexOf(NO_STRIP_TYPES_FLAG);
		const noStripTypes = noStripTypesIndex > stripTypesIndex || noStripTypesIndex > transformTypesIndex || stripTypesIndex === -1 && transformTypesIndex === -1 && NO_STRIP_TYPES;
		if (tsRunner == null) {
			if (process.versions.bun) tsRunner = TsRunner.Bun;
			else if (!noStripTypes && (0, shared_cjs.compareNodeVersion)("22.6") >= 0) tsRunner = TsRunner.Node;
			else if ((0, _pkgr_core.isPkgAvailable)(TsRunner.TsNode)) tsRunner = TsRunner.TsNode;
		}
		switch (tsRunner) {
			case TsRunner.Bun: break;
			case TsRunner.Node:
				if ((0, shared_cjs.compareNodeVersion)("22.6") < 0) throw new Error("type stripping is not supported in this node version");
				if (noStripTypes) throw new Error("type stripping is disabled explicitly");
				if ((0, shared_cjs.compareNodeVersion)("23.6") >= 0) break;
				if ((0, shared_cjs.compareNodeVersion)("22.7") >= 0 && !execArgv.includes("--experimental-transform-types")) execArgv = [TRANSFORM_TYPES_FLAG, ...execArgv];
				else if ((0, shared_cjs.compareNodeVersion)("22.6") >= 0 && !execArgv.includes("--experimental-strip-types")) execArgv = [STRIP_TYPES_FLAG, ...execArgv];
				break;
			case TsRunner.TsNode:
				if (tsUseEsm) {
					if (!execArgv.includes("--loader")) execArgv = [
						LOADER_FLAG,
						`${TsRunner.TsNode}/esm`,
						...execArgv
					];
				} else if (!hasRequireFlag(execArgv)) execArgv = [
					"-r",
					`${TsRunner.TsNode}/register`,
					...execArgv
				];
				break;
			case TsRunner.EsbuildRegister:
				if (tsUseEsm) {
					if (!hasLoaderFlag(execArgv)) execArgv = [
						LOADER_FLAG,
						`${TsRunner.EsbuildRegister}/loader`,
						...execArgv
					];
				} else if (!hasRequireFlag(execArgv)) execArgv = [
					"-r",
					TsRunner.EsbuildRegister,
					...execArgv
				];
				break;
			case TsRunner.EsbuildRunner:
				if (!hasRequireFlag(execArgv)) execArgv = [
					"-r",
					`${TsRunner.EsbuildRunner}/register`,
					...execArgv
				];
				break;
			case TsRunner.OXC:
				if (!execArgv.includes("--import")) execArgv = [
					IMPORT_FLAG,
					`@${TsRunner.OXC}-node/core/register`,
					...execArgv
				];
				break;
			case TsRunner.SWC:
				if (tsUseEsm) {
					if (IMPORT_FLAG_SUPPORTED) {
						if (!hasImportFlag(execArgv)) execArgv = [
							IMPORT_FLAG,
							`@${TsRunner.SWC}-node/register/esm-register`,
							...execArgv
						];
					} else if (!hasLoaderFlag(execArgv)) execArgv = [
						LOADER_FLAG,
						`@${TsRunner.SWC}-node/register/esm`,
						...execArgv
					];
				} else if (!hasRequireFlag(execArgv)) execArgv = [
					"-r",
					`@${TsRunner.SWC}-node/register`,
					...execArgv
				];
				break;
			case TsRunner.TSX:
				if (IMPORT_FLAG_SUPPORTED) {
					if (!execArgv.includes("--import")) execArgv = [
						IMPORT_FLAG,
						TsRunner.TSX,
						...execArgv
					];
				} else if (!execArgv.includes("--loader")) execArgv = [
					LOADER_FLAG,
					TsRunner.TSX,
					...execArgv
				];
				break;
			default: throw new Error(`Unknown ts runner: ${String(tsRunner)}`);
		}
	} else if (!jsUseEsm && ext !== ".cjs") {
		const pkg = (0, _pkgr_core.findUp)(workerPath);
		if (pkg) jsUseEsm = (0, _pkgr_core.cjsRequire)(pkg).type === "module";
	}
	const pnpApiPath = resolvePnpApiPath();
	let resolvedPnpLoaderPath;
	if (pnpApiPath !== void 0 && !(0, shared_cjs.getFlag)(REQUIRE_FLAGS, pnpApiPath) && !execArgv.includes(pnpApiPath)) {
		const pnpLoaderPath = node_path.default.resolve(pnpApiPath, "../.pnp.loader.mjs");
		if (isFile(pnpLoaderPath)) {
			const pnpLoaderUrl = (0, node_url.pathToFileURL)(pnpLoaderPath).href;
			const pnpLoaderRealPath = node_fs.default.realpathSync(pnpLoaderPath);
			if (!(0, shared_cjs.getFlagValues)(LOADER_FLAGS).some((value) => {
				if (value === pnpLoaderUrl) return true;
				try {
					const loaderPath = value.startsWith("file:") ? (0, node_url.fileURLToPath)(value) : node_path.default.resolve(value);
					return node_fs.default.realpathSync(loaderPath) === pnpLoaderRealPath;
				} catch {
					return false;
				}
			})) {
				resolvedPnpLoaderPath = pnpLoaderUrl;
				execArgv = [
					LOADER_FLAG,
					resolvedPnpLoaderPath,
					...execArgv
				];
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
		execArgv
	};
};
const md5Hash = (text) => (0, node_crypto.createHash)("md5").update(text).digest("hex");
const encodeImportModule = (moduleNameOrGlobalShim, type = "import") => {
	const { moduleName, globalName, named, conditional } = typeof moduleNameOrGlobalShim === "string" ? { moduleName: moduleNameOrGlobalShim } : moduleNameOrGlobalShim;
	const importStatement = type === "import" ? `import${globalName ? " " + (named === null ? "* as " + globalName : (named === null || named === void 0 ? void 0 : named.trim()) ? `{${named}}` : globalName) + " from" : ""} ${JSON.stringify(node_path.default.isAbsolute(moduleName) ? (0, node_url.pathToFileURL)(moduleName) : moduleName)}` : `${globalName ? "const " + ((named === null || named === void 0 ? void 0 : named.trim()) ? `{${named}}` : globalName) + "=" : ""}require(${JSON.stringify(moduleName)})`;
	if (!globalName) return importStatement;
	const overrideStatement = `globalThis.${globalName}=${(named === null || named === void 0 ? void 0 : named.trim()) ? named : globalName}`;
	return importStatement + (conditional === false ? `;${overrideStatement}` : `;if(!globalThis.${globalName})${overrideStatement}`);
};
/** @internal */
const _generateGlobals = (globalShims, type) => globalShims.reduce((acc, shim) => `${acc}${acc ? ";" : ""}${encodeImportModule(shim, type)}`, "");
const _dirname = typeof __dirname === "undefined" ? node_path.default.dirname((0, node_url.fileURLToPath)(require("url").pathToFileURL(__filename).href)) : /* istanbul ignore next */ __dirname;
/**
* Generates the global shim statements loaded before a worker module.
*
* A CommonJS worker can rebind `require` where the statements run, so they keep the bare module
* names and the caller wraps them. An ESM worker cannot: `import` resolves against the importing
* module, and the generated entry is a `data:` URL with no directory of its own, so each specifier
* is resolved against `workerPath` here and emitted as an absolute `file:`/`node:` URL. That is what
* makes a shim resolvable beside the worker — but not from the package's own `node_modules` — work,
* rather than a generated file under `node_modules/.synckit` deciding where it resolves.
*
* Yarn PnP resolves through a map rather than `node_modules`, so {@link resolveEsmImport} uses
* `pnpapi` there instead of the ponyfill; both answer from `workerPath`.
*
* @param workerPath - The absolute path of the worker module.
* @param globalShims - The shims to apply.
* @param type - Whether the caller loads them with `import` or `require`.
* @param execArgv - The argv the worker is started with, merged over this thread's for the ESM
*   conditions.
* @returns The statements, or an empty string when there are no shims.
*/
const generateGlobals = (workerPath, globalShims, type = "import", execArgv = []) => {
	if (globalShims.length === 0) return "";
	if (type === "require") return _generateGlobals(globalShims, "require");
	const conditions = esmConditions(execArgv);
	return _generateGlobals(globalShims.map((shim) => ({
		...shim,
		moduleName: resolveEsmImport(shim.moduleName, workerPath, conditions)
	})), "import");
};
/**
* Binds the `require` of generated CommonJS global shim statements to the worker's own path.
*
* A worker started with `eval: true` runs its entry as a top-level script, and `require` there is a
* property of the global object resolved from the process working directory, so a bare
* `require('<shim>')` reaches the wrong location. A shim which is resolvable beside the worker but
* not from there then fails with `MODULE_NOT_FOUND`.
*
* The statements are wrapped in a block which rebinds `require` itself to
* `createRequire(workerPath)`, so they resolve where the worker is while the entry's global
* `require` — which loads the worker module by absolute path afterwards, outside the block — is left
* untouched. The block-scoped `const` shadows that global, so its own initializer cannot name
* `require` directly: that is a temporal dead zone error, and reading it back through
* `globalThis.require` is the same binding the statements would otherwise call.
* `process.getBuiltinModule` is not an option, because it only exists from Node 20.16 and this
* package supports far older ones.
*
* It is a block-scoped `const` inside a block statement rather than a generated function or arrow
* literal, which code scanning reads as constructed code (`js/bad-code-sanitization`).
*
* The worker path is embedded with `JSON.stringify`, so quotes, backslashes and line terminators
* cannot break out of the literal.
*
* @param workerPath - The absolute path of the worker module.
* @param globals - The generated CommonJS shim statements, possibly empty.
*/
const requireGlobalsFromWorker = (workerPath, globals) => globals ? `{const require=globalThis.require('node:module').createRequire(${JSON.stringify(workerPath)});${globals}}` : globals;
/**
* Absolute path of the module preloaded into every worker to arm the load guard.
*
* `register.cjs` ships with the package, next to the package root: `lib/../register.cjs` in
* the built package, `src/../register.cjs` in this repository, so the one relative path covers
* a test run and a release alike.
*/
const workerPreload = node_path.default.resolve(_dirname, "../register.cjs");
/**
* Spawns a worker thread and returns a synchronous function to dispatch tasks.
*
* The function initializes a worker thread with the specified script and
* configuration, setting up a dedicated message channel for bidirectional
* communication. It applies TypeScript runner settings, execution arguments,
* and global shims as needed. The returned function sends tasks to the worker,
* waits synchronously for a response using shared memory synchronization, and
* then returns the computed result.
*
* @param workerPath - The file path of the worker script to execute.
* @param options - An object containing configuration parameters:
*
*   - Timeout: Maximum time in milliseconds to wait for the worker's response.
*   - ExecArgv: Array of Node.js execution arguments for the worker.
*   - TsRunner: Specifies the TypeScript runner to use if the worker script is
*       TypeScript.
*   - TransferList: List of additional transferable objects to pass to the worker.
*   - GlobalShims: Modules to import as global shims; if true, a default preset is
*       used.
*
* @returns A synchronous function that accepts task arguments intended for the
*   worker thread and returns its result.
* @throws {Error} If a TypeScript runner is required but not specified, or if
*   an unsupported TypeScript runner is used for the file type.
* @throws {Error} If internal synchronization fails or if the message
*   identifier does not match the expected value.
*/
function startWorkerThread(workerPath, { timeout = DEFAULT_TIMEOUT, execArgv = DEFAULT_EXEC_ARGV, tsRunner = DEFAULT_TS_RUNNER, transferList = [], globalShims = DEFAULT_GLOBAL_SHIMS } = {}) {
	const { port1: mainPort, port2: workerPort } = new node_worker_threads.MessageChannel();
	const forwardedPnpApiPath = resolvePnpApiPath();
	execArgv = forwardedPnpApiPath !== void 0 && execArgv[0] === "-r" && execArgv[1] === forwardedPnpApiPath ? execArgv.slice(2) : execArgv;
	execArgv = execArgv[0] === "-r" && execArgv[1] === workerPreload ? execArgv.slice(2) : execArgv;
	const { isTs, ext, jsUseEsm, tsUseEsm, tsRunner: finalTsRunner, workerPath: finalWorkerPath, pnpApiPath, pnpLoaderPath, execArgv: finalExecArgv } = setupTsRunner(workerPath, {
		execArgv,
		tsRunner
	});
	const workerPathUrl = (0, node_url.pathToFileURL)(finalWorkerPath);
	if (/\.[cm]ts$/.test(finalWorkerPath)) {
		const isTsxSupported = !tsUseEsm || TS_ESM_PARTIAL_SUPPORTED;
		/* istanbul ignore if */
		if (!finalTsRunner) throw new Error("No ts runner specified, ts worker path is not supported");
		else if ([
			TsRunner.EsbuildRegister,
			TsRunner.EsbuildRunner,
			...TS_ESM_PARTIAL_SUPPORTED ? [TsRunner.OXC, TsRunner.SWC] : [],
			...isTsxSupported ? [] : [TsRunner.TSX]
		].includes(finalTsRunner)) throw new Error(`${finalTsRunner} is not supported for ${ext} files yet` + (isTsxSupported ? ", you can try [tsx](https://github.com/esbuild-kit/tsx) instead" : MTS_SUPPORTED ? ", you can try [oxc](https://github.com/oxc-project/oxc-node) or [swc](https://github.com/swc-project/swc-node/tree/master/packages/register) instead" : ""));
	}
	const isCjsWorker = isTs ? !tsUseEsm : !jsUseEsm;
	const esmWorkerConditions = esmConditions(finalExecArgv);
	const finalGlobalShims = (globalShims === true ? DEFAULT_GLOBAL_SHIMS_PRESET : Array.isArray(globalShims) ? globalShims : []).filter(({ moduleName }) => isCjsWorker ? isPkgAvailableFrom(moduleName, finalWorkerPath) : isPkgImportableFrom(moduleName, finalWorkerPath, esmWorkerConditions));
	const sharedBufferView = (0, shared_cjs.createSharedBufferView)();
	const useGlobals = finalGlobalShims.length > 0;
	const useEval = isTs ? !tsUseEsm : !jsUseEsm && useGlobals;
	const workerEntry = jsUseEsm && useGlobals || tsUseEsm && finalTsRunner === TsRunner.TsNode ? dataUrl(`${generateGlobals(finalWorkerPath, finalGlobalShims, "import", finalExecArgv)};import ${JSON.stringify(String(workerPathUrl))}`) : useEval ? `${requireGlobalsFromWorker(finalWorkerPath, generateGlobals(finalWorkerPath, finalGlobalShims, "require"))};${encodeImportModule(finalWorkerPath, "require")}` : workerPathUrl;
	const workerOptions = {
		eval: useEval,
		workerData: {
			sharedBufferView,
			workerPort,
			pnpLoaderPath
		},
		transferList: [workerPort, ...transferList]
	};
	const guardLeads = REQUIRE_FLAGS.has(shared_cjs.NODE_OPTIONS[0]) && shared_cjs.NODE_OPTIONS[1] === workerPreload;
	const pnpThenGuardLeads = pnpApiPath !== void 0 && REQUIRE_FLAGS.has(shared_cjs.NODE_OPTIONS[0]) && shared_cjs.NODE_OPTIONS[1] === pnpApiPath && REQUIRE_FLAGS.has(shared_cjs.NODE_OPTIONS[2]) && shared_cjs.NODE_OPTIONS[3] === workerPreload;
	const inheritsGuard = guardLeads || pnpThenGuardLeads;
	const pnpPreload = pnpApiPath ? `-r ${JSON.stringify(pnpApiPath)} ` : "";
	const guardExecArgv = [
		...pnpApiPath ? ["-r", pnpApiPath] : [],
		"-r",
		workerPreload,
		...finalExecArgv
	];
	let worker;
	try {
		worker = new node_worker_threads.Worker(workerEntry, {
			...workerOptions,
			env: inheritsGuard ? void 0 : {
				...process.env,
				NODE_OPTIONS: `${pnpPreload}-r ${JSON.stringify(workerPreload)}${process.env.NODE_OPTIONS ? ` ${process.env.NODE_OPTIONS}` : ""}`
			},
			execArgv: inheritsGuard ? guardExecArgv : finalExecArgv
		});
	} catch (error) {
		if (error.code !== "ERR_WORKER_INVALID_EXEC_ARGV") throw error;
		process.emitWarning("synckit: this Node rejected the worker environment, so the failure guard loads after inherited `NODE_OPTIONS` preloads; a failure in one of those cannot be reported. Set `SYNCKIT_TIMEOUT` to bound the wait.", { code: FALLBACK_WARNING_CODE });
		worker = new node_worker_threads.Worker(workerEntry, {
			...workerOptions,
			execArgv: guardExecArgv
		});
	}
	let nextID = 0;
	let workerFailure;
	/**
	* Spends one pending notification, never taking the counter below zero.
	*
	* The check is not redundant: an unconditional decrement can take the counter negative, and a
	* negative counter makes every `Atomics.wait` return `'not-equal'` at once, so the caller spins
	* instead of sleeping and starves the worker until the deadline expires. Measured on Node 18.18
	* under the CI's load and timeout, restoring it took the `reliability` soak from three failures
	* in four runs to none in six.
	*/
	const spendNotification = () => {
		if (Atomics.load(sharedBufferView, shared_cjs.NOTIFY_INDEX) > 0) Atomics.sub(sharedBufferView, shared_cjs.NOTIFY_INDEX, 1);
	};
	/**
	* Waits once for a notification and returns the message it announced, if any. A failure the
	* preload reported is thrown from here.
	*
	* The notification is spent only once its message is in hand. Spending it first would let a
	* notification whose message is not readable yet be spent on nothing: the next wait, seeing a zero
	* counter, would sleep past a message that never notifies again — measured with a real
	* `Atomics.wait`, where the call failed at its deadline although the response was queued.
	*
	* @param abortId - The request to abort when the wait itself fails.
	* @param remaining - Milliseconds left of the call's budget.
	*/
	const waitForMessage = (abortId, remaining) => {
		const status = Atomics.wait(sharedBufferView, shared_cjs.NOTIFY_INDEX, 0, remaining);
		if (!["ok", "not-equal"].includes(status)) {
			abortRequest(mainPort, abortId);
			throw new Error("Internal error: Atomics.wait() failed: " + status);
		}
		const result = (0, node_worker_threads.receiveMessageOnPort)(mainPort);
		const msg = result === null || result === void 0 ? void 0 : result.message;
		if (!msg) return;
		spendNotification();
		if ("workerFailure" in msg) {
			if (msg.fatal) workerFailure = msg;
			throw withProperties(msg.error, msg.properties);
		}
		return msg;
	};
	const receiveMessageWithId = (expectedId, waitingTimeout) => {
		const deadline = waitingTimeout == null ? void 0 : Date.now() + waitingTimeout;
		let remaining = waitingTimeout == null ? void 0 : Math.max(0, waitingTimeout);
		let emptyReads = 0;
		for (;;) {
			const msg = waitForMessage(expectedId, remaining);
			if (msg == null || msg.id < expectedId) {
				if (msg == null) emptyReads = noteEmptyRead(sharedBufferView, emptyReads, deadline, remaining, mainPort, expectedId);
				remaining = deadline == null ? void 0 : Math.max(0, deadline - Date.now());
				continue;
			}
			if (expectedId !== msg.id) throw new Error(`Internal error: Expected id ${expectedId} but got id ${msg.id}`);
			return msg;
		}
	};
	const syncFn = (...args) => {
		if (workerFailure) throw withProperties(workerFailure.error, workerFailure.properties);
		const id = nextID++;
		const msg = {
			id,
			args
		};
		worker.postMessage(msg);
		const message = receiveMessageWithId(id, timeout);
		for (const { type, chunk, encoding } of message.stdio) process[type].write(chunk, encoding);
		if ("error" in message) throw withProperties(message.error, message.properties);
		return message.result;
	};
	worker.unref();
	return syncFn;
}
const overrideStdio = (stdio) => {
	for (const type of ["stdout", "stderr"]) process[type]._writev = (chunks, callback) => {
		for (const { chunk, encoding } of chunks) stdio.push({
			type,
			chunk,
			encoding
		});
		callback();
	};
};
//#endregion
//#region src/index.ts
let syncFnCache;
/**
* Creates a synchronous worker function.
*
* Converts the provided worker path (URL or string) to an absolute file path,
* retrieves a cached synchronous function if one exists, or starts a new worker
* thread to handle task execution. The resulting function is cached to avoid
* redundant initialization.
*
* @param workerPath - The absolute file path or URL of the worker script. If
*   given as a URL, it is converted to a file path.
* @param timeoutOrOptions - Optional timeout in milliseconds or an options
*   object to configure the worker thread.
* @returns A synchronous function that executes tasks on the specified worker
*   thread.
* @throws {Error} If the resulting worker path is not absolute.
*/
function createSyncFn(workerPath, timeoutOrOptions) {
	syncFnCache ?? (syncFnCache = /* @__PURE__ */ new Map());
	if (typeof workerPath !== "string" || workerPath.startsWith("file://")) workerPath = (0, node_url.fileURLToPath)(workerPath);
	const cachedSyncFn = syncFnCache.get(workerPath);
	if (cachedSyncFn) return cachedSyncFn;
	if (!node_path.default.isAbsolute(workerPath)) throw new Error("`workerPath` must be absolute");
	const syncFn = startWorkerThread(
		workerPath,
		/* istanbul ignore next */
		typeof timeoutOrOptions === "number" ? { timeout: timeoutOrOptions } : timeoutOrOptions
	);
	syncFnCache.set(workerPath, syncFn);
	return syncFn;
}
/* istanbul ignore next */
/**
* Configures the worker thread to listen for messages from the parent process
* and execute a provided function.
*
* If the worker is not initialized with the required data, the function exits
* without further action. Otherwise, it optionally registers a custom module
* loader when a valid loader path is provided and captures output generated
* during execution. It listens for messages containing an identifier and
* arguments, then invokes the supplied function asynchronously with those
* arguments. If an abort command is received for the same message, the response
* is suppressed. Upon completing execution, it posts a message back with either
* the result or error details, including extracted error properties.
*
* @param fn - The function to execute when a message is received.
*/
function runAsWorker(fn) {
	if (!node_worker_threads.workerData) return;
	const stdio = [];
	overrideStdio(stdio);
	const { workerPort, sharedBufferView } = node_worker_threads.workerData;
	(0, register_cjs.markWorkerRegistered)(sharedBufferView);
	node_worker_threads.parentPort.on("message", ({ id, args }) => {
		(async () => {
			let isAborted = false;
			const handleAbortMessage = (msg) => {
				if (msg.id === id && msg.cmd === "abort") isAborted = true;
			};
			workerPort.on("message", handleAbortMessage);
			let msg;
			try {
				msg = {
					id,
					stdio,
					result: await fn(...args)
				};
			} catch (error) {
				msg = {
					id,
					stdio,
					error,
					properties: (0, shared_cjs.extractProperties)(error)
				};
			}
			workerPort.off("message", handleAbortMessage);
			if (isAborted) {
				stdio.length = 0;
				return;
			}
			try {
				workerPort.postMessage(msg);
				Atomics.add(sharedBufferView, shared_cjs.NOTIFY_INDEX, 1);
				Atomics.notify(sharedBufferView, shared_cjs.NOTIFY_INDEX);
			} finally {
				stdio.length = 0;
			}
		})();
	});
}
//#endregion
exports.DEFAULT_EXEC_ARGV = DEFAULT_EXEC_ARGV;
exports.DEFAULT_GLOBAL_SHIMS = DEFAULT_GLOBAL_SHIMS;
exports.DEFAULT_GLOBAL_SHIMS_PRESET = DEFAULT_GLOBAL_SHIMS_PRESET;
exports.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
exports.DEFAULT_TS_RUNNER = DEFAULT_TS_RUNNER;
exports.DEFAULT_TYPES_NODE_VERSION = DEFAULT_TYPES_NODE_VERSION;
exports.EXPERIMENTAL_LOADER_FLAG = EXPERIMENTAL_LOADER_FLAG;
exports.FEATURE_TYPESCRIPT_NODE_VERSION = FEATURE_TYPESCRIPT_NODE_VERSION;
exports.IMPORT_FLAG = IMPORT_FLAG;
exports.IMPORT_FLAG_SUPPORTED = IMPORT_FLAG_SUPPORTED;
exports.LOADER_FLAG = LOADER_FLAG;
exports.LOADER_FLAGS = LOADER_FLAGS;
exports.MODULE_REGISTER_SUPPORTED = MODULE_REGISTER_SUPPORTED;
exports.MTS_SUPPORTED = MTS_SUPPORTED;
Object.defineProperty(exports, "NODE_OPTIONS", {
	enumerable: true,
	get: function() {
		return shared_cjs.NODE_OPTIONS;
	}
});
Object.defineProperty(exports, "NODE_VERSION", {
	enumerable: true,
	get: function() {
		return shared_cjs.NODE_VERSION;
	}
});
exports.NO_STRIP_TYPES = NO_STRIP_TYPES;
exports.NO_STRIP_TYPES_FLAG = NO_STRIP_TYPES_FLAG;
exports.REQUIRE_ABBR_FLAG = REQUIRE_ABBR_FLAG;
exports.REQUIRE_FLAG = REQUIRE_FLAG;
exports.REQUIRE_FLAGS = REQUIRE_FLAGS;
exports.STRIP_TYPES_FLAG = STRIP_TYPES_FLAG;
exports.STRIP_TYPES_NODE_VERSION = STRIP_TYPES_NODE_VERSION;
exports.TRANSFORM_TYPES_FLAG = TRANSFORM_TYPES_FLAG;
exports.TRANSFORM_TYPES_NODE_VERSION = TRANSFORM_TYPES_NODE_VERSION;
exports.TS_ESM_PARTIAL_SUPPORTED = TS_ESM_PARTIAL_SUPPORTED;
exports.TsRunner = TsRunner;
exports._generateGlobals = _generateGlobals;
Object.defineProperty(exports, "compareNodeVersion", {
	enumerable: true,
	get: function() {
		return shared_cjs.compareNodeVersion;
	}
});
Object.defineProperty(exports, "compareVersion", {
	enumerable: true,
	get: function() {
		return shared_cjs.compareVersion;
	}
});
exports.createSyncFn = createSyncFn;
exports.dataUrl = dataUrl;
exports.encodeImportModule = encodeImportModule;
Object.defineProperty(exports, "extractProperties", {
	enumerable: true,
	get: function() {
		return shared_cjs.extractProperties;
	}
});
exports.generateGlobals = generateGlobals;
exports.hasFlag = hasFlag;
exports.hasImportFlag = hasImportFlag;
exports.hasLoaderFlag = hasLoaderFlag;
exports.hasRequireFlag = hasRequireFlag;
exports.isFile = isFile;
exports.md5Hash = md5Hash;
exports.overrideStdio = overrideStdio;
Object.defineProperty(exports, "parseVersion", {
	enumerable: true,
	get: function() {
		return shared_cjs.parseVersion;
	}
});
exports.runAsWorker = runAsWorker;
exports.setupTsRunner = setupTsRunner;
exports.startWorkerThread = startWorkerThread;
