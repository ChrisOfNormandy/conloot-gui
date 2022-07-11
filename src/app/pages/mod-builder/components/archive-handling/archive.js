import JSZip from 'jszip';
import download from '../../../../common/download';
import FSDir from '../../../../common/file-system/FSDir';

/**
 *
 * @param {import('../../../../common/file-system/FSManager').default} archive
 * @param {*} currentFile
 * @returns {import('../../../../common/file-system/FSManager').default}
 */
export function save(archive, currentFile) {
    const txtArea = document.getElementById('txtArea');

    let v = archive.set(
        currentFile.path,
        currentFile.file.name,
        new File([txtArea.value], currentFile.file.name, { type: currentFile.file.type })
    );

    currentFile.fsfile = v;
    currentFile.file = v.file;
    currentFile.path = v.path();
    currentFile.text = txtArea.value;

    document.getElementById('editor_save_button').classList.remove('icon-active');
    document.getElementById('editor_discard_button').classList.remove('icon-active');

    return archive;
}

/**
 *
 * @param {import('../../../../common/file-system/FSManager').default} archive
 * @param {*} currentFile
 * @returns
 */
export function rename(archive, currentFile) {
    const name = document.getElementById('text_area_file_name').value;

    let newFile = currentFile.fsfile.dir.addFile(name, new File([currentFile.file], name, { type: currentFile.file.type }), currentFile.path);

    currentFile.fsfile.dir.deleteFile(currentFile.file.name);

    currentFile.file = newFile.file;
    currentFile.fsfile = newFile;

    return archive;
}

/**
 *
 * @param {*} currentFile
 */
export function cancelChanges(currentFile) {
    document.getElementById('txtArea').value = currentFile.text;

    document.getElementById('editor_save_button').classList.remove('icon-active');
    document.getElementById('editor_discard_button').classList.remove('icon-active');
}

/**
 *
 * @param {import('../../../../common/file-system/FSManager').default} archive
 */
export function exportZip(archive) {
    archive.compress()
        .then((zip) => {
            download(archive.root.name + '.zip', zip);
        })
        .catch((err) => console.error(err));
}

/**
 *
 * @param {*} zip
 * @param {import('../../../../common/file-system/FSManager').default} archive
 * @param {Blob} blob
 * @returns
 */
export function openZip(zip, archive, blob) {
    return new Promise((resolve, reject) => {
        zip.loadAsync(blob)
            .then(async (zipped) => {
                let i, file, path, fileName;

                for (i in zipped.files) {
                    let d = archive.root;

                    file = zipped.file(i);
                    path = i.split('/');
                    fileName = path.pop();

                    // If file === null, the item is a dir.

                    if (fileName !== '') {
                        path.forEach((v) => {
                            if (d === null) {
                                archive.root = new FSDir(v);
                                d = archive.root;
                            }
                            else if (d.contains(v))
                                d = d.getDir(v);
                            else {
                                d = d.addDir(v);
                            }
                        });

                        d.addFile(
                            fileName,
                            new File([await file.async('blob')], fileName),
                            path.join('/')
                        );
                    }
                }

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {string} mcVersion
 * @param {string} forgeVersion
 * @param {import('../../../../common/file-system/FSManager').default} archive
 * @returns {Promise<import('../../../../common/file-system/FSManager').default>}
 */
export function openForgeZip(mcVersion, forgeVersion, archive) {
    return new Promise((resolve, reject) => {
        fetchForgeZip(mcVersion, forgeVersion, archive)
            .then(async (zipped) => {
                let i, file, path, fileName;

                for (i in zipped.files) {
                    let d = archive.root;

                    file = zipped.file(i);
                    path = i.split('/');
                    fileName = path.pop();

                    // If file === null, the item is a dir.

                    if (fileName !== '') {
                        path.forEach((v) => {
                            if (d === null) {
                                archive.root = new FSDir(v);
                                d = archive.root;
                            }
                            else if (d.contains(v))
                                d = d.getDir(v);
                            else {
                                d = d.addDir(v);
                            }
                        });

                        d.addFile(
                            fileName,
                            new File([await file.async('blob')], fileName),
                            path.join('/')
                        );
                    }
                }

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {string} mcVersion
 * @param {string} libraryVersion
 * @param {import('../../../../common/file-system/FSManager')} archive
 * @returns {Promise<import('../../../../common/file-system/FSManager').default>}
 */
export function openLibraryZip(mcVersion, libraryVersion, archive) {
    return new Promise((resolve, reject) => {
        fetchLibrary(mcVersion, libraryVersion, archive)
            .then(async (zipped) => {
                let i, file, path, fileName;

                for (i in zipped.files) {
                    let d = archive.root;

                    file = zipped.file(i);
                    path = i.split('/');
                    fileName = path.pop();

                    // If file === null, the item is a dir.

                    if (fileName !== '') {
                        path.forEach((v) => {
                            if (d === null) {
                                archive.root = new FSDir(v);
                                d = archive.root;
                            }
                            else if (d.contains(v))
                                d = d.getDir(v);
                            else {
                                d = d.addDir(v);
                            }
                        });

                        d.addFile(
                            fileName,
                            new File([await file.async('blob')], fileName),
                            path.join('/')
                        );
                    }
                }

                resolve(archive);
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {string} mcVersion
 * @param {string} forgeVersion
 * @returns {Promise<JSZip>}
 */
export function fetchForgeZip(mcVersion, forgeVersion) {
    return new Promise((resolve, reject) => {
        fetch(window.location.search.slice(1).split('&').includes('dev=true')
            ? `http://localhost:8080/download/${mcVersion}/${forgeVersion}`
            : `https://maven.minecraftforge.net/net/minecraftforge/forge/${mcVersion}-${forgeVersion}/forge-${mcVersion}-${forgeVersion}-mdk.zip`
        )
            .then((response) => {
                const zip = new JSZip();

                response.blob()
                    .then((mkd) => {
                        zip.loadAsync(mkd)
                            .then((zipped) => resolve(zipped))
                            .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}

/**
 *
 * @param {string} mcVersion
 * @param {string} libraryVersion
 * @returns {Promise<JSZip>}
 */
export function fetchLibrary(mcVersion, libraryVersion) {
    return new Promise((resolve, reject) => {
        fetch(window.location.search.slice(1).split('&').includes('dev=true')
            ? `http://localhost:8080/library/${mcVersion}/${libraryVersion}`
            : `https://github.com/ChrisOfNormandy/CoNLib/archive/refs/tags/${libraryVersion}-MC_${mcVersion}.zip`
        )
            .then((response) => {
                const zip = new JSZip();

                response.blob()
                    .then((mkd) => {
                        zip.loadAsync(mkd)
                            .then((zipped) => resolve(zipped))
                            .catch((err) => reject(err));
                    })
                    .catch((err) => reject(err));
            })
            .catch((err) => reject(err));
    });
}