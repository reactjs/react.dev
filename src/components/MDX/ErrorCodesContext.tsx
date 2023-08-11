import {createContext} from 'react';

export type ErrorCodes = Record<string, string> | null;

export const ErrorCodesContext = createContext<ErrorCodes>(null);
