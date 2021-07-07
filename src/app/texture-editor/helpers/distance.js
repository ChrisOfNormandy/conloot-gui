function manhattan(pos1, pos2) {
    return Math.abs(pos2.x - pos1.x) + Math.abs(pos2.y - pos1.y);
}

function euclidean(pos1, pos2) {
    return Math.sqrt((pos2.x - pos1.x) * (pos2.x - pos1.x) + (pos2.y - pos1.y) * (pos2.y - pos1.y));
}

export {
    manhattan,
    euclidean
}