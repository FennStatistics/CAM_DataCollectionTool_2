import { $, toastr } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";
import { webAddress } from "../../../../../config/configfile.js";
import {
    addElementsCy,
    bfsAlgorithm,
    cy,
} from "../../../processing/preprocessingCAM.js";
import {
    getActiveListNodes,
    getMeanValenceNodes,
} from "../../../processing/postprocessingCAM.js";
import { getJatos } from "../../../services/jatosAdapter.js";

function initSaveButton() {
    /* add button: */
    const saveButton = `<button id="saveCAM" onclick="saveCam()" class="material-icons" title="Save CAM on server" style="margin-right: 5px;">save</button>`;
    var target = document.getElementById("rightButton");
    target.innerHTML += saveButton;

    // language file
    $(function () {
        document.getElementById("saveCAM").title = store.language.btr_02;
        document.getElementById("dialogConfirmSave").title =
            store.language.confirmSaving_01_title;
    });

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf("?") !== -1 ? "&" : "?";

        if (uri.match(re)) {
            return uri.replace(re, "$1" + key + "=" + value + "$2");
        } else {
            return uri + separator + key + "=" + value;
        }
    }

    function saveCam() {
        var CAMnodes = store.cam.nodes.filter((element) => element.isActive === true);
        var CAMconnectors = store.cam.connectors.filter(
            (element) => element.isActive === true
        );

        // every concept should include text
        var CAMnodesNoText = CAMnodes.filter(
            (element) => element.text.length === 0
        );
        console.log(CAMnodesNoText);
        if (CAMnodesNoText.length > 0) {
            toastr.warning(
                store.language.popSave_01emptyNodes,
                CAMnodesNoText.length + store.language.popSave_02emptyNodes,
                {
                    closeButton: true,
                    timeOut: 2000,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                }
            );
            return false;
        }

        // every concept should include at least 3 characters
        var CAMnodesFewText = CAMnodes.filter(
            (element) => element.text.length < 3
        );

        if (CAMnodesFewText.length > 0) {
            toastr.warning(
                store.language.popSave_01insufficientCharsNodes,
                CAMnodesFewText.length +
                    store.language.popSave_02insufficientCharsNodes,
                {
                    closeButton: true,
                    timeOut: 2000,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                }
            );
            return false;
        }

        // necessary # of concepts
        if (CAMnodes.length < store.config.MinNumNodes) {
            toastr.warning(
                store.language.popSave_01numNodes,
                store.language.popSave_02numNodes +
                    store.config.MinNumNodes +
                    store.language.popSave_03numNodes,
                {
                    closeButton: true,
                    timeOut: 2000,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                }
            );
            return false;
        } else if (CAMnodes.length - 1 > CAMconnectors.length) {
            console.log("CAMconnectors.length: ", CAMconnectors.length);
            console.log("CAM.nodes.length: ", CAMnodes.length);

            toastr.warning(
                store.language.popSave_01unconnectedA,
                store.language.popSave_02unconnectedA,
                {
                    closeButton: true,
                    timeOut: 2000,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                }
            );

            return false;
        } else {
            addElementsCy();
            var ResbfsAl = bfsAlgorithm("#" + cy.nodes()[0].id());
            console.log("num of distinct components of CAM: ", ResbfsAl);

            if (ResbfsAl !== 1) {
                toastr.warning(
                    store.language.popSave_01unconnectedB,
                    store.language.popSave_02unconnectedB +
                        " " +
                        ResbfsAl +
                        store.language.popSave_03unconnectedB,
                    {
                        closeButton: true,
                        timeOut: 2000,
                        positionClass: "toast-top-center",
                        preventDuplicates: true,
                    }
                );

                return false;
            } else {
                // confirm saving
                $("#dialogConfirmSave").dialog("open");
            }
        }
    }

    function saveCAMsuccess() {
        toastr.success(store.language.popSave_01savedData, {
            closeButton: true,
            timeOut: 4000,
            positionClass: "toast-top-center",
            preventDuplicates: true,
        });

        // after 4 seconds
        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();

        delay(function () {
            // set defocus data
            if (store.config.fullScreen == true) {
                store.cam.defocusCAM = store.ui.defocusEvents;
            }

            /* if server is >>> JATOS <<< */
            console.log("usingJATOS: ", store.flags.usingJATOS);
            if (store.flags.usingJATOS) {
                const jatos = getJatos();
                console.log("jatos: ", jatos);

                // if an ID was sent via URL param overwrite CAM creator
                if (
                    Object.keys(jatos.urlQueryParameters).indexOf(
                        "participantID"
                    ) >= 0
                ) {
                    store.cam.creator = jatos.urlQueryParameters.participantID;
                } else {
                    store.cam.creator = "noID";
                }

                // If JATOS is available, send data there
                var resultJson = store.cam;
                console.log("my result data sent to JATOS first and final time");
                jatos
                    .submitResultData(resultJson)
                    .then(() => console.log("success"))
                    .catch(() => console.log("error"));

                // > with adaptive design
                if (store.config.AdaptiveStudy) {
                    var newUrl = updateQueryStringParameter(
                        store.config.ADAPTIVESTUDYurl,
                        "participantID",
                        store.cam.creator
                    );
                    jatos.endStudyAndRedirect(
                        newUrl,
                        true,
                        "everything worked fine"
                    );
                } else {
                    jatos.endStudy(true, "everything worked fine");
                }
            }

            /* if server is >>> MangoDB <<< */
            console.log("usingSupabase: ", store.flags.usingSupabase);
            if (store.flags.usingSupabase) {
                async function getData() {
                    const url = webAddress + "try";

                    const get = await fetch(url)
                        .then((response) => response.json())
                        .then((data) => console.log(data))
                        .catch((error) => console.error("Error:", error));
                }

                async function postData() {
                    const url = webAddress + "poststudy";
                    const headers = { "Content-Type": "application/json" };

                    console.log("postData");

                    var dateStart = new Date(store.cam.date);
                    var dateEnd = new Date();
                    var diffTime = Math.abs(dateEnd - dateStart);

                    const post = await fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            namestudy: store.env.nameStudy,
                            camid: store.cam.idCAM,
                            participantid: store.cam.creator,
                            datestart: dateStart,
                            dateend: dateEnd,
                            datediff:
                                Math.round((diffTime / 1000 / 60) * 100) / 100,
                            numconcepts: store.cam.nodes.length,
                            numconnectors: store.cam.connectors.length,
                            avgvalence: getMeanValenceNodes(getActiveListNodes()),
                            cam: store.cam,
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => console.log(data))
                        .catch((error) => console.error("Error:", error));

                    window.location =
                        store.env.linkRedirect +
                        "?participantID=" +
                        store.cam.creator;
                }
                postData();

                async function postData2() {
                    const url = webAddress + "try";
                    const headers = { "Content-Type": "application/json" };

                    console.log("postData");
                    const post = await fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            name: "France",
                            cam: store.cam,
                            welcomeYourGirl: "Hello Sarah",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => console.log(data))
                        .catch((error) => console.error("Error:", error));
                }
                //postData2()
            }

            /* if NO server >>> <<< */
            if (!store.flags.usingJATOS && !store.flags.usingSupabase) {
                toastr.success(store.language.popSave_01notSavedData, {
                    closeButton: true,
                    timeOut: 4000,
                    positionClass: "toast-top-center",
                    preventDuplicates: true,
                });
            }
        }, 4000); // end delay
    }

    window.saveCam = saveCam;
    window.saveCAMsuccess = saveCAMsuccess;
}

export { initSaveButton };
