import React from 'react';
import JSZip from 'jszip';
import editor from './editor';
import Ribbon from '../../fragments/ribbons/Ribbon';
import FSManager from '../../common/file-system/FSManager';
import VertRibbon from '../../fragments/ribbons/VertRibbon';
import PopupManager from '../../fragments/popups/PopupManager';
import FileExplorer from './components/archive-handling/FileExplorer';
import BlockPreview from './components/content-builder/block/BlockPreview';

import { save, rename, cancelChanges, exportZip, openZip, openForgeZip, openLibraryZip } from './components/archive-handling/archive';

import * as filemod from './writer/filemod';
import * as FileWriter from './writer/writers';

import './styles/mod-builder.css';
import './styles/block-preview.css';
import './styles/content-popup.css';
import { langEnUS } from './writer/files/base/lang_en-us';
import { blockstate } from './writer/files/base/blockstate';
import { blockItemModel, blockModel } from './writer/files/base/model';
import { blockLootTable } from './writer/files/base/loot-table';

/**
 *
 * @param {*} str
 * @returns
 */
function formatRegName(str) {
    return str.split('_').map((s) => {
        return s[0]
            ? s[0].toUpperCase() + s.slice(1, s.length)
            : '';
    }).join(' ');
}

/**
 *
 * @param {*} str
 * @returns
 */
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

    /**
     *
     * @param {*} groupName
     * @param {*} defaultValue
     * @returns
     */
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

    /**
     *
     * @param {*} groupName
     * @returns
     */
    // eslint-disable-next-line class-methods-use-this
    blockProperties(groupName) {
        let properties = editor.builder.blocks.get(groupName).properties.values;

        const getType = (param) => {
            if (/class_/.test(param.type))
                return {
                    type: 'text',
                    disabled: true
                };

            if (param.type === 'float')
                return {
                    type: 'number',
                    min: 0,
                    defaultValue: param.default || 0
                };

            return {
                type: 'text'
            };
        };

        const booleans = [];
        const texts = [];

        for (let key in properties) {
            if (properties[key].type === 'boolean')
                booleans.push(key);
            else
                texts.push(key);
        }

        const Section = ({ keys }) =>
            <form className='content-popup-form'>
                {
                    keys.map((key, i) =>
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

                            {
                                properties[key].params.length
                                    ? <div
                                        className='property-bundle'
                                    >
                                        {
                                            properties[key].params.map((param, i) =>
                                                <span
                                                    key={i}
                                                    className='property-row'
                                                >
                                                    <input
                                                        id={`block_property_input_${key}`}
                                                        name='block_property_input_a'
                                                        className='content-popup-form-input'
                                                        {...getType(param)}
                                                        placeholder={param.type}
                                                        onKeyPress={
                                                            (e) => {
                                                                if (!/[a-z0-9-_]/.test(e.key))
                                                                    e.preventDefault();
                                                            }
                                                        }
                                                        onChange={
                                                            (e) => {
                                                                let property = editor.builder.blocks.get(groupName).properties.values[key];

                                                                property.enabled = true;

                                                                param.value = e.target.value;
                                                            }
                                                        }
                                                    />

                                                    <button
                                                        onClick={
                                                            () => {
                                                                let property = editor.builder.blocks.get(groupName).properties.values[key];

                                                                property.enabled = false;
                                                            }
                                                        }
                                                    >
                                                        <i
                                                            className='icon bi bi-x-lg'
                                                        />
                                                    </button>
                                                </span>
                                            )
                                        }
                                    </div>
                                    : <input
                                        key={i}
                                        id={`block_property_input_${key}`}
                                        name='block_property_input_a'
                                        className='content-popup-form-input'
                                        type='checkbox'
                                        onChange={
                                            (e) => {
                                                let property = editor.builder.blocks.get(groupName).properties.values[key];

                                                property.enabled = e.target.checked;
                                            }
                                        }
                                    />
                            }

                            {
                                properties[key].tip
                                    ? <i
                                        className='icon bi bi-info content-popup-icon'
                                        title={properties[key].tip}
                                    />
                                    : null
                            }
                        </div>
                    )
                }
            </form>;

        return (
            <div className='content-popup-body row'>
                <Section keys={booleans} />
                <Section keys={texts} />
            </div>
        );
    }

    loadProject(gameVersion, forgeVersion, libraryVersion) {
        return new Promise((resolve, reject) => {
            openForgeZip(gameVersion, forgeVersion, this.archive)
                .then((archive) => {
                    openLibraryZip(gameVersion, libraryVersion, archive)
                        .then((archive) => {
                            // const src_main_java_com = archive.fetchDir('src/main/java/com');
                            // archive.fetchDir('CoNLib-1.8-MC_1.18.2/src/main/java/com/github')
                            //     .moveTo(src_main_java_com);

                            const lib = archive.fetch('CoNLib-1.8-MC_1.18.2/com/github/chrisofnormandy/conlib/1.8/conlib-1.8-deobf.jar');
                            lib.moveTo(archive.root.addDir('libs'));

                            archive.root.deleteDir('CoNLib-1.8-MC_1.18.2');

                            filemod.examplemod(archive, true)
                                .then((o) => {
                                    let state = this.state;

                                    state.archive = o.archive;
                                    state.modName = o.modName;
                                    state.orgName = o.orgName;

                                    this.setState(state, () => {
                                        resolve(archive);
                                    });
                                })
                                .catch(reject);
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    /**
     *
     * @param {*} full
     */
    reload(full = false) {
        let state = this.state;

        if (full && this.archive.root === null && window.location.search
            .slice(1)
            .split('&')
            .includes('dev=true')
        ) {
            this.archive.setRoot('My_Mod');

            this.loadProject('1.18.2', '40.1.0', '1.8')
                .then(console.debug)
                .catch(console.error);
        }
        else
            this.setState(state);
    }

    loadCodeToEditor(code) {
        let state = this.state;
        state.code = code;
        console.debug(code);

        this.setState(state);
    }

    getCodeFromEditor() {
        return this.state.code;
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
                        loadCodeToEditor={this.loadCodeToEditor}
                        getCodeFromEditor={this.getCodeFromEditor}
                    />

                    <div
                        className='mod-builder-text-area-container'
                    >
                        {
                            <PopupManager
                                map={this.popupGroups}
                            />
                        }

                        {
                            this.current.fsfile !== null
                                ? editor.createCodeEditor(this.state.code, this.current.fsfile.extname())
                                : null
                        }

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
                                className='icon bi-arrow-return-right editor-toolbar-icon icon-active'
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
                                className='icon bi-save editor-toolbar-icon'
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
                                className='icon bi-x-circle editor-toolbar-icon'
                                title='Discard Changes'
                                onClick={
                                    () => cancelChanges(this.current)
                                }
                            />
                        </div>
                    </div>

                    {
                        editor.builder !== null
                            ? <VertRibbon
                                content={this.getVerticalRibbonContent()}
                            />
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
            while (editor.builder.blocks.has(blockName)) {
                blockName = `new_block_${i}`;
                i++;
            }

            this.addPopup(blockName, 'Builder', this.blockBuilder(blockName, blockName));
            editor.builder.addBlock(blockName);
        };

        const getBlocks = () => editor.builder.getAllBlocks();

        const writeBlocks = () => {
            const filePath = editor.builder.getBlockPath();
            const file = this.archive.fetch(filePath);

            const blockList = editor.builder.getBlockArray();

            FileWriter.write(file, blockList)
                .then(() => {
                    langEnUS(this.archive, editor.organization, editor.modName, JSON.stringify(editor.getLang(), null, 4))
                        .then((archive) => {
                            console.debug('Finished writing shared asset files.');

                            const iterate = (archive, i = 0) => {
                                if (i >= blockList.length)
                                    return Promise.resolve(archive);

                                return new Promise((resolve, reject) => {
                                    blockstate(archive, blockList[i].name, 'minecraft', 'deepslate')
                                        .then((a) => {
                                            blockModel(a, blockList[i].name, 'minecraft', 'deepslate')
                                                .then((a) => {
                                                    blockItemModel(a, blockList[i].name)
                                                        .then(() => {
                                                            blockLootTable(a, blockList[i].name, { namespace: 'minecraft', blockName: 'sponge' })
                                                                .then((a) => iterate(a, i + 1).then(resolve).catch(reject))
                                                                .catch(reject);
                                                        })
                                                        .catch(reject);
                                                })
                                                .catch(reject);
                                        })
                                        .catch(reject);
                                });
                            };

                            iterate(archive)
                                .then(console.debug)
                                .catch(console.error);
                        })
                        .catch(console.error);

                })
                .catch(console.error);
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
                    // {
                    //     text: 'Example 2',
                    //     onClick() {
                    //         console.log('New Block');
                    //     }
                    // },
                    // {
                    //     text: 'Example 3',
                    //     onClick() {
                    //         console.log('New Block');
                    //     }
                    // }
                ],
                contextMenuContent: Array.from(editor.builder.blocks.values()).map((block) => (
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
        editor.builder = null;

        this.current = {
            /**
             * @type {File}
             */
            file: null,
            /**
             * @type {import('../../common/file-system/FSFile').default}
             */
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

        /**
         *
         */
        const downloadProject = () => {
            this.archive.setRoot('My_Mod');

            this.loadProject('1.18.2', '40.1.0', '1.8')
                .then(console.debug)
                .catch(console.error);
        };

        const openProject = () => {
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
        };

        const saveFile = () => {
            this.archive = save(this.archive, this.current);
            this.reload();
        };

        this.ribbonOptions = [
            {
                id: 'option_file',
                text: 'File',
                menuContent: [
                    {
                        text: 'New Project',
                        onClick() {
                            downloadProject();
                        }
                    },
                    {
                        text: 'Open Project',
                        body:
                            <input
                                type='file'
                                id='zip_input'
                                name='zip_input'
                                accept='.zip'
                            />
                        ,
                        onClick() {
                            openProject();
                        }
                    },
                    {
                        text: 'Save File',
                        onClick() {
                            saveFile();
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
            orgName: '',
            code: ''
        };

        /**
         * @type {Map<string, {name: string, popups: Map<string, *>}}
         */
        this.popupGroups = new Map();

        this.reload = this.reload.bind(this);
        this.loadCodeToEditor = this.loadCodeToEditor.bind(this);
        this.getCodeFromEditor = this.getCodeFromEditor.bind(this);
    }
}
