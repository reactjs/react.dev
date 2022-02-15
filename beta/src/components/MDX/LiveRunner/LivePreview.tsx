import React, {useState, useMemo} from 'react';
import {Runner, importCode, Scope} from 'react-runner';
import * as UseImmer from 'use-immer';

import {Error as LiveError} from './Error';
import {ShadowRoot} from './ShadowRoot';
import {RunnerFile} from './types';

const defaultStyle = `
* {
  box-sizing: border-box;
}

:host {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

ul {
  padding-left: 20px;
}
`.trim();

const withFiles = (scope: Scope, files: Record<string, string>) => {
  const imports: Scope = {...scope.import};
  const lookup = new Set<string>();
  const importsProxy: Scope = new Proxy(imports, {
    getOwnPropertyDescriptor(target, prop) {
      if (target.hasOwnProperty(prop)) {
        return Object.getOwnPropertyDescriptor(target, prop);
      }
      if (files.hasOwnProperty(prop)) {
        return {writable: true, enumerable: true, configurable: true};
      }
      return undefined;
    },
    get(target, prop: string) {
      if (prop in target) return target[prop];
      if (files.hasOwnProperty(prop)) {
        if (lookup.has(prop)) {
          throw new Error(
            `Circular dependency detected: ${[...Array.from(lookup), prop].join(
              ' -> '
            )}`
          );
        }
        lookup.add(prop);
        return (target[prop] = importCode(files[prop], {
          ...scope,
          import: importsProxy,
        }));
      }
    },
  });

  Object.keys(files).forEach((file) => {
    try {
      imports[file] = importsProxy[file];
      lookup.clear();
    } catch (error: any) {
      error.path = file;
      throw error;
    }
  });

  return {...scope, import: imports};
};

const baseScope = {
  import: {
    react: React,
    'use-immer': UseImmer,
  },
};

export const LivePreview = ({files}: {files: RunnerFile[]}) => {
  const [importsError, setImportsError] = useState<Error | null>(null);
  const [renderError, setRenderError] = useState<Error | null>(null);

  const scope = useMemo(() => {
    try {
      const scope = withFiles(
        baseScope,
        files.slice(1).reduce((acc, item) => {
          if (item.path.endsWith('.css')) return acc;
          acc[`./${item.path}`] = item.code;
          return acc;
        }, {} as Record<string, string>)
      );
      if (importsError) {
        setImportsError(null);
      }
      return scope;
    } catch (error: any) {
      setImportsError(error);
      return baseScope;
    }
  }, [files]);

  return (
    <div className="p-0 sm:p-2 md:p-4 lg:p-8 md:bg-card md:dark:bg-wash-dark h-full relative md:rounded-b-lg lg:rounded-b-none overflow-auto">
      <div style={{padding: 'initial', position: 'relative'}}>
        <div className="rounded-t-none bg-white md:shadow-md sm:rounded-lg w-full max-w-full opacity-100 overflow-hidden">
          <div style={{all: 'initial'}}>
            {importsError ? (
              <LiveError error={importsError} />
            ) : (
              <ShadowRoot style={{margin: renderError ? 0 : undefined}}>
                <div id="root">
                  <Runner
                    code={files[0].code}
                    scope={scope}
                    onRendered={(error) => {
                      if (error) {
                        setRenderError(error);
                      } else if (renderError) {
                        setRenderError(null);
                      }
                    }}
                  />
                </div>
                <style>{defaultStyle}</style>
                {files.map(
                  (file) =>
                    file.path.endsWith('.css') && (
                      <style key={file.path}>
                        {file.code.replace(/\bbody\b/g, ':host')}
                      </style>
                    )
                )}
              </ShadowRoot>
            )}
            {renderError && <LiveError error={renderError} />}
          </div>
        </div>
      </div>
    </div>
  );
};
