import React from "react";
import JSZip from 'jszip';
import FSManager from "../app/common/FileSystem";
import Ribbon from './fragments/Ribbon';
import Menu from './fragments/Menu';
import VertRibbon from "./fragments/VertRibbon";
import ContextMenu from "./fragments/ContextMenu";
import FileExplorer from "./mod-builder/FileExplorer";
import config from '../_config/mod-builder.json';
import PopupManager from "./fragments/popups/PopupManager";

import { save, rename, cancelChanges, exportZip, openZip, openForgeZip } from './mod-builder/archiveHandler';
import { v4 } from 'uuid';

import "bootstrap-icons/font/bootstrap-icons.css";
import './mod-builder/styles/main.css';
import './mod-builder/styles/popups.css';
import './mod-builder/styles/block-preview.css';

import * as filemod from './mod-builder/scripts/filemod';
import * as contentBuilder from './mod-builder/scripts/content-builder/content-builder';

const currentFile = {
    file: null,
    fsfile: null,
    path: '',
    text: ''
};

function formatRegName(str) {
    return str.split('_').map(s => { return !!s[0] ? (s[0].toUpperCase() + s.slice(1, s.length)) : ''; }).join(' ');
}

function formatName(str) {
    return str.toLowerCase().replace(/\s/g, '_');
}

class BlockPreview extends React.Component {
    render() {
        return (
            <div className='block-preview-container'>
                <div
                    className='block-preview'
                    id='block_preview'
                >
                    {this.state.sides.map((side, i) => (<div className={`block-side bS-${i}`} key={i} />))}
                </div>
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            sides: []
        };

        for (let i = 0; i < 6; i++) {
            this.state.sides[i] = { face: i, texture: null };
        }
    }
}

function genPopup(index, uuid, title, body, tabName = null, tabDescription = null) {
    return {
        index,
        tabName,
        tabDescription,
        uuid,
        title,
        body,
        enabled: true,
        minimizeEvent: null,
        closeEvent: null
    }
}

export default class ModBuilder extends React.Component {
    closeContextMenu() {
        let state = this.state;
        state.contextMenu = null;
        this.setState(state);
    }

    getContentMenu(id, icon, title, menuItems) {
        return {
            key: `mod_builder_content_${id}_menu`,
            data: (<i
                className={`vert-ribbon-icon icon bi-${icon}`}
                title={title}
                onClick={
                    (e) => {
                        let state = this.state;

                        if (this.state.contextMenu !== null) {
                            return this.closeContextMenu();
                        }

                        state.contextMenu = (
                            <ContextMenu
                                position={{
                                    x: e.clientX,
                                    y: e.clientY
                                }}
                                menuItems={menuItems}
                            />
                        );
                        this.setState(state);
                    }
                }
            />)
        };
    }

    addPopup(uuid, title, body, tabName = null, tabDescription = null) {
        let state = this.state;

        let popup;

        if (state.builders.has(uuid)) {
            let p = state.builders.get(uuid).popups;
            popup = genPopup(p.length, uuid, title, body, tabName, tabDescription);

            p.push(popup);

            this.setState(state);
            return popup;
        }

        popup = genPopup(0, uuid, title, body, tabName, tabDescription);

        state.builders.set(uuid, {
            uuid,
            enabled: true,
            popups: [
                popup
            ]
        });

        this.setState(state);

        return popup;
    }

