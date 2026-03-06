import { store, updateFlags } from "../app/store.js";

async function applyConfigFromSupabase() {
    if (!store.flags.usingSupabase) {
        return;
    }

    async function fetchData(URL) {
        const dataRaw = await fetch(URL);
        console.log("dataRaw", dataRaw);
        if (dataRaw.status != 200) {
            console.log(dataRaw.status);
            return;
        }

        updateFlags({ usingSupabase: true });
        const data = await dataRaw.json();
        console.log("data", data.configCAM);

        Object.assign(store.config, data.configCAM);
        console.log("config within: ", store.config);
    }

    const queryString2 = window.location.search;
    const urlParams2 = new URLSearchParams(queryString2);
    const link2 = urlParams2.get("link");

    if (link2) {
        await fetchData(link2);
    }

    console.log("config outer: ", store.config);
}

export { applyConfigFromSupabase };
