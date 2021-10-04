import React from "react";
import JSZip from 'jszip';
import FSManager from "../app/common/FileSystem";
import { FSDir } from "../app/common/FileSystem";
import Ribbon from './fragments/Ribbon';
import Menu from './fragments/Menu';

import './mod-builder/styles/main.css';
import download from "../app/common/download";

import * as filemod from './mod-builder/scripts/filemod';

import "bootstrap-icons/font/bootstrap-icons.css";
import FileExplorer from "./mod-builder/FileExplorer";

import * as contentBuilder from './mod-builder/scripts/content-builder/content-builder';

const currentFile = {
    file: null,
    fsfile: null,
    path: '',
    text: ''
};

const dev = false;

/**
 * 
 * @param {string} mcVersion 
 * @param {string} forgeVersion 
 * @returns {Promise<JSZip>}
 */
function fetchForgeZip(mcVersion, forgeVersion) {
    return new Promise((resolve, reject) => {
        fetch(dev
            ? `http://localhost:8080/download`
            : `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-mdk.zip`
        )
            .then(response => {
                const zip = new JSZip();

                response.blob()
                    .then(mkd => {
                        zip.loadAsync(mkd)
                            .then(zipped => resolve(zipped))
                            .catch(err => reject(err));
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

export default class ModBuilder extends React.Component {
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
                            className='sect-text-area'
                        >
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
                                            state.archive = rename(state.archive);
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
                                            state.archive = save(state.archive);
                                            this.setState(state);
                                        }
                                    }
                                />
                                <i
                                    id='editor_discard_button'
                                    className="icon bi-x-circle editor-toolbar-icon"
                                    title='Discard Changes'
                                    onClick={
                                        () => cancelChanges()
                                    }
                                />
                            </div>
                        </div>
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
                                                    state.archive = save(state.archive);
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
                },
                {
                    key: "Blocks",
                    id: 'mod_builder_content_blocks_menu',
                    value: (
                        <Menu
                            content={
                                [
                                    (
                                        <div

                                            className='menu-button'
                                            onClick={
                                                () => {
                                                    if (this.state.archive.root === null || this.state.orgName === '' || this.state.modName === '')
                                                        return console.log('Invalid.');

                                                    let state = this.state;

                                                    let name = prompt('Block name', 'my_block') || 'my_block';

                                                    contentBuilder.default.blocks.standard.create(state.archive.fetch(`src/main/java/com/${state.orgName}/${state.modName.toLowerCase()}/ModBlocks.java`), name)
                                                        .then(file => {
                                                            this.setState(state);
                                                        })
                                                        .catch(err => console.error(err));
                                                }
                                            }
                                        >
                                            Create Standard
                                        </div>
                                    )
                                ]
                            }
                            id='mod_builder_content_blocks_menu'
                            hidden={true}
                        />
                    )
                }
            ]
        };
    }
}

/**
 * 
 * @param {FSManager} archive 
 * @returns {FSManager}
 */
function save(archive) {
    const txtArea = document.getElementById('txtArea');

    let v = archive.set(
        currentFile.path,
        currentFile.file.name,
        new File([txtArea.value], currentFile.file.name, { type: currentFile.file.type })
    );

    currentFile.fsfile = v;
    currentFile.file = v.file;
    currentFile.path = v.path();
    currentFile.text = txtArea.value;

    document.getElementById('editor_save_button').classList.remove('icon-active');
    document.getElementById('editor_discard_button').classList.remove('icon-active');

    return archive;
}

function rename(archive) {
    const name = document.getElementById('text_area_file_name').value;

    let newFile = currentFile.fsfile.dir.addFile(name, new File([currentFile.file], name, { type: currentFile.file.type }), currentFile.path);

    currentFile.fsfile.dir.deleteFile(currentFile.file.name);

    currentFile.file = newFile.file;
    currentFile.fsfile = newFile;

    return archive;
}

function cancelChanges() {
    document.getElementById('txtArea').value = currentFile.text;

    document.getElementById('editor_save_button').classList.remove('icon-active');
    document.getElementById('editor_discard_button').classList.remove('icon-active');
}

/**
 * 
 * @param {FSManager} archive 
 */
function exportZip(archive) {
    archive.compress()
        .then(zip => {
            download(archive.root.name + '.zip', zip);
        })
        .catch(err => console.error(err));
}

function openZip(zip, archive, blob) {
    return new Promise((resolve, reject) => {
        zip.loadAsync(blob)
            .then(async (zipped) => {
                let i, file, path, fileName;

                for (i in zipped.files) {
                    let d = archive.root;

                    file = zipped.file(i);
                    path = i.split('/');
                    fileName = path.pop();

                    // If file === null, the item is a dir.

                    if (fileName !== '') {
                        path.forEach(v => {
                            if (d === null) {
                                archive.root = new FSDir(v);
                                d = archive.root;
                            }
                            else if (d.contains(v))
                                d = d.getDir(v);
                            else {
                                d = d.addDir(v);
                            }
                        });

                        d.addFile(
                            fileName,
                            new File([await file.async('blob')], fileName),
                            path.join('/')
                        );
                    }
                }

                resolve(archive);
            })
            .catch(err => reject(err));
    });
}

function openForgeZip(mcVersion, forgeVersion, archive) {
    return new Promise((resolve, reject) => {
        fetchForgeZip(mcVersion, forgeVersion, archive)
            .then(async (zipped) => {
                let i, file, path, fileName;

                for (i in zipped.files) {
                    let d = archive.root;

                    file = zipped.file(i);
                    path = i.split('/');
                    fileName = path.pop();

                    // If file === null, the item is a dir.

                    if (fileName !== '') {
                        path.forEach(v => {
                            if (d === null) {
                                archive.root = new FSDir(v);
                                d = archive.root;
                            }
                            else if (d.contains(v))
                                d = d.getDir(v);
                            else {
                                d = d.addDir(v);
                            }
                        });

                        d.addFile(
                            fileName,
                            new File([await file.async('blob')], fileName),
                            path.join('/')
                        );
                    }
                }

                resolve(archive);
            })
            .catch(err => reject(err));
    });
}