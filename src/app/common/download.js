/**
 *
 * @param {string} name
 * @param {Blob} blob
 */
export default function download(name, blob) {
    const url = window.URL.createObjectURL(blob);
    let link = document.getElementById('download_link');
    link.href = url;
    link.setAttribute('download', name);
    link.click();
}