    blockBuilder(uuid, defaultValue, path) {
        return (
            <div className='content-popup-body'>
                <BlockPreview />

                <form className='content-popup-form'>
                    <div className='content-popup-form-row'>
                        <label
                            className='content-popup-form-label'
                            htmlFor={`block_name_input_${uuid}`}
                        >
                            Block Name
                        </label>

                        <input
                            type='text'
                            id={`block_name_input_${uuid}`}
                            name={`block_name_input_${uuid}`}
                            className='content-popup-form-input'
                            placeholder='Block Name'
                            defaultValue={formatRegName(defaultValue)}
                            onChange={
                                (e) => {
                                    document.getElementById(`block_registry_input_${uuid}`).value = formatName(e.target.value);
                                }
                            }
                            onKeyPress={
                                (e) => {
                                    if (!/[a-zA-Z0-9-\s]/.test(e.key))
                                        e.preventDefault();
                                }
                            }
                            required
                        />
                    </div>

                    <div className='content-popup-form-row'>
                        <label
                            className='content-popup-form-label'
                            htmlFor={`block_registry_input_${uuid}`}
                        >
                            Registry Name
                        </label>

                        <input
                            type='text'
                            id={`block_registry_input_${uuid}`}
                            name={`block_registry_input_${uuid}`}
                            className='content-popup-form-input'
                            placeholder='Registry Name'
                            defaultValue={formatName(defaultValue)}
                            onChange={
                                (e) => {
                                    document.getElementById(`block_name_input_${uuid}`).value = formatRegName(e.target.value);
                                }
                            }
                            onKeyPress={
                                (e) => {
                                    if (!/[a-z0-9-_]/.test(e.key))
                                        e.preventDefault();
                                }
                            }
                            required
                        />
                    </div>

                    <div className='content-popup-form-row'>
                        <button
                            onClick={
                                (e) => {
                                    e.preventDefault();

                                    let state = this.state;

                                    let name = document.getElementById(`block_registry_input_${uuid}`).value;

                                    contentBuilder.default.blocks.standard.create(state.archive.fetch(path), name)
                                        .then(file => this.setState(state))
                                        .catch(err => console.error(err));
                                }
                            }
                        >
                            Write to File
                        </button>

                        <button
                            onClick={
                                (e) => {
                                    e.preventDefault();
                                    let popup = this.addPopup(uuid, 'New Block', this.blockProperties(uuid), 'Block Properties');
                                    popup.minimizeEvent = (g, v) => {
                                        v.tabName = 'Block Properties';
                                    }
                                }
                            }
                        >
                            Edit Properties
                        </button>

                        <div
                            className='content-popup-form-button-row'
                        >
                            <button
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        let popup = this.addPopup(uuid, 'Resource Pack', this.blockBuilder(uuid, defaultValue, path), 'Resource Pack');
                                        popup.minimizeEvent = (g, v) => {
                                            v.tabName = 'Resource Pack'
                                        }
                                    }
                                }
                            >
                                Resource Pack
                            </button>

