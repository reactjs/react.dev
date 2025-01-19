import {HTMLAttributes} from 'react';

export const P = (p: HTMLAttributes<HTMLParagraphElement>) => (
  <p className="whitespace-pre-wrap my-4" {...p} />
);

export const Strong = (strong: HTMLAttributes<HTMLElement>) => (
  <strong className="font-bold" {...strong} />
);

export const OL = (p: HTMLAttributes<HTMLOListElement>) => (
  <ol className="ms-6 my-3 list-decimal" {...p} />
);
export const LI = (p: HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-relaxed mb-1" {...p} />
);
export const UL = (p: HTMLAttributes<HTMLUListElement>) => (
  <ul className="ms-6 my-3 list-disc" {...p} />
);

export const Divider = () => (
  <hr className="my-6 block border-b border-t-0 border-border dark:border-border-dark" />
);
