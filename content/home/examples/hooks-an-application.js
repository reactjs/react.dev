const TodoApp = () => {
  const [items, setItems] = React.useState([]);
  const [text, setText] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (text.length === 0) {
      return;
    }
    const newItem = {
      text,
      id: Date.now(),
    };
    setItems(items.concat(newItem));
    setText('');
  };

  const handleChange = e => {
    setText(e.target.value);
  };

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
};

const TodoList = props => {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
};

ReactDOM.render(<TodoApp />, document.getElementById('todos-example'));
