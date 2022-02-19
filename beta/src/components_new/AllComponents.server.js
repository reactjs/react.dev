import Link from './Link.client';
import LayoutAPI from './LayoutAPI.server';
import LayoutLearn from './LayoutLearn.server';

export const a = Link;

export function Hello() {
  return <h1>hi</h1>;
}

export const wrapper = function Wrapper({router, data, children}) {
  if (!router) {
    throw Error('noooo');
  }

  let Layout = LayoutLearn;
  if (router.pathname.startsWith('/apis/')) {
    Layout = LayoutAPI;
  }

  return (
    <Layout>
      {JSON.stringify(data)}
      <hr />
      {children}
    </Layout>
  );
};
