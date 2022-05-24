import debug, {Debugger} from 'debug';

export const DEBUG_ROOT = mixin(debug('jake.tl'));

const DEBUG_EDITOR = mixin(DEBUG_ROOT.extend('editor'));
export const DEBUG_EDITOR_WORKER = mixin(DEBUG_EDITOR.extend('worker'));
export const DEBUG_EDITOR_RENDER = mixin(DEBUG_EDITOR.extend('render'));

debug.enable(`${DEBUG_ROOT.namespace}:*`);

export function helpers(dbg: Debugger) {
  return {
    tap: <T>(fmt: string, val: T): T => tap(dbg, fmt, val),

    wrap: <In extends unknown[], Out>(fmt: string, f: (...args: In) => Out) =>
      wrap(dbg, fmt, f),
  };
}

export function wrap<In extends unknown[], Out>(
  dbg: Debugger,
  fmt: string,
  fn: (...args: In) => Out
): (...args: In) => Out {
  return (...args) => {
    const res = fn(...args);
    dbg(fmt || fn.name, ...args, '->', res);
    return res;
  };
}

export function tap<T>(dbg: Debugger, fmt: string, val: T): T {
  dbg(fmt, val);
  return val;
}

export function mixin(dbg: Debugger): Debugger & ReturnType<typeof helpers> {
  Object.assign(dbg, helpers(dbg));
  return dbg as any;
}
