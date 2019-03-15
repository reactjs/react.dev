function Timer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setSeconds(currentSeconds => currentSeconds + 1),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return <div>Seconds: {seconds}</div>;
}

ReactDOM.render(<Timer />, document.getElementById('timer-example'));
