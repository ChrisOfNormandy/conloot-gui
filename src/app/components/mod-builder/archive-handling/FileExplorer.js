/* eslint-disable react/prop-types */
import React from 'react';
import ContextMenu from '../../../fragments/ContextMenu';

import { uniqueId } from 'lodash';

import './styles/file-explorer.css';

let dirTracker = {};

function onDragOver(event) {
    event.preventDefault();
}

function onDragLeave(event) {
    event.preventDefault();
}

export default class FileExplorer extends React.Component {

    /**
     *
     * @param {React.DragEvent<HTMLLIElement>} event
     * @param {FSDir} dir
     */
    dropHandler(event, dir) {
        event.preventDefault();
        event.stopPropagation();

        const handleFileAppend = async () => {
            let state = this.state;

            let files = [];

            if (event.dataTransfer.items.length) {
                for (let i in event.dataTransfer.items) {
                    const item = event.dataTransfer.items[i];

                    if (item.kind === 'file')
                        files.push(item.getAsFile());
                }
            }
            else {
                for (let i in event.dataTransfer.files) {
                    const file = event.dataTransfer.files[i];

                    if (file.kind === 'file')
                        files.push(file);
                }
            }

            files.forEach((f) => dir.addFile(f.name, f));

            this.setState(state);
        };

        handleFileAppend();
    }

    /**
     *
     * @param {FSDir} folder
     * @returns {JSX.Element[]}
     */
    folderCtxMenu(folder) {
        return [
            {
                action: () => {
                    let name = prompt('File name', 'new-file.txt') || 'new-file.txt';
                    folder.addFile(name, new File([], name));
                    this.setState(this.state);
                },
                markup:
                    (
                        <div>
                            New File
                        </div>
                    )
            },
            {
                action: () => {
                    let name = prompt('Folder name', 'New Folder') || 'New Folder';
                    folder.addDir(name);
                    this.setState(this.state);
                },
                markup:
                    (
                        <div>
                            New Folder
                        </div>
                    )
            }
        ];
    }

    /**
     *
     * @param {FSFile} file
     * @returns {JSX.Element[]}
     */
    fileCtxMenu(file) {
        return [
            {
                action: () => {
                    let name = prompt('File name', file.name) || file.name;
                    file.rename(name);
                    this.setState(this.state);
                },
                markup: (
                    <div>
                        Rename
                    </div>
                )
            }
        ];
    }

    /**
     *
     * @param {FSFile} file
     * @returns
     */
    createFileObj(f) {
        return (
            <li
                id={f.name}
                key={f.name}
                className='filex-list-item file'
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={
                    (e) => this.dropHandler(e, f.dir)
                }
            >
                <div
                    className='filex-row'
                >
                    <span
                        className='filex-label'
                        title={
                            `${f.path()} | Size: ${f.file.size < 1024
                                ? f.file.size + 'B'
                                : f.file.size / 1024 < 1024
                                    ? (f.file.size / 1024).toFixed(2) + 'KB'
                                    : (f.file.size / (1024 * 1024)).toFixed(2) + 'MB'
                            }`
                        }
                        onClick={
                            () => {
                                f.file.text()
                                    .then((v) => {
                                        const ta = document.getElementById('txtArea');
                                        const state = this.state;

                                        if (ta.value === '' || state.currentFile.file === null || ta.value === state.currentFile.text) {
                                            ta.value = v;

                                            state.currentFile.fsfile = f;
                                            state.currentFile.file = f.file;
                                            state.currentFile.path = f.path();
                                            state.currentFile.text = v.replace(/\r\n/g, '\n');

                                            document.getElementById('text_area_file_name').value = f.file.name;

                                            this.setState(state);
                                        }
                                        else
                                            console.log('Unsaved changes.');
                                    })
                                    .catch((err) => console.error(err));

                            }
                        }
                        onContextMenu={
                            (e) => {
                                e.preventDefault();
                                const state = this.state;
                                state.contextMenu = (
                                    <ContextMenu
                                        position={
                                            {
                                                x: e.clientX,
                                                y: e.clientY
                                            }
                                        }
                                        menuItems={this.fileCtxMenu(f)}
                                    />
                                );
                                this.setState(state);
                            }
                        }
                    >
                        {f.name}
                    </span>

                    <div
                        className='filex-options file'
                    >
                        <i
                            id={`${f.name}_delete_button`}
                            className="icon bi bi-file-earmark-x filex-icon"
                            title='Delete'
                            onClick={
                                () => {
                                    const state = this.state;
                                    f.dir.deleteFile(f.name);
                                    this.setState(state);
                                }
                            }
                        />
                    </div>
                </div>
            </li>
        );
    }

