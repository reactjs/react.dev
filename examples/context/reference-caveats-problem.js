function App() {
  // highlight-range{2}
  return (
    <Provider value={{something: 'something'}}>
      <Toolbar />
    </Provider>
  );
}
