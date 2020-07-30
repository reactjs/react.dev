/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import React, {useState, useRef, useCallback} from 'react';
import {createPortal} from 'react-dom';
import Helmet from 'react-helmet';
import {Link, navigate} from 'gatsby';
import hex2rgba from 'hex2rgba';
import {colors} from 'theme';
import {
  DocSearchButton,
  DocSearchModal,
  useDocSearchKeyboardEvents,
} from '@docsearch/react';

import '@docsearch/react/style';

function Hit({hit, children}) {
  return <Link to={hit.url}>{children}</Link>;
}

function DocSearch(props) {
  const searchButtonRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState(null);

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }

    return Promise.all([import('@docsearch/react/modal')]).then(
      ([{DocSearchModal: Modal}]) => {
        DocSearchModal = Modal;
      },
    );
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded, setIsOpen]);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onInput = useCallback(
    event => {
      setIsOpen(true);
      setInitialQuery(event.key);
    },
    [setIsOpen, setInitialQuery],
  );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <>
      <Helmet>
        {/* This hints the browser that the website will load data from Algolia,
        and allows it to preconnect to the DocSearch cluster. It makes the first
        query faster, especially on mobile. */}
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin
        />

        <style type="text/css">{`
          .DocSearch {
            --docsearch-primary-color: ${colors.brand};
            --docsearch-text-color: ${colors.brandLight};
            --docsearch-highlight-color: ${colors.brand};
            --docsearch-muted-color: ${colors.subtleOnDark};
            --docsearch-container-background: ${hex2rgba(colors.darker, 0.7)};
            --docsearch-logo-color: #fff;
            --docsearch-icon-color: ${colors.subtleOnDark};

            --docsearch-modal-background: ${colors.dark};
            --docsearch-modal-shadow:
              inset 1px 1px 0 0 ${hex2rgba(colors.divider, 0.1)},
              0 3px 8px 0 ${colors.darker};

            --docsearch-searchbox-background: ${colors.dark};
            --docsearch-searchbox-focus-background: ${colors.black};
            --docsearch-searchbox-shadow: inset 0 0 0 2px ${colors.brand};

            --docsearch-key-shadow:
              inset 0 -2px 0 0 #222e45,
              inset 0 0 1px 1px ${hex2rgba(colors.brand, 0.2)},
              0 2px 2px 0 rgba(3, 4, 9, 0.3);
            --docsearch-key-gradient: linear-gradient(
              -26.5deg,
              #444952 0%,
              ${colors.darker} 100%
            );

            --docsearch-hit-color: #bec3c9;
            --docsearch-hit-active-color: ${colors.dark};
            --docsearch-hit-background: ${colors.darker};
            --docsearch-hit-shadow: none;
            
            --docsearch-footer-background: ${colors.dark};
            --docsearch-footer-shadow:
              inset 0 1px 0 0 ${hex2rgba(colors.divider, 0.1)},
              0 -4px 8px 0 ${hex2rgba(colors.darker, 1)};
          }
        `}</style>
      </Helmet>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
        ref={searchButtonRef}
      />

      {isOpen &&
        createPortal(
          <DocSearchModal
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            onClose={onClose}
            navigator={{
              navigate({suggestionUrl}) {
                navigate(suggestionUrl);
              },
            }}
            hitComponent={Hit}
            transformItems={items => {
              return items.map(item => {
                // We transform the absolute URL into a relative URL to
                // leverage Gatsby's preloading.
                const a = document.createElement('a');
                a.href = item.url;

                return {
                  ...item,
                  url: `${a.pathname}${a.hash}`,
                };
              });
            }}
            {...props}
          />,
          document.body,
        )}
    </>
  );
}

export default DocSearch;
