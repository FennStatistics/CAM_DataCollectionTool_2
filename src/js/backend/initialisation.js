import { store, updateEnv } from "../app/store.js";
import { defaultCAM } from "../../../config/defaultCAM.js";

async function initCAMFromSource() {
    if (store.flags.usingSupabase) {
        async function fetchData(URL) {
            console.log("URL:", URL);
            const dataRaw = await fetch(URL);
            if (dataRaw.status != 200) {
                console.log(dataRaw.status);
                defaultCAM();
                return;
            }
            const data = await dataRaw.json();

            updateEnv({
                camMother: data.defaultCAM,
                linkRedirect: data.redirectLink,
                nameStudy: data.nameStudy,
            });
            Object.assign(store.config, data.configCAM);

            store.env.camMother.nodes.forEach((element) => {
                element.kind = "Node";
                element.comment = "";
                element.eventLog = [];
                element.isActive = true;
                element.isConnectorSelected = false;
                element.isSelected = false;
                element.date = new Date().getTime();
                store.cam.importElement(element);
            });

            store.env.camMother.connectors.forEach((element) => {
                console.log("element - init.js", element);
                element.kind = "Connector";
                element.eventLog = "";
                store.cam.importElement(element);
            });

            for (let i = 0; i < store.cam.connectors.length; i++) {
                store.cam.connectors[i].agreement =
                    store.env.camMother.connectors[i].agreement;
                store.cam.connectors[i].isBidirectional =
                    store.env.camMother.connectors[i].isBidirectional;
                store.cam.connectors[i].isDeletable =
                    store.env.camMother.connectors[i].isDeletable;
            }
            store.cam.draw();
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const link = urlParams.get("link");
        const participantID = urlParams.get("participantID");
        if (participantID) {
            store.cam.creator = participantID;
        }

        if (link && participantID) {
            await fetchData(link + "&participantID=" + participantID);
        }
        return;
    }

    console.log("default CAM drawn - Supabase is not used");
    defaultCAM();
}

export { initCAMFromSource };
