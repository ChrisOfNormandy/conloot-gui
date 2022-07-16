import FSFile from './FSFile';

export default class FSDir {
    /**
     *
     * @param {string} name
     * @param {File} file
     * @returns {FSFile}
     */
    addFile(name, file, overwrite = false) {
        let n = name;

        if (!!this.content[n] && !overwrite) {
            let i = 1;
            let m = n.match(/(.*?)(\.[a-zA-Z0-9]+)/);

            if (m === null)
                return this.content[0];

            while (this.content[n]) {
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
        return this.content[name] !== undefined && this.content[name].content === undefined
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

        console.debug('Creating dir:', name);

        if (!!this.content[n] && !overwrite) {
            let i = 1;
            while (this.content[n]) {
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
        return this.content[name] !== undefined && this.content[name].content !== undefined
            ? this.content[name]
            : null;
    }

    /**
     *
     * @param {string} name
     * @returns
     */
    getOrAddDir(name) {
        return this.getDir(name) || this.addDir(name);
    }

    /**
     *
     * @param {name} name
     */
    deleteDir(name) {
        delete this.content[name];
    }

    delete() {
        delete this.dir[this.name];
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    contains(name) {
        return this.content[name] !== undefined;
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
        return (this.dir === null
            ? ''
            : this.dir.path() + '/') + this.name;
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