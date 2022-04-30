import React from 'react';
import JSZip from 'jszip';
import Builder from './builders/Builder';
import Ribbon from '../../fragments/ribbons/Ribbon';
import FSManager from '../../common/file-system/FSManager';
import VertRibbon from '../../fragments/ribbons/VertRibbon';
import PopupManager from '../../fragments/popups/PopupManager';
import FileExplorer from './components/archive-handling/FileExplorer';
import BlockPreview from './components/content-builder/block/BlockPreview';

import { save, rename, cancelChanges, exportZip, openZip, openForgeZip } from './components/archive-handling/archive';

import * as filemod from './writer/filemod';
import * as FileWriter from './writer/writers';

import './styles/mod-builder.css';
import './styles/block-preview.css';
import './styles/content-popup.css';

function formatRegName(str) {
    return str.split('_').map((s) => {
        return s[0]
            ? (s[0].toUpperCase() + s.slice(1, s.length))
            : '';
    }).join(' ');
}

function formatName(str) {
    return str.toLowerCase().replace(/\s/g, '_');
}

export default class ModBuilder extends React.Component {

    /**
     *
     * @param {string} groupName
     * @param {string} popupName
     * @param {JSX.Element} body
     */
    addPopup(groupName, popupName, body = null) {
        let group = this.popupGroups.get(groupName);

        if (group === undefined) {
            group = {
                name: groupName,
                popups: new Map(),
                open: true
            };
            this.popupGroups.set(groupName, group);
        }

        const reload = this.reload.bind(this);
        const closeGroup = () => {
            this.popupGroups.delete(groupName);
        };

        const popup = {
            title: popupName,
            body,
            open: true,
            onMinimize() {
                let c = 0;
                group.popups.forEach((popup) => {
                    if (popup.open)
                        c++;
                });

                if (c > 1)
                    group.popups.get(popupName).open = false;
                else
                    group.open = false;

                reload();
            },
            onClose() {
                group.popups.delete(popupName);

                if (!group.popups.size)
                    closeGroup();

                reload();
            }
        };

        group.popups.set(popupName, popup);

        this.reload();
    }

    blockBuilder(groupName, defaultValue) {
        return (
            <div
                className='content-popup-body column'
            >
                <BlockPreview />

                <form
                    className='content-popup-form'
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                        }
                    }
                >
                    <div
                        className='content-popup-form-row'
                    >
                        <label
                            className='content-popup-form-label'
                            htmlFor={`block_name_input_${groupName}`}
                        >
                            Block Name
                        </label>

