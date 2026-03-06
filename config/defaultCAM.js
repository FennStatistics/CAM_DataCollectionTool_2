/* default CAM which will be redrawn if CAM is deleted
function shuffle(queslist) {
    let array_emp = [];
    for (var i = 0; i < queslist.length; i++) {
      array_emp.push(i);
    }
  
    let j, x;
    for (i = array_emp.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = array_emp[i];
      array_emp[i] = array_emp[j];
      array_emp[j] = x;
    }
    return array_emp;
  }

const ConceptsCAM = ["A1", "A2"];
const index_ConceptsCAM = shuffle(ConceptsCAM);
console.log("index_ConceptsCAM:", index_ConceptsCAM);
 */

import { NodeCAM } from "../src/js/backend/nodeCAM.js";
import { ConnectorCAM } from "../src/js/backend/connectorCAM.js";
import { IncreaseSliderIntensity } from "../src/js/app/constants.js";
import { store } from "../src/js/app/store.js";

function defaultCAM() {
  if (!store.flags.usingSupabase) {
    /* MAKE CHANGES: start*/

    store.cam.addElement(new NodeCAM(0, "Central Concept", {
      x: 650,
      y: 400
    }, false, false, false));


    /* MAKE Changes: end*/
/*

    CAM.addElement(new NodeCAM(0, "Central Concept", {
      x: 650,
      y: 400
    }, false, false, false));


    CAM.addElement(new NodeCAM(0, "concept2", {
      x: 800,
      y: 400
    }, false, false, false));

    var connector1 = new ConnectorCAM();
    connector1.establishConnection(CAM.nodes[0], CAM.nodes[1], IncreaseSliderIntensity, false);
    connector1.value = 1;
    connector1.isDeletable = false;
    CAM.addElement(connector1);
*/
  } else {
    // add nodes from fetched data
    store.env.camMother.nodes.forEach((element) => {
      element.kind = "Node";
      element.comment = "";
      element.eventLog = [];
      element.isActive = true;
      element.isConnectorSelected = false;
      element.isSelected = false;
      store.cam.importElement(element);
    });
    // add connectors from fetched data
    store.env.camMother.connectors.forEach((element) => {
      element.kind = "Connector";
      element.eventLog = "";
      store.cam.importElement(element);
    });
  }

  store.cam.draw();
}

export { defaultCAM };
