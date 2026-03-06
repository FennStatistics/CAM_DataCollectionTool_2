import { store } from "../app/store.js";

function enterFullscreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
    }
}

function initParadataFocus() {
    console.log("starting paradata");
    console.log("config.fullScreen - paradata", store.config.fullScreen);

    window.enterFullscreen = enterFullscreen;

    if (store.config.fullScreen != true) {
        return;
    }

    console.log("config.fullScreen - paradata", store.config.fullScreen);

    var paradefocuscount = 0;
    var lastBlurTimestamp;
    store.ui.defocusEvents = [];

    window.addEventListener("load", () => {
        document.getElementById("alert").style.visibility = "visible";
        document.getElementById("hideall").style.visibility = "hidden";
    });

    window.addEventListener("blur", (e) => {
        paradefocuscount++;
        document.getElementById("alert").style.visibility = "visible";
        document.getElementById("hideall").style.visibility = "hidden";
        lastBlurTimestamp = e.timeStamp;
    });

    window.addEventListener("focus", (e) => {
        var durDefocus = e.timeStamp - lastBlurTimestamp;
        store.ui.defocusEvents.push(durDefocus);
        console.log(
            "durDefocus: ",
            durDefocus,
            "arraydefocusevent: ",
            store.ui.defocusEvents
        );
    });
}

export { initParadataFocus, enterFullscreen };
