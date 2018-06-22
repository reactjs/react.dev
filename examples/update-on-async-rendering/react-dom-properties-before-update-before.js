class ScrollingList extends React.Component {
  listRef = null;
  previousScrollOffset = null;

  // highlight-range{1-8}
  componentWillUpdate(nextProps, nextState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (this.props.list.length < nextProps.list.length) {
      this.previousScrollOffset =
        this.listRef.scrollHeight - this.listRef.scrollTop;
    }
  }

  // highlight-range{1-10}
  componentDidUpdate(prevProps, prevState) {
    // If previousScrollOffset is set, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    if (this.previousScrollOffset !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight -
        this.previousScrollOffset;
      this.previousScrollOffset = null;
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
