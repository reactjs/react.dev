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
export function visitParents<Tree extends UnistNode, Check extends Test>(tree: Tree, check: Check, enter: BuildVisitor<Tree, Check>, reverse?: boolean | null | undefined): undefined;
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
export function visitParents<Tree extends UnistNode, Check extends Test>(tree: Tree, check: Check, visitors: BuildVisitors<Tree, Check>, reverse?: boolean | null | undefined): undefined;
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
export function visitParents<Tree extends UnistNode, Check extends Test>(tree: Tree, enter: BuildVisitor<Tree>, reverse?: boolean | null | undefined): undefined;
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
export function visitParents<Tree extends UnistNode, Check extends Test>(tree: Tree, visitors: BuildVisitors<Tree>, reverse?: boolean | null | undefined): undefined;
/**
 * Continue traversing as normal.
 */
export const CONTINUE: true;
/**
 * Stop traversing immediately.
 */
export const EXIT: false;
/**
 * Do not traverse this node’s children.
 * Only works when entering a node.
 */
export const SKIP: "skip";
/**
 * Test from `unist-util-is`.
 *
 * Note: we have remove and add `undefined`, because otherwise when generating
 * automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 * which doesn’t work when publishing on npm.
 */
export type Test = Exclude<import("unist-util-is").Test, undefined> | undefined;
/**
 * Get the value of a type guard `Fn`.
 */
export type Predicate<Fn, Fallback> = (Fn extends (value: any) => value is infer Thing ? Thing : Fallback);
/**
 * Check whether a node matches a primitive check in the type system.
 */
export type MatchesOne<Value, Check> = (Check extends null | undefined ? Value : Value extends {
    type: Check;
} ? Value : Value extends Check ? Value : Check extends Function ? Predicate<Check, Value> extends Value ? Predicate<Check, Value> : never : never);
/**
 * Check whether a node matches a check in the type system.
 */
export type Matches<Value, Check> = (Check extends ReadonlyArray<infer T> ? MatchesOne<Value, T> : Check extends Array<infer T> ? MatchesOne<Value, T> : MatchesOne<Value, Check>);
/**
 * Number; capped reasonably.
 */
export type Uint = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
/**
 * Increment a number in the type system.
 */
export type Increment<I extends Uint = 0> = I extends 0 ? 1 : I extends 1 ? 2 : I extends 2 ? 3 : I extends 3 ? 4 : I extends 4 ? 5 : I extends 5 ? 6 : I extends 6 ? 7 : I extends 7 ? 8 : I extends 8 ? 9 : 10;
/**
 * Collect nodes that can be parents of `Child`.
 */
export type InternalParent<Node extends UnistNode, Child extends UnistNode> = (Node extends UnistParent ? Node extends {
    children: Array<infer Children>;
} ? Child extends Children ? Node : never : never : never);
/**
 * Collect nodes in `Tree` that can be parents of `Child`.
 */
export type Parent<Tree extends UnistNode, Child extends UnistNode> = InternalParent<InclusiveDescendant<Tree>, Child>;
/**
 * Collect nodes in `Tree` that can be ancestors of `Child`.
 */
export type InternalAncestor<Node extends UnistNode, Child extends UnistNode, Max extends Uint = 10, Depth extends Uint = 0> = (Depth extends Max ? never : InternalParent<Node, Child> | InternalAncestor<Node, InternalParent<Node, Child>, Max, Increment<Depth>>);
/**
 * Collect nodes in `Tree` that can be ancestors of `Child`.
 */
export type Ancestor<Tree extends UnistNode, Child extends UnistNode> = InternalAncestor<InclusiveDescendant<Tree>, Child>;
/**
 * Collect all (inclusive) descendants of `Tree`.
 *
 * > 👉 **Note**: for performance reasons, this seems to be the fastest way to
 * > recurse without actually running into an infinite loop, which the
 * > previous version did.
 * >
 * > Practically, a max of `2` is typically enough assuming a `Root` is
 * > passed, but it doesn’t improve performance.
 * > It gets higher with `List > ListItem > Table > TableRow > TableCell`.
 * > Using up to `10` doesn’t hurt or help either.
 */
