/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import React, {Component} from 'react';
import Flex from 'components/Flex';
import Section from './Section';
import ScrollSyncSection from './ScrollSyncSection';
import {media} from 'theme';

class Sidebar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeSection: props.defaultActiveSection,
    };
  }

  render() {
    const {
      closeParentMenu,
      createLink,
      enableScrollSync,
      location,
      sectionList,
    } = this.props;
    const {activeSection} = this.state;

    const SectionComponent = enableScrollSync ? ScrollSyncSection : Section;

    return (
      <Flex
        type="nav"
        direction="column"
        halign="stretch"
        css={{
          width: '100%',
          paddingLeft: 20,
          position: 'relative',

          [media.greaterThan('largerSidebar')]: {
            paddingLeft: 40,
          },

          [media.lessThan('small')]: {
            paddingBottom: 100,
          },
        }}>
        {sectionList.map((section, index) => (
          <SectionComponent
            createLink={createLink}
            isActive={activeSection === section || sectionList.length === 1}
            key={index}
            location={location}
            onLinkClick={closeParentMenu}
            onSectionTitleClick={() => this._toggleSection(section)}
            section={section}
          />
        ))}
      </Flex>
    );
  }

  _toggleSection(section) {
    this.setState(state => ({
      activeSection: state.activeSection === section ? null : section,
    }));
  }
}

export default Sidebar;
