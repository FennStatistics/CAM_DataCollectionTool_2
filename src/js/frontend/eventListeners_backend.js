import { $ } from "../app/vendor.js";
import { store } from "../app/store.js";
import { IncreaseSliderIntensity, moveCAMSpeed } from "../app/constants.js";
import { COLOUR } from "./colours.js";
import { NodeCAM } from "../backend/nodeCAM.js";

function initEventListenersBackend() {

$(document).on("mousedown", ".node", function (event) {
    store.ui.arrayPositions = [];
    /* if double click */
    if (event.detail == 2) {
        store.cam.selecteNode($(this)[0].id);

        if (store.cam.currentNode != null) {
            // get text of current node
            document.getElementById("inptextnode").value =
                store.cam.currentNode.getText();
            // get comment of current node
            document.getElementById("inpcommentnode").value =
                store.cam.currentNode.getComment();
            // get value slider, hide / show graphics / change colors
            var backendGreenColorNodeSlider = document.querySelector(
                ".greenColorNodeSlider"
            );
            var backendRedColorNodeSlider = document.querySelector(
                ".redColorNodeSlider"
            );

            if (store.cam.currentNode.value == 0) {
                document.getElementById("nodeSlider").value = 4;

                document.getElementById("checkboxAmbivalent").checked = false;
                document.getElementById("nodeSlider").disabled = false;

                backendRedColorNodeSlider.style.backgroundColor = COLOUR.red3; // "hsl(0, 50%, 60%)";
                backendGreenColorNodeSlider.style.backgroundColor = COLOUR.green3; // "hsl(110, 50%, 60%)";
            } else if (store.cam.currentNode.value == 10) {
                document.getElementById("nodeSlider").value = 4;
                backendRedColorNodeSlider.style.backgroundColor = COLOUR.red3; // "hsl(0, 50%, 60%)";
                backendGreenColorNodeSlider.style.backgroundColor = COLOUR.green3; // "hsl(110, 50%, 60%)";

                document.getElementById("checkboxAmbivalent").checked = true;
                document.getElementById("nodeSlider").disabled = true;
            } else if (store.cam.currentNode.value < 0) {
                document.getElementById("checkboxAmbivalent").checked = false;
                document.getElementById("nodeSlider").disabled = false;
                if (store.cam.currentNode.value == -1) {
                    document.getElementById("nodeSlider").value = 3;
                    backendRedColorNodeSlider.style.backgroundColor = COLOUR.red3; // "hsl(0, 50%, 60%)";
                } else if (store.cam.currentNode.value == -2) {
                    document.getElementById("nodeSlider").value = 2;
                    backendRedColorNodeSlider.style.backgroundColor = COLOUR.red2; // "hsl(0, 50%, 50%)";
                } else if (store.cam.currentNode.value == -3) {
                    document.getElementById("nodeSlider").value = 1;
                    backendRedColorNodeSlider.style.backgroundColor = COLOUR.red1; // "hsl(0, 50%, 40%)";
                }
            } else if (
                store.cam.currentNode.value > 0 &&
                store.cam.currentNode.value <= 4
            ) {
                document.getElementById("checkboxAmbivalent").checked = false;
                document.getElementById("nodeSlider").disabled = false;
                if (store.cam.currentNode.value == 1) {
                    document.getElementById("nodeSlider").value = 5;
                    backendGreenColorNodeSlider.style.backgroundColor = COLOUR.green3; // "hsl(110, 50%, 60%)";
                } else if (store.cam.currentNode.value == 2) {
                    document.getElementById("nodeSlider").value = 6;
                    backendGreenColorNodeSlider.style.backgroundColor = COLOUR.green2; // "hsl(110, 50%, 50%)";
                } else if (store.cam.currentNode.value == 3) {
                    document.getElementById("nodeSlider").value = 7;
                    backendGreenColorNodeSlider.style.backgroundColor = COLOUR.green1;  // "hsl(110, 100%, 40%)";
                }
            }

            /* change position of pop up */
            if (store.cam.currentNode.position.x - 380 < 0) {
                var changeAtLeft = "left+" + (store.cam.currentNode.position.x + 70); // to far left position to right
            } else {
                var changeAtLeft = "left+" + (store.cam.currentNode.position.x - 360); // position to left
            }
            var changeAtTop = "top+" + (store.cam.currentNode.position.y - 10);

            $("#dialogInteractionNode").dialog("open");
        }
    } else {
        store.cam.readyToMove = true;
        resetConnectorSelection();
        store.cam.selecteNode($(this)[0].id);
    }

    store.cam.draw();
});

$(document).on("mouseup", ".node", function (event) {
    // save position data for only every 150px difference of X or Y
    var newArrX = [];
    var tmpArrayPosX = store.ui.arrayPositions[0];
    for (var i = 1; i < store.ui.arrayPositions.length; i++) {
        if (Math.abs(store.ui.arrayPositions[i].value.x - tmpArrayPosX.value.x) >= 150) {
            newArrX.push(1);
            tmpArrayPosX = store.ui.arrayPositions[i];
        } else {
            newArrX.push(0);
        }
    }
    newArrX.unshift(0);

    var newArrY = [];
    var tmpArrayPosY = store.ui.arrayPositions[0];
    for (var i = 1; i < store.ui.arrayPositions.length; i++) {
        if (Math.abs(store.ui.arrayPositions[i].value.y - tmpArrayPosY.value.y) >= 150) {
            newArrY.push(1);
            tmpArrayPosY = store.ui.arrayPositions[i];
        } else {
            newArrY.push(0);
        }
    }
    newArrY.unshift(0);

    var newArrayPositions = [];
    newArrayPositions.unshift(store.ui.arrayPositions[0]);

    // simple check that no 2 undefined entries are included (non-moved element)
    if (store.ui.arrayPositions.length > 2) {
        for (var i = 1; i < store.ui.arrayPositions.length; i++) {
            if (newArrX[i] == 1 || newArrY[i] == 1) {
                newArrayPositions.push(store.ui.arrayPositions[i]);
            }
        }

        newArrayPositions.forEach((element) => {
            store.cam.currentNode.eventLog.push(element);
        });
    }

    newArrayPositions.push(
        store.ui.arrayPositions[store.ui.arrayPositions.length - 1]
    );

    store.cam.readyToMove = false;
    if (store.cam.hasElementMoved) {
        resetConnectorSelection();
        resetNodeSelection();
        store.cam.hasElementMoved = false;
        store.cam.draw();
    }
});

/* for what these two event handlers??? */

$(document).on("click", ".connector", function (event) {
    resetConnectorSelection();
    resetNodeSelection();
    store.cam.selectConnection($(this)[0].id);

    store.cam.draw();
});

$(document).on("click", ".outer-connector", function (event) {
    resetConnectorSelection();
    resetNodeSelection();
    store.cam.selectConnection($(this)[0].id);

    store.cam.draw();
});

$(document).on("mousedown", ".connector, .outer-connector", function (event) {
    /* if double click */

    // console.log($(this)[0].id);

    if (event.detail == 2) {
        resetConnectorSelection();
        resetNodeSelection();
        store.cam.selectConnection($(this)[0].id);

        if (store.cam.currentConnector != null) {
            var backendGreenColorSlider = document.querySelector(
                ".greenConnectorColorSlider"
            );
            var backendGreenColorTick =
                document.querySelector(".greenColorTick");

            var backendRedColorSlider = document.querySelector(
                ".redColorConnectorSlider"
            );
            var backendRedColorTick = document.querySelector(".redColorTick");

            if (store.cam.currentConnector.agreement) {
                backendRedColorSlider.style.backgroundColor = "white";
                backendRedColorTick.style.backgroundColor = "white";

                document.getElementById("edgeSlider").value =
                    store.cam.currentConnector.getIntensity() /
                        IncreaseSliderIntensity +
                    3;
                if (document.getElementById("edgeSlider").value == 4) {
                    backendGreenColorSlider.style.backgroundColor =
                        "hsl(110, 100%, 70%)";
                    backendGreenColorTick.style.backgroundColor =
                        "hsl(110, 100%, 70%)";
                } else if (document.getElementById("edgeSlider").value == 5) {
                    backendGreenColorSlider.style.backgroundColor =
                        "hsl(110, 100%, 50%)";
                    backendGreenColorTick.style.backgroundColor =
                        "hsl(110, 100%, 50%)";
                }
                if (document.getElementById("edgeSlider").value == 6) {
                    backendGreenColorSlider.style.backgroundColor =
                        "hsl(110, 100%, 40%)";
                    backendGreenColorTick.style.backgroundColor =
                        "hsl(110, 100%, 40%)";
                }
            } else if (!store.cam.currentConnector.agreement) {
                backendGreenColorSlider.style.backgroundColor = "white";
                backendGreenColorTick.style.backgroundColor = "white";

                if (
                    store.cam.currentConnector.getIntensity() ==
                    IncreaseSliderIntensity
                ) {
                    document.getElementById("edgeSlider").value = 3;
                    backendRedColorSlider.style.backgroundColor =
                        "hsl(0, 100%, 70%)";
                    backendRedColorTick.style.backgroundColor =
                        "hsl(0, 100%, 70%)";
                } else if (
                    store.cam.currentConnector.getIntensity() ==
                    IncreaseSliderIntensity * 2
                ) {
                    document.getElementById("edgeSlider").value = 2;
                    backendRedColorSlider.style.backgroundColor =
                        "hsl(0, 100%, 50%)";
                    backendRedColorTick.style.backgroundColor =
                        "hsl(0, 100%, 50%)";
                } else if (
                    store.cam.currentConnector.getIntensity() ==
                    IncreaseSliderIntensity * 3
                ) {
                    document.getElementById("edgeSlider").value = 1;
                    backendRedColorSlider.style.backgroundColor =
                        "hsl(0, 100%, 40%)";
                    backendRedColorTick.style.backgroundColor =
                        "hsl(0, 100%, 40%)";
                }
            }

            /* change position of pop up */
            // > get current mother / daugther
            var currentMotherNode = store.cam.nodes.filter(
                (el) => el.id === store.cam.currentConnector.source
            )[0];
            var currentDaughterNode = store.cam.nodes.filter(
                (el) => el.id === store.cam.currentConnector.target
            )[0];
            // > get midpoint of connector
            var MeanPositionX =
                (currentMotherNode.position.x +
                    currentDaughterNode.position.x) /
                2;
            var MeanPositionY =
                (currentMotherNode.position.y +
                    currentDaughterNode.position.y) /
                2;

            if (MeanPositionX - 380 < 0) {
                var changeAtLeft = "left+" + (MeanPositionX + 40); // to far left position to right
            } else {
                var changeAtLeft = "left+" + (MeanPositionX - 340); // position to left
            }

            if (
                Math.abs(
                    currentMotherNode.position.x -
                        currentDaughterNode.position.x
                ) < 300
            ) {
                var changeAtTop = "top+" + (MeanPositionY - 130); // x = horizontal spacing less than 300
            } else {
                var changeAtTop = "top+" + MeanPositionY;
            }

            $("#dialogInteractionEdge").dialog("open");
        }

        store.cam.draw();
    }
});

$(document).on("click", "#background", function (event) {
    if (!(resetConnectorSelection() || resetNodeSelection())) {
        const positionClick = {
            x: event.clientX - $("#CAMSVG").position().left, // / zoomScale,
            y: event.clientY - $("#CAMSVG").position().top, // / zoomScale
        };

        store.cam.addElement(new NodeCAM(0, "", positionClick, 1, 1, 1));
    }

    store.cam.draw();
});

$(document).on("mousemove", "#CAMSVG", function (event) {
    const positionClick = {
        x: event.clientX - $("#CAMSVG").position().left, // / zoomScale,
        y: event.clientY - $("#CAMSVG").position().top, // / zoomScale
    };

    if (store.cam.readyToMove) {
        store.cam.hasElementMoved = true;
        store.cam.updateElement("Node", "position", positionClick);

        store.ui.arrayPositions.push({
            time: new Date(),
            type: "position",
            value: positionClick,
        });
    }

    store.cam.draw();
});

$(document).on("mouseup", "#CAMSVG", function (event) {
    if (store.cam.readyToMove) {
        store.cam.readyToMove = false;
        resetNodeSelection();
        store.cam.draw();
    }
});

}

