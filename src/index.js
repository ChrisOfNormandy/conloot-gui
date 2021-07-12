import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';

ReactDOM.render(
  <React.StrictMode>
    <header>
      <NavBar />
    </header>
    <main>
      <App />
    </main>
    <footer>
      <div>Built by ChrisOfNormandy.</div>
      <div>Join <a href='https://discord.gg/EW5JsGJfdt'>Discord</a></div>
    </footer>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
