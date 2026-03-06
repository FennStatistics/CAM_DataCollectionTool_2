import { config, defaultFlags } from "../../../config/configfile.js";
import { buildLanguageFileOut } from "../../../config/languageFile.js";
import { setCam, setConfig, setLanguage, updateFlags, store } from "./store.js";
import { initFeatureStudies } from "../processing/featureStudies(URLparams).js";
import { applyConfigFromSupabase } from "../backend/initialisationConfig.js";
import { initParadataFocus } from "../frontend/paradata_focus.js";
import { initParadataFocusText } from "../frontend/paradata_focus_text.js";
import { initCAMFromSource } from "../backend/initialisation.js";

async function initApp() {
    setConfig(config);
    updateFlags(defaultFlags);

    initFeatureStudies();
    await applyConfigFromSupabase();

    const { Elements } = await import("../backend/Elements.js");
    const cam = new Elements();
    setCam(cam);

    const languageFileOut = buildLanguageFileOut(store.config);
    setLanguage(languageFileOut);

    await import("../frontend/colours.js");
    await import("../frontend/connectorArrows.js");
    await import("../frontend/draw.js");

    await import("../processing/preprocessingCAM.js");
    await import("../processing/postprocessingCAM.js");

    await import("../frontend/dialogs/interactionNode.js");
    await import("../frontend/dialogs/interactionEdge.js");
    await import("../frontend/dialogs/confirmSave.js");
    await import("../frontend/dialogs/setReminder.js");

    await import("../frontend/buttons/participant/reference.js");
    await import("../frontend/buttons/participant/saveButton.js");
    await import("../frontend/buttons/participant/downloadSVGButton.js");
    await import("../frontend/buttons/participant/deleteButton.js");
    await import("../frontend/buttons/researcher/downloadJSONbutton.js");
    await import("../frontend/buttons/researcher/uploadJSONbutton.js");
    await import("../frontend/buttons/researcher/createConfigSave.js");
    await import("../frontend/buttons/researcher/testbutton.js");

    await import("../frontend/eventListeners_backend.js");
    await import("../frontend/eventListeners_frontend.js");

    initParadataFocus();
    initParadataFocusText();

    await initCAMFromSource();

    if (store.language && store.language.alert_loading) {
        alert(store.language.alert_loading);
    }

    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }
}

export { initApp };
