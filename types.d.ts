declare module 'metro-cache' {
  export class FileStore {
    constructor(options: {root: string});
    get(hash: Buffer): Promise<Buffer | null>;
    set(hash: Buffer, value: Buffer): Promise<void>;
  }
  export function stableHash(obj: any): string;
}