    /**
     *
     * @param {FSDir} dir
     * @returns
     */
    createFileList(dir) {
        if (dir === null)
            return;

        if (dir.content) {
            let arr = [];

            for (let i in dir.content) {
                if (dir.content[i].content) {
                    let id = uniqueId();

                    if (dirTracker[id] === undefined)
                        dirTracker[id] = false;

                    arr.push(
                        (
                            <li
                                className='filex-list-item dir'
                                key={id}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onDrop={
                                    (e) => this.dropHandler(e, dir.content[i])
                                }
                            >
                                <div
                                    className='filex-row'
                                >
                                    <span
                                        className='filex-label'
                                        onClick={
                                            () => {
                                                let v = document.getElementById(id);
                                                v.classList.toggle('hidden');
                                                dirTracker[id] = v.classList.contains('hidden');
                                            }
                                        }
                                        onContextMenu={
                                            (e) => {
                                                e.preventDefault();
                                                const state = this.state;
                                                state.contextMenu = (
                                                    <ContextMenu
                                                        position={
                                                            {
                                                                x: e.clientX,
                                                                y: e.clientY
                                                            }
                                                        }
                                                        menuItems={this.folderCtxMenu(dir.content[i])}
                                                    />
                                                );
                                                this.setState(state);
                                            }
                                        }
                                    >
                                        {i}
                                    </span>

                                    <div
                                        className='filex-options dir'
                                    >
                                        <i
                                            id={`${id}_new_file_button`}
                                            className="icon bi bi-file-earmark-plus filex-icon"
                                            title='New File'
                                            onClick={
                                                () => {
                                                    const state = this.state;
                                                    dir.content[i].addFile(
                                                        'new-file.txt',
                                                        new File([], 'new-file.txt')
                                                    );
                                                    this.setState(state);
                                                }
                                            }
                                        />

                                        <i
                                            id={`${id}_new_folder_button`}
                                            className="icon bi bi-folder-plus filex-icon"
                                            title='New Folder'
                                            onClick={
                                                () => {
                                                    const state = this.state;
                                                    dir.content[i].addDir('new-folder');
                                                    this.setState(state);
                                                }
                                            }
                                        />

                                        <i
                                            id={`${id}_delete_button`}
                                            className="icon bi bi-folder-x filex-icon"
                                            title='Delete'
                                            onClick={
                                                () => {
                                                    const state = this.state;
                                                    dir.deleteDir(i);
                                                    this.setState(state);
                                                }
                                            }
                                        />
                                    </div>
                                </div>

                                <div
                                    id={id}
                                >
                                    {this.createFileList(dir.content[i])}
                                </div>
                            </li>
                        )
                    );
                }
                else
                    arr.push(this.createFileObj(dir.content[i]));
            }

            return (
                <ul
                    className='filex-list'
                >
                    {
                        arr.map((v) => v)
                    }
                </ul>
            );
        }

        return (
            <li
                className='filex-list-item'
            >
                {this.createFileObj(dir)}
            </li>
        );
    }

    render() {
        return (
            <div
                className='filex-container'
            >
                <div
                    className='filex-ribbon'
                >
                    <i
                        id='editor_new_file_button'
                        className="icon bi bi-file-earmark-plus filex-icon"
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

                <div
                    id='file_explorer_list'
                    className='filex-list-wrapper'
                    onClick={
                        () => {
                            if (this.state.contextMenu !== null) {
                                let state = this.state;
                                state.contextMenu = null;
                                this.setState(state);
                            }
                        }
                    }
                    onDrop={
                        (e) => {
                            this.dropHandler(e, this.state.archive.root);
                        }
                    }
                >
                    {this.createFileList(this.state.archive.root)}

                    {this.state.contextMenu}
                </div>
            </div>
        );
    }

    constructor(props) {
        super(props);

        /**
         * @type {{archive: FSManager, currentFile: {file: File, fsfile: FSFile, path: string, text: string}, contextMenu: ContextMenu}}
         */
        this.state = {
            archive: props.archive,
            currentFile: props.currentFile,
            contextMenu: null
        };

        this.dropHandler = this.dropHandler.bind(this);
        this.createFileList = this.createFileList.bind(this);
        this.createFileObj = this.createFileObj.bind(this);
    }
}