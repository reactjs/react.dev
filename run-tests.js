const httpServer = require('http-server');
const port = process.env.PORT_NUMBER || 8001;
const spawn = require('child_process').spawn;

// const server = httpServer.createServer({ root: './site' })
const server = httpServer.createServer();

server.listen(port);
console.log(`Server is listening on http://localhost:${port}`);

const tests = spawn('node', ['visual-regression.js'], {
  stdio: 'inherit',
  windowsVerbatimArguments: true,
});

tests.on('close', () => {
  console.log(`Tests finished! Closing server http://localhost:${port}`);
  server.close();
});