                        <input
                            type='text'
                            id={`block_name_input_${groupName}`}
                            name={`block_name_input_${groupName}`}
                            className='content-popup-form-input'
                            placeholder='Block Name'
                            defaultValue={formatRegName(defaultValue)}
                            onChange={
                                (e) => {
                                    document.getElementById(`block_registry_input_${groupName}`).value = formatName(e.target.value);
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

                    <div
                        className='content-popup-form-row'
                    >
                        <label
                            className='content-popup-form-label'
                            htmlFor={`block_registry_input_${groupName}`}
                        >
                            Registry Name
                        </label>

                        <input
                            type='text'
                            id={`block_registry_input_${groupName}`}
                            name={`block_registry_input_${groupName}`}
                            className='content-popup-form-input'
                            placeholder='Registry Name'
                            defaultValue={formatName(defaultValue)}
                            onChange={
                                (e) => {
                                    document.getElementById(`block_name_input_${groupName}`).value = formatRegName(e.target.value);
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

                    <div
                        className='content-popup-form-row'
                    >
                        <button
                            className='content-popup-form-button'
                            onClick={
                                () => {
                                    this.addPopup(groupName, 'Properties', this.blockProperties(groupName));
                                }
                            }
                        >
                            Edit Properties
                        </button>
                    </div>
                    <div
                        className='content-popup-form-row'
                    >
                        <button
                            className='content-popup-form-button'
                            onClick={
                                () => {

                                }
                            }
                        >
                            Resource Pack
                        </button>

                        <button
                            className='content-popup-form-button'
                            onClick={
                                () => {

                                }
                            }
                        >
                            Data Pack
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    blockProperties(groupName) {
        console.log(groupName, this.builder.blocks);

        let properties = this.builder.blocks.get(groupName).properties.values;

        const getType = (key) => this.builder.blocks.get(groupName).properties.values[key].type;

        const booleans = [];
        const texts = [];

        for (let key in properties) {
            if (properties[key].type === 'boolean')
                booleans.push(key);
            else
                texts.push(key);
        }

        const Section = ({ keys }) => (
            <form className='content-popup-form'>
                {
                    keys.map((key, i) => (
                        <div
                            key={i}
                            className='content-popup-form-row'
                        >
                            <label
                                className='content-popup-form-label'
                                htmlFor='block_property_input_a'
                            >
                                {key}
                            </label>

                            <input
                                id={`block_property_input_${key}`}
                                name='block_property_input_a'
                                className='content-popup-form-input'
                                type={
                                    getType(key) === 'number'
                                        ? 'number'
                                        : getType(key) === 'boolean'
                                            ? 'checkbox'
                                            : 'text'
                                }
                                placeholder={key}
                                defaultValue={properties[key].value}
                                onKeyPress={
                                    (e) => {
                                        if (!/[a-z0-9-_]/.test(e.key))
                                            e.preventDefault();
                                    }
                                }
                                onChange={
                                    (e) => {
                                        let property = this.builder.blocks.get(groupName).properties.values[key];

                                        if (property.type !== 'boolean')
                                            property.value = e.target.value;
                                        else
                                            property.value = e.target.checked;
                                    }
                                }
                            />

                            {
                                properties[key].value !== null
                                    ? (
                                        <i
                                            className='icon bi bi-info content-popup-icon'
                                            title={properties[key].toString()}
                                        />
                                    )
                                    : (
                                        <i
                                            className='icon bi bi-info content-popup-icon'
                                            title={properties[key].type}
                                        />
                                    )
                            }
                        </div>
                    ))
                }
            </form>
        );

        return (
            <div className='content-popup-body row'>
                <Section keys={booleans} />
                <Section keys={texts} />
            </div>
        );
    }

    reload(full = false) {
        let state = this.state;

        if (full && window.location.search.slice(1).split('&').includes('dev=true')) {
            this.archive.setRoot('My_Mod');

            openForgeZip('1.18.2', '40.1.0', this.archive)
                .then((archive) => {
                    filemod.examplemod(archive, true)
                        .then((o) => {
                            state.archive = o.archive;
                            state.modName = o.modName;
                            state.orgName = o.orgName;

                            this.builder = new Builder(state.orgName, state.modName);

                            this.setState(state);
                        })
                        .catch((err) => console.error(err));
                })
                .catch((err) => console.error(err));
        }

        this.setState(state);
    }

    componentDidMount() {
        this.reload(true);
    }

    render() {
        return (
            <div
                className='sect-container'
            >
                <Ribbon
                    content={this.ribbonOptions}
                />

                <div
                    id='mod_builder'
                    className='mod-builder'
                >
                    <FileExplorer
                        archive={this.archive}
                        currentFile={this.current}
                    />

                    <div
                        className='mod-builder-text-area-container'
                    >
                        {
                            <PopupManager
                                map={this.popupGroups}
                            />
                        }

                        <textarea
                            id='txtArea'
                            className='mod-builder-text-editor'
                            onChange={
                                (e) => {
                                    if (this.current.file !== null && e.target.value !== this.current.text) {
                                        document.getElementById('editor_save_button').classList.add('active');
                                        document.getElementById('editor_discard_button').classList.add('active');
                                    }
                                    else if (e.target.value === this.current.text) {
                                        document.getElementById('editor_save_button').classList.remove('active');
                                        document.getElementById('editor_discard_button').classList.remove('active');
                                    }
                                }
                            }
                        />

                        <div
                            className='text-area-toolbar'
                        >
                            <label
                                htmlFor='fileName'>
                                File name:
                            </label>
                            <input
                                type='text'
                                name='fileName'
                                id='text_area_file_name'
                                onKeyPress={
                                    (e) => {
                                        if (this.current.file === null)
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
                                        if (this.current.file === null)
                                            return;

                                        const state = this.state;
                                        state.archive = rename(state.archive, this.current);
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
                                        state.archive = save(state.archive, this.current);
                                        this.setState(state);
                                    }
                                }
                            />

                            <i
                                id='editor_discard_button'
                                className="icon bi-x-circle editor-toolbar-icon"
                                title='Discard Changes'
                                onClick={
                                    () => cancelChanges(this.current)
                                }
                            />
                        </div>
                    </div>

                    {
                        this.builder !== null
                            ? (
                                <VertRibbon
                                    content={this.getVerticalRibbonContent()}
                                />
                            )
                            : null
                    }

                    {this.state.contextMenu}
                </div>
            </div>
        );
    }

    getVerticalRibbonContent() {
        const addBlock = () => {
            let blockName = 'new_block';
            let i = 1;
            while (this.builder.blocks.has(blockName)) {
                blockName = `new_block_${i}`;
                i++;
            }

            this.addPopup(blockName, 'Builder', this.blockBuilder(blockName, blockName));
            this.builder.addBlock(blockName);
        };
        const getBlocks = () => this.builder.getAllBlocks();
        const writeBlocks = () => {
            const filePath = this.builder.getBlockPath();
            const file = this.archive.fetch(filePath);
            const arr = Array.from(this.builder.getAllBlocks().values()).map((b) => b.toString());

            FileWriter.write(file, arr)
                .then(() => console.log('Success'))
                .catch((err) => console.error(err));
        };
        const addPopup = (name) => {
            this.addPopup(name, 'Builder', this.blockBuilder(name, name));
        };

        return [
            {
                id: 'content_list',
                icon: 'list-ul',
                title: 'List',
                menuContent: [
                    {
                        text: 'Blocks',
                        onClick() {
                            console.log(getBlocks());
                        }
                    },
                    {
                        text: 'Write Blocks',
                        onClick() {
                            writeBlocks();
                        }
                    }
                ]
            },
            {
                id: 'content_block',
                icon: 'box',
                title: 'Block',
                menuContent: [
                    {
                        text: 'Standard',
                        onClick() {
                            console.log('New Block');
                            addBlock();
                        }
                    },
                    {
                        text: 'Example 2',
                        onClick() {
                            console.log('New Block');
                        }
                    },
                    {
                        text: 'Example 3',
                        onClick() {
                            console.log('New Block');
                        }
                    }
                ],
                contextMenuContent: Array.from(this.builder.blocks.values()).map((block) => (
                    {
                        text: block.name,
                        onClick() {
                            addPopup(block.name);
                        }
                    }
                ))
            },
            {
                id: 'content_plant',
                icon: 'flower2',
                title: 'Plant',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Plant');
                        }
                    }
                ]
            },
            {
                id: 'content_resource',
                icon: 'gem',
                title: 'Resource',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Resource');
                        }
                    }
                ]
            },
            {
                id: 'content_worldgen',
                icon: 'globe2',
                title: 'Feature',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Feature');
                        }
                    }
                ]
            },
            {
                id: 'content_item',
                icon: 'trophy',
                title: 'Item',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Item');
                        }
                    }
                ]
            },
            {
                id: 'content_tool',
                icon: 'tools',
                title: 'Tool / Weapon',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Tool / Weapon');
                        }
                    }
                ]
            },
            {
                id: 'content_consumable',
                icon: 'cup-straw',
                title: 'Consumable',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Consumable');
                        }
                    }
                ]
            },
            {
                id: 'content_fluid',
                icon: 'droplet',
                title: 'Fluid',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Fluid');
                        }
                    }
                ]
            },
            {
                id: 'content_entity',
                icon: 'egg',
                title: 'Entity',
                menuContent: [
                    {
                        text: 'Example',
                        onClick() {
                            console.log('New Entity');
                        }
                    }
                ]
            }
        ];
    }

    constructor(props) {
        super(props);

        this.archive = new FSManager();
        /**
         * @type {Builder}
         */
        this.builder = null;

        this.current = {
            file: null,
            fsfile: null,
            path: '',
            text: ''
        };

        const fileOptions = {
            download() {
                exportZip(this.archive);
                this.reload();
            }
        };

        this.ribbonOptions = [
            {
                id: 'option_file',
                text: 'File',
                menuContent: [
                    {
                        text: 'New Project',
                        onClick() {
                            const state = this.state;

                            this.archive.setRoot('My_Mod');

                            openForgeZip('1.18.2', '40.1.0', this.archive)
                                .then((archive) => {
                                    filemod.examplemod(archive)
                                        .then((o) => {
                                            state.archive = o.archive;
                                            state.modName = o.modName;
                                            state.orgName = o.orgName;

                                            this.setState(state);
                                        })
                                        .catch((err) => console.error(err));
                                })
                                .catch((err) => console.error(err));
                        }
                    },
                    {
                        text: 'Open Project',
                        body: (
                            <input
                                type='file'
                                id='zip_input'
                                name='zip_input'
                                accept='.zip'
                            />
                        ),
                        onClick() {
                            const files = document.getElementById('zip_input').files;

                            if (files.length === 1) {
                                const zip = new JSZip();

                                const state = this.state;
                                let zipName = files.item(0).name;
                                state.archive.setRoot(zipName.slice(0, zipName.length - 4));

                                openZip(zip, state.archive, files.item(0))
                                    .then((archive) => {
                                        state.archive = archive;
                                        this.setState(state);
                                    })
                                    .catch((err) => console.error(err));
                            }
                            else {
                                console.log('No file selected.');
                            }
                        }
                    },
                    {
                        text: 'Save File',
                        onClick() {
                            this.archive = save(this.archive, this.current);
                            this.reload();
                        }
                    },
                    {
                        text: 'Download',
                        onClick: fileOptions.download.bind(this)
                    }
                ]
            }
        ];

        this.state = {
            modName: '',
            orgName: ''
        };

        /**
         * @type {Map<string, {name: string, popups: Map<string, *>}}
         */
        this.popupGroups = new Map();

        this.reload = this.reload.bind(this);
    }
}
