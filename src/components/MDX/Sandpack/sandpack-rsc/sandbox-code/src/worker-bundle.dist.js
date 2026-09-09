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
  var nu = Z((ft) => {
    'use strict';
    var si = {H: null, A: null};
    function ta(e) {
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
    var Yc = Array.isArray,
      na = Symbol.for('react.transitional.element'),
      $f = Symbol.for('react.portal'),
      Kf = Symbol.for('react.fragment'),
      qf = Symbol.for('react.strict_mode'),
      Uf = Symbol.for('react.profiler'),
      Hf = Symbol.for('react.forward_ref'),
      Wf = Symbol.for('react.suspense'),
      Gf = Symbol.for('react.memo'),
      eu = Symbol.for('react.lazy'),
      Jc = Symbol.iterator;
    function zf(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (Jc && e[Jc]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var tu = Object.prototype.hasOwnProperty,
      Xf = Object.assign;
    function sa(e, t, s, i, r, a) {
      return (
        (s = a.ref),
        {$$typeof: na, type: e, key: t, ref: s !== void 0 ? s : null, props: a}
      );
    }
    function Yf(e, t) {
      return sa(e.type, t, void 0, void 0, void 0, e.props);
    }
    function ia(e) {
      return typeof e == 'object' && e !== null && e.$$typeof === na;
    }
    function Jf(e) {
      var t = {'=': '=0', ':': '=2'};
      return (
        '$' +
        e.replace(/[=:]/g, function (s) {
          return t[s];
        })
      );
    }
    var Qc = /\/+/g;
    function Zo(e, t) {
      return typeof e == 'object' && e !== null && e.key != null
        ? Jf('' + e.key)
        : t.toString(36);
    }
    function Zc() {}
    function Qf(e) {
      switch (e.status) {
        case 'fulfilled':
          return e.value;
        case 'rejected':
          throw e.reason;
        default:
          switch (
            (typeof e.status == 'string'
              ? e.then(Zc, Zc)
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
    function ni(e, t, s, i, r) {
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
              case na:
              case $f:
                u = !0;
                break;
              case eu:
                return (u = e._init), ni(u(e._payload), t, s, i, r);
            }
        }
      if (u)
        return (
          (r = r(e)),
          (u = i === '' ? '.' + Zo(e, 0) : i),
          Yc(r)
            ? ((s = ''),
              u != null && (s = u.replace(Qc, '$&/') + '/'),
              ni(r, t, s, '', function (g) {
                return g;
              }))
            : r != null &&
              (ia(r) &&
                (r = Yf(
                  r,
                  s +
                    (r.key == null || (e && e.key === r.key)
                      ? ''
                      : ('' + r.key).replace(Qc, '$&/') + '/') +
                    u
                )),
              t.push(r)),
          1
        );
      u = 0;
      var d = i === '' ? '.' : i + ':';
      if (Yc(e))
        for (var v = 0; v < e.length; v++)
          (i = e[v]), (a = d + Zo(i, v)), (u += ni(i, t, s, a, r));
      else if (((v = zf(e)), typeof v == 'function'))
        for (e = v.call(e), v = 0; !(i = e.next()).done; )
          (i = i.value), (a = d + Zo(i, v++)), (u += ni(i, t, s, a, r));
      else if (a === 'object') {
        if (typeof e.then == 'function') return ni(Qf(e), t, s, i, r);
        throw (
          ((t = String(e)),
          Error(
            ta(
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
    function Ir(e, t, s) {
      if (e == null) return e;
      var i = [],
        r = 0;
      return (
        ni(e, i, '', '', function (a) {
          return t.call(s, a, r++);
        }),
        i
      );
    }
    function Zf(e) {
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
    function ed() {
      return new WeakMap();
    }
    function ea() {
      return {s: 0, v: void 0, o: null, p: null};
    }
    ft.Children = {
      map: Ir,
      forEach: function (e, t, s) {
        Ir(
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
          Ir(e, function () {
            t++;
          }),
          t
        );
      },
      toArray: function (e) {
        return (
          Ir(e, function (t) {
            return t;
          }) || []
        );
      },
      only: function (e) {
        if (!ia(e)) throw Error(ta(143));
        return e;
      },
    };
    ft.Fragment = Kf;
    ft.Profiler = Uf;
    ft.StrictMode = qf;
    ft.Suspense = Wf;
    ft.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = si;
    ft.cache = function (e) {
      return function () {
        var t = si.A;
        if (!t) return e.apply(null, arguments);
        var s = t.getCacheForType(ed);
        (t = s.get(e)), t === void 0 && ((t = ea()), s.set(e, t)), (s = 0);
        for (var i = arguments.length; s < i; s++) {
          var r = arguments[s];
          if (typeof r == 'function' || (typeof r == 'object' && r !== null)) {
            var a = t.o;
            a === null && (t.o = a = new WeakMap()),
              (t = a.get(r)),
              t === void 0 && ((t = ea()), a.set(r, t));
          } else
            (a = t.p),
              a === null && (t.p = a = new Map()),
              (t = a.get(r)),
              t === void 0 && ((t = ea()), a.set(r, t));
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
    ft.cloneElement = function (e, t, s) {
      if (e == null) throw Error(ta(267, e));
      var i = Xf({}, e.props),
        r = e.key,
        a = void 0;
      if (t != null)
        for (u in (t.ref !== void 0 && (a = void 0),
        t.key !== void 0 && (r = '' + t.key),
        t))
          !tu.call(t, u) ||
            u === 'key' ||
            u === '__self' ||
            u === '__source' ||
            (u === 'ref' && t.ref === void 0) ||
            (i[u] = t[u]);
      var u = arguments.length - 2;
      if (u === 1) i.children = s;
      else if (1 < u) {
        for (var d = Array(u), v = 0; v < u; v++) d[v] = arguments[v + 2];
        i.children = d;
      }
      return sa(e.type, r, void 0, void 0, a, i);
    };
    ft.createElement = function (e, t, s) {
      var i,
        r = {},
        a = null;
      if (t != null)
        for (i in (t.key !== void 0 && (a = '' + t.key), t))
          tu.call(t, i) &&
            i !== 'key' &&
            i !== '__self' &&
            i !== '__source' &&
            (r[i] = t[i]);
      var u = arguments.length - 2;
      if (u === 1) r.children = s;
      else if (1 < u) {
        for (var d = Array(u), v = 0; v < u; v++) d[v] = arguments[v + 2];
        r.children = d;
      }
      if (e && e.defaultProps)
        for (i in ((u = e.defaultProps), u)) r[i] === void 0 && (r[i] = u[i]);
      return sa(e, a, void 0, void 0, null, r);
    };
    ft.createRef = function () {
      return {current: null};
    };
    ft.forwardRef = function (e) {
      return {$$typeof: Hf, render: e};
    };
    ft.isValidElement = ia;
    ft.lazy = function (e) {
      return {$$typeof: eu, _payload: {_status: -1, _result: e}, _init: Zf};
    };
    ft.memo = function (e, t) {
      return {$$typeof: Gf, type: e, compare: t === void 0 ? null : t};
    };
    ft.use = function (e) {
      return si.H.use(e);
    };
    ft.useCallback = function (e, t) {
      return si.H.useCallback(e, t);
    };
    ft.useDebugValue = function () {};
    ft.useId = function () {
      return si.H.useId();
    };
    ft.useMemo = function (e, t) {
      return si.H.useMemo(e, t);
    };
    ft.version = '19.0.0';
  });
  var Di = Z((d_, su) => {
    'use strict';
    su.exports = nu();
  });
  var ru = Z((Mi) => {
    'use strict';
    var td = Di(),
      nd = Symbol.for('react.transitional.element'),
      sd = Symbol.for('react.fragment');
    if (!td.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function iu(e, t, s) {
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
        {$$typeof: nd, type: e, key: i, ref: t !== void 0 ? t : null, props: s}
      );
    }
    Mi.Fragment = sd;
    Mi.jsx = iu;
    Mi.jsxDEV = void 0;
    Mi.jsxs = iu;
  });
  var au = Z((T_, ou) => {
    'use strict';
    ou.exports = ru();
  });
  var lu = Z((qn) => {
    'use strict';
    var id = Di();
    function as() {}
    var In = {
      d: {
        f: as,
        r: function () {
          throw Error(
            'Invalid form element. requestFormReset must be passed a form that was rendered by React.'
          );
        },
        D: as,
        C: as,
        L: as,
        m: as,
        X: as,
        S: as,
        M: as,
      },
      p: 0,
      findDOMNode: null,
    };
    if (!id.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE)
      throw Error(
        'The "react" package in this environment is not configured correctly. The "react-server" condition must be enabled in any environment that runs React Server Components.'
      );
    function Er(e, t) {
      if (e === 'font') return '';
      if (typeof t == 'string') return t === 'use-credentials' ? t : '';
    }
    qn.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = In;
    qn.preconnect = function (e, t) {
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
        In.d.C(e, t));
    };
    qn.prefetchDNS = function (e) {
      typeof e == 'string' && In.d.D(e);
    };
    qn.preinit = function (e, t) {
      if (typeof e == 'string' && t && typeof t.as == 'string') {
        var s = t.as,
          i = Er(s, t.crossOrigin),
          r = typeof t.integrity == 'string' ? t.integrity : void 0,
          a = typeof t.fetchPriority == 'string' ? t.fetchPriority : void 0;
        s === 'style'
          ? In.d.S(e, typeof t.precedence == 'string' ? t.precedence : void 0, {
              crossOrigin: i,
              integrity: r,
              fetchPriority: a,
            })
          : s === 'script' &&
            In.d.X(e, {
              crossOrigin: i,
              integrity: r,
              fetchPriority: a,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
      }
    };
    qn.preinitModule = function (e, t) {
      if (typeof e == 'string')
        if (typeof t == 'object' && t !== null) {
          if (t.as == null || t.as === 'script') {
            var s = Er(t.as, t.crossOrigin);
            In.d.M(e, {
              crossOrigin: s,
              integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
              nonce: typeof t.nonce == 'string' ? t.nonce : void 0,
            });
          }
        } else t == null && In.d.M(e);
    };
    qn.preload = function (e, t) {
      if (
        typeof e == 'string' &&
        typeof t == 'object' &&
        t !== null &&
        typeof t.as == 'string'
      ) {
        var s = t.as,
          i = Er(s, t.crossOrigin);
        In.d.L(e, s, {
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
    qn.preloadModule = function (e, t) {
      if (typeof e == 'string')
        if (t) {
          var s = Er(t.as, t.crossOrigin);
          In.d.m(e, {
            as: typeof t.as == 'string' && t.as !== 'script' ? t.as : void 0,
            crossOrigin: s,
            integrity: typeof t.integrity == 'string' ? t.integrity : void 0,
          });
        } else In.d.m(e);
    };
    qn.version = '19.0.0';
  });
  var uu = Z((k_, cu) => {
    'use strict';
    cu.exports = lu();
  });
  var p1 = Z((Nn) => {
    'use strict';
    var rd = uu(),
      od = Di();
    function ce(e) {
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
    var Iu = new MessageChannel(),
      Eu = [];
    Iu.port1.onmessage = function () {
      var e = Eu.shift();
      e && e();
    };
    function Ki(e) {
      Eu.push(e), Iu.port2.postMessage(null);
    }
    function ad(e) {
      setTimeout(function () {
        throw e;
      });
    }
    var ld = Promise,
      Au =
        typeof queueMicrotask == 'function'
          ? queueMicrotask
          : function (e) {
              ld.resolve(null).then(e).catch(ad);
            },
      pn = null,
      hn = 0;
    function Pu(e, t) {
      if (t.byteLength !== 0)
        if (2048 < t.byteLength)
          0 < hn &&
            (e.enqueue(new Uint8Array(pn.buffer, 0, hn)),
            (pn = new Uint8Array(2048)),
            (hn = 0)),
            e.enqueue(t);
        else {
          var s = pn.length - hn;
          s < t.byteLength &&
            (s === 0
              ? e.enqueue(pn)
              : (pn.set(t.subarray(0, s), hn),
                e.enqueue(pn),
                (t = t.subarray(s))),
            (pn = new Uint8Array(2048)),
            (hn = 0)),
            pn.set(t, hn),
            (hn += t.byteLength);
        }
    }
    function Fi(e, t) {
      return Pu(e, t), !0;
    }
    var cd = new TextEncoder();
    function Zt(e) {
      return cd.encode(e);
    }
    function Ta(e) {
      return e.byteLength;
    }
    function Nu(e, t) {
      typeof e.error == 'function' ? e.error(t) : e.close();
    }
    var us = Symbol.for('react.client.reference'),
      Dr = Symbol.for('react.server.reference');
    function ii(e, t, s) {
      return Object.defineProperties(e, {
        $$typeof: {value: us},
        $$id: {value: t},
        $$async: {value: s},
      });
    }
    var ud = Function.prototype.bind,
      pd = Array.prototype.slice;
    function Ru() {
      var e = ud.apply(this, arguments);
      if (this.$$typeof === Dr) {
        var t = pd.call(arguments, 1),
          s = {value: Dr},
          i = {value: this.$$id};
        return (
          (t = {value: this.$$bound ? this.$$bound.concat(t) : t}),
          Object.defineProperties(e, {
            $$typeof: s,
            $$id: i,
            $$bound: t,
            bind: {value: Ru, configurable: !0},
          })
        );
      }
      return e;
    }
    var hd = {
        value: function () {
          return 'function () { [omitted code] }';
        },
        configurable: !0,
        writable: !0,
      },
      fd = Promise.prototype,
      dd = {
        get: function (e, t, s) {
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
              return s;
            case 'then':
              throw Error(ce(590));
          }
          throw Error(ce(591, String(e.name) + '.' + String(t)));
        },
        set: function () {
          throw Error(ce(592));
        },
      };
    function pu(e, t) {
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
            (e.default = ii(
              function () {
                throw Error(ce(593, s));
              },
              e.$$id + '#',
              e.$$async
            )),
            !0
          );
        case 'then':
          if (e.then) return e.then;
          if (e.$$async) return;
          var i = ii({}, e.$$id, !0),
            r = new Proxy(i, Lu);
          return (
            (e.status = 'fulfilled'),
            (e.value = r),
            (e.then = ii(
              function (a) {
                return Promise.resolve(a(r));
              },
              e.$$id + '#then',
              !1
            ))
          );
      }
      if (typeof t == 'symbol') throw Error(ce(594));
      return (
        (i = e[t]),
        i ||
          ((i = ii(
            function () {
              throw Error(ce(595, String(t), String(t)));
            },
            e.$$id + '#' + t,
            e.$$async
          )),
          Object.defineProperty(i, 'name', {value: t}),
          (i = e[t] = new Proxy(i, dd))),
        i
      );
    }
    var Lu = {
        get: function (e, t) {
          return pu(e, t);
        },
        getOwnPropertyDescriptor: function (e, t) {
          var s = Object.getOwnPropertyDescriptor(e, t);
          return (
            s ||
              ((s = {
                value: pu(e, t),
                writable: !1,
                configurable: !1,
                enumerable: !1,
              }),
              Object.defineProperty(e, t, s)),
            s
          );
        },
        getPrototypeOf: function () {
          return fd;
        },
        set: function () {
          throw Error(ce(592));
        },
      },
      Ou = rd.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
      Wn = Ou.d;
    Ou.d = {f: Wn.f, r: Wn.r, D: md, C: Td, L: Pr, m: Du, X: kd, S: yd, M: vd};
    function md(e) {
      if (typeof e == 'string' && e) {
        var t = it || null;
        if (t) {
          var s = t.hints,
            i = 'D|' + e;
          s.has(i) || (s.add(i), Ht(t, 'D', e));
        } else Wn.D(e);
      }
    }
    function Td(e, t) {
      if (typeof e == 'string') {
        var s = it || null;
        if (s) {
          var i = s.hints,
            r = 'C|' + (t ?? 'null') + '|' + e;
          i.has(r) ||
            (i.add(r),
            typeof t == 'string' ? Ht(s, 'C', [e, t]) : Ht(s, 'C', e));
        } else Wn.C(e, t);
      }
    }
    function Pr(e, t, s) {
      if (typeof e == 'string') {
        var i = it || null;
        if (i) {
          var r = i.hints,
            a = 'L';
          if (t === 'image' && s) {
            var u = s.imageSrcSet,
              d = s.imageSizes,
              v = '';
            typeof u == 'string' && u !== ''
              ? ((v += '[' + u + ']'),
                typeof d == 'string' && (v += '[' + d + ']'))
              : (v += '[][]' + e),
              (a += '[image]' + v);
          } else a += '[' + t + ']' + e;
          r.has(a) ||
            (r.add(a),
            (s = Ui(s)) ? Ht(i, 'L', [e, t, s]) : Ht(i, 'L', [e, t]));
        } else Wn.L(e, t, s);
      }
    }
    function Du(e, t) {
      if (typeof e == 'string') {
        var s = it || null;
        if (s) {
          var i = s.hints,
            r = 'm|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = Ui(t)) ? Ht(s, 'm', [e, t]) : Ht(s, 'm', e));
        }
        Wn.m(e, t);
      }
    }
    function yd(e, t, s) {
      if (typeof e == 'string') {
        var i = it || null;
        if (i) {
          var r = i.hints,
            a = 'S|' + e;
          return r.has(a)
            ? void 0
            : (r.add(a),
              (s = Ui(s))
                ? Ht(i, 'S', [e, typeof t == 'string' ? t : 0, s])
                : typeof t == 'string'
                ? Ht(i, 'S', [e, t])
                : Ht(i, 'S', e));
        }
        Wn.S(e, t, s);
      }
    }
    function kd(e, t) {
      if (typeof e == 'string') {
        var s = it || null;
        if (s) {
          var i = s.hints,
            r = 'X|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = Ui(t)) ? Ht(s, 'X', [e, t]) : Ht(s, 'X', e));
        }
        Wn.X(e, t);
      }
    }
    function vd(e, t) {
      if (typeof e == 'string') {
        var s = it || null;
        if (s) {
          var i = s.hints,
            r = 'M|' + e;
          return i.has(r)
            ? void 0
            : (i.add(r), (t = Ui(t)) ? Ht(s, 'M', [e, t]) : Ht(s, 'M', e));
        }
        Wn.M(e, t);
      }
    }
    function Ui(e) {
      if (e == null) return null;
      var t = !1,
        s = {},
        i;
      for (i in e) e[i] != null && ((t = !0), (s[i] = e[i]));
      return t ? s : null;
    }
    function xd(e, t, s) {
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
            Pr(t || '', 'image', {
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
                Pr(i, s.as, {
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
                Du(i, {
                  as: s.as,
                  crossOrigin: s.crossOrigin,
                  integrity: s.integrity,
                  nonce: s.nonce,
                });
                break;
              case 'stylesheet':
                Pr(i, 'style', {
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
    var ya = Symbol.for('react.temporary.reference'),
      gd = {
        get: function (e, t, s) {
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
              return s;
            case 'then':
              return;
          }
          throw Error(ce(514, String(t)));
        },
        set: function () {
          throw Error(ce(515));
        },
      };
    function _d(e, t) {
      var s = Object.defineProperties(
        function () {
          throw Error(ce(516));
        },
        {$$typeof: {value: ya}}
      );
      return (s = new Proxy(s, gd)), e.set(s, t), s;
    }
    var bd = Symbol.for('react.element'),
      En = Symbol.for('react.transitional.element'),
      ka = Symbol.for('react.fragment'),
      hu = Symbol.for('react.context'),
      Mu = Symbol.for('react.forward_ref'),
      Cd = Symbol.for('react.suspense'),
      wd = Symbol.for('react.suspense_list'),
      Fu = Symbol.for('react.memo'),
      Hi = Symbol.for('react.lazy'),
      Sd = Symbol.for('react.memo_cache_sentinel'),
      Id = Symbol.for('react.view_transition'),
      fu = Symbol.iterator;
    function Bu(e) {
      return e === null || typeof e != 'object'
        ? null
        : ((e = (fu && e[fu]) || e['@@iterator']),
          typeof e == 'function' ? e : null);
    }
    var As = Symbol.asyncIterator,
      ri = Symbol.for('react.optimistic_key');
    function An() {}
    var va = Error(ce(460));
    function Ed(e, t, s) {
      switch (
        ((s = e[s]),
        s === void 0 ? e.push(t) : s !== t && (t.then(An, An), (t = s)),
        t.status)
      ) {
        case 'fulfilled':
          return t.value;
        case 'rejected':
          throw (
            ((e = t.reason),
            e === void 0 && !('reason' in t) ? Error(ce(600)) : e)
          );
        default:
          switch (
            (typeof t.status == 'string'
              ? t.then(An, An)
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
          throw ((Nr = t), va);
      }
    }
    var Nr = null;
    function Vu() {
      if (Nr === null) throw Error(ce(459));
      var e = Nr;
      return (Nr = null), e;
    }
    var Vi = null,
      oa = 0,
      oi = null;
    function ju() {
      var e = oi || [];
      return (oi = null), e;
    }
    var Ad = {
      readContext: aa,
      use: Rd,
      useCallback: function (e) {
        return e;
      },
      useContext: aa,
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
      useId: Nd,
      useHostTransitionStatus: Vt,
      useFormState: Vt,
      useActionState: Vt,
      useOptimistic: Vt,
      useMemoCache: function (e) {
        for (var t = Array(e), s = 0; s < e; s++) t[s] = Sd;
        return t;
      },
      useCacheRefresh: function () {
        return Pd;
      },
      useEffectEvent: Vt,
    };
    function Vt() {
      throw Error(ce(373));
    }
    function Pd() {
      throw Error(ce(384));
    }
    function aa() {
      throw Error(ce(502));
    }
    function Nd() {
      if (Vi === null) throw Error(ce(433));
      var e = Vi.identifierCount++;
      return '_' + Vi.identifierPrefix + 'S_' + e.toString(32) + '_';
    }
    function Rd(e) {
      if ((e !== null && typeof e == 'object') || typeof e == 'function') {
        if (typeof e.then == 'function') {
          var t = oa;
          return (oa += 1), oi === null && (oi = []), Ed(oi, e, t);
        }
        e.$$typeof === hu && aa();
      }
      throw e.$$typeof === us
        ? e.value != null && e.value.$$typeof === hu
          ? Error(ce(502))
          : Error(ce(503))
        : Error(ce(438, String(e)));
    }
    var du = {
        getCacheForType: function (e) {
          var t = (t = it || null) ? t.cache : new Map(),
            s = t.get(e);
          return s === void 0 && ((s = e()), t.set(e, s)), s;
        },
        cacheSignal: function () {
          var e = it || null;
          return e ? e.cacheController.signal : null;
        },
      },
      Ps = od.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    if (!Ps) throw Error(ce(492));
    var en = Array.isArray,
      Ns = Object.getPrototypeOf;
    function $u(e) {
      return (e = Object.prototype.toString.call(e)), e.slice(8, e.length - 1);
    }
    function mu(e) {
      switch (typeof e) {
        case 'string':
          return JSON.stringify(10 >= e.length ? e : e.slice(0, 10) + '...');
        case 'object':
          return en(e)
            ? '[...]'
            : e !== null && e.$$typeof === la
            ? 'client'
            : ((e = $u(e)), e === 'Object' ? '{...}' : e);
        case 'function':
          return e.$$typeof === la
            ? 'client'
            : (e = e.displayName || e.name)
            ? 'function ' + e
            : 'function';
        default:
          return String(e);
      }
    }
    function Rr(e) {
      if (typeof e == 'string') return e;
      switch (e) {
        case Cd:
          return 'Suspense';
        case wd:
          return 'SuspenseList';
        case Id:
          return 'ViewTransition';
      }
      if (typeof e == 'object')
        switch (e.$$typeof) {
          case Mu:
            return Rr(e.render);
          case Fu:
            return Rr(e.type);
          case Hi:
            var t = e._payload;
            e = e._init;
            try {
              return Rr(e(t));
            } catch {}
        }
      return '';
    }
    var la = Symbol.for('react.client.reference');
    function Ss(e, t) {
      var s = $u(e);
      if (s !== 'Object' && s !== 'Array') return s;
      s = -1;
      var i = 0;
      if (en(e)) {
        for (var r = '[', a = 0; a < e.length; a++) {
          0 < a && (r += ', ');
          var u = e[a];
          (u = typeof u == 'object' && u !== null ? Ss(u) : mu(u)),
            '' + a === t
              ? ((s = r.length), (i = u.length), (r += u))
              : (r =
                  10 > u.length && 40 > r.length + u.length
                    ? r + u
                    : r + '...');
        }
        r += ']';
      } else if (e.$$typeof === En) r = '<' + Rr(e.type) + '/>';
      else {
        if (e.$$typeof === la) return 'client';
        for (r = '{', a = Object.keys(e), u = 0; u < a.length; u++) {
          0 < u && (r += ', ');
          var d = a[u],
            v = JSON.stringify(d);
          (r += ('"' + d + '"' === v ? d : v) + ': '),
            (v = e[d]),
            (v = typeof v == 'object' && v !== null ? Ss(v) : mu(v)),
            d === t
              ? ((s = r.length), (i = v.length), (r += v))
              : (r =
                  10 > v.length && 40 > r.length + v.length
                    ? r + v
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
    var Wi = Object.prototype.hasOwnProperty,
      ca = Object.prototype,
      Gn = JSON.stringify,
      xa = Symbol();
    function Ld(e) {
      console.error(e);
    }
    function Ku(e, t, s, i, r, a, u, d) {
      if (Ps.A !== null && Ps.A !== du) throw Error(ce(458));
      Ps.A = du;
      var v = new Set(),
        g = [],
        O = new Set();
      (this.type = e),
        (this.status = 10),
        (this.flushScheduled = !1),
        (this.destination = this.fatalError = null),
        (this.bundlerConfig = s),
        (this.cache = new Map()),
        (this.cacheController = new AbortController()),
        (this.pendingChunks = this.nextChunkId = 0),
        (this.hints = O),
        (this.abortableTasks = v),
        (this.pingedTasks = g),
        (this.completedImportChunks = []),
        (this.completedHintChunks = []),
        (this.completedRegularChunks = []),
        (this.completedErrorChunks = []),
        (this.writtenSymbols = new Map()),
        (this.writtenClientReferences = new Map()),
        (this.writtenServerReferences = new Map()),
        (this.writtenObjects = new WeakMap()),
        (this.writtenImportStrings = new Map()),
        (this.writtenImportStringsSize = 0),
        (this.temporaryReferences = d),
        (this.identifierPrefix = u || ''),
        (this.identifierCount = 1),
        (this.taintCleanupQueue = []),
        (this.onError = i === void 0 ? Ld : i),
        (this.onAllReady = r),
        (this.onFatalError = a),
        (e = Pn(this, t, null, !1, 0, v)),
        g.push(e);
    }
    var it = null;
    function Tu(e, t, s) {
      switch (s.status) {
        case 'fulfilled':
          return (
            (t = Pn(
              e,
              s,
              t.keyPath,
              t.implicitSlot,
              t.formatContext,
              e.abortableTasks
            )),
            (t.model = s.value),
            qi(e, t),
            t.id
          );
        case 'rejected':
          return (
            (t = Pn(
              e,
              s,
              t.keyPath,
              t.implicitSlot,
              t.formatContext,
              e.abortableTasks
            )),
            Xn(e, t, s.reason),
            t.id
          );
        default:
          var i = Pn(
            e,
            s,
            t.keyPath,
            t.implicitSlot,
            t.formatContext,
            e.abortableTasks
          );
          return e.status === 12
            ? (e.abortableTasks.delete(i),
              e.type === 21
                ? (ai(i), li(i, e))
                : ((t = e.fatalError), _a(i), ba(i, e, t)),
              i.id)
            : (typeof s.status != 'string' &&
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
                )),
              s.then(
                function (r) {
                  (i.model = r), qi(e, i);
                },
                function (r) {
                  i.status === 0 && (Xn(e, i, r), fn(e));
                }
              ),
              i.id);
      }
    }
    function Od(e, t, s) {
      function i(O) {
        if (g.status === 0)
          if (O.done)
            (g.status = 1),
              (O =
                g.id.toString(16) +
                `:C
`),
              e.completedRegularChunks.push(Zt(O)),
              e.abortableTasks.delete(g),
              e.cacheController.signal.removeEventListener('abort', a),
              fn(e),
              Vr(e);
          else
            try {
              e.pendingChunks++,
                (g.model = O.value),
                d ? jt(e, g.id, 'b', g.model, !1) : zu(e, g),
                fn(e),
                v.read().then(i, r);
            } catch (p) {
              r(p);
            }
      }
      function r(O) {
        g.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', a),
          Xn(e, g, O),
          fn(e),
          v.cancel(O).then(r, r));
      }
      function a() {
        if (g.status === 0) {
          var O = e.cacheController.signal;
          O.removeEventListener('abort', a),
            (O = O.reason),
            e.type === 21
              ? (e.abortableTasks.delete(g), ai(g), li(g, e))
              : (Xn(e, g, O), fn(e)),
            v.cancel(O).then(r, r);
        }
      }
      var u = s.supportsBYOB;
      if (u === void 0)
        try {
          s.getReader({mode: 'byob'}).releaseLock(), (u = !0);
        } catch {
          u = !1;
        }
      var d = u,
        v = s.getReader(),
        g = Pn(
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
          g.id.toString(16) +
          ':' +
          (d ? 'r' : 'R') +
          `
`),
        e.completedRegularChunks.push(Zt(t)),
        e.cacheController.signal.addEventListener('abort', a),
        v.read().then(i, r),
        gt(g.id)
      );
    }
    function Dd(e, t, s, i) {
      function r(v) {
        if (d.status === 0)
          if (v.done) {
            if (((d.status = 1), v.value === void 0))
              var g =
                d.id.toString(16) +
                `:C
`;
            else
              try {
                var O = Is(e, v.value, 0);
                g =
                  d.id.toString(16) +
                  ':C' +
                  Gn(gt(O)) +
                  `
`;
              } catch (p) {
                a(p);
                return;
              }
            e.completedRegularChunks.push(Zt(g)),
              e.abortableTasks.delete(d),
              e.cacheController.signal.removeEventListener('abort', u),
              fn(e),
              Vr(e);
          } else
            try {
              (d.model = v.value),
                e.pendingChunks++,
                zu(e, d),
                fn(e),
                i.next().then(r, a);
            } catch (p) {
              a(p);
            }
      }
      function a(v) {
        d.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', u),
          Xn(e, d, v),
          fn(e),
          typeof i.throw == 'function' && i.throw(v).then(An, An));
      }
      function u() {
        if (d.status === 0) {
          var v = e.cacheController.signal;
          v.removeEventListener('abort', u);
          var g = v.reason;
          e.type === 21
            ? (e.abortableTasks.delete(d), ai(d), li(d, e))
            : (Xn(e, d, v.reason), fn(e)),
            typeof i.throw == 'function' && i.throw(g).then(An, An);
        }
      }
      s = s === i;
      var d = Pn(
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
        e.completedRegularChunks.push(Zt(t)),
        e.cacheController.signal.addEventListener('abort', u),
        i.next().then(r, a),
        gt(d.id)
      );
    }
    function Ht(e, t, s) {
      (s = Gn(s)),
        (t = Zt(
          ':H' +
            t +
            s +
            `
`
        )),
        e.completedHintChunks.push(t),
        fn(e);
    }
    function Md(e) {
      if (e.status === 'fulfilled') return e.value;
      throw e.status === 'rejected' ? e.reason : e;
    }
    function Fd(e, t, s) {
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
      return {$$typeof: Hi, _payload: s, _init: Md};
    }
    function yu() {}
    function Bd(e, t, s, i) {
      if (typeof i != 'object' || i === null || i.$$typeof === us) return i;
      if (typeof i.then == 'function') return Fd(e, t, i);
      var r = Bu(i);
      return r
        ? ((e = {}),
          (e[Symbol.iterator] = function () {
            return r.call(i);
          }),
          e)
        : typeof i[As] != 'function' ||
          (typeof ReadableStream == 'function' && i instanceof ReadableStream)
        ? i
        : ((e = {}),
          (e[As] = function () {
            return i[As]();
          }),
          e);
    }
    function ku(e, t, s, i, r) {
      var a = t.thenableState;
      if (
        ((t.thenableState = null),
        (oa = 0),
        (oi = a),
        (r = i(r, void 0)),
        e.status === 12)
      )
        throw (
          (typeof r == 'object' &&
            r !== null &&
            typeof r.then == 'function' &&
            r.$$typeof !== us &&
            r.then(yu, yu),
          null)
        );
      return (
        (r = Bd(e, t, i, r)),
        (i = t.keyPath),
        (a = t.implicitSlot),
        s !== null
          ? (t.keyPath =
              s === ri || i === ri ? ri : i === null ? s : i + ',' + s)
          : i === null && (t.implicitSlot = !0),
        (e = Gi(e, t, ga, '', r)),
        (t.keyPath = i),
        (t.implicitSlot = a),
        e
      );
    }
    function vu(e, t, s) {
      return t.keyPath !== null
        ? ((e = [En, ka, t.keyPath, {children: s}]), t.implicitSlot ? [e] : e)
        : s;
    }
    var cs = 0;
    function xu(e, t) {
      return (
        (t = Pn(
          e,
          t.model,
          t.keyPath,
          t.implicitSlot,
          t.formatContext,
          e.abortableTasks
        )),
        qi(e, t),
        Es(t.id)
      );
    }
    function ua(e, t, s, i, r, a) {
      if (r != null) throw Error(ce(379));
      if (typeof s == 'function' && s.$$typeof !== us && s.$$typeof !== ya)
        return ku(e, t, i, s, a);
      if (s === ka && i === null)
        return (
          (s = t.implicitSlot),
          t.keyPath === null && (t.implicitSlot = !0),
          (a = Gi(e, t, ga, '', a.children)),
          (t.implicitSlot = s),
          a
        );
      if (s != null && typeof s == 'object' && s.$$typeof !== us)
        switch (s.$$typeof) {
          case Hi:
            var u = s._init;
            if (((s = u(s._payload)), e.status === 12)) throw null;
            return ua(e, t, s, i, r, a);
          case Mu:
            return ku(e, t, i, s.render, a);
          case Fu:
            return ua(e, t, s.type, i, r, a);
        }
      else
        typeof s == 'string' &&
          ((r = t.formatContext),
          (u = xd(r, s, a)),
          r !== u && a.children != null && Is(e, a.children, u));
      return (
        (e = i),
        (i = t.keyPath),
        e === null
          ? (e = i)
          : i !== null && (e = i === ri || e === ri ? ri : i + ',' + e),
        (a = [En, s, e, a]),
        (t = t.implicitSlot && e !== null ? [a] : a),
        t
      );
    }
    function qi(e, t) {
      var s = e.pingedTasks;
      s.push(t),
        s.length === 1 &&
          ((e.flushScheduled = e.destination !== null),
          e.type === 21 || e.status === 10
            ? Au(function () {
                return fa(e);
              })
            : Ki(function () {
                return fa(e);
              }));
    }
    function Pn(e, t, s, i, r, a) {
      return Vd(e, e.nextChunkId++, t, s, i, r, a);
    }
    function Vd(e, t, s, i, r, a, u) {
      e.pendingChunks++,
        typeof s != 'object' ||
          s === null ||
          i !== null ||
          r ||
          e.writtenObjects.set(s, gt(t));
      var d = {
        id: t,
        status: 0,
        model: s,
        keyPath: i,
        implicitSlot: r,
        formatContext: a,
        ping: function () {
          return qi(e, d);
        },
        thenableState: null,
      };
      return u.add(d), d;
    }
    function pa(e, t, s, i, r) {
      var a = r;
      r !== null &&
        typeof r == 'object' &&
        typeof r.toJSON == 'function' &&
        (a = r.toJSON(i)),
        (cs += i.length),
        (r = t.keyPath);
      var u = t.implicitSlot;
      try {
        var d = Gi(e, t, s, i, a);
      } catch (g) {
        (s = t.model),
          (s =
            typeof s == 'object' &&
            s !== null &&
            (s.$$typeof === En || s.$$typeof === Hi)),
          e.status === 12
            ? ((t.status = 3),
              e.type === 21
                ? ((r = e.nextChunkId++), (r = s ? Es(r) : gt(r)), (d = r))
                : ((r = e.fatalError), (d = s ? Es(r) : gt(r))))
            : ((i = g === va ? Vu() : g),
              typeof i == 'object' && i !== null && typeof i.then == 'function'
                ? ((a = Pn(
                    e,
                    t.model,
                    t.keyPath,
                    t.implicitSlot,
                    t.formatContext,
                    e.abortableTasks
                  )),
                  (d = a.ping),
                  i.then(d, d),
                  (a.thenableState = ju()),
                  (t.keyPath = r),
                  (t.implicitSlot = u),
                  (d = s ? Es(a.id) : gt(a.id)))
                : ((t.keyPath = r),
                  (t.implicitSlot = u),
                  e.pendingChunks++,
                  (r = e.nextChunkId++),
                  (u = zn(e, i, t)),
                  Br(e, r, u),
                  (d = s ? Es(r) : gt(r))));
      }
      if (((r = d), r === null || typeof r != 'object')) return r;
      if (en(r)) {
        var v = [];
        for (u = 0; u < r.length; u++) v[u] = pa(e, t, r, '' + u, r[u]);
        return v;
      }
      u = {};
      for (v in r)
        Wi.call(r, v) &&
          ((s = pa(e, t, r, v, r[v])),
          v === '__proto__'
            ? Object.defineProperty(u, v, {
                value: s,
                enumerable: !0,
                writable: !0,
                configurable: !0,
              })
            : (u[v] = s));
      return u;
    }
    function gt(e) {
      return '$' + e.toString(16);
    }
    function Es(e) {
      return '$L' + e.toString(16);
    }
    function qu(e, t, s) {
      return (
        (e = Gn(s)),
        (t =
          t.toString(16) +
          ':' +
          e +
          `
`),
        Zt(t)
      );
    }
    function gu(e, t, s, i) {
      var r = i.$$async ? i.$$id + '#async' : i.$$id,
        a = e.writtenClientReferences,
        u = a.get(r);
      if (u !== void 0) return t[0] === En && s === '1' ? Es(u) : gt(u);
      try {
        var d = e.bundlerConfig,
          v = i.$$id;
        u = '';
        var g = d[v];
        if (g) u = g.name;
        else {
          var O = v.lastIndexOf('#');
          if ((O !== -1 && ((u = v.slice(O + 1)), (g = d[v.slice(0, O)])), !g))
            throw Error(ce(596, v));
        }
        if (g.async === !0 && i.$$async === !0) throw Error(ce(597, v));
        var p =
            g.async === !0 || i.$$async === !0
              ? [g.id, g.chunks, u, 1]
              : [g.id, g.chunks, u],
          f = ha(e, p, 0);
        if (f !== Un) var T = Gn(f);
        else
          e: {
            (i = Or), (Or = e);
            try {
              T = Gn(p, $d);
              break e;
            } finally {
              Or = i;
            }
            T = void 0;
          }
        var x = T;
        e.pendingChunks++;
        var w = e.nextChunkId++,
          S =
            w.toString(16) +
            ':I' +
            x +
            `
`,
          A = Zt(S);
        return (
          e.completedImportChunks.push(A),
          a.set(r, w),
          t[0] === En && s === '1' ? Es(w) : gt(w)
        );
      } catch (q) {
        return (
          e.pendingChunks++,
          (t = e.nextChunkId++),
          (s = zn(e, q, null)),
          Br(e, t, s),
          gt(t)
        );
      }
    }
    function Is(e, t, s) {
      return (t = Pn(e, t, null, !1, s, e.abortableTasks)), Gu(e, t), t.id;
    }
    function Jt(e, t, s) {
      e.pendingChunks++;
      var i = e.nextChunkId++;
      return jt(e, i, t, s, !1), gt(i);
    }
    function jd(e, t) {
      function s(v) {
        if (u.status === 0)
          if (v.done)
            e.cacheController.signal.removeEventListener('abort', r), qi(e, u);
          else return a.push(v.value), d.read().then(s).catch(i);
      }
      function i(v) {
        u.status === 0 &&
          (e.cacheController.signal.removeEventListener('abort', r),
          Xn(e, u, v),
          fn(e),
          d.cancel(v).then(i, i));
      }
      function r() {
        if (u.status === 0) {
          var v = e.cacheController.signal;
          v.removeEventListener('abort', r),
            (v = v.reason),
            e.type === 21
              ? (e.abortableTasks.delete(u), ai(u), li(u, e))
              : (Xn(e, u, v), fn(e)),
            d.cancel(v).then(i, i);
        }
      }
      var a = [t.type],
        u = Pn(e, a, null, !1, 0, e.abortableTasks),
        d = t.stream().getReader();
      return (
        e.cacheController.signal.addEventListener('abort', r),
        d.read().then(s).catch(i),
        '$B' + u.id.toString(16)
      );
    }
    function ji(e) {
      return e[0] === '$' ? '$' + e : e;
    }
    function Lr(e, t) {
      if (16 > t.length) return ji(t);
      var s = e.writtenImportStrings,
        i = s.get(t);
      if (i !== void 0) return i;
      if (((i = e.writtenImportStringsSize + t.length), 32768 < i))
        return ji(t);
      (e.writtenImportStringsSize = i),
        e.pendingChunks++,
        (i = e.nextChunkId++);
      var r = Gn(ji(t));
      return (
        e.completedImportChunks.push(
          Zt(
            i.toString(16) +
              ':' +
              r +
              `
`
          )
        ),
        (e = gt(i)),
        s.set(t, e),
        e
      );
    }
    var ls = !1;
    function Gi(e, t, s, i, r) {
      if (((t.model = r), r === En)) return '$';
      if (r === null) return null;
      if (typeof r == 'object') {
        switch (r.$$typeof) {
          case En:
            var a = null,
              u = e.writtenObjects;
            if (t.keyPath === null && !t.implicitSlot) {
              var d = u.get(r);
              if (d !== void 0)
                if (ls === r) ls = null;
                else return d;
              else
                i.indexOf(':') === -1 &&
                  ((s = u.get(s)),
                  s !== void 0 && ((a = s + ':' + i), u.set(r, a)));
            }
            return 3200 < cs
              ? xu(e, t)
              : ((i = r.props),
                (s = i.ref),
                (e = ua(e, t, r.type, r.key, s !== void 0 ? s : null, i)),
                typeof e == 'object' &&
                  e !== null &&
                  a !== null &&
                  (u.has(e) || u.set(e, a)),
                e);
          case Hi:
            if (3200 < cs) return xu(e, t);
            if (
              ((t.thenableState = null),
              (a = r._init),
              (r = a(r._payload)),
              e.status === 12)
            )
              throw null;
            return Gi(e, t, s, i, r);
          case bd:
            throw Error(ce(525));
        }
        if (r.$$typeof === us) return gu(e, s, i, r);
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
              return '$@' + Tu(e, t, r).toString(16);
            if (ls === r) ls = null;
            else return u;
          }
          return (e = '$@' + Tu(e, t, r).toString(16)), a.set(r, e), e;
        }
        if (u !== void 0)
          if (ls === r) {
            if (u !== gt(t.id)) return u;
            ls = null;
          } else return u;
        else if (i.indexOf(':') === -1 && ((u = a.get(s)), u !== void 0)) {
          if (((d = i), en(s) && s[0] === En))
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
        if (en(r)) return vu(e, t, r);
        if (r instanceof Map)
          return (r = Array.from(r)), '$Q' + Is(e, r, 0).toString(16);
        if (r instanceof Set)
          return (r = Array.from(r)), '$W' + Is(e, r, 0).toString(16);
        if (typeof FormData == 'function' && r instanceof FormData)
          return (r = Array.from(r.entries())), '$K' + Is(e, r, 0).toString(16);
        if (r instanceof Error) return '$Z';
        if (r instanceof ArrayBuffer) return Jt(e, 'A', new Uint8Array(r));
        if (r instanceof Int8Array) return Jt(e, 'O', r);
        if (r instanceof Uint8Array) return Jt(e, 'o', r);
        if (r instanceof Uint8ClampedArray) return Jt(e, 'U', r);
        if (r instanceof Int16Array) return Jt(e, 'S', r);
        if (r instanceof Uint16Array) return Jt(e, 's', r);
        if (r instanceof Int32Array) return Jt(e, 'L', r);
        if (r instanceof Uint32Array) return Jt(e, 'l', r);
        if (r instanceof Float32Array) return Jt(e, 'G', r);
        if (r instanceof Float64Array) return Jt(e, 'g', r);
        if (r instanceof BigInt64Array) return Jt(e, 'M', r);
        if (r instanceof BigUint64Array) return Jt(e, 'm', r);
        if (r instanceof DataView) return Jt(e, 'V', r);
        if (typeof Blob == 'function' && r instanceof Blob) return jd(e, r);
        if ((a = Bu(r)))
          return (
            (i = a.call(r)),
            i === r
              ? ((r = Array.from(i)), '$i' + Is(e, r, 0).toString(16))
              : vu(e, t, Array.from(i))
          );
        if (typeof ReadableStream == 'function' && r instanceof ReadableStream)
          return Od(e, t, r);
        if (((a = r[As]), typeof a == 'function'))
          return (
            t.keyPath !== null
              ? ((e = [En, ka, t.keyPath, {children: r}]),
                (e = t.implicitSlot ? [e] : e))
              : ((i = a.call(r)), (e = Dd(e, t, r, i))),
            e
          );
        if (r instanceof Date) return '$D' + r.toJSON();
        if (((e = Ns(r)), e !== ca && (e === null || Ns(e) !== null)))
          throw Error(ce(498, Ss(s, i)));
        return r;
      }
      if (typeof r == 'string')
        return (
          (cs += r.length),
          r[r.length - 1] === 'Z' && s[i] instanceof Date
            ? '$D' + r
            : 1024 <= r.length && Ta !== null
            ? (e.pendingChunks++, (t = e.nextChunkId++), Hu(e, t, r, !1), gt(t))
            : ji(r)
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
        if (r.$$typeof === us) return gu(e, s, i, r);
        if (r.$$typeof === Dr)
          return (
            (t = e.writtenServerReferences),
            (i = t.get(r)),
            i !== void 0
              ? (e = '$h' + i.toString(16))
              : ((i = r.$$bound),
                (i = i === null ? null : Promise.resolve(i)),
                (e = Is(e, {id: r.$$id, bound: i}, 0)),
                t.set(r, e),
                (e = '$h' + e.toString(16))),
            e
          );
        if (
          e.temporaryReferences !== void 0 &&
          ((e = e.temporaryReferences.get(r)), e !== void 0)
        )
          return '$T' + e;
        throw r.$$typeof === ya
          ? Error(ce(526))
          : /^on[A-Z]/.test(i)
          ? Error(ce(374, Ss(s, i)))
          : Error(ce(375, Ss(s, i)));
      }
      if (typeof r == 'symbol') {
        if (((t = e.writtenSymbols), (a = t.get(r)), a !== void 0))
          return gt(a);
        if (((a = r.description), Symbol.for(a) !== r))
          throw Error(ce(376, r.description, Ss(s, i)));
        return (
          e.pendingChunks++,
          (i = e.nextChunkId++),
          (s = qu(e, i, '$S' + a)),
          e.completedImportChunks.push(s),
          t.set(r, i),
          gt(i)
        );
      }
      if (typeof r == 'bigint') return '$n' + r.toString(10);
      throw Error(ce(378, typeof r, Ss(s, i)));
    }
    function zn(e, t) {
      var s = it;
      it = null;
      try {
        var i = e.onError,
          r = i(t);
      } finally {
        it = s;
      }
      if (r != null && typeof r != 'string')
        throw Error(
          'onError returned something with a type other than "string". onError should return a string and may return null or undefined but must not return anything else. It received something of type "' +
            typeof r +
            '" instead'
        );
      return r || '';
    }
    function zi(e, t) {
      var s = e.onFatalError;
      s(t),
        e.destination !== null
          ? ((e.status = 14), Nu(e.destination, t))
          : ((e.status = 13), (e.fatalError = t)),
        (t = Error(ce(562), {cause: t})),
        e.cacheController.abort(t);
    }
    function Br(e, t, s) {
      (s = {digest: s}),
        (t =
          t.toString(16) +
          ':E' +
          Gn(s) +
          `
`),
        (t = Zt(t)),
        e.completedErrorChunks.push(t);
    }
    var Or = null;
    function $d(e, t) {
      return typeof t == 'string'
        ? ((e = Or), e === null ? ji(t) : Lr(e, t))
        : t;
    }
    var Un = {};
    function ha(e, t, s) {
      switch (typeof t) {
        case 'string':
          return Lr(e, t);
        case 'number':
        case 'boolean':
        case 'undefined':
          return t;
        case 'object':
          if (t === null) return null;
          if (16 < s || typeof t.toJSON == 'function') return Un;
          if (en(t)) {
            for (var i = t.length, r = Array(i), a = 0; a < i; a++) {
              var u = t[a];
              if (typeof u == 'string') r[a] = Lr(e, u);
              else {
                if (((u = ha(e, u, s + 1)), u === Un)) return Un;
                r[a] = u;
              }
            }
            return r;
          }
          if (((i = Ns(t)), i !== ca && i !== null)) return Un;
          for (i = Object.keys(t), r = {}, a = 0; a < i.length; a++) {
            if (((u = i[a]), u in ca)) return Un;
            var d = t[u];
            if (typeof d == 'string') r[u] = Lr(e, d);
            else {
              if (((d = ha(e, d, s + 1)), d === Un)) return Un;
              r[u] = d;
            }
          }
          return r;
        default:
          return Un;
      }
    }
    function Uu(e, t, s) {
      (t =
        t.toString(16) +
        ':' +
        s +
        `
`),
        (t = Zt(t)),
        e.completedRegularChunks.push(t);
    }
    function jt(e, t, s, i, r) {
      r ? e.pendingDebugChunks++ : e.pendingChunks++,
        (r = new Uint8Array(i.buffer, i.byteOffset, i.byteLength)),
        (i = 2048 < i.byteLength ? r.slice() : r),
        (r = i.byteLength),
        (t = t.toString(16) + ':' + s + r.toString(16) + ','),
        (t = Zt(t)),
        e.completedRegularChunks.push(xa, t, i);
    }
    function Hu(e, t, s, i) {
      if (Ta === null)
        throw Error(
          'Existence of byteLengthOfChunk should have already been checked. This is a bug in React.'
        );
      i ? e.pendingDebugChunks++ : e.pendingChunks++,
        (s = Zt(s)),
        (i = s.byteLength),
        (t = t.toString(16) + ':T' + i.toString(16) + ','),
        (t = Zt(t)),
        e.completedRegularChunks.push(xa, t, s);
    }
    function Wu(e, t, s) {
      var i = t.id;
      typeof s == 'string' && Ta !== null
        ? Hu(e, i, s, !1)
        : s instanceof ArrayBuffer
        ? jt(e, i, 'A', new Uint8Array(s), !1)
        : s instanceof Int8Array
        ? jt(e, i, 'O', s, !1)
        : s instanceof Uint8Array
        ? jt(e, i, 'o', s, !1)
        : s instanceof Uint8ClampedArray
        ? jt(e, i, 'U', s, !1)
        : s instanceof Int16Array
        ? jt(e, i, 'S', s, !1)
        : s instanceof Uint16Array
        ? jt(e, i, 's', s, !1)
        : s instanceof Int32Array
        ? jt(e, i, 'L', s, !1)
        : s instanceof Uint32Array
        ? jt(e, i, 'l', s, !1)
        : s instanceof Float32Array
        ? jt(e, i, 'G', s, !1)
        : s instanceof Float64Array
        ? jt(e, i, 'g', s, !1)
        : s instanceof BigInt64Array
        ? jt(e, i, 'M', s, !1)
        : s instanceof BigUint64Array
        ? jt(e, i, 'm', s, !1)
        : s instanceof DataView
        ? jt(e, i, 'V', s, !1)
        : ((s = pa(e, t, {'': s}, '', s)), (s = Gn(s)), Uu(e, t.id, s));
    }
    function Xn(e, t, s) {
      (t.status = 4),
        (s = zn(e, s, t)),
        Br(e, t.id, s),
        e.abortableTasks.delete(t),
        Vr(e);
    }
    var ga = {};
    function Gu(e, t) {
      if (t.status === 0) {
        t.status = 5;
        var s = cs;
        try {
          ls = t.model;
          var i = Gi(e, t, ga, '', t.model);
          if (
            ((ls = i),
            (t.keyPath = null),
            (t.implicitSlot = !1),
            typeof i == 'object' && i !== null)
          )
            e.writtenObjects.set(i, gt(t.id)), Wu(e, t, i);
          else {
            var r = Gn(i);
            Uu(e, t.id, r);
          }
          (t.status = 1), e.abortableTasks.delete(t), Vr(e);
        } catch (v) {
          if (e.status === 12)
            if ((e.abortableTasks.delete(t), (t.status = 0), e.type === 21))
              ai(t), li(t, e);
            else {
              var a = e.fatalError;
              _a(t), ba(t, e, a);
            }
          else {
            var u = v === va ? Vu() : v;
            if (
              typeof u == 'object' &&
              u !== null &&
              typeof u.then == 'function'
            ) {
              (t.status = 0), (t.thenableState = ju());
              var d = t.ping;
              u.then(d, d);
            } else Xn(e, t, u);
          }
        } finally {
          cs = s;
        }
      }
    }
    function zu(e, t) {
      var s = cs;
      try {
        Wu(e, t, t.model);
      } finally {
        cs = s;
      }
    }
    function fa(e) {
      var t = Ps.H;
      Ps.H = Ad;
      var s = it;
      Vi = it = e;
      try {
        var i = e.pingedTasks;
        e.pingedTasks = [];
        for (var r = 0; r < i.length; r++) Gu(e, i[r]);
        ci(e);
      } catch (a) {
        zn(e, a, null), zi(e, a);
      } finally {
        (Ps.H = t), (Vi = null), (it = s);
      }
    }
    function _a(e) {
      e.status === 0 && (e.status = 3);
    }
    function ba(e, t, s) {
      e.status === 3 &&
        ((s = gt(s)), (e = qu(t, e.id, s)), t.completedErrorChunks.push(e));
    }
    function ai(e) {
      e.status === 0 && (e.status = 3);
    }
    function li(e, t) {
      e.status === 3 && t.pendingChunks--;
    }
    function ci(e) {
      var t = e.destination;
      if (t !== null) {
        (pn = new Uint8Array(2048)), (hn = 0);
        try {
          for (var s = e.completedImportChunks, i = 0; i < s.length; i++)
            e.pendingChunks--, Fi(t, s[i]);
          s.splice(0, i);
          var r = e.completedHintChunks;
          for (i = 0; i < r.length; i++) Fi(t, r[i]);
          r.splice(0, i);
          var a = e.completedRegularChunks;
          for (i = 0; i < a.length; i++) {
            var u = a[i];
            if (((s = void 0), u === xa)) {
              if (i + 2 >= a.length) throw Error(ce(601));
              (e.pendingChunks -= 2),
                Pu(t, a[i + 1]),
                (s = Fi(t, a[i + 2])),
                (i += 2);
            } else e.pendingChunks--, (s = Fi(t, u));
            if (!s) {
              (e.destination = null), i++;
              break;
            }
          }
          a.splice(0, i);
          var d = e.completedErrorChunks;
          for (i = 0; i < d.length; i++) e.pendingChunks--, Fi(t, d[i]);
          d.splice(0, i);
        } finally {
          (e.flushScheduled = !1),
            pn &&
              0 < hn &&
              (t.enqueue(new Uint8Array(pn.buffer, 0, hn)),
              (pn = null),
              (hn = 0));
        }
      }
      e.pendingChunks === 0 &&
        (12 > e.status && ((t = Error(ce(563))), e.cacheController.abort(t)),
        e.destination !== null &&
          ((e.status = 14), e.destination.close(), (e.destination = null)));
    }
    function Xu(e) {
      (e.flushScheduled = e.destination !== null),
        Au(function () {
          return fa(e);
        }),
        Ki(function () {
          e.status === 10 && (e.status = 11);
        });
    }
    function fn(e) {
      e.flushScheduled === !1 &&
        e.pingedTasks.length === 0 &&
        e.destination !== null &&
        ((e.flushScheduled = !0),
        Ki(function () {
          (e.flushScheduled = !1), ci(e);
        }));
    }
    function Vr(e) {
      e.abortableTasks.size === 0 && ((e = e.onAllReady), e());
    }
    function Yu(e, t) {
      if (e.status === 13) (e.status = 14), Nu(t, e.fatalError);
      else if (e.status !== 14 && e.destination === null) {
        e.destination = t;
        try {
          ci(e);
        } catch (s) {
          zn(e, s, null), zi(e, s);
        }
      }
    }
    function Kd(e, t) {
      try {
        t.forEach(function (i) {
          return li(i, e);
        });
        var s = e.onAllReady;
        s(), ci(e);
      } catch (i) {
        zn(e, i, null), zi(e, i);
      }
    }
    function qd(e, t, s) {
      try {
        t.forEach(function (r) {
          return ba(r, e, s);
        });
        var i = e.onAllReady;
        i(), ci(e);
      } catch (r) {
        zn(e, r, null), zi(e, r);
      }
    }
    function Ju(e, t) {
      t.aborted
        ? Mr(e, t.reason)
        : t.addEventListener(
            'abort',
            function () {
              Mr(e, t.reason);
            },
            {signal: e.cacheController.signal}
          );
    }
    function Mr(e, t) {
      if (!(11 < e.status))
        try {
          (e.status = 12), e.cacheController.abort(t);
          var s = e.abortableTasks;
          if (0 < s.size)
            if (e.type === 21)
              s.forEach(function (d) {
                return ai(d, e);
              }),
                Ki(function () {
                  return Kd(e, s);
                });
            else {
              var i =
                  t === void 0
                    ? Error(ce(432))
                    : typeof t == 'object' &&
                      t !== null &&
                      typeof t.then == 'function'
                    ? Error(ce(530))
                    : t,
                r = zn(e, i, null),
                a = e.nextChunkId++;
              (e.fatalError = a),
                e.pendingChunks++,
                Br(e, a, r, i, !1, null),
                s.forEach(function (d) {
                  return _a(d, e, a);
                }),
                Ki(function () {
                  return qd(e, s, a);
                });
            }
          else {
            var u = e.onAllReady;
            u(), ci(e);
          }
        } catch (d) {
          zn(e, d, null), zi(e, d);
        }
    }
    function Qu(e, t) {
      var s = '',
        i = e[t];
      if (i) s = i.name;
      else {
        var r = t.lastIndexOf('#');
        if ((r !== -1 && ((s = t.slice(r + 1)), (i = e[t.slice(0, r)])), !i))
          throw Error(ce(589, t));
      }
      return i.async ? [i.id, i.chunks, s, 1] : [i.id, i.chunks, s];
    }
    var Ar = new Map();
    function _u(e) {
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
    function Ud() {}
    function Zu(e) {
      for (var t = e[1], s = [], i = 0; i < t.length; ) {
        var r = t[i++],
          a = t[i++],
          u = Ar.get(r);
        u === void 0
          ? (e1.set(r, a),
            (a = __webpack_chunk_load__(r)),
            s.push(a),
            (u = Ar.set.bind(Ar, r, null)),
            a.then(u, Ud),
            Ar.set(r, a))
          : u !== null && s.push(u);
      }
      return e.length === 4
        ? s.length === 0
          ? _u(e[0])
          : Promise.all(s).then(function () {
              return _u(e[0]);
            })
        : 0 < s.length
        ? Promise.all(s)
        : null;
    }
    function $i(e) {
      var t = __webpack_require__(e[0]);
      if (e.length === 4 && typeof t.then == 'function')
        if (t.status === 'fulfilled') t = t.value;
        else throw t.reason;
      if (e[2] === '*') return t;
      if (e[2] === '') return t.__esModule ? t.default : t;
      if (Wi.call(t, e[2])) return t[e[2]];
    }
    var e1 = new Map(),
      Hd = __webpack_require__.u;
    __webpack_require__.u = function (e) {
      var t = e1.get(e);
      return t !== void 0 ? t : Hd(e);
    };
    var jr = Symbol();
    function $t(e, t, s) {
      (this.status = e), (this.value = t), (this.reason = s);
    }
    $t.prototype = Object.create(Promise.prototype);
    Object.defineProperty($t.prototype, 'then', {
      writable: !0,
      enumerable: !0,
      configurable: !0,
      value: function (e, t) {
        switch (this.status) {
          case 'resolved_model':
            qr(this);
        }
        switch (this.status) {
          case 'fulfilled':
            if (typeof e == 'function') {
              for (
                var s = this.value, i = 0, r = new Set();
                s instanceof $t;

              ) {
                if ((i++, s === this || r.has(s) || 1e3 < i)) {
                  typeof t == 'function' && t(Error(ce(569)));
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
                (this.reason === null && (this.reason = []),
                this.reason.push(t));
            break;
          default:
            typeof t == 'function' && t(this.reason);
        }
      },
    });
    var t1 = Object.prototype,
      n1 = Array.prototype;
    function $r(e, t, s, i) {
      for (var r = 0; r < t.length; r++) {
        var a = t[r];
        typeof a == 'function' ? a(s) : a1(e, a, s, i.reason);
      }
    }
    function Ca(e, t, s) {
      for (var i = 0; i < t.length; i++) {
        var r = t[i];
        typeof r == 'function' ? r(s) : Fr(e, r.handler, s);
      }
    }
    function Kr(e, t, s) {
      if (t.status !== 'pending' && t.status !== 'blocked') t.reason.error(s);
      else {
        var i = t.reason;
        (t.status = 'rejected'), (t.reason = s), i !== null && Ca(e, i, s);
      }
    }
    function s1(e, t, s) {
      var i = {};
      return new $t('resolved_model', t, ((i.id = s), (i[jr] = e), i));
    }
    function i1(e, t) {
      return new $t('rejected', null, t);
    }
    function r1(e, t, s, i) {
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
          (t.reason = ((s.id = i), (s[jr] = e), s)),
          r !== null)
        )
          switch ((qr(t), t.status)) {
            case 'fulfilled':
              $r(e, r, t.value, t);
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
              a && Ca(e, a, t.reason);
          }
      }
    }
    function bu(e, t, s) {
      var i = {};
      return new $t(
        'resolved_model',
        (s ? '{"done":true,"value":' : '{"done":false,"value":') + t + '}',
        ((i.id = -1), (i[jr] = e), i)
      );
    }
    function ra(e, t, s, i) {
      r1(
        e,
        t,
        (i ? '{"done":true,"value":' : '{"done":false,"value":') + s + '}',
        -1
      );
    }
    function Wd(e, t, s, i) {
      function r(O) {
        var p = d.reason,
          f = d;
        (f.status = 'rejected'),
          (f.value = null),
          (f.reason = O),
          p !== null && Ca(e, p, O),
          Fr(e, g, O);
      }
      var a = t.id;
      if (typeof a != 'string' || i === 'then') return null;
      var u = t.$$promise;
      if (u !== void 0)
        return u.status === 'fulfilled'
          ? ((u = u.value), i === '__proto__' ? null : (s[i] = u))
          : (Je
              ? ((a = Je), a.deps++)
              : (a = Je =
                  {
                    chunk: null,
                    value: null,
                    reason: null,
                    deps: 1,
                    errored: !1,
                  }),
            u.then(ma.bind(null, e, a, s, i), Fr.bind(null, e, a)),
            null);
      var d = new $t('blocked', null, null);
      t.$$promise = d;
      var v = Qu(e._bundlerConfig, a);
      if (((u = t.bound), (a = Zu(v))))
        u instanceof $t && (a = Promise.all([a, u]));
      else if (u instanceof $t) a = Promise.resolve(u);
      else
        return (
          (u = $i(v)),
          (a = d),
          (a.status = 'fulfilled'),
          (a.value = u),
          (a.reason = null),
          u
        );
      if (Je) {
        var g = Je;
        g.deps++;
      } else
        g = Je = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        a.then(function () {
          var O = $i(v);
          if (t.bound) {
            var p = t.bound.value;
            if (((p = en(p) ? p.slice(0) : []), 1e3 < p.length)) {
              r(Error(ce(580, p.length, 1e3)));
              return;
            }
            p.unshift(null), (O = O.bind.apply(O, p));
          }
          p = d.value;
          var f = d;
          (f.status = 'fulfilled'),
            (f.value = O),
            (f.reason = null),
            p !== null && $r(e, p, O, f),
            ma(e, g, s, i, O);
        }, r),
        null
      );
    }
    function da(e, t, s, i, r, a) {
      if (typeof i == 'string') return Jd(e, t, s, i, r, a);
      if (typeof i == 'object' && i !== null)
        if (
          (r !== void 0 &&
            e._temporaryReferences !== void 0 &&
            e._temporaryReferences.set(i, r),
          en(i))
        ) {
          if (a === null) {
            var u = {count: 0, fork: !1};
            e._rootArrayContexts.set(i, u);
          } else u = a;
          for (
            1 < i.length && (u.fork = !0), Hn(u, i.length + 1, e), t = 0;
            t < i.length;
            t++
          )
            i[t] = da(
              e,
              i,
              '' + t,
              i[t],
              r !== void 0 ? r + ':' + t : void 0,
              u
            );
        } else
          for (u in i)
            Wi.call(i, u) &&
              (u === '__proto__'
                ? delete i[u]
                : ((t =
                    r !== void 0 && u.indexOf(':') === -1
                      ? r + ':' + u
                      : void 0),
                  (t = da(e, i, u, i[u], t, null)),
                  t !== void 0 ? (i[u] = t) : delete i[u]));
      return i;
    }
    function Hn(e, t, s) {
      if ((e.count += t) > s._arraySizeLimit && e.fork) throw Error(ce(571));
    }
    var Je = null;
    function qr(e) {
      var t = Je;
      Je = null;
      var s = e.reason,
        i = s[jr];
      (s = s.id), (s = s === -1 ? void 0 : s.toString(16));
      var r = e.value;
      (e.status = 'blocked'), (e.value = null), (e.reason = null);
      try {
        var a = JSON.parse(r);
        r = {count: 0, fork: !1};
        var u = da(i, {'': a}, '', a, s, r),
          d = e.value;
        if (d !== null)
          for (e.value = null, e.reason = null, a = 0; a < d.length; a++) {
            var v = d[a];
            typeof v == 'function' ? v(u) : a1(i, v, u, r);
          }
        if (Je !== null) {
          if (Je.errored) throw Je.reason;
          if (0 < Je.deps) {
            (Je.value = u), (Je.reason = r), (Je.chunk = e);
            return;
          }
        }
        (e.status = 'fulfilled'), (e.value = u), (e.reason = r);
      } catch (g) {
        (e.status = 'rejected'), (e.reason = g);
      } finally {
        Je = t;
      }
    }
    function o1(e, t) {
      (e._closed = !0),
        (e._closedReason = t),
        e._chunks.forEach(function (s) {
          s.status === 'pending'
            ? Kr(e, s, t)
            : s.status === 'fulfilled' &&
              s.reason !== null &&
              ((s = s.reason), typeof s.error == 'function' && s.error(t));
        });
    }
    function Ur(e, t) {
      var s = e._chunks,
        i = s.get(t);
      return (
        i ||
          ((i = e._formData.data.get(e._prefix + t)),
          (i =
            typeof i == 'string'
              ? s1(e, i, t)
              : e._closed
              ? i1(e, e._closedReason)
              : new $t('pending', null, null)),
          s.set(t, i)),
        i
      );
    }
    function a1(e, t, s, i) {
      var r = t.handler,
        a = t.parentObject,
        u = t.key,
        d = t.map,
        v = t.path;
      try {
        for (var g = 0, O = e._rootArrayContexts, p = 1; p < v.length; p++) {
          var f = v[p];
          if (
            typeof s != 'object' ||
            s === null ||
            (Ns(s) !== t1 && Ns(s) !== n1) ||
            !Wi.call(s, f)
          )
            throw Error(ce(570));
          if (((s = s[f]), en(s))) (g = 0), (i = O.get(s) || i);
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
            ? (i.fork && (w.fork = !0), Hn(w, i.count, e))
            : 0 < g && Hn(w, g, e));
      } catch (S) {
        Fr(e, r, S);
        return;
      }
      ma(e, r, a, u, x);
    }
    function ma(e, t, s, i, r) {
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
            i !== null && $r(e, i, t.value, s)));
    }
    function Fr(e, t, s) {
      t.errored ||
        ((t.errored = !0),
        (t.value = null),
        (t.reason = s),
        (t = t.chunk),
        t !== null && t.status === 'blocked' && Kr(e, t, s));
    }
    function Bi(e, t, s, i, r, a) {
      t = t.split(':');
      var u = parseInt(t[0], 16),
        d = Ur(e, u);
      switch (d.status) {
        case 'resolved_model':
          qr(d);
      }
      switch (d.status) {
        case 'fulfilled':
          if (((u = d.value), (d = d.reason), d !== null && 'error' in d))
            throw Error(ce(599));
          for (var v = 0, g = e._rootArrayContexts, O = 1; O < t.length; O++) {
            if (
              ((v = t[O]),
              typeof u != 'object' ||
                u === null ||
                (Ns(u) !== t1 && Ns(u) !== n1) ||
                !Wi.call(u, v))
            )
              throw Error(ce(570));
            (u = u[v]),
              en(u)
                ? ((v = 0), (d = g.get(u) || d))
                : ((d = null),
                  typeof u == 'string'
                    ? (v = u.length)
                    : typeof u == 'bigint'
                    ? ((v = Math.abs(Number(u))),
                      (v = v === 0 ? 1 : Math.floor(Math.log10(v)) + 1))
                    : (v = ArrayBuffer.isView(u) ? u.byteLength : 0));
          }
          return (
            (s = a(e, u, s, i)),
            r !== null &&
              (d !== null
                ? (d.fork && (r.fork = !0), Hn(r, d.count, e))
                : 0 < v && Hn(r, v, e)),
            s
          );
        case 'blocked':
          return (
            Je
              ? ((e = Je), e.deps++)
              : (e = Je =
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
          throw Error(ce(574));
        default:
          return (
            Je
              ? ((Je.errored = !0), (Je.value = null), (Je.reason = d.reason))
              : (Je = {
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
    function Gd(e, t) {
      if (!en(t)) throw Error(ce(575));
      if (t.$$consumed === !0) throw Error(ce(572));
      return (t.$$consumed = !0), new Map(t);
    }
    function zd(e, t) {
      if (!en(t)) throw Error(ce(576));
      if (t.$$consumed === !0) throw Error(ce(573));
      return (t.$$consumed = !0), new Set(t);
    }
    function Xd(e, t) {
      if (!en(t)) throw Error(ce(577));
      if (t.$$consumed === !0) throw Error(ce(578));
      return (t.$$consumed = !0), t[Symbol.iterator]();
    }
    function Yd(e, t, s, i) {
      return i === 'then' && typeof t == 'function' ? null : t;
    }
    function Qt(e, t, s, i, r, a, u) {
      function d(O) {
        if (!g.errored) {
          (g.errored = !0), (g.value = null), (g.reason = O);
          var p = g.chunk;
          p !== null && p.status === 'blocked' && Kr(e, p, O);
        }
      }
      t = parseInt(t.slice(2), 16);
      var v = e._prefix + t;
      if (((i = e._chunks), i.has(t))) throw Error(ce(568));
      if (
        (i.set(t, i1(e, Error(ce(568)))),
        (t = e._formData.data.get(v).arrayBuffer()),
        Je)
      ) {
        var g = Je;
        g.deps++;
      } else
        g = Je = {chunk: null, value: null, reason: null, deps: 1, errored: !1};
      return (
        t.then(function (O) {
          try {
            u !== null && Hn(u, O.byteLength, e);
            var p = s === ArrayBuffer ? O : new s(O);
            v !== '__proto__' && (r[a] = p),
              a === '' && g.value === null && (g.value = p);
          } catch (f) {
            d(f);
            return;
          }
          g.deps--,
            g.deps === 0 &&
              ((O = g.chunk),
              O !== null &&
                O.status === 'blocked' &&
                ((p = O.value),
                (O.status = 'fulfilled'),
                (O.value = g.value),
                (O.reason = null),
                p !== null && $r(e, p, g.value, O)));
        }, d),
        null
      );
    }
    function l1(e, t, s, i) {
      var r = e._chunks;
      for (
        s = new $t('fulfilled', s, i),
          r.set(t, s),
          e = e._formData.data.getAll(e._prefix + t),
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
    function Cu(e, t, s) {
      function i(g) {
        s !== 'bytes' || ArrayBuffer.isView(g)
          ? r.enqueue(g)
          : v.error(Error(ce(579)));
      }
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error(ce(567));
      var r = null,
        a = !1,
        u = new ReadableStream({
          type: s,
          start: function (g) {
            r = g;
          },
        }),
        d = null,
        v = {
          enqueueModel: function (g) {
            if (d === null) {
              var O = s1(e, g, -1);
              qr(O),
                O.status === 'fulfilled'
                  ? i(O.value)
                  : (O.then(i, v.error), (d = O));
            } else {
              O = d;
              var p = new $t('pending', null, null);
              p.then(i, v.error),
                (d = p),
                O.then(function () {
                  d === p && (d = null), r1(e, p, g, -1);
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
                var O = d;
                (d = null),
                  O.then(function () {
                    return r.error(g);
                  });
              }
          },
        };
      return l1(e, t, u, v), u;
    }
    function wa(e) {
      this.next = e;
    }
    wa.prototype = {};
    wa.prototype[As] = function () {
      return this;
    };
    function wu(e, t, s) {
      if (((t = parseInt(t.slice(2), 16)), e._chunks.has(t)))
        throw Error(ce(567));
      var i = [],
        r = !1,
        a = 0,
        u = {};
      return (
        (u =
          ((u[As] = function () {
            var d = 0;
            return new wa(function (v) {
              if (v !== void 0) throw Error(ce(524));
              if (d === i.length) {
                if (r)
                  return new $t('fulfilled', {done: !0, value: void 0}, null);
                i[d] = new $t('pending', null, null);
              }
              return i[d++];
            });
          }),
          u)),
        (s = s ? u[As]() : u),
        l1(e, t, s, {
          enqueueModel: function (d) {
            a === i.length ? (i[a] = bu(e, d, !1)) : ra(e, i[a], d, !1), a++;
          },
          close: function (d) {
            if (!r)
              for (
                r = !0,
                  a === i.length ? (i[a] = bu(e, d, !0)) : ra(e, i[a], d, !0),
                  a++;
                a < i.length;

              )
                ra(e, i[a++], '"$undefined"', !0);
          },
          error: function (d) {
            if (!r)
              for (
                r = !0,
                  a === i.length && (i[a] = new $t('pending', null, null));
                a < i.length;

              )
                Kr(e, i[a++], d);
          },
        }),
        s
      );
    }
    function Jd(e, t, s, i, r, a) {
      if (i[0] === '$') {
        switch (i[1]) {
          case '$':
            return a !== null && Hn(a, i.length - 1, e), i.slice(1);
          case '@':
            return (t = parseInt(i.slice(2), 16)), Ur(e, t);
          case 'h':
            return (a = i.slice(2)), Bi(e, a, t, s, null, Wd);
          case 'T':
            if (r === void 0 || e._temporaryReferences === void 0)
              throw Error(ce(526));
            return _d(e._temporaryReferences, r);
          case 'Q':
            return (a = i.slice(2)), Bi(e, a, t, s, null, Gd);
          case 'W':
            return (a = i.slice(2)), Bi(e, a, t, s, null, zd);
          case 'K':
            for (
              s = i.slice(2),
                t = e._prefix + '_',
                s = t + s + '_',
                a = new FormData(),
                e = e._formData;
              (i = e.keys),
                i === null &&
                  ((i = e.keys = Array.from(e.data.keys())),
                  (e.keyPointer = 0)),
                (i = i[e.keyPointer]),
                i !== void 0;

            )
              if (i.startsWith(s)) {
                r = e.data.getAll(i);
                for (var u = i.slice(s.length), d = 0; d < r.length; d++)
                  a.append(u, r[d]);
                e.data.delete(i), e.keyPointer++;
              } else {
                if (i.startsWith(t)) break;
                e.keyPointer++;
              }
            return a;
          case 'i':
            return (a = i.slice(2)), Bi(e, a, t, s, null, Xd);
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
              throw Error(ce(581, t.length, 300));
            return a !== null && Hn(a, t.length, e), BigInt(t);
          case 'A':
            return Qt(e, i, ArrayBuffer, 1, t, s, a);
          case 'O':
            return Qt(e, i, Int8Array, 1, t, s, a);
          case 'o':
            return Qt(e, i, Uint8Array, 1, t, s, a);
          case 'U':
            return Qt(e, i, Uint8ClampedArray, 1, t, s, a);
          case 'S':
            return Qt(e, i, Int16Array, 2, t, s, a);
          case 's':
            return Qt(e, i, Uint16Array, 2, t, s, a);
          case 'L':
            return Qt(e, i, Int32Array, 4, t, s, a);
          case 'l':
            return Qt(e, i, Uint32Array, 4, t, s, a);
          case 'G':
            return Qt(e, i, Float32Array, 4, t, s, a);
          case 'g':
            return Qt(e, i, Float64Array, 8, t, s, a);
          case 'M':
            return Qt(e, i, BigInt64Array, 8, t, s, a);
          case 'm':
            return Qt(e, i, BigUint64Array, 8, t, s, a);
          case 'V':
            return Qt(e, i, DataView, 1, t, s, a);
          case 'B':
            if (
              ((t = parseInt(i.slice(2), 16)),
              (e = e._formData.data.get(e._prefix + t)),
              !(e instanceof Blob))
            )
              throw Error(ce(582));
            return e;
          case 'R':
            return Cu(e, i, void 0);
          case 'r':
            return Cu(e, i, 'bytes');
          case 'X':
            return wu(e, i, !1);
          case 'x':
            return wu(e, i, !0);
        }
        return (i = i.slice(1)), Bi(e, i, t, s, a, Yd);
      }
      return a !== null && Hn(a, i.length, e), i;
    }
    function c1(e, t, s) {
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
        _formData: {data: i, keyPointer: -1, keys: null},
        _chunks: a,
        _closed: !1,
        _closedReason: null,
        _temporaryReferences: s,
        _rootArrayContexts: new WeakMap(),
        _arraySizeLimit: r,
      };
    }
    function Su(e, t) {
      var s = t.id;
      if (typeof s != 'string') return null;
      var i = Qu(e, s);
      return (
        (e = Zu(i)),
        (t = t.bound),
        t instanceof Promise
          ? Promise.all([t, e]).then(function (r) {
              r = r[0];
              var a = $i(i);
              if (1e3 < r.length) throw Error(ce(580, r.length, 1e3));
              return a.bind.apply(a, [null].concat(r));
            })
          : e
          ? Promise.resolve(e).then(function () {
              return $i(i);
            })
          : Promise.resolve($i(i))
      );
    }
    function u1(e, t, s, i) {
      if (
        ((e = c1(t, s, void 0, e, i)),
        o1(e, Error(ce(412))),
        (e = Ur(e, 0)),
        e.then(function () {}),
        e.status !== 'fulfilled')
      )
        throw e.reason;
      return e.value;
    }
    Nn.createClientModuleProxy = function (e) {
      return (e = ii({}, e, !1)), new Proxy(e, Lu);
    };
    Nn.createTemporaryReferenceSet = function () {
      return new WeakMap();
    };
    Nn.decodeAction = function (e, t) {
      var s = new FormData(),
        i = null;
      if (
        (e.forEach(function (u, d) {
          d.startsWith('$ACTION_')
            ? (d.startsWith('$ACTION_REF_') || d.startsWith('$ACTION_ID_')) &&
              (i = d)
            : s.append(d, u);
        }),
        i === null)
      )
        return null;
      var r = i,
        a = null;
      if (r.startsWith('$ACTION_REF_'))
        (r = '$ACTION_' + r.slice(12) + ':'), (e = u1(e, t, r)), (a = Su(t, e));
      else if (r.startsWith('$ACTION_ID_'))
        (e = r.slice(11)), (a = Su(t, {id: e, bound: null}));
      else throw Error(ce(602));
      return a.then(function (u) {
        return u.bind(null, s);
      });
    };
    Nn.decodeFormState = function (e, t, s) {
      var i = t.get('$ACTION_KEY');
      if (typeof i != 'string') return Promise.resolve(null);
      var r = null;
      if (
        (t.forEach(function (d, v) {
          v.startsWith('$ACTION_REF_') && (r = v);
        }),
        r === null)
      )
        return Promise.resolve(null);
      var a = '$ACTION_' + r.slice(12) + ':';
      t = u1(t, s, a);
      var u = t.id;
      return Promise.resolve(t.bound).then(function (d) {
        return d === null ? null : [e, i, u, d.length - 1];
      });
    };
    Nn.decodeReply = function (e, t, s) {
      if (typeof e == 'string') {
        var i = new FormData();
        i.append('0', e), (e = i);
      }
      return (
        (e = c1(
          t,
          '',
          s ? s.temporaryReferences : void 0,
          e,
          s ? s.arraySizeLimit : void 0
        )),
        (t = Ur(e, 0)),
        o1(e, Error(ce(412))),
        t
      );
    };
    Nn.prerender = function (e, t, s) {
      return new Promise(function (i, r) {
        var a = new Ku(
          21,
          e,
          t,
          s ? s.onError : void 0,
          function () {
            var u = new ReadableStream(
              {
                type: 'bytes',
                pull: function (d) {
                  Yu(a, d);
                },
                cancel: function (d) {
                  (a.destination = null), Mr(a, d);
                },
              },
              {highWaterMark: 0}
            );
            i({prelude: u});
          },
          r,
          s ? s.identifierPrefix : void 0,
          s ? s.temporaryReferences : void 0
        );
        s && s.signal && Ju(a, s.signal), Xu(a);
      });
    };
    Nn.registerClientReference = function (e, t, s) {
      return ii(e, t + '#' + s, !1);
    };
    Nn.registerServerReference = function (e, t, s) {
      return Object.defineProperties(e, {
        $$typeof: {value: Dr},
        $$id: {value: s === null ? t : t + '#' + s, configurable: !0},
        $$bound: {value: null, configurable: !0},
        bind: {value: Ru, configurable: !0},
        toString: hd,
      });
    };
    Nn.renderToReadableStream = function (e, t, s) {
      var i = new Ku(
        20,
        e,
        t,
        s ? s.onError : void 0,
        An,
        An,
        s ? s.identifierPrefix : void 0,
        s ? s.temporaryReferences : void 0
      );
      return (
        s && s.signal && Ju(i, s.signal),
        new ReadableStream(
          {
            type: 'bytes',
            start: function () {
              Xu(i);
            },
            pull: function (r) {
              Yu(i, r);
            },
            cancel: function (r) {
              (i.destination = null), Mr(i, r);
            },
          },
          {highWaterMark: 0}
        )
      );
    };
  });
  var h1 = Z((Jn) => {
    'use strict';
    var Yn;
    Yn = p1();
    Jn.renderToReadableStream = Yn.renderToReadableStream;
    Jn.decodeReply = Yn.decodeReply;
    Jn.decodeAction = Yn.decodeAction;
    Jn.decodeFormState = Yn.decodeFormState;
    Jn.registerServerReference = Yn.registerServerReference;
    Jn.registerClientReference = Yn.registerClientReference;
    Jn.createClientModuleProxy = Yn.createClientModuleProxy;
    Jn.createTemporaryReferenceSet = Yn.createTemporaryReferenceSet;
  });
  var Et = Z((Sa) => {
    'use strict';
    Object.defineProperty(Sa, '__esModule', {value: !0});
    var f1;
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
      let v = d + 1;
      e[(e._await = v)] = '_await';
      let g = v + 1;
      e[(e._checks = g)] = '_checks';
      let O = g + 1;
      e[(e._constructor = O)] = '_constructor';
      let p = O + 1;
      e[(e._declare = p)] = '_declare';
      let f = p + 1;
      e[(e._enum = f)] = '_enum';
      let T = f + 1;
      e[(e._exports = T)] = '_exports';
      let x = T + 1;
      e[(e._from = x)] = '_from';
      let w = x + 1;
      e[(e._get = w)] = '_get';
      let S = w + 1;
      e[(e._global = S)] = '_global';
      let A = S + 1;
      e[(e._implements = A)] = '_implements';
      let q = A + 1;
      e[(e._infer = q)] = '_infer';
      let M = q + 1;
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
      let he = ie + 1;
      e[(e._of = he)] = '_of';
      let ae = he + 1;
      e[(e._opaque = ae)] = '_opaque';
      let We = ae + 1;
      e[(e._out = We)] = '_out';
      let qe = We + 1;
      e[(e._override = qe)] = '_override';
      let Bt = qe + 1;
      e[(e._private = Bt)] = '_private';
      let Tt = Bt + 1;
      e[(e._protected = Tt)] = '_protected';
      let vt = Tt + 1;
      e[(e._proto = vt)] = '_proto';
      let Pt = vt + 1;
      e[(e._public = Pt)] = '_public';
      let nt = Pt + 1;
      e[(e._readonly = nt)] = '_readonly';
      let st = nt + 1;
      e[(e._require = st)] = '_require';
      let Ct = st + 1;
      e[(e._satisfies = Ct)] = '_satisfies';
      let ut = Ct + 1;
      e[(e._set = ut)] = '_set';
      let St = ut + 1;
      e[(e._static = St)] = '_static';
      let qt = St + 1;
      e[(e._symbol = qt)] = '_symbol';
      let Nt = qt + 1;
      e[(e._type = Nt)] = '_type';
      let Ut = Nt + 1;
      e[(e._unique = Ut)] = '_unique';
      let vn = Ut + 1;
      e[(e._using = vn)] = '_using';
    })(f1 || (Sa.ContextualKeyword = f1 = {}));
  });
  var Ce = Z((Hr) => {
    'use strict';
    Object.defineProperty(Hr, '__esModule', {value: !0});
    var K;
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
      let v = 512;
      e[(e.num = v)] = 'num';
      let g = 1536;
      e[(e.bigint = g)] = 'bigint';
      let O = 2560;
      e[(e.decimal = O)] = 'decimal';
      let p = 3584;
      e[(e.regexp = p)] = 'regexp';
      let f = 4608;
      e[(e.string = f)] = 'string';
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
      let q = 10752;
      e[(e.braceBarL = q)] = 'braceBarL';
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
      let he = 17408;
      e[(e.colon = he)] = 'colon';
      let ae = 18432;
      e[(e.doubleColon = ae)] = 'doubleColon';
      let We = 19456;
      e[(e.dot = We)] = 'dot';
      let qe = 20480;
      e[(e.question = qe)] = 'question';
      let Bt = 21504;
      e[(e.questionDot = Bt)] = 'questionDot';
      let Tt = 22528;
      e[(e.arrow = Tt)] = 'arrow';
      let vt = 23552;
      e[(e.template = vt)] = 'template';
      let Pt = 24576;
      e[(e.ellipsis = Pt)] = 'ellipsis';
      let nt = 25600;
      e[(e.backQuote = nt)] = 'backQuote';
      let st = 27136;
      e[(e.dollarBraceL = st)] = 'dollarBraceL';
      let Ct = 27648;
      e[(e.at = Ct)] = 'at';
      let ut = 29184;
      e[(e.hash = ut)] = 'hash';
      let St = 29728;
      e[(e.eq = St)] = 'eq';
      let qt = 30752;
      e[(e.assign = qt)] = 'assign';
      let Nt = 32640;
      e[(e.preIncDec = Nt)] = 'preIncDec';
      let Ut = 33664;
      e[(e.postIncDec = Ut)] = 'postIncDec';
      let vn = 34432;
      e[(e.bang = vn)] = 'bang';
      let V = 35456;
      e[(e.tilde = V)] = 'tilde';
      let G = 35841;
      e[(e.pipeline = G)] = 'pipeline';
      let J = 36866;
      e[(e.nullishCoalescing = J)] = 'nullishCoalescing';
      let re = 37890;
      e[(e.logicalOR = re)] = 'logicalOR';
      let xe = 38915;
      e[(e.logicalAND = xe)] = 'logicalAND';
      let fe = 39940;
      e[(e.bitwiseOR = fe)] = 'bitwiseOR';
      let Ee = 40965;
      e[(e.bitwiseXOR = Ee)] = 'bitwiseXOR';
      let Ae = 41990;
      e[(e.bitwiseAND = Ae)] = 'bitwiseAND';
      let Oe = 43015;
      e[(e.equality = Oe)] = 'equality';
      let Ye = 44040;
      e[(e.lessThan = Ye)] = 'lessThan';
      let Ge = 45064;
      e[(e.greaterThan = Ge)] = 'greaterThan';
      let Ue = 46088;
      e[(e.relationalOrEqual = Ue)] = 'relationalOrEqual';
      let pt = 47113;
      e[(e.bitShiftL = pt)] = 'bitShiftL';
      let ht = 48137;
      e[(e.bitShiftR = ht)] = 'bitShiftR';
      let wt = 49802;
      e[(e.plus = wt)] = 'plus';
      let yt = 50826;
      e[(e.minus = yt)] = 'minus';
      let xt = 51723;
      e[(e.modulo = xt)] = 'modulo';
      let Cn = 52235;
      e[(e.star = Cn)] = 'star';
      let Bn = 53259;
      e[(e.slash = Bn)] = 'slash';
      let ze = 54348;
      e[(e.exponent = ze)] = 'exponent';
      let It = 55296;
      e[(e.jsxName = It)] = 'jsxName';
      let at = 56320;
      e[(e.jsxText = at)] = 'jsxText';
      let Xt = 57344;
      e[(e.jsxEmptyText = Xt)] = 'jsxEmptyText';
      let Yt = 58880;
      e[(e.jsxTagStart = Yt)] = 'jsxTagStart';
      let te = 59392;
      e[(e.jsxTagEnd = te)] = 'jsxTagEnd';
      let wn = 60928;
      e[(e.typeParameterStart = wn)] = 'typeParameterStart';
      let is = 61440;
      e[(e.nonNullAssertion = is)] = 'nonNullAssertion';
      let Ci = 62480;
      e[(e._break = Ci)] = '_break';
      let Vn = 63504;
      e[(e._case = Vn)] = '_case';
      let Cs = 64528;
      e[(e._catch = Cs)] = '_catch';
      let Bs = 65552;
      e[(e._continue = Bs)] = '_continue';
      let wi = 66576;
      e[(e._debugger = wi)] = '_debugger';
      let rs = 67600;
      e[(e._default = rs)] = '_default';
      let Rt = 68624;
      e[(e._do = Rt)] = '_do';
      let Lt = 69648;
      e[(e._else = Lt)] = '_else';
      let He = 70672;
      e[(e._finally = He)] = '_finally';
      let Sn = 71696;
      e[(e._for = Sn)] = '_for';
      let me = 73232;
      e[(e._function = me)] = '_function';
      let Vs = 73744;
      e[(e._if = Vs)] = '_if';
      let ws = 74768;
      e[(e._return = ws)] = '_return';
      let Si = 75792;
      e[(e._switch = Si)] = '_switch';
      let os = 77456;
      e[(e._throw = os)] = '_throw';
      let ln = 77840;
      e[(e._try = ln)] = '_try';
      let Ii = 78864;
      e[(e._var = Ii)] = '_var';
      let jn = 79888;
      e[(e._let = jn)] = '_let';
      let $n = 80912;
      e[(e._const = $n)] = '_const';
      let js = 81936;
      e[(e._while = js)] = '_while';
      let Ei = 82960;
      e[(e._with = Ei)] = '_with';
      let $s = 84496;
      e[(e._new = $s)] = '_new';
      let Ks = 85520;
      e[(e._this = Ks)] = '_this';
      let qs = 86544;
      e[(e._super = qs)] = '_super';
      let Us = 87568;
      e[(e._class = Us)] = '_class';
      let Hs = 88080;
      e[(e._extends = Hs)] = '_extends';
      let Ai = 89104;
      e[(e._export = Ai)] = '_export';
      let Pi = 90640;
      e[(e._import = Pi)] = '_import';
      let Ni = 91664;
      e[(e._yield = Ni)] = '_yield';
      let Ri = 92688;
      e[(e._null = Ri)] = '_null';
      let Ws = 93712;
      e[(e._true = Ws)] = '_true';
      let Gs = 94736;
      e[(e._false = Gs)] = '_false';
      let zs = 95256;
      e[(e._in = zs)] = '_in';
      let Xs = 96280;
      e[(e._instanceof = Xs)] = '_instanceof';
      let Ys = 97936;
      e[(e._typeof = Ys)] = '_typeof';
      let Js = 98960;
      e[(e._void = Js)] = '_void';
      let Ho = 99984;
      e[(e._delete = Ho)] = '_delete';
      let Wo = 100880;
      e[(e._async = Wo)] = '_async';
      let xr = 101904;
      e[(e._get = xr)] = '_get';
      let Go = 102928;
      e[(e._set = Go)] = '_set';
      let Li = 103952;
      e[(e._declare = Li)] = '_declare';
      let gr = 104976;
      e[(e._readonly = gr)] = '_readonly';
      let zo = 106e3;
      e[(e._abstract = zo)] = '_abstract';
      let le = 107024;
      e[(e._static = le)] = '_static';
      let Qs = 107536;
      e[(e._public = Qs)] = '_public';
      let cn = 108560;
      e[(e._private = cn)] = '_private';
      let Xo = 109584;
      e[(e._protected = Xo)] = '_protected';
      let Yo = 110608;
      e[(e._override = Yo)] = '_override';
      let _r = 112144;
      e[(e._as = _r)] = '_as';
      let Jo = 113168;
      e[(e._enum = Jo)] = '_enum';
      let Qo = 114192;
      e[(e._type = Qo)] = '_type';
      let br = 115216;
      e[(e._implements = br)] = '_implements';
    })(K || (Hr.TokenType = K = {}));
    function Qd(e) {
      switch (e) {
        case K.num:
          return 'num';
        case K.bigint:
          return 'bigint';
        case K.decimal:
          return 'decimal';
        case K.regexp:
          return 'regexp';
        case K.string:
          return 'string';
        case K.name:
          return 'name';
        case K.eof:
          return 'eof';
        case K.bracketL:
          return '[';
        case K.bracketR:
          return ']';
        case K.braceL:
          return '{';
        case K.braceBarL:
          return '{|';
        case K.braceR:
          return '}';
        case K.braceBarR:
          return '|}';
        case K.parenL:
          return '(';
        case K.parenR:
          return ')';
        case K.comma:
          return ',';
        case K.semi:
          return ';';
        case K.colon:
          return ':';
        case K.doubleColon:
          return '::';
        case K.dot:
          return '.';
        case K.question:
          return '?';
        case K.questionDot:
          return '?.';
        case K.arrow:
          return '=>';
        case K.template:
          return 'template';
        case K.ellipsis:
          return '...';
        case K.backQuote:
          return '`';
        case K.dollarBraceL:
          return '${';
        case K.at:
          return '@';
        case K.hash:
          return '#';
        case K.eq:
          return '=';
        case K.assign:
          return '_=';
        case K.preIncDec:
          return '++/--';
        case K.postIncDec:
          return '++/--';
        case K.bang:
          return '!';
        case K.tilde:
          return '~';
        case K.pipeline:
          return '|>';
        case K.nullishCoalescing:
          return '??';
        case K.logicalOR:
          return '||';
        case K.logicalAND:
          return '&&';
        case K.bitwiseOR:
          return '|';
        case K.bitwiseXOR:
          return '^';
        case K.bitwiseAND:
          return '&';
        case K.equality:
          return '==/!=';
        case K.lessThan:
          return '<';
        case K.greaterThan:
          return '>';
        case K.relationalOrEqual:
          return '<=/>=';
        case K.bitShiftL:
          return '<<';
        case K.bitShiftR:
          return '>>/>>>';
        case K.plus:
          return '+';
        case K.minus:
          return '-';
        case K.modulo:
          return '%';
        case K.star:
          return '*';
        case K.slash:
          return '/';
        case K.exponent:
          return '**';
        case K.jsxName:
          return 'jsxName';
        case K.jsxText:
          return 'jsxText';
        case K.jsxEmptyText:
          return 'jsxEmptyText';
        case K.jsxTagStart:
          return 'jsxTagStart';
        case K.jsxTagEnd:
          return 'jsxTagEnd';
        case K.typeParameterStart:
          return 'typeParameterStart';
        case K.nonNullAssertion:
          return 'nonNullAssertion';
        case K._break:
          return 'break';
        case K._case:
          return 'case';
        case K._catch:
          return 'catch';
        case K._continue:
          return 'continue';
        case K._debugger:
          return 'debugger';
        case K._default:
          return 'default';
        case K._do:
          return 'do';
        case K._else:
          return 'else';
        case K._finally:
          return 'finally';
        case K._for:
          return 'for';
        case K._function:
          return 'function';
        case K._if:
          return 'if';
        case K._return:
          return 'return';
        case K._switch:
          return 'switch';
        case K._throw:
          return 'throw';
        case K._try:
          return 'try';
        case K._var:
          return 'var';
        case K._let:
          return 'let';
        case K._const:
          return 'const';
        case K._while:
          return 'while';
        case K._with:
          return 'with';
        case K._new:
          return 'new';
        case K._this:
          return 'this';
        case K._super:
          return 'super';
        case K._class:
          return 'class';
        case K._extends:
          return 'extends';
        case K._export:
          return 'export';
        case K._import:
          return 'import';
        case K._yield:
          return 'yield';
        case K._null:
          return 'null';
        case K._true:
          return 'true';
        case K._false:
          return 'false';
        case K._in:
          return 'in';
        case K._instanceof:
          return 'instanceof';
        case K._typeof:
          return 'typeof';
        case K._void:
          return 'void';
        case K._delete:
          return 'delete';
        case K._async:
          return 'async';
        case K._get:
          return 'get';
        case K._set:
          return 'set';
        case K._declare:
          return 'declare';
        case K._readonly:
          return 'readonly';
        case K._abstract:
          return 'abstract';
        case K._static:
          return 'static';
        case K._public:
          return 'public';
        case K._private:
          return 'private';
        case K._protected:
          return 'protected';
        case K._override:
          return 'override';
        case K._as:
          return 'as';
        case K._enum:
          return 'enum';
        case K._type:
          return 'type';
        case K._implements:
          return 'implements';
        default:
          return '';
      }
    }
    Hr.formatTokenType = Qd;
  });
  var Gr = Z((Xi) => {
    'use strict';
    Object.defineProperty(Xi, '__esModule', {value: !0});
    var Zd = Et(),
      em = Ce(),
      Ia = class {
        constructor(t, s, i) {
          (this.startTokenIndex = t),
            (this.endTokenIndex = s),
            (this.isFunctionScope = i);
        }
      };
    Xi.Scope = Ia;
    var Wr = class {
      constructor(t, s, i, r, a, u, d, v, g, O, p, f, T) {
        (this.potentialArrowAt = t),
          (this.noAnonFunctionType = s),
          (this.inDisallowConditionalTypesContext = i),
          (this.tokensLength = r),
          (this.scopesLength = a),
          (this.pos = u),
          (this.type = d),
          (this.contextualKeyword = v),
          (this.start = g),
          (this.end = O),
          (this.isType = p),
          (this.scopeDepth = f),
          (this.error = T);
      }
    };
    Xi.StateSnapshot = Wr;
    var Ea = class e {
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
        this.type = em.TokenType.eof;
      }
      __init8() {
        this.contextualKeyword = Zd.ContextualKeyword.NONE;
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
        return new Wr(
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
    Xi.default = Ea;
  });
  var tn = Z((zr) => {
    'use strict';
    Object.defineProperty(zr, '__esModule', {value: !0});
    var ps;
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
      let v = 34;
      e[(e.quotationMark = v)] = 'quotationMark';
      let g = 35;
      e[(e.numberSign = g)] = 'numberSign';
      let O = 36;
      e[(e.dollarSign = O)] = 'dollarSign';
      let p = 37;
      e[(e.percentSign = p)] = 'percentSign';
      let f = 38;
      e[(e.ampersand = f)] = 'ampersand';
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
      let q = 44;
      e[(e.comma = q)] = 'comma';
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
      let he = 51;
      e[(e.digit3 = he)] = 'digit3';
      let ae = 52;
      e[(e.digit4 = ae)] = 'digit4';
      let We = 53;
      e[(e.digit5 = We)] = 'digit5';
      let qe = 54;
      e[(e.digit6 = qe)] = 'digit6';
      let Bt = 55;
      e[(e.digit7 = Bt)] = 'digit7';
      let Tt = 56;
      e[(e.digit8 = Tt)] = 'digit8';
      let vt = 57;
      e[(e.digit9 = vt)] = 'digit9';
      let Pt = 58;
      e[(e.colon = Pt)] = 'colon';
      let nt = 59;
      e[(e.semicolon = nt)] = 'semicolon';
      let st = 60;
      e[(e.lessThan = st)] = 'lessThan';
      let Ct = 61;
      e[(e.equalsTo = Ct)] = 'equalsTo';
      let ut = 62;
      e[(e.greaterThan = ut)] = 'greaterThan';
      let St = 63;
      e[(e.questionMark = St)] = 'questionMark';
      let qt = 64;
      e[(e.atSign = qt)] = 'atSign';
      let Nt = 65;
      e[(e.uppercaseA = Nt)] = 'uppercaseA';
      let Ut = 66;
      e[(e.uppercaseB = Ut)] = 'uppercaseB';
      let vn = 67;
      e[(e.uppercaseC = vn)] = 'uppercaseC';
      let V = 68;
      e[(e.uppercaseD = V)] = 'uppercaseD';
      let G = 69;
      e[(e.uppercaseE = G)] = 'uppercaseE';
      let J = 70;
      e[(e.uppercaseF = J)] = 'uppercaseF';
      let re = 71;
      e[(e.uppercaseG = re)] = 'uppercaseG';
      let xe = 72;
      e[(e.uppercaseH = xe)] = 'uppercaseH';
      let fe = 73;
      e[(e.uppercaseI = fe)] = 'uppercaseI';
      let Ee = 74;
      e[(e.uppercaseJ = Ee)] = 'uppercaseJ';
      let Ae = 75;
      e[(e.uppercaseK = Ae)] = 'uppercaseK';
      let Oe = 76;
      e[(e.uppercaseL = Oe)] = 'uppercaseL';
      let Ye = 77;
      e[(e.uppercaseM = Ye)] = 'uppercaseM';
      let Ge = 78;
      e[(e.uppercaseN = Ge)] = 'uppercaseN';
      let Ue = 79;
      e[(e.uppercaseO = Ue)] = 'uppercaseO';
      let pt = 80;
      e[(e.uppercaseP = pt)] = 'uppercaseP';
      let ht = 81;
      e[(e.uppercaseQ = ht)] = 'uppercaseQ';
      let wt = 82;
      e[(e.uppercaseR = wt)] = 'uppercaseR';
      let yt = 83;
      e[(e.uppercaseS = yt)] = 'uppercaseS';
      let xt = 84;
      e[(e.uppercaseT = xt)] = 'uppercaseT';
      let Cn = 85;
      e[(e.uppercaseU = Cn)] = 'uppercaseU';
      let Bn = 86;
      e[(e.uppercaseV = Bn)] = 'uppercaseV';
      let ze = 87;
      e[(e.uppercaseW = ze)] = 'uppercaseW';
      let It = 88;
      e[(e.uppercaseX = It)] = 'uppercaseX';
      let at = 89;
      e[(e.uppercaseY = at)] = 'uppercaseY';
      let Xt = 90;
      e[(e.uppercaseZ = Xt)] = 'uppercaseZ';
      let Yt = 91;
      e[(e.leftSquareBracket = Yt)] = 'leftSquareBracket';
      let te = 92;
      e[(e.backslash = te)] = 'backslash';
      let wn = 93;
      e[(e.rightSquareBracket = wn)] = 'rightSquareBracket';
      let is = 94;
      e[(e.caret = is)] = 'caret';
      let Ci = 95;
      e[(e.underscore = Ci)] = 'underscore';
      let Vn = 96;
      e[(e.graveAccent = Vn)] = 'graveAccent';
      let Cs = 97;
      e[(e.lowercaseA = Cs)] = 'lowercaseA';
      let Bs = 98;
      e[(e.lowercaseB = Bs)] = 'lowercaseB';
      let wi = 99;
      e[(e.lowercaseC = wi)] = 'lowercaseC';
      let rs = 100;
      e[(e.lowercaseD = rs)] = 'lowercaseD';
      let Rt = 101;
      e[(e.lowercaseE = Rt)] = 'lowercaseE';
      let Lt = 102;
      e[(e.lowercaseF = Lt)] = 'lowercaseF';
      let He = 103;
      e[(e.lowercaseG = He)] = 'lowercaseG';
      let Sn = 104;
      e[(e.lowercaseH = Sn)] = 'lowercaseH';
      let me = 105;
      e[(e.lowercaseI = me)] = 'lowercaseI';
      let Vs = 106;
      e[(e.lowercaseJ = Vs)] = 'lowercaseJ';
      let ws = 107;
      e[(e.lowercaseK = ws)] = 'lowercaseK';
      let Si = 108;
      e[(e.lowercaseL = Si)] = 'lowercaseL';
      let os = 109;
      e[(e.lowercaseM = os)] = 'lowercaseM';
      let ln = 110;
      e[(e.lowercaseN = ln)] = 'lowercaseN';
      let Ii = 111;
      e[(e.lowercaseO = Ii)] = 'lowercaseO';
      let jn = 112;
      e[(e.lowercaseP = jn)] = 'lowercaseP';
      let $n = 113;
      e[(e.lowercaseQ = $n)] = 'lowercaseQ';
      let js = 114;
      e[(e.lowercaseR = js)] = 'lowercaseR';
      let Ei = 115;
      e[(e.lowercaseS = Ei)] = 'lowercaseS';
      let $s = 116;
      e[(e.lowercaseT = $s)] = 'lowercaseT';
      let Ks = 117;
      e[(e.lowercaseU = Ks)] = 'lowercaseU';
      let qs = 118;
      e[(e.lowercaseV = qs)] = 'lowercaseV';
      let Us = 119;
      e[(e.lowercaseW = Us)] = 'lowercaseW';
      let Hs = 120;
      e[(e.lowercaseX = Hs)] = 'lowercaseX';
      let Ai = 121;
      e[(e.lowercaseY = Ai)] = 'lowercaseY';
      let Pi = 122;
      e[(e.lowercaseZ = Pi)] = 'lowercaseZ';
      let Ni = 123;
      e[(e.leftCurlyBrace = Ni)] = 'leftCurlyBrace';
      let Ri = 124;
      e[(e.verticalBar = Ri)] = 'verticalBar';
      let Ws = 125;
      e[(e.rightCurlyBrace = Ws)] = 'rightCurlyBrace';
      let Gs = 126;
      e[(e.tilde = Gs)] = 'tilde';
      let zs = 160;
      e[(e.nonBreakingSpace = zs)] = 'nonBreakingSpace';
      let Xs = 5760;
      e[(e.oghamSpaceMark = Xs)] = 'oghamSpaceMark';
      let Ys = 8232;
      e[(e.lineSeparator = Ys)] = 'lineSeparator';
      let Js = 8233;
      e[(e.paragraphSeparator = Js)] = 'paragraphSeparator';
    })(ps || (zr.charCodes = ps = {}));
    function tm(e) {
      return (
        (e >= ps.digit0 && e <= ps.digit9) ||
        (e >= ps.lowercaseA && e <= ps.lowercaseF) ||
        (e >= ps.uppercaseA && e <= ps.uppercaseF)
      );
    }
    zr.isDigit = tm;
  });
  var nn = Z((dt) => {
    'use strict';
    Object.defineProperty(dt, '__esModule', {value: !0});
    function nm(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var sm = Gr(),
      im = nm(sm),
      rm = tn();
    dt.isJSXEnabled;
    dt.isTypeScriptEnabled;
    dt.isFlowEnabled;
    dt.state;
    dt.input;
    dt.nextContextId;
    function om() {
      return dt.nextContextId++;
    }
    dt.getNextContextId = om;
    function am(e) {
      if ('pos' in e) {
        let t = d1(e.pos);
        (e.message += ` (${t.line}:${t.column})`), (e.loc = t);
      }
      return e;
    }
    dt.augmentError = am;
    var Xr = class {
      constructor(t, s) {
        (this.line = t), (this.column = s);
      }
    };
    dt.Loc = Xr;
    function d1(e) {
      let t = 1,
        s = 1;
      for (let i = 0; i < e; i++)
        dt.input.charCodeAt(i) === rm.charCodes.lineFeed ? (t++, (s = 1)) : s++;
      return new Xr(t, s);
    }
    dt.locationForIndex = d1;
    function lm(e, t, s, i) {
      (dt.input = e),
        (dt.state = new im.default()),
        (dt.nextContextId = 1),
        (dt.isJSXEnabled = t),
        (dt.isTypeScriptEnabled = s),
        (dt.isFlowEnabled = i);
    }
    dt.initParser = lm;
  });
  var fs = Z((rn) => {
    'use strict';
    Object.defineProperty(rn, '__esModule', {value: !0});
    var hs = _t(),
      Rs = Ce(),
      Yr = tn(),
      sn = nn();
    function cm(e) {
      return sn.state.contextualKeyword === e;
    }
    rn.isContextual = cm;
    function um(e) {
      let t = hs.lookaheadTypeAndKeyword.call(void 0);
      return t.type === Rs.TokenType.name && t.contextualKeyword === e;
    }
    rn.isLookaheadContextual = um;
    function m1(e) {
      return (
        sn.state.contextualKeyword === e &&
        hs.eat.call(void 0, Rs.TokenType.name)
      );
    }
    rn.eatContextual = m1;
    function pm(e) {
      m1(e) || Jr();
    }
    rn.expectContextual = pm;
    function T1() {
      return (
        hs.match.call(void 0, Rs.TokenType.eof) ||
        hs.match.call(void 0, Rs.TokenType.braceR) ||
        y1()
      );
    }
    rn.canInsertSemicolon = T1;
    function y1() {
      let e = sn.state.tokens[sn.state.tokens.length - 1],
        t = e ? e.end : 0;
      for (let s = t; s < sn.state.start; s++) {
        let i = sn.input.charCodeAt(s);
        if (
          i === Yr.charCodes.lineFeed ||
          i === Yr.charCodes.carriageReturn ||
          i === 8232 ||
          i === 8233
        )
          return !0;
      }
      return !1;
    }
    rn.hasPrecedingLineBreak = y1;
    function hm() {
      let e = hs.nextTokenStart.call(void 0);
      for (let t = sn.state.end; t < e; t++) {
        let s = sn.input.charCodeAt(t);
        if (
          s === Yr.charCodes.lineFeed ||
          s === Yr.charCodes.carriageReturn ||
          s === 8232 ||
          s === 8233
        )
          return !0;
      }
      return !1;
    }
    rn.hasFollowingLineBreak = hm;
    function k1() {
      return hs.eat.call(void 0, Rs.TokenType.semi) || T1();
    }
    rn.isLineTerminator = k1;
    function fm() {
      k1() || Jr('Unexpected token, expected ";"');
    }
    rn.semicolon = fm;
    function dm(e) {
      hs.eat.call(void 0, e) ||
        Jr(
          `Unexpected token, expected "${Rs.formatTokenType.call(void 0, e)}"`
        );
    }
    rn.expect = dm;
    function Jr(e = 'Unexpected token', t = sn.state.start) {
      if (sn.state.error) return;
      let s = new SyntaxError(e);
      (s.pos = t),
        (sn.state.error = s),
        (sn.state.pos = sn.input.length),
        hs.finishToken.call(void 0, Rs.TokenType.eof);
    }
    rn.unexpected = Jr;
  });
  var Pa = Z((Ls) => {
    'use strict';
    Object.defineProperty(Ls, '__esModule', {value: !0});
    var Aa = tn(),
      mm = [
        9,
        11,
        12,
        Aa.charCodes.space,
        Aa.charCodes.nonBreakingSpace,
        Aa.charCodes.oghamSpaceMark,
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
    Ls.WHITESPACE_CHARS = mm;
    var Tm = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
    Ls.skipWhiteSpace = Tm;
    var ym = new Uint8Array(65536);
    Ls.IS_WHITESPACE = ym;
    for (let e of Ls.WHITESPACE_CHARS) Ls.IS_WHITESPACE[e] = 1;
  });
  var ui = Z((xn) => {
    'use strict';
    Object.defineProperty(xn, '__esModule', {value: !0});
    var v1 = tn(),
      km = Pa();
    function vm(e) {
      if (e < 48) return e === 36;
      if (e < 58) return !0;
      if (e < 65) return !1;
      if (e < 91) return !0;
      if (e < 97) return e === 95;
      if (e < 123) return !0;
      if (e < 128) return !1;
      throw new Error('Should not be called with non-ASCII char code.');
    }
    var xm = new Uint8Array(65536);
    xn.IS_IDENTIFIER_CHAR = xm;
    for (let e = 0; e < 128; e++) xn.IS_IDENTIFIER_CHAR[e] = vm(e) ? 1 : 0;
    for (let e = 128; e < 65536; e++) xn.IS_IDENTIFIER_CHAR[e] = 1;
    for (let e of km.WHITESPACE_CHARS) xn.IS_IDENTIFIER_CHAR[e] = 0;
    xn.IS_IDENTIFIER_CHAR[8232] = 0;
    xn.IS_IDENTIFIER_CHAR[8233] = 0;
    var gm = xn.IS_IDENTIFIER_CHAR.slice();
    xn.IS_IDENTIFIER_START = gm;
    for (let e = v1.charCodes.digit0; e <= v1.charCodes.digit9; e++)
      xn.IS_IDENTIFIER_START[e] = 0;
  });
  var x1 = Z((Na) => {
    'use strict';
    Object.defineProperty(Na, '__esModule', {value: !0});
    var _e = Et(),
      we = Ce(),
      _m = new Int32Array([
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
        _e.ContextualKeyword._abstract << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._accessor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        _e.ContextualKeyword._as << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._assert << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._asserts << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._async << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._await << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._break << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._case << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._catch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._checks << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._class << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._const << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._constructor << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._continue << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._debugger << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._declare << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._default << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._delete << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (we.TokenType._do << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._else << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._enum << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._export << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._exports << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._extends << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._false << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._finally << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._for << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._from << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._function << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._get << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._global << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._if << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._implements << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._import << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (we.TokenType._in << 1) + 1,
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
        _e.ContextualKeyword._infer << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._instanceof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._interface << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        _e.ContextualKeyword._is << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._keyof << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._let << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._mixins << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._module << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._namespace << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._new << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._null << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._of << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._opaque << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._out << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._override << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._private << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._protected << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        _e.ContextualKeyword._proto << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._public << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._readonly << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._require << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._return << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._satisfies << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._set << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._static << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._super << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._switch << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._symbol << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._this << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._throw << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._true << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        (we.TokenType._try << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._type << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._typeof << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._unique << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        _e.ContextualKeyword._using << 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._var << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._void << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._while << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._with << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
        (we.TokenType._yield << 1) + 1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
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
    Na.READ_WORD_TREE = _m;
  });
  var C1 = Z((La) => {
    'use strict';
    Object.defineProperty(La, '__esModule', {value: !0});
    var gn = nn(),
      ds = tn(),
      g1 = ui(),
      Ra = _t(),
      _1 = x1(),
      b1 = Ce();
    function bm() {
      let e = 0,
        t = 0,
        s = gn.state.pos;
      for (
        ;
        s < gn.input.length &&
        ((t = gn.input.charCodeAt(s)),
        !(t < ds.charCodes.lowercaseA || t > ds.charCodes.lowercaseZ));

      ) {
        let r = _1.READ_WORD_TREE[e + (t - ds.charCodes.lowercaseA) + 1];
        if (r === -1) break;
        (e = r), s++;
      }
      let i = _1.READ_WORD_TREE[e];
      if (i > -1 && !g1.IS_IDENTIFIER_CHAR[t]) {
        (gn.state.pos = s),
          i & 1
            ? Ra.finishToken.call(void 0, i >>> 1)
            : Ra.finishToken.call(void 0, b1.TokenType.name, i >>> 1);
        return;
      }
      for (; s < gn.input.length; ) {
        let r = gn.input.charCodeAt(s);
        if (g1.IS_IDENTIFIER_CHAR[r]) s++;
        else if (r === ds.charCodes.backslash) {
          if (
            ((s += 2), gn.input.charCodeAt(s) === ds.charCodes.leftCurlyBrace)
          ) {
            for (
              ;
              s < gn.input.length &&
              gn.input.charCodeAt(s) !== ds.charCodes.rightCurlyBrace;

            )
              s++;
            s++;
          }
        } else if (
          r === ds.charCodes.atSign &&
          gn.input.charCodeAt(s + 1) === ds.charCodes.atSign
        )
          s += 2;
        else break;
      }
      (gn.state.pos = s), Ra.finishToken.call(void 0, b1.TokenType.name);
    }
    La.default = bm;
  });
  var _t = Z((Ve) => {
    'use strict';
    Object.defineProperty(Ve, '__esModule', {value: !0});
    function Cm(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var b = nn(),
      pi = fs(),
      F = tn(),
      S1 = ui(),
      Da = Pa(),
      wm = Et(),
      Sm = C1(),
      Im = Cm(Sm),
      ne = Ce(),
      rt;
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
      let v = d + 1;
      e[(e.ObjectShorthandBlockScopedDeclaration = v)] =
        'ObjectShorthandBlockScopedDeclaration';
      let g = v + 1;
      e[(e.ObjectShorthand = g)] = 'ObjectShorthand';
      let O = g + 1;
      e[(e.ImportDeclaration = O)] = 'ImportDeclaration';
      let p = O + 1;
      e[(e.ObjectKey = p)] = 'ObjectKey';
      let f = p + 1;
      e[(e.ImportAccess = f)] = 'ImportAccess';
    })(rt || (Ve.IdentifierRole = rt = {}));
    var w1;
    (function (e) {
      e[(e.NoChildren = 0)] = 'NoChildren';
      let s = 1;
      e[(e.OneChild = s)] = 'OneChild';
      let i = s + 1;
      e[(e.StaticChildren = i)] = 'StaticChildren';
      let r = i + 1;
      e[(e.KeyAfterPropSpread = r)] = 'KeyAfterPropSpread';
    })(w1 || (Ve.JSXRole = w1 = {}));
    function Em(e) {
      let t = e.identifierRole;
      return (
        t === rt.TopLevelDeclaration ||
        t === rt.FunctionScopedDeclaration ||
        t === rt.BlockScopedDeclaration ||
        t === rt.ObjectShorthandTopLevelDeclaration ||
        t === rt.ObjectShorthandFunctionScopedDeclaration ||
        t === rt.ObjectShorthandBlockScopedDeclaration
      );
    }
    Ve.isDeclaration = Em;
    function Am(e) {
      let t = e.identifierRole;
      return (
        t === rt.FunctionScopedDeclaration ||
        t === rt.BlockScopedDeclaration ||
        t === rt.ObjectShorthandFunctionScopedDeclaration ||
        t === rt.ObjectShorthandBlockScopedDeclaration
      );
    }
    Ve.isNonTopLevelDeclaration = Am;
    function Pm(e) {
      let t = e.identifierRole;
      return (
        t === rt.TopLevelDeclaration ||
        t === rt.ObjectShorthandTopLevelDeclaration ||
        t === rt.ImportDeclaration
      );
    }
    Ve.isTopLevelDeclaration = Pm;
    function Nm(e) {
      let t = e.identifierRole;
      return (
        t === rt.TopLevelDeclaration ||
        t === rt.BlockScopedDeclaration ||
        t === rt.ObjectShorthandTopLevelDeclaration ||
        t === rt.ObjectShorthandBlockScopedDeclaration
      );
    }
    Ve.isBlockScopedDeclaration = Nm;
    function Rm(e) {
      let t = e.identifierRole;
      return (
        t === rt.FunctionScopedDeclaration ||
        t === rt.ObjectShorthandFunctionScopedDeclaration
      );
    }
    Ve.isFunctionScopedDeclaration = Rm;
    function Lm(e) {
      return (
        e.identifierRole === rt.ObjectShorthandTopLevelDeclaration ||
        e.identifierRole === rt.ObjectShorthandBlockScopedDeclaration ||
        e.identifierRole === rt.ObjectShorthandFunctionScopedDeclaration
      );
    }
    Ve.isObjectShorthandDeclaration = Lm;
    var Yi = class {
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
    Ve.Token = Yi;
    function Zr() {
      b.state.tokens.push(new Yi()), P1();
    }
    Ve.next = Zr;
    function Om() {
      b.state.tokens.push(new Yi()), (b.state.start = b.state.pos), sT();
    }
    Ve.nextTemplateToken = Om;
    function Dm() {
      b.state.type === ne.TokenType.assign && --b.state.pos, eT();
    }
    Ve.retokenizeSlashAsRegex = Dm;
    function Mm(e) {
      for (let s = b.state.tokens.length - e; s < b.state.tokens.length; s++)
        b.state.tokens[s].isType = !0;
      let t = b.state.isType;
      return (b.state.isType = !0), t;
    }
    Ve.pushTypeContext = Mm;
    function Fm(e) {
      b.state.isType = e;
    }
    Ve.popTypeContext = Fm;
    function I1(e) {
      return Ma(e) ? (Zr(), !0) : !1;
    }
    Ve.eat = I1;
    function Bm(e) {
      let t = b.state.isType;
      (b.state.isType = !0), I1(e), (b.state.isType = t);
    }
    Ve.eatTypeToken = Bm;
    function Ma(e) {
      return b.state.type === e;
    }
    Ve.match = Ma;
    function Vm() {
      let e = b.state.snapshot();
      Zr();
      let t = b.state.type;
      return b.state.restoreFromSnapshot(e), t;
    }
    Ve.lookaheadType = Vm;
    var Qr = class {
      constructor(t, s) {
        (this.type = t), (this.contextualKeyword = s);
      }
    };
    Ve.TypeAndKeyword = Qr;
    function jm() {
      let e = b.state.snapshot();
      Zr();
      let t = b.state.type,
        s = b.state.contextualKeyword;
      return b.state.restoreFromSnapshot(e), new Qr(t, s);
    }
    Ve.lookaheadTypeAndKeyword = jm;
    function E1() {
      return A1(b.state.pos);
    }
    Ve.nextTokenStart = E1;
    function A1(e) {
      Da.skipWhiteSpace.lastIndex = e;
      let t = Da.skipWhiteSpace.exec(b.input);
      return e + t[0].length;
    }
    Ve.nextTokenStartSince = A1;
    function $m() {
      return b.input.charCodeAt(E1());
    }
    Ve.lookaheadCharCode = $m;
    function P1() {
      if (
        (R1(), (b.state.start = b.state.pos), b.state.pos >= b.input.length)
      ) {
        let e = b.state.tokens;
        e.length >= 2 &&
          e[e.length - 1].start >= b.input.length &&
          e[e.length - 2].start >= b.input.length &&
          pi.unexpected.call(void 0, 'Unexpectedly reached the end of input.'),
          je(ne.TokenType.eof);
        return;
      }
      Km(b.input.charCodeAt(b.state.pos));
    }
    Ve.nextToken = P1;
    function Km(e) {
      S1.IS_IDENTIFIER_START[e] ||
      e === F.charCodes.backslash ||
      (e === F.charCodes.atSign &&
        b.input.charCodeAt(b.state.pos + 1) === F.charCodes.atSign)
        ? Im.default.call(void 0)
        : O1(e);
    }
    function qm() {
      for (
        ;
        b.input.charCodeAt(b.state.pos) !== F.charCodes.asterisk ||
        b.input.charCodeAt(b.state.pos + 1) !== F.charCodes.slash;

      )
        if ((b.state.pos++, b.state.pos > b.input.length)) {
          pi.unexpected.call(void 0, 'Unterminated comment', b.state.pos - 2);
          return;
        }
      b.state.pos += 2;
    }
    function N1(e) {
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
    Ve.skipLineComment = N1;
    function R1() {
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
                (b.state.pos += 2), qm();
                break;
              case F.charCodes.slash:
                N1(2);
                break;
              default:
                return;
            }
            break;
          default:
            if (Da.IS_WHITESPACE[e]) ++b.state.pos;
            else return;
        }
      }
    }
    Ve.skipSpace = R1;
    function je(e, t = wm.ContextualKeyword.NONE) {
      (b.state.end = b.state.pos),
        (b.state.type = e),
        (b.state.contextualKeyword = t);
    }
    Ve.finishToken = je;
    function Um() {
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e >= F.charCodes.digit0 && e <= F.charCodes.digit9) {
        D1(!0);
        return;
      }
      e === F.charCodes.dot &&
      b.input.charCodeAt(b.state.pos + 2) === F.charCodes.dot
        ? ((b.state.pos += 3), je(ne.TokenType.ellipsis))
        : (++b.state.pos, je(ne.TokenType.dot));
    }
    function Hm() {
      b.input.charCodeAt(b.state.pos + 1) === F.charCodes.equalsTo
        ? Be(ne.TokenType.assign, 2)
        : Be(ne.TokenType.slash, 1);
    }
    function Wm(e) {
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
        Be(t, s);
    }
    function Gm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === e) {
        b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo
          ? Be(ne.TokenType.assign, 3)
          : Be(
              e === F.charCodes.verticalBar
                ? ne.TokenType.logicalOR
                : ne.TokenType.logicalAND,
              2
            );
        return;
      }
      if (e === F.charCodes.verticalBar) {
        if (t === F.charCodes.greaterThan) {
          Be(ne.TokenType.pipeline, 2);
          return;
        } else if (t === F.charCodes.rightCurlyBrace && b.isFlowEnabled) {
          Be(ne.TokenType.braceBarR, 2);
          return;
        }
      }
      if (t === F.charCodes.equalsTo) {
        Be(ne.TokenType.assign, 2);
        return;
      }
      Be(
        e === F.charCodes.verticalBar
          ? ne.TokenType.bitwiseOR
          : ne.TokenType.bitwiseAND,
        1
      );
    }
    function zm() {
      b.input.charCodeAt(b.state.pos + 1) === F.charCodes.equalsTo
        ? Be(ne.TokenType.assign, 2)
        : Be(ne.TokenType.bitwiseXOR, 1);
    }
    function Xm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === e) {
        Be(ne.TokenType.preIncDec, 2);
        return;
      }
      t === F.charCodes.equalsTo
        ? Be(ne.TokenType.assign, 2)
        : e === F.charCodes.plusSign
        ? Be(ne.TokenType.plus, 1)
        : Be(ne.TokenType.minus, 1);
    }
    function Ym() {
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e === F.charCodes.lessThan) {
        if (b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo) {
          Be(ne.TokenType.assign, 3);
          return;
        }
        b.state.isType
          ? Be(ne.TokenType.lessThan, 1)
          : Be(ne.TokenType.bitShiftL, 2);
        return;
      }
      e === F.charCodes.equalsTo
        ? Be(ne.TokenType.relationalOrEqual, 2)
        : Be(ne.TokenType.lessThan, 1);
    }
    function L1() {
      if (b.state.isType) {
        Be(ne.TokenType.greaterThan, 1);
        return;
      }
      let e = b.input.charCodeAt(b.state.pos + 1);
      if (e === F.charCodes.greaterThan) {
        let t =
          b.input.charCodeAt(b.state.pos + 2) === F.charCodes.greaterThan
            ? 3
            : 2;
        if (b.input.charCodeAt(b.state.pos + t) === F.charCodes.equalsTo) {
          Be(ne.TokenType.assign, t + 1);
          return;
        }
        Be(ne.TokenType.bitShiftR, t);
        return;
      }
      e === F.charCodes.equalsTo
        ? Be(ne.TokenType.relationalOrEqual, 2)
        : Be(ne.TokenType.greaterThan, 1);
    }
    function Jm() {
      b.state.type === ne.TokenType.greaterThan && ((b.state.pos -= 1), L1());
    }
    Ve.rescan_gt = Jm;
    function Qm(e) {
      let t = b.input.charCodeAt(b.state.pos + 1);
      if (t === F.charCodes.equalsTo) {
        Be(
          ne.TokenType.equality,
          b.input.charCodeAt(b.state.pos + 2) === F.charCodes.equalsTo ? 3 : 2
        );
        return;
      }
      if (e === F.charCodes.equalsTo && t === F.charCodes.greaterThan) {
        (b.state.pos += 2), je(ne.TokenType.arrow);
        return;
      }
      Be(e === F.charCodes.equalsTo ? ne.TokenType.eq : ne.TokenType.bang, 1);
    }
    function Zm() {
      let e = b.input.charCodeAt(b.state.pos + 1),
        t = b.input.charCodeAt(b.state.pos + 2);
      e === F.charCodes.questionMark && !(b.isFlowEnabled && b.state.isType)
        ? t === F.charCodes.equalsTo
          ? Be(ne.TokenType.assign, 3)
          : Be(ne.TokenType.nullishCoalescing, 2)
        : e === F.charCodes.dot &&
          !(t >= F.charCodes.digit0 && t <= F.charCodes.digit9)
        ? ((b.state.pos += 2), je(ne.TokenType.questionDot))
        : (++b.state.pos, je(ne.TokenType.question));
    }
    function O1(e) {
      switch (e) {
        case F.charCodes.numberSign:
          ++b.state.pos, je(ne.TokenType.hash);
          return;
        case F.charCodes.dot:
          Um();
          return;
        case F.charCodes.leftParenthesis:
          ++b.state.pos, je(ne.TokenType.parenL);
          return;
        case F.charCodes.rightParenthesis:
          ++b.state.pos, je(ne.TokenType.parenR);
          return;
        case F.charCodes.semicolon:
          ++b.state.pos, je(ne.TokenType.semi);
          return;
        case F.charCodes.comma:
          ++b.state.pos, je(ne.TokenType.comma);
          return;
        case F.charCodes.leftSquareBracket:
          ++b.state.pos, je(ne.TokenType.bracketL);
          return;
        case F.charCodes.rightSquareBracket:
          ++b.state.pos, je(ne.TokenType.bracketR);
          return;
        case F.charCodes.leftCurlyBrace:
          b.isFlowEnabled &&
          b.input.charCodeAt(b.state.pos + 1) === F.charCodes.verticalBar
            ? Be(ne.TokenType.braceBarL, 2)
            : (++b.state.pos, je(ne.TokenType.braceL));
          return;
        case F.charCodes.rightCurlyBrace:
          ++b.state.pos, je(ne.TokenType.braceR);
          return;
        case F.charCodes.colon:
          b.input.charCodeAt(b.state.pos + 1) === F.charCodes.colon
            ? Be(ne.TokenType.doubleColon, 2)
            : (++b.state.pos, je(ne.TokenType.colon));
          return;
        case F.charCodes.questionMark:
          Zm();
          return;
        case F.charCodes.atSign:
          ++b.state.pos, je(ne.TokenType.at);
          return;
        case F.charCodes.graveAccent:
          ++b.state.pos, je(ne.TokenType.backQuote);
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
            tT();
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
          D1(!1);
          return;
        case F.charCodes.quotationMark:
        case F.charCodes.apostrophe:
          nT(e);
          return;
        case F.charCodes.slash:
          Hm();
          return;
        case F.charCodes.percentSign:
        case F.charCodes.asterisk:
          Wm(e);
          return;
        case F.charCodes.verticalBar:
        case F.charCodes.ampersand:
          Gm(e);
          return;
        case F.charCodes.caret:
          zm();
          return;
        case F.charCodes.plusSign:
        case F.charCodes.dash:
          Xm(e);
          return;
        case F.charCodes.lessThan:
          Ym();
          return;
        case F.charCodes.greaterThan:
          L1();
          return;
        case F.charCodes.equalsTo:
        case F.charCodes.exclamationMark:
          Qm(e);
          return;
        case F.charCodes.tilde:
          Be(ne.TokenType.tilde, 1);
          return;
        default:
          break;
      }
      pi.unexpected.call(
        void 0,
        `Unexpected character '${String.fromCharCode(e)}'`,
        b.state.pos
      );
    }
    Ve.getTokenFromCode = O1;
    function Be(e, t) {
      (b.state.pos += t), je(e);
    }
    function eT() {
      let e = b.state.pos,
        t = !1,
        s = !1;
      for (;;) {
        if (b.state.pos >= b.input.length) {
          pi.unexpected.call(void 0, 'Unterminated regular expression', e);
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
      ++b.state.pos, M1(), je(ne.TokenType.regexp);
    }
    function Oa() {
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
    function tT() {
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
        ? (++b.state.pos, je(ne.TokenType.bigint))
        : je(ne.TokenType.num);
    }
    function D1(e) {
      let t = !1,
        s = !1;
      e || Oa();
      let i = b.input.charCodeAt(b.state.pos);
      if (
        (i === F.charCodes.dot &&
          (++b.state.pos, Oa(), (i = b.input.charCodeAt(b.state.pos))),
        (i === F.charCodes.uppercaseE || i === F.charCodes.lowercaseE) &&
          ((i = b.input.charCodeAt(++b.state.pos)),
          (i === F.charCodes.plusSign || i === F.charCodes.dash) &&
            ++b.state.pos,
          Oa(),
          (i = b.input.charCodeAt(b.state.pos))),
        i === F.charCodes.lowercaseN
          ? (++b.state.pos, (t = !0))
          : i === F.charCodes.lowercaseM && (++b.state.pos, (s = !0)),
        t)
      ) {
        je(ne.TokenType.bigint);
        return;
      }
      if (s) {
        je(ne.TokenType.decimal);
        return;
      }
      je(ne.TokenType.num);
    }
    function nT(e) {
      for (b.state.pos++; ; ) {
        if (b.state.pos >= b.input.length) {
          pi.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        let t = b.input.charCodeAt(b.state.pos);
        if (t === F.charCodes.backslash) b.state.pos++;
        else if (t === e) break;
        b.state.pos++;
      }
      b.state.pos++, je(ne.TokenType.string);
    }
    function sT() {
      for (;;) {
        if (b.state.pos >= b.input.length) {
          pi.unexpected.call(void 0, 'Unterminated template');
          return;
        }
        let e = b.input.charCodeAt(b.state.pos);
        if (
          e === F.charCodes.graveAccent ||
          (e === F.charCodes.dollarSign &&
            b.input.charCodeAt(b.state.pos + 1) === F.charCodes.leftCurlyBrace)
        ) {
          if (b.state.pos === b.state.start && Ma(ne.TokenType.template))
            if (e === F.charCodes.dollarSign) {
              (b.state.pos += 2), je(ne.TokenType.dollarBraceL);
              return;
            } else {
              ++b.state.pos, je(ne.TokenType.backQuote);
              return;
            }
          je(ne.TokenType.template);
          return;
        }
        e === F.charCodes.backslash && b.state.pos++, b.state.pos++;
      }
    }
    function M1() {
      for (; b.state.pos < b.input.length; ) {
        let e = b.input.charCodeAt(b.state.pos);
        if (S1.IS_IDENTIFIER_CHAR[e]) b.state.pos++;
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
    Ve.skipWord = M1;
  });
  var Ji = Z((Fa) => {
    'use strict';
    Object.defineProperty(Fa, '__esModule', {value: !0});
    var F1 = Ce();
    function iT(e, t = e.currentIndex()) {
      let s = t + 1;
      if (eo(e, s)) {
        let i = e.identifierNameAtIndex(t);
        return {isType: !1, leftName: i, rightName: i, endIndex: s};
      }
      if ((s++, eo(e, s)))
        return {isType: !0, leftName: null, rightName: null, endIndex: s};
      if ((s++, eo(e, s)))
        return {
          isType: !1,
          leftName: e.identifierNameAtIndex(t),
          rightName: e.identifierNameAtIndex(t + 2),
          endIndex: s,
        };
      if ((s++, eo(e, s)))
        return {isType: !0, leftName: null, rightName: null, endIndex: s};
      throw new Error(`Unexpected import/export specifier at ${t}`);
    }
    Fa.default = iT;
    function eo(e, t) {
      let s = e.tokens[t];
      return s.type === F1.TokenType.braceR || s.type === F1.TokenType.comma;
    }
  });
  var B1 = Z((Ba) => {
    'use strict';
    Object.defineProperty(Ba, '__esModule', {value: !0});
    Ba.default = new Map([
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
  var ja = Z((Va) => {
    'use strict';
    Object.defineProperty(Va, '__esModule', {value: !0});
    function rT(e) {
      let [t, s] = V1(e.jsxPragma || 'React.createElement'),
        [i, r] = V1(e.jsxFragmentPragma || 'React.Fragment');
      return {base: t, suffix: s, fragmentBase: i, fragmentSuffix: r};
    }
    Va.default = rT;
    function V1(e) {
      let t = e.indexOf('.');
      return t === -1 && (t = e.length), [e.slice(0, t), e.slice(t)];
    }
  });
  var dn = Z((Ka) => {
    'use strict';
    Object.defineProperty(Ka, '__esModule', {value: !0});
    var $a = class {
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
    Ka.default = $a;
  });
  var Ha = Z((no) => {
    'use strict';
    Object.defineProperty(no, '__esModule', {value: !0});
    function Ua(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var oT = B1(),
      aT = Ua(oT),
      to = _t(),
      Le = Ce(),
      Rn = tn(),
      lT = ja(),
      cT = Ua(lT),
      uT = dn(),
      pT = Ua(uT),
      qa = class e extends pT.default {
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
            (this.jsxPragmaInfo = cT.default.call(void 0, a)),
            (this.isAutomaticRuntime = a.jsxRuntime === 'automatic'),
            (this.jsxImportSource = a.jsxImportSource || 'react');
        }
        process() {
          return this.tokens.matches1(Le.TokenType.jsxTagStart)
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
          this.isAutomaticRuntime && t !== to.JSXRole.KeyAfterPropSpread
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
          let i = s === to.JSXRole.StaticChildren;
          this.tokens.replaceToken(this.getJSXFuncInvocationCode(i));
          let r = null;
          if (this.tokens.matches1(Le.TokenType.jsxTagEnd))
            this.tokens.replaceToken(`${this.getFragmentCode()}, {`),
              this.processAutomaticChildrenAndEndProps(s);
          else {
            if (
              (this.processTagIntro(),
              this.tokens.appendCode(', {'),
              (r = this.processProps(!0)),
              this.tokens.matches2(Le.TokenType.slash, Le.TokenType.jsxTagEnd))
            )
              this.tokens.appendCode('}');
            else if (this.tokens.matches1(Le.TokenType.jsxTagEnd))
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
            !this.tokens.matches1(Le.TokenType.jsxTagEnd);

          )
            this.tokens.removeToken();
          this.tokens.replaceToken(')');
        }
        transformTagToCreateElement(t) {
          if (
            (this.tokens.replaceToken(this.getCreateElementInvocationCode()),
            this.tokens.matches1(Le.TokenType.jsxTagEnd))
          )
            this.tokens.replaceToken(`${this.getFragmentCode()}, null`),
              this.processChildren(!0);
          else if (
            (this.processTagIntro(),
            this.processPropsObjectWithDevInfo(t),
            !this.tokens.matches2(Le.TokenType.slash, Le.TokenType.jsxTagEnd))
          )
            if (this.tokens.matches1(Le.TokenType.jsxTagEnd))
              this.tokens.removeToken(), this.processChildren(!0);
            else
              throw new Error('Expected either /> or > at the end of the tag.');
          for (
            this.tokens.removeInitialToken();
            !this.tokens.matches1(Le.TokenType.jsxTagEnd);

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
              Le.TokenType.jsxName,
              Le.TokenType.jsxName
            ) &&
              !this.tokens.matches2AtIndex(
                t - 1,
                Le.TokenType.greaterThan,
                Le.TokenType.jsxName
              ) &&
              !this.tokens.matches1AtIndex(t, Le.TokenType.braceL) &&
              !this.tokens.matches1AtIndex(t, Le.TokenType.jsxTagEnd) &&
              !this.tokens.matches2AtIndex(
                t,
                Le.TokenType.slash,
                Le.TokenType.jsxTagEnd
              ));

          )
            t++;
          if (t === this.tokens.currentIndex() + 1) {
            let s = this.tokens.identifierName();
            $1(s) && this.tokens.replaceToken(`'${s}'`);
          }
          for (; this.tokens.currentIndex() < t; )
            this.rootTransformer.processToken();
        }
        processPropsObjectWithDevInfo(t) {
          let s = this.options.production
            ? ''
            : `__self: this, __source: ${this.getDevSource(t)}`;
          if (
            !this.tokens.matches1(Le.TokenType.jsxName) &&
            !this.tokens.matches1(Le.TokenType.braceL)
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
            if (this.tokens.matches2(Le.TokenType.jsxName, Le.TokenType.eq)) {
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
            } else if (this.tokens.matches1(Le.TokenType.jsxName)) {
              let i = this.tokens.identifierName();
              this.processPropName(i), this.tokens.appendCode(': true');
            } else if (this.tokens.matches1(Le.TokenType.braceL))
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
          this.tokens.matches1(Le.TokenType.braceL)
            ? (this.tokens.replaceToken(''),
              this.rootTransformer.processBalancedCode(),
              this.tokens.replaceToken(''))
            : this.tokens.matches1(Le.TokenType.jsxTagStart)
            ? this.processJSXTag()
            : this.processStringPropValue();
        }
        processStringPropValue() {
          let t = this.tokens.currentToken(),
            s = this.tokens.code.slice(t.start + 1, t.end - 1),
            i = j1(s),
            r = fT(s);
          this.tokens.replaceToken(r + i);
        }
        processAutomaticChildrenAndEndProps(t) {
          t === to.JSXRole.StaticChildren
            ? (this.tokens.appendCode(' children: ['),
              this.processChildren(!1),
              this.tokens.appendCode(']}'))
            : (t === to.JSXRole.OneChild &&
                this.tokens.appendCode(' children: '),
              this.processChildren(!1),
              this.tokens.appendCode('}'));
        }
        processChildren(t) {
          let s = t;
          for (;;) {
            if (
              this.tokens.matches2(Le.TokenType.jsxTagStart, Le.TokenType.slash)
            )
              return;
            let i = !1;
            if (this.tokens.matches1(Le.TokenType.braceL))
              this.tokens.matches2(Le.TokenType.braceL, Le.TokenType.braceR)
                ? (this.tokens.replaceToken(''), this.tokens.replaceToken(''))
                : (this.tokens.replaceToken(s ? ', ' : ''),
                  this.rootTransformer.processBalancedCode(),
                  this.tokens.replaceToken(''),
                  (i = !0));
            else if (this.tokens.matches1(Le.TokenType.jsxTagStart))
              this.tokens.appendCode(s ? ', ' : ''),
                this.processJSXTag(),
                (i = !0);
            else if (
              this.tokens.matches1(Le.TokenType.jsxText) ||
              this.tokens.matches1(Le.TokenType.jsxEmptyText)
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
            r = j1(i),
            a = hT(i);
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
    no.default = qa;
    function $1(e) {
      let t = e.charCodeAt(0);
      return t >= Rn.charCodes.lowercaseA && t <= Rn.charCodes.lowercaseZ;
    }
    no.startsWithLowerCase = $1;
    function hT(e) {
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
            let {entity: d, newI: v} = K1(e, a + 1);
            (a = v - 1), (t += d);
          } else t += u;
          (r = !0), (i = !1);
        }
      }
      return i || (t += s), JSON.stringify(t);
    }
    function j1(e) {
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
    function fT(e) {
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
          let {entity: r, newI: a} = K1(e, s + 1);
          (t += r), (s = a - 1);
        } else t += i;
      }
      return JSON.stringify(t);
    }
    function K1(e, t) {
      let s = '',
        i = 0,
        r,
        a = t;
      if (e[a] === '#') {
        let u = 10;
        a++;
        let d;
        if (e[a] === 'x')
          for (u = 16, a++, d = a; a < e.length && mT(e.charCodeAt(a)); ) a++;
        else for (d = a; a < e.length && dT(e.charCodeAt(a)); ) a++;
        if (e[a] === ';') {
          let v = e.slice(d, a);
          v && (a++, (r = String.fromCodePoint(parseInt(v, u))));
        }
      } else
        for (; a < e.length && i++ < 10; ) {
          let u = e[a];
          if ((a++, u === ';')) {
            r = aT.default.get(s);
            break;
          }
          s += u;
        }
      return r ? {entity: r, newI: a} : {entity: '&', newI: t};
    }
    function dT(e) {
      return e >= Rn.charCodes.digit0 && e <= Rn.charCodes.digit9;
    }
    function mT(e) {
      return (
        (e >= Rn.charCodes.digit0 && e <= Rn.charCodes.digit9) ||
        (e >= Rn.charCodes.lowercaseA && e <= Rn.charCodes.lowercaseF) ||
        (e >= Rn.charCodes.uppercaseA && e <= Rn.charCodes.uppercaseF)
      );
    }
  });
  var Ga = Z((Wa) => {
    'use strict';
    Object.defineProperty(Wa, '__esModule', {value: !0});
    function TT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var so = _t(),
      hi = Ce(),
      yT = Ha(),
      kT = ja(),
      vT = TT(kT);
    function xT(e, t) {
      let s = vT.default.call(void 0, t),
        i = new Set();
      for (let r = 0; r < e.tokens.length; r++) {
        let a = e.tokens[r];
        if (
          (a.type === hi.TokenType.name &&
            !a.isType &&
            (a.identifierRole === so.IdentifierRole.Access ||
              a.identifierRole === so.IdentifierRole.ObjectShorthand ||
              a.identifierRole === so.IdentifierRole.ExportAccess) &&
            !a.shadowsGlobal &&
            i.add(e.identifierNameForToken(a)),
          a.type === hi.TokenType.jsxTagStart && i.add(s.base),
          a.type === hi.TokenType.jsxTagStart &&
            r + 1 < e.tokens.length &&
            e.tokens[r + 1].type === hi.TokenType.jsxTagEnd &&
            (i.add(s.base), i.add(s.fragmentBase)),
          a.type === hi.TokenType.jsxName &&
            a.identifierRole === so.IdentifierRole.Access)
        ) {
          let u = e.identifierNameForToken(a);
          (!yT.startsWithLowerCase.call(void 0, u) ||
            e.tokens[r + 1].type === hi.TokenType.dot) &&
            i.add(e.identifierNameForToken(a));
        }
      }
      return i;
    }
    Wa.getNonTypeIdentifiers = xT;
  });
  var q1 = Z((Xa) => {
    'use strict';
    Object.defineProperty(Xa, '__esModule', {value: !0});
    function gT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var _T = _t(),
      io = Et(),
      Te = Ce(),
      bT = Ji(),
      CT = gT(bT),
      wT = Ga(),
      za = class e {
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
            this.tokens.matches1AtIndex(t, Te.TokenType._import) &&
              !this.tokens.matches3AtIndex(
                t,
                Te.TokenType._import,
                Te.TokenType.name,
                Te.TokenType.eq
              ) &&
              this.preprocessImportAtIndex(t),
              this.tokens.matches1AtIndex(t, Te.TokenType._export) &&
                !this.tokens.matches2AtIndex(
                  t,
                  Te.TokenType._export,
                  Te.TokenType.eq
                ) &&
                this.preprocessExportAtIndex(t);
          this.generateImportReplacements();
        }
        pruneTypeOnlyImports() {
          this.nonTypeIdentifiers = wT.getNonTypeIdentifiers.call(
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
              hasStarExport: v,
            } = s;
            if (
              i.length === 0 &&
              r.length === 0 &&
              a.length === 0 &&
              u.length === 0 &&
              d.length === 0 &&
              !v
            ) {
              this.importsToReplace.set(t, `require('${t}');`);
              continue;
            }
            let g = this.getFreeIdentifierForPath(t),
              O;
            this.enableLegacyTypeScriptModuleInterop
              ? (O = g)
              : (O = r.length > 0 ? r[0] : this.getFreeIdentifierForPath(t));
            let p = `var ${g} = require('${t}');`;
            if (r.length > 0)
              for (let f of r) {
                let T = this.enableLegacyTypeScriptModuleInterop
                  ? g
                  : `${this.helperManager.getHelperName(
                      'interopRequireWildcard'
                    )}(${g})`;
                p += ` var ${f} = ${T};`;
              }
            else
              d.length > 0 && O !== g
                ? (p += ` var ${O} = ${this.helperManager.getHelperName(
                    'interopRequireWildcard'
                  )}(${g});`)
                : i.length > 0 &&
                  O !== g &&
                  (p += ` var ${O} = ${this.helperManager.getHelperName(
                    'interopRequireDefault'
                  )}(${g});`);
            for (let {importedName: f, localName: T} of u)
              p += ` ${this.helperManager.getHelperName(
                'createNamedExportFrom'
              )}(${g}, '${T}', '${f}');`;
            for (let f of d) p += ` exports.${f} = ${O};`;
            v &&
              (p += ` ${this.helperManager.getHelperName(
                'createStarExport'
              )}(${g});`),
              this.importsToReplace.set(t, p);
            for (let f of i) this.identifierReplacements.set(f, `${O}.default`);
            for (let {importedName: f, localName: T} of a)
              this.identifierReplacements.set(T, `${g}.${f}`);
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
              io.ContextualKeyword._type
            ) ||
              this.tokens.matches1AtIndex(t, Te.TokenType._typeof)) &&
              !this.tokens.matches1AtIndex(t + 1, Te.TokenType.comma) &&
              !this.tokens.matchesContextualAtIndex(
                t + 1,
                io.ContextualKeyword._from
              )) ||
              this.tokens.matches1AtIndex(t, Te.TokenType.parenL))
          )
            return;
          if (
            (this.tokens.matches1AtIndex(t, Te.TokenType.name) &&
              (s.push(this.tokens.identifierNameAtIndex(t)),
              t++,
              this.tokens.matches1AtIndex(t, Te.TokenType.comma) && t++),
            this.tokens.matches1AtIndex(t, Te.TokenType.star) &&
              ((t += 2), i.push(this.tokens.identifierNameAtIndex(t)), t++),
            this.tokens.matches1AtIndex(t, Te.TokenType.braceL))
          ) {
            let d = this.getNamedImports(t + 1);
            t = d.newIndex;
            for (let v of d.namedImports)
              v.importedName === 'default' ? s.push(v.localName) : r.push(v);
          }
          if (
            (this.tokens.matchesContextualAtIndex(
              t,
              io.ContextualKeyword._from
            ) && t++,
            !this.tokens.matches1AtIndex(t, Te.TokenType.string))
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
              Te.TokenType._export,
              Te.TokenType._var
            ) ||
            this.tokens.matches2AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType._let
            ) ||
            this.tokens.matches2AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType._const
            )
          )
            this.preprocessVarExportAtIndex(t);
          else if (
            this.tokens.matches2AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType._function
            ) ||
            this.tokens.matches2AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType._class
            )
          ) {
            let s = this.tokens.identifierNameAtIndex(t + 2);
            this.addExportBinding(s, s);
          } else if (
            this.tokens.matches3AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType.name,
              Te.TokenType._function
            )
          ) {
            let s = this.tokens.identifierNameAtIndex(t + 3);
            this.addExportBinding(s, s);
          } else
            this.tokens.matches2AtIndex(
              t,
              Te.TokenType._export,
              Te.TokenType.braceL
            )
              ? this.preprocessNamedExportAtIndex(t)
              : this.tokens.matches2AtIndex(
                  t,
                  Te.TokenType._export,
                  Te.TokenType.star
                ) && this.preprocessExportStarAtIndex(t);
        }
        preprocessVarExportAtIndex(t) {
          let s = 0;
          for (let i = t + 2; ; i++)
            if (
              this.tokens.matches1AtIndex(i, Te.TokenType.braceL) ||
              this.tokens.matches1AtIndex(i, Te.TokenType.dollarBraceL) ||
              this.tokens.matches1AtIndex(i, Te.TokenType.bracketL)
            )
              s++;
            else if (
              this.tokens.matches1AtIndex(i, Te.TokenType.braceR) ||
              this.tokens.matches1AtIndex(i, Te.TokenType.bracketR)
            )
              s--;
            else {
              if (s === 0 && !this.tokens.matches1AtIndex(i, Te.TokenType.name))
                break;
              if (this.tokens.matches1AtIndex(1, Te.TokenType.eq)) {
                let r = this.tokens.currentToken().rhsEndIndex;
                if (r == null)
                  throw new Error('Expected = token with an end index.');
                i = r - 1;
              } else {
                let r = this.tokens.tokens[i];
                if (_T.isDeclaration.call(void 0, r)) {
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
            this.tokens.matchesContextualAtIndex(t, io.ContextualKeyword._from))
          )
            t++;
          else {
            for (let {importedName: u, localName: d} of i)
              this.addExportBinding(u, d);
            return;
          }
          if (!this.tokens.matches1AtIndex(t, Te.TokenType.string))
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
              Te.TokenType._export,
              Te.TokenType.star,
              Te.TokenType._as
            )
              ? ((t += 3), (s = this.tokens.identifierNameAtIndex(t)), (t += 2))
              : (t += 3),
            !this.tokens.matches1AtIndex(t, Te.TokenType.string))
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
            if (this.tokens.matches1AtIndex(t, Te.TokenType.braceR)) {
              t++;
              break;
            }
            let i = CT.default.call(void 0, this.tokens, t);
            if (
              ((t = i.endIndex),
              i.isType ||
                s.push({importedName: i.leftName, localName: i.rightName}),
              this.tokens.matches2AtIndex(
                t,
                Te.TokenType.comma,
                Te.TokenType.braceR
              ))
            ) {
              t += 2;
              break;
            } else if (this.tokens.matches1AtIndex(t, Te.TokenType.braceR)) {
              t++;
              break;
            } else if (this.tokens.matches1AtIndex(t, Te.TokenType.comma)) t++;
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
    Xa.default = za;
  });
  var H1 = Z((ro, U1) => {
    (function (e, t) {
      typeof ro == 'object' && typeof U1 < 'u'
        ? t(ro)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.setArray = {})));
    })(ro, function (e) {
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
  var Ya = Z((oo, W1) => {
    (function (e, t) {
      typeof oo == 'object' && typeof W1 < 'u'
        ? t(oo)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.sourcemapCodec = {})));
    })(oo, function (e) {
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
          q = 0;
        do {
          let M = v(w, q),
            c = [],
            R = !0,
            W = 0;
          S[0] = 0;
          for (let X = q; X < M; X++) {
            let ie;
            X = g(w, X, S, 0);
            let he = S[0];
            he < W && (R = !1),
              (W = he),
              O(w, X, M)
                ? ((X = g(w, X, S, 1)),
                  (X = g(w, X, S, 2)),
                  (X = g(w, X, S, 3)),
                  O(w, X, M)
                    ? ((X = g(w, X, S, 4)), (ie = [he, S[1], S[2], S[3], S[4]]))
                    : (ie = [he, S[1], S[2], S[3]]))
                : (ie = [he]),
              c.push(ie);
          }
          R || p(c), A.push(c), (q = M + 1);
        } while (q <= w.length);
        return A;
      }
      function v(w, S) {
        let A = w.indexOf(';', S);
        return A === -1 ? w.length : A;
      }
      function g(w, S, A, q) {
        let M = 0,
          c = 0,
          R = 0;
        do {
          let X = w.charCodeAt(S++);
          (R = a[X]), (M |= (R & 31) << c), (c += 5);
        } while (R & 32);
        let W = M & 1;
        return (M >>>= 1), W && (M = -2147483648 | -M), (A[q] += M), S;
      }
      function O(w, S, A) {
        return S >= A ? !1 : w.charCodeAt(S) !== 44;
      }
      function p(w) {
        w.sort(f);
      }
      function f(w, S) {
        return w[0] - S[0];
      }
      function T(w) {
        let S = new Int32Array(5),
          A = 1024 * 16,
          q = A - 36,
          M = new Uint8Array(A),
          c = M.subarray(0, q),
          R = 0,
          W = '';
        for (let X = 0; X < w.length; X++) {
          let ie = w[X];
          if (
            (X > 0 && (R === A && ((W += u.decode(M)), (R = 0)), (M[R++] = 59)),
            ie.length !== 0)
          ) {
            S[0] = 0;
            for (let he = 0; he < ie.length; he++) {
              let ae = ie[he];
              R > q && ((W += u.decode(c)), M.copyWithin(0, q, R), (R -= q)),
                he > 0 && (M[R++] = 44),
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
      function x(w, S, A, q, M) {
        let c = q[M],
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
  var G1 = Z((Ja, Qa) => {
    (function (e, t) {
      typeof Ja == 'object' && typeof Qa < 'u'
        ? (Qa.exports = t())
        : typeof define == 'function' && define.amd
        ? define(t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          (e.resolveURI = t()));
    })(Ja, function () {
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
      function v(A) {
        return /^[.?#]/.test(A);
      }
      function g(A) {
        let q = t.exec(A);
        return p(
          q[1],
          q[2] || '',
          q[3],
          q[4] || '',
          q[5] || '/',
          q[6] || '',
          q[7] || ''
        );
      }
      function O(A) {
        let q = s.exec(A),
          M = q[2];
        return p(
          'file:',
          '',
          q[1] || '',
          '',
          u(M) ? M : '/' + M,
          q[3] || '',
          q[4] || ''
        );
      }
      function p(A, q, M, c, R, W, X) {
        return {
          scheme: A,
          user: q,
          host: M,
          port: c,
          path: R,
          query: W,
          hash: X,
          type: i.Absolute,
        };
      }
      function f(A) {
        if (a(A)) {
          let M = g('http:' + A);
          return (M.scheme = ''), (M.type = i.SchemeRelative), M;
        }
        if (u(A)) {
          let M = g('http://foo.com' + A);
          return (M.scheme = ''), (M.host = ''), (M.type = i.AbsolutePath), M;
        }
        if (d(A)) return O(A);
        if (r(A)) return g(A);
        let q = g('http://foo.com/' + A);
        return (
          (q.scheme = ''),
          (q.host = ''),
          (q.type = A
            ? A.startsWith('?')
              ? i.Query
              : A.startsWith('#')
              ? i.Hash
              : i.RelativePath
            : i.Empty),
          q
        );
      }
      function T(A) {
        if (A.endsWith('/..')) return A;
        let q = A.lastIndexOf('/');
        return A.slice(0, q + 1);
      }
      function x(A, q) {
        w(q, q.type),
          A.path === '/' ? (A.path = q.path) : (A.path = T(q.path) + A.path);
      }
      function w(A, q) {
        let M = q <= i.RelativePath,
          c = A.path.split('/'),
          R = 1,
          W = 0,
          X = !1;
        for (let he = 1; he < c.length; he++) {
          let ae = c[he];
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
        for (let he = 1; he < R; he++) ie += '/' + c[he];
        (!ie || (X && !ie.endsWith('/..'))) && (ie += '/'), (A.path = ie);
      }
      function S(A, q) {
        if (!A && !q) return '';
        let M = f(A),
          c = M.type;
        if (q && c !== i.Absolute) {
          let W = f(q),
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
            return W ? (v(q || A) && !v(W) ? './' + W + R : W + R) : R || '.';
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
  var X1 = Z((ao, z1) => {
    (function (e, t) {
      typeof ao == 'object' && typeof z1 < 'u'
        ? t(ao, Ya(), G1())
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
    })(ao, function (e, t, s) {
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
        v = 1,
        g = 2,
        O = 3,
        p = 4,
        f = 1,
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
        return G || (V = V.slice()), V.sort(q);
      }
      function q(V, G) {
        return V[d] - G[d];
      }
      let M = !1;
      function c(V, G, J, re) {
        for (; J <= re; ) {
          let xe = J + ((re - J) >> 1),
            fe = V[xe][d] - G;
          if (fe === 0) return (M = !0), xe;
          fe < 0 ? (J = xe + 1) : (re = xe - 1);
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
        let {lastKey: xe, lastNeedle: fe, lastIndex: Ee} = J,
          Ae = 0,
          Oe = V.length - 1;
        if (re === xe) {
          if (G === fe) return (M = Ee !== -1 && V[Ee][d] === G), Ee;
          G >= fe ? (Ae = Ee === -1 ? 0 : Ee) : (Oe = Ee);
        }
        return (
          (J.lastKey = re), (J.lastNeedle = G), (J.lastIndex = c(V, G, Ae, Oe))
        );
      }
      function he(V, G) {
        let J = G.map(We);
        for (let re = 0; re < V.length; re++) {
          let xe = V[re];
          for (let fe = 0; fe < xe.length; fe++) {
            let Ee = xe[fe];
            if (Ee.length === 1) continue;
            let Ae = Ee[v],
              Oe = Ee[g],
              Ye = Ee[O],
              Ge = J[Ae],
              Ue = Ge[Oe] || (Ge[Oe] = []),
              pt = G[Ae],
              ht = R(Ue, Ye, ie(Ue, Ye, pt, Oe));
            ae(Ue, (pt.lastIndex = ht + 1), [Ye, re, Ee[d]]);
          }
        }
        return J;
      }
      function ae(V, G, J) {
        for (let re = V.length; re > G; re--) V[re] = V[re - 1];
        V[G] = J;
      }
      function We() {
        return {__proto__: null};
      }
      let qe = function (V, G) {
        let J = typeof V == 'string' ? JSON.parse(V) : V;
        if (!('sections' in J)) return new St(J, G);
        let re = [],
          xe = [],
          fe = [],
          Ee = [];
        Bt(J, G, re, xe, fe, Ee, 0, 0, 1 / 0, 1 / 0);
        let Ae = {
          version: 3,
          file: J.file,
          names: Ee,
          sources: xe,
          sourcesContent: fe,
          mappings: re,
        };
        return e.presortedDecodedMap(Ae);
      };
      function Bt(V, G, J, re, xe, fe, Ee, Ae, Oe, Ye) {
        let {sections: Ge} = V;
        for (let Ue = 0; Ue < Ge.length; Ue++) {
          let {map: pt, offset: ht} = Ge[Ue],
            wt = Oe,
            yt = Ye;
          if (Ue + 1 < Ge.length) {
            let xt = Ge[Ue + 1].offset;
            (wt = Math.min(Oe, Ee + xt.line)),
              wt === Oe
                ? (yt = Math.min(Ye, Ae + xt.column))
                : wt < Oe && (yt = Ae + xt.column);
          }
          Tt(pt, G, J, re, xe, fe, Ee + ht.line, Ae + ht.column, wt, yt);
        }
      }
      function Tt(V, G, J, re, xe, fe, Ee, Ae, Oe, Ye) {
        if ('sections' in V) return Bt(...arguments);
        let Ge = new St(V, G),
          Ue = re.length,
          pt = fe.length,
          ht = e.decodedMappings(Ge),
          {resolvedSources: wt, sourcesContent: yt} = Ge;
        if ((vt(re, wt), vt(fe, Ge.names), yt)) vt(xe, yt);
        else for (let xt = 0; xt < wt.length; xt++) xe.push(null);
        for (let xt = 0; xt < ht.length; xt++) {
          let Cn = Ee + xt;
          if (Cn > Oe) return;
          let Bn = Pt(J, Cn),
            ze = xt === 0 ? Ae : 0,
            It = ht[xt];
          for (let at = 0; at < It.length; at++) {
            let Xt = It[at],
              Yt = ze + Xt[d];
            if (Cn === Oe && Yt >= Ye) return;
            if (Xt.length === 1) {
              Bn.push([Yt]);
              continue;
            }
            let te = Ue + Xt[v],
              wn = Xt[g],
              is = Xt[O];
            Bn.push(
              Xt.length === 4 ? [Yt, te, wn, is] : [Yt, te, wn, is, pt + Xt[p]]
            );
          }
        }
      }
      function vt(V, G) {
        for (let J = 0; J < G.length; J++) V.push(G[J]);
      }
      function Pt(V, G) {
        for (let J = V.length; J <= G; J++) V[J] = [];
        return V[G];
      }
      let nt = '`line` must be greater than 0 (lines start at line 1)',
        st =
          '`column` must be greater than or equal to 0 (columns start at column 0)',
        Ct = -1,
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
      class St {
        constructor(G, J) {
          let re = typeof G == 'string';
          if (!re && G._decodedMemo) return G;
          let xe = re ? JSON.parse(G) : G,
            {
              version: fe,
              file: Ee,
              names: Ae,
              sourceRoot: Oe,
              sources: Ye,
              sourcesContent: Ge,
            } = xe;
          (this.version = fe),
            (this.file = Ee),
            (this.names = Ae),
            (this.sourceRoot = Oe),
            (this.sources = Ye),
            (this.sourcesContent = Ge);
          let Ue = a(Oe || '', u(J));
          this.resolvedSources = Ye.map((ht) => a(ht || '', Ue));
          let {mappings: pt} = xe;
          typeof pt == 'string'
            ? ((this._encoded = pt), (this._decoded = void 0))
            : ((this._encoded = void 0), (this._decoded = x(pt, re))),
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
          return G >= re.length ? null : vn(re[G], V._decodedMemo, G, J, ut);
        }),
        (e.originalPositionFor = (V, {line: G, column: J, bias: re}) => {
          if ((G--, G < 0)) throw new Error(nt);
          if (J < 0) throw new Error(st);
          let xe = e.decodedMappings(V);
          if (G >= xe.length) return Nt(null, null, null, null);
          let fe = vn(xe[G], V._decodedMemo, G, J, re || ut);
          if (fe == null || fe.length == 1) return Nt(null, null, null, null);
          let {names: Ee, resolvedSources: Ae} = V;
          return Nt(
            Ae[fe[v]],
            fe[g] + 1,
            fe[O],
            fe.length === 5 ? Ee[fe[p]] : null
          );
        }),
        (e.generatedPositionFor = (
          V,
          {source: G, line: J, column: re, bias: xe}
        ) => {
          if ((J--, J < 0)) throw new Error(nt);
          if (re < 0) throw new Error(st);
          let {sources: fe, resolvedSources: Ee} = V,
            Ae = fe.indexOf(G);
          if ((Ae === -1 && (Ae = Ee.indexOf(G)), Ae === -1))
            return Ut(null, null);
          let Oe =
              V._bySources ||
              (V._bySources = he(
                e.decodedMappings(V),
                (V._bySourceMemos = fe.map(X))
              )),
            Ye = V._bySourceMemos,
            Ge = Oe[Ae][J];
          if (Ge == null) return Ut(null, null);
          let Ue = vn(Ge, Ye[Ae], J, re, xe || ut);
          return Ue == null ? Ut(null, null) : Ut(Ue[f] + 1, Ue[T]);
        }),
        (e.eachMapping = (V, G) => {
          let J = e.decodedMappings(V),
            {names: re, resolvedSources: xe} = V;
          for (let fe = 0; fe < J.length; fe++) {
            let Ee = J[fe];
            for (let Ae = 0; Ae < Ee.length; Ae++) {
              let Oe = Ee[Ae],
                Ye = fe + 1,
                Ge = Oe[0],
                Ue = null,
                pt = null,
                ht = null,
                wt = null;
              Oe.length !== 1 &&
                ((Ue = xe[Oe[1]]), (pt = Oe[2] + 1), (ht = Oe[3])),
                Oe.length === 5 && (wt = re[Oe[4]]),
                G({
                  generatedLine: Ye,
                  generatedColumn: Ge,
                  source: Ue,
                  originalLine: pt,
                  originalColumn: ht,
                  name: wt,
                });
            }
          }
        }),
        (e.sourceContentFor = (V, G) => {
          let {sources: J, resolvedSources: re, sourcesContent: xe} = V;
          if (xe == null) return null;
          let fe = J.indexOf(G);
          return fe === -1 && (fe = re.indexOf(G)), fe === -1 ? null : xe[fe];
        }),
        (e.presortedDecodedMap = (V, G) => {
          let J = new St(qt(V, []), G);
          return (J._decoded = V.mappings), J;
        }),
        (e.decodedMap = (V) => qt(V, e.decodedMappings(V))),
        (e.encodedMap = (V) => qt(V, e.encodedMappings(V)));
      function qt(V, G) {
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
      function Nt(V, G, J, re) {
        return {source: V, line: G, column: J, name: re};
      }
      function Ut(V, G) {
        return {line: V, column: G};
      }
      function vn(V, G, J, re, xe) {
        let fe = ie(V, re, G, J);
        return (
          M ? (fe = (xe === Ct ? R : W)(V, re, fe)) : xe === Ct && fe++,
          fe === -1 || fe === V.length ? null : V[fe]
        );
      }
      (e.AnyMap = qe),
        (e.GREATEST_LOWER_BOUND = ut),
        (e.LEAST_UPPER_BOUND = Ct),
        (e.TraceMap = St),
        Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var J1 = Z((lo, Y1) => {
    (function (e, t) {
      typeof lo == 'object' && typeof Y1 < 'u'
        ? t(lo, H1(), Ya(), X1())
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
    })(lo, function (e, t, s, i) {
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
      let O;
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
      (e.addSegment = (c, R, W, X, ie, he, ae, We) =>
        O(!1, c, R, W, X, ie, he, ae, We)),
        (e.maybeAddSegment = (c, R, W, X, ie, he, ae, We) =>
          O(!0, c, R, W, X, ie, he, ae, We)),
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
            _sourcesContent: he,
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
              sourcesContent: he,
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
          for (let he = 0; he < W.length; he++) {
            let ae = W[he];
            for (let We = 0; We < ae.length; We++) {
              let qe = ae[We],
                Bt = {line: he + 1, column: qe[0]},
                Tt,
                vt,
                Pt;
              qe.length !== 1 &&
                ((Tt = X.array[qe[1]]),
                (vt = {line: qe[2] + 1, column: qe[3]}),
                qe.length === 5 && (Pt = ie.array[qe[4]])),
                R.push({generated: Bt, source: Tt, original: vt, name: Pt});
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
        (O = (c, R, W, X, ie, he, ae, We, qe) => {
          let {
              _mappings: Bt,
              _sources: Tt,
              _sourcesContent: vt,
              _names: Pt,
            } = R,
            nt = f(Bt, W),
            st = T(nt, X);
          if (!ie) return c && A(nt, st) ? void 0 : x(nt, st, [X]);
          let Ct = t.put(Tt, ie),
            ut = We ? t.put(Pt, We) : -1;
          if (
            (Ct === vt.length && (vt[Ct] = qe ?? null),
            !(c && q(nt, st, Ct, he, ae, ut)))
          )
            return x(nt, st, We ? [X, Ct, he, ae, ut] : [X, Ct, he, ae]);
        });
      function f(c, R) {
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
      function q(c, R, W, X, ie, he) {
        if (R === 0) return !1;
        let ae = c[R - 1];
        return ae.length === 1
          ? !1
          : W === ae[1] &&
              X === ae[2] &&
              ie === ae[3] &&
              he === (ae.length === 5 ? ae[4] : -1);
      }
      function M(c, R, W) {
        let {generated: X, source: ie, original: he, name: ae, content: We} = W;
        if (!ie)
          return O(c, R, X.line - 1, X.column, null, null, null, null, null);
        let qe = ie;
        return O(
          c,
          R,
          X.line - 1,
          X.column,
          qe,
          he.line - 1,
          he.column,
          ae,
          We
        );
      }
      (e.GenMapping = p), Object.defineProperty(e, '__esModule', {value: !0});
    });
  });
  var Z1 = Z((Za) => {
    'use strict';
    Object.defineProperty(Za, '__esModule', {value: !0});
    var Qi = J1(),
      Q1 = tn();
    function ST({code: e, mappings: t}, s, i, r, a) {
      let u = IT(r, a),
        d = new Qi.GenMapping({file: i.compiledFilename}),
        v = 0,
        g = t[0];
      for (; g === void 0 && v < t.length - 1; ) v++, (g = t[v]);
      let O = 0,
        p = 0;
      g !== p && Qi.maybeAddSegment.call(void 0, d, O, 0, s, O, 0);
      for (let w = 0; w < e.length; w++) {
        if (w === g) {
          let S = g - p,
            A = u[v];
          for (
            Qi.maybeAddSegment.call(void 0, d, O, S, s, O, A);
            (g === w || g === void 0) && v < t.length - 1;

          )
            v++, (g = t[v]);
        }
        e.charCodeAt(w) === Q1.charCodes.lineFeed &&
          (O++,
          (p = w + 1),
          g !== p && Qi.maybeAddSegment.call(void 0, d, O, 0, s, O, 0));
      }
      let {
        sourceRoot: f,
        sourcesContent: T,
        ...x
      } = Qi.toEncodedMap.call(void 0, d);
      return x;
    }
    Za.default = ST;
    function IT(e, t) {
      let s = new Array(t.length),
        i = 0,
        r = t[i].start,
        a = 0;
      for (let u = 0; u < e.length; u++)
        u === r && ((s[i] = r - a), i++, (r = t[i].start)),
          e.charCodeAt(u) === Q1.charCodes.lineFeed && (a = u + 1);
      return s;
    }
  });
  var ep = Z((tl) => {
    'use strict';
    Object.defineProperty(tl, '__esModule', {value: !0});
    var ET = {
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
      el = class e {
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
          for (let [s, i] of Object.entries(ET)) {
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
    tl.HelperManager = el;
  });
  var sp = Z((uo) => {
    'use strict';
    Object.defineProperty(uo, '__esModule', {value: !0});
    var nl = _t(),
      co = Ce();
    function AT(e, t, s) {
      np(e, s) && PT(e, t, s);
    }
    uo.default = AT;
    function np(e, t) {
      for (let s of e.tokens)
        if (
          s.type === co.TokenType.name &&
          nl.isNonTopLevelDeclaration.call(void 0, s) &&
          t.has(e.identifierNameForToken(s))
        )
          return !0;
      return !1;
    }
    uo.hasShadowedGlobals = np;
    function PT(e, t, s) {
      let i = [],
        r = t.length - 1;
      for (let a = e.tokens.length - 1; ; a--) {
        for (; i.length > 0 && i[i.length - 1].startTokenIndex === a + 1; )
          i.pop();
        for (; r >= 0 && t[r].endTokenIndex === a + 1; ) i.push(t[r]), r--;
        if (a < 0) break;
        let u = e.tokens[a],
          d = e.identifierNameForToken(u);
        if (i.length > 1 && u.type === co.TokenType.name && s.has(d)) {
          if (nl.isBlockScopedDeclaration.call(void 0, u))
            tp(i[i.length - 1], e, d);
          else if (nl.isFunctionScopedDeclaration.call(void 0, u)) {
            let v = i.length - 1;
            for (; v > 0 && !i[v].isFunctionScope; ) v--;
            if (v < 0) throw new Error('Did not find parent function scope.');
            tp(i[v], e, d);
          }
        }
      }
      if (i.length > 0)
        throw new Error('Expected empty scope stack after processing file.');
    }
    function tp(e, t, s) {
      for (let i = e.startTokenIndex; i < e.endTokenIndex; i++) {
        let r = t.tokens[i];
        (r.type === co.TokenType.name || r.type === co.TokenType.jsxName) &&
          t.identifierNameForToken(r) === s &&
          (r.shadowsGlobal = !0);
      }
    }
  });
  var ip = Z((sl) => {
    'use strict';
    Object.defineProperty(sl, '__esModule', {value: !0});
    var NT = Ce();
    function RT(e, t) {
      let s = [];
      for (let i of t)
        i.type === NT.TokenType.name && s.push(e.slice(i.start, i.end));
      return s;
    }
    sl.default = RT;
  });
  var rp = Z((rl) => {
    'use strict';
    Object.defineProperty(rl, '__esModule', {value: !0});
    function LT(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var OT = ip(),
      DT = LT(OT),
      il = class e {
        __init() {
          this.usedNames = new Set();
        }
        constructor(t, s) {
          e.prototype.__init.call(this),
            (this.usedNames = new Set(DT.default.call(void 0, t, s)));
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
    rl.default = il;
  });
  var po = Z((Ln) => {
    'use strict';
    var MT =
      (Ln && Ln.__extends) ||
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
    Object.defineProperty(Ln, '__esModule', {value: !0});
    Ln.DetailContext = Ln.NoopContext = Ln.VError = void 0;
    var op = (function (e) {
      MT(t, e);
      function t(s, i) {
        var r = e.call(this, i) || this;
        return (r.path = s), Object.setPrototypeOf(r, t.prototype), r;
      }
      return t;
    })(Error);
    Ln.VError = op;
    var FT = (function () {
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
    Ln.NoopContext = FT;
    var ap = (function () {
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
          return new BT();
        }),
        (e.prototype.resolveUnion = function (t) {
          for (
            var s, i, r = t, a = null, u = 0, d = r.contexts;
            u < d.length;
            u++
          ) {
            var v = d[u];
            (!a || v._score >= a._score) && (a = v);
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
          return new op(t, s.join('; '));
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
    Ln.DetailContext = ap;
    var BT = (function () {
      function e() {
        this.contexts = [];
      }
      return (
        (e.prototype.createContext = function () {
          var t = new ap();
          return this.contexts.push(t), t;
        }),
        e
      );
    })();
  });
  var fl = Z((ue) => {
    'use strict';
    var on =
      (ue && ue.__extends) ||
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
    Object.defineProperty(ue, '__esModule', {value: !0});
    ue.basicTypes =
      ue.BasicType =
      ue.TParamList =
      ue.TParam =
      ue.param =
      ue.TFunc =
      ue.func =
      ue.TProp =
      ue.TOptional =
      ue.opt =
      ue.TIface =
      ue.iface =
      ue.TEnumLiteral =
      ue.enumlit =
      ue.TEnumType =
      ue.enumtype =
      ue.TIntersection =
      ue.intersection =
      ue.TUnion =
      ue.union =
      ue.TTuple =
      ue.tuple =
      ue.TArray =
      ue.array =
      ue.TLiteral =
      ue.lit =
      ue.TName =
      ue.name =
      ue.TType =
        void 0;
    var up = po(),
      Wt = (function () {
        function e() {}
        return e;
      })();
    ue.TType = Wt;
    function ms(e) {
      return typeof e == 'string' ? pp(e) : e;
    }
    function ll(e, t) {
      var s = e[t];
      if (!s) throw new Error('Unknown type ' + t);
      return s;
    }
    function pp(e) {
      return new cl(e);
    }
    ue.name = pp;
    var cl = (function (e) {
      on(t, e);
      function t(s) {
        var i = e.call(this) || this;
        return (i.name = s), (i._failMsg = 'is not a ' + s), i;
      }
      return (
        (t.prototype.getChecker = function (s, i, r) {
          var a = this,
            u = ll(s, this.name),
            d = u.getChecker(s, i, r);
          return u instanceof Dt || u instanceof t
            ? d
            : function (v, g) {
                return d(v, g) ? !0 : g.fail(null, a._failMsg, 0);
              };
        }),
        t
      );
    })(Wt);
    ue.TName = cl;
    function VT(e) {
      return new ul(e);
    }
    ue.lit = VT;
    var ul = (function (e) {
      on(t, e);
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
    })(Wt);
    ue.TLiteral = ul;
    function jT(e) {
      return new hp(ms(e));
    }
    ue.array = jT;
    var hp = (function (e) {
      on(t, e);
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
              var v = r(a[d], u);
              if (!v) return u.fail(d, null, 1);
            }
            return !0;
          };
        }),
        t
      );
    })(Wt);
    ue.TArray = hp;
    function $T() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new fp(
        e.map(function (s) {
          return ms(s);
        })
      );
    }
    ue.tuple = $T;
    var fp = (function (e) {
      on(t, e);
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
              for (var v = 0; v < r.length; v++) {
                var g = r[v](u[v], d);
                if (!g) return d.fail(v, null, 1);
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
    })(Wt);
    ue.TTuple = fp;
    function KT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new dp(
        e.map(function (s) {
          return ms(s);
        })
      );
    }
    ue.union = KT;
    var dp = (function (e) {
      on(t, e);
      function t(s) {
        var i = e.call(this) || this;
        i.ttypes = s;
        var r = s
            .map(function (u) {
              return u instanceof cl || u instanceof ul ? u.name : null;
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
            for (var v = d.unionResolver(), g = 0; g < a.length; g++) {
              var O = a[g](u, v.createContext());
              if (O) return !0;
            }
            return d.resolveUnion(v), d.fail(null, r._failMsg, 0);
          };
        }),
        t
      );
    })(Wt);
    ue.TUnion = dp;
    function qT() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      return new mp(
        e.map(function (s) {
          return ms(s);
        })
      );
    }
    ue.intersection = qT;
    var mp = (function (e) {
      on(t, e);
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
            var v = a.every(function (g) {
              return g(u, d);
            });
            return v ? !0 : d.fail(null, null, 0);
          };
        }),
        t
      );
    })(Wt);
    ue.TIntersection = mp;
    function UT(e) {
      return new pl(e);
    }
    ue.enumtype = UT;
    var pl = (function (e) {
      on(t, e);
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
    })(Wt);
    ue.TEnumType = pl;
    function HT(e, t) {
      return new Tp(e, t);
    }
    ue.enumlit = HT;
    var Tp = (function (e) {
      on(t, e);
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
            a = ll(s, this.enumName);
          if (!(a instanceof pl))
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
          return function (d, v) {
            return d === u ? !0 : v.fail(null, r._failMsg, -1);
          };
        }),
        t
      );
    })(Wt);
    ue.TEnumLiteral = Tp;
    function WT(e) {
      return Object.keys(e).map(function (t) {
        return GT(t, e[t]);
      });
    }
    function GT(e, t) {
      return t instanceof hl ? new al(e, t.ttype, !0) : new al(e, ms(t), !1);
    }
    function zT(e, t) {
      return new yp(e, WT(t));
    }
    ue.iface = zT;
    var yp = (function (e) {
      on(t, e);
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
            u = this.bases.map(function (f) {
              return ll(s, f).getChecker(s, i);
            }),
            d = this.props.map(function (f) {
              return f.ttype.getChecker(s, i);
            }),
            v = new up.NoopContext(),
            g = this.props.map(function (f, T) {
              return !f.isOpt && !d[T](void 0, v);
            }),
            O = function (f, T) {
              if (typeof f != 'object' || f === null)
                return T.fail(null, 'is not an object', 0);
              for (var x = 0; x < u.length; x++) if (!u[x](f, T)) return !1;
              for (var x = 0; x < d.length; x++) {
                var w = a.props[x].name,
                  S = f[w];
                if (S === void 0) {
                  if (g[x]) return T.fail(w, 'is missing', 1);
                } else {
                  var A = d[x](S, T);
                  if (!A) return T.fail(w, null, 1);
                }
              }
              return !0;
            };
          if (!i) return O;
          var p = this.propSet;
          return (
            r &&
              (this.propSet.forEach(function (f) {
                return r.add(f);
              }),
              (p = r)),
            function (f, T) {
              if (!O(f, T)) return !1;
              for (var x in f)
                if (!p.has(x)) return T.fail(x, 'is extraneous', 2);
              return !0;
            }
          );
        }),
        t
      );
    })(Wt);
    ue.TIface = yp;
    function XT(e) {
      return new hl(ms(e));
    }
    ue.opt = XT;
    var hl = (function (e) {
      on(t, e);
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
    })(Wt);
    ue.TOptional = hl;
    var al = (function () {
      function e(t, s, i) {
        (this.name = t), (this.ttype = s), (this.isOpt = i);
      }
      return e;
    })();
    ue.TProp = al;
    function YT(e) {
      for (var t = [], s = 1; s < arguments.length; s++)
        t[s - 1] = arguments[s];
      return new kp(new xp(t), ms(e));
    }
    ue.func = YT;
    var kp = (function (e) {
      on(t, e);
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
    })(Wt);
    ue.TFunc = kp;
    function JT(e, t, s) {
      return new vp(e, ms(t), !!s);
    }
    ue.param = JT;
    var vp = (function () {
      function e(t, s, i) {
        (this.name = t), (this.ttype = s), (this.isOpt = i);
      }
      return e;
    })();
    ue.TParam = vp;
    var xp = (function (e) {
      on(t, e);
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
            u = new up.NoopContext(),
            d = this.params.map(function (g, O) {
              return !g.isOpt && !a[O](void 0, u);
            }),
            v = function (g, O) {
              if (!Array.isArray(g)) return O.fail(null, 'is not an array', 0);
              for (var p = 0; p < a.length; p++) {
                var f = r.params[p];
                if (g[p] === void 0) {
                  if (d[p]) return O.fail(f.name, 'is missing', 1);
                } else {
                  var T = a[p](g[p], O);
                  if (!T) return O.fail(f.name, null, 1);
                }
              }
              return !0;
            };
          return i
            ? function (g, O) {
                return v(g, O)
                  ? g.length <= a.length
                    ? !0
                    : O.fail(a.length, 'is extraneous', 2)
                  : !1;
              }
            : v;
        }),
        t
      );
    })(Wt);
    ue.TParamList = xp;
    var Dt = (function (e) {
      on(t, e);
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
    })(Wt);
    ue.BasicType = Dt;
    ue.basicTypes = {
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
      Date: new Dt(lp('[object Date]'), 'is not a Date'),
      RegExp: new Dt(lp('[object RegExp]'), 'is not a RegExp'),
    };
    var QT = Object.prototype.toString;
    function lp(e) {
      return function (t) {
        return typeof t == 'object' && t && QT.call(t) === e;
      };
    }
    typeof Buffer < 'u' &&
      (ue.basicTypes.Buffer = new Dt(function (e) {
        return Buffer.isBuffer(e);
      }, 'is not a Buffer'));
    var ZT = function (e) {
      ue.basicTypes[e.name] = new Dt(function (t) {
        return t instanceof e;
      }, 'is not a ' + e.name);
    };
    for (
      ho = 0,
        ol = [
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
      ho < ol.length;
      ho++
    )
      (cp = ol[ho]), ZT(cp);
    var cp, ho, ol;
  });
  var dl = Z((Se) => {
    'use strict';
    var ey =
      (Se && Se.__spreadArrays) ||
      function () {
        for (var e = 0, t = 0, s = arguments.length; t < s; t++)
          e += arguments[t].length;
        for (var i = Array(e), r = 0, t = 0; t < s; t++)
          for (var a = arguments[t], u = 0, d = a.length; u < d; u++, r++)
            i[r] = a[u];
        return i;
      };
    Object.defineProperty(Se, '__esModule', {value: !0});
    Se.Checker = Se.createCheckers = void 0;
    var Zi = fl(),
      fi = po(),
      Xe = fl();
    Object.defineProperty(Se, 'TArray', {
      enumerable: !0,
      get: function () {
        return Xe.TArray;
      },
    });
    Object.defineProperty(Se, 'TEnumType', {
      enumerable: !0,
      get: function () {
        return Xe.TEnumType;
      },
    });
    Object.defineProperty(Se, 'TEnumLiteral', {
      enumerable: !0,
      get: function () {
        return Xe.TEnumLiteral;
      },
    });
    Object.defineProperty(Se, 'TFunc', {
      enumerable: !0,
      get: function () {
        return Xe.TFunc;
      },
    });
    Object.defineProperty(Se, 'TIface', {
      enumerable: !0,
      get: function () {
        return Xe.TIface;
      },
    });
    Object.defineProperty(Se, 'TLiteral', {
      enumerable: !0,
      get: function () {
        return Xe.TLiteral;
      },
    });
    Object.defineProperty(Se, 'TName', {
      enumerable: !0,
      get: function () {
        return Xe.TName;
      },
    });
    Object.defineProperty(Se, 'TOptional', {
      enumerable: !0,
      get: function () {
        return Xe.TOptional;
      },
    });
    Object.defineProperty(Se, 'TParam', {
      enumerable: !0,
      get: function () {
        return Xe.TParam;
      },
    });
    Object.defineProperty(Se, 'TParamList', {
      enumerable: !0,
      get: function () {
        return Xe.TParamList;
      },
    });
    Object.defineProperty(Se, 'TProp', {
      enumerable: !0,
      get: function () {
        return Xe.TProp;
      },
    });
    Object.defineProperty(Se, 'TTuple', {
      enumerable: !0,
      get: function () {
        return Xe.TTuple;
      },
    });
    Object.defineProperty(Se, 'TType', {
      enumerable: !0,
      get: function () {
        return Xe.TType;
      },
    });
    Object.defineProperty(Se, 'TUnion', {
      enumerable: !0,
      get: function () {
        return Xe.TUnion;
      },
    });
    Object.defineProperty(Se, 'TIntersection', {
      enumerable: !0,
      get: function () {
        return Xe.TIntersection;
      },
    });
    Object.defineProperty(Se, 'array', {
      enumerable: !0,
      get: function () {
        return Xe.array;
      },
    });
    Object.defineProperty(Se, 'enumlit', {
      enumerable: !0,
      get: function () {
        return Xe.enumlit;
      },
    });
    Object.defineProperty(Se, 'enumtype', {
      enumerable: !0,
      get: function () {
        return Xe.enumtype;
      },
    });
    Object.defineProperty(Se, 'func', {
      enumerable: !0,
      get: function () {
        return Xe.func;
      },
    });
    Object.defineProperty(Se, 'iface', {
      enumerable: !0,
      get: function () {
        return Xe.iface;
      },
    });
    Object.defineProperty(Se, 'lit', {
      enumerable: !0,
      get: function () {
        return Xe.lit;
      },
    });
    Object.defineProperty(Se, 'name', {
      enumerable: !0,
      get: function () {
        return Xe.name;
      },
    });
    Object.defineProperty(Se, 'opt', {
      enumerable: !0,
      get: function () {
        return Xe.opt;
      },
    });
    Object.defineProperty(Se, 'param', {
      enumerable: !0,
      get: function () {
        return Xe.param;
      },
    });
    Object.defineProperty(Se, 'tuple', {
      enumerable: !0,
      get: function () {
        return Xe.tuple;
      },
    });
    Object.defineProperty(Se, 'union', {
      enumerable: !0,
      get: function () {
        return Xe.union;
      },
    });
    Object.defineProperty(Se, 'intersection', {
      enumerable: !0,
      get: function () {
        return Xe.intersection;
      },
    });
    Object.defineProperty(Se, 'BasicType', {
      enumerable: !0,
      get: function () {
        return Xe.BasicType;
      },
    });
    var ty = po();
    Object.defineProperty(Se, 'VError', {
      enumerable: !0,
      get: function () {
        return ty.VError;
      },
    });
    function ny() {
      for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
      for (
        var s = Object.assign.apply(Object, ey([{}, Zi.basicTypes], e)),
          i = {},
          r = 0,
          a = e;
        r < a.length;
        r++
      )
        for (var u = a[r], d = 0, v = Object.keys(u); d < v.length; d++) {
          var g = v[d];
          i[g] = new gp(s, u[g]);
        }
      return i;
    }
    Se.createCheckers = ny;
    var gp = (function () {
      function e(t, s, i) {
        if (
          (i === void 0 && (i = 'value'),
          (this.suite = t),
          (this.ttype = s),
          (this._path = i),
          (this.props = new Map()),
          s instanceof Zi.TIface)
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
          return this.checkerPlain(t, new fi.NoopContext());
        }),
        (e.prototype.validate = function (t) {
          return this._doValidate(this.checkerPlain, t);
        }),
        (e.prototype.strictCheck = function (t) {
          return this._doCheck(this.checkerStrict, t);
        }),
        (e.prototype.strictTest = function (t) {
          return this.checkerStrict(t, new fi.NoopContext());
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
          if (!(this.ttype instanceof Zi.TFunc))
            throw new Error('getArgs() applied to non-function');
          return new e(this.suite, this.ttype.paramList);
        }),
        (e.prototype.getResult = function () {
          if (!(this.ttype instanceof Zi.TFunc))
            throw new Error('getResult() applied to non-function');
          return new e(this.suite, this.ttype.result);
        }),
        (e.prototype.getType = function () {
          return this.ttype;
        }),
        (e.prototype._doCheck = function (t, s) {
          var i = new fi.NoopContext();
          if (!t(s, i)) {
            var r = new fi.DetailContext();
            throw (t(s, r), r.getError(this._path));
          }
        }),
        (e.prototype._doValidate = function (t, s) {
          var i = new fi.NoopContext();
          if (t(s, i)) return null;
          var r = new fi.DetailContext();
          return t(s, r), r.getErrorDetail(this._path);
        }),
        (e.prototype._getMethod = function (t) {
          var s = this.props.get(t);
          if (!s) throw new Error('Type has no property ' + t);
          if (!(s instanceof Zi.TFunc))
            throw new Error('Property ' + t + ' is not a method');
          return s;
        }),
        e
      );
    })();
    Se.Checker = gp;
  });
  var _p = Z((Qn) => {
    'use strict';
    Object.defineProperty(Qn, '__esModule', {value: !0});
    function sy(e) {
      if (e && e.__esModule) return e;
      var t = {};
      if (e != null)
        for (var s in e)
          Object.prototype.hasOwnProperty.call(e, s) && (t[s] = e[s]);
      return (t.default = e), t;
    }
    var iy = dl(),
      Ze = sy(iy),
      ry = Ze.union(
        Ze.lit('jsx'),
        Ze.lit('typescript'),
        Ze.lit('flow'),
        Ze.lit('imports'),
        Ze.lit('react-hot-loader'),
        Ze.lit('jest')
      );
    Qn.Transform = ry;
    var oy = Ze.iface([], {compiledFilename: 'string'});
    Qn.SourceMapOptions = oy;
    var ay = Ze.iface([], {
      transforms: Ze.array('Transform'),
      disableESTransforms: Ze.opt('boolean'),
      jsxRuntime: Ze.opt(
        Ze.union(Ze.lit('classic'), Ze.lit('automatic'), Ze.lit('preserve'))
      ),
      production: Ze.opt('boolean'),
      jsxImportSource: Ze.opt('string'),
      jsxPragma: Ze.opt('string'),
      jsxFragmentPragma: Ze.opt('string'),
      preserveDynamicImport: Ze.opt('boolean'),
      injectCreateRequireForImportRequire: Ze.opt('boolean'),
      enableLegacyTypeScriptModuleInterop: Ze.opt('boolean'),
      enableLegacyBabel5ModuleInterop: Ze.opt('boolean'),
      sourceMapOptions: Ze.opt('SourceMapOptions'),
      filePath: Ze.opt('string'),
    });
    Qn.Options = ay;
    var ly = {
      Transform: Qn.Transform,
      SourceMapOptions: Qn.SourceMapOptions,
      Options: Qn.Options,
    };
    Qn.default = ly;
  });
  var bp = Z((ml) => {
    'use strict';
    Object.defineProperty(ml, '__esModule', {value: !0});
    function cy(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var uy = dl(),
      py = _p(),
      hy = cy(py),
      {Options: fy} = uy.createCheckers.call(void 0, hy.default);
    function dy(e) {
      fy.strictCheck(e);
    }
    ml.validateOptions = dy;
  });
  var fo = Z((On) => {
    'use strict';
    Object.defineProperty(On, '__esModule', {value: !0});
    var my = nr(),
      Cp = di(),
      Mt = _t(),
      er = Et(),
      mn = Ce(),
      bt = nn(),
      tr = Os(),
      Tl = fs();
    function Ty() {
      Mt.next.call(void 0), tr.parseMaybeAssign.call(void 0, !1);
    }
    On.parseSpread = Ty;
    function wp(e) {
      Mt.next.call(void 0), kl(e);
    }
    On.parseRest = wp;
    function Sp(e) {
      tr.parseIdentifier.call(void 0), Ip(e);
    }
    On.parseBindingIdentifier = Sp;
    function yy() {
      tr.parseIdentifier.call(void 0),
        (bt.state.tokens[bt.state.tokens.length - 1].identifierRole =
          Mt.IdentifierRole.ImportDeclaration);
    }
    On.parseImportedIdentifier = yy;
    function Ip(e) {
      let t;
      bt.state.scopeDepth === 0
        ? (t = Mt.IdentifierRole.TopLevelDeclaration)
        : e
        ? (t = Mt.IdentifierRole.BlockScopedDeclaration)
        : (t = Mt.IdentifierRole.FunctionScopedDeclaration),
        (bt.state.tokens[bt.state.tokens.length - 1].identifierRole = t);
    }
    On.markPriorBindingIdentifier = Ip;
    function kl(e) {
      switch (bt.state.type) {
        case mn.TokenType._this: {
          let t = Mt.pushTypeContext.call(void 0, 0);
          Mt.next.call(void 0), Mt.popTypeContext.call(void 0, t);
          return;
        }
        case mn.TokenType._yield:
        case mn.TokenType.name: {
          (bt.state.type = mn.TokenType.name), Sp(e);
          return;
        }
        case mn.TokenType.bracketL: {
          Mt.next.call(void 0), Ep(mn.TokenType.bracketR, e, !0);
          return;
        }
        case mn.TokenType.braceL:
          tr.parseObj.call(void 0, !0, e);
          return;
        default:
          Tl.unexpected.call(void 0);
      }
    }
    On.parseBindingAtom = kl;
    function Ep(e, t, s = !1, i = !1, r = 0) {
      let a = !0,
        u = !1,
        d = bt.state.tokens.length;
      for (; !Mt.eat.call(void 0, e) && !bt.state.error; )
        if (
          (a
            ? (a = !1)
            : (Tl.expect.call(void 0, mn.TokenType.comma),
              (bt.state.tokens[bt.state.tokens.length - 1].contextId = r),
              !u &&
                bt.state.tokens[d].isType &&
                ((bt.state.tokens[bt.state.tokens.length - 1].isType = !0),
                (u = !0))),
          !(s && Mt.match.call(void 0, mn.TokenType.comma)))
        ) {
          if (Mt.eat.call(void 0, e)) break;
          if (Mt.match.call(void 0, mn.TokenType.ellipsis)) {
            wp(t),
              Ap(),
              Mt.eat.call(void 0, mn.TokenType.comma),
              Tl.expect.call(void 0, e);
            break;
          } else ky(i, t);
        }
    }
    On.parseBindingList = Ep;
    function ky(e, t) {
      e &&
        Cp.tsParseModifiers.call(void 0, [
          er.ContextualKeyword._public,
          er.ContextualKeyword._protected,
          er.ContextualKeyword._private,
          er.ContextualKeyword._readonly,
          er.ContextualKeyword._override,
        ]),
        yl(t),
        Ap(),
        yl(t, !0);
    }
    function Ap() {
      bt.isFlowEnabled
        ? my.flowParseAssignableListItemTypes.call(void 0)
        : bt.isTypeScriptEnabled &&
          Cp.tsParseAssignableListItemTypes.call(void 0);
    }
    function yl(e, t = !1) {
      if ((t || kl(e), !Mt.eat.call(void 0, mn.TokenType.eq))) return;
      let s = bt.state.tokens.length - 1;
      tr.parseMaybeAssign.call(void 0),
        (bt.state.tokens[s].rhsEndIndex = bt.state.tokens.length);
    }
    On.parseMaybeDefault = yl;
  });
  var di = Z((De) => {
    'use strict';
    Object.defineProperty(De, '__esModule', {value: !0});
    var k = _t(),
      oe = Et(),
      y = Ce(),
      I = nn(),
      be = Os(),
      Ti = fo(),
      Dn = ar(),
      H = fs(),
      vy = Al();
    function xl() {
      return k.match.call(void 0, y.TokenType.name);
    }
    function xy() {
      return (
        k.match.call(void 0, y.TokenType.name) ||
        !!(I.state.type & y.TokenType.IS_KEYWORD) ||
        k.match.call(void 0, y.TokenType.string) ||
        k.match.call(void 0, y.TokenType.num) ||
        k.match.call(void 0, y.TokenType.bigint) ||
        k.match.call(void 0, y.TokenType.decimal)
      );
    }
    function Op() {
      let e = I.state.snapshot();
      return (
        k.next.call(void 0),
        (k.match.call(void 0, y.TokenType.bracketL) ||
          k.match.call(void 0, y.TokenType.braceL) ||
          k.match.call(void 0, y.TokenType.star) ||
          k.match.call(void 0, y.TokenType.ellipsis) ||
          k.match.call(void 0, y.TokenType.hash) ||
          xy()) &&
        !H.hasPrecedingLineBreak.call(void 0)
          ? !0
          : (I.state.restoreFromSnapshot(e), !1)
      );
    }
    function Dp(e) {
      for (; Cl(e) !== null; );
    }
    De.tsParseModifiers = Dp;
    function Cl(e) {
      if (!k.match.call(void 0, y.TokenType.name)) return null;
      let t = I.state.contextualKeyword;
      if (e.indexOf(t) !== -1 && Op()) {
        switch (t) {
          case oe.ContextualKeyword._readonly:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._readonly;
            break;
          case oe.ContextualKeyword._abstract:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._abstract;
            break;
          case oe.ContextualKeyword._static:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._static;
            break;
          case oe.ContextualKeyword._public:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._public;
            break;
          case oe.ContextualKeyword._private:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._private;
            break;
          case oe.ContextualKeyword._protected:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._protected;
            break;
          case oe.ContextualKeyword._override:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._override;
            break;
          case oe.ContextualKeyword._declare:
            I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._declare;
            break;
          default:
            break;
        }
        return t;
      }
      return null;
    }
    De.tsParseModifier = Cl;
    function ir() {
      for (
        be.parseIdentifier.call(void 0);
        k.eat.call(void 0, y.TokenType.dot);

      )
        be.parseIdentifier.call(void 0);
    }
    function gy() {
      ir(),
        !H.hasPrecedingLineBreak.call(void 0) &&
          k.match.call(void 0, y.TokenType.lessThan) &&
          ki();
    }
    function _y() {
      k.next.call(void 0), or();
    }
    function by() {
      k.next.call(void 0);
    }
    function Cy() {
      H.expect.call(void 0, y.TokenType._typeof),
        k.match.call(void 0, y.TokenType._import) ? Mp() : ir(),
        !H.hasPrecedingLineBreak.call(void 0) &&
          k.match.call(void 0, y.TokenType.lessThan) &&
          ki();
    }
    function Mp() {
      H.expect.call(void 0, y.TokenType._import),
        H.expect.call(void 0, y.TokenType.parenL),
        H.expect.call(void 0, y.TokenType.string),
        H.expect.call(void 0, y.TokenType.parenR),
        k.eat.call(void 0, y.TokenType.dot) && ir(),
        k.match.call(void 0, y.TokenType.lessThan) && ki();
    }
    function wy() {
      k.eat.call(void 0, y.TokenType._const);
      let e = k.eat.call(void 0, y.TokenType._in),
        t = H.eatContextual.call(void 0, oe.ContextualKeyword._out);
      k.eat.call(void 0, y.TokenType._const),
        (e || t) && !k.match.call(void 0, y.TokenType.name)
          ? (I.state.tokens[I.state.tokens.length - 1].type = y.TokenType.name)
          : be.parseIdentifier.call(void 0),
        k.eat.call(void 0, y.TokenType._extends) && ot(),
        k.eat.call(void 0, y.TokenType.eq) && ot();
    }
    function yi() {
      k.match.call(void 0, y.TokenType.lessThan) && To();
    }
    De.tsTryParseTypeParameters = yi;
    function To() {
      let e = k.pushTypeContext.call(void 0, 0);
      for (
        k.match.call(void 0, y.TokenType.lessThan) ||
        k.match.call(void 0, y.TokenType.typeParameterStart)
          ? k.next.call(void 0)
          : H.unexpected.call(void 0);
        !k.eat.call(void 0, y.TokenType.greaterThan) && !I.state.error;

      )
        wy(), k.eat.call(void 0, y.TokenType.comma);
      k.popTypeContext.call(void 0, e);
    }
    function wl(e) {
      let t = e === y.TokenType.arrow;
      yi(),
        H.expect.call(void 0, y.TokenType.parenL),
        I.state.scopeDepth++,
        Sy(!1),
        I.state.scopeDepth--,
        (t || k.match.call(void 0, e)) && sr(e);
    }
    function Sy(e) {
      Ti.parseBindingList.call(void 0, y.TokenType.parenR, e);
    }
    function mo() {
      k.eat.call(void 0, y.TokenType.comma) || H.semicolon.call(void 0);
    }
    function Pp() {
      wl(y.TokenType.colon), mo();
    }
    function Iy() {
      let e = I.state.snapshot();
      k.next.call(void 0);
      let t =
        k.eat.call(void 0, y.TokenType.name) &&
        k.match.call(void 0, y.TokenType.colon);
      return I.state.restoreFromSnapshot(e), t;
    }
    function Fp() {
      if (!(k.match.call(void 0, y.TokenType.bracketL) && Iy())) return !1;
      let e = k.pushTypeContext.call(void 0, 0);
      return (
        H.expect.call(void 0, y.TokenType.bracketL),
        be.parseIdentifier.call(void 0),
        or(),
        H.expect.call(void 0, y.TokenType.bracketR),
        rr(),
        mo(),
        k.popTypeContext.call(void 0, e),
        !0
      );
    }
    function Np(e) {
      k.eat.call(void 0, y.TokenType.question),
        !e &&
        (k.match.call(void 0, y.TokenType.parenL) ||
          k.match.call(void 0, y.TokenType.lessThan))
          ? (wl(y.TokenType.colon), mo())
          : (rr(), mo());
    }
    function Ey() {
      if (
        k.match.call(void 0, y.TokenType.parenL) ||
        k.match.call(void 0, y.TokenType.lessThan)
      ) {
        Pp();
        return;
      }
      if (k.match.call(void 0, y.TokenType._new)) {
        k.next.call(void 0),
          k.match.call(void 0, y.TokenType.parenL) ||
          k.match.call(void 0, y.TokenType.lessThan)
            ? Pp()
            : Np(!1);
        return;
      }
      let e = !!Cl([oe.ContextualKeyword._readonly]);
      Fp() ||
        ((H.isContextual.call(void 0, oe.ContextualKeyword._get) ||
          H.isContextual.call(void 0, oe.ContextualKeyword._set)) &&
          Op(),
        be.parsePropertyName.call(void 0, -1),
        Np(e));
    }
    function Ay() {
      Bp();
    }
    function Bp() {
      for (
        H.expect.call(void 0, y.TokenType.braceL);
        !k.eat.call(void 0, y.TokenType.braceR) && !I.state.error;

      )
        Ey();
    }
    function Py() {
      let e = I.state.snapshot(),
        t = Ny();
      return I.state.restoreFromSnapshot(e), t;
    }
    function Ny() {
      return (
        k.next.call(void 0),
        k.eat.call(void 0, y.TokenType.plus) ||
        k.eat.call(void 0, y.TokenType.minus)
          ? H.isContextual.call(void 0, oe.ContextualKeyword._readonly)
          : (H.isContextual.call(void 0, oe.ContextualKeyword._readonly) &&
              k.next.call(void 0),
            !k.match.call(void 0, y.TokenType.bracketL) ||
            (k.next.call(void 0), !xl())
              ? !1
              : (k.next.call(void 0), k.match.call(void 0, y.TokenType._in)))
      );
    }
    function Ry() {
      be.parseIdentifier.call(void 0),
        H.expect.call(void 0, y.TokenType._in),
        ot();
    }
    function Ly() {
      H.expect.call(void 0, y.TokenType.braceL),
        k.match.call(void 0, y.TokenType.plus) ||
        k.match.call(void 0, y.TokenType.minus)
          ? (k.next.call(void 0),
            H.expectContextual.call(void 0, oe.ContextualKeyword._readonly))
          : H.eatContextual.call(void 0, oe.ContextualKeyword._readonly),
        H.expect.call(void 0, y.TokenType.bracketL),
        Ry(),
        H.eatContextual.call(void 0, oe.ContextualKeyword._as) && ot(),
        H.expect.call(void 0, y.TokenType.bracketR),
        k.match.call(void 0, y.TokenType.plus) ||
        k.match.call(void 0, y.TokenType.minus)
          ? (k.next.call(void 0), H.expect.call(void 0, y.TokenType.question))
          : k.eat.call(void 0, y.TokenType.question),
        Gy(),
        H.semicolon.call(void 0),
        H.expect.call(void 0, y.TokenType.braceR);
    }
    function Oy() {
      for (
        H.expect.call(void 0, y.TokenType.bracketL);
        !k.eat.call(void 0, y.TokenType.bracketR) && !I.state.error;

      )
        Dy(), k.eat.call(void 0, y.TokenType.comma);
    }
    function Dy() {
      k.eat.call(void 0, y.TokenType.ellipsis)
        ? ot()
        : (ot(), k.eat.call(void 0, y.TokenType.question)),
        k.eat.call(void 0, y.TokenType.colon) && ot();
    }
    function My() {
      H.expect.call(void 0, y.TokenType.parenL),
        ot(),
        H.expect.call(void 0, y.TokenType.parenR);
    }
    function Fy() {
      for (
        k.nextTemplateToken.call(void 0), k.nextTemplateToken.call(void 0);
        !k.match.call(void 0, y.TokenType.backQuote) && !I.state.error;

      )
        H.expect.call(void 0, y.TokenType.dollarBraceL),
          ot(),
          k.nextTemplateToken.call(void 0),
          k.nextTemplateToken.call(void 0);
      k.next.call(void 0);
    }
    var Ts;
    (function (e) {
      e[(e.TSFunctionType = 0)] = 'TSFunctionType';
      let s = 1;
      e[(e.TSConstructorType = s)] = 'TSConstructorType';
      let i = s + 1;
      e[(e.TSAbstractConstructorType = i)] = 'TSAbstractConstructorType';
    })(Ts || (Ts = {}));
    function vl(e) {
      e === Ts.TSAbstractConstructorType &&
        H.expectContextual.call(void 0, oe.ContextualKeyword._abstract),
        (e === Ts.TSConstructorType || e === Ts.TSAbstractConstructorType) &&
          H.expect.call(void 0, y.TokenType._new);
      let t = I.state.inDisallowConditionalTypesContext;
      (I.state.inDisallowConditionalTypesContext = !1),
        wl(y.TokenType.arrow),
        (I.state.inDisallowConditionalTypesContext = t);
    }
    function By() {
      switch (I.state.type) {
        case y.TokenType.name:
          gy();
          return;
        case y.TokenType._void:
        case y.TokenType._null:
          k.next.call(void 0);
          return;
        case y.TokenType.string:
        case y.TokenType.num:
        case y.TokenType.bigint:
        case y.TokenType.decimal:
        case y.TokenType._true:
        case y.TokenType._false:
          be.parseLiteral.call(void 0);
          return;
        case y.TokenType.minus:
          k.next.call(void 0), be.parseLiteral.call(void 0);
          return;
        case y.TokenType._this: {
          by(),
            H.isContextual.call(void 0, oe.ContextualKeyword._is) &&
              !H.hasPrecedingLineBreak.call(void 0) &&
              _y();
          return;
        }
        case y.TokenType._typeof:
          Cy();
          return;
        case y.TokenType._import:
          Mp();
          return;
        case y.TokenType.braceL:
          Py() ? Ly() : Ay();
          return;
        case y.TokenType.bracketL:
          Oy();
          return;
        case y.TokenType.parenL:
          My();
          return;
        case y.TokenType.backQuote:
          Fy();
          return;
        default:
          if (I.state.type & y.TokenType.IS_KEYWORD) {
            k.next.call(void 0),
              (I.state.tokens[I.state.tokens.length - 1].type =
                y.TokenType.name);
            return;
          }
          break;
      }
      H.unexpected.call(void 0);
    }
    function Vy() {
      for (
        By();
        !H.hasPrecedingLineBreak.call(void 0) &&
        k.eat.call(void 0, y.TokenType.bracketL);

      )
        k.eat.call(void 0, y.TokenType.bracketR) ||
          (ot(), H.expect.call(void 0, y.TokenType.bracketR));
    }
    function jy() {
      if (
        (H.expectContextual.call(void 0, oe.ContextualKeyword._infer),
        be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType._extends))
      ) {
        let e = I.state.snapshot();
        H.expect.call(void 0, y.TokenType._extends);
        let t = I.state.inDisallowConditionalTypesContext;
        (I.state.inDisallowConditionalTypesContext = !0),
          ot(),
          (I.state.inDisallowConditionalTypesContext = t),
          (I.state.error ||
            (!I.state.inDisallowConditionalTypesContext &&
              k.match.call(void 0, y.TokenType.question))) &&
            I.state.restoreFromSnapshot(e);
      }
    }
    function gl() {
      if (
        H.isContextual.call(void 0, oe.ContextualKeyword._keyof) ||
        H.isContextual.call(void 0, oe.ContextualKeyword._unique) ||
        H.isContextual.call(void 0, oe.ContextualKeyword._readonly)
      )
        k.next.call(void 0), gl();
      else if (H.isContextual.call(void 0, oe.ContextualKeyword._infer)) jy();
      else {
        let e = I.state.inDisallowConditionalTypesContext;
        (I.state.inDisallowConditionalTypesContext = !1),
          Vy(),
          (I.state.inDisallowConditionalTypesContext = e);
      }
    }
    function Rp() {
      if (
        (k.eat.call(void 0, y.TokenType.bitwiseAND),
        gl(),
        k.match.call(void 0, y.TokenType.bitwiseAND))
      )
        for (; k.eat.call(void 0, y.TokenType.bitwiseAND); ) gl();
    }
    function $y() {
      if (
        (k.eat.call(void 0, y.TokenType.bitwiseOR),
        Rp(),
        k.match.call(void 0, y.TokenType.bitwiseOR))
      )
        for (; k.eat.call(void 0, y.TokenType.bitwiseOR); ) Rp();
    }
    function Ky() {
      return k.match.call(void 0, y.TokenType.lessThan)
        ? !0
        : k.match.call(void 0, y.TokenType.parenL) && Uy();
    }
    function qy() {
      if (
        k.match.call(void 0, y.TokenType.name) ||
        k.match.call(void 0, y.TokenType._this)
      )
        return k.next.call(void 0), !0;
      if (
        k.match.call(void 0, y.TokenType.braceL) ||
        k.match.call(void 0, y.TokenType.bracketL)
      ) {
        let e = 1;
        for (k.next.call(void 0); e > 0 && !I.state.error; )
          k.match.call(void 0, y.TokenType.braceL) ||
          k.match.call(void 0, y.TokenType.bracketL)
            ? e++
            : (k.match.call(void 0, y.TokenType.braceR) ||
                k.match.call(void 0, y.TokenType.bracketR)) &&
              e--,
            k.next.call(void 0);
        return !0;
      }
      return !1;
    }
    function Uy() {
      let e = I.state.snapshot(),
        t = Hy();
      return I.state.restoreFromSnapshot(e), t;
    }
    function Hy() {
      return (
        k.next.call(void 0),
        !!(
          k.match.call(void 0, y.TokenType.parenR) ||
          k.match.call(void 0, y.TokenType.ellipsis) ||
          (qy() &&
            (k.match.call(void 0, y.TokenType.colon) ||
              k.match.call(void 0, y.TokenType.comma) ||
              k.match.call(void 0, y.TokenType.question) ||
              k.match.call(void 0, y.TokenType.eq) ||
              (k.match.call(void 0, y.TokenType.parenR) &&
                (k.next.call(void 0),
                k.match.call(void 0, y.TokenType.arrow)))))
        )
      );
    }
    function sr(e) {
      let t = k.pushTypeContext.call(void 0, 0);
      H.expect.call(void 0, e), zy() || ot(), k.popTypeContext.call(void 0, t);
    }
    function Wy() {
      k.match.call(void 0, y.TokenType.colon) && sr(y.TokenType.colon);
    }
    function rr() {
      k.match.call(void 0, y.TokenType.colon) && or();
    }
    De.tsTryParseTypeAnnotation = rr;
    function Gy() {
      k.eat.call(void 0, y.TokenType.colon) && ot();
    }
    function zy() {
      let e = I.state.snapshot();
      return H.isContextual.call(void 0, oe.ContextualKeyword._asserts)
        ? (k.next.call(void 0),
          H.eatContextual.call(void 0, oe.ContextualKeyword._is)
            ? (ot(), !0)
            : xl() || k.match.call(void 0, y.TokenType._this)
            ? (k.next.call(void 0),
              H.eatContextual.call(void 0, oe.ContextualKeyword._is) && ot(),
              !0)
            : (I.state.restoreFromSnapshot(e), !1))
        : xl() || k.match.call(void 0, y.TokenType._this)
        ? (k.next.call(void 0),
          H.isContextual.call(void 0, oe.ContextualKeyword._is) &&
          !H.hasPrecedingLineBreak.call(void 0)
            ? (k.next.call(void 0), ot(), !0)
            : (I.state.restoreFromSnapshot(e), !1))
        : !1;
    }
    function or() {
      let e = k.pushTypeContext.call(void 0, 0);
      H.expect.call(void 0, y.TokenType.colon),
        ot(),
        k.popTypeContext.call(void 0, e);
    }
    De.tsParseTypeAnnotation = or;
    function ot() {
      if (
        (_l(),
        I.state.inDisallowConditionalTypesContext ||
          H.hasPrecedingLineBreak.call(void 0) ||
          !k.eat.call(void 0, y.TokenType._extends))
      )
        return;
      let e = I.state.inDisallowConditionalTypesContext;
      (I.state.inDisallowConditionalTypesContext = !0),
        _l(),
        (I.state.inDisallowConditionalTypesContext = e),
        H.expect.call(void 0, y.TokenType.question),
        ot(),
        H.expect.call(void 0, y.TokenType.colon),
        ot();
    }
    De.tsParseType = ot;
    function Xy() {
      return (
        H.isContextual.call(void 0, oe.ContextualKeyword._abstract) &&
        k.lookaheadType.call(void 0) === y.TokenType._new
      );
    }
    function _l() {
      if (Ky()) {
        vl(Ts.TSFunctionType);
        return;
      }
      if (k.match.call(void 0, y.TokenType._new)) {
        vl(Ts.TSConstructorType);
        return;
      } else if (Xy()) {
        vl(Ts.TSAbstractConstructorType);
        return;
      }
      $y();
    }
    De.tsParseNonConditionalType = _l;
    function Yy() {
      let e = k.pushTypeContext.call(void 0, 1);
      ot(),
        H.expect.call(void 0, y.TokenType.greaterThan),
        k.popTypeContext.call(void 0, e),
        be.parseMaybeUnary.call(void 0);
    }
    De.tsParseTypeAssertion = Yy;
    function Jy() {
      if (k.eat.call(void 0, y.TokenType.jsxTagStart)) {
        I.state.tokens[I.state.tokens.length - 1].type =
          y.TokenType.typeParameterStart;
        let e = k.pushTypeContext.call(void 0, 1);
        for (
          ;
          !k.match.call(void 0, y.TokenType.greaterThan) && !I.state.error;

        )
          ot(), k.eat.call(void 0, y.TokenType.comma);
        vy.nextJSXTagToken.call(void 0), k.popTypeContext.call(void 0, e);
      }
    }
    De.tsTryParseJSXTypeArgument = Jy;
    function Vp() {
      for (; !k.match.call(void 0, y.TokenType.braceL) && !I.state.error; )
        Qy(), k.eat.call(void 0, y.TokenType.comma);
    }
    function Qy() {
      ir(), k.match.call(void 0, y.TokenType.lessThan) && ki();
    }
    function Zy() {
      Ti.parseBindingIdentifier.call(void 0, !1),
        yi(),
        k.eat.call(void 0, y.TokenType._extends) && Vp(),
        Bp();
    }
    function ek() {
      Ti.parseBindingIdentifier.call(void 0, !1),
        yi(),
        H.expect.call(void 0, y.TokenType.eq),
        ot(),
        H.semicolon.call(void 0);
    }
    function tk() {
      if (
        (k.match.call(void 0, y.TokenType.string)
          ? be.parseLiteral.call(void 0)
          : be.parseIdentifier.call(void 0),
        k.eat.call(void 0, y.TokenType.eq))
      ) {
        let e = I.state.tokens.length - 1;
        be.parseMaybeAssign.call(void 0),
          (I.state.tokens[e].rhsEndIndex = I.state.tokens.length);
      }
    }
    function Sl() {
      for (
        Ti.parseBindingIdentifier.call(void 0, !1),
          H.expect.call(void 0, y.TokenType.braceL);
        !k.eat.call(void 0, y.TokenType.braceR) && !I.state.error;

      )
        tk(), k.eat.call(void 0, y.TokenType.comma);
    }
    function Il() {
      H.expect.call(void 0, y.TokenType.braceL),
        Dn.parseBlockBody.call(void 0, y.TokenType.braceR);
    }
    function bl() {
      Ti.parseBindingIdentifier.call(void 0, !1),
        k.eat.call(void 0, y.TokenType.dot) ? bl() : Il();
    }
    function jp() {
      H.isContextual.call(void 0, oe.ContextualKeyword._global)
        ? be.parseIdentifier.call(void 0)
        : k.match.call(void 0, y.TokenType.string)
        ? be.parseExprAtom.call(void 0)
        : H.unexpected.call(void 0),
        k.match.call(void 0, y.TokenType.braceL)
          ? Il()
          : H.semicolon.call(void 0);
    }
    function $p() {
      Ti.parseImportedIdentifier.call(void 0),
        H.expect.call(void 0, y.TokenType.eq),
        sk(),
        H.semicolon.call(void 0);
    }
    De.tsParseImportEqualsDeclaration = $p;
    function nk() {
      return (
        H.isContextual.call(void 0, oe.ContextualKeyword._require) &&
        k.lookaheadType.call(void 0) === y.TokenType.parenL
      );
    }
    function sk() {
      nk() ? ik() : ir();
    }
    function ik() {
      H.expectContextual.call(void 0, oe.ContextualKeyword._require),
        H.expect.call(void 0, y.TokenType.parenL),
        k.match.call(void 0, y.TokenType.string) || H.unexpected.call(void 0),
        be.parseLiteral.call(void 0),
        H.expect.call(void 0, y.TokenType.parenR);
    }
    function rk() {
      if (H.isLineTerminator.call(void 0)) return !1;
      switch (I.state.type) {
        case y.TokenType._function: {
          let e = k.pushTypeContext.call(void 0, 1);
          k.next.call(void 0);
          let t = I.state.start;
          return (
            Dn.parseFunction.call(void 0, t, !0),
            k.popTypeContext.call(void 0, e),
            !0
          );
        }
        case y.TokenType._class: {
          let e = k.pushTypeContext.call(void 0, 1);
          return (
            Dn.parseClass.call(void 0, !0, !1),
            k.popTypeContext.call(void 0, e),
            !0
          );
        }
        case y.TokenType._const:
          if (
            k.match.call(void 0, y.TokenType._const) &&
            H.isLookaheadContextual.call(void 0, oe.ContextualKeyword._enum)
          ) {
            let e = k.pushTypeContext.call(void 0, 1);
            return (
              H.expect.call(void 0, y.TokenType._const),
              H.expectContextual.call(void 0, oe.ContextualKeyword._enum),
              (I.state.tokens[I.state.tokens.length - 1].type =
                y.TokenType._enum),
              Sl(),
              k.popTypeContext.call(void 0, e),
              !0
            );
          }
        case y.TokenType._var:
        case y.TokenType._let: {
          let e = k.pushTypeContext.call(void 0, 1);
          return (
            Dn.parseVarStatement.call(
              void 0,
              I.state.type !== y.TokenType._var
            ),
            k.popTypeContext.call(void 0, e),
            !0
          );
        }
        case y.TokenType.name: {
          let e = k.pushTypeContext.call(void 0, 1),
            t = I.state.contextualKeyword,
            s = !1;
          return (
            t === oe.ContextualKeyword._global
              ? (jp(), (s = !0))
              : (s = yo(t, !0)),
            k.popTypeContext.call(void 0, e),
            s
          );
        }
        default:
          return !1;
      }
    }
    function Lp() {
      return yo(I.state.contextualKeyword, !0);
    }
    function ok(e) {
      switch (e) {
        case oe.ContextualKeyword._declare: {
          let t = I.state.tokens.length - 1;
          if (rk()) return (I.state.tokens[t].type = y.TokenType._declare), !0;
          break;
        }
        case oe.ContextualKeyword._global:
          if (k.match.call(void 0, y.TokenType.braceL)) return Il(), !0;
          break;
        default:
          return yo(e, !1);
      }
      return !1;
    }
    function yo(e, t) {
      switch (e) {
        case oe.ContextualKeyword._abstract:
          if (mi(t) && k.match.call(void 0, y.TokenType._class))
            return (
              (I.state.tokens[I.state.tokens.length - 1].type =
                y.TokenType._abstract),
              Dn.parseClass.call(void 0, !0, !1),
              !0
            );
          break;
        case oe.ContextualKeyword._enum:
          if (mi(t) && k.match.call(void 0, y.TokenType.name))
            return (
              (I.state.tokens[I.state.tokens.length - 1].type =
                y.TokenType._enum),
              Sl(),
              !0
            );
          break;
        case oe.ContextualKeyword._interface:
          if (mi(t) && k.match.call(void 0, y.TokenType.name)) {
            let s = k.pushTypeContext.call(void 0, t ? 2 : 1);
            return Zy(), k.popTypeContext.call(void 0, s), !0;
          }
          break;
        case oe.ContextualKeyword._module:
          if (mi(t)) {
            if (k.match.call(void 0, y.TokenType.string)) {
              let s = k.pushTypeContext.call(void 0, t ? 2 : 1);
              return jp(), k.popTypeContext.call(void 0, s), !0;
            } else if (k.match.call(void 0, y.TokenType.name)) {
              let s = k.pushTypeContext.call(void 0, t ? 2 : 1);
              return bl(), k.popTypeContext.call(void 0, s), !0;
            }
          }
          break;
        case oe.ContextualKeyword._namespace:
          if (mi(t) && k.match.call(void 0, y.TokenType.name)) {
            let s = k.pushTypeContext.call(void 0, t ? 2 : 1);
            return bl(), k.popTypeContext.call(void 0, s), !0;
          }
          break;
        case oe.ContextualKeyword._type:
          if (mi(t) && k.match.call(void 0, y.TokenType.name)) {
            let s = k.pushTypeContext.call(void 0, t ? 2 : 1);
            return ek(), k.popTypeContext.call(void 0, s), !0;
          }
          break;
        default:
          break;
      }
      return !1;
    }
    function mi(e) {
      return e ? (k.next.call(void 0), !0) : !H.isLineTerminator.call(void 0);
    }
    function ak() {
      let e = I.state.snapshot();
      return (
        To(),
        Dn.parseFunctionParams.call(void 0),
        Wy(),
        H.expect.call(void 0, y.TokenType.arrow),
        I.state.error
          ? (I.state.restoreFromSnapshot(e), !1)
          : (be.parseFunctionBody.call(void 0, !0), !0)
      );
    }
    function El() {
      I.state.type === y.TokenType.bitShiftL &&
        ((I.state.pos -= 1), k.finishToken.call(void 0, y.TokenType.lessThan)),
        ki();
    }
    function ki() {
      let e = k.pushTypeContext.call(void 0, 0);
      for (
        H.expect.call(void 0, y.TokenType.lessThan);
        !k.eat.call(void 0, y.TokenType.greaterThan) && !I.state.error;

      )
        ot(), k.eat.call(void 0, y.TokenType.comma);
      k.popTypeContext.call(void 0, e);
    }
    function lk() {
      if (k.match.call(void 0, y.TokenType.name))
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
    De.tsIsDeclarationStart = lk;
    function ck(e, t) {
      if (
        (k.match.call(void 0, y.TokenType.colon) && sr(y.TokenType.colon),
        !k.match.call(void 0, y.TokenType.braceL) &&
          H.isLineTerminator.call(void 0))
      ) {
        let s = I.state.tokens.length - 1;
        for (
          ;
          s >= 0 &&
          (I.state.tokens[s].start >= e ||
            I.state.tokens[s].type === y.TokenType._default ||
            I.state.tokens[s].type === y.TokenType._export);

        )
          (I.state.tokens[s].isType = !0), s--;
        return;
      }
      be.parseFunctionBody.call(void 0, !1, t);
    }
    De.tsParseFunctionBodyAndFinish = ck;
    function uk(e, t, s) {
      if (
        !H.hasPrecedingLineBreak.call(void 0) &&
        k.eat.call(void 0, y.TokenType.bang)
      ) {
        I.state.tokens[I.state.tokens.length - 1].type =
          y.TokenType.nonNullAssertion;
        return;
      }
      if (
        k.match.call(void 0, y.TokenType.lessThan) ||
        k.match.call(void 0, y.TokenType.bitShiftL)
      ) {
        let i = I.state.snapshot();
        if (!t && be.atPossibleAsync.call(void 0) && ak()) return;
        if (
          (El(),
          !t && k.eat.call(void 0, y.TokenType.parenL)
            ? ((I.state.tokens[I.state.tokens.length - 1].subscriptStartIndex =
                e),
              be.parseCallExpressionArguments.call(void 0))
            : k.match.call(void 0, y.TokenType.backQuote)
            ? be.parseTemplate.call(void 0)
            : (I.state.type === y.TokenType.greaterThan ||
                (I.state.type !== y.TokenType.parenL &&
                  I.state.type & y.TokenType.IS_EXPRESSION_START &&
                  !H.hasPrecedingLineBreak.call(void 0))) &&
              H.unexpected.call(void 0),
          I.state.error)
        )
          I.state.restoreFromSnapshot(i);
        else return;
      } else
        !t &&
          k.match.call(void 0, y.TokenType.questionDot) &&
          k.lookaheadType.call(void 0) === y.TokenType.lessThan &&
          (k.next.call(void 0),
          (I.state.tokens[e].isOptionalChainStart = !0),
          (I.state.tokens[I.state.tokens.length - 1].subscriptStartIndex = e),
          ki(),
          H.expect.call(void 0, y.TokenType.parenL),
          be.parseCallExpressionArguments.call(void 0));
      be.baseParseSubscript.call(void 0, e, t, s);
    }
    De.tsParseSubscript = uk;
    function pk() {
      if (k.eat.call(void 0, y.TokenType._import))
        return (
          H.isContextual.call(void 0, oe.ContextualKeyword._type) &&
            k.lookaheadType.call(void 0) !== y.TokenType.eq &&
            H.expectContextual.call(void 0, oe.ContextualKeyword._type),
          $p(),
          !0
        );
      if (k.eat.call(void 0, y.TokenType.eq))
        return be.parseExpression.call(void 0), H.semicolon.call(void 0), !0;
      if (H.eatContextual.call(void 0, oe.ContextualKeyword._as))
        return (
          H.expectContextual.call(void 0, oe.ContextualKeyword._namespace),
          be.parseIdentifier.call(void 0),
          H.semicolon.call(void 0),
          !0
        );
      if (H.isContextual.call(void 0, oe.ContextualKeyword._type)) {
        let e = k.lookaheadType.call(void 0);
        (e === y.TokenType.braceL || e === y.TokenType.star) &&
          k.next.call(void 0);
      }
      return !1;
    }
    De.tsTryParseExport = pk;
    function hk() {
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 1].identifierRole =
          k.IdentifierRole.ImportDeclaration;
        return;
      }
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          k.IdentifierRole.ImportDeclaration),
          (I.state.tokens[I.state.tokens.length - 2].isType = !0),
          (I.state.tokens[I.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          k.IdentifierRole.ImportAccess),
          (I.state.tokens[I.state.tokens.length - 1].identifierRole =
            k.IdentifierRole.ImportDeclaration);
        return;
      }
      be.parseIdentifier.call(void 0),
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          k.IdentifierRole.ImportAccess),
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          k.IdentifierRole.ImportDeclaration),
        (I.state.tokens[I.state.tokens.length - 4].isType = !0),
        (I.state.tokens[I.state.tokens.length - 3].isType = !0),
        (I.state.tokens[I.state.tokens.length - 2].isType = !0),
        (I.state.tokens[I.state.tokens.length - 1].isType = !0);
    }
    De.tsParseImportSpecifier = hk;
    function fk() {
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 1].identifierRole =
          k.IdentifierRole.ExportAccess;
        return;
      }
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        (I.state.tokens[I.state.tokens.length - 1].identifierRole =
          k.IdentifierRole.ExportAccess),
          (I.state.tokens[I.state.tokens.length - 2].isType = !0),
          (I.state.tokens[I.state.tokens.length - 1].isType = !0);
        return;
      }
      if (
        (be.parseIdentifier.call(void 0),
        k.match.call(void 0, y.TokenType.comma) ||
          k.match.call(void 0, y.TokenType.braceR))
      ) {
        I.state.tokens[I.state.tokens.length - 3].identifierRole =
          k.IdentifierRole.ExportAccess;
        return;
      }
      be.parseIdentifier.call(void 0),
        (I.state.tokens[I.state.tokens.length - 3].identifierRole =
          k.IdentifierRole.ExportAccess),
        (I.state.tokens[I.state.tokens.length - 4].isType = !0),
        (I.state.tokens[I.state.tokens.length - 3].isType = !0),
        (I.state.tokens[I.state.tokens.length - 2].isType = !0),
        (I.state.tokens[I.state.tokens.length - 1].isType = !0);
    }
    De.tsParseExportSpecifier = fk;
    function dk() {
      if (
        H.isContextual.call(void 0, oe.ContextualKeyword._abstract) &&
        k.lookaheadType.call(void 0) === y.TokenType._class
      )
        return (
          (I.state.type = y.TokenType._abstract),
          k.next.call(void 0),
          Dn.parseClass.call(void 0, !0, !0),
          !0
        );
      if (H.isContextual.call(void 0, oe.ContextualKeyword._interface)) {
        let e = k.pushTypeContext.call(void 0, 2);
        return (
          yo(oe.ContextualKeyword._interface, !0),
          k.popTypeContext.call(void 0, e),
          !0
        );
      }
      return !1;
    }
    De.tsTryParseExportDefaultExpression = dk;
    function mk() {
      if (I.state.type === y.TokenType._const) {
        let e = k.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === y.TokenType.name &&
          e.contextualKeyword === oe.ContextualKeyword._enum
        )
          return (
            H.expect.call(void 0, y.TokenType._const),
            H.expectContextual.call(void 0, oe.ContextualKeyword._enum),
            (I.state.tokens[I.state.tokens.length - 1].type =
              y.TokenType._enum),
            Sl(),
            !0
          );
      }
      return !1;
    }
    De.tsTryParseStatementContent = mk;
    function Tk(e) {
      let t = I.state.tokens.length;
      Dp([
        oe.ContextualKeyword._abstract,
        oe.ContextualKeyword._readonly,
        oe.ContextualKeyword._declare,
        oe.ContextualKeyword._static,
        oe.ContextualKeyword._override,
      ]);
      let s = I.state.tokens.length;
      if (Fp()) {
        let r = e ? t - 1 : t;
        for (let a = r; a < s; a++) I.state.tokens[a].isType = !0;
        return !0;
      }
      return !1;
    }
    De.tsTryParseClassMemberWithIsStatic = Tk;
    function yk(e) {
      ok(e) || H.semicolon.call(void 0);
    }
    De.tsParseIdentifierStatement = yk;
    function kk() {
      let e = H.eatContextual.call(void 0, oe.ContextualKeyword._declare);
      e &&
        (I.state.tokens[I.state.tokens.length - 1].type = y.TokenType._declare);
      let t = !1;
      if (k.match.call(void 0, y.TokenType.name))
        if (e) {
          let s = k.pushTypeContext.call(void 0, 2);
          (t = Lp()), k.popTypeContext.call(void 0, s);
        } else t = Lp();
      if (!t)
        if (e) {
          let s = k.pushTypeContext.call(void 0, 2);
          Dn.parseStatement.call(void 0, !0), k.popTypeContext.call(void 0, s);
        } else Dn.parseStatement.call(void 0, !0);
    }
    De.tsParseExportDeclaration = kk;
    function vk(e) {
      if (
        (e &&
          (k.match.call(void 0, y.TokenType.lessThan) ||
            k.match.call(void 0, y.TokenType.bitShiftL)) &&
          El(),
        H.eatContextual.call(void 0, oe.ContextualKeyword._implements))
      ) {
        I.state.tokens[I.state.tokens.length - 1].type =
          y.TokenType._implements;
        let t = k.pushTypeContext.call(void 0, 1);
        Vp(), k.popTypeContext.call(void 0, t);
      }
    }
    De.tsAfterParseClassSuper = vk;
    function xk() {
      yi();
    }
    De.tsStartParseObjPropValue = xk;
    function gk() {
      yi();
    }
    De.tsStartParseFunctionParams = gk;
    function _k() {
      let e = k.pushTypeContext.call(void 0, 0);
      H.hasPrecedingLineBreak.call(void 0) ||
        k.eat.call(void 0, y.TokenType.bang),
        rr(),
        k.popTypeContext.call(void 0, e);
    }
    De.tsAfterParseVarHead = _k;
    function bk() {
      k.match.call(void 0, y.TokenType.colon) && or();
    }
    De.tsStartParseAsyncArrowFromCallExpression = bk;
    function Ck(e, t) {
      return I.isJSXEnabled ? Kp(e, t) : qp(e, t);
    }
    De.tsParseMaybeAssign = Ck;
    function Kp(e, t) {
      if (!k.match.call(void 0, y.TokenType.lessThan))
        return be.baseParseMaybeAssign.call(void 0, e, t);
      let s = I.state.snapshot(),
        i = be.baseParseMaybeAssign.call(void 0, e, t);
      if (I.state.error) I.state.restoreFromSnapshot(s);
      else return i;
      return (
        (I.state.type = y.TokenType.typeParameterStart),
        To(),
        (i = be.baseParseMaybeAssign.call(void 0, e, t)),
        i || H.unexpected.call(void 0),
        i
      );
    }
    De.tsParseMaybeAssignWithJSX = Kp;
    function qp(e, t) {
      if (!k.match.call(void 0, y.TokenType.lessThan))
        return be.baseParseMaybeAssign.call(void 0, e, t);
      let s = I.state.snapshot();
      To();
      let i = be.baseParseMaybeAssign.call(void 0, e, t);
      if ((i || H.unexpected.call(void 0), I.state.error))
        I.state.restoreFromSnapshot(s);
      else return i;
      return be.baseParseMaybeAssign.call(void 0, e, t);
    }
    De.tsParseMaybeAssignWithoutJSX = qp;
    function wk() {
      if (k.match.call(void 0, y.TokenType.colon)) {
        let e = I.state.snapshot();
        sr(y.TokenType.colon),
          H.canInsertSemicolon.call(void 0) && H.unexpected.call(void 0),
          k.match.call(void 0, y.TokenType.arrow) || H.unexpected.call(void 0),
          I.state.error && I.state.restoreFromSnapshot(e);
      }
      return k.eat.call(void 0, y.TokenType.arrow);
    }
    De.tsParseArrow = wk;
    function Sk() {
      let e = k.pushTypeContext.call(void 0, 0);
      k.eat.call(void 0, y.TokenType.question),
        rr(),
        k.popTypeContext.call(void 0, e);
    }
    De.tsParseAssignableListItemTypes = Sk;
    function Ik() {
      (k.match.call(void 0, y.TokenType.lessThan) ||
        k.match.call(void 0, y.TokenType.bitShiftL)) &&
        El(),
        Dn.baseParseMaybeDecoratorArguments.call(void 0);
    }
    De.tsParseMaybeDecoratorArguments = Ik;
  });
  var Al = Z((vo) => {
    'use strict';
    Object.defineProperty(vo, '__esModule', {value: !0});
    var Ie = _t(),
      Fe = Ce(),
      de = nn(),
      ko = Os(),
      ys = fs(),
      lt = tn(),
      Up = ui(),
      Ek = di();
    function Ak() {
      let e = !1,
        t = !1;
      for (;;) {
        if (de.state.pos >= de.input.length) {
          ys.unexpected.call(void 0, 'Unterminated JSX contents');
          return;
        }
        let s = de.input.charCodeAt(de.state.pos);
        if (s === lt.charCodes.lessThan || s === lt.charCodes.leftCurlyBrace) {
          if (de.state.pos === de.state.start) {
            if (s === lt.charCodes.lessThan) {
              de.state.pos++,
                Ie.finishToken.call(void 0, Fe.TokenType.jsxTagStart);
              return;
            }
            Ie.getTokenFromCode.call(void 0, s);
            return;
          }
          e && !t
            ? Ie.finishToken.call(void 0, Fe.TokenType.jsxEmptyText)
            : Ie.finishToken.call(void 0, Fe.TokenType.jsxText);
          return;
        }
        s === lt.charCodes.lineFeed
          ? (e = !0)
          : s !== lt.charCodes.space &&
            s !== lt.charCodes.carriageReturn &&
            s !== lt.charCodes.tab &&
            (t = !0),
          de.state.pos++;
      }
    }
    function Pk(e) {
      for (de.state.pos++; ; ) {
        if (de.state.pos >= de.input.length) {
          ys.unexpected.call(void 0, 'Unterminated string constant');
          return;
        }
        if (de.input.charCodeAt(de.state.pos) === e) {
          de.state.pos++;
          break;
        }
        de.state.pos++;
      }
      Ie.finishToken.call(void 0, Fe.TokenType.string);
    }
    function Nk() {
      let e;
      do {
        if (de.state.pos > de.input.length) {
          ys.unexpected.call(void 0, 'Unexpectedly reached the end of input.');
          return;
        }
        e = de.input.charCodeAt(++de.state.pos);
      } while (Up.IS_IDENTIFIER_CHAR[e] || e === lt.charCodes.dash);
      Ie.finishToken.call(void 0, Fe.TokenType.jsxName);
    }
    function Pl() {
      Tn();
    }
    function Hp(e) {
      if ((Pl(), !Ie.eat.call(void 0, Fe.TokenType.colon))) {
        de.state.tokens[de.state.tokens.length - 1].identifierRole = e;
        return;
      }
      Pl();
    }
    function Wp() {
      let e = de.state.tokens.length;
      Hp(Ie.IdentifierRole.Access);
      let t = !1;
      for (; Ie.match.call(void 0, Fe.TokenType.dot); ) (t = !0), Tn(), Pl();
      if (!t) {
        let s = de.state.tokens[e],
          i = de.input.charCodeAt(s.start);
        i >= lt.charCodes.lowercaseA &&
          i <= lt.charCodes.lowercaseZ &&
          (s.identifierRole = null);
      }
    }
    function Rk() {
      switch (de.state.type) {
        case Fe.TokenType.braceL:
          Ie.next.call(void 0), ko.parseExpression.call(void 0), Tn();
          return;
        case Fe.TokenType.jsxTagStart:
          zp(), Tn();
          return;
        case Fe.TokenType.string:
          Tn();
          return;
        default:
          ys.unexpected.call(
            void 0,
            'JSX value should be either an expression or a quoted JSX text'
          );
      }
    }
    function Lk() {
      ys.expect.call(void 0, Fe.TokenType.ellipsis),
        ko.parseExpression.call(void 0);
    }
    function Ok(e) {
      if (Ie.match.call(void 0, Fe.TokenType.jsxTagEnd)) return !1;
      Wp(), de.isTypeScriptEnabled && Ek.tsTryParseJSXTypeArgument.call(void 0);
      let t = !1;
      for (
        ;
        !Ie.match.call(void 0, Fe.TokenType.slash) &&
        !Ie.match.call(void 0, Fe.TokenType.jsxTagEnd) &&
        !de.state.error;

      ) {
        if (Ie.eat.call(void 0, Fe.TokenType.braceL)) {
          (t = !0),
            ys.expect.call(void 0, Fe.TokenType.ellipsis),
            ko.parseMaybeAssign.call(void 0),
            Tn();
          continue;
        }
        t &&
          de.state.end - de.state.start === 3 &&
          de.input.charCodeAt(de.state.start) === lt.charCodes.lowercaseK &&
          de.input.charCodeAt(de.state.start + 1) === lt.charCodes.lowercaseE &&
          de.input.charCodeAt(de.state.start + 2) === lt.charCodes.lowercaseY &&
          (de.state.tokens[e].jsxRole = Ie.JSXRole.KeyAfterPropSpread),
          Hp(Ie.IdentifierRole.ObjectKey),
          Ie.match.call(void 0, Fe.TokenType.eq) && (Tn(), Rk());
      }
      let s = Ie.match.call(void 0, Fe.TokenType.slash);
      return s && Tn(), s;
    }
    function Dk() {
      Ie.match.call(void 0, Fe.TokenType.jsxTagEnd) || Wp();
    }
    function Gp() {
      let e = de.state.tokens.length - 1;
      de.state.tokens[e].jsxRole = Ie.JSXRole.NoChildren;
      let t = 0;
      if (!Ok(e))
        for (vi(); ; )
          switch (de.state.type) {
            case Fe.TokenType.jsxTagStart:
              if ((Tn(), Ie.match.call(void 0, Fe.TokenType.slash))) {
                Tn(),
                  Dk(),
                  de.state.tokens[e].jsxRole !==
                    Ie.JSXRole.KeyAfterPropSpread &&
                    (t === 1
                      ? (de.state.tokens[e].jsxRole = Ie.JSXRole.OneChild)
                      : t > 1 &&
                        (de.state.tokens[e].jsxRole =
                          Ie.JSXRole.StaticChildren));
                return;
              }
              t++, Gp(), vi();
              break;
            case Fe.TokenType.jsxText:
              t++, vi();
              break;
            case Fe.TokenType.jsxEmptyText:
              vi();
              break;
            case Fe.TokenType.braceL:
              Ie.next.call(void 0),
                Ie.match.call(void 0, Fe.TokenType.ellipsis)
                  ? (Lk(), vi(), (t += 2))
                  : (Ie.match.call(void 0, Fe.TokenType.braceR) ||
                      (t++, ko.parseExpression.call(void 0)),
                    vi());
              break;
            default:
              ys.unexpected.call(void 0);
              return;
          }
    }
    function zp() {
      Tn(), Gp();
    }
    vo.jsxParseElement = zp;
    function Tn() {
      de.state.tokens.push(new Ie.Token()),
        Ie.skipSpace.call(void 0),
        (de.state.start = de.state.pos);
      let e = de.input.charCodeAt(de.state.pos);
      if (Up.IS_IDENTIFIER_START[e]) Nk();
      else if (
        e === lt.charCodes.quotationMark ||
        e === lt.charCodes.apostrophe
      )
        Pk(e);
      else
        switch ((++de.state.pos, e)) {
          case lt.charCodes.greaterThan:
            Ie.finishToken.call(void 0, Fe.TokenType.jsxTagEnd);
            break;
          case lt.charCodes.lessThan:
            Ie.finishToken.call(void 0, Fe.TokenType.jsxTagStart);
            break;
          case lt.charCodes.slash:
            Ie.finishToken.call(void 0, Fe.TokenType.slash);
            break;
          case lt.charCodes.equalsTo:
            Ie.finishToken.call(void 0, Fe.TokenType.eq);
            break;
          case lt.charCodes.leftCurlyBrace:
            Ie.finishToken.call(void 0, Fe.TokenType.braceL);
            break;
          case lt.charCodes.dot:
            Ie.finishToken.call(void 0, Fe.TokenType.dot);
            break;
          case lt.charCodes.colon:
            Ie.finishToken.call(void 0, Fe.TokenType.colon);
            break;
          default:
            ys.unexpected.call(void 0);
        }
    }
    vo.nextJSXTagToken = Tn;
    function vi() {
      de.state.tokens.push(new Ie.Token()),
        (de.state.start = de.state.pos),
        Ak();
    }
  });
  var Yp = Z((go) => {
    'use strict';
    Object.defineProperty(go, '__esModule', {value: !0});
    var xo = _t(),
      xi = Ce(),
      Xp = nn(),
      Mk = Os(),
      Fk = nr(),
      Bk = di();
    function Vk(e) {
      if (xo.match.call(void 0, xi.TokenType.question)) {
        let t = xo.lookaheadType.call(void 0);
        if (
          t === xi.TokenType.colon ||
          t === xi.TokenType.comma ||
          t === xi.TokenType.parenR
        )
          return;
      }
      Mk.baseParseConditional.call(void 0, e);
    }
    go.typedParseConditional = Vk;
    function jk() {
      xo.eatTypeToken.call(void 0, xi.TokenType.question),
        xo.match.call(void 0, xi.TokenType.colon) &&
          (Xp.isTypeScriptEnabled
            ? Bk.tsParseTypeAnnotation.call(void 0)
            : Xp.isFlowEnabled && Fk.flowParseTypeAnnotation.call(void 0));
    }
    go.typedParseParenItem = jk;
  });
  var Os = Z((tt) => {
    'use strict';
    Object.defineProperty(tt, '__esModule', {value: !0});
    var ts = nr(),
      $k = Al(),
      Jp = Yp(),
      vs = di(),
      U = _t(),
      Zn = Et(),
      Qp = Gr(),
      B = Ce(),
      Zp = tn(),
      Kk = ui(),
      j = nn(),
      ks = fo(),
      _n = ar(),
      Ne = fs(),
      Co = class {
        constructor(t) {
          this.stop = t;
        }
      };
    tt.StopState = Co;
    function lr(e = !1) {
      if ((yn(e), U.match.call(void 0, B.TokenType.comma)))
        for (; U.eat.call(void 0, B.TokenType.comma); ) yn(e);
    }
    tt.parseExpression = lr;
    function yn(e = !1, t = !1) {
      return j.isTypeScriptEnabled
        ? vs.tsParseMaybeAssign.call(void 0, e, t)
        : j.isFlowEnabled
        ? ts.flowParseMaybeAssign.call(void 0, e, t)
        : eh(e, t);
    }
    tt.parseMaybeAssign = yn;
    function eh(e, t) {
      if (U.match.call(void 0, B.TokenType._yield)) return r0(), !1;
      (U.match.call(void 0, B.TokenType.parenL) ||
        U.match.call(void 0, B.TokenType.name) ||
        U.match.call(void 0, B.TokenType._yield)) &&
        (j.state.potentialArrowAt = j.state.start);
      let s = qk(e);
      return (
        t && Dl(),
        j.state.type & B.TokenType.IS_ASSIGN
          ? (U.next.call(void 0), yn(e), !1)
          : s
      );
    }
    tt.baseParseMaybeAssign = eh;
    function qk(e) {
      return Hk(e) ? !0 : (Uk(e), !1);
    }
    function Uk(e) {
      j.isTypeScriptEnabled || j.isFlowEnabled
        ? Jp.typedParseConditional.call(void 0, e)
        : th(e);
    }
    function th(e) {
      U.eat.call(void 0, B.TokenType.question) &&
        (yn(), Ne.expect.call(void 0, B.TokenType.colon), yn(e));
    }
    tt.baseParseConditional = th;
    function Hk(e) {
      let t = j.state.tokens.length;
      return ur() ? !0 : (_o(t, -1, e), !1);
    }
    function _o(e, t, s) {
      if (
        j.isTypeScriptEnabled &&
        (B.TokenType._in & B.TokenType.PRECEDENCE_MASK) > t &&
        !Ne.hasPrecedingLineBreak.call(void 0) &&
        (Ne.eatContextual.call(void 0, Zn.ContextualKeyword._as) ||
          Ne.eatContextual.call(void 0, Zn.ContextualKeyword._satisfies))
      ) {
        let r = U.pushTypeContext.call(void 0, 1);
        vs.tsParseType.call(void 0),
          U.popTypeContext.call(void 0, r),
          U.rescan_gt.call(void 0),
          _o(e, t, s);
        return;
      }
      let i = j.state.type & B.TokenType.PRECEDENCE_MASK;
      if (i > 0 && (!s || !U.match.call(void 0, B.TokenType._in)) && i > t) {
        let r = j.state.type;
        U.next.call(void 0),
          r === B.TokenType.nullishCoalescing &&
            (j.state.tokens[j.state.tokens.length - 1].nullishStartIndex = e);
        let a = j.state.tokens.length;
        ur(),
          _o(a, r & B.TokenType.IS_RIGHT_ASSOCIATIVE ? i - 1 : i, s),
          r === B.TokenType.nullishCoalescing &&
            (j.state.tokens[e].numNullishCoalesceStarts++,
            j.state.tokens[j.state.tokens.length - 1].numNullishCoalesceEnds++),
          _o(e, t, s);
      }
    }
    function ur() {
      if (
        j.isTypeScriptEnabled &&
        !j.isJSXEnabled &&
        U.eat.call(void 0, B.TokenType.lessThan)
      )
        return vs.tsParseTypeAssertion.call(void 0), !1;
      if (
        Ne.isContextual.call(void 0, Zn.ContextualKeyword._module) &&
        U.lookaheadCharCode.call(void 0) === Zp.charCodes.leftCurlyBrace &&
        !Ne.hasFollowingLineBreak.call(void 0)
      )
        return o0(), !1;
      if (j.state.type & B.TokenType.IS_PREFIX)
        return U.next.call(void 0), ur(), !1;
      if (nh()) return !0;
      for (
        ;
        j.state.type & B.TokenType.IS_POSTFIX &&
        !Ne.canInsertSemicolon.call(void 0);

      )
        j.state.type === B.TokenType.preIncDec &&
          (j.state.type = B.TokenType.postIncDec),
          U.next.call(void 0);
      return !1;
    }
    tt.parseMaybeUnary = ur;
    function nh() {
      let e = j.state.tokens.length;
      return Io()
        ? !0
        : (Ll(e),
          j.state.tokens.length > e &&
            j.state.tokens[e].isOptionalChainStart &&
            (j.state.tokens[j.state.tokens.length - 1].isOptionalChainEnd = !0),
          !1);
    }
    tt.parseExprSubscripts = nh;
    function Ll(e, t = !1) {
      j.isFlowEnabled ? ts.flowParseSubscripts.call(void 0, e, t) : sh(e, t);
    }
    function sh(e, t = !1) {
      let s = new Co(!1);
      do Wk(e, t, s);
      while (!s.stop && !j.state.error);
    }
    tt.baseParseSubscripts = sh;
    function Wk(e, t, s) {
      j.isTypeScriptEnabled
        ? vs.tsParseSubscript.call(void 0, e, t, s)
        : j.isFlowEnabled
        ? ts.flowParseSubscript.call(void 0, e, t, s)
        : ih(e, t, s);
    }
    function ih(e, t, s) {
      if (!t && U.eat.call(void 0, B.TokenType.doubleColon))
        Ol(), (s.stop = !0), Ll(e, t);
      else if (U.match.call(void 0, B.TokenType.questionDot)) {
        if (
          ((j.state.tokens[e].isOptionalChainStart = !0),
          t && U.lookaheadType.call(void 0) === B.TokenType.parenL)
        ) {
          s.stop = !0;
          return;
        }
        U.next.call(void 0),
          (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          U.eat.call(void 0, B.TokenType.bracketL)
            ? (lr(), Ne.expect.call(void 0, B.TokenType.bracketR))
            : U.eat.call(void 0, B.TokenType.parenL)
            ? bo()
            : wo();
      } else if (U.eat.call(void 0, B.TokenType.dot))
        (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          wo();
      else if (U.eat.call(void 0, B.TokenType.bracketL))
        (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e),
          lr(),
          Ne.expect.call(void 0, B.TokenType.bracketR);
      else if (!t && U.match.call(void 0, B.TokenType.parenL))
        if (rh()) {
          let i = j.state.snapshot(),
            r = j.state.tokens.length;
          U.next.call(void 0),
            (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e);
          let a = j.getNextContextId.call(void 0);
          (j.state.tokens[j.state.tokens.length - 1].contextId = a),
            bo(),
            (j.state.tokens[j.state.tokens.length - 1].contextId = a),
            Gk() &&
              (j.state.restoreFromSnapshot(i),
              (s.stop = !0),
              j.state.scopeDepth++,
              _n.parseFunctionParams.call(void 0),
              zk(r));
        } else {
          U.next.call(void 0),
            (j.state.tokens[j.state.tokens.length - 1].subscriptStartIndex = e);
          let i = j.getNextContextId.call(void 0);
          (j.state.tokens[j.state.tokens.length - 1].contextId = i),
            bo(),
            (j.state.tokens[j.state.tokens.length - 1].contextId = i);
        }
      else U.match.call(void 0, B.TokenType.backQuote) ? Ml() : (s.stop = !0);
    }
    tt.baseParseSubscript = ih;
    function rh() {
      return (
        j.state.tokens[j.state.tokens.length - 1].contextualKeyword ===
          Zn.ContextualKeyword._async && !Ne.canInsertSemicolon.call(void 0)
      );
    }
    tt.atPossibleAsync = rh;
    function bo() {
      let e = !0;
      for (; !U.eat.call(void 0, B.TokenType.parenR) && !j.state.error; ) {
        if (e) e = !1;
        else if (
          (Ne.expect.call(void 0, B.TokenType.comma),
          U.eat.call(void 0, B.TokenType.parenR))
        )
          break;
        ph(!1);
      }
    }
    tt.parseCallExpressionArguments = bo;
    function Gk() {
      return (
        U.match.call(void 0, B.TokenType.colon) ||
        U.match.call(void 0, B.TokenType.arrow)
      );
    }
    function zk(e) {
      j.isTypeScriptEnabled
        ? vs.tsStartParseAsyncArrowFromCallExpression.call(void 0)
        : j.isFlowEnabled &&
          ts.flowStartParseAsyncArrowFromCallExpression.call(void 0),
        Ne.expect.call(void 0, B.TokenType.arrow),
        cr(e);
    }
    function Ol() {
      let e = j.state.tokens.length;
      Io(), Ll(e, !0);
    }
    function Io() {
      if (U.eat.call(void 0, B.TokenType.modulo)) return es(), !1;
      if (
        U.match.call(void 0, B.TokenType.jsxText) ||
        U.match.call(void 0, B.TokenType.jsxEmptyText)
      )
        return oh(), !1;
      if (U.match.call(void 0, B.TokenType.lessThan) && j.isJSXEnabled)
        return (
          (j.state.type = B.TokenType.jsxTagStart),
          $k.jsxParseElement.call(void 0),
          U.next.call(void 0),
          !1
        );
      let e = j.state.potentialArrowAt === j.state.start;
      switch (j.state.type) {
        case B.TokenType.slash:
        case B.TokenType.assign:
          U.retokenizeSlashAsRegex.call(void 0);
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
          return U.next.call(void 0), !1;
        case B.TokenType._import:
          return (
            U.next.call(void 0),
            U.match.call(void 0, B.TokenType.dot) &&
              ((j.state.tokens[j.state.tokens.length - 1].type =
                B.TokenType.name),
              U.next.call(void 0),
              es()),
            !1
          );
        case B.TokenType.name: {
          let t = j.state.tokens.length,
            s = j.state.start,
            i = j.state.contextualKeyword;
          return (
            es(),
            i === Zn.ContextualKeyword._await
              ? (i0(), !1)
              : i === Zn.ContextualKeyword._async &&
                U.match.call(void 0, B.TokenType._function) &&
                !Ne.canInsertSemicolon.call(void 0)
              ? (U.next.call(void 0), _n.parseFunction.call(void 0, s, !1), !1)
              : e &&
                i === Zn.ContextualKeyword._async &&
                !Ne.canInsertSemicolon.call(void 0) &&
                U.match.call(void 0, B.TokenType.name)
              ? (j.state.scopeDepth++,
                ks.parseBindingIdentifier.call(void 0, !1),
                Ne.expect.call(void 0, B.TokenType.arrow),
                cr(t),
                !0)
              : U.match.call(void 0, B.TokenType._do) &&
                !Ne.canInsertSemicolon.call(void 0)
              ? (U.next.call(void 0), _n.parseBlock.call(void 0), !1)
              : e &&
                !Ne.canInsertSemicolon.call(void 0) &&
                U.match.call(void 0, B.TokenType.arrow)
              ? (j.state.scopeDepth++,
                ks.markPriorBindingIdentifier.call(void 0, !1),
                Ne.expect.call(void 0, B.TokenType.arrow),
                cr(t),
                !0)
              : ((j.state.tokens[j.state.tokens.length - 1].identifierRole =
                  U.IdentifierRole.Access),
                !1)
          );
        }
        case B.TokenType._do:
          return U.next.call(void 0), _n.parseBlock.call(void 0), !1;
        case B.TokenType.parenL:
          return ah(e);
        case B.TokenType.bracketL:
          return U.next.call(void 0), uh(B.TokenType.bracketR, !0), !1;
        case B.TokenType.braceL:
          return lh(!1, !1), !1;
        case B.TokenType._function:
          return Xk(), !1;
        case B.TokenType.at:
          _n.parseDecorators.call(void 0);
        case B.TokenType._class:
          return _n.parseClass.call(void 0, !1), !1;
        case B.TokenType._new:
          return Qk(), !1;
        case B.TokenType.backQuote:
          return Ml(), !1;
        case B.TokenType.doubleColon:
          return U.next.call(void 0), Ol(), !1;
        case B.TokenType.hash: {
          let t = U.lookaheadCharCode.call(void 0);
          return (
            Kk.IS_IDENTIFIER_START[t] || t === Zp.charCodes.backslash
              ? wo()
              : U.next.call(void 0),
            !1
          );
        }
        default:
          return Ne.unexpected.call(void 0), !1;
      }
    }
    tt.parseExprAtom = Io;
    function wo() {
      U.eat.call(void 0, B.TokenType.hash), es();
    }
    function Xk() {
      let e = j.state.start;
      es(),
        U.eat.call(void 0, B.TokenType.dot) && es(),
        _n.parseFunction.call(void 0, e, !1);
    }
    function oh() {
      U.next.call(void 0);
    }
    tt.parseLiteral = oh;
    function Yk() {
      Ne.expect.call(void 0, B.TokenType.parenL),
        lr(),
        Ne.expect.call(void 0, B.TokenType.parenR);
    }
    tt.parseParenExpression = Yk;
    function ah(e) {
      let t = j.state.snapshot(),
        s = j.state.tokens.length;
      Ne.expect.call(void 0, B.TokenType.parenL);
      let i = !0;
      for (; !U.match.call(void 0, B.TokenType.parenR) && !j.state.error; ) {
        if (i) i = !1;
        else if (
          (Ne.expect.call(void 0, B.TokenType.comma),
          U.match.call(void 0, B.TokenType.parenR))
        )
          break;
        if (U.match.call(void 0, B.TokenType.ellipsis)) {
          ks.parseRest.call(void 0, !1), Dl();
          break;
        } else yn(!1, !0);
      }
      return (
        Ne.expect.call(void 0, B.TokenType.parenR),
        e && Jk() && Nl()
          ? (j.state.restoreFromSnapshot(t),
            j.state.scopeDepth++,
            _n.parseFunctionParams.call(void 0),
            Nl(),
            cr(s),
            j.state.error ? (j.state.restoreFromSnapshot(t), ah(!1), !1) : !0)
          : !1
      );
    }
    function Jk() {
      return (
        U.match.call(void 0, B.TokenType.colon) ||
        !Ne.canInsertSemicolon.call(void 0)
      );
    }
    function Nl() {
      return j.isTypeScriptEnabled
        ? vs.tsParseArrow.call(void 0)
        : j.isFlowEnabled
        ? ts.flowParseArrow.call(void 0)
        : U.eat.call(void 0, B.TokenType.arrow);
    }
    tt.parseArrow = Nl;
    function Dl() {
      (j.isTypeScriptEnabled || j.isFlowEnabled) &&
        Jp.typedParseParenItem.call(void 0);
    }
    function Qk() {
      if (
        (Ne.expect.call(void 0, B.TokenType._new),
        U.eat.call(void 0, B.TokenType.dot))
      ) {
        es();
        return;
      }
      Zk(),
        j.isFlowEnabled && ts.flowStartParseNewArguments.call(void 0),
        U.eat.call(void 0, B.TokenType.parenL) && uh(B.TokenType.parenR);
    }
    function Zk() {
      Ol(), U.eat.call(void 0, B.TokenType.questionDot);
    }
    function Ml() {
      for (
        U.nextTemplateToken.call(void 0), U.nextTemplateToken.call(void 0);
        !U.match.call(void 0, B.TokenType.backQuote) && !j.state.error;

      )
        Ne.expect.call(void 0, B.TokenType.dollarBraceL),
          lr(),
          U.nextTemplateToken.call(void 0),
          U.nextTemplateToken.call(void 0);
      U.next.call(void 0);
    }
    tt.parseTemplate = Ml;
    function lh(e, t) {
      let s = j.getNextContextId.call(void 0),
        i = !0;
      for (
        U.next.call(void 0),
          j.state.tokens[j.state.tokens.length - 1].contextId = s;
        !U.eat.call(void 0, B.TokenType.braceR) && !j.state.error;

      ) {
        if (i) i = !1;
        else if (
          (Ne.expect.call(void 0, B.TokenType.comma),
          U.eat.call(void 0, B.TokenType.braceR))
        )
          break;
        let r = !1;
        if (U.match.call(void 0, B.TokenType.ellipsis)) {
          let a = j.state.tokens.length;
          if (
            (ks.parseSpread.call(void 0),
            e &&
              (j.state.tokens.length === a + 2 &&
                ks.markPriorBindingIdentifier.call(void 0, t),
              U.eat.call(void 0, B.TokenType.braceR)))
          )
            break;
          continue;
        }
        e || (r = U.eat.call(void 0, B.TokenType.star)),
          !e && Ne.isContextual.call(void 0, Zn.ContextualKeyword._async)
            ? (r && Ne.unexpected.call(void 0),
              es(),
              U.match.call(void 0, B.TokenType.colon) ||
                U.match.call(void 0, B.TokenType.parenL) ||
                U.match.call(void 0, B.TokenType.braceR) ||
                U.match.call(void 0, B.TokenType.eq) ||
                U.match.call(void 0, B.TokenType.comma) ||
                (U.match.call(void 0, B.TokenType.star) &&
                  (U.next.call(void 0), (r = !0)),
                So(s)))
            : So(s),
          s0(e, t, s);
      }
      j.state.tokens[j.state.tokens.length - 1].contextId = s;
    }
    tt.parseObj = lh;
    function e0(e) {
      return (
        !e &&
        (U.match.call(void 0, B.TokenType.string) ||
          U.match.call(void 0, B.TokenType.num) ||
          U.match.call(void 0, B.TokenType.bracketL) ||
          U.match.call(void 0, B.TokenType.name) ||
          !!(j.state.type & B.TokenType.IS_KEYWORD))
      );
    }
    function t0(e, t) {
      let s = j.state.start;
      return U.match.call(void 0, B.TokenType.parenL)
        ? (e && Ne.unexpected.call(void 0), Rl(s, !1), !0)
        : e0(e)
        ? (So(t), Rl(s, !1), !0)
        : !1;
    }
    function n0(e, t) {
      if (U.eat.call(void 0, B.TokenType.colon)) {
        e ? ks.parseMaybeDefault.call(void 0, t) : yn(!1);
        return;
      }
      let s;
      e
        ? j.state.scopeDepth === 0
          ? (s = U.IdentifierRole.ObjectShorthandTopLevelDeclaration)
          : t
          ? (s = U.IdentifierRole.ObjectShorthandBlockScopedDeclaration)
          : (s = U.IdentifierRole.ObjectShorthandFunctionScopedDeclaration)
        : (s = U.IdentifierRole.ObjectShorthand),
        (j.state.tokens[j.state.tokens.length - 1].identifierRole = s),
        ks.parseMaybeDefault.call(void 0, t, !0);
    }
    function s0(e, t, s) {
      j.isTypeScriptEnabled
        ? vs.tsStartParseObjPropValue.call(void 0)
        : j.isFlowEnabled && ts.flowStartParseObjPropValue.call(void 0),
        t0(e, s) || n0(e, t);
    }
    function So(e) {
      j.isFlowEnabled && ts.flowParseVariance.call(void 0),
        U.eat.call(void 0, B.TokenType.bracketL)
          ? ((j.state.tokens[j.state.tokens.length - 1].contextId = e),
            yn(),
            Ne.expect.call(void 0, B.TokenType.bracketR),
            (j.state.tokens[j.state.tokens.length - 1].contextId = e))
          : (U.match.call(void 0, B.TokenType.num) ||
            U.match.call(void 0, B.TokenType.string) ||
            U.match.call(void 0, B.TokenType.bigint) ||
            U.match.call(void 0, B.TokenType.decimal)
              ? Io()
              : wo(),
            (j.state.tokens[j.state.tokens.length - 1].identifierRole =
              U.IdentifierRole.ObjectKey),
            (j.state.tokens[j.state.tokens.length - 1].contextId = e));
    }
    tt.parsePropertyName = So;
    function Rl(e, t) {
      let s = j.getNextContextId.call(void 0);
      j.state.scopeDepth++;
      let i = j.state.tokens.length,
        r = t;
      _n.parseFunctionParams.call(void 0, r, s), ch(e, s);
      let a = j.state.tokens.length;
      j.state.scopes.push(new Qp.Scope(i, a, !0)), j.state.scopeDepth--;
    }
    tt.parseMethod = Rl;
    function cr(e) {
      Fl(!0);
      let t = j.state.tokens.length;
      j.state.scopes.push(new Qp.Scope(e, t, !0)), j.state.scopeDepth--;
    }
    tt.parseArrowExpression = cr;
    function ch(e, t = 0) {
      j.isTypeScriptEnabled
        ? vs.tsParseFunctionBodyAndFinish.call(void 0, e, t)
        : j.isFlowEnabled
        ? ts.flowParseFunctionBodyAndFinish.call(void 0, t)
        : Fl(!1, t);
    }
    tt.parseFunctionBodyAndFinish = ch;
    function Fl(e, t = 0) {
      e && !U.match.call(void 0, B.TokenType.braceL)
        ? yn()
        : _n.parseBlock.call(void 0, !0, t);
    }
    tt.parseFunctionBody = Fl;
    function uh(e, t = !1) {
      let s = !0;
      for (; !U.eat.call(void 0, e) && !j.state.error; ) {
        if (s) s = !1;
        else if (
          (Ne.expect.call(void 0, B.TokenType.comma), U.eat.call(void 0, e))
        )
          break;
        ph(t);
      }
    }
    function ph(e) {
      (e && U.match.call(void 0, B.TokenType.comma)) ||
        (U.match.call(void 0, B.TokenType.ellipsis)
          ? (ks.parseSpread.call(void 0), Dl())
          : U.match.call(void 0, B.TokenType.question)
          ? U.next.call(void 0)
          : yn(!1, !0));
    }
    function es() {
      U.next.call(void 0),
        (j.state.tokens[j.state.tokens.length - 1].type = B.TokenType.name);
    }
    tt.parseIdentifier = es;
    function i0() {
      ur();
    }
    function r0() {
      U.next.call(void 0),
        !U.match.call(void 0, B.TokenType.semi) &&
          !Ne.canInsertSemicolon.call(void 0) &&
          (U.eat.call(void 0, B.TokenType.star), yn());
    }
    function o0() {
      Ne.expectContextual.call(void 0, Zn.ContextualKeyword._module),
        Ne.expect.call(void 0, B.TokenType.braceL),
        _n.parseBlockBody.call(void 0, B.TokenType.braceR);
    }
  });
  var nr = Z((Qe) => {
    'use strict';
    Object.defineProperty(Qe, '__esModule', {value: !0});
    var C = _t(),
      ye = Et(),
      _ = Ce(),
      pe = nn(),
      $e = Os(),
      xs = ar(),
      z = fs();
    function a0(e) {
      return (
        (e.type === _.TokenType.name || !!(e.type & _.TokenType.IS_KEYWORD)) &&
        e.contextualKeyword !== ye.ContextualKeyword._from
      );
    }
    function Mn(e) {
      let t = C.pushTypeContext.call(void 0, 0);
      z.expect.call(void 0, e || _.TokenType.colon),
        Gt(),
        C.popTypeContext.call(void 0, t);
    }
    function hh() {
      z.expect.call(void 0, _.TokenType.modulo),
        z.expectContextual.call(void 0, ye.ContextualKeyword._checks),
        C.eat.call(void 0, _.TokenType.parenL) &&
          ($e.parseExpression.call(void 0),
          z.expect.call(void 0, _.TokenType.parenR));
    }
    function jl() {
      let e = C.pushTypeContext.call(void 0, 0);
      z.expect.call(void 0, _.TokenType.colon),
        C.match.call(void 0, _.TokenType.modulo)
          ? hh()
          : (Gt(), C.match.call(void 0, _.TokenType.modulo) && hh()),
        C.popTypeContext.call(void 0, e);
    }
    function l0() {
      C.next.call(void 0), $l(!0);
    }
    function c0() {
      C.next.call(void 0),
        $e.parseIdentifier.call(void 0),
        C.match.call(void 0, _.TokenType.lessThan) && Fn(),
        z.expect.call(void 0, _.TokenType.parenL),
        Vl(),
        z.expect.call(void 0, _.TokenType.parenR),
        jl(),
        z.semicolon.call(void 0);
    }
    function Bl() {
      C.match.call(void 0, _.TokenType._class)
        ? l0()
        : C.match.call(void 0, _.TokenType._function)
        ? c0()
        : C.match.call(void 0, _.TokenType._var)
        ? u0()
        : z.eatContextual.call(void 0, ye.ContextualKeyword._module)
        ? C.eat.call(void 0, _.TokenType.dot)
          ? f0()
          : p0()
        : z.isContextual.call(void 0, ye.ContextualKeyword._type)
        ? d0()
        : z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
        ? m0()
        : z.isContextual.call(void 0, ye.ContextualKeyword._interface)
        ? T0()
        : C.match.call(void 0, _.TokenType._export)
        ? h0()
        : z.unexpected.call(void 0);
    }
    function u0() {
      C.next.call(void 0), kh(), z.semicolon.call(void 0);
    }
    function p0() {
      for (
        C.match.call(void 0, _.TokenType.string)
          ? $e.parseExprAtom.call(void 0)
          : $e.parseIdentifier.call(void 0),
          z.expect.call(void 0, _.TokenType.braceL);
        !C.match.call(void 0, _.TokenType.braceR) && !pe.state.error;

      )
        C.match.call(void 0, _.TokenType._import)
          ? (C.next.call(void 0), xs.parseImport.call(void 0))
          : z.unexpected.call(void 0);
      z.expect.call(void 0, _.TokenType.braceR);
    }
    function h0() {
      z.expect.call(void 0, _.TokenType._export),
        C.eat.call(void 0, _.TokenType._default)
          ? C.match.call(void 0, _.TokenType._function) ||
            C.match.call(void 0, _.TokenType._class)
            ? Bl()
            : (Gt(), z.semicolon.call(void 0))
          : C.match.call(void 0, _.TokenType._var) ||
            C.match.call(void 0, _.TokenType._function) ||
            C.match.call(void 0, _.TokenType._class) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
          ? Bl()
          : C.match.call(void 0, _.TokenType.star) ||
            C.match.call(void 0, _.TokenType.braceL) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._interface) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._type) ||
            z.isContextual.call(void 0, ye.ContextualKeyword._opaque)
          ? xs.parseExport.call(void 0)
          : z.unexpected.call(void 0);
    }
    function f0() {
      z.expectContextual.call(void 0, ye.ContextualKeyword._exports),
        gi(),
        z.semicolon.call(void 0);
    }
    function d0() {
      C.next.call(void 0), ql();
    }
    function m0() {
      C.next.call(void 0), Ul(!0);
    }
    function T0() {
      C.next.call(void 0), $l();
    }
    function $l(e = !1) {
      if (
        (No(),
        C.match.call(void 0, _.TokenType.lessThan) && Fn(),
        C.eat.call(void 0, _.TokenType._extends))
      )
        do Eo();
        while (!e && C.eat.call(void 0, _.TokenType.comma));
      if (z.isContextual.call(void 0, ye.ContextualKeyword._mixins)) {
        C.next.call(void 0);
        do Eo();
        while (C.eat.call(void 0, _.TokenType.comma));
      }
      if (z.isContextual.call(void 0, ye.ContextualKeyword._implements)) {
        C.next.call(void 0);
        do Eo();
        while (C.eat.call(void 0, _.TokenType.comma));
      }
      Ao(e, !1, e);
    }
    function Eo() {
      mh(!1), C.match.call(void 0, _.TokenType.lessThan) && Ds();
    }
    function Kl() {
      $l();
    }
    function No() {
      $e.parseIdentifier.call(void 0);
    }
    function ql() {
      No(),
        C.match.call(void 0, _.TokenType.lessThan) && Fn(),
        Mn(_.TokenType.eq),
        z.semicolon.call(void 0);
    }
    function Ul(e) {
      z.expectContextual.call(void 0, ye.ContextualKeyword._type),
        No(),
        C.match.call(void 0, _.TokenType.lessThan) && Fn(),
        C.match.call(void 0, _.TokenType.colon) && Mn(_.TokenType.colon),
        e || Mn(_.TokenType.eq),
        z.semicolon.call(void 0);
    }
    function y0() {
      Gl(), kh(), C.eat.call(void 0, _.TokenType.eq) && Gt();
    }
    function Fn() {
      let e = C.pushTypeContext.call(void 0, 0);
      C.match.call(void 0, _.TokenType.lessThan) ||
      C.match.call(void 0, _.TokenType.typeParameterStart)
        ? C.next.call(void 0)
        : z.unexpected.call(void 0);
      do
        y0(),
          C.match.call(void 0, _.TokenType.greaterThan) ||
            z.expect.call(void 0, _.TokenType.comma);
      while (!C.match.call(void 0, _.TokenType.greaterThan) && !pe.state.error);
      z.expect.call(void 0, _.TokenType.greaterThan),
        C.popTypeContext.call(void 0, e);
    }
    Qe.flowParseTypeParameterDeclaration = Fn;
    function Ds() {
      let e = C.pushTypeContext.call(void 0, 0);
      for (
        z.expect.call(void 0, _.TokenType.lessThan);
        !C.match.call(void 0, _.TokenType.greaterThan) && !pe.state.error;

      )
        Gt(),
          C.match.call(void 0, _.TokenType.greaterThan) ||
            z.expect.call(void 0, _.TokenType.comma);
      z.expect.call(void 0, _.TokenType.greaterThan),
        C.popTypeContext.call(void 0, e);
    }
    function k0() {
      if (
        (z.expectContextual.call(void 0, ye.ContextualKeyword._interface),
        C.eat.call(void 0, _.TokenType._extends))
      )
        do Eo();
        while (C.eat.call(void 0, _.TokenType.comma));
      Ao(!1, !1, !1);
    }
    function Hl() {
      C.match.call(void 0, _.TokenType.num) ||
      C.match.call(void 0, _.TokenType.string)
        ? $e.parseExprAtom.call(void 0)
        : $e.parseIdentifier.call(void 0);
    }
    function v0() {
      C.lookaheadType.call(void 0) === _.TokenType.colon ? (Hl(), Mn()) : Gt(),
        z.expect.call(void 0, _.TokenType.bracketR),
        Mn();
    }
    function x0() {
      Hl(),
        z.expect.call(void 0, _.TokenType.bracketR),
        z.expect.call(void 0, _.TokenType.bracketR),
        C.match.call(void 0, _.TokenType.lessThan) ||
        C.match.call(void 0, _.TokenType.parenL)
          ? Wl()
          : (C.eat.call(void 0, _.TokenType.question), Mn());
    }
    function Wl() {
      for (
        C.match.call(void 0, _.TokenType.lessThan) && Fn(),
          z.expect.call(void 0, _.TokenType.parenL);
        !C.match.call(void 0, _.TokenType.parenR) &&
        !C.match.call(void 0, _.TokenType.ellipsis) &&
        !pe.state.error;

      )
        Po(),
          C.match.call(void 0, _.TokenType.parenR) ||
            z.expect.call(void 0, _.TokenType.comma);
      C.eat.call(void 0, _.TokenType.ellipsis) && Po(),
        z.expect.call(void 0, _.TokenType.parenR),
        Mn();
    }
    function g0() {
      Wl();
    }
    function Ao(e, t, s) {
      let i;
      for (
        t && C.match.call(void 0, _.TokenType.braceBarL)
          ? (z.expect.call(void 0, _.TokenType.braceBarL),
            (i = _.TokenType.braceBarR))
          : (z.expect.call(void 0, _.TokenType.braceL),
            (i = _.TokenType.braceR));
        !C.match.call(void 0, i) && !pe.state.error;

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
        if ((Gl(), C.eat.call(void 0, _.TokenType.bracketL)))
          C.eat.call(void 0, _.TokenType.bracketL) ? x0() : v0();
        else if (
          C.match.call(void 0, _.TokenType.parenL) ||
          C.match.call(void 0, _.TokenType.lessThan)
        )
          g0();
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
          _0();
        }
        b0();
      }
      z.expect.call(void 0, i);
    }
    function _0() {
      if (C.match.call(void 0, _.TokenType.ellipsis)) {
        if (
          (z.expect.call(void 0, _.TokenType.ellipsis),
          C.eat.call(void 0, _.TokenType.comma) ||
            C.eat.call(void 0, _.TokenType.semi),
          C.match.call(void 0, _.TokenType.braceR))
        )
          return;
        Gt();
      } else
        Hl(),
          C.match.call(void 0, _.TokenType.lessThan) ||
          C.match.call(void 0, _.TokenType.parenL)
            ? Wl()
            : (C.eat.call(void 0, _.TokenType.question), Mn());
    }
    function b0() {
      !C.eat.call(void 0, _.TokenType.semi) &&
        !C.eat.call(void 0, _.TokenType.comma) &&
        !C.match.call(void 0, _.TokenType.braceR) &&
        !C.match.call(void 0, _.TokenType.braceBarR) &&
        z.unexpected.call(void 0);
    }
    function mh(e) {
      for (
        e || $e.parseIdentifier.call(void 0);
        C.eat.call(void 0, _.TokenType.dot);

      )
        $e.parseIdentifier.call(void 0);
    }
    function C0() {
      mh(!0), C.match.call(void 0, _.TokenType.lessThan) && Ds();
    }
    function w0() {
      z.expect.call(void 0, _.TokenType._typeof), Th();
    }
    function S0() {
      for (
        z.expect.call(void 0, _.TokenType.bracketL);
        pe.state.pos < pe.input.length &&
        !C.match.call(void 0, _.TokenType.bracketR) &&
        (Gt(), !C.match.call(void 0, _.TokenType.bracketR));

      )
        z.expect.call(void 0, _.TokenType.comma);
      z.expect.call(void 0, _.TokenType.bracketR);
    }
    function Po() {
      let e = C.lookaheadType.call(void 0);
      e === _.TokenType.colon || e === _.TokenType.question
        ? ($e.parseIdentifier.call(void 0),
          C.eat.call(void 0, _.TokenType.question),
          Mn())
        : Gt();
    }
    function Vl() {
      for (
        ;
        !C.match.call(void 0, _.TokenType.parenR) &&
        !C.match.call(void 0, _.TokenType.ellipsis) &&
        !pe.state.error;

      )
        Po(),
          C.match.call(void 0, _.TokenType.parenR) ||
            z.expect.call(void 0, _.TokenType.comma);
      C.eat.call(void 0, _.TokenType.ellipsis) && Po();
    }
    function Th() {
      let e = !1,
        t = pe.state.noAnonFunctionType;
      switch (pe.state.type) {
        case _.TokenType.name: {
          if (z.isContextual.call(void 0, ye.ContextualKeyword._interface)) {
            k0();
            return;
          }
          $e.parseIdentifier.call(void 0), C0();
          return;
        }
        case _.TokenType.braceL:
          Ao(!1, !1, !1);
          return;
        case _.TokenType.braceBarL:
          Ao(!1, !0, !1);
          return;
        case _.TokenType.bracketL:
          S0();
          return;
        case _.TokenType.lessThan:
          Fn(),
            z.expect.call(void 0, _.TokenType.parenL),
            Vl(),
            z.expect.call(void 0, _.TokenType.parenR),
            z.expect.call(void 0, _.TokenType.arrow),
            Gt();
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
              ((pe.state.noAnonFunctionType = !1),
              Gt(),
              (pe.state.noAnonFunctionType = t),
              pe.state.noAnonFunctionType ||
                !(
                  C.match.call(void 0, _.TokenType.comma) ||
                  (C.match.call(void 0, _.TokenType.parenR) &&
                    C.lookaheadType.call(void 0) === _.TokenType.arrow)
                ))
            ) {
              z.expect.call(void 0, _.TokenType.parenR);
              return;
            } else C.eat.call(void 0, _.TokenType.comma);
          Vl(),
            z.expect.call(void 0, _.TokenType.parenR),
            z.expect.call(void 0, _.TokenType.arrow),
            Gt();
          return;
        case _.TokenType.minus:
          C.next.call(void 0), $e.parseLiteral.call(void 0);
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
          if (pe.state.type === _.TokenType._typeof) {
            w0();
            return;
          } else if (pe.state.type & _.TokenType.IS_KEYWORD) {
            C.next.call(void 0),
              (pe.state.tokens[pe.state.tokens.length - 1].type =
                _.TokenType.name);
            return;
          }
      }
      z.unexpected.call(void 0);
    }
    function I0() {
      for (
        Th();
        !z.canInsertSemicolon.call(void 0) &&
        (C.match.call(void 0, _.TokenType.bracketL) ||
          C.match.call(void 0, _.TokenType.questionDot));

      )
        C.eat.call(void 0, _.TokenType.questionDot),
          z.expect.call(void 0, _.TokenType.bracketL),
          C.eat.call(void 0, _.TokenType.bracketR) ||
            (Gt(), z.expect.call(void 0, _.TokenType.bracketR));
    }
    function yh() {
      C.eat.call(void 0, _.TokenType.question) ? yh() : I0();
    }
    function fh() {
      yh(),
        !pe.state.noAnonFunctionType &&
          C.eat.call(void 0, _.TokenType.arrow) &&
          Gt();
    }
    function dh() {
      for (
        C.eat.call(void 0, _.TokenType.bitwiseAND), fh();
        C.eat.call(void 0, _.TokenType.bitwiseAND);

      )
        fh();
    }
    function E0() {
      for (
        C.eat.call(void 0, _.TokenType.bitwiseOR), dh();
        C.eat.call(void 0, _.TokenType.bitwiseOR);

      )
        dh();
    }
    function Gt() {
      E0();
    }
    function gi() {
      Mn();
    }
    Qe.flowParseTypeAnnotation = gi;
    function kh() {
      $e.parseIdentifier.call(void 0),
        C.match.call(void 0, _.TokenType.colon) && gi();
    }
    function Gl() {
      (C.match.call(void 0, _.TokenType.plus) ||
        C.match.call(void 0, _.TokenType.minus)) &&
        (C.next.call(void 0),
        (pe.state.tokens[pe.state.tokens.length - 1].isType = !0));
    }
    Qe.flowParseVariance = Gl;
    function A0(e) {
      C.match.call(void 0, _.TokenType.colon) && jl(),
        $e.parseFunctionBody.call(void 0, !1, e);
    }
    Qe.flowParseFunctionBodyAndFinish = A0;
    function P0(e, t, s) {
      if (
        C.match.call(void 0, _.TokenType.questionDot) &&
        C.lookaheadType.call(void 0) === _.TokenType.lessThan
      ) {
        if (t) {
          s.stop = !0;
          return;
        }
        C.next.call(void 0),
          Ds(),
          z.expect.call(void 0, _.TokenType.parenL),
          $e.parseCallExpressionArguments.call(void 0);
        return;
      } else if (!t && C.match.call(void 0, _.TokenType.lessThan)) {
        let i = pe.state.snapshot();
        if (
          (Ds(),
          z.expect.call(void 0, _.TokenType.parenL),
          $e.parseCallExpressionArguments.call(void 0),
          pe.state.error)
        )
          pe.state.restoreFromSnapshot(i);
        else return;
      }
      $e.baseParseSubscript.call(void 0, e, t, s);
    }
    Qe.flowParseSubscript = P0;
    function N0() {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let e = pe.state.snapshot();
        Ds(), pe.state.error && pe.state.restoreFromSnapshot(e);
      }
    }
    Qe.flowStartParseNewArguments = N0;
    function R0() {
      if (
        C.match.call(void 0, _.TokenType.name) &&
        pe.state.contextualKeyword === ye.ContextualKeyword._interface
      ) {
        let e = C.pushTypeContext.call(void 0, 0);
        return C.next.call(void 0), Kl(), C.popTypeContext.call(void 0, e), !0;
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._enum))
        return vh(), !0;
      return !1;
    }
    Qe.flowTryParseStatement = R0;
    function L0() {
      return z.isContextual.call(void 0, ye.ContextualKeyword._enum)
        ? (vh(), !0)
        : !1;
    }
    Qe.flowTryParseExportDefaultExpression = L0;
    function O0(e) {
      if (e === ye.ContextualKeyword._declare) {
        if (
          C.match.call(void 0, _.TokenType._class) ||
          C.match.call(void 0, _.TokenType.name) ||
          C.match.call(void 0, _.TokenType._function) ||
          C.match.call(void 0, _.TokenType._var) ||
          C.match.call(void 0, _.TokenType._export)
        ) {
          let t = C.pushTypeContext.call(void 0, 1);
          Bl(), C.popTypeContext.call(void 0, t);
        }
      } else if (C.match.call(void 0, _.TokenType.name)) {
        if (e === ye.ContextualKeyword._interface) {
          let t = C.pushTypeContext.call(void 0, 1);
          Kl(), C.popTypeContext.call(void 0, t);
        } else if (e === ye.ContextualKeyword._type) {
          let t = C.pushTypeContext.call(void 0, 1);
          ql(), C.popTypeContext.call(void 0, t);
        } else if (e === ye.ContextualKeyword._opaque) {
          let t = C.pushTypeContext.call(void 0, 1);
          Ul(!1), C.popTypeContext.call(void 0, t);
        }
      }
      z.semicolon.call(void 0);
    }
    Qe.flowParseIdentifierStatement = O0;
    function D0() {
      return (
        z.isContextual.call(void 0, ye.ContextualKeyword._type) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._interface) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._opaque) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._enum)
      );
    }
    Qe.flowShouldParseExportDeclaration = D0;
    function M0() {
      return (
        C.match.call(void 0, _.TokenType.name) &&
        (pe.state.contextualKeyword === ye.ContextualKeyword._type ||
          pe.state.contextualKeyword === ye.ContextualKeyword._interface ||
          pe.state.contextualKeyword === ye.ContextualKeyword._opaque ||
          pe.state.contextualKeyword === ye.ContextualKeyword._enum)
      );
    }
    Qe.flowShouldDisallowExportDefaultSpecifier = M0;
    function F0() {
      if (z.isContextual.call(void 0, ye.ContextualKeyword._type)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0),
          C.match.call(void 0, _.TokenType.braceL)
            ? (xs.parseExportSpecifiers.call(void 0),
              xs.parseExportFrom.call(void 0))
            : ql(),
          C.popTypeContext.call(void 0, e);
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._opaque)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0), Ul(!1), C.popTypeContext.call(void 0, e);
      } else if (z.isContextual.call(void 0, ye.ContextualKeyword._interface)) {
        let e = C.pushTypeContext.call(void 0, 1);
        C.next.call(void 0), Kl(), C.popTypeContext.call(void 0, e);
      } else xs.parseStatement.call(void 0, !0);
    }
    Qe.flowParseExportDeclaration = F0;
    function B0() {
      return (
        C.match.call(void 0, _.TokenType.star) ||
        (z.isContextual.call(void 0, ye.ContextualKeyword._type) &&
          C.lookaheadType.call(void 0) === _.TokenType.star)
      );
    }
    Qe.flowShouldParseExportStar = B0;
    function V0() {
      if (z.eatContextual.call(void 0, ye.ContextualKeyword._type)) {
        let e = C.pushTypeContext.call(void 0, 2);
        xs.baseParseExportStar.call(void 0), C.popTypeContext.call(void 0, e);
      } else xs.baseParseExportStar.call(void 0);
    }
    Qe.flowParseExportStar = V0;
    function j0(e) {
      if (
        (e && C.match.call(void 0, _.TokenType.lessThan) && Ds(),
        z.isContextual.call(void 0, ye.ContextualKeyword._implements))
      ) {
        let t = C.pushTypeContext.call(void 0, 0);
        C.next.call(void 0),
          (pe.state.tokens[pe.state.tokens.length - 1].type =
            _.TokenType._implements);
        do No(), C.match.call(void 0, _.TokenType.lessThan) && Ds();
        while (C.eat.call(void 0, _.TokenType.comma));
        C.popTypeContext.call(void 0, t);
      }
    }
    Qe.flowAfterParseClassSuper = j0;
    function $0() {
      C.match.call(void 0, _.TokenType.lessThan) &&
        (Fn(),
        C.match.call(void 0, _.TokenType.parenL) || z.unexpected.call(void 0));
    }
    Qe.flowStartParseObjPropValue = $0;
    function K0() {
      let e = C.pushTypeContext.call(void 0, 0);
      C.eat.call(void 0, _.TokenType.question),
        C.match.call(void 0, _.TokenType.colon) && gi(),
        C.popTypeContext.call(void 0, e);
    }
    Qe.flowParseAssignableListItemTypes = K0;
    function q0() {
      if (
        C.match.call(void 0, _.TokenType._typeof) ||
        z.isContextual.call(void 0, ye.ContextualKeyword._type)
      ) {
        let e = C.lookaheadTypeAndKeyword.call(void 0);
        (a0(e) ||
          e.type === _.TokenType.braceL ||
          e.type === _.TokenType.star) &&
          C.next.call(void 0);
      }
    }
    Qe.flowStartParseImportSpecifiers = q0;
    function U0() {
      let e =
        pe.state.contextualKeyword === ye.ContextualKeyword._type ||
        pe.state.type === _.TokenType._typeof;
      e ? C.next.call(void 0) : $e.parseIdentifier.call(void 0),
        z.isContextual.call(void 0, ye.ContextualKeyword._as) &&
        !z.isLookaheadContextual.call(void 0, ye.ContextualKeyword._as)
          ? ($e.parseIdentifier.call(void 0),
            (e &&
              !C.match.call(void 0, _.TokenType.name) &&
              !(pe.state.type & _.TokenType.IS_KEYWORD)) ||
              $e.parseIdentifier.call(void 0))
          : (e &&
              (C.match.call(void 0, _.TokenType.name) ||
                pe.state.type & _.TokenType.IS_KEYWORD) &&
              $e.parseIdentifier.call(void 0),
            z.eatContextual.call(void 0, ye.ContextualKeyword._as) &&
              $e.parseIdentifier.call(void 0));
    }
    Qe.flowParseImportSpecifier = U0;
    function H0() {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let e = C.pushTypeContext.call(void 0, 0);
        Fn(), C.popTypeContext.call(void 0, e);
      }
    }
    Qe.flowStartParseFunctionParams = H0;
    function W0() {
      C.match.call(void 0, _.TokenType.colon) && gi();
    }
    Qe.flowAfterParseVarHead = W0;
    function G0() {
      if (C.match.call(void 0, _.TokenType.colon)) {
        let e = pe.state.noAnonFunctionType;
        (pe.state.noAnonFunctionType = !0),
          gi(),
          (pe.state.noAnonFunctionType = e);
      }
    }
    Qe.flowStartParseAsyncArrowFromCallExpression = G0;
    function z0(e, t) {
      if (C.match.call(void 0, _.TokenType.lessThan)) {
        let s = pe.state.snapshot(),
          i = $e.baseParseMaybeAssign.call(void 0, e, t);
        if (pe.state.error)
          pe.state.restoreFromSnapshot(s),
            (pe.state.type = _.TokenType.typeParameterStart);
        else return i;
        let r = C.pushTypeContext.call(void 0, 0);
        if (
          (Fn(),
          C.popTypeContext.call(void 0, r),
          (i = $e.baseParseMaybeAssign.call(void 0, e, t)),
          i)
        )
          return !0;
        z.unexpected.call(void 0);
      }
      return $e.baseParseMaybeAssign.call(void 0, e, t);
    }
    Qe.flowParseMaybeAssign = z0;
    function X0() {
      if (C.match.call(void 0, _.TokenType.colon)) {
        let e = C.pushTypeContext.call(void 0, 0),
          t = pe.state.snapshot(),
          s = pe.state.noAnonFunctionType;
        (pe.state.noAnonFunctionType = !0),
          jl(),
          (pe.state.noAnonFunctionType = s),
          z.canInsertSemicolon.call(void 0) && z.unexpected.call(void 0),
          C.match.call(void 0, _.TokenType.arrow) || z.unexpected.call(void 0),
          pe.state.error && pe.state.restoreFromSnapshot(t),
          C.popTypeContext.call(void 0, e);
      }
      return C.eat.call(void 0, _.TokenType.arrow);
    }
    Qe.flowParseArrow = X0;
    function Y0(e, t = !1) {
      if (
        pe.state.tokens[pe.state.tokens.length - 1].contextualKeyword ===
          ye.ContextualKeyword._async &&
        C.match.call(void 0, _.TokenType.lessThan)
      ) {
        let s = pe.state.snapshot();
        if (J0() && !pe.state.error) return;
        pe.state.restoreFromSnapshot(s);
      }
      $e.baseParseSubscripts.call(void 0, e, t);
    }
    Qe.flowParseSubscripts = Y0;
    function J0() {
      pe.state.scopeDepth++;
      let e = pe.state.tokens.length;
      return (
        xs.parseFunctionParams.call(void 0),
        $e.parseArrow.call(void 0)
          ? ($e.parseArrowExpression.call(void 0, e), !0)
          : !1
      );
    }
    function vh() {
      z.expectContextual.call(void 0, ye.ContextualKeyword._enum),
        (pe.state.tokens[pe.state.tokens.length - 1].type = _.TokenType._enum),
        $e.parseIdentifier.call(void 0),
        Q0();
    }
    function Q0() {
      z.eatContextual.call(void 0, ye.ContextualKeyword._of) &&
        C.next.call(void 0),
        z.expect.call(void 0, _.TokenType.braceL),
        Z0(),
        z.expect.call(void 0, _.TokenType.braceR);
    }
    function Z0() {
      for (
        ;
        !C.match.call(void 0, _.TokenType.braceR) &&
        !pe.state.error &&
        !C.eat.call(void 0, _.TokenType.ellipsis);

      )
        ev(),
          C.match.call(void 0, _.TokenType.braceR) ||
            z.expect.call(void 0, _.TokenType.comma);
    }
    function ev() {
      $e.parseIdentifier.call(void 0),
        C.eat.call(void 0, _.TokenType.eq) && C.next.call(void 0);
    }
  });
  var ar = Z((kt) => {
    'use strict';
    Object.defineProperty(kt, '__esModule', {value: !0});
    var tv = ec(),
      Ft = nr(),
      mt = di(),
      $ = _t(),
      ve = Et(),
      gs = Gr(),
      D = Ce(),
      xh = tn(),
      P = nn(),
      Me = Os(),
      _s = fo(),
      ee = fs();
    function nv() {
      if (
        (Ql(D.TokenType.eof),
        P.state.scopes.push(new gs.Scope(0, P.state.tokens.length, !0)),
        P.state.scopeDepth !== 0)
      )
        throw new Error(
          `Invalid scope depth at end of file: ${P.state.scopeDepth}`
        );
      return new tv.File(P.state.tokens, P.state.scopes);
    }
    kt.parseTopLevel = nv;
    function bn(e) {
      (P.isFlowEnabled && Ft.flowTryParseStatement.call(void 0)) ||
        ($.match.call(void 0, D.TokenType.at) && Jl(), sv(e));
    }
    kt.parseStatement = bn;
    function sv(e) {
      if (P.isTypeScriptEnabled && mt.tsTryParseStatementContent.call(void 0))
        return;
      let t = P.state.type;
      switch (t) {
        case D.TokenType._break:
        case D.TokenType._continue:
          rv();
          return;
        case D.TokenType._debugger:
          ov();
          return;
        case D.TokenType._do:
          av();
          return;
        case D.TokenType._for:
          lv();
          return;
        case D.TokenType._function:
          if ($.lookaheadType.call(void 0) === D.TokenType.dot) break;
          e || ee.unexpected.call(void 0), pv();
          return;
        case D.TokenType._class:
          e || ee.unexpected.call(void 0), Ro(!0);
          return;
        case D.TokenType._if:
          hv();
          return;
        case D.TokenType._return:
          fv();
          return;
        case D.TokenType._switch:
          dv();
          return;
        case D.TokenType._throw:
          mv();
          return;
        case D.TokenType._try:
          yv();
          return;
        case D.TokenType._let:
        case D.TokenType._const:
          e || ee.unexpected.call(void 0);
        case D.TokenType._var:
          Xl(t !== D.TokenType._var);
          return;
        case D.TokenType._while:
          kv();
          return;
        case D.TokenType.braceL:
          bi();
          return;
        case D.TokenType.semi:
          vv();
          return;
        case D.TokenType._export:
        case D.TokenType._import: {
          let r = $.lookaheadType.call(void 0);
          if (r === D.TokenType.parenL || r === D.TokenType.dot) break;
          $.next.call(void 0), t === D.TokenType._import ? Rh() : Ah();
          return;
        }
        case D.TokenType.name:
          if (P.state.contextualKeyword === ve.ContextualKeyword._async) {
            let r = P.state.start,
              a = P.state.snapshot();
            if (
              ($.next.call(void 0),
              $.match.call(void 0, D.TokenType._function) &&
                !ee.canInsertSemicolon.call(void 0))
            ) {
              ee.expect.call(void 0, D.TokenType._function), fr(r, !0);
              return;
            } else P.state.restoreFromSnapshot(a);
          } else if (
            P.state.contextualKeyword === ve.ContextualKeyword._using &&
            !ee.hasFollowingLineBreak.call(void 0) &&
            $.lookaheadType.call(void 0) === D.TokenType.name
          ) {
            Xl(!0);
            return;
          }
        default:
          break;
      }
      let s = P.state.tokens.length;
      Me.parseExpression.call(void 0);
      let i = null;
      if (P.state.tokens.length === s + 1) {
        let r = P.state.tokens[P.state.tokens.length - 1];
        r.type === D.TokenType.name && (i = r.contextualKeyword);
      }
      if (i == null) {
        ee.semicolon.call(void 0);
        return;
      }
      $.eat.call(void 0, D.TokenType.colon) ? xv() : gv(i);
    }
    function Jl() {
      for (; $.match.call(void 0, D.TokenType.at); ) bh();
    }
    kt.parseDecorators = Jl;
    function bh() {
      if (($.next.call(void 0), $.eat.call(void 0, D.TokenType.parenL)))
        Me.parseExpression.call(void 0),
          ee.expect.call(void 0, D.TokenType.parenR);
      else {
        for (
          Me.parseIdentifier.call(void 0);
          $.eat.call(void 0, D.TokenType.dot);

        )
          Me.parseIdentifier.call(void 0);
        iv();
      }
    }
    function iv() {
      P.isTypeScriptEnabled
        ? mt.tsParseMaybeDecoratorArguments.call(void 0)
        : Ch();
    }
    function Ch() {
      $.eat.call(void 0, D.TokenType.parenL) &&
        Me.parseCallExpressionArguments.call(void 0);
    }
    kt.baseParseMaybeDecoratorArguments = Ch;
    function rv() {
      $.next.call(void 0),
        ee.isLineTerminator.call(void 0) ||
          (Me.parseIdentifier.call(void 0), ee.semicolon.call(void 0));
    }
    function ov() {
      $.next.call(void 0), ee.semicolon.call(void 0);
    }
    function av() {
      $.next.call(void 0),
        bn(!1),
        ee.expect.call(void 0, D.TokenType._while),
        Me.parseParenExpression.call(void 0),
        $.eat.call(void 0, D.TokenType.semi);
    }
    function lv() {
      P.state.scopeDepth++;
      let e = P.state.tokens.length;
      uv();
      let t = P.state.tokens.length;
      P.state.scopes.push(new gs.Scope(e, t, !1)), P.state.scopeDepth--;
    }
    function cv() {
      return !(
        !ee.isContextual.call(void 0, ve.ContextualKeyword._using) ||
        ee.isLookaheadContextual.call(void 0, ve.ContextualKeyword._of)
      );
    }
    function uv() {
      $.next.call(void 0);
      let e = !1;
      if (
        (ee.isContextual.call(void 0, ve.ContextualKeyword._await) &&
          ((e = !0), $.next.call(void 0)),
        ee.expect.call(void 0, D.TokenType.parenL),
        $.match.call(void 0, D.TokenType.semi))
      ) {
        e && ee.unexpected.call(void 0), zl();
        return;
      }
      if (
        $.match.call(void 0, D.TokenType._var) ||
        $.match.call(void 0, D.TokenType._let) ||
        $.match.call(void 0, D.TokenType._const) ||
        cv()
      ) {
        if (
          ($.next.call(void 0),
          wh(!0, P.state.type !== D.TokenType._var),
          $.match.call(void 0, D.TokenType._in) ||
            ee.isContextual.call(void 0, ve.ContextualKeyword._of))
        ) {
          gh(e);
          return;
        }
        zl();
        return;
      }
      if (
        (Me.parseExpression.call(void 0, !0),
        $.match.call(void 0, D.TokenType._in) ||
          ee.isContextual.call(void 0, ve.ContextualKeyword._of))
      ) {
        gh(e);
        return;
      }
      e && ee.unexpected.call(void 0), zl();
    }
    function pv() {
      let e = P.state.start;
      $.next.call(void 0), fr(e, !0);
    }
    function hv() {
      $.next.call(void 0),
        Me.parseParenExpression.call(void 0),
        bn(!1),
        $.eat.call(void 0, D.TokenType._else) && bn(!1);
    }
    function fv() {
      $.next.call(void 0),
        ee.isLineTerminator.call(void 0) ||
          (Me.parseExpression.call(void 0), ee.semicolon.call(void 0));
    }
    function dv() {
      $.next.call(void 0),
        Me.parseParenExpression.call(void 0),
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
            s && Me.parseExpression.call(void 0),
            ee.expect.call(void 0, D.TokenType.colon);
        } else bn(!0);
      $.next.call(void 0);
      let t = P.state.tokens.length;
      P.state.scopes.push(new gs.Scope(e, t, !1)), P.state.scopeDepth--;
    }
    function mv() {
      $.next.call(void 0),
        Me.parseExpression.call(void 0),
        ee.semicolon.call(void 0);
    }
    function Tv() {
      _s.parseBindingAtom.call(void 0, !0),
        P.isTypeScriptEnabled && mt.tsTryParseTypeAnnotation.call(void 0);
    }
    function yv() {
      if (
        ($.next.call(void 0), bi(), $.match.call(void 0, D.TokenType._catch))
      ) {
        $.next.call(void 0);
        let e = null;
        if (
          ($.match.call(void 0, D.TokenType.parenL) &&
            (P.state.scopeDepth++,
            (e = P.state.tokens.length),
            ee.expect.call(void 0, D.TokenType.parenL),
            Tv(),
            ee.expect.call(void 0, D.TokenType.parenR)),
          bi(),
          e != null)
        ) {
          let t = P.state.tokens.length;
          P.state.scopes.push(new gs.Scope(e, t, !1)), P.state.scopeDepth--;
        }
      }
      $.eat.call(void 0, D.TokenType._finally) && bi();
    }
    function Xl(e) {
      $.next.call(void 0), wh(!1, e), ee.semicolon.call(void 0);
    }
    kt.parseVarStatement = Xl;
    function kv() {
      $.next.call(void 0), Me.parseParenExpression.call(void 0), bn(!1);
    }
    function vv() {
      $.next.call(void 0);
    }
    function xv() {
      bn(!0);
    }
    function gv(e) {
      P.isTypeScriptEnabled
        ? mt.tsParseIdentifierStatement.call(void 0, e)
        : P.isFlowEnabled
        ? Ft.flowParseIdentifierStatement.call(void 0, e)
        : ee.semicolon.call(void 0);
    }
    function bi(e = !1, t = 0) {
      let s = P.state.tokens.length;
      P.state.scopeDepth++,
        ee.expect.call(void 0, D.TokenType.braceL),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t),
        Ql(D.TokenType.braceR),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t);
      let i = P.state.tokens.length;
      P.state.scopes.push(new gs.Scope(s, i, e)), P.state.scopeDepth--;
    }
    kt.parseBlock = bi;
    function Ql(e) {
      for (; !$.eat.call(void 0, e) && !P.state.error; ) bn(!0);
    }
    kt.parseBlockBody = Ql;
    function zl() {
      ee.expect.call(void 0, D.TokenType.semi),
        $.match.call(void 0, D.TokenType.semi) ||
          Me.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.semi),
        $.match.call(void 0, D.TokenType.parenR) ||
          Me.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenR),
        bn(!1);
    }
    function gh(e) {
      e
        ? ee.eatContextual.call(void 0, ve.ContextualKeyword._of)
        : $.next.call(void 0),
        Me.parseExpression.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenR),
        bn(!1);
    }
    function wh(e, t) {
      for (;;) {
        if ((_v(t), $.eat.call(void 0, D.TokenType.eq))) {
          let s = P.state.tokens.length - 1;
          Me.parseMaybeAssign.call(void 0, e),
            (P.state.tokens[s].rhsEndIndex = P.state.tokens.length);
        }
        if (!$.eat.call(void 0, D.TokenType.comma)) break;
      }
    }
    function _v(e) {
      _s.parseBindingAtom.call(void 0, e),
        P.isTypeScriptEnabled
          ? mt.tsAfterParseVarHead.call(void 0)
          : P.isFlowEnabled && Ft.flowAfterParseVarHead.call(void 0);
    }
    function fr(e, t, s = !1) {
      $.match.call(void 0, D.TokenType.star) && $.next.call(void 0),
        t &&
          !s &&
          !$.match.call(void 0, D.TokenType.name) &&
          !$.match.call(void 0, D.TokenType._yield) &&
          ee.unexpected.call(void 0);
      let i = null;
      $.match.call(void 0, D.TokenType.name) &&
        (t || ((i = P.state.tokens.length), P.state.scopeDepth++),
        _s.parseBindingIdentifier.call(void 0, !1));
      let r = P.state.tokens.length;
      P.state.scopeDepth++, Sh(), Me.parseFunctionBodyAndFinish.call(void 0, e);
      let a = P.state.tokens.length;
      P.state.scopes.push(new gs.Scope(r, a, !0)),
        P.state.scopeDepth--,
        i !== null &&
          (P.state.scopes.push(new gs.Scope(i, a, !0)), P.state.scopeDepth--);
    }
    kt.parseFunction = fr;
    function Sh(e = !1, t = 0) {
      P.isTypeScriptEnabled
        ? mt.tsStartParseFunctionParams.call(void 0)
        : P.isFlowEnabled && Ft.flowStartParseFunctionParams.call(void 0),
        ee.expect.call(void 0, D.TokenType.parenL),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t),
        _s.parseBindingList.call(void 0, D.TokenType.parenR, !1, !1, e, t),
        t && (P.state.tokens[P.state.tokens.length - 1].contextId = t);
    }
    kt.parseFunctionParams = Sh;
    function Ro(e, t = !1) {
      let s = P.getNextContextId.call(void 0);
      $.next.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].contextId = s),
        (P.state.tokens[P.state.tokens.length - 1].isExpression = !e);
      let i = null;
      e || ((i = P.state.tokens.length), P.state.scopeDepth++), Sv(e, t), Iv();
      let r = P.state.tokens.length;
      if (
        (bv(s),
        !P.state.error &&
          ((P.state.tokens[r].contextId = s),
          (P.state.tokens[P.state.tokens.length - 1].contextId = s),
          i !== null))
      ) {
        let a = P.state.tokens.length;
        P.state.scopes.push(new gs.Scope(i, a, !1)), P.state.scopeDepth--;
      }
    }
    kt.parseClass = Ro;
    function Ih() {
      return (
        $.match.call(void 0, D.TokenType.eq) ||
        $.match.call(void 0, D.TokenType.semi) ||
        $.match.call(void 0, D.TokenType.braceR) ||
        $.match.call(void 0, D.TokenType.bang) ||
        $.match.call(void 0, D.TokenType.colon)
      );
    }
    function Eh() {
      return (
        $.match.call(void 0, D.TokenType.parenL) ||
        $.match.call(void 0, D.TokenType.lessThan)
      );
    }
    function bv(e) {
      for (
        ee.expect.call(void 0, D.TokenType.braceL);
        !$.eat.call(void 0, D.TokenType.braceR) && !P.state.error;

      ) {
        if ($.eat.call(void 0, D.TokenType.semi)) continue;
        if ($.match.call(void 0, D.TokenType.at)) {
          bh();
          continue;
        }
        let t = P.state.start;
        Cv(t, e);
      }
    }
    function Cv(e, t) {
      P.isTypeScriptEnabled &&
        mt.tsParseModifiers.call(void 0, [
          ve.ContextualKeyword._declare,
          ve.ContextualKeyword._public,
          ve.ContextualKeyword._protected,
          ve.ContextualKeyword._private,
          ve.ContextualKeyword._override,
        ]);
      let s = !1;
      if (
        $.match.call(void 0, D.TokenType.name) &&
        P.state.contextualKeyword === ve.ContextualKeyword._static
      ) {
        if ((Me.parseIdentifier.call(void 0), Eh())) {
          pr(e, !1);
          return;
        } else if (Ih()) {
          hr();
          return;
        }
        if (
          ((P.state.tokens[P.state.tokens.length - 1].type =
            D.TokenType._static),
          (s = !0),
          $.match.call(void 0, D.TokenType.braceL))
        ) {
          (P.state.tokens[P.state.tokens.length - 1].contextId = t), bi();
          return;
        }
      }
      wv(e, s, t);
    }
    function wv(e, t, s) {
      if (
        P.isTypeScriptEnabled &&
        mt.tsTryParseClassMemberWithIsStatic.call(void 0, t)
      )
        return;
      if ($.eat.call(void 0, D.TokenType.star)) {
        _i(s), pr(e, !1);
        return;
      }
      _i(s);
      let i = !1,
        r = P.state.tokens[P.state.tokens.length - 1];
      r.contextualKeyword === ve.ContextualKeyword._constructor && (i = !0),
        Yl(),
        Eh()
          ? pr(e, i)
          : Ih()
          ? hr()
          : r.contextualKeyword === ve.ContextualKeyword._async &&
            !ee.isLineTerminator.call(void 0)
          ? ((P.state.tokens[P.state.tokens.length - 1].type =
              D.TokenType._async),
            $.match.call(void 0, D.TokenType.star) && $.next.call(void 0),
            _i(s),
            Yl(),
            pr(e, !1))
          : (r.contextualKeyword === ve.ContextualKeyword._get ||
              r.contextualKeyword === ve.ContextualKeyword._set) &&
            !(
              ee.isLineTerminator.call(void 0) &&
              $.match.call(void 0, D.TokenType.star)
            )
          ? (r.contextualKeyword === ve.ContextualKeyword._get
              ? (P.state.tokens[P.state.tokens.length - 1].type =
                  D.TokenType._get)
              : (P.state.tokens[P.state.tokens.length - 1].type =
                  D.TokenType._set),
            _i(s),
            pr(e, !1))
          : r.contextualKeyword === ve.ContextualKeyword._accessor &&
            !ee.isLineTerminator.call(void 0)
          ? (_i(s), hr())
          : ee.isLineTerminator.call(void 0)
          ? hr()
          : ee.unexpected.call(void 0);
    }
    function pr(e, t) {
      P.isTypeScriptEnabled
        ? mt.tsTryParseTypeParameters.call(void 0)
        : P.isFlowEnabled &&
          $.match.call(void 0, D.TokenType.lessThan) &&
          Ft.flowParseTypeParameterDeclaration.call(void 0),
        Me.parseMethod.call(void 0, e, t);
    }
    function _i(e) {
      Me.parsePropertyName.call(void 0, e);
    }
    kt.parseClassPropertyName = _i;
    function Yl() {
      if (P.isTypeScriptEnabled) {
        let e = $.pushTypeContext.call(void 0, 0);
        $.eat.call(void 0, D.TokenType.question),
          $.popTypeContext.call(void 0, e);
      }
    }
    kt.parsePostMemberNameModifiers = Yl;
    function hr() {
      if (
        (P.isTypeScriptEnabled
          ? ($.eatTypeToken.call(void 0, D.TokenType.bang),
            mt.tsTryParseTypeAnnotation.call(void 0))
          : P.isFlowEnabled &&
            $.match.call(void 0, D.TokenType.colon) &&
            Ft.flowParseTypeAnnotation.call(void 0),
        $.match.call(void 0, D.TokenType.eq))
      ) {
        let e = P.state.tokens.length;
        $.next.call(void 0),
          Me.parseMaybeAssign.call(void 0),
          (P.state.tokens[e].rhsEndIndex = P.state.tokens.length);
      }
      ee.semicolon.call(void 0);
    }
    kt.parseClassProperty = hr;
    function Sv(e, t = !1) {
      (P.isTypeScriptEnabled &&
        (!e || t) &&
        ee.isContextual.call(void 0, ve.ContextualKeyword._implements)) ||
        ($.match.call(void 0, D.TokenType.name) &&
          _s.parseBindingIdentifier.call(void 0, !0),
        P.isTypeScriptEnabled
          ? mt.tsTryParseTypeParameters.call(void 0)
          : P.isFlowEnabled &&
            $.match.call(void 0, D.TokenType.lessThan) &&
            Ft.flowParseTypeParameterDeclaration.call(void 0));
    }
    function Iv() {
      let e = !1;
      $.eat.call(void 0, D.TokenType._extends)
        ? (Me.parseExprSubscripts.call(void 0), (e = !0))
        : (e = !1),
        P.isTypeScriptEnabled
          ? mt.tsAfterParseClassSuper.call(void 0, e)
          : P.isFlowEnabled && Ft.flowAfterParseClassSuper.call(void 0, e);
    }
    function Ah() {
      let e = P.state.tokens.length - 1;
      (P.isTypeScriptEnabled && mt.tsTryParseExport.call(void 0)) ||
        (Nv()
          ? Rv()
          : Pv()
          ? (Me.parseIdentifier.call(void 0),
            $.match.call(void 0, D.TokenType.comma) &&
            $.lookaheadType.call(void 0) === D.TokenType.star
              ? (ee.expect.call(void 0, D.TokenType.comma),
                ee.expect.call(void 0, D.TokenType.star),
                ee.expectContextual.call(void 0, ve.ContextualKeyword._as),
                Me.parseIdentifier.call(void 0))
              : Ph(),
            dr())
          : $.eat.call(void 0, D.TokenType._default)
          ? Ev()
          : Ov()
          ? Av()
          : (Zl(), dr()),
        (P.state.tokens[e].rhsEndIndex = P.state.tokens.length));
    }
    kt.parseExport = Ah;
    function Ev() {
      if (
        (P.isTypeScriptEnabled &&
          mt.tsTryParseExportDefaultExpression.call(void 0)) ||
        (P.isFlowEnabled && Ft.flowTryParseExportDefaultExpression.call(void 0))
      )
        return;
      let e = P.state.start;
      $.eat.call(void 0, D.TokenType._function)
        ? fr(e, !0, !0)
        : ee.isContextual.call(void 0, ve.ContextualKeyword._async) &&
          $.lookaheadType.call(void 0) === D.TokenType._function
        ? (ee.eatContextual.call(void 0, ve.ContextualKeyword._async),
          $.eat.call(void 0, D.TokenType._function),
          fr(e, !0, !0))
        : $.match.call(void 0, D.TokenType._class)
        ? Ro(!0, !0)
        : $.match.call(void 0, D.TokenType.at)
        ? (Jl(), Ro(!0, !0))
        : (Me.parseMaybeAssign.call(void 0), ee.semicolon.call(void 0));
    }
    function Av() {
      P.isTypeScriptEnabled
        ? mt.tsParseExportDeclaration.call(void 0)
        : P.isFlowEnabled
        ? Ft.flowParseExportDeclaration.call(void 0)
        : bn(!0);
    }
    function Pv() {
      if (P.isTypeScriptEnabled && mt.tsIsDeclarationStart.call(void 0))
        return !1;
      if (
        P.isFlowEnabled &&
        Ft.flowShouldDisallowExportDefaultSpecifier.call(void 0)
      )
        return !1;
      if ($.match.call(void 0, D.TokenType.name))
        return P.state.contextualKeyword !== ve.ContextualKeyword._async;
      if (!$.match.call(void 0, D.TokenType._default)) return !1;
      let e = $.nextTokenStart.call(void 0),
        t = $.lookaheadTypeAndKeyword.call(void 0),
        s =
          t.type === D.TokenType.name &&
          t.contextualKeyword === ve.ContextualKeyword._from;
      if (t.type === D.TokenType.comma) return !0;
      if (s) {
        let i = P.input.charCodeAt($.nextTokenStartSince.call(void 0, e + 4));
        return (
          i === xh.charCodes.quotationMark || i === xh.charCodes.apostrophe
        );
      }
      return !1;
    }
    function Ph() {
      $.eat.call(void 0, D.TokenType.comma) && Zl();
    }
    function dr() {
      ee.eatContextual.call(void 0, ve.ContextualKeyword._from) &&
        (Me.parseExprAtom.call(void 0), Lh()),
        ee.semicolon.call(void 0);
    }
    kt.parseExportFrom = dr;
    function Nv() {
      return P.isFlowEnabled
        ? Ft.flowShouldParseExportStar.call(void 0)
        : $.match.call(void 0, D.TokenType.star);
    }
    function Rv() {
      P.isFlowEnabled ? Ft.flowParseExportStar.call(void 0) : Nh();
    }
    function Nh() {
      ee.expect.call(void 0, D.TokenType.star),
        ee.isContextual.call(void 0, ve.ContextualKeyword._as) ? Lv() : dr();
    }
    kt.baseParseExportStar = Nh;
    function Lv() {
      $.next.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].type = D.TokenType._as),
        Me.parseIdentifier.call(void 0),
        Ph(),
        dr();
    }
    function Ov() {
      return (
        (P.isTypeScriptEnabled && mt.tsIsDeclarationStart.call(void 0)) ||
        (P.isFlowEnabled && Ft.flowShouldParseExportDeclaration.call(void 0)) ||
        P.state.type === D.TokenType._var ||
        P.state.type === D.TokenType._const ||
        P.state.type === D.TokenType._let ||
        P.state.type === D.TokenType._function ||
        P.state.type === D.TokenType._class ||
        ee.isContextual.call(void 0, ve.ContextualKeyword._async) ||
        $.match.call(void 0, D.TokenType.at)
      );
    }
    function Zl() {
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
        Dv();
      }
    }
    kt.parseExportSpecifiers = Zl;
    function Dv() {
      if (P.isTypeScriptEnabled) {
        mt.tsParseExportSpecifier.call(void 0);
        return;
      }
      Me.parseIdentifier.call(void 0),
        (P.state.tokens[P.state.tokens.length - 1].identifierRole =
          $.IdentifierRole.ExportAccess),
        ee.eatContextual.call(void 0, ve.ContextualKeyword._as) &&
          Me.parseIdentifier.call(void 0);
    }
    function Mv() {
      let e = P.state.snapshot();
      return (
        ee.expectContextual.call(void 0, ve.ContextualKeyword._module),
        ee.eatContextual.call(void 0, ve.ContextualKeyword._from)
          ? ee.isContextual.call(void 0, ve.ContextualKeyword._from)
            ? (P.state.restoreFromSnapshot(e), !0)
            : (P.state.restoreFromSnapshot(e), !1)
          : $.match.call(void 0, D.TokenType.comma)
          ? (P.state.restoreFromSnapshot(e), !1)
          : (P.state.restoreFromSnapshot(e), !0)
      );
    }
    function Fv() {
      ee.isContextual.call(void 0, ve.ContextualKeyword._module) &&
        Mv() &&
        $.next.call(void 0);
    }
    function Rh() {
      if (
        P.isTypeScriptEnabled &&
        $.match.call(void 0, D.TokenType.name) &&
        $.lookaheadType.call(void 0) === D.TokenType.eq
      ) {
        mt.tsParseImportEqualsDeclaration.call(void 0);
        return;
      }
      if (
        P.isTypeScriptEnabled &&
        ee.isContextual.call(void 0, ve.ContextualKeyword._type)
      ) {
        let e = $.lookaheadTypeAndKeyword.call(void 0);
        if (
          e.type === D.TokenType.name &&
          e.contextualKeyword !== ve.ContextualKeyword._from
        ) {
          if (
            (ee.expectContextual.call(void 0, ve.ContextualKeyword._type),
            $.lookaheadType.call(void 0) === D.TokenType.eq)
          ) {
            mt.tsParseImportEqualsDeclaration.call(void 0);
            return;
          }
        } else
          (e.type === D.TokenType.star || e.type === D.TokenType.braceL) &&
            ee.expectContextual.call(void 0, ve.ContextualKeyword._type);
      }
      $.match.call(void 0, D.TokenType.string) ||
        (Fv(),
        Vv(),
        ee.expectContextual.call(void 0, ve.ContextualKeyword._from)),
        Me.parseExprAtom.call(void 0),
        Lh(),
        ee.semicolon.call(void 0);
    }
    kt.parseImport = Rh;
    function Bv() {
      return $.match.call(void 0, D.TokenType.name);
    }
    function _h() {
      _s.parseImportedIdentifier.call(void 0);
    }
    function Vv() {
      P.isFlowEnabled && Ft.flowStartParseImportSpecifiers.call(void 0);
      let e = !0;
      if (!(Bv() && (_h(), !$.eat.call(void 0, D.TokenType.comma)))) {
        if ($.match.call(void 0, D.TokenType.star)) {
          $.next.call(void 0),
            ee.expectContextual.call(void 0, ve.ContextualKeyword._as),
            _h();
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
          jv();
        }
      }
    }
    function jv() {
      if (P.isTypeScriptEnabled) {
        mt.tsParseImportSpecifier.call(void 0);
        return;
      }
      if (P.isFlowEnabled) {
        Ft.flowParseImportSpecifier.call(void 0);
        return;
      }
      _s.parseImportedIdentifier.call(void 0),
        ee.isContextual.call(void 0, ve.ContextualKeyword._as) &&
          ((P.state.tokens[P.state.tokens.length - 1].identifierRole =
            $.IdentifierRole.ImportAccess),
          $.next.call(void 0),
          _s.parseImportedIdentifier.call(void 0));
    }
    function Lh() {
      ee.isContextual.call(void 0, ve.ContextualKeyword._assert) &&
        !ee.hasPrecedingLineBreak.call(void 0) &&
        ($.next.call(void 0), Me.parseObj.call(void 0, !1, !1));
    }
  });
  var Mh = Z((nc) => {
    'use strict';
    Object.defineProperty(nc, '__esModule', {value: !0});
    var Oh = _t(),
      Dh = tn(),
      tc = nn(),
      $v = ar();
    function Kv() {
      return (
        tc.state.pos === 0 &&
          tc.input.charCodeAt(0) === Dh.charCodes.numberSign &&
          tc.input.charCodeAt(1) === Dh.charCodes.exclamationMark &&
          Oh.skipLineComment.call(void 0, 2),
        Oh.nextToken.call(void 0),
        $v.parseTopLevel.call(void 0)
      );
    }
    nc.parseFile = Kv;
  });
  var ec = Z((Oo) => {
    'use strict';
    Object.defineProperty(Oo, '__esModule', {value: !0});
    var Lo = nn(),
      qv = Mh(),
      sc = class {
        constructor(t, s) {
          (this.tokens = t), (this.scopes = s);
        }
      };
    Oo.File = sc;
    function Uv(e, t, s, i) {
      if (i && s)
        throw new Error('Cannot combine flow and typescript plugins.');
      Lo.initParser.call(void 0, e, t, s, i);
      let r = qv.parseFile.call(void 0);
      if (Lo.state.error) throw Lo.augmentError.call(void 0, Lo.state.error);
      return r;
    }
    Oo.parse = Uv;
  });
  var Fh = Z((ic) => {
    'use strict';
    Object.defineProperty(ic, '__esModule', {value: !0});
    var Hv = Et();
    function Wv(e) {
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
          r.contextualKeyword === Hv.ContextualKeyword._await &&
            r.identifierRole == null &&
            r.scopeDepth === i.scopeDepth)
        )
          return !0;
        t += 1;
      } while (s > 0 && t < e.tokens.length);
      return !1;
    }
    ic.default = Wv;
  });
  var Bh = Z((oc) => {
    'use strict';
    Object.defineProperty(oc, '__esModule', {value: !0});
    function Gv(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Do = Ce(),
      zv = Fh(),
      Xv = Gv(zv),
      rc = class e {
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
            this.matches1AtIndex(t, Do.TokenType.name) &&
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
            if (this.matches1(Do.TokenType.braceL)) t++;
            else if (this.matches1(Do.TokenType.braceR)) {
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
              (t.isAsyncOperation = Xv.default.call(void 0, this)),
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
              this.tokenAtRelativeIndex(-1).type === Do.TokenType._delete
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
    oc.default = rc;
  });
  var $h = Z((lc) => {
    'use strict';
    Object.defineProperty(lc, '__esModule', {value: !0});
    var Vh = Et(),
      Re = Ce();
    function Yv(e, t, s, i) {
      let r = t.snapshot(),
        a = Jv(t),
        u = [],
        d = [],
        v = [],
        g = null,
        O = [],
        p = [],
        f = t.currentToken().contextId;
      if (f == null)
        throw new Error(
          'Expected non-null class context ID on class open-brace.'
        );
      for (t.nextToken(); !t.matchesContextIdAndLabel(Re.TokenType.braceR, f); )
        if (
          t.matchesContextual(Vh.ContextualKeyword._constructor) &&
          !t.currentToken().isType
        )
          ({constructorInitializerStatements: u, constructorInsertPos: g} =
            jh(t));
        else if (t.matches1(Re.TokenType.semi))
          i || p.push({start: t.currentIndex(), end: t.currentIndex() + 1}),
            t.nextToken();
        else if (t.currentToken().isType) t.nextToken();
        else {
          let T = t.currentIndex(),
            x = !1,
            w = !1,
            S = !1;
          for (; Mo(t.currentToken()); )
            t.matches1(Re.TokenType._static) && (x = !0),
              t.matches1(Re.TokenType.hash) && (w = !0),
              (t.matches1(Re.TokenType._declare) ||
                t.matches1(Re.TokenType._abstract)) &&
                (S = !0),
              t.nextToken();
          if (x && t.matches1(Re.TokenType.braceL)) {
            ac(t, f);
            continue;
          }
          if (w) {
            ac(t, f);
            continue;
          }
          if (
            t.matchesContextual(Vh.ContextualKeyword._constructor) &&
            !t.currentToken().isType
          ) {
            ({constructorInitializerStatements: u, constructorInsertPos: g} =
              jh(t));
            continue;
          }
          let A = t.currentIndex();
          if (
            (Qv(t),
            t.matches1(Re.TokenType.lessThan) ||
              t.matches1(Re.TokenType.parenL))
          ) {
            ac(t, f);
            continue;
          }
          for (; t.currentToken().isType; ) t.nextToken();
          if (t.matches1(Re.TokenType.eq)) {
            let q = t.currentIndex(),
              M = t.currentToken().rhsEndIndex;
            if (M == null)
              throw new Error(
                'Expected rhsEndIndex on class field assignment.'
              );
            for (t.nextToken(); t.currentIndex() < M; ) e.processToken();
            let c;
            x
              ? ((c = s.claimFreeName('__initStatic')), v.push(c))
              : ((c = s.claimFreeName('__init')), d.push(c)),
              O.push({
                initializerName: c,
                equalsIndex: q,
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
              staticInitializerNames: v,
              constructorInsertPos: g,
              fields: O,
              rangesToRemove: p,
            }
      );
    }
    lc.default = Yv;
    function ac(e, t) {
      for (e.nextToken(); e.currentToken().contextId !== t; ) e.nextToken();
      for (; Mo(e.tokenAtRelativeIndex(-1)); ) e.previousToken();
    }
    function Jv(e) {
      let t = e.currentToken(),
        s = t.contextId;
      if (s == null) throw new Error('Expected context ID on class token.');
      let i = t.isExpression;
      if (i == null) throw new Error('Expected isExpression on class token.');
      let r = null,
        a = !1;
      for (
        e.nextToken(),
          e.matches1(Re.TokenType.name) && (r = e.identifierName());
        !e.matchesContextIdAndLabel(Re.TokenType.braceL, s);

      )
        e.matches1(Re.TokenType._extends) &&
          !e.currentToken().isType &&
          (a = !0),
          e.nextToken();
      return {isExpression: i, className: r, hasSuperclass: a};
    }
    function jh(e) {
      let t = [];
      e.nextToken();
      let s = e.currentToken().contextId;
      if (s == null)
        throw new Error(
          'Expected context ID on open-paren starting constructor params.'
        );
      for (; !e.matchesContextIdAndLabel(Re.TokenType.parenR, s); )
        if (e.currentToken().contextId === s) {
          if ((e.nextToken(), Mo(e.currentToken()))) {
            for (e.nextToken(); Mo(e.currentToken()); ) e.nextToken();
            let a = e.currentToken();
            if (a.type !== Re.TokenType.name)
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
      for (; !e.matchesContextIdAndLabel(Re.TokenType.braceR, s); ) {
        if (!r && e.matches2(Re.TokenType._super, Re.TokenType.parenL)) {
          e.nextToken();
          let a = e.currentToken().contextId;
          if (a == null)
            throw new Error('Expected a context ID on the super call');
          for (; !e.matchesContextIdAndLabel(Re.TokenType.parenR, a); )
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
    function Mo(e) {
      return [
        Re.TokenType._async,
        Re.TokenType._get,
        Re.TokenType._set,
        Re.TokenType.plus,
        Re.TokenType.minus,
        Re.TokenType._readonly,
        Re.TokenType._static,
        Re.TokenType._public,
        Re.TokenType._private,
        Re.TokenType._protected,
        Re.TokenType._override,
        Re.TokenType._abstract,
        Re.TokenType.star,
        Re.TokenType._declare,
        Re.TokenType.hash,
      ].includes(e.type);
    }
    function Qv(e) {
      if (e.matches1(Re.TokenType.bracketL)) {
        let s = e.currentToken().contextId;
        if (s == null)
          throw new Error(
            'Expected class context ID on computed name open bracket.'
          );
        for (; !e.matchesContextIdAndLabel(Re.TokenType.bracketR, s); )
          e.nextToken();
        e.nextToken();
      } else e.nextToken();
    }
  });
  var uc = Z((cc) => {
    'use strict';
    Object.defineProperty(cc, '__esModule', {value: !0});
    var Kh = Ce();
    function Zv(e) {
      if (
        (e.removeInitialToken(),
        e.removeToken(),
        e.removeToken(),
        e.removeToken(),
        e.matches1(Kh.TokenType.parenL))
      )
        e.removeToken(), e.removeToken(), e.removeToken();
      else
        for (; e.matches1(Kh.TokenType.dot); ) e.removeToken(), e.removeToken();
    }
    cc.default = Zv;
  });
  var pc = Z((Fo) => {
    'use strict';
    Object.defineProperty(Fo, '__esModule', {value: !0});
    var ex = _t(),
      tx = Ce(),
      nx = {typeDeclarations: new Set(), valueDeclarations: new Set()};
    Fo.EMPTY_DECLARATION_INFO = nx;
    function sx(e) {
      let t = new Set(),
        s = new Set();
      for (let i = 0; i < e.tokens.length; i++) {
        let r = e.tokens[i];
        r.type === tx.TokenType.name &&
          ex.isTopLevelDeclaration.call(void 0, r) &&
          (r.isType
            ? t.add(e.identifierNameForToken(r))
            : s.add(e.identifierNameForToken(r)));
      }
      return {typeDeclarations: t, valueDeclarations: s};
    }
    Fo.default = sx;
  });
  var fc = Z((hc) => {
    'use strict';
    Object.defineProperty(hc, '__esModule', {value: !0});
    var ix = Et(),
      qh = Ce();
    function rx(e) {
      e.matches2(qh.TokenType.name, qh.TokenType.braceL) &&
        e.matchesContextual(ix.ContextualKeyword._assert) &&
        (e.removeToken(),
        e.removeToken(),
        e.removeBalancedCode(),
        e.removeToken());
    }
    hc.removeMaybeImportAssertion = rx;
  });
  var mc = Z((dc) => {
    'use strict';
    Object.defineProperty(dc, '__esModule', {value: !0});
    var Uh = Ce();
    function ox(e, t, s) {
      if (!e) return !1;
      let i = t.currentToken();
      if (i.rhsEndIndex == null)
        throw new Error('Expected non-null rhsEndIndex on export token.');
      let r = i.rhsEndIndex - t.currentIndex();
      if (
        r !== 3 &&
        !(r === 4 && t.matches1AtIndex(i.rhsEndIndex - 1, Uh.TokenType.semi))
      )
        return !1;
      let a = t.tokenAtRelativeIndex(2);
      if (a.type !== Uh.TokenType.name) return !1;
      let u = t.identifierNameForToken(a);
      return s.typeDeclarations.has(u) && !s.valueDeclarations.has(u);
    }
    dc.default = ox;
  });
  var Wh = Z((yc) => {
    'use strict';
    Object.defineProperty(yc, '__esModule', {value: !0});
    function mr(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Bo = _t(),
      Ms = Et(),
      N = Ce(),
      ax = uc(),
      lx = mr(ax),
      Hh = pc(),
      cx = mr(Hh),
      ux = Ji(),
      px = mr(ux),
      Vo = fc(),
      hx = mc(),
      fx = mr(hx),
      dx = dn(),
      mx = mr(dx),
      Tc = class e extends mx.default {
        __init() {
          this.hadExport = !1;
        }
        __init2() {
          this.hadNamedExport = !1;
        }
        __init3() {
          this.hadDefaultExport = !1;
        }
        constructor(t, s, i, r, a, u, d, v, g, O) {
          super(),
            (this.rootTransformer = t),
            (this.tokens = s),
            (this.importProcessor = i),
            (this.nameManager = r),
            (this.helperManager = a),
            (this.reactHotLoaderTransformer = u),
            (this.enableLegacyBabel5ModuleInterop = d),
            (this.enableLegacyTypeScriptModuleInterop = v),
            (this.isTypeScriptTransformEnabled = g),
            (this.preserveDynamicImport = O),
            e.prototype.__init.call(this),
            e.prototype.__init2.call(this),
            e.prototype.__init3.call(this),
            (this.declarationInfo = g
              ? cx.default.call(void 0, s)
              : Hh.EMPTY_DECLARATION_INFO);
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
              ? lx.default.call(void 0, this.tokens)
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
          Vo.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(N.TokenType.semi) && this.tokens.removeToken();
        }
        removeImportAndDetectIfType() {
          if (
            (this.tokens.removeInitialToken(),
            this.tokens.matchesContextual(Ms.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                N.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                Ms.ContextualKeyword._from
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
          if (t.identifierRole === Bo.IdentifierRole.ObjectShorthand)
            return this.processObjectShorthand();
          if (t.identifierRole !== Bo.IdentifierRole.Access) return !1;
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
              Ms.ContextualKeyword._type
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
              this.tokens.matchesContextual(Ms.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  N.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                Vo.removeMaybeImportAssertion.call(void 0, this.tokens)),
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
                Ms.ContextualKeyword._async
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
            fx.default.call(
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
                if (Bo.isDeclaration.call(void 0, i)) {
                  let r = this.tokens.identifierName(),
                    a = this.importProcessor.getIdentifierReplacement(r);
                  if (a === null)
                    throw new Error(
                      `Expected a replacement for ${r} in \`export var\` syntax.`
                    );
                  Bo.isObjectShorthandDeclaration.call(void 0, i) &&
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
            if (!this.tokens.matchesContextual(Ms.ContextualKeyword._async))
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
            let s = px.default.call(void 0, this.tokens);
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
          if (this.tokens.matchesContextual(Ms.ContextualKeyword._from)) {
            this.tokens.removeToken();
            let s = this.tokens.stringValue();
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              this.importProcessor.claimImportCode(s)
            ),
              Vo.removeMaybeImportAssertion.call(void 0, this.tokens);
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
            Vo.removeMaybeImportAssertion.call(void 0, this.tokens),
            this.tokens.matches1(N.TokenType.semi) && this.tokens.removeToken();
        }
        shouldElideExportedIdentifier(t) {
          return (
            this.isTypeScriptTransformEnabled &&
            !this.declarationInfo.valueDeclarations.has(t)
          );
        }
      };
    yc.default = Tc;
  });
  var Yh = Z((vc) => {
    'use strict';
    Object.defineProperty(vc, '__esModule', {value: !0});
    function Tr(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var ns = Et(),
      se = Ce(),
      Tx = uc(),
      yx = Tr(Tx),
      Xh = pc(),
      kx = Tr(Xh),
      vx = Ji(),
      Gh = Tr(vx),
      xx = Ga(),
      zh = fc(),
      gx = mc(),
      _x = Tr(gx),
      bx = dn(),
      Cx = Tr(bx),
      kc = class extends Cx.default {
        constructor(t, s, i, r, a, u) {
          super(),
            (this.tokens = t),
            (this.nameManager = s),
            (this.helperManager = i),
            (this.reactHotLoaderTransformer = r),
            (this.isTypeScriptTransformEnabled = a),
            (this.nonTypeIdentifiers = a
              ? xx.getNonTypeIdentifiers.call(void 0, t, u)
              : new Set()),
            (this.declarationInfo = a
              ? kx.default.call(void 0, t)
              : Xh.EMPTY_DECLARATION_INFO),
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
              ns.ContextualKeyword._type
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
              ns.ContextualKeyword._type
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
              ns.ContextualKeyword._type
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
              this.tokens.matchesContextual(ns.ContextualKeyword._from) &&
                this.tokens.matches1AtIndex(
                  this.tokens.currentIndex() + 1,
                  se.TokenType.string
                ) &&
                (this.tokens.removeToken(),
                this.tokens.removeToken(),
                zh.removeMaybeImportAssertion.call(void 0, this.tokens)),
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
              ? yx.default.call(void 0, this.tokens)
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
              zh.removeMaybeImportAssertion.call(void 0, this.tokens),
              this.tokens.matches1(se.TokenType.semi) &&
                this.tokens.removeToken();
          }
          return !0;
        }
        removeImportTypeBindings() {
          if (
            (this.tokens.copyExpectedToken(se.TokenType._import),
            this.tokens.matchesContextual(ns.ContextualKeyword._type) &&
              !this.tokens.matches1AtIndex(
                this.tokens.currentIndex() + 1,
                se.TokenType.comma
              ) &&
              !this.tokens.matchesContextualAtIndex(
                this.tokens.currentIndex() + 1,
                ns.ContextualKeyword._from
              ))
          )
            return !0;
          if (this.tokens.matches1(se.TokenType.string))
            return this.tokens.copyToken(), !1;
          this.tokens.matchesContextual(ns.ContextualKeyword._module) &&
            this.tokens.matchesContextualAtIndex(
              this.tokens.currentIndex() + 2,
              ns.ContextualKeyword._from
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
              let i = Gh.default.call(void 0, this.tokens);
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
            _x.default.call(
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
                  ns.ContextualKeyword._async
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
            let t = Gh.default.call(void 0, this.tokens);
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
    vc.default = kc;
  });
  var Qh = Z((gc) => {
    'use strict';
    Object.defineProperty(gc, '__esModule', {value: !0});
    function wx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Jh = Et(),
      an = Ce(),
      Sx = dn(),
      Ix = wx(Sx),
      xc = class extends Ix.default {
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
            : this.tokens.matches1(an.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2(an.TokenType._export, an.TokenType._enum)
            ? (this.processNamedExportEnum(), !0)
            : this.tokens.matches3(
                an.TokenType._export,
                an.TokenType._default,
                an.TokenType._enum
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
            this.tokens.copyExpectedToken(an.TokenType.name);
          let t = !1;
          this.tokens.matchesContextual(Jh.ContextualKeyword._of) &&
            (this.tokens.removeToken(),
            (t = this.tokens.matchesContextual(Jh.ContextualKeyword._symbol)),
            this.tokens.removeToken());
          let s = this.tokens.matches3(
            an.TokenType.braceL,
            an.TokenType.name,
            an.TokenType.eq
          );
          this.tokens.appendCode(' = require("flow-enums-runtime")');
          let i = !t && !s;
          for (
            this.tokens.replaceTokenTrimmingLeftWhitespace(
              i ? '.Mirrored([' : '({'
            );
            !this.tokens.matches1(an.TokenType.braceR);

          ) {
            if (this.tokens.matches1(an.TokenType.ellipsis)) {
              this.tokens.removeToken();
              break;
            }
            this.processEnumElement(t, s),
              this.tokens.matches1(an.TokenType.comma) &&
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
    gc.default = xc;
  });
  var Zh = Z((bc) => {
    'use strict';
    Object.defineProperty(bc, '__esModule', {value: !0});
    function Ex(e) {
      return e && e.__esModule ? e : {default: e};
    }
    function Ax(e) {
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
    var ss = Ce(),
      Px = dn(),
      Nx = Ex(Px),
      jo = 'jest',
      Rx = ['mock', 'unmock', 'enableAutomock', 'disableAutomock'],
      _c = class e extends Nx.default {
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
              ss.TokenType.name,
              ss.TokenType.dot,
              ss.TokenType.name,
              ss.TokenType.parenL
            ) &&
            this.tokens.identifierName() === jo
            ? Ax([
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
                (t) => t(jo),
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
              ss.TokenType.dot,
              ss.TokenType.name,
              ss.TokenType.parenL
            );

          ) {
            let s = this.tokens.identifierNameAtIndex(
              this.tokens.currentIndex() + 1
            );
            if (Rx.includes(s)) {
              let r = this.nameManager.claimFreeName('__jestHoist');
              this.hoistedFunctionNames.push(r),
                this.tokens.replaceToken(`function ${r}(){${jo}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(ss.TokenType.parenR),
                this.tokens.appendCode(';}'),
                (t = !1);
            } else
              t ? this.tokens.copyToken() : this.tokens.replaceToken(`${jo}.`),
                this.tokens.copyToken(),
                this.tokens.copyToken(),
                this.rootTransformer.processBalancedCode(),
                this.tokens.copyExpectedToken(ss.TokenType.parenR),
                (t = !0);
          }
          return !0;
        }
      };
    bc.default = _c;
  });
  var ef = Z((wc) => {
    'use strict';
    Object.defineProperty(wc, '__esModule', {value: !0});
    function Lx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Ox = Ce(),
      Dx = dn(),
      Mx = Lx(Dx),
      Cc = class extends Mx.default {
        constructor(t) {
          super(), (this.tokens = t);
        }
        process() {
          if (this.tokens.matches1(Ox.TokenType.num)) {
            let t = this.tokens.currentTokenCode();
            if (t.includes('_'))
              return this.tokens.replaceToken(t.replace(/_/g, '')), !0;
          }
          return !1;
        }
      };
    wc.default = Cc;
  });
  var nf = Z((Ic) => {
    'use strict';
    Object.defineProperty(Ic, '__esModule', {value: !0});
    function Fx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var tf = Ce(),
      Bx = dn(),
      Vx = Fx(Bx),
      Sc = class extends Vx.default {
        constructor(t, s) {
          super(), (this.tokens = t), (this.nameManager = s);
        }
        process() {
          return this.tokens.matches2(tf.TokenType._catch, tf.TokenType.braceL)
            ? (this.tokens.copyToken(),
              this.tokens.appendCode(
                ` (${this.nameManager.claimFreeName('e')})`
              ),
              !0)
            : !1;
        }
      };
    Ic.default = Sc;
  });
  var sf = Z((Ac) => {
    'use strict';
    Object.defineProperty(Ac, '__esModule', {value: !0});
    function jx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Kt = Ce(),
      $x = dn(),
      Kx = jx($x),
      Ec = class extends Kx.default {
        constructor(t, s) {
          super(), (this.tokens = t), (this.nameManager = s);
        }
        process() {
          if (this.tokens.matches1(Kt.TokenType.nullishCoalescing)) {
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
            this.tokens.matches1(Kt.TokenType._delete) &&
            this.tokens.tokenAtRelativeIndex(1).isOptionalChainStart
          )
            return this.tokens.removeInitialToken(), !0;
          let s = this.tokens.currentToken().subscriptStartIndex;
          if (
            s != null &&
            this.tokens.tokens[s].isOptionalChainStart &&
            this.tokens.tokenAtRelativeIndex(-1).type !== Kt.TokenType._super
          ) {
            let i = this.nameManager.claimFreeName('_'),
              r;
            if (
              (s > 0 &&
              this.tokens.matches1AtIndex(s - 1, Kt.TokenType._delete) &&
              this.isLastSubscriptInChain()
                ? (r = `${i} => delete ${i}`)
                : (r = `${i} => ${i}`),
              this.tokens.tokens[s].isAsyncOperation && (r = `async ${r}`),
              this.tokens.matches2(
                Kt.TokenType.questionDot,
                Kt.TokenType.parenL
              ) ||
                this.tokens.matches2(
                  Kt.TokenType.questionDot,
                  Kt.TokenType.lessThan
                ))
            )
              this.justSkippedSuper() && this.tokens.appendCode('.bind(this)'),
                this.tokens.replaceTokenTrimmingLeftWhitespace(
                  `, 'optionalCall', ${r}`
                );
            else if (
              this.tokens.matches2(
                Kt.TokenType.questionDot,
                Kt.TokenType.bracketL
              )
            )
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}`
              );
            else if (this.tokens.matches1(Kt.TokenType.questionDot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'optionalAccess', ${r}.`
              );
            else if (this.tokens.matches1(Kt.TokenType.dot))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}.`
              );
            else if (this.tokens.matches1(Kt.TokenType.bracketL))
              this.tokens.replaceTokenTrimmingLeftWhitespace(
                `, 'access', ${r}[`
              );
            else if (this.tokens.matches1(Kt.TokenType.parenL))
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
              return this.tokens.tokens[s - 1].type === Kt.TokenType._super;
            s--;
          }
        }
      };
    Ac.default = Ec;
  });
  var of = Z((Nc) => {
    'use strict';
    Object.defineProperty(Nc, '__esModule', {value: !0});
    function qx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var rf = _t(),
      At = Ce(),
      Ux = dn(),
      Hx = qx(Ux),
      Pc = class extends Hx.default {
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
              At.TokenType.name,
              At.TokenType.dot,
              At.TokenType.name
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
            (this.tokens.copyExpectedToken(At.TokenType.parenL),
            this.tokens.copyExpectedToken(At.TokenType.braceL),
            this.tokens.appendCode(`displayName: '${s}',`),
            this.rootTransformer.processBalancedCode(),
            this.tokens.copyExpectedToken(At.TokenType.braceR),
            this.tokens.copyExpectedToken(At.TokenType.parenR));
        }
        findDisplayName(t) {
          return t < 2
            ? null
            : this.tokens.matches2AtIndex(
                t - 2,
                At.TokenType.name,
                At.TokenType.eq
              )
            ? this.tokens.identifierNameAtIndex(t - 2)
            : t >= 2 &&
              this.tokens.tokens[t - 2].identifierRole ===
                rf.IdentifierRole.ObjectKey
            ? this.tokens.identifierNameAtIndex(t - 2)
            : this.tokens.matches2AtIndex(
                t - 2,
                At.TokenType._export,
                At.TokenType._default
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
          if (!this.tokens.matches2(At.TokenType.parenL, At.TokenType.braceL))
            return !1;
          let s = t + 1,
            i = this.tokens.tokens[s].contextId;
          if (i == null)
            throw new Error(
              'Expected non-null context ID on object open-brace.'
            );
          for (; t < this.tokens.tokens.length; t++) {
            let r = this.tokens.tokens[t];
            if (r.type === At.TokenType.braceR && r.contextId === i) {
              t++;
              break;
            }
            if (
              this.tokens.identifierNameAtIndex(t) === 'displayName' &&
              this.tokens.tokens[t].identifierRole ===
                rf.IdentifierRole.ObjectKey &&
              r.contextId === i
            )
              return !1;
          }
          if (t === this.tokens.tokens.length)
            throw new Error(
              'Unexpected end of input when processing React class.'
            );
          return (
            this.tokens.matches1AtIndex(t, At.TokenType.parenR) ||
            this.tokens.matches2AtIndex(
              t,
              At.TokenType.comma,
              At.TokenType.parenR
            )
          );
        }
      };
    Nc.default = Pc;
  });
  var lf = Z((Lc) => {
    'use strict';
    Object.defineProperty(Lc, '__esModule', {value: !0});
    function Wx(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var af = _t(),
      Gx = dn(),
      zx = Wx(Gx),
      Rc = class e extends zx.default {
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
              af.isTopLevelDeclaration.call(void 0, i) &&
              i.identifierRole !== af.IdentifierRole.ImportDeclaration &&
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
    Lc.default = Rc;
  });
  var uf = Z((Oc) => {
    'use strict';
    Object.defineProperty(Oc, '__esModule', {value: !0});
    var cf = ui(),
      Xx = new Set([
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
    function Yx(e) {
      if (e.length === 0 || !cf.IS_IDENTIFIER_START[e.charCodeAt(0)]) return !1;
      for (let t = 1; t < e.length; t++)
        if (!cf.IS_IDENTIFIER_CHAR[e.charCodeAt(t)]) return !1;
      return !Xx.has(e);
    }
    Oc.default = Yx;
  });
  var ff = Z((Mc) => {
    'use strict';
    Object.defineProperty(Mc, '__esModule', {value: !0});
    function hf(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Ke = Ce(),
      Jx = uf(),
      pf = hf(Jx),
      Qx = dn(),
      Zx = hf(Qx),
      Dc = class extends Zx.default {
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
            : this.tokens.matches1(Ke.TokenType._public) ||
              this.tokens.matches1(Ke.TokenType._protected) ||
              this.tokens.matches1(Ke.TokenType._private) ||
              this.tokens.matches1(Ke.TokenType._abstract) ||
              this.tokens.matches1(Ke.TokenType._readonly) ||
              this.tokens.matches1(Ke.TokenType._override) ||
              this.tokens.matches1(Ke.TokenType.nonNullAssertion)
            ? (this.tokens.removeInitialToken(), !0)
            : this.tokens.matches1(Ke.TokenType._enum) ||
              this.tokens.matches2(Ke.TokenType._const, Ke.TokenType._enum)
            ? (this.processEnum(), !0)
            : this.tokens.matches2(Ke.TokenType._export, Ke.TokenType._enum) ||
              this.tokens.matches3(
                Ke.TokenType._export,
                Ke.TokenType._const,
                Ke.TokenType._enum
              )
            ? (this.processEnum(!0), !0)
            : !1;
        }
        processEnum(t = !1) {
          for (
            this.tokens.removeInitialToken();
            this.tokens.matches1(Ke.TokenType._const) ||
            this.tokens.matches1(Ke.TokenType._enum);

          )
            this.tokens.removeToken();
          let s = this.tokens.identifierName();
          this.tokens.removeToken(),
            t &&
              !this.isImportsTransformEnabled &&
              this.tokens.appendCode('export '),
            this.tokens.appendCode(`var ${s}; (function (${s})`),
            this.tokens.copyExpectedToken(Ke.TokenType.braceL),
            this.processEnumBody(s),
            this.tokens.copyExpectedToken(Ke.TokenType.braceR),
            t && this.isImportsTransformEnabled
              ? this.tokens.appendCode(`)(${s} || (exports.${s} = ${s} = {}));`)
              : this.tokens.appendCode(`)(${s} || (${s} = {}));`);
        }
        processEnumBody(t) {
          let s = null;
          for (; !this.tokens.matches1(Ke.TokenType.braceR); ) {
            let {nameStringCode: i, variableName: r} = this.extractEnumKeyInfo(
              this.tokens.currentToken()
            );
            this.tokens.removeInitialToken(),
              this.tokens.matches3(
                Ke.TokenType.eq,
                Ke.TokenType.string,
                Ke.TokenType.comma
              ) ||
              this.tokens.matches3(
                Ke.TokenType.eq,
                Ke.TokenType.string,
                Ke.TokenType.braceR
              )
                ? this.processStringLiteralEnumMember(t, i, r)
                : this.tokens.matches1(Ke.TokenType.eq)
                ? this.processExplicitValueEnumMember(t, i, r)
                : this.processImplicitValueEnumMember(t, i, r, s),
              this.tokens.matches1(Ke.TokenType.comma) &&
                this.tokens.removeToken(),
              r != null ? (s = r) : (s = `${t}[${i}]`);
          }
        }
        extractEnumKeyInfo(t) {
          if (t.type === Ke.TokenType.name) {
            let s = this.tokens.identifierNameForToken(t);
            return {
              nameStringCode: `"${s}"`,
              variableName: pf.default.call(void 0, s) ? s : null,
            };
          } else if (t.type === Ke.TokenType.string) {
            let s = this.tokens.stringValueForToken(t);
            return {
              nameStringCode: this.tokens.code.slice(t.start, t.end),
              variableName: pf.default.call(void 0, s) ? s : null,
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
    Mc.default = Dc;
  });
  var df = Z((Bc) => {
    'use strict';
    Object.defineProperty(Bc, '__esModule', {value: !0});
    function kn(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var eg = Et(),
      ct = Ce(),
      tg = $h(),
      ng = kn(tg),
      sg = Wh(),
      ig = kn(sg),
      rg = Yh(),
      og = kn(rg),
      ag = Qh(),
      lg = kn(ag),
      cg = Zh(),
      ug = kn(cg),
      pg = Ha(),
      hg = kn(pg),
      fg = ef(),
      dg = kn(fg),
      mg = nf(),
      Tg = kn(mg),
      yg = sf(),
      kg = kn(yg),
      vg = of(),
      xg = kn(vg),
      gg = lf(),
      _g = kn(gg),
      bg = ff(),
      Cg = kn(bg),
      Fc = class e {
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
              (this.transformers.push(new kg.default(a, this.nameManager)),
              this.transformers.push(new dg.default(a)),
              this.transformers.push(new Tg.default(a, this.nameManager))),
            s.includes('jsx') &&
              (r.jsxRuntime !== 'preserve' &&
                this.transformers.push(
                  new hg.default(this, a, u, this.nameManager, r)
                ),
              this.transformers.push(new xg.default(this, a, u, r)));
          let d = null;
          if (s.includes('react-hot-loader')) {
            if (!r.filePath)
              throw new Error(
                'filePath is required when using the react-hot-loader transform.'
              );
            (d = new _g.default(a, r.filePath)), this.transformers.push(d);
          }
          if (s.includes('imports')) {
            if (u === null)
              throw new Error(
                'Expected non-null importProcessor with imports transform enabled.'
              );
            this.transformers.push(
              new ig.default(
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
              new og.default(
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
              new lg.default(this, a, s.includes('imports'))
            ),
            s.includes('typescript') &&
              this.transformers.push(
                new Cg.default(this, a, s.includes('imports'))
              ),
            s.includes('jest') &&
              this.transformers.push(
                new ug.default(this, a, this.nameManager, u)
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
              this.tokens.matches1(ct.TokenType.braceL) ||
              this.tokens.matches1(ct.TokenType.dollarBraceL)
            )
              t++;
            else if (this.tokens.matches1(ct.TokenType.braceR)) {
              if (t === 0) return;
              t--;
            }
            if (this.tokens.matches1(ct.TokenType.parenL)) s++;
            else if (this.tokens.matches1(ct.TokenType.parenR)) {
              if (s === 0) return;
              s--;
            }
            this.processToken();
          }
        }
        processToken() {
          if (this.tokens.matches1(ct.TokenType._class)) {
            this.processClass();
            return;
          }
          for (let t of this.transformers) if (t.process()) return;
          this.tokens.copyToken();
        }
        processNamedClass() {
          if (!this.tokens.matches2(ct.TokenType._class, ct.TokenType.name))
            throw new Error('Expected identifier for exported class name.');
          let t = this.tokens.identifierNameAtIndex(
            this.tokens.currentIndex() + 1
          );
          return this.processClass(), t;
        }
        processClass() {
          let t = ng.default.call(
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
            this.tokens.copyExpectedToken(ct.TokenType._class);
            !this.tokens.matchesContextIdAndLabel(ct.TokenType.braceL, a);

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
              rangesToRemove: v,
            } = t,
            g = 0,
            O = 0,
            p = this.tokens.currentToken().contextId;
          if (p == null)
            throw new Error('Expected non-null context ID on class.');
          this.tokens.copyExpectedToken(ct.TokenType.braceL),
            this.isReactHotLoaderTransformEnabled &&
              this.tokens.appendCode(
                '__reactstandin__regenerateByEval(key, code) {this[key] = eval(code);}'
              );
          let f = a.length + d.length > 0;
          if (r === null && f) {
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
            !this.tokens.matchesContextIdAndLabel(ct.TokenType.braceR, p);

          )
            if (g < u.length && this.tokens.currentIndex() === u[g].start) {
              let T = !1;
              for (
                this.tokens.matches1(ct.TokenType.bracketL)
                  ? this.tokens.copyTokenWithPrefix(
                      `${u[g].initializerName}() {this`
                    )
                  : this.tokens.matches1(ct.TokenType.string) ||
                    this.tokens.matches1(ct.TokenType.num)
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
              O < v.length &&
              this.tokens.currentIndex() >= v[O].start
            ) {
              for (
                this.tokens.currentIndex() < v[O].end &&
                this.tokens.removeInitialToken();
                this.tokens.currentIndex() < v[O].end;

              )
                this.tokens.removeToken();
              O++;
            } else
              this.tokens.currentIndex() === r
                ? (this.tokens.copyToken(),
                  f &&
                    this.tokens.appendCode(
                      `;${this.makeConstructorInitCode(a, d, s)};`
                    ),
                  this.processToken())
                : this.processToken();
          this.tokens.copyExpectedToken(ct.TokenType.braceR);
        }
        makeConstructorInitCode(t, s, i) {
          return [...t, ...s.map((r) => `${i}.prototype.${r}.call(this)`)].join(
            ';'
          );
        }
        processPossibleArrowParamEnd() {
          if (
            this.tokens.matches2(ct.TokenType.parenR, ct.TokenType.colon) &&
            this.tokens.tokenAtRelativeIndex(1).isType
          ) {
            let t = this.tokens.currentIndex() + 1;
            for (; this.tokens.tokens[t].isType; ) t++;
            if (this.tokens.matches1AtIndex(t, ct.TokenType.arrow)) {
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
            !this.tokens.matchesContextual(eg.ContextualKeyword._async) &&
            !this.tokens.matches1(ct.TokenType._async)
          )
            return !1;
          let t = this.tokens.tokenAtRelativeIndex(1);
          if (t.type !== ct.TokenType.lessThan || !t.isType) return !1;
          let s = this.tokens.currentIndex() + 1;
          for (; this.tokens.tokens[s].isType; ) s++;
          if (this.tokens.matches1AtIndex(s, ct.TokenType.parenL)) {
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
    Bc.default = Fc;
  });
  var yf = Z((yr) => {
    'use strict';
    yr.__esModule = !0;
    yr.LinesAndColumns = void 0;
    var $o = `
`,
      mf = '\r',
      Tf = (function () {
        function e(t) {
          this.string = t;
          for (var s = [0], i = 0; i < t.length; )
            switch (t[i]) {
              case $o:
                (i += $o.length), s.push(i);
                break;
              case mf:
                (i += mf.length), t[i] === $o && (i += $o.length), s.push(i);
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
    yr.LinesAndColumns = Tf;
    yr.default = Tf;
  });
  var kf = Z((Vc) => {
    'use strict';
    Object.defineProperty(Vc, '__esModule', {value: !0});
    function wg(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Sg = yf(),
      Ig = wg(Sg),
      Eg = Ce();
    function Ag(e, t) {
      if (t.length === 0) return '';
      let s = Object.keys(t[0]).filter(
          (f) =>
            f !== 'type' &&
            f !== 'value' &&
            f !== 'start' &&
            f !== 'end' &&
            f !== 'loc'
        ),
        i = Object.keys(t[0].type).filter(
          (f) => f !== 'label' && f !== 'keyword'
        ),
        r = ['Location', 'Label', 'Raw', ...s, ...i],
        a = new Ig.default(e),
        u = [r, ...t.map(v)],
        d = r.map(() => 0);
      for (let f of u)
        for (let T = 0; T < f.length; T++) d[T] = Math.max(d[T], f[T].length);
      return u.map((f) => f.map((T, x) => T.padEnd(d[x])).join(' ')).join(`
`);
      function v(f) {
        let T = e.slice(f.start, f.end);
        return [
          O(f.start, f.end),
          Eg.formatTokenType.call(void 0, f.type),
          Pg(String(T), 14),
          ...s.map((x) => g(f[x], x)),
          ...i.map((x) => g(f.type[x], x)),
        ];
      }
      function g(f, T) {
        return f === !0 ? T : f === !1 || f === null ? '' : String(f);
      }
      function O(f, T) {
        return `${p(f)}-${p(T)}`;
      }
      function p(f) {
        let T = a.locationForIndex(f);
        return T ? `${T.line + 1}:${T.column + 1}` : 'Unknown';
      }
    }
    Vc.default = Ag;
    function Pg(e, t) {
      return e.length > t ? `${e.slice(0, t - 3)}...` : e;
    }
  });
  var vf = Z((jc) => {
    'use strict';
    Object.defineProperty(jc, '__esModule', {value: !0});
    function Ng(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var zt = Ce(),
      Rg = Ji(),
      Lg = Ng(Rg);
    function Og(e) {
      let t = new Set();
      for (let s = 0; s < e.tokens.length; s++)
        e.matches1AtIndex(s, zt.TokenType._import) &&
          !e.matches3AtIndex(
            s,
            zt.TokenType._import,
            zt.TokenType.name,
            zt.TokenType.eq
          ) &&
          Dg(e, s, t);
      return t;
    }
    jc.default = Og;
    function Dg(e, t, s) {
      t++,
        !e.matches1AtIndex(t, zt.TokenType.parenL) &&
          (e.matches1AtIndex(t, zt.TokenType.name) &&
            (s.add(e.identifierNameAtIndex(t)),
            t++,
            e.matches1AtIndex(t, zt.TokenType.comma) && t++),
          e.matches1AtIndex(t, zt.TokenType.star) &&
            ((t += 2), s.add(e.identifierNameAtIndex(t)), t++),
          e.matches1AtIndex(t, zt.TokenType.braceL) && (t++, Mg(e, t, s)));
    }
    function Mg(e, t, s) {
      for (;;) {
        if (e.matches1AtIndex(t, zt.TokenType.braceR)) return;
        let i = Lg.default.call(void 0, e, t);
        if (
          ((t = i.endIndex),
          i.isType || s.add(i.rightName),
          e.matches2AtIndex(t, zt.TokenType.comma, zt.TokenType.braceR))
        )
          return;
        if (e.matches1AtIndex(t, zt.TokenType.braceR)) return;
        if (e.matches1AtIndex(t, zt.TokenType.comma)) t++;
        else
          throw new Error(`Unexpected token: ${JSON.stringify(e.tokens[t])}`);
      }
    }
  });
  var _f = Z((kr) => {
    'use strict';
    Object.defineProperty(kr, '__esModule', {value: !0});
    function bs(e) {
      return e && e.__esModule ? e : {default: e};
    }
    var Fg = q1(),
      Bg = bs(Fg),
      Vg = Z1(),
      jg = bs(Vg),
      $g = ep(),
      Kg = sp(),
      xf = bs(Kg),
      qg = rp(),
      Ug = bs(qg),
      Hg = bp(),
      Wg = ec(),
      Gg = Bh(),
      zg = bs(Gg),
      Xg = df(),
      Yg = bs(Xg),
      Jg = kf(),
      Qg = bs(Jg),
      Zg = vf(),
      e_ = bs(Zg);
    function t_() {
      return '3.32.0';
    }
    kr.getVersion = t_;
    function n_(e, t) {
      Hg.validateOptions.call(void 0, t);
      try {
        let s = gf(e, t),
          r = new Yg.default(
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
            sourceMap: jg.default.call(
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
    kr.transform = n_;
    function s_(e, t) {
      let s = gf(e, t).tokenProcessor.tokens;
      return Qg.default.call(void 0, e, s);
    }
    kr.getFormattedTokens = s_;
    function gf(e, t) {
      let s = t.transforms.includes('jsx'),
        i = t.transforms.includes('typescript'),
        r = t.transforms.includes('flow'),
        a = t.disableESTransforms === !0,
        u = Wg.parse.call(void 0, e, s, i, r),
        d = u.tokens,
        v = u.scopes,
        g = new Ug.default(e, d),
        O = new $g.HelperManager(g),
        p = new zg.default(e, d, r, a, O),
        f = !!t.enableLegacyTypeScriptModuleInterop,
        T = null;
      return (
        t.transforms.includes('imports')
          ? ((T = new Bg.default(
              g,
              p,
              f,
              t,
              t.transforms.includes('typescript'),
              O
            )),
            T.preprocessTokens(),
            xf.default.call(void 0, p, v, T.getGlobalNames()),
            t.transforms.includes('typescript') && T.pruneTypeOnlyImports())
          : t.transforms.includes('typescript') &&
            xf.default.call(void 0, p, v, e_.default.call(void 0, p)),
        {
          tokenProcessor: p,
          scopes: v,
          nameManager: g,
          importProcessor: T,
          helperManager: O,
        }
      );
    }
  });
  var Cf = Z((Ko, bf) => {
    (function (e, t) {
      typeof Ko == 'object' && typeof bf < 'u'
        ? t(Ko)
        : typeof define == 'function' && define.amd
        ? define(['exports'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t((e.acorn = {})));
    })(Ko, function (e) {
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
        v = /^in(stanceof)?$/,
        g = new RegExp('[' + r + ']'),
        O = new RegExp('[' + r + i + ']');
      function p(n, o) {
        for (var l = 65536, h = 0; h < o.length; h += 2) {
          if (((l += o[h]), l > n)) return !1;
          if (((l += o[h + 1]), l >= n)) return !0;
        }
        return !1;
      }
      function f(n, o) {
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
          ? n >= 170 && O.test(String.fromCharCode(n))
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
        q = {};
      function M(n, o) {
        return o === void 0 && (o = {}), (o.keyword = n), (q[n] = new x(n, o));
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
        for (var h = o; h < l; h++) {
          var m = n.charCodeAt(h);
          if (X(m))
            return h < l - 1 && m === 13 && n.charCodeAt(h + 1) === 10
              ? h + 2
              : h + 1;
        }
        return -1;
      }
      var he = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/,
        ae = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g,
        We = Object.prototype,
        qe = We.hasOwnProperty,
        Bt = We.toString,
        Tt =
          Object.hasOwn ||
          function (n, o) {
            return qe.call(n, o);
          },
        vt =
          Array.isArray ||
          function (n) {
            return Bt.call(n) === '[object Array]';
          },
        Pt = Object.create(null);
      function nt(n) {
        return (
          Pt[n] || (Pt[n] = new RegExp('^(?:' + n.replace(/ /g, '|') + ')$'))
        );
      }
      function st(n) {
        return n <= 65535
          ? String.fromCharCode(n)
          : ((n -= 65536),
            String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
      }
      var Ct =
          /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,
        ut = function (o, l) {
          (this.line = o), (this.column = l);
        };
      ut.prototype.offset = function (o) {
        return new ut(this.line, this.column + o);
      };
      var St = function (o, l, h) {
        (this.start = l),
          (this.end = h),
          o.sourceFile !== null && (this.source = o.sourceFile);
      };
      function qt(n, o) {
        for (var l = 1, h = 0; ; ) {
          var m = ie(n, h, o);
          if (m < 0) return new ut(l, o - h);
          ++l, (h = m);
        }
      }
      var Nt = {
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
        Ut = !1;
      function vn(n) {
        var o = {};
        for (var l in Nt) o[l] = n && Tt(n, l) ? n[l] : Nt[l];
        if (
          (o.ecmaVersion === 'latest'
            ? (o.ecmaVersion = 1e8)
            : o.ecmaVersion == null
            ? (!Ut &&
                typeof console == 'object' &&
                console.warn &&
                ((Ut = !0),
                console.warn(`Since Acorn 8.0.0, options.ecmaVersion is required.
Defaulting to 2020, but this will stop working in the future.`)),
              (o.ecmaVersion = 11))
            : o.ecmaVersion >= 2015 && (o.ecmaVersion -= 2009),
          o.allowReserved == null && (o.allowReserved = o.ecmaVersion < 5),
          (!n || n.allowHashBang == null) &&
            (o.allowHashBang = o.ecmaVersion >= 14),
          vt(o.onToken))
        ) {
          var h = o.onToken;
          o.onToken = function (m) {
            return h.push(m);
          };
        }
        return vt(o.onComment) && (o.onComment = V(o, o.onComment)), o;
      }
      function V(n, o) {
        return function (l, h, m, E, L, Y) {
          var Q = {type: l ? 'Block' : 'Line', value: h, start: m, end: E};
          n.locations && (Q.loc = new St(this, L, Y)),
            n.ranges && (Q.range = [m, E]),
            o.push(Q);
        };
      }
      var G = 1,
        J = 2,
        re = 4,
        xe = 8,
        fe = 16,
        Ee = 32,
        Ae = 64,
        Oe = 128,
        Ye = 256,
        Ge = 512,
        Ue = G | J | Ye;
      function pt(n, o) {
        return J | (n ? re : 0) | (o ? xe : 0);
      }
      var ht = 0,
        wt = 1,
        yt = 2,
        xt = 3,
        Cn = 4,
        Bn = 5,
        ze = function (o, l, h) {
          (this.options = o = vn(o)),
            (this.sourceFile = o.sourceFile),
            (this.keywords = nt(
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
            (this.reservedWords = nt(m));
          var E = (m ? m + ' ' : '') + a.strict;
          (this.reservedWordsStrict = nt(E)),
            (this.reservedWordsStrictBind = nt(E + ' ' + a.strictBind)),
            (this.input = String(l)),
            (this.containsEsc = !1),
            h
              ? ((this.pos = h),
                (this.lineStart =
                  this.input.lastIndexOf(
                    `
`,
                    h - 1
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
        It = {
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
      (ze.prototype.parse = function () {
        var o = this.options.program || this.startNode();
        return this.nextToken(), this.parseTopLevel(o);
      }),
        (It.inFunction.get = function () {
          return (this.currentVarScope().flags & J) > 0;
        }),
        (It.inGenerator.get = function () {
          return (this.currentVarScope().flags & xe) > 0;
        }),
        (It.inAsync.get = function () {
          return (this.currentVarScope().flags & re) > 0;
        }),
        (It.canAwait.get = function () {
          for (var n = this.scopeStack.length - 1; n >= 0; n--) {
            var o = this.scopeStack[n],
              l = o.flags;
            if (l & (Ye | Ge)) return !1;
            if (l & J) return (l & re) > 0;
          }
          return (
            (this.inModule && this.options.ecmaVersion >= 13) ||
            this.options.allowAwaitOutsideFunction
          );
        }),
        (It.allowSuper.get = function () {
          var n = this.currentThisScope(),
            o = n.flags;
          return (o & Ae) > 0 || this.options.allowSuperOutsideMethod;
        }),
        (It.allowDirectSuper.get = function () {
          return (this.currentThisScope().flags & Oe) > 0;
        }),
        (It.treatFunctionsAsVar.get = function () {
          return this.treatFunctionsAsVarInScope(this.currentScope());
        }),
        (It.allowNewDotTarget.get = function () {
          for (var n = this.scopeStack.length - 1; n >= 0; n--) {
            var o = this.scopeStack[n],
              l = o.flags;
            if (l & (Ye | Ge) || (l & J && !(l & fe))) return !0;
          }
          return !1;
        }),
        (It.inClassStaticBlock.get = function () {
          return (this.currentVarScope().flags & Ye) > 0;
        }),
        (ze.extend = function () {
          for (var o = [], l = arguments.length; l--; ) o[l] = arguments[l];
          for (var h = this, m = 0; m < o.length; m++) h = o[m](h);
          return h;
        }),
        (ze.parse = function (o, l) {
          return new this(l, o).parse();
        }),
        (ze.parseExpressionAt = function (o, l, h) {
          var m = new this(h, o, l);
          return m.nextToken(), m.parseExpression();
        }),
        (ze.tokenizer = function (o, l) {
          return new this(l, o);
        }),
        Object.defineProperties(ze.prototype, It);
      var at = ze.prototype,
        Xt = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
      (at.strictDirective = function (n) {
        if (this.options.ecmaVersion < 5) return !1;
        for (;;) {
          (ae.lastIndex = n), (n += ae.exec(this.input)[0].length);
          var o = Xt.exec(this.input.slice(n));
          if (!o) return !1;
          if ((o[1] || o[2]) === 'use strict') {
            ae.lastIndex = n + o[0].length;
            var l = ae.exec(this.input),
              h = l.index + l[0].length,
              m = this.input.charAt(h);
            return (
              m === ';' ||
              m === '}' ||
              (R.test(l[0]) &&
                !(
                  /[(`.[+\-/*%<>=,?^&]/.test(m) ||
                  (m === '!' && this.input.charAt(h + 1) === '=')
                ))
            );
          }
          (n += o[0].length),
            (ae.lastIndex = n),
            (n += ae.exec(this.input)[0].length),
            this.input[n] === ';' && n++;
        }
      }),
        (at.eat = function (n) {
          return this.type === n ? (this.next(), !0) : !1;
        }),
        (at.isContextual = function (n) {
          return this.type === c.name && this.value === n && !this.containsEsc;
        }),
        (at.eatContextual = function (n) {
          return this.isContextual(n) ? (this.next(), !0) : !1;
        }),
        (at.expectContextual = function (n) {
          this.eatContextual(n) || this.unexpected();
        }),
        (at.canInsertSemicolon = function () {
          return (
            this.type === c.eof ||
            this.type === c.braceR ||
            R.test(this.input.slice(this.lastTokEnd, this.start))
          );
        }),
        (at.insertSemicolon = function () {
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
        (at.semicolon = function () {
          !this.eat(c.semi) && !this.insertSemicolon() && this.unexpected();
        }),
        (at.afterTrailingComma = function (n, o) {
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
        (at.expect = function (n) {
          this.eat(n) || this.unexpected();
        }),
        (at.unexpected = function (n) {
          this.raise(n ?? this.start, 'Unexpected token');
        });
      var Yt = function () {
        this.shorthandAssign =
          this.trailingComma =
          this.parenthesizedAssign =
          this.parenthesizedBind =
          this.doubleProto =
            -1;
      };
      (at.checkPatternErrors = function (n, o) {
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
        (at.checkExpressionErrors = function (n, o) {
          if (!n) return !1;
          var l = n.shorthandAssign,
            h = n.doubleProto;
          if (!o) return l >= 0 || h >= 0;
          l >= 0 &&
            this.raise(
              l,
              'Shorthand property assignments are valid only in destructuring patterns'
            ),
            h >= 0 &&
              this.raiseRecoverable(h, 'Redefinition of __proto__ property');
        }),
        (at.checkYieldAwaitInDefaultParams = function () {
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
        (at.isSimpleAssignTarget = function (n) {
          return n.type === 'ParenthesizedExpression'
            ? this.isSimpleAssignTarget(n.expression)
            : n.type === 'Identifier' || n.type === 'MemberExpression';
        });
      var te = ze.prototype;
      te.parseTopLevel = function (n) {
        var o = Object.create(null);
        for (n.body || (n.body = []); this.type !== c.eof; ) {
          var l = this.parseStatement(null, !0, o);
          n.body.push(l);
        }
        if (this.inModule)
          for (
            var h = 0, m = Object.keys(this.undefinedExports);
            h < m.length;
            h += 1
          ) {
            var E = m[h];
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
      var wn = {kind: 'loop'},
        is = {kind: 'switch'};
      (te.isLet = function (n) {
        if (this.options.ecmaVersion < 6 || !this.isContextual('let'))
          return !1;
        ae.lastIndex = this.pos;
        var o = ae.exec(this.input),
          l = this.pos + o[0].length,
          h = this.input.charCodeAt(l);
        if (h === 91 || h === 92) return !0;
        if (n) return !1;
        if (h === 123 || (h > 55295 && h < 56320)) return !0;
        if (f(h, !0)) {
          for (var m = l + 1; T((h = this.input.charCodeAt(m)), !0); ) ++m;
          if (h === 92 || (h > 55295 && h < 56320)) return !0;
          var E = this.input.slice(l, m);
          if (!v.test(E)) return !0;
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
            h = this.pos + l[0].length;
          if (R.test(this.input.slice(this.pos, h))) return !1;
          if (n) {
            var m = h + 5,
              E;
            if (
              this.input.slice(h, m) !== 'using' ||
              m === this.input.length ||
              T((E = this.input.charCodeAt(m))) ||
              (E > 55295 && E < 56320)
            )
              return !1;
            ae.lastIndex = m;
            var L = ae.exec(this.input);
            if (L && R.test(this.input.slice(m, m + L[0].length))) return !1;
          }
          if (o) {
            var Y = h + 2,
              Q;
            if (
              this.input.slice(h, Y) === 'of' &&
              (Y === this.input.length ||
                (!T((Q = this.input.charCodeAt(Y))) &&
                  !(Q > 55295 && Q < 56320)))
            )
              return !1;
          }
          var ke = this.input.charCodeAt(h);
          return f(ke, !0) || ke === 92;
        }),
        (te.isAwaitUsing = function (n) {
          return this.isUsingKeyword(!0, n);
        }),
        (te.isUsing = function (n) {
          return this.isUsingKeyword(!1, n);
        }),
        (te.parseStatement = function (n, o, l) {
          var h = this.type,
            m = this.startNode(),
            E;
          switch ((this.isLet(n) && ((h = c._var), (E = 'let')), h)) {
            case c._break:
            case c._continue:
              return this.parseBreakContinueStatement(m, h.keyword);
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
              if (this.options.ecmaVersion > 10 && h === c._import) {
                ae.lastIndex = this.pos;
                var L = ae.exec(this.input),
                  Y = this.pos + L[0].length,
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
                h === c._import ? this.parseImport(m) : this.parseExport(m, l)
              );
            default:
              if (this.isAsyncFunction())
                return (
                  n && this.unexpected(),
                  this.next(),
                  this.parseFunctionStatement(m, !0, !n)
                );
              var ke = this.isAwaitUsing(!1)
                ? 'await using'
                : this.isUsing(!1)
                ? 'using'
                : null;
              if (ke)
                return (
                  o &&
                    this.options.sourceType === 'script' &&
                    this.raise(
                      this.start,
                      'Using declaration cannot appear in the top level when source type is `script`'
                    ),
                  ke === 'await using' &&
                    (this.canAwait ||
                      this.raise(
                        this.start,
                        'Await using cannot appear outside of async function'
                      ),
                    this.next()),
                  this.next(),
                  this.parseVar(m, !1, ke),
                  this.semicolon(),
                  this.finishNode(m, 'VariableDeclaration')
                );
              var ge = this.value,
                et = this.parseExpression();
              return h === c.name &&
                et.type === 'Identifier' &&
                this.eat(c.colon)
                ? this.parseLabeledStatement(m, ge, et, n)
                : this.parseExpressionStatement(m, et);
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
          for (var h = 0; h < this.labels.length; ++h) {
            var m = this.labels[h];
            if (
              (n.label == null || m.name === n.label.name) &&
              ((m.kind != null && (l || m.kind === 'loop')) || (n.label && l))
            )
              break;
          }
          return (
            h === this.labels.length && this.raise(n.start, 'Unsyntactic ' + o),
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
            this.labels.push(wn),
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
            (this.labels.push(wn),
            this.enterScope(0),
            this.expect(c.parenL),
            this.type === c.semi)
          )
            return o > -1 && this.unexpected(o), this.parseFor(n, null);
          var l = this.isLet();
          if (this.type === c._var || this.type === c._const || l) {
            var h = this.startNode(),
              m = l ? 'let' : this.value;
            return (
              this.next(),
              this.parseVar(h, !0, m),
              this.finishNode(h, 'VariableDeclaration'),
              this.parseForAfterInit(n, h, o)
            );
          }
          var E = this.isContextual('let'),
            L = !1,
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
          var ke = this.containsEsc,
            ge = new Yt(),
            et = this.start,
            Ot =
              o > -1
                ? this.parseExprSubscripts(ge, 'await')
                : this.parseExpression(!0, ge);
          return this.type === c._in ||
            (L = this.options.ecmaVersion >= 6 && this.isContextual('of'))
            ? (o > -1
                ? (this.type === c._in && this.unexpected(o), (n.await = !0))
                : L &&
                  this.options.ecmaVersion >= 8 &&
                  (Ot.start === et &&
                  !ke &&
                  Ot.type === 'Identifier' &&
                  Ot.name === 'async'
                    ? this.unexpected()
                    : this.options.ecmaVersion >= 9 && (n.await = !1)),
              E &&
                L &&
                this.raise(
                  Ot.start,
                  "The left-hand side of a for-of loop may not start with 'let'."
                ),
              this.toAssignable(Ot, !1, ge),
              this.checkLValPattern(Ot),
              this.parseForIn(n, Ot))
            : (this.checkExpressionErrors(ge, !0),
              o > -1 && this.unexpected(o),
              this.parseFor(n, Ot));
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
          return this.next(), this.parseFunction(n, Vn | (l ? 0 : Cs), !1, o);
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
            this.labels.push(is),
            this.enterScope(0);
          for (var o, l = !1; this.type !== c.braceR; )
            if (this.type === c._case || this.type === c._default) {
              var h = this.type === c._case;
              o && this.finishNode(o, 'SwitchCase'),
                n.cases.push((o = this.startNode())),
                (o.consequent = []),
                this.next(),
                h
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
      var Ci = [];
      (te.parseCatchClauseParam = function () {
        var n = this.parseBindingAtom(),
          o = n.type === 'Identifier';
        return (
          this.enterScope(o ? Ee : 0),
          this.checkLValPattern(n, o ? Cn : yt),
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
            this.labels.push(wn),
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
        (te.parseLabeledStatement = function (n, o, l, h) {
          for (var m = 0, E = this.labels; m < E.length; m += 1) {
            var L = E[m];
            L.name === o &&
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
            var ke = this.labels[Q];
            if (ke.statementStart === n.start)
              (ke.statementStart = this.start), (ke.kind = Y);
            else break;
          }
          return (
            this.labels.push({name: o, kind: Y, statementStart: this.start}),
            (n.body = this.parseStatement(
              h ? (h.indexOf('label') === -1 ? h + 'label' : h) : 'label'
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
            var h = this.parseStatement(null);
            o.body.push(h);
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
        (te.parseVar = function (n, o, l, h) {
          for (n.declarations = [], n.kind = l; ; ) {
            var m = this.startNode();
            if (
              (this.parseVarId(m, l),
              this.eat(c.eq)
                ? (m.init = this.parseMaybeAssign(o))
                : !h &&
                  l === 'const' &&
                  !(
                    this.type === c._in ||
                    (this.options.ecmaVersion >= 6 && this.isContextual('of'))
                  )
                ? this.unexpected()
                : !h &&
                  (l === 'using' || l === 'await using') &&
                  this.options.ecmaVersion >= 17 &&
                  this.type !== c._in &&
                  !this.isContextual('of')
                ? this.raise(
                    this.lastTokEnd,
                    'Missing initializer in ' + l + ' declaration'
                  )
                : !h &&
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
            this.checkLValPattern(n.id, o === 'var' ? wt : yt, !1);
        });
      var Vn = 1,
        Cs = 2,
        Bs = 4;
      (te.parseFunction = function (n, o, l, h, m) {
        this.initFunction(n),
          (this.options.ecmaVersion >= 9 ||
            (this.options.ecmaVersion >= 6 && !h)) &&
            (this.type === c.star && o & Cs && this.unexpected(),
            (n.generator = this.eat(c.star))),
          this.options.ecmaVersion >= 8 && (n.async = !!h),
          o & Vn &&
            ((n.id = o & Bs && this.type !== c.name ? null : this.parseIdent()),
            n.id &&
              !(o & Cs) &&
              this.checkLValSimple(
                n.id,
                this.strict || n.generator || n.async
                  ? this.treatFunctionsAsVar
                    ? wt
                    : yt
                  : xt
              ));
        var E = this.yieldPos,
          L = this.awaitPos,
          Y = this.awaitIdentPos;
        return (
          (this.yieldPos = 0),
          (this.awaitPos = 0),
          (this.awaitIdentPos = 0),
          this.enterScope(pt(n.async, n.generator)),
          o & Vn || (n.id = this.type === c.name ? this.parseIdent() : null),
          this.parseFunctionParams(n),
          this.parseFunctionBody(n, l, !1, m),
          (this.yieldPos = E),
          (this.awaitPos = L),
          (this.awaitIdentPos = Y),
          this.finishNode(
            n,
            o & Vn ? 'FunctionDeclaration' : 'FunctionExpression'
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
          var h = this.enterClassBody(),
            m = this.startNode(),
            E = !1;
          for (m.body = [], this.expect(c.braceL); this.type !== c.braceR; ) {
            var L = this.parseClassElement(n.superClass !== null);
            L &&
              (m.body.push(L),
              L.type === 'MethodDefinition' && L.kind === 'constructor'
                ? (E &&
                    this.raiseRecoverable(
                      L.start,
                      'Duplicate constructor in the same class'
                    ),
                  (E = !0))
                : L.key &&
                  L.key.type === 'PrivateIdentifier' &&
                  wi(h, L) &&
                  this.raiseRecoverable(
                    L.key.start,
                    "Identifier '#" + L.key.name + "' has already been declared"
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
            h = '',
            m = !1,
            E = !1,
            L = 'method',
            Y = !1;
          if (this.eatContextual('static')) {
            if (o >= 13 && this.eat(c.braceL))
              return this.parseClassStaticBlock(l), l;
            this.isClassElementNameStart() || this.type === c.star
              ? (Y = !0)
              : (h = 'static');
          }
          if (
            ((l.static = Y),
            !h &&
              o >= 8 &&
              this.eatContextual('async') &&
              ((this.isClassElementNameStart() || this.type === c.star) &&
              !this.canInsertSemicolon()
                ? (E = !0)
                : (h = 'async')),
            !h && (o >= 9 || !E) && this.eat(c.star) && (m = !0),
            !h && !E && !m)
          ) {
            var Q = this.value;
            (this.eatContextual('get') || this.eatContextual('set')) &&
              (this.isClassElementNameStart() ? (L = Q) : (h = Q));
          }
          if (
            (h
              ? ((l.computed = !1),
                (l.key = this.startNodeAt(
                  this.lastTokStart,
                  this.lastTokStartLoc
                )),
                (l.key.name = h),
                this.finishNode(l.key, 'Identifier'))
              : this.parseClassElementName(l),
            o < 13 || this.type === c.parenL || L !== 'method' || m || E)
          ) {
            var ke = !l.static && rs(l, 'constructor'),
              ge = ke && n;
            ke &&
              L !== 'method' &&
              this.raise(
                l.key.start,
                "Constructor can't have get/set modifier"
              ),
              (l.kind = ke ? 'constructor' : L),
              this.parseClassMethod(l, m, E, ge);
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
        (te.parseClassMethod = function (n, o, l, h) {
          var m = n.key;
          n.kind === 'constructor'
            ? (o && this.raise(m.start, "Constructor can't be a generator"),
              l && this.raise(m.start, "Constructor can't be an async method"))
            : n.static &&
              rs(n, 'prototype') &&
              this.raise(
                m.start,
                'Classes may not have a static property named prototype'
              );
          var E = (n.value = this.parseMethod(o, l, h));
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
            rs(n, 'constructor')
              ? this.raise(
                  n.key.start,
                  "Classes can't have a field named 'constructor'"
                )
              : n.static &&
                rs(n, 'prototype') &&
                this.raise(
                  n.key.start,
                  "Classes can't have a static field named 'prototype'"
                ),
            this.eat(c.eq)
              ? (this.enterScope(Ge | Ae),
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
            this.labels = [], this.enterScope(Ye | Ae);
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
              var h = this.privateNameStack.length,
                m = h === 0 ? null : this.privateNameStack[h - 1],
                E = 0;
              E < l.length;
              ++E
            ) {
              var L = l[E];
              Tt(o, L.name) ||
                (m
                  ? m.used.push(L)
                  : this.raiseRecoverable(
                      L.start,
                      "Private field '#" +
                        L.name +
                        "' must be declared in an enclosing class"
                    ));
            }
        });
      function wi(n, o) {
        var l = o.key.name,
          h = n[l],
          m = 'true';
        return (
          o.type === 'MethodDefinition' &&
            (o.kind === 'get' || o.kind === 'set') &&
            (m = (o.static ? 's' : 'i') + o.kind),
          (h === 'iget' && m === 'iset') ||
          (h === 'iset' && m === 'iget') ||
          (h === 'sget' && m === 'sset') ||
          (h === 'sset' && m === 'sget')
            ? ((n[l] = 'true'), !1)
            : h
            ? !0
            : ((n[l] = m), !1)
        );
      }
      function rs(n, o) {
        var l = n.computed,
          h = n.key;
        return (
          !l &&
          ((h.type === 'Identifier' && h.name === o) ||
            (h.type === 'Literal' && h.value === o))
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
              for (var l = 0, h = n.specifiers; l < h.length; l += 1) {
                var m = h[l];
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
              this.parseFunction(o, Vn | Bs, !1, n)
            );
          } else if (this.type === c._class) {
            var l = this.startNode();
            return this.parseClass(l, 'nullableID');
          } else {
            var h = this.parseMaybeAssign();
            return this.semicolon(), h;
          }
        }),
        (te.checkExport = function (n, o, l) {
          n &&
            (typeof o != 'string' &&
              (o = o.type === 'Identifier' ? o.name : o.value),
            Tt(n, o) &&
              this.raiseRecoverable(l, "Duplicate export '" + o + "'"),
            (n[o] = !0));
        }),
        (te.checkPatternExport = function (n, o) {
          var l = o.type;
          if (l === 'Identifier') this.checkExport(n, o, o.start);
          else if (l === 'ObjectPattern')
            for (var h = 0, m = o.properties; h < m.length; h += 1) {
              var E = m[h];
              this.checkPatternExport(n, E);
            }
          else if (l === 'ArrayPattern')
            for (var L = 0, Y = o.elements; L < Y.length; L += 1) {
              var Q = Y[L];
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
            for (var l = 0, h = o; l < h.length; l += 1) {
              var m = h[l];
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
              ? ((n.specifiers = Ci), (n.source = this.parseExprAtom()))
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
            var h = this.parseImportAttribute(),
              m = h.key.type === 'Identifier' ? h.key.name : h.key.value;
            Tt(o, m) &&
              this.raiseRecoverable(
                h.key.start,
                "Duplicate attribute key '" + m + "'"
              ),
              (o[m] = !0),
              n.push(h);
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
              Ct.test(n.value) &&
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
      var Rt = ze.prototype;
      (Rt.toAssignable = function (n, o, l) {
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
              for (var h = 0, m = n.properties; h < m.length; h += 1) {
                var E = m[h];
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
        (Rt.toAssignableList = function (n, o) {
          for (var l = n.length, h = 0; h < l; h++) {
            var m = n[h];
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
        (Rt.parseSpread = function (n) {
          var o = this.startNode();
          return (
            this.next(),
            (o.argument = this.parseMaybeAssign(!1, n)),
            this.finishNode(o, 'SpreadElement')
          );
        }),
        (Rt.parseRestBinding = function () {
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
        (Rt.parseBindingAtom = function () {
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
        (Rt.parseBindingList = function (n, o, l, h) {
          for (var m = [], E = !0; !this.eat(n); )
            if (
              (E ? (E = !1) : this.expect(c.comma), o && this.type === c.comma)
            )
              m.push(null);
            else {
              if (l && this.afterTrailingComma(n)) break;
              if (this.type === c.ellipsis) {
                var L = this.parseRestBinding();
                this.parseBindingListItem(L),
                  m.push(L),
                  this.type === c.comma &&
                    this.raiseRecoverable(
                      this.start,
                      'Comma is not permitted after the rest element'
                    ),
                  this.expect(n);
                break;
              } else m.push(this.parseAssignableListItem(h));
            }
          return m;
        }),
        (Rt.parseAssignableListItem = function (n) {
          var o = this.parseMaybeDefault(this.start, this.startLoc);
          return this.parseBindingListItem(o), o;
        }),
        (Rt.parseBindingListItem = function (n) {
          return n;
        }),
        (Rt.parseMaybeDefault = function (n, o, l) {
          if (
            ((l = l || this.parseBindingAtom()),
            this.options.ecmaVersion < 6 || !this.eat(c.eq))
          )
            return l;
          var h = this.startNodeAt(n, o);
          return (
            (h.left = l),
            (h.right = this.parseMaybeAssign()),
            this.finishNode(h, 'AssignmentPattern')
          );
        }),
        (Rt.checkLValSimple = function (n, o, l) {
          o === void 0 && (o = ht);
          var h = o !== ht;
          switch (n.type) {
            case 'Identifier':
              this.strict &&
                this.reservedWordsStrictBind.test(n.name) &&
                this.raiseRecoverable(
                  n.start,
                  (h ? 'Binding ' : 'Assigning to ') +
                    n.name +
                    ' in strict mode'
                ),
                h &&
                  (o === yt &&
                    n.name === 'let' &&
                    this.raiseRecoverable(
                      n.start,
                      'let is disallowed as a lexically bound name'
                    ),
                  l &&
                    (Tt(l, n.name) &&
                      this.raiseRecoverable(n.start, 'Argument name clash'),
                    (l[n.name] = !0)),
                  o !== Bn && this.declareName(n.name, o, n.start));
              break;
            case 'ChainExpression':
              this.raiseRecoverable(
                n.start,
                'Optional chaining cannot appear in left-hand side'
              );
              break;
            case 'MemberExpression':
              h && this.raiseRecoverable(n.start, 'Binding member expression');
              break;
            case 'ParenthesizedExpression':
              return (
                h &&
                  this.raiseRecoverable(
                    n.start,
                    'Binding parenthesized expression'
                  ),
                this.checkLValSimple(n.expression, o, l)
              );
            default:
              this.raise(n.start, (h ? 'Binding' : 'Assigning to') + ' rvalue');
          }
        }),
        (Rt.checkLValPattern = function (n, o, l) {
          switch ((o === void 0 && (o = ht), n.type)) {
            case 'ObjectPattern':
              for (var h = 0, m = n.properties; h < m.length; h += 1) {
                var E = m[h];
                this.checkLValInnerPattern(E, o, l);
              }
              break;
            case 'ArrayPattern':
              for (var L = 0, Y = n.elements; L < Y.length; L += 1) {
                var Q = Y[L];
                Q && this.checkLValInnerPattern(Q, o, l);
              }
              break;
            default:
              this.checkLValSimple(n, o, l);
          }
        }),
        (Rt.checkLValInnerPattern = function (n, o, l) {
          switch ((o === void 0 && (o = ht), n.type)) {
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
      var Lt = function (o, l, h, m, E) {
          (this.token = o),
            (this.isExpr = !!l),
            (this.preserveSpace = !!h),
            (this.override = m),
            (this.generator = !!E);
        },
        He = {
          b_stat: new Lt('{', !1),
          b_expr: new Lt('{', !0),
          b_tmpl: new Lt('${', !1),
          p_stat: new Lt('(', !1),
          p_expr: new Lt('(', !0),
          q_tmpl: new Lt('`', !0, !0, function (n) {
            return n.tryReadTemplateToken();
          }),
          f_stat: new Lt('function', !1),
          f_expr: new Lt('function', !0),
          f_expr_gen: new Lt('function', !0, !1, null, !0),
          f_gen: new Lt('function', !1, !1, null, !0),
        },
        Sn = ze.prototype;
      (Sn.initialContext = function () {
        return [He.b_stat];
      }),
        (Sn.curContext = function () {
          return this.context[this.context.length - 1];
        }),
        (Sn.braceIsBlock = function (n) {
          var o = this.curContext();
          return o === He.f_expr || o === He.f_stat
            ? !0
            : n === c.colon && (o === He.b_stat || o === He.b_expr)
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
            ? o === He.b_stat
            : n === c._var || n === c._const || n === c.name
            ? !1
            : !this.exprAllowed;
        }),
        (Sn.inGeneratorContext = function () {
          for (var n = this.context.length - 1; n >= 1; n--) {
            var o = this.context[n];
            if (o.token === 'function') return o.generator;
          }
          return !1;
        }),
        (Sn.updateContext = function (n) {
          var o,
            l = this.type;
          l.keyword && n === c.dot
            ? (this.exprAllowed = !1)
            : (o = l.updateContext)
            ? o.call(this, n)
            : (this.exprAllowed = l.beforeExpr);
        }),
        (Sn.overrideContext = function (n) {
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
            n === He.b_stat &&
              this.curContext().token === 'function' &&
              (n = this.context.pop()),
              (this.exprAllowed = !n.isExpr);
          }),
        (c.braceL.updateContext = function (n) {
          this.context.push(this.braceIsBlock(n) ? He.b_stat : He.b_expr),
            (this.exprAllowed = !0);
        }),
        (c.dollarBraceL.updateContext = function () {
          this.context.push(He.b_tmpl), (this.exprAllowed = !0);
        }),
        (c.parenL.updateContext = function (n) {
          var o =
            n === c._if || n === c._for || n === c._with || n === c._while;
          this.context.push(o ? He.p_stat : He.p_expr), (this.exprAllowed = !0);
        }),
        (c.incDec.updateContext = function () {}),
        (c._function.updateContext = c._class.updateContext =
          function (n) {
            n.beforeExpr &&
            n !== c._else &&
            !(n === c.semi && this.curContext() !== He.p_stat) &&
            !(
              n === c._return &&
              R.test(this.input.slice(this.lastTokEnd, this.start))
            ) &&
            !(
              (n === c.colon || n === c.braceL) &&
              this.curContext() === He.b_stat
            )
              ? this.context.push(He.f_expr)
              : this.context.push(He.f_stat),
              (this.exprAllowed = !1);
          }),
        (c.colon.updateContext = function () {
          this.curContext().token === 'function' && this.context.pop(),
            (this.exprAllowed = !0);
        }),
        (c.backQuote.updateContext = function () {
          this.curContext() === He.q_tmpl
            ? this.context.pop()
            : this.context.push(He.q_tmpl),
            (this.exprAllowed = !1);
        }),
        (c.star.updateContext = function (n) {
          if (n === c._function) {
            var o = this.context.length - 1;
            this.context[o] === He.f_expr
              ? (this.context[o] = He.f_expr_gen)
              : (this.context[o] = He.f_gen);
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
      var me = ze.prototype;
      (me.checkPropClash = function (n, o, l) {
        if (
          !(this.options.ecmaVersion >= 9 && n.type === 'SpreadElement') &&
          !(
            this.options.ecmaVersion >= 6 &&
            (n.computed || n.method || n.shorthand)
          )
        ) {
          var h = n.key,
            m;
          switch (h.type) {
            case 'Identifier':
              m = h.name;
              break;
            case 'Literal':
              m = String(h.value);
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
                  ? l.doubleProto < 0 && (l.doubleProto = h.start)
                  : this.raiseRecoverable(
                      h.start,
                      'Redefinition of __proto__ property'
                    )),
              (o.proto = !0));
            return;
          }
          m = '$' + m;
          var L = o[m];
          if (L) {
            var Y;
            E === 'init'
              ? (Y = (this.strict && L.init) || L.get || L.set)
              : (Y = L.init || L[E]),
              Y && this.raiseRecoverable(h.start, 'Redefinition of property');
          } else L = o[m] = {init: !1, get: !1, set: !1};
          L[E] = !0;
        }
      }),
        (me.parseExpression = function (n, o) {
          var l = this.start,
            h = this.startLoc,
            m = this.parseMaybeAssign(n, o);
          if (this.type === c.comma) {
            var E = this.startNodeAt(l, h);
            for (E.expressions = [m]; this.eat(c.comma); )
              E.expressions.push(this.parseMaybeAssign(n, o));
            return this.finishNode(E, 'SequenceExpression');
          }
          return m;
        }),
        (me.parseMaybeAssign = function (n, o, l) {
          if (this.isContextual('yield')) {
            if (this.inGenerator) return this.parseYield(n);
            this.exprAllowed = !1;
          }
          var h = !1,
            m = -1,
            E = -1,
            L = -1;
          o
            ? ((m = o.parenthesizedAssign),
              (E = o.trailingComma),
              (L = o.doubleProto),
              (o.parenthesizedAssign = o.trailingComma = -1))
            : ((o = new Yt()), (h = !0));
          var Y = this.start,
            Q = this.startLoc;
          (this.type === c.parenL || this.type === c.name) &&
            ((this.potentialArrowAt = this.start),
            (this.potentialArrowInForAwait = n === 'await'));
          var ke = this.parseMaybeConditional(n, o);
          if ((l && (ke = l.call(this, ke, Y, Q)), this.type.isAssign)) {
            var ge = this.startNodeAt(Y, Q);
            return (
              (ge.operator = this.value),
              this.type === c.eq && (ke = this.toAssignable(ke, !1, o)),
              h ||
                (o.parenthesizedAssign = o.trailingComma = o.doubleProto = -1),
              o.shorthandAssign >= ke.start && (o.shorthandAssign = -1),
              this.type === c.eq
                ? this.checkLValPattern(ke)
                : this.checkLValSimple(ke),
              (ge.left = ke),
              this.next(),
              (ge.right = this.parseMaybeAssign(n)),
              L > -1 && (o.doubleProto = L),
              this.finishNode(ge, 'AssignmentExpression')
            );
          } else h && this.checkExpressionErrors(o, !0);
          return (
            m > -1 && (o.parenthesizedAssign = m),
            E > -1 && (o.trailingComma = E),
            ke
          );
        }),
        (me.parseMaybeConditional = function (n, o) {
          var l = this.start,
            h = this.startLoc,
            m = this.parseExprOps(n, o);
          if (this.checkExpressionErrors(o)) return m;
          if (this.eat(c.question)) {
            var E = this.startNodeAt(l, h);
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
        (me.parseExprOps = function (n, o) {
          var l = this.start,
            h = this.startLoc,
            m = this.parseMaybeUnary(o, !1, !1, n);
          return this.checkExpressionErrors(o) ||
            (m.start === l && m.type === 'ArrowFunctionExpression')
            ? m
            : this.parseExprOp(m, l, h, -1, n);
        }),
        (me.parseExprOp = function (n, o, l, h, m) {
          var E = this.type.binop;
          if (E != null && (!m || this.type !== c._in) && E > h) {
            var L = this.type === c.logicalOR || this.type === c.logicalAND,
              Y = this.type === c.coalesce;
            Y && (E = c.logicalAND.binop);
            var Q = this.value;
            this.next();
            var ke = this.start,
              ge = this.startLoc,
              et = this.parseExprOp(
                this.parseMaybeUnary(null, !1, !1, m),
                ke,
                ge,
                E,
                m
              ),
              Ot = this.buildBinary(o, l, n, et, Q, L || Y);
            return (
              ((L && this.type === c.coalesce) ||
                (Y &&
                  (this.type === c.logicalOR || this.type === c.logicalAND))) &&
                this.raiseRecoverable(
                  this.start,
                  'Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses'
                ),
              this.parseExprOp(Ot, o, l, h, m)
            );
          }
          return n;
        }),
        (me.buildBinary = function (n, o, l, h, m, E) {
          h.type === 'PrivateIdentifier' &&
            this.raise(
              h.start,
              'Private identifier can only be left side of binary expression'
            );
          var L = this.startNodeAt(n, o);
          return (
            (L.left = l),
            (L.operator = m),
            (L.right = h),
            this.finishNode(L, E ? 'LogicalExpression' : 'BinaryExpression')
          );
        }),
        (me.parseMaybeUnary = function (n, o, l, h) {
          var m = this.start,
            E = this.startLoc,
            L;
          if (this.isContextual('await') && this.canAwait)
            (L = this.parseAwait(h)), (o = !0);
          else if (this.type.prefix) {
            var Y = this.startNode(),
              Q = this.type === c.incDec;
            (Y.operator = this.value),
              (Y.prefix = !0),
              this.next(),
              (Y.argument = this.parseMaybeUnary(null, !0, Q, h)),
              this.checkExpressionErrors(n, !0),
              Q
                ? this.checkLValSimple(Y.argument)
                : this.strict && Y.operator === 'delete' && Vs(Y.argument)
                ? this.raiseRecoverable(
                    Y.start,
                    'Deleting local variable in strict mode'
                  )
                : Y.operator === 'delete' && ws(Y.argument)
                ? this.raiseRecoverable(
                    Y.start,
                    'Private fields can not be deleted'
                  )
                : (o = !0),
              (L = this.finishNode(
                Y,
                Q ? 'UpdateExpression' : 'UnaryExpression'
              ));
          } else if (!o && this.type === c.privateId)
            (h || this.privateNameStack.length === 0) &&
              this.options.checkPrivateFields &&
              this.unexpected(),
              (L = this.parsePrivateIdent()),
              this.type !== c._in && this.unexpected();
          else {
            if (
              ((L = this.parseExprSubscripts(n, h)),
              this.checkExpressionErrors(n))
            )
              return L;
            for (; this.type.postfix && !this.canInsertSemicolon(); ) {
              var ke = this.startNodeAt(m, E);
              (ke.operator = this.value),
                (ke.prefix = !1),
                (ke.argument = L),
                this.checkLValSimple(L),
                this.next(),
                (L = this.finishNode(ke, 'UpdateExpression'));
            }
          }
          if (!l && this.eat(c.starstar))
            if (o) this.unexpected(this.lastTokStart);
            else
              return this.buildBinary(
                m,
                E,
                L,
                this.parseMaybeUnary(null, !1, !1, h),
                '**',
                !1
              );
          else return L;
        });
      function Vs(n) {
        return (
          n.type === 'Identifier' ||
          (n.type === 'ParenthesizedExpression' && Vs(n.expression))
        );
      }
      function ws(n) {
        return (
          (n.type === 'MemberExpression' &&
            n.property.type === 'PrivateIdentifier') ||
          (n.type === 'ChainExpression' && ws(n.expression)) ||
          (n.type === 'ParenthesizedExpression' && ws(n.expression))
        );
      }
      (me.parseExprSubscripts = function (n, o) {
        var l = this.start,
          h = this.startLoc,
          m = this.parseExprAtom(n, o);
        if (
          m.type === 'ArrowFunctionExpression' &&
          this.input.slice(this.lastTokStart, this.lastTokEnd) !== ')'
        )
          return m;
        var E = this.parseSubscripts(m, l, h, !1, o);
        return (
          n &&
            E.type === 'MemberExpression' &&
            (n.parenthesizedAssign >= E.start && (n.parenthesizedAssign = -1),
            n.parenthesizedBind >= E.start && (n.parenthesizedBind = -1),
            n.trailingComma >= E.start && (n.trailingComma = -1)),
          E
        );
      }),
        (me.parseSubscripts = function (n, o, l, h, m) {
          for (
            var E =
                this.options.ecmaVersion >= 8 &&
                n.type === 'Identifier' &&
                n.name === 'async' &&
                this.lastTokEnd === n.end &&
                !this.canInsertSemicolon() &&
                n.end - n.start === 5 &&
                this.potentialArrowAt === n.start,
              L = !1;
            ;

          ) {
            var Y = this.parseSubscript(n, o, l, h, E, L, m);
            if (
              (Y.optional && (L = !0),
              Y === n || Y.type === 'ArrowFunctionExpression')
            ) {
              if (L) {
                var Q = this.startNodeAt(o, l);
                (Q.expression = Y), (Y = this.finishNode(Q, 'ChainExpression'));
              }
              return Y;
            }
            n = Y;
          }
        }),
        (me.shouldParseAsyncArrow = function () {
          return !this.canInsertSemicolon() && this.eat(c.arrow);
        }),
        (me.parseSubscriptAsyncArrow = function (n, o, l, h) {
          return this.parseArrowExpression(this.startNodeAt(n, o), l, !0, h);
        }),
        (me.parseSubscript = function (n, o, l, h, m, E, L) {
          var Y = this.options.ecmaVersion >= 11,
            Q = Y && this.eat(c.questionDot);
          h &&
            Q &&
            this.raise(
              this.lastTokStart,
              'Optional chaining cannot appear in the callee of new expressions'
            );
          var ke = this.eat(c.bracketL);
          if (
            ke ||
            (Q && this.type !== c.parenL && this.type !== c.backQuote) ||
            this.eat(c.dot)
          ) {
            var ge = this.startNodeAt(o, l);
            (ge.object = n),
              ke
                ? ((ge.property = this.parseExpression()),
                  this.expect(c.bracketR))
                : this.type === c.privateId && n.type !== 'Super'
                ? (ge.property = this.parsePrivateIdent())
                : (ge.property = this.parseIdent(
                    this.options.allowReserved !== 'never'
                  )),
              (ge.computed = !!ke),
              Y && (ge.optional = Q),
              (n = this.finishNode(ge, 'MemberExpression'));
          } else if (!h && this.eat(c.parenL)) {
            var et = new Yt(),
              Ot = this.yieldPos,
              Oi = this.awaitPos,
              Zs = this.awaitIdentPos;
            (this.yieldPos = 0), (this.awaitPos = 0), (this.awaitIdentPos = 0);
            var Sr = this.parseExprList(
              c.parenR,
              this.options.ecmaVersion >= 8,
              !1,
              et
            );
            if (m && !Q && this.shouldParseAsyncArrow())
              return (
                this.checkPatternErrors(et, !1),
                this.checkYieldAwaitInDefaultParams(),
                this.awaitIdentPos > 0 &&
                  this.raise(
                    this.awaitIdentPos,
                    "Cannot use 'await' as identifier inside an async function"
                  ),
                (this.yieldPos = Ot),
                (this.awaitPos = Oi),
                (this.awaitIdentPos = Zs),
                this.parseSubscriptAsyncArrow(o, l, Sr, L)
              );
            this.checkExpressionErrors(et, !0),
              (this.yieldPos = Ot || this.yieldPos),
              (this.awaitPos = Oi || this.awaitPos),
              (this.awaitIdentPos = Zs || this.awaitIdentPos);
            var ei = this.startNodeAt(o, l);
            (ei.callee = n),
              (ei.arguments = Sr),
              Y && (ei.optional = Q),
              (n = this.finishNode(ei, 'CallExpression'));
          } else if (this.type === c.backQuote) {
            (Q || E) &&
              this.raise(
                this.start,
                'Optional chaining cannot appear in the tag of tagged template expressions'
              );
            var ti = this.startNodeAt(o, l);
            (ti.tag = n),
              (ti.quasi = this.parseTemplate({isTagged: !0})),
              (n = this.finishNode(ti, 'TaggedTemplateExpression'));
          }
          return n;
        }),
        (me.parseExprAtom = function (n, o, l) {
          this.type === c.slash && this.readRegexp();
          var h,
            m = this.potentialArrowAt === this.start;
          switch (this.type) {
            case c._super:
              return (
                this.allowSuper ||
                  this.raise(this.start, "'super' keyword outside a method"),
                (h = this.startNode()),
                this.next(),
                this.type === c.parenL &&
                  !this.allowDirectSuper &&
                  this.raise(
                    h.start,
                    'super() call outside constructor of a subclass'
                  ),
                this.type !== c.dot &&
                  this.type !== c.bracketL &&
                  this.type !== c.parenL &&
                  this.unexpected(),
                this.finishNode(h, 'Super')
              );
            case c._this:
              return (
                (h = this.startNode()),
                this.next(),
                this.finishNode(h, 'ThisExpression')
              );
            case c.name:
              var E = this.start,
                L = this.startLoc,
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
                  this.overrideContext(He.f_expr),
                  this.parseFunction(this.startNodeAt(E, L), 0, !1, !0, o)
                );
              if (m && !this.canInsertSemicolon()) {
                if (this.eat(c.arrow))
                  return this.parseArrowExpression(
                    this.startNodeAt(E, L),
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
                      this.startNodeAt(E, L),
                      [Q],
                      !0,
                      o
                    )
                  );
              }
              return Q;
            case c.regexp:
              var ke = this.value;
              return (
                (h = this.parseLiteral(ke.value)),
                (h.regex = {pattern: ke.pattern, flags: ke.flags}),
                h
              );
            case c.num:
            case c.string:
              return this.parseLiteral(this.value);
            case c._null:
            case c._true:
            case c._false:
              return (
                (h = this.startNode()),
                (h.value =
                  this.type === c._null ? null : this.type === c._true),
                (h.raw = this.type.keyword),
                this.next(),
                this.finishNode(h, 'Literal')
              );
            case c.parenL:
              var ge = this.start,
                et = this.parseParenAndDistinguishExpression(m, o);
              return (
                n &&
                  (n.parenthesizedAssign < 0 &&
                    !this.isSimpleAssignTarget(et) &&
                    (n.parenthesizedAssign = ge),
                  n.parenthesizedBind < 0 && (n.parenthesizedBind = ge)),
                et
              );
            case c.bracketL:
              return (
                (h = this.startNode()),
                this.next(),
                (h.elements = this.parseExprList(c.bracketR, !0, !0, n)),
                this.finishNode(h, 'ArrayExpression')
              );
            case c.braceL:
              return this.overrideContext(He.b_expr), this.parseObj(!1, n);
            case c._function:
              return (
                (h = this.startNode()), this.next(), this.parseFunction(h, 0)
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
        (me.parseExprAtomDefault = function () {
          this.unexpected();
        }),
        (me.parseExprImport = function (n) {
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
        (me.parseDynamicImport = function (n) {
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
        (me.parseImportMeta = function (n) {
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
        (me.parseLiteral = function (n) {
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
        (me.parseParenExpression = function () {
          this.expect(c.parenL);
          var n = this.parseExpression();
          return this.expect(c.parenR), n;
        }),
        (me.shouldParseArrow = function (n) {
          return !this.canInsertSemicolon();
        }),
        (me.parseParenAndDistinguishExpression = function (n, o) {
          var l = this.start,
            h = this.startLoc,
            m,
            E = this.options.ecmaVersion >= 8;
          if (this.options.ecmaVersion >= 6) {
            this.next();
            var L = this.start,
              Y = this.startLoc,
              Q = [],
              ke = !0,
              ge = !1,
              et = new Yt(),
              Ot = this.yieldPos,
              Oi = this.awaitPos,
              Zs;
            for (this.yieldPos = 0, this.awaitPos = 0; this.type !== c.parenR; )
              if (
                (ke ? (ke = !1) : this.expect(c.comma),
                E && this.afterTrailingComma(c.parenR, !0))
              ) {
                ge = !0;
                break;
              } else if (this.type === c.ellipsis) {
                (Zs = this.start),
                  Q.push(this.parseParenItem(this.parseRestBinding())),
                  this.type === c.comma &&
                    this.raiseRecoverable(
                      this.start,
                      'Comma is not permitted after the rest element'
                    );
                break;
              } else Q.push(this.parseMaybeAssign(!1, et, this.parseParenItem));
            var Sr = this.lastTokEnd,
              ei = this.lastTokEndLoc;
            if (
              (this.expect(c.parenR),
              n && this.shouldParseArrow(Q) && this.eat(c.arrow))
            )
              return (
                this.checkPatternErrors(et, !1),
                this.checkYieldAwaitInDefaultParams(),
                (this.yieldPos = Ot),
                (this.awaitPos = Oi),
                this.parseParenArrowList(l, h, Q, o)
              );
            (!Q.length || ge) && this.unexpected(this.lastTokStart),
              Zs && this.unexpected(Zs),
              this.checkExpressionErrors(et, !0),
              (this.yieldPos = Ot || this.yieldPos),
              (this.awaitPos = Oi || this.awaitPos),
              Q.length > 1
                ? ((m = this.startNodeAt(L, Y)),
                  (m.expressions = Q),
                  this.finishNodeAt(m, 'SequenceExpression', Sr, ei))
                : (m = Q[0]);
          } else m = this.parseParenExpression();
          if (this.options.preserveParens) {
            var ti = this.startNodeAt(l, h);
            return (
              (ti.expression = m),
              this.finishNode(ti, 'ParenthesizedExpression')
            );
          } else return m;
        }),
        (me.parseParenItem = function (n) {
          return n;
        }),
        (me.parseParenArrowList = function (n, o, l, h) {
          return this.parseArrowExpression(this.startNodeAt(n, o), l, !1, h);
        });
      var Si = [];
      (me.parseNew = function () {
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
        var h = this.start,
          m = this.startLoc;
        return (
          (n.callee = this.parseSubscripts(
            this.parseExprAtom(null, !1, !0),
            h,
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
            : (n.arguments = Si),
          this.finishNode(n, 'NewExpression')
        );
      }),
        (me.parseTemplateElement = function (n) {
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
        (me.parseTemplate = function (n) {
          n === void 0 && (n = {});
          var o = n.isTagged;
          o === void 0 && (o = !1);
          var l = this.startNode();
          this.next(), (l.expressions = []);
          var h = this.parseTemplateElement({isTagged: o});
          for (l.quasis = [h]; !h.tail; )
            this.type === c.eof &&
              this.raise(this.pos, 'Unterminated template literal'),
              this.expect(c.dollarBraceL),
              l.expressions.push(this.parseExpression()),
              this.expect(c.braceR),
              l.quasis.push((h = this.parseTemplateElement({isTagged: o})));
          return this.next(), this.finishNode(l, 'TemplateLiteral');
        }),
        (me.isAsyncProp = function (n) {
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
        (me.parseObj = function (n, o) {
          var l = this.startNode(),
            h = !0,
            m = {};
          for (l.properties = [], this.next(); !this.eat(c.braceR); ) {
            if (h) h = !1;
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
        (me.parseProperty = function (n, o) {
          var l = this.startNode(),
            h,
            m,
            E,
            L;
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
            (n || o) && ((E = this.start), (L = this.startLoc)),
            n || (h = this.eat(c.star)));
          var Y = this.containsEsc;
          return (
            this.parsePropertyName(l),
            !n &&
            !Y &&
            this.options.ecmaVersion >= 8 &&
            !h &&
            this.isAsyncProp(l)
              ? ((m = !0),
                (h = this.options.ecmaVersion >= 9 && this.eat(c.star)),
                this.parsePropertyName(l))
              : (m = !1),
            this.parsePropertyValue(l, n, h, m, E, L, o, Y),
            this.finishNode(l, 'Property')
          );
        }),
        (me.parseGetterSetter = function (n) {
          var o = n.key.name;
          this.parsePropertyName(n),
            (n.value = this.parseMethod(!1)),
            (n.kind = o);
          var l = n.kind === 'get' ? 0 : 1;
          if (n.value.params.length !== l) {
            var h = n.value.start;
            n.kind === 'get'
              ? this.raiseRecoverable(h, 'getter should have no params')
              : this.raiseRecoverable(
                  h,
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
        (me.parsePropertyValue = function (n, o, l, h, m, E, L, Y) {
          (l || h) && this.type === c.colon && this.unexpected(),
            this.eat(c.colon)
              ? ((n.value = o
                  ? this.parseMaybeDefault(this.start, this.startLoc)
                  : this.parseMaybeAssign(!1, L)),
                (n.kind = 'init'))
              : this.options.ecmaVersion >= 6 && this.type === c.parenL
              ? (o && this.unexpected(),
                (n.method = !0),
                (n.value = this.parseMethod(l, h)),
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
              ? ((l || h) && this.unexpected(), this.parseGetterSetter(n))
              : this.options.ecmaVersion >= 6 &&
                !n.computed &&
                n.key.type === 'Identifier'
              ? ((l || h) && this.unexpected(),
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
                  : this.type === c.eq && L
                  ? (L.shorthandAssign < 0 && (L.shorthandAssign = this.start),
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
        (me.parsePropertyName = function (n) {
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
        (me.initFunction = function (n) {
          (n.id = null),
            this.options.ecmaVersion >= 6 && (n.generator = n.expression = !1),
            this.options.ecmaVersion >= 8 && (n.async = !1);
        }),
        (me.parseMethod = function (n, o, l) {
          var h = this.startNode(),
            m = this.yieldPos,
            E = this.awaitPos,
            L = this.awaitIdentPos;
          return (
            this.initFunction(h),
            this.options.ecmaVersion >= 6 && (h.generator = n),
            this.options.ecmaVersion >= 8 && (h.async = !!o),
            (this.yieldPos = 0),
            (this.awaitPos = 0),
            (this.awaitIdentPos = 0),
            this.enterScope(pt(o, h.generator) | Ae | (l ? Oe : 0)),
            this.expect(c.parenL),
            (h.params = this.parseBindingList(
              c.parenR,
              !1,
              this.options.ecmaVersion >= 8
            )),
            this.checkYieldAwaitInDefaultParams(),
            this.parseFunctionBody(h, !1, !0, !1),
            (this.yieldPos = m),
            (this.awaitPos = E),
            (this.awaitIdentPos = L),
            this.finishNode(h, 'FunctionExpression')
          );
        }),
        (me.parseArrowExpression = function (n, o, l, h) {
          var m = this.yieldPos,
            E = this.awaitPos,
            L = this.awaitIdentPos;
          return (
            this.enterScope(pt(l, !1) | fe),
            this.initFunction(n),
            this.options.ecmaVersion >= 8 && (n.async = !!l),
            (this.yieldPos = 0),
            (this.awaitPos = 0),
            (this.awaitIdentPos = 0),
            (n.params = this.toAssignableList(o, !0)),
            this.parseFunctionBody(n, !0, !1, h),
            (this.yieldPos = m),
            (this.awaitPos = E),
            (this.awaitIdentPos = L),
            this.finishNode(n, 'ArrowFunctionExpression')
          );
        }),
        (me.parseFunctionBody = function (n, o, l, h) {
          var m = o && this.type !== c.braceL,
            E = this.strict,
            L = !1;
          if (m)
            (n.body = this.parseMaybeAssign(h)),
              (n.expression = !0),
              this.checkParams(n, !1);
          else {
            var Y =
              this.options.ecmaVersion >= 7 &&
              !this.isSimpleParamList(n.params);
            (!E || Y) &&
              ((L = this.strictDirective(this.end)),
              L &&
                Y &&
                this.raiseRecoverable(
                  n.start,
                  "Illegal 'use strict' directive in function with non-simple parameter list"
                ));
            var Q = this.labels;
            (this.labels = []),
              L && (this.strict = !0),
              this.checkParams(
                n,
                !E && !L && !o && !l && this.isSimpleParamList(n.params)
              ),
              this.strict && n.id && this.checkLValSimple(n.id, Bn),
              (n.body = this.parseBlock(!1, void 0, L && !E)),
              (n.expression = !1),
              this.adaptDirectivePrologue(n.body.body),
              (this.labels = Q);
          }
          this.exitScope();
        }),
        (me.isSimpleParamList = function (n) {
          for (var o = 0, l = n; o < l.length; o += 1) {
            var h = l[o];
            if (h.type !== 'Identifier') return !1;
          }
          return !0;
        }),
        (me.checkParams = function (n, o) {
          for (
            var l = Object.create(null), h = 0, m = n.params;
            h < m.length;
            h += 1
          ) {
            var E = m[h];
            this.checkLValInnerPattern(E, wt, o ? null : l);
          }
        }),
        (me.parseExprList = function (n, o, l, h) {
          for (var m = [], E = !0; !this.eat(n); ) {
            if (E) E = !1;
            else if ((this.expect(c.comma), o && this.afterTrailingComma(n)))
              break;
            var L = void 0;
            l && this.type === c.comma
              ? (L = null)
              : this.type === c.ellipsis
              ? ((L = this.parseSpread(h)),
                h &&
                  this.type === c.comma &&
                  h.trailingComma < 0 &&
                  (h.trailingComma = this.start))
              : (L = this.parseMaybeAssign(!1, h)),
              m.push(L);
          }
          return m;
        }),
        (me.checkUnreserved = function (n) {
          var o = n.start,
            l = n.end,
            h = n.name;
          if (
            (this.inGenerator &&
              h === 'yield' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'yield' as identifier inside a generator"
              ),
            this.inAsync &&
              h === 'await' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'await' as identifier inside an async function"
              ),
            !(this.currentThisScope().flags & Ue) &&
              h === 'arguments' &&
              this.raiseRecoverable(
                o,
                "Cannot use 'arguments' in class field initializer"
              ),
            this.inClassStaticBlock &&
              (h === 'arguments' || h === 'await') &&
              this.raise(
                o,
                'Cannot use ' + h + ' in class static initialization block'
              ),
            this.keywords.test(h) &&
              this.raise(o, "Unexpected keyword '" + h + "'"),
            !(
              this.options.ecmaVersion < 6 &&
              this.input.slice(o, l).indexOf('\\') !== -1
            ))
          ) {
            var m = this.strict ? this.reservedWordsStrict : this.reservedWords;
            m.test(h) &&
              (!this.inAsync &&
                h === 'await' &&
                this.raiseRecoverable(
                  o,
                  "Cannot use keyword 'await' outside an async function"
                ),
              this.raiseRecoverable(o, "The keyword '" + h + "' is reserved"));
          }
        }),
        (me.parseIdent = function (n) {
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
        (me.parseIdentNode = function () {
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
        (me.parsePrivateIdent = function () {
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
        (me.parseYield = function (n) {
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
        (me.parseAwait = function (n) {
          this.awaitPos || (this.awaitPos = this.start);
          var o = this.startNode();
          return (
            this.next(),
            (o.argument = this.parseMaybeUnary(null, !0, !1, n)),
            this.finishNode(o, 'AwaitExpression')
          );
        });
      var os = ze.prototype;
      (os.raise = function (n, o) {
        var l = qt(this.input, n);
        (o += ' (' + l.line + ':' + l.column + ')'),
          this.sourceFile && (o += ' in ' + this.sourceFile);
        var h = new SyntaxError(o);
        throw ((h.pos = n), (h.loc = l), (h.raisedAt = this.pos), h);
      }),
        (os.raiseRecoverable = os.raise),
        (os.curPosition = function () {
          if (this.options.locations)
            return new ut(this.curLine, this.pos - this.lineStart);
        });
      var ln = ze.prototype,
        Ii = function (o) {
          (this.flags = o),
            (this.var = []),
            (this.lexical = []),
            (this.functions = []);
        };
      (ln.enterScope = function (n) {
        this.scopeStack.push(new Ii(n));
      }),
        (ln.exitScope = function () {
          this.scopeStack.pop();
        }),
        (ln.treatFunctionsAsVarInScope = function (n) {
          return n.flags & J || (!this.inModule && n.flags & G);
        }),
        (ln.declareName = function (n, o, l) {
          var h = !1;
          if (o === yt) {
            var m = this.currentScope();
            (h =
              m.lexical.indexOf(n) > -1 ||
              m.functions.indexOf(n) > -1 ||
              m.var.indexOf(n) > -1),
              m.lexical.push(n),
              this.inModule && m.flags & G && delete this.undefinedExports[n];
          } else if (o === Cn) {
            var E = this.currentScope();
            E.lexical.push(n);
          } else if (o === xt) {
            var L = this.currentScope();
            this.treatFunctionsAsVar
              ? (h = L.lexical.indexOf(n) > -1)
              : (h = L.lexical.indexOf(n) > -1 || L.var.indexOf(n) > -1),
              L.functions.push(n);
          } else
            for (var Y = this.scopeStack.length - 1; Y >= 0; --Y) {
              var Q = this.scopeStack[Y];
              if (
                (Q.lexical.indexOf(n) > -1 &&
                  !(Q.flags & Ee && Q.lexical[0] === n)) ||
                (!this.treatFunctionsAsVarInScope(Q) &&
                  Q.functions.indexOf(n) > -1)
              ) {
                h = !0;
                break;
              }
              if (
                (Q.var.push(n),
                this.inModule && Q.flags & G && delete this.undefinedExports[n],
                Q.flags & Ue)
              )
                break;
            }
          h &&
            this.raiseRecoverable(
              l,
              "Identifier '" + n + "' has already been declared"
            );
        }),
        (ln.checkLocalExport = function (n) {
          this.scopeStack[0].lexical.indexOf(n.name) === -1 &&
            this.scopeStack[0].var.indexOf(n.name) === -1 &&
            (this.undefinedExports[n.name] = n);
        }),
        (ln.currentScope = function () {
          return this.scopeStack[this.scopeStack.length - 1];
        }),
        (ln.currentVarScope = function () {
          for (var n = this.scopeStack.length - 1; ; n--) {
            var o = this.scopeStack[n];
            if (o.flags & (Ue | Ge | Ye)) return o;
          }
        }),
        (ln.currentThisScope = function () {
          for (var n = this.scopeStack.length - 1; ; n--) {
            var o = this.scopeStack[n];
            if (o.flags & (Ue | Ge | Ye) && !(o.flags & fe)) return o;
          }
        });
      var jn = function (o, l, h) {
          (this.type = ''),
            (this.start = l),
            (this.end = 0),
            o.options.locations && (this.loc = new St(o, h)),
            o.options.directSourceFile &&
              (this.sourceFile = o.options.directSourceFile),
            o.options.ranges && (this.range = [l, 0]);
        },
        $n = ze.prototype;
      ($n.startNode = function () {
        return new jn(this, this.start, this.startLoc);
      }),
        ($n.startNodeAt = function (n, o) {
          return new jn(this, n, o);
        });
      function js(n, o, l, h) {
        return (
          (n.type = o),
          (n.end = l),
          this.options.locations && (n.loc.end = h),
          this.options.ranges && (n.range[1] = l),
          n
        );
      }
      ($n.finishNode = function (n, o) {
        return js.call(this, n, o, this.lastTokEnd, this.lastTokEndLoc);
      }),
        ($n.finishNodeAt = function (n, o, l, h) {
          return js.call(this, n, o, l, h);
        }),
        ($n.copyNode = function (n) {
          var o = new jn(this, n.start, this.startLoc);
          for (var l in n) o[l] = n[l];
          return o;
        });
      var Ei =
          'Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz',
        $s =
          'ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS',
        Ks = $s + ' Extended_Pictographic',
        qs = Ks,
        Us = qs + ' EBase EComp EMod EPres ExtPict',
        Hs = Us,
        Ai = Hs,
        Pi = {9: $s, 10: Ks, 11: qs, 12: Us, 13: Hs, 14: Ai},
        Ni =
          'Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji',
        Ri = {9: '', 10: '', 11: '', 12: '', 13: '', 14: Ni},
        Ws =
          'Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu',
        Gs =
          'Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb',
        zs =
          Gs +
          ' Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd',
        Xs =
          zs +
          ' Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho',
        Ys =
          Xs +
          ' Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi',
        Js =
          Ys +
          ' Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith',
        Ho = Js + ' ' + Ei,
        Wo = {9: Gs, 10: zs, 11: Xs, 12: Ys, 13: Js, 14: Ho},
        xr = {};
      function Go(n) {
        var o = (xr[n] = {
          binary: nt(Pi[n] + ' ' + Ws),
          binaryOfStrings: nt(Ri[n]),
          nonBinary: {General_Category: nt(Ws), Script: nt(Wo[n])},
        });
        (o.nonBinary.Script_Extensions = o.nonBinary.Script),
          (o.nonBinary.gc = o.nonBinary.General_Category),
          (o.nonBinary.sc = o.nonBinary.Script),
          (o.nonBinary.scx = o.nonBinary.Script_Extensions);
      }
      for (var Li = 0, gr = [9, 10, 11, 12, 13, 14]; Li < gr.length; Li += 1) {
        var zo = gr[Li];
        Go(zo);
      }
      var le = ze.prototype,
        Qs = function (o, l) {
          (this.parent = o), (this.base = l || this);
        };
      (Qs.prototype.separatedFrom = function (o) {
        for (var l = this; l; l = l.parent)
          for (var h = o; h; h = h.parent)
            if (l.base === h.base && l !== h) return !0;
        return !1;
      }),
        (Qs.prototype.sibling = function () {
          return new Qs(this.parent, this.base);
        });
      var cn = function (o) {
        (this.parser = o),
          (this.validFlags =
            'gim' +
            (o.options.ecmaVersion >= 6 ? 'uy' : '') +
            (o.options.ecmaVersion >= 9 ? 's' : '') +
            (o.options.ecmaVersion >= 13 ? 'd' : '') +
            (o.options.ecmaVersion >= 15 ? 'v' : '')),
          (this.unicodeProperties =
            xr[o.options.ecmaVersion >= 14 ? 14 : o.options.ecmaVersion]),
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
      (cn.prototype.reset = function (o, l, h) {
        var m = h.indexOf('v') !== -1,
          E = h.indexOf('u') !== -1;
        (this.start = o | 0),
          (this.source = l + ''),
          (this.flags = h),
          m && this.parser.options.ecmaVersion >= 15
            ? ((this.switchU = !0), (this.switchV = !0), (this.switchN = !0))
            : ((this.switchU = E && this.parser.options.ecmaVersion >= 6),
              (this.switchV = !1),
              (this.switchN = E && this.parser.options.ecmaVersion >= 9));
      }),
        (cn.prototype.raise = function (o) {
          this.parser.raiseRecoverable(
            this.start,
            'Invalid regular expression: /' + this.source + '/: ' + o
          );
        }),
        (cn.prototype.at = function (o, l) {
          l === void 0 && (l = !1);
          var h = this.source,
            m = h.length;
          if (o >= m) return -1;
          var E = h.charCodeAt(o);
          if (!(l || this.switchU) || E <= 55295 || E >= 57344 || o + 1 >= m)
            return E;
          var L = h.charCodeAt(o + 1);
          return L >= 56320 && L <= 57343 ? (E << 10) + L - 56613888 : E;
        }),
        (cn.prototype.nextIndex = function (o, l) {
          l === void 0 && (l = !1);
          var h = this.source,
            m = h.length;
          if (o >= m) return m;
          var E = h.charCodeAt(o),
            L;
          return !(l || this.switchU) ||
            E <= 55295 ||
            E >= 57344 ||
            o + 1 >= m ||
            (L = h.charCodeAt(o + 1)) < 56320 ||
            L > 57343
            ? o + 1
            : o + 2;
        }),
        (cn.prototype.current = function (o) {
          return o === void 0 && (o = !1), this.at(this.pos, o);
        }),
        (cn.prototype.lookahead = function (o) {
          return (
            o === void 0 && (o = !1), this.at(this.nextIndex(this.pos, o), o)
          );
        }),
        (cn.prototype.advance = function (o) {
          o === void 0 && (o = !1), (this.pos = this.nextIndex(this.pos, o));
        }),
        (cn.prototype.eat = function (o, l) {
          return (
            l === void 0 && (l = !1),
            this.current(l) === o ? (this.advance(l), !0) : !1
          );
        }),
        (cn.prototype.eatChars = function (o, l) {
          l === void 0 && (l = !1);
          for (var h = this.pos, m = 0, E = o; m < E.length; m += 1) {
            var L = E[m],
              Y = this.at(h, l);
            if (Y === -1 || Y !== L) return !1;
            h = this.nextIndex(h, l);
          }
          return (this.pos = h), !0;
        }),
        (le.validateRegExpFlags = function (n) {
          for (
            var o = n.validFlags, l = n.flags, h = !1, m = !1, E = 0;
            E < l.length;
            E++
          ) {
            var L = l.charAt(E);
            o.indexOf(L) === -1 &&
              this.raise(n.start, 'Invalid regular expression flag'),
              l.indexOf(L, E + 1) > -1 &&
                this.raise(n.start, 'Duplicate regular expression flag'),
              L === 'u' && (h = !0),
              L === 'v' && (m = !0);
          }
          this.options.ecmaVersion >= 15 &&
            h &&
            m &&
            this.raise(n.start, 'Invalid regular expression flag');
        });
      function Xo(n) {
        for (var o in n) return !0;
        return !1;
      }
      (le.validateRegExpPattern = function (n) {
        this.regexp_pattern(n),
          !n.switchN &&
            this.options.ecmaVersion >= 9 &&
            Xo(n.groupNames) &&
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
            var h = l[o];
            n.groupNames[h] || n.raise('Invalid named capture referenced');
          }
        }),
        (le.regexp_disjunction = function (n) {
          var o = this.options.ecmaVersion >= 16;
          for (
            o && (n.branchID = new Qs(n.branchID, null)),
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
            var h = 0,
              m = -1;
            if (
              this.regexp_eatDecimalDigits(n) &&
              ((h = n.lastIntValue),
              n.eat(44) &&
                this.regexp_eatDecimalDigits(n) &&
                (m = n.lastIntValue),
              n.eat(125))
            )
              return (
                m !== -1 &&
                  m < h &&
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
                  h = n.eat(45);
                if (l || h) {
                  for (var m = 0; m < l.length; m++) {
                    var E = l.charAt(m);
                    l.indexOf(E, m + 1) > -1 &&
                      n.raise('Duplicate regular expression modifiers');
                  }
                  if (h) {
                    var L = this.regexp_eatModifiers(n);
                    !l &&
                      !L &&
                      n.current() === 58 &&
                      n.raise('Invalid regular expression modifiers');
                    for (var Y = 0; Y < L.length; Y++) {
                      var Q = L.charAt(Y);
                      (L.indexOf(Q, Y + 1) > -1 || l.indexOf(Q) > -1) &&
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
          for (var o = '', l = 0; (l = n.current()) !== -1 && Yo(l); )
            (o += st(l)), n.advance();
          return o;
        });
      function Yo(n) {
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
          return _r(o) ? ((n.lastIntValue = o), n.advance(), !0) : !1;
        });
      function _r(n) {
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
        for (var o = n.pos, l = 0; (l = n.current()) !== -1 && !_r(l); )
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
                for (var h = 0, m = l; h < m.length; h += 1) {
                  var E = m[h];
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
              n.lastStringValue += st(n.lastIntValue);
              this.regexp_eatRegExpIdentifierPart(n);

            )
              n.lastStringValue += st(n.lastIntValue);
            return !0;
          }
          return !1;
        }),
        (le.regexp_eatRegExpIdentifierStart = function (n) {
          var o = n.pos,
            l = this.options.ecmaVersion >= 11,
            h = n.current(l);
          return (
            n.advance(l),
            h === 92 &&
              this.regexp_eatRegExpUnicodeEscapeSequence(n, l) &&
              (h = n.lastIntValue),
            Jo(h) ? ((n.lastIntValue = h), !0) : ((n.pos = o), !1)
          );
        });
      function Jo(n) {
        return f(n, !0) || n === 36 || n === 95;
      }
      le.regexp_eatRegExpIdentifierPart = function (n) {
        var o = n.pos,
          l = this.options.ecmaVersion >= 11,
          h = n.current(l);
        return (
          n.advance(l),
          h === 92 &&
            this.regexp_eatRegExpUnicodeEscapeSequence(n, l) &&
            (h = n.lastIntValue),
          Qo(h) ? ((n.lastIntValue = h), !0) : ((n.pos = o), !1)
        );
      };
      function Qo(n) {
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
          return n.current() === 48 && !Cr(n.lookahead())
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
          return br(o) ? ((n.lastIntValue = o % 32), n.advance(), !0) : !1;
        });
      function br(n) {
        return (n >= 65 && n <= 90) || (n >= 97 && n <= 122);
      }
      le.regexp_eatRegExpUnicodeEscapeSequence = function (n, o) {
        o === void 0 && (o = !1);
        var l = n.pos,
          h = o || n.switchU;
        if (n.eat(117)) {
          if (this.regexp_eatFixedHexDigits(n, 4)) {
            var m = n.lastIntValue;
            if (h && m >= 55296 && m <= 56319) {
              var E = n.pos;
              if (
                n.eat(92) &&
                n.eat(117) &&
                this.regexp_eatFixedHexDigits(n, 4)
              ) {
                var L = n.lastIntValue;
                if (L >= 56320 && L <= 57343)
                  return (
                    (n.lastIntValue = (m - 55296) * 1024 + (L - 56320) + 65536),
                    !0
                  );
              }
              (n.pos = E), (n.lastIntValue = m);
            }
            return !0;
          }
          if (
            h &&
            n.eat(123) &&
            this.regexp_eatHexDigits(n) &&
            n.eat(125) &&
            Nf(n.lastIntValue)
          )
            return !0;
          h && n.raise('Invalid unicode escape'), (n.pos = l);
        }
        return !1;
      };
      function Nf(n) {
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
      var Kc = 0,
        Kn = 1,
        un = 2;
      le.regexp_eatCharacterClassEscape = function (n) {
        var o = n.current();
        if (Rf(o)) return (n.lastIntValue = -1), n.advance(), Kn;
        var l = !1;
        if (
          n.switchU &&
          this.options.ecmaVersion >= 9 &&
          ((l = o === 80) || o === 112)
        ) {
          (n.lastIntValue = -1), n.advance();
          var h;
          if (
            n.eat(123) &&
            (h = this.regexp_eatUnicodePropertyValueExpression(n)) &&
            n.eat(125)
          )
            return l && h === un && n.raise('Invalid property name'), h;
          n.raise('Invalid property name');
        }
        return Kc;
      };
      function Rf(n) {
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
            var h = n.lastStringValue;
            return this.regexp_validateUnicodePropertyNameAndValue(n, l, h), Kn;
          }
        }
        if (((n.pos = o), this.regexp_eatLoneUnicodePropertyNameOrValue(n))) {
          var m = n.lastStringValue;
          return this.regexp_validateUnicodePropertyNameOrValue(n, m);
        }
        return Kc;
      }),
        (le.regexp_validateUnicodePropertyNameAndValue = function (n, o, l) {
          Tt(n.unicodeProperties.nonBinary, o) ||
            n.raise('Invalid property name'),
            n.unicodeProperties.nonBinary[o].test(l) ||
              n.raise('Invalid property value');
        }),
        (le.regexp_validateUnicodePropertyNameOrValue = function (n, o) {
          if (n.unicodeProperties.binary.test(o)) return Kn;
          if (n.switchV && n.unicodeProperties.binaryOfStrings.test(o))
            return un;
          n.raise('Invalid property name');
        }),
        (le.regexp_eatUnicodePropertyName = function (n) {
          var o = 0;
          for (n.lastStringValue = ''; qc((o = n.current())); )
            (n.lastStringValue += st(o)), n.advance();
          return n.lastStringValue !== '';
        });
      function qc(n) {
        return br(n) || n === 95;
      }
      le.regexp_eatUnicodePropertyValue = function (n) {
        var o = 0;
        for (n.lastStringValue = ''; Lf((o = n.current())); )
          (n.lastStringValue += st(o)), n.advance();
        return n.lastStringValue !== '';
      };
      function Lf(n) {
        return qc(n) || Cr(n);
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
                l === un &&
                n.raise('Negated character class may contain strings'),
              !0
            );
          }
          return !1;
        }),
        (le.regexp_classContents = function (n) {
          return n.current() === 93
            ? Kn
            : n.switchV
            ? this.regexp_classSetExpression(n)
            : (this.regexp_nonEmptyClassRanges(n), Kn);
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
              (l === 99 || Wc(l)) && n.raise('Invalid class escape'),
                n.raise('Invalid escape');
            }
            n.pos = o;
          }
          var h = n.current();
          return h !== 93 ? ((n.lastIntValue = h), n.advance(), !0) : !1;
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
          var o = Kn,
            l;
          if (!this.regexp_eatClassSetRange(n))
            if ((l = this.regexp_eatClassSetOperand(n))) {
              l === un && (o = un);
              for (var h = n.pos; n.eatChars([38, 38]); ) {
                if (
                  n.current() !== 38 &&
                  (l = this.regexp_eatClassSetOperand(n))
                ) {
                  l !== un && (o = Kn);
                  continue;
                }
                n.raise('Invalid character in character class');
              }
              if (h !== n.pos) return o;
              for (; n.eatChars([45, 45]); )
                this.regexp_eatClassSetOperand(n) ||
                  n.raise('Invalid character in character class');
              if (h !== n.pos) return o;
            } else n.raise('Invalid character in character class');
          for (;;)
            if (!this.regexp_eatClassSetRange(n)) {
              if (((l = this.regexp_eatClassSetOperand(n)), !l)) return o;
              l === un && (o = un);
            }
        }),
        (le.regexp_eatClassSetRange = function (n) {
          var o = n.pos;
          if (this.regexp_eatClassSetCharacter(n)) {
            var l = n.lastIntValue;
            if (n.eat(45) && this.regexp_eatClassSetCharacter(n)) {
              var h = n.lastIntValue;
              return (
                l !== -1 &&
                  h !== -1 &&
                  l > h &&
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
            ? Kn
            : this.regexp_eatClassStringDisjunction(n) ||
                this.regexp_eatNestedClass(n);
        }),
        (le.regexp_eatNestedClass = function (n) {
          var o = n.pos;
          if (n.eat(91)) {
            var l = n.eat(94),
              h = this.regexp_classContents(n);
            if (n.eat(93))
              return (
                l &&
                  h === un &&
                  n.raise('Negated character class may contain strings'),
                h
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
            this.regexp_classString(n) === un && (o = un);
          return o;
        }),
        (le.regexp_classString = function (n) {
          for (var o = 0; this.regexp_eatClassSetCharacter(n); ) o++;
          return o === 1 ? Kn : un;
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
          return l < 0 || (l === n.lookahead() && Of(l)) || Df(l)
            ? !1
            : (n.advance(), (n.lastIntValue = l), !0);
        });
      function Of(n) {
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
      function Df(n) {
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
        return Mf(o) ? ((n.lastIntValue = o), n.advance(), !0) : !1;
      };
      function Mf(n) {
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
        return Cr(o) || o === 95
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
          for (n.lastIntValue = 0; Cr((l = n.current())); )
            (n.lastIntValue = 10 * n.lastIntValue + (l - 48)), n.advance();
          return n.pos !== o;
        });
      function Cr(n) {
        return n >= 48 && n <= 57;
      }
      le.regexp_eatHexDigits = function (n) {
        var o = n.pos,
          l = 0;
        for (n.lastIntValue = 0; Uc((l = n.current())); )
          (n.lastIntValue = 16 * n.lastIntValue + Hc(l)), n.advance();
        return n.pos !== o;
      };
      function Uc(n) {
        return (
          (n >= 48 && n <= 57) || (n >= 65 && n <= 70) || (n >= 97 && n <= 102)
        );
      }
      function Hc(n) {
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
          return Wc(o)
            ? ((n.lastIntValue = o - 48), n.advance(), !0)
            : ((n.lastIntValue = 0), !1);
        });
      function Wc(n) {
        return n >= 48 && n <= 55;
      }
      le.regexp_eatFixedHexDigits = function (n, o) {
        var l = n.pos;
        n.lastIntValue = 0;
        for (var h = 0; h < o; ++h) {
          var m = n.current();
          if (!Uc(m)) return (n.pos = l), !1;
          (n.lastIntValue = 16 * n.lastIntValue + Hc(m)), n.advance();
        }
        return !0;
      };
      var wr = function (o) {
          (this.type = o.type),
            (this.value = o.value),
            (this.start = o.start),
            (this.end = o.end),
            o.options.locations && (this.loc = new St(o, o.startLoc, o.endLoc)),
            o.options.ranges && (this.range = [o.start, o.end]);
        },
        Pe = ze.prototype;
      (Pe.next = function (n) {
        !n &&
          this.type.keyword &&
          this.containsEsc &&
          this.raiseRecoverable(
            this.start,
            'Escape sequence in keyword ' + this.type.keyword
          ),
          this.options.onToken && this.options.onToken(new wr(this)),
          (this.lastTokEnd = this.end),
          (this.lastTokStart = this.start),
          (this.lastTokEndLoc = this.endLoc),
          (this.lastTokStartLoc = this.startLoc),
          this.nextToken();
      }),
        (Pe.getToken = function () {
          return this.next(), new wr(this);
        }),
        typeof Symbol < 'u' &&
          (Pe[Symbol.iterator] = function () {
            var n = this;
            return {
              next: function () {
                var o = n.getToken();
                return {done: o.type === c.eof, value: o};
              },
            };
          }),
        (Pe.nextToken = function () {
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
        (Pe.readToken = function (n) {
          return f(n, this.options.ecmaVersion >= 6) || n === 92
            ? this.readWord()
            : this.getTokenFromCode(n);
        }),
        (Pe.fullCharCodeAtPos = function () {
          var n = this.input.charCodeAt(this.pos);
          if (n <= 55295 || n >= 56320) return n;
          var o = this.input.charCodeAt(this.pos + 1);
          return o <= 56319 || o >= 57344 ? n : (n << 10) + o - 56613888;
        }),
        (Pe.skipBlockComment = function () {
          var n = this.options.onComment && this.curPosition(),
            o = this.pos,
            l = this.input.indexOf('*/', (this.pos += 2));
          if (
            (l === -1 && this.raise(this.pos - 2, 'Unterminated comment'),
            (this.pos = l + 2),
            this.options.locations)
          )
            for (
              var h = void 0, m = o;
              (h = ie(this.input, m, this.pos)) > -1;

            )
              ++this.curLine, (m = this.lineStart = h);
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
        (Pe.skipLineComment = function (n) {
          for (
            var o = this.pos,
              l = this.options.onComment && this.curPosition(),
              h = this.input.charCodeAt((this.pos += n));
            this.pos < this.input.length && !X(h);

          )
            h = this.input.charCodeAt(++this.pos);
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
        (Pe.skipSpace = function () {
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
                  (n >= 5760 && he.test(String.fromCharCode(n)))
                )
                  ++this.pos;
                else break e;
            }
          }
        }),
        (Pe.finishToken = function (n, o) {
          (this.end = this.pos),
            this.options.locations && (this.endLoc = this.curPosition());
          var l = this.type;
          (this.type = n), (this.value = o), this.updateContext(l);
        }),
        (Pe.readToken_dot = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          if (n >= 48 && n <= 57) return this.readNumber(!0);
          var o = this.input.charCodeAt(this.pos + 2);
          return this.options.ecmaVersion >= 6 && n === 46 && o === 46
            ? ((this.pos += 3), this.finishToken(c.ellipsis))
            : (++this.pos, this.finishToken(c.dot));
        }),
        (Pe.readToken_slash = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          return this.exprAllowed
            ? (++this.pos, this.readRegexp())
            : n === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(c.slash, 1);
        }),
        (Pe.readToken_mult_modulo_exp = function (n) {
          var o = this.input.charCodeAt(this.pos + 1),
            l = 1,
            h = n === 42 ? c.star : c.modulo;
          return (
            this.options.ecmaVersion >= 7 &&
              n === 42 &&
              o === 42 &&
              (++l,
              (h = c.starstar),
              (o = this.input.charCodeAt(this.pos + 2))),
            o === 61 ? this.finishOp(c.assign, l + 1) : this.finishOp(h, l)
          );
        }),
        (Pe.readToken_pipe_amp = function (n) {
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
        (Pe.readToken_caret = function () {
          var n = this.input.charCodeAt(this.pos + 1);
          return n === 61
            ? this.finishOp(c.assign, 2)
            : this.finishOp(c.bitwiseXOR, 1);
        }),
        (Pe.readToken_plus_min = function (n) {
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
        (Pe.readToken_lt_gt = function (n) {
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
        (Pe.readToken_eq_excl = function (n) {
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
        (Pe.readToken_question = function () {
          var n = this.options.ecmaVersion;
          if (n >= 11) {
            var o = this.input.charCodeAt(this.pos + 1);
            if (o === 46) {
              var l = this.input.charCodeAt(this.pos + 2);
              if (l < 48 || l > 57) return this.finishOp(c.questionDot, 2);
            }
            if (o === 63) {
              if (n >= 12) {
                var h = this.input.charCodeAt(this.pos + 2);
                if (h === 61) return this.finishOp(c.assign, 3);
              }
              return this.finishOp(c.coalesce, 2);
            }
          }
          return this.finishOp(c.question, 1);
        }),
        (Pe.readToken_numberSign = function () {
          var n = this.options.ecmaVersion,
            o = 35;
          if (
            n >= 13 &&
            (++this.pos, (o = this.fullCharCodeAtPos()), f(o, !0) || o === 92)
          )
            return this.finishToken(c.privateId, this.readWord1());
          this.raise(this.pos, "Unexpected character '" + st(o) + "'");
        }),
        (Pe.getTokenFromCode = function (n) {
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
          this.raise(this.pos, "Unexpected character '" + st(n) + "'");
        }),
        (Pe.finishOp = function (n, o) {
          var l = this.input.slice(this.pos, this.pos + o);
          return (this.pos += o), this.finishToken(n, l);
        }),
        (Pe.readRegexp = function () {
          for (var n, o, l = this.pos; ; ) {
            this.pos >= this.input.length &&
              this.raise(l, 'Unterminated regular expression');
            var h = this.input.charAt(this.pos);
            if (
              (R.test(h) && this.raise(l, 'Unterminated regular expression'), n)
            )
              n = !1;
            else {
              if (h === '[') o = !0;
              else if (h === ']' && o) o = !1;
              else if (h === '/' && !o) break;
              n = h === '\\';
            }
            ++this.pos;
          }
          var m = this.input.slice(l, this.pos);
          ++this.pos;
          var E = this.pos,
            L = this.readWord1();
          this.containsEsc && this.unexpected(E);
          var Y = this.regexpState || (this.regexpState = new cn(this));
          Y.reset(l, m, L),
            this.validateRegExpFlags(Y),
            this.validateRegExpPattern(Y);
          var Q = null;
          try {
            Q = new RegExp(m, L);
          } catch {}
          return this.finishToken(c.regexp, {pattern: m, flags: L, value: Q});
        }),
        (Pe.readInt = function (n, o, l) {
          for (
            var h = this.options.ecmaVersion >= 12 && o === void 0,
              m = l && this.input.charCodeAt(this.pos) === 48,
              E = this.pos,
              L = 0,
              Y = 0,
              Q = 0,
              ke = o ?? 1 / 0;
            Q < ke;
            ++Q, ++this.pos
          ) {
            var ge = this.input.charCodeAt(this.pos),
              et = void 0;
            if (h && ge === 95) {
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
                (Y = ge);
              continue;
            }
            if (
              (ge >= 97
                ? (et = ge - 97 + 10)
                : ge >= 65
                ? (et = ge - 65 + 10)
                : ge >= 48 && ge <= 57
                ? (et = ge - 48)
                : (et = 1 / 0),
              et >= n)
            )
              break;
            (Y = ge), (L = L * n + et);
          }
          return (
            h &&
              Y === 95 &&
              this.raiseRecoverable(
                this.pos - 1,
                'Numeric separator is not allowed at the last of digits'
              ),
            this.pos === E || (o != null && this.pos - E !== o) ? null : L
          );
        });
      function Ff(n, o) {
        return o ? parseInt(n, 8) : parseFloat(n.replace(/_/g, ''));
      }
      function Gc(n) {
        return typeof BigInt != 'function' ? null : BigInt(n.replace(/_/g, ''));
      }
      (Pe.readRadixNumber = function (n) {
        var o = this.pos;
        this.pos += 2;
        var l = this.readInt(n);
        return (
          l == null &&
            this.raise(this.start + 2, 'Expected number in radix ' + n),
          this.options.ecmaVersion >= 11 &&
          this.input.charCodeAt(this.pos) === 110
            ? ((l = Gc(this.input.slice(o, this.pos))), ++this.pos)
            : f(this.fullCharCodeAtPos()) &&
              this.raise(this.pos, 'Identifier directly after number'),
          this.finishToken(c.num, l)
        );
      }),
        (Pe.readNumber = function (n) {
          var o = this.pos;
          !n &&
            this.readInt(10, void 0, !0) === null &&
            this.raise(o, 'Invalid number');
          var l = this.pos - o >= 2 && this.input.charCodeAt(o) === 48;
          l && this.strict && this.raise(o, 'Invalid number');
          var h = this.input.charCodeAt(this.pos);
          if (!l && !n && this.options.ecmaVersion >= 11 && h === 110) {
            var m = Gc(this.input.slice(o, this.pos));
            return (
              ++this.pos,
              f(this.fullCharCodeAtPos()) &&
                this.raise(this.pos, 'Identifier directly after number'),
              this.finishToken(c.num, m)
            );
          }
          l && /[89]/.test(this.input.slice(o, this.pos)) && (l = !1),
            h === 46 &&
              !l &&
              (++this.pos,
              this.readInt(10),
              (h = this.input.charCodeAt(this.pos))),
            (h === 69 || h === 101) &&
              !l &&
              ((h = this.input.charCodeAt(++this.pos)),
              (h === 43 || h === 45) && ++this.pos,
              this.readInt(10) === null && this.raise(o, 'Invalid number')),
            f(this.fullCharCodeAtPos()) &&
              this.raise(this.pos, 'Identifier directly after number');
          var E = Ff(this.input.slice(o, this.pos), l);
          return this.finishToken(c.num, E);
        }),
        (Pe.readCodePoint = function () {
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
        (Pe.readString = function (n) {
          for (var o = '', l = ++this.pos; ; ) {
            this.pos >= this.input.length &&
              this.raise(this.start, 'Unterminated string constant');
            var h = this.input.charCodeAt(this.pos);
            if (h === n) break;
            h === 92
              ? ((o += this.input.slice(l, this.pos)),
                (o += this.readEscapedChar(!1)),
                (l = this.pos))
              : h === 8232 || h === 8233
              ? (this.options.ecmaVersion < 10 &&
                  this.raise(this.start, 'Unterminated string constant'),
                ++this.pos,
                this.options.locations &&
                  (this.curLine++, (this.lineStart = this.pos)))
              : (X(h) && this.raise(this.start, 'Unterminated string constant'),
                ++this.pos);
          }
          return (
            (o += this.input.slice(l, this.pos++)),
            this.finishToken(c.string, o)
          );
        });
      var zc = {};
      (Pe.tryReadTemplateToken = function () {
        this.inTemplateElement = !0;
        try {
          this.readTmplToken();
        } catch (n) {
          if (n === zc) this.readInvalidTemplateToken();
          else throw n;
        }
        this.inTemplateElement = !1;
      }),
        (Pe.invalidStringToken = function (n, o) {
          if (this.inTemplateElement && this.options.ecmaVersion >= 9) throw zc;
          this.raise(n, o);
        }),
        (Pe.readTmplToken = function () {
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
        (Pe.readInvalidTemplateToken = function () {
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
        (Pe.readEscapedChar = function (n) {
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
              return st(this.readCodePoint());
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
                var h = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0],
                  m = parseInt(h, 8);
                return (
                  m > 255 && ((h = h.slice(0, -1)), (m = parseInt(h, 8))),
                  (this.pos += h.length - 1),
                  (o = this.input.charCodeAt(this.pos)),
                  (h !== '0' || o === 56 || o === 57) &&
                    (this.strict || n) &&
                    this.invalidStringToken(
                      this.pos - 1 - h.length,
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
        (Pe.readHexChar = function (n) {
          var o = this.pos,
            l = this.readInt(16, n);
          return (
            l === null &&
              this.invalidStringToken(o, 'Bad character escape sequence'),
            l
          );
        }),
        (Pe.readWord1 = function () {
          this.containsEsc = !1;
          for (
            var n = '', o = !0, l = this.pos, h = this.options.ecmaVersion >= 6;
            this.pos < this.input.length;

          ) {
            var m = this.fullCharCodeAtPos();
            if (T(m, h)) this.pos += m <= 65535 ? 1 : 2;
            else if (m === 92) {
              (this.containsEsc = !0), (n += this.input.slice(l, this.pos));
              var E = this.pos;
              this.input.charCodeAt(++this.pos) !== 117 &&
                this.invalidStringToken(
                  this.pos,
                  'Expecting Unicode escape sequence \\uXXXX'
                ),
                ++this.pos;
              var L = this.readCodePoint();
              (o ? f : T)(L, h) ||
                this.invalidStringToken(E, 'Invalid Unicode escape'),
                (n += st(L)),
                (l = this.pos);
            } else break;
            o = !1;
          }
          return n + this.input.slice(l, this.pos);
        }),
        (Pe.readWord = function () {
          var n = this.readWord1(),
            o = c.name;
          return this.keywords.test(n) && (o = q[n]), this.finishToken(o, n);
        });
      var Xc = '8.15.0';
      ze.acorn = {
        Parser: ze,
        version: Xc,
        defaultOptions: Nt,
        Position: ut,
        SourceLocation: St,
        getLineInfo: qt,
        Node: jn,
        TokenType: x,
        tokTypes: c,
        keywordTypes: q,
        TokContext: Lt,
        tokContexts: He,
        isIdentifierChar: T,
        isIdentifierStart: f,
        Token: wr,
        isNewLine: X,
        lineBreak: R,
        lineBreakG: W,
        nonASCIIwhitespace: he,
      };
      function Bf(n, o) {
        return ze.parse(n, o);
      }
      function Vf(n, o, l) {
        return ze.parseExpressionAt(n, o, l);
      }
      function jf(n, o) {
        return ze.tokenizer(n, o);
      }
      (e.Node = jn),
        (e.Parser = ze),
        (e.Position = ut),
        (e.SourceLocation = St),
        (e.TokContext = Lt),
        (e.Token = wr),
        (e.TokenType = x),
        (e.defaultOptions = Nt),
        (e.getLineInfo = qt),
        (e.isIdentifierChar = T),
        (e.isIdentifierStart = f),
        (e.isNewLine = X),
        (e.keywordTypes = q),
        (e.lineBreak = R),
        (e.lineBreakG = W),
        (e.nonASCIIwhitespace = he),
        (e.parse = Bf),
        (e.parseExpressionAt = Vf),
        (e.tokContexts = He),
        (e.tokTypes = c),
        (e.tokenizer = jf),
        (e.version = Xc);
    });
  });
  var Sf = Z((qo, wf) => {
    (function (e, t) {
      typeof qo == 'object' && typeof wf < 'u'
        ? t(qo, Cf())
        : typeof define == 'function' && define.amd
        ? define(['exports', 'acorn'], t)
        : ((e = typeof globalThis < 'u' ? globalThis : e || self),
          t(((e.acorn = e.acorn || {}), (e.acorn.loose = {})), e.acorn));
    })(qo, function (e, t) {
      'use strict';
      var s = '\u2716';
      function i(p) {
        return p.name === s;
      }
      function r() {}
      var a = function (f, T) {
        if (
          (T === void 0 && (T = {}),
          (this.toks = this.constructor.BaseParser.tokenizer(f, T)),
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
        (a.prototype.startNodeAt = function (f) {
          return this.options.locations
            ? new t.Node(this.toks, f[0], f[1])
            : new t.Node(this.toks, f);
        }),
        (a.prototype.finishNode = function (f, T) {
          return (
            (f.type = T),
            (f.end = this.last.end),
            this.options.locations && (f.loc.end = this.last.loc.end),
            this.options.ranges && (f.range[1] = this.last.end),
            f
          );
        }),
        (a.prototype.dummyNode = function (f) {
          var T = this.startNode();
          return (
            (T.type = f),
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
          var f = this.dummyNode('Identifier');
          return (f.name = s), f;
        }),
        (a.prototype.dummyString = function () {
          var f = this.dummyNode('Literal');
          return (f.value = f.raw = s), f;
        }),
        (a.prototype.eat = function (f) {
          return this.tok.type === f ? (this.next(), !0) : !1;
        }),
        (a.prototype.isContextual = function (f) {
          return this.tok.type === t.tokTypes.name && this.tok.value === f;
        }),
        (a.prototype.eatContextual = function (f) {
          return this.tok.value === f && this.eat(t.tokTypes.name);
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
        (a.prototype.expect = function (f) {
          if (this.eat(f)) return !0;
          for (var T = 1; T <= 2; T++)
            if (this.lookAhead(T).type === f) {
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
        (a.prototype.lineEnd = function (f) {
          for (
            ;
            f < this.input.length && !t.isNewLine(this.input.charCodeAt(f));

          )
            ++f;
          return f;
        }),
        (a.prototype.indentationAfter = function (f) {
          for (var T = 0; ; ++f) {
            var x = this.input.charCodeAt(f);
            if (x === 32) ++T;
            else if (x === 9) T += this.options.tabSize;
            else return T;
          }
        }),
        (a.prototype.closes = function (f, T, x, w) {
          return this.tok.type === f || this.tok.type === t.tokTypes.eof
            ? !0
            : x !== this.curLineStart &&
                this.curIndent < T &&
                this.tokenStartsLine() &&
                (!w ||
                  this.nextLineStart >= this.input.length ||
                  this.indentationAfter(this.nextLineStart) < T);
        }),
        (a.prototype.tokenStartsLine = function () {
          for (var f = this.tok.start - 1; f >= this.curLineStart; --f) {
            var T = this.input.charCodeAt(f);
            if (T !== 9 && T !== 32) return !1;
          }
          return !0;
        }),
        (a.prototype.extend = function (f, T) {
          this[f] = T(this[f]);
        }),
        (a.prototype.parse = function () {
          return this.next(), this.parseTopLevel();
        }),
        (a.extend = function () {
          for (var f = [], T = arguments.length; T--; ) f[T] = arguments[T];
          for (var x = this, w = 0; w < f.length; w++) x = f[w](x);
          return x;
        }),
        (a.parse = function (f, T) {
          return new this(f, T).parse();
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
                f = S.raisedAt,
                T = !0;
              if (/unterminated/i.test(p))
                if (((f = this.lineEnd(S.pos + 1)), /string/.test(p)))
                  T = {
                    start: S.pos,
                    end: f,
                    type: t.tokTypes.string,
                    value: this.input.slice(S.pos + 1, f),
                  };
                else if (/regular expr/i.test(p)) {
                  var x = this.input.slice(S.pos, f);
                  try {
                    x = new RegExp(x);
                  } catch {}
                  T = {start: S.pos, end: f, type: t.tokTypes.regexp, value: x};
                } else
                  /template/.test(p)
                    ? (T = {
                        start: S.pos,
                        end: f,
                        type: t.tokTypes.template,
                        value: this.input.slice(S.pos, f),
                      })
                    : (T = !1);
              else if (
                /invalid (unicode|regexp|number)|expecting unicode|octal literal|is reserved|directly after number|expected number in radix|numeric separator/i.test(
                  p
                )
              )
                for (; f < this.input.length && !d(this.input.charCodeAt(f)); )
                  ++f;
              else if (/character escape|expected hexadecimal/i.test(p))
                for (; f < this.input.length; ) {
                  var w = this.input.charCodeAt(f++);
                  if (w === 34 || w === 39 || t.isNewLine(w)) break;
                }
              else if (/unexpected character/i.test(p)) f++, (T = !1);
              else if (/regular expression/i.test(p)) T = !0;
              else throw S;
              if (
                (this.resetTo(f),
                T === !0 &&
                  (T = {start: f, end: f, type: t.tokTypes.name, value: s}),
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
          var f = this.input.charAt(p - 1);
          if (
            ((this.toks.exprAllowed =
              !f ||
              /[[{(,;:?/*=+\-~!|&%^<>]/.test(f) ||
              (/[enwfd]/.test(f) &&
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
      var v = a.prototype;
      (v.parseTopLevel = function () {
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
        (v.parseStatement = function () {
          var p = this.tok.type,
            f = this.startNode(),
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
                  ? (f.label = null)
                  : ((f.label =
                      this.tok.type === t.tokTypes.name
                        ? this.parseIdent()
                        : null),
                    this.semicolon()),
                this.finishNode(f, x ? 'BreakStatement' : 'ContinueStatement')
              );
            case t.tokTypes._debugger:
              return (
                this.next(),
                this.semicolon(),
                this.finishNode(f, 'DebuggerStatement')
              );
            case t.tokTypes._do:
              return (
                this.next(),
                (f.body = this.parseStatement()),
                (f.test = this.eat(t.tokTypes._while)
                  ? this.parseParenExpression()
                  : this.dummyIdent()),
                this.semicolon(),
                this.finishNode(f, 'DoWhileStatement')
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
                return this.parseFor(f, null);
              var S = this.toks.isLet(),
                A = this.toks.isAwaitUsing(!0),
                q = !A && this.toks.isUsing(!0);
              if (
                S ||
                this.tok.type === t.tokTypes._var ||
                this.tok.type === t.tokTypes._const ||
                q ||
                A
              ) {
                var M = S
                    ? 'let'
                    : q
                    ? 'using'
                    : A
                    ? 'await using'
                    : this.tok.value,
                  c = this.startNode();
                return (
                  q || A
                    ? (A && this.next(), this.parseVar(c, !0, M))
                    : (c = this.parseVar(c, !0, M)),
                  c.declarations.length === 1 &&
                  (this.tok.type === t.tokTypes._in || this.isContextual('of'))
                    ? (this.options.ecmaVersion >= 9 &&
                        this.tok.type !== t.tokTypes._in &&
                        (f.await = w),
                      this.parseForIn(f, c))
                    : this.parseFor(f, c)
                );
              }
              var R = this.parseExpression(!0);
              return this.tok.type === t.tokTypes._in || this.isContextual('of')
                ? (this.options.ecmaVersion >= 9 &&
                    this.tok.type !== t.tokTypes._in &&
                    (f.await = w),
                  this.parseForIn(f, this.toAssignable(R)))
                : this.parseFor(f, R);
            case t.tokTypes._function:
              return this.next(), this.parseFunction(f, !0);
            case t.tokTypes._if:
              return (
                this.next(),
                (f.test = this.parseParenExpression()),
                (f.consequent = this.parseStatement()),
                (f.alternate = this.eat(t.tokTypes._else)
                  ? this.parseStatement()
                  : null),
                this.finishNode(f, 'IfStatement')
              );
            case t.tokTypes._return:
              return (
                this.next(),
                this.eat(t.tokTypes.semi) || this.canInsertSemicolon()
                  ? (f.argument = null)
                  : ((f.argument = this.parseExpression()), this.semicolon()),
                this.finishNode(f, 'ReturnStatement')
              );
            case t.tokTypes._switch:
              var W = this.curIndent,
                X = this.curLineStart;
              this.next(),
                (f.discriminant = this.parseParenExpression()),
                (f.cases = []),
                this.pushCx(),
                this.expect(t.tokTypes.braceL);
              for (var ie; !this.closes(t.tokTypes.braceR, W, X, !0); )
                if (
                  this.tok.type === t.tokTypes._case ||
                  this.tok.type === t.tokTypes._default
                ) {
                  var he = this.tok.type === t.tokTypes._case;
                  ie && this.finishNode(ie, 'SwitchCase'),
                    f.cases.push((ie = this.startNode())),
                    (ie.consequent = []),
                    this.next(),
                    he ? (ie.test = this.parseExpression()) : (ie.test = null),
                    this.expect(t.tokTypes.colon);
                } else
                  ie ||
                    (f.cases.push((ie = this.startNode())),
                    (ie.consequent = []),
                    (ie.test = null)),
                    ie.consequent.push(this.parseStatement());
              return (
                ie && this.finishNode(ie, 'SwitchCase'),
                this.popCx(),
                this.eat(t.tokTypes.braceR),
                this.finishNode(f, 'SwitchStatement')
              );
            case t.tokTypes._throw:
              return (
                this.next(),
                (f.argument = this.parseExpression()),
                this.semicolon(),
                this.finishNode(f, 'ThrowStatement')
              );
            case t.tokTypes._try:
              if (
                (this.next(),
                (f.block = this.parseBlock()),
                (f.handler = null),
                this.tok.type === t.tokTypes._catch)
              ) {
                var ae = this.startNode();
                this.next(),
                  this.eat(t.tokTypes.parenL)
                    ? ((ae.param = this.toAssignable(this.parseExprAtom(), !0)),
                      this.expect(t.tokTypes.parenR))
                    : (ae.param = null),
                  (ae.body = this.parseBlock()),
                  (f.handler = this.finishNode(ae, 'CatchClause'));
              }
              return (
                (f.finalizer = this.eat(t.tokTypes._finally)
                  ? this.parseBlock()
                  : null),
                !f.handler && !f.finalizer
                  ? f.block
                  : this.finishNode(f, 'TryStatement')
              );
            case t.tokTypes._var:
            case t.tokTypes._const:
              return this.parseVar(f, !1, T || this.tok.value);
            case t.tokTypes._while:
              return (
                this.next(),
                (f.test = this.parseParenExpression()),
                (f.body = this.parseStatement()),
                this.finishNode(f, 'WhileStatement')
              );
            case t.tokTypes._with:
              return (
                this.next(),
                (f.object = this.parseParenExpression()),
                (f.body = this.parseStatement()),
                this.finishNode(f, 'WithStatement')
              );
            case t.tokTypes.braceL:
              return this.parseBlock();
            case t.tokTypes.semi:
              return this.next(), this.finishNode(f, 'EmptyStatement');
            case t.tokTypes._class:
              return this.parseClass(!0);
            case t.tokTypes._import:
              if (this.options.ecmaVersion > 10) {
                var We = this.lookAhead(1).type;
                if (We === t.tokTypes.parenL || We === t.tokTypes.dot)
                  return (
                    (f.expression = this.parseExpression()),
                    this.semicolon(),
                    this.finishNode(f, 'ExpressionStatement')
                  );
              }
              return this.parseImport();
            case t.tokTypes._export:
              return this.parseExport();
            default:
              if (this.toks.isAsyncFunction())
                return this.next(), this.next(), this.parseFunction(f, !0, !0);
              if (this.toks.isUsing(!1)) return this.parseVar(f, !1, 'using');
              if (this.toks.isAwaitUsing(!1))
                return this.next(), this.parseVar(f, !1, 'await using');
              var qe = this.parseExpression();
              return i(qe)
                ? (this.next(),
                  this.tok.type === t.tokTypes.eof
                    ? this.finishNode(f, 'EmptyStatement')
                    : this.parseStatement())
                : p === t.tokTypes.name &&
                  qe.type === 'Identifier' &&
                  this.eat(t.tokTypes.colon)
                ? ((f.body = this.parseStatement()),
                  (f.label = qe),
                  this.finishNode(f, 'LabeledStatement'))
                : ((f.expression = qe),
                  this.semicolon(),
                  this.finishNode(f, 'ExpressionStatement'));
          }
        }),
        (v.parseBlock = function () {
          var p = this.startNode();
          this.pushCx(), this.expect(t.tokTypes.braceL);
          var f = this.curIndent,
            T = this.curLineStart;
          for (p.body = []; !this.closes(t.tokTypes.braceR, f, T, !0); )
            p.body.push(this.parseStatement());
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR),
            this.finishNode(p, 'BlockStatement')
          );
        }),
        (v.parseFor = function (p, f) {
          return (
            (p.init = f),
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
        (v.parseForIn = function (p, f) {
          var T =
            this.tok.type === t.tokTypes._in
              ? 'ForInStatement'
              : 'ForOfStatement';
          return (
            this.next(),
            (p.left = f),
            (p.right = this.parseExpression()),
            this.popCx(),
            this.expect(t.tokTypes.parenR),
            (p.body = this.parseStatement()),
            this.finishNode(p, T)
          );
        }),
        (v.parseVar = function (p, f, T) {
          (p.kind = T), this.next(), (p.declarations = []);
          do {
            var x = this.startNode();
            (x.id =
              this.options.ecmaVersion >= 6
                ? this.toAssignable(this.parseExprAtom(), !0)
                : this.parseIdent()),
              (x.init = this.eat(t.tokTypes.eq)
                ? this.parseMaybeAssign(f)
                : null),
              p.declarations.push(this.finishNode(x, 'VariableDeclarator'));
          } while (this.eat(t.tokTypes.comma));
          if (!p.declarations.length) {
            var w = this.startNode();
            (w.id = this.dummyIdent()),
              p.declarations.push(this.finishNode(w, 'VariableDeclarator'));
          }
          return (
            f || this.semicolon(), this.finishNode(p, 'VariableDeclaration')
          );
        }),
        (v.parseClass = function (p) {
          var f = this.startNode();
          this.next(),
            this.tok.type === t.tokTypes.name
              ? (f.id = this.parseIdent())
              : p === !0
              ? (f.id = this.dummyIdent())
              : (f.id = null),
            (f.superClass = this.eat(t.tokTypes._extends)
              ? this.parseExpression()
              : null),
            (f.body = this.startNode()),
            (f.body.body = []),
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
            w && f.body.body.push(w);
          }
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR) ||
              ((this.last.end = this.tok.start),
              this.options.locations &&
                (this.last.loc.end = this.tok.loc.start)),
            this.semicolon(),
            this.finishNode(f.body, 'ClassBody'),
            this.finishNode(f, p ? 'ClassDeclaration' : 'ClassExpression')
          );
        }),
        (v.parseClassElement = function () {
          if (this.eat(t.tokTypes.semi)) return null;
          var p = this.options,
            f = p.ecmaVersion,
            T = p.locations,
            x = this.curIndent,
            w = this.curLineStart,
            S = this.startNode(),
            A = '',
            q = !1,
            M = !1,
            c = 'method',
            R = !1;
          if (this.eatContextual('static')) {
            if (f >= 13 && this.eat(t.tokTypes.braceL))
              return this.parseClassStaticBlock(S), S;
            this.isClassElementNameStart() || this.toks.type === t.tokTypes.star
              ? (R = !0)
              : (A = 'static');
          }
          if (
            ((S.static = R),
            !A &&
              f >= 8 &&
              this.eatContextual('async') &&
              ((this.isClassElementNameStart() ||
                this.toks.type === t.tokTypes.star) &&
              !this.canInsertSemicolon()
                ? (M = !0)
                : (A = 'async')),
            !A)
          ) {
            q = this.eat(t.tokTypes.star);
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
            f < 13 ||
            this.toks.type === t.tokTypes.parenL ||
            c !== 'method' ||
            q ||
            M
          ) {
            var X =
              !S.computed &&
              !S.static &&
              !q &&
              !M &&
              c === 'method' &&
              ((S.key.type === 'Identifier' && S.key.name === 'constructor') ||
                (S.key.type === 'Literal' && S.key.value === 'constructor'));
            (S.kind = X ? 'constructor' : c),
              (S.value = this.parseMethod(q, M)),
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
                  he = this.inGenerator;
                (this.inAsync = !1),
                  (this.inGenerator = !1),
                  (S.value = this.parseMaybeAssign()),
                  (this.inAsync = ie),
                  (this.inGenerator = he);
              }
            else S.value = null;
            this.semicolon(), this.finishNode(S, 'PropertyDefinition');
          }
          return S;
        }),
        (v.parseClassStaticBlock = function (p) {
          var f = this.curIndent,
            T = this.curLineStart;
          for (
            p.body = [], this.pushCx();
            !this.closes(t.tokTypes.braceR, f, T, !0);

          )
            p.body.push(this.parseStatement());
          return (
            this.popCx(),
            this.eat(t.tokTypes.braceR),
            this.finishNode(p, 'StaticBlock')
          );
        }),
        (v.isClassElementNameStart = function () {
          return this.toks.isClassElementNameStart();
        }),
        (v.parseClassElementName = function (p) {
          this.toks.type === t.tokTypes.privateId
            ? ((p.computed = !1), (p.key = this.parsePrivateIdent()))
            : this.parsePropertyName(p);
        }),
        (v.parseFunction = function (p, f, T) {
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
              : f === !0 && (p.id = this.dummyIdent()),
            (this.inAsync = p.async),
            (this.inGenerator = p.generator),
            (this.inFunction = !0),
            (p.params = this.parseFunctionParams()),
            (p.body = this.parseBlock()),
            this.toks.adaptDirectivePrologue(p.body.body),
            (this.inAsync = x),
            (this.inGenerator = w),
            (this.inFunction = S),
            this.finishNode(p, f ? 'FunctionDeclaration' : 'FunctionExpression')
          );
        }),
        (v.parseExport = function () {
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
            var f;
            if (
              this.tok.type === t.tokTypes._function ||
              (f = this.toks.isAsyncFunction())
            ) {
              var T = this.startNode();
              this.next(),
                f && this.next(),
                (p.declaration = this.parseFunction(T, 'nullableID', f));
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
        (v.parseImport = function () {
          var p = this.startNode();
          if ((this.next(), this.tok.type === t.tokTypes.string))
            (p.specifiers = []), (p.source = this.parseExprAtom());
          else {
            var f;
            this.tok.type === t.tokTypes.name &&
              this.tok.value !== 'from' &&
              ((f = this.startNode()),
              (f.local = this.parseIdent()),
              this.finishNode(f, 'ImportDefaultSpecifier'),
              this.eat(t.tokTypes.comma)),
              (p.specifiers = this.parseImportSpecifiers()),
              (p.source =
                this.eatContextual('from') &&
                this.tok.type === t.tokTypes.string
                  ? this.parseExprAtom()
                  : this.dummyString()),
              f && p.specifiers.unshift(f);
          }
          return (
            this.options.ecmaVersion >= 16 &&
              (p.attributes = this.parseWithClause()),
            this.semicolon(),
            this.finishNode(p, 'ImportDeclaration')
          );
        }),
        (v.parseImportSpecifiers = function () {
          var p = [];
          if (this.tok.type === t.tokTypes.star) {
            var f = this.startNode();
            this.next(),
              (f.local = this.eatContextual('as')
                ? this.parseIdent()
                : this.dummyIdent()),
              p.push(this.finishNode(f, 'ImportNamespaceSpecifier'));
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
        (v.parseWithClause = function () {
          var p = [];
          if (!this.eat(t.tokTypes._with)) return p;
          var f = this.curIndent,
            T = this.curLineStart,
            x = this.nextLineStart;
          for (
            this.pushCx(),
              this.eat(t.tokTypes.braceL),
              this.curLineStart > x && (x = this.curLineStart);
            !this.closes(
              t.tokTypes.braceR,
              f + (this.curLineStart <= x ? 1 : 0),
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
        (v.parseExportSpecifierList = function () {
          var p = [],
            f = this.curIndent,
            T = this.curLineStart,
            x = this.nextLineStart;
          for (
            this.pushCx(),
              this.eat(t.tokTypes.braceL),
              this.curLineStart > x && (x = this.curLineStart);
            !this.closes(
              t.tokTypes.braceR,
              f + (this.curLineStart <= x ? 1 : 0),
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
        (v.parseModuleExportName = function () {
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
          var f = this.storeCurrentPos(),
            T = this.parseMaybeAssign(p);
          if (this.tok.type === t.tokTypes.comma) {
            var x = this.startNodeAt(f);
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
            var f = this.startNode();
            return (
              this.next(),
              this.semicolon() ||
              this.canInsertSemicolon() ||
              (this.tok.type !== t.tokTypes.star && !this.tok.type.startsExpr)
                ? ((f.delegate = !1), (f.argument = null))
                : ((f.delegate = this.eat(t.tokTypes.star)),
                  (f.argument = this.parseMaybeAssign())),
              this.finishNode(f, 'YieldExpression')
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
          var f = this.storeCurrentPos(),
            T = this.parseExprOps(p);
          if (this.eat(t.tokTypes.question)) {
            var x = this.startNodeAt(f);
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
          var f = this.storeCurrentPos(),
            T = this.curIndent,
            x = this.curLineStart;
          return this.parseExprOp(this.parseMaybeUnary(!1), f, -1, p, T, x);
        }),
        (g.parseExprOp = function (p, f, T, x, w, S) {
          if (
            this.curLineStart !== S &&
            this.curIndent < w &&
            this.tokenStartsLine()
          )
            return p;
          var A = this.tok.type.binop;
          if (A != null && (!x || this.tok.type !== t.tokTypes._in) && A > T) {
            var q = this.startNodeAt(f);
            if (
              ((q.left = p),
              (q.operator = this.tok.value),
              this.next(),
              this.curLineStart !== S &&
                this.curIndent < w &&
                this.tokenStartsLine())
            )
              q.right = this.dummyIdent();
            else {
              var M = this.storeCurrentPos();
              q.right = this.parseExprOp(
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
                q,
                /&&|\|\||\?\?/.test(q.operator)
                  ? 'LogicalExpression'
                  : 'BinaryExpression'
              ),
              this.parseExprOp(q, f, T, x, w, S)
            );
          }
          return p;
        }),
        (g.parseMaybeUnary = function (p) {
          var f = this.storeCurrentPos(),
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
              var A = this.startNodeAt(f);
              (A.operator = this.tok.value),
                (A.prefix = !1),
                (A.argument = this.checkLVal(T)),
                this.next(),
                (T = this.finishNode(A, 'UpdateExpression'));
            }
          if (!p && this.eat(t.tokTypes.starstar)) {
            var q = this.startNodeAt(f);
            return (
              (q.operator = '**'),
              (q.left = T),
              (q.right = this.parseMaybeUnary(!1)),
              this.finishNode(q, 'BinaryExpression')
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
        (g.parseSubscripts = function (p, f, T, x, w) {
          for (var S = this.options.ecmaVersion >= 11, A = !1; ; ) {
            if (
              this.curLineStart !== w &&
              this.curIndent <= x &&
              this.tokenStartsLine()
            )
              if (this.tok.type === t.tokTypes.dot && this.curIndent === x) --x;
              else break;
            var q =
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
              var c = this.startNodeAt(f);
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
              var R = this.startNodeAt(f);
              (R.object = p),
                (R.property = this.parseExpression()),
                (R.computed = !0),
                S && (R.optional = M),
                this.popCx(),
                this.expect(t.tokTypes.bracketR),
                (p = this.finishNode(R, 'MemberExpression'));
            } else if (!T && this.tok.type === t.tokTypes.parenL) {
              var W = this.parseExprList(t.tokTypes.parenR);
              if (q && this.eat(t.tokTypes.arrow))
                return this.parseArrowExpression(this.startNodeAt(f), W, !0);
              var X = this.startNodeAt(f);
              (X.callee = p),
                (X.arguments = W),
                S && (X.optional = M),
                (p = this.finishNode(X, 'CallExpression'));
            } else if (this.tok.type === t.tokTypes.backQuote) {
              var ie = this.startNodeAt(f);
              (ie.tag = p),
                (ie.quasi = this.parseTemplate()),
                (p = this.finishNode(ie, 'TaggedTemplateExpression'));
            } else break;
          }
          if (A) {
            var he = this.startNodeAt(f);
            (he.expression = p), (p = this.finishNode(he, 'ChainExpression'));
          }
          return p;
        }),
        (g.parseExprAtom = function () {
          var p;
          switch (this.tok.type) {
            case t.tokTypes._this:
            case t.tokTypes._super:
              var f =
                this.tok.type === t.tokTypes._this ? 'ThisExpression' : 'Super';
              return (p = this.startNode()), this.next(), this.finishNode(p, f);
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
              var q = this.parseExpression();
              if (
                (this.expect(t.tokTypes.parenR), this.eat(t.tokTypes.arrow))
              ) {
                var M = q.expressions || [q];
                return (
                  M.length && i(M[M.length - 1]) && M.pop(),
                  this.parseArrowExpression(this.startNodeAt(A), M)
                );
              }
              if (this.options.preserveParens) {
                var c = this.startNodeAt(A);
                (c.expression = q),
                  (q = this.finishNode(c, 'ParenthesizedExpression'));
              }
              return q;
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
            f = this.parseIdent(!0);
          switch (this.tok.type) {
            case t.tokTypes.parenL:
              return this.parseDynamicImport(p);
            case t.tokTypes.dot:
              return (p.meta = f), this.parseImportMeta(p);
            default:
              return (p.name = 'import'), this.finishNode(p, 'Identifier');
          }
        }),
        (g.parseDynamicImport = function (p) {
          var f = this.parseExprList(t.tokTypes.parenR);
          return (
            (p.source = f[0] || this.dummyString()),
            (p.options = f[1] || null),
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
            f = this.curIndent,
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
              f,
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
          var f = this.parseTemplateElement();
          for (p.quasis = [f]; !f.tail; )
            this.next(),
              p.expressions.push(this.parseExpression()),
              this.expect(t.tokTypes.braceR)
                ? (f = this.parseTemplateElement())
                : ((f = this.startNode()),
                  (f.value = {cooked: '', raw: ''}),
                  (f.tail = !0),
                  this.finishNode(f, 'TemplateElement')),
              p.quasis.push(f);
          return (
            this.expect(t.tokTypes.backQuote),
            this.finishNode(p, 'TemplateLiteral')
          );
        }),
        (g.parseObj = function () {
          var p = this.startNode();
          (p.properties = []), this.pushCx();
          var f = this.curIndent + 1,
            T = this.curLineStart;
          for (
            this.eat(t.tokTypes.braceL),
              this.curIndent + 1 < f &&
                ((f = this.curIndent), (T = this.curLineStart));
            !this.closes(t.tokTypes.braceR, f, T);

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
                  var q = this.startNodeAt(A);
                  (q.operator = '='),
                    (q.left = x.key),
                    (q.right = this.parseMaybeAssign()),
                    (x.value = this.finishNode(q, 'AssignmentExpression'));
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
          var f =
            this.tok.type === t.tokTypes.num ||
            this.tok.type === t.tokTypes.string
              ? this.parseExprAtom()
              : this.parseIdent();
          p.key = f || this.dummyIdent();
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
          var f = this.startNode();
          return this.next(), (f.name = p), this.finishNode(f, 'Identifier');
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
        (g.toAssignable = function (p, f) {
          if (
            !(
              !p ||
              p.type === 'Identifier' ||
              (p.type === 'MemberExpression' && !f)
            )
          )
            if (p.type === 'ParenthesizedExpression')
              this.toAssignable(p.expression, f);
            else {
              if (this.options.ecmaVersion < 6) return this.dummyIdent();
              if (p.type === 'ObjectExpression') {
                p.type = 'ObjectPattern';
                for (var T = 0, x = p.properties; T < x.length; T += 1) {
                  var w = x[T];
                  this.toAssignable(w, f);
                }
              } else if (p.type === 'ArrayExpression')
                (p.type = 'ArrayPattern'), this.toAssignableList(p.elements, f);
              else if (p.type === 'Property') this.toAssignable(p.value, f);
              else if (p.type === 'SpreadElement')
                (p.type = 'RestElement'), this.toAssignable(p.argument, f);
              else if (p.type === 'AssignmentExpression')
                (p.type = 'AssignmentPattern'), delete p.operator;
              else return this.dummyIdent();
            }
          return p;
        }),
        (g.toAssignableList = function (p, f) {
          for (var T = 0, x = p; T < x.length; T += 1) {
            var w = x[T];
            this.toAssignable(w, f);
          }
          return p;
        }),
        (g.parseFunctionParams = function (p) {
          return (
            (p = this.parseExprList(t.tokTypes.parenR)),
            this.toAssignableList(p, !0)
          );
        }),
        (g.parseMethod = function (p, f) {
          var T = this.startNode(),
            x = this.inAsync,
            w = this.inGenerator,
            S = this.inFunction;
          return (
            this.initFunction(T),
            this.options.ecmaVersion >= 6 && (T.generator = !!p),
            this.options.ecmaVersion >= 8 && (T.async = !!f),
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
        (g.parseArrowExpression = function (p, f, T) {
          var x = this.inAsync,
            w = this.inGenerator,
            S = this.inFunction;
          return (
            this.initFunction(p),
            this.options.ecmaVersion >= 8 && (p.async = !!T),
            (this.inAsync = p.async),
            (this.inGenerator = !1),
            (this.inFunction = !0),
            (p.params = this.toAssignableList(f, !0)),
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
        (g.parseExprList = function (p, f) {
          this.pushCx();
          var T = this.curIndent,
            x = this.curLineStart,
            w = [];
          for (this.next(); !this.closes(p, T + 1, x); ) {
            if (this.eat(t.tokTypes.comma)) {
              w.push(f ? null : this.dummyIdent());
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
      function O(p, f) {
        return a.parse(p, f);
      }
      (e.LooseParser = a), (e.isDummy = i), (e.parse = O);
    });
  });
  var Uo = Di(),
    i_ = au(),
    vr = h1(),
    r_ = _f(),
    Af = Sf(),
    Fs = null;
  function Pf() {
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
  var $c = {};
  function If(e, t, s) {
    var i = vr.registerServerReference(e, t, s),
      r = t + '#' + s;
    return ($c[r] = e), i;
  }
  function o_(e) {
    if (e.indexOf('use client') === -1 && e.indexOf('use server') === -1)
      return null;
    try {
      var t = Af.parse(e, {ecmaVersion: '2024', sourceType: 'source'}).body;
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
  function a_(e) {
    if (e.indexOf('use server') === -1) return e;
    var t;
    try {
      t = Af.parse(e, {ecmaVersion: '2024', sourceType: 'source'});
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
            var q = S[A];
            if (q.type !== 'ExpressionStatement') break;
            if (q.directive === 'use server') {
              s.push({
                funcStart: T.start,
                funcEnd: T.end,
                dStart: q.start,
                dEnd: q.end,
                name: T.id ? T.id.name : 'action' + i,
                isDecl: T.type === 'FunctionDeclaration',
              }),
                i++;
              return;
            }
            if (!q.directive) break;
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
        var d = s[u], v = d.dEnd, g = a.charAt(v);
        v < a.length &&
        (g === ' ' ||
          g ===
            `
` ||
          g === '\r' ||
          g === '	');

      )
        v++, (g = a.charAt(v));
      a = a.slice(0, d.dStart) + a.slice(v);
      var O = v - d.dStart,
        p = d.funcEnd - O,
        f = a.slice(d.funcStart, p);
      d.isDecl
        ? (a =
            a.slice(0, d.funcStart) +
            'var ' +
            d.name +
            ' = __rsa(' +
            f +
            ", '" +
            d.name +
            "');" +
            a.slice(p))
        : (a =
            a.slice(0, d.funcStart) +
            '__rsa(' +
            f +
            ", '" +
            d.name +
            "')" +
            a.slice(p));
    }
    return a;
  }
  function l_(e, t) {
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
  function c_(e) {
    $c = {};
    var t = {react: Uo, 'react/jsx-runtime': i_},
      s = {},
      i = null;
    if (
      (Object.keys(e).forEach(function (f) {
        if (!i)
          try {
            s[f] = r_.transform(e[f], {
              transforms: ['jsx', 'imports'],
              jsxRuntime: 'automatic',
              production: !0,
            }).code;
          } catch (T) {
            i = f + ': ' + (T.message || String(T));
          }
      }),
      i)
    )
      return {type: 'error', error: i};
    function r(f, T) {
      if (t[T]) return T;
      if (T.startsWith('.')) {
        var x = l_(f, T);
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
    function d(f) {
      if (t[f]) return t[f];
      if (!s[f]) throw new Error('Module "' + f + '" not found');
      if (a[f]) return a[f].exports;
      var T = o_(e[f]);
      if (T === 'use client')
        return (t[f] = vr.createClientModuleProxy(f)), (u[f] = !0), t[f];
      var x = {exports: {}};
      a[f] = x;
      var w = function (c) {
          if (c.endsWith('.css')) return {};
          var R = r(f, c);
          return t[R] ? t[R] : d(R);
        },
        S = s[f];
      if (
        (T !== 'use server' && (S = a_(S)),
        new Function('module', 'exports', 'require', 'React', '__rsa', S)(
          x,
          x.exports,
          w,
          Uo,
          function (c, R) {
            return If(c, f, R);
          }
        ),
        (t[f] = x.exports),
        T === 'use server')
      )
        for (var A = Object.keys(x.exports), q = 0; q < A.length; q++) {
          var M = A[q];
          typeof x.exports[M] == 'function' && If(x.exports[M], f, M);
        }
      return delete a[f], x.exports;
    }
    var v = {exports: {}};
    Object.keys(s).forEach(function (f) {
      d(f),
        (f === '/src/App.js' || f === './App.js' || f === './src/App.js') &&
          (v.exports = t[f]);
    }),
      (Fs = {module: v.exports});
    var g = {};
    function O(f) {
      if (!g[f]) {
        g[f] = !0;
        var T = s[f];
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
              var A = r(f, S);
              s[A] && O(A);
            }
          }
      }
    }
    Object.keys(u).forEach(function (f) {
      O(f);
    });
    var p = {};
    return (
      Object.keys(g).forEach(function (f) {
        p[f] = s[f];
      }),
      {type: 'deployed', compiledClients: p, clientEntries: u}
    );
  }
  function u_() {
    if (!Fs) throw new Error('No code deployed');
    var e = Fs.module.default || Fs.module,
      t = Uo.createElement(e);
    return vr.renderToReadableStream(t, Pf(), {
      onError: function (s) {
        return console.error('[RSC Server Error]', s), msg;
      },
    });
  }
  function p_(e, t) {
    if (!Fs) throw new Error('No code deployed');
    var s = $c[e];
    if (!s) throw new Error('Action "' + e + '" not found');
    var i = t;
    if (typeof t != 'string' && t && t.__formData) {
      i = new FormData();
      for (var r = 0; r < t.__formData.length; r++)
        i.append(t.__formData[r][0], t.__formData[r][1]);
    }
    return Promise.resolve(vr.decodeReply(i)).then(function (a) {
      var u = Promise.resolve(s.apply(null, a));
      return u.then(function () {
        var d = Fs.module.default || Fs.module;
        return vr.renderToReadableStream(
          {root: Uo.createElement(d), returnValue: u},
          Pf(),
          {
            onError: function (v) {
              return console.error('[RSC Server Error]', v), msg;
            },
          }
        );
      });
    });
  }
  function Ef(e, t) {
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
        var s = c_(t.files);
        s && s.type === 'error'
          ? self.postMessage({type: 'rsc-error', error: s.error})
          : s && self.postMessage({type: 'deploy-result', result: s});
      } catch (r) {
        self.postMessage({type: 'rsc-error', error: String(r)});
      }
    else if (t.type === 'render')
      try {
        var i = u_();
        Promise.resolve(i)
          .then(function (r) {
            Ef(t.requestId, r);
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
        p_(t.actionId, t.encodedArgs)
          .then(function (r) {
            Ef(t.requestId, r);
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
