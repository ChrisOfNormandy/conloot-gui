export default class FSFile {

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