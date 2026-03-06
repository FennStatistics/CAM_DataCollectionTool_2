import { $ } from "../app/vendor.js";
import { getJatos } from "../services/jatosAdapter.js";

function parseFeatureParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const configOverrides = {};
    const flagsOverrides = {};
    const uiOverrides = {};

    console.log("url params: ", params);

    if (
        urlSearchParams.has("external") &&
        urlSearchParams.get("external") === "true"
    ) {
        flagsOverrides.usingSupabase = false;
        flagsOverrides.usingJATOS = false;
    }

    if (
        urlSearchParams.has("ShowResearcherButtons") &&
        urlSearchParams.get("ShowResearcherButtons") === "false"
    ) {
        configOverrides.ShowResearcherButtons = false;
    } else if (
        urlSearchParams.has("ShowResearcherButtons") &&
        urlSearchParams.get("ShowResearcherButtons") === "true"
    ) {
        configOverrides.ShowResearcherButtons = true;
    }

    if (
        urlSearchParams.has("OnlyStraightCon") &&
        urlSearchParams.get("OnlyStraightCon") === "true"
    ) {
        configOverrides.OnlyStraightCon = true;
    } else if (
        urlSearchParams.has("OnlyStraightCon") &&
        urlSearchParams.get("OnlyStraightCon") === "false"
    ) {
        configOverrides.OnlyStraightCon = false;
    }

    if (
        urlSearchParams.has("enableArrows") &&
        urlSearchParams.get("enableArrows") === "true"
    ) {
        configOverrides.enableArrows = true;
        uiOverrides.distanceArrows = 20;
    } else if (
        urlSearchParams.has("enableArrows") &&
        urlSearchParams.get("enableArrows") === "false"
    ) {
        configOverrides.enableArrows = false;
        uiOverrides.distanceArrows = 40;
    }

    if (
        urlSearchParams.has("enableAmbivalent") &&
        urlSearchParams.get("enableAmbivalent") === "true"
    ) {
        configOverrides.enableAmbivalent = true;
    } else if (
        urlSearchParams.has("enableAmbivalent") &&
        urlSearchParams.get("enableAmbivalent") === "false"
    ) {
        configOverrides.enableAmbivalent = false;
    }

    if (urlSearchParams.has("MinNumNodes")) {
        configOverrides.MinNumNodes = parseInt(
            urlSearchParams.get("MinNumNodes"),
            10
        );
    }

    if (urlSearchParams.has("MaxNumWords")) {
        configOverrides.MaxNumWords = parseInt(
            urlSearchParams.get("MaxNumWords"),
            10
        );
    }

    if (
        urlSearchParams.has("cameraFeature") &&
        urlSearchParams.get("cameraFeature") === "false"
    ) {
        configOverrides.cameraFeature = false;
    } else if (
        urlSearchParams.has("cameraFeature") &&
        urlSearchParams.get("cameraFeature") === "true"
    ) {
        configOverrides.cameraFeature = true;
    }

    if (
        urlSearchParams.has("fullScreen") &&
        urlSearchParams.get("fullScreen") === "false"
    ) {
        configOverrides.fullScreen = false;
    } else if (
        urlSearchParams.has("fullScreen") &&
        urlSearchParams.get("fullScreen") === "true"
    ) {
        configOverrides.fullScreen = true;
    }

    return { params, configOverrides, flagsOverrides, uiOverrides };
}

function createShowDialogOnce(config, cam) {
    const jatos = getJatos();
    const executedDefault = config.showNotPopupStart;

    return (function () {
        var executed = executedDefault;
        return function () {
            if (!executed) {
                executed = true;
                $("#dialogStart").dialog("open");

                if (typeof jatos.jQuery === "function") {
                    var resultJson = cam;
                    console.log("my result data sent to JATOS first time");
                    jatos
                        .submitResultData(resultJson)
                        .then(() => console.log("success"))
                        .catch(() => console.log("error"));
                }
            }
        };
    })();
}

export { parseFeatureParams, createShowDialogOnce };
