import JSZip from 'jszip';
import FSDir from './FSDir';

/**
 *
 * @param {*} dir
 * @param {*} list
 * @returns
 */
function recurDir(dir, list) {
    let l = list;

    if (dir.content) {
        for (let i in dir.content) {
            if (dir.content[i].content)
                l = recurDir(dir.content[i], list);
            else
                l[dir.content[i].path()] = dir.content[i].file;
        }
    }

    return l;
}

export default class FSManager {

    values() {
        return this.root.values();
    }

    async compress() {
        const zip = new JSZip();

        let v = recurDir(this.root, {});

        for (let p in v)
            zip.file(p, await v[p]);

        return zip.generateAsync({ type: 'blob' });
    }

    /**
     *
     * @param {string} rootName
     * @returns {FSDir}
     */
    setRoot(rootName) {
        this.root = new FSDir(rootName);

        return this.root;
    }

    /**
     *
     * @param {string} path
     * @returns {FSFile}
     */
    fetch(path) {
        if (this.root === null)
            return null;

        let p = path.split('/');

        if (p[0] === this.root.name)
            p.shift();

        let d = this.root;
        p.forEach((v, i) => {
            if (i === p.length - 1) {
                d = d.getFile(v);

                return;
            }
            else if (!d.content) {
                d = null;

                return;
            }

            if (d.contains(v))
                d = d.getDir(v);
        });

        return d;
    }

    fetchDir(path) {
        if (this.root === null)
            return null;

        let p = path.split('/');

        if (p[0] === this.root.name)
            p.shift();

        let d = this.root;
        p.forEach((v, i) => {
            if (i === p.length - 1) {
                d = d.getDir(v);

                return;
            }
            else if (!d.content) {
                d = null;

                return;
            }

            if (d.contains(v))
                d = d.getDir(v);
        });

        return d;
    }

    /**
     *
     * @param {string} path
     * @param {string} name
     * @param {File} file
     * @returns {FSFile}
     */
    set(path, name, file) {
        let p = path.split('/');

        if (p[0] === this.root.name)
            p.shift();

        let d = this.root;
        let l = p.length - 1;
        let f = null;

        for (let i in p) {
            if (Number(i) === l && d !== null)
                f = d.addFile(name, file, true);
            else {
                if (d.contains(p[i]))
                    d = d.getDir(p[i]);
                else
                    d = d.addDir(p[i]);
            }
        }

        return f;
    }

    /**
     *
     * @param {string} rootName
     */
    constructor(rootName = null) {
        this.root = rootName === null
            ? null
            : new FSDir(rootName);
    }
}