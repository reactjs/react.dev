import compile from '@mdx-js/mdx';

const mdx = `
# hello there!

*niiiice*
`;

compile(mdx).then((res) => console.log(res));

export default function Hello() {
  return (
    <>
      <h1>hi there</h1>
      <p>lalala</p>
    </>
  );
}
