import {useEffect, useState} from 'react';
import {CodeMirror} from 'react-runner-codemirror';

import {LivePreview} from './LivePreview';
import {ResetButton} from './ResetButton';
import {RunnerFile} from './types';

export function LiveRunner(props: {files: RunnerFile[]}) {
  const [files, setFiles] = useState(props.files);
  const [current, setCurrent] = useState(0);
  const currentFile = files[current];

  const [mode, setMode] = useState<'light' | 'dark' | undefined>(() =>
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('theme') === 'dark'
      ? 'dark'
      : 'light'
  );

  useEffect(() => {
    const observer = new MutationObserver((mutationList, observer) => {
      mutationList.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          setMode(
            (mutation.target as any).classList.contains('dark')
              ? 'dark'
              : 'light'
          );
        }
      });
    });

    observer.observe(document.documentElement, {attributes: true});
    return () => observer.disconnect();
  }, []);
  return (
    <div className="sandpack-container my-8">
      <div className="shadow-lg dark:shadow-lg-dark rounded-lg">
        <div className="bg-wash dark:bg-card-dark flex justify-between items-center relative z-10 border-b border-border dark:border-border-dark rounded-t-lg rounded-b-none">
          <div className="px-4 lg:px-6">
            <div className="sp-tabs" translate="no">
              <div
                aria-label="Select active file"
                className="sp-tabs-scrollable-container"
                role="tablist">
                {files.map(
                  (file, idx) =>
                    !file.hidden && (
                      <button
                        key={file.path}
                        aria-selected={idx === current}
                        className="sp-tab-button"
                        data-active={idx === current}
                        role="tab"
                        title={file.path}
                        type="button"
                        onClick={() => setCurrent(idx)}>
                        {file.path}
                      </button>
                    )
                )}
              </div>
            </div>
          </div>
          <div className="px-3 flex items-center justify-end flex-grow text-right">
            <ResetButton onReset={() => setFiles(props.files)} />
          </div>
        </div>
        <div className="sp-wrapper">
          <div className="sp-layout sp-custom-layout">
            <div className="sp-stack">
              <div className="sp-code-editor">
                <CodeMirror
                  className="h-full"
                  role="group"
                  tabIndex={0}
                  translate="no"
                  showLineNumbers
                  theme={mode}
                  padding="16px 16px 16px 0"
                  value={currentFile.code}
                  filename={currentFile.path}
                  onChange={(newCode) => {
                    const newFiles = [...files];
                    newFiles[current] = {...currentFile, code: newCode};
                    setFiles(newFiles);
                  }}
                />
              </div>
            </div>
            <div className="sp-stack order-last xl:order-2">
              <LivePreview files={files} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
