'use client';

import {Fragment, useMemo} from 'react';
import {usePathname} from 'next/navigation';
import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import sidebarCommunity from '../../sidebarCommunity.json';
import sidebarBlog from '../../sidebarBlog.json';

function useActiveSection() {
  const pathname = usePathname() ?? '/';
  if (pathname === '/') {
    return 'home';
  } else if (pathname.startsWith('/reference')) {
    return 'reference';
  } else if (pathname.startsWith('/learn')) {
    return 'learn';
  } else if (pathname.startsWith('/community')) {
    return 'community';
  } else if (pathname.startsWith('/blog')) {
    return 'blog';
  } else {
    return 'unknown';
  }
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(key: any, val: any) {
  if (Array.isArray(val) && val[0] == '$r') {
    // Assume it's a React element.
    let type = val[1];
    let key = val[2];
    let props = val[3];
    if (type === 'wrapper') {
      type = Fragment;
      props = {children: props.children};
    }
    if (MDXComponents[type as keyof typeof MDXComponents]) {
      type = MDXComponents[type as keyof typeof MDXComponents];
    }
    if (!type) {
      console.error('Unknown type: ' + type);
      type = Fragment;
    }
    return {
      $$typeof: Symbol.for('react.element'),
      type: type,
      key: key,
      ref: null,
      props: props,
      _owner: null,
    };
  } else {
    return val;
  }
}

export function Client({content, toc, meta, languages}: any) {
  const parsedContent = useMemo(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );
  const parsedToc = useMemo(() => JSON.parse(toc, reviveNodeOnClient), [toc]);
  const section = useActiveSection();
  let routeTree: any;
  switch (section) {
    case 'home':
    case 'unknown':
      routeTree = sidebarHome;
      break;
    case 'learn':
      routeTree = sidebarLearn;
      break;
    case 'reference':
      routeTree = sidebarReference;
      break;
    case 'community':
      routeTree = sidebarCommunity;
      break;
    case 'blog':
      routeTree = sidebarBlog;
      break;
  }
  return (
    <Page
      toc={parsedToc}
      routeTree={routeTree}
      meta={meta}
      section={section}
      languages={languages}>
      {parsedContent}
    </Page>
  );
}
