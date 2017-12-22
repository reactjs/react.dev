class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
// highlight-range{1-4}
  handleSubmit (event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.files[0].name}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          {/* highlight-next-line */}
          <input type='file' ref={input => {this.fileInput = input}} />
        </label>
        <br/>
        <button type='submit'>Submit</button>
      </form>
    );
  }
}

ReactDOM.render(<FileInput />, document.getElementById('root'));