                            <button
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        let popup = this.addPopup(uuid, 'Data Pack', this.blockBuilder(uuid, defaultValue, path), 'Data Pack');
                                        popup.minimizeEvent = (g, v) => {
                                            v.tabName = 'Data Pack'
                                        }
                                    }
                                }
                            >
                                Data Pack
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    blockProperties(uuid) {
        return (
            <div className='content-popup-body'>
                <form className='content-popup-form'>
                    <div className='content-popup-form-row'>
                        <label
                            className='content-popup-form-label'
                            htmlFor='block_property_input_a'
                        >
                            Field A
                        </label>

                        <input
                            type='text'
                            id='block_property_input_a'
                            name='block_property_input_a'
                            className='content-popup-form-input'
                            placeholder='Field A'
                            defaultValue='abcdef'
                            onKeyPress={
                                (e) => {
                                    if (!/[a-z0-9-_]/.test(e.key))
                                        e.preventDefault();
                                }
                            }
                            required
                        />
                    </div>
                </form>
            </div>
        )
    }

    contentPopupBuilder(contentMenuLabel, file, defaultValue) {
        return {
            action: () => {
                this.closeContextMenu();

                if (this.state.archive.root === null || this.state.orgName === '' || this.state.modName === '')
                    return;

                const path = `src/main/java/com/${this.state.orgName}/${this.state.modName.toLowerCase()}/${file}.java`;

                let id = v4();

                let popup = this.addPopup(id, 'New Block', this.blockBuilder(id, defaultValue, path), formatRegName(defaultValue));
                popup.minimizeEvent = (g, v) => {
                    let state = this.state;
                    let input = document.getElementById(`block_name_input_${g.uuid}`);
                    if (input !== null)
                        state.builders.get(g.uuid).popups[v.index].tabName = input.value;
                    this.setState(state);
                }
            },
            markup: contentMenuLabel
        }
    }

    componentDidMount() {
        let state = this.state;

        if (config.dev) {
            state.archive.setRoot('My_Mod');

            openForgeZip("1.16.5", "36.2.5", state.archive)
                .then(archive => {
                    filemod.examplemod(archive, true)
                        .then(o => {
                            state.archive = o.archive;
                            state.modName = o.modName;
                            state.orgName = o.orgName;

                            this.setState(state);
                        })
                        .catch(err => console.error(err));
                })
                .catch(err => console.error(err));
        }

        this.setState(state);
    }

    render() {
        return (
            <div className='mod-builder-sect'>
                <div
                    className='sect-container'
                >
                    <div className='nav-wrapper'>
                        <Ribbon content={this.state.buttons} />
                    </div>

                    <div
                        id='sect_main'
                        className='sect-main'
                    >
                        <div
                            className='sect-file-explorer'
                            id='sect_file_explorer'
                        >
                            <div
                                className='file-explorer-toolbar'
                            >
                                <i
                                    id='editor_new_file_button'
                                    className="icon bi-file-earmark-plus editor-toolbar-icon icon-active"
                                    title='New File'
                                    onClick={
                                        () => {
                                            if (this.state.archive.root === null)
                                                return;

                                            const state = this.state;
                                            state.archive.root.addFile(
                                                'new-file.txt',
                                                new File([], 'new-file.txt')
                                            );
                                            this.setState(state);
                                        }
                                    }
                                />
                            </div>

                            <FileExplorer archive={this.state.archive} currentFile={currentFile} />
                        </div>

                        <div
                            className='sect-content-nav-bar'
                            id='sect_content_nav_bar'
                        >
                            <VertRibbon
                                content={
                                    [
                                        this.getContentMenu(
                                            'blocks',
                                            'box',
                                            'Create New Block',
                                            [
                                                this.contentPopupBuilder('Standard', 'ModBlocks', 'my_block')
                                            ]
                                        ),
                                        this.getContentMenu(
                                            'plants',
                                            'flower2',
                                            'Create New Plant',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'resource',
                                            'gem',
                                            'Create New Resource',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'worldgen',
                                            'globe2',
                                            'Create New World Gen Feature',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'items',
                                            'trophy',
                                            'Create New Item',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'tool',
                                            'tools',
                                            'Create New Tool / Weapon',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'food',
                                            'cup-straw',
                                            'Create New Food',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'fluid',
                                            'droplet',
                                            'Create New Fluid',
                                            []
                                        ),
                                        this.getContentMenu(
                                            'entity',
                                            'egg',
                                            'Create New Entity',
                                            []
                                        )
                                    ]
                                }
                            />
                        </div>

                        <div
                            className='sect-text-area'
                        >
                            {<PopupManager map={this.state.builders} />}

                            <textarea
                                id='txtArea'
                                onChange={
                                    (e) => {
                                        if (currentFile.file !== null && e.target.value !== currentFile.text) {
                                            document.getElementById('editor_save_button').classList.add('icon-active');
                                            document.getElementById('editor_discard_button').classList.add('icon-active');
                                        }
                                        else if (e.target.value === currentFile.text) {
                                            document.getElementById('editor_save_button').classList.remove('icon-active');
                                            document.getElementById('editor_discard_button').classList.remove('icon-active');
                                        }
                                    }
                                }
                            />
                            <div
                                className='text-area-toolbar'
                            >
                                <label htmlFor='fileName'>File name:</label>
                                <input
                                    type='text'
                                    name='fileName'
                                    id='text_area_file_name'
                                    onKeyPress={
                                        (e) => {
                                            if (currentFile.file === null)
                                                e.preventDefault();
                                        }
                                    }
                                />
                                <i
                                    id='editor_rename_button'
                                    className="icon bi-arrow-return-right editor-toolbar-icon icon-active"
                                    title='Rename'
                                    onClick={
                                        () => {
                                            if (currentFile.file === null)
                                                return;

                                            const state = this.state;
                                            state.archive = rename(state.archive, currentFile);
                                            this.setState(state);
                                        }
                                    }
                                />
                                <i
                                    id='editor_save_button'
                                    className="icon bi-save editor-toolbar-icon"
                                    title='Save'
                                    onClick={
                                        () => {
                                            const state = this.state;
                                            state.archive = save(state.archive, currentFile);
                                            this.setState(state);
                                        }
                                    }
                                />
                                <i
                                    id='editor_discard_button'
                                    className="icon bi-x-circle editor-toolbar-icon"
                                    title='Discard Changes'
                                    onClick={
                                        () => cancelChanges(currentFile)
                                    }
                                />
                            </div>
                        </div>

                        {this.state.contextMenu}
                    </div>
                </div>
            </div>
        )
    }

    constructor(props) {
        super(props);

        this.state = {
            archive: new FSManager(),
            modName: '',
            orgName: '',
            contextMenu: null,
            popups: [],
            builders: new Map(),
            buttons: [
                {
                    key: "File",
                    id: 'mod_builder_file_menu',
                    value: (
                        <Menu
                            content={
                                [
                                    (
                                        <div
                                            className='menu-button'
                                            onClick={
                                                () => {
                                                    const state = this.state;

                                                    state.archive.setRoot('My_Mod');

                                                    openForgeZip("1.16.5", "36.2.5", state.archive)
                                                        .then(archive => {
                                                            filemod.examplemod(archive)
                                                                .then(o => {
                                                                    state.archive = o.archive;
                                                                    state.modName = o.modName;
                                                                    state.orgName = o.orgName;

                                                                    this.setState(state);
                                                                })
                                                                .catch(err => console.error(err));
                                                        })
                                                        .catch(err => console.error(err));
                                                }
                                            }
                                        >
                                            New Project
                                        </div>
                                    ),
                                    (
                                        <div>
                                            <input
                                                type='file'
                                                id='zip_input'
                                                name='zip_input'
                                                accept='.zip'
                                            />
                                            <button
                                                className='menu-button'
                                                onClick={
                                                    () => {
                                                        const files = document.getElementById('zip_input').files;

                                                        if (files.length === 1) {
                                                            const zip = new JSZip();

                                                            const state = this.state;
                                                            let zipName = files.item(0).name;
                                                            state.archive.setRoot(zipName.slice(0, zipName.length - 4));

                                                            openZip(zip, state.archive, files.item(0))
                                                                .then(archive => {
                                                                    state.archive = archive;
                                                                    this.setState(state);
                                                                })
                                                                .catch(err => console.error(err));
                                                        }
                                                        else {
                                                            console.log('No file selected.');
                                                        }
                                                    }
                                                }
                                            >
                                                Open Project
                                            </button>
                                        </div>
                                    ),
                                    (
                                        <div

                                            className='menu-button'
                                            onClick={
                                                () => {
                                                    const state = this.state;
                                                    state.archive = save(state.archive, currentFile);
                                                    this.setState(state);
                                                }
                                            }
                                        >
                                            Save File
                                        </div>
                                    ),
                                    (
                                        <div

                                            className='menu-button'
                                            onClick={
                                                () => exportZip(this.state.archive)
                                            }
                                        >
                                            Download
                                        </div>
                                    )
                                ]
                            }
                            id='mod_builder_file_menu'
                            hidden={true}
                        />
                    )
                }
            ]
        };

        this.closeContextMenu = this.closeContextMenu.bind(this);
    }
}
