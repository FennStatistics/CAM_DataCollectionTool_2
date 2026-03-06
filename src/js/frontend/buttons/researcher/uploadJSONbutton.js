import { $ } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";
import { NodeCAM } from "../../../backend/nodeCAM.js";
import { ConnectorCAM } from "../../../backend/connectorCAM.js";

function initUploadJsonButton() {
    console.log("loaded upload button!!!");

    /* add button: */
    const uploadJSONButton = `<button class="material-icons" onclick="document.getElementById('fileToLoad').click();" title="Upload CAM from file">vertical_align_top</button>
<input type='file' id="fileToLoad" style="display:none">`;
    var target = document.getElementById("hideResearcherButtonsTop");
    target.innerHTML += uploadJSONButton;

    $(document).on("change", "#fileToLoad", async function () {
        console.log("File input changed!");
        // delete former CAM
        store.cam.connectors = [];
        store.cam.nodes = [];
        store.cam.draw();
        console.log("complete CAM has been deleted");

        /* get file list */
        var fileToLoad = document.getElementById("fileToLoad").files;
        var jsonObj = await fileToJSON(fileToLoad);
        console.log("file to load parsed: ", jsonObj);

        // add CAM information:
        store.cam.idCAM = jsonObj.idCAM;
        store.cam.creator = jsonObj.creator;
        store.cam.projectCAM = jsonObj.projectCAM;

        /* draw CAM */
        let arrayIDs = [];
        let counter = 0;
        for (var i = 0; i < jsonObj.nodes.length; i++) {
            var elementNode = jsonObj.nodes[i];

            if (elementNode.isActive) {
                store.cam.addElement(
                    new NodeCAM(
                        elementNode.value,
                        elementNode.text,
                        {
                            x: elementNode.position.x,
                            y: elementNode.position.y,
                        },
                        elementNode.isDraggable,
                        elementNode.isDeletable,
                        elementNode.isTextChangeable
                    )
                );

                store.cam.nodes[counter].id = elementNode.id;
                counter++;
                arrayIDs.push(elementNode.id);
            }
        }

        // draw connectors
        for (var i = 0; i < jsonObj.connectors.length; i++) {
            var elementConnector = jsonObj.connectors[i];

            if (elementConnector.isActive) {
                var connector1 = new ConnectorCAM();

                connector1.establishConnection(
                    store.cam.nodes[arrayIDs.indexOf(elementConnector.source)],
                    store.cam.nodes[arrayIDs.indexOf(elementConnector.target)],
                    elementConnector.intensity * 1,
                    elementConnector.agreement
                );
                connector1.isBidirectional = elementConnector.isBidirectional;
                connector1.isDeletable = elementConnector.isDeletable;
                store.cam.addElement(connector1);
            }
        }
        // draw CAM
        store.cam.draw();
    });

    function fileToJSON(file) {
        return new Promise((resolve, reject) => {
            if (!file || file.length === 0) {
                const errorMsg = "No file selected or file is undefined.";
                console.error(errorMsg);
                alert(errorMsg);
                return reject(new Error(errorMsg));
            }

            const fileReader = new FileReader();

            fileReader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    resolve(json);
                } catch (parseError) {
                    console.error("Error parsing JSON:", parseError);
                    alert("The file is not a valid JSON. Please upload a properly formatted file.");
                    reject(parseError);
                }
            };

            fileReader.onerror = (error) => {
                console.error("File reading failed:", error);
                alert("There was an error reading the file. Please try again.");
                reject(error);
            };

            try {
                fileReader.readAsText(file.item(0));
            } catch (fileError) {
                console.error("Error reading file:", fileError);
                alert("Failed to read the selected file.");
                reject(fileError);
            }
        });
    }
}

export { initUploadJsonButton };
