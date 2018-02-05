class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(
      this
    );
  }
  // highlight-range{5}
  handleSubmit(event) {
    event.preventDefault();
    alert(
      `Selected file - ${
        this.fileInput.files[0].name
      }`
    );
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          {/* highlight-range{1-6} */}
          <input
            type="file"
            ref={input => {
              this.fileInput = input;
            }}
          />
        </label>
        <br />
        <button type="submit">
          Submit
        </button>
      </form>
    );
  }
}

ReactDOM.render(
  <FileInput />,
  document.getElementById('root')
);
