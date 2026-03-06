import { $ } from "../app/vendor.js";
import { store, updateFlags, updateUi } from "../app/store.js";
import { getJatos } from "../services/jatosAdapter.js";

function initFeatureStudies() {
    const jatos = getJatos();

    const showDialogOnce = (function () {
        var executed = store.config.showNotPopupStart;
        return function () {
            if (!executed) {
                executed = true;
                $("#dialogStart").dialog("open");

                if (typeof jatos.jQuery === "function") {
                    var resultJson = store.cam;
                    console.log("my result data sent to JATOS first time");
                    jatos
                        .submitResultData(resultJson)
                        .then(() => console.log("success"))
                        .catch(() => console.log("error"));
                }
            }
        };
    })();

    window.showDialogOnce = showDialogOnce;

    if (store.config.enableArrows) {
        updateUi({ distanceArrows: 20 });
    } else {
        updateUi({ distanceArrows: 40 });
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    console.log("url params: ", params);

    if (
        urlSearchParams.has("external") &&
        urlSearchParams.get("external") === "true"
    ) {
        updateFlags({ usingSupabase: false, usingJATOS: false });
    }

    if (
        urlSearchParams.has("ShowResearcherButtons") &&
        urlSearchParams.get("ShowResearcherButtons") === "false"
    ) {
        store.config.ShowResearcherButtons = false;
    } else if (
        urlSearchParams.has("ShowResearcherButtons") &&
        urlSearchParams.get("ShowResearcherButtons") === "true"
    ) {
        store.config.ShowResearcherButtons = true;
    }

    if (
        urlSearchParams.has("OnlyStraightCon") &&
        urlSearchParams.get("OnlyStraightCon") === "true"
    ) {
        store.config.OnlyStraightCon = true;
    } else if (
        urlSearchParams.has("OnlyStraightCon") &&
        urlSearchParams.get("OnlyStraightCon") === "false"
    ) {
        store.config.OnlyStraightCon = false;
    }

    if (
        urlSearchParams.has("enableArrows") &&
        urlSearchParams.get("enableArrows") === "true"
    ) {
        store.config.enableArrows = true;
        updateUi({ distanceArrows: 20 });
    } else if (
        urlSearchParams.has("enableArrows") &&
        urlSearchParams.get("enableArrows") === "false"
    ) {
        store.config.enableArrows = false;
        updateUi({ distanceArrows: 40 });
    }

    if (
        urlSearchParams.has("enableAmbivalent") &&
        urlSearchParams.get("enableAmbivalent") === "true"
    ) {
        store.config.enableAmbivalent = true;
    } else if (
        urlSearchParams.has("enableAmbivalent") &&
        urlSearchParams.get("enableAmbivalent") === "false"
    ) {
        store.config.enableAmbivalent = false;
    }

    if (urlSearchParams.has("MinNumNodes")) {
        store.config.MinNumNodes = parseInt(
            urlSearchParams.get("MinNumNodes"),
            10
        );
    }

    if (urlSearchParams.has("MaxNumWords")) {
        store.config.MaxNumWords = parseInt(
            urlSearchParams.get("MaxNumWords"),
            10
        );
    }

    if (
        urlSearchParams.has("cameraFeature") &&
        urlSearchParams.get("cameraFeature") === "false"
    ) {
        store.config.cameraFeature = false;
        $(function () {
            $("#showCameraFeature").hide();
        });
    } else if (
        urlSearchParams.has("cameraFeature") &&
        urlSearchParams.get("cameraFeature") === "true"
    ) {
        store.config.cameraFeature = true;
        $(function () {
            $("#showCameraFeature").show();
        });
    }

    if (
        urlSearchParams.has("fullScreen") &&
        urlSearchParams.get("fullScreen") === "false"
    ) {
        store.config.fullScreen = false;
    } else if (
        urlSearchParams.has("fullScreen") &&
        urlSearchParams.get("fullScreen") === "true"
    ) {
        store.config.fullScreen = true;
    }

    console.log("config URL params: ", store.config);
}

export { initFeatureStudies };
