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
  var Z = (e, t) => () => (t || e((t = {exports: {}}).exports, t), t.exports);
  var Wc = Z((ht) => {
    'use strict';
    var ei = {H: null, A: null};
    function Yo(e) {
      var t = 'https://react.dev/errors/' + e;
      if (1 < arguments.length) {
        t += '?args[]=' + encodeURIComponent(arguments[1]);
        for (var s = 2; s < arguments.length; s++)
          t += '&args[]=' + encodeURIComponent(arguments[s]);
      }
      return (
        'Minified React error #' +
        e +
        '; visit ' +
        t +
        ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
      );
    }
    var jc = Array.isArray,
      Jo = Symbol.for('react.transitional.element'),
      Af = Symbol.for('react.portal'),
      Pf = Symbol.for('react.fragment'),
      Nf = Symbol.for('react.strict_mode'),
      Rf = Symbol.for('react.profiler'),
      Lf = Symbol.for('react.forward_ref'),
      Of = Symbol.for('react.suspense'),
      Df = Symbol.for('react.memo'),
      Uc = Symbol.for('react.lazy'),
      $c = Symbol.iterator;
    function Mf(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = ($c && e[$c]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var Hc = Object.prototype.hasOwnProperty,
      Ff = Object.assign;
    function Qo(e, t, s, i, r, a) {
      return (
        (s = a.ref),
        {$$typeof: Jo, type: e, key: t, ref: s !== void 0 ? s : null, props: a}
      );
    }
    function Bf(e, t) {
      return Qo(e.type, t, void 0, void 0, void 0, e.props);
    }
    function Zo(e) {
      return typeof e == 'object' && e !== null && e.$$typeof === Jo;
    }
    function Vf(e) {
      var t = {'=': '=0', ':': '=2'};
      return (
        '$' +
        e.replace(/[=:]/g, function (s) {
          return t[s];
        })
      );
    }
    var qc = /\/+/g;
    function zo(e, t) {
      return typeof e == 'object' && e !== null && e.key != null
        ? Vf('' + e.key)
        : t.toString(36);
    }
    function Kc() {}
    function jf(e) {
      switch (e.status) {
        case 'fulfilled':
          return e.value;
        case 'rejected':
          throw e.reason;
        default:
          switch (
            (typeof e.status == 'string'
              ? e.then(Kc, Kc)
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
    function Zs(e, t, s, i, r) {
      var a = typeof e;
      (a === 'undefined' || a === 'boolean') && (e = null);
      var u = !1;
      if (e === null) u = !0;
      else
        switch (a) {
          case 'bigint':
          case 'string':
          case 'number':
            u = !0;
            break;
          case 'object':
            switch (e.$$typeof) {
              case Jo:
              case Af:
                u = !0;
                break;
              case Uc:
                return (u = e._init), Zs(u(e._payload), t, s, i, r);
            }
        }
      if (u)
        return (
          (r = r(e)),
          (u = i === '' ? '.' + zo(e, 0) : i),
          jc(r)
            ? ((s = ''),
              u != null && (s = u.replace(qc, '$&/') + '/'),
              Zs(r, t, s, '', function (g) {
                return g;
              }))
            : r != null &&
              (Zo(r) &&
                (r = Bf(
                  r,
                  s +
                    (r.key == null || (e && e.key === r.key)
                      ? ''
                      : ('' + r.key).replace(qc, '$&/') + '/') +
                    u
                )),
              t.push(r)),
          1
        );
      u = 0;
      var d = i === '' ? '.' : i + ':';
      if (jc(e))
        for (var y = 0; y < e.length; y++)
          (i = e[y]), (a = d + zo(i, y)), (u += Zs(i, t, s, a, r));
      else if (((y = Mf(e)), typeof y == 'function'))
        for (e = y.call(e), y = 0; !(i = e.next()).done; )
          (i = i.value), (a = d + zo(i, y++)), (u += Zs(i, t, s, a, r));
      else if (a === 'object') {
        if (typeof e.then == 'function') return Zs(jf(e), t, s, i, r);
        throw (
          ((t = String(e)),
          Error(
            Yo(
              31,
              t === '[object Object]'
                ? 'object with keys {' + Object.keys(e).join(', ') + '}'
                : t
            )
          ))
        );
      }
      return u;
    }
    function _r(e, t, s) {
      if (e == null) return e;
      var i = [],
        r = 0;
      return (
        Zs(e, i, '', '', function (a) {
          return t.call(s, a, r++);
        }),
        i
      );
    }
    function $f(e) {
      if (e._status === -1) {
        var t = e._result;
        (t = t()),
          t.then(
            function (s) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 1), (e._result = s));
            },
            function (s) {
              (e._status === 0 || e._status === -1) &&
                ((e._status = 2), (e._result = s));
            }
          ),
          e._status === -1 && ((e._status = 0), (e._result = t));
      }
      if (e._status === 1) return e._result.default;
      throw e._result;
    }
    function qf() {
      return new WeakMap();
    }
    function Xo() {
      return {s: 0, v: void 0, o: null, p: null};
    }
    ht.Children = {
      map: _r,
      forEach: function (e, t, s) {
        _r(
          e,
          function () {
            t.apply(this, arguments);
          },
          s
        );
      },
      count: function (e) {
        var t = 0;
        return (
          _r(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          _r(e, function (t) {
            return t;
          }) || []
        );
      },
      only: function (e) {
        if (!Zo(e)) throw Error(Yo(143));
        return e;
      },
    };
    ht.Fragment = Pf;
    ht.Profiler = Rf;
    ht.StrictMode = Nf;
    ht.Suspense = Of;
    ht.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ei;
    ht.cache = function (e) {
      return function () {
        var t = ei.A;
        if (!t) return e.apply(null, arguments);
        var s = t.getCacheForType(qf);
        (t = s.get(e)), t === void 0 && ((t = Xo()), s.set(e, t)), (s = 0);
        for (var i = arguments.length; s < i; s++) {
          var r = arguments[s];
          if (typeof r == 'function' || (typeof r == 'object' && r !== null)) {
            var a = t.o;
            a === null && (t.o = a = new WeakMap()),
              (t = a.get(r)),
              t === void 0 && ((t = Xo()), a.set(r, t));
          } else
            (a = t.p),
              a === null && (t.p = a = new Map()),
              (t = a.get(r)),
              t === void 0 && ((t = Xo()), a.set(r, t));
        }
        if (t.s === 1) return t.v;
        if (t.s === 2) throw t.v;
        try {
          var u = e.apply(null, arguments);
          return (s = t), (s.s = 1), (s.v = u);
        } catch (d) {
          throw ((u = t), (u.s = 2), (u.v = d), d);
        }
      };
    };
    ht.cloneElement = function (e, t, s) {
      if (e == null) throw Error(Yo(267, e));
      var i = Ff({}, e.props),
        r = e.key,
        a = void 0;
      if (t != null)
        for (u in (t.ref !== void 0 && (a = void 0),
        t.key !== void 0 && (r = '' + t.key),
        t))
          !Hc.call(t, u) ||
            u === 'key' ||
            u === '__self' ||
            u === '__source' ||
            (u === 'ref' && t.ref === void 0) ||
            (i[u] = t[u]);
      var u = arguments.length - 2;
      if (u === 1) i.children = s;
      else if (1 < u) {
        for (var d = Array(u), y = 0; y < u; y++) d[y] = arguments[y + 2];
        i.children = d;
      }
      return Qo(e.type, r, void 0, void 0, a, i);
    };
    ht.createElement = function (e, t, s) {
      var i,
        r = {},
        a = null;
      if (t != null)
        for (i in (t.key !== void 0 && (a = '' + t.key), t))
          Hc.call(t, i) &&
            i !== 'key' &&
            i !== '__self' &&
            i !== '__source' &&
            (r[i] = t[i]);
      var u = arguments.length - 2;
      if (u === 1) r.children = s;
      else if (1 < u) {
        for (var d = Array(u), y = 0; y < u; y++) d[y] = arguments[y + 2];
        r.children = d;
      }
      if (e && e.defaultProps)
        for (i in ((u = e.defaultProps), u)) r[i] === void 0 && (r[i] = u[i]);
      return Qo(e, a, void 0, void 0, null, r);
    };
    ht.createRef = function () {
      return {current: null};
    };
    ht.forwardRef = function (e) {
      return {$$typeof: Lf, render: e};
    };
    ht.isValidElement = Zo;
    ht.lazy = function (e) {
      return {$$typeof: Uc, _payload: {_status: -1, _result: e}, _init: $f};
    };
    ht.memo = function (e, t) {
      return {$$typeof: Df, type: e, compare: t === void 0 ? null : t};
    };
    ht.use = function (e) {
      return ei.H.use(e);
    };
    ht.useCallback = function (e, t) {
      return ei.H.useCallback(e, t);
    };
    ht.useDebugValue = function () {};
    ht.useId = function () {
      return ei.H.useId();
    };
    ht.useMemo = function (e, t) {
      return ei.H.useMemo(e, t);
    };
    ht.version = '19.0.0';
  });
  var Li = Z((e_, Gc) => {
    'use strict';
    Gc.exports = Wc();
  });
  var Xc = Z((Oi) => {
    'use strict';
    var Kf = Li(),
      Uf = Symbol.for('react.transitional.element'),
      Hf = Symbol.for('react.fragment');
    if (!Kf.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function zc(e, t, s) {
      var i = null;
      if (
        (s !== void 0 && (i = '' + s),
        t.key !== void 0 && (i = '' + t.key),
        'key' in t)
      ) {
        s = {};
        for (var r in t) r !== 'key' && (s[r] = t[r]);
      } else s = t;
      return (
        (t = s.ref),
        {$$typeof: Uf, type: e, key: i, ref: t !== void 0 ? t : null, props: s}
      );
    }
    Oi.Fragment = Hf;
    Oi.jsx = zc;
    Oi.jsxDEV = void 0;
    Oi.jsxs = zc;
  });
  var Jc = Z((n_, Yc) => {
    'use strict';
    Yc.exports = Xc();
  });
  var Qc = Z((jn) => {
    'use strict';
    var Wf = Li();
    function ns() {}
    var Sn = {
      d: {
        f: ns,
        r: function () {
          throw Error(
            'Invalid form element. requestFormReset must be passed a form that was rendered by React.'
          );
        },
        D: ns,
        C: ns,
        L: ns,
        m: ns,
        X: ns,
        S: ns,
        M: ns,
      },
      p: 0,
      findDOMNode: null,
    };
    if (!Wf.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function br(e, t) {
      if (e === 'font') return '';
      if (typeof t == 'string') return t === 'use-credentials' ? t : '';
    }
    jn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Sn;
    jn.preconnect = function (e, t) {
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
        Sn.d.C(e, t));
    };
    jn.prefetchDNS = function (e) {
      typeof e == 'string' && Sn.d.D(e);
    };
    jn.preinit = function (e, t) {
      if (typeof e == 'string' && t && typeof t.as == 'string') {
        var s = t.as,
          i = br(s, t.crossOrigin),
          r = typeof t.integrity == 'string' ? t.integrity : void 0,
          a = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
        s === 'style'
          ? Sn.d.S(e, typeof t.precedence == 'string' ? t.precedence : void 0, {
              crossOrigin: i,
              integrity: r,
              fetchPriority: a,
            })
          : s === 'script' &&
            Sn.d.X(e, {
              crossOrigin: i,
              integrity: r,
              fetchPriority: a,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
      }
    };
    jn.preinitModule = function (e, t) {
      if (typeof e == 'string')
        if (typeof t == 'object' && t !== null) {
          if (t.as == null || t.as === 'script') {
            var s = br(t.as, t.crossOrigin);
            Sn.d.M(e, {
              crossOrigin: s,
              integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
          }
        } else t == null && Sn.d.M(e);
    };
    jn.preload = function (e, t) {
      if (
        typeof e == 'string' &&
        typeof t == 'object' &&
        t !== null &&
        typeof t.as == 'string'
      ) {
        var s = t.as,
          i = br(s, t.crossOrigin);
        Sn.d.L(e, s, {
          crossOrigin: i,
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
    jn.preloadModule = function (e, t) {
      if (typeof e == 'string')
        if (t) {
          var s = br(t.as, t.crossOrigin);
          Sn.d.m(e, {
            as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
            crossOrigin: s,
            integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          });
        } else Sn.d.m(e);
    };
    jn.version = '19.0.0';
  });
  var eu = Z((i_, Zc) => {
    'use strict';
    Zc.exports = Qc();
  });
  var Zu = Z((En) => {
    'use strict';
    var Gf = eu(),
      zf = Li(),
      Tu = new MessageChannel(),
      ku = [];
    Tu.port1.onmessage = function () {
      var e = ku.shift();
      e && e();
    };
    function Bi(e) {
      ku.push(e), Tu.port2.postMessage(null);
    }
    function Xf(e) {
      setTimeout(function () {
        throw e;
      });
    }
    var Yf = Promise,
      vu =
        typeof queueMicrotask == 'function'
          ? queueMicrotask
          : function (e) {
              Yf.resolve(null).then(e).catch(Xf);
            },
      ln = null,
      cn = 0;
    function Cr(e, t) {
      if (t.byteLength !== 0)
        if (2048 < t.byteLength)
          0 < cn &&
            (e.enqueue(new Uint8Array(ln.buffer, 0, cn)),
            (ln = new Uint8Array(2048)),
            (cn = 0)),
            e.enqueue(t);
        else {
          var s = ln.length - cn;
          s < t.byteLength &&
            (s === 0
              ? e.enqueue(ln)
              : (ln.set(t.subarray(0, s), cn),
                e.enqueue(ln),
                (t = t.subarray(s))),
            (ln = new Uint8Array(2048)),
            (cn = 0)),
            ln.set(t, cn),
            (cn += t.byteLength);
        }
      return !0;
    }
    var Jf = new TextEncoder();
    function pn(e) {
      return Jf.encode(e);
    }
    function la(e) {
      return e.byteLength;
    }
    function xu(e, t) {
      typeof e.error == 'function' ? e.error(t) : e.close();
    }
    var rs = Symbol.for('react.client.reference'),
      Ar = Symbol.for('react.server.reference');
    function ti(e, t, s) {
      return Object.defineProperties(e, {
        $$typeof: {value: rs},
        $$id: {value: t},
        $$async: {value: s},
      });
    }
    var Qf = Function.prototype.bind,
      Zf = Array.prototype.slice;
    function gu() {
      var e = Qf.apply(this, arguments);
      if (this.$$typeof === Ar) {
        var t = Zf.call(arguments, 1),
          s = {value: Ar},
          i = {value: this.$$id};
        return (
          (t = {value: this.$$bound ? this.$$bound.concat(t) : t}),
          Object.defineProperties(e, {
            $$typeof: s,
            $$id: i,
            $$bound: t,
            bind: {value: gu, configurable: !0},
          })
        );
      }
      return e;
    }
    var ed = {
        value: function () {
          return 'function () { [omitted code] }';
        },
        configurable: !0,
        writable: !0,
      },
      td = Promise.prototype,
      nd = {
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
    function tu(e, t) {
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
          var s = e.$$id;
          return (
            (e.default = ti(
              function () {
                throw Error(
                  'Attempted to call the default export of ' +
                    s +
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
          var i = ti({}, e.$$id, !0),
            r = new Proxy(i, _u);
          return (
            (e.status = 'fulfilled'),
            (e.value = r),
            (e.then = ti(
              function (a) {
                return Promise.resolve(a(r));
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
        (i = e[t]),
        i ||
          ((i = ti(
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
          Object.defineProperty(i, 'name', {value: t}),
          (i = e[t] = new Proxy(i, nd))),
        i
      );
    }
    var _u = {
        get: function (e, t) {
          return tu(e, t);
        },
        getOwnPropertyDescriptor: function (e, t) {
          var s = Object.getOwnPropertyDescriptor(e, t);
          return (
            s ||
              ((s = {
                value: tu(e, t),
                writable: !1,
                configurable: !1,
                enumerable: !1,
              }),
              Object.defineProperty(e, t, s)),
            s
          );
        },
        getPrototypeOf: function () {
          return td;
        },
        set: function () {
          throw Error('Cannot assign to a client module from a server module.');
        },
      },
      bu = Gf.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      qn = bu.d;
    bu.d = {f: qn.f, r: qn.r, D: sd, C: id, L: Sr, m: Cu, X: od, S: rd, M: ad};
    function sd(e) {
      if (typeof e == 'string' && e) {
        var t = st || null;
        if (t) {
          var s = t.hints,
            i = 'D|' + e;
          s.has(i) || (s.add(i), Ut(t, 'D', e));
        } else qn.D(e);
      }
    }
    function id(e, t) {
      if (typeof e == 'string') {
        var s = st || null;
        if (s) {
          var i = s.hints,
            r = 'C|' + (t ?? 'null') + '|' + e;
          i.has(r) ||
            (i.add(r),
            typeof t == 'string' ? Ut(s, 'C', [e, t]) : Ut(s, 'C', e));
        } else qn.C(e, t);
      }
    }
    function Sr(e, t, s) {
      if (typeof e == 'string') {
        var i = st || null;
        if (i) {
          var r = i.hints,
            a = 'L';
          if (t === 'image' && s) {
            var u = s.imageSrcSet,
              d = s.imageSizes,
              y = '';
            typeof u == 'string' && u !== ''
              ? ((y += '[' + u + ']'),
                typeof d == 'string' && (y += '[' + d + ']'))
              : (y += '[][]' + e),
              (a += '[image]' + y);
          } else a += '[' + t + ']' + e;
          r.has(a) ||
            (r.add(a),
            (s = ji(s)) ? Ut(i, 'L', [e, t, s]) : Ut(i, 'L', [e, t]));
        } else qn.L(e, t, s);
      }
    }
    function Cu(e, t) {
      if (typeof e == 'string') {
        var s = st || null;
        if (s) {
          var i = s.hints,
            r = 'm|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = ji(t)) ? Ut(s, 'm', [e, t]) : Ut(s, 'm', e));
        }
        qn.m(e, t);
      }
    }
    function rd(e, t, s) {
      if (typeof e == 'string') {
        var i = st || null;
        if (i) {
          var r = i.hints,
            a = 'S|' + e;
          return r.has(a)
            ? void 0
            : (r.add(a),
              (s = ji(s))
                ? Ut(i, 'S', [e, typeof t == 'string' ? t : 0, s])
                : typeof t == 'string'
                ? Ut(i, 'S', [e, t])
                : Ut(i, 'S', e));
        }
        qn.S(e, t, s);
      }
    }
    function od(e, t) {
      if (typeof e == 'string') {
        var s = st || null;
        if (s) {
          var i = s.hints,
            r = 'X|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = ji(t)) ? Ut(s, 'X', [e, t]) : Ut(s, 'X', e));
        }
        qn.X(e, t);
      }
    }
    function ad(e, t) {
      if (typeof e == 'string') {
        var s = st || null;
        if (s) {
          var i = s.hints,
            r = 'M|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = ji(t)) ? Ut(s, 'M', [e, t]) : Ut(s, 'M', e));
        }
        qn.M(e, t);
      }
    }
    function ji(e) {
      if (e == null) return null;
      var t = !1,
        s = {},
        i;
      for (i in e) e[i] != null && ((t = !0), (s[i] = e[i]));
      return t ? s : null;
    }
    function ld(e, t, s) {
      switch (t) {
        case 'img':
          t = s.src;
          var i = s.srcSet;
          if (
            !(
              s.loading === 'lazy' ||
              (!t && !i) ||
              (typeof t != 'string' && t != null) ||
              (typeof i != 'string' && i != null) ||
              s.fetchPriority === 'low' ||
              e & 3
            ) &&
            (typeof t != 'string' ||
              t[4] !== ':' ||
              (t[0] !== 'd' && t[0] !== 'D') ||
              (t[1] !== 'a' && t[1] !== 'A') ||
              (t[2] !== 't' && t[2] !== 'T') ||
              (t[3] !== 'a' && t[3] !== 'A')) &&
            (typeof i != 'string' ||
              i[4] !== ':' ||
              (i[0] !== 'd' && i[0] !== 'D') ||
              (i[1] !== 'a' && i[1] !== 'A') ||
              (i[2] !== 't' && i[2] !== 'T') ||
              (i[3] !== 'a' && i[3] !== 'A'))
          ) {
            var r = typeof s.sizes == 'string' ? s.sizes : void 0,
              a = s.crossOrigin;
            Sr(t || '', 'image', {
              imageSrcSet: i,
              imageSizes: r,
              crossOrigin:
                typeof a == 'string'
                  ? a === 'use-credentials'
                    ? a
                    : ''
                  : void 0,
              integrity: s.integrity,
              type: s.type,
              fetchPriority: s.fetchPriority,
              referrerPolicy: s.referrerPolicy,
            });
          }
          return e;
        case 'link':
          if (
            ((t = s.rel),
            (i = s.href),
            !(
              e & 1 ||
              s.itemProp != null ||
              typeof t != 'string' ||
              typeof i != 'string' ||
              i === ''
            ))
          )
            switch (t) {
              case 'preload':
                Sr(i, s.as, {
                  crossOrigin: s.crossOrigin,
                  integrity: s.integrity,
                  nonce: s.nonce,
                  type: s.type,
                  fetchPriority: s.fetchPriority,
                  referrerPolicy: s.referrerPolicy,
                  imageSrcSet: s.imageSrcSet,
                  imageSizes: s.imageSizes,
                  media: s.media,
                });
                break;
              case 'modulepreload':
                Cu(i, {
                  as: s.as,
                  crossOrigin: s.crossOrigin,
                  integrity: s.integrity,
                  nonce: s.nonce,
                });
                break;
              case 'stylesheet':
                Sr(i, 'stylesheet', {
                  crossOrigin: s.crossOrigin,
                  integrity: s.integrity,
                  nonce: s.nonce,
                  type: s.type,
                  fetchPriority: s.fetchPriority,
                  referrerPolicy: s.referrerPolicy,
                  media: s.media,
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
    var ca = Symbol.for('react.temporary.reference'),
      cd = {
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
    function ud(e, t) {
      var s = Object.defineProperties(
        function () {
          throw Error(
            "Attempted to call a temporary Client Reference from the server but it is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component."
          );
        },
        {$$typeof: {value: ca}}
      );
      return (s = new Proxy(s, cd)), e.set(s, t), s;
    }
    var pd = Symbol.for('react.element'),
      In = Symbol.for('react.transitional.element'),
      ua = Symbol.for('react.fragment'),
      nu = Symbol.for('react.context'),
      wu = Symbol.for('react.forward_ref'),
      hd = Symbol.for('react.suspense'),
      fd = Symbol.for('react.suspense_list'),
      Su = Symbol.for('react.memo'),
      $i = Symbol.for('react.lazy'),
      dd = Symbol.for('react.memo_cache_sentinel');
    Symbol.for('react.postpone');
    var su = Symbol.iterator;
    function Iu(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (su && e[su]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var Ss = Symbol.asyncIterator;
    function Cs() {}
    var pa = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    );
    function md(e, t, s) {
      switch (
        ((s = e[s]),
        s === void 0 ? e.push(t) : s !== t && (t.then(Cs, Cs), (t = s)),
        t.status)
      ) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw t.reason;
        default:
          switch (
            (typeof t.status == 'string'
              ? t.then(Cs, Cs)
              : ((e = t),
                (e.status = 'pending'),
                e.then(
                  function (i) {
                    if (t.status === 'pending') {
                      var r = t;
                      (r.status = 'fulfilled'), (r.value = i);
                    }
                  },
                  function (i) {
                    if (t.status === 'pending') {
                      var r = t;
                      (r.status = 'rejected'), (r.reason = i);
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
          throw ((Ir = t), pa);
      }
    }
    var Ir = null;
    function Eu() {
      if (Ir === null)
        throw Error(
          'Expected a suspended thenable. This is a bug in React. Please file an issue.'
        );
      var e = Ir;
      return (Ir = null), e;
    }
    var Mi = null,
      ta = 0,
      ni = null;
    function Au() {
      var e = ni || [];
      return (ni = null), e;
    }
    var Pu = {
      readContext: na,
      use: kd,
      useCallback: function (e) {
        return e;
      },
      useContext: na,
      useEffect: Vt,
      useImperativeHandle: Vt,
      useLayoutEffect: Vt,
      useInsertionEffect: Vt,
      useMemo: function (e) {
        return e();
      },
      useReducer: Vt,
      useRef: Vt,
      useState: Vt,
      useDebugValue: function () {},
      useDeferredValue: Vt,
      useTransition: Vt,
      useSyncExternalStore: Vt,
      useId: Td,
      useHostTransitionStatus: Vt,
      useFormState: Vt,
      useActionState: Vt,
      useOptimistic: Vt,
      useMemoCache: function (e) {
        for (var t = Array(e), s = 0; s < e; s++) t[s] = dd;
        return t;
      },
      useCacheRefresh: function () {
        return yd;
      },
    };
    Pu.useEffectEvent = Vt;
    function Vt() {
      throw Error('This Hook is not supported in Server Components.');
    }
    function yd() {
      throw Error(
        'Refreshing the cache is not supported in Server Components.'
      );
    }
    function na() {
      throw Error('Cannot read a Client Context from a Server Component.');
    }
    function Td() {
      if (Mi === null)
        throw Error('useId can only be used while React is rendering');
      var e = Mi.identifierCount++;
      return '_' + Mi.identifierPrefix + 'S_' + e.toString(32) + '_';
    }
    function kd(e) {
      if ((e !== null && typeof e == 'object') || typeof e == 'function') {
        if (typeof e.then == 'function') {
          var t = ta;
          return (ta += 1), ni === null && (ni = []), md(ni, e, t);
        }
        e.$$typeof === nu && na();
      }
      throw e.$$typeof === rs
        ? e.value != null && e.value.$$typeof === nu
          ? Error('Cannot read a Client Context from a Server Component.')
          : Error('Cannot use() an already resolved Client Reference.')
        : Error('An unsupported type was passed to use(): ' + String(e));
    }
    var iu = {
        getCacheForType: function (e) {
          var t = (t = st || null) ? t.cache : new Map(),
            s = t.get(e);
          return s === void 0 && ((s = e()), t.set(e, s)), s;
        },
        cacheSignal: function () {
          var e = st || null;
          return e ? e.cacheController.signal : null;
        },
      },
      Is = zf.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (!Is)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    var kn = Array.isArray,
      ii = Object.getPrototypeOf;
    function Nu(e) {
      return (e = Object.prototype.toString.call(e)), e.slice(8, e.length - 1);
    }
    function ru(e) {
      switch (typeof e) {
        case 'string':
          return JSON.stringify(10 >= e.length ? e : e.slice(0, 10) + '...');
        case 'object':
          return kn(e)
            ? '[...]'
            : e !== null && e.$$typeof === sa
            ? 'client'
            : ((e = Nu(e)), e === 'Object' ? '{...}' : e);
        case 'function':
          return e.$$typeof === sa
            ? 'client'
            : (e = e.displayName || e.name)
            ? 'function ' + e
            : 'function';
        default:
          return String(e);
      }
    }
    function Er(e) {
      if (typeof e == 'string') return e;
      switch (e) {
        case hd:
          return 'Suspense';
        case fd:
          return 'SuspenseList';
      }
      if (typeof e == 'object')
        switch (e.$$typeof) {
          case wu:
            return Er(e.render);
          case Su:
            return Er(e.type);
          case $i:
            var t = e._payload;
            e = e._init;
            try {
              return Er(e(t));
            } catch {}
        }
      return '';
    }
    var sa = Symbol.for('react.client.reference');
    function _s(e, t) {
      var s = Nu(e);
      if (s !== 'Object' && s !== 'Array') return s;
      s = -1;
      var i = 0;
      if (kn(e)) {
        for (var r = '[', a = 0; a < e.length; a++) {
          0 < a && (r += ', ');
          var u = e[a];
          (u = typeof u == 'object' && u !== null ? _s(u) : ru(u)),
            '' + a === t
              ? ((s = r.length), (i = u.length), (r += u))
              : (r =
                  10 > u.length && 40 > r.length + u.length
                    ? r + u
                    : r + '...');
        }
        r += ']';
      } else if (e.$$typeof === In) r = '<' + Er(e.type) + '/>';
      else {
        if (e.$$typeof === sa) return 'client';
        for (r = '{', a = Object.keys(e), u = 0; u < a.length; u++) {
          0 < u && (r += ', ');
          var d = a[u],
            y = JSON.stringify(d);
          (r += ('"' + d + '"' === y ? d : y) + ': '),
            (y = e[d]),
            (y = typeof y == 'object' && y !== null ? _s(y) : ru(y)),
            d === t
              ? ((s = r.length), (i = y.length), (r += y))
              : (r =
                  10 > y.length && 40 > r.length + y.length
                    ? r + y
                    : r + '...');
        }
        r += '}';
      }
      return t === void 0
        ? r
        : -1 < s && 0 < i
        ? ((e = ' '.repeat(s) + '^'.repeat(i)),
          `
  ` +
            r +
            `
  ` +
            e)
        : `
  ` + r;
    }
    var Nr = Object.prototype.hasOwnProperty,
      vd = Object.prototype,
      Es = JSON.stringify;
    function xd(e) {
      console.error(e);
    }
    function Ru(e, t, s, i, r, a, u, d, y) {
      if (Is.A !== null && Is.A !== iu)
        throw Error(
          'Currently React only supports one RSC renderer at a time.'
        );
      Is.A = iu;
      var g = new Set(),
        L = [],
        p = new Set();
      (this.type = e),
        (this.status = 10),
        (this.flushScheduled = !1),
        (this.destination = this.fatalError = null),
        (this.bundlerConfig = s),
        (this.cache = new Map()),
        (this.cacheController = new AbortController()),
        (this.pendingChunks = this.nextChunkId = 0),
        (this.hints = p),
        (this.abortableTasks = g),
        (this.pingedTasks = L),
        (this.completedImportChunks = []),
        (this.completedHintChunks = []),
        (this.completedRegularChunks = []),
        (this.completedErrorChunks = []),
        (this.writtenSymbols = new Map()),
        (this.writtenClientReferences = new Map()),
        (this.writtenServerReferences = new Map()),
        (this.writtenObjects = new WeakMap()),
        (this.temporaryReferences = y),
        (this.identifierPrefix = d || ''),
        (this.identifierCount = 1),
        (this.taintCleanupQueue = []),
        (this.onError = i === void 0 ? xd : i),
        (this.onPostpone = r === void 0 ? Cs : r),
        (this.onAllReady = a),
        (this.onFatalError = u),
        (e = os(this, t, null, !1, 0, g)),
        L.push(e);
    }
    var st = null;
    function ou(e, t, s) {
      var i = os(
        e,
        s,
        t.keyPath,
        t.implicitSlot,
        t.formatContext,
        e.abortableTasks
      );
      switch (s.status) {
        case 'fulfilled':
          return (i.model = s.value), Vi(e, i), i.id;
        case 'rejected':
          return Un(e, i, s.reason), i.id;
        default:
          if (e.status === 12)
            return (
              e.abortableTasks.delete(i),
              e.type === 21
                ? (ri(i), oi(i, e))
                : ((t = e.fatalError), ha(i), fa(i, e, t)),
              i.id
            );
          typeof s.status != 'string' &&
            ((s.status = 'pending'),
            s.then(
              function (r) {
                s.status === 'pending' &&
                  ((s.status = 'fulfilled'), (s.value = r));
              },
              function (r) {
                s.status === 'pending' &&
                  ((s.status = 'rejected'), (s.reason = r));
              }
            ));
      }
      return (
        s.then(
          function (r) {
            (i.model = r), Vi(e, i);
          },
          function (r) {
            i.status === 0 && (Un(e, i, r), un(e));
          }
        ),
        i.id
      );
    }
    function gd(e, t, s) {
      function i(g) {
        if (y.status === 0)
          if (g.done)
            (y.status = 1),
              (g =
                y.id.toString(16) +
                `:C
`),
              e.completedRegularChunks.push(pn(g)),
              e.abortableTasks.delete(y),
              e.cacheController.signal.removeEventListener('abort', a),
              un(e),
              Or(e);
          else
            try {
              (y.model = g.value),
                e.pendingChunks++,
                Bu(e, y),
                un(e),
                d.read().then(i, r);
            } catch (L) {
              r(L);
            }
      }
      function r(g) {
        y.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', a),
          Un(e, y, g),
          un(e),
          d.cancel(g).then(r, r));
      }
      function a() {
        if (y.status === 0) {
          var g = e.cacheController.signal;
          g.removeEventListener('abort', a),
            (g = g.reason),
            e.type === 21
              ? (e.abortableTasks.delete(y), ri(y), oi(y, e))
              : (Un(e, y, g), un(e)),
            d.cancel(g).then(r, r);
        }
      }
      var u = s.supportsBYOB;
      if (u === void 0)
        try {
          s.getReader({mode: 'byob'}).releaseLock(), (u = !0);
        } catch {
          u = !1;
        }
      var d = s.getReader(),
        y = os(
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
          y.id.toString(16) +
          ':' +
          (u ? 'r' : 'R') +
          `
`),
        e.completedRegularChunks.push(pn(t)),
        e.cacheController.signal.addEventListener('abort', a),
        d.read().then(i, r),
        Ct(y.id)
      );
    }
    function _d(e, t, s, i) {
      function r(y) {
        if (d.status === 0)
          if (y.done) {
            if (((d.status = 1), y.value === void 0))
              var g =
                d.id.toString(16) +
                `:C
`;
            else
              try {
                var L = bs(e, y.value, 0);
                g =
                  d.id.toString(16) +
                  ':C' +
                  Es(Ct(L)) +
                  `
`;
              } catch (p) {
                a(p);
                return;
              }
            e.completedRegularChunks.push(pn(g)),
              e.abortableTasks.delete(d),
              e.cacheController.signal.removeEventListener('abort', u),
              un(e),
              Or(e);
          } else
            try {
              (d.model = y.value),
                e.pendingChunks++,
                Bu(e, d),
                un(e),
                i.next().then(r, a);
            } catch (p) {
              a(p);
            }
      }
      function a(y) {
        d.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', u),
          Un(e, d, y),
          un(e),
          typeof i.throw == 'function' && i.throw(y).then(a, a));
      }
      function u() {
        if (d.status === 0) {
          var y = e.cacheController.signal;
          y.removeEventListener('abort', u);
          var g = y.reason;
          e.type === 21
            ? (e.abortableTasks.delete(d), ri(d), oi(d, e))
            : (Un(e, d, y.reason), un(e)),
            typeof i.throw == 'function' && i.throw(g).then(a, a);
        }
      }
      s = s === i;
      var d = os(
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
          d.id.toString(16) +
          ':' +
          (s ? 'x' : 'X') +
          `
`),
        e.completedRegularChunks.push(pn(t)),
        e.cacheController.signal.addEventListener('abort', u),
        i.next().then(r, a),
        Ct(d.id)
      );
    }
    function Ut(e, t, s) {
      (s = Es(s)),
        (t = pn(
          ':H' +
            t +
            s +
            `
`
        )),
        e.completedHintChunks.push(t),
        un(e);
    }
    function bd(e) {
      if (e.status === 'fulfilled') return e.value;
      throw e.status === 'rejected' ? e.reason : e;
    }
    function Cd(e, t, s) {
      switch (s.status) {
        case 'fulfilled':
          return s.value;
        case 'rejected':
          break;
        default:
          typeof s.status != 'string' &&
            ((s.status = 'pending'),
            s.then(
              function (i) {
                s.status === 'pending' &&
                  ((s.status = 'fulfilled'), (s.value = i));
              },
              function (i) {
                s.status === 'pending' &&
                  ((s.status = 'rejected'), (s.reason = i));
              }
            ));
      }
      return {$$typeof: $i, _payload: s, _init: bd};
    }
    function au() {}
    function wd(e, t, s, i) {
      if (typeof i != 'object' || i === null || i.$$typeof === rs) return i;
      if (typeof i.then == 'function') return Cd(e, t, i);
      var r = Iu(i);
      return r
        ? ((e = {}),
          (e[Symbol.iterator] = function () {
            return r.call(i);
          }),
          e)
        : typeof i[Ss] != 'function' ||
          (typeof ReadableStream == 'function' && i instanceof ReadableStream)
        ? i
        : ((e = {}),
          (e[Ss] = function () {
            return i[Ss]();
          }),
          e);
    }
    function lu(e, t, s, i, r) {
      var a = t.thenableState;
      if (
        ((t.thenableState = null),
        (ta = 0),
        (ni = a),
        (r = i(r, void 0)),
        e.status === 12)
      )
        throw (
          (typeof r == 'object' &&
            r !== null &&
            typeof r.then == 'function' &&
            r.$$typeof !== rs &&
            r.then(au, au),
          null)
        );
      return (
        (r = wd(e, t, i, r)),
        (i = t.keyPath),
        (a = t.implicitSlot),
        s !== null
          ? (t.keyPath = i === null ? s : i + ',' + s)
          : i === null && (t.implicitSlot = !0),
        (e = qi(e, t, Lr, '', r)),
        (t.keyPath = i),
        (t.implicitSlot = a),
        e
      );
    }
    function cu(e, t, s) {
      return t.keyPath !== null
        ? ((e = [In, ua, t.keyPath, {children: s}]), t.implicitSlot ? [e] : e)
        : s;
    }
    var is = 0;
    function uu(e, t) {
      return (
        (t = os(
          e,
          t.model,
          t.keyPath,
          t.implicitSlot,
          t.formatContext,
          e.abortableTasks
        )),
        Vi(e, t),
        ws(t.id)
      );
    }
    function ia(e, t, s, i, r, a) {
      if (r != null)
        throw Error(
          'Refs cannot be used in Server Components, nor passed to Client Components.'
        );
      if (typeof s == 'function' && s.$$typeof !== rs && s.$$typeof !== ca)
        return lu(e, t, i, s, a);
      if (s === ua && i === null)
        return (
          (s = t.implicitSlot),
          t.keyPath === null && (t.implicitSlot = !0),
          (a = qi(e, t, Lr, '', a.children)),
          (t.implicitSlot = s),
          a
        );
      if (s != null && typeof s == 'object' && s.$$typeof !== rs)
        switch (s.$$typeof) {
          case $i:
            var u = s._init;
            if (((s = u(s._payload)), e.status === 12)) throw null;
            return ia(e, t, s, i, r, a);
          case wu:
            return lu(e, t, i, s.render, a);
          case Su:
            return ia(e, t, s.type, i, r, a);
        }
      else
        typeof s == 'string' &&
          ((r = t.formatContext),
          (u = ld(r, s, a)),
          r !== u && a.children != null && bs(e, a.children, u));
      return (
        (e = i),
        (i = t.keyPath),
        e === null ? (e = i) : i !== null && (e = i + ',' + e),
        (a = [In, s, e, a]),
        (t = t.implicitSlot && e !== null ? [a] : a),
        t
      );
    }
    function Vi(e, t) {
      var s = e.pingedTasks;
      s.push(t),
        s.length === 1 &&
          ((e.flushScheduled = e.destination !== null),
          e.type === 21 || e.status === 10
            ? vu(function () {
                return ra(e);
              })
            : Bi(function () {
                return ra(e);
              }));
    }
    function os(e, t, s, i, r, a) {
      e.pendingChunks++;
      var u = e.nextChunkId++;
      typeof t != 'object' ||
        t === null ||
        s !== null ||
        i ||
        e.writtenObjects.set(t, Ct(u));
      var d = {
        id: u,
        status: 0,
        model: t,
        keyPath: s,
        implicitSlot: i,
        formatContext: r,
        ping: function () {
          return Vi(e, d);
        },
        toJSON: function (y, g) {
          is += y.length;
          var L = d.keyPath,
            p = d.implicitSlot;
          try {
            var h = qi(e, d, this, y, g);
          } catch (x) {
            if (
              ((y = d.model),
              (y =
                typeof y == 'object' &&
                y !== null &&
                (y.$$typeof === In || y.$$typeof === $i)),
              e.status === 12)
            )
              (d.status = 3),
                e.type === 21
                  ? ((L = e.nextChunkId++), (L = y ? ws(L) : Ct(L)), (h = L))
                  : ((L = e.fatalError), (h = y ? ws(L) : Ct(L)));
            else if (
              ((g = x === pa ? Eu() : x),
              typeof g == 'object' && g !== null && typeof g.then == 'function')
            ) {
              h = os(
                e,
                d.model,
                d.keyPath,
                d.implicitSlot,
                d.formatContext,
                e.abortableTasks
              );
              var T = h.ping;
              g.then(T, T),
                (h.thenableState = Au()),
                (d.keyPath = L),
                (d.implicitSlot = p),
                (h = y ? ws(h.id) : Ct(h.id));
            } else
              (d.keyPath = L),
                (d.implicitSlot = p),
                e.pendingChunks++,
                (L = e.nextChunkId++),
                (p = Kn(e, g, d)),
                Rr(e, L, p),
                (h = y ? ws(L) : Ct(L));
          }
          return h;
        },
        thenableState: null,
      };
      return a.add(d), d;
    }
    function Ct(e) {
      return '$' + e.toString(16);
    }
    function ws(e) {
      return '$L' + e.toString(16);
    }
    function Lu(e, t, s) {
      return (
        (e = Es(s)),
        (t =
          t.toString(16) +
          ':' +
          e +
          `
`),
        pn(t)
      );
    }
    function pu(e, t, s, i) {
      var r = i.$$async ? i.$$id + '#async' : i.$$id,
        a = e.writtenClientReferences,
        u = a.get(r);
      if (u !== void 0) return t[0] === In && s === '1' ? ws(u) : Ct(u);
      try {
        var d = e.bundlerConfig,
          y = i.$$id;
        u = '';
        var g = d[y];
        if (g) u = g.name;
        else {
          var L = y.lastIndexOf('#');
          if ((L !== -1 && ((u = y.slice(L + 1)), (g = d[y.slice(0, L)])), !g))
            throw Error(
              'Could not find the module "' +
                y +
                '" in the React Client Manifest. This is probably a bug in the React Server Components bundler.'
            );
        }
        if (g.async === !0 && i.$$async === !0)
          throw Error(
            'The module "' +
              y +
              '" is marked as an async ESM module but was loaded as a CJS proxy. This is probably a bug in the React Server Components bundler.'
          );
        var p =
          g.async === !0 || i.$$async === !0
            ? [g.id, g.chunks, u, 1]
            : [g.id, g.chunks, u];
        e.pendingChunks++;
        var h = e.nextChunkId++,
          T = Es(p),
          x =
            h.toString(16) +
            ':I' +
            T +
            `
`,
          w = pn(x);
        return (
          e.completedImportChunks.push(w),
          a.set(r, h),
          t[0] === In && s === '1' ? ws(h) : Ct(h)
        );
      } catch (S) {
        return (
          e.pendingChunks++,
          (t = e.nextChunkId++),
          (s = Kn(e, S, null)),
          Rr(e, t, s),
          Ct(t)
        );
      }
    }
    function bs(e, t, s) {
      return (t = os(e, t, null, !1, s, e.abortableTasks)), Fu(e, t), t.id;
    }
    function Yt(e, t, s) {
      e.pendingChunks++;
      var i = e.nextChunkId++;
      return Kt(e, i, t, s, !1), Ct(i);
    }
    function Sd(e, t) {
      function s(y) {
        if (u.status === 0)
          if (y.done)
            e.cacheController.signal.removeEventListener('abort', r), Vi(e, u);
          else return a.push(y.value), d.read().then(s).catch(i);
      }
      function i(y) {
        u.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', r),
          Un(e, u, y),
          un(e),
          d.cancel(y).then(i, i));
      }
      function r() {
        if (u.status === 0) {
          var y = e.cacheController.signal;
          y.removeEventListener('abort', r),
            (y = y.reason),
            e.type === 21
              ? (e.abortableTasks.delete(u), ri(u), oi(u, e))
              : (Un(e, u, y), un(e)),
            d.cancel(y).then(i, i);
        }
      }
      var a = [t.type],
        u = os(e, a, null, !1, 0, e.abortableTasks),
        d = t.stream().getReader();
      return (
        e.cacheController.signal.addEventListener('abort', r),
        d.read().then(s).catch(i),
        '$B' + u.id.toString(16)
      );
    }
    var ss = !1;
    function qi(e, t, s, i, r) {
      if (((t.model = r), r === In)) return '$';
      if (r === null) return null;
      if (typeof r == 'object') {
        switch (r.$$typeof) {
          case In:
            var a = null,
              u = e.writtenObjects;
            if (t.keyPath === null && !t.implicitSlot) {
              var d = u.get(r);
              if (d !== void 0)
                if (ss === r) ss = null;
                else return d;
              else
                i.indexOf(':') === -1 &&
                  ((s = u.get(s)),
                  s !== void 0 && ((a = s + ':' + i), u.set(r, a)));
            }
            return 3200 < is
              ? uu(e, t)
              : ((i = r.props),
                (s = i.ref),
                (e = ia(e, t, r.type, r.key, s !== void 0 ? s : null, i)),
                typeof e == 'object' &&
                  e !== null &&
                  a !== null &&
                  (u.has(e) || u.set(e, a)),
                e);
          case $i:
            if (3200 < is) return uu(e, t);
            if (
              ((t.thenableState = null),
              (i = r._init),
              (r = i(r._payload)),
              e.status === 12)
            )
              throw null;
            return qi(e, t, Lr, '', r);
          case pd:
            throw Error(`A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.`);
        }
        if (r.$$typeof === rs) return pu(e, s, i, r);
        if (
          e.temporaryReferences !== void 0 &&
          ((a = e.temporaryReferences.get(r)), a !== void 0)
        )
          return '$T' + a;
        if (
          ((a = e.writtenObjects), (u = a.get(r)), typeof r.then == 'function')
        ) {
          if (u !== void 0) {
            if (t.keyPath !== null || t.implicitSlot)
              return '$@' + ou(e, t, r).toString(16);
            if (ss === r) ss = null;
            else return u;
          }
          return (e = '$@' + ou(e, t, r).toString(16)), a.set(r, e), e;
        }
        if (u !== void 0)
          if (ss === r) {
            if (u !== Ct(t.id)) return u;
            ss = null;
          } else return u;
        else if (i.indexOf(':') === -1 && ((u = a.get(s)), u !== void 0)) {
          if (((d = i), kn(s) && s[0] === In))
            switch (i) {
              case '1':
                d = 'type';
                break;
              case '2':
                d = 'key';
                break;
              case '3':
                d = 'props';
                break;
              case '4':
                d = '_owner';
            }
          a.set(r, u + ':' + d);
        }
        if (kn(r)) return cu(e, t, r);
        if (r instanceof Map)
          return (r = Array.from(r)), '$Q' + bs(e, r, 0).toString(16);
        if (r instanceof Set)
          return (r = Array.from(r)), '$W' + bs(e, r, 0).toString(16);
        if (typeof FormData == 'function' && r instanceof FormData)
          return (r = Array.from(r.entries())), '$K' + bs(e, r, 0).toString(16);
        if (r instanceof Error) return '$Z';
        if (r instanceof ArrayBuffer) return Yt(e, 'A', new Uint8Array(r));
        if (r instanceof Int8Array) return Yt(e, 'O', r);
        if (r instanceof Uint8Array) return Yt(e, 'o', r);
        if (r instanceof Uint8ClampedArray) return Yt(e, 'U', r);
        if (r instanceof Int16Array) return Yt(e, 'S', r);
        if (r instanceof Uint16Array) return Yt(e, 's', r);
        if (r instanceof Int32Array) return Yt(e, 'L', r);
        if (r instanceof Uint32Array) return Yt(e, 'l', r);
        if (r instanceof Float32Array) return Yt(e, 'G', r);
        if (r instanceof Float64Array) return Yt(e, 'g', r);
        if (r instanceof BigInt64Array) return Yt(e, 'M', r);
        if (r instanceof BigUint64Array) return Yt(e, 'm', r);
        if (r instanceof DataView) return Yt(e, 'V', r);
        if (typeof Blob == 'function' && r instanceof Blob) return Sd(e, r);
        if ((a = Iu(r)))
          return (
            (i = a.call(r)),
            i === r
              ? ((r = Array.from(i)), '$i' + bs(e, r, 0).toString(16))
              : cu(e, t, Array.from(i))
          );
        if (typeof ReadableStream == 'function' && r instanceof ReadableStream)
          return gd(e, t, r);
        if (((a = r[Ss]), typeof a == 'function'))
          return (
            t.keyPath !== null
              ? ((e = [In, ua, t.keyPath, {children: r}]),
                (e = t.implicitSlot ? [e] : e))
              : ((i = a.call(r)), (e = _d(e, t, r, i))),
            e
          );
        if (r instanceof Date) return '$D' + r.toJSON();
        if (((e = ii(r)), e !== vd && (e === null || ii(e) !== null)))
          throw Error(
            'Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.' +
              _s(s, i)
          );
        return r;
      }
      if (typeof r == 'string')
        return (
          (is += r.length),
          r[r.length - 1] === 'Z' && s[i] instanceof Date
            ? '$D' + r
            : 1024 <= r.length && la !== null
            ? (e.pendingChunks++, (t = e.nextChunkId++), Du(e, t, r, !1), Ct(t))
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
        if (r.$$typeof === rs) return pu(e, s, i, r);
        if (r.$$typeof === Ar)
          return (
            (t = e.writtenServerReferences),
            (i = t.get(r)),
            i !== void 0
              ? (e = '$h' + i.toString(16))
              : ((i = r.$$bound),
                (i = i === null ? null : Promise.resolve(i)),
                (e = bs(e, {id: r.$$id, bound: i}, 0)),
                t.set(r, e),
                (e = '$h' + e.toString(16))),
            e
          );
        if (
          e.temporaryReferences !== void 0 &&
          ((e = e.temporaryReferences.get(r)), e !== void 0)
        )
          return '$T' + e;
        throw r.$$typeof === ca
          ? Error(
              'Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server.'
            )
          : /^on[A-Z]/.test(i)
          ? Error(
              'Event handlers cannot be passed to Client Component props.' +
                _s(s, i) +
                `
If you need interactivity, consider converting part of this to a Client Component.`
            )
          : Error(
              'Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.' +
                _s(s, i)
            );
      }
      if (typeof r == 'symbol') {
        if (((t = e.writtenSymbols), (a = t.get(r)), a !== void 0))
          return Ct(a);
        if (((a = r.description), Symbol.for(a) !== r))
          throw Error(
            'Only global symbols received from Symbol.for(...) can be passed to Client Components. The symbol Symbol.for(' +
              (r.description + ') cannot be found among global symbols.') +
              _s(s, i)
          );
        return (
          e.pendingChunks++,
          (i = e.nextChunkId++),
          (s = Lu(e, i, '$S' + a)),
          e.completedImportChunks.push(s),
          t.set(r, i),
          Ct(i)
        );
      }
      if (typeof r == 'bigint') return '$n' + r.toString(10);
      throw Error(
        'Type ' +
          typeof r +
          ' is not supported in Client Component props.' +
          _s(s, i)
      );
    }
    function Kn(e, t) {
      var s = st;
      st = null;
      try {
        var i = e.onError,
          r = i(t);
      } finally {
        st = s;
      }
      if (r != null && typeof r != 'string')
        throw Error(
          'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' +
            typeof r +
            '" instead'
        );
      return r || '';
    }
    function Ki(e, t) {
      var s = e.onFatalError;
      s(t),
        e.destination !== null
          ? ((e.status = 14), xu(e.destination, t))
          : ((e.status = 13), (e.fatalError = t)),
        e.cacheController.abort(
          Error('The render was aborted due to a fatal error.', {cause: t})
        );
    }
    function Rr(e, t, s) {
      (s = {digest: s}),
        (t =
          t.toString(16) +
          ':E' +
          Es(s) +
          `
`),
        (t = pn(t)),
        e.completedErrorChunks.push(t);
    }
    function Ou(e, t, s) {
      (t =
        t.toString(16) +
        ':' +
        s +
        `
`),
        (t = pn(t)),
        e.completedRegularChunks.push(t);
    }
    function Kt(e, t, s, i, r) {
      r ? e.pendingDebugChunks++ : e.pendingChunks++,
        (r = new Uint8Array(i.buffer, i.byteOffset, i.byteLength)),
        (i = 2048 < i.byteLength ? r.slice() : r),
        (r = i.byteLength),
        (t = t.toString(16) + ':' + s + r.toString(16) + ','),
        (t = pn(t)),
        e.completedRegularChunks.push(t, i);
    }
    function Du(e, t, s, i) {
      if (la === null)
        throw Error(
          'Existence of byteLengthOfChunk should have already been checked. This is a bug in React.'
        );
      i ? e.pendingDebugChunks++ : e.pendingChunks++,
        (s = pn(s)),
        (i = s.byteLength),
        (t = t.toString(16) + ':T' + i.toString(16) + ','),
        (t = pn(t)),
        e.completedRegularChunks.push(t, s);
    }
    function Mu(e, t, s) {
      var i = t.id;
      typeof s == 'string' && la !== null
        ? Du(e, i, s, !1)
        : s instanceof ArrayBuffer
        ? Kt(e, i, 'A', new Uint8Array(s), !1)
        : s instanceof Int8Array
        ? Kt(e, i, 'O', s, !1)
        : s instanceof Uint8Array
        ? Kt(e, i, 'o', s, !1)
        : s instanceof Uint8ClampedArray
        ? Kt(e, i, 'U', s, !1)
        : s instanceof Int16Array
        ? Kt(e, i, 'S', s, !1)
        : s instanceof Uint16Array
        ? Kt(e, i, 's', s, !1)
        : s instanceof Int32Array
        ? Kt(e, i, 'L', s, !1)
        : s instanceof Uint32Array
        ? Kt(e, i, 'l', s, !1)
        : s instanceof Float32Array
        ? Kt(e, i, 'G', s, !1)
        : s instanceof Float64Array
        ? Kt(e, i, 'g', s, !1)
        : s instanceof BigInt64Array
        ? Kt(e, i, 'M', s, !1)
        : s instanceof BigUint64Array
        ? Kt(e, i, 'm', s, !1)
        : s instanceof DataView
        ? Kt(e, i, 'V', s, !1)
        : ((s = Es(s, t.toJSON)), Ou(e, t.id, s));
    }
    function Un(e, t, s) {
      (t.status = 4),
        (s = Kn(e, s, t)),
        Rr(e, t.id, s),
        e.abortableTasks.delete(t),
        Or(e);
    }
    var Lr = {};
    function Fu(e, t) {
      if (t.status === 0) {
        t.status = 5;
        var s = is;
        try {
          ss = t.model;
          var i = qi(e, t, Lr, '', t.model);
          if (
            ((ss = i),
            (t.keyPath = null),
            (t.implicitSlot = !1),
            typeof i == 'object' && i !== null)
          )
            e.writtenObjects.set(i, Ct(t.id)), Mu(e, t, i);
          else {
            var r = Es(i);
            Ou(e, t.id, r);
          }
          (t.status = 1), e.abortableTasks.delete(t), Or(e);
        } catch (y) {
          if (e.status === 12)
            if ((e.abortableTasks.delete(t), (t.status = 0), e.type === 21))
              ri(t), oi(t, e);
            else {
              var a = e.fatalError;
              ha(t), fa(t, e, a);
            }
          else {
            var u = y === pa ? Eu() : y;
            if (
              typeof u == 'object' &&
              u !== null &&
              typeof u.then == 'function'
            ) {
              (t.status = 0), (t.thenableState = Au());
              var d = t.ping;
              u.then(d, d);
            } else Un(e, t, u);
          }
        } finally {
          is = s;
        }
      }
    }
    function Bu(e, t) {
      var s = is;
      try {
        Mu(e, t, t.model);
      } finally {
        is = s;
      }
    }
    function ra(e) {
      var t = Is.H;
      Is.H = Pu;
      var s = st;
      Mi = st = e;
      try {
        var i = e.pingedTasks;
        e.pingedTasks = [];
        for (var r = 0; r < i.length; r++) Fu(e, i[r]);
        ai(e);
      } catch (a) {
        Kn(e, a, null), Ki(e, a);
      } finally {
        (Is.H = t), (Mi = null), (st = s);
      }
    }
    function ha(e) {
      e.status === 0 && (e.status = 3);
    }
    function fa(e, t, s) {
      e.status === 3 &&
        ((s = Ct(s)), (e = Lu(t, e.id, s)), t.completedErrorChunks.push(e));
    }
    function ri(e) {
      e.status === 0 && (e.status = 3);
    }
    function oi(e, t) {
      e.status === 3 && t.pendingChunks--;
    }
    function ai(e) {
      var t = e.destination;
      if (t !== null) {
        (ln = new Uint8Array(2048)), (cn = 0);
        try {
          for (var s = e.completedImportChunks, i = 0; i < s.length; i++)
            e.pendingChunks--, Cr(t, s[i]);
          s.splice(0, i);
          var r = e.completedHintChunks;
          for (i = 0; i < r.length; i++) Cr(t, r[i]);
          r.splice(0, i);
          var a = e.completedRegularChunks;
          for (i = 0; i < a.length; i++) e.pendingChunks--, Cr(t, a[i]);
          a.splice(0, i);
          var u = e.completedErrorChunks;
          for (i = 0; i < u.length; i++) e.pendingChunks--, Cr(t, u[i]);
          u.splice(0, i);
        } finally {
          (e.flushScheduled = !1),
            ln &&
              0 < cn &&
              (t.enqueue(new Uint8Array(ln.buffer, 0, cn)),
              (ln = null),
              (cn = 0));
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
    function Vu(e) {
      (e.flushScheduled = e.destination !== null),
        vu(function () {
          return ra(e);
        }),
        Bi(function () {
          e.status === 10 && (e.status = 11);
        });
    }
    function un(e) {
      e.flushScheduled === !1 &&
        e.pingedTasks.length === 0 &&
        e.destination !== null &&
        ((e.flushScheduled = !0),
        Bi(function () {
          (e.flushScheduled = !1), ai(e);
        }));
    }
    function Or(e) {
      e.abortableTasks.size === 0 && ((e = e.onAllReady), e());
    }
    function ju(e, t) {
      if (e.status === 13) (e.status = 14), xu(t, e.fatalError);
      else if (e.status !== 14 && e.destination === null) {
        e.destination = t;
        try {
          ai(e);
        } catch (s) {
          Kn(e, s, null), Ki(e, s);
        }
      }
    }
    function Id(e, t) {
      try {
        t.forEach(function (i) {
          return oi(i, e);
        });
        var s = e.onAllReady;
        s(), ai(e);
      } catch (i) {
        Kn(e, i, null), Ki(e, i);
      }
    }
    function Ed(e, t, s) {
      try {
        t.forEach(function (r) {
          return fa(r, e, s);
        });
        var i = e.onAllReady;
        i(), ai(e);
      } catch (r) {
        Kn(e, r, null), Ki(e, r);
      }
    }
    function si(e, t) {
      if (!(11 < e.status))
        try {
          (e.status = 12), e.cacheController.abort(t);
          var s = e.abortableTasks;
          if (0 < s.size)
            if (e.type === 21)
              s.forEach(function (d) {
                return ri(d, e);
              }),
                Bi(function () {
                  return Id(e, s);
                });
            else {
              var i =
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
                r = Kn(e, i, null),
                a = e.nextChunkId++;
              (e.fatalError = a),
                e.pendingChunks++,
                Rr(e, a, r, i, !1, null),
                s.forEach(function (d) {
                  return ha(d, e, a);
                }),
                Bi(function () {
                  return Ed(e, s, a);
                });
            }
          else {
            var u = e.onAllReady;
            u(), ai(e);
          }
        } catch (d) {
          Kn(e, d, null), Ki(e, d);
        }
    }
    function $u(e, t) {
      var s = '',
        i = e[t];
      if (i) s = i.name;
      else {
        var r = t.lastIndexOf('#');
        if ((r !== -1 && ((s = t.slice(r + 1)), (i = e[t.slice(0, r)])), !i))
          throw Error(
            'Could not find the module "' +
              t +
              '" in the React Server Manifest. This is probably a bug in the React Server Components bundler.'
          );
      }
      return i.async ? [i.id, i.chunks, s, 1] : [i.id, i.chunks, s];
    }
    var wr = new Map();
    function hu(e) {
      var t = __webpack_require__(e);
      return typeof t.then != 'function' || t.status === 'fulfilled'
        ? null
        : (t.then(
            function (s) {
              (t.status = 'fulfilled'), (t.value = s);
            },
            function (s) {
              (t.status = 'rejected'), (t.reason = s);
            }
          ),
          t);
    }
    function Ad() {}
    function qu(e) {
      for (var t = e[1], s = [], i = 0; i < t.length; ) {
        var r = t[i++],
          a = t[i++],
          u = wr.get(r);
        u === void 0
          ? (Ku.set(r, a),
            (a = __webpack_chunk_load__(r)),
            s.push(a),
            (u = wr.set.bind(wr, r, null)),
            a.then(u, Ad),
            wr.set(r, a))
          : u !== null && s.push(u);
      }
      return e.length === 4
        ? s.length === 0
          ? hu(e[0])
          : Promise.all(s).then(function () {
              return hu(e[0]);
            })
        : 0 < s.length
        ? Promise.all(s)
        : null;
    }
    function Fi(e) {
      var t = __webpack_require__(e[0]);
      if (e.length === 4 && typeof t.then == 'function')
        if (t.status === 'fulfilled') t = t.value;
        else throw t.reason;
      if (e[2] === '*') return t;
      if (e[2] === '') return t.__esModule ? t.default : t;
      if (Nr.call(t, e[2])) return t[e[2]];
    }
    var Ku = new Map(),
      Pd = __webpack_require__.u;
    __webpack_require__.u = function (e) {
      var t = Ku.get(e);
      return t !== void 0 ? t : Pd(e);
    };
    var Dr = Symbol();
    function Ot(e, t, s) {
      (this.status = e), (this.value = t), (this.reason = s);
    }
    Ot.prototype = Object.create(Promise.prototype);
    Ot.prototype.then = function (e, t) {
      switch (this.status) {
        case 'resolved_model':
          Br(this);
      }
      switch (this.status) {
        case 'fulfilled':
          if (typeof e == 'function') {
            for (var s = this.value, i = 0, r = new Set(); s instanceof Ot; ) {
              if ((i++, s === this || r.has(s) || 1e3 < i)) {
                typeof t == 'function' &&
                  t(Error('Cannot have cyclic thenables.'));
                return;
              }
              if ((r.add(s), s.status === 'fulfilled')) s = s.value;
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
    var Uu = Object.prototype,
      Hu = Array.prototype;
    function Mr(e, t, s, i) {
      for (var r = 0; r < t.length; r++) {
        var a = t[r];
        typeof a == 'function' ? a(s) : zu(e, a, s, i.reason);
      }
    }
    function da(e, t, s) {
      for (var i = 0; i < t.length; i++) {
        var r = t[i];
        typeof r == 'function' ? r(s) : Pr(e, r.handler, s);
      }
    }
    function Fr(e, t, s) {
      if (t.status !== 'pending' && t.status !== 'blocked') t.reason.error(s);
      else {
        var i = t.reason;
        (t.status = 'rejected'), (t.reason = s), i !== null && da(e, i, s);
      }
    }
    function Wu(e, t, s) {
      var i = {};
      return new Ot('resolved_model', t, ((i.id = s), (i[Dr] = e), i));
    }
    function Gu(e, t, s, i) {
      if (t.status !== 'pending')
        (t = t.reason),
          s[0] === 'C'
            ? t.close(s === 'C' ? '"$undefined"' : s.slice(1))
            : t.enqueueModel(s);
      else {
        var r = t.value,
          a = t.reason;
        if (
          ((t.status = 'resolved_model'),
          (t.value = s),
          (s = {}),
          (t.reason = ((s.id = i), (s[Dr] = e), s)),
          r !== null)
        )
          switch ((Br(t), t.status)) {
            case 'fulfilled':
              Mr(e, r, t.value, t);
              break;
            case 'blocked':
            case 'pending':
              if (t.value) for (e = 0; e < r.length; e++) t.value.push(r[e]);
              else t.value = r;
              if (t.reason) {
                if (a) for (r = 0; r < a.length; r++) t.reason.push(a[r]);
              } else t.reason = a;
              break;
            case 'rejected':
              a && da(e, a, t.reason);
          }
      }
    }
    function fu(e, t, s) {
      var i = {};
      return new Ot(
        'resolved_model',
        (s ? '{"done":true,"value":' : '{"done":false,"value":') + t + '}',
        ((i.id = -1), (i[Dr] = e), i)
      );
    }
    function ea(e, t, s, i) {
      Gu(
        e,
        t,
        (i ? '{"done":true,"value":' : '{"done":false,"value":') + s + '}',
        -1
      );
    }
    function Nd(e, t, s, i) {
      function r(L) {
        var p = d.reason,
          h = d;
        (h.status = 'rejected'),
          (h.value = null),
          (h.reason = L),
          p !== null && da(e, p, L),
          Pr(e, g, L);
      }
      var a = t.id;
      if (typeof a != 'string' || i === 'then') return null;
      var u = t.$$promise;
      if (u !== void 0)
        return u.status === 'fulfilled'
          ? ((u = u.value), i === '__proto__' ? null : (s[i] = u))
          : (Ye
              ? ((a = Ye), a.deps++)
              : (a = Ye =
                  {
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: !1,
                  }),
            u.then(aa.bind(null, e, a, s, i), Pr.bind(null, e, a)),
            null);
      var d = new Ot('blocked', null, null);
      t.$$promise = d;
      var y = $u(e._bundlerConfig, a);
      if (((u = t.bound), (a = qu(y))))
        u instanceof Ot && (a = Promise.all([a, u]));
      else if (u instanceof Ot) a = Promise.resolve(u);
      else return (u = Fi(y)), (a = d), (a.status = 'fulfilled'), (a.value = u);
      if (Ye) {
        var g = Ye;
        g.deps++;
      } else
        g = Ye = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        a.then(function () {
          var L = Fi(y);
          if (t.bound) {
            var p = t.bound.value;
            if (((p = kn(p) ? p.slice(0) : []), 1e3 < p.length)) {
              r(
                Error(
                  'Server Function has too many bound arguments. Received ' +
                    p.length +
                    ' but the limit is 1000.'
                )
              );
              return;
            }
            p.unshift(null), (L = L.bind.apply(L, p));
          }
          p = d.value;
          var h = d;
          (h.status = 'fulfilled'),
            (h.value = L),
            (h.reason = null),
            p !== null && Mr(e, p, L, h),
            aa(e, g, s, i, L);
        }, r),
        null
      );
    }
    function oa(e, t, s, i, r, a) {
      if (typeof i == 'string') return Fd(e, t, s, i, r, a);
      if (typeof i == 'object' && i !== null)
        if (
          (r !== void 0 &&
            e._temporaryReferences !== void 0 &&
            e._temporaryReferences.set(i, r),
          kn(i))
        ) {
          if (a === null) {
            var u = {count: 0, fork: !1};
            e._rootArrayContexts.set(i, u);
          } else u = a;
          for (
            1 < i.length && (u.fork = !0), $n(u, i.length + 1, e), t = 0;
            t < i.length;
            t++
          )
            i[t] = oa(
              e,
              i,
              '' + t,
              i[t],
              r !== void 0 ? r + ':' + t : void 0,
              u
            );
        } else
          for (u in i)
            Nr.call(i, u) &&
              (u === '__proto__'
                ? delete i[u]
                : ((t =
                    r !== void 0 && u.indexOf(':') === -1
                      ? r + ':' + u
                      : void 0),
                  (t = oa(e, i, u, i[u], t, null)),
                  t !== void 0 ? (i[u] = t) : delete i[u]));
      return i;
    }
    function $n(e, t, s) {
      if ((e.count += t) > s._arraySizeLimit && e.fork)
        throw Error(
          'Maximum array nesting exceeded. Large nested arrays can be dangerous. Try adding intermediate objects.'
        );
    }
    var Ye = null;
    function Br(e) {
      var t = Ye;
      Ye = null;
      var s = e.reason,
        i = s[Dr];
      (s = s.id), (s = s === -1 ? void 0 : s.toString(16));
      var r = e.value;
      (e.status = 'blocked'), (e.value = null), (e.reason = null);
      try {
        var a = JSON.parse(r);
        r = {count: 0, fork: !1};
        var u = oa(i, {'': a}, '', a, s, r),
          d = e.value;
        if (d !== null)
          for (e.value = null, e.reason = null, a = 0; a < d.length; a++) {
            var y = d[a];
            typeof y == 'function' ? y(u) : zu(i, y, u, r);
          }
        if (Ye !== null) {
          if (Ye.errored) throw Ye.reason;
          if (0 < Ye.deps) {
            (Ye.value = u), (Ye.reason = r), (Ye.chunk = e);
            return;
          }
        }
        (e.status = 'fulfilled'), (e.value = u), (e.reason = r);
      } catch (g) {
        (e.status = 'rejected'), (e.reason = g);
      } finally {
        Ye = t;
      }
    }
    function Rd(e, t) {
      (e._closed = !0),
        (e._closedReason = t),
        e._chunks.forEach(function (s) {
          s.status === 'pending'
            ? Fr(e, s, t)
            : s.status === 'fulfilled' &&
              s.reason !== null &&
              ((s = s.reason), typeof s.error == 'function' && s.error(t));
        });
    }
    function Vr(e, t) {
      var s = e._chunks,
        i = s.get(t);
      return (
        i ||
          ((i = e._formData.get(e._prefix + t)),
          (i =
            typeof i == 'string'
              ? Wu(e, i, t)
              : e._closed
              ? new Ot('rejected', null, e._closedReason)
              : new Ot('pending', null, null)),
          s.set(t, i)),
        i
      );
    }
    function zu(e, t, s, i) {
      var r = t.handler,
        a = t.parentObject,
        u = t.key,
        d = t.map,
        y = t.path;
      try {
        for (var g = 0, L = e._rootArrayContexts, p = 1; p < y.length; p++) {
          var h = y[p];
          if (
            typeof s != 'object' ||
            s === null ||
            (ii(s) !== Uu && ii(s) !== Hu) ||
            !Nr.call(s, h)
          )
            throw Error('Invalid reference.');
          if (((s = s[h]), kn(s))) (g = 0), (i = L.get(s) || i);
          else if (((i = null), typeof s == 'string')) g = s.length;
          else if (typeof s == 'bigint') {
            var T = Math.abs(Number(s));
            g = T === 0 ? 1 : Math.floor(Math.log10(T)) + 1;
          } else g = ArrayBuffer.isView(s) ? s.byteLength : 0;
        }
        var x = d(e, s, a, u),
          w = t.arrayRoot;
        w !== null &&
          (i !== null
            ? (i.fork && (w.fork = !0), $n(w, i.count, e))
            : 0 < g && $n(w, g, e));
      } catch (S) {
        Pr(e, r, S);
        return;
      }
      aa(e, r, a, u, x);
    }
    function aa(e, t, s, i, r) {
      i !== '__proto__' && (s[i] = r),
        i === '' && t.value === null && (t.value = r),
        t.deps--,
        t.deps === 0 &&
          ((s = t.chunk),
          s !== null &&
            s.status === 'blocked' &&
            ((i = s.value),
            (s.status = 'fulfilled'),
            (s.value = t.value),
            (s.reason = t.reason),
            i !== null && Mr(e, i, t.value, s)));
    }
    function Pr(e, t, s) {
      t.errored ||
        ((t.errored = !0),
        (t.value = null),
        (t.reason = s),
        (t = t.chunk),
        t !== null && t.status === 'blocked' && Fr(e, t, s));
    }
    function Di(e, t, s, i, r, a) {
      t = t.split(':');
      var u = parseInt(t[0], 16),
        d = Vr(e, u);
      switch (d.status) {
        case 'resolved_model':
          Br(d);
      }
      switch (d.status) {
        case 'fulfilled':
          (u = d.value), (d = d.reason);
          for (var y = 0, g = e._rootArrayContexts, L = 1; L < t.length; L++) {
            if (
              ((y = t[L]),
              typeof u != 'object' ||
                u === null ||
                (ii(u) !== Uu && ii(u) !== Hu) ||
                !Nr.call(u, y))
            )
              throw Error('Invalid reference.');
            (u = u[y]),
              kn(u)
                ? ((y = 0), (d = g.get(u) || d))
                : ((d = null),
                  typeof u == 'string'
                    ? (y = u.length)
                    : typeof u == 'bigint'
                    ? ((y = Math.abs(Number(u))),
                      (y = y === 0 ? 1 : Math.floor(Math.log10(y)) + 1))
                    : (y = ArrayBuffer.isView(u) ? u.byteLength : 0));
          }
          return (
            (s = a(e, u, s, i)),
            r !== null &&
              (d !== null
                ? (d.fork && (r.fork = !0), $n(r, d.count, e))
                : 0 < y && $n(r, y, e)),
            s
          );
        case 'blocked':
          return (
            Ye
              ? ((e = Ye), e.deps++)
              : (e = Ye =
                  {
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: !1,
                  }),
            (r = {
              handler: e,
              parentObject: s,
              key: i,
              map: a,
              path: t,
              arrayRoot: r,
            }),
            d.value === null ? (d.value = [r]) : d.value.push(r),
            d.reason === null ? (d.reason = [r]) : d.reason.push(r),
            null
          );
        case 'pending':
          throw Error('Invalid forward reference.');
        default:
          return (
            Ye
              ? ((Ye.errored = !0), (Ye.value = null), (Ye.reason = d.reason))
              : (Ye = {
                  chunk: null,
                  value: null,
                  reason: d.reason,
                  deps: 0,
                  errored: !0,
                }),
            null
          );
      }
    }
    function Ld(e, t) {
      if (!kn(t)) throw Error('Invalid Map initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Map.');
      return (e = new Map(t)), (t.$$consumed = !0), e;
    }
    function Od(e, t) {
      if (!kn(t)) throw Error('Invalid Set initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Set.');
      return (e = new Set(t)), (t.$$consumed = !0), e;
    }
    function Dd(e, t) {
      if (!kn(t)) throw Error('Invalid Iterator initializer.');
      if (t.$$consumed === !0) throw Error('Already initialized Iterator.');
      return (e = t[Symbol.iterator]()), (t.$$consumed = !0), e;
    }
    function Md(e, t, s, i) {
      return i === 'then' && typeof t == 'function' ? null : t;
    }
    function Jt(e, t, s, i, r, a, u) {
      function d(L) {
        if (!g.errored) {
          (g.errored = !0), (g.value = null), (g.reason = L);
          var p = g.chunk;
          p !== null && p.status === 'blocked' && Fr(e, p, L);
        }
      }
      t = parseInt(t.slice(2), 16);
      var y = e._prefix + t;
      if (((i = e._chunks), i.has(t)))
        throw Error('Already initialized typed array.');
      if (
        (i.set(
          t,
          new Ot('rejected', null, Error('Already initialized typed array.'))
        ),
        (t = e._formData.get(y).arrayBuffer()),
        Ye)
      ) {
        var g = Ye;
        g.deps++;
      } else
        g = Ye = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        t.then(function (L) {
          try {
            u !== null && $n(u, L.byteLength, e);
            var p = s === ArrayBuffer ? L : new s(L);
            y !== '__proto__' && (r[a] = p),
              a === '' && g.value === null && (g.value = p);
          } catch (h) {
            d(h);
            return;
          }
          g.deps--,
            g.deps === 0 &&
              ((L = g.chunk),
              L !== null &&
                L.status === 'blocked' &&
                ((p = L.value),
                (L.status = 'fulfilled'),
                (L.value = g.value),
                (L.reason = null),
                p !== null && Mr(e, p, g.value, L)));
        }, d),
        null
      );
    }
    function Xu(e, t, s, i) {
      var r = e._chunks;
      for (
        s = new Ot('fulfilled', s, i),
          r.set(t, s),
          e = e._formData.getAll(e._prefix + t),
          t = 0;
        t < e.length;
        t++
      )
        (r = e[t]),
          typeof r == 'string' &&
            (r[0] === 'C'
              ? i.close(r === 'C' ? '"$undefined"' : r.slice(1))
              : i.enqueueModel(r));
    }
    function du(e, t, s) {
      function i(g) {
        s !== 'bytes' || ArrayBuffer.isView(g)
          ? r.enqueue(g)
          : y.error(Error('Invalid data for bytes stream.'));
      }
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error('Already initialized stream.');
      var r = null,
        a = !1,
        u = new ReadableStream({
          type: s,
          start: function (g) {
            r = g;
          },
        }),
        d = null,
        y = {
          enqueueModel: function (g) {
            if (d === null) {
              var L = Wu(e, g, -1);
              Br(L),
                L.status === 'fulfilled'
                  ? i(L.value)
                  : (L.then(i, y.error), (d = L));
            } else {
              L = d;
              var p = new Ot('pending', null, null);
              p.then(i, y.error),
                (d = p),
                L.then(function () {
                  d === p && (d = null), Gu(e, p, g, -1);
                });
            }
          },
          close: function () {
            if (!a)
              if (((a = !0), d === null)) r.close();
              else {
                var g = d;
                (d = null),
                  g.then(function () {
                    return r.close();
                  });
              }
          },
          error: function (g) {
            if (!a)
              if (((a = !0), d === null)) r.error(g);
              else {
                var L = d;
                (d = null),
                  L.then(function () {
                    return r.error(g);
                  });
              }
          },
        };
      return Xu(e, t, u, y), u;
    }
    function ma(e) {
      this.next = e;
    }
    ma.prototype = {};
    ma.prototype[Ss] = function () {
      return this;
    };
    function mu(e, t, s) {
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error('Already initialized stream.');
      var i = [],
        r = !1,
        a = 0,
        u = {};
      return (
        (u =
          ((u[Ss] = function () {
            var d = 0;
            return new ma(function (y) {
              if (y !== void 0)
                throw Error(
                  'Values cannot be passed to next() of AsyncIterables passed to Client Components.'
                );
              if (d === i.length) {
                if (r)
                  return new Ot('fulfilled', {done: !0, value: void 0}, null);
                i[d] = new Ot('pending', null, null);
              }
              return i[d++];
            });
          }),
          u)),
        (s = s ? u[Ss]() : u),
        Xu(e, t, s, {
          enqueueModel: function (d) {
            a === i.length ? (i[a] = fu(e, d, !1)) : ea(e, i[a], d, !1), a++;
          },
          close: function (d) {
            if (!r)
              for (
                r = !0,
                  a === i.length ? (i[a] = fu(e, d, !0)) : ea(e, i[a], d, !0),
                  a++;
                a < i.length;

              )
                ea(e, i[a++], '"$undefined"', !0);
          },
          error: function (d) {
            if (!r)
              for (
                r = !0,
                  a === i.length && (i[a] = new Ot('pending', null, null));
                a < i.length;

              )
                Fr(e, i[a++], d);
          },
        }),
        s
      );
    }
    function Fd(e, t, s, i, r, a) {
      if (i[0] === '$') {
        switch (i[1]) {
          case '$':
            return a !== null && $n(a, i.length - 1, e), i.slice(1);
          case '@':
            return (t = parseInt(i.slice(2), 16)), Vr(e, t);
          case 'h':
            return (a = i.slice(2)), Di(e, a, t, s, null, Nd);
          case 'T':
            if (r === void 0 || e._temporaryReferences === void 0)
              throw Error(
                'Could not reference an opaque temporary reference. This is likely due to misconfiguring the temporaryReferences options on the server.'
              );
            return ud(e._temporaryReferences, r);
          case 'Q':
            return (a = i.slice(2)), Di(e, a, t, s, null, Ld);
          case 'W':
            return (a = i.slice(2)), Di(e, a, t, s, null, Od);
          case 'K':
            for (
              t = i.slice(2),
                t = e._prefix + t + '_',
                s = new FormData(),
                e = e._formData,
                a = Array.from(e.keys()),
                i = 0;
              i < a.length;
              i++
            )
              if (((r = a[i]), r.startsWith(t))) {
                for (
                  var u = e.getAll(r), d = r.slice(t.length), y = 0;
                  y < u.length;
                  y++
                )
                  s.append(d, u[y]);
                e.delete(r);
              }
            return s;
          case 'i':
            return (a = i.slice(2)), Di(e, a, t, s, null, Dd);
          case 'I':
            return 1 / 0;
          case '-':
            return i === '$-0' ? -0 : -1 / 0;
          case 'N':
            return NaN;
          case 'u':
            return;
          case 'D':
            return new Date(Date.parse(i.slice(2)));
          case 'n':
            if (((t = i.slice(2)), 300 < t.length))
              throw Error(
                'BigInt is too large. Received ' +
                  t.length +
                  ' digits but the limit is 300.'
              );
            return a !== null && $n(a, t.length, e), BigInt(t);
          case 'A':
            return Jt(e, i, ArrayBuffer, 1, t, s, a);
          case 'O':
            return Jt(e, i, Int8Array, 1, t, s, a);
          case 'o':
            return Jt(e, i, Uint8Array, 1, t, s, a);
          case 'U':
            return Jt(e, i, Uint8ClampedArray, 1, t, s, a);
          case 'S':
            return Jt(e, i, Int16Array, 2, t, s, a);
          case 's':
            return Jt(e, i, Uint16Array, 2, t, s, a);
          case 'L':
            return Jt(e, i, Int32Array, 4, t, s, a);
          case 'l':
            return Jt(e, i, Uint32Array, 4, t, s, a);
          case 'G':
            return Jt(e, i, Float32Array, 4, t, s, a);
          case 'g':
            return Jt(e, i, Float64Array, 8, t, s, a);
          case 'M':
            return Jt(e, i, BigInt64Array, 8, t, s, a);
          case 'm':
            return Jt(e, i, BigUint64Array, 8, t, s, a);
          case 'V':
            return Jt(e, i, DataView, 1, t, s, a);
          case 'B':
            return (
              (t = parseInt(i.slice(2), 16)), e._formData.get(e._prefix + t)
            );
          case 'R':
            return du(e, i, void 0);
          case 'r':
            return du(e, i, 'bytes');
          case 'X':
            return mu(e, i, !1);
          case 'x':
            return mu(e, i, !0);
        }
        return (i = i.slice(1)), Di(e, i, t, s, a, Md);
      }
      return a !== null && $n(a, i.length, e), i;
    }
    function Yu(e, t, s) {
      var i =
          3 < arguments.length && arguments[3] !== void 0
            ? arguments[3]
            : new FormData(),
        r =
          4 < arguments.length && arguments[4] !== void 0 ? arguments[4] : 1e6,
        a = new Map();
      return {
        _bundlerConfig: e,
        _prefix: t,
        _formData: i,
        _chunks: a,
        _closed: !1,
        _closedReason: null,
        _temporaryReferences: s,
        _rootArrayContexts: new WeakMap(),
        _arraySizeLimit: r,
      };
    }
    function Ju(e) {
      Rd(e, Error('Connection closed.'));
    }
    function yu(e, t) {
      var s = t.id;
      if (typeof s != 'string') return null;
      var i = $u(e, s);
      return (
        (e = qu(i)),
        (t = t.bound),
        t instanceof Promise
          ? Promise.all([t, e]).then(function (r) {
              r = r[0];
              var a = Fi(i);
              if (1e3 < r.length)
                throw Error(
                  'Server Function has too many bound arguments. Received ' +
                    r.length +
                    ' but the limit is 1000.'
                );
              return a.bind.apply(a, [null].concat(r));
            })
          : e
          ? Promise.resolve(e).then(function () {
              return Fi(i);
            })
          : Promise.resolve(Fi(i))
      );
    }
    function Qu(e, t, s, i) {
      if (
        ((e = Yu(t, s, void 0, e, i)),
        Ju(e),
        (e = Vr(e, 0)),
        e.then(function () {}),
        e.status !== 'fulfilled')
      )
        throw e.reason;
      return e.value;
    }
    En.createClientModuleProxy = function (e) {
      return (e = ti({}, e, !1)), new Proxy(e, _u);
    };
    En.createTemporaryReferenceSet = function () {
      return new WeakMap();
    };
    En.decodeAction = function (e, t) {
      var s = new FormData(),
        i = null,
        r = new Set();
      return (
        e.forEach(function (a, u) {
          u.startsWith('$ACTION_')
            ? u.startsWith('$ACTION_REF_')
              ? r.has(u) ||
                (r.add(u),
                (a = '$ACTION_' + u.slice(12) + ':'),
                (a = Qu(e, t, a)),
                (i = yu(t, a)))
              : u.startsWith('$ACTION_ID_') &&
                !r.has(u) &&
                (r.add(u), (a = u.slice(11)), (i = yu(t, {id: a, bound: null})))
            : s.append(u, a);
        }),
        i === null
          ? null
          : i.then(function (a) {
              return a.bind(null, s);
            })
      );
    };
    En.decodeFormState = function (e, t, s) {
      var i = t.get('$ACTION_KEY');
      if (typeof i != 'string') return Promise.resolve(null);
      var r = null;
      if (
        (t.forEach(function (u, d) {
          d.startsWith('$ACTION_REF_') &&
            ((u = '$ACTION_' + d.slice(12) + ':'), (r = Qu(t, s, u)));
        }),
        r === null)
      )
        return Promise.resolve(null);
      var a = r.id;
      return Promise.resolve(r.bound).then(function (u) {
        return u === null ? null : [e, i, a, u.length - 1];
      });
    };
    En.decodeReply = function (e, t, s) {
      if (typeof e == 'string') {
        var i = new FormData();
        i.append('0', e), (e = i);
      }
      return (
        (e = Yu(
          t,
          '',
          s ? s.temporaryReferences : void 0,
          e,
          s ? s.arraySizeLimit : void 0
        )),
        (t = Vr(e, 0)),
        Ju(e),
        t
      );
    };
    En.prerender = function (e, t, s) {
      return new Promise(function (i, r) {
        var a = new Ru(
          21,
          e,
          t,
          s ? s.onError : void 0,
          s ? s.onPostpone : void 0,
          function () {
            var y = new ReadableStream(
              {
                type: 'bytes',
                pull: function (g) {
                  ju(a, g);
                },
                cancel: function (g) {
                  (a.destination = null), si(a, g);
                },
              },
              {highWaterMark: 0}
            );
            i({prelude: y});
          },
          r,
          s ? s.identifierPrefix : void 0,
          s ? s.temporaryReferences : void 0
        );
        if (s && s.signal) {
          var u = s.signal;
          if (u.aborted) si(a, u.reason);
          else {
            var d = function () {
              si(a, u.reason), u.removeEventListener('abort', d);
            };
            u.addEventListener('abort', d);
          }
        }
        Vu(a);
      });
    };
    En.registerClientReference = function (e, t, s) {
      return ti(e, t + '#' + s, !1);
    };
    En.registerServerReference = function (e, t, s) {
      return Object.defineProperties(e, {
        $$typeof: {value: Ar},
        $$id: {value: s === null ? t : t + '#' + s, configurable: !0},
        $$bound: {value: null, configurable: !0},
        bind: {value: gu, configurable: !0},
        toString: ed,
      });
    };
    En.renderToReadableStream = function (e, t, s) {
      var i = new Ru(
        20,
        e,
        t,
        s ? s.onError : void 0,
        s ? s.onPostpone : void 0,
        Cs,
        Cs,
        s ? s.identifierPrefix : void 0,
        s ? s.temporaryReferences : void 0
      );
      if (s && s.signal) {
        var r = s.signal;
        if (r.aborted) si(i, r.reason);
        else {
          var a = function () {
            si(i, r.reason), r.removeEventListener('abort', a);
          };
          r.addEventListener('abort', a);
        }
      }
      return new ReadableStream(
        {
          type: 'bytes',
          start: function () {
            Vu(i);
          },
          pull: function (u) {
            ju(i, u);
          },
          cancel: function (u) {
            (i.destination = null), si(i, u);
          },
        },
        {highWaterMark: 0}
      );
    };
  });
  var e1 = Z((Wn) => {
    'use strict';
    var Hn;
    Hn = Zu();
    Wn.renderToReadableStream = Hn.renderToReadableStream;
    Wn.decodeReply = Hn.decodeReply;
    Wn.decodeAction = Hn.decodeAction;
    Wn.decodeFormState = Hn.decodeFormState;
    Wn.registerServerReference = Hn.registerServerReference;
    Wn.registerClientReference = Hn.registerClientReference;
    Wn.createClientModuleProxy = Hn.createClientModuleProxy;
    Wn.createTemporaryReferenceSet = Hn.createTemporaryReferenceSet;
  });
  var It = Z((ya) => {
    'use strict';
    Object.defineProperty(ya, '__esModule', {value: !0});
    var t1;
    (function (e) {
      e[(e.NONE = 0)] = 'NONE';
      let s = 1;
      e[(e._abstract = s)] = '_abstract';
      let i = s + 1;
      e[(e._accessor = i)] = '_accessor';
      let r = i + 1;
      e[(e._as = r)] = '_as';
      let a = r + 1;
      e[(e._assert = a)] = '_assert';
      let u = a + 1;
      e[(e._asserts = u)] = '_asserts';
      let d = u + 1;
      e[(e._async = d)] = '_async';
      let y = d + 1;
      e[(e._await = y)] = '_await';
      let g = y + 1;
      e[(e._checks = g)] = '_checks';
      let L = g + 1;
      e[(e._constructor = L)] = '_constructor';
      let p = L + 1;
      e[(e._declare = p)] = '_declare';
      let h = p + 1;
      e[(e._enum = h)] = '_enum';
      let T = h + 1;
      e[(e._exports = T)] = '_exports';
      let x = T + 1;
      e[(e._from = x)] = '_from';
      let w = x + 1;
      e[(e._get = w)] = '_get';
      let S = w + 1;
      e[(e._global = S)] = '_global';
      let A = S + 1;
      e[(e._implements = A)] = '_implements';
      let U = A + 1;
      e[(e._infer = U)] = '_infer';
      let M = U + 1;
      e[(e._interface = M)] = '_interface';
      let c = M + 1;
      e[(e._is = c)] = '_is';
      let R = c + 1;
      e[(e._keyof = R)] = '_keyof';
      let W = R + 1;
      e[(e._mixins = W)] = '_mixins';
      let X = W + 1;
      e[(e._module = X)] = '_module';
      let ie = X + 1;
      e[(e._namespace = ie)] = '_namespace';
      let pe = ie + 1;
      e[(e._of = pe)] = '_of';
      let ae = pe + 1;
      e[(e._opaque = ae)] = '_opaque';
      let He = ae + 1;
      e[(e._out = He)] = '_out';
      let qe = He + 1;
      e[(e._override = qe)] = '_override';
      let Bt = qe + 1;
      e[(e._private = Bt)] = '_private';
      let mt = Bt + 1;
      e[(e._protected = mt)] = '_protected';
      let kt = mt + 1;
      e[(e._proto = kt)] = '_proto';
      let At = kt + 1;
      e[(e._public = At)] = '_public';
      let tt = At + 1;
      e[(e._readonly = tt)] = '_readonly';
      let nt = tt + 1;
      e[(e._require = nt)] = '_require';
      let _t = nt + 1;
      e[(e._satisfies = _t)] = '_satisfies';
      let ct = _t + 1;
      e[(e._set = ct)] = '_set';
      let wt = ct + 1;
      e[(e._static = wt)] = '_static';
      let $t = wt + 1;
      e[(e._symbol = $t)] = '_symbol';
      let Pt = $t + 1;
      e[(e._type = Pt)] = '_type';
      let qt = Pt + 1;
      e[(e._unique = qt)] = '_unique';
      let Tn = qt + 1;
      e[(e._using = Tn)] = '_using';
    })(t1 || (ya.ContextualKeyword = t1 = {}));
  });
  var be = Z((jr) => {
    'use strict';
    Object.defineProperty(jr, '__esModule', {value: !0});
    var q;
    (function (e) {
      e[(e.PRECEDENCE_MASK = 15)] = 'PRECEDENCE_MASK';
      let s = 16;
      e[(e.IS_KEYWORD = s)] = 'IS_KEYWORD';
      let i = 32;
      e[(e.IS_ASSIGN = i)] = 'IS_ASSIGN';
      let r = 64;
      e[(e.IS_RIGHT_ASSOCIATIVE = r)] = 'IS_RIGHT_ASSOCIATIVE';
      let a = 128;
      e[(e.IS_PREFIX = a)] = 'IS_PREFIX';
      let u = 256;
      e[(e.IS_POSTFIX = u)] = 'IS_POSTFIX';
      let d = 512;
      e[(e.IS_EXPRESSION_START = d)] = 'IS_EXPRESSION_START';
      let y = 512;
      e[(e.num = y)] = 'num';
      let g = 1536;
      e[(e.bigint = g)] = 'bigint';
      let L = 2560;
      e[(e.decimal = L)] = 'decimal';
      let p = 3584;
      e[(e.regexp = p)] = 'regexp';
      let h = 4608;
      e[(e.string = h)] = 'string';
      let T = 5632;
      e[(e.name = T)] = 'name';
      let x = 6144;
      e[(e.eof = x)] = 'eof';
      let w = 7680;
      e[(e.bracketL = w)] = 'bracketL';
      let S = 8192;
      e[(e.bracketR = S)] = 'bracketR';
      let A = 9728;
      e[(e.braceL = A)] = 'braceL';
      let U = 10752;
      e[(e.braceBarL = U)] = 'braceBarL';
      let M = 11264;
      e[(e.braceR = M)] = 'braceR';
      let c = 12288;
      e[(e.braceBarR = c)] = 'braceBarR';
      let R = 13824;
      e[(e.parenL = R)] = 'parenL';
      let W = 14336;
      e[(e.parenR = W)] = 'parenR';
      let X = 15360;
      e[(e.comma = X)] = 'comma';
      let ie = 16384;
      e[(e.semi = ie)] = 'semi';
      let pe = 17408;
      e[(e.colon = pe)] = 'colon';
      let ae = 18432;
      e[(e.doubleColon = ae)] = 'doubleColon';
      let He = 19456;
      e[(e.dot = He)] = 'dot';
      let qe = 20480;
      e[(e.question = qe)] = 'question';
      let Bt = 21504;
      e[(e.questionDot = Bt)] = 'questionDot';
      let mt = 22528;
      e[(e.arrow = mt)] = 'arrow';
      let kt = 23552;
      e[(e.template = kt)] = 'template';
      let At = 24576;
      e[(e.ellipsis = At)] = 'ellipsis';
      let tt = 25600;
      e[(e.backQuote = tt)] = 'backQuote';
      let nt = 27136;
      e[(e.dollarBraceL = nt)] = 'dollarBraceL';
      let _t = 27648;
      e[(e.at = _t)] = 'at';
      let ct = 29184;
      e[(e.hash = ct)] = 'hash';
      let wt = 29728;
      e[(e.eq = wt)] = 'eq';
      let $t = 30752;
      e[(e.assign = $t)] = 'assign';
      let Pt = 32640;
      e[(e.preIncDec = Pt)] = 'preIncDec';
      let qt = 33664;
      e[(e.postIncDec = qt)] = 'postIncDec';
      let Tn = 34432;
      e[(e.bang = Tn)] = 'bang';
      let V = 35456;
      e[(e.tilde = V)] = 'tilde';
      let G = 35841;
      e[(e.pipeline = G)] = 'pipeline';
      let J = 36866;
      e[(e.nullishCoalescing = J)] = 'nullishCoalescing';
      let re = 37890;
      e[(e.logicalOR = re)] = 'logicalOR';
      let ve = 38915;
      e[(e.logicalAND = ve)] = 'logicalAND';
      let he = 39940;
      e[(e.bitwiseOR = he)] = 'bitwiseOR';
      let Ie = 40965;
      e[(e.bitwiseXOR = Ie)] = 'bitwiseXOR';
      let Ee = 41990;
      e[(e.bitwiseAND = Ee)] = 'bitwiseAND';
      let Le = 43015;
      e[(e.equality = Le)] = 'equality';
      let Xe = 44040;
      e[(e.lessThan = Xe)] = 'lessThan';
      let We = 45064;
      e[(e.greaterThan = We)] = 'greaterThan';
      let Ke = 46088;
      e[(e.relationalOrEqual = Ke)] = 'relationalOrEqual';
      let ut = 47113;
      e[(e.bitShiftL = ut)] = 'bitShiftL';
      let pt = 48137;
      e[(e.bitShiftR = pt)] = 'bitShiftR';
      let bt = 49802;
      e[(e.plus = bt)] = 'plus';
      let yt = 50826;
      e[(e.minus = yt)] = 'minus';
      let vt = 51723;
      e[(e.modulo = vt)] = 'modulo';
      let bn = 52235;
      e[(e.star = bn)] = 'star';
      let Dn = 53259;
      e[(e.slash = Dn)] = 'slash';
      let Ge = 54348;
      e[(e.exponent = Ge)] = 'exponent';
      let St = 55296;
      e[(e.jsxName = St)] = 'jsxName';
      let ot = 56320;
      e[(e.jsxText = ot)] = 'jsxText';
      let zt = 57344;
      e[(e.jsxEmptyText = zt)] = 'jsxEmptyText';
      let Xt = 58880;
      e[(e.jsxTagStart = Xt)] = 'jsxTagStart';
      let te = 59392;
      e[(e.jsxTagEnd = te)] = 'jsxTagEnd';
      let Cn = 60928;
      e[(e.typeParameterStart = Cn)] = 'typeParameterStart';
      let Zn = 61440;
      e[(e.nonNullAssertion = Zn)] = 'nonNullAssertion';
      let _i = 62480;
      e[(e._break = _i)] = '_break';
      let Mn = 63504;
      e[(e._case = Mn)] = '_case';
      let xs = 64528;
      e[(e._catch = xs)] = '_catch';
      let Ds = 65552;
      e[(e._continue = Ds)] = '_continue';
      let bi = 66576;
      e[(e._debugger = bi)] = '_debugger';
      let es = 67600;
      e[(e._default = es)] = '_default';
      let Nt = 68624;
      e[(e._do = Nt)] = '_do';
      let Rt = 69648;
      e[(e._else = Rt)] = '_else';
      let Ue = 70672;
      e[(e._finally = Ue)] = '_finally';
      let wn = 71696;
      e[(e._for = wn)] = '_for';
      let de = 73232;
      e[(e._function = de)] = '_function';
      let Ms = 73744;
      e[(e._if = Ms)] = '_if';
      let gs = 74768;
      e[(e._return = gs)] = '_return';
      let Ci = 75792;
      e[(e._switch = Ci)] = '_switch';
      let ts = 77456;
      e[(e._throw = ts)] = '_throw';
      let rn = 77840;
      e[(e._try = rn)] = '_try';
      let wi = 78864;
      e[(e._var = wi)] = '_var';
      let Fn = 79888;
      e[(e._let = Fn)] = '_let';
      let Bn = 80912;
      e[(e._const = Bn)] = '_const';
      let Fs = 81936;
      e[(e._while = Fs)] = '_while';
      let Si = 82960;
      e[(e._with = Si)] = '_with';
      let Bs = 84496;
      e[(e._new = Bs)] = '_new';
      let Vs = 85520;
      e[(e._this = Vs)] = '_this';
      let js = 86544;
      e[(e._super = js)] = '_super';
      let $s = 87568;
      e[(e._class = $s)] = '_class';
      let qs = 88080;
      e[(e._extends = qs)] = '_extends';
      let Ii = 89104;
      e[(e._export = Ii)] = '_export';
      let Ei = 90640;
      e[(e._import = Ei)] = '_import';
      let Ai = 91664;
      e[(e._yield = Ai)] = '_yield';
      let Pi = 92688;
      e[(e._null = Pi)] = '_null';
      let Ks = 93712;
      e[(e._true = Ks)] = '_true';
      let Us = 94736;
      e[(e._false = Us)] = '_false';
      let Hs = 95256;
      e[(e._in = Hs)] = '_in';
      let Ws = 96280;
      e[(e._instanceof = Ws)] = '_instanceof';
      let Gs = 97936;
      e[(e._typeof = Gs)] = '_typeof';
      let zs = 98960;
      e[(e._void = zs)] = '_void';
      let jo = 99984;
      e[(e._delete = jo)] = '_delete';
      let $o = 100880;
      e[(e._async = $o)] = '_async';
      let mr = 101904;
      e[(e._get = mr)] = '_get';
      let qo = 102928;
      e[(e._set = qo)] = '_set';
      let Ni = 103952;
      e[(e._declare = Ni)] = '_declare';
      let yr = 104976;
      e[(e._readonly = yr)] = '_readonly';
      let Ko = 106e3;
      e[(e._abstract = Ko)] = '_abstract';
      let le = 107024;
      e[(e._static = le)] = '_static';
      let Xs = 107536;
      e[(e._public = Xs)] = '_public';
      let on = 108560;
      e[(e._private = on)] = '_private';
      let Uo = 109584;
      e[(e._protected = Uo)] = '_protected';
      let Ho = 110608;
      e[(e._override = Ho)] = '_override';
      let Tr = 112144;
      e[(e._as = Tr)] = '_as';
      let Wo = 113168;
      e[(e._enum = Wo)] = '_enum';
      let Go = 114192;
      e[(e._type = Go)] = '_type';
      let kr = 115216;
      e[(e._implements = kr)] = '_implements';
    })(q || (jr.TokenType = q = {}));
    function Bd(e) {
      switch (e) {
        case q.num:
          return 'num';
        case q.bigint:
          return 'bigint';
        case q.decimal:
          return 'decimal';
        case q.regexp:
          return 'regexp';
        case q.string:
          return 'string';
        case q.name:
          return 'name';
        case q.eof:
          return 'eof';
        case q.bracketL:
          return '[';
        case q.bracketR:
          return ']';
        case q.braceL:
          return '{';
        case q.braceBarL:
          return '{|';
        case q.braceR:
          return '}';
        case q.braceBarR:
          return '|}';
        case q.parenL:
          return '(';
        case q.parenR:
          return ')';
        case q.comma:
          return ',';
        case q.semi:
          return ';';
        case q.colon:
          return ':';
        case q.doubleColon:
          return '::';
        case q.dot:
          return '.';
        case q.question:
          return '?';
        case q.questionDot:
          return '?.';
        case q.arrow:
          return '=>';
        case q.template:
          return 'template';
        case q.ellipsis:
          return '...';
        case q.backQuote:
          return '`';
        case q.dollarBraceL:
          return '${';
        case q.at:
          return '@';
        case q.hash:
          return '#';
        case q.eq:
          return '=';
        case q.assign:
          return '_=';
        case q.preIncDec:
          return '++/--';
        case q.postIncDec:
          return '++/--';
        case q.bang:
          return '!';
        case q.tilde:
          return '~';
        case q.pipeline:
          return '|>';
        case q.nullishCoalescing:
          return '??';
        case q.logicalOR:
          return '||';
        case q.logicalAND:
          return '&&';
        case q.bitwiseOR:
          return '|';
        case q.bitwiseXOR:
          return '^';
        case q.bitwiseAND:
          return '&';
        case q.equality:
          return '==/!=';
        case q.lessThan:
          return '<';
        case q.greaterThan:
          return '>';
        case q.relationalOrEqual:
          return '<=/>=';
        case q.bitShiftL:
          return '<<';
        case q.bitShiftR:
          return '>>/>>>';
        case q.plus:
          return '+';
        case q.minus:
          return '-';
        case q.modulo:
          return '%';
        case q.star:
          return '*';
        case q.slash:
          return '/';
        case q.exponent:
          return '**';
        case q.jsxName:
          return 'jsxName';
        case q.jsxText:
          return 'jsxText';
        case q.jsxEmptyText:
          return 'jsxEmptyText';
        case q.jsxTagStart:
          return 'jsxTagStart';
        case q.jsxTagEnd:
          return 'jsxTagEnd';
        case q.typeParameterStart:
          return 'typeParameterStart';
        case q.nonNullAssertion:
          return 'nonNullAssertion';
        case q._break:
          return 'break';
        case q._case:
          return 'case';
        case q._catch:
          return 'catch';
        case q._continue:
          return 'continue';
        case q._debugger:
          return 'debugger';
        case q._default:
          return 'default';
        case q._do:
          return 'do';
        case q._else:
          return 'else';
        case q._finally:
          return 'finally';
        case q._for:
          return 'for';
        case q._function:
          return 'function';
        case q._if:
          return 'if';
        case q._return:
          return 'return';
        case q._switch:
          return 'switch';
        case q._throw:
          return 'throw';
        case q._try:
          return 'try';
        case q._var:
          return 'var';
        case q._let:
          return 'let';
        case q._const:
          return 'const';
        case q._while:
          return 'while';
        case q._with:
          return 'with';
        case q._new:
          return 'new';
        case q._this:
          return 'this';
        case q._super:
          return 'super';
        case q._class:
          return 'class';
        case q._extends:
          return 'extends';
        case q._export:
          return 'export';
        case q._import:
          return 'import';
        case q._yield:
          return 'yield';
        case q._null:
          return 'null';
        case q._true:
          return 'true';
        case q._false:
          return 'false';
        case q._in:
          return 'in';
        case q._instanceof:
          return 'instanceof';
        case q._typeof:
          return 'typeof';
        case q._void:
          return 'void';
        case q._delete:
          return 'delete';
        case q._async:
          return 'async';
        case q._get:
          return 'get';
        case q._set:
          return 'set';
        case q._declare:
          return 'declare';
        case q._readonly:
          return 'readonly';
        case q._abstract:
          return 'abstract';
        case q._static:
          return 'static';
        case q._public:
          return 'public';
        case q._private:
          return 'private';
        case q._protected:
          return 'protected';
        case q._override:
          return 'override';
        case q._as:
          return 'as';
        case q._enum:
          return 'enum';
        case q._type:
          return 'type';
        case q._implements:
          return 'implements';
        default:
          return '';
      }
    }
    jr.formatTokenType = Bd;
  });
  var qr = Z((Ui) => {
    'use strict';
    Object.defineProperty(Ui, '__esModule', {value: !0});
    var Vd = It(),
      jd = be(),
      Ta = class {
        constructor(t, s, i) {
          (this.startTokenIndex = t),
            (this.endTokenIndex = s),
            (this.isFunctionScope = i);
        }
      };
    Ui.Scope = Ta;
    var $r = class {
      constructor(t, s, i, r, a, u, d, y, g, L, p, h, T) {
        (this.potentialArrowAt = t),
          (this.noAnonFunctionType = s),
          (this.inDisallowConditionalTypesContext = i),
          (this.tokensLength = r),
          (this.scopesLength = a),
          (this.pos = u),
          (this.type = d),
          (this.contextualKeyword = y),
          (this.start = g),
          (this.end = L),
          (this.isType = p),
          (this.scopeDepth = h),
          (this.error = T);
      }
    };
    Ui.StateSnapshot = $r;
    var ka = class e {
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
        this.type = jd.TokenType.eof;
      }
      __init8() {
        this.contextualKeyword = Vd.ContextualKeyword.NONE;
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
        return new $r(
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
    Ui.default = ka;
  });
  var Qt = Z((Kr) => {
    'use strict';
    Object.defineProperty(Kr, '__esModule', {value: !0});
    var as;
    (function (e) {
      e[(e.backSpace = 8)] = 'backSpace';
      let s = 10;
      e[(e.lineFeed = s)] = 'lineFeed';
      let i = 9;
      e[(e.tab = i)] = 'tab';
      let r = 13;
      e[(e.carriageReturn = r)] = 'carriageReturn';
      let a = 14;
      e[(e.shiftOut = a)] = 'shiftOut';
      let u = 32;
      e[(e.space = u)] = 'space';
      let d = 33;
      e[(e.exclamationMark = d)] = 'exclamationMark';
      let y = 34;
      e[(e.quotationMark = y)] = 'quotationMark';
      let g = 35;
      e[(e.numberSign = g)] = 'numberSign';
      let L = 36;
      e[(e.dollarSign = L)] = 'dollarSign';
      let p = 37;
      e[(e.percentSign = p)] = 'percentSign';
      let h = 38;
      e[(e.ampersand = h)] = 'ampersand';
      let T = 39;
      e[(e.apostrophe = T)] = 'apostrophe';
      let x = 40;
      e[(e.leftParenthesis = x)] = 'leftParenthesis';
      let w = 41;
      e[(e.rightParenthesis = w)] = 'rightParenthesis';
      let S = 42;
      e[(e.asterisk = S)] = 'asterisk';
      let A = 43;
      e[(e.plusSign = A)] = 'plusSign';
      let U = 44;
      e[(e.comma = U)] = 'comma';
      let M = 45;
      e[(e.dash = M)] = 'dash';
      let c = 46;
      e[(e.dot = c)] = 'dot';
      let R = 47;
      e[(e.slash = R)] = 'slash';
      let W = 48;
      e[(e.digit0 = W)] = 'digit0';
      let X = 49;
      e[(e.digit1 = X)] = 'digit1';
      let ie = 50;
      e[(e.digit2 = ie)] = 'digit2';
      let pe = 51;
      e[(e.digit3 = pe)] = 'digit3';
      let ae = 52;
      e[(e.digit4 = ae)] = 'digit4';
      let He = 53;
      e[(e.digit5 = He)] = 'digit5';
      let qe = 54;
      e[(e.digit6 = qe)] = 'digit6';
      let Bt = 55;
      e[(e.digit7 = Bt)] = 'digit7';
      let mt = 56;
      e[(e.digit8 = mt)] = 'digit8';
      let kt = 57;
      e[(e.digit9 = kt)] = 'digit9';
      let At = 58;
      e[(e.colon = At)] = 'colon';
      let tt = 59;
      e[(e.semicolon = tt)] = 'semicolon';
      let nt = 60;
      e[(e.lessThan = nt)] = 'lessThan';
      let _t = 61;
      e[(e.equalsTo = _t)] = 'equalsTo';
      let ct = 62;
      e[(e.greaterThan = ct)] = 'greaterThan';
      let wt = 63;
      e[(e.questionMark = wt)] = 'questionMark';
      let $t = 64;
      e[(e.atSign = $t)] = 'atSign';
      let Pt = 65;
      e[(e.uppercaseA = Pt)] = 'uppercaseA';
      let qt = 66;
      e[(e.uppercaseB = qt)] = 'uppercaseB';
      let Tn = 67;
      e[(e.uppercaseC = Tn)] = 'uppercaseC';
      let V = 68;
      e[(e.uppercaseD = V)] = 'uppercaseD';
      let G = 69;
      e[(e.uppercaseE = G)] = 'uppercaseE';
      let J = 70;
      e[(e.uppercaseF = J)] = 'uppercaseF';
      let re = 71;
      e[(e.uppercaseG = re)] = 'uppercaseG';
      let ve = 72;
      e[(e.uppercaseH = ve)] = 'uppercaseH';
      let he = 73;
      e[(e.uppercaseI = he)] = 'uppercaseI';
      let Ie = 74;
      e[(e.uppercaseJ = Ie)] = 'uppercaseJ';
      let Ee = 75;
      e[(e.uppercaseK = Ee)] = 'uppercaseK';
      let Le = 76;
      e[(e.uppercaseL = Le)] = 'uppercaseL';
      let Xe = 77;
      e[(e.uppercaseM = Xe)] = 'uppercaseM';
      let We = 78;
      e[(e.uppercaseN = We)] = 'uppercaseN';
      let Ke = 79;
      e[(e.uppercaseO = Ke)] = 'uppercaseO';
      let ut = 80;
      e[(e.uppercaseP = ut)] = 'uppercaseP';
      let pt = 81;
      e[(e.uppercaseQ = pt)] = 'uppercaseQ';
      let bt = 82;
      e[(e.uppercaseR = bt)] = 'uppercaseR';
      let yt = 83;
      e[(e.uppercaseS = yt)] = 'uppercaseS';
      let vt = 84;
      e[(e.uppercaseT = vt)] = 'uppercaseT';
      let bn = 85;
      e[(e.uppercaseU = bn)] = 'uppercaseU';
      let Dn = 86;
      e[(e.uppercaseV = Dn)] = 'uppercaseV';
      let Ge = 87;
      e[(e.uppercaseW = Ge)] = 'uppercaseW';
      let St = 88;
      e[(e.uppercaseX = St)] = 'uppercaseX';
      let ot = 89;
      e[(e.uppercaseY = ot)] = 'uppercaseY';
      let zt = 90;
      e[(e.uppercaseZ = zt)] = 'uppercaseZ';
      let Xt = 91;
      e[(e.leftSquareBracket = Xt)] = 'leftSquareBracket';
      let te = 92;
      e[(e.backslash = te)] = 'backslash';
      let Cn = 93;
      e[(e.rightSquareBracket = Cn)] = 'rightSquareBracket';
      let Zn = 94;
      e[(e.caret = Zn)] = 'caret';
      let _i = 95;
      e[(e.underscore = _i)] = 'underscore';
      let Mn = 96;
      e[(e.graveAccent = Mn)] = 'graveAccent';
      let xs = 97;
      e[(e.lowercaseA = xs)] = 'lowercaseA';
      let Ds = 98;
      e[(e.lowercaseB = Ds)] = 'lowercaseB';
      let bi = 99;
      e[(e.lowercaseC = bi)] = 'lowercaseC';
      let es = 100;
      e[(e.lowercaseD = es)] = 'lowercaseD';
      let Nt = 101;
      e[(e.lowercaseE = Nt)] = 'lowercaseE';
      let Rt = 102;
      e[(e.lowercaseF = Rt)] = 'lowercaseF';
      let Ue = 103;
      e[(e.lowercaseG = Ue)] = 'lowercaseG';
      let wn = 104;
      e[(e.lowercaseH = wn)] = 'lowercaseH';
      let de = 105;
      e[(e.lowercaseI = de)] = 'lowercaseI';
      let Ms = 106;
      e[(e.lowercaseJ = Ms)] = 'lowercaseJ';
      let gs = 107;
      e[(e.lowercaseK = gs)] = 'lowercaseK';
      let Ci = 108;
      e[(e.lowercaseL = Ci)] = 'lowercaseL';
      let ts = 109;
      e[(e.lowercaseM = ts)] = 'lowercaseM';
      let rn = 110;
      e[(e.lowercaseN = rn)] = 'lowercaseN';
      let wi = 111;
      e[(e.lowercaseO = wi)] = 'lowercaseO';
      let Fn = 112;
      e[(e.lowercaseP = Fn)] = 'lowercaseP';
      let Bn = 113;
      e[(e.lowercaseQ = Bn)] = 'lowercaseQ';
      let Fs = 114;
      e[(e.lowercaseR = Fs)] = 'lowercaseR';
      let Si = 115;
      e[(e.lowercaseS = Si)] = 'lowercaseS';
      let Bs = 116;
      e[(e.lowercaseT = Bs)] = 'lowercaseT';
      let Vs = 117;
      e[(e.lowercaseU = Vs)] = 'lowercaseU';
      let js = 118;
      e[(e.lowercaseV = js)] = 'lowercaseV';
      let $s = 119;
      e[(e.lowercaseW = $s)] = 'lowercaseW';
      let qs = 120;
      e[(e.lowercaseX = qs)] = 'lowercaseX';
      let Ii = 121;
      e[(e.lowercaseY = Ii)] = 'lowercaseY';
      let Ei = 122;
      e[(e.lowercaseZ = Ei)] = 'lowercaseZ';
      let Ai = 123;
      e[(e.leftCurlyBrace = Ai)] = 'leftCurlyBrace';
      let Pi = 124;
      e[(e.verticalBar = Pi)] = 'verticalBar';
      let Ks = 125;
      e[(e.rightCurlyBrace = Ks)] = 'rightCurlyBrace';
      let Us = 126;
      e[(e.tilde = Us)] = 'tilde';
      let Hs = 160;
      e[(e.nonBreakingSpace = Hs)] = 'nonBreakingSpace';
      let Ws = 5760;
      e[(e.oghamSpaceMark = Ws)] = 'oghamSpaceMark';
      let Gs = 8232;
      e[(e.lineSeparator = Gs)] = 'lineSeparator';
      let zs = 8233;
      e[(e.paragraphSeparator = zs)] = 'paragraphSeparator';
    })(as || (Kr.charCodes = as = {}));
    function $d(e) {
      return (
        (e >= as.digit0 && e <= as.digit9) ||
        (e >= as.lowercaseA && e <= as.lowercaseF) ||
        (e >= as.uppercaseA && e <= as.uppercaseF)
      );
    }
    Kr.isDigit = $d;
  });
  var Zt = Z((ft) => {
    'use strict';
    Object.defineProperty(ft, '__esModule', {value: !0});
    function qd(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Kd = qr(),
      Ud = qd(Kd),
      Hd = Qt();
    ft.isJSXEnabled;
    ft.isTypeScriptEnabled;
    ft.isFlowEnabled;
    ft.state;
    ft.input;
    ft.nextContextId;
    function Wd() {
      return ft.nextContextId++;
    }
    ft.getNextContextId = Wd;
    function Gd(e) {
      if ('pos' in e) {
        let t = n1(e.pos);
        (e.message += ` (${t.line}:${t.column})`), (e.loc = t);
      }
      return e;
    }
    ft.augmentError = Gd;
    var Ur = class {
      constructor(t, s) {
        (this.line = t), (this.column = s);
      }
    };
    ft.Loc = Ur;
    function n1(e) {
      let t = 1,
        s = 1;
      for (let i = 0; i < e; i++)
        ft.input.charCodeAt(i) === Hd.charCodes.lineFeed ? (t++, (s = 1)) : s++;
      return new Ur(t, s);
    }
    ft.locationForIndex = n1;
    function zd(e, t, s, i) {
      (ft.input = e),
        (ft.state = new Ud.default()),
        (ft.nextContextId = 1),
        (ft.isJSXEnabled = t),
        (ft.isTypeScriptEnabled = s),
        (ft.isFlowEnabled = i);
    }
    ft.initParser = zd;
  });
  var cs = Z((tn) => {
    'use strict';
    Object.defineProperty(tn, '__esModule', {value: !0});
    var ls = xt(),
      As = be(),
      Hr = Qt(),
      en = Zt();
    function Xd(e) {
      return en.state.contextualKeyword === e;
    }
    tn.isContextual = Xd;
    function Yd(e) {
      let t = ls.lookaheadTypeAndKeyword.call(void 0);
      return t.type === As.TokenType.name && t.contextualKeyword === e;
    }
    tn.isLookaheadContextual = Yd;
    function s1(e) {
      return (
        en.state.contextualKeyword === e &&
        ls.eat.call(void 0, As.TokenType.name)
      );
    }
    tn.eatContextual = s1;
    function Jd(e) {
      s1(e) || Wr();
    }
    tn.expectContextual = Jd;
    function i1() {
      return (
        ls.match.call(void 0, As.TokenType.eof) ||
        ls.match.call(void 0, As.TokenType.braceR) ||
        r1()
      );
    }
    tn.canInsertSemicolon = i1;
    function r1() {
      let e = en.state.tokens[en.state.tokens.length - 1],
        t = e ? e.end : 0;
      for (let s = t; s < en.state.start; s++) {
        let i = en.input.charCodeAt(s);
        if (
          i === Hr.charCodes.lineFeed ||
          i === Hr.charCodes.carriageReturn ||
          i === 8232 ||
          i === 8233
        )
          return !0;
      }
      return !1;
    }
    tn.hasPrecedingLineBreak = r1;
    function Qd() {
      let e = ls.nextTokenStart.call(void 0);
      for (let t = en.state.end; t < e; t++) {
        let s = en.input.charCodeAt(t);
        if (
          s === Hr.charCodes.lineFeed ||
          s === Hr.charCodes.carriageReturn ||
          s === 8232 ||
          s === 8233
        )
          return !0;
      }
      return !1;
    }
    tn.hasFollowingLineBreak = Qd;
    function o1() {
      return ls.eat.call(void 0, As.TokenType.semi) || i1();
    }
    tn.isLineTerminator = o1;
    function Zd() {
      o1() || Wr('Unexpected token, expected ";"');
    }
    tn.semicolon = Zd;
    function em(e) {
      ls.eat.call(void 0, e) ||
        Wr(
          `Unexpected token, expected "${As.formatTokenType.call(void 0, e)}"`
        );
    }
    tn.expect = em;
    function Wr(e = 'Unexpected token', t = en.state.start) {
      if (en.state.error) return;
      let s = new SyntaxError(e);
      (s.pos = t),
        (en.state.error = s),
        (en.state.pos = en.input.length),
        ls.finishToken.call(void 0, As.TokenType.eof);
    }
    tn.unexpected = Wr;
  });
  var xa = Z((Ps) => {
    'use strict';
    Object.defineProperty(Ps, '__esModule', {value: !0});
    var va = Qt(),
      tm = [
        9,
        11,
        12,
        va.charCodes.space,
        va.charCodes.nonBreakingSpace,
        va.charCodes.oghamSpaceMark,
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
    Ps.WHITESPACE_CHARS = tm;
    var nm = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
    Ps.skipWhiteSpace = nm;
    var sm = new Uint8Array(65536);
    Ps.IS_WHITESPACE = sm;
    for (let e of Ps.WHITESPACE_CHARS) Ps.IS_WHITESPACE[e] = 1;
  });
  var li = Z((vn) => {
    'use strict';
    Object.defineProperty(vn, '__esModule', {value: !0});
    var a1 = Qt(),
      im = xa();
    function rm(e) {
      if (e < 48) return e === 36;
      if (e < 58) return !0;
      if (e < 65) return !1;
      if (e < 91) return !0;
      if (e < 97) return e === 95;
      if (e < 123) return !0;
      if (e < 128) return !1;
      throw new Error('Should not be called with non-ASCII char code.');
    }
    var om = new Uint8Array(65536);
    vn.IS_IDENTIFIER_CHAR = om;
    for (let e = 0; e < 128; e++) vn.IS_IDENTIFIER_CHAR[e] = rm(e) ? 1 : 0;
    for (let e = 128; e < 65536; e++) vn.IS_IDENTIFIER_CHAR[e] = 1;
    for (let e of im.WHITESPACE_CHARS) vn.IS_IDENTIFIER_CHAR[e] = 0;
    vn.IS_IDENTIFIER_CHAR[8232] = 0;
    vn.IS_IDENTIFIER_CHAR[8233] = 0;
    var am = vn.IS_IDENTIFIER_CHAR.slice();
    vn.IS_IDENTIFIER_START = am;
    for (let e = a1.charCodes.digit0; e <= a1.charCodes.digit9; e++)
      vn.IS_IDENTIFIER_START[e] = 0;
  });
  var l1 = Z((ga) => {
    'use strict';
    Object.defineProperty(ga, '__esModule', {value: !0});
    var ge = It(),
      Ce = be(),
      lm = new Int32Array([
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
        ge.ContextualKeyword._abstract << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._accessor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ge.ContextualKeyword._as << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._assert << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._asserts << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._async << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._await << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._break << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._case << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._catch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._checks << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._class << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._const << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._constructor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._continue << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._debugger << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._declare << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._default << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._delete << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (Ce.TokenType._do << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._else << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._enum << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._export << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._exports << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._extends << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._false << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._finally << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._for << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._from << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._function << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._get << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._global << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._if << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._implements << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._import << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (Ce.TokenType._in << 1) + 1,
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
        ge.ContextualKeyword._infer << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._instanceof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._interface << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ge.ContextualKeyword._is << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._keyof << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._let << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._mixins << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._module << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._namespace << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._new << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._null << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._of << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._opaque << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._out << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._override << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._private << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._protected << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        ge.ContextualKeyword._proto << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._public << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._readonly << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._require << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._return << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._satisfies << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._set << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._static << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._super << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._switch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._symbol << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._this << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._throw << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._true << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (Ce.TokenType._try << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._type << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._typeof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._unique << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        ge.ContextualKeyword._using << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._var << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._void << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._while << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._with << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (Ce.TokenType._yield << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
    ga.READ_WORD_TREE = lm;
  });
  var h1 = Z((ba) => {
    'use strict';
    Object.defineProperty(ba, '__esModule', {value: !0});
    var xn = Zt(),
      us = Qt(),
      c1 = li(),
      _a = xt(),
      u1 = l1(),
      p1 = be();
    function cm() {
      let e = 0,
        t = 0,
        s = xn.state.pos;
      for (
        ;
        s < xn.input.length &&
        ((t = xn.input.charCodeAt(s)),
        !(t < us.charCodes.lowercaseA || t > us.charCodes.lowercaseZ));

      ) {
        let r = u1.READ_WORD_TREE[e + (t - us.charCodes.lowercaseA) + 1];
        if (r === -1) break;
        (e = r), s++;
      }
      let i = u1.READ_WORD_TREE[e];
      if (i > -1 && !c1.IS_IDENTIFIER_CHAR[t]) {
        (xn.state.pos = s),
          i & 1
            ? _a.finishToken.call(void 0, i >>> 1)
            : _a.finishToken.call(void 0, p1.TokenType.name, i >>> 1);
        return;
      }
      for (; s < xn.input.length; ) {
        let r = xn.input.charCodeAt(s);
        if (c1.IS_IDENTIFIER_CHAR[r]) s++;
        else if (r === us.charCodes.backslash) {
          if (
            ((s += 2), xn.input.charCodeAt(s) === us.charCodes.leftCurlyBrace)
          ) {
            for (
              ;
              s < xn.input.length &&
              xn.input.charCodeAt(s) !== us.charCodes.rightCurlyBrace;

            )
              s++;
            s++;
          }
        } else if (
          r === us.charCodes.atSign &&
          xn.input.charCodeAt(s + 1) === us.charCodes.atSign
        )
          s += 2;
        else break;
      }
      (xn.state.pos = s), _a.finishToken.call(void 0, p1.TokenType.name);
    }
    ba.default = cm;
  });
  var xt = Z((Be) => {
    'use strict';
    Object.defineProperty(Be, '__esModule', {value: !0});
    function um(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var b = Zt(),
      ci = cs(),
      F = Qt(),
      d1 = li(),
      wa = xa(),
      pm = It(),
      hm = h1(),
      fm = um(hm),
      ne = be(),
      it;
    (function (e) {
      e[(e.Access = 0)] = 'Access';
      let s = 1;
      e[(e.ExportAccess = s)] = 'ExportAccess';
      let i = s + 1;
      e[(e.TopLevelDeclaration = i)] = 'TopLevelDeclaration';
      let r = i + 1;
      e[(e.FunctionScopedDeclaration = r)] = 'FunctionScopedDeclaration';
      let a = r + 1;
      e[(e.BlockScopedDeclaration = a)] = 'BlockScopedDeclaration';
      let u = a + 1;
      e[(e.ObjectShorthandTopLevelDeclaration = u)] =
        'ObjectShorthandTopLevelDeclaration';
      let d = u + 1;
      e[(e.ObjectShorthandFunctionScopedDeclaration = d)] =
        'ObjectShorthandFunctionScopedDeclaration';
      let y = d + 1;
      e[(e.ObjectShorthandBlockScopedDeclaration = y)] =
        'ObjectShorthandBlockScopedDeclaration';
      let g = y + 1;
      e[(e.ObjectShorthand = g)] = 'ObjectShorthand';
      let L = g + 1;
      e[(e.ImportDeclaration = L)] = 'ImportDeclaration';
      let p = L + 1;
      e[(e.ObjectKey = p)] = 'ObjectKey';
      let h = p + 1;
      e[(e.ImportAccess = h)] = 'ImportAccess';
    })(it || (Be.IdentifierRole = it = {}));
    var f1;
    (function (e) {
      e[(e.NoChildren = 0)] = 'NoChildren';
      let s = 1;
      e[(e.OneChild = s)] = 'OneChild';
      let i = s + 1;
      e[(e.StaticChildren = i)] = 'StaticChildren';
      let r = i + 1;
      e[(e.KeyAfterPropSpread = r)] = 'KeyAfterPropSpread';
    })(f1 || (Be.JSXRole = f1 = {}));
    function dm(e) {
      let t = e.identifierRole;
      return (
        t === it.TopLevelDeclaration ||
        t === it.FunctionScopedDeclaration ||
        t === it.BlockScopedDeclaration ||
        t === it.ObjectShorthandTopLevelDeclaration ||
        t === it.ObjectShorthandFunctionScopedDeclaration ||
        t === it.ObjectShorthandBlockScopedDeclaration
      );
    }
    Be.isDeclaration = dm;
    function mm(e) {
      let t = e.identifierRole;
      return (
        t === it.FunctionScopedDeclaration ||
        t === it.BlockScopedDeclaration ||
        t === it.ObjectShorthandFunctionScopedDeclaration ||
        t === it.ObjectShorthandBlockScopedDeclaration
      );
    }
    Be.isNonTopLevelDeclaration = mm;
    function ym(e) {
      let t = e.identifierRole;
      return (
        t === it.TopLevelDeclaration ||
        t === it.ObjectShorthandTopLevelDeclaration ||
        t === it.ImportDeclaration
      );
    }
    Be.isTopLevelDeclaration = ym;
    function Tm(e) {
      let t = e.identifierRole;
      return (
        t === it.TopLevelDeclaration ||
        t === it.BlockScopedDeclaration ||
        t === it.ObjectShorthandTopLevelDeclaration ||
        t === it.ObjectShorthandBlockScopedDeclaration
      );
    }
    Be.isBlockScopedDeclaration = Tm;
    function km(e) {
      let t = e.identifierRole;
      return (
        t === it.FunctionScopedDeclaration ||
        t === it.ObjectShorthandFunctionScopedDeclaration
      );
    }
    Be.isFunctionScopedDeclaration = km;
    function vm(e) {
      return (
        e.identifierRole === it.ObjectShorthandTopLevelDeclaration ||
        e.identifierRole === it.ObjectShorthandBlockScopedDeclaration ||
        e.identifierRole === it.ObjectShorthandFunctionScopedDeclaration
      );
    }
    Be.isObjectShorthandDeclaration = vm;
    var Hi = class {
      constructor() {
        (this.type = b.state.type),
          (this.contextualKeyword = b.state.contextualKeyword),
          (this.start = b.state.start),
          (this.end = b.state.end),
          (this.scopeDepth = b.state.scopeDepth),
          (this.isType = b.state.isType),
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
    Be.Token = Hi;
    function zr() {
      b.state.tokens.push(new Hi()), k1();
    }
    Be.next = zr;
    function xm() {
      b.state.tokens.push(new Hi()), (b.state.start = b.state.pos), Km();
    }
    Be.nextTemplateToken = xm;
    function gm() {
      b.state.type === ne.TokenType.assign && --b.state.pos, jm();
    }
    Be.retokenizeSlashAsRegex = gm;
    function _m(e) {
      for (let s = b.state.tokens.length - e; s < b.state.tokens.length; s++)
        b.state.tokens[s].isType = !0;
      let t = b.state.isType;
      return (b.state.isType = !0), t;
    }
    Be.pushTypeContext = _m;
    function bm(e) {
      b.state.isType = e;
    }
    Be.popTypeContext = bm;
    function m1(e) {
      return Sa(e) ? (zr(), !0) : !1;
    }
    Be.eat = m1;
    function Cm(e) {
      let t = b.state.isType;
      (b.state.isType = !0), m1(e), (b.state.isType = t);
    }
    Be.eatTypeToken = Cm;
    function Sa(e) {
      return b.state.type === e;
    }
    Be.match = Sa;
    function wm() {
      let e = b.state.snapshot();
      zr();
      let t = b.state.type;
      return b.state.restoreFromSnapshot(e), t;
    }
    Be.lookaheadType = wm;
    var Gr = class {
      constructor(t, s) {
        (this.type = t), (this.contextualKeyword = s);
      }
    };
    Be.TypeAndKeyword = Gr;
    function Sm() {
      let e = b.state.snapshot();
      zr();
      let t = b.state.type,
        s = b.state.contextualKeyword;
      return b.state.restoreFromSnapshot(e), new Gr(t, s);
    }
    Be.lookaheadTypeAndKeyword = Sm;
    function y1() {
      return T1(b.state.pos);
    }
    Be.nextTokenStart = y1;
    function T1(e) {
      wa.skipWhiteSpace.lastIndex = e;
      let t = wa.skipWhiteSpace.exec(b.input);
      return e + t[0].length;
    }
    Be.nextTokenStartSince = T1;
    function Im() {
      return b.input.charCodeAt(y1());
    }
    Be.lookaheadCharCode = Im;
    function k1() {
      if (
        (x1(), (b.state.start = b.state.pos), b.state.pos >= b.input.length)
      ) {
        let e = b.state.tokens;
        e.length >= 2 &&
          e[e.length - 1].start >= b.input.length &&
          e[e.length - 2].start >= b.input.length &&
          ci.unexpected.call(void 0, 'Unexpectedly reached the end of input.'),
          Ve(ne.TokenType.eof);
        return;
      }
      Em(b.input.charCodeAt(b.state.pos));
    }
    Be.nextToken = k1;
    function Em(e) {
      d1.IS_IDENTIFIER_START[e] ||
      e === F.charCodes.backslash ||
      (e === F.charCodes.atSign &&
        b.input.charCodeAt(b.state.pos + 1) === F.charCodes.atSign)
        ? fm.default.call(void 0)
        : _1(e);
    }
    function Am() {
      for (
        ;
        b.input.charCodeAt(b.state.pos) !== F.charCodes.asterisk ||
        b.input.charCodeAt(b.state.pos + 1) !== F.charCodes.slash;

      )
        if ((b.state.pos++, b.state.pos > b.input.length)) {
          ci.unexpected.call(void 0, 'Unterminated comment', b.state.pos - 2);
          return;
        }
      b.state.pos += 2;
    }
    function v1(e) {
      let t = b.input.charCodeAt((b.state.pos += e));
      if (b.state.pos < b.input.length)
        for (
          ;
          t !== F.charCodes.lineFeed &&
          t !== F.charCodes.carriageReturn &&
          t !== F.charCodes.lineSeparator &&
          t !== F.charCodes.paragraphSeparator &&
          ++b.state.pos < b.input.length;

        )
          t = b.input.charCodeAt(b.state.pos);
    }
    Be.skipLineComment = v1;
    function x1() {
      for (; b.state.pos < b.input.length; ) {
        let e = b.input.charCodeAt(b.state.pos);
        switch (e) {
          case F.charCodes.carriageReturn:
            b.input.charCodeAt(b.state.pos + 1) === F.charCodes.lineFeed &&
              ++b.state.pos;
          case F.charCodes.lineFeed:
          case F.charCodes.lineSeparator:
          case F.charCodes.paragraphSeparator:
            ++b.state.pos;
            break;
          case F.charCodes.slash:
            switch (b.input.charCodeAt(b.state.pos + 1)) {
              case F.charCodes.asterisk:
                (b.state.pos += 2), Am();
                break;
              case F.charCodes.slash:
                v1(2);
                break;
              default:
                return;
            }
            break;
          default:
            if (wa.IS_WHITESPACE[e]) ++b.state.pos;
            else return;
        }
      }
    }
    Be.skipSpace = x1;
    function Ve(e, t = pm.ContextualKeyword.NONE) {
      (b.state.end = b.state.pos),
        (b.state.type = e),
        (b.state.contextualKeyword = t);
    }
    Be.finishToken = Ve;
    function Pm() {
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e >= F.charCodes.digit0 && e <= F.charCodes.digit9) {
        b1(!0);
        return;
      }
      e === F.charCodes.dot &&
      b.input.charCodeAt(b.state.pos + 2) === F.charCodes.dot
        ? ((b.state.pos += 3), Ve(ne.TokenType.ellipsis))
        : (++b.state.pos, Ve(ne.TokenType.dot));
    }
    function Nm() {
      b.input.charCodeAt(b.state.pos + 1) === F.charCodes.equalsTo
        ? Fe(ne.TokenType.assign, 2)
        : Fe(ne.TokenType.slash, 1);
    }
    function Rm(e) {
      let t =
          e === F.charCodes.asterisk ? ne.TokenType.star : ne.TokenType.modulo,
        s = 1,
        i = b.input.charCodeAt(b.state.pos + 1);
      e === F.charCodes.asterisk &&
        i === F.charCodes.asterisk &&
        (s++,
        (i = b.input.charCodeAt(b.state.pos + 2)),
        (t = ne.TokenType.exponent)),
        i === F.charCodes.equalsTo &&
          b.input.charCodeAt(b.state.pos + 2) !== F.charCodes.greaterThan &&
          (s++, (t = ne.TokenType.assign)),
        Fe(t, s);
    }
    function Lm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === e) {
        b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo
          ? Fe(ne.TokenType.assign, 3)
          : Fe(
              e === F.charCodes.verticalBar
                ? ne.TokenType.logicalOR
                : ne.TokenType.logicalAND,
              2
            );
        return;
      }
      if (e === F.charCodes.verticalBar) {
        if (t === F.charCodes.greaterThan) {
          Fe(ne.TokenType.pipeline, 2);
          return;
        } else if (t === F.charCodes.rightCurlyBrace && b.isFlowEnabled) {
          Fe(ne.TokenType.braceBarR, 2);
          return;
        }
      }
      if (t === F.charCodes.equalsTo) {
        Fe(ne.TokenType.assign, 2);
        return;
      }
      Fe(
        e === F.charCodes.verticalBar
          ? ne.TokenType.bitwiseOR
          : ne.TokenType.bitwiseAND,
        1
      );
    }
    function Om() {
      b.input.charCodeAt(b.state.pos + 1) === F.charCodes.equalsTo
        ? Fe(ne.TokenType.assign, 2)
        : Fe(ne.TokenType.bitwiseXOR, 1);
    }
    function Dm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === e) {
        Fe(ne.TokenType.preIncDec, 2);
        return;
      }
      t === F.charCodes.equalsTo
        ? Fe(ne.TokenType.assign, 2)
        : e === F.charCodes.plusSign
        ? Fe(ne.TokenType.plus, 1)
        : Fe(ne.TokenType.minus, 1);
    }
    function Mm() {
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e === F.charCodes.lessThan) {
        if (b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo) {
          Fe(ne.TokenType.assign, 3);
          return;
        }
        b.state.isType
          ? Fe(ne.TokenType.lessThan, 1)
          : Fe(ne.TokenType.bitShiftL, 2);
        return;
      }
      e === F.charCodes.equalsTo
        ? Fe(ne.TokenType.relationalOrEqual, 2)
        : Fe(ne.TokenType.lessThan, 1);
    }
    function g1() {
      if (b.state.isType) {
        Fe(ne.TokenType.greaterThan, 1);
        return;
      }
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e === F.charCodes.greaterThan) {
        let t =
          b.input.charCodeAt(b.state.pos + 2) === F.charCodes.greaterThan
            ? 3
            : 2;
        if (b.input.charCodeAt(b.state.pos + t) === F.charCodes.equalsTo) {
          Fe(ne.TokenType.assign, t + 1);
          return;
        }
        Fe(ne.TokenType.bitShiftR, t);
        return;
      }
      e === F.charCodes.equalsTo
        ? Fe(ne.TokenType.relationalOrEqual, 2)
        : Fe(ne.TokenType.greaterThan, 1);
    }
    function Fm() {
      b.state.type === ne.TokenType.greaterThan && ((b.state.pos -= 1), g1());
    }
    Be.rescan_gt = Fm;
    function Bm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === F.charCodes.equalsTo) {
        Fe(
          ne.TokenType.equality,
          b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo ? 3 : 2
        );
        return;
      }
      if (e === F.charCodes.equalsTo && t === F.charCodes.greaterThan) {
        (b.state.pos += 2), Ve(ne.TokenType.arrow);
        return;
      }
      Fe(e === F.charCodes.equalsTo ? ne.TokenType.eq : ne.TokenType.bang, 1);
    }
    function Vm() {
      let e = b.input.charCodeAt(b.state.pos + 1),
        t = b.input.charCodeAt(b.state.pos + 2);
      e === F.charCodes.questionMark && !(b.isFlowEnabled && b.state.isType)
        ? t === F.charCodes.equalsTo
          ? Fe(ne.TokenType.assign, 3)
          : Fe(ne.TokenType.nullishCoalescing, 2)
        : e === F.charCodes.dot &&
          !(t >= F.charCodes.digit0 && t <= F.charCodes.digit9)
        ? ((b.state.pos += 2), Ve(ne.TokenType.questionDot))
        : (++b.state.pos, Ve(ne.TokenType.question));
    }
    function _1(e) {
      switch (e) {
        case F.charCodes.numberSign:
          ++b.state.pos, Ve(ne.TokenType.hash);
          return;
        case F.charCodes.dot:
          Pm();
          return;
        case F.charCodes.leftParenthesis:
          ++b.state.pos, Ve(ne.TokenType.parenL);
          return;
        case F.charCodes.rightParenthesis:
          ++b.state.pos, Ve(ne.TokenType.parenR);
          return;
        case F.charCodes.semicolon:
          ++b.state.pos, Ve(ne.TokenType.semi);
          return;
        case F.charCodes.comma:
          ++b.state.pos, Ve(ne.TokenType.comma);
          return;
        case F.charCodes.leftSquareBracket:
          ++b.state.pos, Ve(ne.TokenType.bracketL);
          return;
        case F.charCodes.rightSquareBracket:
          ++b.state.pos, Ve(ne.TokenType.bracketR);
          return;
        case F.charCodes.leftCurlyBrace:
          b.isFlowEnabled &&
          b.input.charCodeAt(b.state.pos + 1) === F.charCodes.verticalBar
            ? Fe(ne.TokenType.braceBarL, 2)
            : (++b.state.pos, Ve(ne.TokenType.braceL));
          return;
        case F.charCodes.rightCurlyBrace:
          ++b.state.pos, Ve(ne.TokenType.braceR);
          return;
        case F.charCodes.colon:
          b.input.charCodeAt(b.state.pos + 1) === F.charCodes.colon
            ? Fe(ne.TokenType.doubleColon, 2)
            : (++b.state.pos, Ve(ne.TokenType.colon));
          return;
        case F.charCodes.questionMark:
          Vm();
          return;
        case F.charCodes.atSign:
          ++b.state.pos, Ve(ne.TokenType.at);
          return;
        case F.charCodes.graveAccent:
          ++b.state.pos, Ve(ne.TokenType.backQuote);
          return;
        case F.charCodes.digit0: {
          let t = b.input.charCodeAt(b.state.pos + 1);
          if (
            t === F.charCodes.lowercaseX ||
            t === F.charCodes.uppercaseX ||
            t === F.charCodes.lowercaseO ||
            t === F.charCodes.uppercaseO ||
            t === F.charCodes.lowercaseB ||
            t === F.charCodes.uppercaseB
          ) {
            $m();
            return;
          }
        }
        case F.charCodes.digit1:
        case F.charCodes.digit2:
        case F.charCodes.digit3:
        case F.charCodes.digit4:
        case F.charCodes.digit5:
        case F.charCodes.digit6:
        case F.charCodes.digit7:
        case F.charCodes.digit8:
        case F.charCodes.digit9:
          b1(!1);
          return;
        case F.charCodes.quotationMark:
        case F.charCodes.apostrophe:
          qm(e);
          return;
        case F.charCodes.slash:
          Nm();
          return;
        case F.charCodes.percentSign:
        case F.charCodes.asterisk:
          Rm(e);
          return;
        case F.charCodes.verticalBar:
        case F.charCodes.ampersand:
          Lm(e);
          return;
        case F.charCodes.caret:
          Om();
          return;
        case F.charCodes.plusSign:
        case F.charCodes.dash:
          Dm(e);
          return;
        case F.charCodes.lessThan:
          Mm();
          return;
        case F.charCodes.greaterThan:
          g1();
          return;
        case F.charCodes.equalsTo:
        case F.charCodes.exclamationMark:
          Bm(e);
          return;
        case F.charCodes.tilde:
          Fe(ne.TokenType.tilde, 1);
          return;
        default:
          break;
      }
      ci.unexpected.call(
        void 0,
        `Unexpected character '${String.fromCharCode(e)}'`,
        b.state.pos
      );
    }
    Be.getTokenFromCode = _1;
    function Fe(e, t) {
      (b.state.pos += t), Ve(e);
    }
    function jm() {
      let e = b.state.pos,
        t = !1,
        s = !1;
      for (;;) {
        if (b.state.pos >= b.input.length) {
          ci.unexpected.call(void 0, 'Unterminated regular expression', e);
          return;
        }
        let i = b.input.charCodeAt(b.state.pos);
        if (t) t = !1;
        else {
          if (i === F.charCodes.leftSquareBracket) s = !0;
          else if (i === F.charCodes.rightSquareBracket && s) s = !1;
          else if (i === F.charCodes.slash && !s) break;
          t = i === F.charCodes.backslash;
        }
        ++b.state.pos;
      }
      ++b.state.pos, C1(), Ve(ne.TokenType.regexp);
    }
    function Ca() {
      for (;;) {
        let e = b.input.charCodeAt(b.state.pos);
        if (
          (e >= F.charCodes.digit0 && e <= F.charCodes.digit9) ||
          e === F.charCodes.underscore
        )
          b.state.pos++;
        else break;
      }
    }
    function $m() {
      for (b.state.pos += 2; ; ) {
        let t = b.input.charCodeAt(b.state.pos);
        if (
          (t >= F.charCodes.digit0 && t <= F.charCodes.digit9) ||
          (t >= F.charCodes.lowercaseA && t <= F.charCodes.lowercaseF) ||
          (t >= F.charCodes.uppercaseA && t <= F.charCodes.uppercaseF) ||
          t === F.charCodes.underscore
        )
          b.state.pos++;
        else break;
      }
      b.input.charCodeAt(b.state.pos) === F.charCodes.lowercaseN
        ? (++b.state.pos, Ve(ne.TokenType.bigint))
        : Ve(ne.TokenType.num);
    }
    function b1(e) {
      let t = !1,
        s = !1;
      e || Ca();
      let i = b.input.charCodeAt(b.state.pos);
      if (
        (i === F.charCodes.dot &&
          (++b.state.pos, Ca(), (i = b.input.charCodeAt(b.state.pos))),
        (i === F.charCodes.uppercaseE || i === F.charCodes.lowercaseE) &&
          ((i = b.input.charCodeAt(++b.state.pos)),
          (i === F.charCodes.plusSign || i === F.charCodes.dash) &&
            ++b.state.pos,
          Ca(),
          (i = b.input.charCodeAt(b.state.pos))),
        i === F.charCodes.lowercaseN
          ? (++b.state.pos, (t = !0))
          : i === F.charCodes.lowercaseM && (++b.state.pos, (s = !0)),
        t)
      ) {
        Ve(ne.TokenType.bigint);
        return;
      }
      if (s) {
        Ve(ne.TokenType.decimal);
        return;
      }
      Ve(ne.TokenType.num);
    }
    function qm(e) {
      for (b.state.pos++; ; ) {
        if (b.state.pos >= b.input.length) {
          ci.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        let t = b.input.charCodeAt(b.state.pos);
        if (t === F.charCodes.backslash) b.state.pos++;
        else if (t === e) break;
        b.state.pos++;
      }
      b.state.pos++, Ve(ne.TokenType.string);
    }
    function Km() {
      for (;;) {
        if (b.state.pos >= b.input.length) {
          ci.unexpected.call(void 0, 'Unterminated template');
          return;
        }
        let e = b.input.charCodeAt(b.state.pos);
        if (
          e === F.charCodes.graveAccent ||
          (e === F.charCodes.dollarSign &&
            b.input.charCodeAt(b.state.pos + 1) === F.charCodes.leftCurlyBrace)
        ) {
          if (b.state.pos === b.state.start && Sa(ne.TokenType.template))
            if (e === F.charCodes.dollarSign) {
              (b.state.pos += 2), Ve(ne.TokenType.dollarBraceL);
              return;
            } else {
              ++b.state.pos, Ve(ne.TokenType.backQuote);
              return;
            }
          Ve(ne.TokenType.template);
          return;
        }
        e === F.charCodes.backslash && b.state.pos++, b.state.pos++;
      }
    }
    function C1() {
      for (; b.state.pos < b.input.length; ) {
        let e = b.input.charCodeAt(b.state.pos);
        if (d1.IS_IDENTIFIER_CHAR[e]) b.state.pos++;
        else if (e === F.charCodes.backslash) {
          if (
            ((b.state.pos += 2),
            b.input.charCodeAt(b.state.pos) === F.charCodes.leftCurlyBrace)
          ) {
            for (
              ;
              b.state.pos < b.input.length &&
              b.input.charCodeAt(b.state.pos) !== F.charCodes.rightCurlyBrace;

            )
              b.state.pos++;
            b.state.pos++;
          }
        } else break;
      }
    }
    Be.skipWord = C1;
  });
  var Wi = Z((Ia) => {
    'use strict';
    Object.defineProperty(Ia, '__esModule', {value: !0});
    var w1 = be();
    function Um(e, t = e.currentIndex()) {
      let s = t + 1;
      if (Xr(e, s)) {
        let i = e.identifierNameAtIndex(t);
        return {isType: !1, leftName: i, rightName: i, endIndex: s};
      }
      if ((s++, Xr(e, s)))
        return {isType: !0, leftName: null, rightName: null, endIndex: s};
      if ((s++, Xr(e, s)))
        return {
          isType: !1,
          leftName: e.identifierNameAtIndex(t),
          rightName: e.identifierNameAtIndex(t + 2),
          endIndex: s,
        };
      if ((s++, Xr(e, s)))
        return {isType: !0, leftName: null, rightName: null, endIndex: s};
      throw new Error(`Unexpected import/export specifier at ${t}`);
    }
    Ia.default = Um;
    function Xr(e, t) {
      let s = e.tokens[t];
      return s.type === w1.TokenType.braceR || s.type === w1.TokenType.comma;
    }
  });
  var S1 = Z((Ea) => {
    'use strict';
    Object.defineProperty(Ea, '__esModule', {value: !0});
    Ea.default = new Map([
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
  var Pa = Z((Aa) => {
    'use strict';
    Object.defineProperty(Aa, '__esModule', {value: !0});
    function Hm(e) {
      let [t, s] = I1(e.jsxPragma || 'React.createElement'),
        [i, r] = I1(e.jsxFragmentPragma || 'React.Fragment');
      return {base: t, suffix: s, fragmentBase: i, fragmentSuffix: r};
    }
    Aa.default = Hm;
    function I1(e) {
      let t = e.indexOf('.');
      return t === -1 && (t = e.length), [e.slice(0, t), e.slice(t)];
    }
  });
  var hn = Z((Ra) => {
    'use strict';
    Object.defineProperty(Ra, '__esModule', {value: !0});
    var Na = class {
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
    Ra.default = Na;
  });
  var Da = Z((Jr) => {
    'use strict';
    Object.defineProperty(Jr, '__esModule', {value: !0});
    function Oa(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Wm = S1(),
      Gm = Oa(Wm),
      Yr = xt(),
      Re = be(),
      An = Qt(),
      zm = Pa(),
      Xm = Oa(zm),
      Ym = hn(),
      Jm = Oa(Ym),
      La = class e extends Jm.default {
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
        constructor(t, s, i, r, a) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.importProcessor = i),
            (this.nameManager = r),
            (this.options = a),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            e.prototype.__init4.call(this),
            e.prototype.__init5.call(this),
            (this.jsxPragmaInfo = Xm.default.call(void 0, a)),
            (this.isAutomaticRuntime = a.jsxRuntime === 'automatic'),
            (this.jsxImportSource = a.jsxImportSource || 'react');
        }
        process() {
          return this.tokens.matches1(Re.TokenType.jsxTagStart)
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
              for (let [s, i] of Object.entries(
                this.cjsAutomaticModuleNameResolutions
              ))
                t += `var ${i} = require("${s}");`;
            else {
              let {createElement: s, ...i} =
                this.esmAutomaticImportNameResolutions;
              s &&
                (t += `import {createElement as ${s}} from "${this.jsxImportSource}";`);
              let r = Object.entries(i)
                .map(([a, u]) => `${a} as ${u}`)
                .join(', ');
              if (r) {
                let a =
                  this.jsxImportSource +
                  (this.options.production
                    ? '/jsx-runtime'
                    : '/jsx-dev-runtime');
                t += `import {${r}} from "${a}";`;
              }
            }
          return t;
        }
        processJSXTag() {
          let {jsxRole: t, start: s} = this.tokens.currentToken(),
            i = this.options.production ? null : this.getElementLocationCode(s);
          this.isAutomaticRuntime && t !== Yr.JSXRole.KeyAfterPropSpread
            ? this.transformTagToJSXFunc(i, t)
            : this.transformTagToCreateElement(i);
        }
        getElementLocationCode(t) {
          return `lineNumber: ${this.getLineNumberForIndex(t)}`;
        }
        getLineNumberForIndex(t) {
          let s = this.tokens.code;
          for (; this.lastIndex < t && this.lastIndex < s.length; )
            s[this.lastIndex] ===
              `
` && this.lastLineNumber++,
              this.lastIndex++;
          return this.lastLineNumber;
        }
        transformTagToJSXFunc(t, s) {
          let i = s === Yr.JSXRole.StaticChildren;
          this.tokens.replaceToken(this.getJSXFuncInvocationCode(i));
          let r = null;
          if (this.tokens.matches1(Re.TokenType.jsxTagEnd))
            this.tokens.replaceToken(`${this.getFragmentCode()}, {`),
              this.processAutomaticChildrenAndEndProps(s);
          else {
            if (
              (this.processTagIntro(),
              this.tokens.appendCode(', {'),
              (r = this.processProps(!0)),
              this.tokens.matches2(Re.TokenType.slash, Re.TokenType.jsxTagEnd))
            )
              this.tokens.appendCode('}');
            else if (this.tokens.matches1(Re.TokenType.jsxTagEnd))
              this.tokens.removeToken(),
                this.processAutomaticChildrenAndEndProps(s);
            else
              throw new Error('Expected either /> or > at the end of the tag.');
            r && this.tokens.appendCode(`, ${r}`);
          }
          for (
            this.options.production ||
              (r === null && this.tokens.appendCode(', void 0'),
              this.tokens.appendCode(`, ${i}, ${this.getDevSource(t)}, this`)),
              this.tokens.removeInitialToken();
            !this.tokens.matches1(Re.TokenType.jsxTagEnd);

          )
            this.tokens.removeToken();
          this.tokens.replaceToken(')');
        }
        transformTagToCreateElement(t) {
          if (
            (this.tokens.replaceToken(this.getCreateElementInvocationCode()),
            this.tokens.matches1(Re.TokenType.jsxTagEnd))
          )
            this.tokens.replaceToken(`${this.getFragmentCode()}, null`),
              this.processChildren(!0);
          else if (
            (this.processTagIntro(),
            this.processPropsObjectWithDevInfo(t),
            !this.tokens.matches2(Re.TokenType.slash, Re.TokenType.jsxTagEnd))
          )
            if (this.tokens.matches1(Re.TokenType.jsxTagEnd))
              this.tokens.removeToken(), this.processChildren(!0);
            else
              throw new Error('Expected either /> or > at the end of the tag.');
          for (
            this.tokens.removeInitialToken();
            !this.tokens.matches1(Re.TokenType.jsxTagEnd);

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
        claimAutoImportedFuncInvocation(t, s) {
          let i = this.claimAutoImportedName(t, s);
          return this.importProcessor ? `${i}.call(void 0, ` : `${i}(`;
        }
        claimAutoImportedName(t, s) {
          if (this.importProcessor) {
            let i = this.jsxImportSource + s;
            return (
              this.cjsAutomaticModuleNameResolutions[i] ||
                (this.cjsAutomaticModuleNameResolutions[i] =
                  this.importProcessor.getFreeIdentifierForPath(i)),
              `${this.cjsAutomaticModuleNameResolutions[i]}.${t}`
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
              Re.TokenType.jsxName,
              Re.TokenType.jsxName
            ) &&
              !this.tokens.matches2AtIndex(
                t - 1,
                Re.TokenType.greaterThan,
                Re.TokenType.jsxName
              ) &&
              !this.tokens.matches1AtIndex(t, Re.TokenType.braceL) &&
              !this.tokens.matches1AtIndex(t, Re.TokenType.jsxTagEnd) &&
              !this.tokens.matches2AtIndex(
                t,
                Re.TokenType.slash,
                Re.TokenType.jsxTagEnd
              ));

          )
            t++;
          if (t === this.tokens.currentIndex() + 1) {
            let s = this.tokens.identifierName();
            A1(s) && this.tokens.replaceToken(`'${s}'`);
          }
          for (; this.tokens.currentIndex() < t; )
            this.rootTransformer.processToken();
        }
        processPropsObjectWithDevInfo(t) {
          let s = this.options.production
            ? ''
            : `__self: this, __source: ${this.getDevSource(t)}`;
          if (
            !this.tokens.matches1(Re.TokenType.jsxName) &&
            !this.tokens.matches1(Re.TokenType.braceL)
          ) {
            s
              ? this.tokens.appendCode(`, {${s}}`)
              : this.tokens.appendCode(', null');
            return;
          }
          this.tokens.appendCode(', {'),
            this.processProps(!1),
            s ? this.tokens.appendCode(` ${s}}`) : this.tokens.appendCode('}');
        }
        processProps(t) {
          let s = null;
          for (;;) {
            if (this.tokens.matches2(Re.TokenType.jsxName, Re.TokenType.eq)) {
              let i = this.tokens.identifierName();
              if (t && i === 'key') {
                s !== null && this.tokens.appendCode(s.replace(/[^\n]/g, '')),
                  this.tokens.removeToken(),
                  this.tokens.removeToken();
                let r = this.tokens.snapshot();
                this.processPropValue(),
                  (s = this.tokens.dangerouslyGetAndRemoveCodeSinceSnapshot(r));
                continue;
              } else
                this.processPropName(i),
                  this.tokens.replaceToken(': '),
                  this.processPropValue();
            } else if (this.tokens.matches1(Re.TokenType.jsxName)) {
              let i = this.tokens.identifierName();
              this.processPropName(i), this.tokens.appendCode(': true');
            } else if (this.tokens.matches1(Re.TokenType.braceL))
              this.tokens.replaceToken(''),
                this.rootTransformer.processBalancedCode(),
                this.tokens.replaceToken('');
            else break;
            this.tokens.appendCode(',');
          }
          return s;
        }
        processPropName(t) {
          t.includes('-')
            ? this.tokens.replaceToken(`'${t}'`)
            : this.tokens.copyToken();
        }
        processPropValue() {
          this.tokens.matches1(Re.TokenType.braceL)
            ? (this.tokens.replaceToken(''),
              this.rootTransformer.processBalancedCode(),
              this.tokens.replaceToken(''))
            : this.tokens.matches1(Re.TokenType.jsxTagStart)
            ? this.processJSXTag()
            : this.processStringPropValue();
        }
        processStringPropValue() {
          let t = this.tokens.currentToken(),
            s = this.tokens.code.slice(t.start + 1, t.end - 1),
            i = E1(s),
            r = Zm(s);
          this.tokens.replaceToken(r + i);
        }
        processAutomaticChildrenAndEndProps(t) {
          t === Yr.JSXRole.StaticChildren
            ? (this.tokens.appendCode(' children: ['),
              this.processChildren(!1),
              this.tokens.appendCode(']}'))
            : (t === Yr.JSXRole.OneChild &&
                this.tokens.appendCode(' children: '),
              this.processChildren(!1),
              this.tokens.appendCode('}'));
        }
        processChildren(t) {
          let s = t;
          for (;;) {
            if (
              this.tokens.matches2(Re.TokenType.jsxTagStart, Re.TokenType.slash)
            )
              return;
            let i = !1;
            if (this.tokens.matches1(Re.TokenType.braceL))
              this.tokens.matches2(Re.TokenType.braceL, Re.TokenType.braceR)
                ? (this.tokens.replaceToken(''), this.tokens.replaceToken(''))
                : (this.tokens.replaceToken(s ? ', ' : ''),
                  this.rootTransformer.processBalancedCode(),
                  this.tokens.replaceToken(''),
                  (i = !0));
            else if (this.tokens.matches1(Re.TokenType.jsxTagStart))
              this.tokens.appendCode(s ? ', ' : ''),
                this.processJSXTag(),
                (i = !0);
            else if (
              this.tokens.matches1(Re.TokenType.jsxText) ||
              this.tokens.matches1(Re.TokenType.jsxEmptyText)
            )
              i = this.processChildTextElement(s);
            else
              throw new Error('Unexpected token when processing JSX children.');
            i && (s = !0);
          }
        }
        processChildTextElement(t) {
          let s = this.tokens.currentToken(),
            i = this.tokens.code.slice(s.start, s.end),
            r = E1(i),
            a = Qm(i);
          return a === '""'
            ? (this.tokens.replaceToken(r), !1)
            : (this.tokens.replaceToken(`${t ? ', ' : ''}${a}${r}`), !0);
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
    Jr.default = La;
    function A1(e) {
      let t = e.charCodeAt(0);
      return t >= An.charCodes.lowercaseA && t <= An.charCodes.lowercaseZ;
    }
    Jr.startsWithLowerCase = A1;
    function Qm(e) {
      let t = '',
        s = '',
        i = !1,
        r = !1;
      for (let a = 0; a < e.length; a++) {
        let u = e[a];
        if (u === ' ' || u === '	' || u === '\r') i || (s += u);
        else if (
          u ===
          `
`
        )
          (s = ''), (i = !0);
        else {
          if ((r && i && (t += ' '), (t += s), (s = ''), u === '&')) {
            let {entity: d, newI: y} = P1(e, a + 1);
            (a = y - 1), (t += d);
          } else t += u;
          (r = !0), (i = !1);
        }
      }
      return i || (t += s), JSON.stringify(t);
    }
    function E1(e) {
      let t = 0,
        s = 0;
      for (let i of e)
        i ===
        `
`
          ? (t++, (s = 0))
          : i === ' ' && s++;
      return (
        `
`.repeat(t) + ' '.repeat(s)
      );
    }
    function Zm(e) {
      let t = '';
      for (let s = 0; s < e.length; s++) {
        let i = e[s];
        if (
          i ===
          `
`
        )
          if (/\s/.test(e[s + 1]))
            for (t += ' '; s < e.length && /\s/.test(e[s + 1]); ) s++;
          else
            t += `
`;
        else if (i === '&') {
          let {entity: r, newI: a} = P1(e, s + 1);
          (t += r), (s = a - 1);
        } else t += i;
      }
      return JSON.stringify(t);
    }
    function P1(e, t) {
      let s = '',
        i = 0,
        r,
        a = t;
      if (e[a] === '#') {
        let u = 10;
        a++;
        let d;
        if (e[a] === 'x')
          for (u = 16, a++, d = a; a < e.length && ty(e.charCodeAt(a)); ) a++;
        else for (d = a; a < e.length && ey(e.charCodeAt(a)); ) a++;
        if (e[a] === ';') {
          let y = e.slice(d, a);
          y && (a++, (r = String.fromCodePoint(parseInt(y, u))));
        }
      } else
        for (; a < e.length && i++ < 10; ) {
          let u = e[a];
          if ((a++, u === ';')) {
            r = Gm.default.get(s);
            break;
          }
          s += u;
        }
      return r ? {entity: r, newI: a} : {entity: '&', newI: t};
    }
    function ey(e) {
      return e >= An.charCodes.digit0 && e <= An.charCodes.digit9;
    }
    function ty(e) {
      return (
        (e >= An.charCodes.digit0 && e <= An.charCodes.digit9) ||
        (e >= An.charCodes.lowercaseA && e <= An.charCodes.lowercaseF) ||
        (e >= An.charCodes.uppercaseA && e <= An.charCodes.uppercaseF)
      );
    }
  });
  var Fa = Z((Ma) => {
    'use strict';
    Object.defineProperty(Ma, '__esModule', {value: !0});
    function ny(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Qr = xt(),
      ui = be(),
      sy = Da(),
      iy = Pa(),
      ry = ny(iy);
    function oy(e, t) {
      let s = ry.default.call(void 0, t),
        i = new Set();
      for (let r = 0; r < e.tokens.length; r++) {
        let a = e.tokens[r];
        if (
          (a.type === ui.TokenType.name &&
            !a.isType &&
            (a.identifierRole === Qr.IdentifierRole.Access ||
              a.identifierRole === Qr.IdentifierRole.ObjectShorthand ||
              a.identifierRole === Qr.IdentifierRole.ExportAccess) &&
            !a.shadowsGlobal &&
            i.add(e.identifierNameForToken(a)),
          a.type === ui.TokenType.jsxTagStart && i.add(s.base),
          a.type === ui.TokenType.jsxTagStart &&
            r + 1 < e.tokens.length &&
            e.tokens[r + 1].type === ui.TokenType.jsxTagEnd &&
            (i.add(s.base), i.add(s.fragmentBase)),
          a.type === ui.TokenType.jsxName &&
            a.identifierRole === Qr.IdentifierRole.Access)
        ) {
          let u = e.identifierNameForToken(a);
          (!sy.startsWithLowerCase.call(void 0, u) ||
            e.tokens[r + 1].type === ui.TokenType.dot) &&
            i.add(e.identifierNameForToken(a));
        }
      }
      return i;
    }
    Ma.getNonTypeIdentifiers = oy;
  });
  var N1 = Z((Va) => {
    'use strict';
    Object.defineProperty(Va, '__esModule', {value: !0});
    function ay(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var ly = xt(),
      Zr = It(),
      me = be(),
      cy = Wi(),
      uy = ay(cy),
      py = Fa(),
      Ba = class e {
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
        constructor(t, s, i, r, a, u) {
          (this.nameManager = t),
            (this.tokens = s),
            (this.enableLegacyTypeScriptModuleInterop = i),
            (this.options = r),
            (this.isTypeScriptTransformEnabled = a),
            (this.helperManager = u),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            e.prototype.__init4.call(this),
            e.prototype.__init5.call(this);
        }
        preprocessTokens() {
          for (let t = 0; t < this.tokens.tokens.length; t++)
            this.tokens.matches1AtIndex(t, me.TokenType._import) &&
              !this.tokens.matches3AtIndex(
                t,
                me.TokenType._import,
                me.TokenType.name,
                me.TokenType.eq
              ) &&
              this.preprocessImportAtIndex(t),
              this.tokens.matches1AtIndex(t, me.TokenType._export) &&
                !this.tokens.matches2AtIndex(
                  t,
                  me.TokenType._export,
                  me.TokenType.eq
                ) &&
                this.preprocessExportAtIndex(t);
          this.generateImportReplacements();
        }
        pruneTypeOnlyImports() {
          this.nonTypeIdentifiers = py.getNonTypeIdentifiers.call(
            void 0,
            this.tokens,
            this.options
          );
          for (let [t, s] of this.importInfoByPath.entries()) {
            if (
              s.hasBareImport ||
              s.hasStarExport ||
              s.exportStarNames.length > 0 ||
              s.namedExports.length > 0
            )
              continue;
            [
              ...s.defaultNames,
              ...s.wildcardNames,
              ...s.namedImports.map(({localName: r}) => r),
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
          for (let [t, s] of this.importInfoByPath.entries()) {
            let {
              defaultNames: i,
              wildcardNames: r,
              namedImports: a,
              namedExports: u,
              exportStarNames: d,
              hasStarExport: y,
            } = s;
            if (
              i.length === 0 &&
              r.length === 0 &&
              a.length === 0 &&
              u.length === 0 &&
              d.length === 0 &&
              !y
            ) {
              this.importsToReplace.set(t, `require('${t}');`);
              continue;
            }
            let g = this.getFreeIdentifierForPath(t),
              L;
            this.enableLegacyTypeScriptModuleInterop
              ? (L = g)
              : (L = r.length > 0 ? r[0] : this.getFreeIdentifierForPath(t));
            let p = `var ${g} = require('${t}');`;
            if (r.length > 0)
              for (let h of r) {
                let T = this.enableLegacyTypeScriptModuleInterop
                  ? g
                  : `${this.helperManager.getHelperName(
                      'interopRequireWildcard'
                    )}(${g})`;
                p += ` var ${h} = ${T};`;
              }
            else
              d.length > 0 && L !== g
                ? (p += ` var ${L} = ${this.helperManager.getHelperName(
                    'interopRequireWildcard'
                  )}(${g});`)
                : i.length > 0 &&
                  L !== g &&
                  (p += ` var ${L} = ${this.helperManager.getHelperName(
                    'interopRequireDefault'
                  )}(${g});`);
            for (let {importedName: h, localName: T} of u)
              p += ` ${this.helperManager.getHelperName(
                'createNamedExportFrom'
              )}(${g}, '${T}', '${h}');`;
            for (let h of d) p += ` exports.${h} = ${L};`;
            y &&
              (p += ` ${this.helperManager.getHelperName(
                'createStarExport'
              )}(${g});`),
              this.importsToReplace.set(t, p);
            for (let h of i) this.identifierReplacements.set(h, `${L}.default`);
            for (let {importedName: h, localName: T} of a)
              this.identifierReplacements.set(T, `${g}.${h}`);
          }
        }
        getFreeIdentifierForPath(t) {
          let s = t.split('/'),
            r = s[s.length - 1].replace(/\W/g, '');
          return this.nameManager.claimFreeName(`_${r}`);
        }
        preprocessImportAtIndex(t) {
          let s = [],
            i = [],
            r = [];
          if (
            (t++,
            ((this.tokens.matchesContextualAtIndex(
              t,
              Zr.ContextualKeyword._type
            ) ||
              this.tokens.matches1AtIndex(t, me.TokenType._typeof)) &&
              !this.tokens.matches1AtIndex(t + 1, me.TokenType.comma) &&
              !this.tokens.matchesContextualAtIndex(
                t + 1,
                Zr.ContextualKeyword._from
              )) ||
              this.tokens.matches1AtIndex(t, me.TokenType.parenL))
          )
            return;
          if (
            (this.tokens.matches1AtIndex(t, me.TokenType.name) &&
              (s.push(this.tokens.identifierNameAtIndex(t)),
              t++,
              this.tokens.matches1AtIndex(t, me.TokenType.comma) && t++),
            this.tokens.matches1AtIndex(t, me.TokenType.star) &&
              ((t += 2), i.push(this.tokens.identifierNameAtIndex(t)), t++),
            this.tokens.matches1AtIndex(t, me.TokenType.braceL))
          ) {
            let d = this.getNamedImports(t + 1);
            t = d.newIndex;
            for (let y of d.namedImports)
              y.importedName === 'default' ? s.push(y.localName) : r.push(y);
          }
          if (
            (this.tokens.matchesContextualAtIndex(
              t,
              Zr.ContextualKeyword._from
            ) && t++,
            !this.tokens.matches1AtIndex(t, me.TokenType.string))
          )
            throw new Error(
              'Expected string token at the end of import statement.'
            );
          let a = this.tokens.stringValueAtIndex(t),
            u = this.getImportInfo(a);
          u.defaultNames.push(...s),
            u.wildcardNames.push(...i),
            u.namedImports.push(...r),
            s.length === 0 &&
              i.length === 0 &&
              r.length === 0 &&
              (u.hasBareImport = !0);
        }
        preprocessExportAtIndex(t) {
          if (
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType._var
            ) ||
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType._let
            ) ||
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType._const
            )
          )
            this.preprocessVarExportAtIndex(t);
          else if (
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType._function
            ) ||
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType._class
            )
          ) {
            let s = this.tokens.identifierNameAtIndex(t + 2);
            this.addExportBinding(s, s);
          } else if (
            this.tokens.matches3AtIndex(
              t,
              me.TokenType._export,
              me.TokenType.name,
              me.TokenType._function
            )
          ) {
            let s = this.tokens.identifierNameAtIndex(t + 3);
            this.addExportBinding(s, s);
          } else
            this.tokens.matches2AtIndex(
              t,
              me.TokenType._export,
              me.TokenType.braceL
            )
              ? this.preprocessNamedExportAtIndex(t)
              : this.tokens.matches2AtIndex(
                  t,
                  me.TokenType._export,
                  me.TokenType.star
                ) && this.preprocessExportStarAtIndex(t);
        }
        preprocessVarExportAtIndex(t) {
          let s = 0;
          for (let i = t + 2; ; i++)
            if (
              this.tokens.matches1AtIndex(i, me.TokenType.braceL) ||
              this.tokens.matches1AtIndex(i, me.TokenType.dollarBraceL) ||
              this.tokens.matches1AtIndex(i, me.TokenType.bracketL)
            )
              s++;
            else if (
              this.tokens.matches1AtIndex(i, me.TokenType.braceR) ||
              this.tokens.matches1AtIndex(i, me.TokenType.bracketR)
            )
              s--;
            else {
              if (s === 0 && !this.tokens.matches1AtIndex(i, me.TokenType.name))
                break;
              if (this.tokens.matches1AtIndex(1, me.TokenType.eq)) {
                let r = this.tokens.currentToken().rhsEndIndex;
                if (r == null)
                  throw new Error('Expected = token with an end index.');
                i = r - 1;
              } else {
                let r = this.tokens.tokens[i];
                if (ly.isDeclaration.call(void 0, r)) {
                  let a = this.tokens.identifierNameAtIndex(i);
                  this.identifierReplacements.set(a, `exports.${a}`);
                }
              }
            }
        }
        preprocessNamedExportAtIndex(t) {
          t += 2;
          let {newIndex: s, namedImports: i} = this.getNamedImports(t);
          if (
            ((t = s),
            this.tokens.matchesContextualAtIndex(t, Zr.ContextualKeyword._from))
          )
            t++;
          else {
            for (let {importedName: u, localName: d} of i)
              this.addExportBinding(u, d);
            return;
          }
          if (!this.tokens.matches1AtIndex(t, me.TokenType.string))
            throw new Error(
              'Expected string token at the end of import statement.'
            );
          let r = this.tokens.stringValueAtIndex(t);
          this.getImportInfo(r).namedExports.push(...i);
        }
        preprocessExportStarAtIndex(t) {
          let s = null;
          if (
            (this.tokens.matches3AtIndex(
              t,
              me.TokenType._export,
              me.TokenType.star,
              me.TokenType._as
            )
              ? ((t += 3), (s = this.tokens.identifierNameAtIndex(t)), (t += 2))
              : (t += 3),
            !this.tokens.matches1AtIndex(t, me.TokenType.string))
          )
            throw new Error(
              'Expected string token at the end of star export statement.'
            );
          let i = this.tokens.stringValueAtIndex(t),
            r = this.getImportInfo(i);
          s !== null ? r.exportStarNames.push(s) : (r.hasStarExport = !0);
        }
        getNamedImports(t) {
          let s = [];
          for (;;) {
            if (this.tokens.matches1AtIndex(t, me.TokenType.braceR)) {
              t++;
              break;
            }
            let i = uy.default.call(void 0, this.tokens, t);
            if (
              ((t = i.endIndex),
              i.isType ||
                s.push({importedName: i.leftName, localName: i.rightName}),
              this.tokens.matches2AtIndex(
                t,
                me.TokenType.comma,
                me.TokenType.braceR
              ))
            ) {
              t += 2;
              break;
            } else if (this.tokens.matches1AtIndex(t, me.TokenType.braceR)) {
              t++;
              break;
            } else if (this.tokens.matches1AtIndex(t, me.TokenType.comma)) t++;
            else
              throw new Error(
                `Unexpected token: ${JSON.stringify(this.tokens.tokens[t])}`
              );
          }
          return {newIndex: t, namedImports: s};
        }
        getImportInfo(t) {
          let s = this.importInfoByPath.get(t);
          if (s) return s;
          let i = {
            defaultNames: [],
            wildcardNames: [],
            namedImports: [],
            namedExports: [],
            hasBareImport: !1,
            exportStarNames: [],
            hasStarExport: !1,
          };
          return this.importInfoByPath.set(t, i), i;
        }
        addExportBinding(t, s) {
          this.exportBindingsByLocalName.has(t) ||
            this.exportBindingsByLocalName.set(t, []),
            this.exportBindingsByLocalName.get(t).push(s);
        }
        claimImportCode(t) {
          let s = this.importsToReplace.get(t);
          return this.importsToReplace.set(t, ''), s || '';
        }
        getIdentifierReplacement(t) {
          return this.identifierReplacements.get(t) || null;
        }
        resolveExportBinding(t) {
          let s = this.exportBindingsByLocalName.get(t);
          return !s || s.length === 0
            ? null
            : s.map((i) => `exports.${i}`).join(' = ');
        }
        getGlobalNames() {
          return new Set([
            ...this.identifierReplacements.keys(),
            ...this.exportBindingsByLocalName.keys(),
          ]);
        }
      };
    Va.default = Ba;
  });
  var L1 = Z((eo, R1) => {
    (function (e, t) {
      typeof eo == 'object' && typeof R1 < 'u'
        ? t(eo)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.setArray = {})));
    })(eo, function (e) {
      'use strict';
      (e.get = void 0), (e.put = void 0), (e.pop = void 0);
      class t {
        constructor() {
          (this._indexes = {__proto__: null}), (this.array = []);
        }
      }
      (e.get = (s, i) => s._indexes[i]),
        (e.put = (s, i) => {
          let r = e.get(s, i);
          if (r !== void 0) return r;
          let {array: a, _indexes: u} = s;
          return (u[i] = a.push(i) - 1);
        }),
        (e.pop = (s) => {
          let {array: i, _indexes: r} = s;
          if (i.length === 0) return;
          let a = i.pop();
          r[a] = void 0;
        }),
        (e.SetArray = t),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var ja = Z((to, O1) => {
    (function (e, t) {
      typeof to == 'object' && typeof O1 < 'u'
        ? t(to)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.sourcemapCodec = {})));
    })(to, function (e) {
      'use strict';
      let i =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        r = new Uint8Array(64),
        a = new Uint8Array(128);
      for (let w = 0; w < i.length; w++) {
        let S = i.charCodeAt(w);
        (r[w] = S), (a[S] = w);
      }
      let u =
        typeof TextDecoder < 'u'
          ? new TextDecoder()
          : typeof Buffer < 'u'
          ? {
              decode(w) {
                return Buffer.from(
                  w.buffer,
                  w.byteOffset,
                  w.byteLength
                ).toString();
              },
            }
          : {
              decode(w) {
                let S = '';
                for (let A = 0; A < w.length; A++)
                  S += String.fromCharCode(w[A]);
                return S;
              },
            };
      function d(w) {
        let S = new Int32Array(5),
          A = [],
          U = 0;
        do {
          let M = y(w, U),
            c = [],
            R = !0,
            W = 0;
          S[0] = 0;
          for (let X = U; X < M; X++) {
            let ie;
            X = g(w, X, S, 0);
            let pe = S[0];
            pe < W && (R = !1),
              (W = pe),
              L(w, X, M)
                ? ((X = g(w, X, S, 1)),
                  (X = g(w, X, S, 2)),
                  (X = g(w, X, S, 3)),
                  L(w, X, M)
                    ? ((X = g(w, X, S, 4)), (ie = [pe, S[1], S[2], S[3], S[4]]))
                    : (ie = [pe, S[1], S[2], S[3]]))
                : (ie = [pe]),
              c.push(ie);
          }
          R || p(c), A.push(c), (U = M + 1);
        } while (U <= w.length);
        return A;
      }
      function y(w, S) {
        let A = w.indexOf(';', S);
        return A === -1 ? w.length : A;
      }
      function g(w, S, A, U) {
        let M = 0,
          c = 0,
          R = 0;
        do {
          let X = w.charCodeAt(S++);
          (R = a[X]), (M |= (R & 31) << c), (c += 5);
        } while (R & 32);
        let W = M & 1;
        return (M >>>= 1), W && (M = -2147483648 | -M), (A[U] += M), S;
      }
      function L(w, S, A) {
        return S >= A ? !1 : w.charCodeAt(S) !== 44;
      }
      function p(w) {
        w.sort(h);
      }
      function h(w, S) {
        return w[0] - S[0];
      }
      function T(w) {
        let S = new Int32Array(5),
          A = 1024 * 16,
          U = A - 36,
          M = new Uint8Array(A),
          c = M.subarray(0, U),
          R = 0,
          W = '';
        for (let X = 0; X < w.length; X++) {
          let ie = w[X];
          if (
            (X > 0 && (R === A && ((W += u.decode(M)), (R = 0)), (M[R++] = 59)),
            ie.length !== 0)
          ) {
            S[0] = 0;
            for (let pe = 0; pe < ie.length; pe++) {
              let ae = ie[pe];
              R > U && ((W += u.decode(c)), M.copyWithin(0, U, R), (R -= U)),
                pe > 0 && (M[R++] = 44),
                (R = x(M, R, S, ae, 0)),
                ae.length !== 1 &&
                  ((R = x(M, R, S, ae, 1)),
                  (R = x(M, R, S, ae, 2)),
                  (R = x(M, R, S, ae, 3)),
                  ae.length !== 4 && (R = x(M, R, S, ae, 4)));
            }
          }
        }
        return W + u.decode(M.subarray(0, R));
      }
      function x(w, S, A, U, M) {
        let c = U[M],
          R = c - A[M];
        (A[M] = c), (R = R < 0 ? (-R << 1) | 1 : R << 1);
        do {
          let W = R & 31;
          (R >>>= 5), R > 0 && (W |= 32), (w[S++] = r[W]);
        } while (R > 0);
        return S;
      }
      (e.decode = d),
        (e.encode = T),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var D1 = Z(($a, qa) => {
    (function (e, t) {
      typeof $a == 'object' && typeof qa < 'u'
        ? (qa.exports = t())
        : typeof define == 'function' && define.amd
        ? define(t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          (e.resolveURI = t()));
    })($a, function () {
      'use strict';
      let e = /^[\w+.-]+:\/\//,
        t =
          /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/,
        s = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
      var i;
      (function (A) {
        (A[(A.Empty = 1)] = 'Empty'),
          (A[(A.Hash = 2)] = 'Hash'),
          (A[(A.Query = 3)] = 'Query'),
          (A[(A.RelativePath = 4)] = 'RelativePath'),
          (A[(A.AbsolutePath = 5)] = 'AbsolutePath'),
          (A[(A.SchemeRelative = 6)] = 'SchemeRelative'),
          (A[(A.Absolute = 7)] = 'Absolute');
      })(i || (i = {}));
      function r(A) {
        return e.test(A);
      }
      function a(A) {
        return A.startsWith('//');
      }
      function u(A) {
        return A.startsWith('/');
      }
      function d(A) {
        return A.startsWith('file:');
      }
      function y(A) {
        return /^[.?#]/.test(A);
      }
      function g(A) {
        let U = t.exec(A);
        return p(
          U[1],
          U[2] || '',
          U[3],
          U[4] || '',
          U[5] || '/',
          U[6] || '',
          U[7] || ''
        );
      }
      function L(A) {
        let U = s.exec(A),
          M = U[2];
        return p(
          'file:',
          '',
          U[1] || '',
          '',
          u(M) ? M : '/' + M,
          U[3] || '',
          U[4] || ''
        );
      }
      function p(A, U, M, c, R, W, X) {
        return {
          scheme: A,
          user: U,
          host: M,
          port: c,
          path: R,
          query: W,
          hash: X,
          type: i.Absolute,
        };
      }
      function h(A) {
        if (a(A)) {
          let M = g('http:' + A);
          return (M.scheme = ''), (M.type = i.SchemeRelative), M;
        }
        if (u(A)) {
          let M = g('http://foo.com' + A);
          return (M.scheme = ''), (M.host = ''), (M.type = i.AbsolutePath), M;
        }
        if (d(A)) return L(A);
        if (r(A)) return g(A);
        let U = g('http://foo.com/' + A);
        return (
          (U.scheme = ''),
          (U.host = ''),
          (U.type = A
            ? A.startsWith('?')
              ? i.Query
              : A.startsWith('#')
              ? i.Hash
              : i.RelativePath
            : i.Empty),
          U
        );
      }
      function T(A) {
        if (A.endsWith('/..')) return A;
        let U = A.lastIndexOf('/');
        return A.slice(0, U + 1);
      }
      function x(A, U) {
        w(U, U.type),
          A.path === '/' ? (A.path = U.path) : (A.path = T(U.path) + A.path);
      }
      function w(A, U) {
        let M = U <= i.RelativePath,
          c = A.path.split('/'),
          R = 1,
          W = 0,
          X = !1;
        for (let pe = 1; pe < c.length; pe++) {
          let ae = c[pe];
          if (!ae) {
            X = !0;
            continue;
          }
          if (((X = !1), ae !== '.')) {
            if (ae === '..') {
              W ? ((X = !0), W--, R--) : M && (c[R++] = ae);
              continue;
            }
            (c[R++] = ae), W++;
          }
        }
        let ie = '';
        for (let pe = 1; pe < R; pe++) ie += '/' + c[pe];
        (!ie || (X && !ie.endsWith('/..'))) && (ie += '/'), (A.path = ie);
      }
      function S(A, U) {
        if (!A && !U) return '';
        let M = h(A),
          c = M.type;
        if (U && c !== i.Absolute) {
          let W = h(U),
            X = W.type;
          switch (c) {
            case i.Empty:
              M.hash = W.hash;
            case i.Hash:
              M.query = W.query;
            case i.Query:
            case i.RelativePath:
              x(M, W);
            case i.AbsolutePath:
              (M.user = W.user), (M.host = W.host), (M.port = W.port);
            case i.SchemeRelative:
              M.scheme = W.scheme;
          }
          X > c && (c = X);
        }
        w(M, c);
        let R = M.query + M.hash;
        switch (c) {
          case i.Hash:
          case i.Query:
            return R;
          case i.RelativePath: {
            let W = M.path.slice(1);
            return W ? (y(U || A) && !y(W) ? './' + W + R : W + R) : R || '.';
          }
          case i.AbsolutePath:
            return M.path + R;
          default:
            return M.scheme + '//' + M.user + M.host + M.port + M.path + R;
        }
      }
      return S;
    });
  });
  var F1 = Z((no, M1) => {
    (function (e, t) {
      typeof no == 'object' && typeof M1 < 'u'
        ? t(no, ja(), D1())
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
    })(no, function (e, t, s) {
      'use strict';
      function i(V) {
        return V && typeof V == 'object' && 'default' in V ? V : {default: V};
      }
      var r = i(s);
      function a(V, G) {
        return G && !G.endsWith('/') && (G += '/'), r.default(V, G);
      }
      function u(V) {
        if (!V) return '';
        let G = V.lastIndexOf('/');
        return V.slice(0, G + 1);
      }
      let d = 0,
        y = 1,
        g = 2,
        L = 3,
        p = 4,
        h = 1,
        T = 2;
      function x(V, G) {
        let J = w(V, 0);
        if (J === V.length) return V;
        G || (V = V.slice());
        for (let re = J; re < V.length; re = w(V, re + 1)) V[re] = A(V[re], G);
        return V;
      }
      function w(V, G) {
        for (let J = G; J < V.length; J++) if (!S(V[J])) return J;
        return V.length;
      }
      function S(V) {
        for (let G = 1; G < V.length; G++) if (V[G][d] < V[G - 1][d]) return !1;
        return !0;
      }
      function A(V, G) {
        return G || (V = V.slice()), V.sort(U);
      }
      function U(V, G) {
        return V[d] - G[d];
      }
      let M = !1;
      function c(V, G, J, re) {
        for (; J <= re; ) {
          let ve = J + ((re - J) >> 1),
            he = V[ve][d] - G;
          if (he === 0) return (M = !0), ve;
          he < 0 ? (J = ve + 1) : (re = ve - 1);
        }
        return (M = !1), J - 1;
      }
      function R(V, G, J) {
        for (let re = J + 1; re < V.length && V[re][d] === G; J = re++);
        return J;
      }
      function W(V, G, J) {
        for (let re = J - 1; re >= 0 && V[re][d] === G; J = re--);
        return J;
      }
      function X() {
        return {lastKey: -1, lastNeedle: -1, lastIndex: -1};
      }
      function ie(V, G, J, re) {
        let {lastKey: ve, lastNeedle: he, lastIndex: Ie} = J,
          Ee = 0,
          Le = V.length - 1;
        if (re === ve) {
          if (G === he) return (M = Ie !== -1 && V[Ie][d] === G), Ie;
          G >= he ? (Ee = Ie === -1 ? 0 : Ie) : (Le = Ie);
        }
        return (
          (J.lastKey = re), (J.lastNeedle = G), (J.lastIndex = c(V, G, Ee, Le))
        );
      }
      function pe(V, G) {
        let J = G.map(He);
        for (let re = 0; re < V.length; re++) {
          let ve = V[re];
          for (let he = 0; he < ve.length; he++) {
            let Ie = ve[he];
            if (Ie.length === 1) continue;
            let Ee = Ie[y],
              Le = Ie[g],
              Xe = Ie[L],
              We = J[Ee],
              Ke = We[Le] || (We[Le] = []),
              ut = G[Ee],
              pt = R(Ke, Xe, ie(Ke, Xe, ut, Le));
            ae(Ke, (ut.lastIndex = pt + 1), [Xe, re, Ie[d]]);
          }
        }
        return J;
      }
      function ae(V, G, J) {
        for (let re = V.length; re > G; re--) V[re] = V[re - 1];
        V[G] = J;
      }
      function He() {
        return {__proto__: null};
      }
      let qe = function (V, G) {
        let J = typeof V == 'string' ? JSON.parse(V) : V;
        if (!('sections' in J)) return new wt(J, G);
        let re = [],
          ve = [],
          he = [],
          Ie = [];
        Bt(J, G, re, ve, he, Ie, 0, 0, 1 / 0, 1 / 0);
        let Ee = {
          version: 3,
          file: J.file,
          names: Ie,
          sources: ve,
          sourcesContent: he,
          mappings: re,
        };
        return e.presortedDecodedMap(Ee);
      };
      function Bt(V, G, J, re, ve, he, Ie, Ee, Le, Xe) {
        let {sections: We} = V;
        for (let Ke = 0; Ke < We.length; Ke++) {
          let {map: ut, offset: pt} = We[Ke],
            bt = Le,
            yt = Xe;
          if (Ke + 1 < We.length) {
            let vt = We[Ke + 1].offset;
            (bt = Math.min(Le, Ie + vt.line)),
              bt === Le
                ? (yt = Math.min(Xe, Ee + vt.column))
                : bt < Le && (yt = Ee + vt.column);
          }
          mt(ut, G, J, re, ve, he, Ie + pt.line, Ee + pt.column, bt, yt);
        }
      }
      function mt(V, G, J, re, ve, he, Ie, Ee, Le, Xe) {
        if ('sections' in V) return Bt(...arguments);
        let We = new wt(V, G),
          Ke = re.length,
          ut = he.length,
          pt = e.decodedMappings(We),
          {resolvedSources: bt, sourcesContent: yt} = We;
        if ((kt(re, bt), kt(he, We.names), yt)) kt(ve, yt);
        else for (let vt = 0; vt < bt.length; vt++) ve.push(null);
        for (let vt = 0; vt < pt.length; vt++) {
          let bn = Ie + vt;
          if (bn > Le) return;
          let Dn = At(J, bn),
            Ge = vt === 0 ? Ee : 0,
            St = pt[vt];
          for (let ot = 0; ot < St.length; ot++) {
            let zt = St[ot],
              Xt = Ge + zt[d];
            if (bn === Le && Xt >= Xe) return;
            if (zt.length === 1) {
              Dn.push([Xt]);
              continue;
            }
            let te = Ke + zt[y],
              Cn = zt[g],
              Zn = zt[L];
            Dn.push(
              zt.length === 4 ? [Xt, te, Cn, Zn] : [Xt, te, Cn, Zn, ut + zt[p]]
            );
          }
        }
      }
      function kt(V, G) {
        for (let J = 0; J < G.length; J++) V.push(G[J]);
      }
      function At(V, G) {
        for (let J = V.length; J <= G; J++) V[J] = [];
        return V[G];
      }
      let tt = '`line` must be greater than 0 (lines start at line 1)',
        nt =
          '`column` must be greater than or equal to 0 (columns start at column 0)',
        _t = -1,
        ct = 1;
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
      class wt {
        constructor(G, J) {
          let re = typeof G == 'string';
          if (!re && G._decodedMemo) return G;
          let ve = re ? JSON.parse(G) : G,
            {
              version: he,
              file: Ie,
              names: Ee,
              sourceRoot: Le,
              sources: Xe,
              sourcesContent: We,
            } = ve;
          (this.version = he),
            (this.file = Ie),
            (this.names = Ee),
            (this.sourceRoot = Le),
            (this.sources = Xe),
            (this.sourcesContent = We);
          let Ke = a(Le || '', u(J));
          this.resolvedSources = Xe.map((pt) => a(pt || '', Ke));
          let {mappings: ut} = ve;
          typeof ut == 'string'
            ? ((this._encoded = ut), (this._decoded = void 0))
            : ((this._encoded = void 0), (this._decoded = x(ut, re))),
            (this._decodedMemo = X()),
            (this._bySources = void 0),
            (this._bySourceMemos = void 0);
        }
      }
      (e.encodedMappings = (V) => {
        var G;
        return (G = V._encoded) !== null && G !== void 0
          ? G
          : (V._encoded = t.encode(V._decoded));
      }),
        (e.decodedMappings = (V) =>
          V._decoded || (V._decoded = t.decode(V._encoded))),
        (e.traceSegment = (V, G, J) => {
          let re = e.decodedMappings(V);
          return G >= re.length ? null : Tn(re[G], V._decodedMemo, G, J, ct);
        }),
        (e.originalPositionFor = (V, {line: G, column: J, bias: re}) => {
          if ((G--, G < 0)) throw new Error(tt);
          if (J < 0) throw new Error(nt);
          let ve = e.decodedMappings(V);
          if (G >= ve.length) return Pt(null, null, null, null);
          let he = Tn(ve[G], V._decodedMemo, G, J, re || ct);
          if (he == null || he.length == 1) return Pt(null, null, null, null);
          let {names: Ie, resolvedSources: Ee} = V;
          return Pt(
            Ee[he[y]],
            he[g] + 1,
            he[L],
            he.length === 5 ? Ie[he[p]] : null
          );
        }),
        (e.generatedPositionFor = (
          V,
          {source: G, line: J, column: re, bias: ve}
        ) => {
          if ((J--, J < 0)) throw new Error(tt);
          if (re < 0) throw new Error(nt);
          let {sources: he, resolvedSources: Ie} = V,
            Ee = he.indexOf(G);
          if ((Ee === -1 && (Ee = Ie.indexOf(G)), Ee === -1))
            return qt(null, null);
          let Le =
              V._bySources ||
              (V._bySources = pe(
                e.decodedMappings(V),
                (V._bySourceMemos = he.map(X))
              )),
            Xe = V._bySourceMemos,
            We = Le[Ee][J];
          if (We == null) return qt(null, null);
          let Ke = Tn(We, Xe[Ee], J, re, ve || ct);
          return Ke == null ? qt(null, null) : qt(Ke[h] + 1, Ke[T]);
        }),
        (e.eachMapping = (V, G) => {
          let J = e.decodedMappings(V),
            {names: re, resolvedSources: ve} = V;
          for (let he = 0; he < J.length; he++) {
            let Ie = J[he];
            for (let Ee = 0; Ee < Ie.length; Ee++) {
              let Le = Ie[Ee],
                Xe = he + 1,
                We = Le[0],
                Ke = null,
                ut = null,
                pt = null,
                bt = null;
              Le.length !== 1 &&
                ((Ke = ve[Le[1]]), (ut = Le[2] + 1), (pt = Le[3])),
                Le.length === 5 && (bt = re[Le[4]]),
                G({
                  generatedLine: Xe,
                  generatedColumn: We,
                  source: Ke,
                  originalLine: ut,
                  originalColumn: pt,
                  name: bt,
                });
            }
          }
        }),
        (e.sourceContentFor = (V, G) => {
          let {sources: J, resolvedSources: re, sourcesContent: ve} = V;
          if (ve == null) return null;
          let he = J.indexOf(G);
          return he === -1 && (he = re.indexOf(G)), he === -1 ? null : ve[he];
        }),
        (e.presortedDecodedMap = (V, G) => {
          let J = new wt($t(V, []), G);
          return (J._decoded = V.mappings), J;
        }),
        (e.decodedMap = (V) => $t(V, e.decodedMappings(V))),
        (e.encodedMap = (V) => $t(V, e.encodedMappings(V)));
      function $t(V, G) {
        return {
          version: V.version,
          file: V.file,
          names: V.names,
          sourceRoot: V.sourceRoot,
          sources: V.sources,
          sourcesContent: V.sourcesContent,
          mappings: G,
        };
      }
      function Pt(V, G, J, re) {
        return {source: V, line: G, column: J, name: re};
      }
      function qt(V, G) {
        return {line: V, column: G};
      }
      function Tn(V, G, J, re, ve) {
        let he = ie(V, re, G, J);
        return (
          M ? (he = (ve === _t ? R : W)(V, re, he)) : ve === _t && he++,
          he === -1 || he === V.length ? null : V[he]
        );
      }
      (e.AnyMap = qe),
        (e.GREATEST_LOWER_BOUND = ct),
        (e.LEAST_UPPER_BOUND = _t),
        (e.TraceMap = wt),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var V1 = Z((so, B1) => {
    (function (e, t) {
      typeof so == 'object' && typeof B1 < 'u'
        ? t(so, L1(), ja(), F1())
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
    })(so, function (e, t, s, i) {
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
      let L;
      class p {
        constructor({file: R, sourceRoot: W} = {}) {
          (this._names = new t.SetArray()),
            (this._sources = new t.SetArray()),
            (this._sourcesContent = []),
            (this._mappings = []),
            (this.file = R),
            (this.sourceRoot = W);
        }
      }
      (e.addSegment = (c, R, W, X, ie, pe, ae, He) =>
        L(!1, c, R, W, X, ie, pe, ae, He)),
        (e.maybeAddSegment = (c, R, W, X, ie, pe, ae, He) =>
          L(!0, c, R, W, X, ie, pe, ae, He)),
        (e.addMapping = (c, R) => M(!1, c, R)),
        (e.maybeAddMapping = (c, R) => M(!0, c, R)),
        (e.setSourceContent = (c, R, W) => {
          let {_sources: X, _sourcesContent: ie} = c;
          ie[t.put(X, R)] = W;
        }),
        (e.toDecodedMap = (c) => {
          let {
            file: R,
            sourceRoot: W,
            _mappings: X,
            _sources: ie,
            _sourcesContent: pe,
            _names: ae,
          } = c;
          return (
            w(X),
            {
              version: 3,
              file: R || void 0,
              names: ae.array,
              sourceRoot: W || void 0,
              sources: ie.array,
              sourcesContent: pe,
              mappings: X,
            }
          );
        }),
        (e.toEncodedMap = (c) => {
          let R = e.toDecodedMap(c);
          return Object.assign(Object.assign({}, R), {
            mappings: s.encode(R.mappings),
          });
        }),
        (e.allMappings = (c) => {
          let R = [],
            {_mappings: W, _sources: X, _names: ie} = c;
          for (let pe = 0; pe < W.length; pe++) {
            let ae = W[pe];
            for (let He = 0; He < ae.length; He++) {
              let qe = ae[He],
                Bt = {line: pe + 1, column: qe[0]},
                mt,
                kt,
                At;
              qe.length !== 1 &&
                ((mt = X.array[qe[1]]),
                (kt = {line: qe[2] + 1, column: qe[3]}),
                qe.length === 5 && (At = ie.array[qe[4]])),
                R.push({generated: Bt, source: mt, original: kt, name: At});
            }
          }
          return R;
        }),
        (e.fromMap = (c) => {
          let R = new i.TraceMap(c),
            W = new p({file: R.file, sourceRoot: R.sourceRoot});
          return (
            S(W._names, R.names),
            S(W._sources, R.sources),
            (W._sourcesContent = R.sourcesContent || R.sources.map(() => null)),
            (W._mappings = i.decodedMappings(R)),
            W
          );
        }),
        (L = (c, R, W, X, ie, pe, ae, He, qe) => {
          let {
              _mappings: Bt,
              _sources: mt,
              _sourcesContent: kt,
              _names: At,
            } = R,
            tt = h(Bt, W),
            nt = T(tt, X);
          if (!ie) return c && A(tt, nt) ? void 0 : x(tt, nt, [X]);
          let _t = t.put(mt, ie),
            ct = He ? t.put(At, He) : -1;
          if (
            (_t === kt.length && (kt[_t] = qe ?? null),
            !(c && U(tt, nt, _t, pe, ae, ct)))
          )
            return x(tt, nt, He ? [X, _t, pe, ae, ct] : [X, _t, pe, ae]);
        });
      function h(c, R) {
        for (let W = c.length; W <= R; W++) c[W] = [];
        return c[R];
      }
      function T(c, R) {
        let W = c.length;
        for (let X = W - 1; X >= 0; W = X--) {
          let ie = c[X];
          if (R >= ie[0]) break;
        }
        return W;
      }
      function x(c, R, W) {
        for (let X = c.length; X > R; X--) c[X] = c[X - 1];
        c[R] = W;
      }
      function w(c) {
        let {length: R} = c,
          W = R;
        for (let X = W - 1; X >= 0 && !(c[X].length > 0); W = X, X--);
        W < R && (c.length = W);
      }
      function S(c, R) {
        for (let W = 0; W < R.length; W++) t.put(c, R[W]);
      }
      function A(c, R) {
        return R === 0 ? !0 : c[R - 1].length === 1;
      }
      function U(c, R, W, X, ie, pe) {
        if (R === 0) return !1;
        let ae = c[R - 1];
        return ae.length === 1
          ? !1
          : W === ae[1] &&
              X === ae[2] &&
              ie === ae[3] &&
              pe === (ae.length === 5 ? ae[4] : -1);
      }
      function M(c, R, W) {
        let {generated: X, source: ie, original: pe, name: ae, content: He} = W;
        if (!ie)
          return L(c, R, X.line - 1, X.column, null, null, null, null, null);
        let qe = ie;
        return L(
          c,
          R,
          X.line - 1,
          X.column,
          qe,
          pe.line - 1,
          pe.column,
          ae,
          He
        );
      }
      (e.GenMapping = p), Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var $1 = Z((Ka) => {
    'use strict';
    Object.defineProperty(Ka, '__esModule', {value: !0});
    var Gi = V1(),
      j1 = Qt();
    function hy({code: e, mappings: t}, s, i, r, a) {
      let u = fy(r, a),
        d = new Gi.GenMapping({file: i.compiledFilename}),
        y = 0,
        g = t[0];
      for (; g === void 0 && y < t.length - 1; ) y++, (g = t[y]);
      let L = 0,
        p = 0;
      g !== p && Gi.maybeAddSegment.call(void 0, d, L, 0, s, L, 0);
      for (let w = 0; w < e.length; w++) {
        if (w === g) {
          let S = g - p,
            A = u[y];
          for (
            Gi.maybeAddSegment.call(void 0, d, L, S, s, L, A);
            (g === w || g === void 0) && y < t.length - 1;

          )
            y++, (g = t[y]);
        }
        e.charCodeAt(w) === j1.charCodes.lineFeed &&
          (L++,
          (p = w + 1),
          g !== p && Gi.maybeAddSegment.call(void 0, d, L, 0, s, L, 0));
      }
      let {
        sourceRoot: h,
        sourcesContent: T,
        ...x
      } = Gi.toEncodedMap.call(void 0, d);
      return x;
    }
    Ka.default = hy;
    function fy(e, t) {
      let s = new Array(t.length),
        i = 0,
        r = t[i].start,
        a = 0;
      for (let u = 0; u < e.length; u++)
        u === r && ((s[i] = r - a), i++, (r = t[i].start)),
          e.charCodeAt(u) === j1.charCodes.lineFeed && (a = u + 1);
      return s;
    }
  });
  var q1 = Z((Ha) => {
    'use strict';
    Object.defineProperty(Ha, '__esModule', {value: !0});
    var dy = {
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
      Ua = class e {
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
          let s = this.helperNames[t];
          return (
            s ||
            ((s = this.nameManager.claimFreeName(`_${t}`)),
            (this.helperNames[t] = s),
            s)
          );
        }
        emitHelpers() {
          let t = '';
          this.helperNames.optionalChainDelete &&
            this.getHelperName('optionalChain'),
            this.helperNames.asyncOptionalChainDelete &&
              this.getHelperName('asyncOptionalChain');
          for (let [s, i] of Object.entries(dy)) {
            let r = this.helperNames[s],
              a = i;
            s === 'optionalChainDelete'
              ? (a = a.replace(
                  'OPTIONAL_CHAIN_NAME',
                  this.helperNames.optionalChain
                ))
              : s === 'asyncOptionalChainDelete'
              ? (a = a.replace(
                  'ASYNC_OPTIONAL_CHAIN_NAME',
                  this.helperNames.asyncOptionalChain
                ))
              : s === 'require' &&
                (this.createRequireName === null &&
                  (this.createRequireName =
                    this.nameManager.claimFreeName('_createRequire')),
                (a = a.replace(
                  /CREATE_REQUIRE_NAME/g,
                  this.createRequireName
                ))),
              r &&
                ((t += ' '),
                (t += a.replace(s, r).replace(/\s+/g, ' ').trim()));
          }
          return t;
        }
      };
    Ha.HelperManager = Ua;
  });
  var H1 = Z((ro) => {
    'use strict';
    Object.defineProperty(ro, '__esModule', {value: !0});
    var Wa = xt(),
      io = be();
    function my(e, t, s) {
      U1(e, s) && yy(e, t, s);
    }
    ro.default = my;
    function U1(e, t) {
      for (let s of e.tokens)
        if (
          s.type === io.TokenType.name &&
          Wa.isNonTopLevelDeclaration.call(void 0, s) &&
          t.has(e.identifierNameForToken(s))
        )
          return !0;
      return !1;
    }
    ro.hasShadowedGlobals = U1;
    function yy(e, t, s) {
      let i = [],
        r = t.length - 1;
      for (let a = e.tokens.length - 1; ; a--) {
        for (; i.length > 0 && i[i.length - 1].startTokenIndex === a + 1; )
          i.pop();
        for (; r >= 0 && t[r].endTokenIndex === a + 1; ) i.push(t[r]), r--;
        if (a < 0) break;
        let u = e.tokens[a],
          d = e.identifierNameForToken(u);
        if (i.length > 1 && u.type === io.TokenType.name && s.has(d)) {
          if (Wa.isBlockScopedDeclaration.call(void 0, u))
            K1(i[i.length - 1], e, d);
          else if (Wa.isFunctionScopedDeclaration.call(void 0, u)) {
            let y = i.length - 1;
            for (; y > 0 && !i[y].isFunctionScope; ) y--;
            if (y < 0) throw new Error('Did not find parent function scope.');
            K1(i[y], e, d);
          }
        }
      }
      if (i.length > 0)
        throw new Error('Expected empty scope stack after processing file.');
    }
    function K1(e, t, s) {
      for (let i = e.startTokenIndex; i < e.endTokenIndex; i++) {
        let r = t.tokens[i];
        (r.type === io.TokenType.name || r.type === io.TokenType.jsxName) &&
          t.identifierNameForToken(r) === s &&
          (r.shadowsGlobal = !0);
      }
    }
  });
  var W1 = Z((Ga) => {
    'use strict';
    Object.defineProperty(Ga, '__esModule', {value: !0});
    var Ty = be();
    function ky(e, t) {
      let s = [];
      for (let i of t)
        i.type === Ty.TokenType.name && s.push(e.slice(i.start, i.end));
      return s;
    }
    Ga.default = ky;
  });
  var G1 = Z((Xa) => {
    'use strict';
    Object.defineProperty(Xa, '__esModule', {value: !0});
    function vy(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var xy = W1(),
      gy = vy(xy),
      za = class e {
        __init() {
          this.usedNames = new Set();
        }
        constructor(t, s) {
          e.prototype.__init.call(this),
            (this.usedNames = new Set(gy.default.call(void 0, t, s)));
        }
        claimFreeName(t) {
          let s = this.findFreeName(t);
          return this.usedNames.add(s), s;
        }
        findFreeName(t) {
          if (!this.usedNames.has(t)) return t;
          let s = 2;
          for (; this.usedNames.has(t + String(s)); ) s++;
          return t + String(s);
        }
      };
    Xa.default = za;
  });
  var oo = Z((Pn) => {
    'use strict';
    var _y =
      (Pn && Pn.__extends) ||
      (function () {
        var e = function (t, s) {
          return (
            (e =
              Object.setPrototypeOf ||
              ({__proto__: []} instanceof Array &&
                function (i, r) {
                  i.__proto__ = r;
                }) ||
              function (i, r) {
                for (var a in r) r.hasOwnProperty(a) && (i[a] = r[a]);
              }),
            e(t, s)
          );
        };
        return function (t, s) {
          e(t, s);
          function i() {
            this.constructor = t;
          }
          t.prototype =
            s === null
              ? Object.create(s)
              : ((i.prototype = s.prototype), new i());
        };
      })();
    Object.defineProperty(Pn, '__esModule', {value: !0});
    Pn.DetailContext = Pn.NoopContext = Pn.VError = void 0;
    var z1 = (function (e) {
      _y(t, e);
      function t(s, i) {
        var r = e.call(this, i) || this;
        return (r.path = s), Object.setPrototypeOf(r, t.prototype), r;
      }
      return t;
    })(Error);
    Pn.VError = z1;
    var by = (function () {
      function e() {}
      return (
        (e.prototype.fail = function (t, s, i) {
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
    Pn.NoopContext = by;
    var X1 = (function () {
      function e() {
        (this._propNames = ['']), (this._messages = [null]), (this._score = 0);
      }
      return (
        (e.prototype.fail = function (t, s, i) {
          return (
            this._propNames.push(t),
            this._messages.push(s),
            (this._score += i),
            !1
          );
        }),
        (e.prototype.unionResolver = function () {
          return new Cy();
        }),
        (e.prototype.resolveUnion = function (t) {
          for (
            var s, i, r = t, a = null, u = 0, d = r.contexts;
            u < d.length;
            u++
          ) {
            var y = d[u];
            (!a || y._score >= a._score) && (a = y);
          }
          a &&
            a._score > 0 &&
            ((s = this._propNames).push.apply(s, a._propNames),
            (i = this._messages).push.apply(i, a._messages));
        }),
        (e.prototype.getError = function (t) {
          for (var s = [], i = this._propNames.length - 1; i >= 0; i--) {
            var r = this._propNames[i];
            t += typeof r == 'number' ? '[' + r + ']' : r ? '.' + r : '';
            var a = this._messages[i];
            a && s.push(t + ' ' + a);
          }
          return new z1(t, s.join('; '));
        }),
        (e.prototype.getErrorDetail = function (t) {
          for (var s = [], i = this._propNames.length - 1; i >= 0; i--) {
            var r = this._propNames[i];
            t += typeof r == 'number' ? '[' + r + ']' : r ? '.' + r : '';
            var a = this._messages[i];
            a && s.push({path: t, message: a});
          }
          for (var u = null, i = s.length - 1; i >= 0; i--)
            u && (s[i].nested = [u]), (u = s[i]);
          return u;
        }),
        e
      );
    })();
    Pn.DetailContext = X1;
    var Cy = (function () {
      function e() {
        this.contexts = [];
      }
      return (
        (e.prototype.createContext = function () {
          var t = new X1();
          return this.contexts.push(t), t;
        }),
        e
      );
    })();
  });
  var sl = Z((ce) => {
    'use strict';
    var nn =
      (ce && ce.__extends) ||
      (function () {
        var e = function (t, s) {
          return (
            (e =
              Object.setPrototypeOf ||
              ({__proto__: []} instanceof Array &&
                function (i, r) {
                  i.__proto__ = r;
                }) ||
              function (i, r) {
                for (var a in r) r.hasOwnProperty(a) && (i[a] = r[a]);
              }),
            e(t, s)
          );
        };
        return function (t, s) {
          e(t, s);
          function i() {
            this.constructor = t;
          }
          t.prototype =
            s === null
              ? Object.create(s)
              : ((i.prototype = s.prototype), new i());
        };
      })();
    Object.defineProperty(ce, '__esModule', {value: !0});
    ce.basicTypes =
      ce.BasicType =
      ce.TParamList =
      ce.TParam =
      ce.param =
      ce.TFunc =
      ce.func =
      ce.TProp =
      ce.TOptional =
      ce.opt =
      ce.TIface =
      ce.iface =
      ce.TEnumLiteral =
      ce.enumlit =
      ce.TEnumType =
      ce.enumtype =
      ce.TIntersection =
      ce.intersection =
      ce.TUnion =
      ce.union =
      ce.TTuple =
      ce.tuple =
      ce.TArray =
      ce.array =
      ce.TLiteral =
      ce.lit =
      ce.TName =
      ce.name =
      ce.TType =
        void 0;
    var Q1 = oo(),
      Ht = (function () {
        function e() {}
        return e;
      })();
    ce.TType = Ht;
    function ps(e) {
      return typeof e == 'string' ? Z1(e) : e;
    }
    function Qa(e, t) {
      var s = e[t];
      if (!s) throw new Error('Unknown type ' + t);
      return s;
    }
    function Z1(e) {
      return new Za(e);
    }
    ce.name = Z1;
    var Za = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.name = s), (i._failMsg = 'is not a ' + s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i, r) {
          var a = this,
            u = Qa(s, this.name),
            d = u.getChecker(s, i, r);
          return u instanceof Dt || u instanceof t
            ? d
            : function (y, g) {
                return d(y, g) ? !0 : g.fail(null, a._failMsg, 0);
              };
        }),
        t
      );
    })(Ht);
    ce.TName = Za;
    function wy(e) {
      return new el(e);
    }
    ce.lit = wy;
    var el = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (
          (i.value = s),
          (i.name = JSON.stringify(s)),
          (i._failMsg = 'is not ' + i.name),
          i
        );
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this;
          return function (a, u) {
            return a === r.value ? !0 : u.fail(null, r._failMsg, -1);
          };
        }),
        t
      );
    })(Ht);
    ce.TLiteral = el;
    function Sy(e) {
      return new ep(ps(e));
    }
    ce.array = Sy;
    var ep = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.ttype = s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this.ttype.getChecker(s, i);
          return function (a, u) {
            if (!Array.isArray(a)) return u.fail(null, 'is not an array', 0);
            for (var d = 0; d < a.length; d++) {
              var y = r(a[d], u);
              if (!y) return u.fail(d, null, 1);
            }
            return !0;
          };
        }),
        t
      );
    })(Ht);
    ce.TArray = ep;
    function Iy() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new tp(
        e.map(function (s) {
          return ps(s);
        })
      );
    }
    ce.tuple = Iy;
    var tp = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.ttypes = s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this.ttypes.map(function (u) {
              return u.getChecker(s, i);
            }),
            a = function (u, d) {
              if (!Array.isArray(u)) return d.fail(null, 'is not an array', 0);
              for (var y = 0; y < r.length; y++) {
                var g = r[y](u[y], d);
                if (!g) return d.fail(y, null, 1);
              }
              return !0;
            };
          return i
            ? function (u, d) {
                return a(u, d)
                  ? u.length <= r.length
                    ? !0
                    : d.fail(r.length, 'is extraneous', 2)
                  : !1;
              }
            : a;
        }),
        t
      );
    })(Ht);
    ce.TTuple = tp;
    function Ey() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new np(
        e.map(function (s) {
          return ps(s);
        })
      );
    }
    ce.union = Ey;
    var np = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        i.ttypes = s;
        var r = s
            .map(function (u) {
              return u instanceof Za || u instanceof el ? u.name : null;
            })
            .filter(function (u) {
              return u;
            }),
          a = s.length - r.length;
        return (
          r.length
            ? (a > 0 && r.push(a + ' more'),
              (i._failMsg = 'is none of ' + r.join(', ')))
            : (i._failMsg = 'is none of ' + a + ' types'),
          i
        );
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this,
            a = this.ttypes.map(function (u) {
              return u.getChecker(s, i);
            });
          return function (u, d) {
            for (var y = d.unionResolver(), g = 0; g < a.length; g++) {
              var L = a[g](u, y.createContext());
              if (L) return !0;
            }
            return d.resolveUnion(y), d.fail(null, r._failMsg, 0);
          };
        }),
        t
      );
    })(Ht);
    ce.TUnion = np;
    function Ay() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new sp(
        e.map(function (s) {
          return ps(s);
        })
      );
    }
    ce.intersection = Ay;
    var sp = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.ttypes = s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = new Set(),
            a = this.ttypes.map(function (u) {
              return u.getChecker(s, i, r);
            });
          return function (u, d) {
            var y = a.every(function (g) {
              return g(u, d);
            });
            return y ? !0 : d.fail(null, null, 0);
          };
        }),
        t
      );
    })(Ht);
    ce.TIntersection = sp;
    function Py(e) {
      return new tl(e);
    }
    ce.enumtype = Py;
    var tl = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (
          (i.members = s),
          (i.validValues = new Set()),
          (i._failMsg = 'is not a valid enum value'),
          (i.validValues = new Set(
            Object.keys(s).map(function (r) {
              return s[r];
            })
          )),
          i
        );
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this;
          return function (a, u) {
            return r.validValues.has(a) ? !0 : u.fail(null, r._failMsg, 0);
          };
        }),
        t
      );
    })(Ht);
    ce.TEnumType = tl;
    function Ny(e, t) {
      return new ip(e, t);
    }
    ce.enumlit = Ny;
    var ip = (function (e) {
      nn(t, e);
      function t(s, i) {
        var r = e.call(this) || this;
        return (
          (r.enumName = s),
          (r.prop = i),
          (r._failMsg = 'is not ' + s + '.' + i),
          r
        );
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this,
            a = Qa(s, this.enumName);
          if (!(a instanceof tl))
            throw new Error(
              'Type ' + this.enumName + ' used in enumlit is not an enum type'
            );
          var u = a.members[this.prop];
          if (!a.members.hasOwnProperty(this.prop))
            throw new Error(
              'Unknown value ' +
                this.enumName +
                '.' +
                this.prop +
                ' used in enumlit'
            );
          return function (d, y) {
            return d === u ? !0 : y.fail(null, r._failMsg, -1);
          };
        }),
        t
      );
    })(Ht);
    ce.TEnumLiteral = ip;
    function Ry(e) {
      return Object.keys(e).map(function (t) {
        return Ly(t, e[t]);
      });
    }
    function Ly(e, t) {
      return t instanceof nl ? new Ja(e, t.ttype, !0) : new Ja(e, ps(t), !1);
    }
    function Oy(e, t) {
      return new rp(e, Ry(t));
    }
    ce.iface = Oy;
    var rp = (function (e) {
      nn(t, e);
      function t(s, i) {
        var r = e.call(this) || this;
        return (
          (r.bases = s),
          (r.props = i),
          (r.propSet = new Set(
            i.map(function (a) {
              return a.name;
            })
          )),
          r
        );
      }
      return (
        (t.prototype.getChecker = function (s, i, r) {
          var a = this,
            u = this.bases.map(function (h) {
              return Qa(s, h).getChecker(s, i);
            }),
            d = this.props.map(function (h) {
              return h.ttype.getChecker(s, i);
            }),
            y = new Q1.NoopContext(),
            g = this.props.map(function (h, T) {
              return !h.isOpt && !d[T](void 0, y);
            }),
            L = function (h, T) {
              if (typeof h != 'object' || h === null)
                return T.fail(null, 'is not an object', 0);
              for (var x = 0; x < u.length; x++) if (!u[x](h, T)) return !1;
              for (var x = 0; x < d.length; x++) {
                var w = a.props[x].name,
                  S = h[w];
                if (S === void 0) {
                  if (g[x]) return T.fail(w, 'is missing', 1);
                } else {
                  var A = d[x](S, T);
                  if (!A) return T.fail(w, null, 1);
                }
              }
              return !0;
            };
          if (!i) return L;
          var p = this.propSet;
          return (
            r &&
              (this.propSet.forEach(function (h) {
                return r.add(h);
              }),
              (p = r)),
            function (h, T) {
              if (!L(h, T)) return !1;
              for (var x in h)
                if (!p.has(x)) return T.fail(x, 'is extraneous', 2);
              return !0;
            }
          );
        }),
        t
      );
    })(Ht);
    ce.TIface = rp;
    function Dy(e) {
      return new nl(ps(e));
    }
    ce.opt = Dy;
    var nl = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.ttype = s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this.ttype.getChecker(s, i);
          return function (a, u) {
            return a === void 0 || r(a, u);
          };
        }),
        t
      );
    })(Ht);
    ce.TOptional = nl;
    var Ja = (function () {
      function e(t, s, i) {
        (this.name = t), (this.ttype = s), (this.isOpt = i);
      }
      return e;
    })();
    ce.TProp = Ja;
    function My(e) {
      for (var t = [], s = 1; s < arguments.length; s++)
        t[s - 1] = arguments[s];
      return new op(new lp(t), ps(e));
    }
    ce.func = My;
    var op = (function (e) {
      nn(t, e);
      function t(s, i) {
        var r = e.call(this) || this;
        return (r.paramList = s), (r.result = i), r;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          return function (r, a) {
            return typeof r == 'function'
              ? !0
              : a.fail(null, 'is not a function', 0);
          };
        }),
        t
      );
    })(Ht);
    ce.TFunc = op;
    function Fy(e, t, s) {
      return new ap(e, ps(t), !!s);
    }
    ce.param = Fy;
    var ap = (function () {
      function e(t, s, i) {
        (this.name = t), (this.ttype = s), (this.isOpt = i);
      }
      return e;
    })();
    ce.TParam = ap;
    var lp = (function (e) {
      nn(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.params = s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this,
            a = this.params.map(function (g) {
              return g.ttype.getChecker(s, i);
            }),
            u = new Q1.NoopContext(),
            d = this.params.map(function (g, L) {
              return !g.isOpt && !a[L](void 0, u);
            }),
            y = function (g, L) {
              if (!Array.isArray(g)) return L.fail(null, 'is not an array', 0);
              for (var p = 0; p < a.length; p++) {
                var h = r.params[p];
                if (g[p] === void 0) {
                  if (d[p]) return L.fail(h.name, 'is missing', 1);
                } else {
                  var T = a[p](g[p], L);
                  if (!T) return L.fail(h.name, null, 1);
                }
              }
              return !0;
            };
          return i
            ? function (g, L) {
                return y(g, L)
                  ? g.length <= a.length
                    ? !0
                    : L.fail(a.length, 'is extraneous', 2)
                  : !1;
              }
            : y;
        }),
        t
      );
    })(Ht);
    ce.TParamList = lp;
    var Dt = (function (e) {
      nn(t, e);
      function t(s, i) {
        var r = e.call(this) || this;
        return (r.validator = s), (r.message = i), r;
      }
      return (
        (t.prototype.getChecker = function (s, i) {
          var r = this;
          return function (a, u) {
            return r.validator(a) ? !0 : u.fail(null, r.message, 0);
          };
        }),
        t
      );
    })(Ht);
    ce.BasicType = Dt;
    ce.basicTypes = {
      any: new Dt(function (e) {
        return !0;
      }, 'is invalid'),
      number: new Dt(function (e) {
        return typeof e == 'number';
      }, 'is not a number'),
      object: new Dt(function (e) {
        return typeof e == 'object' && e;
      }, 'is not an object'),
      boolean: new Dt(function (e) {
        return typeof e == 'boolean';
      }, 'is not a boolean'),
      string: new Dt(function (e) {
        return typeof e == 'string';
      }, 'is not a string'),
      symbol: new Dt(function (e) {
        return typeof e == 'symbol';
      }, 'is not a symbol'),
      void: new Dt(function (e) {
        return e == null;
      }, 'is not void'),
      undefined: new Dt(function (e) {
        return e === void 0;
      }, 'is not undefined'),
      null: new Dt(function (e) {
        return e === null;
      }, 'is not null'),
      never: new Dt(function (e) {
        return !1;
      }, 'is unexpected'),
      Date: new Dt(Y1('[object Date]'), 'is not a Date'),
      RegExp: new Dt(Y1('[object RegExp]'), 'is not a RegExp'),
    };
    var By = Object.prototype.toString;
    function Y1(e) {
      return function (t) {
        return typeof t == 'object' && t && By.call(t) === e;
      };
    }
    typeof Buffer < 'u' &&
      (ce.basicTypes.Buffer = new Dt(function (e) {
        return Buffer.isBuffer(e);
      }, 'is not a Buffer'));
    var Vy = function (e) {
      ce.basicTypes[e.name] = new Dt(function (t) {
        return t instanceof e;
      }, 'is not a ' + e.name);
    };
    for (
      ao = 0,
        Ya = [
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
      ao < Ya.length;
      ao++
    )
      (J1 = Ya[ao]), Vy(J1);
    var J1, ao, Ya;
  });
  var il = Z((we) => {
    'use strict';
    var jy =
      (we && we.__spreadArrays) ||
      function () {
        for (var e = 0, t = 0, s = arguments.length; t < s; t++)
          e += arguments[t].length;
        for (var i = Array(e), r = 0, t = 0; t < s; t++)
          for (var a = arguments[t], u = 0, d = a.length; u < d; u++, r++)
            i[r] = a[u];
        return i;
      };
    Object.defineProperty(we, '__esModule', {value: !0});
    we.Checker = we.createCheckers = void 0;
    var zi = sl(),
      pi = oo(),
      ze = sl();
    Object.defineProperty(we, 'TArray', {
      enumerable: !0,
      get: function () {
        return ze.TArray;
      },
    });
    Object.defineProperty(we, 'TEnumType', {
      enumerable: !0,
      get: function () {
        return ze.TEnumType;
      },
    });
    Object.defineProperty(we, 'TEnumLiteral', {
      enumerable: !0,
      get: function () {
        return ze.TEnumLiteral;
      },
    });
    Object.defineProperty(we, 'TFunc', {
      enumerable: !0,
      get: function () {
        return ze.TFunc;
      },
    });
    Object.defineProperty(we, 'TIface', {
      enumerable: !0,
      get: function () {
        return ze.TIface;
      },
    });
    Object.defineProperty(we, 'TLiteral', {
      enumerable: !0,
      get: function () {
        return ze.TLiteral;
      },
    });
    Object.defineProperty(we, 'TName', {
      enumerable: !0,
      get: function () {
        return ze.TName;
      },
    });
    Object.defineProperty(we, 'TOptional', {
      enumerable: !0,
      get: function () {
        return ze.TOptional;
      },
    });
    Object.defineProperty(we, 'TParam', {
      enumerable: !0,
      get: function () {
        return ze.TParam;
      },
    });
    Object.defineProperty(we, 'TParamList', {
      enumerable: !0,
      get: function () {
        return ze.TParamList;
      },
    });
    Object.defineProperty(we, 'TProp', {
      enumerable: !0,
      get: function () {
        return ze.TProp;
      },
    });
    Object.defineProperty(we, 'TTuple', {
      enumerable: !0,
      get: function () {
        return ze.TTuple;
      },
    });
    Object.defineProperty(we, 'TType', {
      enumerable: !0,
      get: function () {
        return ze.TType;
      },
    });
    Object.defineProperty(we, 'TUnion', {
      enumerable: !0,
      get: function () {
        return ze.TUnion;
      },
    });
    Object.defineProperty(we, 'TIntersection', {
      enumerable: !0,
      get: function () {
        return ze.TIntersection;
      },
    });
    Object.defineProperty(we, 'array', {
      enumerable: !0,
      get: function () {
        return ze.array;
      },
    });
    Object.defineProperty(we, 'enumlit', {
      enumerable: !0,
      get: function () {
        return ze.enumlit;
      },
    });
    Object.defineProperty(we, 'enumtype', {
      enumerable: !0,
      get: function () {
        return ze.enumtype;
      },
    });
    Object.defineProperty(we, 'func', {
      enumerable: !0,
      get: function () {
        return ze.func;
      },
    });
    Object.defineProperty(we, 'iface', {
      enumerable: !0,
      get: function () {
        return ze.iface;
      },
    });
    Object.defineProperty(we, 'lit', {
      enumerable: !0,
      get: function () {
        return ze.lit;
      },
    });
    Object.defineProperty(we, 'name', {
      enumerable: !0,
      get: function () {
        return ze.name;
      },
    });
    Object.defineProperty(we, 'opt', {
      enumerable: !0,
      get: function () {
        return ze.opt;
      },
    });
    Object.defineProperty(we, 'param', {
      enumerable: !0,
      get: function () {
        return ze.param;
      },
    });
    Object.defineProperty(we, 'tuple', {
      enumerable: !0,
      get: function () {
        return ze.tuple;
      },
    });
    Object.defineProperty(we, 'union', {
      enumerable: !0,
      get: function () {
        return ze.union;
      },
    });
    Object.defineProperty(we, 'intersection', {
      enumerable: !0,
      get: function () {
        return ze.intersection;
      },
    });
    Object.defineProperty(we, 'BasicType', {
      enumerable: !0,
      get: function () {
        return ze.BasicType;
      },
    });
    var $y = oo();
    Object.defineProperty(we, 'VError', {
      enumerable: !0,
      get: function () {
        return $y.VError;
      },
    });
    function qy() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      for (
        var s = Object.assign.apply(Object, jy([{}, zi.basicTypes], e)),
          i = {},
          r = 0,
          a = e;
        r < a.length;
        r++
      )
        for (var u = a[r], d = 0, y = Object.keys(u); d < y.length; d++) {
          var g = y[d];
          i[g] = new cp(s, u[g]);
        }
      return i;
    }
    we.createCheckers = qy;
    var cp = (function () {
      function e(t, s, i) {
        if (
          (i === void 0 && (i = 'value'),
          (this.suite = t),
          (this.ttype = s),
          (this._path = i),
          (this.props = new Map()),
          s instanceof zi.TIface)
        )
          for (var r = 0, a = s.props; r < a.length; r++) {
            var u = a[r];
            this.props.set(u.name, u.ttype);
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
          return this.checkerPlain(t, new pi.NoopContext());
        }),
        (e.prototype.validate = function (t) {
          return this._doValidate(this.checkerPlain, t);
        }),
        (e.prototype.strictCheck = function (t) {
          return this._doCheck(this.checkerStrict, t);
        }),
        (e.prototype.strictTest = function (t) {
          return this.checkerStrict(t, new pi.NoopContext());
        }),
        (e.prototype.strictValidate = function (t) {
          return this._doValidate(this.checkerStrict, t);
        }),
        (e.prototype.getProp = function (t) {
          var s = this.props.get(t);
          if (!s) throw new Error('Type has no property ' + t);
          return new e(this.suite, s, this._path + '.' + t);
        }),
        (e.prototype.methodArgs = function (t) {
          var s = this._getMethod(t);
          return new e(this.suite, s.paramList);
        }),
        (e.prototype.methodResult = function (t) {
          var s = this._getMethod(t);
          return new e(this.suite, s.result);
        }),
        (e.prototype.getArgs = function () {
          if (!(this.ttype instanceof zi.TFunc))
            throw new Error('getArgs() applied to non-function');
          return new e(this.suite, this.ttype.paramList);
        }),
        (e.prototype.getResult = function () {
          if (!(this.ttype instanceof zi.TFunc))
            throw new Error('getResult() applied to non-function');
          return new e(this.suite, this.ttype.result);
        }),
        (e.prototype.getType = function () {
          return this.ttype;
        }),
        (e.prototype._doCheck = function (t, s) {
          var i = new pi.NoopContext();
          if (!t(s, i)) {
            var r = new pi.DetailContext();
            throw (t(s, r), r.getError(this._path));
          }
        }),
        (e.prototype._doValidate = function (t, s) {
          var i = new pi.NoopContext();
          if (t(s, i)) return null;
          var r = new pi.DetailContext();
          return t(s, r), r.getErrorDetail(this._path);
        }),
        (e.prototype._getMethod = function (t) {
          var s = this.props.get(t);
          if (!s) throw new Error('Type has no property ' + t);
          if (!(s instanceof zi.TFunc))
            throw new Error('Property ' + t + ' is not a method');
          return s;
        }),
        e
      );
    })();
    we.Checker = cp;
  });
  var up = Z((Gn) => {
    'use strict';
    Object.defineProperty(Gn, '__esModule', {value: !0});
    function Ky(e) {
      if (e && e.__esModule) return e;
      var t = {};
      if (e != null)
        for (var s in e)
          Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
      return (t.default = e), t;
    }
    var Uy = il(),
      Qe = Ky(Uy),
      Hy = Qe.union(
        Qe.lit('jsx'),
        Qe.lit('typescript'),
        Qe.lit('flow'),
        Qe.lit('imports'),
        Qe.lit('react-hot-loader'),
        Qe.lit('jest')
      );
    Gn.Transform = Hy;
    var Wy = Qe.iface([], {compiledFilename: 'string'});
    Gn.SourceMapOptions = Wy;
    var Gy = Qe.iface([], {
      transforms: Qe.array('Transform'),
      disableESTransforms: Qe.opt('boolean'),
      jsxRuntime: Qe.opt(
        Qe.union(Qe.lit('classic'), Qe.lit('automatic'), Qe.lit('preserve'))
      ),
      production: Qe.opt('boolean'),
      jsxImportSource: Qe.opt('string'),
      jsxPragma: Qe.opt('string'),
      jsxFragmentPragma: Qe.opt('string'),
      preserveDynamicImport: Qe.opt('boolean'),
      injectCreateRequireForImportRequire: Qe.opt('boolean'),
      enableLegacyTypeScriptModuleInterop: Qe.opt('boolean'),
      enableLegacyBabel5ModuleInterop: Qe.opt('boolean'),
      sourceMapOptions: Qe.opt('SourceMapOptions'),
      filePath: Qe.opt('string'),
    });
    Gn.Options = Gy;
    var zy = {
      Transform: Gn.Transform,
      SourceMapOptions: Gn.SourceMapOptions,
      Options: Gn.Options,
    };
    Gn.default = zy;
  });
  var pp = Z((rl) => {
    'use strict';
    Object.defineProperty(rl, '__esModule', {value: !0});
    function Xy(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Yy = il(),
      Jy = up(),
      Qy = Xy(Jy),
      {Options: Zy} = Yy.createCheckers.call(void 0, Qy.default);
    function eT(e) {
      Zy.strictCheck(e);
    }
    rl.validateOptions = eT;
  });
  var lo = Z((Nn) => {
    'use strict';
    Object.defineProperty(Nn, '__esModule', {value: !0});
    var tT = Ji(),
      hp = hi(),
      Mt = xt(),
      Xi = It(),
      fn = be(),
      gt = Zt(),
      Yi = Ns(),
      ol = cs();
    function nT() {
      Mt.next.call(void 0), Yi.parseMaybeAssign.call(void 0, !1);
    }
    Nn.parseSpread = nT;
    function fp(e) {
      Mt.next.call(void 0), ll(e);
    }
    Nn.parseRest = fp;
    function dp(e) {
      Yi.parseIdentifier.call(void 0), mp(e);
    }
    Nn.parseBindingIdentifier = dp;
    function sT() {
      Yi.parseIdentifier.call(void 0),
        (gt.state.tokens[gt.state.tokens.length - 1].identifierRole =
          Mt.IdentifierRole.ImportDeclaration);
    }
    Nn.parseImportedIdentifier = sT;
    function mp(e) {
      let t;
      gt.state.scopeDepth === 0
        ? (t = Mt.IdentifierRole.TopLevelDeclaration)
        : e
        ? (t = Mt.IdentifierRole.BlockScopedDeclaration)
        : (t = Mt.IdentifierRole.FunctionScopedDeclaration),
        (gt.state.tokens[gt.state.tokens.length - 1].identifierRole = t);
    }
    Nn.markPriorBindingIdentifier = mp;
    function ll(e) {
      switch (gt.state.type) {
        case fn.TokenType._this: {
          let t = Mt.pushTypeContext.call(void 0, 0);
          Mt.next.call(void 0), Mt.popTypeContext.call(void 0, t);
          return;
        }
        case fn.TokenType._yield:
        case fn.TokenType.name: {
          (gt.state.type = fn.TokenType.name), dp(e);
          return;
        }
        case fn.TokenType.bracketL: {
          Mt.next.call(void 0), yp(fn.TokenType.bracketR, e, !0);
          return;
        }
        case fn.TokenType.braceL:
          Yi.parseObj.call(void 0, !0, e);
          return;
        default:
          ol.unexpected.call(void 0);
      }
    }
    Nn.parseBindingAtom = ll;
    function yp(e, t, s = !1, i = !1, r = 0) {
      let a = !0,
        u = !1,
        d = gt.state.tokens.length;
      for (; !Mt.eat.call(void 0, e) && !gt.state.error; )
        if (
          (a
            ? (a = !1)
            : (ol.expect.call(void 0, fn.TokenType.comma),
              (gt.state.tokens[gt.state.tokens.length - 1].contextId = r),
              !u &&
                gt.state.tokens[d].isType &&
                ((gt.state.tokens[gt.state.tokens.length - 1].isType = !0),
                (u = !0))),
          !(s && Mt.match.call(void 0, fn.TokenType.comma)))
        ) {
          if (Mt.eat.call(void 0, e)) break;
          if (Mt.match.call(void 0, fn.TokenType.ellipsis)) {
            fp(t),
              Tp(),
              Mt.eat.call(void 0, fn.TokenType.comma),
              ol.expect.call(void 0, e);
            break;
          } else iT(i, t);
        }
    }
    Nn.parseBindingList = yp;
    function iT(e, t) {
      e &&
        hp.tsParseModifiers.call(void 0, [
          Xi.ContextualKeyword._public,
          Xi.ContextualKeyword._protected,
          Xi.ContextualKeyword._private,
          Xi.ContextualKeyword._readonly,
          Xi.ContextualKeyword._override,
        ]),
        al(t),
        Tp(),
        al(t, !0);
    }
    function Tp() {
      gt.isFlowEnabled
        ? tT.flowParseAssignableListItemTypes.call(void 0)
        : gt.isTypeScriptEnabled &&
          hp.tsParseAssignableListItemTypes.call(void 0);
    }
    function al(e, t = !1) {
      if ((t || ll(e), !Mt.eat.call(void 0, fn.TokenType.eq))) return;
      let s = gt.state.tokens.length - 1;
      Yi.parseMaybeAssign.call(void 0),
        (gt.state.tokens[s].rhsEndIndex = gt.state.tokens.length);
    }
    Nn.parseMaybeDefault = al;
  });
  var hi = Z((Oe) => {
    'use strict';
    Object.defineProperty(Oe, '__esModule', {value: !0});
    var v = xt(),
      oe = It(),
      k = be(),
      I = Zt(),
      _e = Ns(),
      di = lo(),
      Rn = nr(),
      H = cs(),
      rT = vl();
    function ul() {
      return v.match.call(void 0, k.TokenType.name);
    }
    function oT() {
      return (
        v.match.call(void 0, k.TokenType.name) ||
        !!(I.state.type & k.TokenType.IS_KEYWORD) ||
        v.match.call(void 0, k.TokenType.string) ||
        v.match.call(void 0, k.TokenType.num) ||
        v.match.call(void 0, k.TokenType.bigint) ||
        v.match.call(void 0, k.TokenType.decimal)
      );
    }
    function _p() {
      let e = I.state.snapshot();
      return (
        v.next.call(void 0),
        (v.match.call(void 0, k.TokenType.bracketL) ||
          v.match.call(void 0, k.TokenType.braceL) ||
          v.match.call(void 0, k.TokenType.star) ||
          v.match.call(void 0, k.TokenType.ellipsis) ||
          v.match.call(void 0, k.TokenType.hash) ||
          oT()) &&
        !H.hasPrecedingLineBreak.call(void 0)
          ? !0
          : (I.state.restoreFromSnapshot(e), !1)
      );
    }
    function bp(e) {
      for (; dl(e) !== null; );
    }
    Oe.tsParseModifiers = bp;
    function dl(e) {
      if (!v.match.call(void 0, k.TokenType.name)) return null;
      let t = I.state.contextualKeyword;
      if (e.indexOf(t) !== -1 && _p()) {
        switch (t) {
          case oe.ContextualKeyword._readonly:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._readonly;
            break;
          case oe.ContextualKeyword._abstract:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._abstract;
            break;
          case oe.ContextualKeyword._static:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._static;
            break;
          case oe.ContextualKeyword._public:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._public;
            break;
          case oe.ContextualKeyword._private:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._private;
            break;
          case oe.ContextualKeyword._protected:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._protected;
            break;
          case oe.ContextualKeyword._override:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._override;
            break;
          case oe.ContextualKeyword._declare:
            I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._declare;
            break;
          default:
            break;
        }
        return t;
      }
      return null;
    }
    Oe.tsParseModifier = dl;
    function Zi() {
      for (
        _e.parseIdentifier.call(void 0);
        v.eat.call(void 0, k.TokenType.dot);

      )
        _e.parseIdentifier.call(void 0);
    }
    function aT() {
      Zi(),
        !H.hasPrecedingLineBreak.call(void 0) &&
          v.match.call(void 0, k.TokenType.lessThan) &&
          yi();
    }
    function lT() {
      v.next.call(void 0), tr();
    }
    function cT() {
      v.next.call(void 0);
    }
    function uT() {
      H.expect.call(void 0, k.TokenType._typeof),
        v.match.call(void 0, k.TokenType._import) ? Cp() : Zi(),
        !H.hasPrecedingLineBreak.call(void 0) &&
          v.match.call(void 0, k.TokenType.lessThan) &&
          yi();
    }
    function Cp() {
      H.expect.call(void 0, k.TokenType._import),
        H.expect.call(void 0, k.TokenType.parenL),
        H.expect.call(void 0, k.TokenType.string),
        H.expect.call(void 0, k.TokenType.parenR),
        v.eat.call(void 0, k.TokenType.dot) && Zi(),
        v.match.call(void 0, k.TokenType.lessThan) && yi();
    }
    function pT() {
      v.eat.call(void 0, k.TokenType._const);
      let e = v.eat.call(void 0, k.TokenType._in),
        t = H.eatContextual.call(void 0, oe.ContextualKeyword._out);
      v.eat.call(void 0, k.TokenType._const),
        (e || t) && !v.match.call(void 0, k.TokenType.name)
          ? (I.state.tokens[I.state.tokens.length - 1].type = k.TokenType.name)
          : _e.parseIdentifier.call(void 0),
        v.eat.call(void 0, k.TokenType._extends) && rt(),
        v.eat.call(void 0, k.TokenType.eq) && rt();
    }
    function mi() {
      v.match.call(void 0, k.TokenType.lessThan) && uo();
    }
    Oe.tsTryParseTypeParameters = mi;
    function uo() {
      let e = v.pushTypeContext.call(void 0, 0);
      for (
        v.match.call(void 0, k.TokenType.lessThan) ||
        v.match.call(void 0, k.TokenType.typeParameterStart)
          ? v.next.call(void 0)
          : H.unexpected.call(void 0);
        !v.eat.call(void 0, k.TokenType.greaterThan) && !I.state.error;

      )
        pT(), v.eat.call(void 0, k.TokenType.comma);
      v.popTypeContext.call(void 0, e);
    }
    function ml(e) {
      let t = e === k.TokenType.arrow;
      mi(),
        H.expect.call(void 0, k.TokenType.parenL),
        I.state.scopeDepth++,
        hT(!1),
        I.state.scopeDepth--,
        (t || v.match.call(void 0, e)) && Qi(e);
    }
    function hT(e) {
      di.parseBindingList.call(void 0, k.TokenType.parenR, e);
    }
    function co() {
      v.eat.call(void 0, k.TokenType.comma) || H.semicolon.call(void 0);
    }
    function kp() {
      ml(k.TokenType.colon), co();
    }
    function fT() {
      let e = I.state.snapshot();
      v.next.call(void 0);
      let t =
        v.eat.call(void 0, k.TokenType.name) &&
        v.match.call(void 0, k.TokenType.colon);
      return I.state.restoreFromSnapshot(e), t;
    }
    function wp() {
      if (!(v.match.call(void 0, k.TokenType.bracketL) && fT())) return !1;
      let e = v.pushTypeContext.call(void 0, 0);
      return (
        H.expect.call(void 0, k.TokenType.bracketL),
        _e.parseIdentifier.call(void 0),
        tr(),
        H.expect.call(void 0, k.TokenType.bracketR),
        er(),
        co(),
        v.popTypeContext.call(void 0, e),
        !0
      );
    }
    function vp(e) {
      v.eat.call(void 0, k.TokenType.question),
        !e &&
        (v.match.call(void 0, k.TokenType.parenL) ||
          v.match.call(void 0, k.TokenType.lessThan))
          ? (ml(k.TokenType.colon), co())
          : (er(), co());
    }
    function dT() {
      if (
        v.match.call(void 0, k.TokenType.parenL) ||
        v.match.call(void 0, k.TokenType.lessThan)
      ) {
        kp();
        return;
      }
      if (v.match.call(void 0, k.TokenType._new)) {
        v.next.call(void 0),
          v.match.call(void 0, k.TokenType.parenL) ||
          v.match.call(void 0, k.TokenType.lessThan)
            ? kp()
            : vp(!1);
        return;
      }
      let e = !!dl([oe.ContextualKeyword._readonly]);
      wp() ||
        ((H.isContextual.call(void 0, oe.ContextualKeyword._get) ||
          H.isContextual.call(void 0, oe.ContextualKeyword._set)) &&
          _p(),
        _e.parsePropertyName.call(void 0, -1),
        vp(e));
    }
    function mT() {
      Sp();
    }
    function Sp() {
      for (
        H.expect.call(void 0, k.TokenType.braceL);
        !v.eat.call(void 0, k.TokenType.braceR) && !I.state.error;

      )
        dT();
    }
    function yT() {
      let e = I.state.snapshot(),
        t = TT();
      return I.state.restoreFromSnapshot(e), t;
    }
    function TT() {
      return (
        v.next.call(void 0),
        v.eat.call(void 0, k.TokenType.plus) ||
        v.eat.call(void 0, k.TokenType.minus)
          ? H.isContextual.call(void 0, oe.ContextualKeyword._readonly)
          : (H.isContextual.call(void 0, oe.ContextualKeyword._readonly) &&
              v.next.call(void 0),
            !v.match.call(void 0, k.TokenType.bracketL) ||
            (v.next.call(void 0), !ul())
              ? !1
              : (v.next.call(void 0), v.match.call(void 0, k.TokenType._in)))
      );
    }
    function kT() {
      _e.parseIdentifier.call(void 0),
        H.expect.call(void 0, k.TokenType._in),
        rt();
    }
    function vT() {
      H.expect.call(void 0, k.TokenType.braceL),
        v.match.call(void 0, k.TokenType.plus) ||
        v.match.call(void 0, k.TokenType.minus)
          ? (v.next.call(void 0),
            H.expectContextual.call(void 0, oe.ContextualKeyword._readonly))
          : H.eatContextual.call(void 0, oe.ContextualKeyword._readonly),
        H.expect.call(void 0, k.TokenType.bracketL),
        kT(),
        H.eatContextual.call(void 0, oe.ContextualKeyword._as) && rt(),
        H.expect.call(void 0, k.TokenType.bracketR),
        v.match.call(void 0, k.TokenType.plus) ||
        v.match.call(void 0, k.TokenType.minus)
          ? (v.next.call(void 0), H.expect.call(void 0, k.TokenType.question))
          : v.eat.call(void 0, k.TokenType.question),
        LT(),
        H.semicolon.call(void 0),
        H.expect.call(void 0, k.TokenType.braceR);
    }
    function xT() {
      for (
        H.expect.call(void 0, k.TokenType.bracketL);
        !v.eat.call(void 0, k.TokenType.bracketR) && !I.state.error;

      )
        gT(), v.eat.call(void 0, k.TokenType.comma);
    }
    function gT() {
      v.eat.call(void 0, k.TokenType.ellipsis)
        ? rt()
        : (rt(), v.eat.call(void 0, k.TokenType.question)),
        v.eat.call(void 0, k.TokenType.colon) && rt();
    }
    function _T() {
      H.expect.call(void 0, k.TokenType.parenL),
        rt(),
        H.expect.call(void 0, k.TokenType.parenR);
    }
    function bT() {
      for (
        v.nextTemplateToken.call(void 0), v.nextTemplateToken.call(void 0);
        !v.match.call(void 0, k.TokenType.backQuote) && !I.state.error;

      )
        H.expect.call(void 0, k.TokenType.dollarBraceL),
          rt(),
          v.nextTemplateToken.call(void 0),
          v.nextTemplateToken.call(void 0);
      v.next.call(void 0);
    }
    var hs;
    (function (e) {
      e[(e.TSFunctionType = 0)] = 'TSFunctionType';
      let s = 1;
      e[(e.TSConstructorType = s)] = 'TSConstructorType';
      let i = s + 1;
      e[(e.TSAbstractConstructorType = i)] = 'TSAbstractConstructorType';
    })(hs || (hs = {}));
    function cl(e) {
      e === hs.TSAbstractConstructorType &&
        H.expectContextual.call(void 0, oe.ContextualKeyword._abstract),
        (e === hs.TSConstructorType || e === hs.TSAbstractConstructorType) &&
          H.expect.call(void 0, k.TokenType._new);
      let t = I.state.inDisallowConditionalTypesContext;
      (I.state.inDisallowConditionalTypesContext = !1),
        ml(k.TokenType.arrow),
        (I.state.inDisallowConditionalTypesContext = t);
    }
    function CT() {
      switch (I.state.type) {
        case k.TokenType.name:
          aT();
          return;
        case k.TokenType._void:
        case k.TokenType._null:
          v.next.call(void 0);
          return;
        case k.TokenType.string:
        case k.TokenType.num:
        case k.TokenType.bigint:
        case k.TokenType.decimal:
        case k.TokenType._true:
        case k.TokenType._false:
          _e.parseLiteral.call(void 0);
          return;
        case k.TokenType.minus:
          v.next.call(void 0), _e.parseLiteral.call(void 0);
          return;
        case k.TokenType._this: {
          cT(),
            H.isContextual.call(void 0, oe.ContextualKeyword._is) &&
              !H.hasPrecedingLineBreak.call(void 0) &&
              lT();
          return;
        }
        case k.TokenType._typeof:
          uT();
          return;
        case k.TokenType._import:
          Cp();
          return;
        case k.TokenType.braceL:
          yT() ? vT() : mT();
          return;
        case k.TokenType.bracketL:
          xT();
          return;
        case k.TokenType.parenL:
          _T();
          return;
        case k.TokenType.backQuote:
          bT();
          return;
        default:
          if (I.state.type & k.TokenType.IS_KEYWORD) {
            v.next.call(void 0),
              (I.state.tokens[I.state.tokens.length - 1].type =
                k.TokenType.name);
            return;
          }
          break;
      }
      H.unexpected.call(void 0);
    }
    function wT() {
      for (
        CT();
        !H.hasPrecedingLineBreak.call(void 0) &&
        v.eat.call(void 0, k.TokenType.bracketL);

      )
        v.eat.call(void 0, k.TokenType.bracketR) ||
          (rt(), H.expect.call(void 0, k.TokenType.bracketR));
    }
    function ST() {
      if (
        (H.expectContextual.call(void 0, oe.ContextualKeyword._infer),
        _e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType._extends))
      ) {
        let e = I.state.snapshot();
        H.expect.call(void 0, k.TokenType._extends);
        let t = I.state.inDisallowConditionalTypesContext;
        (I.state.inDisallowConditionalTypesContext = !0),
          rt(),
          (I.state.inDisallowConditionalTypesContext = t),
          (I.state.error ||
            (!I.state.inDisallowConditionalTypesContext &&
              v.match.call(void 0, k.TokenType.question))) &&
            I.state.restoreFromSnapshot(e);
      }
    }
    function pl() {
      if (
        H.isContextual.call(void 0, oe.ContextualKeyword._keyof) ||
        H.isContextual.call(void 0, oe.ContextualKeyword._unique) ||
        H.isContextual.call(void 0, oe.ContextualKeyword._readonly)
      )
        v.next.call(void 0), pl();
      else if (H.isContextual.call(void 0, oe.ContextualKeyword._infer)) ST();
      else {
        let e = I.state.inDisallowConditionalTypesContext;
        (I.state.inDisallowConditionalTypesContext = !1),
          wT(),
          (I.state.inDisallowConditionalTypesContext = e);
      }
    }
    function xp() {
      if (
        (v.eat.call(void 0, k.TokenType.bitwiseAND),
        pl(),
        v.match.call(void 0, k.TokenType.bitwiseAND))
      )
        for (; v.eat.call(void 0, k.TokenType.bitwiseAND); ) pl();
    }
    function IT() {
      if (
        (v.eat.call(void 0, k.TokenType.bitwiseOR),
        xp(),
        v.match.call(void 0, k.TokenType.bitwiseOR))
      )
        for (; v.eat.call(void 0, k.TokenType.bitwiseOR); ) xp();
    }
    function ET() {
      return v.match.call(void 0, k.TokenType.lessThan)
        ? !0
        : v.match.call(void 0, k.TokenType.parenL) && PT();
    }
    function AT() {
      if (
        v.match.call(void 0, k.TokenType.name) ||
        v.match.call(void 0, k.TokenType._this)
      )
        return v.next.call(void 0), !0;
      if (
        v.match.call(void 0, k.TokenType.braceL) ||
        v.match.call(void 0, k.TokenType.bracketL)
      ) {
        let e = 1;
        for (v.next.call(void 0); e > 0 && !I.state.error; )
          v.match.call(void 0, k.TokenType.braceL) ||
          v.match.call(void 0, k.TokenType.bracketL)
            ? e++
            : (v.match.call(void 0, k.TokenType.braceR) ||
                v.match.call(void 0, k.TokenType.bracketR)) &&
              e--,
            v.next.call(void 0);
        return !0;
      }
      return !1;
    }
    function PT() {
      let e = I.state.snapshot(),
        t = NT();
      return I.state.restoreFromSnapshot(e), t;
    }
    function NT() {
      return (
        v.next.call(void 0),
        !!(
          v.match.call(void 0, k.TokenType.parenR) ||
          v.match.call(void 0, k.TokenType.ellipsis) ||
          (AT() &&
            (v.match.call(void 0, k.TokenType.colon) ||
              v.match.call(void 0, k.TokenType.comma) ||
              v.match.call(void 0, k.TokenType.question) ||
              v.match.call(void 0, k.TokenType.eq) ||
              (v.match.call(void 0, k.TokenType.parenR) &&
                (v.next.call(void 0),
                v.match.call(void 0, k.TokenType.arrow)))))
        )
      );
    }
    function Qi(e) {
      let t = v.pushTypeContext.call(void 0, 0);
      H.expect.call(void 0, e), OT() || rt(), v.popTypeContext.call(void 0, t);
    }
    function RT() {
      v.match.call(void 0, k.TokenType.colon) && Qi(k.TokenType.colon);
    }
    function er() {
      v.match.call(void 0, k.TokenType.colon) && tr();
    }
    Oe.tsTryParseTypeAnnotation = er;
    function LT() {
      v.eat.call(void 0, k.TokenType.colon) && rt();
    }
    function OT() {
      let e = I.state.snapshot();
      return H.isContextual.call(void 0, oe.ContextualKeyword._asserts)
        ? (v.next.call(void 0),
          H.eatContextual.call(void 0, oe.ContextualKeyword._is)
            ? (rt(), !0)
            : ul() || v.match.call(void 0, k.TokenType._this)
            ? (v.next.call(void 0),
              H.eatContextual.call(void 0, oe.ContextualKeyword._is) && rt(),
              !0)
            : (I.state.restoreFromSnapshot(e), !1))
        : ul() || v.match.call(void 0, k.TokenType._this)
        ? (v.next.call(void 0),
          H.isContextual.call(void 0, oe.ContextualKeyword._is) &&
          !H.hasPrecedingLineBreak.call(void 0)
            ? (v.next.call(void 0), rt(), !0)
            : (I.state.restoreFromSnapshot(e), !1))
        : !1;
    }
    function tr() {
      let e = v.pushTypeContext.call(void 0, 0);
      H.expect.call(void 0, k.TokenType.colon),
        rt(),
        v.popTypeContext.call(void 0, e);
    }
    Oe.tsParseTypeAnnotation = tr;
    function rt() {
      if (
        (hl(),
        I.state.inDisallowConditionalTypesContext ||
          H.hasPrecedingLineBreak.call(void 0) ||
          !v.eat.call(void 0, k.TokenType._extends))
      )
        return;
      let e = I.state.inDisallowConditionalTypesContext;
      (I.state.inDisallowConditionalTypesContext = !0),
        hl(),
        (I.state.inDisallowConditionalTypesContext = e),
        H.expect.call(void 0, k.TokenType.question),
        rt(),
        H.expect.call(void 0, k.TokenType.colon),
        rt();
    }
    Oe.tsParseType = rt;
    function DT() {
      return (
        H.isContextual.call(void 0, oe.ContextualKeyword._abstract) &&
        v.lookaheadType.call(void 0) === k.TokenType._new
      );
    }
    function hl() {
      if (ET()) {
        cl(hs.TSFunctionType);
        return;
      }
      if (v.match.call(void 0, k.TokenType._new)) {
        cl(hs.TSConstructorType);
        return;
      } else if (DT()) {
        cl(hs.TSAbstractConstructorType);
        return;
      }
      IT();
    }
    Oe.tsParseNonConditionalType = hl;
    function MT() {
      let e = v.pushTypeContext.call(void 0, 1);
      rt(),
        H.expect.call(void 0, k.TokenType.greaterThan),
        v.popTypeContext.call(void 0, e),
        _e.parseMaybeUnary.call(void 0);
    }
    Oe.tsParseTypeAssertion = MT;
    function FT() {
      if (v.eat.call(void 0, k.TokenType.jsxTagStart)) {
        I.state.tokens[I.state.tokens.length - 1].type =
          k.TokenType.typeParameterStart;
        let e = v.pushTypeContext.call(void 0, 1);
        for (
          ;
          !v.match.call(void 0, k.TokenType.greaterThan) && !I.state.error;

        )
          rt(), v.eat.call(void 0, k.TokenType.comma);
        rT.nextJSXTagToken.call(void 0), v.popTypeContext.call(void 0, e);
      }
    }
    Oe.tsTryParseJSXTypeArgument = FT;
    function Ip() {
      for (; !v.match.call(void 0, k.TokenType.braceL) && !I.state.error; )
        BT(), v.eat.call(void 0, k.TokenType.comma);
    }
    function BT() {
      Zi(), v.match.call(void 0, k.TokenType.lessThan) && yi();
    }
    function VT() {
      di.parseBindingIdentifier.call(void 0, !1),
        mi(),
        v.eat.call(void 0, k.TokenType._extends) && Ip(),
        Sp();
    }
    function jT() {
      di.parseBindingIdentifier.call(void 0, !1),
        mi(),
        H.expect.call(void 0, k.TokenType.eq),
        rt(),
        H.semicolon.call(void 0);
    }
    function $T() {
      if (
        (v.match.call(void 0, k.TokenType.string)
          ? _e.parseLiteral.call(void 0)
          : _e.parseIdentifier.call(void 0),
        v.eat.call(void 0, k.TokenType.eq))
      ) {
        let e = I.state.tokens.length - 1;
        _e.parseMaybeAssign.call(void 0),
          (I.state.tokens[e].rhsEndIndex = I.state.tokens.length);
      }
    }
    function yl() {
      for (
        di.parseBindingIdentifier.call(void 0, !1),
          H.expect.call(void 0, k.TokenType.braceL);
        !v.eat.call(void 0, k.TokenType.braceR) && !I.state.error;

      )
        $T(), v.eat.call(void 0, k.TokenType.comma);
    }
    function Tl() {
      H.expect.call(void 0, k.TokenType.braceL),
        Rn.parseBlockBody.call(void 0, k.TokenType.braceR);
    }
    function fl() {
      di.parseBindingIdentifier.call(void 0, !1),
        v.eat.call(void 0, k.TokenType.dot) ? fl() : Tl();
    }
    function Ep() {
      H.isContextual.call(void 0, oe.ContextualKeyword._global)
        ? _e.parseIdentifier.call(void 0)
        : v.match.call(void 0, k.TokenType.string)
        ? _e.parseExprAtom.call(void 0)
        : H.unexpected.call(void 0),
        v.match.call(void 0, k.TokenType.braceL)
          ? Tl()
          : H.semicolon.call(void 0);
    }
    function Ap() {
      di.parseImportedIdentifier.call(void 0),
        H.expect.call(void 0, k.TokenType.eq),
        KT(),
        H.semicolon.call(void 0);
    }
    Oe.tsParseImportEqualsDeclaration = Ap;
    function qT() {
      return (
        H.isContextual.call(void 0, oe.ContextualKeyword._require) &&
        v.lookaheadType.call(void 0) === k.TokenType.parenL
      );
    }
    function KT() {
      qT() ? UT() : Zi();
    }
    function UT() {
      H.expectContextual.call(void 0, oe.ContextualKeyword._require),
        H.expect.call(void 0, k.TokenType.parenL),
        v.match.call(void 0, k.TokenType.string) || H.unexpected.call(void 0),
        _e.parseLiteral.call(void 0),
        H.expect.call(void 0, k.TokenType.parenR);
    }
    function HT() {
      if (H.isLineTerminator.call(void 0)) return !1;
      switch (I.state.type) {
        case k.TokenType._function: {
          let e = v.pushTypeContext.call(void 0, 1);
          v.next.call(void 0);
          let t = I.state.start;
          return (
            Rn.parseFunction.call(void 0, t, !0),
            v.popTypeContext.call(void 0, e),
            !0
          );
        }
        case k.TokenType._class: {
          let e = v.pushTypeContext.call(void 0, 1);
          return (
            Rn.parseClass.call(void 0, !0, !1),
            v.popTypeContext.call(void 0, e),
            !0
          );
        }
        case k.TokenType._const:
          if (
            v.match.call(void 0, k.TokenType._const) &&
            H.isLookaheadContextual.call(void 0, oe.ContextualKeyword._enum)
          ) {
            let e = v.pushTypeContext.call(void 0, 1);
            return (
              H.expect.call(void 0, k.TokenType._const),
              H.expectContextual.call(void 0, oe.ContextualKeyword._enum),
              (I.state.tokens[I.state.tokens.length - 1].type =
                k.TokenType._enum),
              yl(),
              v.popTypeContext.call(void 0, e),
              !0
            );
          }
        case k.TokenType._var:
        case k.TokenType._let: {
          let e = v.pushTypeContext.call(void 0, 1);
          return (
            Rn.parseVarStatement.call(
              void 0,
              I.state.type !== k.TokenType._var
            ),
            v.popTypeContext.call(void 0, e),
            !0
          );
        }
        case k.TokenType.name: {
          let e = v.pushTypeContext.call(void 0, 1),
            t = I.state.contextualKeyword,
            s = !1;
          return (
            t === oe.ContextualKeyword._global
              ? (Ep(), (s = !0))
              : (s = po(t, !0)),
            v.popTypeContext.call(void 0, e),
            s
          );
        }
        default:
          return !1;
      }
    }
    function gp() {
      return po(I.state.contextualKeyword, !0);
    }
    function WT(e) {
      switch (e) {
        case oe.ContextualKeyword._declare: {
          let t = I.state.tokens.length - 1;
          if (HT()) return (I.state.tokens[t].type = k.TokenType._declare), !0;
          break;
        }
        case oe.ContextualKeyword._global:
          if (v.match.call(void 0, k.TokenType.braceL)) return Tl(), !0;
          break;
        default:
          return po(e, !1);
      }
      return !1;
    }
    function po(e, t) {
      switch (e) {
        case oe.ContextualKeyword._abstract:
          if (fi(t) && v.match.call(void 0, k.TokenType._class))
            return (
              (I.state.tokens[I.state.tokens.length - 1].type =
                k.TokenType._abstract),
              Rn.parseClass.call(void 0, !0, !1),
              !0
            );
          break;
        case oe.ContextualKeyword._enum:
          if (fi(t) && v.match.call(void 0, k.TokenType.name))
            return (
              (I.state.tokens[I.state.tokens.length - 1].type =
                k.TokenType._enum),
              yl(),
              !0
            );
          break;
        case oe.ContextualKeyword._interface:
          if (fi(t) && v.match.call(void 0, k.TokenType.name)) {
            let s = v.pushTypeContext.call(void 0, t ? 2 : 1);
            return VT(), v.popTypeContext.call(void 0, s), !0;
          }
          break;
        case oe.ContextualKeyword._module:
          if (fi(t)) {
            if (v.match.call(void 0, k.TokenType.string)) {
              let s = v.pushTypeContext.call(void 0, t ? 2 : 1);
              return Ep(), v.popTypeContext.call(void 0, s), !0;
            } else if (v.match.call(void 0, k.TokenType.name)) {
              let s = v.pushTypeContext.call(void 0, t ? 2 : 1);
              return fl(), v.popTypeContext.call(void 0, s), !0;
            }
          }
          break;
        case oe.ContextualKeyword._namespace:
          if (fi(t) && v.match.call(void 0, k.TokenType.name)) {
            let s = v.pushTypeContext.call(void 0, t ? 2 : 1);
            return fl(), v.popTypeContext.call(void 0, s), !0;
          }
          break;
        case oe.ContextualKeyword._type:
          if (fi(t) && v.match.call(void 0, k.TokenType.name)) {
            let s = v.pushTypeContext.call(void 0, t ? 2 : 1);
            return jT(), v.popTypeContext.call(void 0, s), !0;
          }
          break;
        default:
          break;
      }
      return !1;
    }
    function fi(e) {
      return e ? (v.next.call(void 0), !0) : !H.isLineTerminator.call(void 0);
    }
    function GT() {
      let e = I.state.snapshot();
      return (
        uo(),
        Rn.parseFunctionParams.call(void 0),
        RT(),
        H.expect.call(void 0, k.TokenType.arrow),
        I.state.error
          ? (I.state.restoreFromSnapshot(e), !1)
          : (_e.parseFunctionBody.call(void 0, !0), !0)
      );
    }
    function kl() {
      I.state.type === k.TokenType.bitShiftL &&
        ((I.state.pos -= 1), v.finishToken.call(void 0, k.TokenType.lessThan)),
        yi();
    }
    function yi() {
      let e = v.pushTypeContext.call(void 0, 0);
      for (
        H.expect.call(void 0, k.TokenType.lessThan);
        !v.eat.call(void 0, k.TokenType.greaterThan) && !I.state.error;

      )
        rt(), v.eat.call(void 0, k.TokenType.comma);
      v.popTypeContext.call(void 0, e);
    }
    function zT() {
      if (v.match.call(void 0, k.TokenType.name))
        switch (I.state.contextualKeyword) {
          case oe.ContextualKeyword._abstract:
          case oe.ContextualKeyword._declare:
          case oe.ContextualKeyword._enum:
          case oe.ContextualKeyword._interface:
          case oe.ContextualKeyword._module:
          case oe.ContextualKeyword._namespace:
          case oe.ContextualKeyword._type:
            return !0;
          default:
            break;
        }
      return !1;
    }
    Oe.tsIsDeclarationStart = zT;
    function XT(e, t) {
      if (
        (v.match.call(void 0, k.TokenType.colon) && Qi(k.TokenType.colon),
        !v.match.call(void 0, k.TokenType.braceL) &&
          H.isLineTerminator.call(void 0))
      ) {
        let s = I.state.tokens.length - 1;
        for (
          ;
          s >= 0 &&
          (I.state.tokens[s].start >= e ||
            I.state.tokens[s].type === k.TokenType._default ||
            I.state.tokens[s].type === k.TokenType._export);

        )
          (I.state.tokens[s].isType = !0), s--;
        return;
      }
      _e.parseFunctionBody.call(void 0, !1, t);
    }
    Oe.tsParseFunctionBodyAndFinish = XT;
    function YT(e, t, s) {
      if (
        !H.hasPrecedingLineBreak.call(void 0) &&
        v.eat.call(void 0, k.TokenType.bang)
      ) {
        I.state.tokens[I.state.tokens.length - 1].type =
          k.TokenType.nonNullAssertion;
        return;
      }
      if (
        v.match.call(void 0, k.TokenType.lessThan) ||
        v.match.call(void 0, k.TokenType.bitShiftL)
      ) {
        let i = I.state.snapshot();
        if (!t && _e.atPossibleAsync.call(void 0) && GT()) return;
        if (
          (kl(),
          !t && v.eat.call(void 0, k.TokenType.parenL)
            ? ((I.state.tokens[I.state.tokens.length - 1].subscriptStartIndex =
                e),
              _e.parseCallExpressionArguments.call(void 0))
            : v.match.call(void 0, k.TokenType.backQuote)
            ? _e.parseTemplate.call(void 0)
            : (I.state.type === k.TokenType.greaterThan ||
                (I.state.type !== k.TokenType.parenL &&
                  I.state.type & k.TokenType.IS_EXPRESSION_START &&
                  !H.hasPrecedingLineBreak.call(void 0))) &&
              H.unexpected.call(void 0),
          I.state.error)
        )
          I.state.restoreFromSnapshot(i);
        else return;
      } else
        !t &&
          v.match.call(void 0, k.TokenType.questionDot) &&
          v.lookaheadType.call(void 0) === k.TokenType.lessThan &&
          (v.next.call(void 0),
          (I.state.tokens[e].isOptionalChainStart = !0),
          (I.state.tokens[I.state.tokens.length - 1].subscriptStartIndex = e),
          yi(),
          H.expect.call(void 0, k.TokenType.parenL),
          _e.parseCallExpressionArguments.call(void 0));
      _e.baseParseSubscript.call(void 0, e, t, s);
    }
    Oe.tsParseSubscript = YT;
    function JT() {
      if (v.eat.call(void 0, k.TokenType._import))
        return (
          H.isContextual.call(void 0, oe.ContextualKeyword._type) &&
            v.lookaheadType.call(void 0) !== k.TokenType.eq &&
            H.expectContextual.call(void 0, oe.ContextualKeyword._type),
          Ap(),
          !0
        );
      if (v.eat.call(void 0, k.TokenType.eq))
        return _e.parseExpression.call(void 0), H.semicolon.call(void 0), !0;
      if (H.eatContextual.call(void 0, oe.ContextualKeyword._as))
        return (
          H.expectContextual.call(void 0, oe.ContextualKeyword._namespace),
          _e.parseIdentifier.call(void 0),
          H.semicolon.call(void 0),
          !0
        );
      if (H.isContextual.call(void 0, oe.ContextualKeyword._type)) {
        let e = v.lookaheadType.call(void 0);
        (e === k.TokenType.braceL || e === k.TokenType.star) &&
          v.next.call(void 0);
      }
      return !1;
    }
    Oe.tsTryParseExport = JT;
    function QT() {
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 1].identifierRole =
          v.IdentifierRole.ImportDeclaration;
        return;
      }
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          v.IdentifierRole.ImportDeclaration),
          (I.state.tokens[I.state.tokens.length - 2].isType = !0),
          (I.state.tokens[I.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          v.IdentifierRole.ImportAccess),
          (I.state.tokens[I.state.tokens.length - 1].identifierRole =
            v.IdentifierRole.ImportDeclaration);
        return;
      }
      _e.parseIdentifier.call(void 0),
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          v.IdentifierRole.ImportAccess),
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          v.IdentifierRole.ImportDeclaration),
        (I.state.tokens[I.state.tokens.length - 4].isType = !0),
        (I.state.tokens[I.state.tokens.length - 3].isType = !0),
        (I.state.tokens[I.state.tokens.length - 2].isType = !0),
        (I.state.tokens[I.state.tokens.length - 1].isType = !0);
    }
    Oe.tsParseImportSpecifier = QT;
    function ZT() {
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 1].identifierRole =
          v.IdentifierRole.ExportAccess;
        return;
      }
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          v.IdentifierRole.ExportAccess),
          (I.state.tokens[I.state.tokens.length - 2].isType = !0),
          (I.state.tokens[I.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (_e.parseIdentifier.call(void 0),
        v.match.call(void 0, k.TokenType.comma) ||
          v.match.call(void 0, k.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 3].identifierRole =
          v.IdentifierRole.ExportAccess;
        return;
      }
      _e.parseIdentifier.call(void 0),
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          v.IdentifierRole.ExportAccess),
        (I.state.tokens[I.state.tokens.length - 4].isType = !0),
        (I.state.tokens[I.state.tokens.length - 3].isType = !0),
        (I.state.tokens[I.state.tokens.length - 2].isType = !0),
        (I.state.tokens[I.state.tokens.length - 1].isType = !0);
    }
    Oe.tsParseExportSpecifier = ZT;
    function ek() {
      if (
        H.isContextual.call(void 0, oe.ContextualKeyword._abstract) &&
        v.lookaheadType.call(void 0) === k.TokenType._class
      )
        return (
          (I.state.type = k.TokenType._abstract),
          v.next.call(void 0),
          Rn.parseClass.call(void 0, !0, !0),
          !0
        );
      if (H.isContextual.call(void 0, oe.ContextualKeyword._interface)) {
        let e = v.pushTypeContext.call(void 0, 2);
        return (
          po(oe.ContextualKeyword._interface, !0),
          v.popTypeContext.call(void 0, e),
          !0
        );
      }
      return !1;
    }
    Oe.tsTryParseExportDefaultExpression = ek;
    function tk() {
      if (I.state.type === k.TokenType._const) {
        let e = v.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === k.TokenType.name &&
          e.contextualKeyword === oe.ContextualKeyword._enum
        )
          return (
            H.expect.call(void 0, k.TokenType._const),
            H.expectContextual.call(void 0, oe.ContextualKeyword._enum),
            (I.state.tokens[I.state.tokens.length - 1].type =
              k.TokenType._enum),
            yl(),
            !0
          );
      }
      return !1;
    }
    Oe.tsTryParseStatementContent = tk;
    function nk(e) {
      let t = I.state.tokens.length;
      bp([
        oe.ContextualKeyword._abstract,
        oe.ContextualKeyword._readonly,
        oe.ContextualKeyword._declare,
        oe.ContextualKeyword._static,
        oe.ContextualKeyword._override,
      ]);
      let s = I.state.tokens.length;
      if (wp()) {
        let r = e ? t - 1 : t;
        for (let a = r; a < s; a++) I.state.tokens[a].isType = !0;
        return !0;
      }
      return !1;
    }
    Oe.tsTryParseClassMemberWithIsStatic = nk;
    function sk(e) {
      WT(e) || H.semicolon.call(void 0);
    }
    Oe.tsParseIdentifierStatement = sk;
    function ik() {
      let e = H.eatContextual.call(void 0, oe.ContextualKeyword._declare);
      e &&
        (I.state.tokens[I.state.tokens.length - 1].type = k.TokenType._declare);
      let t = !1;
      if (v.match.call(void 0, k.TokenType.name))
        if (e) {
          let s = v.pushTypeContext.call(void 0, 2);
          (t = gp()), v.popTypeContext.call(void 0, s);
        } else t = gp();
      if (!t)
        if (e) {
          let s = v.pushTypeContext.call(void 0, 2);
          Rn.parseStatement.call(void 0, !0), v.popTypeContext.call(void 0, s);
        } else Rn.parseStatement.call(void 0, !0);
    }
    Oe.tsParseExportDeclaration = ik;
    function rk(e) {
      if (
        (e &&
          (v.match.call(void 0, k.TokenType.lessThan) ||
            v.match.call(void 0, k.TokenType.bitShiftL)) &&
          kl(),
        H.eatContextual.call(void 0, oe.ContextualKeyword._implements))
      ) {
        I.state.tokens[I.state.tokens.length - 1].type =
          k.TokenType._implements;
        let t = v.pushTypeContext.call(void 0, 1);
        Ip(), v.popTypeContext.call(void 0, t);
      }
    }
    Oe.tsAfterParseClassSuper = rk;
    function ok() {
      mi();
    }
    Oe.tsStartParseObjPropValue = ok;
    function ak() {
      mi();
    }
    Oe.tsStartParseFunctionParams = ak;
    function lk() {
      let e = v.pushTypeContext.call(void 0, 0);
      H.hasPrecedingLineBreak.call(void 0) ||
        v.eat.call(void 0, k.TokenType.bang),
        er(),
        v.popTypeContext.call(void 0, e);
    }
    Oe.tsAfterParseVarHead = lk;
    function ck() {
      v.match.call(void 0, k.TokenType.colon) && tr();
    }
    Oe.tsStartParseAsyncArrowFromCallExpression = ck;
    function uk(e, t) {
      return I.isJSXEnabled ? Pp(e, t) : Np(e, t);
    }
    Oe.tsParseMaybeAssign = uk;
    function Pp(e, t) {
      if (!v.match.call(void 0, k.TokenType.lessThan))
        return _e.baseParseMaybeAssign.call(void 0, e, t);
      let s = I.state.snapshot(),
        i = _e.baseParseMaybeAssign.call(void 0, e, t);
      if (I.state.error) I.state.restoreFromSnapshot(s);
      else return i;
      return (
        (I.state.type = k.TokenType.typeParameterStart),
        uo(),
        (i = _e.baseParseMaybeAssign.call(void 0, e, t)),
        i || H.unexpected.call(void 0),
        i
      );
    }
    Oe.tsParseMaybeAssignWithJSX = Pp;
    function Np(e, t) {
      if (!v.match.call(void 0, k.TokenType.lessThan))
        return _e.baseParseMaybeAssign.call(void 0, e, t);
      let s = I.state.snapshot();
      uo();
      let i = _e.baseParseMaybeAssign.call(void 0, e, t);
      if ((i || H.unexpected.call(void 0), I.state.error))
        I.state.restoreFromSnapshot(s);
      else return i;
      return _e.baseParseMaybeAssign.call(void 0, e, t);
    }
    Oe.tsParseMaybeAssignWithoutJSX = Np;
    function pk() {
      if (v.match.call(void 0, k.TokenType.colon)) {
        let e = I.state.snapshot();
        Qi(k.TokenType.colon),
          H.canInsertSemicolon.call(void 0) && H.unexpected.call(void 0),
          v.match.call(void 0, k.TokenType.arrow) || H.unexpected.call(void 0),
          I.state.error && I.state.restoreFromSnapshot(e);
      }
      return v.eat.call(void 0, k.TokenType.arrow);
    }
    Oe.tsParseArrow = pk;
    function hk() {
      let e = v.pushTypeContext.call(void 0, 0);
      v.eat.call(void 0, k.TokenType.question),
        er(),
        v.popTypeContext.call(void 0, e);
    }
    Oe.tsParseAssignableListItemTypes = hk;
    function fk() {
      (v.match.call(void 0, k.TokenType.lessThan) ||
        v.match.call(void 0, k.TokenType.bitShiftL)) &&
        kl(),
        Rn.baseParseMaybeDecoratorArguments.call(void 0);
    }
    Oe.tsParseMaybeDecoratorArguments = fk;
  });
  var vl = Z((fo) => {
    'use strict';
    Object.defineProperty(fo, '__esModule', {value: !0});
    var Se = xt(),
      Me = be(),
      fe = Zt(),
      ho = Ns(),
      fs = cs(),
      at = Qt(),
      Rp = li(),
      dk = hi();
    function mk() {
      let e = !1,
        t = !1;
      for (;;) {
        if (fe.state.pos >= fe.input.length) {
          fs.unexpected.call(void 0, 'Unterminated JSX contents');
          return;
        }
        let s = fe.input.charCodeAt(fe.state.pos);
        if (s === at.charCodes.lessThan || s === at.charCodes.leftCurlyBrace) {
          if (fe.state.pos === fe.state.start) {
            if (s === at.charCodes.lessThan) {
              fe.state.pos++,
                Se.finishToken.call(void 0, Me.TokenType.jsxTagStart);
              return;
            }
            Se.getTokenFromCode.call(void 0, s);
            return;
          }
          e && !t
            ? Se.finishToken.call(void 0, Me.TokenType.jsxEmptyText)
            : Se.finishToken.call(void 0, Me.TokenType.jsxText);
          return;
        }
        s === at.charCodes.lineFeed
          ? (e = !0)
          : s !== at.charCodes.space &&
            s !== at.charCodes.carriageReturn &&
            s !== at.charCodes.tab &&
            (t = !0),
          fe.state.pos++;
      }
    }
    function yk(e) {
      for (fe.state.pos++; ; ) {
        if (fe.state.pos >= fe.input.length) {
          fs.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        if (fe.input.charCodeAt(fe.state.pos) === e) {
          fe.state.pos++;
          break;
        }
        fe.state.pos++;
      }
      Se.finishToken.call(void 0, Me.TokenType.string);
    }
    function Tk() {
      let e;
      do {
        if (fe.state.pos > fe.input.length) {
          fs.unexpected.call(void 0, 'Unexpectedly reached the end of input.');
          return;
        }
        e = fe.input.charCodeAt(++fe.state.pos);
      } while (Rp.IS_IDENTIFIER_CHAR[e] || e === at.charCodes.dash);
      Se.finishToken.call(void 0, Me.TokenType.jsxName);
    }
    function xl() {
      dn();
    }
    function Lp(e) {
      if ((xl(), !Se.eat.call(void 0, Me.TokenType.colon))) {
        fe.state.tokens[fe.state.tokens.length - 1].identifierRole = e;
        return;
      }
      xl();
    }
    function Op() {
      let e = fe.state.tokens.length;
      Lp(Se.IdentifierRole.Access);
      let t = !1;
      for (; Se.match.call(void 0, Me.TokenType.dot); ) (t = !0), dn(), xl();
      if (!t) {
        let s = fe.state.tokens[e],
          i = fe.input.charCodeAt(s.start);
        i >= at.charCodes.lowercaseA &&
          i <= at.charCodes.lowercaseZ &&
          (s.identifierRole = null);
      }
    }
    function kk() {
      switch (fe.state.type) {
        case Me.TokenType.braceL:
          Se.next.call(void 0), ho.parseExpression.call(void 0), dn();
          return;
        case Me.TokenType.jsxTagStart:
          Mp(), dn();
          return;
        case Me.TokenType.string:
          dn();
          return;
        default:
          fs.unexpected.call(
            void 0,
            'JSX value should be either an expression or a quoted JSX text'
          );
      }
    }
    function vk() {
      fs.expect.call(void 0, Me.TokenType.ellipsis),
        ho.parseExpression.call(void 0);
    }
    function xk(e) {
      if (Se.match.call(void 0, Me.TokenType.jsxTagEnd)) return !1;
      Op(), fe.isTypeScriptEnabled && dk.tsTryParseJSXTypeArgument.call(void 0);
      let t = !1;
      for (
        ;
        !Se.match.call(void 0, Me.TokenType.slash) &&
        !Se.match.call(void 0, Me.TokenType.jsxTagEnd) &&
        !fe.state.error;

      ) {
        if (Se.eat.call(void 0, Me.TokenType.braceL)) {
          (t = !0),
            fs.expect.call(void 0, Me.TokenType.ellipsis),
            ho.parseMaybeAssign.call(void 0),
            dn();
          continue;
        }
        t &&
          fe.state.end - fe.state.start === 3 &&
          fe.input.charCodeAt(fe.state.start) === at.charCodes.lowercaseK &&
          fe.input.charCodeAt(fe.state.start + 1) === at.charCodes.lowercaseE &&
          fe.input.charCodeAt(fe.state.start + 2) === at.charCodes.lowercaseY &&
          (fe.state.tokens[e].jsxRole = Se.JSXRole.KeyAfterPropSpread),
          Lp(Se.IdentifierRole.ObjectKey),
          Se.match.call(void 0, Me.TokenType.eq) && (dn(), kk());
      }
      let s = Se.match.call(void 0, Me.TokenType.slash);
      return s && dn(), s;
    }
    function gk() {
      Se.match.call(void 0, Me.TokenType.jsxTagEnd) || Op();
    }
    function Dp() {
      let e = fe.state.tokens.length - 1;
      fe.state.tokens[e].jsxRole = Se.JSXRole.NoChildren;
      let t = 0;
      if (!xk(e))
        for (Ti(); ; )
          switch (fe.state.type) {
            case Me.TokenType.jsxTagStart:
              if ((dn(), Se.match.call(void 0, Me.TokenType.slash))) {
                dn(),
                  gk(),
                  fe.state.tokens[e].jsxRole !==
                    Se.JSXRole.KeyAfterPropSpread &&
                    (t === 1
                      ? (fe.state.tokens[e].jsxRole = Se.JSXRole.OneChild)
                      : t > 1 &&
                        (fe.state.tokens[e].jsxRole =
                          Se.JSXRole.StaticChildren));
                return;
              }
              t++, Dp(), Ti();
              break;
            case Me.TokenType.jsxText:
              t++, Ti();
              break;
            case Me.TokenType.jsxEmptyText:
              Ti();
              break;
            case Me.TokenType.braceL:
              Se.next.call(void 0),
                Se.match.call(void 0, Me.TokenType.ellipsis)
                  ? (vk(), Ti(), (t += 2))
                  : (Se.match.call(void 0, Me.TokenType.braceR) ||
                      (t++, ho.parseExpression.call(void 0)),
                    Ti());
              break;
            default:
              fs.unexpected.call(void 0);
              return;
          }
    }
    function Mp() {
      dn(), Dp();
    }
    fo.jsxParseElement = Mp;
    function dn() {
      fe.state.tokens.push(new Se.Token()),
        Se.skipSpace.call(void 0),
        (fe.state.start = fe.state.pos);
      let e = fe.input.charCodeAt(fe.state.pos);
      if (Rp.IS_IDENTIFIER_START[e]) Tk();
      else if (
        e === at.charCodes.quotationMark ||
        e === at.charCodes.apostrophe
      )
        yk(e);
      else
        switch ((++fe.state.pos, e)) {
          case at.charCodes.greaterThan:
            Se.finishToken.call(void 0, Me.TokenType.jsxTagEnd);
            break;
          case at.charCodes.lessThan:
            Se.finishToken.call(void 0, Me.TokenType.jsxTagStart);
            break;
          case at.charCodes.slash:
            Se.finishToken.call(void 0, Me.TokenType.slash);
            break;
          case at.charCodes.equalsTo:
            Se.finishToken.call(void 0, Me.TokenType.eq);
            break;
          case at.charCodes.leftCurlyBrace:
            Se.finishToken.call(void 0, Me.TokenType.braceL);
            break;
          case at.charCodes.dot:
            Se.finishToken.call(void 0, Me.TokenType.dot);
            break;
          case at.charCodes.colon:
            Se.finishToken.call(void 0, Me.TokenType.colon);
            break;
          default:
            fs.unexpected.call(void 0);
        }
    }
    fo.nextJSXTagToken = dn;
    function Ti() {
      fe.state.tokens.push(new Se.Token()),
        (fe.state.start = fe.state.pos),
        mk();
    }
  });
  var Bp = Z((yo) => {
    'use strict';
    Object.defineProperty(yo, '__esModule', {value: !0});
    var mo = xt(),
      ki = be(),
      Fp = Zt(),
      _k = Ns(),
      bk = Ji(),
      Ck = hi();
    function wk(e) {
      if (mo.match.call(void 0, ki.TokenType.question)) {
        let t = mo.lookaheadType.call(void 0);
        if (
          t === ki.TokenType.colon ||
          t === ki.TokenType.comma ||
          t === ki.TokenType.parenR
        )
          return;
      }
      _k.baseParseConditional.call(void 0, e);
    }
    yo.typedParseConditional = wk;
    function Sk() {
      mo.eatTypeToken.call(void 0, ki.TokenType.question),
        mo.match.call(void 0, ki.TokenType.colon) &&
          (Fp.isTypeScriptEnabled
            ? Ck.tsParseTypeAnnotation.call(void 0)
            : Fp.isFlowEnabled && bk.flowParseTypeAnnotation.call(void 0));
    }
    yo.typedParseParenItem = Sk;
  });
  var Ns = Z((et) => {
    'use strict';
    Object.defineProperty(et, '__esModule', {value: !0});
    var Yn = Ji(),
      Ik = vl(),
      Vp = Bp(),
      ms = hi(),
      K = xt(),
      zn = It(),
      jp = qr(),
      B = be(),
      $p = Qt(),
      Ek = li(),
      j = Zt(),
      ds = lo(),
      gn = nr(),
      Pe = cs(),
      vo = class {
        constructor(t) {
          this.stop = t;
        }
      };
    et.StopState = vo;
    function sr(e = !1) {
      if ((mn(e), K.match.call(void 0, B.TokenType.comma)))
        for (; K.eat.call(void 0, B.TokenType.comma); ) mn(e);
    }
    et.parseExpression = sr;
    function mn(e = !1, t = !1) {
      return j.isTypeScriptEnabled
        ? ms.tsParseMaybeAssign.call(void 0, e, t)
        : j.isFlowEnabled
        ? Yn.flowParseMaybeAssign.call(void 0, e, t)
        : qp(e, t);
    }
    et.parseMaybeAssign = mn;
    function qp(e, t) {
      if (K.match.call(void 0, B.TokenType._yield)) return Hk(), !1;
      (K.match.call(void 0, B.TokenType.parenL) ||
        K.match.call(void 0, B.TokenType.name) ||
        K.match.call(void 0, B.TokenType._yield)) &&
        (j.state.potentialArrowAt = j.state.start);
      let s = Ak(e);
      return (
        t && wl(),
        j.state.type & B.TokenType.IS_ASSIGN
          ? (K.next.call(void 0), mn(e), !1)
          : s
      );
    }
    et.baseParseMaybeAssign = qp;
    function Ak(e) {
      return Nk(e) ? !0 : (Pk(e), !1);
    }
    function Pk(e) {
      j.isTypeScriptEnabled || j.isFlowEnabled
        ? Vp.typedParseConditional.call(void 0, e)
        : Kp(e);
    }
    function Kp(e) {
      K.eat.call(void 0, B.TokenType.question) &&
        (mn(), Pe.expect.call(void 0, B.TokenType.colon), mn(e));
    }
    et.baseParseConditional = Kp;
    function Nk(e) {
      let t = j.state.tokens.length;
      return rr() ? !0 : (To(t, -1, e), !1);
    }
    function To(e, t, s) {
      if (
        j.isTypeScriptEnabled &&
        (B.TokenType._in & B.TokenType.PRECEDENCE_MASK) > t &&
        !Pe.hasPrecedingLineBreak.call(void 0) &&
        (Pe.eatContextual.call(void 0, zn.ContextualKeyword._as) ||
          Pe.eatContextual.call(void 0, zn.ContextualKeyword._satisfies))
      ) {
        let r = K.pushTypeContext.call(void 0, 1);
        ms.tsParseType.call(void 0),
          K.popTypeContext.call(void 0, r),
          K.rescan_gt.call(void 0),
          To(e, t, s);
        return;
      }
      let i = j.state.type & B.TokenType.PRECEDENCE_MASK;
      if (i > 0 && (!s || !K.match.call(void 0, B.TokenType._in)) && i > t) {
        let r = j.state.type;
        K.next.call(void 0),
          r === B.TokenType.nullishCoalescing &&
            (j.state.tokens[j.state.tokens.length - 1].nullishStartIndex = e);
        let a = j.state.tokens.length;
        rr(),
          To(a, r & B.TokenType.IS_RIGHT_ASSOCIATIVE ? i - 1 : i, s),
          r === B.TokenType.nullishCoalescing &&
            (j.state.tokens[e].numNullishCoalesceStarts++,
            j.state.tokens[j.state.tokens.length - 1].numNullishCoalesceEnds++),
          To(e, t, s);
      }
    }
    function rr() {
      if (
        j.isTypeScriptEnabled &&
        !j.isJSXEnabled &&
        K.eat.call(void 0, B.TokenType.lessThan)
      )
        return ms.tsParseTypeAssertion.call(void 0), !1;
      if (
        Pe.isContextual.call(void 0, zn.ContextualKeyword._module) &&
        K.lookaheadCharCode.call(void 0) === $p.charCodes.leftCurlyBrace &&
        !Pe.hasFollowingLineBreak.call(void 0)
      )
        return Wk(), !1;
      if (j.state.type & B.TokenType.IS_PREFIX)
        return K.next.call(void 0), rr(), !1;
      if (Up()) return !0;
      for (
        ;
        j.state.type & B.TokenType.IS_POSTFIX &&
        !Pe.canInsertSemicolon.call(void 0);

      )
        j.state.type === B.TokenType.preIncDec &&
          (j.state.type = B.TokenType.postIncDec),
          K.next.call(void 0);
      return !1;
    }
    et.parseMaybeUnary = rr;
    function Up() {
      let e = j.state.tokens.length;
      return _o()
        ? !0
        : (bl(e),
          j.state.tokens.length > e &&
            j.state.tokens[e].isOptionalChainStart &&
            (j.state.tokens[j.state.tokens.length - 1].isOptionalChainEnd = !0),
          !1);
    }
    et.parseExprSubscripts = Up;
    function bl(e, t = !1) {
      j.isFlowEnabled ? Yn.flowParseSubscripts.call(void 0, e, t) : Hp(e, t);
    }
    function Hp(e, t = !1) {
      let s = new vo(!1);
      do Rk(e, t, s);
      while (!s.stop && !j.state.error);
    }
    et.baseParseSubscripts = Hp;
    function Rk(e, t, s) {
      j.isTypeScriptEnabled
        ? ms.tsParseSubscript.call(void 0, e, t, s)
        : j.isFlowEnabled
        ? Yn.flowParseSubscript.call(void 0, e, t, s)
        : Wp(e, t, s);
    }
    function Wp(e, t, s) {
      if (!t && K.eat.call(void 0, B.TokenType.doubleColon))
        Cl(), (s.stop = !0), bl(e, t);
      else if (K.match.call(void 0, B.TokenType.questionDot)) {
        if (
          ((j.state.tokens[e].isOptionalChainStart = !0),
          t && K.lookaheadType.call(void 0) === B.TokenType.parenL)
        ) {
          s.stop = !0;
          return;
        }
        K.next.call(void 0),
          (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          K.eat.call(void 0, B.TokenType.bracketL)
            ? (sr(), Pe.expect.call(void 0, B.TokenType.bracketR))
            : K.eat.call(void 0, B.TokenType.parenL)
            ? ko()
            : xo();
      } else if (K.eat.call(void 0, B.TokenType.dot))
        (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          xo();
      else if (K.eat.call(void 0, B.TokenType.bracketL))
        (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          sr(),
          Pe.expect.call(void 0, B.TokenType.bracketR);
      else if (!t && K.match.call(void 0, B.TokenType.parenL))
        if (Gp()) {
          let i = j.state.snapshot(),
            r = j.state.tokens.length;
          K.next.call(void 0),
            (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e);
          let a = j.getNextContextId.call(void 0);
          (j.state.tokens[j.state.tokens.length - 1].contextId = a),
            ko(),
            (j.state.tokens[j.state.tokens.length - 1].contextId = a),
            Lk() &&
              (j.state.restoreFromSnapshot(i),
              (s.stop = !0),
              j.state.scopeDepth++,
              gn.parseFunctionParams.call(void 0),
              Ok(r));
        } else {
          K.next.call(void 0),
            (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e);
          let i = j.getNextContextId.call(void 0);
          (j.state.tokens[j.state.tokens.length - 1].contextId = i),
            ko(),
            (j.state.tokens[j.state.tokens.length - 1].contextId = i);
        }
      else K.match.call(void 0, B.TokenType.backQuote) ? Sl() : (s.stop = !0);
    }
    et.baseParseSubscript = Wp;
    function Gp() {
      return (
        j.state.tokens[j.state.tokens.length - 1].contextualKeyword ===
          zn.ContextualKeyword._async && !Pe.canInsertSemicolon.call(void 0)
      );
    }
    et.atPossibleAsync = Gp;
    function ko() {
      let e = !0;
      for (; !K.eat.call(void 0, B.TokenType.parenR) && !j.state.error; ) {
        if (e) e = !1;
        else if (
          (Pe.expect.call(void 0, B.TokenType.comma),
          K.eat.call(void 0, B.TokenType.parenR))
        )
          break;
        Zp(!1);
      }
    }
    et.parseCallExpressionArguments = ko;
    function Lk() {
      return (
        K.match.call(void 0, B.TokenType.colon) ||
        K.match.call(void 0, B.TokenType.arrow)
      );
    }
    function Ok(e) {
      j.isTypeScriptEnabled
        ? ms.tsStartParseAsyncArrowFromCallExpression.call(void 0)
        : j.isFlowEnabled &&
          Yn.flowStartParseAsyncArrowFromCallExpression.call(void 0),
        Pe.expect.call(void 0, B.TokenType.arrow),
        ir(e);
    }
    function Cl() {
      let e = j.state.tokens.length;
      _o(), bl(e, !0);
    }
    function _o() {
      if (K.eat.call(void 0, B.TokenType.modulo)) return Xn(), !1;
      if (
        K.match.call(void 0, B.TokenType.jsxText) ||
        K.match.call(void 0, B.TokenType.jsxEmptyText)
      )
        return zp(), !1;
      if (K.match.call(void 0, B.TokenType.lessThan) && j.isJSXEnabled)
        return (
          (j.state.type = B.TokenType.jsxTagStart),
          Ik.jsxParseElement.call(void 0),
          K.next.call(void 0),
          !1
        );
      let e = j.state.potentialArrowAt === j.state.start;
      switch (j.state.type) {
        case B.TokenType.slash:
        case B.TokenType.assign:
          K.retokenizeSlashAsRegex.call(void 0);
        case B.TokenType._super:
        case B.TokenType._this:
        case B.TokenType.regexp:
        case B.TokenType.num:
        case B.TokenType.bigint:
        case B.TokenType.decimal:
        case B.TokenType.string:
        case B.TokenType._null:
        case B.TokenType._true:
        case B.TokenType._false:
          return K.next.call(void 0), !1;
        case B.TokenType._import:
          return (
            K.next.call(void 0),
            K.match.call(void 0, B.TokenType.dot) &&
              ((j.state.tokens[j.state.tokens.length - 1].type =
                B.TokenType.name),
              K.next.call(void 0),
              Xn()),
            !1
          );
        case B.TokenType.name: {
          let t = j.state.tokens.length,
            s = j.state.start,
            i = j.state.contextualKeyword;
          return (
            Xn(),
            i === zn.ContextualKeyword._await
              ? (Uk(), !1)
              : i === zn.ContextualKeyword._async &&
                K.match.call(void 0, B.TokenType._function) &&
                !Pe.canInsertSemicolon.call(void 0)
              ? (K.next.call(void 0), gn.parseFunction.call(void 0, s, !1), !1)
              : e &&
                i === zn.ContextualKeyword._async &&
                !Pe.canInsertSemicolon.call(void 0) &&
                K.match.call(void 0, B.TokenType.name)
              ? (j.state.scopeDepth++,
                ds.parseBindingIdentifier.call(void 0, !1),
                Pe.expect.call(void 0, B.TokenType.arrow),
                ir(t),
                !0)
              : K.match.call(void 0, B.TokenType._do) &&
                !Pe.canInsertSemicolon.call(void 0)
              ? (K.next.call(void 0), gn.parseBlock.call(void 0), !1)
              : e &&
                !Pe.canInsertSemicolon.call(void 0) &&
                K.match.call(void 0, B.TokenType.arrow)
              ? (j.state.scopeDepth++,
                ds.markPriorBindingIdentifier.call(void 0, !1),
                Pe.expect.call(void 0, B.TokenType.arrow),
                ir(t),
                !0)
              : ((j.state.tokens[j.state.tokens.length - 1].identifierRole =
                  K.IdentifierRole.Access),
                !1)
          );
        }
        case B.TokenType._do:
          return K.next.call(void 0), gn.parseBlock.call(void 0), !1;
        case B.TokenType.parenL:
          return Xp(e);
        case B.TokenType.bracketL:
          return K.next.call(void 0), Qp(B.TokenType.bracketR, !0), !1;
        case B.TokenType.braceL:
          return Yp(!1, !1), !1;
        case B.TokenType._function:
          return Dk(), !1;
        case B.TokenType.at:
          gn.parseDecorators.call(void 0);
        case B.TokenType._class:
          return gn.parseClass.call(void 0, !1), !1;
        case B.TokenType._new:
          return Bk(), !1;
        case B.TokenType.backQuote:
          return Sl(), !1;
        case B.TokenType.doubleColon:
          return K.next.call(void 0), Cl(), !1;
        case B.TokenType.hash: {
          let t = K.lookaheadCharCode.call(void 0);
          return (
            Ek.IS_IDENTIFIER_START[t] || t === $p.charCodes.backslash
              ? xo()
              : K.next.call(void 0),
            !1
          );
        }
        default:
          return Pe.unexpected.call(void 0), !1;
      }
    }
    et.parseExprAtom = _o;
    function xo() {
      K.eat.call(void 0, B.TokenType.hash), Xn();
    }
    function Dk() {
      let e = j.state.start;
      Xn(),
        K.eat.call(void 0, B.TokenType.dot) && Xn(),
        gn.parseFunction.call(void 0, e, !1);
    }
    function zp() {
      K.next.call(void 0);
    }
    et.parseLiteral = zp;
    function Mk() {
      Pe.expect.call(void 0, B.TokenType.parenL),
        sr(),
        Pe.expect.call(void 0, B.TokenType.parenR);
    }
    et.parseParenExpression = Mk;
    function Xp(e) {
      let t = j.state.snapshot(),
        s = j.state.tokens.length;
      Pe.expect.call(void 0, B.TokenType.parenL);
      let i = !0;
      for (; !K.match.call(void 0, B.TokenType.parenR) && !j.state.error; ) {
        if (i) i = !1;
        else if (
          (Pe.expect.call(void 0, B.TokenType.comma),
          K.match.call(void 0, B.TokenType.parenR))
        )
          break;
        if (K.match.call(void 0, B.TokenType.ellipsis)) {
          ds.parseRest.call(void 0, !1), wl();
          break;
        } else mn(!1, !0);
      }
      return (
        Pe.expect.call(void 0, B.TokenType.parenR),
        e && Fk() && gl()
          ? (j.state.restoreFromSnapshot(t),
            j.state.scopeDepth++,
            gn.parseFunctionParams.call(void 0),
            gl(),
            ir(s),
            j.state.error ? (j.state.restoreFromSnapshot(t), Xp(!1), !1) : !0)
          : !1
      );
    }
    function Fk() {
      return (
        K.match.call(void 0, B.TokenType.colon) ||
        !Pe.canInsertSemicolon.call(void 0)
      );
    }
    function gl() {
      return j.isTypeScriptEnabled
        ? ms.tsParseArrow.call(void 0)
        : j.isFlowEnabled
        ? Yn.flowParseArrow.call(void 0)
        : K.eat.call(void 0, B.TokenType.arrow);
    }
    et.parseArrow = gl;
    function wl() {
      (j.isTypeScriptEnabled || j.isFlowEnabled) &&
        Vp.typedParseParenItem.call(void 0);
    }
    function Bk() {
      if (
        (Pe.expect.call(void 0, B.TokenType._new),
        K.eat.call(void 0, B.TokenType.dot))
      ) {
        Xn();
        return;
      }
      Vk(),
        j.isFlowEnabled && Yn.flowStartParseNewArguments.call(void 0),
        K.eat.call(void 0, B.TokenType.parenL) && Qp(B.TokenType.parenR);
    }
    function Vk() {
      Cl(), K.eat.call(void 0, B.TokenType.questionDot);
    }
    function Sl() {
      for (
        K.nextTemplateToken.call(void 0), K.nextTemplateToken.call(void 0);
        !K.match.call(void 0, B.TokenType.backQuote) && !j.state.error;

      )
        Pe.expect.call(void 0, B.TokenType.dollarBraceL),
          sr(),
          K.nextTemplateToken.call(void 0),
          K.nextTemplateToken.call(void 0);
      K.next.call(void 0);
    }
    et.parseTemplate = Sl;
    function Yp(e, t) {
      let s = j.getNextContextId.call(void 0),
        i = !0;
      for (
        K.next.call(void 0),
          j.state.tokens[j.state.tokens.length - 1].contextId = s;
        !K.eat.call(void 0, B.TokenType.braceR) && !j.state.error;

      ) {
        if (i) i = !1;
        else if (
          (Pe.expect.call(void 0, B.TokenType.comma),
          K.eat.call(void 0, B.TokenType.braceR))
        )
          break;
        let r = !1;
        if (K.match.call(void 0, B.TokenType.ellipsis)) {
          let a = j.state.tokens.length;
          if (
            (ds.parseSpread.call(void 0),
            e &&
              (j.state.tokens.length === a + 2 &&
                ds.markPriorBindingIdentifier.call(void 0, t),
              K.eat.call(void 0, B.TokenType.braceR)))
          )
            break;
          continue;
        }
        e || (r = K.eat.call(void 0, B.TokenType.star)),
          !e && Pe.isContextual.call(void 0, zn.ContextualKeyword._async)
            ? (r && Pe.unexpected.call(void 0),
              Xn(),
              K.match.call(void 0, B.TokenType.colon) ||
                K.match.call(void 0, B.TokenType.parenL) ||
                K.match.call(void 0, B.TokenType.braceR) ||
                K.match.call(void 0, B.TokenType.eq) ||
                K.match.call(void 0, B.TokenType.comma) ||
                (K.match.call(void 0, B.TokenType.star) &&
                  (K.next.call(void 0), (r = !0)),
                go(s)))
            : go(s),
          Kk(e, t, s);
      }
      j.state.tokens[j.state.tokens.length - 1].contextId = s;
    }
    et.parseObj = Yp;
    function jk(e) {
      return (
        !e &&
        (K.match.call(void 0, B.TokenType.string) ||
          K.match.call(void 0, B.TokenType.num) ||
          K.match.call(void 0, B.TokenType.bracketL) ||
          K.match.call(void 0, B.TokenType.name) ||
          !!(j.state.type & B.TokenType.IS_KEYWORD))
      );
    }
    function $k(e, t) {
      let s = j.state.start;
      return K.match.call(void 0, B.TokenType.parenL)
        ? (e && Pe.unexpected.call(void 0), _l(s, !1), !0)
        : jk(e)
        ? (go(t), _l(s, !1), !0)
        : !1;
    }
    function qk(e, t) {
      if (K.eat.call(void 0, B.TokenType.colon)) {
        e ? ds.parseMaybeDefault.call(void 0, t) : mn(!1);
        return;
      }
      let s;
      e
        ? j.state.scopeDepth === 0
          ? (s = K.IdentifierRole.ObjectShorthandTopLevelDeclaration)
          : t
          ? (s = K.IdentifierRole.ObjectShorthandBlockScopedDeclaration)
          : (s = K.IdentifierRole.ObjectShorthandFunctionScopedDeclaration)
        : (s = K.IdentifierRole.ObjectShorthand),
        (j.state.tokens[j.state.tokens.length - 1].identifierRole = s),
        ds.parseMaybeDefault.call(void 0, t, !0);
    }
    function Kk(e, t, s) {
      j.isTypeScriptEnabled
        ? ms.tsStartParseObjPropValue.call(void 0)
        : j.isFlowEnabled && Yn.flowStartParseObjPropValue.call(void 0),
        $k(e, s) || qk(e, t);
    }
    function go(e) {
      j.isFlowEnabled && Yn.flowParseVariance.call(void 0),
        K.eat.call(void 0, B.TokenType.bracketL)
          ? ((j.state.tokens[j.state.tokens.length - 1].contextId = e),
            mn(),
            Pe.expect.call(void 0, B.TokenType.bracketR),
            (j.state.tokens[j.state.tokens.length - 1].contextId = e))
          : (K.match.call(void 0, B.TokenType.num) ||
            K.match.call(void 0, B.TokenType.string) ||
            K.match.call(void 0, B.TokenType.bigint) ||
            K.match.call(void 0, B.TokenType.decimal)
              ? _o()
              : xo(),
            (j.state.tokens[j.state.tokens.length - 1].identifierRole =
              K.IdentifierRole.ObjectKey),
            (j.state.tokens[j.state.tokens.length - 1].contextId = e));
    }
    et.parsePropertyName = go;
    function _l(e, t) {
      let s = j.getNextContextId.call(void 0);
      j.state.scopeDepth++;
      let i = j.state.tokens.length,
        r = t;
      gn.parseFunctionParams.call(void 0, r, s), Jp(e, s);
      let a = j.state.tokens.length;
      j.state.scopes.push(new jp.Scope(i, a, !0)), j.state.scopeDepth--;
    }
    et.parseMethod = _l;
    function ir(e) {
      Il(!0);
      let t = j.state.tokens.length;
      j.state.scopes.push(new jp.Scope(e, t, !0)), j.state.scopeDepth--;
    }
    et.parseArrowExpression = ir;
    function Jp(e, t = 0) {
      j.isTypeScriptEnabled
        ? ms.tsParseFunctionBodyAndFinish.call(void 0, e, t)
        : j.isFlowEnabled
        ? Yn.flowParseFunctionBodyAndFinish.call(void 0, t)
        : Il(!1, t);
    }
    et.parseFunctionBodyAndFinish = Jp;
    function Il(e, t = 0) {
      e && !K.match.call(void 0, B.TokenType.braceL)
        ? mn()
        : gn.parseBlock.call(void 0, !0, t);
    }
    et.parseFunctionBody = Il;
    function Qp(e, t = !1) {
      let s = !0;
      for (; !K.eat.call(void 0, e) && !j.state.error; ) {
        if (s) s = !1;
        else if (
          (Pe.expect.call(void 0, B.TokenType.comma), K.eat.call(void 0, e))
        )
          break;
        Zp(t);
      }
    }
    function Zp(e) {
      (e && K.match.call(void 0, B.TokenType.comma)) ||
        (K.match.call(void 0, B.TokenType.ellipsis)
          ? (ds.parseSpread.call(void 0), wl())
          : K.match.call(void 0, B.TokenType.question)
          ? K.next.call(void 0)
          : mn(!1, !0));
    }
    function Xn() {
      K.next.call(void 0),
        (j.state.tokens[j.state.tokens.length - 1].type = B.TokenType.name);
    }
    et.parseIdentifier = Xn;
    function Uk() {
      rr();
    }
    function Hk() {
      K.next.call(void 0),
        !K.match.call(void 0, B.TokenType.semi) &&
          !Pe.canInsertSemicolon.call(void 0) &&
          (K.eat.call(void 0, B.TokenType.star), mn());
    }
    function Wk() {
      Pe.expectContextual.call(void 0, zn.ContextualKeyword._module),
        Pe.expect.call(void 0, B.TokenType.braceL),
        gn.parseBlockBody.call(void 0, B.TokenType.braceR);
    }
  });
  var Ji = Z((Je) => {
    'use strict';
    Object.defineProperty(Je, '__esModule', {value: !0});
    var C = xt(),
      ye = It(),
      _ = be(),
      ue = Zt(),
      je = Ns(),
      ys = nr(),
      z = cs();
    function Gk(e) {
      return (
        (e.type === _.TokenType.name || !!(e.type & _.TokenType.IS_KEYWORD)) &&
        e.contextualKeyword !== ye.ContextualKeyword._from
      );
    }
    function Ln(e) {
      let t = C.pushTypeContext.call(void 0, 0);
      z.expect.call(void 0, e || _.TokenType.colon),
        Wt(),
        C.popTypeContext.call(void 0, t);
    }
    function eh() {
      z.expect.call(void 0, _.TokenType.modulo),
        z.expectContextual.call(void 0, ye.ContextualKeyword._checks),
        C.eat.call(void 0, _.TokenType.parenL) &&
          (je.parseExpression.call(void 0),
          z.expect.call(void 0, _.TokenType.parenR));
    }
    function Pl() {
      let e = C.pushTypeContext.call(void 0, 0);
      z.expect.call(void 0, _.TokenType.colon),
        C.match.call(void 0, _.TokenType.modulo)
          ? eh()
          : (Wt(), C.match.call(void 0, _.TokenType.modulo) && eh()),
        C.popTypeContext.call(void 0, e);
    }
    function zk() {
      C.next.call(void 0), Nl(!0);
    }
    function Xk() {
      C.next.call(void 0),
        je.parseIdentifier.call(void 0),
        C.match.call(void 0, _.TokenType.lessThan) && On(),
        z.expect.call(void 0, _.TokenType.parenL),
        Al(),
        z.expect.call(void 0, _.TokenType.parenR),
        Pl(),
        z.semicolon.call(void 0);
    }
    function El() {
      C.match.call(void 0, _.TokenType._class)
        ? zk()
        : C.match.call(void 0, _.TokenType._function)
        ? Xk()
        : C.match.call(void 0, _.TokenType._var)
        ? Yk()
        : z.eatContextual.call(void 0, ye.ContextualKeyword._module)
        ? C.eat.call(void 0, _.TokenType.dot)
          ? Zk()
          : Jk()
        : z.isContextual.call(void 0, ye.ContextualKeyword._type)
        ? e0()
        : z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
        ? t0()
        : z.isContextual.call(void 0, ye.ContextualKeyword._interface)
        ? n0()
        : C.match.call(void 0, _.TokenType._export)
        ? Qk()
        : z.unexpected.call(void 0);
    }
    function Yk() {
      C.next.call(void 0), oh(), z.semicolon.call(void 0);
    }
    function Jk() {
      for (
        C.match.call(void 0, _.TokenType.string)
          ? je.parseExprAtom.call(void 0)
          : je.parseIdentifier.call(void 0),
          z.expect.call(void 0, _.TokenType.braceL);
        !C.match.call(void 0, _.TokenType.braceR) && !ue.state.error;

      )
        C.match.call(void 0, _.TokenType._import)
          ? (C.next.call(void 0), ys.parseImport.call(void 0))
          : z.unexpected.call(void 0);
      z.expect.call(void 0, _.TokenType.braceR);
    }
    function Qk() {
      z.expect.call(void 0, _.TokenType._export),
        C.eat.call(void 0, _.TokenType._default)
          ? C.match.call(void 0, _.TokenType._function) ||
            C.match.call(void 0, _.TokenType._class)
            ? El()
            : (Wt(), z.semicolon.call(void 0))
          : C.match.call(void 0, _.TokenType._var) ||
            C.match.call(void 0, _.TokenType._function) ||
            C.match.call(void 0, _.TokenType._class) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
          ? El()
          : C.match.call(void 0, _.TokenType.star) ||
            C.match.call(void 0, _.TokenType.braceL) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._interface) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._type) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
          ? ys.parseExport.call(void 0)
          : z.unexpected.call(void 0);
    }
    function Zk() {
      z.expectContextual.call(void 0, ye.ContextualKeyword._exports),
        vi(),
        z.semicolon.call(void 0);
    }
    function e0() {
      C.next.call(void 0), Ll();
    }
    function t0() {
      C.next.call(void 0), Ol(!0);
    }
    function n0() {
      C.next.call(void 0), Nl();
    }
    function Nl(e = !1) {
      if (
        (So(),
        C.match.call(void 0, _.TokenType.lessThan) && On(),
        C.eat.call(void 0, _.TokenType._extends))
      )
        do bo();
        while (!e && C.eat.call(void 0, _.TokenType.comma));
      if (z.isContextual.call(void 0, ye.ContextualKeyword._mixins)) {
        C.next.call(void 0);
        do bo();
        while (C.eat.call(void 0, _.TokenType.comma));
      }
      if (z.isContextual.call(void 0, ye.ContextualKeyword._implements)) {
        C.next.call(void 0);
        do bo();
        while (C.eat.call(void 0, _.TokenType.comma));
      }
      Co(e, !1, e);
    }
    function bo() {
      sh(!1), C.match.call(void 0, _.TokenType.lessThan) && Rs();
    }
    function Rl() {
      Nl();
    }
    function So() {
      je.parseIdentifier.call(void 0);
    }
    function Ll() {
      So(),
        C.match.call(void 0, _.TokenType.lessThan) && On(),
        Ln(_.TokenType.eq),
        z.semicolon.call(void 0);
    }
    function Ol(e) {
      z.expectContextual.call(void 0, ye.ContextualKeyword._type),
        So(),
        C.match.call(void 0, _.TokenType.lessThan) && On(),
        C.match.call(void 0, _.TokenType.colon) && Ln(_.TokenType.colon),
        e || Ln(_.TokenType.eq),
        z.semicolon.call(void 0);
    }
    function s0() {
      Fl(), oh(), C.eat.call(void 0, _.TokenType.eq) && Wt();
    }
    function On() {
      let e = C.pushTypeContext.call(void 0, 0);
      C.match.call(void 0, _.TokenType.lessThan) ||
      C.match.call(void 0, _.TokenType.typeParameterStart)
        ? C.next.call(void 0)
        : z.unexpected.call(void 0);
      do
        s0(),
          C.match.call(void 0, _.TokenType.greaterThan) ||
            z.expect.call(void 0, _.TokenType.comma);
      while (!C.match.call(void 0, _.TokenType.greaterThan) && !ue.state.error);
      z.expect.call(void 0, _.TokenType.greaterThan),
        C.popTypeContext.call(void 0, e);
    }
    Je.flowParseTypeParameterDeclaration = On;
    function Rs() {
      let e = C.pushTypeContext.call(void 0, 0);
      for (
        z.expect.call(void 0, _.TokenType.lessThan);
        !C.match.call(void 0, _.TokenType.greaterThan) && !ue.state.error;

      )
        Wt(),
          C.match.call(void 0, _.TokenType.greaterThan) ||
            z.expect.call(void 0, _.TokenType.comma);
      z.expect.call(void 0, _.TokenType.greaterThan),
        C.popTypeContext.call(void 0, e);
    }
    function i0() {
      if (
        (z.expectContextual.call(void 0, ye.ContextualKeyword._interface),
        C.eat.call(void 0, _.TokenType._extends))
      )
        do bo();
        while (C.eat.call(void 0, _.TokenType.comma));
      Co(!1, !1, !1);
    }
    function Dl() {
      C.match.call(void 0, _.TokenType.num) ||
      C.match.call(void 0, _.TokenType.string)
        ? je.parseExprAtom.call(void 0)
        : je.parseIdentifier.call(void 0);
    }
    function r0() {
      C.lookaheadType.call(void 0) === _.TokenType.colon ? (Dl(), Ln()) : Wt(),
        z.expect.call(void 0, _.TokenType.bracketR),
        Ln();
    }
    function o0() {
      Dl(),
        z.expect.call(void 0, _.TokenType.bracketR),
        z.expect.call(void 0, _.TokenType.bracketR),
        C.match.call(void 0, _.TokenType.lessThan) ||
        C.match.call(void 0, _.TokenType.parenL)
          ? Ml()
          : (C.eat.call(void 0, _.TokenType.question), Ln());
    }
    function Ml() {
      for (
        C.match.call(void 0, _.TokenType.lessThan) && On(),
          z.expect.call(void 0, _.TokenType.parenL);
        !C.match.call(void 0, _.TokenType.parenR) &&
        !C.match.call(void 0, _.TokenType.ellipsis) &&
        !ue.state.error;

      )
        wo(),
          C.match.call(void 0, _.TokenType.parenR) ||
            z.expect.call(void 0, _.TokenType.comma);
      C.eat.call(void 0, _.TokenType.ellipsis) && wo(),
        z.expect.call(void 0, _.TokenType.parenR),
        Ln();
    }
    function a0() {
      Ml();
    }
    function Co(e, t, s) {
      let i;
      for (
        t && C.match.call(void 0, _.TokenType.braceBarL)
          ? (z.expect.call(void 0, _.TokenType.braceBarL),
            (i = _.TokenType.braceBarR))
          : (z.expect.call(void 0, _.TokenType.braceL),
            (i = _.TokenType.braceR));
        !C.match.call(void 0, i) && !ue.state.error;

      ) {
        if (s && z.isContextual.call(void 0, ye.ContextualKeyword._proto)) {
          let r = C.lookaheadType.call(void 0);
          r !== _.TokenType.colon &&
            r !== _.TokenType.question &&
            (C.next.call(void 0), (e = !1));
        }
        if (e && z.isContextual.call(void 0, ye.ContextualKeyword._static)) {
          let r = C.lookaheadType.call(void 0);
          r !== _.TokenType.colon &&
            r !== _.TokenType.question &&
            C.next.call(void 0);
        }
        if ((Fl(), C.eat.call(void 0, _.TokenType.bracketL)))
          C.eat.call(void 0, _.TokenType.bracketL) ? o0() : r0();
        else if (
          C.match.call(void 0, _.TokenType.parenL) ||
          C.match.call(void 0, _.TokenType.lessThan)
        )
          a0();
        else {
          if (
            z.isContextual.call(void 0, ye.ContextualKeyword._get) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._set)
          ) {
            let r = C.lookaheadType.call(void 0);
            (r === _.TokenType.name ||
              r === _.TokenType.string ||
              r === _.TokenType.num) &&
              C.next.call(void 0);
          }
          l0();
        }
        c0();
      }
      z.expect.call(void 0, i);
    }
    function l0() {
      if (C.match.call(void 0, _.TokenType.ellipsis)) {
        if (
          (z.expect.call(void 0, _.TokenType.ellipsis),
          C.eat.call(void 0, _.TokenType.comma) ||
            C.eat.call(void 0, _.TokenType.semi),
          C.match.call(void 0, _.TokenType.braceR))
        )
          return;
        Wt();
      } else
        Dl(),
          C.match.call(void 0, _.TokenType.lessThan) ||
          C.match.call(void 0, _.TokenType.parenL)
            ? Ml()
            : (C.eat.call(void 0, _.TokenType.question), Ln());
    }
    function c0() {
      !C.eat.call(void 0, _.TokenType.semi) &&
        !C.eat.call(void 0, _.TokenType.comma) &&
        !C.match.call(void 0, _.TokenType.braceR) &&
        !C.match.call(void 0, _.TokenType.braceBarR) &&
        z.unexpected.call(void 0);
    }
    function sh(e) {
      for (
        e || je.parseIdentifier.call(void 0);
        C.eat.call(void 0, _.TokenType.dot);

      )
        je.parseIdentifier.call(void 0);
    }
    function u0() {
      sh(!0), C.match.call(void 0, _.TokenType.lessThan) && Rs();
    }
    function p0() {
      z.expect.call(void 0, _.TokenType._typeof), ih();
    }
    function h0() {
      for (
        z.expect.call(void 0, _.TokenType.bracketL);
        ue.state.pos < ue.input.length &&
        !C.match.call(void 0, _.TokenType.bracketR) &&
        (Wt(), !C.match.call(void 0, _.TokenType.bracketR));

      )
        z.expect.call(void 0, _.TokenType.comma);
      z.expect.call(void 0, _.TokenType.bracketR);
    }
    function wo() {
      let e = C.lookaheadType.call(void 0);
      e === _.TokenType.colon || e === _.TokenType.question
        ? (je.parseIdentifier.call(void 0),
          C.eat.call(void 0, _.TokenType.question),
          Ln())
        : Wt();
    }
    function Al() {
      for (
        ;
        !C.match.call(void 0, _.TokenType.parenR) &&
        !C.match.call(void 0, _.TokenType.ellipsis) &&
        !ue.state.error;

      )
        wo(),
          C.match.call(void 0, _.TokenType.parenR) ||
            z.expect.call(void 0, _.TokenType.comma);
      C.eat.call(void 0, _.TokenType.ellipsis) && wo();
    }
    function ih() {
      let e = !1,
        t = ue.state.noAnonFunctionType;
      switch (ue.state.type) {
        case _.TokenType.name: {
          if (z.isContextual.call(void 0, ye.ContextualKeyword._interface)) {
            i0();
            return;
          }
          je.parseIdentifier.call(void 0), u0();
          return;
        }
        case _.TokenType.braceL:
          Co(!1, !1, !1);
          return;
        case _.TokenType.braceBarL:
          Co(!1, !0, !1);
          return;
        case _.TokenType.bracketL:
          h0();
          return;
        case _.TokenType.lessThan:
          On(),
            z.expect.call(void 0, _.TokenType.parenL),
            Al(),
            z.expect.call(void 0, _.TokenType.parenR),
            z.expect.call(void 0, _.TokenType.arrow),
            Wt();
          return;
        case _.TokenType.parenL:
          if (
            (C.next.call(void 0),
            !C.match.call(void 0, _.TokenType.parenR) &&
              !C.match.call(void 0, _.TokenType.ellipsis))
          )
            if (C.match.call(void 0, _.TokenType.name)) {
              let s = C.lookaheadType.call(void 0);
              e = s !== _.TokenType.question && s !== _.TokenType.colon;
            } else e = !0;
          if (e)
            if (
              ((ue.state.noAnonFunctionType = !1),
              Wt(),
              (ue.state.noAnonFunctionType = t),
              ue.state.noAnonFunctionType ||
                !(
                  C.match.call(void 0, _.TokenType.comma) ||
                  (C.match.call(void 0, _.TokenType.parenR) &&
                    C.lookaheadType.call(void 0) === _.TokenType.arrow)
                ))
            ) {
              z.expect.call(void 0, _.TokenType.parenR);
              return;
            } else C.eat.call(void 0, _.TokenType.comma);
          Al(),
            z.expect.call(void 0, _.TokenType.parenR),
            z.expect.call(void 0, _.TokenType.arrow),
            Wt();
          return;
        case _.TokenType.minus:
          C.next.call(void 0), je.parseLiteral.call(void 0);
          return;
        case _.TokenType.string:
        case _.TokenType.num:
        case _.TokenType._true:
        case _.TokenType._false:
        case _.TokenType._null:
        case _.TokenType._this:
        case _.TokenType._void:
        case _.TokenType.star:
          C.next.call(void 0);
          return;
        default:
          if (ue.state.type === _.TokenType._typeof) {
            p0();
            return;
          } else if (ue.state.type & _.TokenType.IS_KEYWORD) {
            C.next.call(void 0),
              (ue.state.tokens[ue.state.tokens.length - 1].type =
                _.TokenType.name);
            return;
          }
      }
      z.unexpected.call(void 0);
    }
    function f0() {
      for (
        ih();
        !z.canInsertSemicolon.call(void 0) &&
        (C.match.call(void 0, _.TokenType.bracketL) ||
          C.match.call(void 0, _.TokenType.questionDot));

      )
        C.eat.call(void 0, _.TokenType.questionDot),
          z.expect.call(void 0, _.TokenType.bracketL),
          C.eat.call(void 0, _.TokenType.bracketR) ||
            (Wt(), z.expect.call(void 0, _.TokenType.bracketR));
    }
    function rh() {
      C.eat.call(void 0, _.TokenType.question) ? rh() : f0();
    }
    function th() {
      rh(),
        !ue.state.noAnonFunctionType &&
          C.eat.call(void 0, _.TokenType.arrow) &&
          Wt();
    }
    function nh() {
      for (
        C.eat.call(void 0, _.TokenType.bitwiseAND), th();
        C.eat.call(void 0, _.TokenType.bitwiseAND);

      )
        th();
    }
    function d0() {
      for (
        C.eat.call(void 0, _.TokenType.bitwiseOR), nh();
        C.eat.call(void 0, _.TokenType.bitwiseOR);

      )
        nh();
    }
    function Wt() {
      d0();
    }
    function vi() {
      Ln();
    }
    Je.flowParseTypeAnnotation = vi;
    function oh() {
      je.parseIdentifier.call(void 0),
        C.match.call(void 0, _.TokenType.colon) && vi();
    }
    function Fl() {
      (C.match.call(void 0, _.TokenType.plus) ||
        C.match.call(void 0, _.TokenType.minus)) &&
        (C.next.call(void 0),
        (ue.state.tokens[ue.state.tokens.length - 1].isType = !0));
    }
    Je.flowParseVariance = Fl;
    function m0(e) {
      C.match.call(void 0, _.TokenType.colon) && Pl(),
        je.parseFunctionBody.call(void 0, !1, e);
    }
    Je.flowParseFunctionBodyAndFinish = m0;
    function y0(e, t, s) {
      if (
        C.match.call(void 0, _.TokenType.questionDot) &&
        C.lookaheadType.call(void 0) === _.TokenType.lessThan
      ) {
        if (t) {
          s.stop = !0;
          return;
        }
        C.next.call(void 0),
          Rs(),
          z.expect.call(void 0, _.TokenType.parenL),
          je.parseCallExpressionArguments.call(void 0);
        return;
      } else if (!t && C.match.call(void 0, _.TokenType.lessThan)) {
        let i = ue.state.snapshot();
        if (
          (Rs(),
          z.expect.call(void 0, _.TokenType.parenL),
          je.parseCallExpressionArguments.call(void 0),
          ue.state.error)
        )
          ue.state.restoreFromSnapshot(i);
        else return;
      }
      je.baseParseSubscript.call(void 0, e, t, s);
    }
    Je.flowParseSubscript = y0;
    function T0() {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let e = ue.state.snapshot();
        Rs(), ue.state.error && ue.state.restoreFromSnapshot(e);
      }
    }
    Je.flowStartParseNewArguments = T0;
    function k0() {
      if (
        C.match.call(void 0, _.TokenType.name) &&
        ue.state.contextualKeyword === ye.ContextualKeyword._interface
      ) {
        let e = C.pushTypeContext.call(void 0, 0);
        return C.next.call(void 0), Rl(), C.popTypeContext.call(void 0, e), !0;
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._enum))
        return ah(), !0;
      return !1;
    }
    Je.flowTryParseStatement = k0;
    function v0() {
      return z.isContextual.call(void 0, ye.ContextualKeyword._enum)
        ? (ah(), !0)
        : !1;
    }
    Je.flowTryParseExportDefaultExpression = v0;
    function x0(e) {
      if (e === ye.ContextualKeyword._declare) {
        if (
          C.match.call(void 0, _.TokenType._class) ||
          C.match.call(void 0, _.TokenType.name) ||
          C.match.call(void 0, _.TokenType._function) ||
          C.match.call(void 0, _.TokenType._var) ||
          C.match.call(void 0, _.TokenType._export)
        ) {
          let t = C.pushTypeContext.call(void 0, 1);
          El(), C.popTypeContext.call(void 0, t);
        }
      } else if (C.match.call(void 0, _.TokenType.name)) {
        if (e === ye.ContextualKeyword._interface) {
          let t = C.pushTypeContext.call(void 0, 1);
          Rl(), C.popTypeContext.call(void 0, t);
        } else if (e === ye.ContextualKeyword._type) {
          let t = C.pushTypeContext.call(void 0, 1);
          Ll(), C.popTypeContext.call(void 0, t);
        } else if (e === ye.ContextualKeyword._opaque) {
          let t = C.pushTypeContext.call(void 0, 1);
          Ol(!1), C.popTypeContext.call(void 0, t);
        }
      }
      z.semicolon.call(void 0);
    }
    Je.flowParseIdentifierStatement = x0;
    function g0() {
      return (
        z.isContextual.call(void 0, ye.ContextualKeyword._type) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._interface) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._opaque) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._enum)
      );
    }
    Je.flowShouldParseExportDeclaration = g0;
    function _0() {
      return (
        C.match.call(void 0, _.TokenType.name) &&
        (ue.state.contextualKeyword === ye.ContextualKeyword._type ||
          ue.state.contextualKeyword === ye.ContextualKeyword._interface ||
          ue.state.contextualKeyword === ye.ContextualKeyword._opaque ||
          ue.state.contextualKeyword === ye.ContextualKeyword._enum)
      );
    }
    Je.flowShouldDisallowExportDefaultSpecifier = _0;
    function b0() {
      if (z.isContextual.call(void 0, ye.ContextualKeyword._type)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0),
          C.match.call(void 0, _.TokenType.braceL)
            ? (ys.parseExportSpecifiers.call(void 0),
              ys.parseExportFrom.call(void 0))
            : Ll(),
          C.popTypeContext.call(void 0, e);
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._opaque)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0), Ol(!1), C.popTypeContext.call(void 0, e);
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._interface)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0), Rl(), C.popTypeContext.call(void 0, e);
      } else ys.parseStatement.call(void 0, !0);
    }
    Je.flowParseExportDeclaration = b0;
    function C0() {
      return (
        C.match.call(void 0, _.TokenType.star) ||
        (z.isContextual.call(void 0, ye.ContextualKeyword._type) &&
          C.lookaheadType.call(void 0) === _.TokenType.star)
      );
    }
    Je.flowShouldParseExportStar = C0;
    function w0() {
      if (z.eatContextual.call(void 0, ye.ContextualKeyword._type)) {
        let e = C.pushTypeContext.call(void 0, 2);
        ys.baseParseExportStar.call(void 0), C.popTypeContext.call(void 0, e);
      } else ys.baseParseExportStar.call(void 0);
    }
    Je.flowParseExportStar = w0;
    function S0(e) {
      if (
        (e && C.match.call(void 0, _.TokenType.lessThan) && Rs(),
        z.isContextual.call(void 0, ye.ContextualKeyword._implements))
      ) {
        let t = C.pushTypeContext.call(void 0, 0);
        C.next.call(void 0),
          (ue.state.tokens[ue.state.tokens.length - 1].type =
            _.TokenType._implements);
        do So(), C.match.call(void 0, _.TokenType.lessThan) && Rs();
        while (C.eat.call(void 0, _.TokenType.comma));
        C.popTypeContext.call(void 0, t);
      }
    }
    Je.flowAfterParseClassSuper = S0;
    function I0() {
      C.match.call(void 0, _.TokenType.lessThan) &&
        (On(),
        C.match.call(void 0, _.TokenType.parenL) || z.unexpected.call(void 0));
    }
    Je.flowStartParseObjPropValue = I0;
    function E0() {
      let e = C.pushTypeContext.call(void 0, 0);
      C.eat.call(void 0, _.TokenType.question),
        C.match.call(void 0, _.TokenType.colon) && vi(),
        C.popTypeContext.call(void 0, e);
    }
    Je.flowParseAssignableListItemTypes = E0;
    function A0() {
      if (
        C.match.call(void 0, _.TokenType._typeof) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._type)
      ) {
        let e = C.lookaheadTypeAndKeyword.call(void 0);
        (Gk(e) ||
          e.type === _.TokenType.braceL ||
          e.type === _.TokenType.star) &&
          C.next.call(void 0);
      }
    }
    Je.flowStartParseImportSpecifiers = A0;
    function P0() {
      let e =
        ue.state.contextualKeyword === ye.ContextualKeyword._type ||
        ue.state.type === _.TokenType._typeof;
      e ? C.next.call(void 0) : je.parseIdentifier.call(void 0),
        z.isContextual.call(void 0, ye.ContextualKeyword._as) &&
        !z.isLookaheadContextual.call(void 0, ye.ContextualKeyword._as)
          ? (je.parseIdentifier.call(void 0),
            (e &&
              !C.match.call(void 0, _.TokenType.name) &&
              !(ue.state.type & _.TokenType.IS_KEYWORD)) ||
              je.parseIdentifier.call(void 0))
          : (e &&
              (C.match.call(void 0, _.TokenType.name) ||
                ue.state.type & _.TokenType.IS_KEYWORD) &&
              je.parseIdentifier.call(void 0),
            z.eatContextual.call(void 0, ye.ContextualKeyword._as) &&
              je.parseIdentifier.call(void 0));
    }
    Je.flowParseImportSpecifier = P0;
    function N0() {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let e = C.pushTypeContext.call(void 0, 0);
        On(), C.popTypeContext.call(void 0, e);
      }
    }
    Je.flowStartParseFunctionParams = N0;
    function R0() {
      C.match.call(void 0, _.TokenType.colon) && vi();
    }
    Je.flowAfterParseVarHead = R0;
    function L0() {
      if (C.match.call(void 0, _.TokenType.colon)) {
        let e = ue.state.noAnonFunctionType;
        (ue.state.noAnonFunctionType = !0),
          vi(),
          (ue.state.noAnonFunctionType = e);
      }
    }
    Je.flowStartParseAsyncArrowFromCallExpression = L0;
    function O0(e, t) {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let s = ue.state.snapshot(),
          i = je.baseParseMaybeAssign.call(void 0, e, t);
        if (ue.state.error)
          ue.state.restoreFromSnapshot(s),
            (ue.state.type = _.TokenType.typeParameterStart);
        else return i;
        let r = C.pushTypeContext.call(void 0, 0);
        if (
          (On(),
          C.popTypeContext.call(void 0, r),
          (i = je.baseParseMaybeAssign.call(void 0, e, t)),
          i)
        )
          return !0;
        z.unexpected.call(void 0);
      }
      return je.baseParseMaybeAssign.call(void 0, e, t);
    }
    Je.flowParseMaybeAssign = O0;
    function D0() {
      if (C.match.call(void 0, _.TokenType.colon)) {
        let e = C.pushTypeContext.call(void 0, 0),
          t = ue.state.snapshot(),
          s = ue.state.noAnonFunctionType;
        (ue.state.noAnonFunctionType = !0),
          Pl(),
          (ue.state.noAnonFunctionType = s),
          z.canInsertSemicolon.call(void 0) && z.unexpected.call(void 0),
          C.match.call(void 0, _.TokenType.arrow) || z.unexpected.call(void 0),
          ue.state.error && ue.state.restoreFromSnapshot(t),
          C.popTypeContext.call(void 0, e);
      }
      return C.eat.call(void 0, _.TokenType.arrow);
    }
    Je.flowParseArrow = D0;
    function M0(e, t = !1) {
      if (
        ue.state.tokens[ue.state.tokens.length - 1].contextualKeyword ===
          ye.ContextualKeyword._async &&
        C.match.call(void 0, _.TokenType.lessThan)
      ) {
        let s = ue.state.snapshot();
        if (F0() && !ue.state.error) return;
        ue.state.restoreFromSnapshot(s);
      }
      je.baseParseSubscripts.call(void 0, e, t);
    }
    Je.flowParseSubscripts = M0;
    function F0() {
      ue.state.scopeDepth++;
      let e = ue.state.tokens.length;
      return (
        ys.parseFunctionParams.call(void 0),
        je.parseArrow.call(void 0)
          ? (je.parseArrowExpression.call(void 0, e), !0)
          : !1
      );
    }
    function ah() {
      z.expectContextual.call(void 0, ye.ContextualKeyword._enum),
        (ue.state.tokens[ue.state.tokens.length - 1].type = _.TokenType._enum),
        je.parseIdentifier.call(void 0),
        B0();
    }
    function B0() {
      z.eatContextual.call(void 0, ye.ContextualKeyword._of) &&
        C.next.call(void 0),
        z.expect.call(void 0, _.TokenType.braceL),
        V0(),
        z.expect.call(void 0, _.TokenType.braceR);
    }
    function V0() {
      for (
        ;
        !C.match.call(void 0, _.TokenType.braceR) &&
        !ue.state.error &&
        !C.eat.call(void 0, _.TokenType.ellipsis);

      )
        j0(),
          C.match.call(void 0, _.TokenType.braceR) ||
            z.expect.call(void 0, _.TokenType.comma);
    }
    function j0() {
      je.parseIdentifier.call(void 0),
        C.eat.call(void 0, _.TokenType.eq) && C.next.call(void 0);
    }
  });
  var nr = Z((Tt) => {
    'use strict';
    Object.defineProperty(Tt, '__esModule', {value: !0});
    var $0 = Ul(),
      Ft = Ji(),
      dt = hi(),
      $ = xt(),
      ke = It(),
      Ts = qr(),
      D = be(),
      lh = Qt(),
      P = Zt(),
      De = Ns(),
      ks = lo(),
      ee = cs();
    function q0() {
      if (
        (ql(D.TokenType.eof),
        P.state.scopes.push(new Ts.Scope(0, P.state.tokens.length, !0)),
        P.state.scopeDepth !== 0)
      )
        throw new Error(
          `Invalid scope depth at end of file: ${P.state.scopeDepth}`
        );
      return new $0.File(P.state.tokens, P.state.scopes);
    }
    Tt.parseTopLevel = q0;
    function _n(e) {
      (P.isFlowEnabled && Ft.flowTryParseStatement.call(void 0)) ||
        ($.match.call(void 0, D.TokenType.at) && $l(), K0(e));
    }
    Tt.parseStatement = _n;
    function K0(e) {
      if (P.isTypeScriptEnabled && dt.tsTryParseStatementContent.call(void 0))
        return;
      let t = P.state.type;
      switch (t) {
        case D.TokenType._break:
        case D.TokenType._continue:
          H0();
          return;
        case D.TokenType._debugger:
          W0();
          return;
        case D.TokenType._do:
          G0();
          return;
        case D.TokenType._for:
          z0();
          return;
        case D.TokenType._function:
          if ($.lookaheadType.call(void 0) === D.TokenType.dot) break;
          e || ee.unexpected.call(void 0), J0();
          return;
        case D.TokenType._class:
          e || ee.unexpected.call(void 0), Io(!0);
          return;
        case D.TokenType._if:
          Q0();
          return;
        case D.TokenType._return:
          Z0();
          return;
        case D.TokenType._switch:
          ev();
          return;
        case D.TokenType._throw:
          tv();
          return;
        case D.TokenType._try:
          sv();
          return;
        case D.TokenType._let:
        case D.TokenType._const:
          e || ee.unexpected.call(void 0);
        case D.TokenType._var:
          Vl(t !== D.TokenType._var);
          return;
        case D.TokenType._while:
          iv();
          return;
        case D.TokenType.braceL:
          gi();
          return;
        case D.TokenType.semi:
          rv();
          return;
        case D.TokenType._export:
        case D.TokenType._import: {
          let r = $.lookaheadType.call(void 0);
          if (r === D.TokenType.parenL || r === D.TokenType.dot) break;
          $.next.call(void 0), t === D.TokenType._import ? xh() : Th();
          return;
        }
        case D.TokenType.name:
          if (P.state.contextualKeyword === ke.ContextualKeyword._async) {
            let r = P.state.start,
              a = P.state.snapshot();
            if (
              ($.next.call(void 0),
              $.match.call(void 0, D.TokenType._function) &&
                !ee.canInsertSemicolon.call(void 0))
            ) {
              ee.expect.call(void 0, D.TokenType._function), lr(r, !0);
              return;
            } else P.state.restoreFromSnapshot(a);
          } else if (
            P.state.contextualKeyword === ke.ContextualKeyword._using &&
            !ee.hasFollowingLineBreak.call(void 0) &&
            $.lookaheadType.call(void 0) === D.TokenType.name
          ) {
            Vl(!0);
            return;
          }
        default:
          break;
      }
      let s = P.state.tokens.length;
      De.parseExpression.call(void 0);
      let i = null;
      if (P.state.tokens.length === s + 1) {
        let r = P.state.tokens[P.state.tokens.length - 1];
        r.type === D.TokenType.name && (i = r.contextualKeyword);
      }
      if (i == null) {
        ee.semicolon.call(void 0);
        return;
      }
      $.eat.call(void 0, D.TokenType.colon) ? ov() : av(i);
    }
    function $l() {
      for (; $.match.call(void 0, D.TokenType.at); ) ph();
    }
    Tt.parseDecorators = $l;
    function ph() {
      if (($.next.call(void 0), $.eat.call(void 0, D.TokenType.parenL)))
        De.parseExpression.call(void 0),
          ee.expect.call(void 0, D.TokenType.parenR);
      else {
        for (
          De.parseIdentifier.call(void 0);
          $.eat.call(void 0, D.TokenType.dot);

        )
          De.parseIdentifier.call(void 0);
        U0();
      }
    }
    function U0() {
      P.isTypeScriptEnabled
        ? dt.tsParseMaybeDecoratorArguments.call(void 0)
        : hh();
    }
    function hh() {
      $.eat.call(void 0, D.TokenType.parenL) &&
        De.parseCallExpressionArguments.call(void 0);
    }
    Tt.baseParseMaybeDecoratorArguments = hh;
    function H0() {
      $.next.call(void 0),
        ee.isLineTerminator.call(void 0) ||
          (De.parseIdentifier.call(void 0), ee.semicolon.call(void 0));
    }
    function W0() {
      $.next.call(void 0), ee.semicolon.call(void 0);
    }
    function G0() {
      $.next.call(void 0),
        _n(!1),
        ee.expect.call(void 0, D.TokenType._while),
        De.parseParenExpression.call(void 0),
        $.eat.call(void 0, D.TokenType.semi);
    }
    function z0() {
      P.state.scopeDepth++;
      let e = P.state.tokens.length;
      Y0();
      let t = P.state.tokens.length;
      P.state.scopes.push(new Ts.Scope(e, t, !1)), P.state.scopeDepth--;
    }
    function X0() {
      return !(
        !ee.isContextual.call(void 0, ke.ContextualKeyword._using) ||
        ee.isLookaheadContextual.call(void 0, ke.ContextualKeyword._of)
      );
    }
    function Y0() {
      $.next.call(void 0);
      let e = !1;
      if (
        (ee.isContextual.call(void 0, ke.ContextualKeyword._await) &&
          ((e = !0), $.next.call(void 0)),
        ee.expect.call(void 0, D.TokenType.parenL),
        $.match.call(void 0, D.TokenType.semi))
      ) {
        e && ee.unexpected.call(void 0), Bl();
        return;
      }
      if (
        $.match.call(void 0, D.TokenType._var) ||
        $.match.call(void 0, D.TokenType._let) ||
        $.match.call(void 0, D.TokenType._const) ||
        X0()
      ) {
        if (
          ($.next.call(void 0),
          fh(!0, P.state.type !== D.TokenType._var),
          $.match.call(void 0, D.TokenType._in) ||
            ee.isContextual.call(void 0, ke.ContextualKeyword._of))
        ) {
          ch(e);
          return;
        }
        Bl();
        return;
      }
      if (
        (De.parseExpression.call(void 0, !0),
        $.match.call(void 0, D.TokenType._in) ||
          ee.isContextual.call(void 0, ke.ContextualKeyword._of))
      ) {
        ch(e);
        return;
      }
      e && ee.unexpected.call(void 0), Bl();
    }
    function J0() {
      let e = P.state.start;
      $.next.call(void 0), lr(e, !0);
    }
    function Q0() {
      $.next.call(void 0),
        De.parseParenExpression.call(void 0),
        _n(!1),
        $.eat.call(void 0, D.TokenType._else) && _n(!1);
    }
    function Z0() {
      $.next.call(void 0),
        ee.isLineTerminator.call(void 0) ||
          (De.parseExpression.call(void 0), ee.semicolon.call(void 0));
    }
    function ev() {
      $.next.call(void 0),
        De.parseParenExpression.call(void 0),
        P.state.scopeDepth++;
      let e = P.state.tokens.length;
      for (
        ee.expect.call(void 0, D.TokenType.braceL);
        !$.match.call(void 0, D.TokenType.braceR) && !P.state.error;

      )
        if (
          $.match.call(void 0, D.TokenType._case) ||
          $.match.call(void 0, D.TokenType._default)
        ) {
          let s = $.match.call(void 0, D.TokenType._case);
          $.next.call(void 0),
            s && De.parseExpression.call(void 0),
            ee.expect.call(void 0, D.TokenType.colon);
        } else _n(!0);
      $.next.call(void 0);
      let t = P.state.tokens.length;
      P.state.scopes.push(new Ts.Scope(e, t, !1)), P.state.scopeDepth--;
    }
    function tv() {
      $.next.call(void 0),
        De.parseExpression.call(void 0),
        ee.semicolon.call(void 0);
    }
    function nv() {
      ks.parseBindingAtom.call(void 0, !0),
        P.isTypeScriptEnabled && dt.tsTryParseTypeAnnotation.call(void 0);
    }
    function sv() {
      if (
        ($.next.call(void 0), gi(), $.match.call(void 0, D.TokenType._catch))
      ) {
        $.next.call(void 0);
        let e = null;
        if (
          ($.match.call(void 0, D.TokenType.parenL) &&
            (P.state.scopeDepth++,
            (e = P.state.tokens.length),
            ee.expect.call(void 0, D.TokenType.parenL),
            nv(),
            ee.expect.call(void 0, D.TokenType.parenR)),
          gi(),
          e != null)
        ) {
          let t = P.state.tokens.length;
          P.state.scopes.push(new Ts.Scope(e, t, !1)), P.state.scopeDepth--;
        }
      }
      $.eat.call(void 0, D.TokenType._finally) && gi();
    }
    function Vl(e) {
      $.next.call(void 0), fh(!1, e), ee.semicolon.call(void 0);
    }
    Tt.parseVarStatement = Vl;
    function iv() {
      $.next.call(void 0), De.parseParenExpression.call(void 0), _n(!1);
    }
    function rv() {
      $.next.call(void 0);
    }
    function ov() {
      _n(!0);
    }
    function av(e) {
      P.isTypeScriptEnabled
        ? dt.tsParseIdentifierStatement.call(void 0, e)
        : P.isFlowEnabled
        ? Ft.flowParseIdentifierStatement.call(void 0, e)
        : ee.semicolon.call(void 0);
    }
    function gi(e = !1, t = 0) {
      let s = P.state.tokens.length;
      P.state.scopeDepth++,
        ee.expect.call(void 0, D.TokenType.braceL),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t),
        ql(D.TokenType.braceR),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t);
      let i = P.state.tokens.length;
      P.state.scopes.push(new Ts.Scope(s, i, e)), P.state.scopeDepth--;
    }
    Tt.parseBlock = gi;
    function ql(e) {
      for (; !$.eat.call(void 0, e) && !P.state.error; ) _n(!0);
    }
    Tt.parseBlockBody = ql;
    function Bl() {
      ee.expect.call(void 0, D.TokenType.semi),
        $.match.call(void 0, D.TokenType.semi) ||
          De.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.semi),
        $.match.call(void 0, D.TokenType.parenR) ||
          De.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenR),
        _n(!1);
    }
    function ch(e) {
      e
        ? ee.eatContextual.call(void 0, ke.ContextualKeyword._of)
        : $.next.call(void 0),
        De.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenR),
        _n(!1);
    }
    function fh(e, t) {
      for (;;) {
        if ((lv(t), $.eat.call(void 0, D.TokenType.eq))) {
          let s = P.state.tokens.length - 1;
          De.parseMaybeAssign.call(void 0, e),
            (P.state.tokens[s].rhsEndIndex = P.state.tokens.length);
        }
        if (!$.eat.call(void 0, D.TokenType.comma)) break;
      }
    }
    function lv(e) {
      ks.parseBindingAtom.call(void 0, e),
        P.isTypeScriptEnabled
          ? dt.tsAfterParseVarHead.call(void 0)
          : P.isFlowEnabled && Ft.flowAfterParseVarHead.call(void 0);
    }
    function lr(e, t, s = !1) {
      $.match.call(void 0, D.TokenType.star) && $.next.call(void 0),
        t &&
          !s &&
          !$.match.call(void 0, D.TokenType.name) &&
          !$.match.call(void 0, D.TokenType._yield) &&
          ee.unexpected.call(void 0);
      let i = null;
      $.match.call(void 0, D.TokenType.name) &&
        (t || ((i = P.state.tokens.length), P.state.scopeDepth++),
        ks.parseBindingIdentifier.call(void 0, !1));
      let r = P.state.tokens.length;
      P.state.scopeDepth++, dh(), De.parseFunctionBodyAndFinish.call(void 0, e);
      let a = P.state.tokens.length;
      P.state.scopes.push(new Ts.Scope(r, a, !0)),
        P.state.scopeDepth--,
        i !== null &&
          (P.state.scopes.push(new Ts.Scope(i, a, !0)), P.state.scopeDepth--);
    }
    Tt.parseFunction = lr;
    function dh(e = !1, t = 0) {
      P.isTypeScriptEnabled
        ? dt.tsStartParseFunctionParams.call(void 0)
        : P.isFlowEnabled && Ft.flowStartParseFunctionParams.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenL),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t),
        ks.parseBindingList.call(void 0, D.TokenType.parenR, !1, !1, e, t),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t);
    }
    Tt.parseFunctionParams = dh;
    function Io(e, t = !1) {
      let s = P.getNextContextId.call(void 0);
      $.next.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].contextId = s),
        (P.state.tokens[P.state.tokens.length - 1].isExpression = !e);
      let i = null;
      e || ((i = P.state.tokens.length), P.state.scopeDepth++), hv(e, t), fv();
      let r = P.state.tokens.length;
      if (
        (cv(s),
        !P.state.error &&
          ((P.state.tokens[r].contextId = s),
          (P.state.tokens[P.state.tokens.length - 1].contextId = s),
          i !== null))
      ) {
        let a = P.state.tokens.length;
        P.state.scopes.push(new Ts.Scope(i, a, !1)), P.state.scopeDepth--;
      }
    }
    Tt.parseClass = Io;
    function mh() {
      return (
        $.match.call(void 0, D.TokenType.eq) ||
        $.match.call(void 0, D.TokenType.semi) ||
        $.match.call(void 0, D.TokenType.braceR) ||
        $.match.call(void 0, D.TokenType.bang) ||
        $.match.call(void 0, D.TokenType.colon)
      );
    }
    function yh() {
      return (
        $.match.call(void 0, D.TokenType.parenL) ||
        $.match.call(void 0, D.TokenType.lessThan)
      );
    }
    function cv(e) {
      for (
        ee.expect.call(void 0, D.TokenType.braceL);
        !$.eat.call(void 0, D.TokenType.braceR) && !P.state.error;

      ) {
        if ($.eat.call(void 0, D.TokenType.semi)) continue;
        if ($.match.call(void 0, D.TokenType.at)) {
          ph();
          continue;
        }
        let t = P.state.start;
        uv(t, e);
      }
    }
    function uv(e, t) {
      P.isTypeScriptEnabled &&
        dt.tsParseModifiers.call(void 0, [
          ke.ContextualKeyword._declare,
          ke.ContextualKeyword._public,
          ke.ContextualKeyword._protected,
          ke.ContextualKeyword._private,
          ke.ContextualKeyword._override,
        ]);
      let s = !1;
      if (
        $.match.call(void 0, D.TokenType.name) &&
        P.state.contextualKeyword === ke.ContextualKeyword._static
      ) {
        if ((De.parseIdentifier.call(void 0), yh())) {
          or(e, !1);
          return;
        } else if (mh()) {
          ar();
          return;
        }
        if (
          ((P.state.tokens[P.state.tokens.length - 1].type =
            D.TokenType._static),
          (s = !0),
          $.match.call(void 0, D.TokenType.braceL))
        ) {
          (P.state.tokens[P.state.tokens.length - 1].contextId = t), gi();
          return;
        }
      }
      pv(e, s, t);
    }
    function pv(e, t, s) {
      if (
        P.isTypeScriptEnabled &&
        dt.tsTryParseClassMemberWithIsStatic.call(void 0, t)
      )
        return;
      if ($.eat.call(void 0, D.TokenType.star)) {
        xi(s), or(e, !1);
        return;
      }
      xi(s);
      let i = !1,
        r = P.state.tokens[P.state.tokens.length - 1];
      r.contextualKeyword === ke.ContextualKeyword._constructor && (i = !0),
        jl(),
        yh()
          ? or(e, i)
          : mh()
          ? ar()
          : r.contextualKeyword === ke.ContextualKeyword._async &&
            !ee.isLineTerminator.call(void 0)
          ? ((P.state.tokens[P.state.tokens.length - 1].type =
              D.TokenType._async),
            $.match.call(void 0, D.TokenType.star) && $.next.call(void 0),
            xi(s),
            jl(),
            or(e, !1))
          : (r.contextualKeyword === ke.ContextualKeyword._get ||
              r.contextualKeyword === ke.ContextualKeyword._set) &&
            !(
              ee.isLineTerminator.call(void 0) &&
              $.match.call(void 0, D.TokenType.star)
            )
          ? (r.contextualKeyword === ke.ContextualKeyword._get
              ? (P.state.tokens[P.state.tokens.length - 1].type =
                  D.TokenType._get)
              : (P.state.tokens[P.state.tokens.length - 1].type =
                  D.TokenType._set),
            xi(s),
            or(e, !1))
          : r.contextualKeyword === ke.ContextualKeyword._accessor &&
            !ee.isLineTerminator.call(void 0)
          ? (xi(s), ar())
          : ee.isLineTerminator.call(void 0)
          ? ar()
          : ee.unexpected.call(void 0);
    }
    function or(e, t) {
      P.isTypeScriptEnabled
        ? dt.tsTryParseTypeParameters.call(void 0)
        : P.isFlowEnabled &&
          $.match.call(void 0, D.TokenType.lessThan) &&
          Ft.flowParseTypeParameterDeclaration.call(void 0),
        De.parseMethod.call(void 0, e, t);
    }
    function xi(e) {
      De.parsePropertyName.call(void 0, e);
    }
    Tt.parseClassPropertyName = xi;
    function jl() {
      if (P.isTypeScriptEnabled) {
        let e = $.pushTypeContext.call(void 0, 0);
        $.eat.call(void 0, D.TokenType.question),
          $.popTypeContext.call(void 0, e);
      }
    }
    Tt.parsePostMemberNameModifiers = jl;
    function ar() {
      if (
        (P.isTypeScriptEnabled
          ? ($.eatTypeToken.call(void 0, D.TokenType.bang),
            dt.tsTryParseTypeAnnotation.call(void 0))
          : P.isFlowEnabled &&
            $.match.call(void 0, D.TokenType.colon) &&
            Ft.flowParseTypeAnnotation.call(void 0),
        $.match.call(void 0, D.TokenType.eq))
      ) {
        let e = P.state.tokens.length;
        $.next.call(void 0),
          De.parseMaybeAssign.call(void 0),
          (P.state.tokens[e].rhsEndIndex = P.state.tokens.length);
      }
      ee.semicolon.call(void 0);
    }
    Tt.parseClassProperty = ar;
    function hv(e, t = !1) {
      (P.isTypeScriptEnabled &&
        (!e || t) &&
        ee.isContextual.call(void 0, ke.ContextualKeyword._implements)) ||
        ($.match.call(void 0, D.TokenType.name) &&
          ks.parseBindingIdentifier.call(void 0, !0),
        P.isTypeScriptEnabled
          ? dt.tsTryParseTypeParameters.call(void 0)
          : P.isFlowEnabled &&
            $.match.call(void 0, D.TokenType.lessThan) &&
            Ft.flowParseTypeParameterDeclaration.call(void 0));
    }
    function fv() {
      let e = !1;
      $.eat.call(void 0, D.TokenType._extends)
        ? (De.parseExprSubscripts.call(void 0), (e = !0))
        : (e = !1),
        P.isTypeScriptEnabled
          ? dt.tsAfterParseClassSuper.call(void 0, e)
          : P.isFlowEnabled && Ft.flowAfterParseClassSuper.call(void 0, e);
    }
    function Th() {
      let e = P.state.tokens.length - 1;
      (P.isTypeScriptEnabled && dt.tsTryParseExport.call(void 0)) ||
        (Tv()
          ? kv()
          : yv()
          ? (De.parseIdentifier.call(void 0),
            $.match.call(void 0, D.TokenType.comma) &&
            $.lookaheadType.call(void 0) === D.TokenType.star
              ? (ee.expect.call(void 0, D.TokenType.comma),
                ee.expect.call(void 0, D.TokenType.star),
                ee.expectContextual.call(void 0, ke.ContextualKeyword._as),
                De.parseIdentifier.call(void 0))
              : kh(),
            cr())
          : $.eat.call(void 0, D.TokenType._default)
          ? dv()
          : xv()
          ? mv()
          : (Kl(), cr()),
        (P.state.tokens[e].rhsEndIndex = P.state.tokens.length));
    }
    Tt.parseExport = Th;
    function dv() {
      if (
        (P.isTypeScriptEnabled &&
          dt.tsTryParseExportDefaultExpression.call(void 0)) ||
        (P.isFlowEnabled && Ft.flowTryParseExportDefaultExpression.call(void 0))
      )
        return;
      let e = P.state.start;
      $.eat.call(void 0, D.TokenType._function)
        ? lr(e, !0, !0)
        : ee.isContextual.call(void 0, ke.ContextualKeyword._async) &&
          $.lookaheadType.call(void 0) === D.TokenType._function
        ? (ee.eatContextual.call(void 0, ke.ContextualKeyword._async),
          $.eat.call(void 0, D.TokenType._function),
          lr(e, !0, !0))
        : $.match.call(void 0, D.TokenType._class)
        ? Io(!0, !0)
        : $.match.call(void 0, D.TokenType.at)
        ? ($l(), Io(!0, !0))
        : (De.parseMaybeAssign.call(void 0), ee.semicolon.call(void 0));
    }
    function mv() {
      P.isTypeScriptEnabled
        ? dt.tsParseExportDeclaration.call(void 0)
        : P.isFlowEnabled
        ? Ft.flowParseExportDeclaration.call(void 0)
        : _n(!0);
    }
    function yv() {
      if (P.isTypeScriptEnabled && dt.tsIsDeclarationStart.call(void 0))
        return !1;
      if (
        P.isFlowEnabled &&
        Ft.flowShouldDisallowExportDefaultSpecifier.call(void 0)
      )
        return !1;
      if ($.match.call(void 0, D.TokenType.name))
        return P.state.contextualKeyword !== ke.ContextualKeyword._async;
      if (!$.match.call(void 0, D.TokenType._default)) return !1;
      let e = $.nextTokenStart.call(void 0),
        t = $.lookaheadTypeAndKeyword.call(void 0),
        s =
          t.type === D.TokenType.name &&
          t.contextualKeyword === ke.ContextualKeyword._from;
      if (t.type === D.TokenType.comma) return !0;
      if (s) {
        let i = P.input.charCodeAt($.nextTokenStartSince.call(void 0, e + 4));
        return (
          i === lh.charCodes.quotationMark || i === lh.charCodes.apostrophe
        );
      }
      return !1;
    }
    function kh() {
      $.eat.call(void 0, D.TokenType.comma) && Kl();
    }
    function cr() {
      ee.eatContextual.call(void 0, ke.ContextualKeyword._from) &&
        (De.parseExprAtom.call(void 0), gh()),
        ee.semicolon.call(void 0);
    }
    Tt.parseExportFrom = cr;
    function Tv() {
      return P.isFlowEnabled
        ? Ft.flowShouldParseExportStar.call(void 0)
        : $.match.call(void 0, D.TokenType.star);
    }
    function kv() {
      P.isFlowEnabled ? Ft.flowParseExportStar.call(void 0) : vh();
    }
    function vh() {
      ee.expect.call(void 0, D.TokenType.star),
        ee.isContextual.call(void 0, ke.ContextualKeyword._as) ? vv() : cr();
    }
    Tt.baseParseExportStar = vh;
    function vv() {
      $.next.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].type = D.TokenType._as),
        De.parseIdentifier.call(void 0),
        kh(),
        cr();
    }
    function xv() {
      return (
        (P.isTypeScriptEnabled && dt.tsIsDeclarationStart.call(void 0)) ||
        (P.isFlowEnabled && Ft.flowShouldParseExportDeclaration.call(void 0)) ||
        P.state.type === D.TokenType._var ||
        P.state.type === D.TokenType._const ||
        P.state.type === D.TokenType._let ||
        P.state.type === D.TokenType._function ||
        P.state.type === D.TokenType._class ||
        ee.isContextual.call(void 0, ke.ContextualKeyword._async) ||
        $.match.call(void 0, D.TokenType.at)
      );
    }
    function Kl() {
      let e = !0;
      for (
        ee.expect.call(void 0, D.TokenType.braceL);
        !$.eat.call(void 0, D.TokenType.braceR) && !P.state.error;

      ) {
        if (e) e = !1;
        else if (
          (ee.expect.call(void 0, D.TokenType.comma),
          $.eat.call(void 0, D.TokenType.braceR))
        )
          break;
        gv();
      }
    }
    Tt.parseExportSpecifiers = Kl;
    function gv() {
      if (P.isTypeScriptEnabled) {
        dt.tsParseExportSpecifier.call(void 0);
        return;
      }
      De.parseIdentifier.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].identifierRole =
          $.IdentifierRole.ExportAccess),
        ee.eatContextual.call(void 0, ke.ContextualKeyword._as) &&
          De.parseIdentifier.call(void 0);
    }
    function _v() {
      let e = P.state.snapshot();
      return (
        ee.expectContextual.call(void 0, ke.ContextualKeyword._module),
        ee.eatContextual.call(void 0, ke.ContextualKeyword._from)
          ? ee.isContextual.call(void 0, ke.ContextualKeyword._from)
            ? (P.state.restoreFromSnapshot(e), !0)
            : (P.state.restoreFromSnapshot(e), !1)
          : $.match.call(void 0, D.TokenType.comma)
          ? (P.state.restoreFromSnapshot(e), !1)
          : (P.state.restoreFromSnapshot(e), !0)
      );
    }
    function bv() {
      ee.isContextual.call(void 0, ke.ContextualKeyword._module) &&
        _v() &&
        $.next.call(void 0);
    }
    function xh() {
      if (
        P.isTypeScriptEnabled &&
        $.match.call(void 0, D.TokenType.name) &&
        $.lookaheadType.call(void 0) === D.TokenType.eq
      ) {
        dt.tsParseImportEqualsDeclaration.call(void 0);
        return;
      }
      if (
        P.isTypeScriptEnabled &&
        ee.isContextual.call(void 0, ke.ContextualKeyword._type)
      ) {
        let e = $.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === D.TokenType.name &&
          e.contextualKeyword !== ke.ContextualKeyword._from
        ) {
          if (
            (ee.expectContextual.call(void 0, ke.ContextualKeyword._type),
            $.lookaheadType.call(void 0) === D.TokenType.eq)
          ) {
            dt.tsParseImportEqualsDeclaration.call(void 0);
            return;
          }
        } else
          (e.type === D.TokenType.star || e.type === D.TokenType.braceL) &&
            ee.expectContextual.call(void 0, ke.ContextualKeyword._type);
      }
      $.match.call(void 0, D.TokenType.string) ||
        (bv(),
        wv(),
        ee.expectContextual.call(void 0, ke.ContextualKeyword._from)),
        De.parseExprAtom.call(void 0),
        gh(),
        ee.semicolon.call(void 0);
    }
    Tt.parseImport = xh;
    function Cv() {
      return $.match.call(void 0, D.TokenType.name);
    }
    function uh() {
      ks.parseImportedIdentifier.call(void 0);
    }
    function wv() {
      P.isFlowEnabled && Ft.flowStartParseImportSpecifiers.call(void 0);
      let e = !0;
      if (!(Cv() && (uh(), !$.eat.call(void 0, D.TokenType.comma)))) {
        if ($.match.call(void 0, D.TokenType.star)) {
          $.next.call(void 0),
            ee.expectContextual.call(void 0, ke.ContextualKeyword._as),
            uh();
          return;
        }
        for (
          ee.expect.call(void 0, D.TokenType.braceL);
          !$.eat.call(void 0, D.TokenType.braceR) && !P.state.error;

        ) {
          if (e) e = !1;
          else if (
            ($.eat.call(void 0, D.TokenType.colon) &&
              ee.unexpected.call(
                void 0,
                'ES2015 named imports do not destructure. Use another statement for destructuring after the import.'
              ),
            ee.expect.call(void 0, D.TokenType.comma),
            $.eat.call(void 0, D.TokenType.braceR))
          )
            break;
          Sv();
        }
      }
    }
    function Sv() {
      if (P.isTypeScriptEnabled) {
        dt.tsParseImportSpecifier.call(void 0);
        return;
      }
      if (P.isFlowEnabled) {
        Ft.flowParseImportSpecifier.call(void 0);
        return;
      }
      ks.parseImportedIdentifier.call(void 0),
        ee.isContextual.call(void 0, ke.ContextualKeyword._as) &&
          ((P.state.tokens[P.state.tokens.length - 1].identifierRole =
            $.IdentifierRole.ImportAccess),
          $.next.call(void 0),
          ks.parseImportedIdentifier.call(void 0));
    }
    function gh() {
      ee.isContextual.call(void 0, ke.ContextualKeyword._assert) &&
        !ee.hasPrecedingLineBreak.call(void 0) &&
        ($.next.call(void 0), De.parseObj.call(void 0, !1, !1));
    }
  });
  var Ch = Z((Wl) => {
    'use strict';
    Object.defineProperty(Wl, '__esModule', {value: !0});
    var _h = xt(),
      bh = Qt(),
      Hl = Zt(),
      Iv = nr();
    function Ev() {
      return (
        Hl.state.pos === 0 &&
          Hl.input.charCodeAt(0) === bh.charCodes.numberSign &&
          Hl.input.charCodeAt(1) === bh.charCodes.exclamationMark &&
          _h.skipLineComment.call(void 0, 2),
        _h.nextToken.call(void 0),
        Iv.parseTopLevel.call(void 0)
      );
    }
    Wl.parseFile = Ev;
  });
  var Ul = Z((Ao) => {
    'use strict';
    Object.defineProperty(Ao, '__esModule', {value: !0});
    var Eo = Zt(),
      Av = Ch(),
      Gl = class {
        constructor(t, s) {
          (this.tokens = t), (this.scopes = s);
        }
      };
    Ao.File = Gl;
    function Pv(e, t, s, i) {
      if (i && s)
        throw new Error('Cannot combine flow and typescript plugins.');
      Eo.initParser.call(void 0, e, t, s, i);
      let r = Av.parseFile.call(void 0);
      if (Eo.state.error) throw Eo.augmentError.call(void 0, Eo.state.error);
      return r;
    }
    Ao.parse = Pv;
  });
  var wh = Z((zl) => {
    'use strict';
    Object.defineProperty(zl, '__esModule', {value: !0});
    var Nv = It();
    function Rv(e) {
      let t = e.currentIndex(),
        s = 0,
        i = e.currentToken();
      do {
        let r = e.tokens[t];
        if (
          (r.isOptionalChainStart && s++,
          r.isOptionalChainEnd && s--,
          (s += r.numNullishCoalesceStarts),
          (s -= r.numNullishCoalesceEnds),
          r.contextualKeyword === Nv.ContextualKeyword._await &&
            r.identifierRole == null &&
            r.scopeDepth === i.scopeDepth)
        )
          return !0;
        t += 1;
      } while (s > 0 && t < e.tokens.length);
      return !1;
    }
    zl.default = Rv;
  });
  var Sh = Z((Yl) => {
    'use strict';
    Object.defineProperty(Yl, '__esModule', {value: !0});
    function Lv(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Po = be(),
      Ov = wh(),
      Dv = Lv(Ov),
      Xl = class e {
        __init() {
          this.resultCode = '';
        }
        __init2() {
          this.resultMappings = new Array(this.tokens.length);
        }
        __init3() {
          this.tokenIndex = 0;
        }
        constructor(t, s, i, r, a) {
          (this.code = t),
            (this.tokens = s),
            (this.isFlowEnabled = i),
            (this.disableESTransforms = r),
            (this.helperManager = a),
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
          let s = this.resultCode.slice(t.resultCode.length);
          return (this.resultCode = t.resultCode), s;
        }
        reset() {
          (this.resultCode = ''),
            (this.resultMappings = new Array(this.tokens.length)),
            (this.tokenIndex = 0);
        }
        matchesContextualAtIndex(t, s) {
          return (
            this.matches1AtIndex(t, Po.TokenType.name) &&
            this.tokens[t].contextualKeyword === s
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
        matches1AtIndex(t, s) {
          return this.tokens[t].type === s;
        }
        matches2AtIndex(t, s, i) {
          return this.tokens[t].type === s && this.tokens[t + 1].type === i;
        }
        matches3AtIndex(t, s, i, r) {
          return (
            this.tokens[t].type === s &&
            this.tokens[t + 1].type === i &&
            this.tokens[t + 2].type === r
          );
        }
        matches1(t) {
          return this.tokens[this.tokenIndex].type === t;
        }
        matches2(t, s) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === s
          );
        }
        matches3(t, s, i) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === s &&
            this.tokens[this.tokenIndex + 2].type === i
          );
        }
        matches4(t, s, i, r) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === s &&
            this.tokens[this.tokenIndex + 2].type === i &&
            this.tokens[this.tokenIndex + 3].type === r
          );
        }
        matches5(t, s, i, r, a) {
          return (
            this.tokens[this.tokenIndex].type === t &&
            this.tokens[this.tokenIndex + 1].type === s &&
            this.tokens[this.tokenIndex + 2].type === i &&
            this.tokens[this.tokenIndex + 3].type === r &&
            this.tokens[this.tokenIndex + 4].type === a
          );
        }
        matchesContextual(t) {
          return this.matchesContextualAtIndex(this.tokenIndex, t);
        }
        matchesContextIdAndLabel(t, s) {
          return this.matches1(t) && this.currentToken().contextId === s;
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
            if (this.matches1(Po.TokenType.braceL)) t++;
            else if (this.matches1(Po.TokenType.braceR)) {
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
              (t.isAsyncOperation = Dv.default.call(void 0, this)),
            !this.disableESTransforms)
          ) {
            if (t.numNullishCoalesceStarts)
              for (let s = 0; s < t.numNullishCoalesceStarts; s++)
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
              this.tokenAtRelativeIndex(-1).type === Po.TokenType._delete
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
            for (let s = 0; s < t.numNullishCoalesceEnds; s++)
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
    Yl.default = Xl;
  });
  var Ah = Z((Ql) => {
    'use strict';
    Object.defineProperty(Ql, '__esModule', {value: !0});
    var Ih = It(),
      Ne = be();
    function Mv(e, t, s, i) {
      let r = t.snapshot(),
        a = Fv(t),
        u = [],
        d = [],
        y = [],
        g = null,
        L = [],
        p = [],
        h = t.currentToken().contextId;
      if (h == null)
        throw new Error(
          'Expected non-null class context ID on class open-brace.'
        );
      for (t.nextToken(); !t.matchesContextIdAndLabel(Ne.TokenType.braceR, h); )
        if (
          t.matchesContextual(Ih.ContextualKeyword._constructor) &&
          !t.currentToken().isType
        )
          ({constructorInitializerStatements: u, constructorInsertPos: g} =
            Eh(t));
        else if (t.matches1(Ne.TokenType.semi))
          i || p.push({start: t.currentIndex(), end: t.currentIndex() + 1}),
            t.nextToken();
        else if (t.currentToken().isType) t.nextToken();
        else {
          let T = t.currentIndex(),
            x = !1,
            w = !1,
            S = !1;
          for (; No(t.currentToken()); )
            t.matches1(Ne.TokenType._static) && (x = !0),
              t.matches1(Ne.TokenType.hash) && (w = !0),
              (t.matches1(Ne.TokenType._declare) ||
                t.matches1(Ne.TokenType._abstract)) &&
                (S = !0),
              t.nextToken();
          if (x && t.matches1(Ne.TokenType.braceL)) {
            Jl(t, h);
            continue;
          }
          if (w) {
            Jl(t, h);
            continue;
          }
          if (
            t.matchesContextual(Ih.ContextualKeyword._constructor) &&
            !t.currentToken().isType
          ) {
            ({constructorInitializerStatements: u, constructorInsertPos: g} =
              Eh(t));
            continue;
          }
          let A = t.currentIndex();
          if (
            (Bv(t),
            t.matches1(Ne.TokenType.lessThan) ||
              t.matches1(Ne.TokenType.parenL))
          ) {
            Jl(t, h);
            continue;
          }
          for (; t.currentToken().isType; ) t.nextToken();
          if (t.matches1(Ne.TokenType.eq)) {
            let U = t.currentIndex(),
              M = t.currentToken().rhsEndIndex;
            if (M == null)
              throw new Error(
                'Expected rhsEndIndex on class field assignment.'
              );
            for (t.nextToken(); t.currentIndex() < M; ) e.processToken();
            let c;
            x
              ? ((c = s.claimFreeName('__initStatic')), y.push(c))
              : ((c = s.claimFreeName('__init')), d.push(c)),
              L.push({
                initializerName: c,
                equalsIndex: U,
                start: A,
                end: t.currentIndex(),
              });
          } else (!i || S) && p.push({start: T, end: t.currentIndex()});
        }
      return (
        t.restoreToSnapshot(r),
        i
          ? {
              headerInfo: a,
              constructorInitializerStatements: u,
              instanceInitializerNames: [],
              staticInitializerNames: [],
              constructorInsertPos: g,
              fields: [],
              rangesToRemove: p,
            }
          : {
              headerInfo: a,
              constructorInitializerStatements: u,
              instanceInitializerNames: d,
              staticInitializerNames: y,
              constructorInsertPos: g,
              fields: L,
              rangesToRemove: p,
            }
      );
    }
    Ql.default = Mv;
    function Jl(e, t) {
      for (e.nextToken(); e.currentToken().contextId !== t; ) e.nextToken();
      for (; No(e.tokenAtRelativeIndex(-1)); ) e.previousToken();
    }
    function Fv(e) {
      let t = e.currentToken(),
        s = t.contextId;
      if (s == null) throw new Error('Expected context ID on class token.');
      let i = t.isExpression;
      if (i == null) throw new Error('Expected isExpression on class token.');
      let r = null,
        a = !1;
      for (
        e.nextToken(),
          e.matches1(Ne.TokenType.name) && (r = e.identifierName());
        !e.matchesContextIdAndLabel(Ne.TokenType.braceL, s);

      )
        e.matches1(Ne.TokenType._extends) &&
          !e.currentToken().isType &&
          (a = !0),
          e.nextToken();
      return {isExpression: i, className: r, hasSuperclass: a};
    }
    function Eh(e) {
      let t = [];
      e.nextToken();
      let s = e.currentToken().contextId;
      if (s == null)
        throw new Error(
          'Expected context ID on open-paren starting constructor params.'
        );
      for (; !e.matchesContextIdAndLabel(Ne.TokenType.parenR, s); )
        if (e.currentToken().contextId === s) {
          if ((e.nextToken(), No(e.currentToken()))) {
            for (e.nextToken(); No(e.currentToken()); ) e.nextToken();
            let a = e.currentToken();
            if (a.type !== Ne.TokenType.name)
              throw new Error(
                'Expected identifier after access modifiers in constructor arg.'
              );
            let u = e.identifierNameForToken(a);
            t.push(`this.${u} = ${u}`);
          }
        } else e.nextToken();
      e.nextToken();
      let i = e.currentIndex(),
        r = !1;
      for (; !e.matchesContextIdAndLabel(Ne.TokenType.braceR, s); ) {
        if (!r && e.matches2(Ne.TokenType._super, Ne.TokenType.parenL)) {
          e.nextToken();
          let a = e.currentToken().contextId;
          if (a == null)
            throw new Error('Expected a context ID on the super call');
          for (; !e.matchesContextIdAndLabel(Ne.TokenType.parenR, a); )
            e.nextToken();
          (i = e.currentIndex()), (r = !0);
        }
        e.nextToken();
      }
      return (
        e.nextToken(),
        {constructorInitializerStatements: t, constructorInsertPos: i}
      );
    }
    function No(e) {
      return [
        Ne.TokenType._async,
        Ne.TokenType._get,
        Ne.TokenType._set,
        Ne.TokenType.plus,
        Ne.TokenType.minus,
        Ne.TokenType._readonly,
        Ne.TokenType._static,
        Ne.TokenType._public,
        Ne.TokenType._private,
        Ne.TokenType._protected,
        Ne.TokenType._override,
        Ne.TokenType._abstract,
        Ne.TokenType.star,
        Ne.TokenType._declare,
        Ne.TokenType.hash,
      ].includes(e.type);
    }
    function Bv(e) {
      if (e.matches1(Ne.TokenType.bracketL)) {
        let s = e.currentToken().contextId;
        if (s == null)
          throw new Error(
            'Expected class context ID on computed name open bracket.'
          );
        for (; !e.matchesContextIdAndLabel(Ne.TokenType.bracketR, s); )
          e.nextToken();
        e.nextToken();
      } else e.nextToken();
    }
  });
  var ec = Z((Zl) => {
    'use strict';
    Object.defineProperty(Zl, '__esModule', {value: !0});
    var Ph = be();
    function Vv(e) {
      if (
        (e.removeInitialToken(),
        e.removeToken(),
        e.removeToken(),
        e.removeToken(),
        e.matches1(Ph.TokenType.parenL))
      )
        e.removeToken(), e.removeToken(), e.removeToken();
      else
        for (; e.matches1(Ph.TokenType.dot); ) e.removeToken(), e.removeToken();
    }
    Zl.default = Vv;
  });
  var tc = Z((Ro) => {
    'use strict';
    Object.defineProperty(Ro, '__esModule', {value: !0});
    var jv = xt(),
      $v = be(),
      qv = {typeDeclarations: new Set(), valueDeclarations: new Set()};
    Ro.EMPTY_DECLARATION_INFO = qv;
    function Kv(e) {
      let t = new Set(),
        s = new Set();
      for (let i = 0; i < e.tokens.length; i++) {
        let r = e.tokens[i];
        r.type === $v.TokenType.name &&
          jv.isTopLevelDeclaration.call(void 0, r) &&
          (r.isType
            ? t.add(e.identifierNameForToken(r))
            : s.add(e.identifierNameForToken(r)));
      }
      return {typeDeclarations: t, valueDeclarations: s};
    }
    Ro.default = Kv;
  });
  var sc = Z((nc) => {
    'use strict';
    Object.defineProperty(nc, '__esModule', {value: !0});
    var Uv = It(),
      Nh = be();
    function Hv(e) {
      e.matches2(Nh.TokenType.name, Nh.TokenType.braceL) &&
        e.matchesContextual(Uv.ContextualKeyword._assert) &&
        (e.removeToken(),
        e.removeToken(),
        e.removeBalancedCode(),
        e.removeToken());
    }
    nc.removeMaybeImportAssertion = Hv;
  });
  var rc = Z((ic) => {
    'use strict';
    Object.defineProperty(ic, '__esModule', {value: !0});
    var Rh = be();
    function Wv(e, t, s) {
      if (!e) return !1;
      let i = t.currentToken();
      if (i.rhsEndIndex == null)
        throw new Error('Expected non-null rhsEndIndex on export token.');
      let r = i.rhsEndIndex - t.currentIndex();
      if (
        r !== 3 &&
        !(r === 4 && t.matches1AtIndex(i.rhsEndIndex - 1, Rh.TokenType.semi))
      )
        return !1;
      let a = t.tokenAtRelativeIndex(2);
      if (a.type !== Rh.TokenType.name) return !1;
      let u = t.identifierNameForToken(a);
      return s.typeDeclarations.has(u) && !s.valueDeclarations.has(u);
    }
    ic.default = Wv;
  });
  var Oh = Z((ac) => {
    'use strict';
    Object.defineProperty(ac, '__esModule', {value: !0});
    function ur(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Lo = xt(),
      Ls = It(),
      N = be(),
      Gv = ec(),
      zv = ur(Gv),
      Lh = tc(),
      Xv = ur(Lh),
      Yv = Wi(),
      Jv = ur(Yv),
      Oo = sc(),
      Qv = rc(),
      Zv = ur(Qv),
      ex = hn(),
      tx = ur(ex),
      oc = class e extends tx.default {
        __init() {
          this.hadExport = !1;
        }
        __init2() {
          this.hadNamedExport = !1;
        }
        __init3() {
          this.hadDefaultExport = !1;
        }
        constructor(t, s, i, r, a, u, d, y, g, L) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.importProcessor = i),
            (this.nameManager = r),
            (this.helperManager = a),
            (this.reactHotLoaderTransformer = u),
            (this.enableLegacyBabel5ModuleInterop = d),
            (this.enableLegacyTypeScriptModuleInterop = y),
            (this.isTypeScriptTransformEnabled = g),
            (this.preserveDynamicImport = L),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            (this.declarationInfo = g
              ? Xv.default.call(void 0, s)
              : Lh.EMPTY_DECLARATION_INFO);
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
            N.TokenType._import,
            N.TokenType.name,
            N.TokenType.eq
          )
            ? this.processImportEquals()
            : this.tokens.matches1(N.TokenType._import)
            ? (this.processImport(), !0)
            : this.tokens.matches2(N.TokenType._export, N.TokenType.eq)
            ? (this.tokens.replaceToken('module.exports'), !0)
            : this.tokens.matches1(N.TokenType._export) &&
              !this.tokens.currentToken().isType
            ? ((this.hadExport = !0), this.processExport())
            : this.tokens.matches2(N.TokenType.name, N.TokenType.postIncDec) &&
              this.processPostIncDec()
            ? !0
            : this.tokens.matches1(N.TokenType.name) ||
              this.tokens.matches1(N.TokenType.jsxName)
            ? this.processIdentifier()
            : this.tokens.matches1(N.TokenType.eq)
            ? this.processAssignment()
            : this.tokens.matches1(N.TokenType.assign)
            ? this.processComplexAssignment()
            : this.tokens.matches1(N.TokenType.preIncDec)
            ? this.processPreIncDec()
            : !1;
        }
        processImportEquals() {
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return (
            this.importProcessor.isTypeName(t)
              ? zv.default.call(void 0, this.tokens)
              : this.tokens.replaceToken('const'),
            !0
          );
        }
        processImport() {
          if (this.tokens.matches2(N.TokenType._import, N.TokenType.parenL)) {
            if (this.preserveDynamicImport) {
              this.tokens.copyToken();
              return;
            }
            let s = this.enableLegacyTypeScriptModuleInterop
              ? ''
              : `${this.helperManager.getHelperName(
                  'interopRequireWildcard'
                )}(`;
            this.tokens.replaceToken(
              `Promise.resolve().then(() => ${s}require`
            );
            let i = this.tokens.currentToken().contextId;
            if (i == null)
              throw new Error(
                'Expected context ID on dynamic import invocation.'
              );
            for (
              this.tokens.copyToken();
              !this.tokens.matchesContextIdAndLabel(N.TokenType.parenR, i);

            )
              this.rootTransformer.processToken();
            this.tokens.replaceToken(s ? ')))' : '))');
            return;
          }
          if (this.removeImportAndDetectIfType()) this.tokens.removeToken();
          else {
            let s = this.tokens.stringValue();
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              this.importProcessor.claimImportCode(s)
            ),
              this.tokens.appendCode(this.importProcessor.claimImportCode(s));
          }
          Oo.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(N.TokenType.semi) && this.tokens.removeToken();
        }
        removeImportAndDetectIfType() {
          if (
            (this.tokens.removeInitialToken(),
            this.tokens.matchesContextual(Ls.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                N.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                Ls.ContextualKeyword._from
              ))
          )
            return this.removeRemainingImport(), !0;
          if (
            this.tokens.matches1(N.TokenType.name) ||
            this.tokens.matches1(N.TokenType.star)
          )
            return this.removeRemainingImport(), !1;
          if (this.tokens.matches1(N.TokenType.string)) return !1;
          let t = !1;
          for (; !this.tokens.matches1(N.TokenType.string); )
            ((!t && this.tokens.matches1(N.TokenType.braceL)) ||
              this.tokens.matches1(N.TokenType.comma)) &&
              (this.tokens.removeToken(),
              (this.tokens.matches2(N.TokenType.name, N.TokenType.comma) ||
                this.tokens.matches2(N.TokenType.name, N.TokenType.braceR) ||
                this.tokens.matches4(
                  N.TokenType.name,
                  N.TokenType.name,
                  N.TokenType.name,
                  N.TokenType.comma
                ) ||
                this.tokens.matches4(
                  N.TokenType.name,
                  N.TokenType.name,
                  N.TokenType.name,
                  N.TokenType.braceR
                )) &&
                (t = !0)),
              this.tokens.removeToken();
          return !t;
        }
        removeRemainingImport() {
          for (; !this.tokens.matches1(N.TokenType.string); )
            this.tokens.removeToken();
        }
        processIdentifier() {
          let t = this.tokens.currentToken();
          if (t.shadowsGlobal) return !1;
          if (t.identifierRole === Lo.IdentifierRole.ObjectShorthand)
            return this.processObjectShorthand();
          if (t.identifierRole !== Lo.IdentifierRole.Access) return !1;
          let s = this.importProcessor.getIdentifierReplacement(
            this.tokens.identifierNameForToken(t)
          );
          if (!s) return !1;
          let i = this.tokens.currentIndex() + 1;
          for (
            ;
            i < this.tokens.tokens.length &&
            this.tokens.tokens[i].type === N.TokenType.parenR;

          )
            i++;
          return (
            this.tokens.tokens[i].type === N.TokenType.parenL
              ? this.tokens.tokenAtRelativeIndex(1).type ===
                  N.TokenType.parenL &&
                this.tokens.tokenAtRelativeIndex(-1).type !== N.TokenType._new
                ? (this.tokens.replaceToken(`${s}.call(void 0, `),
                  this.tokens.removeToken(),
                  this.rootTransformer.processBalancedCode(),
                  this.tokens.copyExpectedToken(N.TokenType.parenR))
                : this.tokens.replaceToken(`(0, ${s})`)
              : this.tokens.replaceToken(s),
            !0
          );
        }
        processObjectShorthand() {
          let t = this.tokens.identifierName(),
            s = this.importProcessor.getIdentifierReplacement(t);
          return s ? (this.tokens.replaceToken(`${t}: ${s}`), !0) : !1;
        }
        processExport() {
          if (
            this.tokens.matches2(N.TokenType._export, N.TokenType._enum) ||
            this.tokens.matches3(
              N.TokenType._export,
              N.TokenType._const,
              N.TokenType._enum
            )
          )
            return !1;
          if (this.tokens.matches2(N.TokenType._export, N.TokenType._default))
            return (
              (this.hadDefaultExport = !0),
              this.tokens.matches3(
                N.TokenType._export,
                N.TokenType._default,
                N.TokenType._enum
              )
                ? !1
                : (this.processExportDefault(), !0)
            );
          if (
            ((this.hadNamedExport = !0),
            this.tokens.matches2(N.TokenType._export, N.TokenType._var) ||
              this.tokens.matches2(N.TokenType._export, N.TokenType._let) ||
              this.tokens.matches2(N.TokenType._export, N.TokenType._const))
          )
            return this.processExportVar(), !0;
          if (
            this.tokens.matches2(N.TokenType._export, N.TokenType._function) ||
            this.tokens.matches3(
              N.TokenType._export,
              N.TokenType.name,
              N.TokenType._function
            )
          )
            return this.processExportFunction(), !0;
          if (
            this.tokens.matches2(N.TokenType._export, N.TokenType._class) ||
            this.tokens.matches3(
              N.TokenType._export,
              N.TokenType._abstract,
              N.TokenType._class
            ) ||
            this.tokens.matches2(N.TokenType._export, N.TokenType.at)
          )
            return this.processExportClass(), !0;
          if (this.tokens.matches2(N.TokenType._export, N.TokenType.braceL))
            return this.processExportBindings(), !0;
          if (this.tokens.matches2(N.TokenType._export, N.TokenType.star))
            return this.processExportStar(), !0;
          if (
            this.tokens.matches2(N.TokenType._export, N.TokenType.name) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              Ls.ContextualKeyword._type
            )
          ) {
            if (
              (this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.matches1(N.TokenType.braceL))
            ) {
              for (; !this.tokens.matches1(N.TokenType.braceR); )
                this.tokens.removeToken();
              this.tokens.removeToken();
            } else
              this.tokens.removeToken(),
                this.tokens.matches1(N.TokenType._as) &&
                  (this.tokens.removeToken(), this.tokens.removeToken());
            return (
              this.tokens.matchesContextual(Ls.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  N.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                Oo.removeMaybeImportAssertion.call(void 0, this.tokens)),
              !0
            );
          } else throw new Error('Unrecognized export syntax.');
        }
        processAssignment() {
          let t = this.tokens.currentIndex(),
            s = this.tokens.tokens[t - 1];
          if (
            s.isType ||
            s.type !== N.TokenType.name ||
            s.shadowsGlobal ||
            (t >= 2 && this.tokens.matches1AtIndex(t - 2, N.TokenType.dot)) ||
            (t >= 2 &&
              [N.TokenType._var, N.TokenType._let, N.TokenType._const].includes(
                this.tokens.tokens[t - 2].type
              ))
          )
            return !1;
          let i = this.importProcessor.resolveExportBinding(
            this.tokens.identifierNameForToken(s)
          );
          return i
            ? (this.tokens.copyToken(), this.tokens.appendCode(` ${i} =`), !0)
            : !1;
        }
        processComplexAssignment() {
          let t = this.tokens.currentIndex(),
            s = this.tokens.tokens[t - 1];
          if (
            s.type !== N.TokenType.name ||
            s.shadowsGlobal ||
            (t >= 2 && this.tokens.matches1AtIndex(t - 2, N.TokenType.dot))
          )
            return !1;
          let i = this.importProcessor.resolveExportBinding(
            this.tokens.identifierNameForToken(s)
          );
          return i
            ? (this.tokens.appendCode(` = ${i}`), this.tokens.copyToken(), !0)
            : !1;
        }
        processPreIncDec() {
          let t = this.tokens.currentIndex(),
            s = this.tokens.tokens[t + 1];
          if (
            s.type !== N.TokenType.name ||
            s.shadowsGlobal ||
            (t + 2 < this.tokens.tokens.length &&
              (this.tokens.matches1AtIndex(t + 2, N.TokenType.dot) ||
                this.tokens.matches1AtIndex(t + 2, N.TokenType.bracketL) ||
                this.tokens.matches1AtIndex(t + 2, N.TokenType.parenL)))
          )
            return !1;
          let i = this.tokens.identifierNameForToken(s),
            r = this.importProcessor.resolveExportBinding(i);
          return r
            ? (this.tokens.appendCode(`${r} = `), this.tokens.copyToken(), !0)
            : !1;
        }
        processPostIncDec() {
          let t = this.tokens.currentIndex(),
            s = this.tokens.tokens[t],
            i = this.tokens.tokens[t + 1];
          if (
            s.type !== N.TokenType.name ||
            s.shadowsGlobal ||
            (t >= 1 && this.tokens.matches1AtIndex(t - 1, N.TokenType.dot))
          )
            return !1;
          let r = this.tokens.identifierNameForToken(s),
            a = this.importProcessor.resolveExportBinding(r);
          if (!a) return !1;
          let u = this.tokens.rawCodeForToken(i),
            d = this.importProcessor.getIdentifierReplacement(r) || r;
          if (u === '++')
            this.tokens.replaceToken(`(${d} = ${a} = ${d} + 1, ${d} - 1)`);
          else if (u === '--')
            this.tokens.replaceToken(`(${d} = ${a} = ${d} - 1, ${d} + 1)`);
          else throw new Error(`Unexpected operator: ${u}`);
          return this.tokens.removeToken(), !0;
        }
        processExportDefault() {
          if (
            this.tokens.matches4(
              N.TokenType._export,
              N.TokenType._default,
              N.TokenType._function,
              N.TokenType.name
            ) ||
            (this.tokens.matches5(
              N.TokenType._export,
              N.TokenType._default,
              N.TokenType.name,
              N.TokenType._function,
              N.TokenType.name
            ) &&
              this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 2,
                Ls.ContextualKeyword._async
              ))
          ) {
            this.tokens.removeInitialToken(), this.tokens.removeToken();
            let t = this.processNamedFunction();
            this.tokens.appendCode(` exports.default = ${t};`);
          } else if (
            this.tokens.matches4(
              N.TokenType._export,
              N.TokenType._default,
              N.TokenType._class,
              N.TokenType.name
            ) ||
            this.tokens.matches5(
              N.TokenType._export,
              N.TokenType._default,
              N.TokenType._abstract,
              N.TokenType._class,
              N.TokenType.name
            ) ||
            this.tokens.matches3(
              N.TokenType._export,
              N.TokenType._default,
              N.TokenType.at
            )
          ) {
            this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.copyDecorators(),
              this.tokens.matches1(N.TokenType._abstract) &&
                this.tokens.removeToken();
            let t = this.rootTransformer.processNamedClass();
            this.tokens.appendCode(` exports.default = ${t};`);
          } else if (
            Zv.default.call(
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
          for (; this.tokens.matches1(N.TokenType.at); )
            if (
              (this.tokens.copyToken(),
              this.tokens.matches1(N.TokenType.parenL))
            )
              this.tokens.copyExpectedToken(N.TokenType.parenL),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(N.TokenType.parenR);
            else {
              for (
                this.tokens.copyExpectedToken(N.TokenType.name);
                this.tokens.matches1(N.TokenType.dot);

              )
                this.tokens.copyExpectedToken(N.TokenType.dot),
                  this.tokens.copyExpectedToken(N.TokenType.name);
              this.tokens.matches1(N.TokenType.parenL) &&
                (this.tokens.copyExpectedToken(N.TokenType.parenL),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(N.TokenType.parenR));
            }
        }
        processExportVar() {
          this.isSimpleExportVar()
            ? this.processSimpleExportVar()
            : this.processComplexExportVar();
        }
        isSimpleExportVar() {
          let t = this.tokens.currentIndex();
          if ((t++, t++, !this.tokens.matches1AtIndex(t, N.TokenType.name)))
            return !1;
          for (
            t++;
            t < this.tokens.tokens.length && this.tokens.tokens[t].isType;

          )
            t++;
          return !!this.tokens.matches1AtIndex(t, N.TokenType.eq);
        }
        processSimpleExportVar() {
          this.tokens.removeInitialToken(), this.tokens.copyToken();
          let t = this.tokens.identifierName();
          for (; !this.tokens.matches1(N.TokenType.eq); )
            this.rootTransformer.processToken();
          let s = this.tokens.currentToken().rhsEndIndex;
          if (s == null) throw new Error('Expected = token with an end index.');
          for (; this.tokens.currentIndex() < s; )
            this.rootTransformer.processToken();
          this.tokens.appendCode(`; exports.${t} = ${t}`);
        }
        processComplexExportVar() {
          this.tokens.removeInitialToken(), this.tokens.removeToken();
          let t = this.tokens.matches1(N.TokenType.braceL);
          t && this.tokens.appendCode('(');
          let s = 0;
          for (;;)
            if (
              this.tokens.matches1(N.TokenType.braceL) ||
              this.tokens.matches1(N.TokenType.dollarBraceL) ||
              this.tokens.matches1(N.TokenType.bracketL)
            )
              s++, this.tokens.copyToken();
            else if (
              this.tokens.matches1(N.TokenType.braceR) ||
              this.tokens.matches1(N.TokenType.bracketR)
            )
              s--, this.tokens.copyToken();
            else {
              if (
                s === 0 &&
                !this.tokens.matches1(N.TokenType.name) &&
                !this.tokens.currentToken().isType
              )
                break;
              if (this.tokens.matches1(N.TokenType.eq)) {
                let i = this.tokens.currentToken().rhsEndIndex;
                if (i == null)
                  throw new Error('Expected = token with an end index.');
                for (; this.tokens.currentIndex() < i; )
                  this.rootTransformer.processToken();
              } else {
                let i = this.tokens.currentToken();
                if (Lo.isDeclaration.call(void 0, i)) {
                  let r = this.tokens.identifierName(),
                    a = this.importProcessor.getIdentifierReplacement(r);
                  if (a === null)
                    throw new Error(
                      `Expected a replacement for ${r} in \`export var\` syntax.`
                    );
                  Lo.isObjectShorthandDeclaration.call(void 0, i) &&
                    (a = `${r}: ${a}`),
                    this.tokens.replaceToken(a);
                } else this.rootTransformer.processToken();
              }
            }
          if (t) {
            let i = this.tokens.currentToken().rhsEndIndex;
            if (i == null)
              throw new Error('Expected = token with an end index.');
            for (; this.tokens.currentIndex() < i; )
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
          if (this.tokens.matches1(N.TokenType._function))
            this.tokens.copyToken();
          else if (
            this.tokens.matches2(N.TokenType.name, N.TokenType._function)
          ) {
            if (!this.tokens.matchesContextual(Ls.ContextualKeyword._async))
              throw new Error('Expected async keyword in function export.');
            this.tokens.copyToken(), this.tokens.copyToken();
          }
          if (
            (this.tokens.matches1(N.TokenType.star) && this.tokens.copyToken(),
            !this.tokens.matches1(N.TokenType.name))
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
            this.tokens.copyExpectedToken(N.TokenType.parenL),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(N.TokenType.parenR),
            this.rootTransformer.processPossibleTypeRange(),
            this.tokens.copyExpectedToken(N.TokenType.braceL),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(N.TokenType.braceR),
            t
          );
        }
        processExportClass() {
          this.tokens.removeInitialToken(),
            this.copyDecorators(),
            this.tokens.matches1(N.TokenType._abstract) &&
              this.tokens.removeToken();
          let t = this.rootTransformer.processNamedClass();
          this.tokens.appendCode(` exports.${t} = ${t};`);
        }
        processExportBindings() {
          this.tokens.removeInitialToken(), this.tokens.removeToken();
          let t = [];
          for (;;) {
            if (this.tokens.matches1(N.TokenType.braceR)) {
              this.tokens.removeToken();
              break;
            }
            let s = Jv.default.call(void 0, this.tokens);
            for (; this.tokens.currentIndex() < s.endIndex; )
              this.tokens.removeToken();
            if (!s.isType && !this.shouldElideExportedIdentifier(s.leftName)) {
              let i = s.leftName,
                r = s.rightName,
                a = this.importProcessor.getIdentifierReplacement(i);
              t.push(`exports.${r} = ${a || i};`);
            }
            if (this.tokens.matches1(N.TokenType.braceR)) {
              this.tokens.removeToken();
              break;
            }
            if (this.tokens.matches2(N.TokenType.comma, N.TokenType.braceR)) {
              this.tokens.removeToken(), this.tokens.removeToken();
              break;
            } else if (this.tokens.matches1(N.TokenType.comma))
              this.tokens.removeToken();
            else
              throw new Error(
                `Unexpected token: ${JSON.stringify(
                  this.tokens.currentToken()
                )}`
              );
          }
          if (this.tokens.matchesContextual(Ls.ContextualKeyword._from)) {
            this.tokens.removeToken();
            let s = this.tokens.stringValue();
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              this.importProcessor.claimImportCode(s)
            ),
              Oo.removeMaybeImportAssertion.call(void 0, this.tokens);
          } else this.tokens.appendCode(t.join(' '));
          this.tokens.matches1(N.TokenType.semi) && this.tokens.removeToken();
        }
        processExportStar() {
          for (
            this.tokens.removeInitialToken();
            !this.tokens.matches1(N.TokenType.string);

          )
            this.tokens.removeToken();
          let t = this.tokens.stringValue();
          this.tokens.replaceTokenTrimmingLeftWhitespace(
            this.importProcessor.claimImportCode(t)
          ),
            Oo.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(N.TokenType.semi) && this.tokens.removeToken();
        }
        shouldElideExportedIdentifier(t) {
          return (
            this.isTypeScriptTransformEnabled &&
            !this.declarationInfo.valueDeclarations.has(t)
          );
        }
      };
    ac.default = oc;
  });
  var Bh = Z((cc) => {
    'use strict';
    Object.defineProperty(cc, '__esModule', {value: !0});
    function pr(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Jn = It(),
      se = be(),
      nx = ec(),
      sx = pr(nx),
      Fh = tc(),
      ix = pr(Fh),
      rx = Wi(),
      Dh = pr(rx),
      ox = Fa(),
      Mh = sc(),
      ax = rc(),
      lx = pr(ax),
      cx = hn(),
      ux = pr(cx),
      lc = class extends ux.default {
        constructor(t, s, i, r, a, u) {
          super(),
            (this.tokens = t),
            (this.nameManager = s),
            (this.helperManager = i),
            (this.reactHotLoaderTransformer = r),
            (this.isTypeScriptTransformEnabled = a),
            (this.nonTypeIdentifiers = a
              ? ox.getNonTypeIdentifiers.call(void 0, t, u)
              : new Set()),
            (this.declarationInfo = a
              ? ix.default.call(void 0, t)
              : Fh.EMPTY_DECLARATION_INFO),
            (this.injectCreateRequireForImportRequire =
              !!u.injectCreateRequireForImportRequire);
        }
        process() {
          if (
            this.tokens.matches3(
              se.TokenType._import,
              se.TokenType.name,
              se.TokenType.eq
            )
          )
            return this.processImportEquals();
          if (
            this.tokens.matches4(
              se.TokenType._import,
              se.TokenType.name,
              se.TokenType.name,
              se.TokenType.eq
            ) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              Jn.ContextualKeyword._type
            )
          ) {
            this.tokens.removeInitialToken();
            for (let t = 0; t < 7; t++) this.tokens.removeToken();
            return !0;
          }
          if (this.tokens.matches2(se.TokenType._export, se.TokenType.eq))
            return this.tokens.replaceToken('module.exports'), !0;
          if (
            this.tokens.matches5(
              se.TokenType._export,
              se.TokenType._import,
              se.TokenType.name,
              se.TokenType.name,
              se.TokenType.eq
            ) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 2,
              Jn.ContextualKeyword._type
            )
          ) {
            this.tokens.removeInitialToken();
            for (let t = 0; t < 8; t++) this.tokens.removeToken();
            return !0;
          }
          if (this.tokens.matches1(se.TokenType._import))
            return this.processImport();
          if (this.tokens.matches2(se.TokenType._export, se.TokenType._default))
            return this.processExportDefault();
          if (this.tokens.matches2(se.TokenType._export, se.TokenType.braceL))
            return this.processNamedExports();
          if (
            this.tokens.matches2(se.TokenType._export, se.TokenType.name) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 1,
              Jn.ContextualKeyword._type
            )
          ) {
            if (
              (this.tokens.removeInitialToken(),
              this.tokens.removeToken(),
              this.tokens.matches1(se.TokenType.braceL))
            ) {
              for (; !this.tokens.matches1(se.TokenType.braceR); )
                this.tokens.removeToken();
              this.tokens.removeToken();
            } else
              this.tokens.removeToken(),
                this.tokens.matches1(se.TokenType._as) &&
                  (this.tokens.removeToken(), this.tokens.removeToken());
            return (
              this.tokens.matchesContextual(Jn.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  se.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                Mh.removeMaybeImportAssertion.call(void 0, this.tokens)),
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
              ? sx.default.call(void 0, this.tokens)
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
          if (this.tokens.matches2(se.TokenType._import, se.TokenType.parenL))
            return !1;
          let t = this.tokens.snapshot();
          if (this.removeImportTypeBindings()) {
            for (
              this.tokens.restoreToSnapshot(t);
              !this.tokens.matches1(se.TokenType.string);

            )
              this.tokens.removeToken();
            this.tokens.removeToken(),
              Mh.removeMaybeImportAssertion.call(void 0, this.tokens),
              this.tokens.matches1(se.TokenType.semi) &&
                this.tokens.removeToken();
          }
          return !0;
        }
        removeImportTypeBindings() {
          if (
            (this.tokens.copyExpectedToken(se.TokenType._import),
            this.tokens.matchesContextual(Jn.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                se.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                Jn.ContextualKeyword._from
              ))
          )
            return !0;
          if (this.tokens.matches1(se.TokenType.string))
            return this.tokens.copyToken(), !1;
          this.tokens.matchesContextual(Jn.ContextualKeyword._module) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 2,
              Jn.ContextualKeyword._from
            ) &&
            this.tokens.copyToken();
          let t = !1,
            s = !1;
          if (
            (this.tokens.matches1(se.TokenType.name) &&
              (this.isTypeName(this.tokens.identifierName())
                ? (this.tokens.removeToken(),
                  this.tokens.matches1(se.TokenType.comma) &&
                    this.tokens.removeToken())
                : ((t = !0),
                  this.tokens.copyToken(),
                  this.tokens.matches1(se.TokenType.comma) &&
                    ((s = !0), this.tokens.removeToken()))),
            this.tokens.matches1(se.TokenType.star))
          )
            this.isTypeName(this.tokens.identifierNameAtRelativeIndex(2))
              ? (this.tokens.removeToken(),
                this.tokens.removeToken(),
                this.tokens.removeToken())
              : (s && this.tokens.appendCode(','),
                (t = !0),
                this.tokens.copyExpectedToken(se.TokenType.star),
                this.tokens.copyExpectedToken(se.TokenType.name),
                this.tokens.copyExpectedToken(se.TokenType.name));
          else if (this.tokens.matches1(se.TokenType.braceL)) {
            for (
              s && this.tokens.appendCode(','), this.tokens.copyToken();
              !this.tokens.matches1(se.TokenType.braceR);

            ) {
              let i = Dh.default.call(void 0, this.tokens);
              if (i.isType || this.isTypeName(i.rightName)) {
                for (; this.tokens.currentIndex() < i.endIndex; )
                  this.tokens.removeToken();
                this.tokens.matches1(se.TokenType.comma) &&
                  this.tokens.removeToken();
              } else {
                for (t = !0; this.tokens.currentIndex() < i.endIndex; )
                  this.tokens.copyToken();
                this.tokens.matches1(se.TokenType.comma) &&
                  this.tokens.copyToken();
              }
            }
            this.tokens.copyExpectedToken(se.TokenType.braceR);
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
            lx.default.call(
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
                se.TokenType._export,
                se.TokenType._default,
                se.TokenType._function,
                se.TokenType.name
              ) ||
              (this.tokens.matches5(
                se.TokenType._export,
                se.TokenType._default,
                se.TokenType.name,
                se.TokenType._function,
                se.TokenType.name
              ) &&
                this.tokens.matchesContextualAtIndex(
                  this.tokens.currentIndex() + 2,
                  Jn.ContextualKeyword._async
                )) ||
              this.tokens.matches4(
                se.TokenType._export,
                se.TokenType._default,
                se.TokenType._class,
                se.TokenType.name
              ) ||
              this.tokens.matches5(
                se.TokenType._export,
                se.TokenType._default,
                se.TokenType._abstract,
                se.TokenType._class,
                se.TokenType.name
              )
            ) &&
            this.reactHotLoaderTransformer
          ) {
            let s = this.nameManager.claimFreeName('_default');
            return (
              this.tokens.replaceToken(`let ${s}; export`),
              this.tokens.copyToken(),
              this.tokens.appendCode(` ${s} =`),
              this.reactHotLoaderTransformer.setExtractedDefaultExportName(s),
              !0
            );
          }
          return !1;
        }
        processNamedExports() {
          if (!this.isTypeScriptTransformEnabled) return !1;
          for (
            this.tokens.copyExpectedToken(se.TokenType._export),
              this.tokens.copyExpectedToken(se.TokenType.braceL);
            !this.tokens.matches1(se.TokenType.braceR);

          ) {
            let t = Dh.default.call(void 0, this.tokens);
            if (t.isType || this.shouldElideExportedName(t.leftName)) {
              for (; this.tokens.currentIndex() < t.endIndex; )
                this.tokens.removeToken();
              this.tokens.matches1(se.TokenType.comma) &&
                this.tokens.removeToken();
            } else {
              for (; this.tokens.currentIndex() < t.endIndex; )
                this.tokens.copyToken();
              this.tokens.matches1(se.TokenType.comma) &&
                this.tokens.copyToken();
            }
          }
          return this.tokens.copyExpectedToken(se.TokenType.braceR), !0;
        }
        shouldElideExportedName(t) {
          return (
            this.isTypeScriptTransformEnabled &&
            this.declarationInfo.typeDeclarations.has(t) &&
            !this.declarationInfo.valueDeclarations.has(t)
          );
        }
      };
    cc.default = lc;
  });
  var jh = Z((pc) => {
    'use strict';
    Object.defineProperty(pc, '__esModule', {value: !0});
    function px(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Vh = It(),
      sn = be(),
      hx = hn(),
      fx = px(hx),
      uc = class extends fx.default {
        constructor(t, s, i) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.isImportsTransformEnabled = i);
        }
        process() {
          return this.rootTransformer.processPossibleArrowParamEnd() ||
            this.rootTransformer.processPossibleAsyncArrowWithTypeParams() ||
            this.rootTransformer.processPossibleTypeRange()
            ? !0
            : this.tokens.matches1(sn.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2(sn.TokenType._export, sn.TokenType._enum)
            ? (this.processNamedExportEnum(), !0)
            : this.tokens.matches3(
                sn.TokenType._export,
                sn.TokenType._default,
                sn.TokenType._enum
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
            this.tokens.copyExpectedToken(sn.TokenType.name);
          let t = !1;
          this.tokens.matchesContextual(Vh.ContextualKeyword._of) &&
            (this.tokens.removeToken(),
            (t = this.tokens.matchesContextual(Vh.ContextualKeyword._symbol)),
            this.tokens.removeToken());
          let s = this.tokens.matches3(
            sn.TokenType.braceL,
            sn.TokenType.name,
            sn.TokenType.eq
          );
          this.tokens.appendCode(' = require("flow-enums-runtime")');
          let i = !t && !s;
          for (
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              i ? '.Mirrored([' : '({'
            );
            !this.tokens.matches1(sn.TokenType.braceR);

          ) {
            if (this.tokens.matches1(sn.TokenType.ellipsis)) {
              this.tokens.removeToken();
              break;
            }
            this.processEnumElement(t, s),
              this.tokens.matches1(sn.TokenType.comma) &&
                this.tokens.copyToken();
          }
          this.tokens.replaceToken(i ? ']);' : '});');
        }
        processEnumElement(t, s) {
          if (t) {
            let i = this.tokens.identifierName();
            this.tokens.copyToken(), this.tokens.appendCode(`: Symbol("${i}")`);
          } else
            s
              ? (this.tokens.copyToken(),
                this.tokens.replaceTokenTrimmingLeftWhitespace(':'),
                this.tokens.copyToken())
              : this.tokens.replaceToken(`"${this.tokens.identifierName()}"`);
        }
      };
    pc.default = uc;
  });
  var $h = Z((fc) => {
    'use strict';
    Object.defineProperty(fc, '__esModule', {value: !0});
    function dx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    function mx(e) {
      let t,
        s = e[0],
        i = 1;
      for (; i < e.length; ) {
        let r = e[i],
          a = e[i + 1];
        if (
          ((i += 2),
          (r === 'optionalAccess' || r === 'optionalCall') && s == null)
        )
          return;
        r === 'access' || r === 'optionalAccess'
          ? ((t = s), (s = a(s)))
          : (r === 'call' || r === 'optionalCall') &&
            ((s = a((...u) => s.call(t, ...u))), (t = void 0));
      }
      return s;
    }
    var Qn = be(),
      yx = hn(),
      Tx = dx(yx),
      Do = 'jest',
      kx = ['mock', 'unmock', 'enableAutomock', 'disableAutomock'],
      hc = class e extends Tx.default {
        __init() {
          this.hoistedFunctionNames = [];
        }
        constructor(t, s, i, r) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.nameManager = i),
            (this.importProcessor = r),
            e.prototype.__init.call(this);
        }
        process() {
          return this.tokens.currentToken().scopeDepth === 0 &&
            this.tokens.matches4(
              Qn.TokenType.name,
              Qn.TokenType.dot,
              Qn.TokenType.name,
              Qn.TokenType.parenL
            ) &&
            this.tokens.identifierName() === Do
            ? mx([
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
                (t) => t(Do),
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
              Qn.TokenType.dot,
              Qn.TokenType.name,
              Qn.TokenType.parenL
            );

          ) {
            let s = this.tokens.identifierNameAtIndex(
              this.tokens.currentIndex() + 1
            );
            if (kx.includes(s)) {
              let r = this.nameManager.claimFreeName('__jestHoist');
              this.hoistedFunctionNames.push(r),
                this.tokens.replaceToken(`function ${r}(){${Do}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(Qn.TokenType.parenR),
                this.tokens.appendCode(';}'),
                (t = !1);
            } else
              t ? this.tokens.copyToken() : this.tokens.replaceToken(`${Do}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(Qn.TokenType.parenR),
                (t = !0);
          }
          return !0;
        }
      };
    fc.default = hc;
  });
  var qh = Z((mc) => {
    'use strict';
    Object.defineProperty(mc, '__esModule', {value: !0});
    function vx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var xx = be(),
      gx = hn(),
      _x = vx(gx),
      dc = class extends _x.default {
        constructor(t) {
          super(), (this.tokens = t);
        }
        process() {
          if (this.tokens.matches1(xx.TokenType.num)) {
            let t = this.tokens.currentTokenCode();
            if (t.includes('_'))
              return this.tokens.replaceToken(t.replace(/_/g, '')), !0;
          }
          return !1;
        }
      };
    mc.default = dc;
  });
  var Uh = Z((Tc) => {
    'use strict';
    Object.defineProperty(Tc, '__esModule', {value: !0});
    function bx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Kh = be(),
      Cx = hn(),
      wx = bx(Cx),
      yc = class extends wx.default {
        constructor(t, s) {
          super(), (this.tokens = t), (this.nameManager = s);
        }
        process() {
          return this.tokens.matches2(Kh.TokenType._catch, Kh.TokenType.braceL)
            ? (this.tokens.copyToken(),
              this.tokens.appendCode(
                ` (${this.nameManager.claimFreeName('e')})`
              ),
              !0)
            : !1;
        }
      };
    Tc.default = yc;
  });
  var Hh = Z((vc) => {
    'use strict';
    Object.defineProperty(vc, '__esModule', {value: !0});
    function Sx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var jt = be(),
      Ix = hn(),
      Ex = Sx(Ix),
      kc = class extends Ex.default {
        constructor(t, s) {
          super(), (this.tokens = t), (this.nameManager = s);
        }
        process() {
          if (this.tokens.matches1(jt.TokenType.nullishCoalescing)) {
            let i = this.tokens.currentToken();
            return (
              this.tokens.tokens[i.nullishStartIndex].isAsyncOperation
                ? this.tokens.replaceTokenTrimmingLeftWhitespace(
                    ', async () => ('
                  )
                : this.tokens.replaceTokenTrimmingLeftWhitespace(', () => ('),
              !0
            );
          }
          if (
            this.tokens.matches1(jt.TokenType._delete) &&
            this.tokens.tokenAtRelativeIndex(1).isOptionalChainStart
          )
            return this.tokens.removeInitialToken(), !0;
          let s = this.tokens.currentToken().subscriptStartIndex;
          if (
            s != null &&
            this.tokens.tokens[s].isOptionalChainStart &&
            this.tokens.tokenAtRelativeIndex(-1).type !== jt.TokenType._super
          ) {
            let i = this.nameManager.claimFreeName('_'),
              r;
            if (
              (s > 0 &&
              this.tokens.matches1AtIndex(s - 1, jt.TokenType._delete) &&
              this.isLastSubscriptInChain()
                ? (r = `${i} => delete ${i}`)
                : (r = `${i} => ${i}`),
              this.tokens.tokens[s].isAsyncOperation && (r = `async ${r}`),
              this.tokens.matches2(
                jt.TokenType.questionDot,
                jt.TokenType.parenL
              ) ||
                this.tokens.matches2(
                  jt.TokenType.questionDot,
                  jt.TokenType.lessThan
                ))
            )
              this.justSkippedSuper() && this.tokens.appendCode('.bind(this)'),
                this.tokens.replaceTokenTrimmingLeftWhitespace(
                  `, 'optionalCall', ${r}`
                );
            else if (
              this.tokens.matches2(
                jt.TokenType.questionDot,
                jt.TokenType.bracketL
              )
            )
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}`
              );
            else if (this.tokens.matches1(jt.TokenType.questionDot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}.`
              );
            else if (this.tokens.matches1(jt.TokenType.dot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}.`
              );
            else if (this.tokens.matches1(jt.TokenType.bracketL))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}[`
              );
            else if (this.tokens.matches1(jt.TokenType.parenL))
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
          for (let s = this.tokens.currentIndex() + 1; ; s++) {
            if (s >= this.tokens.tokens.length)
              throw new Error(
                'Reached the end of the code while finding the end of the access chain.'
              );
            if (
              (this.tokens.tokens[s].isOptionalChainStart
                ? t++
                : this.tokens.tokens[s].isOptionalChainEnd && t--,
              t < 0)
            )
              return !0;
            if (t === 0 && this.tokens.tokens[s].subscriptStartIndex != null)
              return !1;
          }
        }
        justSkippedSuper() {
          let t = 0,
            s = this.tokens.currentIndex() - 1;
          for (;;) {
            if (s < 0)
              throw new Error(
                'Reached the start of the code while finding the start of the access chain.'
              );
            if (
              (this.tokens.tokens[s].isOptionalChainStart
                ? t--
                : this.tokens.tokens[s].isOptionalChainEnd && t++,
              t < 0)
            )
              return !1;
            if (t === 0 && this.tokens.tokens[s].subscriptStartIndex != null)
              return this.tokens.tokens[s - 1].type === jt.TokenType._super;
            s--;
          }
        }
      };
    vc.default = kc;
  });
  var Gh = Z((gc) => {
    'use strict';
    Object.defineProperty(gc, '__esModule', {value: !0});
    function Ax(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Wh = xt(),
      Et = be(),
      Px = hn(),
      Nx = Ax(Px),
      xc = class extends Nx.default {
        constructor(t, s, i, r) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.importProcessor = i),
            (this.options = r);
        }
        process() {
          let t = this.tokens.currentIndex();
          if (this.tokens.identifierName() === 'createReactClass') {
            let s =
              this.importProcessor &&
              this.importProcessor.getIdentifierReplacement('createReactClass');
            return (
              s
                ? this.tokens.replaceToken(`(0, ${s})`)
                : this.tokens.copyToken(),
              this.tryProcessCreateClassCall(t),
              !0
            );
          }
          if (
            this.tokens.matches3(
              Et.TokenType.name,
              Et.TokenType.dot,
              Et.TokenType.name
            ) &&
            this.tokens.identifierName() === 'React' &&
            this.tokens.identifierNameAtIndex(
              this.tokens.currentIndex() + 2
            ) === 'createClass'
          ) {
            let s =
              (this.importProcessor &&
                this.importProcessor.getIdentifierReplacement('React')) ||
              'React';
            return (
              s
                ? (this.tokens.replaceToken(s),
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
          let s = this.findDisplayName(t);
          s &&
            this.classNeedsDisplayName() &&
            (this.tokens.copyExpectedToken(Et.TokenType.parenL),
            this.tokens.copyExpectedToken(Et.TokenType.braceL),
            this.tokens.appendCode(`displayName: '${s}',`),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(Et.TokenType.braceR),
            this.tokens.copyExpectedToken(Et.TokenType.parenR));
        }
        findDisplayName(t) {
          return t < 2
            ? null
            : this.tokens.matches2AtIndex(
                t - 2,
                Et.TokenType.name,
                Et.TokenType.eq
              )
            ? this.tokens.identifierNameAtIndex(t - 2)
            : t >= 2 &&
              this.tokens.tokens[t - 2].identifierRole ===
                Wh.IdentifierRole.ObjectKey
            ? this.tokens.identifierNameAtIndex(t - 2)
            : this.tokens.matches2AtIndex(
                t - 2,
                Et.TokenType._export,
                Et.TokenType._default
              )
            ? this.getDisplayNameFromFilename()
            : null;
        }
        getDisplayNameFromFilename() {
          let s = (this.options.filePath || 'unknown').split('/'),
            i = s[s.length - 1],
            r = i.lastIndexOf('.'),
            a = r === -1 ? i : i.slice(0, r);
          return a === 'index' && s[s.length - 2] ? s[s.length - 2] : a;
        }
        classNeedsDisplayName() {
          let t = this.tokens.currentIndex();
          if (!this.tokens.matches2(Et.TokenType.parenL, Et.TokenType.braceL))
            return !1;
          let s = t + 1,
            i = this.tokens.tokens[s].contextId;
          if (i == null)
            throw new Error(
              'Expected non-null context ID on object open-brace.'
            );
          for (; t < this.tokens.tokens.length; t++) {
            let r = this.tokens.tokens[t];
            if (r.type === Et.TokenType.braceR && r.contextId === i) {
              t++;
              break;
            }
            if (
              this.tokens.identifierNameAtIndex(t) === 'displayName' &&
              this.tokens.tokens[t].identifierRole ===
                Wh.IdentifierRole.ObjectKey &&
              r.contextId === i
            )
              return !1;
          }
          if (t === this.tokens.tokens.length)
            throw new Error(
              'Unexpected end of input when processing React class.'
            );
          return (
            this.tokens.matches1AtIndex(t, Et.TokenType.parenR) ||
            this.tokens.matches2AtIndex(
              t,
              Et.TokenType.comma,
              Et.TokenType.parenR
            )
          );
        }
      };
    gc.default = xc;
  });
  var Xh = Z((bc) => {
    'use strict';
    Object.defineProperty(bc, '__esModule', {value: !0});
    function Rx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var zh = xt(),
      Lx = hn(),
      Ox = Rx(Lx),
      _c = class e extends Ox.default {
        __init() {
          this.extractedDefaultExportName = null;
        }
        constructor(t, s) {
          super(),
            (this.tokens = t),
            (this.filePath = s),
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
          for (let i of this.tokens.tokens)
            !i.isType &&
              zh.isTopLevelDeclaration.call(void 0, i) &&
              i.identifierRole !== zh.IdentifierRole.ImportDeclaration &&
              t.add(this.tokens.identifierNameForToken(i));
          let s = Array.from(t).map((i) => ({
            variableName: i,
            uniqueLocalName: i,
          }));
          return (
            this.extractedDefaultExportName &&
              s.push({
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
${s.map(
  ({variableName: i, uniqueLocalName: r}) =>
    `  reactHotLoader.register(${i}, "${r}", ${JSON.stringify(
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
    bc.default = _c;
  });
  var Jh = Z((Cc) => {
    'use strict';
    Object.defineProperty(Cc, '__esModule', {value: !0});
    var Yh = li(),
      Dx = new Set([
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
    function Mx(e) {
      if (e.length === 0 || !Yh.IS_IDENTIFIER_START[e.charCodeAt(0)]) return !1;
      for (let t = 1; t < e.length; t++)
        if (!Yh.IS_IDENTIFIER_CHAR[e.charCodeAt(t)]) return !1;
      return !Dx.has(e);
    }
    Cc.default = Mx;
  });
  var ef = Z((Sc) => {
    'use strict';
    Object.defineProperty(Sc, '__esModule', {value: !0});
    function Zh(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var $e = be(),
      Fx = Jh(),
      Qh = Zh(Fx),
      Bx = hn(),
      Vx = Zh(Bx),
      wc = class extends Vx.default {
        constructor(t, s, i) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.isImportsTransformEnabled = i);
        }
        process() {
          return this.rootTransformer.processPossibleArrowParamEnd() ||
            this.rootTransformer.processPossibleAsyncArrowWithTypeParams() ||
            this.rootTransformer.processPossibleTypeRange()
            ? !0
            : this.tokens.matches1($e.TokenType._public) ||
              this.tokens.matches1($e.TokenType._protected) ||
              this.tokens.matches1($e.TokenType._private) ||
              this.tokens.matches1($e.TokenType._abstract) ||
              this.tokens.matches1($e.TokenType._readonly) ||
              this.tokens.matches1($e.TokenType._override) ||
              this.tokens.matches1($e.TokenType.nonNullAssertion)
            ? (this.tokens.removeInitialToken(), !0)
            : this.tokens.matches1($e.TokenType._enum) ||
              this.tokens.matches2($e.TokenType._const, $e.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2($e.TokenType._export, $e.TokenType._enum) ||
              this.tokens.matches3(
                $e.TokenType._export,
                $e.TokenType._const,
                $e.TokenType._enum
              )
            ? (this.processEnum(!0), !0)
            : !1;
        }
        processEnum(t = !1) {
          for (
            this.tokens.removeInitialToken();
            this.tokens.matches1($e.TokenType._const) ||
            this.tokens.matches1($e.TokenType._enum);

          )
            this.tokens.removeToken();
          let s = this.tokens.identifierName();
          this.tokens.removeToken(),
            t &&
              !this.isImportsTransformEnabled &&
              this.tokens.appendCode('export '),
            this.tokens.appendCode(`var ${s}; (function (${s})`),
            this.tokens.copyExpectedToken($e.TokenType.braceL),
            this.processEnumBody(s),
            this.tokens.copyExpectedToken($e.TokenType.braceR),
            t && this.isImportsTransformEnabled
              ? this.tokens.appendCode(`)(${s} || (exports.${s} = ${s} = {}));`)
              : this.tokens.appendCode(`)(${s} || (${s} = {}));`);
        }
        processEnumBody(t) {
          let s = null;
          for (; !this.tokens.matches1($e.TokenType.braceR); ) {
            let {nameStringCode: i, variableName: r} = this.extractEnumKeyInfo(
              this.tokens.currentToken()
            );
            this.tokens.removeInitialToken(),
              this.tokens.matches3(
                $e.TokenType.eq,
                $e.TokenType.string,
                $e.TokenType.comma
              ) ||
              this.tokens.matches3(
                $e.TokenType.eq,
                $e.TokenType.string,
                $e.TokenType.braceR
              )
                ? this.processStringLiteralEnumMember(t, i, r)
                : this.tokens.matches1($e.TokenType.eq)
                ? this.processExplicitValueEnumMember(t, i, r)
                : this.processImplicitValueEnumMember(t, i, r, s),
              this.tokens.matches1($e.TokenType.comma) &&
                this.tokens.removeToken(),
              r != null ? (s = r) : (s = `${t}[${i}]`);
          }
        }
        extractEnumKeyInfo(t) {
          if (t.type === $e.TokenType.name) {
            let s = this.tokens.identifierNameForToken(t);
            return {
              nameStringCode: `"${s}"`,
              variableName: Qh.default.call(void 0, s) ? s : null,
            };
          } else if (t.type === $e.TokenType.string) {
            let s = this.tokens.stringValueForToken(t);
            return {
              nameStringCode: this.tokens.code.slice(t.start, t.end),
              variableName: Qh.default.call(void 0, s) ? s : null,
            };
          } else
            throw new Error(
              'Expected name or string at beginning of enum element.'
            );
        }
        processStringLiteralEnumMember(t, s, i) {
          i != null
            ? (this.tokens.appendCode(`const ${i}`),
              this.tokens.copyToken(),
              this.tokens.copyToken(),
              this.tokens.appendCode(`; ${t}[${s}] = ${i};`))
            : (this.tokens.appendCode(`${t}[${s}]`),
              this.tokens.copyToken(),
              this.tokens.copyToken(),
              this.tokens.appendCode(';'));
        }
        processExplicitValueEnumMember(t, s, i) {
          let r = this.tokens.currentToken().rhsEndIndex;
          if (r == null)
            throw new Error('Expected rhsEndIndex on enum assign.');
          if (i != null) {
            for (
              this.tokens.appendCode(`const ${i}`), this.tokens.copyToken();
              this.tokens.currentIndex() < r;

            )
              this.rootTransformer.processToken();
            this.tokens.appendCode(`; ${t}[${t}[${s}] = ${i}] = ${s};`);
          } else {
            for (
              this.tokens.appendCode(`${t}[${t}[${s}]`),
                this.tokens.copyToken();
              this.tokens.currentIndex() < r;

            )
              this.rootTransformer.processToken();
            this.tokens.appendCode(`] = ${s};`);
          }
        }
        processImplicitValueEnumMember(t, s, i, r) {
          let a = r != null ? `${r} + 1` : '0';
          i != null && (this.tokens.appendCode(`const ${i} = ${a}; `), (a = i)),
            this.tokens.appendCode(`${t}[${t}[${s}] = ${a}] = ${s};`);
        }
      };
    Sc.default = wc;
  });
  var tf = Z((Ec) => {
    'use strict';
    Object.defineProperty(Ec, '__esModule', {value: !0});
    function yn(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var jx = It(),
      lt = be(),
      $x = Ah(),
      qx = yn($x),
      Kx = Oh(),
      Ux = yn(Kx),
      Hx = Bh(),
      Wx = yn(Hx),
      Gx = jh(),
      zx = yn(Gx),
      Xx = $h(),
      Yx = yn(Xx),
      Jx = Da(),
      Qx = yn(Jx),
      Zx = qh(),
      eg = yn(Zx),
      tg = Uh(),
      ng = yn(tg),
      sg = Hh(),
      ig = yn(sg),
      rg = Gh(),
      og = yn(rg),
      ag = Xh(),
      lg = yn(ag),
      cg = ef(),
      ug = yn(cg),
      Ic = class e {
        __init() {
          this.transformers = [];
        }
        __init2() {
          this.generatedVariables = [];
        }
        constructor(t, s, i, r) {
          e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            (this.nameManager = t.nameManager),
            (this.helperManager = t.helperManager);
          let {tokenProcessor: a, importProcessor: u} = t;
          (this.tokens = a),
            (this.isImportsTransformEnabled = s.includes('imports')),
            (this.isReactHotLoaderTransformEnabled =
              s.includes('react-hot-loader')),
            (this.disableESTransforms = !!r.disableESTransforms),
            r.disableESTransforms ||
              (this.transformers.push(new ig.default(a, this.nameManager)),
              this.transformers.push(new eg.default(a)),
              this.transformers.push(new ng.default(a, this.nameManager))),
            s.includes('jsx') &&
              (r.jsxRuntime !== 'preserve' &&
                this.transformers.push(
                  new Qx.default(this, a, u, this.nameManager, r)
                ),
              this.transformers.push(new og.default(this, a, u, r)));
          let d = null;
          if (s.includes('react-hot-loader')) {
            if (!r.filePath)
              throw new Error(
                'filePath is required when using the react-hot-loader transform.'
              );
            (d = new lg.default(a, r.filePath)), this.transformers.push(d);
          }
          if (s.includes('imports')) {
            if (u === null)
              throw new Error(
                'Expected non-null importProcessor with imports transform enabled.'
              );
            this.transformers.push(
              new Ux.default(
                this,
                a,
                u,
                this.nameManager,
                this.helperManager,
                d,
                i,
                !!r.enableLegacyTypeScriptModuleInterop,
                s.includes('typescript'),
                !!r.preserveDynamicImport
              )
            );
          } else
            this.transformers.push(
              new Wx.default(
                a,
                this.nameManager,
                this.helperManager,
                d,
                s.includes('typescript'),
                r
              )
            );
          s.includes('flow') &&
            this.transformers.push(
              new zx.default(this, a, s.includes('imports'))
            ),
            s.includes('typescript') &&
              this.transformers.push(
                new ug.default(this, a, s.includes('imports'))
              ),
            s.includes('jest') &&
              this.transformers.push(
                new Yx.default(this, a, this.nameManager, u)
              );
        }
        transform() {
          this.tokens.reset(), this.processBalancedCode();
          let s = this.isImportsTransformEnabled ? '"use strict";' : '';
          for (let u of this.transformers) s += u.getPrefixCode();
          (s += this.helperManager.emitHelpers()),
            (s += this.generatedVariables.map((u) => ` var ${u};`).join(''));
          for (let u of this.transformers) s += u.getHoistedCode();
          let i = '';
          for (let u of this.transformers) i += u.getSuffixCode();
          let r = this.tokens.finish(),
            {code: a} = r;
          if (a.startsWith('#!')) {
            let u = a.indexOf(`
`);
            return (
              u === -1 &&
                ((u = a.length),
                (a += `
`)),
              {
                code: a.slice(0, u + 1) + s + a.slice(u + 1) + i,
                mappings: this.shiftMappings(r.mappings, s.length),
              }
            );
          } else
            return {
              code: s + a + i,
              mappings: this.shiftMappings(r.mappings, s.length),
            };
        }
        processBalancedCode() {
          let t = 0,
            s = 0;
          for (; !this.tokens.isAtEnd(); ) {
            if (
              this.tokens.matches1(lt.TokenType.braceL) ||
              this.tokens.matches1(lt.TokenType.dollarBraceL)
            )
              t++;
            else if (this.tokens.matches1(lt.TokenType.braceR)) {
              if (t === 0) return;
              t--;
            }
            if (this.tokens.matches1(lt.TokenType.parenL)) s++;
            else if (this.tokens.matches1(lt.TokenType.parenR)) {
              if (s === 0) return;
              s--;
            }
            this.processToken();
          }
        }
        processToken() {
          if (this.tokens.matches1(lt.TokenType._class)) {
            this.processClass();
            return;
          }
          for (let t of this.transformers) if (t.process()) return;
          this.tokens.copyToken();
        }
        processNamedClass() {
          if (!this.tokens.matches2(lt.TokenType._class, lt.TokenType.name))
            throw new Error('Expected identifier for exported class name.');
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return this.processClass(), t;
        }
        processClass() {
          let t = qx.default.call(
              void 0,
              this,
              this.tokens,
              this.nameManager,
              this.disableESTransforms
            ),
            s =
              (t.headerInfo.isExpression || !t.headerInfo.className) &&
              t.staticInitializerNames.length +
                t.instanceInitializerNames.length >
                0,
            i = t.headerInfo.className;
          s &&
            ((i = this.nameManager.claimFreeName('_class')),
            this.generatedVariables.push(i),
            this.tokens.appendCode(` (${i} =`));
          let a = this.tokens.currentToken().contextId;
          if (a == null)
            throw new Error('Expected class to have a context ID.');
          for (
            this.tokens.copyExpectedToken(lt.TokenType._class);
            !this.tokens.matchesContextIdAndLabel(lt.TokenType.braceL, a);

          )
            this.processToken();
          this.processClassBody(t, i);
          let u = t.staticInitializerNames.map((d) => `${i}.${d}()`);
          s
            ? this.tokens.appendCode(
                `, ${u.map((d) => `${d}, `).join('')}${i})`
              )
            : t.staticInitializerNames.length > 0 &&
              this.tokens.appendCode(` ${u.map((d) => `${d};`).join(' ')}`);
        }
        processClassBody(t, s) {
          let {
              headerInfo: i,
              constructorInsertPos: r,
              constructorInitializerStatements: a,
              fields: u,
              instanceInitializerNames: d,
              rangesToRemove: y,
            } = t,
            g = 0,
            L = 0,
            p = this.tokens.currentToken().contextId;
          if (p == null)
            throw new Error('Expected non-null context ID on class.');
          this.tokens.copyExpectedToken(lt.TokenType.braceL),
            this.isReactHotLoaderTransformEnabled &&
              this.tokens.appendCode(
                '__reactstandin__regenerateByEval(key, code) {this[key] = eval(code);}'
              );
          let h = a.length + d.length > 0;
          if (r === null && h) {
            let T = this.makeConstructorInitCode(a, d, s);
            if (i.hasSuperclass) {
              let x = this.nameManager.claimFreeName('args');
              this.tokens.appendCode(
                `constructor(...${x}) { super(...${x}); ${T}; }`
              );
            } else this.tokens.appendCode(`constructor() { ${T}; }`);
          }
          for (
            ;
            !this.tokens.matchesContextIdAndLabel(lt.TokenType.braceR, p);

          )
            if (g < u.length && this.tokens.currentIndex() === u[g].start) {
              let T = !1;
              for (
                this.tokens.matches1(lt.TokenType.bracketL)
                  ? this.tokens.copyTokenWithPrefix(
                      `${u[g].initializerName}() {this`
                    )
                  : this.tokens.matches1(lt.TokenType.string) ||
                    this.tokens.matches1(lt.TokenType.num)
                  ? (this.tokens.copyTokenWithPrefix(
                      `${u[g].initializerName}() {this[`
                    ),
                    (T = !0))
                  : this.tokens.copyTokenWithPrefix(
                      `${u[g].initializerName}() {this.`
                    );
                this.tokens.currentIndex() < u[g].end;

              )
                T &&
                  this.tokens.currentIndex() === u[g].equalsIndex &&
                  this.tokens.appendCode(']'),
                  this.processToken();
              this.tokens.appendCode('}'), g++;
            } else if (
              L < y.length &&
              this.tokens.currentIndex() >= y[L].start
            ) {
              for (
                this.tokens.currentIndex() < y[L].end &&
                this.tokens.removeInitialToken();
                this.tokens.currentIndex() < y[L].end;

              )
                this.tokens.removeToken();
              L++;
            } else
              this.tokens.currentIndex() === r
                ? (this.tokens.copyToken(),
                  h &&
                    this.tokens.appendCode(
                      `;${this.makeConstructorInitCode(a, d, s)};`
                    ),
                  this.processToken())
                : this.processToken();
          this.tokens.copyExpectedToken(lt.TokenType.braceR);
        }
        makeConstructorInitCode(t, s, i) {
          return [...t, ...s.map((r) => `${i}.prototype.${r}.call(this)`)].join(
            ';'
          );
        }
        processPossibleArrowParamEnd() {
          if (
            this.tokens.matches2(lt.TokenType.parenR, lt.TokenType.colon) &&
            this.tokens.tokenAtRelativeIndex(1).isType
          ) {
            let t = this.tokens.currentIndex() + 1;
            for (; this.tokens.tokens[t].isType; ) t++;
            if (this.tokens.matches1AtIndex(t, lt.TokenType.arrow)) {
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
            !this.tokens.matchesContextual(jx.ContextualKeyword._async) &&
            !this.tokens.matches1(lt.TokenType._async)
          )
            return !1;
          let t = this.tokens.tokenAtRelativeIndex(1);
          if (t.type !== lt.TokenType.lessThan || !t.isType) return !1;
          let s = this.tokens.currentIndex() + 1;
          for (; this.tokens.tokens[s].isType; ) s++;
          if (this.tokens.matches1AtIndex(s, lt.TokenType.parenL)) {
            for (
              this.tokens.replaceToken('async ('),
                this.tokens.removeInitialToken();
              this.tokens.currentIndex() < s;

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
        shiftMappings(t, s) {
          for (let i = 0; i < t.length; i++) {
            let r = t[i];
            r !== void 0 && (t[i] = r + s);
          }
          return t;
        }
      };
    Ec.default = Ic;
  });
  var rf = Z((hr) => {
    'use strict';
    hr.__esModule = !0;
    hr.LinesAndColumns = void 0;
    var Mo = `
`,
      nf = '\r',
      sf = (function () {
        function e(t) {
          this.string = t;
          for (var s = [0], i = 0; i < t.length; )
            switch (t[i]) {
              case Mo:
                (i += Mo.length), s.push(i);
                break;
              case nf:
                (i += nf.length), t[i] === Mo && (i += Mo.length), s.push(i);
                break;
              default:
                i++;
                break;
            }
          this.offsets = s;
        }
        return (
          (e.prototype.locationForIndex = function (t) {
            if (t < 0 || t > this.string.length) return null;
            for (var s = 0, i = this.offsets; i[s + 1] <= t; ) s++;
            var r = t - i[s];
            return {line: s, column: r};
          }),
          (e.prototype.indexForLocation = function (t) {
            var s = t.line,
              i = t.column;
            return s < 0 ||
              s >= this.offsets.length ||
              i < 0 ||
              i > this.lengthOfLine(s)
              ? null
              : this.offsets[s] + i;
          }),
          (e.prototype.lengthOfLine = function (t) {
            var s = this.offsets[t],
              i =
                t === this.offsets.length - 1
                  ? this.string.length
                  : this.offsets[t + 1];
            return i - s;
          }),
          e
        );
      })();
    hr.LinesAndColumns = sf;
    hr.default = sf;
  });
  var of = Z((Ac) => {
    'use strict';
    Object.defineProperty(Ac, '__esModule', {value: !0});
    function pg(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var hg = rf(),
      fg = pg(hg),
      dg = be();
    function mg(e, t) {
      if (t.length === 0) return '';
      let s = Object.keys(t[0]).filter(
          (h) =>
            h !== 'type' &&
            h !== 'value' &&
            h !== 'start' &&
            h !== 'end' &&
            h !== 'loc'
        ),
        i = Object.keys(t[0].type).filter(
          (h) => h !== 'label' && h !== 'keyword'
        ),
        r = ['Location', 'Label', 'Raw', ...s, ...i],
        a = new fg.default(e),
        u = [r, ...t.map(y)],
        d = r.map(() => 0);
      for (let h of u)
        for (let T = 0; T < h.length; T++) d[T] = Math.max(d[T], h[T].length);
      return u.map((h) => h.map((T, x) => T.padEnd(d[x])).join(' ')).join(`
`);
      function y(h) {
        let T = e.slice(h.start, h.end);
        return [
          L(h.start, h.end),
          dg.formatTokenType.call(void 0, h.type),
          yg(String(T), 14),
          ...s.map((x) => g(h[x], x)),
          ...i.map((x) => g(h.type[x], x)),
        ];
      }
      function g(h, T) {
        return h === !0 ? T : h === !1 || h === null ? '' : String(h);
      }
      function L(h, T) {
        return `${p(h)}-${p(T)}`;
      }
      function p(h) {
        let T = a.locationForIndex(h);
        return T ? `${T.line + 1}:${T.column + 1}` : 'Unknown';
      }
    }
    Ac.default = mg;
    function yg(e, t) {
      return e.length > t ? `${e.slice(0, t - 3)}...` : e;
    }
  });
  var af = Z((Pc) => {
    'use strict';
    Object.defineProperty(Pc, '__esModule', {value: !0});
    function Tg(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Gt = be(),
      kg = Wi(),
      vg = Tg(kg);
    function xg(e) {
      let t = new Set();
      for (let s = 0; s < e.tokens.length; s++)
        e.matches1AtIndex(s, Gt.TokenType._import) &&
          !e.matches3AtIndex(
            s,
            Gt.TokenType._import,
            Gt.TokenType.name,
            Gt.TokenType.eq
          ) &&
          gg(e, s, t);
      return t;
    }
    Pc.default = xg;
    function gg(e, t, s) {
      t++,
        !e.matches1AtIndex(t, Gt.TokenType.parenL) &&
          (e.matches1AtIndex(t, Gt.TokenType.name) &&
            (s.add(e.identifierNameAtIndex(t)),
            t++,
            e.matches1AtIndex(t, Gt.TokenType.comma) && t++),
          e.matches1AtIndex(t, Gt.TokenType.star) &&
            ((t += 2), s.add(e.identifierNameAtIndex(t)), t++),
          e.matches1AtIndex(t, Gt.TokenType.braceL) && (t++, _g(e, t, s)));
    }
    function _g(e, t, s) {
      for (;;) {
        if (e.matches1AtIndex(t, Gt.TokenType.braceR)) return;
        let i = vg.default.call(void 0, e, t);
        if (
          ((t = i.endIndex),
          i.isType || s.add(i.rightName),
          e.matches2AtIndex(t, Gt.TokenType.comma, Gt.TokenType.braceR))
        )
          return;
        if (e.matches1AtIndex(t, Gt.TokenType.braceR)) return;
        if (e.matches1AtIndex(t, Gt.TokenType.comma)) t++;
        else
          throw new Error(`Unexpected token: ${JSON.stringify(e.tokens[t])}`);
      }
    }
  });
  var uf = Z((fr) => {
    'use strict';
    Object.defineProperty(fr, '__esModule', {value: !0});
    function vs(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var bg = N1(),
      Cg = vs(bg),
      wg = $1(),
      Sg = vs(wg),
      Ig = q1(),
      Eg = H1(),
      lf = vs(Eg),
      Ag = G1(),
      Pg = vs(Ag),
      Ng = pp(),
      Rg = Ul(),
      Lg = Sh(),
      Og = vs(Lg),
      Dg = tf(),
      Mg = vs(Dg),
      Fg = of(),
      Bg = vs(Fg),
      Vg = af(),
      jg = vs(Vg);
    function $g() {
      return '3.32.0';
    }
    fr.getVersion = $g;
    function qg(e, t) {
      Ng.validateOptions.call(void 0, t);
      try {
        let s = cf(e, t),
          r = new Mg.default(
            s,
            t.transforms,
            !!t.enableLegacyBabel5ModuleInterop,
            t
          ).transform(),
          a = {code: r.code};
        if (t.sourceMapOptions) {
          if (!t.filePath)
            throw new Error(
              'filePath must be specified when generating a source map.'
            );
          a = {
            ...a,
            sourceMap: Sg.default.call(
              void 0,
              r,
              t.filePath,
              t.sourceMapOptions,
              e,
              s.tokenProcessor.tokens
            ),
          };
        }
        return a;
      } catch (s) {
        throw (
          (t.filePath &&
            (s.message = `Error transforming ${t.filePath}: ${s.message}`),
          s)
        );
      }
    }
    fr.transform = qg;
    function Kg(e, t) {
      let s = cf(e, t).tokenProcessor.tokens;
      return Bg.default.call(void 0, e, s);
    }
    fr.getFormattedTokens = Kg;
    function cf(e, t) {
      let s = t.transforms.includes('jsx'),
        i = t.transforms.includes('typescript'),
        r = t.transforms.includes('flow'),
        a = t.disableESTransforms === !0,
        u = Rg.parse.call(void 0, e, s, i, r),
        d = u.tokens,
        y = u.scopes,
        g = new Pg.default(e, d),
        L = new Ig.HelperManager(g),
        p = new Og.default(e, d, r, a, L),
        h = !!t.enableLegacyTypeScriptModuleInterop,
        T = null;
      return (
        t.transforms.includes('imports')
          ? ((T = new Cg.default(
              g,
              p,
              h,
              t,
              t.transforms.includes('typescript'),
              L
            )),
            T.preprocessTokens(),
            lf.default.call(void 0, p, y, T.getGlobalNames()),
            t.transforms.includes('typescript') && T.pruneTypeOnlyImports())
          : t.transforms.includes('typescript') &&
            lf.default.call(void 0, p, y, jg.default.call(void 0, p)),
        {
          tokenProcessor: p,
          scopes: y,
          nameManager: g,
          importProcessor: T,
          helperManager: L,
        }
      );
    }
  });
  var hf = Z((Fo, pf) => {
    (function (e, t) {
      typeof Fo == 'object' && typeof pf < 'u'
        ? t(Fo)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.acorn = {})));
    })(Fo, function (e) {
      'use strict';
      var t = [
          509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166,
          1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2,
          54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9,
          6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11,
          6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8,
          2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13,
          9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5,
          9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3,
          6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2,
          7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4,
          2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0,
          7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0,
          2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4,
          4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15,
          0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10,
          9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759,
          9, 787719, 239,
        ],
        s = [
          0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4,
          48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35,
          5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2,
          1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2,
          43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25,
          71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27,
          28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39,
          27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47,
          20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0,
          9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6,
          2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4,
          4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45,
          52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0,
          60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2,
          1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0,
          22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29,
          113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0,
          2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071,
          18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29,
          19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12,
          65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290,
          16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991,
          84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3,
          7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30,
          2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5,
          262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3,
          0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2,
          1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2,
          2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2,
          3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153,
          7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191,
        ],
        i =
          '\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0897-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0CF3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECE\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u180F-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\u30FB\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F\uFF65',
        r =
          '\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC',
        a = {
          3: 'abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile',
          5: 'class enum extends super const export import',
          6: 'enum',
          strict:
            'implements interface let package private protected public static yield',
          strictBind: 'eval arguments',
        },
        u =
          'break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this',
        d = {
          5: u,
          '5module': u + ' export import',
          6: u + ' const class extends export import super',
        },
        y = /^in(stanceof)?$/,
        g = new RegExp('[' + r + ']'),
        L = new RegExp('[' + r + i + ']');
      function p(n, o) {
        for (var l = 65536, f = 0; f < o.length; f += 2) {
          if (((l += o[f]), l > n)) return !1;
          if (((l += o[f + 1]), l >= n)) return !0;
        }
        return !1;
      }
      function h(n, o) {
        return n < 65
          ? n === 36
          : n < 91
          ? !0
          : n < 97
          ? n === 95
          : n < 123
          ? !0
          : n <= 65535
          ? n >= 170 && g.test(String.fromCharCode(n))
          : o === !1
          ? !1
          : p(n, s);
      }
      function T(n, o) {
        return n < 48
          ? n === 36
          : n < 58
          ? !0
          : n < 65
          ? !1
          : n < 91
          ? !0
          : n < 97
          ? n === 95
          : n < 123
          ? !0
          : n <= 65535
          ? n >= 170 && L.test(String.fromCharCode(n))
          : o === !1
          ? !1
          : p(n, s) || p(n, t);
      }
      var x = function (o, l) {
        l === void 0 && (l = {}),
          (this.label = o),
          (this.keyword = l.keyword),
          (this.beforeExpr = !!l.beforeExpr),
          (this.startsExpr = !!l.startsExpr),
          (this.isLoop = !!l.isLoop),
          (this.isAssign = !!l.isAssign),
          (this.prefix = !!l.prefix),
          (this.postfix = !!l.postfix),
          (this.binop = l.binop || null),
          (this.updateContext = null);
      };
      function w(n, o) {
        return new x(n, {beforeExpr: !0, binop: o});
      }
      var S = {beforeExpr: !0},
        A = {startsExpr: !0},
        U = {};
      function M(n, o) {
        return o === void 0 && (o = {}), (o.keyword = n), (U[n] = new x(n, o));
      }
      var c = {
          num: new x('num', A),
          regexp: new x('regexp', A),
          string: new x('string', A),
          name: new x('name', A),
          privateId: new x('privateId', A),
          eof: new x('eof'),
          bracketL: new x('[', {beforeExpr: !0, startsExpr: !0}),
          bracketR: new x(']'),
          braceL: new x('{', {beforeExpr: !0, startsExpr: !0}),
          braceR: new x('}'),
          parenL: new x('(', {beforeExpr: !0, startsExpr: !0}),
          parenR: new x(')'),
          comma: new x(',', S),
          semi: new x(';', S),
          colon: new x(':', S),
          dot: new x('.'),
          question: new x('?', S),
          questionDot: new x('?.'),
          arrow: new x('=>', S),
          template: new x('template'),
          invalidTemplate: new x('invalidTemplate'),
          ellipsis: new x('...', S),
          backQuote: new x('`', A),
          dollarBraceL: new x('${', {beforeExpr: !0, startsExpr: !0}),
          eq: new x('=', {beforeExpr: !0, isAssign: !0}),
          assign: new x('_=', {beforeExpr: !0, isAssign: !0}),
          incDec: new x('++/--', {prefix: !0, postfix: !0, startsExpr: !0}),
          prefix: new x('!/~', {beforeExpr: !0, prefix: !0, startsExpr: !0}),
          logicalOR: w('||', 1),
          logicalAND: w('&&', 2),
          bitwiseOR: w('|', 3),
          bitwiseXOR: w('^', 4),
          bitwiseAND: w('&', 5),
          equality: w('==/!=/===/!==', 6),
          relational: w('</>/<=/>=', 7),
          bitShift: w('<</>>/>>>', 8),
          plusMin: new x('+/-', {
            beforeExpr: !0,
            binop: 9,
            prefix: !0,
            startsExpr: !0,
          }),
          modulo: w('%', 10),
          star: w('*', 10),
          slash: w('/', 10),
          starstar: new x('**', {beforeExpr: !0}),
          coalesce: w('??', 1),
          _break: M('break'),
          _case: M('case', S),
          _catch: M('catch'),
          _continue: M('continue'),
          _debugger: M('debugger'),
          _default: M('default', S),
          _do: M('do', {isLoop: !0, beforeExpr: !0}),
          _else: M('else', S),
          _finally: M('finally'),
          _for: M('for', {isLoop: !0}),
          _function: M('function', A),
          _if: M('if'),
          _return: M('return', S),
          _switch: M('switch'),
          _throw: M('throw', S),
          _try: M('try'),
          _var: M('var'),
          _const: M('const'),
          _while: M('while', {isLoop: !0}),
          _with: M('with'),
          _new: M('new', {beforeExpr: !0, startsExpr: !0}),
          _this: M('this', A),
          _super: M('super', A),
          _class: M('class', A),
          _extends: M('extends', S),
          _export: M('export'),
          _import: M('import', A),
          _null: M('null', A),
          _true: M('true', A),
          _false: M('false', A),
          _in: M('in', {beforeExpr: !0, binop: 7}),
          _instanceof: M('instanceof', {beforeExpr: !0, binop: 7}),
          _typeof: M('typeof', {beforeExpr: !0, prefix: !0, startsExpr: !0}),
          _void: M('void', {beforeExpr: !0, prefix: !0, startsExpr: !0}),
          _delete: M('delete', {beforeExpr: !0, prefix: !0, startsExpr: !0}),
        },
        R = /\r\n?|\n|\u2028|\u2029/,
        W = new RegExp(R.source, 'g');
      function X(n) {
        return n === 10 || n === 13 || n === 8232 || n === 8233;
      }
      function ie(n, o, l) {
        l === void 0 && (l = n.length);
        for (var f = o; f < l; f++) {
          var m = n.charCodeAt(f);
          if (X(m))
            return f < l - 1 && m === 13 && n.charCodeAt(f + 1) === 10
              ? f + 2
              : f + 1;
        }
        return -1;
      }
      var pe = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
        ae = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
        He = Object.prototype,
        qe = He.hasOwnProperty,
        Bt = He.toString,
        mt =
          Object.hasOwn ||
          function (n, o) {
            return qe.call(n, o);
          },
        kt =
          Array.isArray ||
          function (n) {
            return Bt.call(n) === '[object Array]';
          },
        At = Object.create(null);
      function tt(n) {
        return (
          At[n] || (At[n] = new RegExp('^(?:' + n.replace(/ /g, '|') + ')$'))
        );
      }
      function nt(n) {
        return n <= 65535
          ? String.fromCharCode(n)
          : ((n -= 65536),
            String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
      }
      var _t =
          /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,
        ct = function (o, l) {
          (this.line = o), (this.column = l);
        };
      ct.prototype.offset = function (o) {
        return new ct(this.line, this.column + o);
      };
      var wt = function (o, l, f) {
        (this.start = l),
          (this.end = f),
          o.sourceFile !== null && (this.source = o.sourceFile);
      };
      function $t(n, o) {
        for (var l = 1, f = 0; ; ) {
          var m = ie(n, f, o);
          if (m < 0) return new ct(l, o - f);
          ++l, (f = m);
        }
      }
      var Pt = {
          ecmaVersion: null,
          sourceType: 'script',
          onInsertedSemicolon: null,
          onTrailingComma: null,
          allowReserved: null,
          allowReturnOutsideFunction: !1,
          allowImportExportEverywhere: !1,
          allowAwaitOutsideFunction: null,
          allowSuperOutsideMethod: null,
          allowHashBang: !1,
          checkPrivateFields: !0,
          locations: !1,
          onToken: null,
          onComment: null,
          ranges: !1,
          program: null,
          sourceFile: null,
          directSourceFile: null,
          preserveParens: !1,
        },
        qt = !1;
      function Tn(n) {
        var o = {};
        for (var l in Pt) o[l] = n && mt(n, l) ? n[l] : Pt[l];
        if (
          (o.ecmaVersion === 'latest'
            ? (o.ecmaVersion = 1e8)
            : o.ecmaVersion == null
            ? (!qt &&
                typeof console == 'object' &&
                console.warn &&
                ((qt = !0),
                console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)),
              (o.ecmaVersion = 11))
            : o.ecmaVersion >= 2015 && (o.ecmaVersion -= 2009),
          o.allowReserved == null && (o.allowReserved = o.ecmaVersion < 5),
          (!n || n.allowHashBang == null) &&
            (o.allowHashBang = o.ecmaVersion >= 14),
          kt(o.onToken))
        ) {
          var f = o.onToken;
          o.onToken = function (m) {
            return f.push(m);
          };
        }
        return kt(o.onComment) && (o.onComment = V(o, o.onComment)), o;
      }
      function V(n, o) {
        return function (l, f, m, E, O, Y) {
          var Q = {type: l ? 'Block' : 'Line', value: f, start: m, end: E};
          n.locations && (Q.loc = new wt(this, O, Y)),
            n.ranges && (Q.range = [m, E]),
            o.push(Q);
        };
      }
      var G = 1,
        J = 2,
        re = 4,
        ve = 8,
        he = 16,
        Ie = 32,
        Ee = 64,
        Le = 128,
        Xe = 256,
        We = 512,
        Ke = G | J | Xe;
      function ut(n, o) {
        return J | (n ? re : 0) | (o ? ve : 0);
      }
      var pt = 0,
        bt = 1,
        yt = 2,
        vt = 3,
        bn = 4,
        Dn = 5,
        Ge = function (o, l, f) {
          (this.options = o = Tn(o)),
            (this.sourceFile = o.sourceFile),
            (this.keywords = tt(
              d[
                o.ecmaVersion >= 6
                  ? 6
                  : o.sourceType === 'module'
                  ? '5module'
                  : 5
              ]
            ));
          var m = '';
          o.allowReserved !== !0 &&
            ((m = a[o.ecmaVersion >= 6 ? 6 : o.ecmaVersion === 5 ? 5 : 3]),
            o.sourceType === 'module' && (m += ' await')),
            (this.reservedWords = tt(m));
          var E = (m ? m + ' ' : '') + a.strict;
          (this.reservedWordsStrict = tt(E)),
            (this.reservedWordsStrictBind = tt(E + ' ' + a.strictBind)),
            (this.input = String(l)),
            (this.containsEsc = !1),
            f
              ? ((this.pos = f),
                (this.lineStart =
                  this.input.lastIndexOf(
                    `
`,
                    f - 1
                  ) + 1),
                (this.curLine = this.input
                  .slice(0, this.lineStart)
                  .split(R).length))
              : ((this.pos = this.lineStart = 0), (this.curLine = 1)),
            (this.type = c.eof),
            (this.value = null),
            (this.start = this.end = this.pos),
            (this.startLoc = this.endLoc = this.curPosition()),
            (this.lastTokEndLoc = this.lastTokStartLoc = null),
            (this.lastTokStart = this.lastTokEnd = this.pos),
            (this.context = this.initialContext()),
            (this.exprAllowed = !0),
            (this.inModule = o.sourceType === 'module'),
            (this.strict = this.inModule || this.strictDirective(this.pos)),
            (this.potentialArrowAt = -1),
            (this.potentialArrowInForAwait = !1),
            (this.yieldPos = this.awaitPos = this.awaitIdentPos = 0),
            (this.labels = []),
            (this.undefinedExports = Object.create(null)),
            this.pos === 0 &&
              o.allowHashBang &&
              this.input.slice(0, 2) === '#!' &&
              this.skipLineComment(2),
            (this.scopeStack = []),
            this.enterScope(G),
            (this.regexpState = null),
            (this.privateNameStack = []);
        },
        St = {
          inFunction: {configurable: !0},
          inGenerator: {configurable: !0},
          inAsync: {configurable: !0},
          canAwait: {configurable: !0},
          allowSuper: {configurable: !0},
          allowDirectSuper: {configurable: !0},
          treatFunctionsAsVar: {configurable: !0},
          allowNewDotTarget: {configurable: !0},
          inClassStaticBlock: {configurable: !0},
        };
      (Ge.prototype.parse = function () {
        var o = this.options.program || this.startNode();
        return this.nextToken(), this.parseTopLevel(o);
      }),
        (St.inFunction.get = function () {
          return (this.currentVarScope().flags & J) > 0;
        }),
        (St.inGenerator.get = function () {
          return (this.currentVarScope().flags & ve) > 0;
        }),
        (St.inAsync.get = function () {
          return (this.currentVarScope().flags & re) > 0;
        }),
        (St.canAwait.get = function () {
          for (var n = this.scopeStack.length - 1; n >= 0; n--) {
            var o = this.scopeStack[n],
              l = o.flags;
            if (l & (Xe | We)) return !1;
            if (l & J) return (l & re) > 0;
          }
          return (
            (this.inModule && this.options.ecmaVersion >= 13) ||
            this.options.allowAwaitOutsideFunction
          );
        }),
        (St.allowSuper.get = function () {
          var n = this.currentThisScope(),
            o = n.flags;
          return (o & Ee) > 0 || this.options.allowSuperOutsideMethod;
        }),
        (St.allowDirectSuper.get = function () {
          return (this.currentThisScope().flags & Le) > 0;
        }),
        (St.treatFunctionsAsVar.get = function () {
          return this.treatFunctionsAsVarInScope(this.currentScope());
        }),
        (St.allowNewDotTarget.get = function () {
          for (var n = this.scopeStack.length - 1; n >= 0; n--) {
            var o = this.scopeStack[n],
              l = o.flags;
            if (l & (Xe | We) || (l & J && !(l & he))) return !0;
          }
          return !1;
        }),
        (St.inClassStaticBlock.get = function () {
          return (this.currentVarScope().flags & Xe) > 0;
        }),
        (Ge.extend = function () {
          for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
          for (var f = this, m = 0; m < o.length; m++) f = o[m](f);
          return f;
        }),
        (Ge.parse = function (o, l) {
          return new this(l, o).parse();
        }),
        (Ge.parseExpressionAt = function (o, l, f) {
          var m = new this(f, o, l);
          return m.nextToken(), m.parseExpression();
        }),
        (Ge.tokenizer = function (o, l) {
          return new this(l, o);
        }),
        Object.defineProperties(Ge.prototype, St);
      var ot = Ge.prototype,
        zt = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
      (ot.strictDirective = function (n) {
        if (this.options.ecmaVersion < 5) return !1;
        for (;;) {
          (ae.lastIndex = n), (n += ae.exec(this.input)[0].length);
          var o = zt.exec(this.input.slice(n));
          if (!o) return !1;
          if ((o[1] || o[2]) === 'use strict') {
            ae.lastIndex = n + o[0].length;
            var l = ae.exec(this.input),
              f = l.index + l[0].length,
              m = this.input.charAt(f);
            return (
              m === ';' ||
              m === '}' ||
              (R.test(l[0]) &&
                !(
                  /[(`.[+\-/*%<>=,?^&]/.test(m) ||
                  (m === '!' && this.input.charAt(f + 1) === '=')
                ))
            );
          }
          (n += o[0].length),
            (ae.lastIndex = n),
            (n += ae.exec(this.input)[0].length),
            this.input[n] === ';' && n++;
        }
      }),
        (ot.eat = function (n) {
          return this.type === n ? (this.next(), !0) : !1;
        }),
        (ot.isContextual = function (n) {
          return this.type === c.name && this.value === n && !this.containsEsc;
        }),
        (ot.eatContextual = function (n) {
          return this.isContextual(n) ? (this.next(), !0) : !1;
        }),
        (ot.expectContextual = function (n) {
          this.eatContextual(n) || this.unexpected();
        }),
        (ot.canInsertSemicolon = function () {
          return (
            this.type === c.eof ||
            this.type === c.braceR ||
            R.test(this.input.slice(this.lastTokEnd, this.start))
          );
        }),
        (ot.insertSemicolon = function () {
          if (this.canInsertSemicolon())
            return (
              this.options.onInsertedSemicolon &&
                this.options.onInsertedSemicolon(
                  this.lastTokEnd,
                  this.lastTokEndLoc
                ),
              !0
            );
        }),
        (ot.semicolon = function () {
          !this.eat(c.semi) && !this.insertSemicolon() && this.unexpected();
        }),
        (ot.afterTrailingComma = function (n, o) {
          if (this.type === n)
            return (
              this.options.onTrailingComma &&
                this.options.onTrailingComma(
                  this.lastTokStart,
                  this.lastTokStartLoc
                ),
              o || this.next(),
              !0
            );
        }),
        (ot.expect = function (n) {
          this.eat(n) || this.unexpected();
        }),
        (ot.unexpected = function (n) {
          this.raise(n ?? this.start, 'Unexpected token');
        });
      var Xt = function () {
        this.shorthandAssign =
          this.trailingComma =
          this.parenthesizedAssign =
          this.parenthesizedBind =
          this.doubleProto =
            -1;
      };
      (ot.checkPatternErrors = function (n, o) {
        if (n) {
          n.trailingComma > -1 &&
            this.raiseRecoverable(
              n.trailingComma,
              'Comma is not permitted after the rest element'
            );
          var l = o ? n.parenthesizedAssign : n.parenthesizedBind;
          l > -1 &&
            this.raiseRecoverable(
              l,
              o ? 'Assigning to rvalue' : 'Parenthesized pattern'
            );
        }
      }),
        (ot.checkExpressionErrors = function (n, o) {
          if (!n) return !1;
          var l = n.shorthandAssign,
            f = n.doubleProto;
          if (!o) return l >= 0 || f >= 0;
          l >= 0 &&
            this.raise(
              l,
              'Shorthand property assignments are valid only in destructuring patterns'
            ),
            f >= 0 &&
              this.raiseRecoverable(f, 'Redefinition of __proto__ property');
        }),
        (ot.checkYieldAwaitInDefaultParams = function () {
          this.yieldPos &&
            (!this.awaitPos || this.yieldPos < this.awaitPos) &&
            this.raise(
              this.yieldPos,
              'Yield expression cannot be a default value'
            ),
            this.awaitPos &&
              this.raise(
                this.awaitPos,
                'Await expression cannot be a default value'
              );
        }),
        (ot.isSimpleAssignTarget = function (n) {
          return n.type === 'ParenthesizedExpression'
            ? this.isSimpleAssignTarget(n.expression)
            : n.type === 'Identifier' || n.type === 'MemberExpression';
        });
      var te = Ge.prototype;
      te.parseTopLevel = function (n) {
        var o = Object.create(null);
        for (n.body || (n.body = []); this.type !== c.eof; ) {
          var l = this.parseStatement(null, !0, o);
          n.body.push(l);
        }
        if (this.inModule)
          for (
            var f = 0, m = Object.keys(this.undefinedExports);
            f < m.length;
            f += 1
          ) {
            var E = m[f];
            this.raiseRecoverable(
              this.undefinedExports[E].start,
              "Export '" + E + "' is not defined"
            );
          }
        return (
          this.adaptDirectivePrologue(n.body),
          this.next(),
          (n.sourceType = this.options.sourceType),
          this.finishNode(n, 'Program')
        );
      };
      var Cn = {kind: 'loop'},
        Zn = {kind: 'switch'};
      (te.isLet = function (n) {
        if (this.options.ecmaVersion < 6 || !this.isContextual('let'))
          return !1;
        ae.lastIndex = this.pos;
        var o = ae.exec(this.input),
          l = this.pos + o[0].length,
          f = this.input.charCodeAt(l);
        if (f === 91 || f === 92) return !0;
        if (n) return !1;
        if (f === 123 || (f > 55295 && f < 56320)) return !0;
        if (h(f, !0)) {
          for (var m = l + 1; T((f = this.input.charCodeAt(m)), !0); ) ++m;
          if (f === 92 || (f > 55295 && f < 56320)) return !0;
          var E = this.input.slice(l, m);
          if (!y.test(E)) return !0;
        }
        return !1;
      }),
        (te.isAsyncFunction = function () {
          if (this.options.ecmaVersion < 8 || !this.isContextual('async'))
            return !1;
          ae.lastIndex = this.pos;
          var n = ae.exec(this.input),
            o = this.pos + n[0].length,
            l;
          return (
            !R.test(this.input.slice(this.pos, o)) &&
            this.input.slice(o, o + 8) === 'function' &&
            (o + 8 === this.input.length ||
              !(
                T((l = this.input.charCodeAt(o + 8))) ||
                (l > 55295 && l < 56320)
              ))
          );
        }),
        (te.isUsingKeyword = function (n, o) {
          if (
            this.options.ecmaVersion < 17 ||
            !this.isContextual(n ? 'await' : 'using')
          )
            return !1;
          ae.lastIndex = this.pos;
          var l = ae.exec(this.input),
            f = this.pos + l[0].length;
          if (R.test(this.input.slice(this.pos, f))) return !1;
          if (n) {
            var m = f + 5,
              E;
            if (
              this.input.slice(f, m) !== 'using' ||
              m === this.input.length ||
              T((E = this.input.charCodeAt(m))) ||
              (E > 55295 && E < 56320)
            )
              return !1;
            ae.lastIndex = m;
            var O = ae.exec(this.input);
            if (O && R.test(this.input.slice(m, m + O[0].length))) return !1;
          }
          if (o) {
            var Y = f + 2,
              Q;
            if (
              this.input.slice(f, Y) === 'of' &&
              (Y === this.input.length ||
                (!T((Q = this.input.charCodeAt(Y))) &&
                  !(Q > 55295 && Q < 56320)))
            )
              return !1;
          }
          var Te = this.input.charCodeAt(f);
          return h(Te, !0) || Te === 92;
        }),
        (te.isAwaitUsing = function (n) {
          return this.isUsingKeyword(!0, n);
        }),
        (te.isUsing = function (n) {
          return this.isUsingKeyword(!1, n);
        }),
        (te.parseStatement = function (n, o, l) {
          var f = this.type,
            m = this.startNode(),
            E;
          switch ((this.isLet(n) && ((f = c._var), (E = 'let')), f)) {
            case c._break:
            case c._continue:
              return this.parseBreakContinueStatement(m, f.keyword);
            case c._debugger:
              return this.parseDebuggerStatement(m);
            case c._do:
              return this.parseDoStatement(m);
            case c._for:
              return this.parseForStatement(m);
            case c._function:
              return (
                n &&
                  (this.strict || (n !== 'if' && n !== 'label')) &&
                  this.options.ecmaVersion >= 6 &&
                  this.unexpected(),
                this.parseFunctionStatement(m, !1, !n)
              );
            case c._class:
              return n && this.unexpected(), this.parseClass(m, !0);
            case c._if:
              return this.parseIfStatement(m);
            case c._return:
              return this.parseReturnStatement(m);
            case c._switch:
              return this.parseSwitchStatement(m);
            case c._throw:
              return this.parseThrowStatement(m);
            case c._try:
              return this.parseTryStatement(m);
            case c._const:
            case c._var:
              return (
                (E = E || this.value),
                n && E !== 'var' && this.unexpected(),
                this.parseVarStatement(m, E)
              );
            case c._while:
              return this.parseWhileStatement(m);
            case c._with:
              return this.parseWithStatement(m);
            case c.braceL:
              return this.parseBlock(!0, m);
            case c.semi:
              return this.parseEmptyStatement(m);
            case c._export:
            case c._import:
              if (this.options.ecmaVersion > 10 && f === c._import) {
                ae.lastIndex = this.pos;
                var O = ae.exec(this.input),
                  Y = this.pos + O[0].length,
                  Q = this.input.charCodeAt(Y);
                if (Q === 40 || Q === 46)
                  return this.parseExpressionStatement(
                    m,
                    this.parseExpression()
                  );
              }
              return (
                this.options.allowImportExportEverywhere ||
                  (o ||
                    this.raise(
                      this.start,
                      "'import' and 'export' may only appear at the top level"
                    ),
                  this.inModule ||
                    this.raise(
                      this.start,
                      "'import' and 'export' may appear only with 'sourceType: module'"
                    )),
                f === c._import ? this.parseImport(m) : this.parseExport(m, l)
              );
            default:
              if (this.isAsyncFunction())
                return (
                  n && this.unexpected(),
                  this.next(),
                  this.parseFunctionStatement(m, !0, !n)
                );
              var Te = this.isAwaitUsing(!1)
                ? 'await using'
                : this.isUsing(!1)
                ? 'using'
                : null;
              if (Te)
                return (
                  o &&
                    this.options.sourceType === 'script' &&
                    this.raise(
                      this.start,
                      'Using declaration cannot appear in the top level when source type is `script`'
                    ),
                  Te === 'await using' &&
                    (this.canAwait ||
                      this.raise(
                        this.start,
                        'Await using cannot appear outside of async function'
                      ),
                    this.next()),
                  this.next(),
                  this.parseVar(m, !1, Te),
                  this.semicolon(),
                  this.finishNode(m, 'VariableDeclaration')
                );
              var xe = this.value,
                Ze = this.parseExpression();
              return f === c.name &&
                Ze.type === 'Identifier' &&
                this.eat(c.colon)
                ? this.parseLabeledStatement(m, xe, Ze, n)
                : this.parseExpressionStatement(m, Ze);
          }
        }),
        (te.parseBreakContinueStatement = function (n, o) {
          var l = o === 'break';
          this.next(),
            this.eat(c.semi) || this.insertSemicolon()
              ? (n.label = null)
              : this.type !== c.name
              ? this.unexpected()
              : ((n.label = this.parseIdent()), this.semicolon());
          for (var f = 0; f < this.labels.length; ++f) {
            var m = this.labels[f];
            if (
              (n.label == null || m.name === n.label.name) &&
              ((m.kind != null && (l || m.kind === 'loop')) || (n.label && l))
            )
              break;
          }
          return (
            f === this.labels.length && this.raise(n.start, 'Unsyntactic ' + o),
            this.finishNode(n, l ? 'BreakStatement' : 'ContinueStatement')
          );
        }),
        (te.parseDebuggerStatement = function (n) {
          return (
            this.next(),
            this.semicolon(),
            this.finishNode(n, 'DebuggerStatement')
          );
        }),
        (te.parseDoStatement = function (n) {
          return (
            this.next(),
            this.labels.push(Cn),
            (n.body = this.parseStatement('do')),
            this.labels.pop(),
            this.expect(c._while),
            (n.test = this.parseParenExpression()),
            this.options.ecmaVersion >= 6 ? this.eat(c.semi) : this.semicolon(),
            this.finishNode(n, 'DoWhileStatement')
          );
        }),
        (te.parseForStatement = function (n) {
          this.next();
          var o =
            this.options.ecmaVersion >= 9 &&
            this.canAwait &&
            this.eatContextual('await')
              ? this.lastTokStart
              : -1;
          if (
            (this.labels.push(Cn),
            this.enterScope(0),
            this.expect(c.parenL),
            this.type === c.semi)
          )
            return o > -1 && this.unexpected(o), this.parseFor(n, null);
          var l = this.isLet();
          if (this.type === c._var || this.type === c._const || l) {
            var f = this.startNode(),
              m = l ? 'let' : this.value;
            return (
              this.next(),
              this.parseVar(f, !0, m),
              this.finishNode(f, 'VariableDeclaration'),
              this.parseForAfterInit(n, f, o)
            );
          }
          var E = this.isContextual('let'),
            O = !1,
            Y = this.isUsing(!0)
              ? 'using'
              : this.isAwaitUsing(!0)
              ? 'await using'
              : null;
          if (Y) {
            var Q = this.startNode();
            return (
              this.next(),
              Y === 'await using' && this.next(),
              this.parseVar(Q, !0, Y),
              this.finishNode(Q, 'VariableDeclaration'),
              this.parseForAfterInit(n, Q, o)
            );
          }
          var Te = this.containsEsc,
            xe = new Xt(),
            Ze = this.start,
            Lt =
              o > -1
                ? this.parseExprSubscripts(xe, 'await')
                : this.parseExpression(!0, xe);
          return this.type === c._in ||
            (O = this.options.ecmaVersion >= 6 && this.isContextual('of'))
            ? (o > -1
                ? (this.type === c._in && this.unexpected(o), (n.await = !0))
                : O &&
                  this.options.ecmaVersion >= 8 &&
                  (Lt.start === Ze &&
                  !Te &&
                  Lt.type === 'Identifier' &&
                  Lt.name === 'async'
                    ? this.unexpected()
                    : this.options.ecmaVersion >= 9 && (n.await = !1)),
              E &&
                O &&
                this.raise(
                  Lt.start,
                  "The left-hand side of a for-of loop may not start with 'let'."
                ),
              this.toAssignable(Lt, !1, xe),
              this.checkLValPattern(Lt),
              this.parseForIn(n, Lt))
            : (this.checkExpressionErrors(xe, !0),
              o > -1 && this.unexpected(o),
              this.parseFor(n, Lt));
        }),
        (te.parseForAfterInit = function (n, o, l) {
          return (this.type === c._in ||
            (this.options.ecmaVersion >= 6 && this.isContextual('of'))) &&
            o.declarations.length === 1
            ? (this.options.ecmaVersion >= 9 &&
                (this.type === c._in
                  ? l > -1 && this.unexpected(l)
                  : (n.await = l > -1)),
              this.parseForIn(n, o))
            : (l > -1 && this.unexpected(l), this.parseFor(n, o));
        }),
        (te.parseFunctionStatement = function (n, o, l) {
          return this.next(), this.parseFunction(n, Mn | (l ? 0 : xs), !1, o);
        }),
        (te.parseIfStatement = function (n) {
          return (
            this.next(),
            (n.test = this.parseParenExpression()),
            (n.consequent = this.parseStatement('if')),
            (n.alternate = this.eat(c._else)
              ? this.parseStatement('if')
              : null),
            this.finishNode(n, 'IfStatement')
          );
        }),
        (te.parseReturnStatement = function (n) {
          return (
            !this.inFunction &&
              !this.options.allowReturnOutsideFunction &&
              this.raise(this.start, "'return' outside of function"),
            this.next(),
            this.eat(c.semi) || this.insertSemicolon()
              ? (n.argument = null)
              : ((n.argument = this.parseExpression()), this.semicolon()),
            this.finishNode(n, 'ReturnStatement')
          );
        }),
        (te.parseSwitchStatement = function (n) {
          this.next(),
            (n.discriminant = this.parseParenExpression()),
            (n.cases = []),
            this.expect(c.braceL),
            this.labels.push(Zn),
            this.enterScope(0);
          for (var o, l = !1; this.type !== c.braceR; )
            if (this.type === c._case || this.type === c._default) {
              var f = this.type === c._case;
              o && this.finishNode(o, 'SwitchCase'),
                n.cases.push((o = this.startNode())),
                (o.consequent = []),
                this.next(),
                f
                  ? (o.test = this.parseExpression())
                  : (l &&
                      this.raiseRecoverable(
                        this.lastTokStart,
                        'Multiple default clauses'
                      ),
                    (l = !0),
                    (o.test = null)),
                this.expect(c.colon);
            } else
              o || this.unexpected(),
                o.consequent.push(this.parseStatement(null));
          return (
            this.exitScope(),
            o && this.finishNode(o, 'SwitchCase'),
            this.next(),
            this.labels.pop(),
            this.finishNode(n, 'SwitchStatement')
          );
        }),
        (te.parseThrowStatement = function (n) {
          return (
            this.next(),
            R.test(this.input.slice(this.lastTokEnd, this.start)) &&
              this.raise(this.lastTokEnd, 'Illegal newline after throw'),
            (n.argument = this.parseExpression()),
            this.semicolon(),
            this.finishNode(n, 'ThrowStatement')
          );
        });
      var _i = [];
      (te.parseCatchClauseParam = function () {
        var n = this.parseBindingAtom(),
          o = n.type === 'Identifier';
        return (
          this.enterScope(o ? Ie : 0),
          this.checkLValPattern(n, o ? bn : yt),
          this.expect(c.parenR),
          n
        );
      }),
        (te.parseTryStatement = function (n) {
          if (
            (this.next(),
            (n.block = this.parseBlock()),
            (n.handler = null),
            this.type === c._catch)
          ) {
            var o = this.startNode();
            this.next(),
              this.eat(c.parenL)
                ? (o.param = this.parseCatchClauseParam())
                : (this.options.ecmaVersion < 10 && this.unexpected(),
                  (o.param = null),
                  this.enterScope(0)),
              (o.body = this.parseBlock(!1)),
              this.exitScope(),
              (n.handler = this.finishNode(o, 'CatchClause'));
          }
          return (
            (n.finalizer = this.eat(c._finally) ? this.parseBlock() : null),
            !n.handler &&
              !n.finalizer &&
              this.raise(n.start, 'Missing catch or finally clause'),
            this.finishNode(n, 'TryStatement')
          );
        }),
        (te.parseVarStatement = function (n, o, l) {
          return (
            this.next(),
            this.parseVar(n, !1, o, l),
            this.semicolon(),
            this.finishNode(n, 'VariableDeclaration')
          );
        }),
        (te.parseWhileStatement = function (n) {
          return (
            this.next(),
            (n.test = this.parseParenExpression()),
            this.labels.push(Cn),
            (n.body = this.parseStatement('while')),
            this.labels.pop(),
            this.finishNode(n, 'WhileStatement')
          );
        }),
        (te.parseWithStatement = function (n) {
          return (
            this.strict && this.raise(this.start, "'with' in strict mode"),
            this.next(),
            (n.object = this.parseParenExpression()),
            (n.body = this.parseStatement('with')),
            this.finishNode(n, 'WithStatement')
          );
        }),
        (te.parseEmptyStatement = function (n) {
          return this.next(), this.finishNode(n, 'EmptyStatement');
        }),
        (te.parseLabeledStatement = function (n, o, l, f) {
          for (var m = 0, E = this.labels; m < E.length; m += 1) {
            var O = E[m];
            O.name === o &&
              this.raise(l.start, "Label '" + o + "' is already declared");
          }
          for (
            var Y = this.type.isLoop
                ? 'loop'
                : this.type === c._switch
                ? 'switch'
                : null,
              Q = this.labels.length - 1;
            Q >= 0;
            Q--
          ) {
            var Te = this.labels[Q];
            if (Te.statementStart === n.start)
              (Te.statementStart = this.start), (Te.kind = Y);
            else break;
          }
          return (
            this.labels.push({name: o, kind: Y, statementStart: this.start}),
            (n.body = this.parseStatement(
              f ? (f.indexOf('label') === -1 ? f + 'label' : f) : 'label'
            )),
            this.labels.pop(),
            (n.label = l),
            this.finishNode(n, 'LabeledStatement')
          );
        }),
        (te.parseExpressionStatement = function (n, o) {
          return (
            (n.expression = o),
            this.semicolon(),
            this.finishNode(n, 'ExpressionStatement')
          );
        }),
        (te.parseBlock = function (n, o, l) {
          for (
            n === void 0 && (n = !0),
              o === void 0 && (o = this.startNode()),
              o.body = [],
              this.expect(c.braceL),
              n && this.enterScope(0);
            this.type !== c.braceR;

          ) {
            var f = this.parseStatement(null);
            o.body.push(f);
          }
          return (
            l && (this.strict = !1),
            this.next(),
            n && this.exitScope(),
            this.finishNode(o, 'BlockStatement')
          );
        }),
        (te.parseFor = function (n, o) {
          return (
            (n.init = o),
            this.expect(c.semi),
            (n.test = this.type === c.semi ? null : this.parseExpression()),
            this.expect(c.semi),
            (n.update = this.type === c.parenR ? null : this.parseExpression()),
            this.expect(c.parenR),
            (n.body = this.parseStatement('for')),
            this.exitScope(),
            this.labels.pop(),
            this.finishNode(n, 'ForStatement')
          );
        }),
        (te.parseForIn = function (n, o) {
          var l = this.type === c._in;
          return (
            this.next(),
            o.type === 'VariableDeclaration' &&
              o.declarations[0].init != null &&
              (!l ||
                this.options.ecmaVersion < 8 ||
                this.strict ||
                o.kind !== 'var' ||
                o.declarations[0].id.type !== 'Identifier') &&
              this.raise(
                o.start,
                (l ? 'for-in' : 'for-of') +
                  ' loop variable declaration may not have an initializer'
              ),
            (n.left = o),
            (n.right = l ? this.parseExpression() : this.parseMaybeAssign()),
            this.expect(c.parenR),
            (n.body = this.parseStatement('for')),
            this.exitScope(),
            this.labels.pop(),
            this.finishNode(n, l ? 'ForInStatement' : 'ForOfStatement')
          );
        }),
        (te.parseVar = function (n, o, l, f) {
          for (n.declarations = [], n.kind = l; ; ) {
            var m = this.startNode();
            if (
              (this.parseVarId(m, l),
              this.eat(c.eq)
                ? (m.init = this.parseMaybeAssign(o))
                : !f &&
                  l === 'const' &&
                  !(
                    this.type === c._in ||
                    (this.options.ecmaVersion >= 6 && this.isContextual('of'))
                  )
                ? this.unexpected()
                : !f &&
                  (l === 'using' || l === 'await using') &&
                  this.options.ecmaVersion >= 17 &&
                  this.type !== c._in &&
                  !this.isContextual('of')
                ? this.raise(
                    this.lastTokEnd,
                    'Missing initializer in ' + l + ' declaration'
                  )
                : !f &&
                  m.id.type !== 'Identifier' &&
                  !(o && (this.type === c._in || this.isContextual('of')))
                ? this.raise(
                    this.lastTokEnd,
                    'Complex binding patterns require an initialization value'
                  )
                : (m.init = null),
              n.declarations.push(this.finishNode(m, 'VariableDeclarator')),
              !this.eat(c.comma))
            )
              break;
          }
          return n;
        }),
        (te.parseVarId = function (n, o) {
          (n.id =
            o === 'using' || o === 'await using'
              ? this.parseIdent()
              : this.parseBindingAtom()),
            this.checkLValPattern(n.id, o === 'var' ? bt : yt, !1);
        });
      var Mn = 1,
        xs = 2,
        Ds = 4;
      (te.parseFunction = function (n, o, l, f, m) {
        this.initFunction(n),
          (this.options.ecmaVersion >= 9 ||
            (this.options.ecmaVersion >= 6 && !f)) &&
            (this.type === c.star && o & xs && this.unexpected(),
            (n.generator = this.eat(c.star))),
          this.options.ecmaVersion >= 8 && (n.async = !!f),
          o & Mn &&
            ((n.id = o & Ds && this.type !== c.name ? null : this.parseIdent()),
            n.id &&
              !(o & xs) &&
              this.checkLValSimple(
                n.id,
                this.strict || n.generator || n.async
                  ? this.treatFunctionsAsVar
                    ? bt
                    : yt
                  : vt
              ));
        var E = this.yieldPos,
          O = this.awaitPos,
          Y = this.awaitIdentPos;
        return (
          (this.yieldPos = 0),
          (this.awaitPos = 0),
          (this.awaitIdentPos = 0),
          this.enterScope(ut(n.async, n.generator)),
          o & Mn || (n.id = this.type === c.name ? this.parseIdent() : null),
          this.parseFunctionParams(n),
          this.parseFunctionBody(n, l, !1, m),
          (this.yieldPos = E),
          (this.awaitPos = O),
          (this.awaitIdentPos = Y),
          this.finishNode(
            n,
            o & Mn ? 'FunctionDeclaration' : 'FunctionExpression'
          )
        );
      }),
        (te.parseFunctionParams = function (n) {
          this.expect(c.parenL),
            (n.params = this.parseBindingList(
              c.parenR,
              !1,
              this.options.ecmaVersion >= 8
            )),
            this.checkYieldAwaitInDefaultParams();
        }),
        (te.parseClass = function (n, o) {
          this.next();
          var l = this.strict;
          (this.strict = !0), this.parseClassId(n, o), this.parseClassSuper(n);
          var f = this.enterClassBody(),
            m = this.startNode(),
            E = !1;
          for (m.body = [], this.expect(c.braceL); this.type !== c.braceR; ) {
            var O = this.parseClassElement(n.superClass !== null);
            O &&
              (m.body.push(O),
              O.type === 'MethodDefinition' && O.kind === 'constructor'
                ? (E &&
                    this.raiseRecoverable(
                      O.start,
                      'Duplicate constructor in the same class'
                    ),
                  (E = !0))
                : O.key &&
                  O.key.type === 'PrivateIdentifier' &&
                  bi(f, O) &&
                  this.raiseRecoverable(
                    O.key.start,
                    "Identifier '#" + O.key.name + "' has already been declared"
                  ));
          }
          return (
            (this.strict = l),
            this.next(),
            (n.body = this.finishNode(m, 'ClassBody')),
            this.exitClassBody(),
            this.finishNode(n, o ? 'ClassDeclaration' : 'ClassExpression')
          );
        }),
        (te.parseClassElement = function (n) {
          if (this.eat(c.semi)) return null;
          var o = this.options.ecmaVersion,
            l = this.startNode(),
            f = '',
            m = !1,
            E = !1,
            O = 'method',
            Y = !1;
          if (this.eatContextual('static')) {
            if (o >= 13 && this.eat(c.braceL))
              return this.parseClassStaticBlock(l), l;
            this.isClassElementNameStart() || this.type === c.star
              ? (Y = !0)
              : (f = 'static');
          }
          if (
            ((l.static = Y),
            !f &&
              o >= 8 &&
              this.eatContextual('async') &&
              ((this.isClassElementNameStart() || this.type === c.star) &&
              !this.canInsertSemicolon()
                ? (E = !0)
                : (f = 'async')),
            !f && (o >= 9 || !E) && this.eat(c.star) && (m = !0),
            !f && !E && !m)
          ) {
            var Q = this.value;
            (this.eatContextual('get') || this.eatContextual('set')) &&
              (this.isClassElementNameStart() ? (O = Q) : (f = Q));
          }
          if (
            (f
              ? ((l.computed = !1),
                (l.key = this.startNodeAt(
                  this.lastTokStart,
                  this.lastTokStartLoc
                )),
                (l.key.name = f),
                this.finishNode(l.key, 'Identifier'))
              : this.parseClassElementName(l),
            o < 13 || this.type === c.parenL || O !== 'method' || m || E)
          ) {
            var Te = !l.static && es(l, 'constructor'),
              xe = Te && n;
            Te &&
              O !== 'method' &&
              this.raise(
                l.key.start,
                "Constructor can't have get/set modifier"
              ),
              (l.kind = Te ? 'constructor' : O),
              this.parseClassMethod(l, m, E, xe);
          } else this.parseClassField(l);
          return l;
        }),
        (te.isClassElementNameStart = function () {
          return (
            this.type === c.name ||
            this.type === c.privateId ||
            this.type === c.num ||
            this.type === c.string ||
            this.type === c.bracketL ||
            this.type.keyword
          );
        }),
        (te.parseClassElementName = function (n) {
          this.type === c.privateId
            ? (this.value === 'constructor' &&
                this.raise(
                  this.start,
                  "Classes can't have an element named '#constructor'"
                ),
              (n.computed = !1),
              (n.key = this.parsePrivateIdent()))
            : this.parsePropertyName(n);
        }),
        (te.parseClassMethod = function (n, o, l, f) {
          var m = n.key;
          n.kind === 'constructor'
            ? (o && this.raise(m.start, "Constructor can't be a generator"),
              l && this.raise(m.start, "Constructor can't be an async method"))
            : n.static &&
              es(n, 'prototype') &&
              this.raise(
                m.start,
                'Classes may not have a static property named prototype'
              );
          var E = (n.value = this.parseMethod(o, l, f));
          return (
            n.kind === 'get' &&
              E.params.length !== 0 &&
              this.raiseRecoverable(E.start, 'getter should have no params'),
            n.kind === 'set' &&
              E.params.length !== 1 &&
              this.raiseRecoverable(
                E.start,
                'setter should have exactly one param'
              ),
            n.kind === 'set' &&
              E.params[0].type === 'RestElement' &&
              this.raiseRecoverable(
                E.params[0].start,
                'Setter cannot use rest params'
              ),
            this.finishNode(n, 'MethodDefinition')
          );
        }),
        (te.parseClassField = function (n) {
          return (
            es(n, 'constructor')
              ? this.raise(
                  n.key.start,
                  "Classes can't have a field named 'constructor'"
                )
              : n.static &&
                es(n, 'prototype') &&
                this.raise(
                  n.key.start,
                  "Classes can't have a static field named 'prototype'"
                ),
            this.eat(c.eq)
              ? (this.enterScope(We | Ee),
                (n.value = this.parseMaybeAssign()),
                this.exitScope())
              : (n.value = null),
            this.semicolon(),
            this.finishNode(n, 'PropertyDefinition')
          );
        }),
        (te.parseClassStaticBlock = function (n) {
          n.body = [];
          var o = this.labels;
          for (
            this.labels = [], this.enterScope(Xe | Ee);
            this.type !== c.braceR;

          ) {
            var l = this.parseStatement(null);
            n.body.push(l);
          }
          return (
            this.next(),
            this.exitScope(),
            (this.labels = o),
            this.finishNode(n, 'StaticBlock')
          );
        }),
        (te.parseClassId = function (n, o) {
          this.type === c.name
            ? ((n.id = this.parseIdent()),
              o && this.checkLValSimple(n.id, yt, !1))
            : (o === !0 && this.unexpected(), (n.id = null));
        }),
        (te.parseClassSuper = function (n) {
          n.superClass = this.eat(c._extends)
            ? this.parseExprSubscripts(null, !1)
            : null;
        }),
        (te.enterClassBody = function () {
          var n = {declared: Object.create(null), used: []};
          return this.privateNameStack.push(n), n.declared;
        }),
        (te.exitClassBody = function () {
          var n = this.privateNameStack.pop(),
            o = n.declared,
            l = n.used;
          if (this.options.checkPrivateFields)
            for (
              var f = this.privateNameStack.length,
                m = f === 0 ? null : this.privateNameStack[f - 1],
                E = 0;
              E < l.length;
              ++E
            ) {
              var O = l[E];
              mt(o, O.name) ||
                (m
                  ? m.used.push(O)
                  : this.raiseRecoverable(
                      O.start,
                      "Private field '#" +
                        O.name +
                        "' must be declared in an enclosing class"
                    ));
            }
        });
      function bi(n, o) {
        var l = o.key.name,
          f = n[l],
          m = 'true';
        return (
          o.type === 'MethodDefinition' &&
            (o.kind === 'get' || o.kind === 'set') &&
            (m = (o.static ? 's' : 'i') + o.kind),
          (f === 'iget' && m === 'iset') ||
          (f === 'iset' && m === 'iget') ||
          (f === 'sget' && m === 'sset') ||
          (f === 'sset' && m === 'sget')
            ? ((n[l] = 'true'), !1)
            : f
            ? !0
            : ((n[l] = m), !1)
        );
      }
      function es(n, o) {
        var l = n.computed,
          f = n.key;
        return (
          !l &&
          ((f.type === 'Identifier' && f.name === o) ||
            (f.type === 'Literal' && f.value === o))
        );
      }
      (te.parseExportAllDeclaration = function (n, o) {
        return (
          this.options.ecmaVersion >= 11 &&
            (this.eatContextual('as')
              ? ((n.exported = this.parseModuleExportName()),
                this.checkExport(o, n.exported, this.lastTokStart))
              : (n.exported = null)),
          this.expectContextual('from'),
          this.type !== c.string && this.unexpected(),
          (n.source = this.parseExprAtom()),
          this.options.ecmaVersion >= 16 &&
            (n.attributes = this.parseWithClause()),
          this.semicolon(),
          this.finishNode(n, 'ExportAllDeclaration')
        );
      }),
        (te.parseExport = function (n, o) {
          if ((this.next(), this.eat(c.star)))
            return this.parseExportAllDeclaration(n, o);
          if (this.eat(c._default))
            return (
              this.checkExport(o, 'default', this.lastTokStart),
              (n.declaration = this.parseExportDefaultDeclaration()),
              this.finishNode(n, 'ExportDefaultDeclaration')
            );
          if (this.shouldParseExportStatement())
            (n.declaration = this.parseExportDeclaration(n)),
              n.declaration.type === 'VariableDeclaration'
                ? this.checkVariableExport(o, n.declaration.declarations)
                : this.checkExport(o, n.declaration.id, n.declaration.id.start),
              (n.specifiers = []),
              (n.source = null),
              this.options.ecmaVersion >= 16 && (n.attributes = []);
          else {
            if (
              ((n.declaration = null),
              (n.specifiers = this.parseExportSpecifiers(o)),
              this.eatContextual('from'))
            )
              this.type !== c.string && this.unexpected(),
                (n.source = this.parseExprAtom()),
                this.options.ecmaVersion >= 16 &&
                  (n.attributes = this.parseWithClause());
            else {
              for (var l = 0, f = n.specifiers; l < f.length; l += 1) {
                var m = f[l];
                this.checkUnreserved(m.local),
                  this.checkLocalExport(m.local),
                  m.local.type === 'Literal' &&
                    this.raise(
                      m.local.start,
                      'A string literal cannot be used as an exported binding without `from`.'
                    );
              }
              (n.source = null),
                this.options.ecmaVersion >= 16 && (n.attributes = []);
            }
            this.semicolon();
          }
          return this.finishNode(n, 'ExportNamedDeclaration');
        }),
        (te.parseExportDeclaration = function (n) {
          return this.parseStatement(null);
        }),
        (te.parseExportDefaultDeclaration = function () {
          var n;
          if (this.type === c._function || (n = this.isAsyncFunction())) {
            var o = this.startNode();
            return (
              this.next(),
              n && this.next(),
              this.parseFunction(o, Mn | Ds, !1, n)
            );
          } else if (this.type === c._class) {
            var l = this.startNode();
            return this.parseClass(l, 'nullableID');
          } else {
            var f = this.parseMaybeAssign();
            return this.semicolon(), f;
          }
        }),
        (te.checkExport = function (n, o, l) {
          n &&
            (typeof o != 'string' &&
              (o = o.type === 'Identifier' ? o.name : o.value),
            mt(n, o) &&
              this.raiseRecoverable(l, "Duplicate export '" + o + "'"),
            (n[o] = !0));
        }),
        (te.checkPatternExport = function (n, o) {
          var l = o.type;
          if (l === 'Identifier') this.checkExport(n, o, o.start);
          else if (l === 'ObjectPattern')
            for (var f = 0, m = o.properties; f < m.length; f += 1) {
              var E = m[f];
              this.checkPatternExport(n, E);
            }
          else if (l === 'ArrayPattern')
            for (var O = 0, Y = o.elements; O < Y.length; O += 1) {
              var Q = Y[O];
              Q && this.checkPatternExport(n, Q);
            }
          else
            l === 'Property'
              ? this.checkPatternExport(n, o.value)
              : l === 'AssignmentPattern'
              ? this.checkPatternExport(n, o.left)
              : l === 'RestElement' && this.checkPatternExport(n, o.argument);
        }),
        (te.checkVariableExport = function (n, o) {
          if (n)
            for (var l = 0, f = o; l < f.length; l += 1) {
              var m = f[l];
              this.checkPatternExport(n, m.id);
            }
        }),
        (te.shouldParseExportStatement = function () {
          return (
            this.type.keyword === 'var' ||
            this.type.keyword === 'const' ||
            this.type.keyword === 'class' ||
            this.type.keyword === 'function' ||
            this.isLet() ||
            this.isAsyncFunction()
          );
        }),
        (te.parseExportSpecifier = function (n) {
          var o = this.startNode();
          return (
            (o.local = this.parseModuleExportName()),
            (o.exported = this.eatContextual('as')
              ? this.parseModuleExportName()
              : o.local),
            this.checkExport(n, o.exported, o.exported.start),
            this.finishNode(o, 'ExportSpecifier')
          );
        }),
        (te.parseExportSpecifiers = function (n) {
          var o = [],
            l = !0;
          for (this.expect(c.braceL); !this.eat(c.braceR); ) {
            if (l) l = !1;
            else if ((this.expect(c.comma), this.afterTrailingComma(c.braceR)))
              break;
            o.push(this.parseExportSpecifier(n));
          }
          return o;
        }),
        (te.parseImport = function (n) {
          return (
            this.next(),
            this.type === c.string
              ? ((n.specifiers = _i), (n.source = this.parseExprAtom()))
              : ((n.specifiers = this.parseImportSpecifiers()),
                this.expectContextual('from'),
                (n.source =
                  this.type === c.string
                    ? this.parseExprAtom()
                    : this.unexpected())),
            this.options.ecmaVersion >= 16 &&
              (n.attributes = this.parseWithClause()),
            this.semicolon(),
            this.finishNode(n, 'ImportDeclaration')
          );
        }),
        (te.parseImportSpecifier = function () {
          var n = this.startNode();
          return (
            (n.imported = this.parseModuleExportName()),
            this.eatContextual('as')
              ? (n.local = this.parseIdent())
              : (this.checkUnreserved(n.imported), (n.local = n.imported)),
            this.checkLValSimple(n.local, yt),
            this.finishNode(n, 'ImportSpecifier')
          );
        }),
        (te.parseImportDefaultSpecifier = function () {
          var n = this.startNode();
          return (
            (n.local = this.parseIdent()),
            this.checkLValSimple(n.local, yt),
            this.finishNode(n, 'ImportDefaultSpecifier')
          );
        }),
        (te.parseImportNamespaceSpecifier = function () {
          var n = this.startNode();
          return (
            this.next(),
            this.expectContextual('as'),
            (n.local = this.parseIdent()),
            this.checkLValSimple(n.local, yt),
            this.finishNode(n, 'ImportNamespaceSpecifier')
          );
        }),
        (te.parseImportSpecifiers = function () {
          var n = [],
            o = !0;
          if (
            this.type === c.name &&
            (n.push(this.parseImportDefaultSpecifier()), !this.eat(c.comma))
          )
            return n;
          if (this.type === c.star)
            return n.push(this.parseImportNamespaceSpecifier()), n;
          for (this.expect(c.braceL); !this.eat(c.braceR); ) {
            if (o) o = !1;
            else if ((this.expect(c.comma), this.afterTrailingComma(c.braceR)))
              break;
            n.push(this.parseImportSpecifier());
          }
          return n;
        }),
        (te.parseWithClause = function () {
          var n = [];
          if (!this.eat(c._with)) return n;
          this.expect(c.braceL);
          for (var o = {}, l = !0; !this.eat(c.braceR); ) {
            if (l) l = !1;
            else if ((this.expect(c.comma), this.afterTrailingComma(c.braceR)))
              break;
            var f = this.parseImportAttribute(),
              m = f.key.type === 'Identifier' ? f.key.name : f.key.value;
            mt(o, m) &&
              this.raiseRecoverable(
                f.key.start,
                "Duplicate attribute key '" + m + "'"
              ),
              (o[m] = !0),
              n.push(f);
          }
          return n;
        }),
        (te.parseImportAttribute = function () {
          var n = this.startNode();
          return (
            (n.key =
              this.type === c.string
                ? this.parseExprAtom()
                : this.parseIdent(this.options.allowReserved !== 'never')),
            this.expect(c.colon),
            this.type !== c.string && this.unexpected(),
            (n.value = this.parseExprAtom()),
            this.finishNode(n, 'ImportAttribute')
          );
        }),
        (te.parseModuleExportName = function () {
          if (this.options.ecmaVersion >= 13 && this.type === c.string) {
            var n = this.parseLiteral(this.value);
            return (
              _t.test(n.value) &&
                this.raise(
                  n.start,
                  'An export name cannot include a lone surrogate.'
                ),
              n
            );
          }
          return this.parseIdent(!0);
        }),
        (te.adaptDirectivePrologue = function (n) {
          for (var o = 0; o < n.length && this.isDirectiveCandidate(n[o]); ++o)
            n[o].directive = n[o].expression.raw.slice(1, -1);
        }),
        (te.isDirectiveCandidate = function (n) {
          return (
            this.options.ecmaVersion >= 5 &&
            n.type === 'ExpressionStatement' &&
            n.expression.type === 'Literal' &&
            typeof n.expression.value == 'string' &&
            (this.input[n.start] === '"' || this.input[n.start] === "'")
          );
        });
      var Nt = Ge.prototype;
      (Nt.toAssignable = function (n, o, l) {
        if (this.options.ecmaVersion >= 6 && n)
          switch (n.type) {
            case 'Identifier':
              this.inAsync &&
                n.name === 'await' &&
                this.raise(
                  n.start,
                  "Cannot use 'await' as identifier inside an async function"
                );
              break;
            case 'ObjectPattern':
            case 'ArrayPattern':
            case 'AssignmentPattern':
            case 'RestElement':
              break;
            case 'ObjectExpression':
              (n.type = 'ObjectPattern'), l && this.checkPatternErrors(l, !0);
              for (var f = 0, m = n.properties; f < m.length; f += 1) {
                var E = m[f];
                this.toAssignable(E, o),
                  E.type === 'RestElement' &&
                    (E.argument.type === 'ArrayPattern' ||
                      E.argument.type === 'ObjectPattern') &&
                    this.raise(E.argument.start, 'Unexpected token');
              }
              break;
            case 'Property':
              n.kind !== 'init' &&
                this.raise(
                  n.key.start,
                  "Object pattern can't contain getter or setter"
                ),
                this.toAssignable(n.value, o);
              break;
            case 'ArrayExpression':
              (n.type = 'ArrayPattern'),
                l && this.checkPatternErrors(l, !0),
                this.toAssignableList(n.elements, o);
              break;
            case 'SpreadElement':
              (n.type = 'RestElement'),
                this.toAssignable(n.argument, o),
                n.argument.type === 'AssignmentPattern' &&
                  this.raise(
                    n.argument.start,
                    'Rest elements cannot have a default value'
                  );
              break;
            case 'AssignmentExpression':
              n.operator !== '=' &&
                this.raise(
                  n.left.end,
                  "Only '=' operator can be used for specifying default value."
                ),
                (n.type = 'AssignmentPattern'),
                delete n.operator,
                this.toAssignable(n.left, o);
              break;
            case 'ParenthesizedExpression':
              this.toAssignable(n.expression, o, l);
              break;
            case 'ChainExpression':
              this.raiseRecoverable(
                n.start,
                'Optional chaining cannot appear in left-hand side'
              );
              break;
            case 'MemberExpression':
              if (!o) break;
            default:
              this.raise(n.start, 'Assigning to rvalue');
          }
        else l && this.checkPatternErrors(l, !0);
        return n;
      }),
        (Nt.toAssignableList = function (n, o) {
          for (var l = n.length, f = 0; f < l; f++) {
            var m = n[f];
            m && this.toAssignable(m, o);
          }
          if (l) {
            var E = n[l - 1];
            this.options.ecmaVersion === 6 &&
              o &&
              E &&
              E.type === 'RestElement' &&
              E.argument.type !== 'Identifier' &&
              this.unexpected(E.argument.start);
          }
          return n;
        }),
        (Nt.parseSpread = function (n) {
          var o = this.startNode();
          return (
            this.next(),
            (o.argument = this.parseMaybeAssign(!1, n)),
            this.finishNode(o, 'SpreadElement')
          );
        }),
        (Nt.parseRestBinding = function () {
          var n = this.startNode();
          return (
            this.next(),
            this.options.ecmaVersion === 6 &&
              this.type !== c.name &&
              this.unexpected(),
            (n.argument = this.parseBindingAtom()),
            this.finishNode(n, 'RestElement')
          );
        }),
        (Nt.parseBindingAtom = function () {
          if (this.options.ecmaVersion >= 6)
            switch (this.type) {
              case c.bracketL:
                var n = this.startNode();
                return (
                  this.next(),
                  (n.elements = this.parseBindingList(c.bracketR, !0, !0)),
                  this.finishNode(n, 'ArrayPattern')
                );
              case c.braceL:
                return this.parseObj(!0);
            }
          return this.parseIdent();
        }),
        (Nt.parseBindingList = function (n, o, l, f) {
          for (var m = [], E = !0; !this.eat(n); )
            if (
              (E ? (E = !1) : this.expect(c.comma), o && this.type === c.comma)
            )
              m.push(null);
            else {
              if (l && this.afterTrailingComma(n)) break;
              if (this.type === c.ellipsis) {
                var O = this.parseRestBinding();
                this.parseBindingListItem(O),
                  m.push(O),
                  this.type === c.comma &&
                    this.raiseRecoverable(
                      this.start,
                      'Comma is not permitted after the rest element'
                    ),
                  this.expect(n);
                break;
              } else m.push(this.parseAssignableListItem(f));
            }
          return m;
        }),
        (Nt.parseAssignableListItem = function (n) {
          var o = this.parseMaybeDefault(this.start, this.startLoc);
          return this.parseBindingListItem(o), o;
        }),
        (Nt.parseBindingListItem = function (n) {
          return n;
        }),
        (Nt.parseMaybeDefault = function (n, o, l) {
          if (
            ((l = l || this.parseBindingAtom()),
            this.options.ecmaVersion < 6 || !this.eat(c.eq))
          )
            return l;
          var f = this.startNodeAt(n, o);
          return (
            (f.left = l),
            (f.right = this.parseMaybeAssign()),
            this.finishNode(f, 'AssignmentPattern')
          );
        }),
        (Nt.checkLValSimple = function (n, o, l) {
          o === void 0 && (o = pt);
          var f = o !== pt;
          switch (n.type) {
            case 'Identifier':
              this.strict &&
                this.reservedWordsStrictBind.test(n.name) &&
                this.raiseRecoverable(
                  n.start,
                  (f ? 'Binding ' : 'Assigning to ') +
                    n.name +
                    ' in strict mode'
                ),
                f &&
                  (o === yt &&
                    n.name === 'let' &&
                    this.raiseRecoverable(
                      n.start,
                      'let is disallowed as a lexically bound name'
                    ),
                  l &&
                    (mt(l, n.name) &&
                      this.raiseRecoverable(n.start, 'Argument name clash'),
                    (l[n.name] = !0)),
                  o !== Dn && this.declareName(n.name, o, n.start));
              break;
            case 'ChainExpression':
              this.raiseRecoverable(
                n.start,
                'Optional chaining cannot appear in left-hand side'
              );
              break;
            case 'MemberExpression':
              f && this.raiseRecoverable(n.start, 'Binding member expression');
              break;
            case 'ParenthesizedExpression':
              return (
                f &&
                  this.raiseRecoverable(
                    n.start,
                    'Binding parenthesized expression'
                  ),
                this.checkLValSimple(n.expression, o, l)
              );
            default:
              this.raise(n.start, (f ? 'Binding' : 'Assigning to') + ' rvalue');
          }
        }),
        (Nt.checkLValPattern = function (n, o, l) {
          switch ((o === void 0 && (o = pt), n.type)) {
            case 'ObjectPattern':
              for (var f = 0, m = n.properties; f < m.length; f += 1) {
                var E = m[f];
                this.checkLValInnerPattern(E, o, l);
              }
              break;
            case 'ArrayPattern':
              for (var O = 0, Y = n.elements; O < Y.length; O += 1) {
                var Q = Y[O];
                Q && this.checkLValInnerPattern(Q, o, l);
              }
              break;
            default:
              this.checkLValSimple(n, o, l);
          }
        }),
        (Nt.checkLValInnerPattern = function (n, o, l) {
          switch ((o === void 0 && (o = pt), n.type)) {
            case 'Property':
              this.checkLValInnerPattern(n.value, o, l);
              break;
            case 'AssignmentPattern':
              this.checkLValPattern(n.left, o, l);
              break;
            case 'RestElement':
              this.checkLValPattern(n.argument, o, l);
              break;
            default:
              this.checkLValPattern(n, o, l);
          }
        });
      var Rt = function (o, l, f, m, E) {
          (this.token = o),
            (this.isExpr = !!l),
            (this.preserveSpace = !!f),
            (this.override = m),
            (this.generator = !!E);
        },
        Ue = {
          b_stat: new Rt('{', !1),
          b_expr: new Rt('{', !0),
          b_tmpl: new Rt('${', !1),
          p_stat: new Rt('(', !1),
          p_expr: new Rt('(', !0),
          q_tmpl: new Rt('`', !0, !0, function (n) {
            return n.tryReadTemplateToken();
          }),
          f_stat: new Rt('function', !1),
          f_expr: new Rt('function', !0),
          f_expr_gen: new Rt('function', !0, !1, null, !0),
          f_gen: new Rt('function', !1, !1, null, !0),
        },
        wn = Ge.prototype;
      (wn.initialContext = function () {
        return [Ue.b_stat];
      }),
        (wn.curContext = function () {
          return this.context[this.context.length - 1];
        }),
        (wn.braceIsBlock = function (n) {
          var o = this.curContext();
          return o === Ue.f_expr || o === Ue.f_stat
            ? !0
            : n === c.colon && (o === Ue.b_stat || o === Ue.b_expr)
            ? !o.isExpr
            : n === c._return || (n === c.name && this.exprAllowed)
            ? R.test(this.input.slice(this.lastTokEnd, this.start))
            : n === c._else ||
              n === c.semi ||
              n === c.eof ||
              n === c.parenR ||
              n === c.arrow
            ? !0
            : n === c.braceL
            ? o === Ue.b_stat
            : n === c._var || n === c._const || n === c.name
            ? !1
            : !this.exprAllowed;
        }),
        (wn.inGeneratorContext = function () {
          for (var n = this.context.length - 1; n >= 1; n--) {
            var o = this.context[n];
            if (o.token === 'function') return o.generator;
          }
          return !1;
        }),
        (wn.updateContext = function (n) {
          var o,
            l = this.type;
          l.keyword && n === c.dot
            ? (this.exprAllowed = !1)
            : (o = l.updateContext)
            ? o.call(this, n)
            : (this.exprAllowed = l.beforeExpr);
        }),
        (wn.overrideContext = function (n) {
          this.curContext() !== n &&
            (this.context[this.context.length - 1] = n);
        }),
        (c.parenR.updateContext = c.braceR.updateContext =
          function () {
            if (this.context.length === 1) {
              this.exprAllowed = !0;
              return;
            }
            var n = this.context.pop();
            n === Ue.b_stat &&
              this.curContext().token === 'function' &&
              (n = this.context.pop()),
              (this.exprAllowed = !n.isExpr);
          }),
        (c.braceL.updateContext = function (n) {
          this.context.push(this.braceIsBlock(n) ? Ue.b_stat : Ue.b_expr),
            (this.exprAllowed = !0);
        }),
        (c.dollarBraceL.updateContext = function () {
          this.context.push(Ue.b_tmpl), (this.exprAllowed = !0);
        }),
        (c.parenL.updateContext = function (n) {
          var o =
            n === c._if || n === c._for || n === c._with || n === c._while;
          this.context.push(o ? Ue.p_stat : Ue.p_expr), (this.exprAllowed = !0);
        }),
        (c.incDec.updateContext = function () {}),
        (c._function.updateContext = c._class.updateContext =
          function (n) {
            n.beforeExpr &&
            n !== c._else &&
            !(n === c.semi && this.curContext() !== Ue.p_stat) &&
            !(
              n === c._return &&
              R.test(this.input.slice(this.lastTokEnd, this.start))
            ) &&
            !(
              (n === c.colon || n === c.braceL) &&
              this.curContext() === Ue.b_stat
            )
              ? this.context.push(Ue.f_expr)
              : this.context.push(Ue.f_stat),
              (this.exprAllowed = !1);
          }),
        (c.colon.updateContext = function () {
          this.curContext().token === 'function' && this.context.pop(),
            (this.exprAllowed = !0);
        }),
        (c.backQuote.updateContext = function () {
          this.curContext() === Ue.q_tmpl
            ? this.context.pop()
            : this.context.push(Ue.q_tmpl),
            (this.exprAllowed = !1);
        }),
        (c.star.updateContext = function (n) {
          if (n === c._function) {
            var o = this.context.length - 1;
            this.context[o] === Ue.f_expr
              ? (this.context[o] = Ue.f_expr_gen)
              : (this.context[o] = Ue.f_gen);
          }
          this.exprAllowed = !0;
        }),
        (c.name.updateContext = function (n) {
          var o = !1;
          this.options.ecmaVersion >= 6 &&
            n !== c.dot &&
            ((this.value === 'of' && !this.exprAllowed) ||
              (this.value === 'yield' && this.inGeneratorContext())) &&
            (o = !0),
            (this.exprAllowed = o);
        });
      var de = Ge.prototype;
      (de.checkPropClash = function (n, o, l) {
        if (
          !(this.options.ecmaVersion >= 9 && n.type === 'SpreadElement') &&
          !(
            this.options.ecmaVersion >= 6 &&
            (n.computed || n.method || n.shorthand)
          )
        ) {
          var f = n.key,
            m;
          switch (f.type) {
            case 'Identifier':
              m = f.name;
              break;
            case 'Literal':
              m = String(f.value);
              break;
            default:
              return;
          }
          var E = n.kind;
          if (this.options.ecmaVersion >= 6) {
            m === '__proto__' &&
              E === 'init' &&
              (o.proto &&
                (l
                  ? l.doubleProto < 0 && (l.doubleProto = f.start)
                  : this.raiseRecoverable(
                      f.start,
                      'Redefinition of __proto__ property'
                    )),
              (o.proto = !0));
            return;
          }
          m = '$' + m;
          var O = o[m];
          if (O) {
            var Y;
            E === 'init'
              ? (Y = (this.strict && O.init) || O.get || O.set)
              : (Y = O.init || O[E]),
              Y && this.raiseRecoverable(f.start, 'Redefinition of property');
          } else O = o[m] = {init: !1, get: !1, set: !1};
          O[E] = !0;
        }
      }),
        (de.parseExpression = function (n, o) {
          var l = this.start,
            f = this.startLoc,
            m = this.parseMaybeAssign(n, o);
          if (this.type === c.comma) {
            var E = this.startNodeAt(l, f);
            for (E.expressions = [m]; this.eat(c.comma); )
              E.expressions.push(this.parseMaybeAssign(n, o));
            return this.finishNode(E, 'SequenceExpression');
          }
          return m;
        }),
        (de.parseMaybeAssign = function (n, o, l) {
          if (this.isContextual('yield')) {
            if (this.inGenerator) return this.parseYield(n);
            this.exprAllowed = !1;
          }
          var f = !1,
            m = -1,
            E = -1,
            O = -1;
          o
            ? ((m = o.parenthesizedAssign),
              (E = o.trailingComma),
              (O = o.doubleProto),
              (o.parenthesizedAssign = o.trailingComma = -1))
            : ((o = new Xt()), (f = !0));
          var Y = this.start,
            Q = this.startLoc;
          (this.type === c.parenL || this.type === c.name) &&
            ((this.potentialArrowAt = this.start),
            (this.potentialArrowInForAwait = n === 'await'));
          var Te = this.parseMaybeConditional(n, o);
          if ((l && (Te = l.call(this, Te, Y, Q)), this.type.isAssign)) {
            var xe = this.startNodeAt(Y, Q);
            return (
              (xe.operator = this.value),
              this.type === c.eq && (Te = this.toAssignable(Te, !1, o)),
              f ||
                (o.parenthesizedAssign = o.trailingComma = o.doubleProto = -1),
              o.shorthandAssign >= Te.start && (o.shorthandAssign = -1),
              this.type === c.eq
                ? this.checkLValPattern(Te)
                : this.checkLValSimple(Te),
              (xe.left = Te),
              this.next(),
              (xe.right = this.parseMaybeAssign(n)),
              O > -1 && (o.doubleProto = O),
              this.finishNode(xe, 'AssignmentExpression')
            );
          } else f && this.checkExpressionErrors(o, !0);
          return (
            m > -1 && (o.parenthesizedAssign = m),
            E > -1 && (o.trailingComma = E),
            Te
          );
        }),
        (de.parseMaybeConditional = function (n, o) {
          var l = this.start,
            f = this.startLoc,
            m = this.parseExprOps(n, o);
          if (this.checkExpressionErrors(o)) return m;
          if (this.eat(c.question)) {
            var E = this.startNodeAt(l, f);
            return (
              (E.test = m),
              (E.consequent = this.parseMaybeAssign()),
              this.expect(c.colon),
              (E.alternate = this.parseMaybeAssign(n)),
              this.finishNode(E, 'ConditionalExpression')
            );
          }
          return m;
        }),
        (de.parseExprOps = function (n, o) {
          var l = this.start,
            f = this.startLoc,
            m = this.parseMaybeUnary(o, !1, !1, n);
          return this.checkExpressionErrors(o) ||
            (m.start === l && m.type === 'ArrowFunctionExpression')
            ? m
            : this.parseExprOp(m, l, f, -1, n);
        }),
        (de.parseExprOp = function (n, o, l, f, m) {
          var E = this.type.binop;
          if (E != null && (!m || this.type !== c._in) && E > f) {
            var O = this.type === c.logicalOR || this.type === c.logicalAND,
              Y = this.type === c.coalesce;
            Y && (E = c.logicalAND.binop);
            var Q = this.value;
            this.next();
            var Te = this.start,
              xe = this.startLoc,
              Ze = this.parseExprOp(
                this.parseMaybeUnary(null, !1, !1, m),
                Te,
                xe,
                E,
                m
              ),
              Lt = this.buildBinary(o, l, n, Ze, Q, O || Y);
            return (
              ((O && this.type === c.coalesce) ||
                (Y &&
                  (this.type === c.logicalOR || this.type === c.logicalAND))) &&
                this.raiseRecoverable(
                  this.start,
                  'Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses'
                ),
              this.parseExprOp(Lt, o, l, f, m)
            );
          }
          return n;
        }),
        (de.buildBinary = function (n, o, l, f, m, E) {
          f.type === 'PrivateIdentifier' &&
            this.raise(
              f.start,
              'Private identifier can only be left side of binary expression'
            );
          var O = this.startNodeAt(n, o);
          return (
            (O.left = l),
            (O.operator = m),
            (O.right = f),
            this.finishNode(O, E ? 'LogicalExpression' : 'BinaryExpression')
          );
        }),
        (de.parseMaybeUnary = function (n, o, l, f) {
          var m = this.start,
            E = this.startLoc,
            O;
          if (this.isContextual('await') && this.canAwait)
            (O = this.parseAwait(f)), (o = !0);
          else if (this.type.prefix) {
            var Y = this.startNode(),
              Q = this.type === c.incDec;
            (Y.operator = this.value),
              (Y.prefix = !0),
              this.next(),
              (Y.argument = this.parseMaybeUnary(null, !0, Q, f)),
              this.checkExpressionErrors(n, !0),
              Q
                ? this.checkLValSimple(Y.argument)
                : this.strict && Y.operator === 'delete' && Ms(Y.argument)
                ? this.raiseRecoverable(
                    Y.start,
                    'Deleting local variable in strict mode'
                  )
                : Y.operator === 'delete' && gs(Y.argument)
                ? this.raiseRecoverable(
                    Y.start,
                    'Private fields can not be deleted'
                  )
                : (o = !0),
              (O = this.finishNode(
                Y,
                Q ? 'UpdateExpression' : 'UnaryExpression'
              ));
          } else if (!o && this.type === c.privateId)
            (f || this.privateNameStack.length === 0) &&
              this.options.checkPrivateFields &&
              this.unexpected(),
              (O = this.parsePrivateIdent()),
              this.type !== c._in && this.unexpected();
          else {
            if (
              ((O = this.parseExprSubscripts(n, f)),
              this.checkExpressionErrors(n))
            )
              return O;
            for (; this.type.postfix && !this.canInsertSemicolon(); ) {
              var Te = this.startNodeAt(m, E);
              (Te.operator = this.value),
                (Te.prefix = !1),
                (Te.argument = O),
                this.checkLValSimple(O),
                this.next(),
                (O = this.finishNode(Te, 'UpdateExpression'));
            }
          }
          if (!l && this.eat(c.starstar))
            if (o) this.unexpected(this.lastTokStart);
            else
              return this.buildBinary(
                m,
                E,
                O,
                this.parseMaybeUnary(null, !1, !1, f),
                '**',
                !1
              );
          else return O;
        });
      function Ms(n) {
        return (
          n.type === 'Identifier' ||
          (n.type === 'ParenthesizedExpression' && Ms(n.expression))
        );
      }
      function gs(n) {
        return (
          (n.type === 'MemberExpression' &&
            n.property.type === 'PrivateIdentifier') ||
          (n.type === 'ChainExpression' && gs(n.expression)) ||
          (n.type === 'ParenthesizedExpression' && gs(n.expression))
        );
      }
      (de.parseExprSubscripts = function (n, o) {
        var l = this.start,
          f = this.startLoc,
          m = this.parseExprAtom(n, o);
        if (
          m.type === 'ArrowFunctionExpression' &&
          this.input.slice(this.lastTokStart, this.lastTokEnd) !== ')'
        )
          return m;
        var E = this.parseSubscripts(m, l, f, !1, o);
        return (
          n &&
            E.type === 'MemberExpression' &&
            (n.parenthesizedAssign >= E.start && (n.parenthesizedAssign = -1),
            n.parenthesizedBind >= E.start && (n.parenthesizedBind = -1),
            n.trailingComma >= E.start && (n.trailingComma = -1)),
          E
        );
      }),
        (de.parseSubscripts = function (n, o, l, f, m) {
          for (
            var E =
                this.options.ecmaVersion >= 8 &&
                n.type === 'Identifier' &&
                n.name === 'async' &&
                this.lastTokEnd === n.end &&
                !this.canInsertSemicolon() &&
                n.end - n.start === 5 &&
                this.potentialArrowAt === n.start,
              O = !1;
            ;

          ) {
            var Y = this.parseSubscript(n, o, l, f, E, O, m);
            if (
              (Y.optional && (O = !0),
              Y === n || Y.type === 'ArrowFunctionExpression')
            ) {
              if (O) {
                var Q = this.startNodeAt(o, l);
                (Q.expression = Y), (Y = this.finishNode(Q, 'ChainExpression'));
              }
              return Y;
            }
            n = Y;
          }
        }),
        (de.shouldParseAsyncArrow = function () {
          return !this.canInsertSemicolon() && this.eat(c.arrow);
        }),
        (de.parseSubscriptAsyncArrow = function (n, o, l, f) {
          return this.parseArrowExpression(this.startNodeAt(n, o), l, !0, f);
        }),
        (de.parseSubscript = function (n, o, l, f, m, E, O) {
          var Y = this.options.ecmaVersion >= 11,
            Q = Y && this.eat(c.questionDot);
          f &&
            Q &&
            this.raise(
              this.lastTokStart,
              'Optional chaining cannot appear in the callee of new expressions'
            );
          var Te = this.eat(c.bracketL);
          if (
            Te ||
            (Q && this.type !== c.parenL && this.type !== c.backQuote) ||
            this.eat(c.dot)
          ) {
            var xe = this.startNodeAt(o, l);
            (xe.object = n),
              Te
                ? ((xe.property = this.parseExpression()),
                  this.expect(c.bracketR))
                : this.type === c.privateId && n.type !== 'Super'
                ? (xe.property = this.parsePrivateIdent())
                : (xe.property = this.parseIdent(
                    this.options.allowReserved !== 'never'
                  )),
              (xe.computed = !!Te),
              Y && (xe.optional = Q),
              (n = this.finishNode(xe, 'MemberExpression'));
          } else if (!f && this.eat(c.parenL)) {
            var Ze = new Xt(),
              Lt = this.yieldPos,
              Ri = this.awaitPos,
              Ys = this.awaitIdentPos;
            (this.yieldPos = 0), (this.awaitPos = 0), (this.awaitIdentPos = 0);
            var gr = this.parseExprList(
              c.parenR,
              this.options.ecmaVersion >= 8,
              !1,
              Ze
            );
            if (m && !Q && this.shouldParseAsyncArrow())
              return (
                this.checkPatternErrors(Ze, !1),
                this.checkYieldAwaitInDefaultParams(),
                this.awaitIdentPos > 0 &&
                  this.raise(
                    this.awaitIdentPos,
                    "Cannot use 'await' as identifier inside an async function"
                  ),
                (this.yieldPos = Lt),
                (this.awaitPos = Ri),
                (this.awaitIdentPos = Ys),
                this.parseSubscriptAsyncArrow(o, l, gr, O)
              );
            this.checkExpressionErrors(Ze, !0),
              (this.yieldPos = Lt || this.yieldPos),
              (this.awaitPos = Ri || this.awaitPos),
              (this.awaitIdentPos = Ys || this.awaitIdentPos);
            var Js = this.startNodeAt(o, l);
            (Js.callee = n),
              (Js.arguments = gr),
              Y && (Js.optional = Q),
              (n = this.finishNode(Js, 'CallExpression'));
          } else if (this.type === c.backQuote) {
            (Q || E) &&
              this.raise(
                this.start,
                'Optional chaining cannot appear in the tag of tagged template expressions'
              );
            var Qs = this.startNodeAt(o, l);
            (Qs.tag = n),
              (Qs.quasi = this.parseTemplate({isTagged: !0})),
              (n = this.finishNode(Qs, 'TaggedTemplateExpression'));
          }
          return n;
        }),
        (de.parseExprAtom = function (n, o, l) {
          this.type === c.slash && this.readRegexp();
          var f,
            m = this.potentialArrowAt === this.start;
          switch (this.type) {
            case c._super:
              return (
                this.allowSuper ||
                  this.raise(this.start, "'super' keyword outside a method"),
                (f = this.startNode()),
                this.next(),
                this.type === c.parenL &&
                  !this.allowDirectSuper &&
                  this.raise(
                    f.start,
                    'super() call outside constructor of a subclass'
                  ),
                this.type !== c.dot &&
                  this.type !== c.bracketL &&
                  this.type !== c.parenL &&
                  this.unexpected(),
                this.finishNode(f, 'Super')
              );
            case c._this:
              return (
                (f = this.startNode()),
                this.next(),
                this.finishNode(f, 'ThisExpression')
              );
            case c.name:
              var E = this.start,
                O = this.startLoc,
                Y = this.containsEsc,
                Q = this.parseIdent(!1);
              if (
                this.options.ecmaVersion >= 8 &&
                !Y &&
                Q.name === 'async' &&
                !this.canInsertSemicolon() &&
                this.eat(c._function)
              )
                return (
                  this.overrideContext(Ue.f_expr),
                  this.parseFunction(this.startNodeAt(E, O), 0, !1, !0, o)
                );
              if (m && !this.canInsertSemicolon()) {
                if (this.eat(c.arrow))
                  return this.parseArrowExpression(
                    this.startNodeAt(E, O),
                    [Q],
                    !1,
                    o
                  );
                if (
                  this.options.ecmaVersion >= 8 &&
                  Q.name === 'async' &&
                  this.type === c.name &&
                  !Y &&
                  (!this.potentialArrowInForAwait ||
                    this.value !== 'of' ||
                    this.containsEsc)
                )
                  return (
                    (Q = this.parseIdent(!1)),
                    (this.canInsertSemicolon() || !this.eat(c.arrow)) &&
                      this.unexpected(),
                    this.parseArrowExpression(
                      this.startNodeAt(E, O),
                      [Q],
                      !0,
                      o
                    )
                  );
              }
              return Q;
            case c.regexp:
              var Te = this.value;
              return (
                (f = this.parseLiteral(Te.value)),
                (f.regex = {pattern: Te.pattern, flags: Te.flags}),
                f
              );
            case c.num:
            case c.string:
              return this.parseLiteral(this.value);
            case c._null:
            case c._true:
            case c._false:
              return (
                (f = this.startNode()),
                (f.value =
                  this.type === c._null ? null : this.type === c._true),
                (f.raw = this.type.keyword),
                this.next(),
                this.finishNode(f, 'Literal')
              );
            case c.parenL:
              var xe = this.start,
                Ze = this.parseParenAndDistinguishExpression(m, o);
              return (
                n &&
                  (n.parenthesizedAssign < 0 &&
                    !this.isSimpleAssignTarget(Ze) &&
                    (n.parenthesizedAssign = xe),
                  n.parenthesizedBind < 0 && (n.parenthesizedBind = xe)),
                Ze
              );
            case c.bracketL:
              return (
                (f = this.startNode()),
                this.next(),
                (f.elements = this.parseExprList(c.bracketR, !0, !0, n)),
                this.finishNode(f, 'ArrayExpression')
              );
            case c.braceL:
              return this.overrideContext(Ue.b_expr), this.parseObj(!1, n);
            case c._function:
              return (
                (f = this.startNode()), this.next(), this.parseFunction(f, 0)
              );
            case c._class:
              return this.parseClass(this.startNode(), !1);
            case c._new:
              return this.parseNew();
            case c.backQuote:
              return this.parseTemplate();
            case c._import:
              return this.options.ecmaVersion >= 11
                ? this.parseExprImport(l)
                : this.unexpected();
            default:
              return this.parseExprAtomDefault();
          }
        }),
        (de.parseExprAtomDefault = function () {
          this.unexpected();
        }),
        (de.parseExprImport = function (n) {
          var o = this.startNode();
          if (
            (this.containsEsc &&
              this.raiseRecoverable(
                this.start,
                'Escape sequence in keyword import'
              ),
            this.next(),
            this.type === c.parenL && !n)
          )
            return this.parseDynamicImport(o);
          if (this.type === c.dot) {
            var l = this.startNodeAt(o.start, o.loc && o.loc.start);
            return (
              (l.name = 'import'),
              (o.meta = this.finishNode(l, 'Identifier')),
              this.parseImportMeta(o)
            );
          } else this.unexpected();
        }),
        (de.parseDynamicImport = function (n) {
          if (
            (this.next(),
            (n.source = this.parseMaybeAssign()),
            this.options.ecmaVersion >= 16)
          )
            this.eat(c.parenR)
              ? (n.options = null)
              : (this.expect(c.comma),
                this.afterTrailingComma(c.parenR)
                  ? (n.options = null)
                  : ((n.options = this.parseMaybeAssign()),
                    this.eat(c.parenR) ||
                      (this.expect(c.comma),
                      this.afterTrailingComma(c.parenR) || this.unexpected())));
          else if (!this.eat(c.parenR)) {
            var o = this.start;
            this.eat(c.comma) && this.eat(c.parenR)
              ? this.raiseRecoverable(
                  o,
                  'Trailing comma is not allowed in import()'
                )
              : this.unexpected(o);
          }
          return this.finishNode(n, 'ImportExpression');
        }),
        (de.parseImportMeta = function (n) {
          this.next();
          var o = this.containsEsc;
          return (
            (n.property = this.parseIdent(!0)),
            n.property.name !== 'meta' &&
              this.raiseRecoverable(
                n.property.start,
                "The only valid meta property for import is 'import.meta'"
              ),
            o &&
              this.raiseRecoverable(
                n.start,
                "'import.meta' must not contain escaped characters"
              ),
            this.options.sourceType !== 'module' &&
              !this.options.allowImportExportEverywhere &&
              this.raiseRecoverable(
                n.start,
                "Cannot use 'import.meta' outside a module"
              ),
            this.finishNode(n, 'MetaProperty')
          );
        }),
        (de.parseLiteral = function (n) {
          var o = this.startNode();
          return (
            (o.value = n),
            (o.raw = this.input.slice(this.start, this.end)),
            o.raw.charCodeAt(o.raw.length - 1) === 110 &&
              (o.bigint =
                o.value != null
                  ? o.value.toString()
                  : o.raw.slice(0, -1).replace(/_/g, '')),
            this.next(),
            this.finishNode(o, 'Literal')
          );
        }),
        (de.parseParenExpression = function () {
          this.expect(c.parenL);
          var n = this.parseExpression();
          return this.expect(c.parenR), n;
        }),
        (de.shouldParseArrow = function (n) {
          return !this.canInsertSemicolon();
        }),
        (de.parseParenAndDistinguishExpression = function (n, o) {
          var l = this.start,
            f = this.startLoc,
            m,
            E = this.options.ecmaVersion >= 8;
          if (this.options.ecmaVersion >= 6) {
            this.next();
            var O = this.start,
              Y = this.startLoc,
              Q = [],
              Te = !0,
              xe = !1,
              Ze = new Xt(),
              Lt = this.yieldPos,
              Ri = this.awaitPos,
              Ys;
            for (this.yieldPos = 0, this.awaitPos = 0; this.type !== c.parenR; )
              if (
                (Te ? (Te = !1) : this.expect(c.comma),
                E && this.afterTrailingComma(c.parenR, !0))
              ) {
                xe = !0;
                break;
              } else if (this.type === c.ellipsis) {
                (Ys = this.start),
                  Q.push(this.parseParenItem(this.parseRestBinding())),
                  this.type === c.comma &&
                    this.raiseRecoverable(
                      this.start,
                      'Comma is not permitted after the rest element'
                    );
                break;
              } else Q.push(this.parseMaybeAssign(!1, Ze, this.parseParenItem));
            var gr = this.lastTokEnd,
              Js = this.lastTokEndLoc;
            if (
              (this.expect(c.parenR),
              n && this.shouldParseArrow(Q) && this.eat(c.arrow))
            )
              return (
                this.checkPatternErrors(Ze, !1),
                this.checkYieldAwaitInDefaultParams(),
                (this.yieldPos = Lt),
                (this.awaitPos = Ri),
                this.parseParenArrowList(l, f, Q, o)
              );
            (!Q.length || xe) && this.unexpected(this.lastTokStart),
              Ys && this.unexpected(Ys),
              this.checkExpressionErrors(Ze, !0),
              (this.yieldPos = Lt || this.yieldPos),
              (this.awaitPos = Ri || this.awaitPos),
              Q.length > 1
                ? ((m = this.startNodeAt(O, Y)),
                  (m.expressions = Q),
                  this.finishNodeAt(m, 'SequenceExpression', gr, Js))
                : (m = Q[0]);
          } else m = this.parseParenExpression();
          if (this.options.preserveParens) {
            var Qs = this.startNodeAt(l, f);
            return (
              (Qs.expression = m),
              this.finishNode(Qs, 'ParenthesizedExpression')
            );
          } else return m;
        }),
        (de.parseParenItem = function (n) {
          return n;
        }),
        (de.parseParenArrowList = function (n, o, l, f) {
          return this.parseArrowExpression(this.startNodeAt(n, o), l, !1, f);
        });
      var Ci = [];
      (de.parseNew = function () {
        this.containsEsc &&
          this.raiseRecoverable(this.start, 'Escape sequence in keyword new');
        var n = this.startNode();
        if (
          (this.next(), this.options.ecmaVersion >= 6 && this.type === c.dot)
        ) {
          var o = this.startNodeAt(n.start, n.loc && n.loc.start);
          (o.name = 'new'),
            (n.meta = this.finishNode(o, 'Identifier')),
            this.next();
          var l = this.containsEsc;
          return (
            (n.property = this.parseIdent(!0)),
            n.property.name !== 'target' &&
              this.raiseRecoverable(
                n.property.start,
                "The only valid meta property for new is 'new.target'"
              ),
            l &&
              this.raiseRecoverable(
                n.start,
                "'new.target' must not contain escaped characters"
              ),
            this.allowNewDotTarget ||
              this.raiseRecoverable(
                n.start,
                "'new.target' can only be used in functions and class static block"
              ),
            this.finishNode(n, 'MetaProperty')
          );
        }
        var f = this.start,
          m = this.startLoc;
        return (
          (n.callee = this.parseSubscripts(
            this.parseExprAtom(null, !1, !0),
            f,
            m,
            !0,
            !1
          )),
          this.eat(c.parenL)
            ? (n.arguments = this.parseExprList(
                c.parenR,
                this.options.ecmaVersion >= 8,
                !1
              ))
            : (n.arguments = Ci),
          this.finishNode(n, 'NewExpression')
        );
      }),
        (de.parseTemplateElement = function (n) {
          var o = n.isTagged,
            l = this.startNode();
          return (
            this.type === c.invalidTemplate
              ? (o ||
                  this.raiseRecoverable(
                    this.start,
                    'Bad escape sequence in untagged template literal'
                  ),
                (l.value = {
                  raw: this.value.replace(
                    /\r\n?/g,
                    `
`
                  ),
                  cooked: null,
                }))
              : (l.value = {
                  raw: this.input.slice(this.start, this.end).replace(
                    /\r\n?/g,
                    `
`
                  ),
                  cooked: this.value,
                }),
            this.next(),
            (l.tail = this.type === c.backQuote),
            this.finishNode(l, 'TemplateElement')
          );
        }),
        (de.parseTemplate = function (n) {
          n === void 0 && (n = {});
          var o = n.isTagged;
          o === void 0 && (o = !1);
          var l = this.startNode();
          this.next(), (l.expressions = []);
          var f = this.parseTemplateElement({isTagged: o});
          for (l.quasis = [f]; !f.tail; )
            this.type === c.eof &&
              this.raise(this.pos, 'Unterminated template literal'),
              this.expect(c.dollarBraceL),
              l.expressions.push(this.parseExpression()),
              this.expect(c.braceR),
              l.quasis.push((f = this.parseTemplateElement({isTagged: o})));
          return this.next(), this.finishNode(l, 'TemplateLiteral');
        }),
        (de.isAsyncProp = function (n) {
          return (
            !n.computed &&
            n.key.type === 'Identifier' &&
            n.key.name === 'async' &&
            (this.type === c.name ||
              this.type === c.num ||
              this.type === c.string ||
              this.type === c.bracketL ||
              this.type.keyword ||
              (this.options.ecmaVersion >= 9 && this.type === c.star)) &&
            !R.test(this.input.slice(this.lastTokEnd, this.start))
          );
        }),
        (de.parseObj = function (n, o) {
          var l = this.startNode(),
            f = !0,
            m = {};
          for (l.properties = [], this.next(); !this.eat(c.braceR); ) {
            if (f) f = !1;
            else if (
              (this.expect(c.comma),
              this.options.ecmaVersion >= 5 &&
                this.afterTrailingComma(c.braceR))
            )
              break;
            var E = this.parseProperty(n, o);
            n || this.checkPropClash(E, m, o), l.properties.push(E);
          }
          return this.finishNode(l, n ? 'ObjectPattern' : 'ObjectExpression');
        }),
        (de.parseProperty = function (n, o) {
          var l = this.startNode(),
            f,
            m,
            E,
            O;
          if (this.options.ecmaVersion >= 9 && this.eat(c.ellipsis))
            return n
              ? ((l.argument = this.parseIdent(!1)),
                this.type === c.comma &&
                  this.raiseRecoverable(
                    this.start,
                    'Comma is not permitted after the rest element'
                  ),
                this.finishNode(l, 'RestElement'))
              : ((l.argument = this.parseMaybeAssign(!1, o)),
                this.type === c.comma &&
                  o &&
                  o.trailingComma < 0 &&
                  (o.trailingComma = this.start),
                this.finishNode(l, 'SpreadElement'));
          this.options.ecmaVersion >= 6 &&
            ((l.method = !1),
            (l.shorthand = !1),
            (n || o) && ((E = this.start), (O = this.startLoc)),
            n || (f = this.eat(c.star)));
          var Y = this.containsEsc;
          return (
            this.parsePropertyName(l),
            !n &&
            !Y &&
            this.options.ecmaVersion >= 8 &&
            !f &&
            this.isAsyncProp(l)
              ? ((m = !0),
                (f = this.options.ecmaVersion >= 9 && this.eat(c.star)),
                this.parsePropertyName(l))
              : (m = !1),
            this.parsePropertyValue(l, n, f, m, E, O, o, Y),
            this.finishNode(l, 'Property')
          );
        }),
        (de.parseGetterSetter = function (n) {
          var o = n.key.name;
          this.parsePropertyName(n),
            (n.value = this.parseMethod(!1)),
            (n.kind = o);
          var l = n.kind === 'get' ? 0 : 1;
          if (n.value.params.length !== l) {
            var f = n.value.start;
            n.kind === 'get'
              ? this.raiseRecoverable(f, 'getter should have no params')
              : this.raiseRecoverable(
                  f,
                  'setter should have exactly one param'
                );
          } else
            n.kind === 'set' &&
              n.value.params[0].type === 'RestElement' &&
              this.raiseRecoverable(
                n.value.params[0].start,
                'Setter cannot use rest params'
              );
        }),
        (de.parsePropertyValue = function (n, o, l, f, m, E, O, Y) {
          (l || f) && this.type === c.colon && this.unexpected(),
            this.eat(c.colon)
              ? ((n.value = o
                  ? this.parseMaybeDefault(this.start, this.startLoc)
                  : this.parseMaybeAssign(!1, O)),
                (n.kind = 'init'))
              : this.options.ecmaVersion >= 6 && this.type === c.parenL
              ? (o && this.unexpected(),
                (n.method = !0),
                (n.value = this.parseMethod(l, f)),
                (n.kind = 'init'))
              : !o &&
                !Y &&
                this.options.ecmaVersion >= 5 &&
                !n.computed &&
                n.key.type === 'Identifier' &&
                (n.key.name === 'get' || n.key.name === 'set') &&
                this.type !== c.comma &&
                this.type !== c.braceR &&
                this.type !== c.eq
              ? ((l || f) && this.unexpected(), this.parseGetterSetter(n))
              : this.options.ecmaVersion >= 6 &&
                !n.computed &&
                n.key.type === 'Identifier'
              ? ((l || f) && this.unexpected(),
                this.checkUnreserved(n.key),
                n.key.name === 'await' &&
                  !this.awaitIdentPos &&
                  (this.awaitIdentPos = m),
                o
                  ? (n.value = this.parseMaybeDefault(
                      m,
                      E,
                      this.copyNode(n.key)
                    ))
                  : this.type === c.eq && O
                  ? (O.shorthandAssign < 0 && (O.shorthandAssign = this.start),
                    (n.value = this.parseMaybeDefault(
                      m,
                      E,
                      this.copyNode(n.key)
                    )))
                  : (n.value = this.copyNode(n.key)),
                (n.kind = 'init'),
                (n.shorthand = !0))
              : this.unexpected();
        }),
        (de.parsePropertyName = function (n) {
          if (this.options.ecmaVersion >= 6) {
            if (this.eat(c.bracketL))
              return (
                (n.computed = !0),
                (n.key = this.parseMaybeAssign()),
                this.expect(c.bracketR),
                n.key
              );
            n.computed = !1;
          }
          return (n.key =
            this.type === c.num || this.type === c.string
              ? this.parseExprAtom()
              : this.parseIdent(this.options.allowReserved !== 'never'));
        }),
        (de.initFunction = function (n) {
          (n.id = null),
            this.options.ecmaVersion >= 6 && (n.generator = n.expression = !1),
            this.options.ecmaVersion >= 8 && (n.async = !1);
        }),
        (de.parseMethod = function (n, o, l) {
          var f = this.startNode(),
            m = this.yieldPos,
            E = this.awaitPos,
            O = this.awaitIdentPos;
          return (
            this.initFunction(f),
            this.options.ecmaVersion >= 6 && (f.generator = n),
            this.options.ecmaVersion >= 8 && (f.async = !!o),
            (this.yieldPos = 0),
            (this.awaitPos = 0),
            (this.awaitIdentPos = 0),
            this.enterScope(ut(o, f.generator) | Ee | (l ? Le : 0)),
            this.expect(c.parenL),
            (f.params = this.parseBindingList(
              c.parenR,
              !1,
              this.options.ecmaVersion >= 8
            )),
            this.checkYieldAwaitInDefaultParams(),
            this.parseFunctionBody(f, !1, !0, !1),
            (this.yieldPos = m),
            (this.awaitPos = E),
            (this.awaitIdentPos = O),
            this.finishNode(f, 'FunctionExpression')
          );
        }),
        (de.parseArrowExpression = function (n, o, l, f) {
          var m = this.yieldPos,
            E = this.awaitPos,
            O = this.awaitIdentPos;
          return (
            this.enterScope(ut(l, !1) | he),
            this.initFunction(n),
            this.options.ecmaVersion >= 8 && (n.async = !!l),
            (this.yieldPos = 0),
            (this.awaitPos = 0),
            (this.awaitIdentPos = 0),
            (n.params = this.toAssignableList(o, !0)),
            this.parseFunctionBody(n, !0, !1, f),
            (this.yieldPos = m),
            (this.awaitPos = E),
            (this.awaitIdentPos = O),
            this.finishNode(n, 'ArrowFunctionExpression')
          );
        }),
        (de.parseFunctionBody = function (n, o, l, f) {
          var m = o && this.type !== c.braceL,
            E = this.strict,
            O = !1;
          if (m)
            (n.body = this.parseMaybeAssign(f)),
              (n.expression = !0),
              this.checkParams(n, !1);
          else {
            var Y =
              this.options.ecmaVersion >= 7 &&
              !this.isSimpleParamList(n.params);
            (!E || Y) &&
              ((O = this.strictDirective(this.end)),
              O &&
                Y &&
                this.raiseRecoverable(
                  n.start,
                  "Illegal 'use strict' directive in function with non-simple parameter list"
                ));
            var Q = this.labels;
            (this.labels = []),
              O && (this.strict = !0),
              this.checkParams(
                n,
                !E && !O && !o && !l && this.isSimpleParamList(n.params)
              ),
              this.strict && n.id && this.checkLValSimple(n.id, Dn),
              (n.body = this.parseBlock(!1, void 0, O && !E)),
              (n.expression = !1),
              this.adaptDirectivePrologue(n.body.body),
              (this.labels = Q);
          }
          this.exitScope();
        }),
        (de.isSimpleParamList = function (n) {
          for (var o = 0, l = n; o < l.length; o += 1) {
            var f = l[o];
            if (f.type !== 'Identifier') return !1;
          }
          return !0;
        }),
        (de.checkParams = function (n, o) {
          for (
            var l = Object.create(null), f = 0, m = n.params;
            f < m.length;
            f += 1
          ) {
            var E = m[f];
            this.checkLValInnerPattern(E, bt, o ? null : l);
          }
        }),
        (de.parseExprList = function (n, o, l, f) {
          for (var m = [], E = !0; !this.eat(n); ) {
            if (E) E = !1;
            else if ((this.expect(c.comma), o && this.afterTrailingComma(n)))
              break;
            var O = void 0;
            l && this.type === c.comma
              ? (O = null)
              : this.type === c.ellipsis
              ? ((O = this.parseSpread(f)),
                f &&
                  this.type === c.comma &&
                  f.trailingComma < 0 &&
                  (f.trailingComma = this.start))
              : (O = this.parseMaybeAssign(!1, f)),
              m.push(O);
          }
          return m;
        }),
        (de.checkUnreserved = function (n) {
          var o = n.start,
            l = n.end,
            f = n.name;
          if (
            (this.inGenerator &&
              f === 'yield' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'yield' as identifier inside a generator"
              ),
            this.inAsync &&
              f === 'await' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'await' as identifier inside an async function"
              ),
            !(this.currentThisScope().flags & Ke) &&
              f === 'arguments' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'arguments' in class field initializer"
              ),
            this.inClassStaticBlock &&
              (f === 'arguments' || f === 'await') &&
              this.raise(
                o,
                'Cannot use ' + f + ' in class static initialization block'
              ),
            this.keywords.test(f) &&
              this.raise(o, "Unexpected keyword '" + f + "'"),
            !(
              this.options.ecmaVersion < 6 &&
              this.input.slice(o, l).indexOf('\\') !== -1
            ))
          ) {
            var m = this.strict ? this.reservedWordsStrict : this.reservedWords;
            m.test(f) &&
              (!this.inAsync &&
                f === 'await' &&
                this.raiseRecoverable(
                  o,
                  "Cannot use keyword 'await' outside an async function"
                ),
              this.raiseRecoverable(o, "The keyword '" + f + "' is reserved"));
          }
        }),
        (de.parseIdent = function (n) {
          var o = this.parseIdentNode();
          return (
            this.next(!!n),
            this.finishNode(o, 'Identifier'),
            n ||
              (this.checkUnreserved(o),
              o.name === 'await' &&
                !this.awaitIdentPos &&
                (this.awaitIdentPos = o.start)),
            o
          );
        }),
        (de.parseIdentNode = function () {
          var n = this.startNode();
          return (
            this.type === c.name
              ? (n.name = this.value)
              : this.type.keyword
              ? ((n.name = this.type.keyword),
                (n.name === 'class' || n.name === 'function') &&
                  (this.lastTokEnd !== this.lastTokStart + 1 ||
                    this.input.charCodeAt(this.lastTokStart) !== 46) &&
                  this.context.pop(),
                (this.type = c.name))
              : this.unexpected(),
            n
          );
        }),
        (de.parsePrivateIdent = function () {
          var n = this.startNode();
          return (
            this.type === c.privateId
              ? (n.name = this.value)
              : this.unexpected(),
            this.next(),
            this.finishNode(n, 'PrivateIdentifier'),
            this.options.checkPrivateFields &&
              (this.privateNameStack.length === 0
                ? this.raise(
                    n.start,
                    "Private field '#" +
                      n.name +
                      "' must be declared in an enclosing class"
                  )
                : this.privateNameStack[
                    this.privateNameStack.length - 1
                  ].used.push(n)),
            n
          );
        }),
        (de.parseYield = function (n) {
          this.yieldPos || (this.yieldPos = this.start);
          var o = this.startNode();
          return (
            this.next(),
            this.type === c.semi ||
            this.canInsertSemicolon() ||
            (this.type !== c.star && !this.type.startsExpr)
              ? ((o.delegate = !1), (o.argument = null))
              : ((o.delegate = this.eat(c.star)),
                (o.argument = this.parseMaybeAssign(n))),
            this.finishNode(o, 'YieldExpression')
          );
        }),
        (de.parseAwait = function (n) {
          this.awaitPos || (this.awaitPos = this.start);
          var o = this.startNode();
          return (
            this.next(),
            (o.argument = this.parseMaybeUnary(null, !0, !1, n)),
            this.finishNode(o, 'AwaitExpression')
          );
        });
      var ts = Ge.prototype;
      (ts.raise = function (n, o) {
        var l = $t(this.input, n);
        (o += ' (' + l.line + ':' + l.column + ')'),
          this.sourceFile && (o += ' in ' + this.sourceFile);
        var f = new SyntaxError(o);
        throw ((f.pos = n), (f.loc = l), (f.raisedAt = this.pos), f);
      }),
        (ts.raiseRecoverable = ts.raise),
        (ts.curPosition = function () {
          if (this.options.locations)
            return new ct(this.curLine, this.pos - this.lineStart);
        });
      var rn = Ge.prototype,
        wi = function (o) {
          (this.flags = o),
            (this.var = []),
            (this.lexical = []),
            (this.functions = []);
        };
      (rn.enterScope = function (n) {
        this.scopeStack.push(new wi(n));
      }),
        (rn.exitScope = function () {
          this.scopeStack.pop();
        }),
        (rn.treatFunctionsAsVarInScope = function (n) {
          return n.flags & J || (!this.inModule && n.flags & G);
        }),
        (rn.declareName = function (n, o, l) {
          var f = !1;
          if (o === yt) {
            var m = this.currentScope();
            (f =
              m.lexical.indexOf(n) > -1 ||
              m.functions.indexOf(n) > -1 ||
              m.var.indexOf(n) > -1),
              m.lexical.push(n),
              this.inModule && m.flags & G && delete this.undefinedExports[n];
          } else if (o === bn) {
            var E = this.currentScope();
            E.lexical.push(n);
          } else if (o === vt) {
            var O = this.currentScope();
            this.treatFunctionsAsVar
              ? (f = O.lexical.indexOf(n) > -1)
              : (f = O.lexical.indexOf(n) > -1 || O.var.indexOf(n) > -1),
              O.functions.push(n);
          } else
            for (var Y = this.scopeStack.length - 1; Y >= 0; --Y) {
              var Q = this.scopeStack[Y];
              if (
                (Q.lexical.indexOf(n) > -1 &&
                  !(Q.flags & Ie && Q.lexical[0] === n)) ||
                (!this.treatFunctionsAsVarInScope(Q) &&
                  Q.functions.indexOf(n) > -1)
              ) {
                f = !0;
                break;
              }
              if (
                (Q.var.push(n),
                this.inModule && Q.flags & G && delete this.undefinedExports[n],
                Q.flags & Ke)
              )
                break;
            }
          f &&
            this.raiseRecoverable(
              l,
              "Identifier '" + n + "' has already been declared"
            );
        }),
        (rn.checkLocalExport = function (n) {
          this.scopeStack[0].lexical.indexOf(n.name) === -1 &&
            this.scopeStack[0].var.indexOf(n.name) === -1 &&
            (this.undefinedExports[n.name] = n);
        }),
        (rn.currentScope = function () {
          return this.scopeStack[this.scopeStack.length - 1];
        }),
        (rn.currentVarScope = function () {
          for (var n = this.scopeStack.length - 1; ; n--) {
            var o = this.scopeStack[n];
            if (o.flags & (Ke | We | Xe)) return o;
          }
        }),
        (rn.currentThisScope = function () {
          for (var n = this.scopeStack.length - 1; ; n--) {
            var o = this.scopeStack[n];
            if (o.flags & (Ke | We | Xe) && !(o.flags & he)) return o;
          }
        });
      var Fn = function (o, l, f) {
          (this.type = ''),
            (this.start = l),
            (this.end = 0),
            o.options.locations && (this.loc = new wt(o, f)),
            o.options.directSourceFile &&
              (this.sourceFile = o.options.directSourceFile),
            o.options.ranges && (this.range = [l, 0]);
        },
        Bn = Ge.prototype;
      (Bn.startNode = function () {
        return new Fn(this, this.start, this.startLoc);
      }),
        (Bn.startNodeAt = function (n, o) {
          return new Fn(this, n, o);
        });
      function Fs(n, o, l, f) {
        return (
          (n.type = o),
          (n.end = l),
          this.options.locations && (n.loc.end = f),
          this.options.ranges && (n.range[1] = l),
          n
        );
      }
      (Bn.finishNode = function (n, o) {
        return Fs.call(this, n, o, this.lastTokEnd, this.lastTokEndLoc);
      }),
        (Bn.finishNodeAt = function (n, o, l, f) {
          return Fs.call(this, n, o, l, f);
        }),
        (Bn.copyNode = function (n) {
          var o = new Fn(this, n.start, this.startLoc);
          for (var l in n) o[l] = n[l];
          return o;
        });
      var Si =
          'Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz',
        Bs =
          'ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS',
        Vs = Bs + ' Extended_Pictographic',
        js = Vs,
        $s = js + ' EBase EComp EMod EPres ExtPict',
        qs = $s,
        Ii = qs,
        Ei = {9: Bs, 10: Vs, 11: js, 12: $s, 13: qs, 14: Ii},
        Ai =
          'Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji',
        Pi = {9: '', 10: '', 11: '', 12: '', 13: '', 14: Ai},
        Ks =
          'Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu',
        Us =
          'Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb',
        Hs =
          Us +
          ' Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd',
        Ws =
          Hs +
          ' Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho',
        Gs =
          Ws +
          ' Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi',
        zs =
          Gs +
          ' Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith',
        jo = zs + ' ' + Si,
        $o = {9: Us, 10: Hs, 11: Ws, 12: Gs, 13: zs, 14: jo},
        mr = {};
      function qo(n) {
        var o = (mr[n] = {
          binary: tt(Ei[n] + ' ' + Ks),
          binaryOfStrings: tt(Pi[n]),
          nonBinary: {General_Category: tt(Ks), Script: tt($o[n])},
        });
        (o.nonBinary.Script_Extensions = o.nonBinary.Script),
          (o.nonBinary.gc = o.nonBinary.General_Category),
          (o.nonBinary.sc = o.nonBinary.Script),
          (o.nonBinary.scx = o.nonBinary.Script_Extensions);
      }
      for (var Ni = 0, yr = [9, 10, 11, 12, 13, 14]; Ni < yr.length; Ni += 1) {
        var Ko = yr[Ni];
        qo(Ko);
      }
      var le = Ge.prototype,
        Xs = function (o, l) {
          (this.parent = o), (this.base = l || this);
        };
      (Xs.prototype.separatedFrom = function (o) {
        for (var l = this; l; l = l.parent)
          for (var f = o; f; f = f.parent)
            if (l.base === f.base && l !== f) return !0;
        return !1;
      }),
        (Xs.prototype.sibling = function () {
          return new Xs(this.parent, this.base);
        });
      var on = function (o) {
        (this.parser = o),
          (this.validFlags =
            'gim' +
            (o.options.ecmaVersion >= 6 ? 'uy' : '') +
            (o.options.ecmaVersion >= 9 ? 's' : '') +
            (o.options.ecmaVersion >= 13 ? 'd' : '') +
            (o.options.ecmaVersion >= 15 ? 'v' : '')),
          (this.unicodeProperties =
            mr[o.options.ecmaVersion >= 14 ? 14 : o.options.ecmaVersion]),
          (this.source = ''),
          (this.flags = ''),
          (this.start = 0),
          (this.switchU = !1),
          (this.switchV = !1),
          (this.switchN = !1),
          (this.pos = 0),
          (this.lastIntValue = 0),
          (this.lastStringValue = ''),
          (this.lastAssertionIsQuantifiable = !1),
          (this.numCapturingParens = 0),
          (this.maxBackReference = 0),
          (this.groupNames = Object.create(null)),
          (this.backReferenceNames = []),
          (this.branchID = null);
      };
      (on.prototype.reset = function (o, l, f) {
        var m = f.indexOf('v') !== -1,
          E = f.indexOf('u') !== -1;
        (this.start = o | 0),
          (this.source = l + ''),
          (this.flags = f),
          m && this.parser.options.ecmaVersion >= 15
            ? ((this.switchU = !0), (this.switchV = !0), (this.switchN = !0))
            : ((this.switchU = E && this.parser.options.ecmaVersion >= 6),
              (this.switchV = !1),
              (this.switchN = E && this.parser.options.ecmaVersion >= 9));
      }),
        (on.prototype.raise = function (o) {
          this.parser.raiseRecoverable(
            this.start,
            'Invalid regular expression: /' + this.source + '/: ' + o
          );
        }),
        (on.prototype.at = function (o, l) {
          l === void 0 && (l = !1);
          var f = this.source,
            m = f.length;
          if (o >= m) return -1;
          var E = f.charCodeAt(o);
          if (!(l || this.switchU) || E <= 55295 || E >= 57344 || o + 1 >= m)
            return E;
          var O = f.charCodeAt(o + 1);
          return O >= 56320 && O <= 57343 ? (E << 10) + O - 56613888 : E;
        }),
        (on.prototype.nextIndex = function (o, l) {
          l === void 0 && (l = !1);
          var f = this.source,
            m = f.length;
          if (o >= m) return m;
          var E = f.charCodeAt(o),
            O;
          return !(l || this.switchU) ||
            E <= 55295 ||
            E >= 57344 ||
            o + 1 >= m ||
            (O = f.charCodeAt(o + 1)) < 56320 ||
            O > 57343
            ? o + 1
            : o + 2;
        }),
        (on.prototype.current = function (o) {
          return o === void 0 && (o = !1), this.at(this.pos, o);
        }),
        (on.prototype.lookahead = function (o) {
          return (
            o === void 0 && (o = !1), this.at(this.nextIndex(this.pos, o), o)
          );
        }),
        (on.prototype.advance = function (o) {
          o === void 0 && (o = !1), (this.pos = this.nextIndex(this.pos, o));
        }),
        (on.prototype.eat = function (o, l) {
          return (
            l === void 0 && (l = !1),
            this.current(l) === o ? (this.advance(l), !0) : !1
          );
        }),
        (on.prototype.eatChars = function (o, l) {
          l === void 0 && (l = !1);
          for (var f = this.pos, m = 0, E = o; m < E.length; m += 1) {
            var O = E[m],
              Y = this.at(f, l);
            if (Y === -1 || Y !== O) return !1;
            f = this.nextIndex(f, l);
          }
          return (this.pos = f), !0;
        }),
        (le.validateRegExpFlags = function (n) {
          for (
            var o = n.validFlags, l = n.flags, f = !1, m = !1, E = 0;
            E < l.length;
            E++
          ) {
            var O = l.charAt(E);
            o.indexOf(O) === -1 &&
              this.raise(n.start, 'Invalid regular expression flag'),
              l.indexOf(O, E + 1) > -1 &&
                this.raise(n.start, 'Duplicate regular expression flag'),
              O === 'u' && (f = !0),
              O === 'v' && (m = !0);
          }
          this.options.ecmaVersion >= 15 &&
            f &&
            m &&
            this.raise(n.start, 'Invalid regular expression flag');
        });
      function Uo(n) {
        for (var o in n) return !0;
        return !1;
      }
      (le.validateRegExpPattern = function (n) {
        this.regexp_pattern(n),
          !n.switchN &&
            this.options.ecmaVersion >= 9 &&
            Uo(n.groupNames) &&
            ((n.switchN = !0), this.regexp_pattern(n));
      }),
        (le.regexp_pattern = function (n) {
          (n.pos = 0),
            (n.lastIntValue = 0),
            (n.lastStringValue = ''),
            (n.lastAssertionIsQuantifiable = !1),
            (n.numCapturingParens = 0),
            (n.maxBackReference = 0),
            (n.groupNames = Object.create(null)),
            (n.backReferenceNames.length = 0),
            (n.branchID = null),
            this.regexp_disjunction(n),
            n.pos !== n.source.length &&
              (n.eat(41) && n.raise("Unmatched ')'"),
              (n.eat(93) || n.eat(125)) && n.raise('Lone quantifier brackets')),
            n.maxBackReference > n.numCapturingParens &&
              n.raise('Invalid escape');
          for (var o = 0, l = n.backReferenceNames; o < l.length; o += 1) {
            var f = l[o];
            n.groupNames[f] || n.raise('Invalid named capture referenced');
          }
        }),
        (le.regexp_disjunction = function (n) {
          var o = this.options.ecmaVersion >= 16;
          for (
            o && (n.branchID = new Xs(n.branchID, null)),
              this.regexp_alternative(n);
            n.eat(124);

          )
            o && (n.branchID = n.branchID.sibling()),
              this.regexp_alternative(n);
          o && (n.branchID = n.branchID.parent),
            this.regexp_eatQuantifier(n, !0) && n.raise('Nothing to repeat'),
            n.eat(123) && n.raise('Lone quantifier brackets');
        }),
        (le.regexp_alternative = function (n) {
          for (; n.pos < n.source.length && this.regexp_eatTerm(n); );
        }),
        (le.regexp_eatTerm = function (n) {
          return this.regexp_eatAssertion(n)
            ? (n.lastAssertionIsQuantifiable &&
                this.regexp_eatQuantifier(n) &&
                n.switchU &&
                n.raise('Invalid quantifier'),
              !0)
            : (
                n.switchU
                  ? this.regexp_eatAtom(n)
                  : this.regexp_eatExtendedAtom(n)
              )
            ? (this.regexp_eatQuantifier(n), !0)
            : !1;
        }),
        (le.regexp_eatAssertion = function (n) {
          var o = n.pos;
          if (((n.lastAssertionIsQuantifiable = !1), n.eat(94) || n.eat(36)))
            return !0;
          if (n.eat(92)) {
            if (n.eat(66) || n.eat(98)) return !0;
            n.pos = o;
          }
          if (n.eat(40) && n.eat(63)) {
            var l = !1;
            if (
              (this.options.ecmaVersion >= 9 && (l = n.eat(60)),
              n.eat(61) || n.eat(33))
            )
              return (
                this.regexp_disjunction(n),
                n.eat(41) || n.raise('Unterminated group'),
                (n.lastAssertionIsQuantifiable = !l),
                !0
              );
          }
          return (n.pos = o), !1;
        }),
        (le.regexp_eatQuantifier = function (n, o) {
          return (
            o === void 0 && (o = !1),
            this.regexp_eatQuantifierPrefix(n, o) ? (n.eat(63), !0) : !1
          );
        }),
        (le.regexp_eatQuantifierPrefix = function (n, o) {
          return (
            n.eat(42) ||
            n.eat(43) ||
            n.eat(63) ||
            this.regexp_eatBracedQuantifier(n, o)
          );
        }),
        (le.regexp_eatBracedQuantifier = function (n, o) {
          var l = n.pos;
          if (n.eat(123)) {
            var f = 0,
              m = -1;
            if (
              this.regexp_eatDecimalDigits(n) &&
              ((f = n.lastIntValue),
              n.eat(44) &&
                this.regexp_eatDecimalDigits(n) &&
                (m = n.lastIntValue),
              n.eat(125))
            )
              return (
                m !== -1 &&
                  m < f &&
                  !o &&
                  n.raise('numbers out of order in {} quantifier'),
                !0
              );
            n.switchU && !o && n.raise('Incomplete quantifier'), (n.pos = l);
          }
          return !1;
        }),
        (le.regexp_eatAtom = function (n) {
          return (
            this.regexp_eatPatternCharacters(n) ||
            n.eat(46) ||
            this.regexp_eatReverseSolidusAtomEscape(n) ||
            this.regexp_eatCharacterClass(n) ||
            this.regexp_eatUncapturingGroup(n) ||
            this.regexp_eatCapturingGroup(n)
          );
        }),
        (le.regexp_eatReverseSolidusAtomEscape = function (n) {
          var o = n.pos;
          if (n.eat(92)) {
            if (this.regexp_eatAtomEscape(n)) return !0;
            n.pos = o;
          }
          return !1;
        }),
        (le.regexp_eatUncapturingGroup = function (n) {
          var o = n.pos;
          if (n.eat(40)) {
            if (n.eat(63)) {
              if (this.options.ecmaVersion >= 16) {
                var l = this.regexp_eatModifiers(n),
                  f = n.eat(45);
                if (l || f) {
                  for (var m = 0; m < l.length; m++) {
                    var E = l.charAt(m);
                    l.indexOf(E, m + 1) > -1 &&
                      n.raise('Duplicate regular expression modifiers');
                  }
                  if (f) {
                    var O = this.regexp_eatModifiers(n);
                    !l &&
                      !O &&
                      n.current() === 58 &&
                      n.raise('Invalid regular expression modifiers');
                    for (var Y = 0; Y < O.length; Y++) {
                      var Q = O.charAt(Y);
                      (O.indexOf(Q, Y + 1) > -1 || l.indexOf(Q) > -1) &&
                        n.raise('Duplicate regular expression modifiers');
                    }
                  }
                }
              }
              if (n.eat(58)) {
                if ((this.regexp_disjunction(n), n.eat(41))) return !0;
                n.raise('Unterminated group');
              }
            }
            n.pos = o;
          }
          return !1;
        }),
        (le.regexp_eatCapturingGroup = function (n) {
          if (n.eat(40)) {
            if (
              (this.options.ecmaVersion >= 9
                ? this.regexp_groupSpecifier(n)
                : n.current() === 63 && n.raise('Invalid group'),
              this.regexp_disjunction(n),
              n.eat(41))
            )
              return (n.numCapturingParens += 1), !0;
            n.raise('Unterminated group');
          }
          return !1;
        }),
        (le.regexp_eatModifiers = function (n) {
          for (var o = '', l = 0; (l = n.current()) !== -1 && Ho(l); )
            (o += nt(l)), n.advance();
          return o;
        });
      function Ho(n) {
        return n === 105 || n === 109 || n === 115;
      }
      (le.regexp_eatExtendedAtom = function (n) {
        return (
          n.eat(46) ||
          this.regexp_eatReverseSolidusAtomEscape(n) ||
          this.regexp_eatCharacterClass(n) ||
          this.regexp_eatUncapturingGroup(n) ||
          this.regexp_eatCapturingGroup(n) ||
          this.regexp_eatInvalidBracedQuantifier(n) ||
          this.regexp_eatExtendedPatternCharacter(n)
        );
      }),
        (le.regexp_eatInvalidBracedQuantifier = function (n) {
          return (
            this.regexp_eatBracedQuantifier(n, !0) &&
              n.raise('Nothing to repeat'),
            !1
          );
        }),
        (le.regexp_eatSyntaxCharacter = function (n) {
          var o = n.current();
          return Tr(o) ? ((n.lastIntValue = o), n.advance(), !0) : !1;
        });
      function Tr(n) {
        return (
          n === 36 ||
          (n >= 40 && n <= 43) ||
          n === 46 ||
          n === 63 ||
          (n >= 91 && n <= 94) ||
          (n >= 123 && n <= 125)
        );
      }
      (le.regexp_eatPatternCharacters = function (n) {
        for (var o = n.pos, l = 0; (l = n.current()) !== -1 && !Tr(l); )
          n.advance();
        return n.pos !== o;
      }),
        (le.regexp_eatExtendedPatternCharacter = function (n) {
          var o = n.current();
          return o !== -1 &&
            o !== 36 &&
            !(o >= 40 && o <= 43) &&
            o !== 46 &&
            o !== 63 &&
            o !== 91 &&
            o !== 94 &&
            o !== 124
            ? (n.advance(), !0)
            : !1;
        }),
        (le.regexp_groupSpecifier = function (n) {
          if (n.eat(63)) {
            this.regexp_eatGroupName(n) || n.raise('Invalid group');
            var o = this.options.ecmaVersion >= 16,
              l = n.groupNames[n.lastStringValue];
            if (l)
              if (o)
                for (var f = 0, m = l; f < m.length; f += 1) {
                  var E = m[f];
                  E.separatedFrom(n.branchID) ||
                    n.raise('Duplicate capture group name');
                }
              else n.raise('Duplicate capture group name');
            o
              ? (l || (n.groupNames[n.lastStringValue] = [])).push(n.branchID)
              : (n.groupNames[n.lastStringValue] = !0);
          }
        }),
        (le.regexp_eatGroupName = function (n) {
          if (((n.lastStringValue = ''), n.eat(60))) {
            if (this.regexp_eatRegExpIdentifierName(n) && n.eat(62)) return !0;
            n.raise('Invalid capture group name');
          }
          return !1;
        }),
        (le.regexp_eatRegExpIdentifierName = function (n) {
          if (
            ((n.lastStringValue = ''), this.regexp_eatRegExpIdentifierStart(n))
          ) {
            for (
              n.lastStringValue += nt(n.lastIntValue);
              this.regexp_eatRegExpIdentifierPart(n);

            )
              n.lastStringValue += nt(n.lastIntValue);
            return !0;
          }
          return !1;
        }),
        (le.regexp_eatRegExpIdentifierStart = function (n) {
          var o = n.pos,
            l = this.options.ecmaVersion >= 11,
            f = n.current(l);
          return (
            n.advance(l),
            f === 92 &&
              this.regexp_eatRegExpUnicodeEscapeSequence(n, l) &&
              (f = n.lastIntValue),
            Wo(f) ? ((n.lastIntValue = f), !0) : ((n.pos = o), !1)
          );
        });
      function Wo(n) {
        return h(n, !0) || n === 36 || n === 95;
      }
      le.regexp_eatRegExpIdentifierPart = function (n) {
        var o = n.pos,
          l = this.options.ecmaVersion >= 11,
          f = n.current(l);
        return (
          n.advance(l),
          f === 92 &&
            this.regexp_eatRegExpUnicodeEscapeSequence(n, l) &&
            (f = n.lastIntValue),
          Go(f) ? ((n.lastIntValue = f), !0) : ((n.pos = o), !1)
        );
      };
      function Go(n) {
        return T(n, !0) || n === 36 || n === 95 || n === 8204 || n === 8205;
      }
      (le.regexp_eatAtomEscape = function (n) {
        return this.regexp_eatBackReference(n) ||
          this.regexp_eatCharacterClassEscape(n) ||
          this.regexp_eatCharacterEscape(n) ||
          (n.switchN && this.regexp_eatKGroupName(n))
          ? !0
          : (n.switchU &&
              (n.current() === 99 && n.raise('Invalid unicode escape'),
              n.raise('Invalid escape')),
            !1);
      }),
        (le.regexp_eatBackReference = function (n) {
          var o = n.pos;
          if (this.regexp_eatDecimalEscape(n)) {
            var l = n.lastIntValue;
            if (n.switchU)
              return l > n.maxBackReference && (n.maxBackReference = l), !0;
            if (l <= n.numCapturingParens) return !0;
            n.pos = o;
          }
          return !1;
        }),
        (le.regexp_eatKGroupName = function (n) {
          if (n.eat(107)) {
            if (this.regexp_eatGroupName(n))
              return n.backReferenceNames.push(n.lastStringValue), !0;
            n.raise('Invalid named reference');
          }
          return !1;
        }),
        (le.regexp_eatCharacterEscape = function (n) {
          return (
            this.regexp_eatControlEscape(n) ||
            this.regexp_eatCControlLetter(n) ||
            this.regexp_eatZero(n) ||
            this.regexp_eatHexEscapeSequence(n) ||
            this.regexp_eatRegExpUnicodeEscapeSequence(n, !1) ||
            (!n.switchU && this.regexp_eatLegacyOctalEscapeSequence(n)) ||
            this.regexp_eatIdentityEscape(n)
          );
        }),
        (le.regexp_eatCControlLetter = function (n) {
          var o = n.pos;
          if (n.eat(99)) {
            if (this.regexp_eatControlLetter(n)) return !0;
            n.pos = o;
          }
          return !1;
        }),
        (le.regexp_eatZero = function (n) {
          return n.current() === 48 && !vr(n.lookahead())
            ? ((n.lastIntValue = 0), n.advance(), !0)
            : !1;
        }),
        (le.regexp_eatControlEscape = function (n) {
          var o = n.current();
          return o === 116
            ? ((n.lastIntValue = 9), n.advance(), !0)
            : o === 110
            ? ((n.lastIntValue = 10), n.advance(), !0)
            : o === 118
            ? ((n.lastIntValue = 11), n.advance(), !0)
            : o === 102
            ? ((n.lastIntValue = 12), n.advance(), !0)
            : o === 114
            ? ((n.lastIntValue = 13), n.advance(), !0)
            : !1;
        }),
        (le.regexp_eatControlLetter = function (n) {
          var o = n.current();
          return kr(o) ? ((n.lastIntValue = o % 32), n.advance(), !0) : !1;
        });
      function kr(n) {
        return (n >= 65 && n <= 90) || (n >= 97 && n <= 122);
      }
      le.regexp_eatRegExpUnicodeEscapeSequence = function (n, o) {
        o === void 0 && (o = !1);
        var l = n.pos,
          f = o || n.switchU;
        if (n.eat(117)) {
          if (this.regexp_eatFixedHexDigits(n, 4)) {
            var m = n.lastIntValue;
            if (f && m >= 55296 && m <= 56319) {
              var E = n.pos;
              if (
                n.eat(92) &&
                n.eat(117) &&
                this.regexp_eatFixedHexDigits(n, 4)
              ) {
                var O = n.lastIntValue;
                if (O >= 56320 && O <= 57343)
                  return (
                    (n.lastIntValue = (m - 55296) * 1024 + (O - 56320) + 65536),
                    !0
                  );
              }
              (n.pos = E), (n.lastIntValue = m);
            }
            return !0;
          }
          if (
            f &&
            n.eat(123) &&
            this.regexp_eatHexDigits(n) &&
            n.eat(125) &&
            vf(n.lastIntValue)
          )
            return !0;
          f && n.raise('Invalid unicode escape'), (n.pos = l);
        }
        return !1;
      };
      function vf(n) {
        return n >= 0 && n <= 1114111;
      }
      (le.regexp_eatIdentityEscape = function (n) {
        if (n.switchU)
          return this.regexp_eatSyntaxCharacter(n)
            ? !0
            : n.eat(47)
            ? ((n.lastIntValue = 47), !0)
            : !1;
        var o = n.current();
        return o !== 99 && (!n.switchN || o !== 107)
          ? ((n.lastIntValue = o), n.advance(), !0)
          : !1;
      }),
        (le.regexp_eatDecimalEscape = function (n) {
          n.lastIntValue = 0;
          var o = n.current();
          if (o >= 49 && o <= 57) {
            do (n.lastIntValue = 10 * n.lastIntValue + (o - 48)), n.advance();
            while ((o = n.current()) >= 48 && o <= 57);
            return !0;
          }
          return !1;
        });
      var Rc = 0,
        Vn = 1,
        an = 2;
      le.regexp_eatCharacterClassEscape = function (n) {
        var o = n.current();
        if (xf(o)) return (n.lastIntValue = -1), n.advance(), Vn;
        var l = !1;
        if (
          n.switchU &&
          this.options.ecmaVersion >= 9 &&
          ((l = o === 80) || o === 112)
        ) {
          (n.lastIntValue = -1), n.advance();
          var f;
          if (
            n.eat(123) &&
            (f = this.regexp_eatUnicodePropertyValueExpression(n)) &&
            n.eat(125)
          )
            return l && f === an && n.raise('Invalid property name'), f;
          n.raise('Invalid property name');
        }
        return Rc;
      };
      function xf(n) {
        return (
          n === 100 ||
          n === 68 ||
          n === 115 ||
          n === 83 ||
          n === 119 ||
          n === 87
        );
      }
      (le.regexp_eatUnicodePropertyValueExpression = function (n) {
        var o = n.pos;
        if (this.regexp_eatUnicodePropertyName(n) && n.eat(61)) {
          var l = n.lastStringValue;
          if (this.regexp_eatUnicodePropertyValue(n)) {
            var f = n.lastStringValue;
            return this.regexp_validateUnicodePropertyNameAndValue(n, l, f), Vn;
          }
        }
        if (((n.pos = o), this.regexp_eatLoneUnicodePropertyNameOrValue(n))) {
          var m = n.lastStringValue;
          return this.regexp_validateUnicodePropertyNameOrValue(n, m);
        }
        return Rc;
      }),
        (le.regexp_validateUnicodePropertyNameAndValue = function (n, o, l) {
          mt(n.unicodeProperties.nonBinary, o) ||
            n.raise('Invalid property name'),
            n.unicodeProperties.nonBinary[o].test(l) ||
              n.raise('Invalid property value');
        }),
        (le.regexp_validateUnicodePropertyNameOrValue = function (n, o) {
          if (n.unicodeProperties.binary.test(o)) return Vn;
          if (n.switchV && n.unicodeProperties.binaryOfStrings.test(o))
            return an;
          n.raise('Invalid property name');
        }),
        (le.regexp_eatUnicodePropertyName = function (n) {
          var o = 0;
          for (n.lastStringValue = ''; Lc((o = n.current())); )
            (n.lastStringValue += nt(o)), n.advance();
          return n.lastStringValue !== '';
        });
      function Lc(n) {
        return kr(n) || n === 95;
      }
      le.regexp_eatUnicodePropertyValue = function (n) {
        var o = 0;
        for (n.lastStringValue = ''; gf((o = n.current())); )
          (n.lastStringValue += nt(o)), n.advance();
        return n.lastStringValue !== '';
      };
      function gf(n) {
        return Lc(n) || vr(n);
      }
      (le.regexp_eatLoneUnicodePropertyNameOrValue = function (n) {
        return this.regexp_eatUnicodePropertyValue(n);
      }),
        (le.regexp_eatCharacterClass = function (n) {
          if (n.eat(91)) {
            var o = n.eat(94),
              l = this.regexp_classContents(n);
            return (
              n.eat(93) || n.raise('Unterminated character class'),
              o &&
                l === an &&
                n.raise('Negated character class may contain strings'),
              !0
            );
          }
          return !1;
        }),
        (le.regexp_classContents = function (n) {
          return n.current() === 93
            ? Vn
            : n.switchV
            ? this.regexp_classSetExpression(n)
            : (this.regexp_nonEmptyClassRanges(n), Vn);
        }),
        (le.regexp_nonEmptyClassRanges = function (n) {
          for (; this.regexp_eatClassAtom(n); ) {
            var o = n.lastIntValue;
            if (n.eat(45) && this.regexp_eatClassAtom(n)) {
              var l = n.lastIntValue;
              n.switchU &&
                (o === -1 || l === -1) &&
                n.raise('Invalid character class'),
                o !== -1 &&
                  l !== -1 &&
                  o > l &&
                  n.raise('Range out of order in character class');
            }
          }
        }),
        (le.regexp_eatClassAtom = function (n) {
          var o = n.pos;
          if (n.eat(92)) {
            if (this.regexp_eatClassEscape(n)) return !0;
            if (n.switchU) {
              var l = n.current();
              (l === 99 || Mc(l)) && n.raise('Invalid class escape'),
                n.raise('Invalid escape');
            }
            n.pos = o;
          }
          var f = n.current();
          return f !== 93 ? ((n.lastIntValue = f), n.advance(), !0) : !1;
        }),
        (le.regexp_eatClassEscape = function (n) {
          var o = n.pos;
          if (n.eat(98)) return (n.lastIntValue = 8), !0;
          if (n.switchU && n.eat(45)) return (n.lastIntValue = 45), !0;
          if (!n.switchU && n.eat(99)) {
            if (this.regexp_eatClassControlLetter(n)) return !0;
            n.pos = o;
          }
          return (
            this.regexp_eatCharacterClassEscape(n) ||
            this.regexp_eatCharacterEscape(n)
          );
        }),
        (le.regexp_classSetExpression = function (n) {
          var o = Vn,
            l;
          if (!this.regexp_eatClassSetRange(n))
            if ((l = this.regexp_eatClassSetOperand(n))) {
              l === an && (o = an);
              for (var f = n.pos; n.eatChars([38, 38]); ) {
                if (
                  n.current() !== 38 &&
                  (l = this.regexp_eatClassSetOperand(n))
                ) {
                  l !== an && (o = Vn);
                  continue;
                }
                n.raise('Invalid character in character class');
              }
              if (f !== n.pos) return o;
              for (; n.eatChars([45, 45]); )
                this.regexp_eatClassSetOperand(n) ||
                  n.raise('Invalid character in character class');
              if (f !== n.pos) return o;
            } else n.raise('Invalid character in character class');
          for (;;)
            if (!this.regexp_eatClassSetRange(n)) {
              if (((l = this.regexp_eatClassSetOperand(n)), !l)) return o;
              l === an && (o = an);
            }
        }),
        (le.regexp_eatClassSetRange = function (n) {
          var o = n.pos;
          if (this.regexp_eatClassSetCharacter(n)) {
            var l = n.lastIntValue;
            if (n.eat(45) && this.regexp_eatClassSetCharacter(n)) {
              var f = n.lastIntValue;
              return (
                l !== -1 &&
                  f !== -1 &&
                  l > f &&
                  n.raise('Range out of order in character class'),
                !0
              );
            }
            n.pos = o;
          }
          return !1;
        }),
        (le.regexp_eatClassSetOperand = function (n) {
          return this.regexp_eatClassSetCharacter(n)
            ? Vn
            : this.regexp_eatClassStringDisjunction(n) ||
                this.regexp_eatNestedClass(n);
        }),
        (le.regexp_eatNestedClass = function (n) {
          var o = n.pos;
          if (n.eat(91)) {
            var l = n.eat(94),
              f = this.regexp_classContents(n);
            if (n.eat(93))
              return (
                l &&
                  f === an &&
                  n.raise('Negated character class may contain strings'),
                f
              );
            n.pos = o;
          }
          if (n.eat(92)) {
            var m = this.regexp_eatCharacterClassEscape(n);
            if (m) return m;
            n.pos = o;
          }
          return null;
        }),
        (le.regexp_eatClassStringDisjunction = function (n) {
          var o = n.pos;
          if (n.eatChars([92, 113])) {
            if (n.eat(123)) {
              var l = this.regexp_classStringDisjunctionContents(n);
              if (n.eat(125)) return l;
            } else n.raise('Invalid escape');
            n.pos = o;
          }
          return null;
        }),
        (le.regexp_classStringDisjunctionContents = function (n) {
          for (var o = this.regexp_classString(n); n.eat(124); )
            this.regexp_classString(n) === an && (o = an);
          return o;
        }),
        (le.regexp_classString = function (n) {
          for (var o = 0; this.regexp_eatClassSetCharacter(n); ) o++;
          return o === 1 ? Vn : an;
        }),
        (le.regexp_eatClassSetCharacter = function (n) {
          var o = n.pos;
          if (n.eat(92))
            return this.regexp_eatCharacterEscape(n) ||
              this.regexp_eatClassSetReservedPunctuator(n)
              ? !0
              : n.eat(98)
              ? ((n.lastIntValue = 8), !0)
              : ((n.pos = o), !1);
          var l = n.current();
          return l < 0 || (l === n.lookahead() && _f(l)) || bf(l)
            ? !1
            : (n.advance(), (n.lastIntValue = l), !0);
        });
      function _f(n) {
        return (
          n === 33 ||
          (n >= 35 && n <= 38) ||
          (n >= 42 && n <= 44) ||
          n === 46 ||
          (n >= 58 && n <= 64) ||
          n === 94 ||
          n === 96 ||
          n === 126
        );
      }
      function bf(n) {
        return (
          n === 40 ||
          n === 41 ||
          n === 45 ||
          n === 47 ||
          (n >= 91 && n <= 93) ||
          (n >= 123 && n <= 125)
        );
      }
      le.regexp_eatClassSetReservedPunctuator = function (n) {
        var o = n.current();
        return Cf(o) ? ((n.lastIntValue = o), n.advance(), !0) : !1;
      };
      function Cf(n) {
        return (
          n === 33 ||
          n === 35 ||
          n === 37 ||
          n === 38 ||
          n === 44 ||
          n === 45 ||
          (n >= 58 && n <= 62) ||
          n === 64 ||
          n === 96 ||
          n === 126
        );
      }
      (le.regexp_eatClassControlLetter = function (n) {
        var o = n.current();
        return vr(o) || o === 95
          ? ((n.lastIntValue = o % 32), n.advance(), !0)
          : !1;
      }),
        (le.regexp_eatHexEscapeSequence = function (n) {
          var o = n.pos;
          if (n.eat(120)) {
            if (this.regexp_eatFixedHexDigits(n, 2)) return !0;
            n.switchU && n.raise('Invalid escape'), (n.pos = o);
          }
          return !1;
        }),
        (le.regexp_eatDecimalDigits = function (n) {
          var o = n.pos,
            l = 0;
          for (n.lastIntValue = 0; vr((l = n.current())); )
            (n.lastIntValue = 10 * n.lastIntValue + (l - 48)), n.advance();
          return n.pos !== o;
        });
      function vr(n) {
        return n >= 48 && n <= 57;
      }
      le.regexp_eatHexDigits = function (n) {
        var o = n.pos,
          l = 0;
        for (n.lastIntValue = 0; Oc((l = n.current())); )
          (n.lastIntValue = 16 * n.lastIntValue + Dc(l)), n.advance();
        return n.pos !== o;
      };
      function Oc(n) {
        return (
          (n >= 48 && n <= 57) || (n >= 65 && n <= 70) || (n >= 97 && n <= 102)
        );
      }
      function Dc(n) {
        return n >= 65 && n <= 70
          ? 10 + (n - 65)
          : n >= 97 && n <= 102
          ? 10 + (n - 97)
          : n - 48;
      }
      (le.regexp_eatLegacyOctalEscapeSequence = function (n) {
        if (this.regexp_eatOctalDigit(n)) {
          var o = n.lastIntValue;
          if (this.regexp_eatOctalDigit(n)) {
            var l = n.lastIntValue;
            o <= 3 && this.regexp_eatOctalDigit(n)
              ? (n.lastIntValue = o * 64 + l * 8 + n.lastIntValue)
              : (n.lastIntValue = o * 8 + l);
          } else n.lastIntValue = o;
          return !0;
        }
        return !1;
      }),
        (le.regexp_eatOctalDigit = function (n) {
          var o = n.current();
          return Mc(o)
            ? ((n.lastIntValue = o - 48), n.advance(), !0)
            : ((n.lastIntValue = 0), !1);
        });
      function Mc(n) {
        return n >= 48 && n <= 55;
      }
      le.regexp_eatFixedHexDigits = function (n, o) {
        var l = n.pos;
        n.lastIntValue = 0;
        for (var f = 0; f < o; ++f) {
          var m = n.current();
          if (!Oc(m)) return (n.pos = l), !1;
          (n.lastIntValue = 16 * n.lastIntValue + Dc(m)), n.advance();
        }
        return !0;
      };
      var xr = function (o) {
          (this.type = o.type),
            (this.value = o.value),
            (this.start = o.start),
            (this.end = o.end),
            o.options.locations && (this.loc = new wt(o, o.startLoc, o.endLoc)),
            o.options.ranges && (this.range = [o.start, o.end]);
        },
        Ae = Ge.prototype;
      (Ae.next = function (n) {
        !n &&
          this.type.keyword &&
          this.containsEsc &&
          this.raiseRecoverable(
            this.start,
            'Escape sequence in keyword ' + this.type.keyword
          ),
          this.options.onToken && this.options.onToken(new xr(this)),
          (this.lastTokEnd = this.end),
          (this.lastTokStart = this.start),
          (this.lastTokEndLoc = this.endLoc),
          (this.lastTokStartLoc = this.startLoc),
          this.nextToken();
      }),
        (Ae.getToken = function () {
          return this.next(), new xr(this);
        }),
        typeof Symbol < 'u' &&
          (Ae[Symbol.iterator] = function () {
            var n = this;
            return {
              next: function () {
                var o = n.getToken();
                return {done: o.type === c.eof, value: o};
              },
            };
          }),
        (Ae.nextToken = function () {
          var n = this.curContext();
          if (
            ((!n || !n.preserveSpace) && this.skipSpace(),
            (this.start = this.pos),
            this.options.locations && (this.startLoc = this.curPosition()),
            this.pos >= this.input.length)
          )
            return this.finishToken(c.eof);
          if (n.override) return n.override(this);
          this.readToken(this.fullCharCodeAtPos());
        }),
        (Ae.readToken = function (n) {
          return h(n, this.options.ecmaVersion >= 6) || n === 92
            ? this.readWord()
            : this.getTokenFromCode(n);
        }),
        (Ae.fullCharCodeAtPos = function () {
          var n = this.input.charCodeAt(this.pos);
          if (n <= 55295 || n >= 56320) return n;
          var o = this.input.charCodeAt(this.pos + 1);
          return o <= 56319 || o >= 57344 ? n : (n << 10) + o - 56613888;
        }),
        (Ae.skipBlockComment = function () {
          var n = this.options.onComment && this.curPosition(),
            o = this.pos,
            l = this.input.indexOf('*/', (this.pos += 2));
          if (
            (l === -1 && this.raise(this.pos - 2, 'Unterminated comment'),
            (this.pos = l + 2),
            this.options.locations)
          )
            for (
              var f = void 0, m = o;
              (f = ie(this.input, m, this.pos)) > -1;

            )
              ++this.curLine, (m = this.lineStart = f);
          this.options.onComment &&
            this.options.onComment(
              !0,
              this.input.slice(o + 2, l),
              o,
              this.pos,
              n,
              this.curPosition()
            );
        }),
        (Ae.skipLineComment = function (n) {
          for (
            var o = this.pos,
              l = this.options.onComment && this.curPosition(),
              f = this.input.charCodeAt((this.pos += n));
            this.pos < this.input.length && !X(f);

          )
            f = this.input.charCodeAt(++this.pos);
          this.options.onComment &&
            this.options.onComment(
              !1,
              this.input.slice(o + n, this.pos),
              o,
              this.pos,
              l,
              this.curPosition()
            );
        }),
        (Ae.skipSpace = function () {
          e: for (; this.pos < this.input.length; ) {
            var n = this.input.charCodeAt(this.pos);
            switch (n) {
              case 32:
              case 160:
                ++this.pos;
                break;
              case 13:
                this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
              case 10:
              case 8232:
              case 8233:
                ++this.pos,
                  this.options.locations &&
                    (++this.curLine, (this.lineStart = this.pos));
                break;
              case 47:
                switch (this.input.charCodeAt(this.pos + 1)) {
                  case 42:
                    this.skipBlockComment();
                    break;
                  case 47:
                    this.skipLineComment(2);
                    break;
                  default:
                    break e;
                }
                break;
              default:
                if (
                  (n > 8 && n < 14) ||
                  (n >= 5760 && pe.test(String.fromCharCode(n)))
                )
                  ++this.pos;
                else break e;
            }
          }
        }),
        (Ae.finishToken = function (n, o) {
          (this.end = this.pos),
            this.options.locations && (this.endLoc = this.curPosition());
          var l = this.type;
          (this.type = n), (this.value = o), this.updateContext(l);
        }),
        (Ae.readToken_dot = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          if (n >= 48 && n <= 57) return this.readNumber(!0);
          var o = this.input.charCodeAt(this.pos + 2);
          return this.options.ecmaVersion >= 6 && n === 46 && o === 46
            ? ((this.pos += 3), this.finishToken(c.ellipsis))
            : (++this.pos, this.finishToken(c.dot));
        }),
        (Ae.readToken_slash = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          return this.exprAllowed
            ? (++this.pos, this.readRegexp())
            : n === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(c.slash, 1);
        }),
        (Ae.readToken_mult_modulo_exp = function (n) {
          var o = this.input.charCodeAt(this.pos + 1),
            l = 1,
            f = n === 42 ? c.star : c.modulo;
          return (
            this.options.ecmaVersion >= 7 &&
              n === 42 &&
              o === 42 &&
              (++l,
              (f = c.starstar),
              (o = this.input.charCodeAt(this.pos + 2))),
            o === 61 ? this.finishOp(c.assign, l + 1) : this.finishOp(f, l)
          );
        }),
        (Ae.readToken_pipe_amp = function (n) {
          var o = this.input.charCodeAt(this.pos + 1);
          if (o === n) {
            if (this.options.ecmaVersion >= 12) {
              var l = this.input.charCodeAt(this.pos + 2);
              if (l === 61) return this.finishOp(c.assign, 3);
            }
            return this.finishOp(n === 124 ? c.logicalOR : c.logicalAND, 2);
          }
          return o === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(n === 124 ? c.bitwiseOR : c.bitwiseAND, 1);
        }),
        (Ae.readToken_caret = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          return n === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(c.bitwiseXOR, 1);
        }),
        (Ae.readToken_plus_min = function (n) {
          var o = this.input.charCodeAt(this.pos + 1);
          return o === n
            ? o === 45 &&
              !this.inModule &&
              this.input.charCodeAt(this.pos + 2) === 62 &&
              (this.lastTokEnd === 0 ||
                R.test(this.input.slice(this.lastTokEnd, this.pos)))
              ? (this.skipLineComment(3), this.skipSpace(), this.nextToken())
              : this.finishOp(c.incDec, 2)
            : o === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(c.plusMin, 1);
        }),
        (Ae.readToken_lt_gt = function (n) {
          var o = this.input.charCodeAt(this.pos + 1),
            l = 1;
          return o === n
            ? ((l =
                n === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2),
              this.input.charCodeAt(this.pos + l) === 61
                ? this.finishOp(c.assign, l + 1)
                : this.finishOp(c.bitShift, l))
            : o === 33 &&
              n === 60 &&
              !this.inModule &&
              this.input.charCodeAt(this.pos + 2) === 45 &&
              this.input.charCodeAt(this.pos + 3) === 45
            ? (this.skipLineComment(4), this.skipSpace(), this.nextToken())
            : (o === 61 && (l = 2), this.finishOp(c.relational, l));
        }),
        (Ae.readToken_eq_excl = function (n) {
          var o = this.input.charCodeAt(this.pos + 1);
          return o === 61
            ? this.finishOp(
                c.equality,
                this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2
              )
            : n === 61 && o === 62 && this.options.ecmaVersion >= 6
            ? ((this.pos += 2), this.finishToken(c.arrow))
            : this.finishOp(n === 61 ? c.eq : c.prefix, 1);
        }),
        (Ae.readToken_question = function () {
          var n = this.options.ecmaVersion;
          if (n >= 11) {
            var o = this.input.charCodeAt(this.pos + 1);
            if (o === 46) {
              var l = this.input.charCodeAt(this.pos + 2);
              if (l < 48 || l > 57) return this.finishOp(c.questionDot, 2);
            }
            if (o === 63) {
              if (n >= 12) {
                var f = this.input.charCodeAt(this.pos + 2);
                if (f === 61) return this.finishOp(c.assign, 3);
              }
              return this.finishOp(c.coalesce, 2);
            }
          }
          return this.finishOp(c.question, 1);
        }),
        (Ae.readToken_numberSign = function () {
          var n = this.options.ecmaVersion,
            o = 35;
          if (
            n >= 13 &&
            (++this.pos, (o = this.fullCharCodeAtPos()), h(o, !0) || o === 92)
          )
            return this.finishToken(c.privateId, this.readWord1());
          this.raise(this.pos, "Unexpected character '" + nt(o) + "'");
        }),
        (Ae.getTokenFromCode = function (n) {
          switch (n) {
            case 46:
              return this.readToken_dot();
            case 40:
              return ++this.pos, this.finishToken(c.parenL);
            case 41:
              return ++this.pos, this.finishToken(c.parenR);
            case 59:
              return ++this.pos, this.finishToken(c.semi);
            case 44:
              return ++this.pos, this.finishToken(c.comma);
            case 91:
              return ++this.pos, this.finishToken(c.bracketL);
            case 93:
              return ++this.pos, this.finishToken(c.bracketR);
            case 123:
              return ++this.pos, this.finishToken(c.braceL);
            case 125:
              return ++this.pos, this.finishToken(c.braceR);
            case 58:
              return ++this.pos, this.finishToken(c.colon);
            case 96:
              if (this.options.ecmaVersion < 6) break;
              return ++this.pos, this.finishToken(c.backQuote);
            case 48:
              var o = this.input.charCodeAt(this.pos + 1);
              if (o === 120 || o === 88) return this.readRadixNumber(16);
              if (this.options.ecmaVersion >= 6) {
                if (o === 111 || o === 79) return this.readRadixNumber(8);
                if (o === 98 || o === 66) return this.readRadixNumber(2);
              }
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return this.readNumber(!1);
            case 34:
            case 39:
              return this.readString(n);
            case 47:
              return this.readToken_slash();
            case 37:
            case 42:
              return this.readToken_mult_modulo_exp(n);
            case 124:
            case 38:
              return this.readToken_pipe_amp(n);
            case 94:
              return this.readToken_caret();
            case 43:
            case 45:
              return this.readToken_plus_min(n);
            case 60:
            case 62:
              return this.readToken_lt_gt(n);
            case 61:
            case 33:
              return this.readToken_eq_excl(n);
            case 63:
              return this.readToken_question();
            case 126:
              return this.finishOp(c.prefix, 1);
            case 35:
              return this.readToken_numberSign();
          }
          this.raise(this.pos, "Unexpected character '" + nt(n) + "'");
        }),
        (Ae.finishOp = function (n, o) {
          var l = this.input.slice(this.pos, this.pos + o);
          return (this.pos += o), this.finishToken(n, l);
        }),
        (Ae.readRegexp = function () {
          for (var n, o, l = this.pos; ; ) {
            this.pos >= this.input.length &&
              this.raise(l, 'Unterminated regular expression');
            var f = this.input.charAt(this.pos);
            if (
              (R.test(f) && this.raise(l, 'Unterminated regular expression'), n)
            )
              n = !1;
            else {
              if (f === '[') o = !0;
              else if (f === ']' && o) o = !1;
              else if (f === '/' && !o) break;
              n = f === '\\';
            }
            ++this.pos;
          }
          var m = this.input.slice(l, this.pos);
          ++this.pos;
          var E = this.pos,
            O = this.readWord1();
          this.containsEsc && this.unexpected(E);
          var Y = this.regexpState || (this.regexpState = new on(this));
          Y.reset(l, m, O),
            this.validateRegExpFlags(Y),
            this.validateRegExpPattern(Y);
          var Q = null;
          try {
            Q = new RegExp(m, O);
          } catch {}
          return this.finishToken(c.regexp, {pattern: m, flags: O, value: Q});
        }),
        (Ae.readInt = function (n, o, l) {
          for (
            var f = this.options.ecmaVersion >= 12 && o === void 0,
              m = l && this.input.charCodeAt(this.pos) === 48,
              E = this.pos,
              O = 0,
              Y = 0,
              Q = 0,
              Te = o ?? 1 / 0;
            Q < Te;
            ++Q, ++this.pos
          ) {
            var xe = this.input.charCodeAt(this.pos),
              Ze = void 0;
            if (f && xe === 95) {
              m &&
                this.raiseRecoverable(
                  this.pos,
                  'Numeric separator is not allowed in legacy octal numeric literals'
                ),
                Y === 95 &&
                  this.raiseRecoverable(
                    this.pos,
                    'Numeric separator must be exactly one underscore'
                  ),
                Q === 0 &&
                  this.raiseRecoverable(
                    this.pos,
                    'Numeric separator is not allowed at the first of digits'
                  ),
                (Y = xe);
              continue;
            }
            if (
              (xe >= 97
                ? (Ze = xe - 97 + 10)
                : xe >= 65
                ? (Ze = xe - 65 + 10)
                : xe >= 48 && xe <= 57
                ? (Ze = xe - 48)
                : (Ze = 1 / 0),
              Ze >= n)
            )
              break;
            (Y = xe), (O = O * n + Ze);
          }
          return (
            f &&
              Y === 95 &&
              this.raiseRecoverable(
                this.pos - 1,
                'Numeric separator is not allowed at the last of digits'
              ),
            this.pos === E || (o != null && this.pos - E !== o) ? null : O
          );
        });
      function wf(n, o) {
        return o ? parseInt(n, 8) : parseFloat(n.replace(/_/g, ''));
      }
      function Fc(n) {
        return typeof BigInt != 'function' ? null : BigInt(n.replace(/_/g, ''));
      }
      (Ae.readRadixNumber = function (n) {
        var o = this.pos;
        this.pos += 2;
        var l = this.readInt(n);
        return (
          l == null &&
            this.raise(this.start + 2, 'Expected number in radix ' + n),
          this.options.ecmaVersion >= 11 &&
          this.input.charCodeAt(this.pos) === 110
            ? ((l = Fc(this.input.slice(o, this.pos))), ++this.pos)
            : h(this.fullCharCodeAtPos()) &&
              this.raise(this.pos, 'Identifier directly after number'),
          this.finishToken(c.num, l)
        );
      }),
        (Ae.readNumber = function (n) {
          var o = this.pos;
          !n &&
            this.readInt(10, void 0, !0) === null &&
            this.raise(o, 'Invalid number');
          var l = this.pos - o >= 2 && this.input.charCodeAt(o) === 48;
          l && this.strict && this.raise(o, 'Invalid number');
          var f = this.input.charCodeAt(this.pos);
          if (!l && !n && this.options.ecmaVersion >= 11 && f === 110) {
            var m = Fc(this.input.slice(o, this.pos));
            return (
              ++this.pos,
              h(this.fullCharCodeAtPos()) &&
                this.raise(this.pos, 'Identifier directly after number'),
              this.finishToken(c.num, m)
            );
          }
          l && /[89]/.test(this.input.slice(o, this.pos)) && (l = !1),
            f === 46 &&
              !l &&
              (++this.pos,
              this.readInt(10),
              (f = this.input.charCodeAt(this.pos))),
            (f === 69 || f === 101) &&
              !l &&
              ((f = this.input.charCodeAt(++this.pos)),
              (f === 43 || f === 45) && ++this.pos,
              this.readInt(10) === null && this.raise(o, 'Invalid number')),
            h(this.fullCharCodeAtPos()) &&
              this.raise(this.pos, 'Identifier directly after number');
          var E = wf(this.input.slice(o, this.pos), l);
          return this.finishToken(c.num, E);
        }),
        (Ae.readCodePoint = function () {
          var n = this.input.charCodeAt(this.pos),
            o;
          if (n === 123) {
            this.options.ecmaVersion < 6 && this.unexpected();
            var l = ++this.pos;
            (o = this.readHexChar(
              this.input.indexOf('}', this.pos) - this.pos
            )),
              ++this.pos,
              o > 1114111 &&
                this.invalidStringToken(l, 'Code point out of bounds');
          } else o = this.readHexChar(4);
          return o;
        }),
        (Ae.readString = function (n) {
          for (var o = '', l = ++this.pos; ; ) {
            this.pos >= this.input.length &&
              this.raise(this.start, 'Unterminated string constant');
            var f = this.input.charCodeAt(this.pos);
            if (f === n) break;
            f === 92
              ? ((o += this.input.slice(l, this.pos)),
                (o += this.readEscapedChar(!1)),
                (l = this.pos))
              : f === 8232 || f === 8233
              ? (this.options.ecmaVersion < 10 &&
                  this.raise(this.start, 'Unterminated string constant'),
                ++this.pos,
                this.options.locations &&
                  (this.curLine++, (this.lineStart = this.pos)))
              : (X(f) && this.raise(this.start, 'Unterminated string constant'),
                ++this.pos);
          }
          return (
            (o += this.input.slice(l, this.pos++)),
            this.finishToken(c.string, o)
          );
        });
      var Bc = {};
      (Ae.tryReadTemplateToken = function () {
        this.inTemplateElement = !0;
        try {
          this.readTmplToken();
        } catch (n) {
          if (n === Bc) this.readInvalidTemplateToken();
          else throw n;
        }
        this.inTemplateElement = !1;
      }),
        (Ae.invalidStringToken = function (n, o) {
          if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw Bc;
          this.raise(n, o);
        }),
        (Ae.readTmplToken = function () {
          for (var n = '', o = this.pos; ; ) {
            this.pos >= this.input.length &&
              this.raise(this.start, 'Unterminated template');
            var l = this.input.charCodeAt(this.pos);
            if (
              l === 96 ||
              (l === 36 && this.input.charCodeAt(this.pos + 1) === 123)
            )
              return this.pos === this.start &&
                (this.type === c.template || this.type === c.invalidTemplate)
                ? l === 36
                  ? ((this.pos += 2), this.finishToken(c.dollarBraceL))
                  : (++this.pos, this.finishToken(c.backQuote))
                : ((n += this.input.slice(o, this.pos)),
                  this.finishToken(c.template, n));
            if (l === 92)
              (n += this.input.slice(o, this.pos)),
                (n += this.readEscapedChar(!0)),
                (o = this.pos);
            else if (X(l)) {
              switch (((n += this.input.slice(o, this.pos)), ++this.pos, l)) {
                case 13:
                  this.input.charCodeAt(this.pos) === 10 && ++this.pos;
                case 10:
                  n += `
`;
                  break;
                default:
                  n += String.fromCharCode(l);
                  break;
              }
              this.options.locations &&
                (++this.curLine, (this.lineStart = this.pos)),
                (o = this.pos);
            } else ++this.pos;
          }
        }),
        (Ae.readInvalidTemplateToken = function () {
          for (; this.pos < this.input.length; this.pos++)
            switch (this.input[this.pos]) {
              case '\\':
                ++this.pos;
                break;
              case '$':
                if (this.input[this.pos + 1] !== '{') break;
              case '`':
                return this.finishToken(
                  c.invalidTemplate,
                  this.input.slice(this.start, this.pos)
                );
              case '\r':
                this.input[this.pos + 1] ===
                  `
` && ++this.pos;
              case `
`:
              case '\u2028':
              case '\u2029':
                ++this.curLine, (this.lineStart = this.pos + 1);
                break;
            }
          this.raise(this.start, 'Unterminated template');
        }),
        (Ae.readEscapedChar = function (n) {
          var o = this.input.charCodeAt(++this.pos);
          switch ((++this.pos, o)) {
            case 110:
              return `
`;
            case 114:
              return '\r';
            case 120:
              return String.fromCharCode(this.readHexChar(2));
            case 117:
              return nt(this.readCodePoint());
            case 116:
              return '	';
            case 98:
              return '\b';
            case 118:
              return '\v';
            case 102:
              return '\f';
            case 13:
              this.input.charCodeAt(this.pos) === 10 && ++this.pos;
            case 10:
              return (
                this.options.locations &&
                  ((this.lineStart = this.pos), ++this.curLine),
                ''
              );
            case 56:
            case 57:
              if (
                (this.strict &&
                  this.invalidStringToken(
                    this.pos - 1,
                    'Invalid escape sequence'
                  ),
                n)
              ) {
                var l = this.pos - 1;
                this.invalidStringToken(
                  l,
                  'Invalid escape sequence in template string'
                );
              }
            default:
              if (o >= 48 && o <= 55) {
                var f = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
                  m = parseInt(f, 8);
                return (
                  m > 255 && ((f = f.slice(0, -1)), (m = parseInt(f, 8))),
                  (this.pos += f.length - 1),
                  (o = this.input.charCodeAt(this.pos)),
                  (f !== '0' || o === 56 || o === 57) &&
                    (this.strict || n) &&
                    this.invalidStringToken(
                      this.pos - 1 - f.length,
                      n
                        ? 'Octal literal in template string'
                        : 'Octal literal in strict mode'
                    ),
                  String.fromCharCode(m)
                );
              }
              return X(o)
                ? (this.options.locations &&
                    ((this.lineStart = this.pos), ++this.curLine),
                  '')
                : String.fromCharCode(o);
          }
        }),
        (Ae.readHexChar = function (n) {
          var o = this.pos,
            l = this.readInt(16, n);
          return (
            l === null &&
              this.invalidStringToken(o, 'Bad character escape sequence'),
            l
          );
        }),
        (Ae.readWord1 = function () {
          this.containsEsc = !1;
          for (
            var n = '', o = !0, l = this.pos, f = this.options.ecmaVersion >= 6;
            this.pos < this.input.length;

          ) {
            var m = this.fullCharCodeAtPos();
            if (T(m, f)) this.pos += m <= 65535 ? 1 : 2;
            else if (m === 92) {
              (this.containsEsc = !0), (n += this.input.slice(l, this.pos));
              var E = this.pos;
              this.input.charCodeAt(++this.pos) !== 117 &&
                this.invalidStringToken(
                  this.pos,
                  'Expecting Unicode escape sequence \\uXXXX'
                ),
                ++this.pos;
              var O = this.readCodePoint();
              (o ? h : T)(O, f) ||
                this.invalidStringToken(E, 'Invalid Unicode escape'),
                (n += nt(O)),
                (l = this.pos);
            } else break;
            o = !1;
          }
          return n + this.input.slice(l, this.pos);
        }),
        (Ae.readWord = function () {
          var n = this.readWord1(),
            o = c.name;
          return this.keywords.test(n) && (o = U[n]), this.finishToken(o, n);
        });
      var Vc = '8.15.0';
      Ge.acorn = {
        Parser: Ge,
        version: Vc,
        defaultOptions: Pt,
        Position: ct,
        SourceLocation: wt,
        getLineInfo: $t,
        Node: Fn,
        TokenType: x,
        tokTypes: c,
        keywordTypes: U,
        TokContext: Rt,
        tokContexts: Ue,
        isIdentifierChar: T,
        isIdentifierStart: h,
        Token: xr,
        isNewLine: X,
        lineBreak: R,
        lineBreakG: W,
        nonASCIIwhitespace: pe,
      };
      function Sf(n, o) {
        return Ge.parse(n, o);
      }
      function If(n, o, l) {
        return Ge.parseExpressionAt(n, o, l);
      }
      function Ef(n, o) {
        return Ge.tokenizer(n, o);
      }
      (e.Node = Fn),
        (e.Parser = Ge),
        (e.Position = ct),
        (e.SourceLocation = wt),
        (e.TokContext = Rt),
        (e.Token = xr),
        (e.TokenType = x),
        (e.defaultOptions = Pt),
        (e.getLineInfo = $t),
        (e.isIdentifierChar = T),
        (e.isIdentifierStart = h),
        (e.isNewLine = X),
        (e.keywordTypes = U),
        (e.lineBreak = R),
        (e.lineBreakG = W),
        (e.nonASCIIwhitespace = pe),
        (e.parse = Sf),
        (e.parseExpressionAt = If),
        (e.tokContexts = Ue),
        (e.tokTypes = c),
        (e.tokenizer = Ef),
        (e.version = Vc);
    });
  });
  var df = Z((Bo, ff) => {
    (function (e, t) {
      typeof Bo == 'object' && typeof ff < 'u'
        ? t(Bo, hf())
        : typeof define == 'function' && define.amd
        ? define(['exports', 'acorn'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t(((e.acorn = e.acorn || {}), (e.acorn.loose = {})), e.acorn));
    })(Bo, function (e, t) {
      'use strict';
      var s = '\u2716';
      function i(p) {
        return p.name === s;
      }
      function r() {}
      var a = function (h, T) {
        if (
          (T === void 0 && (T = {}),
          (this.toks = this.constructor.BaseParser.tokenizer(h, T)),
          (this.options = this.toks.options),
          (this.input = this.toks.input),
          (this.tok = this.last = {type: t.tokTypes.eof, start: 0, end: 0}),
          (this.tok.validateRegExpFlags = r),
          (this.tok.validateRegExpPattern = r),
          this.options.locations)
        ) {
          var x = this.toks.curPosition();
          this.tok.loc = new t.SourceLocation(this.toks, x, x);
        }
        (this.ahead = []),
          (this.context = []),
          (this.curIndent = 0),
          (this.curLineStart = 0),
          (this.nextLineStart = this.lineEnd(this.curLineStart) + 1),
          (this.inAsync = !1),
          (this.inGenerator = !1),
          (this.inFunction = !1);
      };
      (a.prototype.startNode = function () {
        return new t.Node(
          this.toks,
          this.tok.start,
          this.options.locations ? this.tok.loc.start : null
        );
      }),
        (a.prototype.storeCurrentPos = function () {
          return this.options.locations
            ? [this.tok.start, this.tok.loc.start]
            : this.tok.start;
        }),
        (a.prototype.startNodeAt = function (h) {
          return this.options.locations
            ? new t.Node(this.toks, h[0], h[1])
            : new t.Node(this.toks, h);
        }),
        (a.prototype.finishNode = function (h, T) {
          return (
            (h.type = T),
            (h.end = this.last.end),
            this.options.locations && (h.loc.end = this.last.loc.end),
            this.options.ranges && (h.range[1] = this.last.end),
            h
          );
        }),
        (a.prototype.dummyNode = function (h) {
          var T = this.startNode();
          return (
            (T.type = h),
            (T.end = T.start),
            this.options.locations && (T.loc.end = T.loc.start),
            this.options.ranges && (T.range[1] = T.start),
            (this.last = {
              type: t.tokTypes.name,
              start: T.start,
              end: T.start,
              loc: T.loc,
            }),
            T
          );
        }),
        (a.prototype.dummyIdent = function () {
          var h = this.dummyNode('Identifier');
          return (h.name = s), h;
        }),
        (a.prototype.dummyString = function () {
          var h = this.dummyNode('Literal');
          return (h.value = h.raw = s), h;
        }),
        (a.prototype.eat = function (h) {
          return this.tok.type === h ? (this.next(), !0) : !1;
        }),
        (a.prototype.isContextual = function (h) {
          return this.tok.type === t.tokTypes.name && this.tok.value === h;
        }),
        (a.prototype.eatContextual = function (h) {
          return this.tok.value === h && this.eat(t.tokTypes.name);
        }),
        (a.prototype.canInsertSemicolon = function () {
          return (
            this.tok.type === t.tokTypes.eof ||
            this.tok.type === t.tokTypes.braceR ||
            t.lineBreak.test(this.input.slice(this.last.end, this.tok.start))
          );
        }),
        (a.prototype.semicolon = function () {
          return this.eat(t.tokTypes.semi);
        }),
        (a.prototype.expect = function (h) {
          if (this.eat(h)) return !0;
          for (var T = 1; T <= 2; T++)
            if (this.lookAhead(T).type === h) {
              for (var x = 0; x < T; x++) this.next();
              return !0;
            }
        }),
        (a.prototype.pushCx = function () {
          this.context.push(this.curIndent);
        }),
        (a.prototype.popCx = function () {
          this.curIndent = this.context.pop();
        }),
        (a.prototype.lineEnd = function (h) {
          for (
            ;
            h < this.input.length && !t.isNewLine(this.input.charCodeAt(h));

          )
            ++h;
          return h;
        }),
        (a.prototype.indentationAfter = function (h) {
          for (var T = 0; ; ++h) {
            var x = this.input.charCodeAt(h);
            if (x === 32) ++T;
            else if (x === 9) T += this.options.tabSize;
            else return T;
          }
        }),
        (a.prototype.closes = function (h, T, x, w) {
          return this.tok.type === h || this.tok.type === t.tokTypes.eof
            ? !0
            : x !== this.curLineStart &&
                this.curIndent < T &&
                this.tokenStartsLine() &&
                (!w ||
                  this.nextLineStart >= this.input.length ||
                  this.indentationAfter(this.nextLineStart) < T);
        }),
        (a.prototype.tokenStartsLine = function () {
          for (var h = this.tok.start - 1; h >= this.curLineStart; --h) {
            var T = this.input.charCodeAt(h);
            if (T !== 9 && T !== 32) return !1;
          }
          return !0;
        }),
        (a.prototype.extend = function (h, T) {
          this[h] = T(this[h]);
        }),
        (a.prototype.parse = function () {
          return this.next(), this.parseTopLevel();
        }),
        (a.extend = function () {
          for (var h = [], T = arguments.length; T--; ) h[T] = arguments[T];
          for (var x = this, w = 0; w < h.length; w++) x = h[w](x);
          return x;
        }),
        (a.parse = function (h, T) {
          return new this(h, T).parse();
        }),
        (a.BaseParser = t.Parser);
      var u = a.prototype;
      function d(p) {
        return (p < 14 && p > 8) || p === 32 || p === 160 || t.isNewLine(p);
      }
      (u.next = function () {
        if (
          ((this.last = this.tok),
          this.ahead.length
            ? (this.tok = this.ahead.shift())
            : (this.tok = this.readToken()),
          this.tok.start >= this.nextLineStart)
        ) {
          for (; this.tok.start >= this.nextLineStart; )
            (this.curLineStart = this.nextLineStart),
              (this.nextLineStart = this.lineEnd(this.curLineStart) + 1);
          this.curIndent = this.indentationAfter(this.curLineStart);
        }
      }),
        (u.readToken = function () {
          for (;;)
            try {
              return (
                this.toks.next(),
                this.toks.type === t.tokTypes.dot &&
                  this.input.substr(this.toks.end, 1) === '.' &&
                  this.options.ecmaVersion >= 6 &&
                  (this.toks.end++, (this.toks.type = t.tokTypes.ellipsis)),
                new t.Token(this.toks)
              );
            } catch (S) {
              if (!(S instanceof SyntaxError)) throw S;
              var p = S.message,
                h = S.raisedAt,
                T = !0;
              if (/unterminated/i.test(p))
                if (((h = this.lineEnd(S.pos + 1)), /string/.test(p)))
                  T = {
                    start: S.pos,
                    end: h,
                    type: t.tokTypes.string,
                    value: this.input.slice(S.pos + 1, h),
                  };
                else if (/regular expr/i.test(p)) {
                  var x = this.input.slice(S.pos, h);
                  try {
                    x = new RegExp(x);
                  } catch {}
                  T = {start: S.pos, end: h, type: t.tokTypes.regexp, value: x};
                } else
                  /template/.test(p)
                    ? (T = {
                        start: S.pos,
                        end: h,
                        type: t.tokTypes.template,
                        value: this.input.slice(S.pos, h),
                      })
                    : (T = !1);
              else if (
                /invalid (unicode|regexp|number)|expecting unicode|octal literal|is reserved|directly after number|expected number in radix|numeric separator/i.test(
                  p
                )
              )
                for (; h < this.input.length && !d(this.input.charCodeAt(h)); )
                  ++h;
              else if (/character escape|expected hexadecimal/i.test(p))
                for (; h < this.input.length; ) {
                  var w = this.input.charCodeAt(h++);
                  if (w === 34 || w === 39 || t.isNewLine(w)) break;
                }
              else if (/unexpected character/i.test(p)) h++, (T = !1);
              else if (/regular expression/i.test(p)) T = !0;
              else throw S;
              if (
                (this.resetTo(h),
                T === !0 &&
                  (T = {start: h, end: h, type: t.tokTypes.name, value: s}),
                T)
              )
                return (
                  this.options.locations &&
                    (T.loc = new t.SourceLocation(
                      this.toks,
                      t.getLineInfo(this.input, T.start),
                      t.getLineInfo(this.input, T.end)
                    )),
                  T
                );
            }
        }),
        (u.resetTo = function (p) {
          (this.toks.pos = p), (this.toks.containsEsc = !1);
          var h = this.input.charAt(p - 1);
          if (
            ((this.toks.exprAllowed =
              !h ||
              /[[{(,;:?/*=+\-~!|&%^<>]/.test(h) ||
              (/[enwfd]/.test(h) &&
                /\b(case|else|return|throw|new|in|(instance|type)?of|delete|void)$/.test(
                  this.input.slice(p - 10, p)
                ))),
            this.options.locations)
          ) {
            (this.toks.curLine = 1),
              (this.toks.lineStart = t.lineBreakG.lastIndex = 0);
            for (var T; (T = t.lineBreakG.exec(this.input)) && T.index < p; )
              ++this.toks.curLine,
                (this.toks.lineStart = T.index + T[0].length);
          }
        }),
        (u.lookAhead = function (p) {
          for (; p > this.ahead.length; ) this.ahead.push(this.readToken());
          return this.ahead[p - 1];
        });
      var y = a.prototype;
      (y.parseTopLevel = function () {
        var p = this.startNodeAt(
          this.options.locations ? [0, t.getLineInfo(this.input, 0)] : 0
        );
        for (p.body = []; this.tok.type !== t.tokTypes.eof; )
          p.body.push(this.parseStatement());
        return (
          this.toks.adaptDirectivePrologue(p.body),
          (this.last = this.tok),
          (p.sourceType =
            this.options.sourceType === 'commonjs'
              ? 'script'
              : this.options.sourceType),
          this.finishNode(p, 'Program')
        );
      }),
        (y.parseStatement = function () {
          var p = this.tok.type,
            h = this.startNode(),
            T;
          switch (
            (this.toks.isLet() && ((p = t.tokTypes._var), (T = 'let')), p)
          ) {
            case t.tokTypes._break:
            case t.tokTypes._continue:
              this.next();
              var x = p === t.tokTypes._break;
              return (
                this.semicolon() || this.canInsertSemicolon()
                  ? (h.label = null)
                  : ((h.label =
                      this.tok.type === t.tokTypes.name
                        ? this.parseIdent()
                        : null),
                    this.semicolon()),
                this.finishNode(h, x ? 'BreakStatement' : 'ContinueStatement')
              );
            case t.tokTypes._debugger:
              return (
                this.next(),
                this.semicolon(),
                this.finishNode(h, 'DebuggerStatement')
              );
            case t.tokTypes._do:
              return (
                this.next(),
                (h.body = this.parseStatement()),
                (h.test = this.eat(t.tokTypes._while)
                  ? this.parseParenExpression()
                  : this.dummyIdent()),
                this.semicolon(),
                this.finishNode(h, 'DoWhileStatement')
              );
            case t.tokTypes._for:
              this.next();
              var w =
                this.options.ecmaVersion >= 9 && this.eatContextual('await');
              if (
                (this.pushCx(),
                this.expect(t.tokTypes.parenL),
                this.tok.type === t.tokTypes.semi)
              )
                return this.parseFor(h, null);
              var S = this.toks.isLet(),
                A = this.toks.isAwaitUsing(!0),
                U = !A && this.toks.isUsing(!0);
              if (
                S ||
                this.tok.type === t.tokTypes._var ||
                this.tok.type === t.tokTypes._const ||
                U ||
                A
              ) {
                var M = S
                    ? 'let'
                    : U
                    ? 'using'
                    : A
                    ? 'await using'
                    : this.tok.value,
                  c = this.startNode();
                return (
                  U || A
                    ? (A && this.next(), this.parseVar(c, !0, M))
                    : (c = this.parseVar(c, !0, M)),
                  c.declarations.length === 1 &&
                  (this.tok.type === t.tokTypes._in || this.isContextual('of'))
                    ? (this.options.ecmaVersion >= 9 &&
                        this.tok.type !== t.tokTypes._in &&
                        (h.await = w),
                      this.parseForIn(h, c))
                    : this.parseFor(h, c)
                );
              }
              var R = this.parseExpression(!0);
              return this.tok.type === t.tokTypes._in || this.isContextual('of')
                ? (this.options.ecmaVersion >= 9 &&
                    this.tok.type !== t.tokTypes._in &&
                    (h.await = w),
                  this.parseForIn(h, this.toAssignable(R)))
                : this.parseFor(h, R);
            case t.tokTypes._function:
              return this.next(), this.parseFunction(h, !0);
            case t.tokTypes._if:
              return (
                this.next(),
                (h.test = this.parseParenExpression()),
                (h.consequent = this.parseStatement()),
                (h.alternate = this.eat(t.tokTypes._else)
                  ? this.parseStatement()
                  : null),
                this.finishNode(h, 'IfStatement')
              );
            case t.tokTypes._return:
              return (
                this.next(),
                this.eat(t.tokTypes.semi) || this.canInsertSemicolon()
                  ? (h.argument = null)
                  : ((h.argument = this.parseExpression()), this.semicolon()),
                this.finishNode(h, 'ReturnStatement')
              );
            case t.tokTypes._switch:
              var W = this.curIndent,
                X = this.curLineStart;
              this.next(),
                (h.discriminant = this.parseParenExpression()),
                (h.cases = []),
                this.pushCx(),
                this.expect(t.tokTypes.braceL);
              for (var ie; !this.closes(t.tokTypes.braceR, W, X, !0); )
                if (
                  this.tok.type === t.tokTypes._case ||
                  this.tok.type === t.tokTypes._default
                ) {
                  var pe = this.tok.type === t.tokTypes._case;
                  ie && this.finishNode(ie, 'SwitchCase'),
                    h.cases.push((ie = this.startNode())),
                    (ie.consequent = []),
                    this.next(),
                    pe ? (ie.test = this.parseExpression()) : (ie.test = null),
                    this.expect(t.tokTypes.colon);
                } else
                  ie ||
                    (h.cases.push((ie = this.startNode())),
                    (ie.consequent = []),
                    (ie.test = null)),
                    ie.consequent.push(this.parseStatement());
              return (
                ie && this.finishNode(ie, 'SwitchCase'),
                this.popCx(),
                this.eat(t.tokTypes.braceR),
                this.finishNode(h, 'SwitchStatement')
              );
            case t.tokTypes._throw:
              return (
                this.next(),
                (h.argument = this.parseExpression()),
                this.semicolon(),
                this.finishNode(h, 'ThrowStatement')
              );
            case t.tokTypes._try:
              if (
                (this.next(),
                (h.block = this.parseBlock()),
                (h.handler = null),
                this.tok.type === t.tokTypes._catch)
              ) {
                var ae = this.startNode();
                this.next(),
                  this.eat(t.tokTypes.parenL)
                    ? ((ae.param = this.toAssignable(this.parseExprAtom(), !0)),
                      this.expect(t.tokTypes.parenR))
                    : (ae.param = null),
                  (ae.body = this.parseBlock()),
                  (h.handler = this.finishNode(ae, 'CatchClause'));
              }
              return (
                (h.finalizer = this.eat(t.tokTypes._finally)
                  ? this.parseBlock()
                  : null),
                !h.handler && !h.finalizer
                  ? h.block
                  : this.finishNode(h, 'TryStatement')
              );
            case t.tokTypes._var:
            case t.tokTypes._const:
              return this.parseVar(h, !1, T || this.tok.value);
            case t.tokTypes._while:
              return (
                this.next(),
                (h.test = this.parseParenExpression()),
                (h.body = this.parseStatement()),
                this.finishNode(h, 'WhileStatement')
              );
            case t.tokTypes._with:
              return (
                this.next(),
                (h.object = this.parseParenExpression()),
                (h.body = this.parseStatement()),
                this.finishNode(h, 'WithStatement')
              );
            case t.tokTypes.braceL:
              return this.parseBlock();
            case t.tokTypes.semi:
              return this.next(), this.finishNode(h, 'EmptyStatement');
            case t.tokTypes._class:
              return this.parseClass(!0);
            case t.tokTypes._import:
              if (this.options.ecmaVersion > 10) {
                var He = this.lookAhead(1).type;
                if (He === t.tokTypes.parenL || He === t.tokTypes.dot)
                  return (
                    (h.expression = this.parseExpression()),
                    this.semicolon(),
                    this.finishNode(h, 'ExpressionStatement')
                  );
              }
              return this.parseImport();
            case t.tokTypes._export:
              return this.parseExport();
            default:
              if (this.toks.isAsyncFunction())
                return this.next(), this.next(), this.parseFunction(h, !0, !0);
              if (this.toks.isUsing(!1)) return this.parseVar(h, !1, 'using');
              if (this.toks.isAwaitUsing(!1))
                return this.next(), this.parseVar(h, !1, 'await using');
              var qe = this.parseExpression();
              return i(qe)
                ? (this.next(),
                  this.tok.type === t.tokTypes.eof
                    ? this.finishNode(h, 'EmptyStatement')
                    : this.parseStatement())
                : p === t.tokTypes.name &&
                  qe.type === 'Identifier' &&
                  this.eat(t.tokTypes.colon)
                ? ((h.body = this.parseStatement()),
                  (h.label = qe),
                  this.finishNode(h, 'LabeledStatement'))
                : ((h.expression = qe),
                  this.semicolon(),
                  this.finishNode(h, 'ExpressionStatement'));
          }
        }),
        (y.parseBlock = function () {
          var p = this.startNode();
          this.pushCx(), this.expect(t.tokTypes.braceL);
          var h = this.curIndent,
            T = this.curLineStart;
          for (p.body = []; !this.closes(t.tokTypes.braceR, h, T, !0); )
            p.body.push(this.parseStatement());
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR),
            this.finishNode(p, 'BlockStatement')
          );
        }),
        (y.parseFor = function (p, h) {
          return (
            (p.init = h),
            (p.test = p.update = null),
            this.eat(t.tokTypes.semi) &&
              this.tok.type !== t.tokTypes.semi &&
              (p.test = this.parseExpression()),
            this.eat(t.tokTypes.semi) &&
              this.tok.type !== t.tokTypes.parenR &&
              (p.update = this.parseExpression()),
            this.popCx(),
            this.expect(t.tokTypes.parenR),
            (p.body = this.parseStatement()),
            this.finishNode(p, 'ForStatement')
          );
        }),
        (y.parseForIn = function (p, h) {
          var T =
            this.tok.type === t.tokTypes._in
              ? 'ForInStatement'
              : 'ForOfStatement';
          return (
            this.next(),
            (p.left = h),
            (p.right = this.parseExpression()),
            this.popCx(),
            this.expect(t.tokTypes.parenR),
            (p.body = this.parseStatement()),
            this.finishNode(p, T)
          );
        }),
        (y.parseVar = function (p, h, T) {
          (p.kind = T), this.next(), (p.declarations = []);
          do {
            var x = this.startNode();
            (x.id =
              this.options.ecmaVersion >= 6
                ? this.toAssignable(this.parseExprAtom(), !0)
                : this.parseIdent()),
              (x.init = this.eat(t.tokTypes.eq)
                ? this.parseMaybeAssign(h)
                : null),
              p.declarations.push(this.finishNode(x, 'VariableDeclarator'));
          } while (this.eat(t.tokTypes.comma));
          if (!p.declarations.length) {
            var w = this.startNode();
            (w.id = this.dummyIdent()),
              p.declarations.push(this.finishNode(w, 'VariableDeclarator'));
          }
          return (
            h || this.semicolon(), this.finishNode(p, 'VariableDeclaration')
          );
        }),
        (y.parseClass = function (p) {
          var h = this.startNode();
          this.next(),
            this.tok.type === t.tokTypes.name
              ? (h.id = this.parseIdent())
              : p === !0
              ? (h.id = this.dummyIdent())
              : (h.id = null),
            (h.superClass = this.eat(t.tokTypes._extends)
              ? this.parseExpression()
              : null),
            (h.body = this.startNode()),
            (h.body.body = []),
            this.pushCx();
          var T = this.curIndent + 1,
            x = this.curLineStart;
          for (
            this.eat(t.tokTypes.braceL),
              this.curIndent + 1 < T &&
                ((T = this.curIndent), (x = this.curLineStart));
            !this.closes(t.tokTypes.braceR, T, x);

          ) {
            var w = this.parseClassElement();
            w && h.body.body.push(w);
          }
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR) ||
              ((this.last.end = this.tok.start),
              this.options.locations &&
                (this.last.loc.end = this.tok.loc.start)),
            this.semicolon(),
            this.finishNode(h.body, 'ClassBody'),
            this.finishNode(h, p ? 'ClassDeclaration' : 'ClassExpression')
          );
        }),
        (y.parseClassElement = function () {
          if (this.eat(t.tokTypes.semi)) return null;
          var p = this.options,
            h = p.ecmaVersion,
            T = p.locations,
            x = this.curIndent,
            w = this.curLineStart,
            S = this.startNode(),
            A = '',
            U = !1,
            M = !1,
            c = 'method',
            R = !1;
          if (this.eatContextual('static')) {
            if (h >= 13 && this.eat(t.tokTypes.braceL))
              return this.parseClassStaticBlock(S), S;
            this.isClassElementNameStart() || this.toks.type === t.tokTypes.star
              ? (R = !0)
              : (A = 'static');
          }
          if (
            ((S.static = R),
            !A &&
              h >= 8 &&
              this.eatContextual('async') &&
              ((this.isClassElementNameStart() ||
                this.toks.type === t.tokTypes.star) &&
              !this.canInsertSemicolon()
                ? (M = !0)
                : (A = 'async')),
            !A)
          ) {
            U = this.eat(t.tokTypes.star);
            var W = this.toks.value;
            (this.eatContextual('get') || this.eatContextual('set')) &&
              (this.isClassElementNameStart() ? (c = W) : (A = W));
          }
          if (A)
            (S.computed = !1),
              (S.key = this.startNodeAt(
                T
                  ? [this.toks.lastTokStart, this.toks.lastTokStartLoc]
                  : this.toks.lastTokStart
              )),
              (S.key.name = A),
              this.finishNode(S.key, 'Identifier');
          else if ((this.parseClassElementName(S), i(S.key)))
            return (
              i(this.parseMaybeAssign()) && this.next(),
              this.eat(t.tokTypes.comma),
              null
            );
          if (
            h < 13 ||
            this.toks.type === t.tokTypes.parenL ||
            c !== 'method' ||
            U ||
            M
          ) {
            var X =
              !S.computed &&
              !S.static &&
              !U &&
              !M &&
              c === 'method' &&
              ((S.key.type === 'Identifier' && S.key.name === 'constructor') ||
                (S.key.type === 'Literal' && S.key.value === 'constructor'));
            (S.kind = X ? 'constructor' : c),
              (S.value = this.parseMethod(U, M)),
              this.finishNode(S, 'MethodDefinition');
          } else {
            if (this.eat(t.tokTypes.eq))
              if (
                this.curLineStart !== w &&
                this.curIndent <= x &&
                this.tokenStartsLine()
              )
                S.value = null;
              else {
                var ie = this.inAsync,
                  pe = this.inGenerator;
                (this.inAsync = !1),
                  (this.inGenerator = !1),
                  (S.value = this.parseMaybeAssign()),
                  (this.inAsync = ie),
                  (this.inGenerator = pe);
              }
            else S.value = null;
            this.semicolon(), this.finishNode(S, 'PropertyDefinition');
          }
          return S;
        }),
        (y.parseClassStaticBlock = function (p) {
          var h = this.curIndent,
            T = this.curLineStart;
          for (
            p.body = [], this.pushCx();
            !this.closes(t.tokTypes.braceR, h, T, !0);

          )
            p.body.push(this.parseStatement());
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR),
            this.finishNode(p, 'StaticBlock')
          );
        }),
        (y.isClassElementNameStart = function () {
          return this.toks.isClassElementNameStart();
        }),
        (y.parseClassElementName = function (p) {
          this.toks.type === t.tokTypes.privateId
            ? ((p.computed = !1), (p.key = this.parsePrivateIdent()))
            : this.parsePropertyName(p);
        }),
        (y.parseFunction = function (p, h, T) {
          var x = this.inAsync,
            w = this.inGenerator,
            S = this.inFunction;
          return (
            this.initFunction(p),
            this.options.ecmaVersion >= 6 &&
              (p.generator = this.eat(t.tokTypes.star)),
            this.options.ecmaVersion >= 8 && (p.async = !!T),
            this.tok.type === t.tokTypes.name
              ? (p.id = this.parseIdent())
              : h === !0 && (p.id = this.dummyIdent()),
            (this.inAsync = p.async),
            (this.inGenerator = p.generator),
            (this.inFunction = !0),
            (p.params = this.parseFunctionParams()),
            (p.body = this.parseBlock()),
            this.toks.adaptDirectivePrologue(p.body.body),
            (this.inAsync = x),
            (this.inGenerator = w),
            (this.inFunction = S),
            this.finishNode(p, h ? 'FunctionDeclaration' : 'FunctionExpression')
          );
        }),
        (y.parseExport = function () {
          var p = this.startNode();
          if ((this.next(), this.eat(t.tokTypes.star)))
            return (
              this.options.ecmaVersion >= 11 &&
                (this.eatContextual('as')
                  ? (p.exported = this.parseExprAtom())
                  : (p.exported = null)),
              (p.source = this.eatContextual('from')
                ? this.parseExprAtom()
                : this.dummyString()),
              this.options.ecmaVersion >= 16 &&
                (p.attributes = this.parseWithClause()),
              this.semicolon(),
              this.finishNode(p, 'ExportAllDeclaration')
            );
          if (this.eat(t.tokTypes._default)) {
            var h;
            if (
              this.tok.type === t.tokTypes._function ||
              (h = this.toks.isAsyncFunction())
            ) {
              var T = this.startNode();
              this.next(),
                h && this.next(),
                (p.declaration = this.parseFunction(T, 'nullableID', h));
            } else
              this.tok.type === t.tokTypes._class
                ? (p.declaration = this.parseClass('nullableID'))
                : ((p.declaration = this.parseMaybeAssign()), this.semicolon());
            return this.finishNode(p, 'ExportDefaultDeclaration');
          }
          return (
            this.tok.type.keyword ||
            this.toks.isLet() ||
            this.toks.isAsyncFunction()
              ? ((p.declaration = this.parseStatement()),
                (p.specifiers = []),
                (p.source = null))
              : ((p.declaration = null),
                (p.specifiers = this.parseExportSpecifierList()),
                (p.source = this.eatContextual('from')
                  ? this.parseExprAtom()
                  : null),
                this.options.ecmaVersion >= 16 &&
                  (p.attributes = this.parseWithClause()),
                this.semicolon()),
            this.finishNode(p, 'ExportNamedDeclaration')
          );
        }),
        (y.parseImport = function () {
          var p = this.startNode();
          if ((this.next(), this.tok.type === t.tokTypes.string))
            (p.specifiers = []), (p.source = this.parseExprAtom());
          else {
            var h;
            this.tok.type === t.tokTypes.name &&
              this.tok.value !== 'from' &&
              ((h = this.startNode()),
              (h.local = this.parseIdent()),
              this.finishNode(h, 'ImportDefaultSpecifier'),
              this.eat(t.tokTypes.comma)),
              (p.specifiers = this.parseImportSpecifiers()),
              (p.source =
                this.eatContextual('from') &&
                this.tok.type === t.tokTypes.string
                  ? this.parseExprAtom()
                  : this.dummyString()),
              h && p.specifiers.unshift(h);
          }
          return (
            this.options.ecmaVersion >= 16 &&
              (p.attributes = this.parseWithClause()),
            this.semicolon(),
            this.finishNode(p, 'ImportDeclaration')
          );
        }),
        (y.parseImportSpecifiers = function () {
          var p = [];
          if (this.tok.type === t.tokTypes.star) {
            var h = this.startNode();
            this.next(),
              (h.local = this.eatContextual('as')
                ? this.parseIdent()
                : this.dummyIdent()),
              p.push(this.finishNode(h, 'ImportNamespaceSpecifier'));
          } else {
            var T = this.curIndent,
              x = this.curLineStart,
              w = this.nextLineStart;
            for (
              this.pushCx(),
                this.eat(t.tokTypes.braceL),
                this.curLineStart > w && (w = this.curLineStart);
              !this.closes(
                t.tokTypes.braceR,
                T + (this.curLineStart <= w ? 1 : 0),
                x
              );

            ) {
              var S = this.startNode();
              if (this.eat(t.tokTypes.star))
                (S.local = this.eatContextual('as')
                  ? this.parseModuleExportName()
                  : this.dummyIdent()),
                  this.finishNode(S, 'ImportNamespaceSpecifier');
              else {
                if (
                  this.isContextual('from') ||
                  ((S.imported = this.parseModuleExportName()), i(S.imported))
                )
                  break;
                (S.local = this.eatContextual('as')
                  ? this.parseModuleExportName()
                  : S.imported),
                  this.finishNode(S, 'ImportSpecifier');
              }
              p.push(S), this.eat(t.tokTypes.comma);
            }
            this.eat(t.tokTypes.braceR), this.popCx();
          }
          return p;
        }),
        (y.parseWithClause = function () {
          var p = [];
          if (!this.eat(t.tokTypes._with)) return p;
          var h = this.curIndent,
            T = this.curLineStart,
            x = this.nextLineStart;
          for (
            this.pushCx(),
              this.eat(t.tokTypes.braceL),
              this.curLineStart > x && (x = this.curLineStart);
            !this.closes(
              t.tokTypes.braceR,
              h + (this.curLineStart <= x ? 1 : 0),
              T
            );

          ) {
            var w = this.startNode();
            if (
              ((w.key =
                this.tok.type === t.tokTypes.string
                  ? this.parseExprAtom()
                  : this.parseIdent()),
              this.eat(t.tokTypes.colon))
            )
              this.tok.type === t.tokTypes.string
                ? (w.value = this.parseExprAtom())
                : (w.value = this.dummyString());
            else {
              if (i(w.key)) break;
              if (this.tok.type === t.tokTypes.string)
                w.value = this.parseExprAtom();
              else break;
            }
            p.push(this.finishNode(w, 'ImportAttribute')),
              this.eat(t.tokTypes.comma);
          }
          return this.eat(t.tokTypes.braceR), this.popCx(), p;
        }),
        (y.parseExportSpecifierList = function () {
          var p = [],
            h = this.curIndent,
            T = this.curLineStart,
            x = this.nextLineStart;
          for (
            this.pushCx(),
              this.eat(t.tokTypes.braceL),
              this.curLineStart > x && (x = this.curLineStart);
            !this.closes(
              t.tokTypes.braceR,
              h + (this.curLineStart <= x ? 1 : 0),
              T
            ) && !this.isContextual('from');

          ) {
            var w = this.startNode();
            if (((w.local = this.parseModuleExportName()), i(w.local))) break;
            (w.exported = this.eatContextual('as')
              ? this.parseModuleExportName()
              : w.local),
              this.finishNode(w, 'ExportSpecifier'),
              p.push(w),
              this.eat(t.tokTypes.comma);
          }
          return this.eat(t.tokTypes.braceR), this.popCx(), p;
        }),
        (y.parseModuleExportName = function () {
          return this.options.ecmaVersion >= 13 &&
            this.tok.type === t.tokTypes.string
            ? this.parseExprAtom()
            : this.parseIdent();
        });
      var g = a.prototype;
      (g.checkLVal = function (p) {
        if (!p) return p;
        switch (p.type) {
          case 'Identifier':
          case 'MemberExpression':
            return p;
          case 'ParenthesizedExpression':
            return (p.expression = this.checkLVal(p.expression)), p;
          default:
            return this.dummyIdent();
        }
      }),
        (g.parseExpression = function (p) {
          var h = this.storeCurrentPos(),
            T = this.parseMaybeAssign(p);
          if (this.tok.type === t.tokTypes.comma) {
            var x = this.startNodeAt(h);
            for (x.expressions = [T]; this.eat(t.tokTypes.comma); )
              x.expressions.push(this.parseMaybeAssign(p));
            return this.finishNode(x, 'SequenceExpression');
          }
          return T;
        }),
        (g.parseParenExpression = function () {
          this.pushCx(), this.expect(t.tokTypes.parenL);
          var p = this.parseExpression();
          return this.popCx(), this.expect(t.tokTypes.parenR), p;
        }),
        (g.parseMaybeAssign = function (p) {
          if (this.inGenerator && this.toks.isContextual('yield')) {
            var h = this.startNode();
            return (
              this.next(),
              this.semicolon() ||
              this.canInsertSemicolon() ||
              (this.tok.type !== t.tokTypes.star && !this.tok.type.startsExpr)
                ? ((h.delegate = !1), (h.argument = null))
                : ((h.delegate = this.eat(t.tokTypes.star)),
                  (h.argument = this.parseMaybeAssign())),
              this.finishNode(h, 'YieldExpression')
            );
          }
          var T = this.storeCurrentPos(),
            x = this.parseMaybeConditional(p);
          if (this.tok.type.isAssign) {
            var w = this.startNodeAt(T);
            return (
              (w.operator = this.tok.value),
              (w.left =
                this.tok.type === t.tokTypes.eq
                  ? this.toAssignable(x)
                  : this.checkLVal(x)),
              this.next(),
              (w.right = this.parseMaybeAssign(p)),
              this.finishNode(w, 'AssignmentExpression')
            );
          }
          return x;
        }),
        (g.parseMaybeConditional = function (p) {
          var h = this.storeCurrentPos(),
            T = this.parseExprOps(p);
          if (this.eat(t.tokTypes.question)) {
            var x = this.startNodeAt(h);
            return (
              (x.test = T),
              (x.consequent = this.parseMaybeAssign()),
              (x.alternate = this.expect(t.tokTypes.colon)
                ? this.parseMaybeAssign(p)
                : this.dummyIdent()),
              this.finishNode(x, 'ConditionalExpression')
            );
          }
          return T;
        }),
        (g.parseExprOps = function (p) {
          var h = this.storeCurrentPos(),
            T = this.curIndent,
            x = this.curLineStart;
          return this.parseExprOp(this.parseMaybeUnary(!1), h, -1, p, T, x);
        }),
        (g.parseExprOp = function (p, h, T, x, w, S) {
          if (
            this.curLineStart !== S &&
            this.curIndent < w &&
            this.tokenStartsLine()
          )
            return p;
          var A = this.tok.type.binop;
          if (A != null && (!x || this.tok.type !== t.tokTypes._in) && A > T) {
            var U = this.startNodeAt(h);
            if (
              ((U.left = p),
              (U.operator = this.tok.value),
              this.next(),
              this.curLineStart !== S &&
                this.curIndent < w &&
                this.tokenStartsLine())
            )
              U.right = this.dummyIdent();
            else {
              var M = this.storeCurrentPos();
              U.right = this.parseExprOp(
                this.parseMaybeUnary(!1),
                M,
                A,
                x,
                w,
                S
              );
            }
            return (
              this.finishNode(
                U,
                /&&|\|\||\?\?/.test(U.operator)
                  ? 'LogicalExpression'
                  : 'BinaryExpression'
              ),
              this.parseExprOp(U, h, T, x, w, S)
            );
          }
          return p;
        }),
        (g.parseMaybeUnary = function (p) {
          var h = this.storeCurrentPos(),
            T;
          if (
            this.options.ecmaVersion >= 8 &&
            this.toks.isContextual('await') &&
            (this.inAsync ||
              (this.toks.inModule && this.options.ecmaVersion >= 13) ||
              (!this.inFunction && this.options.allowAwaitOutsideFunction))
          )
            (T = this.parseAwait()), (p = !0);
          else if (this.tok.type.prefix) {
            var x = this.startNode(),
              w = this.tok.type === t.tokTypes.incDec;
            w || (p = !0),
              (x.operator = this.tok.value),
              (x.prefix = !0),
              this.next(),
              (x.argument = this.parseMaybeUnary(!0)),
              w && (x.argument = this.checkLVal(x.argument)),
              (T = this.finishNode(
                x,
                w ? 'UpdateExpression' : 'UnaryExpression'
              ));
          } else if (this.tok.type === t.tokTypes.ellipsis) {
            var S = this.startNode();
            this.next(),
              (S.argument = this.parseMaybeUnary(p)),
              (T = this.finishNode(S, 'SpreadElement'));
          } else if (!p && this.tok.type === t.tokTypes.privateId)
            T = this.parsePrivateIdent();
          else
            for (
              T = this.parseExprSubscripts();
              this.tok.type.postfix && !this.canInsertSemicolon();

            ) {
              var A = this.startNodeAt(h);
              (A.operator = this.tok.value),
                (A.prefix = !1),
                (A.argument = this.checkLVal(T)),
                this.next(),
                (T = this.finishNode(A, 'UpdateExpression'));
            }
          if (!p && this.eat(t.tokTypes.starstar)) {
            var U = this.startNodeAt(h);
            return (
              (U.operator = '**'),
              (U.left = T),
              (U.right = this.parseMaybeUnary(!1)),
              this.finishNode(U, 'BinaryExpression')
            );
          }
          return T;
        }),
        (g.parseExprSubscripts = function () {
          var p = this.storeCurrentPos();
          return this.parseSubscripts(
            this.parseExprAtom(),
            p,
            !1,
            this.curIndent,
            this.curLineStart
          );
        }),
        (g.parseSubscripts = function (p, h, T, x, w) {
          for (var S = this.options.ecmaVersion >= 11, A = !1; ; ) {
            if (
              this.curLineStart !== w &&
              this.curIndent <= x &&
              this.tokenStartsLine()
            )
              if (this.tok.type === t.tokTypes.dot && this.curIndent === x) --x;
              else break;
            var U =
                p.type === 'Identifier' &&
                p.name === 'async' &&
                !this.canInsertSemicolon(),
              M = S && this.eat(t.tokTypes.questionDot);
            if (
              (M && (A = !0),
              (M &&
                this.tok.type !== t.tokTypes.parenL &&
                this.tok.type !== t.tokTypes.bracketL &&
                this.tok.type !== t.tokTypes.backQuote) ||
                this.eat(t.tokTypes.dot))
            ) {
              var c = this.startNodeAt(h);
              (c.object = p),
                this.curLineStart !== w &&
                this.curIndent <= x &&
                this.tokenStartsLine()
                  ? (c.property = this.dummyIdent())
                  : (c.property =
                      this.parsePropertyAccessor() || this.dummyIdent()),
                (c.computed = !1),
                S && (c.optional = M),
                (p = this.finishNode(c, 'MemberExpression'));
            } else if (this.tok.type === t.tokTypes.bracketL) {
              this.pushCx(), this.next();
              var R = this.startNodeAt(h);
              (R.object = p),
                (R.property = this.parseExpression()),
                (R.computed = !0),
                S && (R.optional = M),
                this.popCx(),
                this.expect(t.tokTypes.bracketR),
                (p = this.finishNode(R, 'MemberExpression'));
            } else if (!T && this.tok.type === t.tokTypes.parenL) {
              var W = this.parseExprList(t.tokTypes.parenR);
              if (U && this.eat(t.tokTypes.arrow))
                return this.parseArrowExpression(this.startNodeAt(h), W, !0);
              var X = this.startNodeAt(h);
              (X.callee = p),
                (X.arguments = W),
                S && (X.optional = M),
                (p = this.finishNode(X, 'CallExpression'));
            } else if (this.tok.type === t.tokTypes.backQuote) {
              var ie = this.startNodeAt(h);
              (ie.tag = p),
                (ie.quasi = this.parseTemplate()),
                (p = this.finishNode(ie, 'TaggedTemplateExpression'));
            } else break;
          }
          if (A) {
            var pe = this.startNodeAt(h);
            (pe.expression = p), (p = this.finishNode(pe, 'ChainExpression'));
          }
          return p;
        }),
        (g.parseExprAtom = function () {
          var p;
          switch (this.tok.type) {
            case t.tokTypes._this:
            case t.tokTypes._super:
              var h =
                this.tok.type === t.tokTypes._this ? 'ThisExpression' : 'Super';
              return (p = this.startNode()), this.next(), this.finishNode(p, h);
            case t.tokTypes.name:
              var T = this.storeCurrentPos(),
                x = this.parseIdent(),
                w = !1;
              if (x.name === 'async' && !this.canInsertSemicolon()) {
                if (this.eat(t.tokTypes._function))
                  return (
                    this.toks.overrideContext(t.tokContexts.f_expr),
                    this.parseFunction(this.startNodeAt(T), !1, !0)
                  );
                this.tok.type === t.tokTypes.name &&
                  ((x = this.parseIdent()), (w = !0));
              }
              return this.eat(t.tokTypes.arrow)
                ? this.parseArrowExpression(this.startNodeAt(T), [x], w)
                : x;
            case t.tokTypes.regexp:
              p = this.startNode();
              var S = this.tok.value;
              return (
                (p.regex = {pattern: S.pattern, flags: S.flags}),
                (p.value = S.value),
                (p.raw = this.input.slice(this.tok.start, this.tok.end)),
                this.next(),
                this.finishNode(p, 'Literal')
              );
            case t.tokTypes.num:
            case t.tokTypes.string:
              return (
                (p = this.startNode()),
                (p.value = this.tok.value),
                (p.raw = this.input.slice(this.tok.start, this.tok.end)),
                this.tok.type === t.tokTypes.num &&
                  p.raw.charCodeAt(p.raw.length - 1) === 110 &&
                  (p.bigint =
                    p.value != null
                      ? p.value.toString()
                      : p.raw.slice(0, -1).replace(/_/g, '')),
                this.next(),
                this.finishNode(p, 'Literal')
              );
            case t.tokTypes._null:
            case t.tokTypes._true:
            case t.tokTypes._false:
              return (
                (p = this.startNode()),
                (p.value =
                  this.tok.type === t.tokTypes._null
                    ? null
                    : this.tok.type === t.tokTypes._true),
                (p.raw = this.tok.type.keyword),
                this.next(),
                this.finishNode(p, 'Literal')
              );
            case t.tokTypes.parenL:
              var A = this.storeCurrentPos();
              this.next();
              var U = this.parseExpression();
              if (
                (this.expect(t.tokTypes.parenR), this.eat(t.tokTypes.arrow))
              ) {
                var M = U.expressions || [U];
                return (
                  M.length && i(M[M.length - 1]) && M.pop(),
                  this.parseArrowExpression(this.startNodeAt(A), M)
                );
              }
              if (this.options.preserveParens) {
                var c = this.startNodeAt(A);
                (c.expression = U),
                  (U = this.finishNode(c, 'ParenthesizedExpression'));
              }
              return U;
            case t.tokTypes.bracketL:
              return (
                (p = this.startNode()),
                (p.elements = this.parseExprList(t.tokTypes.bracketR, !0)),
                this.finishNode(p, 'ArrayExpression')
              );
            case t.tokTypes.braceL:
              return (
                this.toks.overrideContext(t.tokContexts.b_expr), this.parseObj()
              );
            case t.tokTypes._class:
              return this.parseClass(!1);
            case t.tokTypes._function:
              return (
                (p = this.startNode()), this.next(), this.parseFunction(p, !1)
              );
            case t.tokTypes._new:
              return this.parseNew();
            case t.tokTypes.backQuote:
              return this.parseTemplate();
            case t.tokTypes._import:
              return this.options.ecmaVersion >= 11
                ? this.parseExprImport()
                : this.dummyIdent();
            default:
              return this.dummyIdent();
          }
        }),
        (g.parseExprImport = function () {
          var p = this.startNode(),
            h = this.parseIdent(!0);
          switch (this.tok.type) {
            case t.tokTypes.parenL:
              return this.parseDynamicImport(p);
            case t.tokTypes.dot:
              return (p.meta = h), this.parseImportMeta(p);
            default:
              return (p.name = 'import'), this.finishNode(p, 'Identifier');
          }
        }),
        (g.parseDynamicImport = function (p) {
          var h = this.parseExprList(t.tokTypes.parenR);
          return (
            (p.source = h[0] || this.dummyString()),
            (p.options = h[1] || null),
            this.finishNode(p, 'ImportExpression')
          );
        }),
        (g.parseImportMeta = function (p) {
          return (
            this.next(),
            (p.property = this.parseIdent(!0)),
            this.finishNode(p, 'MetaProperty')
          );
        }),
        (g.parseNew = function () {
          var p = this.startNode(),
            h = this.curIndent,
            T = this.curLineStart,
            x = this.parseIdent(!0);
          if (this.options.ecmaVersion >= 6 && this.eat(t.tokTypes.dot))
            return (
              (p.meta = x),
              (p.property = this.parseIdent(!0)),
              this.finishNode(p, 'MetaProperty')
            );
          var w = this.storeCurrentPos();
          return (
            (p.callee = this.parseSubscripts(
              this.parseExprAtom(),
              w,
              !0,
              h,
              T
            )),
            this.tok.type === t.tokTypes.parenL
              ? (p.arguments = this.parseExprList(t.tokTypes.parenR))
              : (p.arguments = []),
            this.finishNode(p, 'NewExpression')
          );
        }),
        (g.parseTemplateElement = function () {
          var p = this.startNode();
          return (
            this.tok.type === t.tokTypes.invalidTemplate
              ? (p.value = {raw: this.tok.value, cooked: null})
              : (p.value = {
                  raw: this.input.slice(this.tok.start, this.tok.end).replace(
                    /\r\n?/g,
                    `
`
                  ),
                  cooked: this.tok.value,
                }),
            this.next(),
            (p.tail = this.tok.type === t.tokTypes.backQuote),
            this.finishNode(p, 'TemplateElement')
          );
        }),
        (g.parseTemplate = function () {
          var p = this.startNode();
          this.next(), (p.expressions = []);
          var h = this.parseTemplateElement();
          for (p.quasis = [h]; !h.tail; )
            this.next(),
              p.expressions.push(this.parseExpression()),
              this.expect(t.tokTypes.braceR)
                ? (h = this.parseTemplateElement())
                : ((h = this.startNode()),
                  (h.value = {cooked: '', raw: ''}),
                  (h.tail = !0),
                  this.finishNode(h, 'TemplateElement')),
              p.quasis.push(h);
          return (
            this.expect(t.tokTypes.backQuote),
            this.finishNode(p, 'TemplateLiteral')
          );
        }),
        (g.parseObj = function () {
          var p = this.startNode();
          (p.properties = []), this.pushCx();
          var h = this.curIndent + 1,
            T = this.curLineStart;
          for (
            this.eat(t.tokTypes.braceL),
              this.curIndent + 1 < h &&
                ((h = this.curIndent), (T = this.curLineStart));
            !this.closes(t.tokTypes.braceR, h, T);

          ) {
            var x = this.startNode(),
              w = void 0,
              S = void 0,
              A = void 0;
            if (
              this.options.ecmaVersion >= 9 &&
              this.eat(t.tokTypes.ellipsis)
            ) {
              (x.argument = this.parseMaybeAssign()),
                p.properties.push(this.finishNode(x, 'SpreadElement')),
                this.eat(t.tokTypes.comma);
              continue;
            }
            if (
              (this.options.ecmaVersion >= 6 &&
                ((A = this.storeCurrentPos()),
                (x.method = !1),
                (x.shorthand = !1),
                (w = this.eat(t.tokTypes.star))),
              this.parsePropertyName(x),
              this.toks.isAsyncProp(x)
                ? ((S = !0),
                  (w =
                    this.options.ecmaVersion >= 9 && this.eat(t.tokTypes.star)),
                  this.parsePropertyName(x))
                : (S = !1),
              i(x.key))
            ) {
              i(this.parseMaybeAssign()) && this.next(),
                this.eat(t.tokTypes.comma);
              continue;
            }
            if (this.eat(t.tokTypes.colon))
              (x.kind = 'init'), (x.value = this.parseMaybeAssign());
            else if (
              this.options.ecmaVersion >= 6 &&
              (this.tok.type === t.tokTypes.parenL ||
                this.tok.type === t.tokTypes.braceL)
            )
              (x.kind = 'init'),
                (x.method = !0),
                (x.value = this.parseMethod(w, S));
            else if (
              this.options.ecmaVersion >= 5 &&
              x.key.type === 'Identifier' &&
              !x.computed &&
              (x.key.name === 'get' || x.key.name === 'set') &&
              this.tok.type !== t.tokTypes.comma &&
              this.tok.type !== t.tokTypes.braceR &&
              this.tok.type !== t.tokTypes.eq
            )
              (x.kind = x.key.name),
                this.parsePropertyName(x),
                (x.value = this.parseMethod(!1));
            else {
              if (((x.kind = 'init'), this.options.ecmaVersion >= 6))
                if (this.eat(t.tokTypes.eq)) {
                  var U = this.startNodeAt(A);
                  (U.operator = '='),
                    (U.left = x.key),
                    (U.right = this.parseMaybeAssign()),
                    (x.value = this.finishNode(U, 'AssignmentExpression'));
                } else x.value = x.key;
              else x.value = this.dummyIdent();
              x.shorthand = !0;
            }
            p.properties.push(this.finishNode(x, 'Property')),
              this.eat(t.tokTypes.comma);
          }
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR) ||
              ((this.last.end = this.tok.start),
              this.options.locations &&
                (this.last.loc.end = this.tok.loc.start)),
            this.finishNode(p, 'ObjectExpression')
          );
        }),
        (g.parsePropertyName = function (p) {
          if (this.options.ecmaVersion >= 6)
            if (this.eat(t.tokTypes.bracketL)) {
              (p.computed = !0),
                (p.key = this.parseExpression()),
                this.expect(t.tokTypes.bracketR);
              return;
            } else p.computed = !1;
          var h =
            this.tok.type === t.tokTypes.num ||
            this.tok.type === t.tokTypes.string
              ? this.parseExprAtom()
              : this.parseIdent();
          p.key = h || this.dummyIdent();
        }),
        (g.parsePropertyAccessor = function () {
          if (this.tok.type === t.tokTypes.name || this.tok.type.keyword)
            return this.parseIdent();
          if (this.tok.type === t.tokTypes.privateId)
            return this.parsePrivateIdent();
        }),
        (g.parseIdent = function () {
          var p =
            this.tok.type === t.tokTypes.name
              ? this.tok.value
              : this.tok.type.keyword;
          if (!p) return this.dummyIdent();
          this.tok.type.keyword && (this.toks.type = t.tokTypes.name);
          var h = this.startNode();
          return this.next(), (h.name = p), this.finishNode(h, 'Identifier');
        }),
        (g.parsePrivateIdent = function () {
          var p = this.startNode();
          return (
            (p.name = this.tok.value),
            this.next(),
            this.finishNode(p, 'PrivateIdentifier')
          );
        }),
        (g.initFunction = function (p) {
          (p.id = null),
            (p.params = []),
            this.options.ecmaVersion >= 6 &&
              ((p.generator = !1), (p.expression = !1)),
            this.options.ecmaVersion >= 8 && (p.async = !1);
        }),
        (g.toAssignable = function (p, h) {
          if (
            !(
              !p ||
              p.type === 'Identifier' ||
              (p.type === 'MemberExpression' && !h)
            )
          )
            if (p.type === 'ParenthesizedExpression')
              this.toAssignable(p.expression, h);
            else {
              if (this.options.ecmaVersion < 6) return this.dummyIdent();
              if (p.type === 'ObjectExpression') {
                p.type = 'ObjectPattern';
                for (var T = 0, x = p.properties; T < x.length; T += 1) {
                  var w = x[T];
                  this.toAssignable(w, h);
                }
              } else if (p.type === 'ArrayExpression')
                (p.type = 'ArrayPattern'), this.toAssignableList(p.elements, h);
              else if (p.type === 'Property') this.toAssignable(p.value, h);
              else if (p.type === 'SpreadElement')
                (p.type = 'RestElement'), this.toAssignable(p.argument, h);
              else if (p.type === 'AssignmentExpression')
                (p.type = 'AssignmentPattern'), delete p.operator;
              else return this.dummyIdent();
            }
          return p;
        }),
        (g.toAssignableList = function (p, h) {
          for (var T = 0, x = p; T < x.length; T += 1) {
            var w = x[T];
            this.toAssignable(w, h);
          }
          return p;
        }),
        (g.parseFunctionParams = function (p) {
          return (
            (p = this.parseExprList(t.tokTypes.parenR)),
            this.toAssignableList(p, !0)
          );
        }),
        (g.parseMethod = function (p, h) {
          var T = this.startNode(),
            x = this.inAsync,
            w = this.inGenerator,
            S = this.inFunction;
          return (
            this.initFunction(T),
            this.options.ecmaVersion >= 6 && (T.generator = !!p),
            this.options.ecmaVersion >= 8 && (T.async = !!h),
            (this.inAsync = T.async),
            (this.inGenerator = T.generator),
            (this.inFunction = !0),
            (T.params = this.parseFunctionParams()),
            (T.body = this.parseBlock()),
            this.toks.adaptDirectivePrologue(T.body.body),
            (this.inAsync = x),
            (this.inGenerator = w),
            (this.inFunction = S),
            this.finishNode(T, 'FunctionExpression')
          );
        }),
        (g.parseArrowExpression = function (p, h, T) {
          var x = this.inAsync,
            w = this.inGenerator,
            S = this.inFunction;
          return (
            this.initFunction(p),
            this.options.ecmaVersion >= 8 && (p.async = !!T),
            (this.inAsync = p.async),
            (this.inGenerator = !1),
            (this.inFunction = !0),
            (p.params = this.toAssignableList(h, !0)),
            (p.expression = this.tok.type !== t.tokTypes.braceL),
            p.expression
              ? (p.body = this.parseMaybeAssign())
              : ((p.body = this.parseBlock()),
                this.toks.adaptDirectivePrologue(p.body.body)),
            (this.inAsync = x),
            (this.inGenerator = w),
            (this.inFunction = S),
            this.finishNode(p, 'ArrowFunctionExpression')
          );
        }),
        (g.parseExprList = function (p, h) {
          this.pushCx();
          var T = this.curIndent,
            x = this.curLineStart,
            w = [];
          for (this.next(); !this.closes(p, T + 1, x); ) {
            if (this.eat(t.tokTypes.comma)) {
              w.push(h ? null : this.dummyIdent());
              continue;
            }
            var S = this.parseMaybeAssign();
            if (i(S)) {
              if (this.closes(p, T, x)) break;
              this.next();
            } else w.push(S);
            this.eat(t.tokTypes.comma);
          }
          return (
            this.popCx(),
            this.eat(p) ||
              ((this.last.end = this.tok.start),
              this.options.locations &&
                (this.last.loc.end = this.tok.loc.start)),
            w
          );
        }),
        (g.parseAwait = function () {
          var p = this.startNode();
          return (
            this.next(),
            (p.argument = this.parseMaybeUnary()),
            this.finishNode(p, 'AwaitExpression')
          );
        }),
        (t.defaultOptions.tabSize = 4);
      function L(p, h) {
        return a.parse(p, h);
      }
      (e.LooseParser = a), (e.isDummy = i), (e.parse = L);
    });
  });
  var Vo = Li(),
    Ug = Jc(),
    dr = e1(),
    Hg = uf(),
    Tf = df(),
    Os = null;
  function kf() {
    return new Proxy(
      {},
      {
        get: function (e, t) {
          if (t in e) return e[t];
          var s = String(t).split('#'),
            i = s[0],
            r = s[1] || 'default',
            a = {id: i, chunks: [i], name: r, async: !0};
          return (e[t] = a), a;
        },
      }
    );
  }
  var Nc = {};
  function mf(e, t, s) {
    var i = dr.registerServerReference(e, t, s),
      r = t + '#' + s;
    return (Nc[r] = e), i;
  }
  function Wg(e) {
    if (e.indexOf('use client') === -1 && e.indexOf('use server') === -1)
      return null;
    try {
      var t = Tf.parse(e, {ecmaVersion: '2024', sourceType: 'source'}).body;
    } catch {
      return null;
    }
    for (var s = 0; s < t.length; s++) {
      var i = t[s];
      if (i.type !== 'ExpressionStatement' || !i.directive) break;
      if (i.directive === 'use client') return 'use client';
      if (i.directive === 'use server') return 'use server';
    }
    return null;
  }
  function Gg(e) {
    if (e.indexOf('use server') === -1) return e;
    var t;
    try {
      t = Tf.parse(e, {ecmaVersion: '2024', sourceType: 'source'});
    } catch {
      return e;
    }
    var s = [],
      i = 0;
    function r(T, x) {
      if (!(!T || typeof T != 'object')) {
        var w =
          T.type === 'FunctionDeclaration' ||
          T.type === 'FunctionExpression' ||
          T.type === 'ArrowFunctionExpression';
        if (w && x > 0 && T.body && T.body.type === 'BlockStatement')
          for (var S = T.body.body, A = 0; A < S.length; A++) {
            var U = S[A];
            if (U.type !== 'ExpressionStatement') break;
            if (U.directive === 'use server') {
              s.push({
                funcStart: T.start,
                funcEnd: T.end,
                dStart: U.start,
                dEnd: U.end,
                name: T.id ? T.id.name : 'action' + i,
                isDecl: T.type === 'FunctionDeclaration',
              }),
                i++;
              return;
            }
            if (!U.directive) break;
          }
        var M = w ? x + 1 : x;
        for (var c in T)
          if (!(c === 'start' || c === 'end' || c === 'type')) {
            var R = T[c];
            if (Array.isArray(R))
              for (var W = 0; W < R.length; W++)
                R[W] && typeof R[W].type == 'string' && r(R[W], M);
            else R && typeof R.type == 'string' && r(R, M);
          }
      }
    }
    if (
      (t.body.forEach(function (T) {
        r(T, 0);
      }),
      s.length === 0)
    )
      return e;
    s.sort(function (T, x) {
      return x.funcStart - T.funcStart;
    });
    for (var a = e, u = 0; u < s.length; u++) {
      for (
        var d = s[u], y = d.dEnd, g = a.charAt(y);
        y < a.length &&
        (g === ' ' ||
          g ===
            `
` ||
          g === '\r' ||
          g === '	');

      )
        y++, (g = a.charAt(y));
      a = a.slice(0, d.dStart) + a.slice(y);
      var L = y - d.dStart,
        p = d.funcEnd - L,
        h = a.slice(d.funcStart, p);
      d.isDecl
        ? (a =
            a.slice(0, d.funcStart) +
            'var ' +
            d.name +
            ' = __rsa(' +
            h +
            ", '" +
            d.name +
            "');" +
            a.slice(p))
        : (a =
            a.slice(0, d.funcStart) +
            '__rsa(' +
            h +
            ", '" +
            d.name +
            "')" +
            a.slice(p));
    }
    return a;
  }
  function zg(e, t) {
    if (!t.startsWith('.')) return t;
    var s = e.split('/');
    s.pop();
    for (var i = t.split('/'), r = 0; r < i.length; r++)
      if (i[r] !== '.') {
        if (i[r] === '..') {
          s.pop();
          continue;
        }
        s.push(i[r]);
      }
    return s.join('/');
  }
  function Xg(e) {
    Nc = {};
    var t = {react: Vo, 'react/jsx-runtime': Ug},
      s = {},
      i = null;
    if (
      (Object.keys(e).forEach(function (h) {
        if (!i)
          try {
            s[h] = Hg.transform(e[h], {
              transforms: ['jsx', 'imports'],
              jsxRuntime: 'automatic',
              production: !0,
            }).code;
          } catch (T) {
            i = h + ': ' + (T.message || String(T));
          }
      }),
      i)
    )
      return {type: 'error', error: i};
    function r(h, T) {
      if (t[T]) return T;
      if (T.startsWith('.')) {
        var x = zg(h, T);
        if (t[x] || s[x]) return x;
        for (var w = ['.js', '.jsx', '.ts', '.tsx'], S = 0; S < w.length; S++) {
          var A = x + w[S];
          if (t[A] || s[A]) return A;
        }
      }
      return T;
    }
    var a = {},
      u = {};
    function d(h) {
      if (t[h]) return t[h];
      if (!s[h]) throw new Error('Module "' + h + '" not found');
      if (a[h]) return a[h].exports;
      var T = Wg(e[h]);
      if (T === 'use client')
        return (t[h] = dr.createClientModuleProxy(h)), (u[h] = !0), t[h];
      var x = {exports: {}};
      a[h] = x;
      var w = function (c) {
          if (c.endsWith('.css')) return {};
          var R = r(h, c);
          return t[R] ? t[R] : d(R);
        },
        S = s[h];
      if (
        (T !== 'use server' && (S = Gg(S)),
        new Function('module', 'exports', 'require', 'React', '__rsa', S)(
          x,
          x.exports,
          w,
          Vo,
          function (c, R) {
            return mf(c, h, R);
          }
        ),
        (t[h] = x.exports),
        T === 'use server')
      )
        for (var A = Object.keys(x.exports), U = 0; U < A.length; U++) {
          var M = A[U];
          typeof x.exports[M] == 'function' && mf(x.exports[M], h, M);
        }
      return delete a[h], x.exports;
    }
    var y = {exports: {}};
    Object.keys(s).forEach(function (h) {
      d(h),
        (h === '/src/App.js' || h === './App.js' || h === './src/App.js') &&
          (y.exports = t[h]);
    }),
      (Os = {module: y.exports});
    var g = {};
    function L(h) {
      if (!g[h]) {
        g[h] = !0;
        var T = s[h];
        if (T)
          for (
            var x = /require\(["']([^"']+)["']\)/g, w;
            (w = x.exec(T)) !== null;

          ) {
            var S = w[1];
            if (
              !(
                S === 'react' ||
                S === 'react/jsx-runtime' ||
                S === 'react/jsx-dev-runtime' ||
                S.endsWith('.css')
              )
            ) {
              var A = r(h, S);
              s[A] && L(A);
            }
          }
      }
    }
    Object.keys(u).forEach(function (h) {
      L(h);
    });
    var p = {};
    return (
      Object.keys(g).forEach(function (h) {
        p[h] = s[h];
      }),
      {type: 'deployed', compiledClients: p, clientEntries: u}
    );
  }
  function Yg() {
    if (!Os) throw new Error('No code deployed');
    var e = Os.module.default || Os.module,
      t = Vo.createElement(e);
    return dr.renderToReadableStream(t, kf(), {
      onError: function (s) {
        return console.error('[RSC Server Error]', s), msg;
      },
    });
  }
  function Jg(e, t) {
    if (!Os) throw new Error('No code deployed');
    var s = Nc[e];
    if (!s) throw new Error('Action "' + e + '" not found');
    var i = t;
    if (typeof t != 'string' && t && t.__formData) {
      i = new FormData();
      for (var r = 0; r < t.__formData.length; r++)
        i.append(t.__formData[r][0], t.__formData[r][1]);
    }
    return Promise.resolve(dr.decodeReply(i)).then(function (a) {
      var u = Promise.resolve(s.apply(null, a));
      return u.then(function () {
        var d = Os.module.default || Os.module;
        return dr.renderToReadableStream(
          {root: Vo.createElement(d), returnValue: u},
          kf(),
          {
            onError: function (y) {
              return console.error('[RSC Server Error]', y), msg;
            },
          }
        );
      });
    });
  }
  function yf(e, t) {
    var s = t.getReader();
    function i() {
      return s.read().then(function (r) {
        if (r.done) {
          self.postMessage({type: 'rsc-chunk', requestId: e, done: !0});
          return;
        }
        return (
          self.postMessage(
            {type: 'rsc-chunk', requestId: e, done: !1, chunk: r.value},
            [r.value.buffer]
          ),
          i()
        );
      });
    }
    i().catch(function (r) {
      self.postMessage({type: 'rsc-error', requestId: e, error: String(r)});
    });
  }
  self.onmessage = function (e) {
    var t = e.data;
    if (t.type === 'deploy')
      try {
        var s = Xg(t.files);
        s && s.type === 'error'
          ? self.postMessage({type: 'rsc-error', error: s.error})
          : s && self.postMessage({type: 'deploy-result', result: s});
      } catch (r) {
        self.postMessage({type: 'rsc-error', error: String(r)});
      }
    else if (t.type === 'render')
      try {
        var i = Yg();
        Promise.resolve(i)
          .then(function (r) {
            yf(t.requestId, r);
          })
          .catch(function (r) {
            self.postMessage({
              type: 'rsc-error',
              requestId: t.requestId,
              error: String(r),
            });
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
        Jg(t.actionId, t.encodedArgs)
          .then(function (r) {
            yf(t.requestId, r);
          })
          .catch(function (r) {
            self.postMessage({
              type: 'rsc-error',
              requestId: t.requestId,
              error: String(r),
            });
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
