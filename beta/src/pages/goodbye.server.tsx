import MDXRenderer from '../components/MDXRenderer';

const mdx = `
# hello there too!

nice to meet you
`;

export default function Hello() {
  return (
    <>
      <p>my other content:</p>
      <hr />
      <MDXRenderer mdx={mdx} />
    </>
  );
}
