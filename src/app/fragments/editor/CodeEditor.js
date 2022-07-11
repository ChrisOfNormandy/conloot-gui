/* eslint-disable class-methods-use-this */

import React from 'react';
import MonacoEditor from 'react-monaco-editor';

/**
 *
 * @param {string} ext
 * @returns
 */
function getLanguage(ext) {
    if (ext === '.bat')
        return 'bat';

    if (ext === '.md')
        return 'markdown';

    if (/\.((ts))/.test(ext))
        return 'typescript';

    if (/\.((sh))/.test(ext))
        return 'shell';

    if (/\.((java))/.test(ext))
        return 'java';

    if (/\.((js))/.test(ext))
        return 'javascript';

    if (/\.((json))/.test(ext))
        return 'json';

    if (/\.((yaml)|(toml))/.test(ext))
        return 'yaml';

    if (/\.((xml)|(pom)|(project))/.test(ext))
        return 'xml';

    return 'txt';
}

/**
 *
 * @param {*} param0
 * @returns
 */
export default function CodeEditor({ ext, onChange, code, editorDidMount = null }) {
    const options = {
        selectOnLineNumbers: true
    };

    return <div
        className='mod-builder-text-editor'
    >
        <MonacoEditor
            id='txtArea'
            language={getLanguage(ext)}
            theme='vs-dark'
            value={code}
            options={options}
            onChange={onChange}
            editorDidMount={editorDidMount}
        />
    </div>;
}