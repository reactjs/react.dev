/** Used for type-level retrieval */
const ResponseTypeSymbol = Symbol('Response Type');

type ServerMessageMap<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => infer Result
    ? {
        type: 'call';
        seq: string;
        prop: K;
        args: Args;
        [ResponseTypeSymbol]: Result;
      }
    : {
        type: 'get';
        seq: string;
        prop: K;
        args?: [];
        [ResponseTypeSymbol]: T[K];
      };
};

interface ReadyMessage {
  type: 'ready';
}

interface SuccessResponse<T> {
  type: 'ok';
  seq: string;
  ok: true;
  value: T;
}

interface ErrorResponse<E = unknown> {
  type: 'error';
  seq: string;
  ok: false;
  error: E;
}

/**
 * Something you can listen to.
 */
interface ListenablePort {
  addEventListener(
    event: 'message',
    handler: (event: MessageEvent) => void
  ): void;
  removeEventListener(
    event: 'message',
    handler: (event: MessageEvent) => void
  ): void;
}

/**
 * Something you could write to.
 */
interface WritablePort {
  postMessage(message: unknown): void;
}

type MessageType<T> = ServerMessageMap<T>[keyof ServerMessageMap<T>];
type CallOf<T> = Extract<MessageType<T>, {type: 'call'}>['prop'];
type GetOf<T> = Extract<MessageType<T>, {type: 'get'}>['prop'];

/**
 * RPC over channel-like interface.
 * `Interface` describes the methods this client can call on the server.
 *
 * Makes request from a `ChannelServer` over a `postMessage`, and listens
 * via `addEventListener` for `message` events.
 */
export class ChannelClient<Interface> {
  static create<Interface>(args: {
    listenPort: ListenablePort;
    requestPort: WritablePort;
    waitForReady: boolean;
  }): [ChannelClient<Interface>, () => void] {
    const client = new ChannelClient<Interface>(
      args.requestPort,
      args.waitForReady
    );
    args.listenPort.addEventListener('message', client.onMessage);
    return [
      client,
      () => args.listenPort.removeEventListener('message', client.onMessage),
    ];
  }

  constructor(private requestPort: WritablePort, waitForReady = true) {
    this.ready = !waitForReady;
  }

  private pending = new Map<
    string,
    {resolve: (value: any) => void; reject: (reason: any) => void}
  >();
  private seq = 0;
  private ready = false;
  private buffer: Array<MessageType<Interface>> = [];

  public async get<K extends GetOf<Interface>>(
    key: K
  ): Promise<ServerMessageMap<Interface>[K][typeof ResponseTypeSymbol]> {
    return this.request({
      type: 'get',
      seq: String(this.seq++),
      prop: key,
    } as any);
  }

  /**
   * Call method named `key` on the server.
   */
  public async call<K extends CallOf<Interface>>(
    key: K,
    ...args: NonNullable<ServerMessageMap<Interface>[K]['args']>
  ): Promise<ServerMessageMap<Interface>[K][typeof ResponseTypeSymbol]> {
    return this.request({
      type: 'call',
      seq: String(this.seq++),
      prop: key,
      args,
    } as any);
  }

  private request<K extends keyof Interface>(
    request: ServerMessageMap<Interface>[K]
  ): Promise<ServerMessageMap<Interface>[K][typeof ResponseTypeSymbol]> {
    return new Promise((resolve, reject) => {
      this.pending.set(request.seq, {resolve, reject});
      if (this.ready) {
        this.requestPort.postMessage(request);
      } else {
        this.buffer.push(request);
      }
    });
  }

  onMessage = (
    event: MessageEvent<SuccessResponse<unknown> | ErrorResponse | ReadyMessage>
  ) => {
    const data = event.data;
    if (data.type === 'ok') {
      this.pending.get(data.seq)?.resolve(data.value);
      this.pending.delete(data.seq);
    } else if (data.type === 'error') {
      this.pending.get(data.seq)?.reject(data.error);
      this.pending.delete(data.seq);
    } else if (data.type === 'ready') {
      this.ready = true;
      this.buffer.forEach((request) => this.requestPort.postMessage(request));
      this.buffer = [];
    }
  };
}

/**
 * RPC server over channel-like interface.
 *
 * Listens for requests using `addEventListener` for `message` events.
 * Responds by posting messages back to the client.
 */
export class ChannelServer<Interface> {
  private impl: Interface;
  private responsePort: WritablePort;

  static create<Interface>(args: {
    expose: Interface;
    listenPort: ListenablePort;
    responsePort: WritablePort;
  }) {
    const client = new ChannelServer(args);
    args.listenPort.addEventListener('message', client.onMessage);
    client.sendReady();
    return [
      client,
      () => args.listenPort.removeEventListener('message', client.onMessage),
    ];
  }

  constructor(args: {expose: Interface; responsePort: WritablePort}) {
    this.impl = args.expose;
    this.responsePort = args.responsePort;
  }

  private respond<K extends keyof Interface>(
    request: ServerMessageMap<Interface>[K],
    response:
      | {
          ok: true;
          value: ServerMessageMap<Interface>[K][typeof ResponseTypeSymbol];
        }
      | {ok: false; error: unknown}
  ) {
    if (response.ok) {
      const fullResponse: SuccessResponse<
        ServerMessageMap<Interface>[K][typeof ResponseTypeSymbol]
      > = {
        ...response,
        seq: request.seq,
        type: 'ok',
      };
      this.responsePort.postMessage(fullResponse);
    } else {
      const fullResponse: ErrorResponse = {
        ...response,
        seq: request.seq,
        type: 'error',
      };
      this.responsePort.postMessage(fullResponse);
    }
  }

  sendReady() {
    const ready: ReadyMessage = {
      type: 'ready',
    };
    this.responsePort.postMessage(ready);
  }

  onMessage = async (event: MessageEvent<MessageType<Interface>>) => {
    const data = event.data;
    try {
      if (data.type === 'call') {
        const result = await Promise.resolve(
          (this.impl as any)[data.prop](...data.args)
        );
        this.respond(data, {ok: true, value: result});
      } else if (data.type === 'get') {
        this.respond(data, {
          ok: true,
          value: await Promise.resolve(this.impl[data.prop]),
        });
      }
    } catch (error) {
      this.respond(data, {ok: false, error});
    }
  };
}
