/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

// This is not pretty.
// See https://github.com/facebook/react/issues/11538#issuecomment-417504600
// We need this because we don't even offer official translations.
// https://github.com/facebook/react/issues/12460

export default function patchDOMForGoogleTranslate() {
  if (typeof Node !== 'function' || Node.prototype == null) {
    return;
  }

  // $FlowFixMe Intentionally monkeypatching.
  const originalRemoveChild = Node.prototype.removeChild;
  // $FlowFixMe Intentionally monkeypatching.
  Node.prototype.removeChild = function(child) {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.error(
          'Cannot remove a child from a different parent',
          child,
          this,
        );
      }
      return child;
    }
    return originalRemoveChild.apply(this, arguments);
  };

  // $FlowFixMe Intentionally monkeypatching.
  const originalInsertBefore = Node.prototype.insertBefore;
  // $FlowFixMe Intentionally monkeypatching.
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.error(
          'Cannot insert before a reference node from a different parent',
          referenceNode,
          this,
        );
      }
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments);
  };
}
