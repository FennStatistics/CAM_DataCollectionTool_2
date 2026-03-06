import { jatosStub } from "./jatosStub.js";

const isJatosBuild = import.meta.env.MODE === "jatos";

function getJatos() {
    if (!isJatosBuild) {
        return jatosStub;
    }

    const hasWindow = typeof window !== "undefined";
    const jatos_window = hasWindow ? window.jatos : null;

    console.log("JATOS build:", isJatosBuild, "window.jatos:", jatos_window);
    console.log("window.jatos:", hasWindow ? window.jatos : "window not defined");

    if (jatos) {
        return jatos;
    }

    console.warn("JATOS build: window.jatos not found, using stub instead.");
    return jatosStub;
}

export { getJatos, isJatosBuild };
