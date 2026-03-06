import { $, toastr } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";
import { defaultCAM } from "../../../../../config/defaultCAM.js";

function initDeleteButton() {
    /* add button: */
    const buttonDelete = `<button id="deleteCAM" class="material-icons" style="color:red;" title="Delete CAM" onclick="deleteCam()"> delete</button>`;
    var target = document.getElementById("rightButton");
    target.innerHTML += buttonDelete;

    // language file
    $(function () {
        document.getElementById("deleteCAM").title = store.language.btr_04;
    });

    function deleteCam() {
        let confirmdel = confirm(store.language.confirmDeleting_01text);
        if (confirmdel == true) {
            store.cam.connectors = [];
            store.cam.nodes = [];
            toastr.error(store.language.confirmDeleting_02message);
            console.log("complete CAM has been deleted");

            defaultCAM();
        }
    }

    window.deleteCam = deleteCam;
}

export { initDeleteButton };
