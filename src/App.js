/* eslint-disable react/prop-types */

import React from 'react';
import NavBar from './app/fragments/navigation/NavBar';
import ModBuilder from './app/pages/mod-builder/ModBuilder';

import './styles/styles';
import 'react-toastify/dist/ReactToastify.css';

const forgeVersions = [
    ['1.18.2', '40.1.0', 'Forge 1.18.2']
];

const buttons = [
    ...forgeVersions.map((ver) => {
        return {
            value:
                <div>
                    <a
                        href={`https://maven.minecraftforge.net/net/minecraftforge/forge/${ver[0]}-${ver[1]}/forge-${ver[0]}-${ver[1]}-installer.jar`}
                    >
                        {ver[2]}
                    </a>
                </div>

        };
    })
];

const socials = [
    {
        icon: 'discord',
        text: 'Discord',
        link: 'https://discord.gg/EW5JsGJfdt',
        title: 'Join the Discord community!'
    },
    {
        icon: 'reddit',
        text: 'Reddit',
        link: 'https://reddit.com/r/TheSyrenProject/',
        title: 'Join the subreddit community!',
    },
    {
        icon: 'github',
        text: 'GitHub',
        link: 'https://github.com/ChrisOfNormandy/',
        title: 'Check out my other projects!'
    }
];

/**
 *
 * @param {*} param0
 * @returns
 */
function Social({ icon, text, link = null, title = null }) {
    return (
        <div
            className={`socials-container ${icon}`}
        >
            <a
                className='socials-link'
                target='_blank'
                rel='noreferrer'
                title={title}
                href={link}
            >
                <i
                    className={`icon bi bi-${icon}`}
                />

                <span
                    className='socials-text'
                >
                    {text}
                </span>
            </a>
        </div>
    );
}

/**
 *
 * @returns
 */
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

            <main
                id='sect_builder'
                className='primary-sect'
            >
                <ModBuilder />

                <div
                    className='socials-wrapper'
                >
                    {
                        socials.map((social, i) => <Social
                            key={i}
                            icon={social.icon}
                            text={social.text}
                            link={social.link}
                            title={social.title}
                        />)
                    }
                </div>
            </main>

            <footer>
                <div>
                    Built by ChrisOfNormandy.
                </div>
            </footer>
        </div>
    );
}

export default App;
