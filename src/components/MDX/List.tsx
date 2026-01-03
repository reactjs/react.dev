export const OL = (p: React.HTMLAttributes<HTMLOListElement>) => (
  <ol className="ms-6 my-3 list-decimal" {...p} />
);
export const LI = (p: React.HTMLAttributes<HTMLLIElement>) => (
  <li className="leading-relaxed mb-1" {...p} />
);
export const UL = (p: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className="ms-6 my-3 list-disc" {...p} />
);
