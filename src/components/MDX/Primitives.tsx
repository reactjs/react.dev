import type {HTMLAttributes} from 'react';

export const P = (props: HTMLAttributes<HTMLParagraphElement>) => (
  <p className="whitespace-pre-wrap my-4" {...props} />
);

export const Strong = (props: HTMLAttributes<HTMLElement>) => (
  <strong className="font-bold" {...props} />
);

export const OL = (props: HTMLAttributes<HTMLOListElement>) => (
  <ol className="ms-6 my-3 list-decimal" {...props} />
);

export const LI = (props: HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-relaxed mb-1" {...props} />
);

export const UL = (props: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ms-6 my-3 list-disc" {...props} />
);

export const Divider = () => (
  <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />
);