function resetConnectorSelection() {
    if (store.cam.hasSelectedConnector) {
        store.cam.unselectConnection();
        return true;
    }
    return false;
}

function resetNodeSelection() {
    if (store.cam.hasSelectedNode) {
        store.cam.unselectNode();
        return true;
    }
    return false;
}

/* Add camera feature */
if (store.config.cameraFeature) {
    $(document).on("mouseover", "#background", function (event) {
        var positionMouse = {
            x: event.clientX - $("#CAMSVG").position().left, // / zoomScale,
            y: event.clientY - $("#CAMSVG").position().top, // / zoomScale
        };

        /*
       var arrayPosX = [];
        CAM.nodes.forEach(element => {
            arrayPosX.push(element.position.x)
        });
        /arrayPosX = arrayPosX.filter(element => element > 1900 || element < -300);
        */

        //console.log("positionMouse - X: ", positionMouse.x, "positionMouse - Y: ", positionMouse.y);
        //console.log("positionMouse.y: ", positionMouse.y);
        if (
            positionMouse.x < 20 ||
            positionMouse.x > 1280 ||
            positionMouse.y < 20 ||
            positionMouse.y > 740
        ) {
            //console.log("stopConY: ", stopConY);
            // $("body").css("cursor", "move");

            if (store.ui.stopConX > -500 && positionMouse.x > 1290) {
                store.cam.nodes.forEach((element) => {
                    element.position.x -= moveCAMSpeed;
                });
                store.ui.stopConX -= moveCAMSpeed;
            } else if (store.ui.stopConX < 500 && positionMouse.x < 10) {
                store.cam.nodes.forEach((element) => {
                    element.position.x += moveCAMSpeed;
                });
                store.ui.stopConX += moveCAMSpeed;
            }

            if (store.ui.stopConY > -250 && positionMouse.y > 755) {
                store.cam.nodes.forEach((element) => {
                    element.position.y -= moveCAMSpeed;
                });
                store.ui.stopConY -= moveCAMSpeed;
            } else if (store.ui.stopConY < 250 && positionMouse.y < 10) {
                store.cam.nodes.forEach((element) => {
                    element.position.y += moveCAMSpeed;
                });
                store.ui.stopConY += moveCAMSpeed;
            }

            store.cam.draw();
        } else {
            $("body").css("cursor", "default");
        }
    });
}

export { initEventListenersBackend, resetConnectorSelection, resetNodeSelection };
