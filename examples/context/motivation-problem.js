const ThemedButton = props => {
  //highlight-range{1}
  return <Button theme={props.theme} />;
};

// An intermediate component
const Toolbar = props => {
  // highlight-range{1-2,5}
  // The Toolbar component must take an extra theme prop
  // and pass it to the ThemedButton
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
};

class App extends React.Component {
  render() {
    // highlight-range{1}
    return <Toolbar theme="dark" />;
  }
}
