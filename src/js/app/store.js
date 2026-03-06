import { config as defaultConfig, defaultFlags } from "../../../config/configfile.js";

const store = {
    cam: null,
    config: defaultConfig,
    language: null,
    ui: {
        arrayPositions: [],
        stopConX: 0,
        stopConY: 0,
        counterChangeAmbiConcept: 0,
        distanceArrows: 40,
        defocusEvents: [],
    },
    env: {
        camMother: null,
        linkRedirect: null,
        token: null,
        nameStudy: null,
    },
    flags: {
        usingSupabase: defaultFlags.usingSupabase,
        usingJATOS: defaultFlags.usingJATOS,
    },
};

const listeners = new Set();

function setCam(cam) {
    store.cam = cam;
    notify();
}

function setConfig(config) {
    store.config = config;
    notify();
}

function setLanguage(language) {
    store.language = language;
    notify();
}

function updateUi(partial) {
    Object.assign(store.ui, partial);
    notify();
}

function updateEnv(partial) {
    Object.assign(store.env, partial);
    notify();
}

function updateFlags(partial) {
    Object.assign(store.flags, partial);
    notify();
}

function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function notify() {
    listeners.forEach((listener) => listener(store));
}

export {
    store,
    setCam,
    setConfig,
    setLanguage,
    updateUi,
    updateEnv,
    updateFlags,
    subscribe,
};
