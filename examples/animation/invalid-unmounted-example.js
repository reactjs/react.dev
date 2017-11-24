class MyComponent extends Component {
  render() {
    const items = this.state.items.map(
      (item, i) => (
        <div
          key={item}
          onClick={() =>
            this.handleRemove(i)}>
          {/* highlight-range{1,3} */}
          <ReactCSSTransitionGroup transitionName="example">
            {item}
          </ReactCSSTransitionGroup>
        </div>
      )
    );

    return (
      <div>
        <button
          onClick={this.handleAdd}>
          Add Item
        </button>
        {items /* highlight-line */}
      </div>
    );
  }
}
