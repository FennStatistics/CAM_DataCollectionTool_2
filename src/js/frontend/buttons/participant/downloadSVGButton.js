import { $, toastr } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";
import { svgns } from "../../../app/constants.js";

function initDownloadSvgButton() {
    /* add button: */
    const dlButton = `<button id="saveCAMpicture" class="material-icons" onclick="onDownloadSVGfile()" title="Save CAM as picture" style="margin-right: 5px;">crop_original</button>`;
    var target = document.getElementById("rightButton");
    target.innerHTML += dlButton;

    // language file
    $(function () {
        document.getElementById("saveCAMpicture").title = store.language.btr_03;
    });

    function onDownloadSVGfile() {
        console.log("CAM picture (svg) has been saved");
        const svgEl = document.getElementById("CAMSVG");
        if (!svgEl) {
            return;
        }

        if (store.cam.creator != null) {
            downloadCAMsvg(svgEl, "CAMsvg-" + store.cam.creator + ".svg");
        } else {
            downloadCAMsvg(svgEl, "CAMsvg-" + store.cam.idCAM + ".svg");
        }

        if (!store.config.surpressSaveCAMpopup) {
            toastr.info(store.language.popSavePicture_CAM, {
                closeButton: true,
                timeOut: 4000,
                positionClass: "toast-top",
                preventDuplicates: true,
            });
        }
    }

    function downloadCAMsvg(svgEl, fileName) {
        svgEl.setAttribute("xmlns", svgns);

        /* adjust CAM picture if negative coordinates / svg to small */
        document.getElementById("CAMSVG").setAttribute("height", "1400px");
        document.getElementById("CAMSVG").setAttribute("width", "2400px");

        var condHitX = false;
        var condHitY = false;

        var arrayPosX = [];
        store.cam.nodes.forEach((element) => {
            arrayPosX.push(element.position.x);
        });

        if (arrayPosX.some((element) => element < 100)) {
            condHitX = true;
            store.cam.nodes.forEach((element) => {
                element.position.x =
                    element.position.x + (Math.abs(Math.min(...arrayPosX)) + 100);
            });

            store.cam.draw();
        } else {
            store.cam.nodes.forEach((element) => {
                element.position.x =
                    element.position.x - (Math.abs(Math.min(...arrayPosX)) - 100);
            });

            store.cam.draw();
        }

        var arrayPosY = [];
        store.cam.nodes.forEach((element) => {
            arrayPosY.push(element.position.y);
        });

        if (arrayPosY.some((element) => element < 100)) {
            condHitY = true;
            store.cam.nodes.forEach((element) => {
                element.position.y =
                    element.position.y + (Math.abs(Math.min(...arrayPosY)) + 100);
            });

            store.cam.draw();
        } else {
            store.cam.nodes.forEach((element) => {
                element.position.y =
                    element.position.y - (Math.abs(Math.min(...arrayPosY)) - 100);
            });

            store.cam.draw();
        }

        var svgData = svgEl.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], {
            type: "image/svg+xml;charset=utf-8",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(svgBlob);
        a.download = fileName;

        var img = document.createElement("img");
        img.src = a.href;
        a.click();

        /* REDO adjustments of CAM picture if negative coordinates / svg to small */
        document.getElementById("CAMSVG").setAttribute("height", "800px");
        document.getElementById("CAMSVG").setAttribute("width", "1300px");
        if (condHitX) {
            store.cam.nodes.forEach((element) => {
                element.position.x =
                    element.position.x - (Math.abs(Math.min(...arrayPosX)) + 100);
            });

            store.cam.draw();
        } else {
            store.cam.nodes.forEach((element) => {
                element.position.x =
                    element.position.x + (Math.abs(Math.min(...arrayPosX)) - 100);
            });

            store.cam.draw();
        }

        if (condHitY) {
            store.cam.nodes.forEach((element) => {
                element.position.y =
                    element.position.y - (Math.abs(Math.min(...arrayPosY)) + 100);
            });

            store.cam.draw();
        } else {
            store.cam.nodes.forEach((element) => {
                element.position.y =
                    element.position.y + (Math.abs(Math.min(...arrayPosY)) - 100);
            });

            store.cam.draw();
        }
    }

    window.onDownloadSVGfile = onDownloadSVGfile;
}

export { initDownloadSvgButton };
