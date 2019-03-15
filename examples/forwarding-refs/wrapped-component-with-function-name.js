const FancyButton = React.forwardRef(function Button(
  props,
  ref
) {
  return (
    <button ref={ref} className="FancyButton">
      {props.children}
    </button>
  );
});
