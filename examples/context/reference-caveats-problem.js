class App extends React.Component {
  render() {
    // highlight-range{2}
    return (
      <ThemeContext.Provider value={{something: 'something'}}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
