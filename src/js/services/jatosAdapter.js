import { jatosStub } from "./jatosStub.js";

function getJatos() {
    if (jatos) {
        console.log("JATOS found, using it.");
        return jatos;
    } else {
        console.warn("JATOS not found, using stub instead.");
        return jatosStub;
    }
}

export { getJatos };