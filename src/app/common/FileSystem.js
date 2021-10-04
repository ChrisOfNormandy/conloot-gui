import JSZip from 'jszip';

export class FSFile {

    /**
     * 
     * @returns {File}
     */
    values() {
        return this.file;
    }

    /**
     * 
     * @param {string} name 
     */
    rename(name) {
        return this.moveTo(this.dir, name);
    }

    /**
     * 
     * @returns {string}
     */
    path() {
        return this.dir.path() + '/' + this.name;
    }

    /**
     * 
     * @param {string} str 
     * @returns {File}
     */
    write(str) {
        this.file = new File([str], this.name, { type: this.file.type });
        return this.file;
    }

    /**
     * 
     * @param {FSDir} dir 
     * @param {string} name
     * @returns {FSFile}
     */
    moveTo(dir, name = null) {
        if (this.dir !== null)
            delete this.dir.content[this.name];

        if (name !== null) {
            this.name = name;
            this.file = new File([this.file], this.name, { type: this.file.type });
        }

        this.dir = dir;
        dir.content[this.name] = this;

        return this;
    }

    /**
     * 
     * @param {string} name 
     * @param {File} file 
     * @param {FSDir} dir
     */
    constructor(name, file, dir) {
        this.name = name;
        this.file = file;
        this.dir = dir;
    }
}

export class FSDir {
    /**
     * 
     * @param {string} name 
     * @param {File} file 
     * @returns 
     */
    addFile(name, file, overwrite = false) {
        let n = name;

        if (!!this.content[n] && !overwrite) {
            let i = 1;
            let m = n.match(/(.*?)(\.[a-zA-Z0-9]+)/);
            while (!!this.content[n]) {
                n = m[1] + `(${i})` + m[2];
                i++;
            }
        }

        this.content[n] = new FSFile(n, new File([file], n, { type: file.type }), this);

        return this.content[n];
    }

    /**
     * 
     * @param {string} name 
     * @returns {FSFile}
     */
    getFile(name) {
        return (this.content[name] !== undefined && this.content[name].content === undefined)
            ? this.content[name]
            : null;
    }

    /**
     * 
     * @param {string} name 
     */
    deleteFile(name) {
        delete this.content[name];
    }

    /**
     * 
     * @param {string} name 
     * @param {FSDir} dir
     * @returns {FSDir}
     */
    addDir(name, dir = null, overwrite = false) {
        let n = name;

        if (!!this.content[n] && !overwrite) {
            let i = 1;
            while (!!this.content[n]) {
                n = name + `(${i})`;
                i++;
            }
        }

        if (dir !== null)
            this.content[n] = dir.moveTo(this, n);
        else
            this.content[n] = new FSDir(n, this);

        return this.content[n];
    }

    /**
     * 
     * @param {string} name 
     * @returns {FSDir}
     */
    getDir(name) {
        return (this.content[name] !== undefined && this.content[name].content !== undefined)
            ? this.content[name]
            : null;
    }

    /**
     * 
     * @param {name} name 
     */
    deleteDir(name) {
        delete this.content[name];
    }

    /**
     * 
     * @param {string} name 
     * @returns {boolean}
     */
    contains(name) {
        return !!this.content[name];
    }

    /**
     * 
     * @returns 
     */
    values() {
        let arr = [];
        for (let i in this.content)
            arr.push(this.content[i].values());

        return arr;
    }

    /**
     * 
     * @param {string} name 
     * @returns {FSDir}
     */
    rename(name) {
        return this.moveTo(this.dir, name);
    }

    /**
     * 
     * @param {FSDir} dir 
     * @param {string} name
     * @returns {FSDir}
     */
    moveTo(dir, name = null) {
        if (this.dir !== null)
            delete this.dir.content[this.name];

        if (name !== null)
            this.name = name;

        this.dir = dir;
        dir.content[this.name] = this;

        return this;
    }

    /**
     * 
     * @returns {string}
     */
    path() {
        return (this.dir === null ? '' : this.dir.path() + '/') + this.name;
    }

    /**
     * 
     * @param {string} name 
     * @param {FSDir} dir
     */
    constructor(name, dir = null) {
        this.name = name;
        this.dir = dir;

        this.content = {};
    }
}

function recurDir(dir, list) {
    if (!!dir.content) {
        for (let i in dir.content) {
            if (!!dir.content[i].content)
                list = recurDir(dir.content[i], list);
            else
                list[dir.content[i].path()] = dir.content[i].file;
        }
    }

    return list;
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
        this.root = rootName === null ? null : new FSDir(rootName);
    }
}