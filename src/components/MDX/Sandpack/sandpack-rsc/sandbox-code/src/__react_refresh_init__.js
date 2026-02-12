// Must run before React loads. Creates __REACT_DEVTOOLS_GLOBAL_HOOK__ so
// React's renderer injects into it, enabling react-refresh to work.
if (typeof window !== 'undefined' && !window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var nextID = 0;
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    renderers: new Map(),
    supportsFiber: true,
    inject: function (injected) {
      var id = nextID++;
      this.renderers.set(id, injected);
      return id;
    },
    onScheduleFiberRoot: function () {},
    onCommitFiberRoot: function () {},
    onCommitFiberUnmount: function () {},
  };
}
