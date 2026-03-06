import { $ } from "../app/vendor.js";
import { store } from "../app/store.js";
import { resetNodeSelection } from "./eventListeners_backend.js";

function initEventListenersFrontend() {

// only add to event log if value has been changed:
var currentText = null;
var currentValue = null;
var currentComment = null;

$(function () {
    // starting dialog
    $("#dialogStart").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 400,
        maxWidth: 400,
        height: "auto",
        buttons: [
            {
                id: "CloseButton",
                click: function () {
                    console.log("clicked close button");
                    $(this).dialog("close");
                },
            },
        ],
        open: function (event, ui) {
            $(".ui-dialog-titlebar").show(); // hide titlebar
            $(this)
                .dialog({
                    draggable: false,
                })
                .parent()
                .draggable(); // see: https://stackoverflow.com/questions/6410720/jquery-ui-dialog-draggable-on-entire-dialog-not-just-title

            $(".ui-widget-overlay").on("click", function () {
                $("#dialogStart").dialog("close");
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");
        },
        position: {
            my: "center", // add percentage offsets
            at: "center",
            of: $(".boxCAMSVG"),
        },
    });
    $("#CloseButton").button("option", "label", store.language.closeButton);

    // reminder dialog
    $("#dialogReminder").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 400,
        maxWidth: 400,
        height: "auto",

        open: function (event, ui) {
            $(".ui-dialog-titlebar").show(); // hide titlebar
            $(this)
                .dialog({
                    draggable: false,
                })
                .parent()
                .draggable(); // see: https://stackoverflow.com/questions/6410720/jquery-ui-dialog-draggable-on-entire-dialog-not-just-title

            $(".ui-widget-overlay").on("click", function () {
                $("#dialogReminder").dialog("close");
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");
        },
        position: {
            my: "center", // add percentage offsets
            at: "center",
            of: $(".boxCAMSVG"),
        },
    });

    // dialog confirm save START
    $("#dialogConfirmSave").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 400,
        maxWidth: 400,
        height: "auto",

        open: function (event, ui) {
            $(".ui-dialog-titlebar").show(); // hide titlebar
            $(this)
                .dialog({
                    draggable: false,
                })
                .parent()
                .draggable(); // see: https://stackoverflow.com/questions/6410720/jquery-ui-dialog-draggable-on-entire-dialog-not-just-title

            $(".ui-widget-overlay").on("click", function () {
                $("#dialogConfirmSave").dialog("close");
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");
        },
        buttons: [
            {
                id: "YesButtonConfirm",
                click: function () {
                    console.log("clicked dialogConfirmSave Yes");
                    saveCAMsuccess();
                    $("#dialogConfirmSave").dialog("close");
                },
            },
            {
                id: "NoButtonConfirm",
                click: function () {
                    console.log("clicked dialogConfirmSave No");
                    $("#dialogConfirmSave").dialog("close");
                },
            },
        ],
        position: {
            my: "center", // add percentage offsets
            at: "center",
            of: $(".boxCAMSVG"),
        },
    });

    $("#YesButtonConfirm").button("option", "label", store.language.yesButton);
    $("#NoButtonConfirm").button("option", "label", store.language.noButton);
    // dialog confirm save END

    $("#dialogReference").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 400,
        maxWidth: 400,
        /*
        buttons: {
            Close: function () {
                $(this).dialog("close");
            }
        },
        */
        open: function (event, ui) {
            $(".ui-dialog-titlebar").show(); // show titlebar
            console.log("dialog got open");

            $(".ui-widget-overlay").on("click", function () {
                // .bind
                $("#dialogReference").dialog("close");
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");
            closeTab();
        },
        position: {
            my: "right-1% top+5%", // add percentage offsets
            at: "right-1% top+5%",
            of: $(".boxCAMSVG"),
        },
    });

    // next add the onclick handler
    $("#quickref").on("click", () => {
        $("#dialogReference").dialog("open");
        return false;
    });

    $("#dialogInteractionEdge").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 310,
        maxWidth: 310,
        height: "auto",
        open: function (event, ui) {
            $(".ui-dialog-titlebar").hide(); // hide titlebar
            $(this)
                .dialog({
                    draggable: false,
                })
                .parent()
                .draggable(); // see: https://stackoverflow.com/questions/6410720/jquery-ui-dialog-draggable-on-entire-dialog-not-just-title

            store.cam.currentConnector.isSelected = true;

            console.log("dialog connector got open");
            $(".ui-widget-overlay").on("click", function () {
                // .bind
                $("#dialogInteractionEdge").dialog("close");
            });

            store.cam.currentConnector.enterLog({
                type: "selected",
                value: true,
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");

            // if connector got deleted
            if (store.cam.currentConnector !== null) {
                store.cam.currentConnector.isSelected = false;
                store.cam.draw();

                if (store.cam.currentConnector.agreement) {
                    store.cam.currentConnector.enterLog({
                        type: "change intensity of connector",
                        value: store.cam.currentConnector.intensity,
                    });
                } else {
                    store.cam.currentConnector.enterLog({
                        type: "change intensity of connector",
                        value: store.cam.currentConnector.intensity * -1,
                    });
                }

                store.cam.currentConnector.enterLog({
                    type: "selected",
                    value: false,
                });
            }
        },
        position: {
            my: "right-0.5% top+3.5%", // add percentage offsets
            at: "right-0.5% top+3.5%",
            of: $(".boxCAMSVG"),
        },
    });

    $("#dialogInteractionNode").dialog({
        autoOpen: false,
        modal: true,
        show: "fade",
        hide: false,
        resizable: false,
        draggable: true,
        width: 310,
        maxWidth: 310,
        open: function (event, ui) {
            $(".ui-dialog-titlebar").hide(); // hide titlebar
            $(this)
                .dialog({
                    draggable: false,
                })
                .parent()
                .draggable();

            store.cam.currentNode.isSelected = true;

            store.cam.currentNode.enterLog({
                type: "selected",
                value: true,
            });

            // only add to event log if value has been changed:
            currentText = store.cam.currentNode.getText();
            currentValue = store.cam.currentNode.getValue();
            currentComment = store.cam.currentNode.getComment();

            console.log("dialog got open");

            //setTimeout("$('#dialogInteractionNode').dialog('close')",5000);

            $(".ui-widget-overlay").on("click", function () {
                $("#dialogInteractionNode").dialog("close");
            });
        },
        close: function (event, ui) {
            console.log("dialog got closed");

            /*        */
            // if node got deleted
            if (store.cam.currentNode !== null) {
                store.cam.currentNode.isSelected = false;
                store.cam.draw();

                // adjust event Log
                if (currentText !== store.cam.currentNode.getText()) {
                    store.cam.currentNode.enterLog({
                        type: "text",
                        value: store.cam.currentNode.getText(),
                    });
                }

                if (currentValue !== store.cam.currentNode.getValue()) {
                    store.cam.currentNode.enterLog({
                        type: "value",
                        value: store.cam.currentNode.getValue(),
                    });
                }

                if (currentComment !== store.cam.currentNode.getComment()) {
                    store.cam.currentNode.enterLog({
                        type: "comment",
                        value: store.cam.currentNode.getComment(),
                    });
                }

                store.cam.currentNode.enterLog({
                    type: "selected",
                    value: false,
                });

                // reset node selection
                resetNodeSelection();
            }
        },
        position: {
            my: "right-0.5% top+3.5%", // add percentage offsets
            at: "right-0.5% top+3.5%",
            of: $(".boxCAMSVG"),
        },
    });
});

/* interactive components: INFORMATION */
// > open single div using navigation bar
function openTab(evt, QRname) {
    $("#informationDefault").hide();

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(QRname).style.display = "block";
    evt.currentTarget.className += " active";
}

// > closing active div clicking on cross topright
function closeTab() {
    $("#informationDefault").show();

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}

window.openTab = openTab;
window.closeTab = closeTab;
}

export { initEventListenersFrontend };
