/**
 * @import {Node as UnistNode, Parent as UnistParent} from 'unist'
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
 *   Fn extends (value: any) => value is infer Thing
 *   ? Thing
 *   : Fallback
 * )} Predicate
 *   Get the value of a type guard `Fn`.
 * @template Fn
 *   Value; typically function that is a type guard (such as `(x): x is Y`).
 * @template Fallback
 *   Value to yield if `Fn` is not a type guard.
 */

/**
 * @typedef {(
 *   Check extends null | undefined // No test.
 *   ? Value
 *   : Value extends {type: Check} // String (type) test.
 *   ? Value
 *   : Value extends Check // Partial test.
 *   ? Value
 *   : Check extends Function // Function test.
 *   ? Predicate<Check, Value> extends Value
 *     ? Predicate<Check, Value>
 *     : never
 *   : never // Some other test?
 * )} MatchesOne
 *   Check whether a node matches a primitive check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test, but not arrays.
 */

/**
 * @typedef {(
 *   Check extends ReadonlyArray<infer T>
 *   ? MatchesOne<Value, T>
 *   : Check extends Array<infer T>
 *   ? MatchesOne<Value, T>
 *   : MatchesOne<Value, Check>
 * )} Matches
 *   Check whether a node matches a check in the type system.
 * @template Value
 *   Value; typically unist `Node`.
 * @template Check
 *   Value; typically `unist-util-is`-compatible test.
 */

/**
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10} Uint
 *   Number; capped reasonably.
 */

/**
 * @typedef {I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10} Increment
 *   Increment a number in the type system.
 * @template {Uint} [I=0]
 *   Index.
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
 * @typedef {(
 *   Depth extends Max
 *   ? never
 *   :
 *     | InternalParent<Node, Child>
 *     | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>
 * )} InternalAncestor
 *   Collect nodes in `Tree` that can be ancestors of `Child`.
 * @template {UnistNode} Node
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @typedef {InternalAncestor<InclusiveDescendant<Tree>, Child>} Ancestor
 *   Collect nodes in `Tree` that can be ancestors of `Child`.
 * @template {UnistNode} Tree
 *   All node types in a tree.
 * @template {UnistNode} Child
 *   Node to search for.
 */

/**
 * @typedef {(
 *   Tree extends UnistParent
 *     ? Depth extends Max
 *       ? Tree
 *       : Tree | InclusiveDescendant<Tree['children'][number], Max, Increment<Depth>>
 *     : Tree
 * )} InclusiveDescendant
 *   Collect all (inclusive) descendants of `Tree`.
 *
 *   > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 *   > recurse without actually running into an infinite loop, which the
 *   > previous version did.
 *   >
 *   > Practically, a max of `2` is typically enough assuming a `Root` is
 *   > passed, but it doesn’t improve performance.
 *   > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 *   > Using up to `10` doesn’t hurt or help either.
 * @template {UnistNode} Tree
 *   Tree type.
 * @template {Uint} [Max=10]
 *   Max; searches up to this depth.
 * @template {Uint} [Depth=0]
 *   Current depth.
 */

/**
 * @typedef {'skip' | boolean} Action
 *   Union of the action types.
 *
 * @typedef {number} Index
 *   Move to the sibling at `index` next (after node itself is completely
 *   traversed).
 *
 *   Useful if mutating the tree, such as removing the node the visitor is
 *   currently on, or any of its previous siblings.
 *   Results less than 0 or greater than or equal to `children.length` stop
 *   traversing the parent.
 *
 * @typedef {[(Action | null | undefined | void)?, (Index | null | undefined)?]} ActionTuple
 *   List with one or two values, the first an action, the second an index.
 *
 * @typedef {Action | ActionTuple | Index | null | undefined | void} VisitorResult
 *   Any value that can be returned from an enter visitor.
 *
 *   Like `VisitorResultExit`,
 *   but `SKIP` can also be returned,
 *   to not walk the children of the node,
 *   and `ActionTuple` can be used to combine an action with an index.
 *
 * @typedef {Index | boolean | null | undefined | void} VisitorResultExit
 *   Any value that can be returned from an exit visitor.
 */

