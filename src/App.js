import React from 'react';

import ModBuilder from './views/ModBuilder';
import NavBar from './app/components/navigation/NavBar';
// import TextureEditor from './views/TextureEditor';

import './styles/sections.css';

/**
 *
 * @param {*} id
 */
function toggle(id) {
    let d;

    buttons.forEach((v) => {
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
        id: 'sect_paint',
        action: () => {
            toggle('sect_paint');
        }
    },
    {
        value: (<div>Builder</div>),
        id: 'sect_builder',
        action: () => {
            toggle('sect_builder');
        }
    },
    {
        value: (<div>Config</div>),
        id: 'sect_config',
        action: () => {
            toggle('sect_config');
        }
    }
];

function App() {
    return (
        <div
            className='App'
            onDrop={
                (e) => {
                    e.preventDefault();
                }
            }
        >
            <header>
                <NavBar
                    buttons={buttons}
                />
            </header>

            {/* <div id='sect_paint' className='primary-sect'>
                <TextureEditor />
            </div> */}

            <main
                id='sect_builder'
                className='primary-sect'
            >
                <ModBuilder />
            </main>

            <footer>
                <div>
                    Built by ChrisOfNormandy.
                </div>
                <div>
                    <span>
                        Join
                    </span>
                    <a
                        href='https://discord.gg/EW5JsGJfdt'
                    >
                        Discord
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default App;
