import { MessagePort, Transferable } from "node:worker_threads";
import { NODE_OPTIONS, NODE_VERSION, compareNodeVersion, compareVersion, extractProperties, parseVersion } from "../shared.cjs";
//#region src/constants.d.ts
export declare const TsRunner: {
  readonly Node: "node";
  readonly Bun: "bun";
  readonly TsNode: "ts-node";
  readonly EsbuildRegister: "esbuild-register";
  readonly EsbuildRunner: "esbuild-runner";
  readonly OXC: "oxc";
  readonly SWC: "swc";
  readonly TSX: "tsx";
};
export type TsRunner = ValueOf<typeof TsRunner>;
export declare const TS_ESM_PARTIAL_SUPPORTED: boolean;
export declare const MTS_SUPPORTED: boolean;
export declare const MODULE_REGISTER_SUPPORTED: boolean;
export declare const STRIP_TYPES_NODE_VERSION = "22.6";
export declare const TRANSFORM_TYPES_NODE_VERSION = "22.7";
export declare const FEATURE_TYPESCRIPT_NODE_VERSION = "22.10";
export declare const DEFAULT_TYPES_NODE_VERSION = "23.6";
export declare const STRIP_TYPES_FLAG = "--experimental-strip-types";
export declare const TRANSFORM_TYPES_FLAG = "--experimental-transform-types";
export declare const NO_STRIP_TYPES_FLAG = "--no-experimental-strip-types";
export declare const NO_STRIP_TYPES: boolean;
export declare const DEFAULT_TIMEOUT: number | undefined;
export declare const DEFAULT_EXEC_ARGV: string[];
export declare const DEFAULT_TS_RUNNER: TsRunner | undefined;
export declare const DEFAULT_GLOBAL_SHIMS: boolean;
export declare const DEFAULT_GLOBAL_SHIMS_PRESET: GlobalShim[];
export declare const IMPORT_FLAG = "--import";
export declare const REQUIRE_FLAG = "--require";
export declare const REQUIRE_ABBR_FLAG = "-r";
export declare const REQUIRE_FLAGS: Set<string>;
export declare const LOADER_FLAG = "--loader";
export declare const EXPERIMENTAL_LOADER_FLAG = "--experimental-loader";
export declare const LOADER_FLAGS: Set<string>;
export declare const IMPORT_FLAG_SUPPORTED: boolean;
//#endregion
//#region src/types.d.ts
export type AnyFn<R = any, T extends any[] = any[]> = (...args: T) => R;
export type Syncify<T extends AnyFn> = (...args: Parameters<T>) => Awaited<ReturnType<T>>;
export type ValueOf<T> = T[keyof T];
export interface MainToWorkerMessage<T extends unknown[]> {
  id: number;
  args: T;
}
export interface MainToWorkerCommandMessage {
  id: number;
  cmd: string;
}
export interface WorkerData {
  sharedBufferView: Int32Array;
  workerPort: MessagePort;
  pnpLoaderPath: string | undefined;
}
export type DataMessage<T> = {
  error: unknown;
  properties?: object;
} | {
  result: T;
};
export interface StdioChunk {
  type: 'stderr' | 'stdout';
  chunk: Uint8Array | string;
  encoding: BufferEncoding;
}
export type WorkerToMainMessage<T> = DataMessage<T> & {
  id: number;
  stdio: StdioChunk[];
};
export interface WorkerFailureMessage {
  workerFailure: true;
  fatal: boolean;
  error: unknown;
  properties?: object;
}
export interface GlobalShim {
  moduleName: string;
  globalName?: string;
  named?: string | null;
  conditional?: boolean;
}
export interface PackageJson {
  type?: 'commonjs' | 'module';
}
export interface SynckitOptions {
  execArgv?: string[];
  globalShims?: GlobalShim[] | boolean;
  timeout?: number;
  transferList?: Transferable[];
  tsRunner?: TsRunner;
}
//#endregion
//#region src/common.d.ts
export declare const hasFlag: (flag: string) => boolean;
//#endregion
//#region src/helpers.d.ts
export declare const isFile: (path: string) => boolean;
export declare const dataUrl: (code: string) => import("url").URL;
export declare const hasRequireFlag: (execArgv: string[]) => boolean;
export declare const hasImportFlag: (execArgv: string[]) => boolean;
export declare const hasLoaderFlag: (execArgv: string[]) => boolean;
export declare const setupTsRunner: (workerPath: string, { execArgv, tsRunner }?: {
  execArgv?: string[];
  tsRunner?: TsRunner;
}) => {
  ext: string;
  isTs: boolean;
  jsUseEsm: boolean;
  tsRunner: TsRunner | undefined;
  tsUseEsm: boolean;
  workerPath: string;
  pnpApiPath: string | undefined;
  pnpLoaderPath: string | undefined;
  execArgv: string[];
};
export declare const md5Hash: (text: string) => string;
export declare const encodeImportModule: (moduleNameOrGlobalShim: GlobalShim | string, type?: "import" | "require") => string;
export declare const generateGlobals: (workerPath: string, globalShims: GlobalShim[], type?: "import" | "require", execArgv?: string[]) => string;
export declare function startWorkerThread<T extends AnyFn, R = Awaited<ReturnType<T>>>(workerPath: string, { timeout, execArgv, tsRunner, transferList, globalShims }?: SynckitOptions): (...args: Parameters<T>) => R;
export declare const overrideStdio: (stdio: StdioChunk[]) => void;
//#endregion
//#region src/index.d.ts
export declare function createSyncFn<T extends AnyFn>(workerPath: URL | string, timeoutOrOptions?: SynckitOptions | number): Syncify<T>;
export declare function runAsWorker<T extends AnyFn<Promise<R> | R>, R = ReturnType<T>>(fn: T): void;
//#endregion
export { NODE_OPTIONS, NODE_VERSION, compareNodeVersion, compareVersion, extractProperties, parseVersion };