/**
 * @callback Visitor
 *   Handle a node (matching `test`, if given) before its children.
 *
 *   Changes inside `node` are walked next.
 *   Replacing or removing it is easier in `exit`.
 *   When replacing or removing it here,
 *   return `SKIP` (as otherwise its old children are walked),
 *   or `[SKIP, index]` to continue with the node now at `index`.
 *   Changing next siblings (in walk order) is fine;
 *   changing previous siblings needs a new `Index`.
 *   Removing an ancestor or changing its previous siblings is not supported.
 * @param {Visited} node
 *   Found node.
 * @param {Array<VisitedParents>} ancestors
 *   Ancestors of `node`.
 * @param {number | undefined} index
 *   Index of `node` in its parent (the last of `ancestors`),
 *   or `undefined` for the tree itself.
 * @returns {VisitorResult}
 *   What to do next.
 *
 *   Like `VisitorExit`,
 *   but `SKIP` can also be returned,
 *   to not walk the children of `node`.
 *   Passing a tuple back (`ActionTuple`) only makes sense as `[SKIP, Index]`.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [VisitedParents=UnistParent]
 *   Ancestor type.
 */

/**
 * @callback VisitorExit
 *   Handle a node (matching `test`, if given) after its children.
 *
 *   Changes inside `node` are not walked,
 *   which makes this a good place to change `node` based on its children,
 *   or to replace or remove it.
 *   When removing `node` or changing previous siblings (in walk order),
 *   return a new `Index`.
 *   Removing an ancestor or changing its previous siblings is not supported.
 * @param {Visited} node
 *   Found node.
 * @param {Array<VisitedParents>} ancestors
 *   Ancestors of `node`.
 * @param {number | undefined} index
 *   Index of `node` in its parent (the last of `ancestors`),
 *   or `undefined` for the tree itself.
 * @returns {VisitorResultExit}
 *   What to do next.
 *
 *   `CONTINUE` (`true`, nothing) continues as normal,
 *   `EXIT` (`false`) stops traversing,
 *   and `Index` continues at that sibling.
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [VisitedParents=UnistParent]
 *   Ancestor type.
 */

/**
 * @template {UnistNode} [Visited=UnistNode]
 *   Visited node type.
 * @template {UnistParent} [VisitedParents=UnistParent]
 *   Ancestor type.
 * @typedef Visitors
 *   Handle nodes when entering and exiting them.
 *   The `enter` visitor is optional while `exit` is required.
 *
 *   Pass an `enter` visitor directly to only handle nodes when entering them.
 *
 *   `enter` is called before children (if any) are walked and `exit` after that.
 *   `exit` is still called when `enter` returns `SKIP`.
 *   Both `enter` and `exit` are only called for nodes that match an optional `test`.
 * @property {Visitor<Visited, VisitedParents> | null | undefined} [enter]
 *   Handle a node before its children (optional).
 * @property {VisitorExit<Visited, VisitedParents>} exit
 *   Handle a node after its children.
 */

/**
 * @typedef {Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitor
 *   Build a typed `Visitor` function from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parents`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Tree type.
 * @template {Test} [Check=Test]
 *   Test type.
 */

/**
 * @typedef {Visitors<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>} BuildVisitors
 *   Build typed `Visitors` from a tree and a test.
 *
 *   It will infer which values are passed as `node` and which as `parents`.
 * @template {UnistNode} [Tree=UnistNode]
 *   Tree type.
 * @template {Test} [Check=Test]
 *   Test type.
 */

import {convert} from 'unist-util-is'
import {color} from 'unist-util-visit-parents/do-not-use-color'

/** @type {Readonly<ActionTuple>} */
const empty = []

/**
 * Continue traversing as normal.
 */
export const CONTINUE = true

/**
 * Stop traversing immediately.
 */
export const EXIT = false

/**
 * Do not traverse this node’s children.
 * Only works when entering a node.
 */
export const SKIP = 'skip'

