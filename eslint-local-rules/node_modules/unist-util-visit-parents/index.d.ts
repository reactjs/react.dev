export type {Test} from 'unist-util-is'
export type {
  Action,
  ActionTuple,
  BuildVisitor,
  BuildVisitors,
  // Undocumented: used in `unist-util-visit`:
  InclusiveDescendant,
  Index,
  // Undocumented: used in `unist-util-visit`:
  Matches,
  Visitor,
  VisitorExit,
  VisitorResult,
  VisitorResultExit,
  Visitors
} from './lib/index.js'
export {CONTINUE, EXIT, SKIP, visitParents} from './lib/index.js'
