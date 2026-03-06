import { $ } from "../app/vendor.js";
import { store } from "../app/store.js";

function initParadataFocusText() {
    $(function () {
        document.getElementById("alert-text").innerHTML = store.language.ls_01;
        document.getElementById("alert-button-text").innerText =
            store.language.continueButtonFullscreen;
    });
}

export { initParadataFocusText };