export type InclusiveDescendant<Tree extends UnistNode, Max extends Uint = 10, Depth extends Uint = 0> = (Tree extends UnistParent ? Depth extends Max ? Tree : Tree | InclusiveDescendant<Tree["children"][number], Max, Increment<Depth>> : Tree);
/**
 * Union of the action types.
 */
export type Action = "skip" | boolean;
/**
 * Move to the sibling at `index` next (after node itself is completely
 * traversed).
 *
 * Useful if mutating the tree, such as removing the node the visitor is
 * currently on, or any of its previous siblings.
 * Results less than 0 or greater than or equal to `children.length` stop
 * traversing the parent.
 */
export type Index = number;
/**
 * List with one or two values, the first an action, the second an index.
 */
export type ActionTuple = [(Action | null | undefined | void)?, (Index | null | undefined)?];
/**
 * Any value that can be returned from an enter visitor.
 *
 * Like `VisitorResultExit`,
 * but `SKIP` can also be returned,
 * to not walk the children of the node,
 * and `ActionTuple` can be used to combine an action with an index.
 */
export type VisitorResult = Action | ActionTuple | Index | null | undefined | void;
/**
 * Any value that can be returned from an exit visitor.
 */
export type VisitorResultExit = Index | boolean | null | undefined | void;
/**
 * Handle a node (matching `test`, if given) before its children.
 *
 * Changes inside `node` are walked next.
 * Replacing or removing it is easier in `exit`.
 * When replacing or removing it here,
 * return `SKIP` (as otherwise its old children are walked),
 * or `[SKIP, index]` to continue with the node now at `index`.
 * Changing next siblings (in walk order) is fine;
 * changing previous siblings needs a new `Index`.
 * Removing an ancestor or changing its previous siblings is not supported.
 */
export type Visitor<Visited extends UnistNode = UnistNode, VisitedParents extends UnistParent = UnistParent> = (node: Visited, ancestors: Array<VisitedParents>, index: number | undefined) => VisitorResult;
/**
 * Handle a node (matching `test`, if given) after its children.
 *
 * Changes inside `node` are not walked,
 * which makes this a good place to change `node` based on its children,
 * or to replace or remove it.
 * When removing `node` or changing previous siblings (in walk order),
 * return a new `Index`.
 * Removing an ancestor or changing its previous siblings is not supported.
 */
export type VisitorExit<Visited extends UnistNode = UnistNode, VisitedParents extends UnistParent = UnistParent> = (node: Visited, ancestors: Array<VisitedParents>, index: number | undefined) => VisitorResultExit;
/**
 * Handle nodes when entering and exiting them.
 * The `enter` visitor is optional while `exit` is required.
 *
 * Pass an `enter` visitor directly to only handle nodes when entering them.
 *
 * `enter` is called before children (if any) are walked and `exit` after that.
 * `exit` is still called when `enter` returns `SKIP`.
 * Both `enter` and `exit` are only called for nodes that match an optional `test`.
 */
export type Visitors<Visited extends UnistNode = UnistNode, VisitedParents extends UnistParent = UnistParent> = {
    /**
     * Handle a node before its children (optional).
     */
    enter?: Visitor<Visited, VisitedParents> | null | undefined;
    /**
     *   Handle a node after its children.
     */
    exit: VisitorExit<Visited, VisitedParents>;
};
/**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parents`.
 */
export type BuildVisitor<Tree extends UnistNode = UnistNode, Check extends Test = Test> = Visitor<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>;
/**
 * Build typed `Visitors` from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parents`.
 */
export type BuildVisitors<Tree extends UnistNode = UnistNode, Check extends Test = Test> = Visitors<Matches<InclusiveDescendant<Tree>, Check>, Ancestor<Tree, Matches<InclusiveDescendant<Tree>, Check>>>;
import type { Node as UnistNode } from 'unist';
import type { Parent as UnistParent } from 'unist';
//# sourceMappingURL=index.d.ts.map