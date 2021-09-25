import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';
import NavBar from './components/NavBar';

import './styles/index.css';
import './styles/themes.css';

function toggle(id) {
    let d;

    buttons.forEach(v => {
        d = document.getElementById(v.id);

        if (v.id === id)
            d.classList.remove('hidden');
        else
            d.classList.add('hidden');
    });
}

const buttons = [
    {
        value: (<div>Paint</div>),
        id: "sect_paint",
        action: (e) => {
            toggle('sect_paint');
        }
    },
    {
        value: (<div>Builder</div>),
        id: "sect_builder",
        action: (e) => {
            toggle('sect_builder');
        }
    },
    {
        value: (<div>Config</div>),
        id: "sect_config",
        action: (e) => {
            toggle('sect_config');
        }
    }
];

ReactDOM.render(
    <React.StrictMode>
        <header>
            <NavBar buttons={buttons} />
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
