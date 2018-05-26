function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {/* highlight-next-line */}
        {props.left}
      </div>
        <div className="SplitPane-right">
      {/* highlight-next-line */}
        {props.right}
      </div>
    </div>
  );
}

function App() {
  {/* highlight-range{4,7} */}
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
