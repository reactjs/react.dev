import * as React from 'react';
const Sandpack = React.lazy(
  () =>
    import('./SandpackWrapper').then(
      (x) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(x), 3000);
        })
    ) as any
);

export default React.memo(function SandpackWrapper(props: any): any {
  return (
    <React.Suspense
      fallback={
        <pre className="rounded-lg leading-6 h-full w-full overflow-x-auto flex items-center bg-wash dark:bg-gray-95 shadow-lg my-8 text-[13.6px] overflow-hidden">
          <div className="py-6 pl-5 transition-all duration-1000 font-normal">
            {props.children}
          </div>
        </pre>
      }>
      <Sandpack {...props} />
    </React.Suspense>
  );
});
