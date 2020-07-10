function Timer() {

  const [seconds, setSeconds] = useState(0);

  function tick() {
    setSeconds( seconds + 1 );
  }

  useEffect( function() {
    const interval = setInterval(() => tick(), 1000);

    return function() {
      clearInterval(interval);
    }
  }, [] )

  return (
    <div>
      Seconds: {seconds}
    </div>
  );
}

ReactDOM.render(
  <Timer />,
  document.getElementById('timer-example')
);