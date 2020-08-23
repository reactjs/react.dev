const ToDo = props => (
  <tr>
    <td>
      <label>{props.id}</label>
    </td>
    <td>
      <input />
    </td>
    <td>
      <label>{props.createdAt.toTimeString()}</label>
    </td>
  </tr>
);

class ToDoList extends React.Component {
  constructor() {
    super();
    const date = new Date();
    const todoCounter = 1;
    this.state = {
      todoCounter: todoCounter,
      list: [
        {
          id: todoCounter,
          createdAt: date,
        },
      ],
    };
  }

  sortByEarliest() {
    const sortedList = this.state.list.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    this.setState({
      list: [...sortedList],
    });
  }

  sortByLatest() {
    const sortedList = this.state.list.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
    this.setState({
      list: [...sortedList],
    });
  }

  addToEnd() {
    const date = new Date();
    const nextId = this.state.todoCounter + 1;
    const newList = [
      ...this.state.list,
      {id: nextId, createdAt: date},
    ];
    this.setState({
      list: newList,
      todoCounter: nextId,
    });
  }

  addToStart() {
    const date = new Date();
    const nextId = this.state.todoCounter + 1;
    const newList = [
      {id: nextId, createdAt: date},
      ...this.state.list,
    ];
    this.setState({
      list: newList,
      todoCounter: nextId,
    });
  }

  render() {
    return (
      <div>
        <code>key=index</code>
        <br />
        <button onClick={this.addToStart.bind(this)}>
          Add New to Start
        </button>
        <button onClick={this.addToEnd.bind(this)}>
          Add New to End
        </button>
        <button onClick={this.sortByEarliest.bind(this)}>
          Sort by Earliest
        </button>
        <button onClick={this.sortByLatest.bind(this)}>
          Sort by Latest
        </button>
        <table>
          <tr>
            <th>ID</th>
            <th />
            <th>created at</th>
          </tr>
          {this.state.list.map((todo, index) => (
            <ToDo key={index} {...todo} />
          ))}
        </table>
      </div>
    );
  }
}

ReactDOM.render(
  <ToDoList />,
  document.getElementById('root')
);
