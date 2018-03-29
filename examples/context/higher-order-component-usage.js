function Button({theme, ...rest}) {
  // highlight-next-line
  return <button className={theme} {...rest} />;
}

// highlight-next-line
const ThemedButton = withTheme(Button);
