function tick() {
	  const clock = 
	  (
		<div>
		  <h2>
		  	It is {new Date().toLocaleTimeString()}.
		  </h2>
		</div>
	  );
	  
	  reactdom.render
	  (
		  clock,
		  document.getElementById('root')
	  );
	}
	
	setInterval(tick, 1000);
