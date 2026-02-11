// Minimal webpack shim for RSDW compatibility.
// Works in both browser (window) and worker (self) contexts via globalThis.

var moduleCache = {};

globalThis.__webpack_module_cache__ = moduleCache;

globalThis.__webpack_require__ = function (moduleId) {
  var cached = moduleCache[moduleId];
  if (cached) return cached.exports !== undefined ? cached.exports : cached;
  throw new Error('Module "' + moduleId + '" not found in webpack shim cache');
};

globalThis.__webpack_chunk_load__ = function () {
  return Promise.resolve();
};

globalThis.__webpack_require__.u = function (chunkId) {
  return chunkId;
};

globalThis.__webpack_get_script_filename__ = function (chunkId) {
  return chunkId;
};

('use strict');
(() => {
  var H = (e, t) => () => (t || e((t = {exports: {}}).exports, t), t.exports);
  var G1 = H((Ke) => {
    'use strict';
    var ro = {H: null, A: null};
    function ci(e) {
      var t = 'https://react.dev/errors/' + e;
      if (1 < arguments.length) {
        t += '?args[]=' + encodeURIComponent(arguments[1]);
        for (var n = 2; n < arguments.length; n++)
          t += '&args[]=' + encodeURIComponent(arguments[n]);
      }
      return (
        'Minified React error #' +
        e +
        '; visit ' +
        t +
        ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
      );
    }
    var U1 = Array.isArray,
      ui = Symbol.for('react.transitional.element'),
      Od = Symbol.for('react.portal'),
      Md = Symbol.for('react.fragment'),
      Ld = Symbol.for('react.strict_mode'),
      Fd = Symbol.for('react.profiler'),
      $d = Symbol.for('react.forward_ref'),
      Bd = Symbol.for('react.suspense'),
      jd = Symbol.for('react.memo'),
      X1 = Symbol.for('react.lazy'),
      W1 = Symbol.iterator;
    function Kd(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (W1 && e[W1]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var Y1 = Object.prototype.hasOwnProperty,
      qd = Object.assign;
    function pi(e, t, n, o, r, s) {
      return (
        (n = s.ref),
        {$$typeof: ui, type: e, key: t, ref: n !== void 0 ? n : null, props: s}
      );
    }
    function Hd(e, t) {
      return pi(e.type, t, void 0, void 0, void 0, e.props);
    }
    function di(e) {
      return typeof e == 'object' && e !== null && e.$$typeof === ui;
    }
    function Ud(e) {
      var t = {'=': '=0', ':': '=2'};
      return (
        '$' +
        e.replace(/[=:]/g, function (n) {
          return t[n];
        })
      );
    }
    var V1 = /\/+/g;
    function ai(e, t) {
      return typeof e == 'object' && e !== null && e.key != null
        ? Ud('' + e.key)
        : t.toString(36);
    }
    function z1() {}
    function Wd(e) {
      switch (e.status) {
        case 'fulfilled':
          return e.value;
        case 'rejected':
          throw e.reason;
        default:
          switch (
            (typeof e.status == 'string'
              ? e.then(z1, z1)
              : ((e.status = 'pending'),
                e.then(
                  function (t) {
                    e.status === 'pending' &&
                      ((e.status = 'fulfilled'), (e.value = t));
                  },
                  function (t) {
                    e.status === 'pending' &&
                      ((e.status = 'rejected'), (e.reason = t));
                  }
                )),
            e.status)
          ) {
            case 'fulfilled':
              return e.value;
            case 'rejected':
              throw e.reason;
          }
      }
      throw e;
    }
    function oo(e, t, n, o, r) {
      var s = typeof e;
      (s === 'undefined' || s === 'boolean') && (e = null);
      var i = !1;
      if (e === null) i = !0;
      else
        switch (s) {
          case 'bigint':
          case 'string':
          case 'number':
            i = !0;
            break;
          case 'object':
            switch (e.$$typeof) {
              case ui:
              case Od:
                i = !0;
                break;
              case X1:
                return (i = e._init), oo(i(e._payload), t, n, o, r);
            }
        }
      if (i)
        return (
          (r = r(e)),
          (i = o === '' ? '.' + ai(e, 0) : o),
          U1(r)
            ? ((n = ''),
              i != null && (n = i.replace(V1, '$&/') + '/'),
              oo(r, t, n, '', function (h) {
                return h;
              }))
            : r != null &&
              (di(r) &&
                (r = Hd(
                  r,
                  n +
                    (r.key == null || (e && e.key === r.key)
                      ? ''
                      : ('' + r.key).replace(V1, '$&/') + '/') +
                    i
                )),
              t.push(r)),
          1
        );
      i = 0;
      var a = o === '' ? '.' : o + ':';
      if (U1(e))
        for (var u = 0; u < e.length; u++)
          (o = e[u]), (s = a + ai(o, u)), (i += oo(o, t, n, s, r));
      else if (((u = Kd(e)), typeof u == 'function'))
        for (e = u.call(e), u = 0; !(o = e.next()).done; )
          (o = o.value), (s = a + ai(o, u++)), (i += oo(o, t, n, s, r));
      else if (s === 'object') {
        if (typeof e.then == 'function') return oo(Wd(e), t, n, o, r);
        throw (
          ((t = String(e)),
          Error(
            ci(
              31,
              t === '[object Object]'
                ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                : t
            )
          ))
        );
      }
      return i;
    }
    function ur(e, t, n) {
      if (e == null) return e;
      var o = [],
        r = 0;
      return (
        oo(e, o, '', '', function (s) {
          return t.call(n, s, r++);
        }),
        o
      );
    }
    function Vd(e) {
      if (e._status === -1) {
        var t = e._result;
        (t = t()),
          t.then(
            function (n) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 1), (e._result = n));
            },
            function (n) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 2), (e._result = n));
            }
          ),
          e._status === -1 && ((e._status = 0), (e._result = t));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    function zd() {
      return new WeakMap();
    }
    function li() {
      return {s: 0, v: void 0, o: null, p: null};
    }
    Ke.Children = {
      map: ur,
      forEach: function (e, t, n) {
        ur(
          e,
          function () {
            t.apply(this, arguments);
          },
          n
        );
      },
      count: function (e) {
        var t = 0;
        return (
          ur(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          ur(e, function (t) {
            return t;
          }) || []
        );
      },
      only: function (e) {
        if (!di(e)) throw Error(ci(143));
        return e;
      },
    };
    Ke.Fragment = Md;
    Ke.Profiler = Fd;
    Ke.StrictMode = Ld;
    Ke.Suspense = Bd;
    Ke.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ro;
    Ke.cache = function (e) {
      return function () {
        var t = ro.A;
        if (!t) return e.apply(null, arguments);
        var n = t.getCacheForType(zd);
        (t = n.get(e)), t === void 0 && ((t = li()), n.set(e, t)), (n = 0);
        for (var o = arguments.length; n < o; n++) {
          var r = arguments[n];
          if (typeof r == 'function' || (typeof r == 'object' && r !== null)) {
            var s = t.o;
            s === null && (t.o = s = new WeakMap()),
              (t = s.get(r)),
              t === void 0 && ((t = li()), s.set(r, t));
          } else
            (s = t.p),
              s === null && (t.p = s = new Map()),
              (t = s.get(r)),
              t === void 0 && ((t = li()), s.set(r, t));
        }
        if (t.s === 1) return t.v;
        if (t.s === 2) throw t.v;
        try {
          var i = e.apply(null, arguments);
          return (n = t), (n.s = 1), (n.v = i);
        } catch (a) {
          throw ((i = t), (i.s = 2), (i.v = a), a);
        }
      };
    };
    Ke.cloneElement = function (e, t, n) {
      if (e == null) throw Error(ci(267, e));
      var o = qd({}, e.props),
        r = e.key,
        s = void 0;
      if (t != null)
        for (i in (t.ref !== void 0 && (s = void 0),
        t.key !== void 0 && (r = '' + t.key),
        t))
          !Y1.call(t, i) ||
            i === 'key' ||
            i === '__self' ||
            i === '__source' ||
            (i === 'ref' && t.ref === void 0) ||
            (o[i] = t[i]);
      var i = arguments.length - 2;
      if (i === 1) o.children = n;
      else if (1 < i) {
        for (var a = Array(i), u = 0; u < i; u++) a[u] = arguments[u + 2];
        o.children = a;
      }
      return pi(e.type, r, void 0, void 0, s, o);
    };
    Ke.createElement = function (e, t, n) {
      var o,
        r = {},
        s = null;
      if (t != null)
        for (o in (t.key !== void 0 && (s = '' + t.key), t))
          Y1.call(t, o) &&
            o !== 'key' &&
            o !== '__self' &&
            o !== '__source' &&
            (r[o] = t[o]);
      var i = arguments.length - 2;
      if (i === 1) r.children = n;
      else if (1 < i) {
        for (var a = Array(i), u = 0; u < i; u++) a[u] = arguments[u + 2];
        r.children = a;
      }
      if (e && e.defaultProps)
        for (o in ((i = e.defaultProps), i)) r[o] === void 0 && (r[o] = i[o]);
      return pi(e, s, void 0, void 0, null, r);
    };
    Ke.createRef = function () {
      return {current: null};
    };
    Ke.forwardRef = function (e) {
      return {$$typeof: $d, render: e};
    };
    Ke.isValidElement = di;
    Ke.lazy = function (e) {
      return {$$typeof: X1, _payload: {_status: -1, _result: e}, _init: Vd};
    };
    Ke.memo = function (e, t) {
      return {$$typeof: jd, type: e, compare: t === void 0 ? null : t};
    };
    Ke.use = function (e) {
      return ro.H.use(e);
    };
    Ke.useCallback = function (e, t) {
      return ro.H.useCallback(e, t);
    };
    Ke.useDebugValue = function () {};
    Ke.useId = function () {
      return ro.H.useId();
    };
    Ke.useMemo = function (e, t) {
      return ro.H.useMemo(e, t);
    };
    Ke.version = '19.0.0';
  });
  var Eo = H((sx, J1) => {
    'use strict';
    J1.exports = G1();
  });
  var Z1 = H((Ao) => {
    'use strict';
    var Xd = Eo(),
      Yd = Symbol.for('react.transitional.element'),
      Gd = Symbol.for('react.fragment');
    if (!Xd.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function Q1(e, t, n) {
      var o = null;
      if (
        (n !== void 0 && (o = '' + n),
        t.key !== void 0 && (o = '' + t.key),
        'key' in t)
      ) {
        n = {};
        for (var r in t) r !== 'key' && (n[r] = t[r]);
      } else n = t;
      return (
        (t = n.ref),
        {$$typeof: Yd, type: e, key: o, ref: t !== void 0 ? t : null, props: n}
      );
    }
    Ao.Fragment = Gd;
    Ao.jsx = Q1;
    Ao.jsxDEV = void 0;
    Ao.jsxs = Q1;
  });
  var tl = H((ax, el) => {
    'use strict';
    el.exports = Z1();
  });
  var nl = H((rn) => {
    'use strict';
    var Jd = Eo();
    function vn() {}
    var Xt = {
      d: {
        f: vn,
        r: function () {
          throw Error(
            'Invalid form element. requestFormReset must be passed a form that was rendered by React.'
          );
        },
        D: vn,
        C: vn,
        L: vn,
        m: vn,
        X: vn,
        S: vn,
        M: vn,
      },
      p: 0,
      findDOMNode: null,
    };
    if (!Jd.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function pr(e, t) {
      if (e === 'font') return '';
      if (typeof t == 'string') return t === 'use-credentials' ? t : '';
    }
    rn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Xt;
    rn.preconnect = function (e, t) {
      typeof e == 'string' &&
        (t
          ? ((t = t.crossOrigin),
            (t =
              typeof t == 'string'
                ? t === 'use-credentials'
                  ? t
                  : ''
                : void 0))
          : (t = null),
        Xt.d.C(e, t));
    };
    rn.prefetchDNS = function (e) {
      typeof e == 'string' && Xt.d.D(e);
    };
    rn.preinit = function (e, t) {
      if (typeof e == 'string' && t && typeof t.as == 'string') {
        var n = t.as,
          o = pr(n, t.crossOrigin),
          r = typeof t.integrity == 'string' ? t.integrity : void 0,
          s = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
        n === 'style'
          ? Xt.d.S(e, typeof t.precedence == 'string' ? t.precedence : void 0, {
              crossOrigin: o,
              integrity: r,
              fetchPriority: s,
            })
          : n === 'script' &&
            Xt.d.X(e, {
              crossOrigin: o,
              integrity: r,
              fetchPriority: s,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
      }
    };
    rn.preinitModule = function (e, t) {
      if (typeof e == 'string')
        if (typeof t == 'object' && t !== null) {
          if (t.as == null || t.as === 'script') {
            var n = pr(t.as, t.crossOrigin);
            Xt.d.M(e, {
              crossOrigin: n,
              integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
          }
        } else t == null && Xt.d.M(e);
    };
    rn.preload = function (e, t) {
      if (
        typeof e == 'string' &&
        typeof t == 'object' &&
        t !== null &&
        typeof t.as == 'string'
      ) {
        var n = t.as,
          o = pr(n, t.crossOrigin);
        Xt.d.L(e, n, {
          crossOrigin: o,
          integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
          type: typeof t.type == 'string' ? t.type : void 0,
          fetchPriority:
            typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0,
          referrerPolicy:
            typeof t.referrerPolicy == 'string' ? t.referrerPolicy : void 0,
          imageSrcSet:
            typeof t.imageSrcSet == 'string' ? t.imageSrcSet : void 0,
          imageSizes: typeof t.imageSizes == 'string' ? t.imageSizes : void 0,
          media: typeof t.media == 'string' ? t.media : void 0,
        });
      }
    };
    rn.preloadModule = function (e, t) {
      if (typeof e == 'string')
        if (t) {
          var n = pr(t.as, t.crossOrigin);
          Xt.d.m(e, {
            as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
            crossOrigin: n,
            integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          });
        } else Xt.d.m(e);
    };
    rn.version = '19.0.0';
  });
  var rl = H((cx, ol) => {
    'use strict';
    ol.exports = nl();
  });
  var oc = H((Gt) => {
    'use strict';
    var Qd = rl(),
      Zd = Eo(),
      xl = new MessageChannel(),
      gl = [];
    xl.port1.onmessage = function () {
      var e = gl.shift();
      e && e();
    };
    function Do(e) {
      gl.push(e), xl.port2.postMessage(null);
    }
    function ef(e) {
      setTimeout(function () {
        throw e;
      });
    }
    var tf = Promise,
      Cl =
        typeof queueMicrotask == 'function'
          ? queueMicrotask
          : function (e) {
              tf.resolve(null).then(e).catch(ef);
            },
      Et = null,
      At = 0;
    function dr(e, t) {
      if (t.byteLength !== 0)
        if (2048 < t.byteLength)
          0 < At &&
            (e.enqueue(new Uint8Array(Et.buffer, 0, At)),
            (Et = new Uint8Array(2048)),
            (At = 0)),
            e.enqueue(t);
        else {
          var n = Et.length - At;
          n < t.byteLength &&
            (n === 0
              ? e.enqueue(Et)
              : (Et.set(t.subarray(0, n), At),
                e.enqueue(Et),
                (t = t.subarray(n))),
            (Et = new Uint8Array(2048)),
            (At = 0)),
            Et.set(t, At),
            (At += t.byteLength);
        }
      return !0;
    }
    var nf = new TextEncoder();
    function Rt(e) {
      return nf.encode(e);
    }
    function xi(e) {
      return e.byteLength;
    }
    function wl(e, t) {
      typeof e.error == 'function' ? e.error(t) : e.close();
    }
    var gn = Symbol.for('react.client.reference'),
      mr = Symbol.for('react.server.reference');
    function so(e, t, n) {
      return Object.defineProperties(e, {
        $$typeof: {value: gn},
        $$id: {value: t},
        $$async: {value: n},
      });
    }
    var of = Function.prototype.bind,
      rf = Array.prototype.slice;
    function Il() {
      var e = of.apply(this, arguments);
      if (this.$$typeof === mr) {
        var t = rf.call(arguments, 1),
          n = {value: mr},
          o = {value: this.$$id};
        return (
          (t = {value: this.$$bound ? this.$$bound.concat(t) : t}),
          Object.defineProperties(e, {
            $$typeof: n,
            $$id: o,
            $$bound: t,
            bind: {value: Il, configurable: !0},
          })
        );
      }
      return e;
    }
    var sf = {
        value: function () {
          return 'function () { [omitted code] }';
        },
        configurable: !0,
        writable: !0,
      },
      af = Promise.prototype,
      lf = {
        get: function (e, t) {
          switch (t) {
            case '$$typeof':
              return e.$$typeof;
            case '$$id':
              return e.$$id;
            case '$$async':
              return e.$$async;
            case 'name':
              return e.name;
            case 'displayName':
              return;
            case 'defaultProps':
              return;
            case '_debugInfo':
              return;
            case 'toJSON':
              return;
            case Symbol.toPrimitive:
              return Object.prototype[Symbol.toPrimitive];
            case Symbol.toStringTag:
              return Object.prototype[Symbol.toStringTag];
            case 'Provider':
              throw Error(
                'Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider.'
              );
            case 'then':
              throw Error(
                'Cannot await or return from a thenable. You cannot await a client module from a server component.'
              );
          }
          throw Error(
            'Cannot access ' +
              (String(e.name) + '.' + String(t)) +
              ' on the server. You cannot dot into a client module from a server component. You can only pass the imported name through.'
          );
        },
        set: function () {
          throw Error('Cannot assign to a client module from a server module.');
        },
      };
    function sl(e, t) {
      switch (t) {
        case '$$typeof':
          return e.$$typeof;
        case '$$id':
          return e.$$id;
        case '$$async':
          return e.$$async;
        case 'name':
          return e.name;
        case 'defaultProps':
          return;
        case '_debugInfo':
          return;
        case 'toJSON':
          return;
        case Symbol.toPrimitive:
          return Object.prototype[Symbol.toPrimitive];
        case Symbol.toStringTag:
          return Object.prototype[Symbol.toStringTag];
        case '__esModule':
          var n = e.$$id;
          return (
            (e.default = so(
              function () {
                throw Error(
                  'Attempted to call the default export of ' +
                    n +
                    " from the server but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
                );
              },
              e.$$id + '#',
              e.$$async
            )),
            !0
          );
        case 'then':
          if (e.then) return e.then;
          if (e.$$async) return;
          var o = so({}, e.$$id, !0),
            r = new Proxy(o, Sl);
          return (
            (e.status = 'fulfilled'),
            (e.value = r),
            (e.then = so(
              function (s) {
                return Promise.resolve(s(r));
              },
              e.$$id + '#then',
              !1
            ))
          );
      }
      if (typeof t == 'symbol')
        throw Error(
          'Cannot read Symbol exports. Only named exports are supported on a client module imported on the server.'
        );
      return (
        (o = e[t]),
        o ||
          ((o = so(
            function () {
              throw Error(
                'Attempted to call ' +
                  String(t) +
                  '() from the server but ' +
                  String(t) +
                  " is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
              );
            },
            e.$$id + '#' + t,
            e.$$async
          )),
          Object.defineProperty(o, 'name', {value: t}),
          (o = e[t] = new Proxy(o, lf))),
        o
      );
    }
    var Sl = {
        get: function (e, t) {
          return sl(e, t);
        },
        getOwnPropertyDescriptor: function (e, t) {
          var n = Object.getOwnPropertyDescriptor(e, t);
          return (
            n ||
              ((n = {
                value: sl(e, t),
                writable: !1,
                configurable: !1,
                enumerable: !1,
              }),
              Object.defineProperty(e, t, n)),
            n
          );
        },
        getPrototypeOf: function () {
          return af;
        },
        set: function () {
          throw Error('Cannot assign to a client module from a server module.');
        },
      },
      bl = Qd.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      an = bl.d;
    bl.d = {f: an.f, r: an.r, D: cf, C: uf, L: hr, m: El, X: df, S: pf, M: ff};
    function cf(e) {
      if (typeof e == 'string' && e) {
        var t = De || null;
        if (t) {
          var n = t.hints,
            o = 'D|' + e;
          n.has(o) || (n.add(o), ft(t, 'D', e));
        } else an.D(e);
      }
    }
    function uf(e, t) {
      if (typeof e == 'string') {
        var n = De || null;
        if (n) {
          var o = n.hints,
            r = 'C|' + (t ?? 'null') + '|' + e;
          o.has(r) ||
            (o.add(r),
            typeof t == 'string' ? ft(n, 'C', [e, t]) : ft(n, 'C', e));
        } else an.C(e, t);
      }
    }
    function hr(e, t, n) {
      if (typeof e == 'string') {
        var o = De || null;
        if (o) {
          var r = o.hints,
            s = 'L';
          if (t === 'image' && n) {
            var i = n.imageSrcSet,
              a = n.imageSizes,
              u = '';
            typeof i == 'string' && i !== ''
              ? ((u += '[' + i + ']'),
                typeof a == 'string' && (u += '[' + a + ']'))
              : (u += '[][]' + e),
              (s += '[image]' + u);
          } else s += '[' + t + ']' + e;
          r.has(s) ||
            (r.add(s),
            (n = Mo(n)) ? ft(o, 'L', [e, t, n]) : ft(o, 'L', [e, t]));
        } else an.L(e, t, n);
      }
    }
    function El(e, t) {
      if (typeof e == 'string') {
        var n = De || null;
        if (n) {
          var o = n.hints,
            r = 'm|' + e;
          return o.has(r)
            ? void 0
            : (o.add(r), (t = Mo(t)) ? ft(n, 'm', [e, t]) : ft(n, 'm', e));
        }
        an.m(e, t);
      }
    }
    function pf(e, t, n) {
      if (typeof e == 'string') {
        var o = De || null;
        if (o) {
          var r = o.hints,
            s = 'S|' + e;
          return r.has(s)
            ? void 0
            : (r.add(s),
              (n = Mo(n))
                ? ft(o, 'S', [e, typeof t == 'string' ? t : 0, n])
                : typeof t == 'string'
                ? ft(o, 'S', [e, t])
                : ft(o, 'S', e));
        }
        an.S(e, t, n);
      }
    }
    function df(e, t) {
      if (typeof e == 'string') {
        var n = De || null;
        if (n) {
          var o = n.hints,
            r = 'X|' + e;
          return o.has(r)
            ? void 0
            : (o.add(r), (t = Mo(t)) ? ft(n, 'X', [e, t]) : ft(n, 'X', e));
        }
        an.X(e, t);
      }
    }
    function ff(e, t) {
      if (typeof e == 'string') {
        var n = De || null;
        if (n) {
          var o = n.hints,
            r = 'M|' + e;
          return o.has(r)
            ? void 0
            : (o.add(r), (t = Mo(t)) ? ft(n, 'M', [e, t]) : ft(n, 'M', e));
        }
        an.M(e, t);
      }
    }
    function Mo(e) {
      if (e == null) return null;
      var t = !1,
        n = {},
        o;
      for (o in e) e[o] != null && ((t = !0), (n[o] = e[o]));
      return t ? n : null;
    }
    function hf(e, t, n) {
      switch (t) {
        case 'img':
          t = n.src;
          var o = n.srcSet;
          if (
            !(
              n.loading === 'lazy' ||
              (!t && !o) ||
              (typeof t != 'string' && t != null) ||
              (typeof o != 'string' && o != null) ||
              n.fetchPriority === 'low' ||
              e & 3
            ) &&
            (typeof t != 'string' ||
              t[4] !== ':' ||
              (t[0] !== 'd' && t[0] !== 'D') ||
              (t[1] !== 'a' && t[1] !== 'A') ||
              (t[2] !== 't' && t[2] !== 'T') ||
              (t[3] !== 'a' && t[3] !== 'A')) &&
            (typeof o != 'string' ||
              o[4] !== ':' ||
              (o[0] !== 'd' && o[0] !== 'D') ||
              (o[1] !== 'a' && o[1] !== 'A') ||
              (o[2] !== 't' && o[2] !== 'T') ||
              (o[3] !== 'a' && o[3] !== 'A'))
          ) {
            var r = typeof n.sizes == 'string' ? n.sizes : void 0,
              s = n.crossOrigin;
            hr(t || '', 'image', {
              imageSrcSet: o,
              imageSizes: r,
              crossOrigin:
                typeof s == 'string'
                  ? s === 'use-credentials'
                    ? s
                    : ''
                  : void 0,
              integrity: n.integrity,
              type: n.type,
              fetchPriority: n.fetchPriority,
              referrerPolicy: n.referrerPolicy,
            });
          }
          return e;
        case 'link':
          if (
            ((t = n.rel),
            (o = n.href),
            !(
              e & 1 ||
              n.itemProp != null ||
              typeof t != 'string' ||
              typeof o != 'string' ||
              o === ''
            ))
          )
            switch (t) {
              case 'preload':
                hr(o, n.as, {
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  nonce: n.nonce,
                  type: n.type,
                  fetchPriority: n.fetchPriority,
                  referrerPolicy: n.referrerPolicy,
                  imageSrcSet: n.imageSrcSet,
                  imageSizes: n.imageSizes,
                  media: n.media,
                });
                break;
              case 'modulepreload':
                El(o, {
                  as: n.as,
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  nonce: n.nonce,
                });
                break;
              case 'stylesheet':
                hr(o, 'stylesheet', {
                  crossOrigin: n.crossOrigin,
                  integrity: n.integrity,
                  nonce: n.nonce,
                  type: n.type,
                  fetchPriority: n.fetchPriority,
                  referrerPolicy: n.referrerPolicy,
                  media: n.media,
                });
            }
          return e;
        case 'picture':
          return e | 2;
        case 'noscript':
          return e | 1;
        default:
          return e;
      }
    }
    var gi = Symbol.for('react.temporary.reference'),
      Tf = {
        get: function (e, t) {
          switch (t) {
            case '$$typeof':
              return e.$$typeof;
            case 'name':
              return;
            case 'displayName':
              return;
            case 'defaultProps':
              return;
            case '_debugInfo':
              return;
            case 'toJSON':
              return;
            case Symbol.toPrimitive:
              return Object.prototype[Symbol.toPrimitive];
            case Symbol.toStringTag:
              return Object.prototype[Symbol.toStringTag];
            case 'Provider':
              throw Error(
                'Cannot render a Client Context Provider on the Server. Instead, you can export a Client Component wrapper that itself renders a Client Context Provider.'
              );
            case 'then':
              return;
          }
          throw Error(
            'Cannot access ' +
              String(t) +
              ' on the server. You cannot dot into a temporary client reference from a server component. You can only pass the value through to the client.'
          );
        },
        set: function () {
          throw Error(
            'Cannot assign to a temporary client reference from a server module.'
          );
        },
      };
    function yf(e, t) {
      var n = Object.defineProperties(
        function () {
          throw Error(
            "Attempted to call a temporary Client Reference from the server but it is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        {$$typeof: {value: gi}}
      );
      return (n = new Proxy(n, Tf)), e.set(n, t), n;
    }
    var mf = Symbol.for('react.element'),
      Yt = Symbol.for('react.transitional.element'),
      Ci = Symbol.for('react.fragment'),
      il = Symbol.for('react.context'),
      Al = Symbol.for('react.forward_ref'),
      kf = Symbol.for('react.suspense'),
      vf = Symbol.for('react.suspense_list'),
      Pl = Symbol.for('react.memo'),
      Lo = Symbol.for('react.lazy'),
      _f = Symbol.for('react.memo_cache_sentinel');
    Symbol.for('react.postpone');
    var al = Symbol.iterator;
    function Rl(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (al && e[al]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var Hn = Symbol.asyncIterator;
    function Kn() {}
    var wi = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function xf(e, t, n) {
      switch (
        ((n = e[n]),
        n === void 0 ? e.push(t) : n !== t && (t.then(Kn, Kn), (t = n)),
        t.status)
      ) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw t.reason;
        default:
          switch (
            (typeof t.status == 'string'
              ? t.then(Kn, Kn)
              : ((e = t),
                (e.status = 'pending'),
                e.then(
                  function (o) {
                    if (t.status === 'pending') {
                      var r = t;
                      (r.status = 'fulfilled'), (r.value = o);
                    }
                  },
                  function (o) {
                    if (t.status === 'pending') {
                      var r = t;
                      (r.status = 'rejected'), (r.reason = o);
                    }
                  }
                )),
            t.status)
          ) {
            case 'fulfilled':
              return t.value;
            case 'rejected':
              throw t.reason;
          }
          throw ((Tr = t), wi);
      }
    }
    var Tr = null;
    function Nl() {
      if (Tr === null)
        throw Error(
          'Expected a suspended thenable. This is a bug in React. Please file an issue.'
        );
      var e = Tr;
      return (Tr = null), e;
    }
    var Ro = null,
      hi = 0,
      io = null;
    function Dl() {
      var e = io || [];
      return (io = null), e;
    }
    var Ol = {
      readContext: Ti,
      use: wf,
      useCallback: function (e) {
        return e;
      },
      useContext: Ti,
      useEffect: at,
      useImperativeHandle: at,
      useLayoutEffect: at,
      useInsertionEffect: at,
      useMemo: function (e) {
        return e();
      },
      useReducer: at,
      useRef: at,
      useState: at,
      useDebugValue: function () {},
      useDeferredValue: at,
      useTransition: at,
      useSyncExternalStore: at,
      useId: Cf,
      useHostTransitionStatus: at,
      useFormState: at,
      useActionState: at,
      useOptimistic: at,
      useMemoCache: function (e) {
        for (var t = Array(e), n = 0; n < e; n++) t[n] = _f;
        return t;
      },
      useCacheRefresh: function () {
        return gf;
      },
    };
    Ol.useEffectEvent = at;
    function at() {
      throw Error('This Hook is not supported in Server Components.');
    }
    function gf() {
      throw Error(
        'Refreshing the cache is not supported in Server Components.'
      );
    }
    function Ti() {
      throw Error('Cannot read a Client Context from a Server Component.');
    }
    function Cf() {
      if (Ro === null)
        throw Error('useId can only be used while React is rendering');
      var e = Ro.identifierCount++;
      return '_' + Ro.identifierPrefix + 'S_' + e.toString(32) + '_';
    }
    function wf(e) {
      if ((e !== null && typeof e == 'object') || typeof e == 'function') {
        if (typeof e.then == 'function') {
          var t = hi;
          return (hi += 1), io === null && (io = []), xf(io, e, t);
        }
        e.$$typeof === il && Ti();
      }
      throw e.$$typeof === gn
        ? e.value != null && e.value.$$typeof === il
          ? Error('Cannot read a Client Context from a Server Component.')
          : Error('Cannot use() an already resolved Client Reference.')
        : Error('An unsupported type was passed to use(): ' + String(e));
    }
    var ll = {
        getCacheForType: function (e) {
          var t = (t = De || null) ? t.cache : new Map(),
            n = t.get(e);
          return n === void 0 && ((n = e()), t.set(e, n)), n;
        },
        cacheSignal: function () {
          var e = De || null;
          return e ? e.cacheController.signal : null;
        },
      },
      Un = Zd.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (!Un)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    var Kt = Array.isArray,
      lo = Object.getPrototypeOf;
    function Ml(e) {
      return (e = Object.prototype.toString.call(e)), e.slice(8, e.length - 1);
    }
    function cl(e) {
      switch (typeof e) {
        case 'string':
          return JSON.stringify(10 >= e.length ? e : e.slice(0, 10) + '...');
        case 'object':
          return Kt(e)
            ? '[...]'
            : e !== null && e.$$typeof === yi
            ? 'client'
            : ((e = Ml(e)), e === 'Object' ? '{...}' : e);
        case 'function':
          return e.$$typeof === yi
            ? 'client'
            : (e = e.displayName || e.name)
            ? 'function ' + e
            : 'function';
        default:
          return String(e);
      }
    }
    function yr(e) {
      if (typeof e == 'string') return e;
      switch (e) {
        case kf:
          return 'Suspense';
        case vf:
          return 'SuspenseList';
      }
      if (typeof e == 'object')
        switch (e.$$typeof) {
          case Al:
            return yr(e.render);
          case Pl:
            return yr(e.type);
          case Lo:
            var t = e._payload;
            e = e._init;
            try {
              return yr(e(t));
            } catch {}
        }
      return '';
    }
    var yi = Symbol.for('react.client.reference');
    function Bn(e, t) {
      var n = Ml(e);
      if (n !== 'Object' && n !== 'Array') return n;
      n = -1;
      var o = 0;
      if (Kt(e)) {
        for (var r = '[', s = 0; s < e.length; s++) {
          0 < s && (r += ', ');
          var i = e[s];
          (i = typeof i == 'object' && i !== null ? Bn(i) : cl(i)),
            '' + s === t
              ? ((n = r.length), (o = i.length), (r += i))
              : (r =
                  10 > i.length && 40 > r.length + i.length
                    ? r + i
                    : r + '...');
        }
        r += ']';
      } else if (e.$$typeof === Yt) r = '<' + yr(e.type) + '/>';
      else {
        if (e.$$typeof === yi) return 'client';
        for (r = '{', s = Object.keys(e), i = 0; i < s.length; i++) {
          0 < i && (r += ', ');
          var a = s[i],
            u = JSON.stringify(a);
          (r += ('"' + a + '"' === u ? a : u) + ': '),
            (u = e[a]),
            (u = typeof u == 'object' && u !== null ? Bn(u) : cl(u)),
            a === t
              ? ((n = r.length), (o = u.length), (r += u))
              : (r =
                  10 > u.length && 40 > r.length + u.length
                    ? r + u
                    : r + '...');
        }
        r += '}';
      }
      return t === void 0
        ? r
        : -1 < n && 0 < o
        ? ((e = ' '.repeat(n) + '^'.repeat(o)),
          `
  ` +
            r +
            `
  ` +
            e)
        : `
  ` + r;
    }
    var vr = Object.prototype.hasOwnProperty,
      If = Object.prototype,
      Wn = JSON.stringify;
    function Sf(e) {
      console.error(e);
    }
    function Ll(e, t, n, o, r, s, i, a, u) {
      if (Un.A !== null && Un.A !== ll)
        throw Error(
          'Currently React only supports one RSC renderer at a time.'
        );
      Un.A = ll;
      var h = new Set(),
        v = [],
        _ = new Set();
      (this.type = e),
        (this.status = 10),
        (this.flushScheduled = !1),
        (this.destination = this.fatalError = null),
        (this.bundlerConfig = n),
        (this.cache = new Map()),
        (this.cacheController = new AbortController()),
        (this.pendingChunks = this.nextChunkId = 0),
        (this.hints = _),
        (this.abortableTasks = h),
        (this.pingedTasks = v),
        (this.completedImportChunks = []),
        (this.completedHintChunks = []),
        (this.completedRegularChunks = []),
        (this.completedErrorChunks = []),
        (this.writtenSymbols = new Map()),
        (this.writtenClientReferences = new Map()),
        (this.writtenServerReferences = new Map()),
        (this.writtenObjects = new WeakMap()),
        (this.temporaryReferences = u),
        (this.identifierPrefix = a || ''),
        (this.identifierCount = 1),
        (this.taintCleanupQueue = []),
        (this.onError = o === void 0 ? Sf : o),
        (this.onPostpone = r === void 0 ? Kn : r),
        (this.onAllReady = s),
        (this.onFatalError = i),
        (e = Cn(this, t, null, !1, 0, h)),
        v.push(e);
    }
    var De = null;
    function ul(e, t, n) {
      var o = Cn(
        e,
        n,
        t.keyPath,
        t.implicitSlot,
        t.formatContext,
        e.abortableTasks
      );
      switch (n.status) {
        case 'fulfilled':
          return (o.model = n.value), Oo(e, o), o.id;
        case 'rejected':
          return cn(e, o, n.reason), o.id;
        default:
          if (e.status === 12)
            return (
              e.abortableTasks.delete(o),
              e.type === 21
                ? (co(o), uo(o, e))
                : ((t = e.fatalError), Ii(o), Si(o, e, t)),
              o.id
            );
          typeof n.status != 'string' &&
            ((n.status = 'pending'),
            n.then(
              function (r) {
                n.status === 'pending' &&
                  ((n.status = 'fulfilled'), (n.value = r));
              },
              function (r) {
                n.status === 'pending' &&
                  ((n.status = 'rejected'), (n.reason = r));
              }
            ));
      }
      return (
        n.then(
          function (r) {
            (o.model = r), Oo(e, o);
          },
          function (r) {
            o.status === 0 && (cn(e, o, r), Pt(e));
          }
        ),
        o.id
      );
    }
    function bf(e, t, n) {
      function o(h) {
        if (u.status === 0)
          if (h.done)
            (u.status = 1),
              (h =
                u.id.toString(16) +
                `:C
`),
              e.completedRegularChunks.push(Rt(h)),
              e.abortableTasks.delete(u),
              e.cacheController.signal.removeEventListener('abort', s),
              Pt(e),
              gr(e);
          else
            try {
              (u.model = h.value),
                e.pendingChunks++,
                ql(e, u),
                Pt(e),
                a.read().then(o, r);
            } catch (v) {
              r(v);
            }
      }
      function r(h) {
        u.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', s),
          cn(e, u, h),
          Pt(e),
          a.cancel(h).then(r, r));
      }
      function s() {
        if (u.status === 0) {
          var h = e.cacheController.signal;
          h.removeEventListener('abort', s),
            (h = h.reason),
            e.type === 21
              ? (e.abortableTasks.delete(u), co(u), uo(u, e))
              : (cn(e, u, h), Pt(e)),
            a.cancel(h).then(r, r);
        }
      }
      var i = n.supportsBYOB;
      if (i === void 0)
        try {
          n.getReader({mode: 'byob'}).releaseLock(), (i = !0);
        } catch {
          i = !1;
        }
      var a = n.getReader(),
        u = Cn(
          e,
          t.model,
          t.keyPath,
          t.implicitSlot,
          t.formatContext,
          e.abortableTasks
        );
      return (
        e.pendingChunks++,
        (t =
          u.id.toString(16) +
          ':' +
          (i ? 'r' : 'R') +
          `
`),
        e.completedRegularChunks.push(Rt(t)),
        e.cacheController.signal.addEventListener('abort', s),
        a.read().then(o, r),
        Xe(u.id)
      );
    }
    function Ef(e, t, n, o) {
      function r(u) {
        if (a.status === 0)
          if (u.done) {
            if (((a.status = 1), u.value === void 0))
              var h =
                a.id.toString(16) +
                `:C
`;
            else
              try {
                var v = jn(e, u.value, 0);
                h =
                  a.id.toString(16) +
                  ':C' +
                  Wn(Xe(v)) +
                  `
`;
              } catch (_) {
                s(_);
                return;
              }
            e.completedRegularChunks.push(Rt(h)),
              e.abortableTasks.delete(a),
              e.cacheController.signal.removeEventListener('abort', i),
              Pt(e),
              gr(e);
          } else
            try {
              (a.model = u.value),
                e.pendingChunks++,
                ql(e, a),
                Pt(e),
                o.next().then(r, s);
            } catch (_) {
              s(_);
            }
      }
      function s(u) {
        a.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', i),
          cn(e, a, u),
          Pt(e),
          typeof o.throw == 'function' && o.throw(u).then(s, s));
      }
      function i() {
        if (a.status === 0) {
          var u = e.cacheController.signal;
          u.removeEventListener('abort', i);
          var h = u.reason;
          e.type === 21
            ? (e.abortableTasks.delete(a), co(a), uo(a, e))
            : (cn(e, a, u.reason), Pt(e)),
            typeof o.throw == 'function' && o.throw(h).then(s, s);
        }
      }
      n = n === o;
      var a = Cn(
        e,
        t.model,
        t.keyPath,
        t.implicitSlot,
        t.formatContext,
        e.abortableTasks
      );
      return (
        e.pendingChunks++,
        (t =
          a.id.toString(16) +
          ':' +
          (n ? 'x' : 'X') +
          `
`),
        e.completedRegularChunks.push(Rt(t)),
        e.cacheController.signal.addEventListener('abort', i),
        o.next().then(r, s),
        Xe(a.id)
      );
    }
    function ft(e, t, n) {
      (n = Wn(n)),
        (t = Rt(
          ':H' +
            t +
            n +
            `
`
        )),
        e.completedHintChunks.push(t),
        Pt(e);
    }
    function Af(e) {
      if (e.status === 'fulfilled') return e.value;
      throw e.status === 'rejected' ? e.reason : e;
    }
    function Pf(e, t, n) {
      switch (n.status) {
        case 'fulfilled':
          return n.value;
        case 'rejected':
          break;
        default:
          typeof n.status != 'string' &&
            ((n.status = 'pending'),
            n.then(
              function (o) {
                n.status === 'pending' &&
                  ((n.status = 'fulfilled'), (n.value = o));
              },
              function (o) {
                n.status === 'pending' &&
                  ((n.status = 'rejected'), (n.reason = o));
              }
            ));
      }
      return {$$typeof: Lo, _payload: n, _init: Af};
    }
    function pl() {}
    function Rf(e, t, n, o) {
      if (typeof o != 'object' || o === null || o.$$typeof === gn) return o;
      if (typeof o.then == 'function') return Pf(e, t, o);
      var r = Rl(o);
      return r
        ? ((e = {}),
          (e[Symbol.iterator] = function () {
            return r.call(o);
          }),
          e)
        : typeof o[Hn] != 'function' ||
          (typeof ReadableStream == 'function' && o instanceof ReadableStream)
        ? o
        : ((e = {}),
          (e[Hn] = function () {
            return o[Hn]();
          }),
          e);
    }
    function dl(e, t, n, o, r) {
      var s = t.thenableState;
      if (
        ((t.thenableState = null),
        (hi = 0),
        (io = s),
        (r = o(r, void 0)),
        e.status === 12)
      )
        throw (
          (typeof r == 'object' &&
            r !== null &&
            typeof r.then == 'function' &&
            r.$$typeof !== gn &&
            r.then(pl, pl),
          null)
        );
      return (
        (r = Rf(e, t, o, r)),
        (o = t.keyPath),
        (s = t.implicitSlot),
        n !== null
          ? (t.keyPath = o === null ? n : o + ',' + n)
          : o === null && (t.implicitSlot = !0),
        (e = Fo(e, t, xr, '', r)),
        (t.keyPath = o),
        (t.implicitSlot = s),
        e
      );
    }
    function fl(e, t, n) {
      return t.keyPath !== null
        ? ((e = [Yt, Ci, t.keyPath, {children: n}]), t.implicitSlot ? [e] : e)
        : n;
    }
    var xn = 0;
    function hl(e, t) {
      return (
        (t = Cn(
          e,
          t.model,
          t.keyPath,
          t.implicitSlot,
          t.formatContext,
          e.abortableTasks
        )),
        Oo(e, t),
        qn(t.id)
      );
    }
    function mi(e, t, n, o, r, s) {
      if (r != null)
        throw Error(
          'Refs cannot be used in Server Components, nor passed to Client Components.'
        );
      if (typeof n == 'function' && n.$$typeof !== gn && n.$$typeof !== gi)
        return dl(e, t, o, n, s);
      if (n === Ci && o === null)
        return (
          (n = t.implicitSlot),
          t.keyPath === null && (t.implicitSlot = !0),
          (s = Fo(e, t, xr, '', s.children)),
          (t.implicitSlot = n),
          s
        );
      if (n != null && typeof n == 'object' && n.$$typeof !== gn)
        switch (n.$$typeof) {
          case Lo:
            var i = n._init;
            if (((n = i(n._payload)), e.status === 12)) throw null;
            return mi(e, t, n, o, r, s);
          case Al:
            return dl(e, t, o, n.render, s);
          case Pl:
            return mi(e, t, n.type, o, r, s);
        }
      else
        typeof n == 'string' &&
          ((r = t.formatContext),
          (i = hf(r, n, s)),
          r !== i && s.children != null && jn(e, s.children, i));
      return (
        (e = o),
        (o = t.keyPath),
        e === null ? (e = o) : o !== null && (e = o + ',' + e),
        (s = [Yt, n, e, s]),
        (t = t.implicitSlot && e !== null ? [s] : s),
        t
      );
    }
    function Oo(e, t) {
      var n = e.pingedTasks;
      n.push(t),
        n.length === 1 &&
          ((e.flushScheduled = e.destination !== null),
          e.type === 21 || e.status === 10
            ? Cl(function () {
                return ki(e);
              })
            : Do(function () {
                return ki(e);
              }));
    }
    function Cn(e, t, n, o, r, s) {
      e.pendingChunks++;
      var i = e.nextChunkId++;
      typeof t != 'object' ||
        t === null ||
        n !== null ||
        o ||
        e.writtenObjects.set(t, Xe(i));
      var a = {
        id: i,
        status: 0,
        model: t,
        keyPath: n,
        implicitSlot: o,
        formatContext: r,
        ping: function () {
          return Oo(e, a);
        },
        toJSON: function (u, h) {
          xn += u.length;
          var v = a.keyPath,
            _ = a.implicitSlot;
          try {
            var x = Fo(e, a, this, u, h);
          } catch (G) {
            if (
              ((u = a.model),
              (u =
                typeof u == 'object' &&
                u !== null &&
                (u.$$typeof === Yt || u.$$typeof === Lo)),
              e.status === 12)
            )
              (a.status = 3),
                e.type === 21
                  ? ((v = e.nextChunkId++), (v = u ? qn(v) : Xe(v)), (x = v))
                  : ((v = e.fatalError), (x = u ? qn(v) : Xe(v)));
            else if (
              ((h = G === wi ? Nl() : G),
              typeof h == 'object' && h !== null && typeof h.then == 'function')
            ) {
              x = Cn(
                e,
                a.model,
                a.keyPath,
                a.implicitSlot,
                a.formatContext,
                e.abortableTasks
              );
              var L = x.ping;
              h.then(L, L),
                (x.thenableState = Dl()),
                (a.keyPath = v),
                (a.implicitSlot = _),
                (x = u ? qn(x.id) : Xe(x.id));
            } else
              (a.keyPath = v),
                (a.implicitSlot = _),
                e.pendingChunks++,
                (v = e.nextChunkId++),
                (_ = ln(e, h, a)),
                _r(e, v, _),
                (x = u ? qn(v) : Xe(v));
          }
          return x;
        },
        thenableState: null,
      };
      return s.add(a), a;
    }
    function Xe(e) {
      return '$' + e.toString(16);
    }
    function qn(e) {
      return '$L' + e.toString(16);
    }
    function Fl(e, t, n) {
      return (
        (e = Wn(n)),
        (t =
          t.toString(16) +
          ':' +
          e +
          `
`),
        Rt(t)
      );
    }
    function Tl(e, t, n, o) {
      var r = o.$$async ? o.$$id + '#async' : o.$$id,
        s = e.writtenClientReferences,
        i = s.get(r);
      if (i !== void 0) return t[0] === Yt && n === '1' ? qn(i) : Xe(i);
      try {
        var a = e.bundlerConfig,
          u = o.$$id;
        i = '';
        var h = a[u];
        if (h) i = h.name;
        else {
          var v = u.lastIndexOf('#');
          if ((v !== -1 && ((i = u.slice(v + 1)), (h = a[u.slice(0, v)])), !h))
            throw Error(
              'Could not find the module "' +
                u +
                '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.'
            );
        }
        if (h.async === !0 && o.$$async === !0)
          throw Error(
            'The module "' +
              u +
              '" is marked as an async ESM module but was loaded as a CJS proxy. This is probably a bug in the React Server Components bundler.'
          );
        var _ =
          h.async === !0 || o.$$async === !0
            ? [h.id, h.chunks, i, 1]
            : [h.id, h.chunks, i];
        e.pendingChunks++;
        var x = e.nextChunkId++,
          L = Wn(_),
          G =
            x.toString(16) +
            ':I' +
            L +
            `
`,
          F = Rt(G);
        return (
          e.completedImportChunks.push(F),
          s.set(r, x),
          t[0] === Yt && n === '1' ? qn(x) : Xe(x)
        );
      } catch (K) {
        return (
          e.pendingChunks++,
          (t = e.nextChunkId++),
          (n = ln(e, K, null)),
          _r(e, t, n),
          Xe(t)
        );
      }
    }
    function jn(e, t, n) {
      return (t = Cn(e, t, null, !1, n, e.abortableTasks)), Kl(e, t), t.id;
    }
    function _t(e, t, n) {
      e.pendingChunks++;
      var o = e.nextChunkId++;
      return dt(e, o, t, n, !1), Xe(o);
    }
    function Nf(e, t) {
      function n(u) {
        if (i.status === 0)
          if (u.done)
            e.cacheController.signal.removeEventListener('abort', r), Oo(e, i);
          else return s.push(u.value), a.read().then(n).catch(o);
      }
      function o(u) {
        i.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', r),
          cn(e, i, u),
          Pt(e),
          a.cancel(u).then(o, o));
      }
      function r() {
        if (i.status === 0) {
          var u = e.cacheController.signal;
          u.removeEventListener('abort', r),
            (u = u.reason),
            e.type === 21
              ? (e.abortableTasks.delete(i), co(i), uo(i, e))
              : (cn(e, i, u), Pt(e)),
            a.cancel(u).then(o, o);
        }
      }
      var s = [t.type],
        i = Cn(e, s, null, !1, 0, e.abortableTasks),
        a = t.stream().getReader();
      return (
        e.cacheController.signal.addEventListener('abort', r),
        a.read().then(n).catch(o),
        '$B' + i.id.toString(16)
      );
    }
    var _n = !1;
    function Fo(e, t, n, o, r) {
      if (((t.model = r), r === Yt)) return '$';
      if (r === null) return null;
      if (typeof r == 'object') {
        switch (r.$$typeof) {
          case Yt:
            var s = null,
              i = e.writtenObjects;
            if (t.keyPath === null && !t.implicitSlot) {
              var a = i.get(r);
              if (a !== void 0)
                if (_n === r) _n = null;
                else return a;
              else
                o.indexOf(':') === -1 &&
                  ((n = i.get(n)),
                  n !== void 0 && ((s = n + ':' + o), i.set(r, s)));
            }
            return 3200 < xn
              ? hl(e, t)
              : ((o = r.props),
                (n = o.ref),
                (e = mi(e, t, r.type, r.key, n !== void 0 ? n : null, o)),
                typeof e == 'object' &&
                  e !== null &&
                  s !== null &&
                  (i.has(e) || i.set(e, s)),
                e);
          case Lo:
            if (3200 < xn) return hl(e, t);
            if (
              ((t.thenableState = null),
              (o = r._init),
              (r = o(r._payload)),
              e.status === 12)
            )
              throw null;
            return Fo(e, t, xr, '', r);
          case mf:
            throw Error(`A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.`);
        }
        if (r.$$typeof === gn) return Tl(e, n, o, r);
        if (
          e.temporaryReferences !== void 0 &&
          ((s = e.temporaryReferences.get(r)), s !== void 0)
        )
          return '$T' + s;
        if (
          ((s = e.writtenObjects), (i = s.get(r)), typeof r.then == 'function')
        ) {
          if (i !== void 0) {
            if (t.keyPath !== null || t.implicitSlot)
              return '$@' + ul(e, t, r).toString(16);
            if (_n === r) _n = null;
            else return i;
          }
          return (e = '$@' + ul(e, t, r).toString(16)), s.set(r, e), e;
        }
        if (i !== void 0)
          if (_n === r) {
            if (i !== Xe(t.id)) return i;
            _n = null;
          } else return i;
        else if (o.indexOf(':') === -1 && ((i = s.get(n)), i !== void 0)) {
          if (((a = o), Kt(n) && n[0] === Yt))
            switch (o) {
              case '1':
                a = 'type';
                break;
              case '2':
                a = 'key';
                break;
              case '3':
                a = 'props';
                break;
              case '4':
                a = '_owner';
            }
          s.set(r, i + ':' + a);
        }
        if (Kt(r)) return fl(e, t, r);
        if (r instanceof Map)
          return (r = Array.from(r)), '$Q' + jn(e, r, 0).toString(16);
        if (r instanceof Set)
          return (r = Array.from(r)), '$W' + jn(e, r, 0).toString(16);
        if (typeof FormData == 'function' && r instanceof FormData)
          return (r = Array.from(r.entries())), '$K' + jn(e, r, 0).toString(16);
        if (r instanceof Error) return '$Z';
        if (r instanceof ArrayBuffer) return _t(e, 'A', new Uint8Array(r));
        if (r instanceof Int8Array) return _t(e, 'O', r);
        if (r instanceof Uint8Array) return _t(e, 'o', r);
        if (r instanceof Uint8ClampedArray) return _t(e, 'U', r);
        if (r instanceof Int16Array) return _t(e, 'S', r);
        if (r instanceof Uint16Array) return _t(e, 's', r);
        if (r instanceof Int32Array) return _t(e, 'L', r);
        if (r instanceof Uint32Array) return _t(e, 'l', r);
        if (r instanceof Float32Array) return _t(e, 'G', r);
        if (r instanceof Float64Array) return _t(e, 'g', r);
        if (r instanceof BigInt64Array) return _t(e, 'M', r);
        if (r instanceof BigUint64Array) return _t(e, 'm', r);
        if (r instanceof DataView) return _t(e, 'V', r);
        if (typeof Blob == 'function' && r instanceof Blob) return Nf(e, r);
        if ((s = Rl(r)))
          return (
            (o = s.call(r)),
            o === r
              ? ((r = Array.from(o)), '$i' + jn(e, r, 0).toString(16))
              : fl(e, t, Array.from(o))
          );
        if (typeof ReadableStream == 'function' && r instanceof ReadableStream)
          return bf(e, t, r);
        if (((s = r[Hn]), typeof s == 'function'))
          return (
            t.keyPath !== null
              ? ((e = [Yt, Ci, t.keyPath, {children: r}]),
                (e = t.implicitSlot ? [e] : e))
              : ((o = s.call(r)), (e = Ef(e, t, r, o))),
            e
          );
        if (r instanceof Date) return '$D' + r.toJSON();
        if (((e = lo(r)), e !== If && (e === null || lo(e) !== null)))
          throw Error(
            'Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.' +
              Bn(n, o)
          );
        return r;
      }
      if (typeof r == 'string')
        return (
          (xn += r.length),
          r[r.length - 1] === 'Z' && n[o] instanceof Date
            ? '$D' + r
            : 1024 <= r.length && xi !== null
            ? (e.pendingChunks++, (t = e.nextChunkId++), Bl(e, t, r, !1), Xe(t))
            : ((e = r[0] === '$' ? '$' + r : r), e)
        );
      if (typeof r == 'boolean') return r;
      if (typeof r == 'number')
        return Number.isFinite(r)
          ? r === 0 && 1 / r === -1 / 0
            ? '$-0'
            : r
          : r === 1 / 0
          ? '$Infinity'
          : r === -1 / 0
          ? '$-Infinity'
          : '$NaN';
      if (typeof r > 'u') return '$undefined';
      if (typeof r == 'function') {
        if (r.$$typeof === gn) return Tl(e, n, o, r);
        if (r.$$typeof === mr)
          return (
            (t = e.writtenServerReferences),
            (o = t.get(r)),
            o !== void 0
              ? (e = '$h' + o.toString(16))
              : ((o = r.$$bound),
                (o = o === null ? null : Promise.resolve(o)),
                (e = jn(e, {id: r.$$id, bound: o}, 0)),
                t.set(r, e),
                (e = '$h' + e.toString(16))),
            e
          );
        if (
          e.temporaryReferences !== void 0 &&
          ((e = e.temporaryReferences.get(r)), e !== void 0)
        )
          return '$T' + e;
        throw r.$$typeof === gi
          ? Error(
              'Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server.'
            )
          : /^on[A-Z]/.test(o)
          ? Error(
              'Event handlers cannot be passed to Client Component props.' +
                Bn(n, o) +
                `
If you need interactivity, consider converting part of this to a Client Component.`
            )
          : Error(
              'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.' +
                Bn(n, o)
            );
      }
      if (typeof r == 'symbol') {
        if (((t = e.writtenSymbols), (s = t.get(r)), s !== void 0))
          return Xe(s);
        if (((s = r.description), Symbol.for(s) !== r))
          throw Error(
            'Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(' +
              (r.description + ') cannot be found among global symbols.') +
              Bn(n, o)
          );
        return (
          e.pendingChunks++,
          (o = e.nextChunkId++),
          (n = Fl(e, o, '$S' + s)),
          e.completedImportChunks.push(n),
          t.set(r, o),
          Xe(o)
        );
      }
      if (typeof r == 'bigint') return '$n' + r.toString(10);
      throw Error(
        'Type ' +
          typeof r +
          ' is not supported in Client Component props.' +
          Bn(n, o)
      );
    }
    function ln(e, t) {
      var n = De;
      De = null;
      try {
        var o = e.onError,
          r = o(t);
      } finally {
        De = n;
      }
      if (r != null && typeof r != 'string')
        throw Error(
          'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' +
            typeof r +
            '" instead'
        );
      return r || '';
    }
    function $o(e, t) {
      var n = e.onFatalError;
      n(t),
        e.destination !== null
          ? ((e.status = 14), wl(e.destination, t))
          : ((e.status = 13), (e.fatalError = t)),
        e.cacheController.abort(
          Error('The render was aborted due to a fatal error.', {cause: t})
        );
    }
    function _r(e, t, n) {
      (n = {digest: n}),
        (t =
          t.toString(16) +
          ':E' +
          Wn(n) +
          `
`),
        (t = Rt(t)),
        e.completedErrorChunks.push(t);
    }
    function $l(e, t, n) {
      (t =
        t.toString(16) +
        ':' +
        n +
        `
`),
        (t = Rt(t)),
        e.completedRegularChunks.push(t);
    }
    function dt(e, t, n, o, r) {
      r ? e.pendingDebugChunks++ : e.pendingChunks++,
        (r = new Uint8Array(o.buffer, o.byteOffset, o.byteLength)),
        (o = 2048 < o.byteLength ? r.slice() : r),
        (r = o.byteLength),
        (t = t.toString(16) + ':' + n + r.toString(16) + ','),
        (t = Rt(t)),
        e.completedRegularChunks.push(t, o);
    }
    function Bl(e, t, n, o) {
      if (xi === null)
        throw Error(
          'Existence of byteLengthOfChunk should have already been checked. This is a bug in React.'
        );
      o ? e.pendingDebugChunks++ : e.pendingChunks++,
        (n = Rt(n)),
        (o = n.byteLength),
        (t = t.toString(16) + ':T' + o.toString(16) + ','),
        (t = Rt(t)),
        e.completedRegularChunks.push(t, n);
    }
    function jl(e, t, n) {
      var o = t.id;
      typeof n == 'string' && xi !== null
        ? Bl(e, o, n, !1)
        : n instanceof ArrayBuffer
        ? dt(e, o, 'A', new Uint8Array(n), !1)
        : n instanceof Int8Array
        ? dt(e, o, 'O', n, !1)
        : n instanceof Uint8Array
        ? dt(e, o, 'o', n, !1)
        : n instanceof Uint8ClampedArray
        ? dt(e, o, 'U', n, !1)
        : n instanceof Int16Array
        ? dt(e, o, 'S', n, !1)
        : n instanceof Uint16Array
        ? dt(e, o, 's', n, !1)
        : n instanceof Int32Array
        ? dt(e, o, 'L', n, !1)
        : n instanceof Uint32Array
        ? dt(e, o, 'l', n, !1)
        : n instanceof Float32Array
        ? dt(e, o, 'G', n, !1)
        : n instanceof Float64Array
        ? dt(e, o, 'g', n, !1)
        : n instanceof BigInt64Array
        ? dt(e, o, 'M', n, !1)
        : n instanceof BigUint64Array
        ? dt(e, o, 'm', n, !1)
        : n instanceof DataView
        ? dt(e, o, 'V', n, !1)
        : ((n = Wn(n, t.toJSON)), $l(e, t.id, n));
    }
    function cn(e, t, n) {
      (t.status = 4),
        (n = ln(e, n, t)),
        _r(e, t.id, n),
        e.abortableTasks.delete(t),
        gr(e);
    }
    var xr = {};
    function Kl(e, t) {
      if (t.status === 0) {
        t.status = 5;
        var n = xn;
        try {
          _n = t.model;
          var o = Fo(e, t, xr, '', t.model);
          if (
            ((_n = o),
            (t.keyPath = null),
            (t.implicitSlot = !1),
            typeof o == 'object' && o !== null)
          )
            e.writtenObjects.set(o, Xe(t.id)), jl(e, t, o);
          else {
            var r = Wn(o);
            $l(e, t.id, r);
          }
          (t.status = 1), e.abortableTasks.delete(t), gr(e);
        } catch (u) {
          if (e.status === 12)
            if ((e.abortableTasks.delete(t), (t.status = 0), e.type === 21))
              co(t), uo(t, e);
            else {
              var s = e.fatalError;
              Ii(t), Si(t, e, s);
            }
          else {
            var i = u === wi ? Nl() : u;
            if (
              typeof i == 'object' &&
              i !== null &&
              typeof i.then == 'function'
            ) {
              (t.status = 0), (t.thenableState = Dl());
              var a = t.ping;
              i.then(a, a);
            } else cn(e, t, i);
          }
        } finally {
          xn = n;
        }
      }
    }
    function ql(e, t) {
      var n = xn;
      try {
        jl(e, t, t.model);
      } finally {
        xn = n;
      }
    }
    function ki(e) {
      var t = Un.H;
      Un.H = Ol;
      var n = De;
      Ro = De = e;
      try {
        var o = e.pingedTasks;
        e.pingedTasks = [];
        for (var r = 0; r < o.length; r++) Kl(e, o[r]);
        po(e);
      } catch (s) {
        ln(e, s, null), $o(e, s);
      } finally {
        (Un.H = t), (Ro = null), (De = n);
      }
    }
    function Ii(e) {
      e.status === 0 && (e.status = 3);
    }
    function Si(e, t, n) {
      e.status === 3 &&
        ((n = Xe(n)), (e = Fl(t, e.id, n)), t.completedErrorChunks.push(e));
    }
    function co(e) {
      e.status === 0 && (e.status = 3);
    }
    function uo(e, t) {
      e.status === 3 && t.pendingChunks--;
    }
    function po(e) {
      var t = e.destination;
      if (t !== null) {
        (Et = new Uint8Array(2048)), (At = 0);
        try {
          for (var n = e.completedImportChunks, o = 0; o < n.length; o++)
            e.pendingChunks--, dr(t, n[o]);
          n.splice(0, o);
          var r = e.completedHintChunks;
          for (o = 0; o < r.length; o++) dr(t, r[o]);
          r.splice(0, o);
          var s = e.completedRegularChunks;
          for (o = 0; o < s.length; o++) e.pendingChunks--, dr(t, s[o]);
          s.splice(0, o);
          var i = e.completedErrorChunks;
          for (o = 0; o < i.length; o++) e.pendingChunks--, dr(t, i[o]);
          i.splice(0, o);
        } finally {
          (e.flushScheduled = !1),
            Et &&
              0 < At &&
              (t.enqueue(new Uint8Array(Et.buffer, 0, At)),
              (Et = null),
              (At = 0));
        }
      }
      e.pendingChunks === 0 &&
        (12 > e.status &&
          e.cacheController.abort(
            Error(
              'This render completed successfully. All cacheSignals are now aborted to allow clean up of any unused resources.'
            )
          ),
        e.destination !== null &&
          ((e.status = 14), e.destination.close(), (e.destination = null)));
    }
    function Hl(e) {
      (e.flushScheduled = e.destination !== null),
        Cl(function () {
          return ki(e);
        }),
        Do(function () {
          e.status === 10 && (e.status = 11);
        });
    }
    function Pt(e) {
      e.flushScheduled === !1 &&
        e.pingedTasks.length === 0 &&
        e.destination !== null &&
        ((e.flushScheduled = !0),
        Do(function () {
          (e.flushScheduled = !1), po(e);
        }));
    }
    function gr(e) {
      e.abortableTasks.size === 0 && ((e = e.onAllReady), e());
    }
    function Ul(e, t) {
      if (e.status === 13) (e.status = 14), wl(t, e.fatalError);
      else if (e.status !== 14 && e.destination === null) {
        e.destination = t;
        try {
          po(e);
        } catch (n) {
          ln(e, n, null), $o(e, n);
        }
      }
    }
    function Df(e, t) {
      try {
        t.forEach(function (o) {
          return uo(o, e);
        });
        var n = e.onAllReady;
        n(), po(e);
      } catch (o) {
        ln(e, o, null), $o(e, o);
      }
    }
    function Of(e, t, n) {
      try {
        t.forEach(function (r) {
          return Si(r, e, n);
        });
        var o = e.onAllReady;
        o(), po(e);
      } catch (r) {
        ln(e, r, null), $o(e, r);
      }
    }
    function ao(e, t) {
      if (!(11 < e.status))
        try {
          (e.status = 12), e.cacheController.abort(t);
          var n = e.abortableTasks;
          if (0 < n.size)
            if (e.type === 21)
              n.forEach(function (a) {
                return co(a, e);
              }),
                Do(function () {
                  return Df(e, n);
                });
            else {
              var o =
                  t === void 0
                    ? Error(
                        'The render was aborted by the server without a reason.'
                      )
                    : typeof t == 'object' &&
                      t !== null &&
                      typeof t.then == 'function'
                    ? Error(
                        'The render was aborted by the server with a promise.'
                      )
                    : t,
                r = ln(e, o, null),
                s = e.nextChunkId++;
              (e.fatalError = s),
                e.pendingChunks++,
                _r(e, s, r, o, !1, null),
                n.forEach(function (a) {
                  return Ii(a, e, s);
                }),
                Do(function () {
                  return Of(e, n, s);
                });
            }
          else {
            var i = e.onAllReady;
            i(), po(e);
          }
        } catch (a) {
          ln(e, a, null), $o(e, a);
        }
    }
    function Wl(e, t) {
      var n = '',
        o = e[t];
      if (o) n = o.name;
      else {
        var r = t.lastIndexOf('#');
        if ((r !== -1 && ((n = t.slice(r + 1)), (o = e[t.slice(0, r)])), !o))
          throw Error(
            'Could not find the module "' +
              t +
              '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      return o.async ? [o.id, o.chunks, n, 1] : [o.id, o.chunks, n];
    }
    var fr = new Map();
    function yl(e) {
      var t = __webpack_require__(e);
      return typeof t.then != 'function' || t.status === 'fulfilled'
        ? null
        : (t.then(
            function (n) {
              (t.status = 'fulfilled'), (t.value = n);
            },
            function (n) {
              (t.status = 'rejected'), (t.reason = n);
            }
          ),
          t);
    }
    function Mf() {}
    function Vl(e) {
      for (var t = e[1], n = [], o = 0; o < t.length; ) {
        var r = t[o++],
          s = t[o++],
          i = fr.get(r);
        i === void 0
          ? (zl.set(r, s),
            (s = __webpack_chunk_load__(r)),
            n.push(s),
            (i = fr.set.bind(fr, r, null)),
            s.then(i, Mf),
            fr.set(r, s))
          : i !== null && n.push(i);
      }
      return e.length === 4
        ? n.length === 0
          ? yl(e[0])
          : Promise.all(n).then(function () {
              return yl(e[0]);
            })
        : 0 < n.length
        ? Promise.all(n)
        : null;
    }
    function No(e) {
      var t = __webpack_require__(e[0]);
      if (e.length === 4 && typeof t.then == 'function')
        if (t.status === 'fulfilled') t = t.value;
        else throw t.reason;
      if (e[2] === '*') return t;
      if (e[2] === '') return t.__esModule ? t.default : t;
      if (vr.call(t, e[2])) return t[e[2]];
    }
    var zl = new Map(),
      Lf = __webpack_require__.u;
    __webpack_require__.u = function (e) {
      var t = zl.get(e);
      return t !== void 0 ? t : Lf(e);
    };
    var Cr = Symbol();
    function nt(e, t, n) {
      (this.status = e), (this.value = t), (this.reason = n);
    }
    nt.prototype = Object.create(Promise.prototype);
    nt.prototype.then = function (e, t) {
      switch (this.status) {
        case 'resolved_model':
          Sr(this);
      }
      switch (this.status) {
        case 'fulfilled':
          if (typeof e == 'function') {
            for (var n = this.value, o = 0, r = new Set(); n instanceof nt; ) {
              if ((o++, n === this || r.has(n) || 1e3 < o)) {
                typeof t == 'function' &&
                  t(Error('Cannot have cyclic thenables.'));
                return;
              }
              if ((r.add(n), n.status === 'fulfilled')) n = n.value;
              else break;
            }
            e(this.value);
          }
          break;
        case 'pending':
        case 'blocked':
          typeof e == 'function' &&
            (this.value === null && (this.value = []), this.value.push(e)),
            typeof t == 'function' &&
              (this.reason === null && (this.reason = []), this.reason.push(t));
          break;
        default:
          typeof t == 'function' && t(this.reason);
      }
    };
    var Xl = Object.prototype,
      Yl = Array.prototype;
    function wr(e, t, n, o) {
      for (var r = 0; r < t.length; r++) {
        var s = t[r];
        typeof s == 'function' ? s(n) : Ql(e, s, n, o.reason);
      }
    }
    function bi(e, t, n) {
      for (var o = 0; o < t.length; o++) {
        var r = t[o];
        typeof r == 'function' ? r(n) : kr(e, r.handler, n);
      }
    }
    function Ir(e, t, n) {
      if (t.status !== 'pending' && t.status !== 'blocked') t.reason.error(n);
      else {
        var o = t.reason;
        (t.status = 'rejected'), (t.reason = n), o !== null && bi(e, o, n);
      }
    }
    function Gl(e, t, n) {
      var o = {};
      return new nt('resolved_model', t, ((o.id = n), (o[Cr] = e), o));
    }
    function Jl(e, t, n, o) {
      if (t.status !== 'pending')
        (t = t.reason),
          n[0] === 'C'
            ? t.close(n === 'C' ? '"$undefined"' : n.slice(1))
            : t.enqueueModel(n);
      else {
        var r = t.value,
          s = t.reason;
        if (
          ((t.status = 'resolved_model'),
          (t.value = n),
          (n = {}),
          (t.reason = ((n.id = o), (n[Cr] = e), n)),
          r !== null)
        )
          switch ((Sr(t), t.status)) {
            case 'fulfilled':
              wr(e, r, t.value, t);
              break;
            case 'blocked':
            case 'pending':
              if (t.value) for (e = 0; e < r.length; e++) t.value.push(r[e]);
              else t.value = r;
              if (t.reason) {
                if (s) for (r = 0; r < s.length; r++) t.reason.push(s[r]);
              } else t.reason = s;
              break;
            case 'rejected':
              s && bi(e, s, t.reason);
          }
      }
    }
    function ml(e, t, n) {
      var o = {};
      return new nt(
        'resolved_model',
        (n ? '{"done":true,"value":' : '{"done":false,"value":') + t + '}',
        ((o.id = -1), (o[Cr] = e), o)
      );
    }
    function fi(e, t, n, o) {
      Jl(
        e,
        t,
        (o ? '{"done":true,"value":' : '{"done":false,"value":') + n + '}',
        -1
      );
    }
    function Ff(e, t, n, o) {
      function r(v) {
        var _ = a.reason,
          x = a;
        (x.status = 'rejected'),
          (x.value = null),
          (x.reason = v),
          _ !== null && bi(e, _, v),
          kr(e, h, v);
      }
      var s = t.id;
      if (typeof s != 'string' || o === 'then') return null;
      var i = t.$$promise;
      if (i !== void 0)
        return i.status === 'fulfilled'
          ? ((i = i.value), o === '__proto__' ? null : (n[o] = i))
          : (Ee
              ? ((s = Ee), s.deps++)
              : (s = Ee =
                  {
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: !1,
                  }),
            i.then(_i.bind(null, e, s, n, o), kr.bind(null, e, s)),
            null);
      var a = new nt('blocked', null, null);
      t.$$promise = a;
      var u = Wl(e._bundlerConfig, s);
      if (((i = t.bound), (s = Vl(u))))
        i instanceof nt && (s = Promise.all([s, i]));
      else if (i instanceof nt) s = Promise.resolve(i);
      else return (i = No(u)), (s = a), (s.status = 'fulfilled'), (s.value = i);
      if (Ee) {
        var h = Ee;
        h.deps++;
      } else
        h = Ee = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        s.then(function () {
          var v = No(u);
          if (t.bound) {
            var _ = t.bound.value;
            if (((_ = Kt(_) ? _.slice(0) : []), 1e3 < _.length)) {
              r(
                Error(
                  'Server Function has too many bound arguments. Received ' +
                    _.length +
                    ' but the limit is 1000.'
                )
              );
              return;
            }
            _.unshift(null), (v = v.bind.apply(v, _));
          }
          _ = a.value;
          var x = a;
          (x.status = 'fulfilled'),
            (x.value = v),
            (x.reason = null),
            _ !== null && wr(e, _, v, x),
            _i(e, h, n, o, v);
        }, r),
        null
      );
    }
    function vi(e, t, n, o, r, s) {
      if (typeof o == 'string') return Hf(e, t, n, o, r, s);
      if (typeof o == 'object' && o !== null)
        if (
          (r !== void 0 &&
            e._temporaryReferences !== void 0 &&
            e._temporaryReferences.set(o, r),
          Kt(o))
        ) {
          if (s === null) {
            var i = {count: 0, fork: !1};
            e._rootArrayContexts.set(o, i);
          } else i = s;
          for (
            1 < o.length && (i.fork = !0), sn(i, o.length + 1, e), t = 0;
            t < o.length;
            t++
          )
            o[t] = vi(
              e,
              o,
              '' + t,
              o[t],
              r !== void 0 ? r + ':' + t : void 0,
              i
            );
        } else
          for (i in o)
            vr.call(o, i) &&
              (i === '__proto__'
                ? delete o[i]
                : ((t =
                    r !== void 0 && i.indexOf(':') === -1
                      ? r + ':' + i
                      : void 0),
                  (t = vi(e, o, i, o[i], t, null)),
                  t !== void 0 ? (o[i] = t) : delete o[i]));
      return o;
    }
    function sn(e, t, n) {
      if ((e.count += t) > n._arraySizeLimit && e.fork)
        throw Error(
          'Maximum array nesting exceeded. Large nested arrays can be dangerous. Try adding intermediate objects.'
        );
    }
    var Ee = null;
    function Sr(e) {
      var t = Ee;
      Ee = null;
      var n = e.reason,
        o = n[Cr];
      (n = n.id), (n = n === -1 ? void 0 : n.toString(16));
      var r = e.value;
      (e.status = 'blocked'), (e.value = null), (e.reason = null);
      try {
        var s = JSON.parse(r);
        r = {count: 0, fork: !1};
        var i = vi(o, {'': s}, '', s, n, r),
          a = e.value;
        if (a !== null)
          for (e.value = null, e.reason = null, s = 0; s < a.length; s++) {
            var u = a[s];
            typeof u == 'function' ? u(i) : Ql(o, u, i, r);
          }
        if (Ee !== null) {
          if (Ee.errored) throw Ee.reason;
          if (0 < Ee.deps) {
            (Ee.value = i), (Ee.reason = r), (Ee.chunk = e);
            return;
          }
        }
        (e.status = 'fulfilled'), (e.value = i), (e.reason = r);
      } catch (h) {
        (e.status = 'rejected'), (e.reason = h);
      } finally {
        Ee = t;
      }
    }
    function $f(e, t) {
      (e._closed = !0),
        (e._closedReason = t),
        e._chunks.forEach(function (n) {
          n.status === 'pending'
            ? Ir(e, n, t)
            : n.status === 'fulfilled' &&
              n.reason !== null &&
              ((n = n.reason), typeof n.error == 'function' && n.error(t));
        });
    }
    function br(e, t) {
      var n = e._chunks,
        o = n.get(t);
      return (
        o ||
          ((o = e._formData.get(e._prefix + t)),
          (o =
            typeof o == 'string'
              ? Gl(e, o, t)
              : e._closed
              ? new nt('rejected', null, e._closedReason)
              : new nt('pending', null, null)),
          n.set(t, o)),
        o
      );
    }
    function Ql(e, t, n, o) {
      var r = t.handler,
        s = t.parentObject,
        i = t.key,
        a = t.map,
        u = t.path;
      try {
        for (var h = 0, v = e._rootArrayContexts, _ = 1; _ < u.length; _++) {
          var x = u[_];
          if (
            typeof n != 'object' ||
            n === null ||
            (lo(n) !== Xl && lo(n) !== Yl) ||
            !vr.call(n, x)
          )
            throw Error('Invalid reference.');
          if (((n = n[x]), Kt(n))) (h = 0), (o = v.get(n) || o);
          else if (((o = null), typeof n == 'string')) h = n.length;
          else if (typeof n == 'bigint') {
            var L = Math.abs(Number(n));
            h = L === 0 ? 1 : Math.floor(Math.log10(L)) + 1;
          } else h = ArrayBuffer.isView(n) ? n.byteLength : 0;
        }
        var G = a(e, n, s, i),
          F = t.arrayRoot;
        F !== null &&
          (o !== null
            ? (o.fork && (F.fork = !0), sn(F, o.count, e))
            : 0 < h && sn(F, h, e));
      } catch (K) {
        kr(e, r, K);
        return;
      }
      _i(e, r, s, i, G);
    }
    function _i(e, t, n, o, r) {
      o !== '__proto__' && (n[o] = r),
        o === '' && t.value === null && (t.value = r),
        t.deps--,
        t.deps === 0 &&
          ((n = t.chunk),
          n !== null &&
            n.status === 'blocked' &&
            ((o = n.value),
            (n.status = 'fulfilled'),
            (n.value = t.value),
            (n.reason = t.reason),
            o !== null && wr(e, o, t.value, n)));
    }
    function kr(e, t, n) {
      t.errored ||
        ((t.errored = !0),
        (t.value = null),
        (t.reason = n),
        (t = t.chunk),
        t !== null && t.status === 'blocked' && Ir(e, t, n));
    }
    function Po(e, t, n, o, r, s) {
      t = t.split(':');
      var i = parseInt(t[0], 16),
        a = br(e, i);
      switch (a.status) {
        case 'resolved_model':
          Sr(a);
      }
      switch (a.status) {
        case 'fulfilled':
          (i = a.value), (a = a.reason);
          for (var u = 0, h = e._rootArrayContexts, v = 1; v < t.length; v++) {
            if (
              ((u = t[v]),
              typeof i != 'object' ||
                i === null ||
                (lo(i) !== Xl && lo(i) !== Yl) ||
                !vr.call(i, u))
            )
              throw Error('Invalid reference.');
            (i = i[u]),
              Kt(i)
                ? ((u = 0), (a = h.get(i) || a))
                : ((a = null),
                  typeof i == 'string'
                    ? (u = i.length)
                    : typeof i == 'bigint'
                    ? ((u = Math.abs(Number(i))),
                      (u = u === 0 ? 1 : Math.floor(Math.log10(u)) + 1))
                    : (u = ArrayBuffer.isView(i) ? i.byteLength : 0));
          }
          return (
            (n = s(e, i, n, o)),
            r !== null &&
              (a !== null
                ? (a.fork && (r.fork = !0), sn(r, a.count, e))
                : 0 < u && sn(r, u, e)),
            n
          );
        case 'blocked':
          return (
            Ee
              ? ((e = Ee), e.deps++)
              : (e = Ee =
                  {
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: !1,
                  }),
            (r = {
              handler: e,
              parentObject: n,
              key: o,
              map: s,
              path: t,
              arrayRoot: r,
            }),
            a.value === null ? (a.value = [r]) : a.value.push(r),
            a.reason === null ? (a.reason = [r]) : a.reason.push(r),
            null
          );
        case 'pending':
          throw Error('Invalid forward reference.');
        default:
          return (
            Ee
              ? ((Ee.errored = !0), (Ee.value = null), (Ee.reason = a.reason))
              : (Ee = {
                  chunk: null,
                  value: null,
                  reason: a.reason,
                  deps: 0,
                  errored: !0,
                }),
            null
          );
      }
    }
    function Bf(e, t) {
      if (!Kt(t)) throw Error('Invalid Map initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Map.');
      return (e = new Map(t)), (t.$$consumed = !0), e;
    }
    function jf(e, t) {
      if (!Kt(t)) throw Error('Invalid Set initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Set.');
      return (e = new Set(t)), (t.$$consumed = !0), e;
    }
    function Kf(e, t) {
      if (!Kt(t)) throw Error('Invalid Iterator initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Iterator.');
      return (e = t[Symbol.iterator]()), (t.$$consumed = !0), e;
    }
    function qf(e, t, n, o) {
      return o === 'then' && typeof t == 'function' ? null : t;
    }
    function xt(e, t, n, o, r, s, i) {
      function a(v) {
        if (!h.errored) {
          (h.errored = !0), (h.value = null), (h.reason = v);
          var _ = h.chunk;
          _ !== null && _.status === 'blocked' && Ir(e, _, v);
        }
      }
      t = parseInt(t.slice(2), 16);
      var u = e._prefix + t;
      if (((o = e._chunks), o.has(t)))
        throw Error('Already initialized typed array.');
      if (
        (o.set(
          t,
          new nt('rejected', null, Error('Already initialized typed array.'))
        ),
        (t = e._formData.get(u).arrayBuffer()),
        Ee)
      ) {
        var h = Ee;
        h.deps++;
      } else
        h = Ee = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        t.then(function (v) {
          try {
            i !== null && sn(i, v.byteLength, e);
            var _ = n === ArrayBuffer ? v : new n(v);
            u !== '__proto__' && (r[s] = _),
              s === '' && h.value === null && (h.value = _);
          } catch (x) {
            a(x);
            return;
          }
          h.deps--,
            h.deps === 0 &&
              ((v = h.chunk),
              v !== null &&
                v.status === 'blocked' &&
                ((_ = v.value),
                (v.status = 'fulfilled'),
                (v.value = h.value),
                (v.reason = null),
                _ !== null && wr(e, _, h.value, v)));
        }, a),
        null
      );
    }
    function Zl(e, t, n, o) {
      var r = e._chunks;
      for (
        n = new nt('fulfilled', n, o),
          r.set(t, n),
          e = e._formData.getAll(e._prefix + t),
          t = 0;
        t < e.length;
        t++
      )
        (r = e[t]),
          typeof r == 'string' &&
            (r[0] === 'C'
              ? o.close(r === 'C' ? '"$undefined"' : r.slice(1))
              : o.enqueueModel(r));
    }
    function kl(e, t, n) {
      function o(h) {
        n !== 'bytes' || ArrayBuffer.isView(h)
          ? r.enqueue(h)
          : u.error(Error('Invalid data for bytes stream.'));
      }
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error('Already initialized stream.');
      var r = null,
        s = !1,
        i = new ReadableStream({
          type: n,
          start: function (h) {
            r = h;
          },
        }),
        a = null,
        u = {
          enqueueModel: function (h) {
            if (a === null) {
              var v = Gl(e, h, -1);
              Sr(v),
                v.status === 'fulfilled'
                  ? o(v.value)
                  : (v.then(o, u.error), (a = v));
            } else {
              v = a;
              var _ = new nt('pending', null, null);
              _.then(o, u.error),
                (a = _),
                v.then(function () {
                  a === _ && (a = null), Jl(e, _, h, -1);
                });
            }
          },
          close: function () {
            if (!s)
              if (((s = !0), a === null)) r.close();
              else {
                var h = a;
                (a = null),
                  h.then(function () {
                    return r.close();
                  });
              }
          },
          error: function (h) {
            if (!s)
              if (((s = !0), a === null)) r.error(h);
              else {
                var v = a;
                (a = null),
                  v.then(function () {
                    return r.error(h);
                  });
              }
          },
        };
      return Zl(e, t, i, u), i;
    }
    function Ei(e) {
      this.next = e;
    }
    Ei.prototype = {};
    Ei.prototype[Hn] = function () {
      return this;
    };
    function vl(e, t, n) {
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error('Already initialized stream.');
      var o = [],
        r = !1,
        s = 0,
        i = {};
      return (
        (i =
          ((i[Hn] = function () {
            var a = 0;
            return new Ei(function (u) {
              if (u !== void 0)
                throw Error(
                  'Values cannot be passed to next() of AsyncIterables passed to Client Components.'
                );
              if (a === o.length) {
                if (r)
                  return new nt('fulfilled', {done: !0, value: void 0}, null);
                o[a] = new nt('pending', null, null);
              }
              return o[a++];
            });
          }),
          i)),
        (n = n ? i[Hn]() : i),
        Zl(e, t, n, {
          enqueueModel: function (a) {
            s === o.length ? (o[s] = ml(e, a, !1)) : fi(e, o[s], a, !1), s++;
          },
          close: function (a) {
            if (!r)
              for (
                r = !0,
                  s === o.length ? (o[s] = ml(e, a, !0)) : fi(e, o[s], a, !0),
                  s++;
                s < o.length;

              )
                fi(e, o[s++], '"$undefined"', !0);
          },
          error: function (a) {
            if (!r)
              for (
                r = !0,
                  s === o.length && (o[s] = new nt('pending', null, null));
                s < o.length;

              )
                Ir(e, o[s++], a);
          },
        }),
        n
      );
    }
    function Hf(e, t, n, o, r, s) {
      if (o[0] === '$') {
        switch (o[1]) {
          case '$':
            return s !== null && sn(s, o.length - 1, e), o.slice(1);
          case '@':
            return (t = parseInt(o.slice(2), 16)), br(e, t);
          case 'h':
            return (s = o.slice(2)), Po(e, s, t, n, null, Ff);
          case 'T':
            if (r === void 0 || e._temporaryReferences === void 0)
              throw Error(
                'Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server.'
              );
            return yf(e._temporaryReferences, r);
          case 'Q':
            return (s = o.slice(2)), Po(e, s, t, n, null, Bf);
          case 'W':
            return (s = o.slice(2)), Po(e, s, t, n, null, jf);
          case 'K':
            for (
              t = o.slice(2),
                t = e._prefix + t + '_',
                n = new FormData(),
                e = e._formData,
                s = Array.from(e.keys()),
                o = 0;
              o < s.length;
              o++
            )
              if (((r = s[o]), r.startsWith(t))) {
                for (
                  var i = e.getAll(r), a = r.slice(t.length), u = 0;
                  u < i.length;
                  u++
                )
                  n.append(a, i[u]);
                e.delete(r);
              }
            return n;
          case 'i':
            return (s = o.slice(2)), Po(e, s, t, n, null, Kf);
          case 'I':
            return 1 / 0;
          case '-':
            return o === '$-0' ? -0 : -1 / 0;
          case 'N':
            return NaN;
          case 'u':
            return;
          case 'D':
            return new Date(Date.parse(o.slice(2)));
          case 'n':
            if (((t = o.slice(2)), 300 < t.length))
              throw Error(
                'BigInt is too large. Received ' +
                  t.length +
                  ' digits but the limit is 300.'
              );
            return s !== null && sn(s, t.length, e), BigInt(t);
          case 'A':
            return xt(e, o, ArrayBuffer, 1, t, n, s);
          case 'O':
            return xt(e, o, Int8Array, 1, t, n, s);
          case 'o':
            return xt(e, o, Uint8Array, 1, t, n, s);
          case 'U':
            return xt(e, o, Uint8ClampedArray, 1, t, n, s);
          case 'S':
            return xt(e, o, Int16Array, 2, t, n, s);
          case 's':
            return xt(e, o, Uint16Array, 2, t, n, s);
          case 'L':
            return xt(e, o, Int32Array, 4, t, n, s);
          case 'l':
            return xt(e, o, Uint32Array, 4, t, n, s);
          case 'G':
            return xt(e, o, Float32Array, 4, t, n, s);
          case 'g':
            return xt(e, o, Float64Array, 8, t, n, s);
          case 'M':
            return xt(e, o, BigInt64Array, 8, t, n, s);
          case 'm':
            return xt(e, o, BigUint64Array, 8, t, n, s);
          case 'V':
            return xt(e, o, DataView, 1, t, n, s);
          case 'B':
            return (
              (t = parseInt(o.slice(2), 16)), e._formData.get(e._prefix + t)
            );
          case 'R':
            return kl(e, o, void 0);
          case 'r':
            return kl(e, o, 'bytes');
          case 'X':
            return vl(e, o, !1);
          case 'x':
            return vl(e, o, !0);
        }
        return (o = o.slice(1)), Po(e, o, t, n, s, qf);
      }
      return s !== null && sn(s, o.length, e), o;
    }
    function ec(e, t, n) {
      var o =
          3 < arguments.length && arguments[3] !== void 0
            ? arguments[3]
            : new FormData(),
        r =
          4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : 1e6,
        s = new Map();
      return {
        _bundlerConfig: e,
        _prefix: t,
        _formData: o,
        _chunks: s,
        _closed: !1,
        _closedReason: null,
        _temporaryReferences: n,
        _rootArrayContexts: new WeakMap(),
        _arraySizeLimit: r,
      };
    }
    function tc(e) {
      $f(e, Error('Connection closed.'));
    }
    function _l(e, t) {
      var n = t.id;
      if (typeof n != 'string') return null;
      var o = Wl(e, n);
      return (
        (e = Vl(o)),
        (t = t.bound),
        t instanceof Promise
          ? Promise.all([t, e]).then(function (r) {
              r = r[0];
              var s = No(o);
              if (1e3 < r.length)
                throw Error(
                  'Server Function has too many bound arguments. Received ' +
                    r.length +
                    ' but the limit is 1000.'
                );
              return s.bind.apply(s, [null].concat(r));
            })
          : e
          ? Promise.resolve(e).then(function () {
              return No(o);
            })
          : Promise.resolve(No(o))
      );
    }
    function nc(e, t, n, o) {
      if (
        ((e = ec(t, n, void 0, e, o)),
        tc(e),
        (e = br(e, 0)),
        e.then(function () {}),
        e.status !== 'fulfilled')
      )
        throw e.reason;
      return e.value;
    }
    Gt.createClientModuleProxy = function (e) {
      return (e = so({}, e, !1)), new Proxy(e, Sl);
    };
    Gt.createTemporaryReferenceSet = function () {
      return new WeakMap();
    };
    Gt.decodeAction = function (e, t) {
      var n = new FormData(),
        o = null,
        r = new Set();
      return (
        e.forEach(function (s, i) {
          i.startsWith('$ACTION_')
            ? i.startsWith('$ACTION_REF_')
              ? r.has(i) ||
                (r.add(i),
                (s = '$ACTION_' + i.slice(12) + ':'),
                (s = nc(e, t, s)),
                (o = _l(t, s)))
              : i.startsWith('$ACTION_ID_') &&
                !r.has(i) &&
                (r.add(i), (s = i.slice(11)), (o = _l(t, {id: s, bound: null})))
            : n.append(i, s);
        }),
        o === null
          ? null
          : o.then(function (s) {
              return s.bind(null, n);
            })
      );
    };
    Gt.decodeFormState = function (e, t, n) {
      var o = t.get('$ACTION_KEY');
      if (typeof o != 'string') return Promise.resolve(null);
      var r = null;
      if (
        (t.forEach(function (i, a) {
          a.startsWith('$ACTION_REF_') &&
            ((i = '$ACTION_' + a.slice(12) + ':'), (r = nc(t, n, i)));
        }),
        r === null)
      )
        return Promise.resolve(null);
      var s = r.id;
      return Promise.resolve(r.bound).then(function (i) {
        return i === null ? null : [e, o, s, i.length - 1];
      });
    };
    Gt.decodeReply = function (e, t, n) {
      if (typeof e == 'string') {
        var o = new FormData();
        o.append('0', e), (e = o);
      }
      return (
        (e = ec(
          t,
          '',
          n ? n.temporaryReferences : void 0,
          e,
          n ? n.arraySizeLimit : void 0
        )),
        (t = br(e, 0)),
        tc(e),
        t
      );
    };
    Gt.prerender = function (e, t, n) {
      return new Promise(function (o, r) {
        var s = new Ll(
          21,
          e,
          t,
          n ? n.onError : void 0,
          n ? n.onPostpone : void 0,
          function () {
            var u = new ReadableStream(
              {
                type: 'bytes',
                pull: function (h) {
                  Ul(s, h);
                },
                cancel: function (h) {
                  (s.destination = null), ao(s, h);
                },
              },
              {highWaterMark: 0}
            );
            o({prelude: u});
          },
          r,
          n ? n.identifierPrefix : void 0,
          n ? n.temporaryReferences : void 0
        );
        if (n && n.signal) {
          var i = n.signal;
          if (i.aborted) ao(s, i.reason);
          else {
            var a = function () {
              ao(s, i.reason), i.removeEventListener('abort', a);
            };
            i.addEventListener('abort', a);
          }
        }
        Hl(s);
      });
    };
    Gt.registerClientReference = function (e, t, n) {
      return so(e, t + '#' + n, !1);
    };
    Gt.registerServerReference = function (e, t, n) {
      return Object.defineProperties(e, {
        $$typeof: {value: mr},
        $$id: {value: n === null ? t : t + '#' + n, configurable: !0},
        $$bound: {value: null, configurable: !0},
        bind: {value: Il, configurable: !0},
        toString: sf,
      });
    };
    Gt.renderToReadableStream = function (e, t, n) {
      var o = new Ll(
        20,
        e,
        t,
        n ? n.onError : void 0,
        n ? n.onPostpone : void 0,
        Kn,
        Kn,
        n ? n.identifierPrefix : void 0,
        n ? n.temporaryReferences : void 0
      );
      if (n && n.signal) {
        var r = n.signal;
        if (r.aborted) ao(o, r.reason);
        else {
          var s = function () {
            ao(o, r.reason), r.removeEventListener('abort', s);
          };
          r.addEventListener('abort', s);
        }
      }
      return new ReadableStream(
        {
          type: 'bytes',
          start: function () {
            Hl(o);
          },
          pull: function (i) {
            Ul(o, i);
          },
          cancel: function (i) {
            (o.destination = null), ao(o, i);
          },
        },
        {highWaterMark: 0}
      );
    };
  });
  var rc = H((pn) => {
    'use strict';
    var un;
    un = oc();
    pn.renderToReadableStream = un.renderToReadableStream;
    pn.decodeReply = un.decodeReply;
    pn.decodeAction = un.decodeAction;
    pn.decodeFormState = un.decodeFormState;
    pn.registerServerReference = un.registerServerReference;
    pn.registerClientReference = un.registerClientReference;
    pn.createClientModuleProxy = un.createClientModuleProxy;
    pn.createTemporaryReferenceSet = un.createTemporaryReferenceSet;
  });
  var Ge = H((Ai) => {
    'use strict';
    Object.defineProperty(Ai, '__esModule', {value: !0});
    var sc;
    (function (e) {
      e[(e.NONE = 0)] = 'NONE';
      let n = 1;
      e[(e._abstract = n)] = '_abstract';
      let o = n + 1;
      e[(e._accessor = o)] = '_accessor';
      let r = o + 1;
      e[(e._as = r)] = '_as';
      let s = r + 1;
      e[(e._assert = s)] = '_assert';
      let i = s + 1;
      e[(e._asserts = i)] = '_asserts';
      let a = i + 1;
      e[(e._async = a)] = '_async';
      let u = a + 1;
      e[(e._await = u)] = '_await';
      let h = u + 1;
      e[(e._checks = h)] = '_checks';
      let v = h + 1;
      e[(e._constructor = v)] = '_constructor';
      let _ = v + 1;
      e[(e._declare = _)] = '_declare';
      let x = _ + 1;
      e[(e._enum = x)] = '_enum';
      let L = x + 1;
      e[(e._exports = L)] = '_exports';
      let G = L + 1;
      e[(e._from = G)] = '_from';
      let F = G + 1;
      e[(e._get = F)] = '_get';
      let K = F + 1;
      e[(e._global = K)] = '_global';
      let R = K + 1;
      e[(e._implements = R)] = '_implements';
      let z = R + 1;
      e[(e._infer = z)] = '_infer';
      let $ = z + 1;
      e[(e._interface = $)] = '_interface';
      let O = $ + 1;
      e[(e._is = O)] = '_is';
      let A = O + 1;
      e[(e._keyof = A)] = '_keyof';
      let M = A + 1;
      e[(e._mixins = M)] = '_mixins';
      let B = M + 1;
      e[(e._module = B)] = '_module';
      let oe = B + 1;
      e[(e._namespace = oe)] = '_namespace';
      let ne = oe + 1;
      e[(e._of = ne)] = '_of';
      let re = ne + 1;
      e[(e._opaque = re)] = '_opaque';
      let Le = re + 1;
      e[(e._out = Le)] = '_out';
      let Fe = Le + 1;
      e[(e._override = Fe)] = '_override';
      let mt = Fe + 1;
      e[(e._private = mt)] = '_private';
      let kt = mt + 1;
      e[(e._protected = kt)] = '_protected';
      let Qe = kt + 1;
      e[(e._proto = Qe)] = '_proto';
      let vt = Qe + 1;
      e[(e._public = vt)] = '_public';
      let it = vt + 1;
      e[(e._readonly = it)] = '_readonly';
      let ct = it + 1;
      e[(e._require = ct)] = '_require';
      let Ze = ct + 1;
      e[(e._satisfies = Ze)] = '_satisfies';
      let ut = Ze + 1;
      e[(e._set = ut)] = '_set';
      let Ft = ut + 1;
      e[(e._static = Ft)] = '_static';
      let Vt = Ft + 1;
      e[(e._symbol = Vt)] = '_symbol';
      let $t = Vt + 1;
      e[(e._type = $t)] = '_type';
      let Bt = $t + 1;
      e[(e._unique = Bt)] = '_unique';
      let on = Bt + 1;
      e[(e._using = on)] = '_using';
    })(sc || (Ai.ContextualKeyword = sc = {}));
  });
  var ce = H((Er) => {
    'use strict';
    Object.defineProperty(Er, '__esModule', {value: !0});
    var b;
    (function (e) {
      e[(e.PRECEDENCE_MASK = 15)] = 'PRECEDENCE_MASK';
      let n = 16;
      e[(e.IS_KEYWORD = n)] = 'IS_KEYWORD';
      let o = 32;
      e[(e.IS_ASSIGN = o)] = 'IS_ASSIGN';
      let r = 64;
      e[(e.IS_RIGHT_ASSOCIATIVE = r)] = 'IS_RIGHT_ASSOCIATIVE';
      let s = 128;
      e[(e.IS_PREFIX = s)] = 'IS_PREFIX';
      let i = 256;
      e[(e.IS_POSTFIX = i)] = 'IS_POSTFIX';
      let a = 512;
      e[(e.IS_EXPRESSION_START = a)] = 'IS_EXPRESSION_START';
      let u = 512;
      e[(e.num = u)] = 'num';
      let h = 1536;
      e[(e.bigint = h)] = 'bigint';
      let v = 2560;
      e[(e.decimal = v)] = 'decimal';
      let _ = 3584;
      e[(e.regexp = _)] = 'regexp';
      let x = 4608;
      e[(e.string = x)] = 'string';
      let L = 5632;
      e[(e.name = L)] = 'name';
      let G = 6144;
      e[(e.eof = G)] = 'eof';
      let F = 7680;
      e[(e.bracketL = F)] = 'bracketL';
      let K = 8192;
      e[(e.bracketR = K)] = 'bracketR';
      let R = 9728;
      e[(e.braceL = R)] = 'braceL';
      let z = 10752;
      e[(e.braceBarL = z)] = 'braceBarL';
      let $ = 11264;
      e[(e.braceR = $)] = 'braceR';
      let O = 12288;
      e[(e.braceBarR = O)] = 'braceBarR';
      let A = 13824;
      e[(e.parenL = A)] = 'parenL';
      let M = 14336;
      e[(e.parenR = M)] = 'parenR';
      let B = 15360;
      e[(e.comma = B)] = 'comma';
      let oe = 16384;
      e[(e.semi = oe)] = 'semi';
      let ne = 17408;
      e[(e.colon = ne)] = 'colon';
      let re = 18432;
      e[(e.doubleColon = re)] = 'doubleColon';
      let Le = 19456;
      e[(e.dot = Le)] = 'dot';
      let Fe = 20480;
      e[(e.question = Fe)] = 'question';
      let mt = 21504;
      e[(e.questionDot = mt)] = 'questionDot';
      let kt = 22528;
      e[(e.arrow = kt)] = 'arrow';
      let Qe = 23552;
      e[(e.template = Qe)] = 'template';
      let vt = 24576;
      e[(e.ellipsis = vt)] = 'ellipsis';
      let it = 25600;
      e[(e.backQuote = it)] = 'backQuote';
      let ct = 27136;
      e[(e.dollarBraceL = ct)] = 'dollarBraceL';
      let Ze = 27648;
      e[(e.at = Ze)] = 'at';
      let ut = 29184;
      e[(e.hash = ut)] = 'hash';
      let Ft = 29728;
      e[(e.eq = Ft)] = 'eq';
      let Vt = 30752;
      e[(e.assign = Vt)] = 'assign';
      let $t = 32640;
      e[(e.preIncDec = $t)] = 'preIncDec';
      let Bt = 33664;
      e[(e.postIncDec = Bt)] = 'postIncDec';
      let on = 34432;
      e[(e.bang = on)] = 'bang';
      let I = 35456;
      e[(e.tilde = I)] = 'tilde';
      let D = 35841;
      e[(e.pipeline = D)] = 'pipeline';
      let j = 36866;
      e[(e.nullishCoalescing = j)] = 'nullishCoalescing';
      let Y = 37890;
      e[(e.logicalOR = Y)] = 'logicalOR';
      let le = 38915;
      e[(e.logicalAND = le)] = 'logicalAND';
      let Q = 39940;
      e[(e.bitwiseOR = Q)] = 'bitwiseOR';
      let ke = 40965;
      e[(e.bitwiseXOR = ke)] = 'bitwiseXOR';
      let ge = 41990;
      e[(e.bitwiseAND = ge)] = 'bitwiseAND';
      let Ce = 43015;
      e[(e.equality = Ce)] = 'equality';
      let We = 44040;
      e[(e.lessThan = We)] = 'lessThan';
      let $e = 45064;
      e[(e.greaterThan = $e)] = 'greaterThan';
      let Ne = 46088;
      e[(e.relationalOrEqual = Ne)] = 'relationalOrEqual';
      let Ye = 47113;
      e[(e.bitShiftL = Ye)] = 'bitShiftL';
      let et = 48137;
      e[(e.bitShiftR = et)] = 'bitShiftR';
      let pt = 49802;
      e[(e.plus = pt)] = 'plus';
      let zt = 50826;
      e[(e.minus = zt)] = 'minus';
      let tt = 51723;
      e[(e.modulo = tt)] = 'modulo';
      let Fn = 52235;
      e[(e.star = Fn)] = 'star';
      let Qn = 53259;
      e[(e.slash = Qn)] = 'slash';
      let bo = 54348;
      e[(e.exponent = bo)] = 'exponent';
      let Zn = 55296;
      e[(e.jsxName = Zn)] = 'jsxName';
      let $n = 56320;
      e[(e.jsxText = $n)] = 'jsxText';
      let jt = 57344;
      e[(e.jsxEmptyText = jt)] = 'jsxEmptyText';
      let kn = 58880;
      e[(e.jsxTagStart = kn)] = 'jsxTagStart';
      let eo = 59392;
      e[(e.jsxTagEnd = eo)] = 'jsxTagEnd';
      let to = 60928;
      e[(e.typeParameterStart = to)] = 'typeParameterStart';
      let no = 61440;
      e[(e.nonNullAssertion = no)] = 'nonNullAssertion';
      let Is = 62480;
      e[(e._break = Is)] = '_break';
      let Ss = 63504;
      e[(e._case = Ss)] = '_case';
      let bs = 64528;
      e[(e._catch = bs)] = '_catch';
      let Es = 65552;
      e[(e._continue = Es)] = '_continue';
      let As = 66576;
      e[(e._debugger = As)] = '_debugger';
      let Ps = 67600;
      e[(e._default = Ps)] = '_default';
      let Rs = 68624;
      e[(e._do = Rs)] = '_do';
      let Ns = 69648;
      e[(e._else = Ns)] = '_else';
      let Ds = 70672;
      e[(e._finally = Ds)] = '_finally';
      let Os = 71696;
      e[(e._for = Os)] = '_for';
      let Ms = 73232;
      e[(e._function = Ms)] = '_function';
      let Ls = 73744;
      e[(e._if = Ls)] = '_if';
      let Fs = 74768;
      e[(e._return = Fs)] = '_return';
      let $s = 75792;
      e[(e._switch = $s)] = '_switch';
      let Bs = 77456;
      e[(e._throw = Bs)] = '_throw';
      let js = 77840;
      e[(e._try = js)] = '_try';
      let Ks = 78864;
      e[(e._var = Ks)] = '_var';
      let qs = 79888;
      e[(e._let = qs)] = '_let';
      let Hs = 80912;
      e[(e._const = Hs)] = '_const';
      let Us = 81936;
      e[(e._while = Us)] = '_while';
      let Ws = 82960;
      e[(e._with = Ws)] = '_with';
      let Vs = 84496;
      e[(e._new = Vs)] = '_new';
      let zs = 85520;
      e[(e._this = zs)] = '_this';
      let Xs = 86544;
      e[(e._super = Xs)] = '_super';
      let Ys = 87568;
      e[(e._class = Ys)] = '_class';
      let Gs = 88080;
      e[(e._extends = Gs)] = '_extends';
      let Js = 89104;
      e[(e._export = Js)] = '_export';
      let Qs = 90640;
      e[(e._import = Qs)] = '_import';
      let Zs = 91664;
      e[(e._yield = Zs)] = '_yield';
      let ei = 92688;
      e[(e._null = ei)] = '_null';
      let ti = 93712;
      e[(e._true = ti)] = '_true';
      let ni = 94736;
      e[(e._false = ni)] = '_false';
      let oi = 95256;
      e[(e._in = oi)] = '_in';
      let ri = 96280;
      e[(e._instanceof = ri)] = '_instanceof';
      let si = 97936;
      e[(e._typeof = si)] = '_typeof';
      let ii = 98960;
      e[(e._void = ii)] = '_void';
      let kd = 99984;
      e[(e._delete = kd)] = '_delete';
      let vd = 100880;
      e[(e._async = vd)] = '_async';
      let _d = 101904;
      e[(e._get = _d)] = '_get';
      let xd = 102928;
      e[(e._set = xd)] = '_set';
      let gd = 103952;
      e[(e._declare = gd)] = '_declare';
      let Cd = 104976;
      e[(e._readonly = Cd)] = '_readonly';
      let wd = 106e3;
      e[(e._abstract = wd)] = '_abstract';
      let Id = 107024;
      e[(e._static = Id)] = '_static';
      let Sd = 107536;
      e[(e._public = Sd)] = '_public';
      let bd = 108560;
      e[(e._private = bd)] = '_private';
      let Ed = 109584;
      e[(e._protected = Ed)] = '_protected';
      let Ad = 110608;
      e[(e._override = Ad)] = '_override';
      let Pd = 112144;
      e[(e._as = Pd)] = '_as';
      let Rd = 113168;
      e[(e._enum = Rd)] = '_enum';
      let Nd = 114192;
      e[(e._type = Nd)] = '_type';
      let Dd = 115216;
      e[(e._implements = Dd)] = '_implements';
    })(b || (Er.TokenType = b = {}));
    function Uf(e) {
      switch (e) {
        case b.num:
          return 'num';
        case b.bigint:
          return 'bigint';
        case b.decimal:
          return 'decimal';
        case b.regexp:
          return 'regexp';
        case b.string:
          return 'string';
        case b.name:
          return 'name';
        case b.eof:
          return 'eof';
        case b.bracketL:
          return '[';
        case b.bracketR:
          return ']';
        case b.braceL:
          return '{';
        case b.braceBarL:
          return '{|';
        case b.braceR:
          return '}';
        case b.braceBarR:
          return '|}';
        case b.parenL:
          return '(';
        case b.parenR:
          return ')';
        case b.comma:
          return ',';
        case b.semi:
          return ';';
        case b.colon:
          return ':';
        case b.doubleColon:
          return '::';
        case b.dot:
          return '.';
        case b.question:
          return '?';
        case b.questionDot:
          return '?.';
        case b.arrow:
          return '=>';
        case b.template:
          return 'template';
        case b.ellipsis:
          return '...';
        case b.backQuote:
          return '`';
        case b.dollarBraceL:
          return '${';
        case b.at:
          return '@';
        case b.hash:
          return '#';
        case b.eq:
          return '=';
        case b.assign:
          return '_=';
        case b.preIncDec:
          return '++/--';
        case b.postIncDec:
          return '++/--';
        case b.bang:
          return '!';
        case b.tilde:
          return '~';
        case b.pipeline:
          return '|>';
        case b.nullishCoalescing:
          return '??';
        case b.logicalOR:
          return '||';
        case b.logicalAND:
          return '&&';
        case b.bitwiseOR:
          return '|';
        case b.bitwiseXOR:
          return '^';
        case b.bitwiseAND:
          return '&';
        case b.equality:
          return '==/!=';
        case b.lessThan:
          return '<';
        case b.greaterThan:
          return '>';
        case b.relationalOrEqual:
          return '<=/>=';
        case b.bitShiftL:
          return '<<';
        case b.bitShiftR:
          return '>>/>>>';
        case b.plus:
          return '+';
        case b.minus:
          return '-';
        case b.modulo:
          return '%';
        case b.star:
          return '*';
        case b.slash:
          return '/';
        case b.exponent:
          return '**';
        case b.jsxName:
          return 'jsxName';
        case b.jsxText:
          return 'jsxText';
        case b.jsxEmptyText:
          return 'jsxEmptyText';
        case b.jsxTagStart:
          return 'jsxTagStart';
        case b.jsxTagEnd:
          return 'jsxTagEnd';
        case b.typeParameterStart:
          return 'typeParameterStart';
        case b.nonNullAssertion:
          return 'nonNullAssertion';
        case b._break:
          return 'break';
        case b._case:
          return 'case';
        case b._catch:
          return 'catch';
        case b._continue:
          return 'continue';
        case b._debugger:
          return 'debugger';
        case b._default:
          return 'default';
        case b._do:
          return 'do';
        case b._else:
          return 'else';
        case b._finally:
          return 'finally';
        case b._for:
          return 'for';
        case b._function:
          return 'function';
        case b._if:
          return 'if';
        case b._return:
          return 'return';
        case b._switch:
          return 'switch';
        case b._throw:
          return 'throw';
        case b._try:
          return 'try';
        case b._var:
          return 'var';
        case b._let:
          return 'let';
        case b._const:
          return 'const';
        case b._while:
          return 'while';
        case b._with:
          return 'with';
        case b._new:
          return 'new';
        case b._this:
          return 'this';
        case b._super:
          return 'super';
        case b._class:
          return 'class';
        case b._extends:
          return 'extends';
        case b._export:
          return 'export';
        case b._import:
          return 'import';
        case b._yield:
          return 'yield';
        case b._null:
          return 'null';
        case b._true:
          return 'true';
        case b._false:
          return 'false';
        case b._in:
          return 'in';
        case b._instanceof:
          return 'instanceof';
        case b._typeof:
          return 'typeof';
        case b._void:
          return 'void';
        case b._delete:
          return 'delete';
        case b._async:
          return 'async';
        case b._get:
          return 'get';
        case b._set:
          return 'set';
        case b._declare:
          return 'declare';
        case b._readonly:
          return 'readonly';
        case b._abstract:
          return 'abstract';
        case b._static:
          return 'static';
        case b._public:
          return 'public';
        case b._private:
          return 'private';
        case b._protected:
          return 'protected';
        case b._override:
          return 'override';
        case b._as:
          return 'as';
        case b._enum:
          return 'enum';
        case b._type:
          return 'type';
        case b._implements:
          return 'implements';
        default:
          return '';
      }
    }
    Er.formatTokenType = Uf;
  });
  var Pr = H((Bo) => {
    'use strict';
    Object.defineProperty(Bo, '__esModule', {value: !0});
    var Wf = Ge(),
      Vf = ce(),
      Pi = class {
        constructor(t, n, o) {
          (this.startTokenIndex = t),
            (this.endTokenIndex = n),
            (this.isFunctionScope = o);
        }
      };
    Bo.Scope = Pi;
    var Ar = class {
      constructor(t, n, o, r, s, i, a, u, h, v, _, x, L) {
        (this.potentialArrowAt = t),
          (this.noAnonFunctionType = n),
          (this.inDisallowConditionalTypesContext = o),
          (this.tokensLength = r),
          (this.scopesLength = s),
          (this.pos = i),
          (this.type = a),
          (this.contextualKeyword = u),
          (this.start = h),
          (this.end = v),
          (this.isType = _),
          (this.scopeDepth = x),
          (this.error = L);
      }
    };
    Bo.StateSnapshot = Ar;
    var Ri = class e {
      constructor() {
        e.prototype.__init.call(this),
          e.prototype.__init2.call(this),
          e.prototype.__init3.call(this),
          e.prototype.__init4.call(this),
          e.prototype.__init5.call(this),
          e.prototype.__init6.call(this),
          e.prototype.__init7.call(this),
          e.prototype.__init8.call(this),
          e.prototype.__init9.call(this),
          e.prototype.__init10.call(this),
          e.prototype.__init11.call(this),
          e.prototype.__init12.call(this),
          e.prototype.__init13.call(this);
      }
      __init() {
        this.potentialArrowAt = -1;
      }
      __init2() {
        this.noAnonFunctionType = !1;
      }
      __init3() {
        this.inDisallowConditionalTypesContext = !1;
      }
      __init4() {
        this.tokens = [];
      }
      __init5() {
        this.scopes = [];
      }
      __init6() {
        this.pos = 0;
      }
      __init7() {
        this.type = Vf.TokenType.eof;
      }
      __init8() {
        this.contextualKeyword = Wf.ContextualKeyword.NONE;
      }
      __init9() {
        this.start = 0;
      }
      __init10() {
        this.end = 0;
      }
      __init11() {
        this.isType = !1;
      }
      __init12() {
        this.scopeDepth = 0;
      }
      __init13() {
        this.error = null;
      }
      snapshot() {
        return new Ar(
          this.potentialArrowAt,
          this.noAnonFunctionType,
          this.inDisallowConditionalTypesContext,
          this.tokens.length,
          this.scopes.length,
          this.pos,
          this.type,
          this.contextualKeyword,
          this.start,
          this.end,
          this.isType,
          this.scopeDepth,
          this.error
        );
      }
      restoreFromSnapshot(t) {
        (this.potentialArrowAt = t.potentialArrowAt),
          (this.noAnonFunctionType = t.noAnonFunctionType),
          (this.inDisallowConditionalTypesContext =
            t.inDisallowConditionalTypesContext),
          (this.tokens.length = t.tokensLength),
          (this.scopes.length = t.scopesLength),
          (this.pos = t.pos),
          (this.type = t.type),
          (this.contextualKeyword = t.contextualKeyword),
          (this.start = t.start),
          (this.end = t.end),
          (this.isType = t.isType),
          (this.scopeDepth = t.scopeDepth),
          (this.error = t.error);
      }
    };
    Bo.default = Ri;
  });
  var gt = H((Rr) => {
    'use strict';
    Object.defineProperty(Rr, '__esModule', {value: !0});
    var wn;
    (function (e) {
      e[(e.backSpace = 8)] = 'backSpace';
      let n = 10;
      e[(e.lineFeed = n)] = 'lineFeed';
      let o = 9;
      e[(e.tab = o)] = 'tab';
      let r = 13;
      e[(e.carriageReturn = r)] = 'carriageReturn';
      let s = 14;
      e[(e.shiftOut = s)] = 'shiftOut';
      let i = 32;
      e[(e.space = i)] = 'space';
      let a = 33;
      e[(e.exclamationMark = a)] = 'exclamationMark';
      let u = 34;
      e[(e.quotationMark = u)] = 'quotationMark';
      let h = 35;
      e[(e.numberSign = h)] = 'numberSign';
      let v = 36;
      e[(e.dollarSign = v)] = 'dollarSign';
      let _ = 37;
      e[(e.percentSign = _)] = 'percentSign';
      let x = 38;
      e[(e.ampersand = x)] = 'ampersand';
      let L = 39;
      e[(e.apostrophe = L)] = 'apostrophe';
      let G = 40;
      e[(e.leftParenthesis = G)] = 'leftParenthesis';
      let F = 41;
      e[(e.rightParenthesis = F)] = 'rightParenthesis';
      let K = 42;
      e[(e.asterisk = K)] = 'asterisk';
      let R = 43;
      e[(e.plusSign = R)] = 'plusSign';
      let z = 44;
      e[(e.comma = z)] = 'comma';
      let $ = 45;
      e[(e.dash = $)] = 'dash';
      let O = 46;
      e[(e.dot = O)] = 'dot';
      let A = 47;
      e[(e.slash = A)] = 'slash';
      let M = 48;
      e[(e.digit0 = M)] = 'digit0';
      let B = 49;
      e[(e.digit1 = B)] = 'digit1';
      let oe = 50;
      e[(e.digit2 = oe)] = 'digit2';
      let ne = 51;
      e[(e.digit3 = ne)] = 'digit3';
      let re = 52;
      e[(e.digit4 = re)] = 'digit4';
      let Le = 53;
      e[(e.digit5 = Le)] = 'digit5';
      let Fe = 54;
      e[(e.digit6 = Fe)] = 'digit6';
      let mt = 55;
      e[(e.digit7 = mt)] = 'digit7';
      let kt = 56;
      e[(e.digit8 = kt)] = 'digit8';
      let Qe = 57;
      e[(e.digit9 = Qe)] = 'digit9';
      let vt = 58;
      e[(e.colon = vt)] = 'colon';
      let it = 59;
      e[(e.semicolon = it)] = 'semicolon';
      let ct = 60;
      e[(e.lessThan = ct)] = 'lessThan';
      let Ze = 61;
      e[(e.equalsTo = Ze)] = 'equalsTo';
      let ut = 62;
      e[(e.greaterThan = ut)] = 'greaterThan';
      let Ft = 63;
      e[(e.questionMark = Ft)] = 'questionMark';
      let Vt = 64;
      e[(e.atSign = Vt)] = 'atSign';
      let $t = 65;
      e[(e.uppercaseA = $t)] = 'uppercaseA';
      let Bt = 66;
      e[(e.uppercaseB = Bt)] = 'uppercaseB';
      let on = 67;
      e[(e.uppercaseC = on)] = 'uppercaseC';
      let I = 68;
      e[(e.uppercaseD = I)] = 'uppercaseD';
      let D = 69;
      e[(e.uppercaseE = D)] = 'uppercaseE';
      let j = 70;
      e[(e.uppercaseF = j)] = 'uppercaseF';
      let Y = 71;
      e[(e.uppercaseG = Y)] = 'uppercaseG';
      let le = 72;
      e[(e.uppercaseH = le)] = 'uppercaseH';
      let Q = 73;
      e[(e.uppercaseI = Q)] = 'uppercaseI';
      let ke = 74;
      e[(e.uppercaseJ = ke)] = 'uppercaseJ';
      let ge = 75;
      e[(e.uppercaseK = ge)] = 'uppercaseK';
      let Ce = 76;
      e[(e.uppercaseL = Ce)] = 'uppercaseL';
      let We = 77;
      e[(e.uppercaseM = We)] = 'uppercaseM';
      let $e = 78;
      e[(e.uppercaseN = $e)] = 'uppercaseN';
      let Ne = 79;
      e[(e.uppercaseO = Ne)] = 'uppercaseO';
      let Ye = 80;
      e[(e.uppercaseP = Ye)] = 'uppercaseP';
      let et = 81;
      e[(e.uppercaseQ = et)] = 'uppercaseQ';
      let pt = 82;
      e[(e.uppercaseR = pt)] = 'uppercaseR';
      let zt = 83;
      e[(e.uppercaseS = zt)] = 'uppercaseS';
      let tt = 84;
      e[(e.uppercaseT = tt)] = 'uppercaseT';
      let Fn = 85;
      e[(e.uppercaseU = Fn)] = 'uppercaseU';
      let Qn = 86;
      e[(e.uppercaseV = Qn)] = 'uppercaseV';
      let bo = 87;
      e[(e.uppercaseW = bo)] = 'uppercaseW';
      let Zn = 88;
      e[(e.uppercaseX = Zn)] = 'uppercaseX';
      let $n = 89;
      e[(e.uppercaseY = $n)] = 'uppercaseY';
      let jt = 90;
      e[(e.uppercaseZ = jt)] = 'uppercaseZ';
      let kn = 91;
      e[(e.leftSquareBracket = kn)] = 'leftSquareBracket';
      let eo = 92;
      e[(e.backslash = eo)] = 'backslash';
      let to = 93;
      e[(e.rightSquareBracket = to)] = 'rightSquareBracket';
      let no = 94;
      e[(e.caret = no)] = 'caret';
      let Is = 95;
      e[(e.underscore = Is)] = 'underscore';
      let Ss = 96;
      e[(e.graveAccent = Ss)] = 'graveAccent';
      let bs = 97;
      e[(e.lowercaseA = bs)] = 'lowercaseA';
      let Es = 98;
      e[(e.lowercaseB = Es)] = 'lowercaseB';
      let As = 99;
      e[(e.lowercaseC = As)] = 'lowercaseC';
      let Ps = 100;
      e[(e.lowercaseD = Ps)] = 'lowercaseD';
      let Rs = 101;
      e[(e.lowercaseE = Rs)] = 'lowercaseE';
      let Ns = 102;
      e[(e.lowercaseF = Ns)] = 'lowercaseF';
      let Ds = 103;
      e[(e.lowercaseG = Ds)] = 'lowercaseG';
      let Os = 104;
      e[(e.lowercaseH = Os)] = 'lowercaseH';
      let Ms = 105;
      e[(e.lowercaseI = Ms)] = 'lowercaseI';
      let Ls = 106;
      e[(e.lowercaseJ = Ls)] = 'lowercaseJ';
      let Fs = 107;
      e[(e.lowercaseK = Fs)] = 'lowercaseK';
      let $s = 108;
      e[(e.lowercaseL = $s)] = 'lowercaseL';
      let Bs = 109;
      e[(e.lowercaseM = Bs)] = 'lowercaseM';
      let js = 110;
      e[(e.lowercaseN = js)] = 'lowercaseN';
      let Ks = 111;
      e[(e.lowercaseO = Ks)] = 'lowercaseO';
      let qs = 112;
      e[(e.lowercaseP = qs)] = 'lowercaseP';
      let Hs = 113;
      e[(e.lowercaseQ = Hs)] = 'lowercaseQ';
      let Us = 114;
      e[(e.lowercaseR = Us)] = 'lowercaseR';
      let Ws = 115;
      e[(e.lowercaseS = Ws)] = 'lowercaseS';
      let Vs = 116;
      e[(e.lowercaseT = Vs)] = 'lowercaseT';
      let zs = 117;
      e[(e.lowercaseU = zs)] = 'lowercaseU';
      let Xs = 118;
      e[(e.lowercaseV = Xs)] = 'lowercaseV';
      let Ys = 119;
      e[(e.lowercaseW = Ys)] = 'lowercaseW';
      let Gs = 120;
      e[(e.lowercaseX = Gs)] = 'lowercaseX';
      let Js = 121;
      e[(e.lowercaseY = Js)] = 'lowercaseY';
      let Qs = 122;
      e[(e.lowercaseZ = Qs)] = 'lowercaseZ';
      let Zs = 123;
      e[(e.leftCurlyBrace = Zs)] = 'leftCurlyBrace';
      let ei = 124;
      e[(e.verticalBar = ei)] = 'verticalBar';
      let ti = 125;
      e[(e.rightCurlyBrace = ti)] = 'rightCurlyBrace';
      let ni = 126;
      e[(e.tilde = ni)] = 'tilde';
      let oi = 160;
      e[(e.nonBreakingSpace = oi)] = 'nonBreakingSpace';
      let ri = 5760;
      e[(e.oghamSpaceMark = ri)] = 'oghamSpaceMark';
      let si = 8232;
      e[(e.lineSeparator = si)] = 'lineSeparator';
      let ii = 8233;
      e[(e.paragraphSeparator = ii)] = 'paragraphSeparator';
    })(wn || (Rr.charCodes = wn = {}));
    function zf(e) {
      return (
        (e >= wn.digit0 && e <= wn.digit9) ||
        (e >= wn.lowercaseA && e <= wn.lowercaseF) ||
        (e >= wn.uppercaseA && e <= wn.uppercaseF)
      );
    }
    Rr.isDigit = zf;
  });
  var Ct = H((qe) => {
    'use strict';
    Object.defineProperty(qe, '__esModule', {value: !0});
    function Xf(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Yf = Pr(),
      Gf = Xf(Yf),
      Jf = gt();
    qe.isJSXEnabled;
    qe.isTypeScriptEnabled;
    qe.isFlowEnabled;
    qe.state;
    qe.input;
    qe.nextContextId;
    function Qf() {
      return qe.nextContextId++;
    }
    qe.getNextContextId = Qf;
    function Zf(e) {
      if ('pos' in e) {
        let t = ic(e.pos);
        (e.message += ` (${t.line}:${t.column})`), (e.loc = t);
      }
      return e;
    }
    qe.augmentError = Zf;
    var Nr = class {
      constructor(t, n) {
        (this.line = t), (this.column = n);
      }
    };
    qe.Loc = Nr;
    function ic(e) {
      let t = 1,
        n = 1;
      for (let o = 0; o < e; o++)
        qe.input.charCodeAt(o) === Jf.charCodes.lineFeed ? (t++, (n = 1)) : n++;
      return new Nr(t, n);
    }
    qe.locationForIndex = ic;
    function eh(e, t, n, o) {
      (qe.input = e),
        (qe.state = new Gf.default()),
        (qe.nextContextId = 1),
        (qe.isJSXEnabled = t),
        (qe.isTypeScriptEnabled = n),
        (qe.isFlowEnabled = o);
    }
    qe.initParser = eh;
  });
  var Sn = H((It) => {
    'use strict';
    Object.defineProperty(It, '__esModule', {value: !0});
    var In = Ve(),
      Vn = ce(),
      Dr = gt(),
      wt = Ct();
    function th(e) {
      return wt.state.contextualKeyword === e;
    }
    It.isContextual = th;
    function nh(e) {
      let t = In.lookaheadTypeAndKeyword.call(void 0);
      return t.type === Vn.TokenType.name && t.contextualKeyword === e;
    }
    It.isLookaheadContextual = nh;
    function ac(e) {
      return (
        wt.state.contextualKeyword === e &&
        In.eat.call(void 0, Vn.TokenType.name)
      );
    }
    It.eatContextual = ac;
    function oh(e) {
      ac(e) || Or();
    }
    It.expectContextual = oh;
    function lc() {
      return (
        In.match.call(void 0, Vn.TokenType.eof) ||
        In.match.call(void 0, Vn.TokenType.braceR) ||
        cc()
      );
    }
    It.canInsertSemicolon = lc;
    function cc() {
      let e = wt.state.tokens[wt.state.tokens.length - 1],
        t = e ? e.end : 0;
      for (let n = t; n < wt.state.start; n++) {
        let o = wt.input.charCodeAt(n);
        if (
          o === Dr.charCodes.lineFeed ||
          o === Dr.charCodes.carriageReturn ||
          o === 8232 ||
          o === 8233
        )
          return !0;
      }
      return !1;
    }
    It.hasPrecedingLineBreak = cc;
    function rh() {
      let e = In.nextTokenStart.call(void 0);
      for (let t = wt.state.end; t < e; t++) {
        let n = wt.input.charCodeAt(t);
        if (
          n === Dr.charCodes.lineFeed ||
          n === Dr.charCodes.carriageReturn ||
          n === 8232 ||
          n === 8233
        )
          return !0;
      }
      return !1;
    }
    It.hasFollowingLineBreak = rh;
    function uc() {
      return In.eat.call(void 0, Vn.TokenType.semi) || lc();
    }
    It.isLineTerminator = uc;
    function sh() {
      uc() || Or('Unexpected token, expected ";"');
    }
    It.semicolon = sh;
    function ih(e) {
      In.eat.call(void 0, e) ||
        Or(
          `Unexpected token, expected "${Vn.formatTokenType.call(void 0, e)}"`
        );
    }
    It.expect = ih;
    function Or(e = 'Unexpected token', t = wt.state.start) {
      if (wt.state.error) return;
      let n = new SyntaxError(e);
      (n.pos = t),
        (wt.state.error = n),
        (wt.state.pos = wt.input.length),
        In.finishToken.call(void 0, Vn.TokenType.eof);
    }
    It.unexpected = Or;
  });
  var Di = H((zn) => {
    'use strict';
    Object.defineProperty(zn, '__esModule', {value: !0});
    var Ni = gt(),
      ah = [
        9,
        11,
        12,
        Ni.charCodes.space,
        Ni.charCodes.nonBreakingSpace,
        Ni.charCodes.oghamSpaceMark,
        8192,
        8193,
        8194,
        8195,
        8196,
        8197,
        8198,
        8199,
        8200,
        8201,
        8202,
        8239,
        8287,
        12288,
        65279,
      ];
    zn.WHITESPACE_CHARS = ah;
    var lh = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
    zn.skipWhiteSpace = lh;
    var ch = new Uint8Array(65536);
    zn.IS_WHITESPACE = ch;
    for (let e of zn.WHITESPACE_CHARS) zn.IS_WHITESPACE[e] = 1;
  });
  var fo = H((qt) => {
    'use strict';
    Object.defineProperty(qt, '__esModule', {value: !0});
    var pc = gt(),
      uh = Di();
    function ph(e) {
      if (e < 48) return e === 36;
      if (e < 58) return !0;
      if (e < 65) return !1;
      if (e < 91) return !0;
      if (e < 97) return e === 95;
      if (e < 123) return !0;
      if (e < 128) return !1;
      throw new Error('Should not be called with non-ASCII char code.');
    }
    var dh = new Uint8Array(65536);
    qt.IS_IDENTIFIER_CHAR = dh;
    for (let e = 0; e < 128; e++) qt.IS_IDENTIFIER_CHAR[e] = ph(e) ? 1 : 0;
    for (let e = 128; e < 65536; e++) qt.IS_IDENTIFIER_CHAR[e] = 1;
    for (let e of uh.WHITESPACE_CHARS) qt.IS_IDENTIFIER_CHAR[e] = 0;
    qt.IS_IDENTIFIER_CHAR[8232] = 0;
    qt.IS_IDENTIFIER_CHAR[8233] = 0;
    var fh = qt.IS_IDENTIFIER_CHAR.slice();
    qt.IS_IDENTIFIER_START = fh;
    for (let e = pc.charCodes.digit0; e <= pc.charCodes.digit9; e++)
      qt.IS_IDENTIFIER_START[e] = 0;
  });
  var dc = H((Oi) => {
    'use strict';
    Object.defineProperty(Oi, '__esModule', {value: !0});
    var ie = Ge(),
      ue = ce(),
      hh = new Int32Array([
        -1,
        27,
        783,
        918,
        1755,
        2376,
        2862,
        3483,
        -1,
        3699,
        -1,
        4617,
        4752,
        4833,
        5130,
        5508,
        5940,
        -1,
        6480,
        6939,
        7749,
        8181,
        8451,
        8613,
        -1,
        8829,
        -1,
        -1,
        -1,
        54,
        243,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        432,
        -1,
        -1,
        -1,
        675,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        81,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        108,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        135,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        162,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        189,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        216,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._abstract << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        270,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        297,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        324,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        351,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        378,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        405,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._accessor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._as << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        459,
        -1,
        -1,
        -1,
        -1,
        -1,
        594,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        486,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        513,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        540,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._assert << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        567,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._asserts << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        621,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        648,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._async << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        702,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        729,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        756,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._await << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        810,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        837,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        864,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        891,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._break << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        945,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1107,
        -1,
        -1,
        -1,
        1242,
        -1,
        -1,
        1350,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        972,
        1026,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        999,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._case << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1053,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1080,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._catch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1134,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1161,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1188,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1215,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._checks << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1269,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1296,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1323,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._class << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1377,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1404,
        1620,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1431,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._const << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1458,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1485,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1512,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1539,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1566,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1593,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._constructor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1647,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1674,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1701,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1728,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._continue << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1782,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2349,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1809,
        1971,
        -1,
        -1,
        2106,
        -1,
        -1,
        -1,
        -1,
        -1,
        2241,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1836,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1863,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1890,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1917,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1944,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._debugger << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        1998,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2025,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2052,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2079,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._declare << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2133,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2160,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2187,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2214,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._default << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2268,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2295,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2322,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._delete << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._do << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2403,
        -1,
        2484,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2565,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2430,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2457,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._else << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2511,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2538,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._enum << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2592,
        -1,
        -1,
        -1,
        2727,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2619,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2646,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2673,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._export << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2700,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._exports << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2754,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2781,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2808,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2835,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._extends << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2889,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2997,
        -1,
        -1,
        -1,
        -1,
        -1,
        3159,
        -1,
        -1,
        3213,
        -1,
        -1,
        3294,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2916,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2943,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2970,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._false << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3024,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3051,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3078,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3105,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3132,
        -1,
        (ue.TokenType._finally << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3186,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._for << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3240,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3267,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._from << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3321,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3348,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3375,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3402,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3429,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3456,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._function << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3510,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3564,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3537,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._get << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3591,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3618,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3645,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3672,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._global << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3726,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3753,
        4077,
        -1,
        -1,
        -1,
        -1,
        4590,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._if << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3780,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3807,
        -1,
        -1,
        3996,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3834,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3861,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3888,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3915,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3942,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        3969,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._implements << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4023,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4050,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._import << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._in << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4104,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4185,
        4401,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4131,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4158,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._infer << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4212,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4239,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4266,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4293,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4320,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4347,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4374,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._instanceof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4428,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4455,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4482,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4509,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4536,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4563,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._interface << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._is << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4644,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4671,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4698,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4725,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._keyof << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4779,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4806,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._let << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4860,
        -1,
        -1,
        -1,
        -1,
        -1,
        4995,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4887,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4914,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4941,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        4968,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._mixins << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5022,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5049,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5076,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5103,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._module << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5157,
        -1,
        -1,
        -1,
        5373,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5427,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5184,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5211,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5238,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5265,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5292,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5319,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5346,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._namespace << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5400,
        -1,
        -1,
        -1,
        (ue.TokenType._new << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5454,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5481,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._null << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5535,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5562,
        -1,
        -1,
        -1,
        -1,
        5697,
        5751,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._of << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5589,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5616,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5643,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5670,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._opaque << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5724,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._out << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5778,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5805,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5832,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5859,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5886,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5913,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._override << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5967,
        -1,
        -1,
        6345,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        5994,
        -1,
        -1,
        -1,
        -1,
        -1,
        6129,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6021,
        -1,
        -1,
        -1,
        -1,
        -1,
        6048,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6075,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6102,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._private << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6156,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6183,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6318,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6210,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6237,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6264,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6291,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._protected << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._proto << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6372,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6399,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6426,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6453,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._public << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6507,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6534,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6696,
        -1,
        -1,
        6831,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6561,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6588,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6615,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6642,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6669,
        -1,
        ie.ContextualKeyword._readonly << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6723,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6750,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6777,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6804,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._require << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6858,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6885,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6912,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._return << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6966,
        -1,
        -1,
        -1,
        7182,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7236,
        7371,
        -1,
        7479,
        -1,
        7614,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        6993,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7020,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7047,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7074,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7101,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7128,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7155,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._satisfies << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7209,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._set << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7263,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7290,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7317,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7344,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._static << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7398,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7425,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7452,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._super << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7506,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7533,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7560,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7587,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._switch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7641,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7668,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7695,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7722,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._symbol << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7776,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7938,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8046,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7803,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7857,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7830,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._this << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7884,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7911,
        -1,
        -1,
        -1,
        (ue.TokenType._throw << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7965,
        -1,
        -1,
        -1,
        8019,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        7992,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._true << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._try << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8073,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8100,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._type << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8127,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8154,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._typeof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8208,
        -1,
        -1,
        -1,
        -1,
        8343,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8235,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8262,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8289,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8316,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._unique << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8370,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8397,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8424,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ie.ContextualKeyword._using << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8478,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8532,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8505,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._var << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8559,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8586,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._void << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8640,
        8748,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8667,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8694,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8721,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._while << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8775,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8802,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._with << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8856,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8883,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8910,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        8937,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (ue.TokenType._yield << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
      ]);
    Oi.READ_WORD_TREE = hh;
  });
  var yc = H((Li) => {
    'use strict';
    Object.defineProperty(Li, '__esModule', {value: !0});
    var Ht = Ct(),
      bn = gt(),
      fc = fo(),
      Mi = Ve(),
      hc = dc(),
      Tc = ce();
    function Th() {
      let e = 0,
        t = 0,
        n = Ht.state.pos;
      for (
        ;
        n < Ht.input.length &&
        ((t = Ht.input.charCodeAt(n)),
        !(t < bn.charCodes.lowercaseA || t > bn.charCodes.lowercaseZ));

      ) {
        let r = hc.READ_WORD_TREE[e + (t - bn.charCodes.lowercaseA) + 1];
        if (r === -1) break;
        (e = r), n++;
      }
      let o = hc.READ_WORD_TREE[e];
      if (o > -1 && !fc.IS_IDENTIFIER_CHAR[t]) {
        (Ht.state.pos = n),
          o & 1
            ? Mi.finishToken.call(void 0, o >>> 1)
            : Mi.finishToken.call(void 0, Tc.TokenType.name, o >>> 1);
        return;
      }
      for (; n < Ht.input.length; ) {
        let r = Ht.input.charCodeAt(n);
        if (fc.IS_IDENTIFIER_CHAR[r]) n++;
        else if (r === bn.charCodes.backslash) {
          if (
            ((n += 2), Ht.input.charCodeAt(n) === bn.charCodes.leftCurlyBrace)
          ) {
            for (
              ;
              n < Ht.input.length &&
              Ht.input.charCodeAt(n) !== bn.charCodes.rightCurlyBrace;

            )
              n++;
            n++;
          }
        } else if (
          r === bn.charCodes.atSign &&
          Ht.input.charCodeAt(n + 1) === bn.charCodes.atSign
        )
          n += 2;
        else break;
      }
      (Ht.state.pos = n), Mi.finishToken.call(void 0, Tc.TokenType.name);
    }
    Li.default = Th;
  });
  var Ve = H((xe) => {
    'use strict';
    Object.defineProperty(xe, '__esModule', {value: !0});
    function yh(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var d = Ct(),
      ho = Sn(),
      g = gt(),
      kc = fo(),
      $i = Di(),
      mh = Ge(),
      kh = yc(),
      vh = yh(kh),
      U = ce(),
      Oe;
    (function (e) {
      e[(e.Access = 0)] = 'Access';
      let n = 1;
      e[(e.ExportAccess = n)] = 'ExportAccess';
      let o = n + 1;
      e[(e.TopLevelDeclaration = o)] = 'TopLevelDeclaration';
      let r = o + 1;
      e[(e.FunctionScopedDeclaration = r)] = 'FunctionScopedDeclaration';
      let s = r + 1;
      e[(e.BlockScopedDeclaration = s)] = 'BlockScopedDeclaration';
      let i = s + 1;
      e[(e.ObjectShorthandTopLevelDeclaration = i)] =
        'ObjectShorthandTopLevelDeclaration';
      let a = i + 1;
      e[(e.ObjectShorthandFunctionScopedDeclaration = a)] =
        'ObjectShorthandFunctionScopedDeclaration';
      let u = a + 1;
      e[(e.ObjectShorthandBlockScopedDeclaration = u)] =
        'ObjectShorthandBlockScopedDeclaration';
      let h = u + 1;
      e[(e.ObjectShorthand = h)] = 'ObjectShorthand';
      let v = h + 1;
      e[(e.ImportDeclaration = v)] = 'ImportDeclaration';
      let _ = v + 1;
      e[(e.ObjectKey = _)] = 'ObjectKey';
      let x = _ + 1;
      e[(e.ImportAccess = x)] = 'ImportAccess';
    })(Oe || (xe.IdentifierRole = Oe = {}));
    var mc;
    (function (e) {
      e[(e.NoChildren = 0)] = 'NoChildren';
      let n = 1;
      e[(e.OneChild = n)] = 'OneChild';
      let o = n + 1;
      e[(e.StaticChildren = o)] = 'StaticChildren';
      let r = o + 1;
      e[(e.KeyAfterPropSpread = r)] = 'KeyAfterPropSpread';
    })(mc || (xe.JSXRole = mc = {}));
    function _h(e) {
      let t = e.identifierRole;
      return (
        t === Oe.TopLevelDeclaration ||
        t === Oe.FunctionScopedDeclaration ||
        t === Oe.BlockScopedDeclaration ||
        t === Oe.ObjectShorthandTopLevelDeclaration ||
        t === Oe.ObjectShorthandFunctionScopedDeclaration ||
        t === Oe.ObjectShorthandBlockScopedDeclaration
      );
    }
    xe.isDeclaration = _h;
    function xh(e) {
      let t = e.identifierRole;
      return (
        t === Oe.FunctionScopedDeclaration ||
        t === Oe.BlockScopedDeclaration ||
        t === Oe.ObjectShorthandFunctionScopedDeclaration ||
        t === Oe.ObjectShorthandBlockScopedDeclaration
      );
    }
    xe.isNonTopLevelDeclaration = xh;
    function gh(e) {
      let t = e.identifierRole;
      return (
        t === Oe.TopLevelDeclaration ||
        t === Oe.ObjectShorthandTopLevelDeclaration ||
        t === Oe.ImportDeclaration
      );
    }
    xe.isTopLevelDeclaration = gh;
    function Ch(e) {
      let t = e.identifierRole;
      return (
        t === Oe.TopLevelDeclaration ||
        t === Oe.BlockScopedDeclaration ||
        t === Oe.ObjectShorthandTopLevelDeclaration ||
        t === Oe.ObjectShorthandBlockScopedDeclaration
      );
    }
    xe.isBlockScopedDeclaration = Ch;
    function wh(e) {
      let t = e.identifierRole;
      return (
        t === Oe.FunctionScopedDeclaration ||
        t === Oe.ObjectShorthandFunctionScopedDeclaration
      );
    }
    xe.isFunctionScopedDeclaration = wh;
    function Ih(e) {
      return (
        e.identifierRole === Oe.ObjectShorthandTopLevelDeclaration ||
        e.identifierRole === Oe.ObjectShorthandBlockScopedDeclaration ||
        e.identifierRole === Oe.ObjectShorthandFunctionScopedDeclaration
      );
    }
    xe.isObjectShorthandDeclaration = Ih;
    var jo = class {
      constructor() {
        (this.type = d.state.type),
          (this.contextualKeyword = d.state.contextualKeyword),
          (this.start = d.state.start),
          (this.end = d.state.end),
          (this.scopeDepth = d.state.scopeDepth),
          (this.isType = d.state.isType),
          (this.identifierRole = null),
          (this.jsxRole = null),
          (this.shadowsGlobal = !1),
          (this.isAsyncOperation = !1),
          (this.contextId = null),
          (this.rhsEndIndex = null),
          (this.isExpression = !1),
          (this.numNullishCoalesceStarts = 0),
          (this.numNullishCoalesceEnds = 0),
          (this.isOptionalChainStart = !1),
          (this.isOptionalChainEnd = !1),
          (this.subscriptStartIndex = null),
          (this.nullishStartIndex = null);
      }
    };
    xe.Token = jo;
    function Lr() {
      d.state.tokens.push(new jo()), gc();
    }
    xe.next = Lr;
    function Sh() {
      d.state.tokens.push(new jo()), (d.state.start = d.state.pos), Yh();
    }
    xe.nextTemplateToken = Sh;
    function bh() {
      d.state.type === U.TokenType.assign && --d.state.pos, Vh();
    }
    xe.retokenizeSlashAsRegex = bh;
    function Eh(e) {
      for (let n = d.state.tokens.length - e; n < d.state.tokens.length; n++)
        d.state.tokens[n].isType = !0;
      let t = d.state.isType;
      return (d.state.isType = !0), t;
    }
    xe.pushTypeContext = Eh;
    function Ah(e) {
      d.state.isType = e;
    }
    xe.popTypeContext = Ah;
    function vc(e) {
      return Bi(e) ? (Lr(), !0) : !1;
    }
    xe.eat = vc;
    function Ph(e) {
      let t = d.state.isType;
      (d.state.isType = !0), vc(e), (d.state.isType = t);
    }
    xe.eatTypeToken = Ph;
    function Bi(e) {
      return d.state.type === e;
    }
    xe.match = Bi;
    function Rh() {
      let e = d.state.snapshot();
      Lr();
      let t = d.state.type;
      return d.state.restoreFromSnapshot(e), t;
    }
    xe.lookaheadType = Rh;
    var Mr = class {
      constructor(t, n) {
        (this.type = t), (this.contextualKeyword = n);
      }
    };
    xe.TypeAndKeyword = Mr;
    function Nh() {
      let e = d.state.snapshot();
      Lr();
      let t = d.state.type,
        n = d.state.contextualKeyword;
      return d.state.restoreFromSnapshot(e), new Mr(t, n);
    }
    xe.lookaheadTypeAndKeyword = Nh;
    function _c() {
      return xc(d.state.pos);
    }
    xe.nextTokenStart = _c;
    function xc(e) {
      $i.skipWhiteSpace.lastIndex = e;
      let t = $i.skipWhiteSpace.exec(d.input);
      return e + t[0].length;
    }
    xe.nextTokenStartSince = xc;
    function Dh() {
      return d.input.charCodeAt(_c());
    }
    xe.lookaheadCharCode = Dh;
    function gc() {
      if (
        (wc(), (d.state.start = d.state.pos), d.state.pos >= d.input.length)
      ) {
        let e = d.state.tokens;
        e.length >= 2 &&
          e[e.length - 1].start >= d.input.length &&
          e[e.length - 2].start >= d.input.length &&
          ho.unexpected.call(void 0, 'Unexpectedly reached the end of input.'),
          we(U.TokenType.eof);
        return;
      }
      Oh(d.input.charCodeAt(d.state.pos));
    }
    xe.nextToken = gc;
    function Oh(e) {
      kc.IS_IDENTIFIER_START[e] ||
      e === g.charCodes.backslash ||
      (e === g.charCodes.atSign &&
        d.input.charCodeAt(d.state.pos + 1) === g.charCodes.atSign)
        ? vh.default.call(void 0)
        : Sc(e);
    }
    function Mh() {
      for (
        ;
        d.input.charCodeAt(d.state.pos) !== g.charCodes.asterisk ||
        d.input.charCodeAt(d.state.pos + 1) !== g.charCodes.slash;

      )
        if ((d.state.pos++, d.state.pos > d.input.length)) {
          ho.unexpected.call(void 0, 'Unterminated comment', d.state.pos - 2);
          return;
        }
      d.state.pos += 2;
    }
    function Cc(e) {
      let t = d.input.charCodeAt((d.state.pos += e));
      if (d.state.pos < d.input.length)
        for (
          ;
          t !== g.charCodes.lineFeed &&
          t !== g.charCodes.carriageReturn &&
          t !== g.charCodes.lineSeparator &&
          t !== g.charCodes.paragraphSeparator &&
          ++d.state.pos < d.input.length;

        )
          t = d.input.charCodeAt(d.state.pos);
    }
    xe.skipLineComment = Cc;
    function wc() {
      for (; d.state.pos < d.input.length; ) {
        let e = d.input.charCodeAt(d.state.pos);
        switch (e) {
          case g.charCodes.carriageReturn:
            d.input.charCodeAt(d.state.pos + 1) === g.charCodes.lineFeed &&
              ++d.state.pos;
          case g.charCodes.lineFeed:
          case g.charCodes.lineSeparator:
          case g.charCodes.paragraphSeparator:
            ++d.state.pos;
            break;
          case g.charCodes.slash:
            switch (d.input.charCodeAt(d.state.pos + 1)) {
              case g.charCodes.asterisk:
                (d.state.pos += 2), Mh();
                break;
              case g.charCodes.slash:
                Cc(2);
                break;
              default:
                return;
            }
            break;
          default:
            if ($i.IS_WHITESPACE[e]) ++d.state.pos;
            else return;
        }
      }
    }
    xe.skipSpace = wc;
    function we(e, t = mh.ContextualKeyword.NONE) {
      (d.state.end = d.state.pos),
        (d.state.type = e),
        (d.state.contextualKeyword = t);
    }
    xe.finishToken = we;
    function Lh() {
      let e = d.input.charCodeAt(d.state.pos + 1);
      if (e >= g.charCodes.digit0 && e <= g.charCodes.digit9) {
        bc(!0);
        return;
      }
      e === g.charCodes.dot &&
      d.input.charCodeAt(d.state.pos + 2) === g.charCodes.dot
        ? ((d.state.pos += 3), we(U.TokenType.ellipsis))
        : (++d.state.pos, we(U.TokenType.dot));
    }
    function Fh() {
      d.input.charCodeAt(d.state.pos + 1) === g.charCodes.equalsTo
        ? _e(U.TokenType.assign, 2)
        : _e(U.TokenType.slash, 1);
    }
    function $h(e) {
      let t =
          e === g.charCodes.asterisk ? U.TokenType.star : U.TokenType.modulo,
        n = 1,
        o = d.input.charCodeAt(d.state.pos + 1);
      e === g.charCodes.asterisk &&
        o === g.charCodes.asterisk &&
        (n++,
        (o = d.input.charCodeAt(d.state.pos + 2)),
        (t = U.TokenType.exponent)),
        o === g.charCodes.equalsTo &&
          d.input.charCodeAt(d.state.pos + 2) !== g.charCodes.greaterThan &&
          (n++, (t = U.TokenType.assign)),
        _e(t, n);
    }
    function Bh(e) {
      let t = d.input.charCodeAt(d.state.pos + 1);
      if (t === e) {
        d.input.charCodeAt(d.state.pos + 2) === g.charCodes.equalsTo
          ? _e(U.TokenType.assign, 3)
          : _e(
              e === g.charCodes.verticalBar
                ? U.TokenType.logicalOR
                : U.TokenType.logicalAND,
              2
            );
        return;
      }
      if (e === g.charCodes.verticalBar) {
        if (t === g.charCodes.greaterThan) {
          _e(U.TokenType.pipeline, 2);
          return;
        } else if (t === g.charCodes.rightCurlyBrace && d.isFlowEnabled) {
          _e(U.TokenType.braceBarR, 2);
          return;
        }
      }
      if (t === g.charCodes.equalsTo) {
        _e(U.TokenType.assign, 2);
        return;
      }
      _e(
        e === g.charCodes.verticalBar
          ? U.TokenType.bitwiseOR
          : U.TokenType.bitwiseAND,
        1
      );
    }
    function jh() {
      d.input.charCodeAt(d.state.pos + 1) === g.charCodes.equalsTo
        ? _e(U.TokenType.assign, 2)
        : _e(U.TokenType.bitwiseXOR, 1);
    }
    function Kh(e) {
      let t = d.input.charCodeAt(d.state.pos + 1);
      if (t === e) {
        _e(U.TokenType.preIncDec, 2);
        return;
      }
      t === g.charCodes.equalsTo
        ? _e(U.TokenType.assign, 2)
        : e === g.charCodes.plusSign
        ? _e(U.TokenType.plus, 1)
        : _e(U.TokenType.minus, 1);
    }
    function qh() {
      let e = d.input.charCodeAt(d.state.pos + 1);
      if (e === g.charCodes.lessThan) {
        if (d.input.charCodeAt(d.state.pos + 2) === g.charCodes.equalsTo) {
          _e(U.TokenType.assign, 3);
          return;
        }
        d.state.isType
          ? _e(U.TokenType.lessThan, 1)
          : _e(U.TokenType.bitShiftL, 2);
        return;
      }
      e === g.charCodes.equalsTo
        ? _e(U.TokenType.relationalOrEqual, 2)
        : _e(U.TokenType.lessThan, 1);
    }
    function Ic() {
      if (d.state.isType) {
        _e(U.TokenType.greaterThan, 1);
        return;
      }
      let e = d.input.charCodeAt(d.state.pos + 1);
      if (e === g.charCodes.greaterThan) {
        let t =
          d.input.charCodeAt(d.state.pos + 2) === g.charCodes.greaterThan
            ? 3
            : 2;
        if (d.input.charCodeAt(d.state.pos + t) === g.charCodes.equalsTo) {
          _e(U.TokenType.assign, t + 1);
          return;
        }
        _e(U.TokenType.bitShiftR, t);
        return;
      }
      e === g.charCodes.equalsTo
        ? _e(U.TokenType.relationalOrEqual, 2)
        : _e(U.TokenType.greaterThan, 1);
    }
    function Hh() {
      d.state.type === U.TokenType.greaterThan && ((d.state.pos -= 1), Ic());
    }
    xe.rescan_gt = Hh;
    function Uh(e) {
      let t = d.input.charCodeAt(d.state.pos + 1);
      if (t === g.charCodes.equalsTo) {
        _e(
          U.TokenType.equality,
          d.input.charCodeAt(d.state.pos + 2) === g.charCodes.equalsTo ? 3 : 2
        );
        return;
      }
      if (e === g.charCodes.equalsTo && t === g.charCodes.greaterThan) {
        (d.state.pos += 2), we(U.TokenType.arrow);
        return;
      }
      _e(e === g.charCodes.equalsTo ? U.TokenType.eq : U.TokenType.bang, 1);
    }
    function Wh() {
      let e = d.input.charCodeAt(d.state.pos + 1),
        t = d.input.charCodeAt(d.state.pos + 2);
      e === g.charCodes.questionMark && !(d.isFlowEnabled && d.state.isType)
        ? t === g.charCodes.equalsTo
          ? _e(U.TokenType.assign, 3)
          : _e(U.TokenType.nullishCoalescing, 2)
        : e === g.charCodes.dot &&
          !(t >= g.charCodes.digit0 && t <= g.charCodes.digit9)
        ? ((d.state.pos += 2), we(U.TokenType.questionDot))
        : (++d.state.pos, we(U.TokenType.question));
    }
    function Sc(e) {
      switch (e) {
        case g.charCodes.numberSign:
          ++d.state.pos, we(U.TokenType.hash);
          return;
        case g.charCodes.dot:
          Lh();
          return;
        case g.charCodes.leftParenthesis:
          ++d.state.pos, we(U.TokenType.parenL);
          return;
        case g.charCodes.rightParenthesis:
          ++d.state.pos, we(U.TokenType.parenR);
          return;
        case g.charCodes.semicolon:
          ++d.state.pos, we(U.TokenType.semi);
          return;
        case g.charCodes.comma:
          ++d.state.pos, we(U.TokenType.comma);
          return;
        case g.charCodes.leftSquareBracket:
          ++d.state.pos, we(U.TokenType.bracketL);
          return;
        case g.charCodes.rightSquareBracket:
          ++d.state.pos, we(U.TokenType.bracketR);
          return;
        case g.charCodes.leftCurlyBrace:
          d.isFlowEnabled &&
          d.input.charCodeAt(d.state.pos + 1) === g.charCodes.verticalBar
            ? _e(U.TokenType.braceBarL, 2)
            : (++d.state.pos, we(U.TokenType.braceL));
          return;
        case g.charCodes.rightCurlyBrace:
          ++d.state.pos, we(U.TokenType.braceR);
          return;
        case g.charCodes.colon:
          d.input.charCodeAt(d.state.pos + 1) === g.charCodes.colon
            ? _e(U.TokenType.doubleColon, 2)
            : (++d.state.pos, we(U.TokenType.colon));
          return;
        case g.charCodes.questionMark:
          Wh();
          return;
        case g.charCodes.atSign:
          ++d.state.pos, we(U.TokenType.at);
          return;
        case g.charCodes.graveAccent:
          ++d.state.pos, we(U.TokenType.backQuote);
          return;
        case g.charCodes.digit0: {
          let t = d.input.charCodeAt(d.state.pos + 1);
          if (
            t === g.charCodes.lowercaseX ||
            t === g.charCodes.uppercaseX ||
            t === g.charCodes.lowercaseO ||
            t === g.charCodes.uppercaseO ||
            t === g.charCodes.lowercaseB ||
            t === g.charCodes.uppercaseB
          ) {
            zh();
            return;
          }
        }
        case g.charCodes.digit1:
        case g.charCodes.digit2:
        case g.charCodes.digit3:
        case g.charCodes.digit4:
        case g.charCodes.digit5:
        case g.charCodes.digit6:
        case g.charCodes.digit7:
        case g.charCodes.digit8:
        case g.charCodes.digit9:
          bc(!1);
          return;
        case g.charCodes.quotationMark:
        case g.charCodes.apostrophe:
          Xh(e);
          return;
        case g.charCodes.slash:
          Fh();
          return;
        case g.charCodes.percentSign:
        case g.charCodes.asterisk:
          $h(e);
          return;
        case g.charCodes.verticalBar:
        case g.charCodes.ampersand:
          Bh(e);
          return;
        case g.charCodes.caret:
          jh();
          return;
        case g.charCodes.plusSign:
        case g.charCodes.dash:
          Kh(e);
          return;
        case g.charCodes.lessThan:
          qh();
          return;
        case g.charCodes.greaterThan:
          Ic();
          return;
        case g.charCodes.equalsTo:
        case g.charCodes.exclamationMark:
          Uh(e);
          return;
        case g.charCodes.tilde:
          _e(U.TokenType.tilde, 1);
          return;
        default:
          break;
      }
      ho.unexpected.call(
        void 0,
        `Unexpected character '${String.fromCharCode(e)}'`,
        d.state.pos
      );
    }
    xe.getTokenFromCode = Sc;
    function _e(e, t) {
      (d.state.pos += t), we(e);
    }
    function Vh() {
      let e = d.state.pos,
        t = !1,
        n = !1;
      for (;;) {
        if (d.state.pos >= d.input.length) {
          ho.unexpected.call(void 0, 'Unterminated regular expression', e);
          return;
        }
        let o = d.input.charCodeAt(d.state.pos);
        if (t) t = !1;
        else {
          if (o === g.charCodes.leftSquareBracket) n = !0;
          else if (o === g.charCodes.rightSquareBracket && n) n = !1;
          else if (o === g.charCodes.slash && !n) break;
          t = o === g.charCodes.backslash;
        }
        ++d.state.pos;
      }
      ++d.state.pos, Ec(), we(U.TokenType.regexp);
    }
    function Fi() {
      for (;;) {
        let e = d.input.charCodeAt(d.state.pos);
        if (
          (e >= g.charCodes.digit0 && e <= g.charCodes.digit9) ||
          e === g.charCodes.underscore
        )
          d.state.pos++;
        else break;
      }
    }
    function zh() {
      for (d.state.pos += 2; ; ) {
        let t = d.input.charCodeAt(d.state.pos);
        if (
          (t >= g.charCodes.digit0 && t <= g.charCodes.digit9) ||
          (t >= g.charCodes.lowercaseA && t <= g.charCodes.lowercaseF) ||
          (t >= g.charCodes.uppercaseA && t <= g.charCodes.uppercaseF) ||
          t === g.charCodes.underscore
        )
          d.state.pos++;
        else break;
      }
      d.input.charCodeAt(d.state.pos) === g.charCodes.lowercaseN
        ? (++d.state.pos, we(U.TokenType.bigint))
        : we(U.TokenType.num);
    }
    function bc(e) {
      let t = !1,
        n = !1;
      e || Fi();
      let o = d.input.charCodeAt(d.state.pos);
      if (
        (o === g.charCodes.dot &&
          (++d.state.pos, Fi(), (o = d.input.charCodeAt(d.state.pos))),
        (o === g.charCodes.uppercaseE || o === g.charCodes.lowercaseE) &&
          ((o = d.input.charCodeAt(++d.state.pos)),
          (o === g.charCodes.plusSign || o === g.charCodes.dash) &&
            ++d.state.pos,
          Fi(),
          (o = d.input.charCodeAt(d.state.pos))),
        o === g.charCodes.lowercaseN
          ? (++d.state.pos, (t = !0))
          : o === g.charCodes.lowercaseM && (++d.state.pos, (n = !0)),
        t)
      ) {
        we(U.TokenType.bigint);
        return;
      }
      if (n) {
        we(U.TokenType.decimal);
        return;
      }
      we(U.TokenType.num);
    }
    function Xh(e) {
      for (d.state.pos++; ; ) {
        if (d.state.pos >= d.input.length) {
          ho.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        let t = d.input.charCodeAt(d.state.pos);
        if (t === g.charCodes.backslash) d.state.pos++;
        else if (t === e) break;
        d.state.pos++;
      }
      d.state.pos++, we(U.TokenType.string);
    }
    function Yh() {
      for (;;) {
        if (d.state.pos >= d.input.length) {
          ho.unexpected.call(void 0, 'Unterminated template');
          return;
        }
        let e = d.input.charCodeAt(d.state.pos);
        if (
          e === g.charCodes.graveAccent ||
          (e === g.charCodes.dollarSign &&
            d.input.charCodeAt(d.state.pos + 1) === g.charCodes.leftCurlyBrace)
        ) {
          if (d.state.pos === d.state.start && Bi(U.TokenType.template))
            if (e === g.charCodes.dollarSign) {
              (d.state.pos += 2), we(U.TokenType.dollarBraceL);
              return;
            } else {
              ++d.state.pos, we(U.TokenType.backQuote);
              return;
            }
          we(U.TokenType.template);
          return;
        }
        e === g.charCodes.backslash && d.state.pos++, d.state.pos++;
      }
    }
    function Ec() {
      for (; d.state.pos < d.input.length; ) {
        let e = d.input.charCodeAt(d.state.pos);
        if (kc.IS_IDENTIFIER_CHAR[e]) d.state.pos++;
        else if (e === g.charCodes.backslash) {
          if (
            ((d.state.pos += 2),
            d.input.charCodeAt(d.state.pos) === g.charCodes.leftCurlyBrace)
          ) {
            for (
              ;
              d.state.pos < d.input.length &&
              d.input.charCodeAt(d.state.pos) !== g.charCodes.rightCurlyBrace;

            )
              d.state.pos++;
            d.state.pos++;
          }
        } else break;
      }
    }
    xe.skipWord = Ec;
  });
  var Ko = H((ji) => {
    'use strict';
    Object.defineProperty(ji, '__esModule', {value: !0});
    var Ac = ce();
    function Gh(e, t = e.currentIndex()) {
      let n = t + 1;
      if (Fr(e, n)) {
        let o = e.identifierNameAtIndex(t);
        return {isType: !1, leftName: o, rightName: o, endIndex: n};
      }
      if ((n++, Fr(e, n)))
        return {isType: !0, leftName: null, rightName: null, endIndex: n};
      if ((n++, Fr(e, n)))
        return {
          isType: !1,
          leftName: e.identifierNameAtIndex(t),
          rightName: e.identifierNameAtIndex(t + 2),
          endIndex: n,
        };
      if ((n++, Fr(e, n)))
        return {isType: !0, leftName: null, rightName: null, endIndex: n};
      throw new Error(`Unexpected import/export specifier at ${t}`);
    }
    ji.default = Gh;
    function Fr(e, t) {
      let n = e.tokens[t];
      return n.type === Ac.TokenType.braceR || n.type === Ac.TokenType.comma;
    }
  });
  var Pc = H((Ki) => {
    'use strict';
    Object.defineProperty(Ki, '__esModule', {value: !0});
    Ki.default = new Map([
      ['quot', '"'],
      ['amp', '&'],
      ['apos', "'"],
      ['lt', '<'],
      ['gt', '>'],
      ['nbsp', '\xA0'],
      ['iexcl', '\xA1'],
      ['cent', '\xA2'],
      ['pound', '\xA3'],
      ['curren', '\xA4'],
      ['yen', '\xA5'],
      ['brvbar', '\xA6'],
      ['sect', '\xA7'],
      ['uml', '\xA8'],
      ['copy', '\xA9'],
      ['ordf', '\xAA'],
      ['laquo', '\xAB'],
      ['not', '\xAC'],
      ['shy', '\xAD'],
      ['reg', '\xAE'],
      ['macr', '\xAF'],
      ['deg', '\xB0'],
      ['plusmn', '\xB1'],
      ['sup2', '\xB2'],
      ['sup3', '\xB3'],
      ['acute', '\xB4'],
      ['micro', '\xB5'],
      ['para', '\xB6'],
      ['middot', '\xB7'],
      ['cedil', '\xB8'],
      ['sup1', '\xB9'],
      ['ordm', '\xBA'],
      ['raquo', '\xBB'],
      ['frac14', '\xBC'],
      ['frac12', '\xBD'],
      ['frac34', '\xBE'],
      ['iquest', '\xBF'],
      ['Agrave', '\xC0'],
      ['Aacute', '\xC1'],
      ['Acirc', '\xC2'],
      ['Atilde', '\xC3'],
      ['Auml', '\xC4'],
      ['Aring', '\xC5'],
      ['AElig', '\xC6'],
      ['Ccedil', '\xC7'],
      ['Egrave', '\xC8'],
      ['Eacute', '\xC9'],
      ['Ecirc', '\xCA'],
      ['Euml', '\xCB'],
      ['Igrave', '\xCC'],
      ['Iacute', '\xCD'],
      ['Icirc', '\xCE'],
      ['Iuml', '\xCF'],
      ['ETH', '\xD0'],
      ['Ntilde', '\xD1'],
      ['Ograve', '\xD2'],
      ['Oacute', '\xD3'],
      ['Ocirc', '\xD4'],
      ['Otilde', '\xD5'],
      ['Ouml', '\xD6'],
      ['times', '\xD7'],
      ['Oslash', '\xD8'],
      ['Ugrave', '\xD9'],
      ['Uacute', '\xDA'],
      ['Ucirc', '\xDB'],
      ['Uuml', '\xDC'],
      ['Yacute', '\xDD'],
      ['THORN', '\xDE'],
      ['szlig', '\xDF'],
      ['agrave', '\xE0'],
      ['aacute', '\xE1'],
      ['acirc', '\xE2'],
      ['atilde', '\xE3'],
      ['auml', '\xE4'],
      ['aring', '\xE5'],
      ['aelig', '\xE6'],
      ['ccedil', '\xE7'],
      ['egrave', '\xE8'],
      ['eacute', '\xE9'],
      ['ecirc', '\xEA'],
      ['euml', '\xEB'],
      ['igrave', '\xEC'],
      ['iacute', '\xED'],
      ['icirc', '\xEE'],
      ['iuml', '\xEF'],
      ['eth', '\xF0'],
      ['ntilde', '\xF1'],
      ['ograve', '\xF2'],
      ['oacute', '\xF3'],
      ['ocirc', '\xF4'],
      ['otilde', '\xF5'],
      ['ouml', '\xF6'],
      ['divide', '\xF7'],
      ['oslash', '\xF8'],
      ['ugrave', '\xF9'],
      ['uacute', '\xFA'],
      ['ucirc', '\xFB'],
      ['uuml', '\xFC'],
      ['yacute', '\xFD'],
      ['thorn', '\xFE'],
      ['yuml', '\xFF'],
      ['OElig', '\u0152'],
      ['oelig', '\u0153'],
      ['Scaron', '\u0160'],
      ['scaron', '\u0161'],
      ['Yuml', '\u0178'],
      ['fnof', '\u0192'],
      ['circ', '\u02C6'],
      ['tilde', '\u02DC'],
      ['Alpha', '\u0391'],
      ['Beta', '\u0392'],
      ['Gamma', '\u0393'],
      ['Delta', '\u0394'],
      ['Epsilon', '\u0395'],
      ['Zeta', '\u0396'],
      ['Eta', '\u0397'],
      ['Theta', '\u0398'],
      ['Iota', '\u0399'],
      ['Kappa', '\u039A'],
      ['Lambda', '\u039B'],
      ['Mu', '\u039C'],
      ['Nu', '\u039D'],
      ['Xi', '\u039E'],
      ['Omicron', '\u039F'],
      ['Pi', '\u03A0'],
      ['Rho', '\u03A1'],
      ['Sigma', '\u03A3'],
      ['Tau', '\u03A4'],
      ['Upsilon', '\u03A5'],
      ['Phi', '\u03A6'],
      ['Chi', '\u03A7'],
      ['Psi', '\u03A8'],
      ['Omega', '\u03A9'],
      ['alpha', '\u03B1'],
      ['beta', '\u03B2'],
      ['gamma', '\u03B3'],
      ['delta', '\u03B4'],
      ['epsilon', '\u03B5'],
      ['zeta', '\u03B6'],
      ['eta', '\u03B7'],
      ['theta', '\u03B8'],
      ['iota', '\u03B9'],
      ['kappa', '\u03BA'],
      ['lambda', '\u03BB'],
      ['mu', '\u03BC'],
      ['nu', '\u03BD'],
      ['xi', '\u03BE'],
      ['omicron', '\u03BF'],
      ['pi', '\u03C0'],
      ['rho', '\u03C1'],
      ['sigmaf', '\u03C2'],
      ['sigma', '\u03C3'],
      ['tau', '\u03C4'],
      ['upsilon', '\u03C5'],
      ['phi', '\u03C6'],
      ['chi', '\u03C7'],
      ['psi', '\u03C8'],
      ['omega', '\u03C9'],
      ['thetasym', '\u03D1'],
      ['upsih', '\u03D2'],
      ['piv', '\u03D6'],
      ['ensp', '\u2002'],
      ['emsp', '\u2003'],
      ['thinsp', '\u2009'],
      ['zwnj', '\u200C'],
      ['zwj', '\u200D'],
      ['lrm', '\u200E'],
      ['rlm', '\u200F'],
      ['ndash', '\u2013'],
      ['mdash', '\u2014'],
      ['lsquo', '\u2018'],
      ['rsquo', '\u2019'],
      ['sbquo', '\u201A'],
      ['ldquo', '\u201C'],
      ['rdquo', '\u201D'],
      ['bdquo', '\u201E'],
      ['dagger', '\u2020'],
      ['Dagger', '\u2021'],
      ['bull', '\u2022'],
      ['hellip', '\u2026'],
      ['permil', '\u2030'],
      ['prime', '\u2032'],
      ['Prime', '\u2033'],
      ['lsaquo', '\u2039'],
      ['rsaquo', '\u203A'],
      ['oline', '\u203E'],
      ['frasl', '\u2044'],
      ['euro', '\u20AC'],
      ['image', '\u2111'],
      ['weierp', '\u2118'],
      ['real', '\u211C'],
      ['trade', '\u2122'],
      ['alefsym', '\u2135'],
      ['larr', '\u2190'],
      ['uarr', '\u2191'],
      ['rarr', '\u2192'],
      ['darr', '\u2193'],
      ['harr', '\u2194'],
      ['crarr', '\u21B5'],
      ['lArr', '\u21D0'],
      ['uArr', '\u21D1'],
      ['rArr', '\u21D2'],
      ['dArr', '\u21D3'],
      ['hArr', '\u21D4'],
      ['forall', '\u2200'],
      ['part', '\u2202'],
      ['exist', '\u2203'],
      ['empty', '\u2205'],
      ['nabla', '\u2207'],
      ['isin', '\u2208'],
      ['notin', '\u2209'],
      ['ni', '\u220B'],
      ['prod', '\u220F'],
      ['sum', '\u2211'],
      ['minus', '\u2212'],
      ['lowast', '\u2217'],
      ['radic', '\u221A'],
      ['prop', '\u221D'],
      ['infin', '\u221E'],
      ['ang', '\u2220'],
      ['and', '\u2227'],
      ['or', '\u2228'],
      ['cap', '\u2229'],
      ['cup', '\u222A'],
      ['int', '\u222B'],
      ['there4', '\u2234'],
      ['sim', '\u223C'],
      ['cong', '\u2245'],
      ['asymp', '\u2248'],
      ['ne', '\u2260'],
      ['equiv', '\u2261'],
      ['le', '\u2264'],
      ['ge', '\u2265'],
      ['sub', '\u2282'],
      ['sup', '\u2283'],
      ['nsub', '\u2284'],
      ['sube', '\u2286'],
      ['supe', '\u2287'],
      ['oplus', '\u2295'],
      ['otimes', '\u2297'],
      ['perp', '\u22A5'],
      ['sdot', '\u22C5'],
      ['lceil', '\u2308'],
      ['rceil', '\u2309'],
      ['lfloor', '\u230A'],
      ['rfloor', '\u230B'],
      ['lang', '\u2329'],
      ['rang', '\u232A'],
      ['loz', '\u25CA'],
      ['spades', '\u2660'],
      ['clubs', '\u2663'],
      ['hearts', '\u2665'],
      ['diams', '\u2666'],
    ]);
  });
  var Hi = H((qi) => {
    'use strict';
    Object.defineProperty(qi, '__esModule', {value: !0});
    function Jh(e) {
      let [t, n] = Rc(e.jsxPragma || 'React.createElement'),
        [o, r] = Rc(e.jsxFragmentPragma || 'React.Fragment');
      return {base: t, suffix: n, fragmentBase: o, fragmentSuffix: r};
    }
    qi.default = Jh;
    function Rc(e) {
      let t = e.indexOf('.');
      return t === -1 && (t = e.length), [e.slice(0, t), e.slice(t)];
    }
  });
  var Nt = H((Wi) => {
    'use strict';
    Object.defineProperty(Wi, '__esModule', {value: !0});
    var Ui = class {
      getPrefixCode() {
        return '';
      }
      getHoistedCode() {
        return '';
      }
      getSuffixCode() {
        return '';
      }
    };
    Wi.default = Ui;
  });
  var Xi = H((Br) => {
    'use strict';
    Object.defineProperty(Br, '__esModule', {value: !0});
    function zi(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Qh = Pc(),
      Zh = zi(Qh),
      $r = Ve(),
      Te = ce(),
      Jt = gt(),
      eT = Hi(),
      tT = zi(eT),
      nT = Nt(),
      oT = zi(nT),
      Vi = class e extends oT.default {
        __init() {
          this.lastLineNumber = 1;
        }
        __init2() {
          this.lastIndex = 0;
        }
        __init3() {
          this.filenameVarName = null;
        }
        __init4() {
          this.esmAutomaticImportNameResolutions = {};
        }
        __init5() {
          this.cjsAutomaticModuleNameResolutions = {};
        }
        constructor(t, n, o, r, s) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.importProcessor = o),
            (this.nameManager = r),
            (this.options = s),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            e.prototype.__init4.call(this),
            e.prototype.__init5.call(this),
            (this.jsxPragmaInfo = tT.default.call(void 0, s)),
            (this.isAutomaticRuntime = s.jsxRuntime === 'automatic'),
            (this.jsxImportSource = s.jsxImportSource || 'react');
        }
        process() {
          return this.tokens.matches1(Te.TokenType.jsxTagStart)
            ? (this.processJSXTag(), !0)
            : !1;
        }
        getPrefixCode() {
          let t = '';
          if (
            (this.filenameVarName &&
              (t += `const ${this.filenameVarName} = ${JSON.stringify(
                this.options.filePath || ''
              )};`),
            this.isAutomaticRuntime)
          )
            if (this.importProcessor)
              for (let [n, o] of Object.entries(
                this.cjsAutomaticModuleNameResolutions
              ))
                t += `var ${o} = require("${n}");`;
            else {
              let {createElement: n, ...o} =
                this.esmAutomaticImportNameResolutions;
              n &&
                (t += `import {createElement as ${n}} from "${this.jsxImportSource}";`);
              let r = Object.entries(o)
                .map(([s, i]) => `${s} as ${i}`)
                .join(', ');
              if (r) {
                let s =
                  this.jsxImportSource +
                  (this.options.production
                    ? '/jsx-runtime'
                    : '/jsx-dev-runtime');
                t += `import {${r}} from "${s}";`;
              }
            }
          return t;
        }
        processJSXTag() {
          let {jsxRole: t, start: n} = this.tokens.currentToken(),
            o = this.options.production ? null : this.getElementLocationCode(n);
          this.isAutomaticRuntime && t !== $r.JSXRole.KeyAfterPropSpread
            ? this.transformTagToJSXFunc(o, t)
            : this.transformTagToCreateElement(o);
        }
        getElementLocationCode(t) {
          return `lineNumber: ${this.getLineNumberForIndex(t)}`;
        }
        getLineNumberForIndex(t) {
          let n = this.tokens.code;
          for (; this.lastIndex < t && this.lastIndex < n.length; )
            n[this.lastIndex] ===
              `
` && this.lastLineNumber++,
              this.lastIndex++;
          return this.lastLineNumber;
        }
        transformTagToJSXFunc(t, n) {
          let o = n === $r.JSXRole.StaticChildren;
          this.tokens.replaceToken(this.getJSXFuncInvocationCode(o));
          let r = null;
          if (this.tokens.matches1(Te.TokenType.jsxTagEnd))
            this.tokens.replaceToken(`${this.getFragmentCode()}, {`),
              this.processAutomaticChildrenAndEndProps(n);
          else {
            if (
              (this.processTagIntro(),
              this.tokens.appendCode(', {'),
              (r = this.processProps(!0)),
              this.tokens.matches2(Te.TokenType.slash, Te.TokenType.jsxTagEnd))
            )
              this.tokens.appendCode('}');
            else if (this.tokens.matches1(Te.TokenType.jsxTagEnd))
              this.tokens.removeToken(),
                this.processAutomaticChildrenAndEndProps(n);
            else
              throw new Error('Expected either /> or > at the end of the tag.');
            r && this.tokens.appendCode(`, ${r}`);
          }
          for (
            this.options.production ||
              (r === null && this.tokens.appendCode(', void 0'),
              this.tokens.appendCode(`, ${o}, ${this.getDevSource(t)}, this`)),
              this.tokens.removeInitialToken();
            !this.tokens.matches1(Te.TokenType.jsxTagEnd);

          )
            this.tokens.removeToken();
          this.tokens.replaceToken(')');
        }
        transformTagToCreateElement(t) {
          if (
            (this.tokens.replaceToken(this.getCreateElementInvocationCode()),
            this.tokens.matches1(Te.TokenType.jsxTagEnd))
          )
            this.tokens.replaceToken(`${this.getFragmentCode()}, null`),
              this.processChildren(!0);
          else if (
            (this.processTagIntro(),
            this.processPropsObjectWithDevInfo(t),
            !this.tokens.matches2(Te.TokenType.slash, Te.TokenType.jsxTagEnd))
          )
            if (this.tokens.matches1(Te.TokenType.jsxTagEnd))
              this.tokens.removeToken(), this.processChildren(!0);
            else
              throw new Error('Expected either /> or > at the end of the tag.');
          for (
            this.tokens.removeInitialToken();
            !this.tokens.matches1(Te.TokenType.jsxTagEnd);

          )
            this.tokens.removeToken();
          this.tokens.replaceToken(')');
        }
        getJSXFuncInvocationCode(t) {
          return this.options.production
            ? t
              ? this.claimAutoImportedFuncInvocation('jsxs', '/jsx-runtime')
              : this.claimAutoImportedFuncInvocation('jsx', '/jsx-runtime')
            : this.claimAutoImportedFuncInvocation(
                'jsxDEV',
                '/jsx-dev-runtime'
              );
        }
        getCreateElementInvocationCode() {
          if (this.isAutomaticRuntime)
            return this.claimAutoImportedFuncInvocation('createElement', '');
          {
            let {jsxPragmaInfo: t} = this;
            return `${
              (this.importProcessor &&
                this.importProcessor.getIdentifierReplacement(t.base)) ||
              t.base
            }${t.suffix}(`;
          }
        }
        getFragmentCode() {
          if (this.isAutomaticRuntime)
            return this.claimAutoImportedName(
              'Fragment',
              this.options.production ? '/jsx-runtime' : '/jsx-dev-runtime'
            );
          {
            let {jsxPragmaInfo: t} = this;
            return (
              ((this.importProcessor &&
                this.importProcessor.getIdentifierReplacement(
                  t.fragmentBase
                )) ||
                t.fragmentBase) + t.fragmentSuffix
            );
          }
        }
        claimAutoImportedFuncInvocation(t, n) {
          let o = this.claimAutoImportedName(t, n);
          return this.importProcessor ? `${o}.call(void 0, ` : `${o}(`;
        }
        claimAutoImportedName(t, n) {
          if (this.importProcessor) {
            let o = this.jsxImportSource + n;
            return (
              this.cjsAutomaticModuleNameResolutions[o] ||
                (this.cjsAutomaticModuleNameResolutions[o] =
                  this.importProcessor.getFreeIdentifierForPath(o)),
              `${this.cjsAutomaticModuleNameResolutions[o]}.${t}`
            );
          } else
            return (
              this.esmAutomaticImportNameResolutions[t] ||
                (this.esmAutomaticImportNameResolutions[t] =
                  this.nameManager.claimFreeName(`_${t}`)),
              this.esmAutomaticImportNameResolutions[t]
            );
        }
        processTagIntro() {
          let t = this.tokens.currentIndex() + 1;
          for (
            ;
            this.tokens.tokens[t].isType ||
            (!this.tokens.matches2AtIndex(
              t - 1,
              Te.TokenType.jsxName,
              Te.TokenType.jsxName
            ) &&
              !this.tokens.matches2AtIndex(
                t - 1,
                Te.TokenType.greaterThan,
                Te.TokenType.jsxName
              ) &&
              !this.tokens.matches1AtIndex(t, Te.TokenType.braceL) &&
              !this.tokens.matches1AtIndex(t, Te.TokenType.jsxTagEnd) &&
              !this.tokens.matches2AtIndex(
                t,
                Te.TokenType.slash,
                Te.TokenType.jsxTagEnd
              ));

          )
            t++;
          if (t === this.tokens.currentIndex() + 1) {
            let n = this.tokens.identifierName();
            Dc(n) && this.tokens.replaceToken(`'${n}'`);
          }
          for (; this.tokens.currentIndex() < t; )
            this.rootTransformer.processToken();
        }
        processPropsObjectWithDevInfo(t) {
          let n = this.options.production
            ? ''
            : `__self: this, __source: ${this.getDevSource(t)}`;
          if (
            !this.tokens.matches1(Te.TokenType.jsxName) &&
            !this.tokens.matches1(Te.TokenType.braceL)
          ) {
            n
              ? this.tokens.appendCode(`, {${n}}`)
              : this.tokens.appendCode(', null');
            return;
          }
          this.tokens.appendCode(', {'),
            this.processProps(!1),
            n ? this.tokens.appendCode(` ${n}}`) : this.tokens.appendCode('}');
        }
        processProps(t) {
          let n = null;
          for (;;) {
            if (this.tokens.matches2(Te.TokenType.jsxName, Te.TokenType.eq)) {
              let o = this.tokens.identifierName();
              if (t && o === 'key') {
                n !== null && this.tokens.appendCode(n.replace(/[^\n]/g, '')),
                  this.tokens.removeToken(),
                  this.tokens.removeToken();
                let r = this.tokens.snapshot();
                this.processPropValue(),
                  (n = this.tokens.dangerouslyGetAndRemoveCodeSinceSnapshot(r));
                continue;
              } else
                this.processPropName(o),
                  this.tokens.replaceToken(': '),
                  this.processPropValue();
            } else if (this.tokens.matches1(Te.TokenType.jsxName)) {
              let o = this.tokens.identifierName();
              this.processPropName(o), this.tokens.appendCode(': true');
            } else if (this.tokens.matches1(Te.TokenType.braceL))
              this.tokens.replaceToken(''),
                this.rootTransformer.processBalancedCode(),
                this.tokens.replaceToken('');
            else break;
            this.tokens.appendCode(',');
          }
          return n;
        }
        processPropName(t) {
          t.includes('-')
            ? this.tokens.replaceToken(`'${t}'`)
            : this.tokens.copyToken();
        }
        processPropValue() {
          this.tokens.matches1(Te.TokenType.braceL)
            ? (this.tokens.replaceToken(''),
              this.rootTransformer.processBalancedCode(),
              this.tokens.replaceToken(''))
            : this.tokens.matches1(Te.TokenType.jsxTagStart)
            ? this.processJSXTag()
            : this.processStringPropValue();
        }
        processStringPropValue() {
          let t = this.tokens.currentToken(),
            n = this.tokens.code.slice(t.start + 1, t.end - 1),
            o = Nc(n),
            r = sT(n);
          this.tokens.replaceToken(r + o);
        }
        processAutomaticChildrenAndEndProps(t) {
          t === $r.JSXRole.StaticChildren
            ? (this.tokens.appendCode(' children: ['),
              this.processChildren(!1),
              this.tokens.appendCode(']}'))
            : (t === $r.JSXRole.OneChild &&
                this.tokens.appendCode(' children: '),
              this.processChildren(!1),
              this.tokens.appendCode('}'));
        }
        processChildren(t) {
          let n = t;
          for (;;) {
            if (
              this.tokens.matches2(Te.TokenType.jsxTagStart, Te.TokenType.slash)
            )
              return;
            let o = !1;
            if (this.tokens.matches1(Te.TokenType.braceL))
              this.tokens.matches2(Te.TokenType.braceL, Te.TokenType.braceR)
                ? (this.tokens.replaceToken(''), this.tokens.replaceToken(''))
                : (this.tokens.replaceToken(n ? ', ' : ''),
                  this.rootTransformer.processBalancedCode(),
                  this.tokens.replaceToken(''),
                  (o = !0));
            else if (this.tokens.matches1(Te.TokenType.jsxTagStart))
              this.tokens.appendCode(n ? ', ' : ''),
                this.processJSXTag(),
                (o = !0);
            else if (
              this.tokens.matches1(Te.TokenType.jsxText) ||
              this.tokens.matches1(Te.TokenType.jsxEmptyText)
            )
              o = this.processChildTextElement(n);
            else
              throw new Error('Unexpected token when processing JSX children.');
            o && (n = !0);
          }
        }
        processChildTextElement(t) {
          let n = this.tokens.currentToken(),
            o = this.tokens.code.slice(n.start, n.end),
            r = Nc(o),
            s = rT(o);
          return s === '""'
            ? (this.tokens.replaceToken(r), !1)
            : (this.tokens.replaceToken(`${t ? ', ' : ''}${s}${r}`), !0);
        }
        getDevSource(t) {
          return `{fileName: ${this.getFilenameVarName()}, ${t}}`;
        }
        getFilenameVarName() {
          return (
            this.filenameVarName ||
              (this.filenameVarName =
                this.nameManager.claimFreeName('_jsxFileName')),
            this.filenameVarName
          );
        }
      };
    Br.default = Vi;
    function Dc(e) {
      let t = e.charCodeAt(0);
      return t >= Jt.charCodes.lowercaseA && t <= Jt.charCodes.lowercaseZ;
    }
    Br.startsWithLowerCase = Dc;
    function rT(e) {
      let t = '',
        n = '',
        o = !1,
        r = !1;
      for (let s = 0; s < e.length; s++) {
        let i = e[s];
        if (i === ' ' || i === '	' || i === '\r') o || (n += i);
        else if (
          i ===
          `
`
        )
          (n = ''), (o = !0);
        else {
          if ((r && o && (t += ' '), (t += n), (n = ''), i === '&')) {
            let {entity: a, newI: u} = Oc(e, s + 1);
            (s = u - 1), (t += a);
          } else t += i;
          (r = !0), (o = !1);
        }
      }
      return o || (t += n), JSON.stringify(t);
    }
    function Nc(e) {
      let t = 0,
        n = 0;
      for (let o of e)
        o ===
        `
`
          ? (t++, (n = 0))
          : o === ' ' && n++;
      return (
        `
`.repeat(t) + ' '.repeat(n)
      );
    }
    function sT(e) {
      let t = '';
      for (let n = 0; n < e.length; n++) {
        let o = e[n];
        if (
          o ===
          `
`
        )
          if (/\s/.test(e[n + 1]))
            for (t += ' '; n < e.length && /\s/.test(e[n + 1]); ) n++;
          else
            t += `
`;
        else if (o === '&') {
          let {entity: r, newI: s} = Oc(e, n + 1);
          (t += r), (n = s - 1);
        } else t += o;
      }
      return JSON.stringify(t);
    }
    function Oc(e, t) {
      let n = '',
        o = 0,
        r,
        s = t;
      if (e[s] === '#') {
        let i = 10;
        s++;
        let a;
        if (e[s] === 'x')
          for (i = 16, s++, a = s; s < e.length && aT(e.charCodeAt(s)); ) s++;
        else for (a = s; s < e.length && iT(e.charCodeAt(s)); ) s++;
        if (e[s] === ';') {
          let u = e.slice(a, s);
          u && (s++, (r = String.fromCodePoint(parseInt(u, i))));
        }
      } else
        for (; s < e.length && o++ < 10; ) {
          let i = e[s];
          if ((s++, i === ';')) {
            r = Zh.default.get(n);
            break;
          }
          n += i;
        }
      return r ? {entity: r, newI: s} : {entity: '&', newI: t};
    }
    function iT(e) {
      return e >= Jt.charCodes.digit0 && e <= Jt.charCodes.digit9;
    }
    function aT(e) {
      return (
        (e >= Jt.charCodes.digit0 && e <= Jt.charCodes.digit9) ||
        (e >= Jt.charCodes.lowercaseA && e <= Jt.charCodes.lowercaseF) ||
        (e >= Jt.charCodes.uppercaseA && e <= Jt.charCodes.uppercaseF)
      );
    }
  });
  var Gi = H((Yi) => {
    'use strict';
    Object.defineProperty(Yi, '__esModule', {value: !0});
    function lT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var jr = Ve(),
      To = ce(),
      cT = Xi(),
      uT = Hi(),
      pT = lT(uT);
    function dT(e, t) {
      let n = pT.default.call(void 0, t),
        o = new Set();
      for (let r = 0; r < e.tokens.length; r++) {
        let s = e.tokens[r];
        if (
          (s.type === To.TokenType.name &&
            !s.isType &&
            (s.identifierRole === jr.IdentifierRole.Access ||
              s.identifierRole === jr.IdentifierRole.ObjectShorthand ||
              s.identifierRole === jr.IdentifierRole.ExportAccess) &&
            !s.shadowsGlobal &&
            o.add(e.identifierNameForToken(s)),
          s.type === To.TokenType.jsxTagStart && o.add(n.base),
          s.type === To.TokenType.jsxTagStart &&
            r + 1 < e.tokens.length &&
            e.tokens[r + 1].type === To.TokenType.jsxTagEnd &&
            (o.add(n.base), o.add(n.fragmentBase)),
          s.type === To.TokenType.jsxName &&
            s.identifierRole === jr.IdentifierRole.Access)
        ) {
          let i = e.identifierNameForToken(s);
          (!cT.startsWithLowerCase.call(void 0, i) ||
            e.tokens[r + 1].type === To.TokenType.dot) &&
            o.add(e.identifierNameForToken(s));
        }
      }
      return o;
    }
    Yi.getNonTypeIdentifiers = dT;
  });
  var Mc = H((Qi) => {
    'use strict';
    Object.defineProperty(Qi, '__esModule', {value: !0});
    function fT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var hT = Ve(),
      Kr = Ge(),
      ee = ce(),
      TT = Ko(),
      yT = fT(TT),
      mT = Gi(),
      Ji = class e {
        __init() {
          this.nonTypeIdentifiers = new Set();
        }
        __init2() {
          this.importInfoByPath = new Map();
        }
        __init3() {
          this.importsToReplace = new Map();
        }
        __init4() {
          this.identifierReplacements = new Map();
        }
        __init5() {
          this.exportBindingsByLocalName = new Map();
        }
        constructor(t, n, o, r, s, i) {
          (this.nameManager = t),
            (this.tokens = n),
            (this.enableLegacyTypeScriptModuleInterop = o),
            (this.options = r),
            (this.isTypeScriptTransformEnabled = s),
            (this.helperManager = i),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            e.prototype.__init4.call(this),
            e.prototype.__init5.call(this);
        }
        preprocessTokens() {
          for (let t = 0; t < this.tokens.tokens.length; t++)
            this.tokens.matches1AtIndex(t, ee.TokenType._import) &&
              !this.tokens.matches3AtIndex(
                t,
                ee.TokenType._import,
                ee.TokenType.name,
                ee.TokenType.eq
              ) &&
              this.preprocessImportAtIndex(t),
              this.tokens.matches1AtIndex(t, ee.TokenType._export) &&
                !this.tokens.matches2AtIndex(
                  t,
                  ee.TokenType._export,
                  ee.TokenType.eq
                ) &&
                this.preprocessExportAtIndex(t);
          this.generateImportReplacements();
        }
        pruneTypeOnlyImports() {
          this.nonTypeIdentifiers = mT.getNonTypeIdentifiers.call(
            void 0,
            this.tokens,
            this.options
          );
          for (let [t, n] of this.importInfoByPath.entries()) {
            if (
              n.hasBareImport ||
              n.hasStarExport ||
              n.exportStarNames.length > 0 ||
              n.namedExports.length > 0
            )
              continue;
            [
              ...n.defaultNames,
              ...n.wildcardNames,
              ...n.namedImports.map(({localName: r}) => r),
            ].every((r) => this.isTypeName(r)) &&
              this.importsToReplace.set(t, '');
          }
        }
        isTypeName(t) {
          return (
            this.isTypeScriptTransformEnabled && !this.nonTypeIdentifiers.has(t)
          );
        }
        generateImportReplacements() {
          for (let [t, n] of this.importInfoByPath.entries()) {
            let {
              defaultNames: o,
              wildcardNames: r,
              namedImports: s,
              namedExports: i,
              exportStarNames: a,
              hasStarExport: u,
            } = n;
            if (
              o.length === 0 &&
              r.length === 0 &&
              s.length === 0 &&
              i.length === 0 &&
              a.length === 0 &&
              !u
            ) {
              this.importsToReplace.set(t, `require('${t}');`);
              continue;
            }
            let h = this.getFreeIdentifierForPath(t),
              v;
            this.enableLegacyTypeScriptModuleInterop
              ? (v = h)
              : (v = r.length > 0 ? r[0] : this.getFreeIdentifierForPath(t));
            let _ = `var ${h} = require('${t}');`;
            if (r.length > 0)
              for (let x of r) {
                let L = this.enableLegacyTypeScriptModuleInterop
                  ? h
                  : `${this.helperManager.getHelperName(
                      'interopRequireWildcard'
                    )}(${h})`;
                _ += ` var ${x} = ${L};`;
              }
            else
              a.length > 0 && v !== h
                ? (_ += ` var ${v} = ${this.helperManager.getHelperName(
                    'interopRequireWildcard'
                  )}(${h});`)
                : o.length > 0 &&
                  v !== h &&
                  (_ += ` var ${v} = ${this.helperManager.getHelperName(
                    'interopRequireDefault'
                  )}(${h});`);
            for (let {importedName: x, localName: L} of i)
              _ += ` ${this.helperManager.getHelperName(
                'createNamedExportFrom'
              )}(${h}, '${L}', '${x}');`;
            for (let x of a) _ += ` exports.${x} = ${v};`;
            u &&
              (_ += ` ${this.helperManager.getHelperName(
                'createStarExport'
              )}(${h});`),
              this.importsToReplace.set(t, _);
            for (let x of o) this.identifierReplacements.set(x, `${v}.default`);
            for (let {importedName: x, localName: L} of s)
              this.identifierReplacements.set(L, `${h}.${x}`);
          }
        }
        getFreeIdentifierForPath(t) {
          let n = t.split('/'),
            r = n[n.length - 1].replace(/\W/g, '');
          return this.nameManager.claimFreeName(`_${r}`);
        }
        preprocessImportAtIndex(t) {
          let n = [],
            o = [],
            r = [];
          if (
            (t++,
            ((this.tokens.matchesContextualAtIndex(
              t,
              Kr.ContextualKeyword._type
            ) ||
              this.tokens.matches1AtIndex(t, ee.TokenType._typeof)) &&
              !this.tokens.matches1AtIndex(t + 1, ee.TokenType.comma) &&
              !this.tokens.matchesContextualAtIndex(
                t + 1,
                Kr.ContextualKeyword._from
              )) ||
              this.tokens.matches1AtIndex(t, ee.TokenType.parenL))
          )
            return;
          if (
            (this.tokens.matches1AtIndex(t, ee.TokenType.name) &&
              (n.push(this.tokens.identifierNameAtIndex(t)),
              t++,
              this.tokens.matches1AtIndex(t, ee.TokenType.comma) && t++),
            this.tokens.matches1AtIndex(t, ee.TokenType.star) &&
              ((t += 2), o.push(this.tokens.identifierNameAtIndex(t)), t++),
            this.tokens.matches1AtIndex(t, ee.TokenType.braceL))
          ) {
            let a = this.getNamedImports(t + 1);
            t = a.newIndex;
            for (let u of a.namedImports)
              u.importedName === 'default' ? n.push(u.localName) : r.push(u);
          }
          if (
            (this.tokens.matchesContextualAtIndex(
              t,
              Kr.ContextualKeyword._from
            ) && t++,
            !this.tokens.matches1AtIndex(t, ee.TokenType.string))
          )
            throw new Error(
              'Expected string token at the end of import statement.'
            );
          let s = this.tokens.stringValueAtIndex(t),
            i = this.getImportInfo(s);
          i.defaultNames.push(...n),
            i.wildcardNames.push(...o),
            i.namedImports.push(...r),
            n.length === 0 &&
              o.length === 0 &&
              r.length === 0 &&
              (i.hasBareImport = !0);
        }
        preprocessExportAtIndex(t) {
          if (
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType._var
            ) ||
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType._let
            ) ||
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType._const
            )
          )
            this.preprocessVarExportAtIndex(t);
          else if (
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType._function
            ) ||
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType._class
            )
          ) {
            let n = this.tokens.identifierNameAtIndex(t + 2);
            this.addExportBinding(n, n);
          } else if (
            this.tokens.matches3AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType.name,
              ee.TokenType._function
            )
          ) {
            let n = this.tokens.identifierNameAtIndex(t + 3);
            this.addExportBinding(n, n);
          } else
            this.tokens.matches2AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType.braceL
            )
              ? this.preprocessNamedExportAtIndex(t)
              : this.tokens.matches2AtIndex(
                  t,
                  ee.TokenType._export,
                  ee.TokenType.star
                ) && this.preprocessExportStarAtIndex(t);
        }
        preprocessVarExportAtIndex(t) {
          let n = 0;
          for (let o = t + 2; ; o++)
            if (
              this.tokens.matches1AtIndex(o, ee.TokenType.braceL) ||
              this.tokens.matches1AtIndex(o, ee.TokenType.dollarBraceL) ||
              this.tokens.matches1AtIndex(o, ee.TokenType.bracketL)
            )
              n++;
            else if (
              this.tokens.matches1AtIndex(o, ee.TokenType.braceR) ||
              this.tokens.matches1AtIndex(o, ee.TokenType.bracketR)
            )
              n--;
            else {
              if (n === 0 && !this.tokens.matches1AtIndex(o, ee.TokenType.name))
                break;
              if (this.tokens.matches1AtIndex(1, ee.TokenType.eq)) {
                let r = this.tokens.currentToken().rhsEndIndex;
                if (r == null)
                  throw new Error('Expected = token with an end index.');
                o = r - 1;
              } else {
                let r = this.tokens.tokens[o];
                if (hT.isDeclaration.call(void 0, r)) {
                  let s = this.tokens.identifierNameAtIndex(o);
                  this.identifierReplacements.set(s, `exports.${s}`);
                }
              }
            }
        }
        preprocessNamedExportAtIndex(t) {
          t += 2;
          let {newIndex: n, namedImports: o} = this.getNamedImports(t);
          if (
            ((t = n),
            this.tokens.matchesContextualAtIndex(t, Kr.ContextualKeyword._from))
          )
            t++;
          else {
            for (let {importedName: i, localName: a} of o)
              this.addExportBinding(i, a);
            return;
          }
          if (!this.tokens.matches1AtIndex(t, ee.TokenType.string))
            throw new Error(
              'Expected string token at the end of import statement.'
            );
          let r = this.tokens.stringValueAtIndex(t);
          this.getImportInfo(r).namedExports.push(...o);
        }
        preprocessExportStarAtIndex(t) {
          let n = null;
          if (
            (this.tokens.matches3AtIndex(
              t,
              ee.TokenType._export,
              ee.TokenType.star,
              ee.TokenType._as
            )
              ? ((t += 3), (n = this.tokens.identifierNameAtIndex(t)), (t += 2))
              : (t += 3),
            !this.tokens.matches1AtIndex(t, ee.TokenType.string))
          )
            throw new Error(
              'Expected string token at the end of star export statement.'
            );
          let o = this.tokens.stringValueAtIndex(t),
            r = this.getImportInfo(o);
          n !== null ? r.exportStarNames.push(n) : (r.hasStarExport = !0);
        }
        getNamedImports(t) {
          let n = [];
          for (;;) {
            if (this.tokens.matches1AtIndex(t, ee.TokenType.braceR)) {
              t++;
              break;
            }
            let o = yT.default.call(void 0, this.tokens, t);
            if (
              ((t = o.endIndex),
              o.isType ||
                n.push({importedName: o.leftName, localName: o.rightName}),
              this.tokens.matches2AtIndex(
                t,
                ee.TokenType.comma,
                ee.TokenType.braceR
              ))
            ) {
              t += 2;
              break;
            } else if (this.tokens.matches1AtIndex(t, ee.TokenType.braceR)) {
              t++;
              break;
            } else if (this.tokens.matches1AtIndex(t, ee.TokenType.comma)) t++;
            else
              throw new Error(
                `Unexpected token: ${JSON.stringify(this.tokens.tokens[t])}`
              );
          }
          return {newIndex: t, namedImports: n};
        }
        getImportInfo(t) {
          let n = this.importInfoByPath.get(t);
          if (n) return n;
          let o = {
            defaultNames: [],
            wildcardNames: [],
            namedImports: [],
            namedExports: [],
            hasBareImport: !1,
            exportStarNames: [],
            hasStarExport: !1,
          };
          return this.importInfoByPath.set(t, o), o;
        }
        addExportBinding(t, n) {
          this.exportBindingsByLocalName.has(t) ||
            this.exportBindingsByLocalName.set(t, []),
            this.exportBindingsByLocalName.get(t).push(n);
        }
        claimImportCode(t) {
          let n = this.importsToReplace.get(t);
          return this.importsToReplace.set(t, ''), n || '';
        }
        getIdentifierReplacement(t) {
          return this.identifierReplacements.get(t) || null;
        }
        resolveExportBinding(t) {
          let n = this.exportBindingsByLocalName.get(t);
          return !n || n.length === 0
            ? null
            : n.map((o) => `exports.${o}`).join(' = ');
        }
        getGlobalNames() {
          return new Set([
            ...this.identifierReplacements.keys(),
            ...this.exportBindingsByLocalName.keys(),
          ]);
        }
      };
    Qi.default = Ji;
  });
  var Fc = H((qr, Lc) => {
    (function (e, t) {
      typeof qr == 'object' && typeof Lc < 'u'
        ? t(qr)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.setArray = {})));
    })(qr, function (e) {
      'use strict';
      (e.get = void 0), (e.put = void 0), (e.pop = void 0);
      class t {
        constructor() {
          (this._indexes = {__proto__: null}), (this.array = []);
        }
      }
      (e.get = (n, o) => n._indexes[o]),
        (e.put = (n, o) => {
          let r = e.get(n, o);
          if (r !== void 0) return r;
          let {array: s, _indexes: i} = n;
          return (i[o] = s.push(o) - 1);
        }),
        (e.pop = (n) => {
          let {array: o, _indexes: r} = n;
          if (o.length === 0) return;
          let s = o.pop();
          r[s] = void 0;
        }),
        (e.SetArray = t),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var Zi = H((Hr, $c) => {
    (function (e, t) {
      typeof Hr == 'object' && typeof $c < 'u'
        ? t(Hr)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.sourcemapCodec = {})));
    })(Hr, function (e) {
      'use strict';
      let o =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        r = new Uint8Array(64),
        s = new Uint8Array(128);
      for (let F = 0; F < o.length; F++) {
        let K = o.charCodeAt(F);
        (r[F] = K), (s[K] = F);
      }
      let i =
        typeof TextDecoder < 'u'
          ? new TextDecoder()
          : typeof Buffer < 'u'
          ? {
              decode(F) {
                return Buffer.from(
                  F.buffer,
                  F.byteOffset,
                  F.byteLength
                ).toString();
              },
            }
          : {
              decode(F) {
                let K = '';
                for (let R = 0; R < F.length; R++)
                  K += String.fromCharCode(F[R]);
                return K;
              },
            };
      function a(F) {
        let K = new Int32Array(5),
          R = [],
          z = 0;
        do {
          let $ = u(F, z),
            O = [],
            A = !0,
            M = 0;
          K[0] = 0;
          for (let B = z; B < $; B++) {
            let oe;
            B = h(F, B, K, 0);
            let ne = K[0];
            ne < M && (A = !1),
              (M = ne),
              v(F, B, $)
                ? ((B = h(F, B, K, 1)),
                  (B = h(F, B, K, 2)),
                  (B = h(F, B, K, 3)),
                  v(F, B, $)
                    ? ((B = h(F, B, K, 4)), (oe = [ne, K[1], K[2], K[3], K[4]]))
                    : (oe = [ne, K[1], K[2], K[3]]))
                : (oe = [ne]),
              O.push(oe);
          }
          A || _(O), R.push(O), (z = $ + 1);
        } while (z <= F.length);
        return R;
      }
      function u(F, K) {
        let R = F.indexOf(';', K);
        return R === -1 ? F.length : R;
      }
      function h(F, K, R, z) {
        let $ = 0,
          O = 0,
          A = 0;
        do {
          let B = F.charCodeAt(K++);
          (A = s[B]), ($ |= (A & 31) << O), (O += 5);
        } while (A & 32);
        let M = $ & 1;
        return ($ >>>= 1), M && ($ = -2147483648 | -$), (R[z] += $), K;
      }
      function v(F, K, R) {
        return K >= R ? !1 : F.charCodeAt(K) !== 44;
      }
      function _(F) {
        F.sort(x);
      }
      function x(F, K) {
        return F[0] - K[0];
      }
      function L(F) {
        let K = new Int32Array(5),
          R = 1024 * 16,
          z = R - 36,
          $ = new Uint8Array(R),
          O = $.subarray(0, z),
          A = 0,
          M = '';
        for (let B = 0; B < F.length; B++) {
          let oe = F[B];
          if (
            (B > 0 && (A === R && ((M += i.decode($)), (A = 0)), ($[A++] = 59)),
            oe.length !== 0)
          ) {
            K[0] = 0;
            for (let ne = 0; ne < oe.length; ne++) {
              let re = oe[ne];
              A > z && ((M += i.decode(O)), $.copyWithin(0, z, A), (A -= z)),
                ne > 0 && ($[A++] = 44),
                (A = G($, A, K, re, 0)),
                re.length !== 1 &&
                  ((A = G($, A, K, re, 1)),
                  (A = G($, A, K, re, 2)),
                  (A = G($, A, K, re, 3)),
                  re.length !== 4 && (A = G($, A, K, re, 4)));
            }
          }
        }
        return M + i.decode($.subarray(0, A));
      }
      function G(F, K, R, z, $) {
        let O = z[$],
          A = O - R[$];
        (R[$] = O), (A = A < 0 ? (-A << 1) | 1 : A << 1);
        do {
          let M = A & 31;
          (A >>>= 5), A > 0 && (M |= 32), (F[K++] = r[M]);
        } while (A > 0);
        return K;
      }
      (e.decode = a),
        (e.encode = L),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var Bc = H((ea, ta) => {
    (function (e, t) {
      typeof ea == 'object' && typeof ta < 'u'
        ? (ta.exports = t())
        : typeof define == 'function' && define.amd
        ? define(t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          (e.resolveURI = t()));
    })(ea, function () {
      'use strict';
      let e = /^[\w+.-]+:\/\//,
        t =
          /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/,
        n = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
      var o;
      (function (R) {
        (R[(R.Empty = 1)] = 'Empty'),
          (R[(R.Hash = 2)] = 'Hash'),
          (R[(R.Query = 3)] = 'Query'),
          (R[(R.RelativePath = 4)] = 'RelativePath'),
          (R[(R.AbsolutePath = 5)] = 'AbsolutePath'),
          (R[(R.SchemeRelative = 6)] = 'SchemeRelative'),
          (R[(R.Absolute = 7)] = 'Absolute');
      })(o || (o = {}));
      function r(R) {
        return e.test(R);
      }
      function s(R) {
        return R.startsWith('//');
      }
      function i(R) {
        return R.startsWith('/');
      }
      function a(R) {
        return R.startsWith('file:');
      }
      function u(R) {
        return /^[.?#]/.test(R);
      }
      function h(R) {
        let z = t.exec(R);
        return _(
          z[1],
          z[2] || '',
          z[3],
          z[4] || '',
          z[5] || '/',
          z[6] || '',
          z[7] || ''
        );
      }
      function v(R) {
        let z = n.exec(R),
          $ = z[2];
        return _(
          'file:',
          '',
          z[1] || '',
          '',
          i($) ? $ : '/' + $,
          z[3] || '',
          z[4] || ''
        );
      }
      function _(R, z, $, O, A, M, B) {
        return {
          scheme: R,
          user: z,
          host: $,
          port: O,
          path: A,
          query: M,
          hash: B,
          type: o.Absolute,
        };
      }
      function x(R) {
        if (s(R)) {
          let $ = h('http:' + R);
          return ($.scheme = ''), ($.type = o.SchemeRelative), $;
        }
        if (i(R)) {
          let $ = h('http://foo.com' + R);
          return ($.scheme = ''), ($.host = ''), ($.type = o.AbsolutePath), $;
        }
        if (a(R)) return v(R);
        if (r(R)) return h(R);
        let z = h('http://foo.com/' + R);
        return (
          (z.scheme = ''),
          (z.host = ''),
          (z.type = R
            ? R.startsWith('?')
              ? o.Query
              : R.startsWith('#')
              ? o.Hash
              : o.RelativePath
            : o.Empty),
          z
        );
      }
      function L(R) {
        if (R.endsWith('/..')) return R;
        let z = R.lastIndexOf('/');
        return R.slice(0, z + 1);
      }
      function G(R, z) {
        F(z, z.type),
          R.path === '/' ? (R.path = z.path) : (R.path = L(z.path) + R.path);
      }
      function F(R, z) {
        let $ = z <= o.RelativePath,
          O = R.path.split('/'),
          A = 1,
          M = 0,
          B = !1;
        for (let ne = 1; ne < O.length; ne++) {
          let re = O[ne];
          if (!re) {
            B = !0;
            continue;
          }
          if (((B = !1), re !== '.')) {
            if (re === '..') {
              M ? ((B = !0), M--, A--) : $ && (O[A++] = re);
              continue;
            }
            (O[A++] = re), M++;
          }
        }
        let oe = '';
        for (let ne = 1; ne < A; ne++) oe += '/' + O[ne];
        (!oe || (B && !oe.endsWith('/..'))) && (oe += '/'), (R.path = oe);
      }
      function K(R, z) {
        if (!R && !z) return '';
        let $ = x(R),
          O = $.type;
        if (z && O !== o.Absolute) {
          let M = x(z),
            B = M.type;
          switch (O) {
            case o.Empty:
              $.hash = M.hash;
            case o.Hash:
              $.query = M.query;
            case o.Query:
            case o.RelativePath:
              G($, M);
            case o.AbsolutePath:
              ($.user = M.user), ($.host = M.host), ($.port = M.port);
            case o.SchemeRelative:
              $.scheme = M.scheme;
          }
          B > O && (O = B);
        }
        F($, O);
        let A = $.query + $.hash;
        switch (O) {
          case o.Hash:
          case o.Query:
            return A;
          case o.RelativePath: {
            let M = $.path.slice(1);
            return M ? (u(z || R) && !u(M) ? './' + M + A : M + A) : A || '.';
          }
          case o.AbsolutePath:
            return $.path + A;
          default:
            return $.scheme + '//' + $.user + $.host + $.port + $.path + A;
        }
      }
      return K;
    });
  });
  var Kc = H((Ur, jc) => {
    (function (e, t) {
      typeof Ur == 'object' && typeof jc < 'u'
        ? t(Ur, Zi(), Bc())
        : typeof define == 'function' && define.amd
        ? define(
            [
              'exports',
              '@jridgewell/sourcemap-codec',
              '@jridgewell/resolve-uri',
            ],
            t
          )
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.traceMapping = {}), e.sourcemapCodec, e.resolveURI));
    })(Ur, function (e, t, n) {
      'use strict';
      function o(I) {
        return I && typeof I == 'object' && 'default' in I ? I : {default: I};
      }
      var r = o(n);
      function s(I, D) {
        return D && !D.endsWith('/') && (D += '/'), r.default(I, D);
      }
      function i(I) {
        if (!I) return '';
        let D = I.lastIndexOf('/');
        return I.slice(0, D + 1);
      }
      let a = 0,
        u = 1,
        h = 2,
        v = 3,
        _ = 4,
        x = 1,
        L = 2;
      function G(I, D) {
        let j = F(I, 0);
        if (j === I.length) return I;
        D || (I = I.slice());
        for (let Y = j; Y < I.length; Y = F(I, Y + 1)) I[Y] = R(I[Y], D);
        return I;
      }
      function F(I, D) {
        for (let j = D; j < I.length; j++) if (!K(I[j])) return j;
        return I.length;
      }
      function K(I) {
        for (let D = 1; D < I.length; D++) if (I[D][a] < I[D - 1][a]) return !1;
        return !0;
      }
      function R(I, D) {
        return D || (I = I.slice()), I.sort(z);
      }
      function z(I, D) {
        return I[a] - D[a];
      }
      let $ = !1;
      function O(I, D, j, Y) {
        for (; j <= Y; ) {
          let le = j + ((Y - j) >> 1),
            Q = I[le][a] - D;
          if (Q === 0) return ($ = !0), le;
          Q < 0 ? (j = le + 1) : (Y = le - 1);
        }
        return ($ = !1), j - 1;
      }
      function A(I, D, j) {
        for (let Y = j + 1; Y < I.length && I[Y][a] === D; j = Y++);
        return j;
      }
      function M(I, D, j) {
        for (let Y = j - 1; Y >= 0 && I[Y][a] === D; j = Y--);
        return j;
      }
      function B() {
        return {lastKey: -1, lastNeedle: -1, lastIndex: -1};
      }
      function oe(I, D, j, Y) {
        let {lastKey: le, lastNeedle: Q, lastIndex: ke} = j,
          ge = 0,
          Ce = I.length - 1;
        if (Y === le) {
          if (D === Q) return ($ = ke !== -1 && I[ke][a] === D), ke;
          D >= Q ? (ge = ke === -1 ? 0 : ke) : (Ce = ke);
        }
        return (
          (j.lastKey = Y), (j.lastNeedle = D), (j.lastIndex = O(I, D, ge, Ce))
        );
      }
      function ne(I, D) {
        let j = D.map(Le);
        for (let Y = 0; Y < I.length; Y++) {
          let le = I[Y];
          for (let Q = 0; Q < le.length; Q++) {
            let ke = le[Q];
            if (ke.length === 1) continue;
            let ge = ke[u],
              Ce = ke[h],
              We = ke[v],
              $e = j[ge],
              Ne = $e[Ce] || ($e[Ce] = []),
              Ye = D[ge],
              et = A(Ne, We, oe(Ne, We, Ye, Ce));
            re(Ne, (Ye.lastIndex = et + 1), [We, Y, ke[a]]);
          }
        }
        return j;
      }
      function re(I, D, j) {
        for (let Y = I.length; Y > D; Y--) I[Y] = I[Y - 1];
        I[D] = j;
      }
      function Le() {
        return {__proto__: null};
      }
      let Fe = function (I, D) {
        let j = typeof I == 'string' ? JSON.parse(I) : I;
        if (!('sections' in j)) return new Ft(j, D);
        let Y = [],
          le = [],
          Q = [],
          ke = [];
        mt(j, D, Y, le, Q, ke, 0, 0, 1 / 0, 1 / 0);
        let ge = {
          version: 3,
          file: j.file,
          names: ke,
          sources: le,
          sourcesContent: Q,
          mappings: Y,
        };
        return e.presortedDecodedMap(ge);
      };
      function mt(I, D, j, Y, le, Q, ke, ge, Ce, We) {
        let {sections: $e} = I;
        for (let Ne = 0; Ne < $e.length; Ne++) {
          let {map: Ye, offset: et} = $e[Ne],
            pt = Ce,
            zt = We;
          if (Ne + 1 < $e.length) {
            let tt = $e[Ne + 1].offset;
            (pt = Math.min(Ce, ke + tt.line)),
              pt === Ce
                ? (zt = Math.min(We, ge + tt.column))
                : pt < Ce && (zt = ge + tt.column);
          }
          kt(Ye, D, j, Y, le, Q, ke + et.line, ge + et.column, pt, zt);
        }
      }
      function kt(I, D, j, Y, le, Q, ke, ge, Ce, We) {
        if ('sections' in I) return mt(...arguments);
        let $e = new Ft(I, D),
          Ne = Y.length,
          Ye = Q.length,
          et = e.decodedMappings($e),
          {resolvedSources: pt, sourcesContent: zt} = $e;
        if ((Qe(Y, pt), Qe(Q, $e.names), zt)) Qe(le, zt);
        else for (let tt = 0; tt < pt.length; tt++) le.push(null);
        for (let tt = 0; tt < et.length; tt++) {
          let Fn = ke + tt;
          if (Fn > Ce) return;
          let Qn = vt(j, Fn),
            bo = tt === 0 ? ge : 0,
            Zn = et[tt];
          for (let $n = 0; $n < Zn.length; $n++) {
            let jt = Zn[$n],
              kn = bo + jt[a];
            if (Fn === Ce && kn >= We) return;
            if (jt.length === 1) {
              Qn.push([kn]);
              continue;
            }
            let eo = Ne + jt[u],
              to = jt[h],
              no = jt[v];
            Qn.push(
              jt.length === 4 ? [kn, eo, to, no] : [kn, eo, to, no, Ye + jt[_]]
            );
          }
        }
      }
      function Qe(I, D) {
        for (let j = 0; j < D.length; j++) I.push(D[j]);
      }
      function vt(I, D) {
        for (let j = I.length; j <= D; j++) I[j] = [];
        return I[D];
      }
      let it = '`line` must be greater than 0 (lines start at line 1)',
        ct =
          '`column` must be greater than or equal to 0 (columns start at column 0)',
        Ze = -1,
        ut = 1;
      (e.encodedMappings = void 0),
        (e.decodedMappings = void 0),
        (e.traceSegment = void 0),
        (e.originalPositionFor = void 0),
        (e.generatedPositionFor = void 0),
        (e.eachMapping = void 0),
        (e.sourceContentFor = void 0),
        (e.presortedDecodedMap = void 0),
        (e.decodedMap = void 0),
        (e.encodedMap = void 0);
      class Ft {
        constructor(D, j) {
          let Y = typeof D == 'string';
          if (!Y && D._decodedMemo) return D;
          let le = Y ? JSON.parse(D) : D,
            {
              version: Q,
              file: ke,
              names: ge,
              sourceRoot: Ce,
              sources: We,
              sourcesContent: $e,
            } = le;
          (this.version = Q),
            (this.file = ke),
            (this.names = ge),
            (this.sourceRoot = Ce),
            (this.sources = We),
            (this.sourcesContent = $e);
          let Ne = s(Ce || '', i(j));
          this.resolvedSources = We.map((et) => s(et || '', Ne));
          let {mappings: Ye} = le;
          typeof Ye == 'string'
            ? ((this._encoded = Ye), (this._decoded = void 0))
            : ((this._encoded = void 0), (this._decoded = G(Ye, Y))),
            (this._decodedMemo = B()),
            (this._bySources = void 0),
            (this._bySourceMemos = void 0);
        }
      }
      (e.encodedMappings = (I) => {
        var D;
        return (D = I._encoded) !== null && D !== void 0
          ? D
          : (I._encoded = t.encode(I._decoded));
      }),
        (e.decodedMappings = (I) =>
          I._decoded || (I._decoded = t.decode(I._encoded))),
        (e.traceSegment = (I, D, j) => {
          let Y = e.decodedMappings(I);
          return D >= Y.length ? null : on(Y[D], I._decodedMemo, D, j, ut);
        }),
        (e.originalPositionFor = (I, {line: D, column: j, bias: Y}) => {
          if ((D--, D < 0)) throw new Error(it);
          if (j < 0) throw new Error(ct);
          let le = e.decodedMappings(I);
          if (D >= le.length) return $t(null, null, null, null);
          let Q = on(le[D], I._decodedMemo, D, j, Y || ut);
          if (Q == null || Q.length == 1) return $t(null, null, null, null);
          let {names: ke, resolvedSources: ge} = I;
          return $t(ge[Q[u]], Q[h] + 1, Q[v], Q.length === 5 ? ke[Q[_]] : null);
        }),
        (e.generatedPositionFor = (
          I,
          {source: D, line: j, column: Y, bias: le}
        ) => {
          if ((j--, j < 0)) throw new Error(it);
          if (Y < 0) throw new Error(ct);
          let {sources: Q, resolvedSources: ke} = I,
            ge = Q.indexOf(D);
          if ((ge === -1 && (ge = ke.indexOf(D)), ge === -1))
            return Bt(null, null);
          let Ce =
              I._bySources ||
              (I._bySources = ne(
                e.decodedMappings(I),
                (I._bySourceMemos = Q.map(B))
              )),
            We = I._bySourceMemos,
            $e = Ce[ge][j];
          if ($e == null) return Bt(null, null);
          let Ne = on($e, We[ge], j, Y, le || ut);
          return Ne == null ? Bt(null, null) : Bt(Ne[x] + 1, Ne[L]);
        }),
        (e.eachMapping = (I, D) => {
          let j = e.decodedMappings(I),
            {names: Y, resolvedSources: le} = I;
          for (let Q = 0; Q < j.length; Q++) {
            let ke = j[Q];
            for (let ge = 0; ge < ke.length; ge++) {
              let Ce = ke[ge],
                We = Q + 1,
                $e = Ce[0],
                Ne = null,
                Ye = null,
                et = null,
                pt = null;
              Ce.length !== 1 &&
                ((Ne = le[Ce[1]]), (Ye = Ce[2] + 1), (et = Ce[3])),
                Ce.length === 5 && (pt = Y[Ce[4]]),
                D({
                  generatedLine: We,
                  generatedColumn: $e,
                  source: Ne,
                  originalLine: Ye,
                  originalColumn: et,
                  name: pt,
                });
            }
          }
        }),
        (e.sourceContentFor = (I, D) => {
          let {sources: j, resolvedSources: Y, sourcesContent: le} = I;
          if (le == null) return null;
          let Q = j.indexOf(D);
          return Q === -1 && (Q = Y.indexOf(D)), Q === -1 ? null : le[Q];
        }),
        (e.presortedDecodedMap = (I, D) => {
          let j = new Ft(Vt(I, []), D);
          return (j._decoded = I.mappings), j;
        }),
        (e.decodedMap = (I) => Vt(I, e.decodedMappings(I))),
        (e.encodedMap = (I) => Vt(I, e.encodedMappings(I)));
      function Vt(I, D) {
        return {
          version: I.version,
          file: I.file,
          names: I.names,
          sourceRoot: I.sourceRoot,
          sources: I.sources,
          sourcesContent: I.sourcesContent,
          mappings: D,
        };
      }
      function $t(I, D, j, Y) {
        return {source: I, line: D, column: j, name: Y};
      }
      function Bt(I, D) {
        return {line: I, column: D};
      }
      function on(I, D, j, Y, le) {
        let Q = oe(I, Y, D, j);
        return (
          $ ? (Q = (le === Ze ? A : M)(I, Y, Q)) : le === Ze && Q++,
          Q === -1 || Q === I.length ? null : I[Q]
        );
      }
      (e.AnyMap = Fe),
        (e.GREATEST_LOWER_BOUND = ut),
        (e.LEAST_UPPER_BOUND = Ze),
        (e.TraceMap = Ft),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var Hc = H((Wr, qc) => {
    (function (e, t) {
      typeof Wr == 'object' && typeof qc < 'u'
        ? t(Wr, Fc(), Zi(), Kc())
        : typeof define == 'function' && define.amd
        ? define(
            [
              'exports',
              '@jridgewell/set-array',
              '@jridgewell/sourcemap-codec',
              '@jridgewell/trace-mapping',
            ],
            t
          )
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.genMapping = {}), e.setArray, e.sourcemapCodec, e.traceMapping));
    })(Wr, function (e, t, n, o) {
      'use strict';
      (e.addSegment = void 0),
        (e.addMapping = void 0),
        (e.maybeAddSegment = void 0),
        (e.maybeAddMapping = void 0),
        (e.setSourceContent = void 0),
        (e.toDecodedMap = void 0),
        (e.toEncodedMap = void 0),
        (e.fromMap = void 0),
        (e.allMappings = void 0);
      let v;
      class _ {
        constructor({file: A, sourceRoot: M} = {}) {
          (this._names = new t.SetArray()),
            (this._sources = new t.SetArray()),
            (this._sourcesContent = []),
            (this._mappings = []),
            (this.file = A),
            (this.sourceRoot = M);
        }
      }
      (e.addSegment = (O, A, M, B, oe, ne, re, Le) =>
        v(!1, O, A, M, B, oe, ne, re, Le)),
        (e.maybeAddSegment = (O, A, M, B, oe, ne, re, Le) =>
          v(!0, O, A, M, B, oe, ne, re, Le)),
        (e.addMapping = (O, A) => $(!1, O, A)),
        (e.maybeAddMapping = (O, A) => $(!0, O, A)),
        (e.setSourceContent = (O, A, M) => {
          let {_sources: B, _sourcesContent: oe} = O;
          oe[t.put(B, A)] = M;
        }),
        (e.toDecodedMap = (O) => {
          let {
            file: A,
            sourceRoot: M,
            _mappings: B,
            _sources: oe,
            _sourcesContent: ne,
            _names: re,
          } = O;
          return (
            F(B),
            {
              version: 3,
              file: A || void 0,
              names: re.array,
              sourceRoot: M || void 0,
              sources: oe.array,
              sourcesContent: ne,
              mappings: B,
            }
          );
        }),
        (e.toEncodedMap = (O) => {
          let A = e.toDecodedMap(O);
          return Object.assign(Object.assign({}, A), {
            mappings: n.encode(A.mappings),
          });
        }),
        (e.allMappings = (O) => {
          let A = [],
            {_mappings: M, _sources: B, _names: oe} = O;
          for (let ne = 0; ne < M.length; ne++) {
            let re = M[ne];
            for (let Le = 0; Le < re.length; Le++) {
              let Fe = re[Le],
                mt = {line: ne + 1, column: Fe[0]},
                kt,
                Qe,
                vt;
              Fe.length !== 1 &&
                ((kt = B.array[Fe[1]]),
                (Qe = {line: Fe[2] + 1, column: Fe[3]}),
                Fe.length === 5 && (vt = oe.array[Fe[4]])),
                A.push({generated: mt, source: kt, original: Qe, name: vt});
            }
          }
          return A;
        }),
        (e.fromMap = (O) => {
          let A = new o.TraceMap(O),
            M = new _({file: A.file, sourceRoot: A.sourceRoot});
          return (
            K(M._names, A.names),
            K(M._sources, A.sources),
            (M._sourcesContent = A.sourcesContent || A.sources.map(() => null)),
            (M._mappings = o.decodedMappings(A)),
            M
          );
        }),
        (v = (O, A, M, B, oe, ne, re, Le, Fe) => {
          let {
              _mappings: mt,
              _sources: kt,
              _sourcesContent: Qe,
              _names: vt,
            } = A,
            it = x(mt, M),
            ct = L(it, B);
          if (!oe) return O && R(it, ct) ? void 0 : G(it, ct, [B]);
          let Ze = t.put(kt, oe),
            ut = Le ? t.put(vt, Le) : -1;
          if (
            (Ze === Qe.length && (Qe[Ze] = Fe ?? null),
            !(O && z(it, ct, Ze, ne, re, ut)))
          )
            return G(it, ct, Le ? [B, Ze, ne, re, ut] : [B, Ze, ne, re]);
        });
      function x(O, A) {
        for (let M = O.length; M <= A; M++) O[M] = [];
        return O[A];
      }
      function L(O, A) {
        let M = O.length;
        for (let B = M - 1; B >= 0; M = B--) {
          let oe = O[B];
          if (A >= oe[0]) break;
        }
        return M;
      }
      function G(O, A, M) {
        for (let B = O.length; B > A; B--) O[B] = O[B - 1];
        O[A] = M;
      }
      function F(O) {
        let {length: A} = O,
          M = A;
        for (let B = M - 1; B >= 0 && !(O[B].length > 0); M = B, B--);
        M < A && (O.length = M);
      }
      function K(O, A) {
        for (let M = 0; M < A.length; M++) t.put(O, A[M]);
      }
      function R(O, A) {
        return A === 0 ? !0 : O[A - 1].length === 1;
      }
      function z(O, A, M, B, oe, ne) {
        if (A === 0) return !1;
        let re = O[A - 1];
        return re.length === 1
          ? !1
          : M === re[1] &&
              B === re[2] &&
              oe === re[3] &&
              ne === (re.length === 5 ? re[4] : -1);
      }
      function $(O, A, M) {
        let {generated: B, source: oe, original: ne, name: re, content: Le} = M;
        if (!oe)
          return v(O, A, B.line - 1, B.column, null, null, null, null, null);
        let Fe = oe;
        return v(
          O,
          A,
          B.line - 1,
          B.column,
          Fe,
          ne.line - 1,
          ne.column,
          re,
          Le
        );
      }
      (e.GenMapping = _), Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var Wc = H((na) => {
    'use strict';
    Object.defineProperty(na, '__esModule', {value: !0});
    var qo = Hc(),
      Uc = gt();
    function kT({code: e, mappings: t}, n, o, r, s) {
      let i = vT(r, s),
        a = new qo.GenMapping({file: o.compiledFilename}),
        u = 0,
        h = t[0];
      for (; h === void 0 && u < t.length - 1; ) u++, (h = t[u]);
      let v = 0,
        _ = 0;
      h !== _ && qo.maybeAddSegment.call(void 0, a, v, 0, n, v, 0);
      for (let F = 0; F < e.length; F++) {
        if (F === h) {
          let K = h - _,
            R = i[u];
          for (
            qo.maybeAddSegment.call(void 0, a, v, K, n, v, R);
            (h === F || h === void 0) && u < t.length - 1;

          )
            u++, (h = t[u]);
        }
        e.charCodeAt(F) === Uc.charCodes.lineFeed &&
          (v++,
          (_ = F + 1),
          h !== _ && qo.maybeAddSegment.call(void 0, a, v, 0, n, v, 0));
      }
      let {
        sourceRoot: x,
        sourcesContent: L,
        ...G
      } = qo.toEncodedMap.call(void 0, a);
      return G;
    }
    na.default = kT;
    function vT(e, t) {
      let n = new Array(t.length),
        o = 0,
        r = t[o].start,
        s = 0;
      for (let i = 0; i < e.length; i++)
        i === r && ((n[o] = r - s), o++, (r = t[o].start)),
          e.charCodeAt(i) === Uc.charCodes.lineFeed && (s = i + 1);
      return n;
    }
  });
  var Vc = H((ra) => {
    'use strict';
    Object.defineProperty(ra, '__esModule', {value: !0});
    var _T = {
        require: `
    import {createRequire as CREATE_REQUIRE_NAME} from "module";
    const require = CREATE_REQUIRE_NAME(import.meta.url);
  `,
        interopRequireWildcard: `
    function interopRequireWildcard(obj) {
      if (obj && obj.__esModule) {
        return obj;
      } else {
        var newObj = {};
        if (obj != null) {
          for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              newObj[key] = obj[key];
            }
          }
        }
        newObj.default = obj;
        return newObj;
      }
    }
  `,
        interopRequireDefault: `
    function interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj };
    }
  `,
        createNamedExportFrom: `
    function createNamedExportFrom(obj, localName, importedName) {
      Object.defineProperty(exports, localName, {enumerable: true, configurable: true, get: () => obj[importedName]});
    }
  `,
        createStarExport: `
    function createStarExport(obj) {
      Object.keys(obj)
        .filter((key) => key !== "default" && key !== "__esModule")
        .forEach((key) => {
          if (exports.hasOwnProperty(key)) {
            return;
          }
          Object.defineProperty(exports, key, {enumerable: true, configurable: true, get: () => obj[key]});
        });
    }
  `,
        nullishCoalesce: `
    function nullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return rhsFn();
      }
    }
  `,
        asyncNullishCoalesce: `
    async function asyncNullishCoalesce(lhs, rhsFn) {
      if (lhs != null) {
        return lhs;
      } else {
        return await rhsFn();
      }
    }
  `,
        optionalChain: `
    function optionalChain(ops) {
      let lastAccessLHS = undefined;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
          return undefined;
        }
        if (op === 'access' || op === 'optionalAccess') {
          lastAccessLHS = value;
          value = fn(value);
        } else if (op === 'call' || op === 'optionalCall') {
          value = fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = undefined;
        }
      }
      return value;
    }
  `,
        asyncOptionalChain: `
    async function asyncOptionalChain(ops) {
      let lastAccessLHS = undefined;
      let value = ops[0];
      let i = 1;
      while (i < ops.length) {
        const op = ops[i];
        const fn = ops[i + 1];
        i += 2;
        if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) {
          return undefined;
        }
        if (op === 'access' || op === 'optionalAccess') {
          lastAccessLHS = value;
          value = await fn(value);
        } else if (op === 'call' || op === 'optionalCall') {
          value = await fn((...args) => value.call(lastAccessLHS, ...args));
          lastAccessLHS = undefined;
        }
      }
      return value;
    }
  `,
        optionalChainDelete: `
    function optionalChainDelete(ops) {
      const result = OPTIONAL_CHAIN_NAME(ops);
      return result == null ? true : result;
    }
  `,
        asyncOptionalChainDelete: `
    async function asyncOptionalChainDelete(ops) {
      const result = await ASYNC_OPTIONAL_CHAIN_NAME(ops);
      return result == null ? true : result;
    }
  `,
      },
      oa = class e {
        __init() {
          this.helperNames = {};
        }
        __init2() {
          this.createRequireName = null;
        }
        constructor(t) {
          (this.nameManager = t),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this);
        }
        getHelperName(t) {
          let n = this.helperNames[t];
          return (
            n ||
            ((n = this.nameManager.claimFreeName(`_${t}`)),
            (this.helperNames[t] = n),
            n)
          );
        }
        emitHelpers() {
          let t = '';
          this.helperNames.optionalChainDelete &&
            this.getHelperName('optionalChain'),
            this.helperNames.asyncOptionalChainDelete &&
              this.getHelperName('asyncOptionalChain');
          for (let [n, o] of Object.entries(_T)) {
            let r = this.helperNames[n],
              s = o;
            n === 'optionalChainDelete'
              ? (s = s.replace(
                  'OPTIONAL_CHAIN_NAME',
                  this.helperNames.optionalChain
                ))
              : n === 'asyncOptionalChainDelete'
              ? (s = s.replace(
                  'ASYNC_OPTIONAL_CHAIN_NAME',
                  this.helperNames.asyncOptionalChain
                ))
              : n === 'require' &&
                (this.createRequireName === null &&
                  (this.createRequireName =
                    this.nameManager.claimFreeName('_createRequire')),
                (s = s.replace(
                  /CREATE_REQUIRE_NAME/g,
                  this.createRequireName
                ))),
              r &&
                ((t += ' '),
                (t += s.replace(n, r).replace(/\s+/g, ' ').trim()));
          }
          return t;
        }
      };
    ra.HelperManager = oa;
  });
  var Yc = H((zr) => {
    'use strict';
    Object.defineProperty(zr, '__esModule', {value: !0});
    var sa = Ve(),
      Vr = ce();
    function xT(e, t, n) {
      Xc(e, n) && gT(e, t, n);
    }
    zr.default = xT;
    function Xc(e, t) {
      for (let n of e.tokens)
        if (
          n.type === Vr.TokenType.name &&
          sa.isNonTopLevelDeclaration.call(void 0, n) &&
          t.has(e.identifierNameForToken(n))
        )
          return !0;
      return !1;
    }
    zr.hasShadowedGlobals = Xc;
    function gT(e, t, n) {
      let o = [],
        r = t.length - 1;
      for (let s = e.tokens.length - 1; ; s--) {
        for (; o.length > 0 && o[o.length - 1].startTokenIndex === s + 1; )
          o.pop();
        for (; r >= 0 && t[r].endTokenIndex === s + 1; ) o.push(t[r]), r--;
        if (s < 0) break;
        let i = e.tokens[s],
          a = e.identifierNameForToken(i);
        if (o.length > 1 && i.type === Vr.TokenType.name && n.has(a)) {
          if (sa.isBlockScopedDeclaration.call(void 0, i))
            zc(o[o.length - 1], e, a);
          else if (sa.isFunctionScopedDeclaration.call(void 0, i)) {
            let u = o.length - 1;
            for (; u > 0 && !o[u].isFunctionScope; ) u--;
            if (u < 0) throw new Error('Did not find parent function scope.');
            zc(o[u], e, a);
          }
        }
      }
      if (o.length > 0)
        throw new Error('Expected empty scope stack after processing file.');
    }
    function zc(e, t, n) {
      for (let o = e.startTokenIndex; o < e.endTokenIndex; o++) {
        let r = t.tokens[o];
        (r.type === Vr.TokenType.name || r.type === Vr.TokenType.jsxName) &&
          t.identifierNameForToken(r) === n &&
          (r.shadowsGlobal = !0);
      }
    }
  });
  var Gc = H((ia) => {
    'use strict';
    Object.defineProperty(ia, '__esModule', {value: !0});
    var CT = ce();
    function wT(e, t) {
      let n = [];
      for (let o of t)
        o.type === CT.TokenType.name && n.push(e.slice(o.start, o.end));
      return n;
    }
    ia.default = wT;
  });
  var Jc = H((la) => {
    'use strict';
    Object.defineProperty(la, '__esModule', {value: !0});
    function IT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var ST = Gc(),
      bT = IT(ST),
      aa = class e {
        __init() {
          this.usedNames = new Set();
        }
        constructor(t, n) {
          e.prototype.__init.call(this),
            (this.usedNames = new Set(bT.default.call(void 0, t, n)));
        }
        claimFreeName(t) {
          let n = this.findFreeName(t);
          return this.usedNames.add(n), n;
        }
        findFreeName(t) {
          if (!this.usedNames.has(t)) return t;
          let n = 2;
          for (; this.usedNames.has(t + String(n)); ) n++;
          return t + String(n);
        }
      };
    la.default = aa;
  });
  var Xr = H((Qt) => {
    'use strict';
    var ET =
      (Qt && Qt.__extends) ||
      (function () {
        var e = function (t, n) {
          return (
            (e =
              Object.setPrototypeOf ||
              ({__proto__: []} instanceof Array &&
                function (o, r) {
                  o.__proto__ = r;
                }) ||
              function (o, r) {
                for (var s in r) r.hasOwnProperty(s) && (o[s] = r[s]);
              }),
            e(t, n)
          );
        };
        return function (t, n) {
          e(t, n);
          function o() {
            this.constructor = t;
          }
          t.prototype =
            n === null
              ? Object.create(n)
              : ((o.prototype = n.prototype), new o());
        };
      })();
    Object.defineProperty(Qt, '__esModule', {value: !0});
    Qt.DetailContext = Qt.NoopContext = Qt.VError = void 0;
    var Qc = (function (e) {
      ET(t, e);
      function t(n, o) {
        var r = e.call(this, o) || this;
        return (r.path = n), Object.setPrototypeOf(r, t.prototype), r;
      }
      return t;
    })(Error);
    Qt.VError = Qc;
    var AT = (function () {
      function e() {}
      return (
        (e.prototype.fail = function (t, n, o) {
          return !1;
        }),
        (e.prototype.unionResolver = function () {
          return this;
        }),
        (e.prototype.createContext = function () {
          return this;
        }),
        (e.prototype.resolveUnion = function (t) {}),
        e
      );
    })();
    Qt.NoopContext = AT;
    var Zc = (function () {
      function e() {
        (this._propNames = ['']), (this._messages = [null]), (this._score = 0);
      }
      return (
        (e.prototype.fail = function (t, n, o) {
          return (
            this._propNames.push(t),
            this._messages.push(n),
            (this._score += o),
            !1
          );
        }),
        (e.prototype.unionResolver = function () {
          return new PT();
        }),
        (e.prototype.resolveUnion = function (t) {
          for (
            var n, o, r = t, s = null, i = 0, a = r.contexts;
            i < a.length;
            i++
          ) {
            var u = a[i];
            (!s || u._score >= s._score) && (s = u);
          }
          s &&
            s._score > 0 &&
            ((n = this._propNames).push.apply(n, s._propNames),
            (o = this._messages).push.apply(o, s._messages));
        }),
        (e.prototype.getError = function (t) {
          for (var n = [], o = this._propNames.length - 1; o >= 0; o--) {
            var r = this._propNames[o];
            t += typeof r == 'number' ? '[' + r + ']' : r ? '.' + r : '';
            var s = this._messages[o];
            s && n.push(t + ' ' + s);
          }
          return new Qc(t, n.join('; '));
        }),
        (e.prototype.getErrorDetail = function (t) {
          for (var n = [], o = this._propNames.length - 1; o >= 0; o--) {
            var r = this._propNames[o];
            t += typeof r == 'number' ? '[' + r + ']' : r ? '.' + r : '';
            var s = this._messages[o];
            s && n.push({path: t, message: s});
          }
          for (var i = null, o = n.length - 1; o >= 0; o--)
            i && (n[o].nested = [i]), (i = n[o]);
          return i;
        }),
        e
      );
    })();
    Qt.DetailContext = Zc;
    var PT = (function () {
      function e() {
        this.contexts = [];
      }
      return (
        (e.prototype.createContext = function () {
          var t = new Zc();
          return this.contexts.push(t), t;
        }),
        e
      );
    })();
  });
  var ya = H((X) => {
    'use strict';
    var St =
      (X && X.__extends) ||
      (function () {
        var e = function (t, n) {
          return (
            (e =
              Object.setPrototypeOf ||
              ({__proto__: []} instanceof Array &&
                function (o, r) {
                  o.__proto__ = r;
                }) ||
              function (o, r) {
                for (var s in r) r.hasOwnProperty(s) && (o[s] = r[s]);
              }),
            e(t, n)
          );
        };
        return function (t, n) {
          e(t, n);
          function o() {
            this.constructor = t;
          }
          t.prototype =
            n === null
              ? Object.create(n)
              : ((o.prototype = n.prototype), new o());
        };
      })();
    Object.defineProperty(X, '__esModule', {value: !0});
    X.basicTypes =
      X.BasicType =
      X.TParamList =
      X.TParam =
      X.param =
      X.TFunc =
      X.func =
      X.TProp =
      X.TOptional =
      X.opt =
      X.TIface =
      X.iface =
      X.TEnumLiteral =
      X.enumlit =
      X.TEnumType =
      X.enumtype =
      X.TIntersection =
      X.intersection =
      X.TUnion =
      X.union =
      X.TTuple =
      X.tuple =
      X.TArray =
      X.array =
      X.TLiteral =
      X.lit =
      X.TName =
      X.name =
      X.TType =
        void 0;
    var nu = Xr(),
      ht = (function () {
        function e() {}
        return e;
      })();
    X.TType = ht;
    function En(e) {
      return typeof e == 'string' ? ou(e) : e;
    }
    function pa(e, t) {
      var n = e[t];
      if (!n) throw new Error('Unknown type ' + t);
      return n;
    }
    function ou(e) {
      return new da(e);
    }
    X.name = ou;
    var da = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.name = n), (o._failMsg = 'is not a ' + n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o, r) {
          var s = this,
            i = pa(n, this.name),
            a = i.getChecker(n, o, r);
          return i instanceof ot || i instanceof t
            ? a
            : function (u, h) {
                return a(u, h) ? !0 : h.fail(null, s._failMsg, 0);
              };
        }),
        t
      );
    })(ht);
    X.TName = da;
    function RT(e) {
      return new fa(e);
    }
    X.lit = RT;
    var fa = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (
          (o.value = n),
          (o.name = JSON.stringify(n)),
          (o._failMsg = 'is not ' + o.name),
          o
        );
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this;
          return function (s, i) {
            return s === r.value ? !0 : i.fail(null, r._failMsg, -1);
          };
        }),
        t
      );
    })(ht);
    X.TLiteral = fa;
    function NT(e) {
      return new ru(En(e));
    }
    X.array = NT;
    var ru = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.ttype = n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this.ttype.getChecker(n, o);
          return function (s, i) {
            if (!Array.isArray(s)) return i.fail(null, 'is not an array', 0);
            for (var a = 0; a < s.length; a++) {
              var u = r(s[a], i);
              if (!u) return i.fail(a, null, 1);
            }
            return !0;
          };
        }),
        t
      );
    })(ht);
    X.TArray = ru;
    function DT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new su(
        e.map(function (n) {
          return En(n);
        })
      );
    }
    X.tuple = DT;
    var su = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.ttypes = n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this.ttypes.map(function (i) {
              return i.getChecker(n, o);
            }),
            s = function (i, a) {
              if (!Array.isArray(i)) return a.fail(null, 'is not an array', 0);
              for (var u = 0; u < r.length; u++) {
                var h = r[u](i[u], a);
                if (!h) return a.fail(u, null, 1);
              }
              return !0;
            };
          return o
            ? function (i, a) {
                return s(i, a)
                  ? i.length <= r.length
                    ? !0
                    : a.fail(r.length, 'is extraneous', 2)
                  : !1;
              }
            : s;
        }),
        t
      );
    })(ht);
    X.TTuple = su;
    function OT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new iu(
        e.map(function (n) {
          return En(n);
        })
      );
    }
    X.union = OT;
    var iu = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        o.ttypes = n;
        var r = n
            .map(function (i) {
              return i instanceof da || i instanceof fa ? i.name : null;
            })
            .filter(function (i) {
              return i;
            }),
          s = n.length - r.length;
        return (
          r.length
            ? (s > 0 && r.push(s + ' more'),
              (o._failMsg = 'is none of ' + r.join(', ')))
            : (o._failMsg = 'is none of ' + s + ' types'),
          o
        );
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this,
            s = this.ttypes.map(function (i) {
              return i.getChecker(n, o);
            });
          return function (i, a) {
            for (var u = a.unionResolver(), h = 0; h < s.length; h++) {
              var v = s[h](i, u.createContext());
              if (v) return !0;
            }
            return a.resolveUnion(u), a.fail(null, r._failMsg, 0);
          };
        }),
        t
      );
    })(ht);
    X.TUnion = iu;
    function MT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new au(
        e.map(function (n) {
          return En(n);
        })
      );
    }
    X.intersection = MT;
    var au = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.ttypes = n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = new Set(),
            s = this.ttypes.map(function (i) {
              return i.getChecker(n, o, r);
            });
          return function (i, a) {
            var u = s.every(function (h) {
              return h(i, a);
            });
            return u ? !0 : a.fail(null, null, 0);
          };
        }),
        t
      );
    })(ht);
    X.TIntersection = au;
    function LT(e) {
      return new ha(e);
    }
    X.enumtype = LT;
    var ha = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (
          (o.members = n),
          (o.validValues = new Set()),
          (o._failMsg = 'is not a valid enum value'),
          (o.validValues = new Set(
            Object.keys(n).map(function (r) {
              return n[r];
            })
          )),
          o
        );
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this;
          return function (s, i) {
            return r.validValues.has(s) ? !0 : i.fail(null, r._failMsg, 0);
          };
        }),
        t
      );
    })(ht);
    X.TEnumType = ha;
    function FT(e, t) {
      return new lu(e, t);
    }
    X.enumlit = FT;
    var lu = (function (e) {
      St(t, e);
      function t(n, o) {
        var r = e.call(this) || this;
        return (
          (r.enumName = n),
          (r.prop = o),
          (r._failMsg = 'is not ' + n + '.' + o),
          r
        );
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this,
            s = pa(n, this.enumName);
          if (!(s instanceof ha))
            throw new Error(
              'Type ' + this.enumName + ' used in enumlit is not an enum type'
            );
          var i = s.members[this.prop];
          if (!s.members.hasOwnProperty(this.prop))
            throw new Error(
              'Unknown value ' +
                this.enumName +
                '.' +
                this.prop +
                ' used in enumlit'
            );
          return function (a, u) {
            return a === i ? !0 : u.fail(null, r._failMsg, -1);
          };
        }),
        t
      );
    })(ht);
    X.TEnumLiteral = lu;
    function $T(e) {
      return Object.keys(e).map(function (t) {
        return BT(t, e[t]);
      });
    }
    function BT(e, t) {
      return t instanceof Ta ? new ua(e, t.ttype, !0) : new ua(e, En(t), !1);
    }
    function jT(e, t) {
      return new cu(e, $T(t));
    }
    X.iface = jT;
    var cu = (function (e) {
      St(t, e);
      function t(n, o) {
        var r = e.call(this) || this;
        return (
          (r.bases = n),
          (r.props = o),
          (r.propSet = new Set(
            o.map(function (s) {
              return s.name;
            })
          )),
          r
        );
      }
      return (
        (t.prototype.getChecker = function (n, o, r) {
          var s = this,
            i = this.bases.map(function (x) {
              return pa(n, x).getChecker(n, o);
            }),
            a = this.props.map(function (x) {
              return x.ttype.getChecker(n, o);
            }),
            u = new nu.NoopContext(),
            h = this.props.map(function (x, L) {
              return !x.isOpt && !a[L](void 0, u);
            }),
            v = function (x, L) {
              if (typeof x != 'object' || x === null)
                return L.fail(null, 'is not an object', 0);
              for (var G = 0; G < i.length; G++) if (!i[G](x, L)) return !1;
              for (var G = 0; G < a.length; G++) {
                var F = s.props[G].name,
                  K = x[F];
                if (K === void 0) {
                  if (h[G]) return L.fail(F, 'is missing', 1);
                } else {
                  var R = a[G](K, L);
                  if (!R) return L.fail(F, null, 1);
                }
              }
              return !0;
            };
          if (!o) return v;
          var _ = this.propSet;
          return (
            r &&
              (this.propSet.forEach(function (x) {
                return r.add(x);
              }),
              (_ = r)),
            function (x, L) {
              if (!v(x, L)) return !1;
              for (var G in x)
                if (!_.has(G)) return L.fail(G, 'is extraneous', 2);
              return !0;
            }
          );
        }),
        t
      );
    })(ht);
    X.TIface = cu;
    function KT(e) {
      return new Ta(En(e));
    }
    X.opt = KT;
    var Ta = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.ttype = n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this.ttype.getChecker(n, o);
          return function (s, i) {
            return s === void 0 || r(s, i);
          };
        }),
        t
      );
    })(ht);
    X.TOptional = Ta;
    var ua = (function () {
      function e(t, n, o) {
        (this.name = t), (this.ttype = n), (this.isOpt = o);
      }
      return e;
    })();
    X.TProp = ua;
    function qT(e) {
      for (var t = [], n = 1; n < arguments.length; n++)
        t[n - 1] = arguments[n];
      return new uu(new du(t), En(e));
    }
    X.func = qT;
    var uu = (function (e) {
      St(t, e);
      function t(n, o) {
        var r = e.call(this) || this;
        return (r.paramList = n), (r.result = o), r;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          return function (r, s) {
            return typeof r == 'function'
              ? !0
              : s.fail(null, 'is not a function', 0);
          };
        }),
        t
      );
    })(ht);
    X.TFunc = uu;
    function HT(e, t, n) {
      return new pu(e, En(t), !!n);
    }
    X.param = HT;
    var pu = (function () {
      function e(t, n, o) {
        (this.name = t), (this.ttype = n), (this.isOpt = o);
      }
      return e;
    })();
    X.TParam = pu;
    var du = (function (e) {
      St(t, e);
      function t(n) {
        var o = e.call(this) || this;
        return (o.params = n), o;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this,
            s = this.params.map(function (h) {
              return h.ttype.getChecker(n, o);
            }),
            i = new nu.NoopContext(),
            a = this.params.map(function (h, v) {
              return !h.isOpt && !s[v](void 0, i);
            }),
            u = function (h, v) {
              if (!Array.isArray(h)) return v.fail(null, 'is not an array', 0);
              for (var _ = 0; _ < s.length; _++) {
                var x = r.params[_];
                if (h[_] === void 0) {
                  if (a[_]) return v.fail(x.name, 'is missing', 1);
                } else {
                  var L = s[_](h[_], v);
                  if (!L) return v.fail(x.name, null, 1);
                }
              }
              return !0;
            };
          return o
            ? function (h, v) {
                return u(h, v)
                  ? h.length <= s.length
                    ? !0
                    : v.fail(s.length, 'is extraneous', 2)
                  : !1;
              }
            : u;
        }),
        t
      );
    })(ht);
    X.TParamList = du;
    var ot = (function (e) {
      St(t, e);
      function t(n, o) {
        var r = e.call(this) || this;
        return (r.validator = n), (r.message = o), r;
      }
      return (
        (t.prototype.getChecker = function (n, o) {
          var r = this;
          return function (s, i) {
            return r.validator(s) ? !0 : i.fail(null, r.message, 0);
          };
        }),
        t
      );
    })(ht);
    X.BasicType = ot;
    X.basicTypes = {
      any: new ot(function (e) {
        return !0;
      }, 'is invalid'),
      number: new ot(function (e) {
        return typeof e == 'number';
      }, 'is not a number'),
      object: new ot(function (e) {
        return typeof e == 'object' && e;
      }, 'is not an object'),
      boolean: new ot(function (e) {
        return typeof e == 'boolean';
      }, 'is not a boolean'),
      string: new ot(function (e) {
        return typeof e == 'string';
      }, 'is not a string'),
      symbol: new ot(function (e) {
        return typeof e == 'symbol';
      }, 'is not a symbol'),
      void: new ot(function (e) {
        return e == null;
      }, 'is not void'),
      undefined: new ot(function (e) {
        return e === void 0;
      }, 'is not undefined'),
      null: new ot(function (e) {
        return e === null;
      }, 'is not null'),
      never: new ot(function (e) {
        return !1;
      }, 'is unexpected'),
      Date: new ot(eu('[object Date]'), 'is not a Date'),
      RegExp: new ot(eu('[object RegExp]'), 'is not a RegExp'),
    };
    var UT = Object.prototype.toString;
    function eu(e) {
      return function (t) {
        return typeof t == 'object' && t && UT.call(t) === e;
      };
    }
    typeof Buffer < 'u' &&
      (X.basicTypes.Buffer = new ot(function (e) {
        return Buffer.isBuffer(e);
      }, 'is not a Buffer'));
    var WT = function (e) {
      X.basicTypes[e.name] = new ot(function (t) {
        return t instanceof e;
      }, 'is not a ' + e.name);
    };
    for (
      Yr = 0,
        ca = [
          Int8Array,
          Uint8Array,
          Uint8ClampedArray,
          Int16Array,
          Uint16Array,
          Int32Array,
          Uint32Array,
          Float32Array,
          Float64Array,
          ArrayBuffer,
        ];
      Yr < ca.length;
      Yr++
    )
      (tu = ca[Yr]), WT(tu);
    var tu, Yr, ca;
  });
  var ma = H((pe) => {
    'use strict';
    var VT =
      (pe && pe.__spreadArrays) ||
      function () {
        for (var e = 0, t = 0, n = arguments.length; t < n; t++)
          e += arguments[t].length;
        for (var o = Array(e), r = 0, t = 0; t < n; t++)
          for (var s = arguments[t], i = 0, a = s.length; i < a; i++, r++)
            o[r] = s[i];
        return o;
      };
    Object.defineProperty(pe, '__esModule', {value: !0});
    pe.Checker = pe.createCheckers = void 0;
    var Ho = ya(),
      yo = Xr(),
      be = ya();
    Object.defineProperty(pe, 'TArray', {
      enumerable: !0,
      get: function () {
        return be.TArray;
      },
    });
    Object.defineProperty(pe, 'TEnumType', {
      enumerable: !0,
      get: function () {
        return be.TEnumType;
      },
    });
    Object.defineProperty(pe, 'TEnumLiteral', {
      enumerable: !0,
      get: function () {
        return be.TEnumLiteral;
      },
    });
    Object.defineProperty(pe, 'TFunc', {
      enumerable: !0,
      get: function () {
        return be.TFunc;
      },
    });
    Object.defineProperty(pe, 'TIface', {
      enumerable: !0,
      get: function () {
        return be.TIface;
      },
    });
    Object.defineProperty(pe, 'TLiteral', {
      enumerable: !0,
      get: function () {
        return be.TLiteral;
      },
    });
    Object.defineProperty(pe, 'TName', {
      enumerable: !0,
      get: function () {
        return be.TName;
      },
    });
    Object.defineProperty(pe, 'TOptional', {
      enumerable: !0,
      get: function () {
        return be.TOptional;
      },
    });
    Object.defineProperty(pe, 'TParam', {
      enumerable: !0,
      get: function () {
        return be.TParam;
      },
    });
    Object.defineProperty(pe, 'TParamList', {
      enumerable: !0,
      get: function () {
        return be.TParamList;
      },
    });
    Object.defineProperty(pe, 'TProp', {
      enumerable: !0,
      get: function () {
        return be.TProp;
      },
    });
    Object.defineProperty(pe, 'TTuple', {
      enumerable: !0,
      get: function () {
        return be.TTuple;
      },
    });
    Object.defineProperty(pe, 'TType', {
      enumerable: !0,
      get: function () {
        return be.TType;
      },
    });
    Object.defineProperty(pe, 'TUnion', {
      enumerable: !0,
      get: function () {
        return be.TUnion;
      },
    });
    Object.defineProperty(pe, 'TIntersection', {
      enumerable: !0,
      get: function () {
        return be.TIntersection;
      },
    });
    Object.defineProperty(pe, 'array', {
      enumerable: !0,
      get: function () {
        return be.array;
      },
    });
    Object.defineProperty(pe, 'enumlit', {
      enumerable: !0,
      get: function () {
        return be.enumlit;
      },
    });
    Object.defineProperty(pe, 'enumtype', {
      enumerable: !0,
      get: function () {
        return be.enumtype;
      },
    });
    Object.defineProperty(pe, 'func', {
      enumerable: !0,
      get: function () {
        return be.func;
      },
    });
    Object.defineProperty(pe, 'iface', {
      enumerable: !0,
      get: function () {
        return be.iface;
      },
    });
    Object.defineProperty(pe, 'lit', {
      enumerable: !0,
      get: function () {
        return be.lit;
      },
    });
    Object.defineProperty(pe, 'name', {
      enumerable: !0,
      get: function () {
        return be.name;
      },
    });
    Object.defineProperty(pe, 'opt', {
      enumerable: !0,
      get: function () {
        return be.opt;
      },
    });
    Object.defineProperty(pe, 'param', {
      enumerable: !0,
      get: function () {
        return be.param;
      },
    });
    Object.defineProperty(pe, 'tuple', {
      enumerable: !0,
      get: function () {
        return be.tuple;
      },
    });
    Object.defineProperty(pe, 'union', {
      enumerable: !0,
      get: function () {
        return be.union;
      },
    });
    Object.defineProperty(pe, 'intersection', {
      enumerable: !0,
      get: function () {
        return be.intersection;
      },
    });
    Object.defineProperty(pe, 'BasicType', {
      enumerable: !0,
      get: function () {
        return be.BasicType;
      },
    });
    var zT = Xr();
    Object.defineProperty(pe, 'VError', {
      enumerable: !0,
      get: function () {
        return zT.VError;
      },
    });
    function XT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      for (
        var n = Object.assign.apply(Object, VT([{}, Ho.basicTypes], e)),
          o = {},
          r = 0,
          s = e;
        r < s.length;
        r++
      )
        for (var i = s[r], a = 0, u = Object.keys(i); a < u.length; a++) {
          var h = u[a];
          o[h] = new fu(n, i[h]);
        }
      return o;
    }
    pe.createCheckers = XT;
    var fu = (function () {
      function e(t, n, o) {
        if (
          (o === void 0 && (o = 'value'),
          (this.suite = t),
          (this.ttype = n),
          (this._path = o),
          (this.props = new Map()),
          n instanceof Ho.TIface)
        )
          for (var r = 0, s = n.props; r < s.length; r++) {
            var i = s[r];
            this.props.set(i.name, i.ttype);
          }
        (this.checkerPlain = this.ttype.getChecker(t, !1)),
          (this.checkerStrict = this.ttype.getChecker(t, !0));
      }
      return (
        (e.prototype.setReportedPath = function (t) {
          this._path = t;
        }),
        (e.prototype.check = function (t) {
          return this._doCheck(this.checkerPlain, t);
        }),
        (e.prototype.test = function (t) {
          return this.checkerPlain(t, new yo.NoopContext());
        }),
        (e.prototype.validate = function (t) {
          return this._doValidate(this.checkerPlain, t);
        }),
        (e.prototype.strictCheck = function (t) {
          return this._doCheck(this.checkerStrict, t);
        }),
        (e.prototype.strictTest = function (t) {
          return this.checkerStrict(t, new yo.NoopContext());
        }),
        (e.prototype.strictValidate = function (t) {
          return this._doValidate(this.checkerStrict, t);
        }),
        (e.prototype.getProp = function (t) {
          var n = this.props.get(t);
          if (!n) throw new Error('Type has no property ' + t);
          return new e(this.suite, n, this._path + '.' + t);
        }),
        (e.prototype.methodArgs = function (t) {
          var n = this._getMethod(t);
          return new e(this.suite, n.paramList);
        }),
        (e.prototype.methodResult = function (t) {
          var n = this._getMethod(t);
          return new e(this.suite, n.result);
        }),
        (e.prototype.getArgs = function () {
          if (!(this.ttype instanceof Ho.TFunc))
            throw new Error('getArgs() applied to non-function');
          return new e(this.suite, this.ttype.paramList);
        }),
        (e.prototype.getResult = function () {
          if (!(this.ttype instanceof Ho.TFunc))
            throw new Error('getResult() applied to non-function');
          return new e(this.suite, this.ttype.result);
        }),
        (e.prototype.getType = function () {
          return this.ttype;
        }),
        (e.prototype._doCheck = function (t, n) {
          var o = new yo.NoopContext();
          if (!t(n, o)) {
            var r = new yo.DetailContext();
            throw (t(n, r), r.getError(this._path));
          }
        }),
        (e.prototype._doValidate = function (t, n) {
          var o = new yo.NoopContext();
          if (t(n, o)) return null;
          var r = new yo.DetailContext();
          return t(n, r), r.getErrorDetail(this._path);
        }),
        (e.prototype._getMethod = function (t) {
          var n = this.props.get(t);
          if (!n) throw new Error('Type has no property ' + t);
          if (!(n instanceof Ho.TFunc))
            throw new Error('Property ' + t + ' is not a method');
          return n;
        }),
        e
      );
    })();
    pe.Checker = fu;
  });
  var hu = H((dn) => {
    'use strict';
    Object.defineProperty(dn, '__esModule', {value: !0});
    function YT(e) {
      if (e && e.__esModule) return e;
      var t = {};
      if (e != null)
        for (var n in e)
          Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
      return (t.default = e), t;
    }
    var GT = ma(),
      Pe = YT(GT),
      JT = Pe.union(
        Pe.lit('jsx'),
        Pe.lit('typescript'),
        Pe.lit('flow'),
        Pe.lit('imports'),
        Pe.lit('react-hot-loader'),
        Pe.lit('jest')
      );
    dn.Transform = JT;
    var QT = Pe.iface([], {compiledFilename: 'string'});
    dn.SourceMapOptions = QT;
    var ZT = Pe.iface([], {
      transforms: Pe.array('Transform'),
      disableESTransforms: Pe.opt('boolean'),
      jsxRuntime: Pe.opt(
        Pe.union(Pe.lit('classic'), Pe.lit('automatic'), Pe.lit('preserve'))
      ),
      production: Pe.opt('boolean'),
      jsxImportSource: Pe.opt('string'),
      jsxPragma: Pe.opt('string'),
      jsxFragmentPragma: Pe.opt('string'),
      preserveDynamicImport: Pe.opt('boolean'),
      injectCreateRequireForImportRequire: Pe.opt('boolean'),
      enableLegacyTypeScriptModuleInterop: Pe.opt('boolean'),
      enableLegacyBabel5ModuleInterop: Pe.opt('boolean'),
      sourceMapOptions: Pe.opt('SourceMapOptions'),
      filePath: Pe.opt('string'),
    });
    dn.Options = ZT;
    var ey = {
      Transform: dn.Transform,
      SourceMapOptions: dn.SourceMapOptions,
      Options: dn.Options,
    };
    dn.default = ey;
  });
  var Tu = H((ka) => {
    'use strict';
    Object.defineProperty(ka, '__esModule', {value: !0});
    function ty(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var ny = ma(),
      oy = hu(),
      ry = ty(oy),
      {Options: sy} = ny.createCheckers.call(void 0, ry.default);
    function iy(e) {
      sy.strictCheck(e);
    }
    ka.validateOptions = iy;
  });
  var Gr = H((Zt) => {
    'use strict';
    Object.defineProperty(Zt, '__esModule', {value: !0});
    var ay = Vo(),
      yu = mo(),
      rt = Ve(),
      Uo = Ge(),
      Dt = ce(),
      ze = Ct(),
      Wo = Xn(),
      va = Sn();
    function ly() {
      rt.next.call(void 0), Wo.parseMaybeAssign.call(void 0, !1);
    }
    Zt.parseSpread = ly;
    function mu(e) {
      rt.next.call(void 0), xa(e);
    }
    Zt.parseRest = mu;
    function ku(e) {
      Wo.parseIdentifier.call(void 0), vu(e);
    }
    Zt.parseBindingIdentifier = ku;
    function cy() {
      Wo.parseIdentifier.call(void 0),
        (ze.state.tokens[ze.state.tokens.length - 1].identifierRole =
          rt.IdentifierRole.ImportDeclaration);
    }
    Zt.parseImportedIdentifier = cy;
    function vu(e) {
      let t;
      ze.state.scopeDepth === 0
        ? (t = rt.IdentifierRole.TopLevelDeclaration)
        : e
        ? (t = rt.IdentifierRole.BlockScopedDeclaration)
        : (t = rt.IdentifierRole.FunctionScopedDeclaration),
        (ze.state.tokens[ze.state.tokens.length - 1].identifierRole = t);
    }
    Zt.markPriorBindingIdentifier = vu;
    function xa(e) {
      switch (ze.state.type) {
        case Dt.TokenType._this: {
          let t = rt.pushTypeContext.call(void 0, 0);
          rt.next.call(void 0), rt.popTypeContext.call(void 0, t);
          return;
        }
        case Dt.TokenType._yield:
        case Dt.TokenType.name: {
          (ze.state.type = Dt.TokenType.name), ku(e);
          return;
        }
        case Dt.TokenType.bracketL: {
          rt.next.call(void 0), _u(Dt.TokenType.bracketR, e, !0);
          return;
        }
        case Dt.TokenType.braceL:
          Wo.parseObj.call(void 0, !0, e);
          return;
        default:
          va.unexpected.call(void 0);
      }
    }
    Zt.parseBindingAtom = xa;
    function _u(e, t, n = !1, o = !1, r = 0) {
      let s = !0,
        i = !1,
        a = ze.state.tokens.length;
      for (; !rt.eat.call(void 0, e) && !ze.state.error; )
        if (
          (s
            ? (s = !1)
            : (va.expect.call(void 0, Dt.TokenType.comma),
              (ze.state.tokens[ze.state.tokens.length - 1].contextId = r),
              !i &&
                ze.state.tokens[a].isType &&
                ((ze.state.tokens[ze.state.tokens.length - 1].isType = !0),
                (i = !0))),
          !(n && rt.match.call(void 0, Dt.TokenType.comma)))
        ) {
          if (rt.eat.call(void 0, e)) break;
          if (rt.match.call(void 0, Dt.TokenType.ellipsis)) {
            mu(t),
              xu(),
              rt.eat.call(void 0, Dt.TokenType.comma),
              va.expect.call(void 0, e);
            break;
          } else uy(o, t);
        }
    }
    Zt.parseBindingList = _u;
    function uy(e, t) {
      e &&
        yu.tsParseModifiers.call(void 0, [
          Uo.ContextualKeyword._public,
          Uo.ContextualKeyword._protected,
          Uo.ContextualKeyword._private,
          Uo.ContextualKeyword._readonly,
          Uo.ContextualKeyword._override,
        ]),
        _a(t),
        xu(),
        _a(t, !0);
    }
    function xu() {
      ze.isFlowEnabled
        ? ay.flowParseAssignableListItemTypes.call(void 0)
        : ze.isTypeScriptEnabled &&
          yu.tsParseAssignableListItemTypes.call(void 0);
    }
    function _a(e, t = !1) {
      if ((t || xa(e), !rt.eat.call(void 0, Dt.TokenType.eq))) return;
      let n = ze.state.tokens.length - 1;
      Wo.parseMaybeAssign.call(void 0),
        (ze.state.tokens[n].rhsEndIndex = ze.state.tokens.length);
    }
    Zt.parseMaybeDefault = _a;
  });
  var mo = H((ye) => {
    'use strict';
    Object.defineProperty(ye, '__esModule', {value: !0});
    var c = Ve(),
      V = Ge(),
      l = ce(),
      T = Ct(),
      ae = Xn(),
      vo = Gr(),
      en = Jo(),
      P = Sn(),
      py = Na();
    function Ca() {
      return c.match.call(void 0, l.TokenType.name);
    }
    function dy() {
      return (
        c.match.call(void 0, l.TokenType.name) ||
        !!(T.state.type & l.TokenType.IS_KEYWORD) ||
        c.match.call(void 0, l.TokenType.string) ||
        c.match.call(void 0, l.TokenType.num) ||
        c.match.call(void 0, l.TokenType.bigint) ||
        c.match.call(void 0, l.TokenType.decimal)
      );
    }
    function Su() {
      let e = T.state.snapshot();
      return (
        c.next.call(void 0),
        (c.match.call(void 0, l.TokenType.bracketL) ||
          c.match.call(void 0, l.TokenType.braceL) ||
          c.match.call(void 0, l.TokenType.star) ||
          c.match.call(void 0, l.TokenType.ellipsis) ||
          c.match.call(void 0, l.TokenType.hash) ||
          dy()) &&
        !P.hasPrecedingLineBreak.call(void 0)
          ? !0
          : (T.state.restoreFromSnapshot(e), !1)
      );
    }
    function bu(e) {
      for (; ba(e) !== null; );
    }
    ye.tsParseModifiers = bu;
    function ba(e) {
      if (!c.match.call(void 0, l.TokenType.name)) return null;
      let t = T.state.contextualKeyword;
      if (e.indexOf(t) !== -1 && Su()) {
        switch (t) {
          case V.ContextualKeyword._readonly:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._readonly;
            break;
          case V.ContextualKeyword._abstract:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._abstract;
            break;
          case V.ContextualKeyword._static:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._static;
            break;
          case V.ContextualKeyword._public:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._public;
            break;
          case V.ContextualKeyword._private:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._private;
            break;
          case V.ContextualKeyword._protected:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._protected;
            break;
          case V.ContextualKeyword._override:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._override;
            break;
          case V.ContextualKeyword._declare:
            T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._declare;
            break;
          default:
            break;
        }
        return t;
      }
      return null;
    }
    ye.tsParseModifier = ba;
    function Xo() {
      for (
        ae.parseIdentifier.call(void 0);
        c.eat.call(void 0, l.TokenType.dot);

      )
        ae.parseIdentifier.call(void 0);
    }
    function fy() {
      Xo(),
        !P.hasPrecedingLineBreak.call(void 0) &&
          c.match.call(void 0, l.TokenType.lessThan) &&
          xo();
    }
    function hy() {
      c.next.call(void 0), Go();
    }
    function Ty() {
      c.next.call(void 0);
    }
    function yy() {
      P.expect.call(void 0, l.TokenType._typeof),
        c.match.call(void 0, l.TokenType._import) ? Eu() : Xo(),
        !P.hasPrecedingLineBreak.call(void 0) &&
          c.match.call(void 0, l.TokenType.lessThan) &&
          xo();
    }
    function Eu() {
      P.expect.call(void 0, l.TokenType._import),
        P.expect.call(void 0, l.TokenType.parenL),
        P.expect.call(void 0, l.TokenType.string),
        P.expect.call(void 0, l.TokenType.parenR),
        c.eat.call(void 0, l.TokenType.dot) && Xo(),
        c.match.call(void 0, l.TokenType.lessThan) && xo();
    }
    function my() {
      c.eat.call(void 0, l.TokenType._const);
      let e = c.eat.call(void 0, l.TokenType._in),
        t = P.eatContextual.call(void 0, V.ContextualKeyword._out);
      c.eat.call(void 0, l.TokenType._const),
        (e || t) && !c.match.call(void 0, l.TokenType.name)
          ? (T.state.tokens[T.state.tokens.length - 1].type = l.TokenType.name)
          : ae.parseIdentifier.call(void 0),
        c.eat.call(void 0, l.TokenType._extends) && Me(),
        c.eat.call(void 0, l.TokenType.eq) && Me();
    }
    function _o() {
      c.match.call(void 0, l.TokenType.lessThan) && Qr();
    }
    ye.tsTryParseTypeParameters = _o;
    function Qr() {
      let e = c.pushTypeContext.call(void 0, 0);
      for (
        c.match.call(void 0, l.TokenType.lessThan) ||
        c.match.call(void 0, l.TokenType.typeParameterStart)
          ? c.next.call(void 0)
          : P.unexpected.call(void 0);
        !c.eat.call(void 0, l.TokenType.greaterThan) && !T.state.error;

      )
        my(), c.eat.call(void 0, l.TokenType.comma);
      c.popTypeContext.call(void 0, e);
    }
    function Ea(e) {
      let t = e === l.TokenType.arrow;
      _o(),
        P.expect.call(void 0, l.TokenType.parenL),
        T.state.scopeDepth++,
        ky(!1),
        T.state.scopeDepth--,
        (t || c.match.call(void 0, e)) && zo(e);
    }
    function ky(e) {
      vo.parseBindingList.call(void 0, l.TokenType.parenR, e);
    }
    function Jr() {
      c.eat.call(void 0, l.TokenType.comma) || P.semicolon.call(void 0);
    }
    function gu() {
      Ea(l.TokenType.colon), Jr();
    }
    function vy() {
      let e = T.state.snapshot();
      c.next.call(void 0);
      let t =
        c.eat.call(void 0, l.TokenType.name) &&
        c.match.call(void 0, l.TokenType.colon);
      return T.state.restoreFromSnapshot(e), t;
    }
    function Au() {
      if (!(c.match.call(void 0, l.TokenType.bracketL) && vy())) return !1;
      let e = c.pushTypeContext.call(void 0, 0);
      return (
        P.expect.call(void 0, l.TokenType.bracketL),
        ae.parseIdentifier.call(void 0),
        Go(),
        P.expect.call(void 0, l.TokenType.bracketR),
        Yo(),
        Jr(),
        c.popTypeContext.call(void 0, e),
        !0
      );
    }
    function Cu(e) {
      c.eat.call(void 0, l.TokenType.question),
        !e &&
        (c.match.call(void 0, l.TokenType.parenL) ||
          c.match.call(void 0, l.TokenType.lessThan))
          ? (Ea(l.TokenType.colon), Jr())
          : (Yo(), Jr());
    }
    function _y() {
      if (
        c.match.call(void 0, l.TokenType.parenL) ||
        c.match.call(void 0, l.TokenType.lessThan)
      ) {
        gu();
        return;
      }
      if (c.match.call(void 0, l.TokenType._new)) {
        c.next.call(void 0),
          c.match.call(void 0, l.TokenType.parenL) ||
          c.match.call(void 0, l.TokenType.lessThan)
            ? gu()
            : Cu(!1);
        return;
      }
      let e = !!ba([V.ContextualKeyword._readonly]);
      Au() ||
        ((P.isContextual.call(void 0, V.ContextualKeyword._get) ||
          P.isContextual.call(void 0, V.ContextualKeyword._set)) &&
          Su(),
        ae.parsePropertyName.call(void 0, -1),
        Cu(e));
    }
    function xy() {
      Pu();
    }
    function Pu() {
      for (
        P.expect.call(void 0, l.TokenType.braceL);
        !c.eat.call(void 0, l.TokenType.braceR) && !T.state.error;

      )
        _y();
    }
    function gy() {
      let e = T.state.snapshot(),
        t = Cy();
      return T.state.restoreFromSnapshot(e), t;
    }
    function Cy() {
      return (
        c.next.call(void 0),
        c.eat.call(void 0, l.TokenType.plus) ||
        c.eat.call(void 0, l.TokenType.minus)
          ? P.isContextual.call(void 0, V.ContextualKeyword._readonly)
          : (P.isContextual.call(void 0, V.ContextualKeyword._readonly) &&
              c.next.call(void 0),
            !c.match.call(void 0, l.TokenType.bracketL) ||
            (c.next.call(void 0), !Ca())
              ? !1
              : (c.next.call(void 0), c.match.call(void 0, l.TokenType._in)))
      );
    }
    function wy() {
      ae.parseIdentifier.call(void 0),
        P.expect.call(void 0, l.TokenType._in),
        Me();
    }
    function Iy() {
      P.expect.call(void 0, l.TokenType.braceL),
        c.match.call(void 0, l.TokenType.plus) ||
        c.match.call(void 0, l.TokenType.minus)
          ? (c.next.call(void 0),
            P.expectContextual.call(void 0, V.ContextualKeyword._readonly))
          : P.eatContextual.call(void 0, V.ContextualKeyword._readonly),
        P.expect.call(void 0, l.TokenType.bracketL),
        wy(),
        P.eatContextual.call(void 0, V.ContextualKeyword._as) && Me(),
        P.expect.call(void 0, l.TokenType.bracketR),
        c.match.call(void 0, l.TokenType.plus) ||
        c.match.call(void 0, l.TokenType.minus)
          ? (c.next.call(void 0), P.expect.call(void 0, l.TokenType.question))
          : c.eat.call(void 0, l.TokenType.question),
        By(),
        P.semicolon.call(void 0),
        P.expect.call(void 0, l.TokenType.braceR);
    }
    function Sy() {
      for (
        P.expect.call(void 0, l.TokenType.bracketL);
        !c.eat.call(void 0, l.TokenType.bracketR) && !T.state.error;

      )
        by(), c.eat.call(void 0, l.TokenType.comma);
    }
    function by() {
      c.eat.call(void 0, l.TokenType.ellipsis)
        ? Me()
        : (Me(), c.eat.call(void 0, l.TokenType.question)),
        c.eat.call(void 0, l.TokenType.colon) && Me();
    }
    function Ey() {
      P.expect.call(void 0, l.TokenType.parenL),
        Me(),
        P.expect.call(void 0, l.TokenType.parenR);
    }
    function Ay() {
      for (
        c.nextTemplateToken.call(void 0), c.nextTemplateToken.call(void 0);
        !c.match.call(void 0, l.TokenType.backQuote) && !T.state.error;

      )
        P.expect.call(void 0, l.TokenType.dollarBraceL),
          Me(),
          c.nextTemplateToken.call(void 0),
          c.nextTemplateToken.call(void 0);
      c.next.call(void 0);
    }
    var An;
    (function (e) {
      e[(e.TSFunctionType = 0)] = 'TSFunctionType';
      let n = 1;
      e[(e.TSConstructorType = n)] = 'TSConstructorType';
      let o = n + 1;
      e[(e.TSAbstractConstructorType = o)] = 'TSAbstractConstructorType';
    })(An || (An = {}));
    function ga(e) {
      e === An.TSAbstractConstructorType &&
        P.expectContextual.call(void 0, V.ContextualKeyword._abstract),
        (e === An.TSConstructorType || e === An.TSAbstractConstructorType) &&
          P.expect.call(void 0, l.TokenType._new);
      let t = T.state.inDisallowConditionalTypesContext;
      (T.state.inDisallowConditionalTypesContext = !1),
        Ea(l.TokenType.arrow),
        (T.state.inDisallowConditionalTypesContext = t);
    }
    function Py() {
      switch (T.state.type) {
        case l.TokenType.name:
          fy();
          return;
        case l.TokenType._void:
        case l.TokenType._null:
          c.next.call(void 0);
          return;
        case l.TokenType.string:
        case l.TokenType.num:
        case l.TokenType.bigint:
        case l.TokenType.decimal:
        case l.TokenType._true:
        case l.TokenType._false:
          ae.parseLiteral.call(void 0);
          return;
        case l.TokenType.minus:
          c.next.call(void 0), ae.parseLiteral.call(void 0);
          return;
        case l.TokenType._this: {
          Ty(),
            P.isContextual.call(void 0, V.ContextualKeyword._is) &&
              !P.hasPrecedingLineBreak.call(void 0) &&
              hy();
          return;
        }
        case l.TokenType._typeof:
          yy();
          return;
        case l.TokenType._import:
          Eu();
          return;
        case l.TokenType.braceL:
          gy() ? Iy() : xy();
          return;
        case l.TokenType.bracketL:
          Sy();
          return;
        case l.TokenType.parenL:
          Ey();
          return;
        case l.TokenType.backQuote:
          Ay();
          return;
        default:
          if (T.state.type & l.TokenType.IS_KEYWORD) {
            c.next.call(void 0),
              (T.state.tokens[T.state.tokens.length - 1].type =
                l.TokenType.name);
            return;
          }
          break;
      }
      P.unexpected.call(void 0);
    }
    function Ry() {
      for (
        Py();
        !P.hasPrecedingLineBreak.call(void 0) &&
        c.eat.call(void 0, l.TokenType.bracketL);

      )
        c.eat.call(void 0, l.TokenType.bracketR) ||
          (Me(), P.expect.call(void 0, l.TokenType.bracketR));
    }
    function Ny() {
      if (
        (P.expectContextual.call(void 0, V.ContextualKeyword._infer),
        ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType._extends))
      ) {
        let e = T.state.snapshot();
        P.expect.call(void 0, l.TokenType._extends);
        let t = T.state.inDisallowConditionalTypesContext;
        (T.state.inDisallowConditionalTypesContext = !0),
          Me(),
          (T.state.inDisallowConditionalTypesContext = t),
          (T.state.error ||
            (!T.state.inDisallowConditionalTypesContext &&
              c.match.call(void 0, l.TokenType.question))) &&
            T.state.restoreFromSnapshot(e);
      }
    }
    function wa() {
      if (
        P.isContextual.call(void 0, V.ContextualKeyword._keyof) ||
        P.isContextual.call(void 0, V.ContextualKeyword._unique) ||
        P.isContextual.call(void 0, V.ContextualKeyword._readonly)
      )
        c.next.call(void 0), wa();
      else if (P.isContextual.call(void 0, V.ContextualKeyword._infer)) Ny();
      else {
        let e = T.state.inDisallowConditionalTypesContext;
        (T.state.inDisallowConditionalTypesContext = !1),
          Ry(),
          (T.state.inDisallowConditionalTypesContext = e);
      }
    }
    function wu() {
      if (
        (c.eat.call(void 0, l.TokenType.bitwiseAND),
        wa(),
        c.match.call(void 0, l.TokenType.bitwiseAND))
      )
        for (; c.eat.call(void 0, l.TokenType.bitwiseAND); ) wa();
    }
    function Dy() {
      if (
        (c.eat.call(void 0, l.TokenType.bitwiseOR),
        wu(),
        c.match.call(void 0, l.TokenType.bitwiseOR))
      )
        for (; c.eat.call(void 0, l.TokenType.bitwiseOR); ) wu();
    }
    function Oy() {
      return c.match.call(void 0, l.TokenType.lessThan)
        ? !0
        : c.match.call(void 0, l.TokenType.parenL) && Ly();
    }
    function My() {
      if (
        c.match.call(void 0, l.TokenType.name) ||
        c.match.call(void 0, l.TokenType._this)
      )
        return c.next.call(void 0), !0;
      if (
        c.match.call(void 0, l.TokenType.braceL) ||
        c.match.call(void 0, l.TokenType.bracketL)
      ) {
        let e = 1;
        for (c.next.call(void 0); e > 0 && !T.state.error; )
          c.match.call(void 0, l.TokenType.braceL) ||
          c.match.call(void 0, l.TokenType.bracketL)
            ? e++
            : (c.match.call(void 0, l.TokenType.braceR) ||
                c.match.call(void 0, l.TokenType.bracketR)) &&
              e--,
            c.next.call(void 0);
        return !0;
      }
      return !1;
    }
    function Ly() {
      let e = T.state.snapshot(),
        t = Fy();
      return T.state.restoreFromSnapshot(e), t;
    }
    function Fy() {
      return (
        c.next.call(void 0),
        !!(
          c.match.call(void 0, l.TokenType.parenR) ||
          c.match.call(void 0, l.TokenType.ellipsis) ||
          (My() &&
            (c.match.call(void 0, l.TokenType.colon) ||
              c.match.call(void 0, l.TokenType.comma) ||
              c.match.call(void 0, l.TokenType.question) ||
              c.match.call(void 0, l.TokenType.eq) ||
              (c.match.call(void 0, l.TokenType.parenR) &&
                (c.next.call(void 0),
                c.match.call(void 0, l.TokenType.arrow)))))
        )
      );
    }
    function zo(e) {
      let t = c.pushTypeContext.call(void 0, 0);
      P.expect.call(void 0, e), jy() || Me(), c.popTypeContext.call(void 0, t);
    }
    function $y() {
      c.match.call(void 0, l.TokenType.colon) && zo(l.TokenType.colon);
    }
    function Yo() {
      c.match.call(void 0, l.TokenType.colon) && Go();
    }
    ye.tsTryParseTypeAnnotation = Yo;
    function By() {
      c.eat.call(void 0, l.TokenType.colon) && Me();
    }
    function jy() {
      let e = T.state.snapshot();
      return P.isContextual.call(void 0, V.ContextualKeyword._asserts)
        ? (c.next.call(void 0),
          P.eatContextual.call(void 0, V.ContextualKeyword._is)
            ? (Me(), !0)
            : Ca() || c.match.call(void 0, l.TokenType._this)
            ? (c.next.call(void 0),
              P.eatContextual.call(void 0, V.ContextualKeyword._is) && Me(),
              !0)
            : (T.state.restoreFromSnapshot(e), !1))
        : Ca() || c.match.call(void 0, l.TokenType._this)
        ? (c.next.call(void 0),
          P.isContextual.call(void 0, V.ContextualKeyword._is) &&
          !P.hasPrecedingLineBreak.call(void 0)
            ? (c.next.call(void 0), Me(), !0)
            : (T.state.restoreFromSnapshot(e), !1))
        : !1;
    }
    function Go() {
      let e = c.pushTypeContext.call(void 0, 0);
      P.expect.call(void 0, l.TokenType.colon),
        Me(),
        c.popTypeContext.call(void 0, e);
    }
    ye.tsParseTypeAnnotation = Go;
    function Me() {
      if (
        (Ia(),
        T.state.inDisallowConditionalTypesContext ||
          P.hasPrecedingLineBreak.call(void 0) ||
          !c.eat.call(void 0, l.TokenType._extends))
      )
        return;
      let e = T.state.inDisallowConditionalTypesContext;
      (T.state.inDisallowConditionalTypesContext = !0),
        Ia(),
        (T.state.inDisallowConditionalTypesContext = e),
        P.expect.call(void 0, l.TokenType.question),
        Me(),
        P.expect.call(void 0, l.TokenType.colon),
        Me();
    }
    ye.tsParseType = Me;
    function Ky() {
      return (
        P.isContextual.call(void 0, V.ContextualKeyword._abstract) &&
        c.lookaheadType.call(void 0) === l.TokenType._new
      );
    }
    function Ia() {
      if (Oy()) {
        ga(An.TSFunctionType);
        return;
      }
      if (c.match.call(void 0, l.TokenType._new)) {
        ga(An.TSConstructorType);
        return;
      } else if (Ky()) {
        ga(An.TSAbstractConstructorType);
        return;
      }
      Dy();
    }
    ye.tsParseNonConditionalType = Ia;
    function qy() {
      let e = c.pushTypeContext.call(void 0, 1);
      Me(),
        P.expect.call(void 0, l.TokenType.greaterThan),
        c.popTypeContext.call(void 0, e),
        ae.parseMaybeUnary.call(void 0);
    }
    ye.tsParseTypeAssertion = qy;
    function Hy() {
      if (c.eat.call(void 0, l.TokenType.jsxTagStart)) {
        T.state.tokens[T.state.tokens.length - 1].type =
          l.TokenType.typeParameterStart;
        let e = c.pushTypeContext.call(void 0, 1);
        for (
          ;
          !c.match.call(void 0, l.TokenType.greaterThan) && !T.state.error;

        )
          Me(), c.eat.call(void 0, l.TokenType.comma);
        py.nextJSXTagToken.call(void 0), c.popTypeContext.call(void 0, e);
      }
    }
    ye.tsTryParseJSXTypeArgument = Hy;
    function Ru() {
      for (; !c.match.call(void 0, l.TokenType.braceL) && !T.state.error; )
        Uy(), c.eat.call(void 0, l.TokenType.comma);
    }
    function Uy() {
      Xo(), c.match.call(void 0, l.TokenType.lessThan) && xo();
    }
    function Wy() {
      vo.parseBindingIdentifier.call(void 0, !1),
        _o(),
        c.eat.call(void 0, l.TokenType._extends) && Ru(),
        Pu();
    }
    function Vy() {
      vo.parseBindingIdentifier.call(void 0, !1),
        _o(),
        P.expect.call(void 0, l.TokenType.eq),
        Me(),
        P.semicolon.call(void 0);
    }
    function zy() {
      if (
        (c.match.call(void 0, l.TokenType.string)
          ? ae.parseLiteral.call(void 0)
          : ae.parseIdentifier.call(void 0),
        c.eat.call(void 0, l.TokenType.eq))
      ) {
        let e = T.state.tokens.length - 1;
        ae.parseMaybeAssign.call(void 0),
          (T.state.tokens[e].rhsEndIndex = T.state.tokens.length);
      }
    }
    function Aa() {
      for (
        vo.parseBindingIdentifier.call(void 0, !1),
          P.expect.call(void 0, l.TokenType.braceL);
        !c.eat.call(void 0, l.TokenType.braceR) && !T.state.error;

      )
        zy(), c.eat.call(void 0, l.TokenType.comma);
    }
    function Pa() {
      P.expect.call(void 0, l.TokenType.braceL),
        en.parseBlockBody.call(void 0, l.TokenType.braceR);
    }
    function Sa() {
      vo.parseBindingIdentifier.call(void 0, !1),
        c.eat.call(void 0, l.TokenType.dot) ? Sa() : Pa();
    }
    function Nu() {
      P.isContextual.call(void 0, V.ContextualKeyword._global)
        ? ae.parseIdentifier.call(void 0)
        : c.match.call(void 0, l.TokenType.string)
        ? ae.parseExprAtom.call(void 0)
        : P.unexpected.call(void 0),
        c.match.call(void 0, l.TokenType.braceL)
          ? Pa()
          : P.semicolon.call(void 0);
    }
    function Du() {
      vo.parseImportedIdentifier.call(void 0),
        P.expect.call(void 0, l.TokenType.eq),
        Yy(),
        P.semicolon.call(void 0);
    }
    ye.tsParseImportEqualsDeclaration = Du;
    function Xy() {
      return (
        P.isContextual.call(void 0, V.ContextualKeyword._require) &&
        c.lookaheadType.call(void 0) === l.TokenType.parenL
      );
    }
    function Yy() {
      Xy() ? Gy() : Xo();
    }
    function Gy() {
      P.expectContextual.call(void 0, V.ContextualKeyword._require),
        P.expect.call(void 0, l.TokenType.parenL),
        c.match.call(void 0, l.TokenType.string) || P.unexpected.call(void 0),
        ae.parseLiteral.call(void 0),
        P.expect.call(void 0, l.TokenType.parenR);
    }
    function Jy() {
      if (P.isLineTerminator.call(void 0)) return !1;
      switch (T.state.type) {
        case l.TokenType._function: {
          let e = c.pushTypeContext.call(void 0, 1);
          c.next.call(void 0);
          let t = T.state.start;
          return (
            en.parseFunction.call(void 0, t, !0),
            c.popTypeContext.call(void 0, e),
            !0
          );
        }
        case l.TokenType._class: {
          let e = c.pushTypeContext.call(void 0, 1);
          return (
            en.parseClass.call(void 0, !0, !1),
            c.popTypeContext.call(void 0, e),
            !0
          );
        }
        case l.TokenType._const:
          if (
            c.match.call(void 0, l.TokenType._const) &&
            P.isLookaheadContextual.call(void 0, V.ContextualKeyword._enum)
          ) {
            let e = c.pushTypeContext.call(void 0, 1);
            return (
              P.expect.call(void 0, l.TokenType._const),
              P.expectContextual.call(void 0, V.ContextualKeyword._enum),
              (T.state.tokens[T.state.tokens.length - 1].type =
                l.TokenType._enum),
              Aa(),
              c.popTypeContext.call(void 0, e),
              !0
            );
          }
        case l.TokenType._var:
        case l.TokenType._let: {
          let e = c.pushTypeContext.call(void 0, 1);
          return (
            en.parseVarStatement.call(
              void 0,
              T.state.type !== l.TokenType._var
            ),
            c.popTypeContext.call(void 0, e),
            !0
          );
        }
        case l.TokenType.name: {
          let e = c.pushTypeContext.call(void 0, 1),
            t = T.state.contextualKeyword,
            n = !1;
          return (
            t === V.ContextualKeyword._global
              ? (Nu(), (n = !0))
              : (n = Zr(t, !0)),
            c.popTypeContext.call(void 0, e),
            n
          );
        }
        default:
          return !1;
      }
    }
    function Iu() {
      return Zr(T.state.contextualKeyword, !0);
    }
    function Qy(e) {
      switch (e) {
        case V.ContextualKeyword._declare: {
          let t = T.state.tokens.length - 1;
          if (Jy()) return (T.state.tokens[t].type = l.TokenType._declare), !0;
          break;
        }
        case V.ContextualKeyword._global:
          if (c.match.call(void 0, l.TokenType.braceL)) return Pa(), !0;
          break;
        default:
          return Zr(e, !1);
      }
      return !1;
    }
    function Zr(e, t) {
      switch (e) {
        case V.ContextualKeyword._abstract:
          if (ko(t) && c.match.call(void 0, l.TokenType._class))
            return (
              (T.state.tokens[T.state.tokens.length - 1].type =
                l.TokenType._abstract),
              en.parseClass.call(void 0, !0, !1),
              !0
            );
          break;
        case V.ContextualKeyword._enum:
          if (ko(t) && c.match.call(void 0, l.TokenType.name))
            return (
              (T.state.tokens[T.state.tokens.length - 1].type =
                l.TokenType._enum),
              Aa(),
              !0
            );
          break;
        case V.ContextualKeyword._interface:
          if (ko(t) && c.match.call(void 0, l.TokenType.name)) {
            let n = c.pushTypeContext.call(void 0, t ? 2 : 1);
            return Wy(), c.popTypeContext.call(void 0, n), !0;
          }
          break;
        case V.ContextualKeyword._module:
          if (ko(t)) {
            if (c.match.call(void 0, l.TokenType.string)) {
              let n = c.pushTypeContext.call(void 0, t ? 2 : 1);
              return Nu(), c.popTypeContext.call(void 0, n), !0;
            } else if (c.match.call(void 0, l.TokenType.name)) {
              let n = c.pushTypeContext.call(void 0, t ? 2 : 1);
              return Sa(), c.popTypeContext.call(void 0, n), !0;
            }
          }
          break;
        case V.ContextualKeyword._namespace:
          if (ko(t) && c.match.call(void 0, l.TokenType.name)) {
            let n = c.pushTypeContext.call(void 0, t ? 2 : 1);
            return Sa(), c.popTypeContext.call(void 0, n), !0;
          }
          break;
        case V.ContextualKeyword._type:
          if (ko(t) && c.match.call(void 0, l.TokenType.name)) {
            let n = c.pushTypeContext.call(void 0, t ? 2 : 1);
            return Vy(), c.popTypeContext.call(void 0, n), !0;
          }
          break;
        default:
          break;
      }
      return !1;
    }
    function ko(e) {
      return e ? (c.next.call(void 0), !0) : !P.isLineTerminator.call(void 0);
    }
    function Zy() {
      let e = T.state.snapshot();
      return (
        Qr(),
        en.parseFunctionParams.call(void 0),
        $y(),
        P.expect.call(void 0, l.TokenType.arrow),
        T.state.error
          ? (T.state.restoreFromSnapshot(e), !1)
          : (ae.parseFunctionBody.call(void 0, !0), !0)
      );
    }
    function Ra() {
      T.state.type === l.TokenType.bitShiftL &&
        ((T.state.pos -= 1), c.finishToken.call(void 0, l.TokenType.lessThan)),
        xo();
    }
    function xo() {
      let e = c.pushTypeContext.call(void 0, 0);
      for (
        P.expect.call(void 0, l.TokenType.lessThan);
        !c.eat.call(void 0, l.TokenType.greaterThan) && !T.state.error;

      )
        Me(), c.eat.call(void 0, l.TokenType.comma);
      c.popTypeContext.call(void 0, e);
    }
    function em() {
      if (c.match.call(void 0, l.TokenType.name))
        switch (T.state.contextualKeyword) {
          case V.ContextualKeyword._abstract:
          case V.ContextualKeyword._declare:
          case V.ContextualKeyword._enum:
          case V.ContextualKeyword._interface:
          case V.ContextualKeyword._module:
          case V.ContextualKeyword._namespace:
          case V.ContextualKeyword._type:
            return !0;
          default:
            break;
        }
      return !1;
    }
    ye.tsIsDeclarationStart = em;
    function tm(e, t) {
      if (
        (c.match.call(void 0, l.TokenType.colon) && zo(l.TokenType.colon),
        !c.match.call(void 0, l.TokenType.braceL) &&
          P.isLineTerminator.call(void 0))
      ) {
        let n = T.state.tokens.length - 1;
        for (
          ;
          n >= 0 &&
          (T.state.tokens[n].start >= e ||
            T.state.tokens[n].type === l.TokenType._default ||
            T.state.tokens[n].type === l.TokenType._export);

        )
          (T.state.tokens[n].isType = !0), n--;
        return;
      }
      ae.parseFunctionBody.call(void 0, !1, t);
    }
    ye.tsParseFunctionBodyAndFinish = tm;
    function nm(e, t, n) {
      if (
        !P.hasPrecedingLineBreak.call(void 0) &&
        c.eat.call(void 0, l.TokenType.bang)
      ) {
        T.state.tokens[T.state.tokens.length - 1].type =
          l.TokenType.nonNullAssertion;
        return;
      }
      if (
        c.match.call(void 0, l.TokenType.lessThan) ||
        c.match.call(void 0, l.TokenType.bitShiftL)
      ) {
        let o = T.state.snapshot();
        if (!t && ae.atPossibleAsync.call(void 0) && Zy()) return;
        if (
          (Ra(),
          !t && c.eat.call(void 0, l.TokenType.parenL)
            ? ((T.state.tokens[T.state.tokens.length - 1].subscriptStartIndex =
                e),
              ae.parseCallExpressionArguments.call(void 0))
            : c.match.call(void 0, l.TokenType.backQuote)
            ? ae.parseTemplate.call(void 0)
            : (T.state.type === l.TokenType.greaterThan ||
                (T.state.type !== l.TokenType.parenL &&
                  T.state.type & l.TokenType.IS_EXPRESSION_START &&
                  !P.hasPrecedingLineBreak.call(void 0))) &&
              P.unexpected.call(void 0),
          T.state.error)
        )
          T.state.restoreFromSnapshot(o);
        else return;
      } else
        !t &&
          c.match.call(void 0, l.TokenType.questionDot) &&
          c.lookaheadType.call(void 0) === l.TokenType.lessThan &&
          (c.next.call(void 0),
          (T.state.tokens[e].isOptionalChainStart = !0),
          (T.state.tokens[T.state.tokens.length - 1].subscriptStartIndex = e),
          xo(),
          P.expect.call(void 0, l.TokenType.parenL),
          ae.parseCallExpressionArguments.call(void 0));
      ae.baseParseSubscript.call(void 0, e, t, n);
    }
    ye.tsParseSubscript = nm;
    function om() {
      if (c.eat.call(void 0, l.TokenType._import))
        return (
          P.isContextual.call(void 0, V.ContextualKeyword._type) &&
            c.lookaheadType.call(void 0) !== l.TokenType.eq &&
            P.expectContextual.call(void 0, V.ContextualKeyword._type),
          Du(),
          !0
        );
      if (c.eat.call(void 0, l.TokenType.eq))
        return ae.parseExpression.call(void 0), P.semicolon.call(void 0), !0;
      if (P.eatContextual.call(void 0, V.ContextualKeyword._as))
        return (
          P.expectContextual.call(void 0, V.ContextualKeyword._namespace),
          ae.parseIdentifier.call(void 0),
          P.semicolon.call(void 0),
          !0
        );
      if (P.isContextual.call(void 0, V.ContextualKeyword._type)) {
        let e = c.lookaheadType.call(void 0);
        (e === l.TokenType.braceL || e === l.TokenType.star) &&
          c.next.call(void 0);
      }
      return !1;
    }
    ye.tsTryParseExport = om;
    function rm() {
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        T.state.tokens[T.state.tokens.length - 1].identifierRole =
          c.IdentifierRole.ImportDeclaration;
        return;
      }
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        (T.state.tokens[T.state.tokens.length - 1].identifierRole =
          c.IdentifierRole.ImportDeclaration),
          (T.state.tokens[T.state.tokens.length - 2].isType = !0),
          (T.state.tokens[T.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        (T.state.tokens[T.state.tokens.length - 3].identifierRole =
          c.IdentifierRole.ImportAccess),
          (T.state.tokens[T.state.tokens.length - 1].identifierRole =
            c.IdentifierRole.ImportDeclaration);
        return;
      }
      ae.parseIdentifier.call(void 0),
        (T.state.tokens[T.state.tokens.length - 3].identifierRole =
          c.IdentifierRole.ImportAccess),
        (T.state.tokens[T.state.tokens.length - 1].identifierRole =
          c.IdentifierRole.ImportDeclaration),
        (T.state.tokens[T.state.tokens.length - 4].isType = !0),
        (T.state.tokens[T.state.tokens.length - 3].isType = !0),
        (T.state.tokens[T.state.tokens.length - 2].isType = !0),
        (T.state.tokens[T.state.tokens.length - 1].isType = !0);
    }
    ye.tsParseImportSpecifier = rm;
    function sm() {
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        T.state.tokens[T.state.tokens.length - 1].identifierRole =
          c.IdentifierRole.ExportAccess;
        return;
      }
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        (T.state.tokens[T.state.tokens.length - 1].identifierRole =
          c.IdentifierRole.ExportAccess),
          (T.state.tokens[T.state.tokens.length - 2].isType = !0),
          (T.state.tokens[T.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (ae.parseIdentifier.call(void 0),
        c.match.call(void 0, l.TokenType.comma) ||
          c.match.call(void 0, l.TokenType.braceR))
      ) {
        T.state.tokens[T.state.tokens.length - 3].identifierRole =
          c.IdentifierRole.ExportAccess;
        return;
      }
      ae.parseIdentifier.call(void 0),
        (T.state.tokens[T.state.tokens.length - 3].identifierRole =
          c.IdentifierRole.ExportAccess),
        (T.state.tokens[T.state.tokens.length - 4].isType = !0),
        (T.state.tokens[T.state.tokens.length - 3].isType = !0),
        (T.state.tokens[T.state.tokens.length - 2].isType = !0),
        (T.state.tokens[T.state.tokens.length - 1].isType = !0);
    }
    ye.tsParseExportSpecifier = sm;
    function im() {
      if (
        P.isContextual.call(void 0, V.ContextualKeyword._abstract) &&
        c.lookaheadType.call(void 0) === l.TokenType._class
      )
        return (
          (T.state.type = l.TokenType._abstract),
          c.next.call(void 0),
          en.parseClass.call(void 0, !0, !0),
          !0
        );
      if (P.isContextual.call(void 0, V.ContextualKeyword._interface)) {
        let e = c.pushTypeContext.call(void 0, 2);
        return (
          Zr(V.ContextualKeyword._interface, !0),
          c.popTypeContext.call(void 0, e),
          !0
        );
      }
      return !1;
    }
    ye.tsTryParseExportDefaultExpression = im;
    function am() {
      if (T.state.type === l.TokenType._const) {
        let e = c.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === l.TokenType.name &&
          e.contextualKeyword === V.ContextualKeyword._enum
        )
          return (
            P.expect.call(void 0, l.TokenType._const),
            P.expectContextual.call(void 0, V.ContextualKeyword._enum),
            (T.state.tokens[T.state.tokens.length - 1].type =
              l.TokenType._enum),
            Aa(),
            !0
          );
      }
      return !1;
    }
    ye.tsTryParseStatementContent = am;
    function lm(e) {
      let t = T.state.tokens.length;
      bu([
        V.ContextualKeyword._abstract,
        V.ContextualKeyword._readonly,
        V.ContextualKeyword._declare,
        V.ContextualKeyword._static,
        V.ContextualKeyword._override,
      ]);
      let n = T.state.tokens.length;
      if (Au()) {
        let r = e ? t - 1 : t;
        for (let s = r; s < n; s++) T.state.tokens[s].isType = !0;
        return !0;
      }
      return !1;
    }
    ye.tsTryParseClassMemberWithIsStatic = lm;
    function cm(e) {
      Qy(e) || P.semicolon.call(void 0);
    }
    ye.tsParseIdentifierStatement = cm;
    function um() {
      let e = P.eatContextual.call(void 0, V.ContextualKeyword._declare);
      e &&
        (T.state.tokens[T.state.tokens.length - 1].type = l.TokenType._declare);
      let t = !1;
      if (c.match.call(void 0, l.TokenType.name))
        if (e) {
          let n = c.pushTypeContext.call(void 0, 2);
          (t = Iu()), c.popTypeContext.call(void 0, n);
        } else t = Iu();
      if (!t)
        if (e) {
          let n = c.pushTypeContext.call(void 0, 2);
          en.parseStatement.call(void 0, !0), c.popTypeContext.call(void 0, n);
        } else en.parseStatement.call(void 0, !0);
    }
    ye.tsParseExportDeclaration = um;
    function pm(e) {
      if (
        (e &&
          (c.match.call(void 0, l.TokenType.lessThan) ||
            c.match.call(void 0, l.TokenType.bitShiftL)) &&
          Ra(),
        P.eatContextual.call(void 0, V.ContextualKeyword._implements))
      ) {
        T.state.tokens[T.state.tokens.length - 1].type =
          l.TokenType._implements;
        let t = c.pushTypeContext.call(void 0, 1);
        Ru(), c.popTypeContext.call(void 0, t);
      }
    }
    ye.tsAfterParseClassSuper = pm;
    function dm() {
      _o();
    }
    ye.tsStartParseObjPropValue = dm;
    function fm() {
      _o();
    }
    ye.tsStartParseFunctionParams = fm;
    function hm() {
      let e = c.pushTypeContext.call(void 0, 0);
      P.hasPrecedingLineBreak.call(void 0) ||
        c.eat.call(void 0, l.TokenType.bang),
        Yo(),
        c.popTypeContext.call(void 0, e);
    }
    ye.tsAfterParseVarHead = hm;
    function Tm() {
      c.match.call(void 0, l.TokenType.colon) && Go();
    }
    ye.tsStartParseAsyncArrowFromCallExpression = Tm;
    function ym(e, t) {
      return T.isJSXEnabled ? Ou(e, t) : Mu(e, t);
    }
    ye.tsParseMaybeAssign = ym;
    function Ou(e, t) {
      if (!c.match.call(void 0, l.TokenType.lessThan))
        return ae.baseParseMaybeAssign.call(void 0, e, t);
      let n = T.state.snapshot(),
        o = ae.baseParseMaybeAssign.call(void 0, e, t);
      if (T.state.error) T.state.restoreFromSnapshot(n);
      else return o;
      return (
        (T.state.type = l.TokenType.typeParameterStart),
        Qr(),
        (o = ae.baseParseMaybeAssign.call(void 0, e, t)),
        o || P.unexpected.call(void 0),
        o
      );
    }
    ye.tsParseMaybeAssignWithJSX = Ou;
    function Mu(e, t) {
      if (!c.match.call(void 0, l.TokenType.lessThan))
        return ae.baseParseMaybeAssign.call(void 0, e, t);
      let n = T.state.snapshot();
      Qr();
      let o = ae.baseParseMaybeAssign.call(void 0, e, t);
      if ((o || P.unexpected.call(void 0), T.state.error))
        T.state.restoreFromSnapshot(n);
      else return o;
      return ae.baseParseMaybeAssign.call(void 0, e, t);
    }
    ye.tsParseMaybeAssignWithoutJSX = Mu;
    function mm() {
      if (c.match.call(void 0, l.TokenType.colon)) {
        let e = T.state.snapshot();
        zo(l.TokenType.colon),
          P.canInsertSemicolon.call(void 0) && P.unexpected.call(void 0),
          c.match.call(void 0, l.TokenType.arrow) || P.unexpected.call(void 0),
          T.state.error && T.state.restoreFromSnapshot(e);
      }
      return c.eat.call(void 0, l.TokenType.arrow);
    }
    ye.tsParseArrow = mm;
    function km() {
      let e = c.pushTypeContext.call(void 0, 0);
      c.eat.call(void 0, l.TokenType.question),
        Yo(),
        c.popTypeContext.call(void 0, e);
    }
    ye.tsParseAssignableListItemTypes = km;
    function vm() {
      (c.match.call(void 0, l.TokenType.lessThan) ||
        c.match.call(void 0, l.TokenType.bitShiftL)) &&
        Ra(),
        en.baseParseMaybeDecoratorArguments.call(void 0);
    }
    ye.tsParseMaybeDecoratorArguments = vm;
  });
  var Na = H((ts) => {
    'use strict';
    Object.defineProperty(ts, '__esModule', {value: !0});
    var de = Ve(),
      ve = ce(),
      Z = Ct(),
      es = Xn(),
      Pn = Sn(),
      Be = gt(),
      Lu = fo(),
      _m = mo();
    function xm() {
      let e = !1,
        t = !1;
      for (;;) {
        if (Z.state.pos >= Z.input.length) {
          Pn.unexpected.call(void 0, 'Unterminated JSX contents');
          return;
        }
        let n = Z.input.charCodeAt(Z.state.pos);
        if (n === Be.charCodes.lessThan || n === Be.charCodes.leftCurlyBrace) {
          if (Z.state.pos === Z.state.start) {
            if (n === Be.charCodes.lessThan) {
              Z.state.pos++,
                de.finishToken.call(void 0, ve.TokenType.jsxTagStart);
              return;
            }
            de.getTokenFromCode.call(void 0, n);
            return;
          }
          e && !t
            ? de.finishToken.call(void 0, ve.TokenType.jsxEmptyText)
            : de.finishToken.call(void 0, ve.TokenType.jsxText);
          return;
        }
        n === Be.charCodes.lineFeed
          ? (e = !0)
          : n !== Be.charCodes.space &&
            n !== Be.charCodes.carriageReturn &&
            n !== Be.charCodes.tab &&
            (t = !0),
          Z.state.pos++;
      }
    }
    function gm(e) {
      for (Z.state.pos++; ; ) {
        if (Z.state.pos >= Z.input.length) {
          Pn.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        if (Z.input.charCodeAt(Z.state.pos) === e) {
          Z.state.pos++;
          break;
        }
        Z.state.pos++;
      }
      de.finishToken.call(void 0, ve.TokenType.string);
    }
    function Cm() {
      let e;
      do {
        if (Z.state.pos > Z.input.length) {
          Pn.unexpected.call(void 0, 'Unexpectedly reached the end of input.');
          return;
        }
        e = Z.input.charCodeAt(++Z.state.pos);
      } while (Lu.IS_IDENTIFIER_CHAR[e] || e === Be.charCodes.dash);
      de.finishToken.call(void 0, ve.TokenType.jsxName);
    }
    function Da() {
      Ot();
    }
    function Fu(e) {
      if ((Da(), !de.eat.call(void 0, ve.TokenType.colon))) {
        Z.state.tokens[Z.state.tokens.length - 1].identifierRole = e;
        return;
      }
      Da();
    }
    function $u() {
      let e = Z.state.tokens.length;
      Fu(de.IdentifierRole.Access);
      let t = !1;
      for (; de.match.call(void 0, ve.TokenType.dot); ) (t = !0), Ot(), Da();
      if (!t) {
        let n = Z.state.tokens[e],
          o = Z.input.charCodeAt(n.start);
        o >= Be.charCodes.lowercaseA &&
          o <= Be.charCodes.lowercaseZ &&
          (n.identifierRole = null);
      }
    }
    function wm() {
      switch (Z.state.type) {
        case ve.TokenType.braceL:
          de.next.call(void 0), es.parseExpression.call(void 0), Ot();
          return;
        case ve.TokenType.jsxTagStart:
          ju(), Ot();
          return;
        case ve.TokenType.string:
          Ot();
          return;
        default:
          Pn.unexpected.call(
            void 0,
            'JSX value should be either an expression or a quoted JSX text'
          );
      }
    }
    function Im() {
      Pn.expect.call(void 0, ve.TokenType.ellipsis),
        es.parseExpression.call(void 0);
    }
    function Sm(e) {
      if (de.match.call(void 0, ve.TokenType.jsxTagEnd)) return !1;
      $u(), Z.isTypeScriptEnabled && _m.tsTryParseJSXTypeArgument.call(void 0);
      let t = !1;
      for (
        ;
        !de.match.call(void 0, ve.TokenType.slash) &&
        !de.match.call(void 0, ve.TokenType.jsxTagEnd) &&
        !Z.state.error;

      ) {
        if (de.eat.call(void 0, ve.TokenType.braceL)) {
          (t = !0),
            Pn.expect.call(void 0, ve.TokenType.ellipsis),
            es.parseMaybeAssign.call(void 0),
            Ot();
          continue;
        }
        t &&
          Z.state.end - Z.state.start === 3 &&
          Z.input.charCodeAt(Z.state.start) === Be.charCodes.lowercaseK &&
          Z.input.charCodeAt(Z.state.start + 1) === Be.charCodes.lowercaseE &&
          Z.input.charCodeAt(Z.state.start + 2) === Be.charCodes.lowercaseY &&
          (Z.state.tokens[e].jsxRole = de.JSXRole.KeyAfterPropSpread),
          Fu(de.IdentifierRole.ObjectKey),
          de.match.call(void 0, ve.TokenType.eq) && (Ot(), wm());
      }
      let n = de.match.call(void 0, ve.TokenType.slash);
      return n && Ot(), n;
    }
    function bm() {
      de.match.call(void 0, ve.TokenType.jsxTagEnd) || $u();
    }
    function Bu() {
      let e = Z.state.tokens.length - 1;
      Z.state.tokens[e].jsxRole = de.JSXRole.NoChildren;
      let t = 0;
      if (!Sm(e))
        for (go(); ; )
          switch (Z.state.type) {
            case ve.TokenType.jsxTagStart:
              if ((Ot(), de.match.call(void 0, ve.TokenType.slash))) {
                Ot(),
                  bm(),
                  Z.state.tokens[e].jsxRole !== de.JSXRole.KeyAfterPropSpread &&
                    (t === 1
                      ? (Z.state.tokens[e].jsxRole = de.JSXRole.OneChild)
                      : t > 1 &&
                        (Z.state.tokens[e].jsxRole =
                          de.JSXRole.StaticChildren));
                return;
              }
              t++, Bu(), go();
              break;
            case ve.TokenType.jsxText:
              t++, go();
              break;
            case ve.TokenType.jsxEmptyText:
              go();
              break;
            case ve.TokenType.braceL:
              de.next.call(void 0),
                de.match.call(void 0, ve.TokenType.ellipsis)
                  ? (Im(), go(), (t += 2))
                  : (de.match.call(void 0, ve.TokenType.braceR) ||
                      (t++, es.parseExpression.call(void 0)),
                    go());
              break;
            default:
              Pn.unexpected.call(void 0);
              return;
          }
    }
    function ju() {
      Ot(), Bu();
    }
    ts.jsxParseElement = ju;
    function Ot() {
      Z.state.tokens.push(new de.Token()),
        de.skipSpace.call(void 0),
        (Z.state.start = Z.state.pos);
      let e = Z.input.charCodeAt(Z.state.pos);
      if (Lu.IS_IDENTIFIER_START[e]) Cm();
      else if (
        e === Be.charCodes.quotationMark ||
        e === Be.charCodes.apostrophe
      )
        gm(e);
      else
        switch ((++Z.state.pos, e)) {
          case Be.charCodes.greaterThan:
            de.finishToken.call(void 0, ve.TokenType.jsxTagEnd);
            break;
          case Be.charCodes.lessThan:
            de.finishToken.call(void 0, ve.TokenType.jsxTagStart);
            break;
          case Be.charCodes.slash:
            de.finishToken.call(void 0, ve.TokenType.slash);
            break;
          case Be.charCodes.equalsTo:
            de.finishToken.call(void 0, ve.TokenType.eq);
            break;
          case Be.charCodes.leftCurlyBrace:
            de.finishToken.call(void 0, ve.TokenType.braceL);
            break;
          case Be.charCodes.dot:
            de.finishToken.call(void 0, ve.TokenType.dot);
            break;
          case Be.charCodes.colon:
            de.finishToken.call(void 0, ve.TokenType.colon);
            break;
          default:
            Pn.unexpected.call(void 0);
        }
    }
    ts.nextJSXTagToken = Ot;
    function go() {
      Z.state.tokens.push(new de.Token()), (Z.state.start = Z.state.pos), xm();
    }
  });
  var qu = H((os) => {
    'use strict';
    Object.defineProperty(os, '__esModule', {value: !0});
    var ns = Ve(),
      Co = ce(),
      Ku = Ct(),
      Em = Xn(),
      Am = Vo(),
      Pm = mo();
    function Rm(e) {
      if (ns.match.call(void 0, Co.TokenType.question)) {
        let t = ns.lookaheadType.call(void 0);
        if (
          t === Co.TokenType.colon ||
          t === Co.TokenType.comma ||
          t === Co.TokenType.parenR
        )
          return;
      }
      Em.baseParseConditional.call(void 0, e);
    }
    os.typedParseConditional = Rm;
    function Nm() {
      ns.eatTypeToken.call(void 0, Co.TokenType.question),
        ns.match.call(void 0, Co.TokenType.colon) &&
          (Ku.isTypeScriptEnabled
            ? Pm.tsParseTypeAnnotation.call(void 0)
            : Ku.isFlowEnabled && Am.flowParseTypeAnnotation.call(void 0));
    }
    os.typedParseParenItem = Nm;
  });
  var Xn = H((Re) => {
    'use strict';
    Object.defineProperty(Re, '__esModule', {value: !0});
    var Tn = Vo(),
      Dm = Na(),
      Hu = qu(),
      Nn = mo(),
      E = Ve(),
      fn = Ge(),
      Uu = Pr(),
      C = ce(),
      Wu = gt(),
      Om = fo(),
      w = Ct(),
      Rn = Gr(),
      Ut = Jo(),
      fe = Sn(),
      is = class {
        constructor(t) {
          this.stop = t;
        }
      };
    Re.StopState = is;
    function Qo(e = !1) {
      if ((Mt(e), E.match.call(void 0, C.TokenType.comma)))
        for (; E.eat.call(void 0, C.TokenType.comma); ) Mt(e);
    }
    Re.parseExpression = Qo;
    function Mt(e = !1, t = !1) {
      return w.isTypeScriptEnabled
        ? Nn.tsParseMaybeAssign.call(void 0, e, t)
        : w.isFlowEnabled
        ? Tn.flowParseMaybeAssign.call(void 0, e, t)
        : Vu(e, t);
    }
    Re.parseMaybeAssign = Mt;
    function Vu(e, t) {
      if (E.match.call(void 0, C.TokenType._yield)) return Jm(), !1;
      (E.match.call(void 0, C.TokenType.parenL) ||
        E.match.call(void 0, C.TokenType.name) ||
        E.match.call(void 0, C.TokenType._yield)) &&
        (w.state.potentialArrowAt = w.state.start);
      let n = Mm(e);
      return (
        t && $a(),
        w.state.type & C.TokenType.IS_ASSIGN
          ? (E.next.call(void 0), Mt(e), !1)
          : n
      );
    }
    Re.baseParseMaybeAssign = Vu;
    function Mm(e) {
      return Fm(e) ? !0 : (Lm(e), !1);
    }
    function Lm(e) {
      w.isTypeScriptEnabled || w.isFlowEnabled
        ? Hu.typedParseConditional.call(void 0, e)
        : zu(e);
    }
    function zu(e) {
      E.eat.call(void 0, C.TokenType.question) &&
        (Mt(), fe.expect.call(void 0, C.TokenType.colon), Mt(e));
    }
    Re.baseParseConditional = zu;
    function Fm(e) {
      let t = w.state.tokens.length;
      return er() ? !0 : (rs(t, -1, e), !1);
    }
    function rs(e, t, n) {
      if (
        w.isTypeScriptEnabled &&
        (C.TokenType._in & C.TokenType.PRECEDENCE_MASK) > t &&
        !fe.hasPrecedingLineBreak.call(void 0) &&
        (fe.eatContextual.call(void 0, fn.ContextualKeyword._as) ||
          fe.eatContextual.call(void 0, fn.ContextualKeyword._satisfies))
      ) {
        let r = E.pushTypeContext.call(void 0, 1);
        Nn.tsParseType.call(void 0),
          E.popTypeContext.call(void 0, r),
          E.rescan_gt.call(void 0),
          rs(e, t, n);
        return;
      }
      let o = w.state.type & C.TokenType.PRECEDENCE_MASK;
      if (o > 0 && (!n || !E.match.call(void 0, C.TokenType._in)) && o > t) {
        let r = w.state.type;
        E.next.call(void 0),
          r === C.TokenType.nullishCoalescing &&
            (w.state.tokens[w.state.tokens.length - 1].nullishStartIndex = e);
        let s = w.state.tokens.length;
        er(),
          rs(s, r & C.TokenType.IS_RIGHT_ASSOCIATIVE ? o - 1 : o, n),
          r === C.TokenType.nullishCoalescing &&
            (w.state.tokens[e].numNullishCoalesceStarts++,
            w.state.tokens[w.state.tokens.length - 1].numNullishCoalesceEnds++),
          rs(e, t, n);
      }
    }
    function er() {
      if (
        w.isTypeScriptEnabled &&
        !w.isJSXEnabled &&
        E.eat.call(void 0, C.TokenType.lessThan)
      )
        return Nn.tsParseTypeAssertion.call(void 0), !1;
      if (
        fe.isContextual.call(void 0, fn.ContextualKeyword._module) &&
        E.lookaheadCharCode.call(void 0) === Wu.charCodes.leftCurlyBrace &&
        !fe.hasFollowingLineBreak.call(void 0)
      )
        return Qm(), !1;
      if (w.state.type & C.TokenType.IS_PREFIX)
        return E.next.call(void 0), er(), !1;
      if (Xu()) return !0;
      for (
        ;
        w.state.type & C.TokenType.IS_POSTFIX &&
        !fe.canInsertSemicolon.call(void 0);

      )
        w.state.type === C.TokenType.preIncDec &&
          (w.state.type = C.TokenType.postIncDec),
          E.next.call(void 0);
      return !1;
    }
    Re.parseMaybeUnary = er;
    function Xu() {
      let e = w.state.tokens.length;
      return cs()
        ? !0
        : (La(e),
          w.state.tokens.length > e &&
            w.state.tokens[e].isOptionalChainStart &&
            (w.state.tokens[w.state.tokens.length - 1].isOptionalChainEnd = !0),
          !1);
    }
    Re.parseExprSubscripts = Xu;
    function La(e, t = !1) {
      w.isFlowEnabled ? Tn.flowParseSubscripts.call(void 0, e, t) : Yu(e, t);
    }
    function Yu(e, t = !1) {
      let n = new is(!1);
      do $m(e, t, n);
      while (!n.stop && !w.state.error);
    }
    Re.baseParseSubscripts = Yu;
    function $m(e, t, n) {
      w.isTypeScriptEnabled
        ? Nn.tsParseSubscript.call(void 0, e, t, n)
        : w.isFlowEnabled
        ? Tn.flowParseSubscript.call(void 0, e, t, n)
        : Gu(e, t, n);
    }
    function Gu(e, t, n) {
      if (!t && E.eat.call(void 0, C.TokenType.doubleColon))
        Fa(), (n.stop = !0), La(e, t);
      else if (E.match.call(void 0, C.TokenType.questionDot)) {
        if (
          ((w.state.tokens[e].isOptionalChainStart = !0),
          t && E.lookaheadType.call(void 0) === C.TokenType.parenL)
        ) {
          n.stop = !0;
          return;
        }
        E.next.call(void 0),
          (w.state.tokens[w.state.tokens.length - 1].subscriptStartIndex = e),
          E.eat.call(void 0, C.TokenType.bracketL)
            ? (Qo(), fe.expect.call(void 0, C.TokenType.bracketR))
            : E.eat.call(void 0, C.TokenType.parenL)
            ? ss()
            : as();
      } else if (E.eat.call(void 0, C.TokenType.dot))
        (w.state.tokens[w.state.tokens.length - 1].subscriptStartIndex = e),
          as();
      else if (E.eat.call(void 0, C.TokenType.bracketL))
        (w.state.tokens[w.state.tokens.length - 1].subscriptStartIndex = e),
          Qo(),
          fe.expect.call(void 0, C.TokenType.bracketR);
      else if (!t && E.match.call(void 0, C.TokenType.parenL))
        if (Ju()) {
          let o = w.state.snapshot(),
            r = w.state.tokens.length;
          E.next.call(void 0),
            (w.state.tokens[w.state.tokens.length - 1].subscriptStartIndex = e);
          let s = w.getNextContextId.call(void 0);
          (w.state.tokens[w.state.tokens.length - 1].contextId = s),
            ss(),
            (w.state.tokens[w.state.tokens.length - 1].contextId = s),
            Bm() &&
              (w.state.restoreFromSnapshot(o),
              (n.stop = !0),
              w.state.scopeDepth++,
              Ut.parseFunctionParams.call(void 0),
              jm(r));
        } else {
          E.next.call(void 0),
            (w.state.tokens[w.state.tokens.length - 1].subscriptStartIndex = e);
          let o = w.getNextContextId.call(void 0);
          (w.state.tokens[w.state.tokens.length - 1].contextId = o),
            ss(),
            (w.state.tokens[w.state.tokens.length - 1].contextId = o);
        }
      else E.match.call(void 0, C.TokenType.backQuote) ? Ba() : (n.stop = !0);
    }
    Re.baseParseSubscript = Gu;
    function Ju() {
      return (
        w.state.tokens[w.state.tokens.length - 1].contextualKeyword ===
          fn.ContextualKeyword._async && !fe.canInsertSemicolon.call(void 0)
      );
    }
    Re.atPossibleAsync = Ju;
    function ss() {
      let e = !0;
      for (; !E.eat.call(void 0, C.TokenType.parenR) && !w.state.error; ) {
        if (e) e = !1;
        else if (
          (fe.expect.call(void 0, C.TokenType.comma),
          E.eat.call(void 0, C.TokenType.parenR))
        )
          break;
        op(!1);
      }
    }
    Re.parseCallExpressionArguments = ss;
    function Bm() {
      return (
        E.match.call(void 0, C.TokenType.colon) ||
        E.match.call(void 0, C.TokenType.arrow)
      );
    }
    function jm(e) {
      w.isTypeScriptEnabled
        ? Nn.tsStartParseAsyncArrowFromCallExpression.call(void 0)
        : w.isFlowEnabled &&
          Tn.flowStartParseAsyncArrowFromCallExpression.call(void 0),
        fe.expect.call(void 0, C.TokenType.arrow),
        Zo(e);
    }
    function Fa() {
      let e = w.state.tokens.length;
      cs(), La(e, !0);
    }
    function cs() {
      if (E.eat.call(void 0, C.TokenType.modulo)) return hn(), !1;
      if (
        E.match.call(void 0, C.TokenType.jsxText) ||
        E.match.call(void 0, C.TokenType.jsxEmptyText)
      )
        return Qu(), !1;
      if (E.match.call(void 0, C.TokenType.lessThan) && w.isJSXEnabled)
        return (
          (w.state.type = C.TokenType.jsxTagStart),
          Dm.jsxParseElement.call(void 0),
          E.next.call(void 0),
          !1
        );
      let e = w.state.potentialArrowAt === w.state.start;
      switch (w.state.type) {
        case C.TokenType.slash:
        case C.TokenType.assign:
          E.retokenizeSlashAsRegex.call(void 0);
        case C.TokenType._super:
        case C.TokenType._this:
        case C.TokenType.regexp:
        case C.TokenType.num:
        case C.TokenType.bigint:
        case C.TokenType.decimal:
        case C.TokenType.string:
        case C.TokenType._null:
        case C.TokenType._true:
        case C.TokenType._false:
          return E.next.call(void 0), !1;
        case C.TokenType._import:
          return (
            E.next.call(void 0),
            E.match.call(void 0, C.TokenType.dot) &&
              ((w.state.tokens[w.state.tokens.length - 1].type =
                C.TokenType.name),
              E.next.call(void 0),
              hn()),
            !1
          );
        case C.TokenType.name: {
          let t = w.state.tokens.length,
            n = w.state.start,
            o = w.state.contextualKeyword;
          return (
            hn(),
            o === fn.ContextualKeyword._await
              ? (Gm(), !1)
              : o === fn.ContextualKeyword._async &&
                E.match.call(void 0, C.TokenType._function) &&
                !fe.canInsertSemicolon.call(void 0)
              ? (E.next.call(void 0), Ut.parseFunction.call(void 0, n, !1), !1)
              : e &&
                o === fn.ContextualKeyword._async &&
                !fe.canInsertSemicolon.call(void 0) &&
                E.match.call(void 0, C.TokenType.name)
              ? (w.state.scopeDepth++,
                Rn.parseBindingIdentifier.call(void 0, !1),
                fe.expect.call(void 0, C.TokenType.arrow),
                Zo(t),
                !0)
              : E.match.call(void 0, C.TokenType._do) &&
                !fe.canInsertSemicolon.call(void 0)
              ? (E.next.call(void 0), Ut.parseBlock.call(void 0), !1)
              : e &&
                !fe.canInsertSemicolon.call(void 0) &&
                E.match.call(void 0, C.TokenType.arrow)
              ? (w.state.scopeDepth++,
                Rn.markPriorBindingIdentifier.call(void 0, !1),
                fe.expect.call(void 0, C.TokenType.arrow),
                Zo(t),
                !0)
              : ((w.state.tokens[w.state.tokens.length - 1].identifierRole =
                  E.IdentifierRole.Access),
                !1)
          );
        }
        case C.TokenType._do:
          return E.next.call(void 0), Ut.parseBlock.call(void 0), !1;
        case C.TokenType.parenL:
          return Zu(e);
        case C.TokenType.bracketL:
          return E.next.call(void 0), np(C.TokenType.bracketR, !0), !1;
        case C.TokenType.braceL:
          return ep(!1, !1), !1;
        case C.TokenType._function:
          return Km(), !1;
        case C.TokenType.at:
          Ut.parseDecorators.call(void 0);
        case C.TokenType._class:
          return Ut.parseClass.call(void 0, !1), !1;
        case C.TokenType._new:
          return Um(), !1;
        case C.TokenType.backQuote:
          return Ba(), !1;
        case C.TokenType.doubleColon:
          return E.next.call(void 0), Fa(), !1;
        case C.TokenType.hash: {
          let t = E.lookaheadCharCode.call(void 0);
          return (
            Om.IS_IDENTIFIER_START[t] || t === Wu.charCodes.backslash
              ? as()
              : E.next.call(void 0),
            !1
          );
        }
        default:
          return fe.unexpected.call(void 0), !1;
      }
    }
    Re.parseExprAtom = cs;
    function as() {
      E.eat.call(void 0, C.TokenType.hash), hn();
    }
    function Km() {
      let e = w.state.start;
      hn(),
        E.eat.call(void 0, C.TokenType.dot) && hn(),
        Ut.parseFunction.call(void 0, e, !1);
    }
    function Qu() {
      E.next.call(void 0);
    }
    Re.parseLiteral = Qu;
    function qm() {
      fe.expect.call(void 0, C.TokenType.parenL),
        Qo(),
        fe.expect.call(void 0, C.TokenType.parenR);
    }
    Re.parseParenExpression = qm;
    function Zu(e) {
      let t = w.state.snapshot(),
        n = w.state.tokens.length;
      fe.expect.call(void 0, C.TokenType.parenL);
      let o = !0;
      for (; !E.match.call(void 0, C.TokenType.parenR) && !w.state.error; ) {
        if (o) o = !1;
        else if (
          (fe.expect.call(void 0, C.TokenType.comma),
          E.match.call(void 0, C.TokenType.parenR))
        )
          break;
        if (E.match.call(void 0, C.TokenType.ellipsis)) {
          Rn.parseRest.call(void 0, !1), $a();
          break;
        } else Mt(!1, !0);
      }
      return (
        fe.expect.call(void 0, C.TokenType.parenR),
        e && Hm() && Oa()
          ? (w.state.restoreFromSnapshot(t),
            w.state.scopeDepth++,
            Ut.parseFunctionParams.call(void 0),
            Oa(),
            Zo(n),
            w.state.error ? (w.state.restoreFromSnapshot(t), Zu(!1), !1) : !0)
          : !1
      );
    }
    function Hm() {
      return (
        E.match.call(void 0, C.TokenType.colon) ||
        !fe.canInsertSemicolon.call(void 0)
      );
    }
    function Oa() {
      return w.isTypeScriptEnabled
        ? Nn.tsParseArrow.call(void 0)
        : w.isFlowEnabled
        ? Tn.flowParseArrow.call(void 0)
        : E.eat.call(void 0, C.TokenType.arrow);
    }
    Re.parseArrow = Oa;
    function $a() {
      (w.isTypeScriptEnabled || w.isFlowEnabled) &&
        Hu.typedParseParenItem.call(void 0);
    }
    function Um() {
      if (
        (fe.expect.call(void 0, C.TokenType._new),
        E.eat.call(void 0, C.TokenType.dot))
      ) {
        hn();
        return;
      }
      Wm(),
        w.isFlowEnabled && Tn.flowStartParseNewArguments.call(void 0),
        E.eat.call(void 0, C.TokenType.parenL) && np(C.TokenType.parenR);
    }
    function Wm() {
      Fa(), E.eat.call(void 0, C.TokenType.questionDot);
    }
    function Ba() {
      for (
        E.nextTemplateToken.call(void 0), E.nextTemplateToken.call(void 0);
        !E.match.call(void 0, C.TokenType.backQuote) && !w.state.error;

      )
        fe.expect.call(void 0, C.TokenType.dollarBraceL),
          Qo(),
          E.nextTemplateToken.call(void 0),
          E.nextTemplateToken.call(void 0);
      E.next.call(void 0);
    }
    Re.parseTemplate = Ba;
    function ep(e, t) {
      let n = w.getNextContextId.call(void 0),
        o = !0;
      for (
        E.next.call(void 0),
          w.state.tokens[w.state.tokens.length - 1].contextId = n;
        !E.eat.call(void 0, C.TokenType.braceR) && !w.state.error;

      ) {
        if (o) o = !1;
        else if (
          (fe.expect.call(void 0, C.TokenType.comma),
          E.eat.call(void 0, C.TokenType.braceR))
        )
          break;
        let r = !1;
        if (E.match.call(void 0, C.TokenType.ellipsis)) {
          let s = w.state.tokens.length;
          if (
            (Rn.parseSpread.call(void 0),
            e &&
              (w.state.tokens.length === s + 2 &&
                Rn.markPriorBindingIdentifier.call(void 0, t),
              E.eat.call(void 0, C.TokenType.braceR)))
          )
            break;
          continue;
        }
        e || (r = E.eat.call(void 0, C.TokenType.star)),
          !e && fe.isContextual.call(void 0, fn.ContextualKeyword._async)
            ? (r && fe.unexpected.call(void 0),
              hn(),
              E.match.call(void 0, C.TokenType.colon) ||
                E.match.call(void 0, C.TokenType.parenL) ||
                E.match.call(void 0, C.TokenType.braceR) ||
                E.match.call(void 0, C.TokenType.eq) ||
                E.match.call(void 0, C.TokenType.comma) ||
                (E.match.call(void 0, C.TokenType.star) &&
                  (E.next.call(void 0), (r = !0)),
                ls(n)))
            : ls(n),
          Ym(e, t, n);
      }
      w.state.tokens[w.state.tokens.length - 1].contextId = n;
    }
    Re.parseObj = ep;
    function Vm(e) {
      return (
        !e &&
        (E.match.call(void 0, C.TokenType.string) ||
          E.match.call(void 0, C.TokenType.num) ||
          E.match.call(void 0, C.TokenType.bracketL) ||
          E.match.call(void 0, C.TokenType.name) ||
          !!(w.state.type & C.TokenType.IS_KEYWORD))
      );
    }
    function zm(e, t) {
      let n = w.state.start;
      return E.match.call(void 0, C.TokenType.parenL)
        ? (e && fe.unexpected.call(void 0), Ma(n, !1), !0)
        : Vm(e)
        ? (ls(t), Ma(n, !1), !0)
        : !1;
    }
    function Xm(e, t) {
      if (E.eat.call(void 0, C.TokenType.colon)) {
        e ? Rn.parseMaybeDefault.call(void 0, t) : Mt(!1);
        return;
      }
      let n;
      e
        ? w.state.scopeDepth === 0
          ? (n = E.IdentifierRole.ObjectShorthandTopLevelDeclaration)
          : t
          ? (n = E.IdentifierRole.ObjectShorthandBlockScopedDeclaration)
          : (n = E.IdentifierRole.ObjectShorthandFunctionScopedDeclaration)
        : (n = E.IdentifierRole.ObjectShorthand),
        (w.state.tokens[w.state.tokens.length - 1].identifierRole = n),
        Rn.parseMaybeDefault.call(void 0, t, !0);
    }
    function Ym(e, t, n) {
      w.isTypeScriptEnabled
        ? Nn.tsStartParseObjPropValue.call(void 0)
        : w.isFlowEnabled && Tn.flowStartParseObjPropValue.call(void 0),
        zm(e, n) || Xm(e, t);
    }
    function ls(e) {
      w.isFlowEnabled && Tn.flowParseVariance.call(void 0),
        E.eat.call(void 0, C.TokenType.bracketL)
          ? ((w.state.tokens[w.state.tokens.length - 1].contextId = e),
            Mt(),
            fe.expect.call(void 0, C.TokenType.bracketR),
            (w.state.tokens[w.state.tokens.length - 1].contextId = e))
          : (E.match.call(void 0, C.TokenType.num) ||
            E.match.call(void 0, C.TokenType.string) ||
            E.match.call(void 0, C.TokenType.bigint) ||
            E.match.call(void 0, C.TokenType.decimal)
              ? cs()
              : as(),
            (w.state.tokens[w.state.tokens.length - 1].identifierRole =
              E.IdentifierRole.ObjectKey),
            (w.state.tokens[w.state.tokens.length - 1].contextId = e));
    }
    Re.parsePropertyName = ls;
    function Ma(e, t) {
      let n = w.getNextContextId.call(void 0);
      w.state.scopeDepth++;
      let o = w.state.tokens.length,
        r = t;
      Ut.parseFunctionParams.call(void 0, r, n), tp(e, n);
      let s = w.state.tokens.length;
      w.state.scopes.push(new Uu.Scope(o, s, !0)), w.state.scopeDepth--;
    }
    Re.parseMethod = Ma;
    function Zo(e) {
      ja(!0);
      let t = w.state.tokens.length;
      w.state.scopes.push(new Uu.Scope(e, t, !0)), w.state.scopeDepth--;
    }
    Re.parseArrowExpression = Zo;
    function tp(e, t = 0) {
      w.isTypeScriptEnabled
        ? Nn.tsParseFunctionBodyAndFinish.call(void 0, e, t)
        : w.isFlowEnabled
        ? Tn.flowParseFunctionBodyAndFinish.call(void 0, t)
        : ja(!1, t);
    }
    Re.parseFunctionBodyAndFinish = tp;
    function ja(e, t = 0) {
      e && !E.match.call(void 0, C.TokenType.braceL)
        ? Mt()
        : Ut.parseBlock.call(void 0, !0, t);
    }
    Re.parseFunctionBody = ja;
    function np(e, t = !1) {
      let n = !0;
      for (; !E.eat.call(void 0, e) && !w.state.error; ) {
        if (n) n = !1;
        else if (
          (fe.expect.call(void 0, C.TokenType.comma), E.eat.call(void 0, e))
        )
          break;
        op(t);
      }
    }
    function op(e) {
      (e && E.match.call(void 0, C.TokenType.comma)) ||
        (E.match.call(void 0, C.TokenType.ellipsis)
          ? (Rn.parseSpread.call(void 0), $a())
          : E.match.call(void 0, C.TokenType.question)
          ? E.next.call(void 0)
          : Mt(!1, !0));
    }
    function hn() {
      E.next.call(void 0),
        (w.state.tokens[w.state.tokens.length - 1].type = C.TokenType.name);
    }
    Re.parseIdentifier = hn;
    function Gm() {
      er();
    }
    function Jm() {
      E.next.call(void 0),
        !E.match.call(void 0, C.TokenType.semi) &&
          !fe.canInsertSemicolon.call(void 0) &&
          (E.eat.call(void 0, C.TokenType.star), Mt());
    }
    function Qm() {
      fe.expectContextual.call(void 0, fn.ContextualKeyword._module),
        fe.expect.call(void 0, C.TokenType.braceL),
        Ut.parseBlockBody.call(void 0, C.TokenType.braceR);
    }
  });
  var Vo = H((Ae) => {
    'use strict';
    Object.defineProperty(Ae, '__esModule', {value: !0});
    var f = Ve(),
      te = Ge(),
      p = ce(),
      J = Ct(),
      Ie = Xn(),
      Dn = Jo(),
      N = Sn();
    function Zm(e) {
      return (
        (e.type === p.TokenType.name || !!(e.type & p.TokenType.IS_KEYWORD)) &&
        e.contextualKeyword !== te.ContextualKeyword._from
      );
    }
    function tn(e) {
      let t = f.pushTypeContext.call(void 0, 0);
      N.expect.call(void 0, e || p.TokenType.colon),
        Tt(),
        f.popTypeContext.call(void 0, t);
    }
    function rp() {
      N.expect.call(void 0, p.TokenType.modulo),
        N.expectContextual.call(void 0, te.ContextualKeyword._checks),
        f.eat.call(void 0, p.TokenType.parenL) &&
          (Ie.parseExpression.call(void 0),
          N.expect.call(void 0, p.TokenType.parenR));
    }
    function Ha() {
      let e = f.pushTypeContext.call(void 0, 0);
      N.expect.call(void 0, p.TokenType.colon),
        f.match.call(void 0, p.TokenType.modulo)
          ? rp()
          : (Tt(), f.match.call(void 0, p.TokenType.modulo) && rp()),
        f.popTypeContext.call(void 0, e);
    }
    function ek() {
      f.next.call(void 0), Ua(!0);
    }
    function tk() {
      f.next.call(void 0),
        Ie.parseIdentifier.call(void 0),
        f.match.call(void 0, p.TokenType.lessThan) && nn(),
        N.expect.call(void 0, p.TokenType.parenL),
        qa(),
        N.expect.call(void 0, p.TokenType.parenR),
        Ha(),
        N.semicolon.call(void 0);
    }
    function Ka() {
      f.match.call(void 0, p.TokenType._class)
        ? ek()
        : f.match.call(void 0, p.TokenType._function)
        ? tk()
        : f.match.call(void 0, p.TokenType._var)
        ? nk()
        : N.eatContextual.call(void 0, te.ContextualKeyword._module)
        ? f.eat.call(void 0, p.TokenType.dot)
          ? sk()
          : ok()
        : N.isContextual.call(void 0, te.ContextualKeyword._type)
        ? ik()
        : N.isContextual.call(void 0, te.ContextualKeyword._opaque)
        ? ak()
        : N.isContextual.call(void 0, te.ContextualKeyword._interface)
        ? lk()
        : f.match.call(void 0, p.TokenType._export)
        ? rk()
        : N.unexpected.call(void 0);
    }
    function nk() {
      f.next.call(void 0), up(), N.semicolon.call(void 0);
    }
    function ok() {
      for (
        f.match.call(void 0, p.TokenType.string)
          ? Ie.parseExprAtom.call(void 0)
          : Ie.parseIdentifier.call(void 0),
          N.expect.call(void 0, p.TokenType.braceL);
        !f.match.call(void 0, p.TokenType.braceR) && !J.state.error;

      )
        f.match.call(void 0, p.TokenType._import)
          ? (f.next.call(void 0), Dn.parseImport.call(void 0))
          : N.unexpected.call(void 0);
      N.expect.call(void 0, p.TokenType.braceR);
    }
    function rk() {
      N.expect.call(void 0, p.TokenType._export),
        f.eat.call(void 0, p.TokenType._default)
          ? f.match.call(void 0, p.TokenType._function) ||
            f.match.call(void 0, p.TokenType._class)
            ? Ka()
            : (Tt(), N.semicolon.call(void 0))
          : f.match.call(void 0, p.TokenType._var) ||
            f.match.call(void 0, p.TokenType._function) ||
            f.match.call(void 0, p.TokenType._class) ||
            N.isContextual.call(void 0, te.ContextualKeyword._opaque)
          ? Ka()
          : f.match.call(void 0, p.TokenType.star) ||
            f.match.call(void 0, p.TokenType.braceL) ||
            N.isContextual.call(void 0, te.ContextualKeyword._interface) ||
            N.isContextual.call(void 0, te.ContextualKeyword._type) ||
            N.isContextual.call(void 0, te.ContextualKeyword._opaque)
          ? Dn.parseExport.call(void 0)
          : N.unexpected.call(void 0);
    }
    function sk() {
      N.expectContextual.call(void 0, te.ContextualKeyword._exports),
        wo(),
        N.semicolon.call(void 0);
    }
    function ik() {
      f.next.call(void 0), Va();
    }
    function ak() {
      f.next.call(void 0), za(!0);
    }
    function lk() {
      f.next.call(void 0), Ua();
    }
    function Ua(e = !1) {
      if (
        (fs(),
        f.match.call(void 0, p.TokenType.lessThan) && nn(),
        f.eat.call(void 0, p.TokenType._extends))
      )
        do us();
        while (!e && f.eat.call(void 0, p.TokenType.comma));
      if (N.isContextual.call(void 0, te.ContextualKeyword._mixins)) {
        f.next.call(void 0);
        do us();
        while (f.eat.call(void 0, p.TokenType.comma));
      }
      if (N.isContextual.call(void 0, te.ContextualKeyword._implements)) {
        f.next.call(void 0);
        do us();
        while (f.eat.call(void 0, p.TokenType.comma));
      }
      ps(e, !1, e);
    }
    function us() {
      ap(!1), f.match.call(void 0, p.TokenType.lessThan) && Yn();
    }
    function Wa() {
      Ua();
    }
    function fs() {
      Ie.parseIdentifier.call(void 0);
    }
    function Va() {
      fs(),
        f.match.call(void 0, p.TokenType.lessThan) && nn(),
        tn(p.TokenType.eq),
        N.semicolon.call(void 0);
    }
    function za(e) {
      N.expectContextual.call(void 0, te.ContextualKeyword._type),
        fs(),
        f.match.call(void 0, p.TokenType.lessThan) && nn(),
        f.match.call(void 0, p.TokenType.colon) && tn(p.TokenType.colon),
        e || tn(p.TokenType.eq),
        N.semicolon.call(void 0);
    }
    function ck() {
      Ga(), up(), f.eat.call(void 0, p.TokenType.eq) && Tt();
    }
    function nn() {
      let e = f.pushTypeContext.call(void 0, 0);
      f.match.call(void 0, p.TokenType.lessThan) ||
      f.match.call(void 0, p.TokenType.typeParameterStart)
        ? f.next.call(void 0)
        : N.unexpected.call(void 0);
      do
        ck(),
          f.match.call(void 0, p.TokenType.greaterThan) ||
            N.expect.call(void 0, p.TokenType.comma);
      while (!f.match.call(void 0, p.TokenType.greaterThan) && !J.state.error);
      N.expect.call(void 0, p.TokenType.greaterThan),
        f.popTypeContext.call(void 0, e);
    }
    Ae.flowParseTypeParameterDeclaration = nn;
    function Yn() {
      let e = f.pushTypeContext.call(void 0, 0);
      for (
        N.expect.call(void 0, p.TokenType.lessThan);
        !f.match.call(void 0, p.TokenType.greaterThan) && !J.state.error;

      )
        Tt(),
          f.match.call(void 0, p.TokenType.greaterThan) ||
            N.expect.call(void 0, p.TokenType.comma);
      N.expect.call(void 0, p.TokenType.greaterThan),
        f.popTypeContext.call(void 0, e);
    }
    function uk() {
      if (
        (N.expectContextual.call(void 0, te.ContextualKeyword._interface),
        f.eat.call(void 0, p.TokenType._extends))
      )
        do us();
        while (f.eat.call(void 0, p.TokenType.comma));
      ps(!1, !1, !1);
    }
    function Xa() {
      f.match.call(void 0, p.TokenType.num) ||
      f.match.call(void 0, p.TokenType.string)
        ? Ie.parseExprAtom.call(void 0)
        : Ie.parseIdentifier.call(void 0);
    }
    function pk() {
      f.lookaheadType.call(void 0) === p.TokenType.colon ? (Xa(), tn()) : Tt(),
        N.expect.call(void 0, p.TokenType.bracketR),
        tn();
    }
    function dk() {
      Xa(),
        N.expect.call(void 0, p.TokenType.bracketR),
        N.expect.call(void 0, p.TokenType.bracketR),
        f.match.call(void 0, p.TokenType.lessThan) ||
        f.match.call(void 0, p.TokenType.parenL)
          ? Ya()
          : (f.eat.call(void 0, p.TokenType.question), tn());
    }
    function Ya() {
      for (
        f.match.call(void 0, p.TokenType.lessThan) && nn(),
          N.expect.call(void 0, p.TokenType.parenL);
        !f.match.call(void 0, p.TokenType.parenR) &&
        !f.match.call(void 0, p.TokenType.ellipsis) &&
        !J.state.error;

      )
        ds(),
          f.match.call(void 0, p.TokenType.parenR) ||
            N.expect.call(void 0, p.TokenType.comma);
      f.eat.call(void 0, p.TokenType.ellipsis) && ds(),
        N.expect.call(void 0, p.TokenType.parenR),
        tn();
    }
    function fk() {
      Ya();
    }
    function ps(e, t, n) {
      let o;
      for (
        t && f.match.call(void 0, p.TokenType.braceBarL)
          ? (N.expect.call(void 0, p.TokenType.braceBarL),
            (o = p.TokenType.braceBarR))
          : (N.expect.call(void 0, p.TokenType.braceL),
            (o = p.TokenType.braceR));
        !f.match.call(void 0, o) && !J.state.error;

      ) {
        if (n && N.isContextual.call(void 0, te.ContextualKeyword._proto)) {
          let r = f.lookaheadType.call(void 0);
          r !== p.TokenType.colon &&
            r !== p.TokenType.question &&
            (f.next.call(void 0), (e = !1));
        }
        if (e && N.isContextual.call(void 0, te.ContextualKeyword._static)) {
          let r = f.lookaheadType.call(void 0);
          r !== p.TokenType.colon &&
            r !== p.TokenType.question &&
            f.next.call(void 0);
        }
        if ((Ga(), f.eat.call(void 0, p.TokenType.bracketL)))
          f.eat.call(void 0, p.TokenType.bracketL) ? dk() : pk();
        else if (
          f.match.call(void 0, p.TokenType.parenL) ||
          f.match.call(void 0, p.TokenType.lessThan)
        )
          fk();
        else {
          if (
            N.isContextual.call(void 0, te.ContextualKeyword._get) ||
            N.isContextual.call(void 0, te.ContextualKeyword._set)
          ) {
            let r = f.lookaheadType.call(void 0);
            (r === p.TokenType.name ||
              r === p.TokenType.string ||
              r === p.TokenType.num) &&
              f.next.call(void 0);
          }
          hk();
        }
        Tk();
      }
      N.expect.call(void 0, o);
    }
    function hk() {
      if (f.match.call(void 0, p.TokenType.ellipsis)) {
        if (
          (N.expect.call(void 0, p.TokenType.ellipsis),
          f.eat.call(void 0, p.TokenType.comma) ||
            f.eat.call(void 0, p.TokenType.semi),
          f.match.call(void 0, p.TokenType.braceR))
        )
          return;
        Tt();
      } else
        Xa(),
          f.match.call(void 0, p.TokenType.lessThan) ||
          f.match.call(void 0, p.TokenType.parenL)
            ? Ya()
            : (f.eat.call(void 0, p.TokenType.question), tn());
    }
    function Tk() {
      !f.eat.call(void 0, p.TokenType.semi) &&
        !f.eat.call(void 0, p.TokenType.comma) &&
        !f.match.call(void 0, p.TokenType.braceR) &&
        !f.match.call(void 0, p.TokenType.braceBarR) &&
        N.unexpected.call(void 0);
    }
    function ap(e) {
      for (
        e || Ie.parseIdentifier.call(void 0);
        f.eat.call(void 0, p.TokenType.dot);

      )
        Ie.parseIdentifier.call(void 0);
    }
    function yk() {
      ap(!0), f.match.call(void 0, p.TokenType.lessThan) && Yn();
    }
    function mk() {
      N.expect.call(void 0, p.TokenType._typeof), lp();
    }
    function kk() {
      for (
        N.expect.call(void 0, p.TokenType.bracketL);
        J.state.pos < J.input.length &&
        !f.match.call(void 0, p.TokenType.bracketR) &&
        (Tt(), !f.match.call(void 0, p.TokenType.bracketR));

      )
        N.expect.call(void 0, p.TokenType.comma);
      N.expect.call(void 0, p.TokenType.bracketR);
    }
    function ds() {
      let e = f.lookaheadType.call(void 0);
      e === p.TokenType.colon || e === p.TokenType.question
        ? (Ie.parseIdentifier.call(void 0),
          f.eat.call(void 0, p.TokenType.question),
          tn())
        : Tt();
    }
    function qa() {
      for (
        ;
        !f.match.call(void 0, p.TokenType.parenR) &&
        !f.match.call(void 0, p.TokenType.ellipsis) &&
        !J.state.error;

      )
        ds(),
          f.match.call(void 0, p.TokenType.parenR) ||
            N.expect.call(void 0, p.TokenType.comma);
      f.eat.call(void 0, p.TokenType.ellipsis) && ds();
    }
    function lp() {
      let e = !1,
        t = J.state.noAnonFunctionType;
      switch (J.state.type) {
        case p.TokenType.name: {
          if (N.isContextual.call(void 0, te.ContextualKeyword._interface)) {
            uk();
            return;
          }
          Ie.parseIdentifier.call(void 0), yk();
          return;
        }
        case p.TokenType.braceL:
          ps(!1, !1, !1);
          return;
        case p.TokenType.braceBarL:
          ps(!1, !0, !1);
          return;
        case p.TokenType.bracketL:
          kk();
          return;
        case p.TokenType.lessThan:
          nn(),
            N.expect.call(void 0, p.TokenType.parenL),
            qa(),
            N.expect.call(void 0, p.TokenType.parenR),
            N.expect.call(void 0, p.TokenType.arrow),
            Tt();
          return;
        case p.TokenType.parenL:
          if (
            (f.next.call(void 0),
            !f.match.call(void 0, p.TokenType.parenR) &&
              !f.match.call(void 0, p.TokenType.ellipsis))
          )
            if (f.match.call(void 0, p.TokenType.name)) {
              let n = f.lookaheadType.call(void 0);
              e = n !== p.TokenType.question && n !== p.TokenType.colon;
            } else e = !0;
          if (e)
            if (
              ((J.state.noAnonFunctionType = !1),
              Tt(),
              (J.state.noAnonFunctionType = t),
              J.state.noAnonFunctionType ||
                !(
                  f.match.call(void 0, p.TokenType.comma) ||
                  (f.match.call(void 0, p.TokenType.parenR) &&
                    f.lookaheadType.call(void 0) === p.TokenType.arrow)
                ))
            ) {
              N.expect.call(void 0, p.TokenType.parenR);
              return;
            } else f.eat.call(void 0, p.TokenType.comma);
          qa(),
            N.expect.call(void 0, p.TokenType.parenR),
            N.expect.call(void 0, p.TokenType.arrow),
            Tt();
          return;
        case p.TokenType.minus:
          f.next.call(void 0), Ie.parseLiteral.call(void 0);
          return;
        case p.TokenType.string:
        case p.TokenType.num:
        case p.TokenType._true:
        case p.TokenType._false:
        case p.TokenType._null:
        case p.TokenType._this:
        case p.TokenType._void:
        case p.TokenType.star:
          f.next.call(void 0);
          return;
        default:
          if (J.state.type === p.TokenType._typeof) {
            mk();
            return;
          } else if (J.state.type & p.TokenType.IS_KEYWORD) {
            f.next.call(void 0),
              (J.state.tokens[J.state.tokens.length - 1].type =
                p.TokenType.name);
            return;
          }
      }
      N.unexpected.call(void 0);
    }
    function vk() {
      for (
        lp();
        !N.canInsertSemicolon.call(void 0) &&
        (f.match.call(void 0, p.TokenType.bracketL) ||
          f.match.call(void 0, p.TokenType.questionDot));

      )
        f.eat.call(void 0, p.TokenType.questionDot),
          N.expect.call(void 0, p.TokenType.bracketL),
          f.eat.call(void 0, p.TokenType.bracketR) ||
            (Tt(), N.expect.call(void 0, p.TokenType.bracketR));
    }
    function cp() {
      f.eat.call(void 0, p.TokenType.question) ? cp() : vk();
    }
    function sp() {
      cp(),
        !J.state.noAnonFunctionType &&
          f.eat.call(void 0, p.TokenType.arrow) &&
          Tt();
    }
    function ip() {
      for (
        f.eat.call(void 0, p.TokenType.bitwiseAND), sp();
        f.eat.call(void 0, p.TokenType.bitwiseAND);

      )
        sp();
    }
    function _k() {
      for (
        f.eat.call(void 0, p.TokenType.bitwiseOR), ip();
        f.eat.call(void 0, p.TokenType.bitwiseOR);

      )
        ip();
    }
    function Tt() {
      _k();
    }
    function wo() {
      tn();
    }
    Ae.flowParseTypeAnnotation = wo;
    function up() {
      Ie.parseIdentifier.call(void 0),
        f.match.call(void 0, p.TokenType.colon) && wo();
    }
    function Ga() {
      (f.match.call(void 0, p.TokenType.plus) ||
        f.match.call(void 0, p.TokenType.minus)) &&
        (f.next.call(void 0),
        (J.state.tokens[J.state.tokens.length - 1].isType = !0));
    }
    Ae.flowParseVariance = Ga;
    function xk(e) {
      f.match.call(void 0, p.TokenType.colon) && Ha(),
        Ie.parseFunctionBody.call(void 0, !1, e);
    }
    Ae.flowParseFunctionBodyAndFinish = xk;
    function gk(e, t, n) {
      if (
        f.match.call(void 0, p.TokenType.questionDot) &&
        f.lookaheadType.call(void 0) === p.TokenType.lessThan
      ) {
        if (t) {
          n.stop = !0;
          return;
        }
        f.next.call(void 0),
          Yn(),
          N.expect.call(void 0, p.TokenType.parenL),
          Ie.parseCallExpressionArguments.call(void 0);
        return;
      } else if (!t && f.match.call(void 0, p.TokenType.lessThan)) {
        let o = J.state.snapshot();
        if (
          (Yn(),
          N.expect.call(void 0, p.TokenType.parenL),
          Ie.parseCallExpressionArguments.call(void 0),
          J.state.error)
        )
          J.state.restoreFromSnapshot(o);
        else return;
      }
      Ie.baseParseSubscript.call(void 0, e, t, n);
    }
    Ae.flowParseSubscript = gk;
    function Ck() {
      if (f.match.call(void 0, p.TokenType.lessThan)) {
        let e = J.state.snapshot();
        Yn(), J.state.error && J.state.restoreFromSnapshot(e);
      }
    }
    Ae.flowStartParseNewArguments = Ck;
    function wk() {
      if (
        f.match.call(void 0, p.TokenType.name) &&
        J.state.contextualKeyword === te.ContextualKeyword._interface
      ) {
        let e = f.pushTypeContext.call(void 0, 0);
        return f.next.call(void 0), Wa(), f.popTypeContext.call(void 0, e), !0;
      } else if (N.isContextual.call(void 0, te.ContextualKeyword._enum))
        return pp(), !0;
      return !1;
    }
    Ae.flowTryParseStatement = wk;
    function Ik() {
      return N.isContextual.call(void 0, te.ContextualKeyword._enum)
        ? (pp(), !0)
        : !1;
    }
    Ae.flowTryParseExportDefaultExpression = Ik;
    function Sk(e) {
      if (e === te.ContextualKeyword._declare) {
        if (
          f.match.call(void 0, p.TokenType._class) ||
          f.match.call(void 0, p.TokenType.name) ||
          f.match.call(void 0, p.TokenType._function) ||
          f.match.call(void 0, p.TokenType._var) ||
          f.match.call(void 0, p.TokenType._export)
        ) {
          let t = f.pushTypeContext.call(void 0, 1);
          Ka(), f.popTypeContext.call(void 0, t);
        }
      } else if (f.match.call(void 0, p.TokenType.name)) {
        if (e === te.ContextualKeyword._interface) {
          let t = f.pushTypeContext.call(void 0, 1);
          Wa(), f.popTypeContext.call(void 0, t);
        } else if (e === te.ContextualKeyword._type) {
          let t = f.pushTypeContext.call(void 0, 1);
          Va(), f.popTypeContext.call(void 0, t);
        } else if (e === te.ContextualKeyword._opaque) {
          let t = f.pushTypeContext.call(void 0, 1);
          za(!1), f.popTypeContext.call(void 0, t);
        }
      }
      N.semicolon.call(void 0);
    }
    Ae.flowParseIdentifierStatement = Sk;
    function bk() {
      return (
        N.isContextual.call(void 0, te.ContextualKeyword._type) ||
        N.isContextual.call(void 0, te.ContextualKeyword._interface) ||
        N.isContextual.call(void 0, te.ContextualKeyword._opaque) ||
        N.isContextual.call(void 0, te.ContextualKeyword._enum)
      );
    }
    Ae.flowShouldParseExportDeclaration = bk;
    function Ek() {
      return (
        f.match.call(void 0, p.TokenType.name) &&
        (J.state.contextualKeyword === te.ContextualKeyword._type ||
          J.state.contextualKeyword === te.ContextualKeyword._interface ||
          J.state.contextualKeyword === te.ContextualKeyword._opaque ||
          J.state.contextualKeyword === te.ContextualKeyword._enum)
      );
    }
    Ae.flowShouldDisallowExportDefaultSpecifier = Ek;
    function Ak() {
      if (N.isContextual.call(void 0, te.ContextualKeyword._type)) {
        let e = f.pushTypeContext.call(void 0, 1);
        f.next.call(void 0),
          f.match.call(void 0, p.TokenType.braceL)
            ? (Dn.parseExportSpecifiers.call(void 0),
              Dn.parseExportFrom.call(void 0))
            : Va(),
          f.popTypeContext.call(void 0, e);
      } else if (N.isContextual.call(void 0, te.ContextualKeyword._opaque)) {
        let e = f.pushTypeContext.call(void 0, 1);
        f.next.call(void 0), za(!1), f.popTypeContext.call(void 0, e);
      } else if (N.isContextual.call(void 0, te.ContextualKeyword._interface)) {
        let e = f.pushTypeContext.call(void 0, 1);
        f.next.call(void 0), Wa(), f.popTypeContext.call(void 0, e);
      } else Dn.parseStatement.call(void 0, !0);
    }
    Ae.flowParseExportDeclaration = Ak;
    function Pk() {
      return (
        f.match.call(void 0, p.TokenType.star) ||
        (N.isContextual.call(void 0, te.ContextualKeyword._type) &&
          f.lookaheadType.call(void 0) === p.TokenType.star)
      );
    }
    Ae.flowShouldParseExportStar = Pk;
    function Rk() {
      if (N.eatContextual.call(void 0, te.ContextualKeyword._type)) {
        let e = f.pushTypeContext.call(void 0, 2);
        Dn.baseParseExportStar.call(void 0), f.popTypeContext.call(void 0, e);
      } else Dn.baseParseExportStar.call(void 0);
    }
    Ae.flowParseExportStar = Rk;
    function Nk(e) {
      if (
        (e && f.match.call(void 0, p.TokenType.lessThan) && Yn(),
        N.isContextual.call(void 0, te.ContextualKeyword._implements))
      ) {
        let t = f.pushTypeContext.call(void 0, 0);
        f.next.call(void 0),
          (J.state.tokens[J.state.tokens.length - 1].type =
            p.TokenType._implements);
        do fs(), f.match.call(void 0, p.TokenType.lessThan) && Yn();
        while (f.eat.call(void 0, p.TokenType.comma));
        f.popTypeContext.call(void 0, t);
      }
    }
    Ae.flowAfterParseClassSuper = Nk;
    function Dk() {
      f.match.call(void 0, p.TokenType.lessThan) &&
        (nn(),
        f.match.call(void 0, p.TokenType.parenL) || N.unexpected.call(void 0));
    }
    Ae.flowStartParseObjPropValue = Dk;
    function Ok() {
      let e = f.pushTypeContext.call(void 0, 0);
      f.eat.call(void 0, p.TokenType.question),
        f.match.call(void 0, p.TokenType.colon) && wo(),
        f.popTypeContext.call(void 0, e);
    }
    Ae.flowParseAssignableListItemTypes = Ok;
    function Mk() {
      if (
        f.match.call(void 0, p.TokenType._typeof) ||
        N.isContextual.call(void 0, te.ContextualKeyword._type)
      ) {
        let e = f.lookaheadTypeAndKeyword.call(void 0);
        (Zm(e) ||
          e.type === p.TokenType.braceL ||
          e.type === p.TokenType.star) &&
          f.next.call(void 0);
      }
    }
    Ae.flowStartParseImportSpecifiers = Mk;
    function Lk() {
      let e =
        J.state.contextualKeyword === te.ContextualKeyword._type ||
        J.state.type === p.TokenType._typeof;
      e ? f.next.call(void 0) : Ie.parseIdentifier.call(void 0),
        N.isContextual.call(void 0, te.ContextualKeyword._as) &&
        !N.isLookaheadContextual.call(void 0, te.ContextualKeyword._as)
          ? (Ie.parseIdentifier.call(void 0),
            (e &&
              !f.match.call(void 0, p.TokenType.name) &&
              !(J.state.type & p.TokenType.IS_KEYWORD)) ||
              Ie.parseIdentifier.call(void 0))
          : (e &&
              (f.match.call(void 0, p.TokenType.name) ||
                J.state.type & p.TokenType.IS_KEYWORD) &&
              Ie.parseIdentifier.call(void 0),
            N.eatContextual.call(void 0, te.ContextualKeyword._as) &&
              Ie.parseIdentifier.call(void 0));
    }
    Ae.flowParseImportSpecifier = Lk;
    function Fk() {
      if (f.match.call(void 0, p.TokenType.lessThan)) {
        let e = f.pushTypeContext.call(void 0, 0);
        nn(), f.popTypeContext.call(void 0, e);
      }
    }
    Ae.flowStartParseFunctionParams = Fk;
    function $k() {
      f.match.call(void 0, p.TokenType.colon) && wo();
    }
    Ae.flowAfterParseVarHead = $k;
    function Bk() {
      if (f.match.call(void 0, p.TokenType.colon)) {
        let e = J.state.noAnonFunctionType;
        (J.state.noAnonFunctionType = !0),
          wo(),
          (J.state.noAnonFunctionType = e);
      }
    }
    Ae.flowStartParseAsyncArrowFromCallExpression = Bk;
    function jk(e, t) {
      if (f.match.call(void 0, p.TokenType.lessThan)) {
        let n = J.state.snapshot(),
          o = Ie.baseParseMaybeAssign.call(void 0, e, t);
        if (J.state.error)
          J.state.restoreFromSnapshot(n),
            (J.state.type = p.TokenType.typeParameterStart);
        else return o;
        let r = f.pushTypeContext.call(void 0, 0);
        if (
          (nn(),
          f.popTypeContext.call(void 0, r),
          (o = Ie.baseParseMaybeAssign.call(void 0, e, t)),
          o)
        )
          return !0;
        N.unexpected.call(void 0);
      }
      return Ie.baseParseMaybeAssign.call(void 0, e, t);
    }
    Ae.flowParseMaybeAssign = jk;
    function Kk() {
      if (f.match.call(void 0, p.TokenType.colon)) {
        let e = f.pushTypeContext.call(void 0, 0),
          t = J.state.snapshot(),
          n = J.state.noAnonFunctionType;
        (J.state.noAnonFunctionType = !0),
          Ha(),
          (J.state.noAnonFunctionType = n),
          N.canInsertSemicolon.call(void 0) && N.unexpected.call(void 0),
          f.match.call(void 0, p.TokenType.arrow) || N.unexpected.call(void 0),
          J.state.error && J.state.restoreFromSnapshot(t),
          f.popTypeContext.call(void 0, e);
      }
      return f.eat.call(void 0, p.TokenType.arrow);
    }
    Ae.flowParseArrow = Kk;
    function qk(e, t = !1) {
      if (
        J.state.tokens[J.state.tokens.length - 1].contextualKeyword ===
          te.ContextualKeyword._async &&
        f.match.call(void 0, p.TokenType.lessThan)
      ) {
        let n = J.state.snapshot();
        if (Hk() && !J.state.error) return;
        J.state.restoreFromSnapshot(n);
      }
      Ie.baseParseSubscripts.call(void 0, e, t);
    }
    Ae.flowParseSubscripts = qk;
    function Hk() {
      J.state.scopeDepth++;
      let e = J.state.tokens.length;
      return (
        Dn.parseFunctionParams.call(void 0),
        Ie.parseArrow.call(void 0)
          ? (Ie.parseArrowExpression.call(void 0, e), !0)
          : !1
      );
    }
    function pp() {
      N.expectContextual.call(void 0, te.ContextualKeyword._enum),
        (J.state.tokens[J.state.tokens.length - 1].type = p.TokenType._enum),
        Ie.parseIdentifier.call(void 0),
        Uk();
    }
    function Uk() {
      N.eatContextual.call(void 0, te.ContextualKeyword._of) &&
        f.next.call(void 0),
        N.expect.call(void 0, p.TokenType.braceL),
        Wk(),
        N.expect.call(void 0, p.TokenType.braceR);
    }
    function Wk() {
      for (
        ;
        !f.match.call(void 0, p.TokenType.braceR) &&
        !J.state.error &&
        !f.eat.call(void 0, p.TokenType.ellipsis);

      )
        Vk(),
          f.match.call(void 0, p.TokenType.braceR) ||
            N.expect.call(void 0, p.TokenType.comma);
    }
    function Vk() {
      Ie.parseIdentifier.call(void 0),
        f.eat.call(void 0, p.TokenType.eq) && f.next.call(void 0);
    }
  });
  var Jo = H((Ue) => {
    'use strict';
    Object.defineProperty(Ue, '__esModule', {value: !0});
    var zk = o1(),
      st = Vo(),
      He = mo(),
      S = Ve(),
      se = Ge(),
      On = Pr(),
      k = ce(),
      dp = gt(),
      y = Ct(),
      me = Xn(),
      Mn = Gr(),
      q = Sn();
    function Xk() {
      if (
        (t1(k.TokenType.eof),
        y.state.scopes.push(new On.Scope(0, y.state.tokens.length, !0)),
        y.state.scopeDepth !== 0)
      )
        throw new Error(
          `Invalid scope depth at end of file: ${y.state.scopeDepth}`
        );
      return new zk.File(y.state.tokens, y.state.scopes);
    }
    Ue.parseTopLevel = Xk;
    function Wt(e) {
      (y.isFlowEnabled && st.flowTryParseStatement.call(void 0)) ||
        (S.match.call(void 0, k.TokenType.at) && e1(), Yk(e));
    }
    Ue.parseStatement = Wt;
    function Yk(e) {
      if (y.isTypeScriptEnabled && He.tsTryParseStatementContent.call(void 0))
        return;
      let t = y.state.type;
      switch (t) {
        case k.TokenType._break:
        case k.TokenType._continue:
          Jk();
          return;
        case k.TokenType._debugger:
          Qk();
          return;
        case k.TokenType._do:
          Zk();
          return;
        case k.TokenType._for:
          ev();
          return;
        case k.TokenType._function:
          if (S.lookaheadType.call(void 0) === k.TokenType.dot) break;
          e || q.unexpected.call(void 0), ov();
          return;
        case k.TokenType._class:
          e || q.unexpected.call(void 0), hs(!0);
          return;
        case k.TokenType._if:
          rv();
          return;
        case k.TokenType._return:
          sv();
          return;
        case k.TokenType._switch:
          iv();
          return;
        case k.TokenType._throw:
          av();
          return;
        case k.TokenType._try:
          cv();
          return;
        case k.TokenType._let:
        case k.TokenType._const:
          e || q.unexpected.call(void 0);
        case k.TokenType._var:
          Qa(t !== k.TokenType._var);
          return;
        case k.TokenType._while:
          uv();
          return;
        case k.TokenType.braceL:
          So();
          return;
        case k.TokenType.semi:
          pv();
          return;
        case k.TokenType._export:
        case k.TokenType._import: {
          let r = S.lookaheadType.call(void 0);
          if (r === k.TokenType.parenL || r === k.TokenType.dot) break;
          S.next.call(void 0), t === k.TokenType._import ? wp() : xp();
          return;
        }
        case k.TokenType.name:
          if (y.state.contextualKeyword === se.ContextualKeyword._async) {
            let r = y.state.start,
              s = y.state.snapshot();
            if (
              (S.next.call(void 0),
              S.match.call(void 0, k.TokenType._function) &&
                !q.canInsertSemicolon.call(void 0))
            ) {
              q.expect.call(void 0, k.TokenType._function), or(r, !0);
              return;
            } else y.state.restoreFromSnapshot(s);
          } else if (
            y.state.contextualKeyword === se.ContextualKeyword._using &&
            !q.hasFollowingLineBreak.call(void 0) &&
            S.lookaheadType.call(void 0) === k.TokenType.name
          ) {
            Qa(!0);
            return;
          }
        default:
          break;
      }
      let n = y.state.tokens.length;
      me.parseExpression.call(void 0);
      let o = null;
      if (y.state.tokens.length === n + 1) {
        let r = y.state.tokens[y.state.tokens.length - 1];
        r.type === k.TokenType.name && (o = r.contextualKeyword);
      }
      if (o == null) {
        q.semicolon.call(void 0);
        return;
      }
      S.eat.call(void 0, k.TokenType.colon) ? dv() : fv(o);
    }
    function e1() {
      for (; S.match.call(void 0, k.TokenType.at); ) Tp();
    }
    Ue.parseDecorators = e1;
    function Tp() {
      if ((S.next.call(void 0), S.eat.call(void 0, k.TokenType.parenL)))
        me.parseExpression.call(void 0),
          q.expect.call(void 0, k.TokenType.parenR);
      else {
        for (
          me.parseIdentifier.call(void 0);
          S.eat.call(void 0, k.TokenType.dot);

        )
          me.parseIdentifier.call(void 0);
        Gk();
      }
    }
    function Gk() {
      y.isTypeScriptEnabled
        ? He.tsParseMaybeDecoratorArguments.call(void 0)
        : yp();
    }
    function yp() {
      S.eat.call(void 0, k.TokenType.parenL) &&
        me.parseCallExpressionArguments.call(void 0);
    }
    Ue.baseParseMaybeDecoratorArguments = yp;
    function Jk() {
      S.next.call(void 0),
        q.isLineTerminator.call(void 0) ||
          (me.parseIdentifier.call(void 0), q.semicolon.call(void 0));
    }
    function Qk() {
      S.next.call(void 0), q.semicolon.call(void 0);
    }
    function Zk() {
      S.next.call(void 0),
        Wt(!1),
        q.expect.call(void 0, k.TokenType._while),
        me.parseParenExpression.call(void 0),
        S.eat.call(void 0, k.TokenType.semi);
    }
    function ev() {
      y.state.scopeDepth++;
      let e = y.state.tokens.length;
      nv();
      let t = y.state.tokens.length;
      y.state.scopes.push(new On.Scope(e, t, !1)), y.state.scopeDepth--;
    }
    function tv() {
      return !(
        !q.isContextual.call(void 0, se.ContextualKeyword._using) ||
        q.isLookaheadContextual.call(void 0, se.ContextualKeyword._of)
      );
    }
    function nv() {
      S.next.call(void 0);
      let e = !1;
      if (
        (q.isContextual.call(void 0, se.ContextualKeyword._await) &&
          ((e = !0), S.next.call(void 0)),
        q.expect.call(void 0, k.TokenType.parenL),
        S.match.call(void 0, k.TokenType.semi))
      ) {
        e && q.unexpected.call(void 0), Ja();
        return;
      }
      if (
        S.match.call(void 0, k.TokenType._var) ||
        S.match.call(void 0, k.TokenType._let) ||
        S.match.call(void 0, k.TokenType._const) ||
        tv()
      ) {
        if (
          (S.next.call(void 0),
          mp(!0, y.state.type !== k.TokenType._var),
          S.match.call(void 0, k.TokenType._in) ||
            q.isContextual.call(void 0, se.ContextualKeyword._of))
        ) {
          fp(e);
          return;
        }
        Ja();
        return;
      }
      if (
        (me.parseExpression.call(void 0, !0),
        S.match.call(void 0, k.TokenType._in) ||
          q.isContextual.call(void 0, se.ContextualKeyword._of))
      ) {
        fp(e);
        return;
      }
      e && q.unexpected.call(void 0), Ja();
    }
    function ov() {
      let e = y.state.start;
      S.next.call(void 0), or(e, !0);
    }
    function rv() {
      S.next.call(void 0),
        me.parseParenExpression.call(void 0),
        Wt(!1),
        S.eat.call(void 0, k.TokenType._else) && Wt(!1);
    }
    function sv() {
      S.next.call(void 0),
        q.isLineTerminator.call(void 0) ||
          (me.parseExpression.call(void 0), q.semicolon.call(void 0));
    }
    function iv() {
      S.next.call(void 0),
        me.parseParenExpression.call(void 0),
        y.state.scopeDepth++;
      let e = y.state.tokens.length;
      for (
        q.expect.call(void 0, k.TokenType.braceL);
        !S.match.call(void 0, k.TokenType.braceR) && !y.state.error;

      )
        if (
          S.match.call(void 0, k.TokenType._case) ||
          S.match.call(void 0, k.TokenType._default)
        ) {
          let n = S.match.call(void 0, k.TokenType._case);
          S.next.call(void 0),
            n && me.parseExpression.call(void 0),
            q.expect.call(void 0, k.TokenType.colon);
        } else Wt(!0);
      S.next.call(void 0);
      let t = y.state.tokens.length;
      y.state.scopes.push(new On.Scope(e, t, !1)), y.state.scopeDepth--;
    }
    function av() {
      S.next.call(void 0),
        me.parseExpression.call(void 0),
        q.semicolon.call(void 0);
    }
    function lv() {
      Mn.parseBindingAtom.call(void 0, !0),
        y.isTypeScriptEnabled && He.tsTryParseTypeAnnotation.call(void 0);
    }
    function cv() {
      if (
        (S.next.call(void 0), So(), S.match.call(void 0, k.TokenType._catch))
      ) {
        S.next.call(void 0);
        let e = null;
        if (
          (S.match.call(void 0, k.TokenType.parenL) &&
            (y.state.scopeDepth++,
            (e = y.state.tokens.length),
            q.expect.call(void 0, k.TokenType.parenL),
            lv(),
            q.expect.call(void 0, k.TokenType.parenR)),
          So(),
          e != null)
        ) {
          let t = y.state.tokens.length;
          y.state.scopes.push(new On.Scope(e, t, !1)), y.state.scopeDepth--;
        }
      }
      S.eat.call(void 0, k.TokenType._finally) && So();
    }
    function Qa(e) {
      S.next.call(void 0), mp(!1, e), q.semicolon.call(void 0);
    }
    Ue.parseVarStatement = Qa;
    function uv() {
      S.next.call(void 0), me.parseParenExpression.call(void 0), Wt(!1);
    }
    function pv() {
      S.next.call(void 0);
    }
    function dv() {
      Wt(!0);
    }
    function fv(e) {
      y.isTypeScriptEnabled
        ? He.tsParseIdentifierStatement.call(void 0, e)
        : y.isFlowEnabled
        ? st.flowParseIdentifierStatement.call(void 0, e)
        : q.semicolon.call(void 0);
    }
    function So(e = !1, t = 0) {
      let n = y.state.tokens.length;
      y.state.scopeDepth++,
        q.expect.call(void 0, k.TokenType.braceL),
        t && (y.state.tokens[y.state.tokens.length - 1].contextId = t),
        t1(k.TokenType.braceR),
        t && (y.state.tokens[y.state.tokens.length - 1].contextId = t);
      let o = y.state.tokens.length;
      y.state.scopes.push(new On.Scope(n, o, e)), y.state.scopeDepth--;
    }
    Ue.parseBlock = So;
    function t1(e) {
      for (; !S.eat.call(void 0, e) && !y.state.error; ) Wt(!0);
    }
    Ue.parseBlockBody = t1;
    function Ja() {
      q.expect.call(void 0, k.TokenType.semi),
        S.match.call(void 0, k.TokenType.semi) ||
          me.parseExpression.call(void 0),
        q.expect.call(void 0, k.TokenType.semi),
        S.match.call(void 0, k.TokenType.parenR) ||
          me.parseExpression.call(void 0),
        q.expect.call(void 0, k.TokenType.parenR),
        Wt(!1);
    }
    function fp(e) {
      e
        ? q.eatContextual.call(void 0, se.ContextualKeyword._of)
        : S.next.call(void 0),
        me.parseExpression.call(void 0),
        q.expect.call(void 0, k.TokenType.parenR),
        Wt(!1);
    }
    function mp(e, t) {
      for (;;) {
        if ((hv(t), S.eat.call(void 0, k.TokenType.eq))) {
          let n = y.state.tokens.length - 1;
          me.parseMaybeAssign.call(void 0, e),
            (y.state.tokens[n].rhsEndIndex = y.state.tokens.length);
        }
        if (!S.eat.call(void 0, k.TokenType.comma)) break;
      }
    }
    function hv(e) {
      Mn.parseBindingAtom.call(void 0, e),
        y.isTypeScriptEnabled
          ? He.tsAfterParseVarHead.call(void 0)
          : y.isFlowEnabled && st.flowAfterParseVarHead.call(void 0);
    }
    function or(e, t, n = !1) {
      S.match.call(void 0, k.TokenType.star) && S.next.call(void 0),
        t &&
          !n &&
          !S.match.call(void 0, k.TokenType.name) &&
          !S.match.call(void 0, k.TokenType._yield) &&
          q.unexpected.call(void 0);
      let o = null;
      S.match.call(void 0, k.TokenType.name) &&
        (t || ((o = y.state.tokens.length), y.state.scopeDepth++),
        Mn.parseBindingIdentifier.call(void 0, !1));
      let r = y.state.tokens.length;
      y.state.scopeDepth++, kp(), me.parseFunctionBodyAndFinish.call(void 0, e);
      let s = y.state.tokens.length;
      y.state.scopes.push(new On.Scope(r, s, !0)),
        y.state.scopeDepth--,
        o !== null &&
          (y.state.scopes.push(new On.Scope(o, s, !0)), y.state.scopeDepth--);
    }
    Ue.parseFunction = or;
    function kp(e = !1, t = 0) {
      y.isTypeScriptEnabled
        ? He.tsStartParseFunctionParams.call(void 0)
        : y.isFlowEnabled && st.flowStartParseFunctionParams.call(void 0),
        q.expect.call(void 0, k.TokenType.parenL),
        t && (y.state.tokens[y.state.tokens.length - 1].contextId = t),
        Mn.parseBindingList.call(void 0, k.TokenType.parenR, !1, !1, e, t),
        t && (y.state.tokens[y.state.tokens.length - 1].contextId = t);
    }
    Ue.parseFunctionParams = kp;
    function hs(e, t = !1) {
      let n = y.getNextContextId.call(void 0);
      S.next.call(void 0),
        (y.state.tokens[y.state.tokens.length - 1].contextId = n),
        (y.state.tokens[y.state.tokens.length - 1].isExpression = !e);
      let o = null;
      e || ((o = y.state.tokens.length), y.state.scopeDepth++), kv(e, t), vv();
      let r = y.state.tokens.length;
      if (
        (Tv(n),
        !y.state.error &&
          ((y.state.tokens[r].contextId = n),
          (y.state.tokens[y.state.tokens.length - 1].contextId = n),
          o !== null))
      ) {
        let s = y.state.tokens.length;
        y.state.scopes.push(new On.Scope(o, s, !1)), y.state.scopeDepth--;
      }
    }
    Ue.parseClass = hs;
    function vp() {
      return (
        S.match.call(void 0, k.TokenType.eq) ||
        S.match.call(void 0, k.TokenType.semi) ||
        S.match.call(void 0, k.TokenType.braceR) ||
        S.match.call(void 0, k.TokenType.bang) ||
        S.match.call(void 0, k.TokenType.colon)
      );
    }
    function _p() {
      return (
        S.match.call(void 0, k.TokenType.parenL) ||
        S.match.call(void 0, k.TokenType.lessThan)
      );
    }
    function Tv(e) {
      for (
        q.expect.call(void 0, k.TokenType.braceL);
        !S.eat.call(void 0, k.TokenType.braceR) && !y.state.error;

      ) {
        if (S.eat.call(void 0, k.TokenType.semi)) continue;
        if (S.match.call(void 0, k.TokenType.at)) {
          Tp();
          continue;
        }
        let t = y.state.start;
        yv(t, e);
      }
    }
    function yv(e, t) {
      y.isTypeScriptEnabled &&
        He.tsParseModifiers.call(void 0, [
          se.ContextualKeyword._declare,
          se.ContextualKeyword._public,
          se.ContextualKeyword._protected,
          se.ContextualKeyword._private,
          se.ContextualKeyword._override,
        ]);
      let n = !1;
      if (
        S.match.call(void 0, k.TokenType.name) &&
        y.state.contextualKeyword === se.ContextualKeyword._static
      ) {
        if ((me.parseIdentifier.call(void 0), _p())) {
          tr(e, !1);
          return;
        } else if (vp()) {
          nr();
          return;
        }
        if (
          ((y.state.tokens[y.state.tokens.length - 1].type =
            k.TokenType._static),
          (n = !0),
          S.match.call(void 0, k.TokenType.braceL))
        ) {
          (y.state.tokens[y.state.tokens.length - 1].contextId = t), So();
          return;
        }
      }
      mv(e, n, t);
    }
    function mv(e, t, n) {
      if (
        y.isTypeScriptEnabled &&
        He.tsTryParseClassMemberWithIsStatic.call(void 0, t)
      )
        return;
      if (S.eat.call(void 0, k.TokenType.star)) {
        Io(n), tr(e, !1);
        return;
      }
      Io(n);
      let o = !1,
        r = y.state.tokens[y.state.tokens.length - 1];
      r.contextualKeyword === se.ContextualKeyword._constructor && (o = !0),
        Za(),
        _p()
          ? tr(e, o)
          : vp()
          ? nr()
          : r.contextualKeyword === se.ContextualKeyword._async &&
            !q.isLineTerminator.call(void 0)
          ? ((y.state.tokens[y.state.tokens.length - 1].type =
              k.TokenType._async),
            S.match.call(void 0, k.TokenType.star) && S.next.call(void 0),
            Io(n),
            Za(),
            tr(e, !1))
          : (r.contextualKeyword === se.ContextualKeyword._get ||
              r.contextualKeyword === se.ContextualKeyword._set) &&
            !(
              q.isLineTerminator.call(void 0) &&
              S.match.call(void 0, k.TokenType.star)
            )
          ? (r.contextualKeyword === se.ContextualKeyword._get
              ? (y.state.tokens[y.state.tokens.length - 1].type =
                  k.TokenType._get)
              : (y.state.tokens[y.state.tokens.length - 1].type =
                  k.TokenType._set),
            Io(n),
            tr(e, !1))
          : r.contextualKeyword === se.ContextualKeyword._accessor &&
            !q.isLineTerminator.call(void 0)
          ? (Io(n), nr())
          : q.isLineTerminator.call(void 0)
          ? nr()
          : q.unexpected.call(void 0);
    }
    function tr(e, t) {
      y.isTypeScriptEnabled
        ? He.tsTryParseTypeParameters.call(void 0)
        : y.isFlowEnabled &&
          S.match.call(void 0, k.TokenType.lessThan) &&
          st.flowParseTypeParameterDeclaration.call(void 0),
        me.parseMethod.call(void 0, e, t);
    }
    function Io(e) {
      me.parsePropertyName.call(void 0, e);
    }
    Ue.parseClassPropertyName = Io;
    function Za() {
      if (y.isTypeScriptEnabled) {
        let e = S.pushTypeContext.call(void 0, 0);
        S.eat.call(void 0, k.TokenType.question),
          S.popTypeContext.call(void 0, e);
      }
    }
    Ue.parsePostMemberNameModifiers = Za;
    function nr() {
      if (
        (y.isTypeScriptEnabled
          ? (S.eatTypeToken.call(void 0, k.TokenType.bang),
            He.tsTryParseTypeAnnotation.call(void 0))
          : y.isFlowEnabled &&
            S.match.call(void 0, k.TokenType.colon) &&
            st.flowParseTypeAnnotation.call(void 0),
        S.match.call(void 0, k.TokenType.eq))
      ) {
        let e = y.state.tokens.length;
        S.next.call(void 0),
          me.parseMaybeAssign.call(void 0),
          (y.state.tokens[e].rhsEndIndex = y.state.tokens.length);
      }
      q.semicolon.call(void 0);
    }
    Ue.parseClassProperty = nr;
    function kv(e, t = !1) {
      (y.isTypeScriptEnabled &&
        (!e || t) &&
        q.isContextual.call(void 0, se.ContextualKeyword._implements)) ||
        (S.match.call(void 0, k.TokenType.name) &&
          Mn.parseBindingIdentifier.call(void 0, !0),
        y.isTypeScriptEnabled
          ? He.tsTryParseTypeParameters.call(void 0)
          : y.isFlowEnabled &&
            S.match.call(void 0, k.TokenType.lessThan) &&
            st.flowParseTypeParameterDeclaration.call(void 0));
    }
    function vv() {
      let e = !1;
      S.eat.call(void 0, k.TokenType._extends)
        ? (me.parseExprSubscripts.call(void 0), (e = !0))
        : (e = !1),
        y.isTypeScriptEnabled
          ? He.tsAfterParseClassSuper.call(void 0, e)
          : y.isFlowEnabled && st.flowAfterParseClassSuper.call(void 0, e);
    }
    function xp() {
      let e = y.state.tokens.length - 1;
      (y.isTypeScriptEnabled && He.tsTryParseExport.call(void 0)) ||
        (Cv()
          ? wv()
          : gv()
          ? (me.parseIdentifier.call(void 0),
            S.match.call(void 0, k.TokenType.comma) &&
            S.lookaheadType.call(void 0) === k.TokenType.star
              ? (q.expect.call(void 0, k.TokenType.comma),
                q.expect.call(void 0, k.TokenType.star),
                q.expectContextual.call(void 0, se.ContextualKeyword._as),
                me.parseIdentifier.call(void 0))
              : gp(),
            rr())
          : S.eat.call(void 0, k.TokenType._default)
          ? _v()
          : Sv()
          ? xv()
          : (n1(), rr()),
        (y.state.tokens[e].rhsEndIndex = y.state.tokens.length));
    }
    Ue.parseExport = xp;
    function _v() {
      if (
        (y.isTypeScriptEnabled &&
          He.tsTryParseExportDefaultExpression.call(void 0)) ||
        (y.isFlowEnabled && st.flowTryParseExportDefaultExpression.call(void 0))
      )
        return;
      let e = y.state.start;
      S.eat.call(void 0, k.TokenType._function)
        ? or(e, !0, !0)
        : q.isContextual.call(void 0, se.ContextualKeyword._async) &&
          S.lookaheadType.call(void 0) === k.TokenType._function
        ? (q.eatContextual.call(void 0, se.ContextualKeyword._async),
          S.eat.call(void 0, k.TokenType._function),
          or(e, !0, !0))
        : S.match.call(void 0, k.TokenType._class)
        ? hs(!0, !0)
        : S.match.call(void 0, k.TokenType.at)
        ? (e1(), hs(!0, !0))
        : (me.parseMaybeAssign.call(void 0), q.semicolon.call(void 0));
    }
    function xv() {
      y.isTypeScriptEnabled
        ? He.tsParseExportDeclaration.call(void 0)
        : y.isFlowEnabled
        ? st.flowParseExportDeclaration.call(void 0)
        : Wt(!0);
    }
    function gv() {
      if (y.isTypeScriptEnabled && He.tsIsDeclarationStart.call(void 0))
        return !1;
      if (
        y.isFlowEnabled &&
        st.flowShouldDisallowExportDefaultSpecifier.call(void 0)
      )
        return !1;
      if (S.match.call(void 0, k.TokenType.name))
        return y.state.contextualKeyword !== se.ContextualKeyword._async;
      if (!S.match.call(void 0, k.TokenType._default)) return !1;
      let e = S.nextTokenStart.call(void 0),
        t = S.lookaheadTypeAndKeyword.call(void 0),
        n =
          t.type === k.TokenType.name &&
          t.contextualKeyword === se.ContextualKeyword._from;
      if (t.type === k.TokenType.comma) return !0;
      if (n) {
        let o = y.input.charCodeAt(S.nextTokenStartSince.call(void 0, e + 4));
        return (
          o === dp.charCodes.quotationMark || o === dp.charCodes.apostrophe
        );
      }
      return !1;
    }
    function gp() {
      S.eat.call(void 0, k.TokenType.comma) && n1();
    }
    function rr() {
      q.eatContextual.call(void 0, se.ContextualKeyword._from) &&
        (me.parseExprAtom.call(void 0), Ip()),
        q.semicolon.call(void 0);
    }
    Ue.parseExportFrom = rr;
    function Cv() {
      return y.isFlowEnabled
        ? st.flowShouldParseExportStar.call(void 0)
        : S.match.call(void 0, k.TokenType.star);
    }
    function wv() {
      y.isFlowEnabled ? st.flowParseExportStar.call(void 0) : Cp();
    }
    function Cp() {
      q.expect.call(void 0, k.TokenType.star),
        q.isContextual.call(void 0, se.ContextualKeyword._as) ? Iv() : rr();
    }
    Ue.baseParseExportStar = Cp;
    function Iv() {
      S.next.call(void 0),
        (y.state.tokens[y.state.tokens.length - 1].type = k.TokenType._as),
        me.parseIdentifier.call(void 0),
        gp(),
        rr();
    }
    function Sv() {
      return (
        (y.isTypeScriptEnabled && He.tsIsDeclarationStart.call(void 0)) ||
        (y.isFlowEnabled && st.flowShouldParseExportDeclaration.call(void 0)) ||
        y.state.type === k.TokenType._var ||
        y.state.type === k.TokenType._const ||
        y.state.type === k.TokenType._let ||
        y.state.type === k.TokenType._function ||
        y.state.type === k.TokenType._class ||
        q.isContextual.call(void 0, se.ContextualKeyword._async) ||
        S.match.call(void 0, k.TokenType.at)
      );
    }
    function n1() {
      let e = !0;
      for (
        q.expect.call(void 0, k.TokenType.braceL);
        !S.eat.call(void 0, k.TokenType.braceR) && !y.state.error;

      ) {
        if (e) e = !1;
        else if (
          (q.expect.call(void 0, k.TokenType.comma),
          S.eat.call(void 0, k.TokenType.braceR))
        )
          break;
        bv();
      }
    }
    Ue.parseExportSpecifiers = n1;
    function bv() {
      if (y.isTypeScriptEnabled) {
        He.tsParseExportSpecifier.call(void 0);
        return;
      }
      me.parseIdentifier.call(void 0),
        (y.state.tokens[y.state.tokens.length - 1].identifierRole =
          S.IdentifierRole.ExportAccess),
        q.eatContextual.call(void 0, se.ContextualKeyword._as) &&
          me.parseIdentifier.call(void 0);
    }
    function Ev() {
      let e = y.state.snapshot();
      return (
        q.expectContextual.call(void 0, se.ContextualKeyword._module),
        q.eatContextual.call(void 0, se.ContextualKeyword._from)
          ? q.isContextual.call(void 0, se.ContextualKeyword._from)
            ? (y.state.restoreFromSnapshot(e), !0)
            : (y.state.restoreFromSnapshot(e), !1)
          : S.match.call(void 0, k.TokenType.comma)
          ? (y.state.restoreFromSnapshot(e), !1)
          : (y.state.restoreFromSnapshot(e), !0)
      );
    }
    function Av() {
      q.isContextual.call(void 0, se.ContextualKeyword._module) &&
        Ev() &&
        S.next.call(void 0);
    }
    function wp() {
      if (
        y.isTypeScriptEnabled &&
        S.match.call(void 0, k.TokenType.name) &&
        S.lookaheadType.call(void 0) === k.TokenType.eq
      ) {
        He.tsParseImportEqualsDeclaration.call(void 0);
        return;
      }
      if (
        y.isTypeScriptEnabled &&
        q.isContextual.call(void 0, se.ContextualKeyword._type)
      ) {
        let e = S.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === k.TokenType.name &&
          e.contextualKeyword !== se.ContextualKeyword._from
        ) {
          if (
            (q.expectContextual.call(void 0, se.ContextualKeyword._type),
            S.lookaheadType.call(void 0) === k.TokenType.eq)
          ) {
            He.tsParseImportEqualsDeclaration.call(void 0);
            return;
          }
        } else
          (e.type === k.TokenType.star || e.type === k.TokenType.braceL) &&
            q.expectContextual.call(void 0, se.ContextualKeyword._type);
      }
      S.match.call(void 0, k.TokenType.string) ||
        (Av(),
        Rv(),
        q.expectContextual.call(void 0, se.ContextualKeyword._from)),
        me.parseExprAtom.call(void 0),
        Ip(),
        q.semicolon.call(void 0);
    }
    Ue.parseImport = wp;
    function Pv() {
      return S.match.call(void 0, k.TokenType.name);
    }
    function hp() {
      Mn.parseImportedIdentifier.call(void 0);
    }
    function Rv() {
      y.isFlowEnabled && st.flowStartParseImportSpecifiers.call(void 0);
      let e = !0;
      if (!(Pv() && (hp(), !S.eat.call(void 0, k.TokenType.comma)))) {
        if (S.match.call(void 0, k.TokenType.star)) {
          S.next.call(void 0),
            q.expectContextual.call(void 0, se.ContextualKeyword._as),
            hp();
          return;
        }
        for (
          q.expect.call(void 0, k.TokenType.braceL);
          !S.eat.call(void 0, k.TokenType.braceR) && !y.state.error;

        ) {
          if (e) e = !1;
          else if (
            (S.eat.call(void 0, k.TokenType.colon) &&
              q.unexpected.call(
                void 0,
                'ES2015 named imports do not destructure. Use another statement for destructuring after the import.'
              ),
            q.expect.call(void 0, k.TokenType.comma),
            S.eat.call(void 0, k.TokenType.braceR))
          )
            break;
          Nv();
        }
      }
    }
    function Nv() {
      if (y.isTypeScriptEnabled) {
        He.tsParseImportSpecifier.call(void 0);
        return;
      }
      if (y.isFlowEnabled) {
        st.flowParseImportSpecifier.call(void 0);
        return;
      }
      Mn.parseImportedIdentifier.call(void 0),
        q.isContextual.call(void 0, se.ContextualKeyword._as) &&
          ((y.state.tokens[y.state.tokens.length - 1].identifierRole =
            S.IdentifierRole.ImportAccess),
          S.next.call(void 0),
          Mn.parseImportedIdentifier.call(void 0));
    }
    function Ip() {
      q.isContextual.call(void 0, se.ContextualKeyword._assert) &&
        !q.hasPrecedingLineBreak.call(void 0) &&
        (S.next.call(void 0), me.parseObj.call(void 0, !1, !1));
    }
  });
  var Ep = H((s1) => {
    'use strict';
    Object.defineProperty(s1, '__esModule', {value: !0});
    var Sp = Ve(),
      bp = gt(),
      r1 = Ct(),
      Dv = Jo();
    function Ov() {
      return (
        r1.state.pos === 0 &&
          r1.input.charCodeAt(0) === bp.charCodes.numberSign &&
          r1.input.charCodeAt(1) === bp.charCodes.exclamationMark &&
          Sp.skipLineComment.call(void 0, 2),
        Sp.nextToken.call(void 0),
        Dv.parseTopLevel.call(void 0)
      );
    }
    s1.parseFile = Ov;
  });
  var o1 = H((ys) => {
    'use strict';
    Object.defineProperty(ys, '__esModule', {value: !0});
    var Ts = Ct(),
      Mv = Ep(),
      i1 = class {
        constructor(t, n) {
          (this.tokens = t), (this.scopes = n);
        }
      };
    ys.File = i1;
    function Lv(e, t, n, o) {
      if (o && n)
        throw new Error('Cannot combine flow and typescript plugins.');
      Ts.initParser.call(void 0, e, t, n, o);
      let r = Mv.parseFile.call(void 0);
      if (Ts.state.error) throw Ts.augmentError.call(void 0, Ts.state.error);
      return r;
    }
    ys.parse = Lv;
  });
  var Ap = H((a1) => {
    'use strict';
    Object.defineProperty(a1, '__esModule', {value: !0});
    var Fv = Ge();
    function $v(e) {
      let t = e.currentIndex(),
        n = 0,
        o = e.currentToken();
      do {
        let r = e.tokens[t];
        if (
          (r.isOptionalChainStart && n++,
          r.isOptionalChainEnd && n--,
          (n += r.numNullishCoalesceStarts),
          (n -= r.numNullishCoalesceEnds),
          r.contextualKeyword === Fv.ContextualKeyword._await &&
            r.identifierRole == null &&
            r.scopeDepth === o.scopeDepth)
        )
          return !0;
        t += 1;
      } while (n > 0 && t < e.tokens.length);
      return !1;
    }
    a1.default = $v;
  });
  var Pp = H((c1) => {
    'use strict';
    Object.defineProperty(c1, '__esModule', {value: !0});
    function Bv(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var ms = ce(),
      jv = Ap(),
      Kv = Bv(jv),
      l1 = class e {
        __init() {
          this.resultCode = '';
        }
        __init2() {
          this.resultMappings = new Array(this.tokens.length);
        }
        __init3() {
          this.tokenIndex = 0;
        }
        constructor(t, n, o, r, s) {
          (this.code = t),
            (this.tokens = n),
            (this.isFlowEnabled = o),
            (this.disableESTransforms = r),
            (this.helperManager = s),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this);
        }
        snapshot() {
          return {resultCode: this.resultCode, tokenIndex: this.tokenIndex};
        }
        restoreToSnapshot(t) {
          (this.resultCode = t.resultCode), (this.tokenIndex = t.tokenIndex);
        }
        dangerouslyGetAndRemoveCodeSinceSnapshot(t) {
          let n = this.resultCode.slice(t.resultCode.length);
          return (this.resultCode = t.resultCode), n;
        }
        reset() {
          (this.resultCode = ''),
            (this.resultMappings = new Array(this.tokens.length)),
            (this.tokenIndex = 0);
        }
        matchesContextualAtIndex(t, n) {
          return (
            this.matches1AtIndex(t, ms.TokenType.name) &&
            this.tokens[t].contextualKeyword === n
          );
        }
        identifierNameAtIndex(t) {
          return this.identifierNameForToken(this.tokens[t]);
        }
        identifierNameAtRelativeIndex(t) {
          return this.identifierNameForToken(this.tokenAtRelativeIndex(t));
        }
        identifierName() {
          return this.identifierNameForToken(this.currentToken());
        }
        identifierNameForToken(t) {
          return this.code.slice(t.start, t.end);
        }
        rawCodeForToken(t) {
          return this.code.slice(t.start, t.end);
        }
        stringValueAtIndex(t) {
          return this.stringValueForToken(this.tokens[t]);
        }
        stringValue() {
          return this.stringValueForToken(this.currentToken());
        }
        stringValueForToken(t) {
          return this.code.slice(t.start + 1, t.end - 1);
        }
        matches1AtIndex(t, n) {
          return this.tokens[t].type === n;
        }
        matches2AtIndex(t, n, o) {
          return this.tokens[t].type === n && this.tokens[t + 1].type === o;
        }
        matches3AtIndex(t, n, o, r) {
          return (
            this.tokens[t].type === n &&
            this.tokens[t + 1].type === o &&
            this.tokens[t + 2].type === r
          );
        }
        matches1(t) {
          return this.tokens[this.tokenIndex].type === t;
        }
        matches2(t, n) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === n
          );
        }
        matches3(t, n, o) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === n &&
            this.tokens[this.tokenIndex + 2].type === o
          );
        }
        matches4(t, n, o, r) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === n &&
            this.tokens[this.tokenIndex + 2].type === o &&
            this.tokens[this.tokenIndex + 3].type === r
          );
        }
        matches5(t, n, o, r, s) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === n &&
            this.tokens[this.tokenIndex + 2].type === o &&
            this.tokens[this.tokenIndex + 3].type === r &&
            this.tokens[this.tokenIndex + 4].type === s
          );
        }
        matchesContextual(t) {
          return this.matchesContextualAtIndex(this.tokenIndex, t);
        }
        matchesContextIdAndLabel(t, n) {
          return this.matches1(t) && this.currentToken().contextId === n;
        }
        previousWhitespaceAndComments() {
          let t = this.code.slice(
            this.tokenIndex > 0 ? this.tokens[this.tokenIndex - 1].end : 0,
            this.tokenIndex < this.tokens.length
              ? this.tokens[this.tokenIndex].start
              : this.code.length
          );
          return this.isFlowEnabled && (t = t.replace(/@flow/g, '')), t;
        }
        replaceToken(t) {
          (this.resultCode += this.previousWhitespaceAndComments()),
            this.appendTokenPrefix(),
            (this.resultMappings[this.tokenIndex] = this.resultCode.length),
            (this.resultCode += t),
            this.appendTokenSuffix(),
            this.tokenIndex++;
        }
        replaceTokenTrimmingLeftWhitespace(t) {
          (this.resultCode += this.previousWhitespaceAndComments().replace(
            /[^\r\n]/g,
            ''
          )),
            this.appendTokenPrefix(),
            (this.resultMappings[this.tokenIndex] = this.resultCode.length),
            (this.resultCode += t),
            this.appendTokenSuffix(),
            this.tokenIndex++;
        }
        removeInitialToken() {
          this.replaceToken('');
        }
        removeToken() {
          this.replaceTokenTrimmingLeftWhitespace('');
        }
        removeBalancedCode() {
          let t = 0;
          for (; !this.isAtEnd(); ) {
            if (this.matches1(ms.TokenType.braceL)) t++;
            else if (this.matches1(ms.TokenType.braceR)) {
              if (t === 0) return;
              t--;
            }
            this.removeToken();
          }
        }
        copyExpectedToken(t) {
          if (this.tokens[this.tokenIndex].type !== t)
            throw new Error(`Expected token ${t}`);
          this.copyToken();
        }
        copyToken() {
          (this.resultCode += this.previousWhitespaceAndComments()),
            this.appendTokenPrefix(),
            (this.resultMappings[this.tokenIndex] = this.resultCode.length),
            (this.resultCode += this.code.slice(
              this.tokens[this.tokenIndex].start,
              this.tokens[this.tokenIndex].end
            )),
            this.appendTokenSuffix(),
            this.tokenIndex++;
        }
        copyTokenWithPrefix(t) {
          (this.resultCode += this.previousWhitespaceAndComments()),
            this.appendTokenPrefix(),
            (this.resultCode += t),
            (this.resultMappings[this.tokenIndex] = this.resultCode.length),
            (this.resultCode += this.code.slice(
              this.tokens[this.tokenIndex].start,
              this.tokens[this.tokenIndex].end
            )),
            this.appendTokenSuffix(),
            this.tokenIndex++;
        }
        appendTokenPrefix() {
          let t = this.currentToken();
          if (
            ((t.numNullishCoalesceStarts || t.isOptionalChainStart) &&
              (t.isAsyncOperation = Kv.default.call(void 0, this)),
            !this.disableESTransforms)
          ) {
            if (t.numNullishCoalesceStarts)
              for (let n = 0; n < t.numNullishCoalesceStarts; n++)
                t.isAsyncOperation
                  ? ((this.resultCode += 'await '),
                    (this.resultCode += this.helperManager.getHelperName(
                      'asyncNullishCoalesce'
                    )))
                  : (this.resultCode +=
                      this.helperManager.getHelperName('nullishCoalesce')),
                  (this.resultCode += '(');
            t.isOptionalChainStart &&
              (t.isAsyncOperation && (this.resultCode += 'await '),
              this.tokenIndex > 0 &&
              this.tokenAtRelativeIndex(-1).type === ms.TokenType._delete
                ? t.isAsyncOperation
                  ? (this.resultCode += this.helperManager.getHelperName(
                      'asyncOptionalChainDelete'
                    ))
                  : (this.resultCode += this.helperManager.getHelperName(
                      'optionalChainDelete'
                    ))
                : t.isAsyncOperation
                ? (this.resultCode +=
                    this.helperManager.getHelperName('asyncOptionalChain'))
                : (this.resultCode +=
                    this.helperManager.getHelperName('optionalChain')),
              (this.resultCode += '(['));
          }
        }
        appendTokenSuffix() {
          let t = this.currentToken();
          if (
            (t.isOptionalChainEnd &&
              !this.disableESTransforms &&
              (this.resultCode += '])'),
            t.numNullishCoalesceEnds && !this.disableESTransforms)
          )
            for (let n = 0; n < t.numNullishCoalesceEnds; n++)
              this.resultCode += '))';
        }
        appendCode(t) {
          this.resultCode += t;
        }
        currentToken() {
          return this.tokens[this.tokenIndex];
        }
        currentTokenCode() {
          let t = this.currentToken();
          return this.code.slice(t.start, t.end);
        }
        tokenAtRelativeIndex(t) {
          return this.tokens[this.tokenIndex + t];
        }
        currentIndex() {
          return this.tokenIndex;
        }
        nextToken() {
          if (this.tokenIndex === this.tokens.length)
            throw new Error('Unexpectedly reached end of input.');
          this.tokenIndex++;
        }
        previousToken() {
          this.tokenIndex--;
        }
        finish() {
          if (this.tokenIndex !== this.tokens.length)
            throw new Error(
              'Tried to finish processing tokens before reaching the end.'
            );
          return (
            (this.resultCode += this.previousWhitespaceAndComments()),
            {code: this.resultCode, mappings: this.resultMappings}
          );
        }
        isAtEnd() {
          return this.tokenIndex === this.tokens.length;
        }
      };
    c1.default = l1;
  });
  var Dp = H((p1) => {
    'use strict';
    Object.defineProperty(p1, '__esModule', {value: !0});
    var Rp = Ge(),
      he = ce();
    function qv(e, t, n, o) {
      let r = t.snapshot(),
        s = Hv(t),
        i = [],
        a = [],
        u = [],
        h = null,
        v = [],
        _ = [],
        x = t.currentToken().contextId;
      if (x == null)
        throw new Error(
          'Expected non-null class context ID on class open-brace.'
        );
      for (t.nextToken(); !t.matchesContextIdAndLabel(he.TokenType.braceR, x); )
        if (
          t.matchesContextual(Rp.ContextualKeyword._constructor) &&
          !t.currentToken().isType
        )
          ({constructorInitializerStatements: i, constructorInsertPos: h} =
            Np(t));
        else if (t.matches1(he.TokenType.semi))
          o || _.push({start: t.currentIndex(), end: t.currentIndex() + 1}),
            t.nextToken();
        else if (t.currentToken().isType) t.nextToken();
        else {
          let L = t.currentIndex(),
            G = !1,
            F = !1,
            K = !1;
          for (; ks(t.currentToken()); )
            t.matches1(he.TokenType._static) && (G = !0),
              t.matches1(he.TokenType.hash) && (F = !0),
              (t.matches1(he.TokenType._declare) ||
                t.matches1(he.TokenType._abstract)) &&
                (K = !0),
              t.nextToken();
          if (G && t.matches1(he.TokenType.braceL)) {
            u1(t, x);
            continue;
          }
          if (F) {
            u1(t, x);
            continue;
          }
          if (
            t.matchesContextual(Rp.ContextualKeyword._constructor) &&
            !t.currentToken().isType
          ) {
            ({constructorInitializerStatements: i, constructorInsertPos: h} =
              Np(t));
            continue;
          }
          let R = t.currentIndex();
          if (
            (Uv(t),
            t.matches1(he.TokenType.lessThan) ||
              t.matches1(he.TokenType.parenL))
          ) {
            u1(t, x);
            continue;
          }
          for (; t.currentToken().isType; ) t.nextToken();
          if (t.matches1(he.TokenType.eq)) {
            let z = t.currentIndex(),
              $ = t.currentToken().rhsEndIndex;
            if ($ == null)
              throw new Error(
                'Expected rhsEndIndex on class field assignment.'
              );
            for (t.nextToken(); t.currentIndex() < $; ) e.processToken();
            let O;
            G
              ? ((O = n.claimFreeName('__initStatic')), u.push(O))
              : ((O = n.claimFreeName('__init')), a.push(O)),
              v.push({
                initializerName: O,
                equalsIndex: z,
                start: R,
                end: t.currentIndex(),
              });
          } else (!o || K) && _.push({start: L, end: t.currentIndex()});
        }
      return (
        t.restoreToSnapshot(r),
        o
          ? {
              headerInfo: s,
              constructorInitializerStatements: i,
              instanceInitializerNames: [],
              staticInitializerNames: [],
              constructorInsertPos: h,
              fields: [],
              rangesToRemove: _,
            }
          : {
              headerInfo: s,
              constructorInitializerStatements: i,
              instanceInitializerNames: a,
              staticInitializerNames: u,
              constructorInsertPos: h,
              fields: v,
              rangesToRemove: _,
            }
      );
    }
    p1.default = qv;
    function u1(e, t) {
      for (e.nextToken(); e.currentToken().contextId !== t; ) e.nextToken();
      for (; ks(e.tokenAtRelativeIndex(-1)); ) e.previousToken();
    }
    function Hv(e) {
      let t = e.currentToken(),
        n = t.contextId;
      if (n == null) throw new Error('Expected context ID on class token.');
      let o = t.isExpression;
      if (o == null) throw new Error('Expected isExpression on class token.');
      let r = null,
        s = !1;
      for (
        e.nextToken(),
          e.matches1(he.TokenType.name) && (r = e.identifierName());
        !e.matchesContextIdAndLabel(he.TokenType.braceL, n);

      )
        e.matches1(he.TokenType._extends) &&
          !e.currentToken().isType &&
          (s = !0),
          e.nextToken();
      return {isExpression: o, className: r, hasSuperclass: s};
    }
    function Np(e) {
      let t = [];
      e.nextToken();
      let n = e.currentToken().contextId;
      if (n == null)
        throw new Error(
          'Expected context ID on open-paren starting constructor params.'
        );
      for (; !e.matchesContextIdAndLabel(he.TokenType.parenR, n); )
        if (e.currentToken().contextId === n) {
          if ((e.nextToken(), ks(e.currentToken()))) {
            for (e.nextToken(); ks(e.currentToken()); ) e.nextToken();
            let s = e.currentToken();
            if (s.type !== he.TokenType.name)
              throw new Error(
                'Expected identifier after access modifiers in constructor arg.'
              );
            let i = e.identifierNameForToken(s);
            t.push(`this.${i} = ${i}`);
          }
        } else e.nextToken();
      e.nextToken();
      let o = e.currentIndex(),
        r = !1;
      for (; !e.matchesContextIdAndLabel(he.TokenType.braceR, n); ) {
        if (!r && e.matches2(he.TokenType._super, he.TokenType.parenL)) {
          e.nextToken();
          let s = e.currentToken().contextId;
          if (s == null)
            throw new Error('Expected a context ID on the super call');
          for (; !e.matchesContextIdAndLabel(he.TokenType.parenR, s); )
            e.nextToken();
          (o = e.currentIndex()), (r = !0);
        }
        e.nextToken();
      }
      return (
        e.nextToken(),
        {constructorInitializerStatements: t, constructorInsertPos: o}
      );
    }
    function ks(e) {
      return [
        he.TokenType._async,
        he.TokenType._get,
        he.TokenType._set,
        he.TokenType.plus,
        he.TokenType.minus,
        he.TokenType._readonly,
        he.TokenType._static,
        he.TokenType._public,
        he.TokenType._private,
        he.TokenType._protected,
        he.TokenType._override,
        he.TokenType._abstract,
        he.TokenType.star,
        he.TokenType._declare,
        he.TokenType.hash,
      ].includes(e.type);
    }
    function Uv(e) {
      if (e.matches1(he.TokenType.bracketL)) {
        let n = e.currentToken().contextId;
        if (n == null)
          throw new Error(
            'Expected class context ID on computed name open bracket.'
          );
        for (; !e.matchesContextIdAndLabel(he.TokenType.bracketR, n); )
          e.nextToken();
        e.nextToken();
      } else e.nextToken();
    }
  });
  var f1 = H((d1) => {
    'use strict';
    Object.defineProperty(d1, '__esModule', {value: !0});
    var Op = ce();
    function Wv(e) {
      if (
        (e.removeInitialToken(),
        e.removeToken(),
        e.removeToken(),
        e.removeToken(),
        e.matches1(Op.TokenType.parenL))
      )
        e.removeToken(), e.removeToken(), e.removeToken();
      else
        for (; e.matches1(Op.TokenType.dot); ) e.removeToken(), e.removeToken();
    }
    d1.default = Wv;
  });
  var h1 = H((vs) => {
    'use strict';
    Object.defineProperty(vs, '__esModule', {value: !0});
    var Vv = Ve(),
      zv = ce(),
      Xv = {typeDeclarations: new Set(), valueDeclarations: new Set()};
    vs.EMPTY_DECLARATION_INFO = Xv;
    function Yv(e) {
      let t = new Set(),
        n = new Set();
      for (let o = 0; o < e.tokens.length; o++) {
        let r = e.tokens[o];
        r.type === zv.TokenType.name &&
          Vv.isTopLevelDeclaration.call(void 0, r) &&
          (r.isType
            ? t.add(e.identifierNameForToken(r))
            : n.add(e.identifierNameForToken(r)));
      }
      return {typeDeclarations: t, valueDeclarations: n};
    }
    vs.default = Yv;
  });
  var y1 = H((T1) => {
    'use strict';
    Object.defineProperty(T1, '__esModule', {value: !0});
    var Gv = Ge(),
      Mp = ce();
    function Jv(e) {
      e.matches2(Mp.TokenType.name, Mp.TokenType.braceL) &&
        e.matchesContextual(Gv.ContextualKeyword._assert) &&
        (e.removeToken(),
        e.removeToken(),
        e.removeBalancedCode(),
        e.removeToken());
    }
    T1.removeMaybeImportAssertion = Jv;
  });
  var k1 = H((m1) => {
    'use strict';
    Object.defineProperty(m1, '__esModule', {value: !0});
    var Lp = ce();
    function Qv(e, t, n) {
      if (!e) return !1;
      let o = t.currentToken();
      if (o.rhsEndIndex == null)
        throw new Error('Expected non-null rhsEndIndex on export token.');
      let r = o.rhsEndIndex - t.currentIndex();
      if (
        r !== 3 &&
        !(r === 4 && t.matches1AtIndex(o.rhsEndIndex - 1, Lp.TokenType.semi))
      )
        return !1;
      let s = t.tokenAtRelativeIndex(2);
      if (s.type !== Lp.TokenType.name) return !1;
      let i = t.identifierNameForToken(s);
      return n.typeDeclarations.has(i) && !n.valueDeclarations.has(i);
    }
    m1.default = Qv;
  });
  var $p = H((_1) => {
    'use strict';
    Object.defineProperty(_1, '__esModule', {value: !0});
    function sr(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var _s = Ve(),
      Gn = Ge(),
      m = ce(),
      Zv = f1(),
      e0 = sr(Zv),
      Fp = h1(),
      t0 = sr(Fp),
      n0 = Ko(),
      o0 = sr(n0),
      xs = y1(),
      r0 = k1(),
      s0 = sr(r0),
      i0 = Nt(),
      a0 = sr(i0),
      v1 = class e extends a0.default {
        __init() {
          this.hadExport = !1;
        }
        __init2() {
          this.hadNamedExport = !1;
        }
        __init3() {
          this.hadDefaultExport = !1;
        }
        constructor(t, n, o, r, s, i, a, u, h, v) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.importProcessor = o),
            (this.nameManager = r),
            (this.helperManager = s),
            (this.reactHotLoaderTransformer = i),
            (this.enableLegacyBabel5ModuleInterop = a),
            (this.enableLegacyTypeScriptModuleInterop = u),
            (this.isTypeScriptTransformEnabled = h),
            (this.preserveDynamicImport = v),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            (this.declarationInfo = h
              ? t0.default.call(void 0, n)
              : Fp.EMPTY_DECLARATION_INFO);
        }
        getPrefixCode() {
          let t = '';
          return (
            this.hadExport &&
              (t +=
                'Object.defineProperty(exports, "__esModule", {value: true});'),
            t
          );
        }
        getSuffixCode() {
          return this.enableLegacyBabel5ModuleInterop &&
            this.hadDefaultExport &&
            !this.hadNamedExport
            ? `
module.exports = exports.default;
`
            : '';
        }
        process() {
          return this.tokens.matches3(
            m.TokenType._import,
            m.TokenType.name,
            m.TokenType.eq
          )
            ? this.processImportEquals()
            : this.tokens.matches1(m.TokenType._import)
            ? (this.processImport(), !0)
            : this.tokens.matches2(m.TokenType._export, m.TokenType.eq)
            ? (this.tokens.replaceToken('module.exports'), !0)
            : this.tokens.matches1(m.TokenType._export) &&
              !this.tokens.currentToken().isType
            ? ((this.hadExport = !0), this.processExport())
            : this.tokens.matches2(m.TokenType.name, m.TokenType.postIncDec) &&
              this.processPostIncDec()
            ? !0
            : this.tokens.matches1(m.TokenType.name) ||
              this.tokens.matches1(m.TokenType.jsxName)
            ? this.processIdentifier()
            : this.tokens.matches1(m.TokenType.eq)
            ? this.processAssignment()
            : this.tokens.matches1(m.TokenType.assign)
            ? this.processComplexAssignment()
            : this.tokens.matches1(m.TokenType.preIncDec)
            ? this.processPreIncDec()
            : !1;
        }
        processImportEquals() {
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return (
            this.importProcessor.isTypeName(t)
              ? e0.default.call(void 0, this.tokens)
              : this.tokens.replaceToken('const'),
            !0
          );
        }
        processImport() {
          if (this.tokens.matches2(m.TokenType._import, m.TokenType.parenL)) {
            if (this.preserveDynamicImport) {
              this.tokens.copyToken();
              return;
            }
            let n = this.enableLegacyTypeScriptModuleInterop
              ? ''
              : `${this.helperManager.getHelperName(
                  'interopRequireWildcard'
                )}(`;
            this.tokens.replaceToken(
              `Promise.resolve().then(() => ${n}require`
            );
            let o = this.tokens.currentToken().contextId;
            if (o == null)
              throw new Error(
                'Expected context ID on dynamic import invocation.'
              );
            for (
              this.tokens.copyToken();
              !this.tokens.matchesContextIdAndLabel(m.TokenType.parenR, o);

            )
              this.rootTransformer.processToken();
            this.tokens.replaceToken(n ? ')))' : '))');
            return;
          }
          if (this.removeImportAndDetectIfType()) this.tokens.removeToken();
          else {
            let n = this.tokens.stringValue();
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              this.importProcessor.claimImportCode(n)
            ),
              this.tokens.appendCode(this.importProcessor.claimImportCode(n));
          }
          xs.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(m.TokenType.semi) && this.tokens.removeToken();
        }
        removeImportAndDetectIfType() {
          if (
            (this.tokens.removeInitialToken(),
            this.tokens.matchesContextual(Gn.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                m.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                Gn.ContextualKeyword._from
              ))
          )
            return this.removeRemainingImport(), !0;
          if (
            this.tokens.matches1(m.TokenType.name) ||
            this.tokens.matches1(m.TokenType.star)
          )
            return this.removeRemainingImport(), !1;
          if (this.tokens.matches1(m.TokenType.string)) return !1;
          let t = !1;
          for (; !this.tokens.matches1(m.TokenType.string); )
            ((!t && this.tokens.matches1(m.TokenType.braceL)) ||
              this.tokens.matches1(m.TokenType.comma)) &&
              (this.tokens.removeToken(),
              (this.tokens.matches2(m.TokenType.name, m.TokenType.comma) ||
                this.tokens.matches2(m.TokenType.name, m.TokenType.braceR) ||
                this.tokens.matches4(
                  m.TokenType.name,
                  m.TokenType.name,
                  m.TokenType.name,
                  m.TokenType.comma
                ) ||
                this.tokens.matches4(
                  m.TokenType.name,
                  m.TokenType.name,
                  m.TokenType.name,
                  m.TokenType.braceR
                )) &&
                (t = !0)),
              this.tokens.removeToken();
          return !t;
        }
        removeRemainingImport() {
          for (; !this.tokens.matches1(m.TokenType.string); )
            this.tokens.removeToken();
        }
        processIdentifier() {
          let t = this.tokens.currentToken();
          if (t.shadowsGlobal) return !1;
          if (t.identifierRole === _s.IdentifierRole.ObjectShorthand)
            return this.processObjectShorthand();
          if (t.identifierRole !== _s.IdentifierRole.Access) return !1;
          let n = this.importProcessor.getIdentifierReplacement(
            this.tokens.identifierNameForToken(t)
          );
          if (!n) return !1;
          let o = this.tokens.currentIndex() + 1;
          for (
            ;
            o < this.tokens.tokens.length &&
            this.tokens.tokens[o].type === m.TokenType.parenR;

          )
            o++;
          return (
            this.tokens.tokens[o].type === m.TokenType.parenL
              ? this.tokens.tokenAtRelativeIndex(1).type ===
                  m.TokenType.parenL &&
                this.tokens.tokenAtRelativeIndex(-1).type !== m.TokenType._new
                ? (this.tokens.replaceToken(`${n}.call(void 0, `),
                  this.tokens.removeToken(),
                  this.rootTransformer.processBalancedCode(),
                  this.tokens.copyExpectedToken(m.TokenType.parenR))
                : this.tokens.replaceToken(`(0, ${n})`)
              : this.tokens.replaceToken(n),
            !0
          );
        }
        processObjectShorthand() {
          let t = this.tokens.identifierName(),
            n = this.importProcessor.getIdentifierReplacement(t);
          return n ? (this.tokens.replaceToken(`${t}: ${n}`), !0) : !1;
        }
        processExport() {
          if (
            this.tokens.matches2(m.TokenType._export, m.TokenType._enum) ||
            this.tokens.matches3(
              m.TokenType._export,
              m.TokenType._const,
              m.TokenType._enum
            )
          )
            return !1;
          if (this.tokens.matches2(m.TokenType._export, m.TokenType._default))
            return (
              (this.hadDefaultExport = !0),
              this.tokens.matches3(
                m.TokenType._export,
                m.TokenType._default,
                m.TokenType._enum
              )
                ? !1
                : (this.processExportDefault(), !0)
            );
          if (
            ((this.hadNamedExport = !0),
            this.tokens.matches2(m.TokenType._export, m.TokenType._var) ||
              this.tokens.matches2(m.TokenType._export, m.TokenType._let) ||
              this.tokens.matches2(m.TokenType._export, m.TokenType._const))
          )
            return this.processExportVar(), !0;
          if (
            this.tokens.matches2(m.TokenType._export, m.TokenType._function) ||
            this.tokens.matches3(
              m.TokenType._export,
              m.TokenType.name,
              m.TokenType._function
            )
          )
            return this.processExportFunction(), !0;
          if (
            this.tokens.matches2(m.TokenType._export, m.TokenType._class) ||
            this.tokens.matches3(
              m.TokenType._export,
              m.TokenType._abstract,
              m.TokenType._class
            ) ||
            this.tokens.matches2(m.TokenType._export, m.TokenType.at)
          )
            return this.processExportClass(), !0;
          if (this.tokens.matches2(m.TokenType._export, m.TokenType.braceL))
            return this.processExportBindings(), !0;
          if (this.tokens.matches2(m.TokenType._export, m.TokenType.star))
            return this.processExportStar(), !0;
          if (
            this.tokens.matches2(m.TokenType._export, m.TokenType.name) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              Gn.ContextualKeyword._type
            )
          ) {
            if (
              (this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.matches1(m.TokenType.braceL))
            ) {
              for (; !this.tokens.matches1(m.TokenType.braceR); )
                this.tokens.removeToken();
              this.tokens.removeToken();
            } else
              this.tokens.removeToken(),
                this.tokens.matches1(m.TokenType._as) &&
                  (this.tokens.removeToken(), this.tokens.removeToken());
            return (
              this.tokens.matchesContextual(Gn.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  m.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                xs.removeMaybeImportAssertion.call(void 0, this.tokens)),
              !0
            );
          } else throw new Error('Unrecognized export syntax.');
        }
        processAssignment() {
          let t = this.tokens.currentIndex(),
            n = this.tokens.tokens[t - 1];
          if (
            n.isType ||
            n.type !== m.TokenType.name ||
            n.shadowsGlobal ||
            (t >= 2 && this.tokens.matches1AtIndex(t - 2, m.TokenType.dot)) ||
            (t >= 2 &&
              [m.TokenType._var, m.TokenType._let, m.TokenType._const].includes(
                this.tokens.tokens[t - 2].type
              ))
          )
            return !1;
          let o = this.importProcessor.resolveExportBinding(
            this.tokens.identifierNameForToken(n)
          );
          return o
            ? (this.tokens.copyToken(), this.tokens.appendCode(` ${o} =`), !0)
            : !1;
        }
        processComplexAssignment() {
          let t = this.tokens.currentIndex(),
            n = this.tokens.tokens[t - 1];
          if (
            n.type !== m.TokenType.name ||
            n.shadowsGlobal ||
            (t >= 2 && this.tokens.matches1AtIndex(t - 2, m.TokenType.dot))
          )
            return !1;
          let o = this.importProcessor.resolveExportBinding(
            this.tokens.identifierNameForToken(n)
          );
          return o
            ? (this.tokens.appendCode(` = ${o}`), this.tokens.copyToken(), !0)
            : !1;
        }
        processPreIncDec() {
          let t = this.tokens.currentIndex(),
            n = this.tokens.tokens[t + 1];
          if (
            n.type !== m.TokenType.name ||
            n.shadowsGlobal ||
            (t + 2 < this.tokens.tokens.length &&
              (this.tokens.matches1AtIndex(t + 2, m.TokenType.dot) ||
                this.tokens.matches1AtIndex(t + 2, m.TokenType.bracketL) ||
                this.tokens.matches1AtIndex(t + 2, m.TokenType.parenL)))
          )
            return !1;
          let o = this.tokens.identifierNameForToken(n),
            r = this.importProcessor.resolveExportBinding(o);
          return r
            ? (this.tokens.appendCode(`${r} = `), this.tokens.copyToken(), !0)
            : !1;
        }
        processPostIncDec() {
          let t = this.tokens.currentIndex(),
            n = this.tokens.tokens[t],
            o = this.tokens.tokens[t + 1];
          if (
            n.type !== m.TokenType.name ||
            n.shadowsGlobal ||
            (t >= 1 && this.tokens.matches1AtIndex(t - 1, m.TokenType.dot))
          )
            return !1;
          let r = this.tokens.identifierNameForToken(n),
            s = this.importProcessor.resolveExportBinding(r);
          if (!s) return !1;
          let i = this.tokens.rawCodeForToken(o),
            a = this.importProcessor.getIdentifierReplacement(r) || r;
          if (i === '++')
            this.tokens.replaceToken(`(${a} = ${s} = ${a} + 1, ${a} - 1)`);
          else if (i === '--')
            this.tokens.replaceToken(`(${a} = ${s} = ${a} - 1, ${a} + 1)`);
          else throw new Error(`Unexpected operator: ${i}`);
          return this.tokens.removeToken(), !0;
        }
        processExportDefault() {
          if (
            this.tokens.matches4(
              m.TokenType._export,
              m.TokenType._default,
              m.TokenType._function,
              m.TokenType.name
            ) ||
            (this.tokens.matches5(
              m.TokenType._export,
              m.TokenType._default,
              m.TokenType.name,
              m.TokenType._function,
              m.TokenType.name
            ) &&
              this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 2,
                Gn.ContextualKeyword._async
              ))
          ) {
            this.tokens.removeInitialToken(), this.tokens.removeToken();
            let t = this.processNamedFunction();
            this.tokens.appendCode(` exports.default = ${t};`);
          } else if (
            this.tokens.matches4(
              m.TokenType._export,
              m.TokenType._default,
              m.TokenType._class,
              m.TokenType.name
            ) ||
            this.tokens.matches5(
              m.TokenType._export,
              m.TokenType._default,
              m.TokenType._abstract,
              m.TokenType._class,
              m.TokenType.name
            ) ||
            this.tokens.matches3(
              m.TokenType._export,
              m.TokenType._default,
              m.TokenType.at
            )
          ) {
            this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.copyDecorators(),
              this.tokens.matches1(m.TokenType._abstract) &&
                this.tokens.removeToken();
            let t = this.rootTransformer.processNamedClass();
            this.tokens.appendCode(` exports.default = ${t};`);
          } else if (
            s0.default.call(
              void 0,
              this.isTypeScriptTransformEnabled,
              this.tokens,
              this.declarationInfo
            )
          )
            this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.removeToken();
          else if (this.reactHotLoaderTransformer) {
            let t = this.nameManager.claimFreeName('_default');
            this.tokens.replaceToken(`let ${t}; exports.`),
              this.tokens.copyToken(),
              this.tokens.appendCode(` = ${t} =`),
              this.reactHotLoaderTransformer.setExtractedDefaultExportName(t);
          } else
            this.tokens.replaceToken('exports.'),
              this.tokens.copyToken(),
              this.tokens.appendCode(' =');
        }
        copyDecorators() {
          for (; this.tokens.matches1(m.TokenType.at); )
            if (
              (this.tokens.copyToken(),
              this.tokens.matches1(m.TokenType.parenL))
            )
              this.tokens.copyExpectedToken(m.TokenType.parenL),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(m.TokenType.parenR);
            else {
              for (
                this.tokens.copyExpectedToken(m.TokenType.name);
                this.tokens.matches1(m.TokenType.dot);

              )
                this.tokens.copyExpectedToken(m.TokenType.dot),
                  this.tokens.copyExpectedToken(m.TokenType.name);
              this.tokens.matches1(m.TokenType.parenL) &&
                (this.tokens.copyExpectedToken(m.TokenType.parenL),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(m.TokenType.parenR));
            }
        }
        processExportVar() {
          this.isSimpleExportVar()
            ? this.processSimpleExportVar()
            : this.processComplexExportVar();
        }
        isSimpleExportVar() {
          let t = this.tokens.currentIndex();
          if ((t++, t++, !this.tokens.matches1AtIndex(t, m.TokenType.name)))
            return !1;
          for (
            t++;
            t < this.tokens.tokens.length && this.tokens.tokens[t].isType;

          )
            t++;
          return !!this.tokens.matches1AtIndex(t, m.TokenType.eq);
        }
        processSimpleExportVar() {
          this.tokens.removeInitialToken(), this.tokens.copyToken();
          let t = this.tokens.identifierName();
          for (; !this.tokens.matches1(m.TokenType.eq); )
            this.rootTransformer.processToken();
          let n = this.tokens.currentToken().rhsEndIndex;
          if (n == null) throw new Error('Expected = token with an end index.');
          for (; this.tokens.currentIndex() < n; )
            this.rootTransformer.processToken();
          this.tokens.appendCode(`; exports.${t} = ${t}`);
        }
        processComplexExportVar() {
          this.tokens.removeInitialToken(), this.tokens.removeToken();
          let t = this.tokens.matches1(m.TokenType.braceL);
          t && this.tokens.appendCode('(');
          let n = 0;
          for (;;)
            if (
              this.tokens.matches1(m.TokenType.braceL) ||
              this.tokens.matches1(m.TokenType.dollarBraceL) ||
              this.tokens.matches1(m.TokenType.bracketL)
            )
              n++, this.tokens.copyToken();
            else if (
              this.tokens.matches1(m.TokenType.braceR) ||
              this.tokens.matches1(m.TokenType.bracketR)
            )
              n--, this.tokens.copyToken();
            else {
              if (
                n === 0 &&
                !this.tokens.matches1(m.TokenType.name) &&
                !this.tokens.currentToken().isType
              )
                break;
              if (this.tokens.matches1(m.TokenType.eq)) {
                let o = this.tokens.currentToken().rhsEndIndex;
                if (o == null)
                  throw new Error('Expected = token with an end index.');
                for (; this.tokens.currentIndex() < o; )
                  this.rootTransformer.processToken();
              } else {
                let o = this.tokens.currentToken();
                if (_s.isDeclaration.call(void 0, o)) {
                  let r = this.tokens.identifierName(),
                    s = this.importProcessor.getIdentifierReplacement(r);
                  if (s === null)
                    throw new Error(
                      `Expected a replacement for ${r} in \`export var\` syntax.`
                    );
                  _s.isObjectShorthandDeclaration.call(void 0, o) &&
                    (s = `${r}: ${s}`),
                    this.tokens.replaceToken(s);
                } else this.rootTransformer.processToken();
              }
            }
          if (t) {
            let o = this.tokens.currentToken().rhsEndIndex;
            if (o == null)
              throw new Error('Expected = token with an end index.');
            for (; this.tokens.currentIndex() < o; )
              this.rootTransformer.processToken();
            this.tokens.appendCode(')');
          }
        }
        processExportFunction() {
          this.tokens.replaceToken('');
          let t = this.processNamedFunction();
          this.tokens.appendCode(` exports.${t} = ${t};`);
        }
        processNamedFunction() {
          if (this.tokens.matches1(m.TokenType._function))
            this.tokens.copyToken();
          else if (
            this.tokens.matches2(m.TokenType.name, m.TokenType._function)
          ) {
            if (!this.tokens.matchesContextual(Gn.ContextualKeyword._async))
              throw new Error('Expected async keyword in function export.');
            this.tokens.copyToken(), this.tokens.copyToken();
          }
          if (
            (this.tokens.matches1(m.TokenType.star) && this.tokens.copyToken(),
            !this.tokens.matches1(m.TokenType.name))
          )
            throw new Error('Expected identifier for exported function name.');
          let t = this.tokens.identifierName();
          if ((this.tokens.copyToken(), this.tokens.currentToken().isType))
            for (
              this.tokens.removeInitialToken();
              this.tokens.currentToken().isType;

            )
              this.tokens.removeToken();
          return (
            this.tokens.copyExpectedToken(m.TokenType.parenL),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(m.TokenType.parenR),
            this.rootTransformer.processPossibleTypeRange(),
            this.tokens.copyExpectedToken(m.TokenType.braceL),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(m.TokenType.braceR),
            t
          );
        }
        processExportClass() {
          this.tokens.removeInitialToken(),
            this.copyDecorators(),
            this.tokens.matches1(m.TokenType._abstract) &&
              this.tokens.removeToken();
          let t = this.rootTransformer.processNamedClass();
          this.tokens.appendCode(` exports.${t} = ${t};`);
        }
        processExportBindings() {
          this.tokens.removeInitialToken(), this.tokens.removeToken();
          let t = [];
          for (;;) {
            if (this.tokens.matches1(m.TokenType.braceR)) {
              this.tokens.removeToken();
              break;
            }
            let n = o0.default.call(void 0, this.tokens);
            for (; this.tokens.currentIndex() < n.endIndex; )
              this.tokens.removeToken();
            if (!n.isType && !this.shouldElideExportedIdentifier(n.leftName)) {
              let o = n.leftName,
                r = n.rightName,
                s = this.importProcessor.getIdentifierReplacement(o);
              t.push(`exports.${r} = ${s || o};`);
            }
            if (this.tokens.matches1(m.TokenType.braceR)) {
              this.tokens.removeToken();
              break;
            }
            if (this.tokens.matches2(m.TokenType.comma, m.TokenType.braceR)) {
              this.tokens.removeToken(), this.tokens.removeToken();
              break;
            } else if (this.tokens.matches1(m.TokenType.comma))
              this.tokens.removeToken();
            else
              throw new Error(
                `Unexpected token: ${JSON.stringify(
                  this.tokens.currentToken()
                )}`
              );
          }
          if (this.tokens.matchesContextual(Gn.ContextualKeyword._from)) {
            this.tokens.removeToken();
            let n = this.tokens.stringValue();
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              this.importProcessor.claimImportCode(n)
            ),
              xs.removeMaybeImportAssertion.call(void 0, this.tokens);
          } else this.tokens.appendCode(t.join(' '));
          this.tokens.matches1(m.TokenType.semi) && this.tokens.removeToken();
        }
        processExportStar() {
          for (
            this.tokens.removeInitialToken();
            !this.tokens.matches1(m.TokenType.string);

          )
            this.tokens.removeToken();
          let t = this.tokens.stringValue();
          this.tokens.replaceTokenTrimmingLeftWhitespace(
            this.importProcessor.claimImportCode(t)
          ),
            xs.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(m.TokenType.semi) && this.tokens.removeToken();
        }
        shouldElideExportedIdentifier(t) {
          return (
            this.isTypeScriptTransformEnabled &&
            !this.declarationInfo.valueDeclarations.has(t)
          );
        }
      };
    _1.default = v1;
  });
  var qp = H((g1) => {
    'use strict';
    Object.defineProperty(g1, '__esModule', {value: !0});
    function ir(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var yn = Ge(),
      W = ce(),
      l0 = f1(),
      c0 = ir(l0),
      Kp = h1(),
      u0 = ir(Kp),
      p0 = Ko(),
      Bp = ir(p0),
      d0 = Gi(),
      jp = y1(),
      f0 = k1(),
      h0 = ir(f0),
      T0 = Nt(),
      y0 = ir(T0),
      x1 = class extends y0.default {
        constructor(t, n, o, r, s, i) {
          super(),
            (this.tokens = t),
            (this.nameManager = n),
            (this.helperManager = o),
            (this.reactHotLoaderTransformer = r),
            (this.isTypeScriptTransformEnabled = s),
            (this.nonTypeIdentifiers = s
              ? d0.getNonTypeIdentifiers.call(void 0, t, i)
              : new Set()),
            (this.declarationInfo = s
              ? u0.default.call(void 0, t)
              : Kp.EMPTY_DECLARATION_INFO),
            (this.injectCreateRequireForImportRequire =
              !!i.injectCreateRequireForImportRequire);
        }
        process() {
          if (
            this.tokens.matches3(
              W.TokenType._import,
              W.TokenType.name,
              W.TokenType.eq
            )
          )
            return this.processImportEquals();
          if (
            this.tokens.matches4(
              W.TokenType._import,
              W.TokenType.name,
              W.TokenType.name,
              W.TokenType.eq
            ) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              yn.ContextualKeyword._type
            )
          ) {
            this.tokens.removeInitialToken();
            for (let t = 0; t < 7; t++) this.tokens.removeToken();
            return !0;
          }
          if (this.tokens.matches2(W.TokenType._export, W.TokenType.eq))
            return this.tokens.replaceToken('module.exports'), !0;
          if (
            this.tokens.matches5(
              W.TokenType._export,
              W.TokenType._import,
              W.TokenType.name,
              W.TokenType.name,
              W.TokenType.eq
            ) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 2,
              yn.ContextualKeyword._type
            )
          ) {
            this.tokens.removeInitialToken();
            for (let t = 0; t < 8; t++) this.tokens.removeToken();
            return !0;
          }
          if (this.tokens.matches1(W.TokenType._import))
            return this.processImport();
          if (this.tokens.matches2(W.TokenType._export, W.TokenType._default))
            return this.processExportDefault();
          if (this.tokens.matches2(W.TokenType._export, W.TokenType.braceL))
            return this.processNamedExports();
          if (
            this.tokens.matches2(W.TokenType._export, W.TokenType.name) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              yn.ContextualKeyword._type
            )
          ) {
            if (
              (this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.matches1(W.TokenType.braceL))
            ) {
              for (; !this.tokens.matches1(W.TokenType.braceR); )
                this.tokens.removeToken();
              this.tokens.removeToken();
            } else
              this.tokens.removeToken(),
                this.tokens.matches1(W.TokenType._as) &&
                  (this.tokens.removeToken(), this.tokens.removeToken());
            return (
              this.tokens.matchesContextual(yn.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  W.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                jp.removeMaybeImportAssertion.call(void 0, this.tokens)),
              !0
            );
          }
          return !1;
        }
        processImportEquals() {
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return (
            this.isTypeName(t)
              ? c0.default.call(void 0, this.tokens)
              : this.injectCreateRequireForImportRequire
              ? (this.tokens.replaceToken('const'),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.tokens.replaceToken(
                  this.helperManager.getHelperName('require')
                ))
              : this.tokens.replaceToken('const'),
            !0
          );
        }
        processImport() {
          if (this.tokens.matches2(W.TokenType._import, W.TokenType.parenL))
            return !1;
          let t = this.tokens.snapshot();
          if (this.removeImportTypeBindings()) {
            for (
              this.tokens.restoreToSnapshot(t);
              !this.tokens.matches1(W.TokenType.string);

            )
              this.tokens.removeToken();
            this.tokens.removeToken(),
              jp.removeMaybeImportAssertion.call(void 0, this.tokens),
              this.tokens.matches1(W.TokenType.semi) &&
                this.tokens.removeToken();
          }
          return !0;
        }
        removeImportTypeBindings() {
          if (
            (this.tokens.copyExpectedToken(W.TokenType._import),
            this.tokens.matchesContextual(yn.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                W.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                yn.ContextualKeyword._from
              ))
          )
            return !0;
          if (this.tokens.matches1(W.TokenType.string))
            return this.tokens.copyToken(), !1;
          this.tokens.matchesContextual(yn.ContextualKeyword._module) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 2,
              yn.ContextualKeyword._from
            ) &&
            this.tokens.copyToken();
          let t = !1,
            n = !1;
          if (
            (this.tokens.matches1(W.TokenType.name) &&
              (this.isTypeName(this.tokens.identifierName())
                ? (this.tokens.removeToken(),
                  this.tokens.matches1(W.TokenType.comma) &&
                    this.tokens.removeToken())
                : ((t = !0),
                  this.tokens.copyToken(),
                  this.tokens.matches1(W.TokenType.comma) &&
                    ((n = !0), this.tokens.removeToken()))),
            this.tokens.matches1(W.TokenType.star))
          )
            this.isTypeName(this.tokens.identifierNameAtRelativeIndex(2))
              ? (this.tokens.removeToken(),
                this.tokens.removeToken(),
                this.tokens.removeToken())
              : (n && this.tokens.appendCode(','),
                (t = !0),
                this.tokens.copyExpectedToken(W.TokenType.star),
                this.tokens.copyExpectedToken(W.TokenType.name),
                this.tokens.copyExpectedToken(W.TokenType.name));
          else if (this.tokens.matches1(W.TokenType.braceL)) {
            for (
              n && this.tokens.appendCode(','), this.tokens.copyToken();
              !this.tokens.matches1(W.TokenType.braceR);

            ) {
              let o = Bp.default.call(void 0, this.tokens);
              if (o.isType || this.isTypeName(o.rightName)) {
                for (; this.tokens.currentIndex() < o.endIndex; )
                  this.tokens.removeToken();
                this.tokens.matches1(W.TokenType.comma) &&
                  this.tokens.removeToken();
              } else {
                for (t = !0; this.tokens.currentIndex() < o.endIndex; )
                  this.tokens.copyToken();
                this.tokens.matches1(W.TokenType.comma) &&
                  this.tokens.copyToken();
              }
            }
            this.tokens.copyExpectedToken(W.TokenType.braceR);
          }
          return !t;
        }
        isTypeName(t) {
          return (
            this.isTypeScriptTransformEnabled && !this.nonTypeIdentifiers.has(t)
          );
        }
        processExportDefault() {
          if (
            h0.default.call(
              void 0,
              this.isTypeScriptTransformEnabled,
              this.tokens,
              this.declarationInfo
            )
          )
            return (
              this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.removeToken(),
              !0
            );
          if (
            !(
              this.tokens.matches4(
                W.TokenType._export,
                W.TokenType._default,
                W.TokenType._function,
                W.TokenType.name
              ) ||
              (this.tokens.matches5(
                W.TokenType._export,
                W.TokenType._default,
                W.TokenType.name,
                W.TokenType._function,
                W.TokenType.name
              ) &&
                this.tokens.matchesContextualAtIndex(
                  this.tokens.currentIndex() + 2,
                  yn.ContextualKeyword._async
                )) ||
              this.tokens.matches4(
                W.TokenType._export,
                W.TokenType._default,
                W.TokenType._class,
                W.TokenType.name
              ) ||
              this.tokens.matches5(
                W.TokenType._export,
                W.TokenType._default,
                W.TokenType._abstract,
                W.TokenType._class,
                W.TokenType.name
              )
            ) &&
            this.reactHotLoaderTransformer
          ) {
            let n = this.nameManager.claimFreeName('_default');
            return (
              this.tokens.replaceToken(`let ${n}; export`),
              this.tokens.copyToken(),
              this.tokens.appendCode(` ${n} =`),
              this.reactHotLoaderTransformer.setExtractedDefaultExportName(n),
              !0
            );
          }
          return !1;
        }
        processNamedExports() {
          if (!this.isTypeScriptTransformEnabled) return !1;
          for (
            this.tokens.copyExpectedToken(W.TokenType._export),
              this.tokens.copyExpectedToken(W.TokenType.braceL);
            !this.tokens.matches1(W.TokenType.braceR);

          ) {
            let t = Bp.default.call(void 0, this.tokens);
            if (t.isType || this.shouldElideExportedName(t.leftName)) {
              for (; this.tokens.currentIndex() < t.endIndex; )
                this.tokens.removeToken();
              this.tokens.matches1(W.TokenType.comma) &&
                this.tokens.removeToken();
            } else {
              for (; this.tokens.currentIndex() < t.endIndex; )
                this.tokens.copyToken();
              this.tokens.matches1(W.TokenType.comma) &&
                this.tokens.copyToken();
            }
          }
          return this.tokens.copyExpectedToken(W.TokenType.braceR), !0;
        }
        shouldElideExportedName(t) {
          return (
            this.isTypeScriptTransformEnabled &&
            this.declarationInfo.typeDeclarations.has(t) &&
            !this.declarationInfo.valueDeclarations.has(t)
          );
        }
      };
    g1.default = x1;
  });
  var Up = H((w1) => {
    'use strict';
    Object.defineProperty(w1, '__esModule', {value: !0});
    function m0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Hp = Ge(),
      bt = ce(),
      k0 = Nt(),
      v0 = m0(k0),
      C1 = class extends v0.default {
        constructor(t, n, o) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.isImportsTransformEnabled = o);
        }
        process() {
          return this.rootTransformer.processPossibleArrowParamEnd() ||
            this.rootTransformer.processPossibleAsyncArrowWithTypeParams() ||
            this.rootTransformer.processPossibleTypeRange()
            ? !0
            : this.tokens.matches1(bt.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2(bt.TokenType._export, bt.TokenType._enum)
            ? (this.processNamedExportEnum(), !0)
            : this.tokens.matches3(
                bt.TokenType._export,
                bt.TokenType._default,
                bt.TokenType._enum
              )
            ? (this.processDefaultExportEnum(), !0)
            : !1;
        }
        processNamedExportEnum() {
          if (this.isImportsTransformEnabled) {
            this.tokens.removeInitialToken();
            let t = this.tokens.identifierNameAtRelativeIndex(1);
            this.processEnum(), this.tokens.appendCode(` exports.${t} = ${t};`);
          } else this.tokens.copyToken(), this.processEnum();
        }
        processDefaultExportEnum() {
          this.tokens.removeInitialToken(), this.tokens.removeToken();
          let t = this.tokens.identifierNameAtRelativeIndex(1);
          this.processEnum(),
            this.isImportsTransformEnabled
              ? this.tokens.appendCode(` exports.default = ${t};`)
              : this.tokens.appendCode(` export default ${t};`);
        }
        processEnum() {
          this.tokens.replaceToken('const'),
            this.tokens.copyExpectedToken(bt.TokenType.name);
          let t = !1;
          this.tokens.matchesContextual(Hp.ContextualKeyword._of) &&
            (this.tokens.removeToken(),
            (t = this.tokens.matchesContextual(Hp.ContextualKeyword._symbol)),
            this.tokens.removeToken());
          let n = this.tokens.matches3(
            bt.TokenType.braceL,
            bt.TokenType.name,
            bt.TokenType.eq
          );
          this.tokens.appendCode(' = require("flow-enums-runtime")');
          let o = !t && !n;
          for (
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              o ? '.Mirrored([' : '({'
            );
            !this.tokens.matches1(bt.TokenType.braceR);

          ) {
            if (this.tokens.matches1(bt.TokenType.ellipsis)) {
              this.tokens.removeToken();
              break;
            }
            this.processEnumElement(t, n),
              this.tokens.matches1(bt.TokenType.comma) &&
                this.tokens.copyToken();
          }
          this.tokens.replaceToken(o ? ']);' : '});');
        }
        processEnumElement(t, n) {
          if (t) {
            let o = this.tokens.identifierName();
            this.tokens.copyToken(), this.tokens.appendCode(`: Symbol("${o}")`);
          } else
            n
              ? (this.tokens.copyToken(),
                this.tokens.replaceTokenTrimmingLeftWhitespace(':'),
                this.tokens.copyToken())
              : this.tokens.replaceToken(`"${this.tokens.identifierName()}"`);
        }
      };
    w1.default = C1;
  });
  var Wp = H((S1) => {
    'use strict';
    Object.defineProperty(S1, '__esModule', {value: !0});
    function _0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    function x0(e) {
      let t,
        n = e[0],
        o = 1;
      for (; o < e.length; ) {
        let r = e[o],
          s = e[o + 1];
        if (
          ((o += 2),
          (r === 'optionalAccess' || r === 'optionalCall') && n == null)
        )
          return;
        r === 'access' || r === 'optionalAccess'
          ? ((t = n), (n = s(n)))
          : (r === 'call' || r === 'optionalCall') &&
            ((n = s((...i) => n.call(t, ...i))), (t = void 0));
      }
      return n;
    }
    var mn = ce(),
      g0 = Nt(),
      C0 = _0(g0),
      gs = 'jest',
      w0 = ['mock', 'unmock', 'enableAutomock', 'disableAutomock'],
      I1 = class e extends C0.default {
        __init() {
          this.hoistedFunctionNames = [];
        }
        constructor(t, n, o, r) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.nameManager = o),
            (this.importProcessor = r),
            e.prototype.__init.call(this);
        }
        process() {
          return this.tokens.currentToken().scopeDepth === 0 &&
            this.tokens.matches4(
              mn.TokenType.name,
              mn.TokenType.dot,
              mn.TokenType.name,
              mn.TokenType.parenL
            ) &&
            this.tokens.identifierName() === gs
            ? x0([
                this,
                'access',
                (t) => t.importProcessor,
                'optionalAccess',
                (t) => t.getGlobalNames,
                'call',
                (t) => t(),
                'optionalAccess',
                (t) => t.has,
                'call',
                (t) => t(gs),
              ])
              ? !1
              : this.extractHoistedCalls()
            : !1;
        }
        getHoistedCode() {
          return this.hoistedFunctionNames.length > 0
            ? this.hoistedFunctionNames.map((t) => `${t}();`).join('')
            : '';
        }
        extractHoistedCalls() {
          this.tokens.removeToken();
          let t = !1;
          for (
            ;
            this.tokens.matches3(
              mn.TokenType.dot,
              mn.TokenType.name,
              mn.TokenType.parenL
            );

          ) {
            let n = this.tokens.identifierNameAtIndex(
              this.tokens.currentIndex() + 1
            );
            if (w0.includes(n)) {
              let r = this.nameManager.claimFreeName('__jestHoist');
              this.hoistedFunctionNames.push(r),
                this.tokens.replaceToken(`function ${r}(){${gs}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(mn.TokenType.parenR),
                this.tokens.appendCode(';}'),
                (t = !1);
            } else
              t ? this.tokens.copyToken() : this.tokens.replaceToken(`${gs}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(mn.TokenType.parenR),
                (t = !0);
          }
          return !0;
        }
      };
    S1.default = I1;
  });
  var Vp = H((E1) => {
    'use strict';
    Object.defineProperty(E1, '__esModule', {value: !0});
    function I0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var S0 = ce(),
      b0 = Nt(),
      E0 = I0(b0),
      b1 = class extends E0.default {
        constructor(t) {
          super(), (this.tokens = t);
        }
        process() {
          if (this.tokens.matches1(S0.TokenType.num)) {
            let t = this.tokens.currentTokenCode();
            if (t.includes('_'))
              return this.tokens.replaceToken(t.replace(/_/g, '')), !0;
          }
          return !1;
        }
      };
    E1.default = b1;
  });
  var Xp = H((P1) => {
    'use strict';
    Object.defineProperty(P1, '__esModule', {value: !0});
    function A0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var zp = ce(),
      P0 = Nt(),
      R0 = A0(P0),
      A1 = class extends R0.default {
        constructor(t, n) {
          super(), (this.tokens = t), (this.nameManager = n);
        }
        process() {
          return this.tokens.matches2(zp.TokenType._catch, zp.TokenType.braceL)
            ? (this.tokens.copyToken(),
              this.tokens.appendCode(
                ` (${this.nameManager.claimFreeName('e')})`
              ),
              !0)
            : !1;
        }
      };
    P1.default = A1;
  });
  var Yp = H((N1) => {
    'use strict';
    Object.defineProperty(N1, '__esModule', {value: !0});
    function N0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var lt = ce(),
      D0 = Nt(),
      O0 = N0(D0),
      R1 = class extends O0.default {
        constructor(t, n) {
          super(), (this.tokens = t), (this.nameManager = n);
        }
        process() {
          if (this.tokens.matches1(lt.TokenType.nullishCoalescing)) {
            let o = this.tokens.currentToken();
            return (
              this.tokens.tokens[o.nullishStartIndex].isAsyncOperation
                ? this.tokens.replaceTokenTrimmingLeftWhitespace(
                    ', async () => ('
                  )
                : this.tokens.replaceTokenTrimmingLeftWhitespace(', () => ('),
              !0
            );
          }
          if (
            this.tokens.matches1(lt.TokenType._delete) &&
            this.tokens.tokenAtRelativeIndex(1).isOptionalChainStart
          )
            return this.tokens.removeInitialToken(), !0;
          let n = this.tokens.currentToken().subscriptStartIndex;
          if (
            n != null &&
            this.tokens.tokens[n].isOptionalChainStart &&
            this.tokens.tokenAtRelativeIndex(-1).type !== lt.TokenType._super
          ) {
            let o = this.nameManager.claimFreeName('_'),
              r;
            if (
              (n > 0 &&
              this.tokens.matches1AtIndex(n - 1, lt.TokenType._delete) &&
              this.isLastSubscriptInChain()
                ? (r = `${o} => delete ${o}`)
                : (r = `${o} => ${o}`),
              this.tokens.tokens[n].isAsyncOperation && (r = `async ${r}`),
              this.tokens.matches2(
                lt.TokenType.questionDot,
                lt.TokenType.parenL
              ) ||
                this.tokens.matches2(
                  lt.TokenType.questionDot,
                  lt.TokenType.lessThan
                ))
            )
              this.justSkippedSuper() && this.tokens.appendCode('.bind(this)'),
                this.tokens.replaceTokenTrimmingLeftWhitespace(
                  `, 'optionalCall', ${r}`
                );
            else if (
              this.tokens.matches2(
                lt.TokenType.questionDot,
                lt.TokenType.bracketL
              )
            )
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}`
              );
            else if (this.tokens.matches1(lt.TokenType.questionDot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}.`
              );
            else if (this.tokens.matches1(lt.TokenType.dot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}.`
              );
            else if (this.tokens.matches1(lt.TokenType.bracketL))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}[`
              );
            else if (this.tokens.matches1(lt.TokenType.parenL))
              this.justSkippedSuper() && this.tokens.appendCode('.bind(this)'),
                this.tokens.replaceTokenTrimmingLeftWhitespace(
                  `, 'call', ${r}(`
                );
            else
              throw new Error(
                'Unexpected subscript operator in optional chain.'
              );
            return !0;
          }
          return !1;
        }
        isLastSubscriptInChain() {
          let t = 0;
          for (let n = this.tokens.currentIndex() + 1; ; n++) {
            if (n >= this.tokens.tokens.length)
              throw new Error(
                'Reached the end of the code while finding the end of the access chain.'
              );
            if (
              (this.tokens.tokens[n].isOptionalChainStart
                ? t++
                : this.tokens.tokens[n].isOptionalChainEnd && t--,
              t < 0)
            )
              return !0;
            if (t === 0 && this.tokens.tokens[n].subscriptStartIndex != null)
              return !1;
          }
        }
        justSkippedSuper() {
          let t = 0,
            n = this.tokens.currentIndex() - 1;
          for (;;) {
            if (n < 0)
              throw new Error(
                'Reached the start of the code while finding the start of the access chain.'
              );
            if (
              (this.tokens.tokens[n].isOptionalChainStart
                ? t--
                : this.tokens.tokens[n].isOptionalChainEnd && t++,
              t < 0)
            )
              return !1;
            if (t === 0 && this.tokens.tokens[n].subscriptStartIndex != null)
              return this.tokens.tokens[n - 1].type === lt.TokenType._super;
            n--;
          }
        }
      };
    N1.default = R1;
  });
  var Jp = H((O1) => {
    'use strict';
    Object.defineProperty(O1, '__esModule', {value: !0});
    function M0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Gp = Ve(),
      Je = ce(),
      L0 = Nt(),
      F0 = M0(L0),
      D1 = class extends F0.default {
        constructor(t, n, o, r) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.importProcessor = o),
            (this.options = r);
        }
        process() {
          let t = this.tokens.currentIndex();
          if (this.tokens.identifierName() === 'createReactClass') {
            let n =
              this.importProcessor &&
              this.importProcessor.getIdentifierReplacement('createReactClass');
            return (
              n
                ? this.tokens.replaceToken(`(0, ${n})`)
                : this.tokens.copyToken(),
              this.tryProcessCreateClassCall(t),
              !0
            );
          }
          if (
            this.tokens.matches3(
              Je.TokenType.name,
              Je.TokenType.dot,
              Je.TokenType.name
            ) &&
            this.tokens.identifierName() === 'React' &&
            this.tokens.identifierNameAtIndex(
              this.tokens.currentIndex() + 2
            ) === 'createClass'
          ) {
            let n =
              (this.importProcessor &&
                this.importProcessor.getIdentifierReplacement('React')) ||
              'React';
            return (
              n
                ? (this.tokens.replaceToken(n),
                  this.tokens.copyToken(),
                  this.tokens.copyToken())
                : (this.tokens.copyToken(),
                  this.tokens.copyToken(),
                  this.tokens.copyToken()),
              this.tryProcessCreateClassCall(t),
              !0
            );
          }
          return !1;
        }
        tryProcessCreateClassCall(t) {
          let n = this.findDisplayName(t);
          n &&
            this.classNeedsDisplayName() &&
            (this.tokens.copyExpectedToken(Je.TokenType.parenL),
            this.tokens.copyExpectedToken(Je.TokenType.braceL),
            this.tokens.appendCode(`displayName: '${n}',`),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(Je.TokenType.braceR),
            this.tokens.copyExpectedToken(Je.TokenType.parenR));
        }
        findDisplayName(t) {
          return t < 2
            ? null
            : this.tokens.matches2AtIndex(
                t - 2,
                Je.TokenType.name,
                Je.TokenType.eq
              )
            ? this.tokens.identifierNameAtIndex(t - 2)
            : t >= 2 &&
              this.tokens.tokens[t - 2].identifierRole ===
                Gp.IdentifierRole.ObjectKey
            ? this.tokens.identifierNameAtIndex(t - 2)
            : this.tokens.matches2AtIndex(
                t - 2,
                Je.TokenType._export,
                Je.TokenType._default
              )
            ? this.getDisplayNameFromFilename()
            : null;
        }
        getDisplayNameFromFilename() {
          let n = (this.options.filePath || 'unknown').split('/'),
            o = n[n.length - 1],
            r = o.lastIndexOf('.'),
            s = r === -1 ? o : o.slice(0, r);
          return s === 'index' && n[n.length - 2] ? n[n.length - 2] : s;
        }
        classNeedsDisplayName() {
          let t = this.tokens.currentIndex();
          if (!this.tokens.matches2(Je.TokenType.parenL, Je.TokenType.braceL))
            return !1;
          let n = t + 1,
            o = this.tokens.tokens[n].contextId;
          if (o == null)
            throw new Error(
              'Expected non-null context ID on object open-brace.'
            );
          for (; t < this.tokens.tokens.length; t++) {
            let r = this.tokens.tokens[t];
            if (r.type === Je.TokenType.braceR && r.contextId === o) {
              t++;
              break;
            }
            if (
              this.tokens.identifierNameAtIndex(t) === 'displayName' &&
              this.tokens.tokens[t].identifierRole ===
                Gp.IdentifierRole.ObjectKey &&
              r.contextId === o
            )
              return !1;
          }
          if (t === this.tokens.tokens.length)
            throw new Error(
              'Unexpected end of input when processing React class.'
            );
          return (
            this.tokens.matches1AtIndex(t, Je.TokenType.parenR) ||
            this.tokens.matches2AtIndex(
              t,
              Je.TokenType.comma,
              Je.TokenType.parenR
            )
          );
        }
      };
    O1.default = D1;
  });
  var Zp = H((L1) => {
    'use strict';
    Object.defineProperty(L1, '__esModule', {value: !0});
    function $0(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Qp = Ve(),
      B0 = Nt(),
      j0 = $0(B0),
      M1 = class e extends j0.default {
        __init() {
          this.extractedDefaultExportName = null;
        }
        constructor(t, n) {
          super(),
            (this.tokens = t),
            (this.filePath = n),
            e.prototype.__init.call(this);
        }
        setExtractedDefaultExportName(t) {
          this.extractedDefaultExportName = t;
        }
        getPrefixCode() {
          return `
      (function () {
        var enterModule = require('react-hot-loader').enterModule;
        enterModule && enterModule(module);
      })();`
            .replace(/\s+/g, ' ')
            .trim();
        }
        getSuffixCode() {
          let t = new Set();
          for (let o of this.tokens.tokens)
            !o.isType &&
              Qp.isTopLevelDeclaration.call(void 0, o) &&
              o.identifierRole !== Qp.IdentifierRole.ImportDeclaration &&
              t.add(this.tokens.identifierNameForToken(o));
          let n = Array.from(t).map((o) => ({
            variableName: o,
            uniqueLocalName: o,
          }));
          return (
            this.extractedDefaultExportName &&
              n.push({
                variableName: this.extractedDefaultExportName,
                uniqueLocalName: 'default',
              }),
            `
;(function () {
  var reactHotLoader = require('react-hot-loader').default;
  var leaveModule = require('react-hot-loader').leaveModule;
  if (!reactHotLoader) {
    return;
  }
${n.map(
  ({variableName: o, uniqueLocalName: r}) =>
    `  reactHotLoader.register(${o}, "${r}", ${JSON.stringify(
      this.filePath || ''
    )});`
).join(`
`)}
  leaveModule(module);
})();`
          );
        }
        process() {
          return !1;
        }
      };
    L1.default = M1;
  });
  var td = H((F1) => {
    'use strict';
    Object.defineProperty(F1, '__esModule', {value: !0});
    var ed = fo(),
      K0 = new Set([
        'break',
        'case',
        'catch',
        'class',
        'const',
        'continue',
        'debugger',
        'default',
        'delete',
        'do',
        'else',
        'export',
        'extends',
        'finally',
        'for',
        'function',
        'if',
        'import',
        'in',
        'instanceof',
        'new',
        'return',
        'super',
        'switch',
        'this',
        'throw',
        'try',
        'typeof',
        'var',
        'void',
        'while',
        'with',
        'yield',
        'enum',
        'implements',
        'interface',
        'let',
        'package',
        'private',
        'protected',
        'public',
        'static',
        'await',
        'false',
        'null',
        'true',
      ]);
    function q0(e) {
      if (e.length === 0 || !ed.IS_IDENTIFIER_START[e.charCodeAt(0)]) return !1;
      for (let t = 1; t < e.length; t++)
        if (!ed.IS_IDENTIFIER_CHAR[e.charCodeAt(t)]) return !1;
      return !K0.has(e);
    }
    F1.default = q0;
  });
  var rd = H((B1) => {
    'use strict';
    Object.defineProperty(B1, '__esModule', {value: !0});
    function od(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Se = ce(),
      H0 = td(),
      nd = od(H0),
      U0 = Nt(),
      W0 = od(U0),
      $1 = class extends W0.default {
        constructor(t, n, o) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = n),
            (this.isImportsTransformEnabled = o);
        }
        process() {
          return this.rootTransformer.processPossibleArrowParamEnd() ||
            this.rootTransformer.processPossibleAsyncArrowWithTypeParams() ||
            this.rootTransformer.processPossibleTypeRange()
            ? !0
            : this.tokens.matches1(Se.TokenType._public) ||
              this.tokens.matches1(Se.TokenType._protected) ||
              this.tokens.matches1(Se.TokenType._private) ||
              this.tokens.matches1(Se.TokenType._abstract) ||
              this.tokens.matches1(Se.TokenType._readonly) ||
              this.tokens.matches1(Se.TokenType._override) ||
              this.tokens.matches1(Se.TokenType.nonNullAssertion)
            ? (this.tokens.removeInitialToken(), !0)
            : this.tokens.matches1(Se.TokenType._enum) ||
              this.tokens.matches2(Se.TokenType._const, Se.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2(Se.TokenType._export, Se.TokenType._enum) ||
              this.tokens.matches3(
                Se.TokenType._export,
                Se.TokenType._const,
                Se.TokenType._enum
              )
            ? (this.processEnum(!0), !0)
            : !1;
        }
        processEnum(t = !1) {
          for (
            this.tokens.removeInitialToken();
            this.tokens.matches1(Se.TokenType._const) ||
            this.tokens.matches1(Se.TokenType._enum);

          )
            this.tokens.removeToken();
          let n = this.tokens.identifierName();
          this.tokens.removeToken(),
            t &&
              !this.isImportsTransformEnabled &&
              this.tokens.appendCode('export '),
            this.tokens.appendCode(`var ${n}; (function (${n})`),
            this.tokens.copyExpectedToken(Se.TokenType.braceL),
            this.processEnumBody(n),
            this.tokens.copyExpectedToken(Se.TokenType.braceR),
            t && this.isImportsTransformEnabled
              ? this.tokens.appendCode(`)(${n} || (exports.${n} = ${n} = {}));`)
              : this.tokens.appendCode(`)(${n} || (${n} = {}));`);
        }
        processEnumBody(t) {
          let n = null;
          for (; !this.tokens.matches1(Se.TokenType.braceR); ) {
            let {nameStringCode: o, variableName: r} = this.extractEnumKeyInfo(
              this.tokens.currentToken()
            );
            this.tokens.removeInitialToken(),
              this.tokens.matches3(
                Se.TokenType.eq,
                Se.TokenType.string,
                Se.TokenType.comma
              ) ||
              this.tokens.matches3(
                Se.TokenType.eq,
                Se.TokenType.string,
                Se.TokenType.braceR
              )
                ? this.processStringLiteralEnumMember(t, o, r)
                : this.tokens.matches1(Se.TokenType.eq)
                ? this.processExplicitValueEnumMember(t, o, r)
                : this.processImplicitValueEnumMember(t, o, r, n),
              this.tokens.matches1(Se.TokenType.comma) &&
                this.tokens.removeToken(),
              r != null ? (n = r) : (n = `${t}[${o}]`);
          }
        }
        extractEnumKeyInfo(t) {
          if (t.type === Se.TokenType.name) {
            let n = this.tokens.identifierNameForToken(t);
            return {
              nameStringCode: `"${n}"`,
              variableName: nd.default.call(void 0, n) ? n : null,
            };
          } else if (t.type === Se.TokenType.string) {
            let n = this.tokens.stringValueForToken(t);
            return {
              nameStringCode: this.tokens.code.slice(t.start, t.end),
              variableName: nd.default.call(void 0, n) ? n : null,
            };
          } else
            throw new Error(
              'Expected name or string at beginning of enum element.'
            );
        }
        processStringLiteralEnumMember(t, n, o) {
          o != null
            ? (this.tokens.appendCode(`const ${o}`),
              this.tokens.copyToken(),
              this.tokens.copyToken(),
              this.tokens.appendCode(`; ${t}[${n}] = ${o};`))
            : (this.tokens.appendCode(`${t}[${n}]`),
              this.tokens.copyToken(),
              this.tokens.copyToken(),
              this.tokens.appendCode(';'));
        }
        processExplicitValueEnumMember(t, n, o) {
          let r = this.tokens.currentToken().rhsEndIndex;
          if (r == null)
            throw new Error('Expected rhsEndIndex on enum assign.');
          if (o != null) {
            for (
              this.tokens.appendCode(`const ${o}`), this.tokens.copyToken();
              this.tokens.currentIndex() < r;

            )
              this.rootTransformer.processToken();
            this.tokens.appendCode(`; ${t}[${t}[${n}] = ${o}] = ${n};`);
          } else {
            for (
              this.tokens.appendCode(`${t}[${t}[${n}]`),
                this.tokens.copyToken();
              this.tokens.currentIndex() < r;

            )
              this.rootTransformer.processToken();
            this.tokens.appendCode(`] = ${n};`);
          }
        }
        processImplicitValueEnumMember(t, n, o, r) {
          let s = r != null ? `${r} + 1` : '0';
          o != null && (this.tokens.appendCode(`const ${o} = ${s}; `), (s = o)),
            this.tokens.appendCode(`${t}[${t}[${n}] = ${s}] = ${n};`);
        }
      };
    B1.default = $1;
  });
  var sd = H((K1) => {
    'use strict';
    Object.defineProperty(K1, '__esModule', {value: !0});
    function Lt(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var V0 = Ge(),
      je = ce(),
      z0 = Dp(),
      X0 = Lt(z0),
      Y0 = $p(),
      G0 = Lt(Y0),
      J0 = qp(),
      Q0 = Lt(J0),
      Z0 = Up(),
      e_ = Lt(Z0),
      t_ = Wp(),
      n_ = Lt(t_),
      o_ = Xi(),
      r_ = Lt(o_),
      s_ = Vp(),
      i_ = Lt(s_),
      a_ = Xp(),
      l_ = Lt(a_),
      c_ = Yp(),
      u_ = Lt(c_),
      p_ = Jp(),
      d_ = Lt(p_),
      f_ = Zp(),
      h_ = Lt(f_),
      T_ = rd(),
      y_ = Lt(T_),
      j1 = class e {
        __init() {
          this.transformers = [];
        }
        __init2() {
          this.generatedVariables = [];
        }
        constructor(t, n, o, r) {
          e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            (this.nameManager = t.nameManager),
            (this.helperManager = t.helperManager);
          let {tokenProcessor: s, importProcessor: i} = t;
          (this.tokens = s),
            (this.isImportsTransformEnabled = n.includes('imports')),
            (this.isReactHotLoaderTransformEnabled =
              n.includes('react-hot-loader')),
            (this.disableESTransforms = !!r.disableESTransforms),
            r.disableESTransforms ||
              (this.transformers.push(new u_.default(s, this.nameManager)),
              this.transformers.push(new i_.default(s)),
              this.transformers.push(new l_.default(s, this.nameManager))),
            n.includes('jsx') &&
              (r.jsxRuntime !== 'preserve' &&
                this.transformers.push(
                  new r_.default(this, s, i, this.nameManager, r)
                ),
              this.transformers.push(new d_.default(this, s, i, r)));
          let a = null;
          if (n.includes('react-hot-loader')) {
            if (!r.filePath)
              throw new Error(
                'filePath is required when using the react-hot-loader transform.'
              );
            (a = new h_.default(s, r.filePath)), this.transformers.push(a);
          }
          if (n.includes('imports')) {
            if (i === null)
              throw new Error(
                'Expected non-null importProcessor with imports transform enabled.'
              );
            this.transformers.push(
              new G0.default(
                this,
                s,
                i,
                this.nameManager,
                this.helperManager,
                a,
                o,
                !!r.enableLegacyTypeScriptModuleInterop,
                n.includes('typescript'),
                !!r.preserveDynamicImport
              )
            );
          } else
            this.transformers.push(
              new Q0.default(
                s,
                this.nameManager,
                this.helperManager,
                a,
                n.includes('typescript'),
                r
              )
            );
          n.includes('flow') &&
            this.transformers.push(
              new e_.default(this, s, n.includes('imports'))
            ),
            n.includes('typescript') &&
              this.transformers.push(
                new y_.default(this, s, n.includes('imports'))
              ),
            n.includes('jest') &&
              this.transformers.push(
                new n_.default(this, s, this.nameManager, i)
              );
        }
        transform() {
          this.tokens.reset(), this.processBalancedCode();
          let n = this.isImportsTransformEnabled ? '"use strict";' : '';
          for (let i of this.transformers) n += i.getPrefixCode();
          (n += this.helperManager.emitHelpers()),
            (n += this.generatedVariables.map((i) => ` var ${i};`).join(''));
          for (let i of this.transformers) n += i.getHoistedCode();
          let o = '';
          for (let i of this.transformers) o += i.getSuffixCode();
          let r = this.tokens.finish(),
            {code: s} = r;
          if (s.startsWith('#!')) {
            let i = s.indexOf(`
`);
            return (
              i === -1 &&
                ((i = s.length),
                (s += `
`)),
              {
                code: s.slice(0, i + 1) + n + s.slice(i + 1) + o,
                mappings: this.shiftMappings(r.mappings, n.length),
              }
            );
          } else
            return {
              code: n + s + o,
              mappings: this.shiftMappings(r.mappings, n.length),
            };
        }
        processBalancedCode() {
          let t = 0,
            n = 0;
          for (; !this.tokens.isAtEnd(); ) {
            if (
              this.tokens.matches1(je.TokenType.braceL) ||
              this.tokens.matches1(je.TokenType.dollarBraceL)
            )
              t++;
            else if (this.tokens.matches1(je.TokenType.braceR)) {
              if (t === 0) return;
              t--;
            }
            if (this.tokens.matches1(je.TokenType.parenL)) n++;
            else if (this.tokens.matches1(je.TokenType.parenR)) {
              if (n === 0) return;
              n--;
            }
            this.processToken();
          }
        }
        processToken() {
          if (this.tokens.matches1(je.TokenType._class)) {
            this.processClass();
            return;
          }
          for (let t of this.transformers) if (t.process()) return;
          this.tokens.copyToken();
        }
        processNamedClass() {
          if (!this.tokens.matches2(je.TokenType._class, je.TokenType.name))
            throw new Error('Expected identifier for exported class name.');
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return this.processClass(), t;
        }
        processClass() {
          let t = X0.default.call(
              void 0,
              this,
              this.tokens,
              this.nameManager,
              this.disableESTransforms
            ),
            n =
              (t.headerInfo.isExpression || !t.headerInfo.className) &&
              t.staticInitializerNames.length +
                t.instanceInitializerNames.length >
                0,
            o = t.headerInfo.className;
          n &&
            ((o = this.nameManager.claimFreeName('_class')),
            this.generatedVariables.push(o),
            this.tokens.appendCode(` (${o} =`));
          let s = this.tokens.currentToken().contextId;
          if (s == null)
            throw new Error('Expected class to have a context ID.');
          for (
            this.tokens.copyExpectedToken(je.TokenType._class);
            !this.tokens.matchesContextIdAndLabel(je.TokenType.braceL, s);

          )
            this.processToken();
          this.processClassBody(t, o);
          let i = t.staticInitializerNames.map((a) => `${o}.${a}()`);
          n
            ? this.tokens.appendCode(
                `, ${i.map((a) => `${a}, `).join('')}${o})`
              )
            : t.staticInitializerNames.length > 0 &&
              this.tokens.appendCode(` ${i.map((a) => `${a};`).join(' ')}`);
        }
        processClassBody(t, n) {
          let {
              headerInfo: o,
              constructorInsertPos: r,
              constructorInitializerStatements: s,
              fields: i,
              instanceInitializerNames: a,
              rangesToRemove: u,
            } = t,
            h = 0,
            v = 0,
            _ = this.tokens.currentToken().contextId;
          if (_ == null)
            throw new Error('Expected non-null context ID on class.');
          this.tokens.copyExpectedToken(je.TokenType.braceL),
            this.isReactHotLoaderTransformEnabled &&
              this.tokens.appendCode(
                '__reactstandin__regenerateByEval(key, code) {this[key] = eval(code);}'
              );
          let x = s.length + a.length > 0;
          if (r === null && x) {
            let L = this.makeConstructorInitCode(s, a, n);
            if (o.hasSuperclass) {
              let G = this.nameManager.claimFreeName('args');
              this.tokens.appendCode(
                `constructor(...${G}) { super(...${G}); ${L}; }`
              );
            } else this.tokens.appendCode(`constructor() { ${L}; }`);
          }
          for (
            ;
            !this.tokens.matchesContextIdAndLabel(je.TokenType.braceR, _);

          )
            if (h < i.length && this.tokens.currentIndex() === i[h].start) {
              let L = !1;
              for (
                this.tokens.matches1(je.TokenType.bracketL)
                  ? this.tokens.copyTokenWithPrefix(
                      `${i[h].initializerName}() {this`
                    )
                  : this.tokens.matches1(je.TokenType.string) ||
                    this.tokens.matches1(je.TokenType.num)
                  ? (this.tokens.copyTokenWithPrefix(
                      `${i[h].initializerName}() {this[`
                    ),
                    (L = !0))
                  : this.tokens.copyTokenWithPrefix(
                      `${i[h].initializerName}() {this.`
                    );
                this.tokens.currentIndex() < i[h].end;

              )
                L &&
                  this.tokens.currentIndex() === i[h].equalsIndex &&
                  this.tokens.appendCode(']'),
                  this.processToken();
              this.tokens.appendCode('}'), h++;
            } else if (
              v < u.length &&
              this.tokens.currentIndex() >= u[v].start
            ) {
              for (
                this.tokens.currentIndex() < u[v].end &&
                this.tokens.removeInitialToken();
                this.tokens.currentIndex() < u[v].end;

              )
                this.tokens.removeToken();
              v++;
            } else
              this.tokens.currentIndex() === r
                ? (this.tokens.copyToken(),
                  x &&
                    this.tokens.appendCode(
                      `;${this.makeConstructorInitCode(s, a, n)};`
                    ),
                  this.processToken())
                : this.processToken();
          this.tokens.copyExpectedToken(je.TokenType.braceR);
        }
        makeConstructorInitCode(t, n, o) {
          return [...t, ...n.map((r) => `${o}.prototype.${r}.call(this)`)].join(
            ';'
          );
        }
        processPossibleArrowParamEnd() {
          if (
            this.tokens.matches2(je.TokenType.parenR, je.TokenType.colon) &&
            this.tokens.tokenAtRelativeIndex(1).isType
          ) {
            let t = this.tokens.currentIndex() + 1;
            for (; this.tokens.tokens[t].isType; ) t++;
            if (this.tokens.matches1AtIndex(t, je.TokenType.arrow)) {
              for (
                this.tokens.removeInitialToken();
                this.tokens.currentIndex() < t;

              )
                this.tokens.removeToken();
              return this.tokens.replaceTokenTrimmingLeftWhitespace(') =>'), !0;
            }
          }
          return !1;
        }
        processPossibleAsyncArrowWithTypeParams() {
          if (
            !this.tokens.matchesContextual(V0.ContextualKeyword._async) &&
            !this.tokens.matches1(je.TokenType._async)
          )
            return !1;
          let t = this.tokens.tokenAtRelativeIndex(1);
          if (t.type !== je.TokenType.lessThan || !t.isType) return !1;
          let n = this.tokens.currentIndex() + 1;
          for (; this.tokens.tokens[n].isType; ) n++;
          if (this.tokens.matches1AtIndex(n, je.TokenType.parenL)) {
            for (
              this.tokens.replaceToken('async ('),
                this.tokens.removeInitialToken();
              this.tokens.currentIndex() < n;

            )
              this.tokens.removeToken();
            return (
              this.tokens.removeToken(),
              this.processBalancedCode(),
              this.processToken(),
              !0
            );
          }
          return !1;
        }
        processPossibleTypeRange() {
          if (this.tokens.currentToken().isType) {
            for (
              this.tokens.removeInitialToken();
              this.tokens.currentToken().isType;

            )
              this.tokens.removeToken();
            return !0;
          }
          return !1;
        }
        shiftMappings(t, n) {
          for (let o = 0; o < t.length; o++) {
            let r = t[o];
            r !== void 0 && (t[o] = r + n);
          }
          return t;
        }
      };
    K1.default = j1;
  });
  var ld = H((ar) => {
    'use strict';
    ar.__esModule = !0;
    ar.LinesAndColumns = void 0;
    var Cs = `
`,
      id = '\r',
      ad = (function () {
        function e(t) {
          this.string = t;
          for (var n = [0], o = 0; o < t.length; )
            switch (t[o]) {
              case Cs:
                (o += Cs.length), n.push(o);
                break;
              case id:
                (o += id.length), t[o] === Cs && (o += Cs.length), n.push(o);
                break;
              default:
                o++;
                break;
            }
          this.offsets = n;
        }
        return (
          (e.prototype.locationForIndex = function (t) {
            if (t < 0 || t > this.string.length) return null;
            for (var n = 0, o = this.offsets; o[n + 1] <= t; ) n++;
            var r = t - o[n];
            return {line: n, column: r};
          }),
          (e.prototype.indexForLocation = function (t) {
            var n = t.line,
              o = t.column;
            return n < 0 ||
              n >= this.offsets.length ||
              o < 0 ||
              o > this.lengthOfLine(n)
              ? null
              : this.offsets[n] + o;
          }),
          (e.prototype.lengthOfLine = function (t) {
            var n = this.offsets[t],
              o =
                t === this.offsets.length - 1
                  ? this.string.length
                  : this.offsets[t + 1];
            return o - n;
          }),
          e
        );
      })();
    ar.LinesAndColumns = ad;
    ar.default = ad;
  });
  var cd = H((q1) => {
    'use strict';
    Object.defineProperty(q1, '__esModule', {value: !0});
    function m_(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var k_ = ld(),
      v_ = m_(k_),
      __ = ce();
    function x_(e, t) {
      if (t.length === 0) return '';
      let n = Object.keys(t[0]).filter(
          (x) =>
            x !== 'type' &&
            x !== 'value' &&
            x !== 'start' &&
            x !== 'end' &&
            x !== 'loc'
        ),
        o = Object.keys(t[0].type).filter(
          (x) => x !== 'label' && x !== 'keyword'
        ),
        r = ['Location', 'Label', 'Raw', ...n, ...o],
        s = new v_.default(e),
        i = [r, ...t.map(u)],
        a = r.map(() => 0);
      for (let x of i)
        for (let L = 0; L < x.length; L++) a[L] = Math.max(a[L], x[L].length);
      return i.map((x) => x.map((L, G) => L.padEnd(a[G])).join(' ')).join(`
`);
      function u(x) {
        let L = e.slice(x.start, x.end);
        return [
          v(x.start, x.end),
          __.formatTokenType.call(void 0, x.type),
          g_(String(L), 14),
          ...n.map((G) => h(x[G], G)),
          ...o.map((G) => h(x.type[G], G)),
        ];
      }
      function h(x, L) {
        return x === !0 ? L : x === !1 || x === null ? '' : String(x);
      }
      function v(x, L) {
        return `${_(x)}-${_(L)}`;
      }
      function _(x) {
        let L = s.locationForIndex(x);
        return L ? `${L.line + 1}:${L.column + 1}` : 'Unknown';
      }
    }
    q1.default = x_;
    function g_(e, t) {
      return e.length > t ? `${e.slice(0, t - 3)}...` : e;
    }
  });
  var ud = H((H1) => {
    'use strict';
    Object.defineProperty(H1, '__esModule', {value: !0});
    function C_(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var yt = ce(),
      w_ = Ko(),
      I_ = C_(w_);
    function S_(e) {
      let t = new Set();
      for (let n = 0; n < e.tokens.length; n++)
        e.matches1AtIndex(n, yt.TokenType._import) &&
          !e.matches3AtIndex(
            n,
            yt.TokenType._import,
            yt.TokenType.name,
            yt.TokenType.eq
          ) &&
          b_(e, n, t);
      return t;
    }
    H1.default = S_;
    function b_(e, t, n) {
      t++,
        !e.matches1AtIndex(t, yt.TokenType.parenL) &&
          (e.matches1AtIndex(t, yt.TokenType.name) &&
            (n.add(e.identifierNameAtIndex(t)),
            t++,
            e.matches1AtIndex(t, yt.TokenType.comma) && t++),
          e.matches1AtIndex(t, yt.TokenType.star) &&
            ((t += 2), n.add(e.identifierNameAtIndex(t)), t++),
          e.matches1AtIndex(t, yt.TokenType.braceL) && (t++, E_(e, t, n)));
    }
    function E_(e, t, n) {
      for (;;) {
        if (e.matches1AtIndex(t, yt.TokenType.braceR)) return;
        let o = I_.default.call(void 0, e, t);
        if (
          ((t = o.endIndex),
          o.isType || n.add(o.rightName),
          e.matches2AtIndex(t, yt.TokenType.comma, yt.TokenType.braceR))
        )
          return;
        if (e.matches1AtIndex(t, yt.TokenType.braceR)) return;
        if (e.matches1AtIndex(t, yt.TokenType.comma)) t++;
        else
          throw new Error(`Unexpected token: ${JSON.stringify(e.tokens[t])}`);
      }
    }
  });
  var fd = H((lr) => {
    'use strict';
    Object.defineProperty(lr, '__esModule', {value: !0});
    function Ln(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var A_ = Mc(),
      P_ = Ln(A_),
      R_ = Wc(),
      N_ = Ln(R_),
      D_ = Vc(),
      O_ = Yc(),
      pd = Ln(O_),
      M_ = Jc(),
      L_ = Ln(M_),
      F_ = Tu(),
      $_ = o1(),
      B_ = Pp(),
      j_ = Ln(B_),
      K_ = sd(),
      q_ = Ln(K_),
      H_ = cd(),
      U_ = Ln(H_),
      W_ = ud(),
      V_ = Ln(W_);
    function z_() {
      return '3.32.0';
    }
    lr.getVersion = z_;
    function X_(e, t) {
      F_.validateOptions.call(void 0, t);
      try {
        let n = dd(e, t),
          r = new q_.default(
            n,
            t.transforms,
            !!t.enableLegacyBabel5ModuleInterop,
            t
          ).transform(),
          s = {code: r.code};
        if (t.sourceMapOptions) {
          if (!t.filePath)
            throw new Error(
              'filePath must be specified when generating a source map.'
            );
          s = {
            ...s,
            sourceMap: N_.default.call(
              void 0,
              r,
              t.filePath,
              t.sourceMapOptions,
              e,
              n.tokenProcessor.tokens
            ),
          };
        }
        return s;
      } catch (n) {
        throw (
          (t.filePath &&
            (n.message = `Error transforming ${t.filePath}: ${n.message}`),
          n)
        );
      }
    }
    lr.transform = X_;
    function Y_(e, t) {
      let n = dd(e, t).tokenProcessor.tokens;
      return U_.default.call(void 0, e, n);
    }
    lr.getFormattedTokens = Y_;
    function dd(e, t) {
      let n = t.transforms.includes('jsx'),
        o = t.transforms.includes('typescript'),
        r = t.transforms.includes('flow'),
        s = t.disableESTransforms === !0,
        i = $_.parse.call(void 0, e, n, o, r),
        a = i.tokens,
        u = i.scopes,
        h = new L_.default(e, a),
        v = new D_.HelperManager(h),
        _ = new j_.default(e, a, r, s, v),
        x = !!t.enableLegacyTypeScriptModuleInterop,
        L = null;
      return (
        t.transforms.includes('imports')
          ? ((L = new P_.default(
              h,
              _,
              x,
              t,
              t.transforms.includes('typescript'),
              v
            )),
            L.preprocessTokens(),
            pd.default.call(void 0, _, u, L.getGlobalNames()),
            t.transforms.includes('typescript') && L.pruneTypeOnlyImports())
          : t.transforms.includes('typescript') &&
            pd.default.call(void 0, _, u, V_.default.call(void 0, _)),
        {
          tokenProcessor: _,
          scopes: u,
          nameManager: h,
          importProcessor: L,
          helperManager: v,
        }
      );
    }
  });
  var ws = Eo(),
    G_ = tl(),
    cr = rc(),
    hd = fd(),
    Jn = null;
  function yd() {
    return new Proxy(
      {},
      {
        get: function (e, t) {
          if (t in e) return e[t];
          var n = String(t).split('#'),
            o = n[0],
            r = n[1] || 'default',
            s = {id: o, chunks: [o], name: r, async: !0};
          return (e[t] = s), s;
        },
      }
    );
  }
  var md = {};
  function J_(e, t, n) {
    var o = cr.registerServerReference(e, t, n),
      r = t + '#' + n;
    return (md[r] = e), o;
  }
  function Q_(e, t) {
    for (
      var n = e.split(`
`),
        o = 0;
      o < Math.min(n.length, 10);
      o++
    ) {
      var r = n[o].trim();
      if (r !== '' && !r.startsWith('//')) {
        if (r.startsWith('/*')) {
          for (; o < n.length && !n[o].includes('*/'); ) o++;
          continue;
        }
        return (
          r === "'" + t + "';" ||
          r === '"' + t + '";' ||
          r === "'" + t + "'" ||
          r === '"' + t + '"'
        );
      }
    }
    return !1;
  }
  function Z_(e, t) {
    if (!t.startsWith('.')) return t;
    var n = e.split('/');
    n.pop();
    for (var o = t.split('/'), r = 0; r < o.length; r++)
      if (o[r] !== '.') {
        if (o[r] === '..') {
          n.pop();
          continue;
        }
        n.push(o[r]);
      }
    return n.join('/');
  }
  function ex(e, t, n) {
    var o = {react: ws, 'react/jsx-runtime': G_};
    Object.keys(t).forEach(function (_) {
      o[_] = cr.createClientModuleProxy(_);
    });
    var r = {},
      s = !1;
    if (
      (Object.keys(e).forEach(function (_) {
        try {
          r[_] = hd.transform(e[_], {
            transforms: ['jsx', 'imports'],
            jsxRuntime: 'automatic',
            production: !0,
          }).code;
        } catch {
          s = !0;
        }
      }),
      s)
    )
      return null;
    function i(_, x) {
      if (o[x]) return x;
      if (x.startsWith('.')) {
        var L = Z_(_, x);
        if (o[L] || r[L]) return L;
        for (var G = ['.js', '.jsx', '.ts', '.tsx'], F = 0; F < G.length; F++) {
          var K = L + G[F];
          if (o[K] || r[K]) return K;
        }
      }
      return x;
    }
    var a = {};
    function u(_) {
      if (o[_]) return o[_];
      if (!r[_]) throw new Error('Module "' + _ + '" not found');
      if (a[_]) return a[_].exports;
      var x = {exports: {}};
      a[_] = x;
      var L = function (R) {
        if (R.endsWith('.css')) return {};
        var z = i(_, R);
        return o[z] ? o[z] : u(z);
      };
      if (
        (new Function('module', 'exports', 'require', 'React', r[_])(
          x,
          x.exports,
          L,
          ws
        ),
        (o[_] = x.exports),
        Q_(e[_], 'use server'))
      )
        for (var G = Object.keys(x.exports), F = 0; F < G.length; F++) {
          var K = G[F];
          typeof x.exports[K] == 'function' && J_(x.exports[K], _, K);
        }
      return delete a[_], x.exports;
    }
    var h = {exports: {}};
    Object.keys(r).forEach(function (_) {
      u(_),
        (_ === '/src/App.js' || _ === './App.js' || _ === './src/App.js') &&
          (h.exports = o[_]);
    }),
      (Jn = {module: h.exports, manifest: t});
    var v = {};
    return (
      n &&
        Object.keys(n).forEach(function (_) {
          try {
            v[_] = hd.transform(n[_], {
              transforms: ['jsx', 'imports'],
              jsxRuntime: 'automatic',
              production: !0,
            }).code;
          } catch (x) {
            self.postMessage({
              type: 'rsc-error',
              requestId: -1,
              error: 'Sucrase compile error in ' + _ + ': ' + String(x),
            });
          }
        }),
      {type: 'deployed', compiledClients: v}
    );
  }
  function tx() {
    if (!Jn) throw new Error('No code deployed');
    var e = Jn.module.default || Jn.module,
      t = ws.createElement(e);
    return cr.renderToReadableStream(t, yd(), {onError: console.error});
  }
  function nx(e, t) {
    if (!Jn) throw new Error('No code deployed');
    var n = md[e];
    if (!n) throw new Error('Action "' + e + '" not found');
    var o = t;
    if (typeof t != 'string' && t && t.__formData) {
      o = new FormData();
      for (var r = 0; r < t.__formData.length; r++)
        o.append(t.__formData[r][0], t.__formData[r][1]);
    }
    return Promise.resolve(cr.decodeReply(o)).then(function (s) {
      var i = Promise.resolve(n.apply(null, s));
      return i.then(function () {
        var a = Jn.module.default || Jn.module;
        return cr.renderToReadableStream(
          {root: ws.createElement(a), returnValue: i},
          yd()
        );
      });
    });
  }
  function Td(e, t) {
    var n = t.getReader();
    function o() {
      return n.read().then(function (r) {
        if (r.done) {
          self.postMessage({type: 'rsc-chunk', requestId: e, done: !0});
          return;
        }
        return (
          self.postMessage(
            {type: 'rsc-chunk', requestId: e, done: !1, chunk: r.value},
            [r.value.buffer]
          ),
          o()
        );
      });
    }
    o().catch(function (r) {
      self.postMessage({type: 'rsc-error', requestId: e, error: String(r)});
    });
  }
  self.onmessage = function (e) {
    var t = e.data;
    if (t.type === 'deploy')
      try {
        var n = ex(t.serverFiles, t.clientManifest, t.clientFiles);
        n &&
          self.postMessage({
            type: 'deploy-result',
            requestId: t.requestId,
            result: n,
          });
      } catch {}
    else if (t.type === 'render')
      try {
        var o = tx();
        Promise.resolve(o).then(function (r) {
          Td(t.requestId, r);
        });
      } catch (r) {
        self.postMessage({
          type: 'rsc-error',
          requestId: t.requestId,
          error: String(r),
        });
      }
    else if (t.type === 'callAction')
      try {
        nx(t.actionId, t.encodedArgs).then(function (r) {
          Td(t.requestId, r);
        });
      } catch (r) {
        self.postMessage({
          type: 'rsc-error',
          requestId: t.requestId,
          error: String(r),
        });
      }
  };
  self.postMessage({type: 'ready'});
})();
/*! Bundled license information:

react/cjs/react.react-server.production.js:
  (**
   * @license React
   * react.react-server.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.react-server.production.js:
  (**
   * @license React
   * react-jsx-runtime.react-server.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.react-server.production.js:
  (**
   * @license React
   * react-dom.react-server.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-server-dom-webpack/cjs/react-server-dom-webpack-server.browser.production.js:
  (**
   * @license React
   * react-server-dom-webpack-server.browser.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
