class ScrollingList extends React.Component {
  listRef = null;
  previousScrollHeight = null;

  // highlight-range{1-7}
  componentWillUpdate(nextProps, nextState) {
    // Are we adding new items to the list?
    // Capture the current height of the list so we can adjust scroll later.
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollHeight = this.listRef.scrollHeight;
    }
  }

  // highlight-range{1-10}
  componentDidUpdate(prevProps, prevState) {
    // If previousScrollHeight is set, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (this.previousScrollHeight !== null) {
      this.listRef.scrollTop +=
        this.listRef.scrollHeight -
        this.previousScrollHeight;
      this.previousScrollHeight = null;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
