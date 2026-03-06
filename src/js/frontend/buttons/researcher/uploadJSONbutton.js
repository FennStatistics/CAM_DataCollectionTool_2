import { $ } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";
import { NodeCAM } from "../../../backend/nodeCAM.js";
import { ConnectorCAM } from "../../../backend/connectorCAM.js";

console.log("loaded upload button!!!")

/* add button: */
const uploadJSONButton = `<button class="material-icons" onclick="document.getElementById('fileToLoad').click();" title="Upload CAM from file">vertical_align_top</button>
<input type='file' id="fileToLoad" style="display:none">`;
var target = document.getElementById("hideResearcherButtonsTop");
target.innerHTML += uploadJSONButton;


/* > upload CAM as JSON file
adjusted: https://stackoverflow.com/questions/36127648/uploading-a-json-file-and-using-it
https://stackoverflow.com/questions/23344776/how-to-access-data-of-uploaded-json-file
https://stackoverflow.com/questions/31746837/reading-uploaded-text-file-contents-in-html */
$(document).on("change", "#fileToLoad", async function (event) {
    console.log("File input changed!");  // <--- Add this
    // delete former CAM
    store.cam.connectors = [];
    store.cam.nodes = [];
    store.cam.draw();
    console.log("complete CAM has been deleted");

    /* get file list */
    var fileToLoad = document.getElementById("fileToLoad").files; // [0]
    //console.log("file to load: ", fileToLoad)
    // console.log("fileToLoad:", fileToLoad);
    /* parse to JSON file */
    var jsonObj = await fileToJSON(fileToLoad);
    console.log("file to load parsed: ", jsonObj);
    //console.log("file to load parsed length nodes: ", jsonObj.nodes.length);

    // add CAM information:
    store.cam.idCAM = jsonObj.idCAM;
    store.cam.creator = jsonObj.creator;
    store.cam.projectCAM = jsonObj.projectCAM;

    /* draw CAM */
    let arrayIDs = [];
    let counter = 0;
    for (var i = 0; i < jsonObj.nodes.length; i++) {
        var elementNode = jsonObj.nodes[i];
        //console.log(elementNode);

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
            // CAM.nodes[i].id = elementNode.id; // add ID of former node
            // CAM.nodes[i].isDraggable = true; // moveable
            arrayIDs.push(elementNode.id);
        }
    }

    // draw connectors
    for (var i = 0; i < jsonObj.connectors.length; i++) {
        //CAM.nodes.match(elt => elt.id ===     jsonObj.connectors[0].source)
        var elementConnector = jsonObj.connectors[i];
        //console.log(elementConnector);

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


/*
function fileToJSON(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsText(file.item(0));
    });
}
*/
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
