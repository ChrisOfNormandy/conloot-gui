import React from "react";
import JSZip from 'jszip';
import FSManager from "../app/common/FileSystem";
import { FSDir, FSFile } from "../app/common/FileSystem";
import Ribbon from './fragments/Ribbon';
import Menu from './fragments/Menu';

import './mod-builder/styles/main.css';
import { uniqueId } from "lodash";
import download from "../app/common/download";

import "bootstrap-icons/font/bootstrap-icons.css";

let currentFile = {
    file: null,
    path: '',
    text: ''
};

/**
 * 
 * @param {FSFile} f 
 * @returns 
 */
function createFileObj(f) {
    return (
        <li
            id={f.name}
            className='file-explorer-list-item file-explorer-file-label'
            title={`${f.name} | Size: ${f.file.size} bytes.`}
            onClick={
                () => {
                    f.file.text()
                        .then(v => {
                            const ta = document.getElementById('txtArea');

                            if (ta.value === '' || currentFile.file === null || ta.value === currentFile.text) {
                                ta.value = v;

                                currentFile.file = f.file;
                                currentFile.path = f.path;
                                currentFile.text = v.replace(/\r\n/g, '\n');
                            }
                            else
                                console.log('Unsaved changes.');
                        })
                        .catch(err => console.error(err));
                }
            }
        >
            {f.name}
        </li>
    )
}

/**
 * 
 * @param {FSDir} dir 
 * @returns 
 */
function createFileList(dir) {
    if (dir === null)
        return;

    if (!!dir.content) {
        let arr = [];

        for (let i in dir.content) {
            if (!!dir.content[i].content) {
                let id = uniqueId();

                arr.push(
                    (
                        <li
                            className='file-explorer-list-item'
                        >
                            <div
                                className='file-explorer-dir-label'
                                onClick={
                                    () => {
                                        document.getElementById(id).classList.toggle('hidden');
                                    }
                                }
                            >
                                {i}
                            </div>
                            <div
                                id={id}
                                className='file-explorer-dir-group hidden'
                            >
                                {createFileList(dir.content[i])}
                            </div>
                        </li>
                    )
                );
            }
            else
                arr.push(createFileObj(dir.content[i]));
        }

        return (
            <ul className='file-explorer-list'>
                {arr.map(v => v)}
            </ul>
        )
    }

    return (
        <li
            className='file-explorer-list-item'
        >
            {createFileObj(dir)}
        </li>
    );
}

/**
 * 
 * @param {string} mcVersion 
 * @param {string} forgeVersion 
 * @returns {Promise<JSZip>}
 */
function fetchForgeZip(mcVersion, forgeVersion) {
    return new Promise((resolve, reject) => {
        fetch(`https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-mdk.zip`)
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

    componentDidMount() {
        const main = document.getElementById('sect_main');
        const fileExpl = document.getElementById('sect_file_explorer');

        fileExpl.style.maxHeight = `${main.clientHeight}px`;
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
                                className='sect-file-explorer-list'
                                id='sect_file_explorer_list'
                            >
                                {createFileList(this.state.archive.root)}
                            </div>
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
                                    title='Discard changes'
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
                                                            state.archive = archive;
                                                            this.setState(state);
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

    let v = archive.set(currentFile.path, currentFile.file.name, new File([txtArea.value], currentFile.file.name, { type: currentFile.file.type }));

    currentFile.file = v.file;
    currentFile.path = v.path;
    currentFile.text = txtArea.value;

    document.getElementById('editor_save_button').classList.remove('icon-active');
    document.getElementById('editor_discard_button').classList.remove('icon-active');

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
                let i, d, file, path, fileName;

                for (i in zipped.files) {
                    d = archive.root;

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
                            else if (d.exists(v))
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
                let i, d, file, path, fileName;

                for (i in zipped.files) {
                    d = archive.root;

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
                            else if (d.exists(v))
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