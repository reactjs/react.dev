const FancyButton = React.forwardRef((props, ref) => (
  <button className="button-class" ref={ref}>
    {props.children}
  </button>
));

const ref = React.createRef();

// You'll now get a `ref` of the `button` element
<FancyButton ref={ref}>Click me!</FancyButton>;
