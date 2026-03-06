import { jatosStub } from "./jatosStub.js";

function getJatos() {
    if (typeof window !== "undefined" && window.jatos) {
        return window.jatos;
    }
    return jatosStub;
}

export { getJatos };
