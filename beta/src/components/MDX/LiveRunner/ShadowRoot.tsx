import {useEffect, useRef, useState, FC} from 'react';
import {createPortal} from 'react-dom';

export const ShadowRoot: FC<JSX.IntrinsicElements['div']> = ({
  children,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot>();

  useEffect(() => {
    setShadowRoot(ref.current?.attachShadow({mode: 'open'}));
  }, []);

  return (
    <div ref={ref} {...rest}>
      {shadowRoot && createPortal(children, shadowRoot as any)}
    </div>
  );
};
