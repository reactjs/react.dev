import type { Token, TokenType, tokTypes } from 'acorn';
import type { Root } from 'mdast';
import type { visit as visitor } from 'unist-util-visit';
export declare const restoreTokens: (text: string, root: Root, tokens: Token[], tt: Record<string, TokenType> & typeof tokTypes, visit: typeof visitor) => Token[];
