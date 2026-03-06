import { config, defaultFlags } from "../../../config/configfile.js";
import { buildLanguageFileOut } from "../../../config/languages/languageFile.js";
import {
    setCam,
    setConfig,
    setLanguage,
    updateFlags,
    updateUi,
    store,
} from "./store.js";
import {
    createShowDialogOnce,
    parseFeatureParams,
} from "../processing/featureStudies(URLparams).js";
import { applyConfigFromSupabase } from "../backend/initialisationConfig.js";
import { initParadataFocus } from "../frontend/paradata_focus.js";
import { initParadataFocusText } from "../frontend/paradata_focus_text.js";
import { initCAMFromSource } from "../backend/initialisation.js";

async function initApp() {
    setConfig(config);
    updateFlags(defaultFlags);

    const featureParams = parseFeatureParams();
    if (Object.keys(featureParams.configOverrides).length > 0) {
        Object.assign(store.config, featureParams.configOverrides);
    }
    if (Object.keys(featureParams.flagsOverrides).length > 0) {
        updateFlags(featureParams.flagsOverrides);
    }
    if (Object.keys(featureParams.uiOverrides).length > 0) {
        updateUi(featureParams.uiOverrides);
    }
    if (!Object.prototype.hasOwnProperty.call(featureParams.uiOverrides, "distanceArrows")) {
        updateUi({
            distanceArrows: store.config.enableArrows ? 20 : 40,
        });
    }

    await applyConfigFromSupabase();

    const { Elements } = await import("../backend/Elements.js");
    const cam = new Elements();
    setCam(cam);

    const languageFileOut = buildLanguageFileOut(store.config);
    setLanguage(languageFileOut);

    window.showDialogOnce = createShowDialogOnce(store.config, store.cam);

    await import("../frontend/colours.js");
    await import("../frontend/connectorArrows.js");
    await import("../frontend/draw.js");

    await import("../processing/preprocessingCAM.js");
    await import("../processing/postprocessingCAM.js");

    const { initInteractionNodeDialog } = await import(
        "../frontend/dialogs/interactionNode.js"
    );
    const { initInteractionEdgeDialog } = await import(
        "../frontend/dialogs/interactionEdge.js"
    );
    const { initConfirmSaveDialog } = await import(
        "../frontend/dialogs/confirmSave.js"
    );
    const { initReminderDialogs } = await import(
        "../frontend/dialogs/setReminder.js"
    );

    const { initReferenceDialog } = await import(
        "../frontend/buttons/participant/reference.js"
    );
    const { initSaveButton } = await import(
        "../frontend/buttons/participant/saveButton.js"
    );
    const { initDownloadSvgButton } = await import(
        "../frontend/buttons/participant/downloadSVGButton.js"
    );
    const { initDeleteButton } = await import(
        "../frontend/buttons/participant/deleteButton.js"
    );
    const { initDownloadJsonButton } = await import(
        "../frontend/buttons/researcher/downloadJSONbutton.js"
    );
    const { initUploadJsonButton } = await import(
        "../frontend/buttons/researcher/uploadJSONbutton.js"
    );
    const { initCreateConfigSave } = await import(
        "../frontend/buttons/researcher/createConfigSave.js"
    );

    const { initEventListenersBackend } = await import(
        "../frontend/eventListeners_backend.js"
    );
    const { initEventListenersFrontend } = await import(
        "../frontend/eventListeners_frontend.js"
    );

    initInteractionNodeDialog();
    initInteractionEdgeDialog();
    initConfirmSaveDialog();
    initReminderDialogs();

    initReferenceDialog();
    initSaveButton();
    initDownloadSvgButton();
    initDeleteButton();
    initDownloadJsonButton();
    initUploadJsonButton();
    initCreateConfigSave();

    initEventListenersBackend();
    initEventListenersFrontend();

    initParadataFocus();
    initParadataFocusText();

    await initCAMFromSource();

    if (store.language && store.language.alert_loading) {
        //alert(store.language.alert_loading);
    }

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
}

export { initApp };
