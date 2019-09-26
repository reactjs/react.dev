function MarkdownEditor() {
  const [value, setValue] = React.useState('Hello, **world**!');

  function handleChange(e) {
    setValue(e.target.value);
  }

  function getRawMarkup() {
    const md = new Remarkable();
    return {__html: md.render(value)};
  }

  return (
    <div className="MarkdownEditor">
      <h3>Input</h3>
      <label htmlFor="markdown-content">Enter some markdown</label>
      <textarea id="markdown-content" onChange={handleChange} value={value} />
      <h3>Output</h3>
      <div className="content" dangerouslySetInnerHTML={getRawMarkup()} />
    </div>
  );
}

ReactDOM.render(
  <MarkdownEditor />,
  document.getElementById('markdown-example'),
);
