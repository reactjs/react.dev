import type { MessagePort, Transferable } from 'node:worker_threads';
import type { TsRunner } from './constants.ts';
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
