import JSZip from 'jszip';

export class FSFile {

    values() {
        return this.file;
    }

    /**
     * 
     * @param {string} name 
     * @param {File} file 
     * @param {string} path
     */
    constructor(name, file, path = '') {
        this.name = name;
        this.file = file;
        this.path = path;
    }
}

export class FSDir {
    /**
     * 
     * @param {string} name 
     * @param {File} file 
     * @param {string} path
     * @returns 
     */
    addFile(name, file, path = '') {
        let f = new FSFile(name, file, path);
        this.content[name] = f;
        return f;
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    getFile(name) {
        return (this.content[name] !== undefined && this.content[name].content === undefined)
            ? this.content[name]
            : null;
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    addDir(name) {       
        let d = new FSDir(name);
        this.content[name] = d;
        return d;
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    getDir(name) {
        return (this.content[name] !== undefined && this.content[name].content !== undefined)
            ? this.content[name]
            : null;
    }

    /**
     * 
     * @param {string} name 
     * @returns 
     */
    exists(name) {
        return !!this.content[name];
    }

    values() {
        let arr = [];
        for (let i in this.content)
            arr.push(this.content[i].values());
        
        return arr;
    }

    /**
     * 
     * @param {string} name 
     */
    constructor(name) {
        this.name = name;

        this.content = {};
    }
}

function recurDir(path, dir, list) {   
    if (!!dir.content) {
        for (let i in dir.content) {
            if (!!dir.content[i].content)
                list = recurDir(`${path}/${i}`, dir.content[i], list);
            else
                list[`${path}/${i}`] = dir.content[i].file;
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

        let v = recurDir(this.root.name, this.root, {});

        for (let p in v)
            zip.file(p, await v[p].text());

        return zip.generateAsync({type: 'blob'});
    }

    setRoot(rootName) {
        this.root = new FSDir(rootName);
        return this.root;
    }

    fetch(path) {
        if (this.root === null)
            return null;

        let p = path.split('/');

        let d = this.root;
        p.forEach((v, i) => {
            if (i === p.length - 1) {
                console.log(v, d);

                d = d.getFile(v);

                return;
            }
            else if (!d.content) {
                d = null;
                return;
            }

            if (d.exists(v))
                d = d.getDir(v);
        });

        return d;
    }

    set(path, name, file) {
        if (this.root === null)
            return null;

        let p = path.split('/');

        let d = this.root;
        p.forEach(v => {
            if (d !== null && d.exists(v))
                d = d.getDir(v);
            else
                return;
        });

        return d.addFile(name, file);
    }

    constructor(rootName = null) {
        this.root = rootName === null ? null : new FSDir(rootName);
    }
}