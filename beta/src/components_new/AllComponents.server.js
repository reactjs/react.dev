import Link from './Link.client';
export const a = Link;

export function Hello() {
  return <h1>hi</h1>;
}

export const wrapper = function Wrapper({children}) {
  return (
    <div
      style={{
        border: '1px solid red',
      }}>
      {children}
    </div>
  );
};
