declare module 'content/languages.yml' {
  declare module.exports: {
    name: string,
    translated_name: string,
    code: string,
    status: 0 | 1 | 2,
  }[];
}

declare module 'content/versions.yml' {
  declare module.exports: {
    title: string,
    changelog: string,
    path?: string,
    url?: string,
  }[];
}

declare module 'content/acknowledgements.yml' {
  declare module.exports: string[];
}

interface NavItem {
  id: string;
  title: string;
  href?: string;
  forceInternal?: boolean;
  subItems?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
  isOrdered?: boolean;
}

declare module 'content/docs/nav.yml' {
  declare module.exports: NavSection[];
}

declare module 'content/community/nav.yml' {
  declare module.exports: NavSection[];
}

declare module 'content/tutorial/nav.yml' {
  declare module.exports: NavSection[];
}
