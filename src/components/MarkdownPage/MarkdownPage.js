/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Container from 'components/Container';
import Flex from 'components/Flex';
import MarkdownHeader from 'components/MarkdownHeader';
import NavigationFooter from 'templates/components/NavigationFooter';
import React, {Component} from 'react';
import StickyResponsiveSidebar from 'components/StickyResponsiveSidebar';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import findSectionForPath from 'utils/findSectionForPath';
import toCommaSeparatedList from 'utils/toCommaSeparatedList';
import {sharedStyles} from 'theme';
import createOgUrl from 'utils/createOgUrl';
import slugify from 'utils/slugify';
import {navigateTo} from 'gatsby-link';

import type {Node} from 'types';

type Props = {
  authors: Array<string>,
  createLink: Function, // TODO: Add better flow type once we Flow-type createLink
  date?: string,
  enableScrollSync?: boolean,
  ogDescription: string,
  location: Location,
  markdownRemark: Node,
  sectionList: Array<Object>, // TODO: Add better flow type once we have the Section component
  titlePostfix: string,
  enableKeyboardNavigation: boolean,
};

type Page = {
  id: string,
  title: string,
};

const getPageById = (
  sectionList: Array<Object>,
  templateFile: ?string,
): ?Page => {
  if (!templateFile) {
    return null;
  }

  const sectionItems = sectionList.map(section => section.items);
  const flattenedSectionItems = [].concat.apply([], sectionItems);
  const linkId = templateFile.replace('.html', '');

  return flattenedSectionItems.find(item => item.id === linkId);
};

class MarkdownPage extends Component<Props> {
  ARROW_RIGHT: number = 39;
  ARROW_LEFT: number = 37;

  prevPage: ?Page = getPageById(
    this.props.sectionList,
    this.props.markdownRemark.frontmatter.prev,
  );
  nextPage: ?Page = getPageById(
    this.props.sectionList,
    this.props.markdownRemark.frontmatter.next,
  );

  navigate = (pageId: string) => {
    const section = findSectionForPath(
      this.props.location.pathname,
      this.props.sectionList,
    );

    if (section && typeof section.directory === 'string') {
      navigateTo(slugify(pageId, section.directory));
    }
  };

  handleKeyboardNavigation = (event: SyntheticKeyboardEvent<*>) => {
    switch (event.keyCode) {
      case this.ARROW_RIGHT:
        if (this.nextPage) {
          this.navigate(this.nextPage.id);
        }
        break;
      case this.ARROW_LEFT:
        if (this.prevPage) {
          this.navigate(this.prevPage.id);
        }
        break;
    }
  };

  componentDidMount() {
    if (this.props.enableKeyboardNavigation) {
      window.addEventListener('keydown', this.handleKeyboardNavigation);
    }
  }

  componentWillUnmount() {
    if (this.props.enableKeyboardNavigation) {
      window.removeEventListener('keydown', this.handleKeyboardNavigation);
    }
  }

  render() {
    const {
      authors = [],
      createLink,
      date,
      enableScrollSync,
      ogDescription,
      location,
      markdownRemark,
      sectionList,
      titlePostfix = '',
    } = this.props;
    const hasAuthors = authors.length > 0;
    const titlePrefix = markdownRemark.frontmatter.title || '';

    return (
      <Flex
        direction="column"
        grow="1"
        shrink="0"
        halign="stretch"
        css={{
          width: '100%',
          flex: '1 0 auto',
          position: 'relative',
          zIndex: 0,
        }}>
        <TitleAndMetaTags
          ogDescription={ogDescription}
          ogUrl={createOgUrl(markdownRemark.fields.slug)}
          title={`${titlePrefix}${titlePostfix}`}
        />
        <div css={{flex: '1 0 auto'}}>
          <Container>
            <div css={sharedStyles.articleLayout.container}>
              <Flex type="article" direction="column" grow="1" halign="stretch">
                <MarkdownHeader title={titlePrefix} />

                {(date || hasAuthors) && (
                  <div css={{marginTop: 15}}>
                    {date}{' '}
                    {hasAuthors && (
                      <span>
                        by{' '}
                        {toCommaSeparatedList(authors, author => (
                          <a
                            css={sharedStyles.link}
                            href={author.frontmatter.url}
                            key={author.frontmatter.name}>
                            {author.frontmatter.name}
                          </a>
                        ))}
                      </span>
                    )}
                  </div>
                )}

                <div css={sharedStyles.articleLayout.content}>
                  <div
                    css={[sharedStyles.markdown]}
                    dangerouslySetInnerHTML={{__html: markdownRemark.html}}
                  />

                  {markdownRemark.fields.path && (
                    <div css={{marginTop: 80}}>
                      <a
                        css={sharedStyles.articleLayout.editLink}
                        href={`https://github.com/reactjs/reactjs.org/tree/master/content/${
                          markdownRemark.fields.path
                        }`}>
                        Edit this page
                      </a>
                    </div>
                  )}
                </div>
              </Flex>

              <div css={sharedStyles.articleLayout.sidebar}>
                <StickyResponsiveSidebar
                  enableScrollSync={enableScrollSync}
                  createLink={createLink}
                  defaultActiveSection={findSectionForPath(
                    location.pathname,
                    sectionList,
                  )}
                  location={location}
                  sectionList={sectionList}
                />
              </div>
            </div>
          </Container>
        </div>

        {(this.nextPage || this.prevPage) && (
          <NavigationFooter
            location={location}
            next={this.nextPage}
            prev={this.prevPage}
          />
        )}
      </Flex>
    );
  }
}

export default MarkdownPage;
