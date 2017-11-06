/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import React, {Component} from 'react';
import {colors, media} from 'theme';

class DocSearch extends Component {
  state = {
    enabled: true,
  };
  componentDidMount() {
    // Initialize Algolia search.
    // TODO Is this expensive? Should it be deferred until a user is about to search?
    // eslint-disable-next-line no-undef
    if (window.docsearch) {
      window.docsearch({
        apiKey: '36221914cce388c46d0420343e0bb32e',
        indexName: 'react',
        inputSelector: '#algolia-doc-search',
      });
    } else {
      console.warn('Search has failed to load and now is being disabled');
      this.setState({enabled: false});
    }
  }

  render() {
    const {enabled} = this.state;

    return enabled ? (
      <form
        css={{
          display: 'flex',
          flex: '0 0 auto',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',

          [media.lessThan('small')]: {
            justifyContent: 'flex-end',
          },
          [media.lessThan('large')]: {
            marginRight: 10,
          },
          [media.between('small', 'medium')]: {
            width: 'calc(100% / 3)',
          },
          [media.between('medium', 'xlarge')]: {
            width: 'calc(100% / 6)',
          },
          [media.greaterThan('small')]: {
            minWidth: 120,
          },
        }}>
        <input
          css={{
            appearance: 'none',
            background: 'transparent',
            border: 0,
            color: colors.white,
            fontSize: 18,
            fontWeight: 300,
            fontFamily: 'inherit',
            position: 'relative',
            padding: '5px 5px 5px 29px',
            backgroundImage: 'url(/search.svg)',
            backgroundSize: '16px 16px',
            backgroundRepeat: 'no-repeat',
            backgroundPositionY: 'center',
            backgroundPositionX: '5px',

            ':focus': {
              outline: 0,
              backgroundColor: colors.lighter,
              borderRadius: '0.25rem',
            },

            [media.lessThan('large')]: {
              fontSize: 16,
            },
            [media.greaterThan('small')]: {
              width: '100%',
            },
            [media.lessThan('small')]: {
              width: '16px',
              transition: 'width 0.2s ease, padding 0.2s ease',
              paddingLeft: '16px',

              ':focus': {
                paddingLeft: '29px',
                width: '8rem',
                outline: 'none',
              },
            },
          }}
          id="algolia-doc-search"
          type="search"
          placeholder="Search docs"
          aria-label="Search docs"
        />
      </form>
    ) : null;
  }
}

export default DocSearch;
