function _(controls) {
    if (controls === null)
        return console.error('Collapsable div was null.');
    controls.style.maxHeight = !controls.style.maxHeight ? controls.scrollHeight + 'px' : null;
}

export default _;