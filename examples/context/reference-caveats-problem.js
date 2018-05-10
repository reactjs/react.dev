class App extends React.Component {
  render() {
    // highlight-range{2}
    return (
      <Provider value={{something: 'something'}}>
        <Toolbar />
      </Provider>
    );
  }
}
