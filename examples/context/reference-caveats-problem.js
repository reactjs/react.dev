const App = () => {
  // highlight-range{2}
  return (
    <MyContext.Provider value={{something: 'something'}}>
      <Toolbar />
    </MyContext.Provider>
  );
};