/**
 * Visit nodes, with ancestral information.
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
 * @param {BuildVisitor<Tree, Check>} enter
 *   Handle each node when entering it.
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
 * @param {Check} check
 *   `unist-util-is`-compatible test.
 * @param {BuildVisitors<Tree, Check>} visitors
 *   Handle each node when exiting it, and optionally when entering it.
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
 * @param {BuildVisitor<Tree>} enter
 *   Handle each node when entering it.
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
 * @param {BuildVisitors<Tree>} visitors
 *   Handle each node when exiting it, and optionally when entering it.
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
 * @param {boolean | null | undefined} [reverse]
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
export function visitParents(
  tree,
  testOrEnterOrVisitors,
  enterOrVisitorsOrReverse,
  reverse
) {
  if (!tree || typeof tree !== 'object') {
    throw new Error('Unexpected value `' + tree + '` for `tree`, expected node')
  }

  let preorder = true
  /** @type {Test} */
  let check
  /** @type {Visitors | Visitor} */
  let visitors
  /** @type {Visitor | null | undefined} */
  let enter
  /** @type {VisitorExit | null | undefined} */
  let exit

  // Third parameter is an enter visitor or a visitors object, so expect a `test` too.
  if (
    typeof enterOrVisitorsOrReverse === 'function' ||
    (enterOrVisitorsOrReverse && typeof enterOrVisitorsOrReverse === 'object')
  ) {
    check = /** @type {Test} */ (testOrEnterOrVisitors)
    visitors = enterOrVisitorsOrReverse
    if (reverse) preorder = false
  }
  // Assume no test.
  else {
    visitors = /** @type {Visitors | Visitor} */ (testOrEnterOrVisitors)
    if (enterOrVisitorsOrReverse) preorder = false
  }

  if (typeof visitors === 'function') {
    enter = visitors
  } else if (visitors && typeof visitors === 'object') {
    if (visitors.enter === null || visitors.enter === undefined) {
      // Empty.
    } else if (typeof visitors.enter === 'function') {
      enter = visitors.enter
    } else {
      throw new Error(
        'Unexpected value `' +
          visitors.enter +
          '` for `visitors.enter`, expected optional visitor'
      )
    }

    if (typeof visitors.exit === 'function') {
      exit = visitors.exit
    } else {
      throw new Error(
        'Unexpected value `' +
          visitors.exit +
          '` for `visitors.exit`, expected visitor (pass a visitor directly if you only want an enter visitor)'
      )
    }
  } else {
    throw new Error(
      'Unexpected value `' +
        visitors +
        '` for `enter` or `visitors`, expected visitor or object with visitors'
    )
  }

  const is = convert(check)
  const step = preorder ? 1 : -1

  factory(tree, undefined, [])()

  /**
   * Create a function to visit a node.
   *
   * @param {UnistNode} node
   *   Node to visit.
   * @param {number | undefined} index
   *   Index of `node` in its parent.
   * @param {Array<UnistParent>} parents
   *   Ancestors of `node`.
   * @returns {() => Readonly<ActionTuple>}
   *   Visit `node`.
   */
  function factory(node, index, parents) {
    const value = /** @type {Record<string, unknown>} */ (
      node && typeof node === 'object' ? node : {}
    )

    if (typeof value.type === 'string') {
      const name =
        // `hast`
        typeof value.tagName === 'string'
          ? value.tagName
          : // `xast`
            typeof value.name === 'string'
            ? value.name
            : undefined

      Object.defineProperty(visit, 'name', {
        value:
          'node (' + color(node.type + (name ? '<' + name + '>' : '')) + ')'
      })
    }

    return visit

    function visit() {
      const matches =
        !check || is(node, index, parents[parents.length - 1] || undefined)
      /** @type {Readonly<ActionTuple>} */
      let result = empty

      if (enter && matches) {
        result = toResult(enter(node, parents, index))

        if (result[0] === EXIT) {
          return result
        }
      }

      if ('children' in node && node.children) {
        const nodeAsParent = /** @type {UnistParent} */ (node)

        if (nodeAsParent.children && result[0] !== SKIP) {
          let offset = (preorder ? -1 : nodeAsParent.children.length) + step
          const grandparents = [...parents, nodeAsParent]

          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset]

            const subresult = factory(child, offset, grandparents)()

            if (subresult[0] === EXIT) {
              return subresult
            }

            offset =
              typeof subresult[1] === 'number' ? subresult[1] : offset + step
          }
        }
      }

      if (exit && matches) {
        const exitResult = toResult(exit(node, parents, index))

        if (exitResult[0] === SKIP) {
          throw new Error(
            'Unexpected value `' +
              exitResult[0] +
              '` from `exit`, expected `CONTINUE`, `EXIT`, index, or nothing'
          )
        }

        // Prefer a result from `exit` over `enter`.
        if (exitResult[0] === EXIT || typeof exitResult[1] === 'number') {
          return exitResult
        }
      }

      return result
    }
  }
}

/**
 * Turn a return value into a clean result.
 *
 * @param {VisitorResult} value
 *   Valid return values from visitors.
 * @returns {Readonly<ActionTuple>}
 *   Clean result.
 */
function toResult(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'number') {
    return [CONTINUE, value]
  }

  return value === null || value === undefined ? empty : [value]
}
