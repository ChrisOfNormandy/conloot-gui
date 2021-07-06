import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {NavBar} from './components/NavBar';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
