function App() {
  // highlight-range{1}
  const [value] = useState({something: 'something'});

  // highlight-range{2}
  return (
    <Provider value={value}>
      <Toolbar />
    </Provider>
  );
}
