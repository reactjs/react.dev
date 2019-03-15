function TodoApp() {
  const [items, setItems] = React.useState([]);
  const [text, setText] = React.useState('');

  function handleChange(event) {
    setText(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (!text.length) {
      return;
    }
    const newItem = {
      text: text,
      id: Date.now(),
    };

    setItems(currentItems => currentItems.concat(newItem));
    setText('');
  }

  return (
    <div>
      <h3>TODO</h3>
      <TodoList items={items} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="new-todo">What needs to be done?</label>
        <input id="new-todo" onChange={handleChange} value={text} />
        <button>Add #{items.length + 1}</button>
      </form>
    </div>
  );
}

function TodoList(props) {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}

ReactDOM.render(<TodoApp />, document.getElementById('todos-example'));
