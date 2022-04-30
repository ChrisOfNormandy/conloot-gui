/**
 *
 * @param {string} name
 * @param {Blob} blob
 */
export default function download(name, blob) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    document.getElementById('root').appendChild(a);

    a.href = url;
    a.setAttribute('download', name);
    a.click();

    document.getElementById('root').removeChild(a);
    URL.revokeObjectURL(url);
}