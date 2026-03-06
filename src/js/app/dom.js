function byId(id) {
    return document.getElementById(id);
}

function qs(selector, root = document) {
    return root.querySelector(selector);
}

export { byId, qs };
