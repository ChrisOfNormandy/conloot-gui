import React from 'react';
import Builder from './builders/Builder';
import CodeEditor from '../../fragments/editor/CodeEditor';

/**
 *
 * @param {string} str
 * @returns
 */
function replTabs(str) {
    const m = str.match(/%tab_(\d+)%/);
    if (m)
        return replTabs(str.replace(m[0], ' '.repeat(4 * m[1])));

    return str;
}

class Editor {
    tagRepl(str) {
        let s = str;

        Object.keys(this.tags).forEach((tag) => {
            s = s.replace(new RegExp(`%${tag}%`, 'g'), this.tags[tag]);
        });

        this.replacers.forEach((repl) => {
            s = repl(s);
        });

        return replTabs(s);
    }

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

    /**
     *
     * @returns {Object.<string, string>}
     */
    getLang() {
        const lang = {};

        this.builder.blocks.forEach((block) => {
            lang[`block.${this.modName.toLowerCase()}.${block.name}`] = block.name.split('_').map((s) => s[0].toUpperCase() + s.slice(1)).join(' ');
        });

        return lang;
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

        this.tags = {
            org_name: () => this.builder.orgName,
            mod_name: () => this.builder.modName,
            mod_name_lc: () => this.builder.modName.toLowerCase()
        };

        this.replacers = [
            /**
             *
             * @param {string} str
             */
            (str) => {
                let s = str;

                let m = str.match(/%tab_(\d+)%/);

                while (m) {
                    s = s.replace(m[1], ' '.repeat(m[1] * 4));

                    m = s.match(/%tab_(\d+)%/);
                }

                return str;
            }
        ];

        this.tagRepl = this.tagRepl.bind(this);
    }
}

const editor = new Editor();

export default editor;
export { editor };