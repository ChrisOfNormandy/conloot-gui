import React from 'react';
import CodeEditor from '../../fragments/editor/CodeEditor';
import Builder from './builders/Builder';

class Editor {
    createBuilder(orgName, modName) {
        this.builder = new Builder(orgName, modName);

        this.organization = orgName;
        this.modName = modName;

        return this;
    }

    createCodeEditor(code, ext) {
        if (/\.((jar))/.test(ext))
            return null;

        return <CodeEditor
            ext={ext}
            code={code}
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
            editorDidMount={
                () => {
                    console.debug('Editor mounted.');
                }
            }
        />;
    }

    constructor() {
        /**
         * @type {Builder}
         */
        this.builder = null;
        this.organization = '';
        this.modName = '';

        this.current = {
            file: null,
            fsfile: null,
            path: '',
            text: ''
        };
    }
}

const editor = new Editor();

export default editor;
export { editor };