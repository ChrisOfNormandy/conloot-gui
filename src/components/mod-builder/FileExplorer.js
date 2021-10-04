import React from "react";

import { uniqueId } from "lodash";
import ContextMenu from "../fragments/ContextMenu";
import FSManager, { FSFile, FSDir } from "../../app/common/FileSystem";

let dirTracker = {};

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

            files.forEach(f => dir.addFile(f.name, f));

            this.setState(state);
        };

        handleFileAppend();
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragLeave(event) {
        event.preventDefault();
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
                    let name = prompt('File name', 'new-file.txt') || 'new-file.txt'
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
                    let name = prompt('Folder name', 'New Folder') || 'New Folder'
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
                    let name = prompt('File name', file.name) || file.name
                    file.rename(name);
                    this.setState(this.state);
                },
                markup:
                    (
                        <div>
                            Rename
                        </div>
                    )
            }
        ];
    }

    /**
     * 
     * @param {FSFile} f 
     * @returns 
     */
    createFileObj(f) {
        return (
            <li
                id={f.name}
                key={f.name}
                className='file-explorer-row file-explorer-list-item file-explorer-file-label file-item'
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={(e) => {
                    console.log(e.target)
                    this.dropHandler(e, f.dir)
                }}
            >
                <span
                    title={`${f.path()} | Size: ${
                        f.file.size < 1024
                            ? f.file.size + 'B'
                        : f.file.size / 1024 < 1024
                            ? (f.file.size / 1024).toFixed(2) + 'KB'
                            : (f.file.size / (1024 * 1024)).toFixed(2) + 'MB'
                    }`}
                    onClick={
                        () => {
                            f.file.text()
                                .then(v => {
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
                                .catch(err => console.error(err));
                                
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
                    className='file-explorer-options'
                >
                    <i
                        id={`${f.name}_delete_button`}
                        className="icon bi-file-earmark-x editor-toolbar-icon dir-item-icon"
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
            </li>
        )
    }

    /**
     * 
     * @param {FSDir} dir 
     * @returns 
     */
    createFileList(dir) {
        if (dir === null)
            return;

        if (!!dir.content) {
            let arr = [];

            for (let i in dir.content) {
                if (!!dir.content[i].content) {
                    let id = uniqueId();

                    if (dirTracker[id] === undefined)
                        dirTracker[id] = false;

                    arr.push(
                        (
                            <li
                                className='file-explorer-list-item'
                                key={id}
                                onDragOver={this.onDragOver}
                                onDragLeave={this.onDragLeave}
                                onDrop={(e) => this.dropHandler(e, dir.content[i])}
                            >
                                <div
                                    className='file-explorer-row file-explorer-dir-label dir-item'
                                >
                                    <span
                                        onClick={
                                            () => {
                                                let v = document.getElementById(id)
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
                                        className='file-explorer-options'
                                    >
                                        <i
                                            id={`${id}_new_file_button`}
                                            className="icon bi-file-earmark-plus editor-toolbar-icon dir-item-icon"
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
                                            className="icon bi-folder-plus editor-toolbar-icon dir-item-icon"
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
                                            className="icon bi-folder-x editor-toolbar-icon dir-item-icon"
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
                                    className={`file-explorer-dir-group ${dirTracker[id] === true ? 'hidden' : ''}`}
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
                <ul className='file-explorer-list'>
                    {arr.map(v => v)}
                </ul>
            )
        }

        return (
            <li
                className='file-explorer-list-item'
            >
                {this.createFileObj(dir)}
            </li>
        );
    }

    render() {
        return (
            <div
                className='sect-file-explorer-list'
                id='sect_file_explorer_list'
                onClick={
                    () => {
                        if (this.state.contextMenu !== null) {
                            let state = this.state;
                            state.contextMenu = null;
                            console.log('FF')
                            this.setState(state);
                        }
                    }
                }
                onDrop={(e) => { this.dropHandler(e, this.state.archive.root) }}
            >
                {this.createFileList(this.state.archive.root)}
                {this.state.contextMenu}
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

        this.createFileList = this.createFileList.bind(this);
        this.createFileObj = this.createFileObj.bind(this);
    }
}