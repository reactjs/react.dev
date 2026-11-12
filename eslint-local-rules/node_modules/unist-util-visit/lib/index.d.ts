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
export function visit<Tree extends UnistNode, Check extends Test>(tree: Tree, check: Check, visitors: BuildVisitor<Tree, Check> | BuildVisitors<Tree, Check>, reverse?: boolean | null | undefined): undefined;
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
export function visit<Tree extends UnistNode, Check extends Test>(tree: Tree, visitors: BuildVisitor<Tree> | BuildVisitors<Tree>, reverse?: boolean | null | undefined): undefined;
/**
 * Test from `unist-util-is`.
 *
 * Note: we have remove and add `undefined`, because otherwise when generating
 * automatic `.d.ts` files, TS tries to flatten paths from a local perspective,
 * which doesn’t work when publishing on npm.
 */
export type Test = Exclude<import("unist-util-is").Test, undefined> | undefined;
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
 * Handle a node (matching `test`, if given) before its children.
 *
 * Like `Visitor` in `unist-util-visit-parents`,
 * but with `index` and `parent` instead of `parents`.
 */
export type Visitor<Visited extends UnistNode = UnistNode, Ancestor extends UnistParent = UnistParent> = (node: Visited, index: Visited extends UnistNode ? number | undefined : never, parent: Ancestor extends UnistParent ? Ancestor | undefined : never) => VisitorResult;
/**
 * Handle a node (matching `test`, if given) after its children.
 *
 * Like `VisitorExit` in `unist-util-visit-parents`,
 * but with `index` and `parent` instead of `parents`.
 */
export type VisitorExit<Visited extends UnistNode = UnistNode, Ancestor extends UnistParent = UnistParent> = (node: Visited, index: Visited extends UnistNode ? number | undefined : never, parent: Ancestor extends UnistParent ? Ancestor | undefined : never) => VisitorResultExit;
/**
 * Handle nodes when entering and exiting them.
 *
 * Like `Visitors` in `unist-util-visit-parents`.
 */
export type Visitors<Visited extends UnistNode = UnistNode, Ancestor extends UnistParent = UnistParent> = {
    /**
     * Handle a node before its children (optional).
     */
    enter?: Visitor<Visited, Ancestor> | null | undefined;
    /**
     *   Handle a node after its children.
     */
    exit: VisitorExit<Visited, Ancestor>;
};
/**
 * Build a typed `Visitor` function from a node and all possible parents.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildVisitorFromMatch<Visited extends UnistNode, Ancestor extends UnistParent> = Visitor<Visited, Parent<Ancestor, Visited>>;
/**
 * Build a typed `Visitor` function from a list of descendants and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildVisitorFromDescendants<Descendant extends UnistNode, Check extends Test> = (BuildVisitorFromMatch<Matches<Descendant, Check>, Extract<Descendant, UnistParent>>);
/**
 * Build a typed `Visitor` function from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildVisitor<Tree extends UnistNode = UnistNode, Check extends Test = Test> = (BuildVisitorFromDescendants<InclusiveDescendant<Tree>, Check>);
/**
 * Build typed `Visitors` from a tree and a test.
 *
 * It will infer which values are passed as `node` and which as `parent`.
 */
export type BuildVisitors<Tree extends UnistNode = UnistNode, Check extends Test = Test> = (Visitors<Matches<InclusiveDescendant<Tree>, Check>, Parent<Extract<InclusiveDescendant<Tree>, UnistParent>, Matches<InclusiveDescendant<Tree>, Check>>>);
import type { Node as UnistNode } from 'unist';
import type { Parent as UnistParent } from 'unist';
import type { InclusiveDescendant } from 'unist-util-visit-parents';
import type { VisitorResult } from 'unist-util-visit-parents';
import type { VisitorResultExit } from 'unist-util-visit-parents';
import type { Matches } from 'unist-util-visit-parents';
export { CONTINUE, EXIT, SKIP } from "unist-util-visit-parents";
//# sourceMappingURL=index.d.ts.map