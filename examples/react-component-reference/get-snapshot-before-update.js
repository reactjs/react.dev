class ScrollingList extends React.Component {
  listRef = React.createRef();

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the current height of the list so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      return this.listRef.current.scrollHeight;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (snapshot !== null) {
      this.listRef.current.scrollTop +=
        this.listRef.current.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
