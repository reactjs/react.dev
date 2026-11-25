/**
 * @import {Node as UnistNode, Parent as UnistParent} from 'unist'
 * @import {
 *   InclusiveDescendant,
 *   Matches,
 *   Visitors as ParentsVisitors,
 *   VisitorResult,
 *   VisitorResultExit
 * } from 'unist-util-visit-parents'
 */

/**
 * @typedef {Exclude<import('unist-util-is').Test, undefined> | undefined} Test
 *   Test from `unist-util-is`.
 *
 *   Note: we have remove and add `undefined`, because otherwise when generating
 *   automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 *   which doesn’t work when publishing on npm.
 */

/**
 * @typedef {(
 *   Node extends UnistParent
 *   ? Node extends {children: Array<infer Children>}
 *     ? Child extends Children ? Node : never
 *     : never
 *   : never
 * )} InternalParent
 *   Collect nodes that can be parents of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {InternalParent<InclusiveDescendant<Tree>, Child>} Parent
 *   Collect nodes in `Tree` that can be parents of `Child`.
 * @template {UnistNode} Tree
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @callback Visitor
 *   Handle a node (matching `test`, if given) before its children.
 *
 *   Like `Visitor` in `unist-util-visit-parents`,
 *   but with `index` and `parent` instead of `parents`.
 * @param {Visited} node
 *   Found node.
 * @param {Visited extends UnistNode ? number | undefined : never} index
 *   Index of `node` in `parent`,
 *   or `undefined` for the tree itself.
 * @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
 *   Parent of `node`,
 *   or `undefined` for the tree itself.
 * @returns {VisitorResult}
 *   What to do next.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [Ancestor=UnistParent]
 *   Ancestor type.
 */

/**
 * @callback VisitorExit
 *   Handle a node (matching `test`, if given) after its children.
 *
 *   Like `VisitorExit` in `unist-util-visit-parents`,
 *   but with `index` and `parent` instead of `parents`.
 * @param {Visited} node
 *   Found node.
 * @param {Visited extends UnistNode ? number | undefined : never} index
 *   Index of `node` in `parent`,
 *   or `undefined` for the tree itself.
 * @param {Ancestor extends UnistParent ? Ancestor | undefined : never} parent
 *   Parent of `node`,
 *   or `undefined` for the tree itself.
 * @returns {VisitorResultExit}
 *   What to do next.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [Ancestor=UnistParent]
 *   Ancestor type.
 */

/**
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [Ancestor=UnistParent]
 *   Ancestor type.
 * @typedef Visitors
 *   Handle nodes when entering and exiting them.
 *
 *   Like `Visitors` in `unist-util-visit-parents`.
 * @property {Visitor<Visited, Ancestor> | null | undefined} [enter]
 *   Handle a node before its children (optional).
 * @property {VisitorExit<Visited, Ancestor>} exit
 *   Handle a node after its children.
 */

/**
 * @typedef {Visitor<Visited, Parent<Ancestor, Visited>>} BuildVisitorFromMatch
 *   Build a typed `Visitor` function from a node and all possible parents.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} Visited
 *   Node type.
 * @template {UnistParent} Ancestor
 *   Parent type.
 */

/**
 * @typedef {(
 *   BuildVisitorFromMatch<
 *     Matches<Descendant, Check>,
 *     Extract<Descendant, UnistParent>
 *   >
 * )} BuildVisitorFromDescendants
 *   Build a typed `Visitor` function from a list of descendants and a test.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} Descendant
 *   Node type.
 * @template {Test} Check
 *   Test type.
 */

/**
 * @typedef {(
 *   BuildVisitorFromDescendants<
 *     InclusiveDescendant<Tree>,
 *     Check
 *   >
 * )} BuildVisitor
 *   Build a typed `Visitor` function from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Node type.
 * @template {Test} [Check=Test]
 *   Test type.
 */

/**
 * @typedef {(
 *   Visitors<
 *     Matches<InclusiveDescendant<Tree>, Check>,
 *     Parent<
 *       Extract<InclusiveDescendant<Tree>, UnistParent>,
 *       Matches<InclusiveDescendant<Tree>, Check>
 *     >
 *   >
 * )} BuildVisitors
 *   Build typed `Visitors` from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parent`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Node type.
 * @template {Test} [Check=Test]
 *   Test type.
 */

import {visitParents} from 'unist-util-visit-parents'

export {CONTINUE, EXIT, SKIP} from 'unist-util-visit-parents'

