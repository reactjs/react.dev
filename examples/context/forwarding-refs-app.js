import FancyButton from './fancy-button';

const ref = React.createRef();

// Our ref will point to the FancyButton component,
// And not the ThemeContext.Consumer that wraps it.
// This means we can call FancyButton methods like ref.current.focus()
// highlight-next-line
<FancyButton ref={ref} onClick={handleClick}>
  Click me!
</FancyButton>;
