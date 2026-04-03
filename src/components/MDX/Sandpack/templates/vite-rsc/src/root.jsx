import App from './App.jsx';
import './styles.css';

export function Root(props) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite React RSC</title>
      </head>
      <body>
        <App {...props} />
      </body>
    </html>
  );
}