/**
 * Visit nodes.
 *
 * This algorithm performs *depth-first* *tree traversal* in *preorder*
 * (**NLR**) or if `reverse` is given,
 * in *reverse preorder* (**NRL**).
 * An `exit` visitor is called in *postorder* (**LRN**)
 * or if `reverse` is given, in *reverse postorder* (**RLN**).
 *
 * You can choose which nodes are visited by passing a `test`.
 * For complex tests, you should test yourself in a visitor, as it will be
 * faster and will have improved type information.
 *
 * Walking the tree is an intensive task.
 * Make use of the return values of the visitor when possible.
 * Instead of walking a tree multiple times, walk it once, use `unist-util-is`
 * to check if a node matches, and then perform different operations.
 *
 * You can change the tree.
 * Changes inside a node made when entering it are walked,
 * changes made when exiting it are not.
 * See `Visitor` and `VisitorExit` for more info.
 *
 * @overload
 * @param {Tree} tree
 *   Tree to traverse.
 * @param {Check} check
 *   `unist-util-is`-compatible test.
 * @param {BuildVisitor<Tree, Check> | BuildVisitors<Tree, Check>} visitors
 *   Handle each node when entering it,
 *   or `{enter, exit}` to also handle it when exiting it.
 * @param {boolean | null | undefined} [reverse]
 *   Walk children from last to first;
 *   for `enter`, reverse preorder (NRL) instead of preorder (NLR);
 *   for `exit`, reverse postorder (RLN) instead of postorder (LRN).
 * @returns {undefined}
 *   Nothing.
 *
 * @overload
 * @param {Tree} tree
 *   Tree to traverse.
 * @param {BuildVisitor<Tree> | BuildVisitors<Tree>} visitors
 *   Handle each node when entering it,
 *   or `{enter, exit}` to also handle it when exiting it.
 * @param {boolean | null | undefined} [reverse]
 *   Walk children from last to first;
 *   for `enter`, reverse preorder (NRL) instead of preorder (NLR);
 *   for `exit`, reverse postorder (RLN) instead of postorder (LRN).
 * @returns {undefined}
 *   Nothing.
 *
 * @param {UnistNode} tree
 *   Tree to traverse.
 * @param {Visitor | Visitors | Test} testOrEnterOrVisitors
 *   `unist-util-is`-compatible test, `enter`, or `visitors`.
 * @param {Visitor | Visitors | boolean | null | undefined} [enterOrVisitorsOrReverse]
 *   `enter`, `visitors`, or `reverse` after a test.
 * @param {boolean | null | undefined} [maybeReverse]
 *   Walk children from last to first;
 *   for `enter`, reverse preorder (NRL) instead of preorder (NLR);
 *   for `exit`, reverse postorder (RLN) instead of postorder (LRN).
 * @returns {undefined}
 *   Nothing.
 *
 * @template {UnistNode} Tree
 *   Node type.
 * @template {Test} Check
 *   `unist-util-is`-compatible test.
 */
export function visit(
  tree,
  testOrEnterOrVisitors,
  enterOrVisitorsOrReverse,
  maybeReverse
) {
  /** @type {Test} */
  let check
  /** @type {Visitor | Visitors} */
  let visitors
  /** @type {boolean | null | undefined} */
  let reverse

  // Third parameter is an enter visitor or a visitors object, so expect a `test` too.
  if (
    typeof enterOrVisitorsOrReverse === 'function' ||
    (enterOrVisitorsOrReverse && typeof enterOrVisitorsOrReverse === 'object')
  ) {
    check = /** @type {Test} */ (testOrEnterOrVisitors)
    visitors = enterOrVisitorsOrReverse
    reverse = maybeReverse
  }
  // Assume no test.
  else {
    visitors = /** @type {Visitor | Visitors} */ (testOrEnterOrVisitors)
    reverse = enterOrVisitorsOrReverse
  }

  if (typeof visitors === 'function') {
    visitParents(tree, check, wrap(visitors), reverse)
  } else {
    visitParents(tree, check, wrapVisitors(visitors), reverse)
  }
}

/**
 * Turn `visit` visitors into `visitParents` visitors.
 *
 * @param {Visitors} visitors
 *   Visitors for `visit`.
 * @returns {ParentsVisitors}
 *   Visitors for `visitParents`.
 */
function wrapVisitors(visitors) {
  // Pass anything else straight to `visitParents` to get its errors.
  if (!visitors || typeof visitors !== 'object') return visitors

  return {
    enter:
      typeof visitors.enter === 'function'
        ? wrap(visitors.enter)
        : visitors.enter,
    exit:
      typeof visitors.exit === 'function' ? wrap(visitors.exit) : visitors.exit
  }
}

/**
 * Turn a `visit` visitor into a `visitParents` one.
 *
 * @template {VisitorResult} Result
 *   Result type.
 * @param {(node: UnistNode, index: number | undefined, parent: UnistParent | undefined) => Result} visitor
 *   Visitor for `visit`.
 * @returns {(node: UnistNode, parents: Array<UnistParent>, index: number | undefined) => Result}
 *   Visitor for `visitParents`.
 */
function wrap(visitor) {
  return overload

  /**
   * Call `visitor` with `index` and `parent` instead of `parents`.
   *
   * @param {UnistNode} node
   *   Visited node.
   * @param {Array<UnistParent>} parents
   *   Ancestors of `node`.
   * @param {number | undefined} index
   *   Index of `node` in its parent.
   * @returns {Result}
   *   What to do next.
   */
  function overload(node, parents, index) {
    return visitor(node, index, parents[parents.length - 1])
  }
}
