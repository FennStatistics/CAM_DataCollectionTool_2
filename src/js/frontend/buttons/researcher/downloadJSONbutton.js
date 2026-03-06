import { toastr } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";

function initDownloadJsonButton() {
    /* add button: */
    const downloadJSONButton = `<button class="material-icons" onclick="onDownloadCAMdata()" title="Save CAM as file" style="margin-left: 5px; margin-right: 5px;">vertical_align_bottom</button>`;
    var target = document.getElementById("hideResearcherButtonsTop");
    target.innerHTML += downloadJSONButton;

    function downloadCAMdata(content, fileName, contentType) {
        const a = document.createElement("a");
        const file = new Blob([content], {
            type: contentType,
        });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    function onDownloadCAMdata() {
        console.log("CAM data has been saved");
        downloadCAMdata(
            JSON.stringify(store.cam),
            "CAMdataJSON-" + store.cam.idCAM + ".txt",
            "text/plain"
        );

        toastr.info("You can save your CAM as a data file (JSON file).");
    }

    window.onDownloadCAMdata = onDownloadCAMdata;
}

export { initDownloadJsonButton };
