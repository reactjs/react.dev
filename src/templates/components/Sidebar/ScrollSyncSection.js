/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the CC-BY-4.0 license found
 * in the LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

import React, {Component} from 'react';
import Section from './Section';

class ScrollSyncSection extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeItemId: '',
      itemTopOffsets: [],
    };

    this.calculateItemTopOffsets = this.calculateItemTopOffsets.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.calculateItemTopOffsets();

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }

  calculateItemTopOffsets() {
    const {section} = this.props;

    const itemIds = _getItemIds(section.items);
    this.setState({
      itemTopOffsets: _getElementTopOffsetsById(itemIds),
    });
  }

  handleResize() {
    this.calculateItemTopOffsets();
    this.handleScroll();
  }

  handleScroll() {
    const {itemTopOffsets} = this.state;
    const item = itemTopOffsets.find((itemTopOffset, i) => {
      const nextItemTopOffset = itemTopOffsets[i + 1];
      if (nextItemTopOffset) {
        return (
          window.scrollY >= itemTopOffset.offsetTop &&
          window.scrollY < nextItemTopOffset.offsetTop
        );
      }
      return window.scrollY >= itemTopOffset.offsetTop;
    });
    this.setState({
      activeItemId: item ? item.id : '',
    });
  }

  render() {
    const {activeItemId} = this.state;
    return <Section isScrollSync activeItemId={activeItemId} {...this.props} />;
  }
}

const _getItemIds = items =>
  items
    .map(item => {
      let subItemIds = [];
      if (item.subitems) {
        subItemIds = item.subitems.map(subitem => subitem.id);
      }
      return [item.id, ...subItemIds];
    })
    .reduce((prev, current) => prev.concat(current));

const _getElementTopOffsetsById = ids =>
  ids
    .map(id => {
      const element = document.getElementById(id);
      if (!element) {
        return null;
      }
      return {
        id,
        offsetTop: element.offsetTop,
      };
    })
    .filter(item => item);

export default ScrollSyncSection;
