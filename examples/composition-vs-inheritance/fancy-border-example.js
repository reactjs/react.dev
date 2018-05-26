function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {/* highlight-next-line */}
      {props.children}
    </div>
  );
}
