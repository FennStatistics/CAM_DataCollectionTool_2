import { $, toastr } from "../../app/vendor.js";
import { store } from "../../app/store.js";
import { COLOUR } from "../colours.js";

function initInteractionNodeDialog() {
    const interaction = `
<div class="properties" id="interactionNode">
<!-- delete node: -->
<div style="padding-bottom: 30px;">
    <button id="deleteNode" class="material-icons deleteButton" style="color:red;" title="Delete Concept">
        delete </button>
</div>

<!-- > adjust text -->
<div class="properties-align">
    <div class="properties-size-naming">
    ${store.language.nd_01}
    </div>
    <input id="inptextnode" type="text"
        style="width: 99%; text-align: left;   margin: auto; display: block;" autofocus>
</div>


<!-- > adjust type and strength of concept -->
<div class="properties-align">
    <div class="properties-size-naming">
    ${store.language.nd_02}
    </div>
</div>

<div class="outerNodeSlider" style="margin-bottom: 25px;">
    <div class="greenColorNodeSlider">
        <div class="yellowColorNodeSlider">
            <div class="redColorNodeSlider">
                <input type="range" min="1" max="7" step="1" id="nodeSlider" list="steplist">
            </div>
        </div>
    </div>
    <div class="labelsNodeSlider">
        <span>-3</span>
        <span>-2</span>
        <span>-1</span>
        <span>0</span>
        <span>1</span>
        <span>2</span>
        <span>3</span>
    </div>
</div>


<div id="hideAmvivalentNode" class="spacing-node">

    <input type="checkbox" id="checkboxAmbivalent" style="font-size: 20px;">
    <label for="checkboxAmbivalent" style="font-size: 16px; margin-left: 5px;">${store.language.nd_03} </label>

    <image type="image"
        src="./img/ambivalent_node.svg#svgView(viewBox(5,5,250,120))"
        style="width: 85px; height: 65px; margin-left: 5px; margin-top: 5px;"></image>

</div>




<!-- > adjust comment -->
<div class="properties-align">
    <div class="properties-size-naming">
    ${store.language.nd_04}
    </div>
    <textarea id="inpcommentnode" rows="4",
        style="width: 97%; text-align: left; margin: auto; display: block;"></textarea>
</div>

<!-- for researcher only -->
<div id="hideResearcherButtonsNode">
    <div style="margin-top: 20px; font-size:16px; font-style: italic;">
        The following functions are only available to researchers:
    </div>
    <div>
        <button id="ResErasabilityNode" type="button" class="typeResearcherButton">
            deletable
        </button>

        <button id="ResManoeuvrability" type="button" class="typeResearcherButton">
            movable
        </button>

        <button id="TextChangeableNode" type="button" class="typeResearcherButton">
         changeable
    </button>
    </div>
</div>
</div>`;

    var target = document.getElementById("dialogInteractionNode");
    target.innerHTML += interaction;

    // language file
    $(function () {
        document.getElementById("deleteNode").title = store.language.nd_05buttonDelete;
    });

    $(function () {
        $("#inptextnode").on("input", function () {
            var MaxNumWords = store.config.MaxNumWords;
            var MaxLengthChars = store.config.MaxLengthChars;

            if (store.cam.currentNode.isTextChangeable) {
                var numWords = this.value.split(" ").filter((word) => word != "");
                numWords = numWords.length;

                if (numWords <= MaxNumWords && this.value.length <= MaxLengthChars) {
                    store.cam.updateElement("Node", "text", this.value);
                    store.cam.draw();
                } else if (numWords > MaxNumWords) {
                    toastr.warning(
                        store.language.ndw_01tooManyWords,
                        store.language.ndw_02tooManyWords +
                            MaxNumWords +
                            store.language.ndw_03tooManyWords,
                        {
                            closeButton: true,
                            timeOut: 2000,
                            positionClass: "toast-top-center",
                            preventDuplicates: true,
                        }
                    );
                } else if (this.value.length > MaxLengthChars) {
                    toastr.warning(
                        store.language.ndw_01tooManyWords,
                        store.language.ndw_02tooManyWords +
                            MaxLengthChars +
                            store.language.ndw_03tooManyWordsA,
                        {
                            closeButton: true,
                            timeOut: 2000,
                            positionClass: "toast-top-center",
                            preventDuplicates: true,
                        }
                    );
                }
            } else {
                toastr.info(
                    store.language.ndw_01predefinedConcept,
                    store.language.ndw_02predefinedConcept,
                    {
                        closeButton: true,
                        timeOut: 2000,
                        positionClass: "toast-top-center",
                        preventDuplicates: true,
                    }
                );
            }
        });

        $("#nodeSlider").on("input", function () {
            var valenceValue = document.querySelector("#nodeSlider");

            var myGreenColorNodeSlider = document.querySelector(
                ".greenColorNodeSlider"
            );
            var myRedColorNodeSlider = document.querySelector(
                ".redColorNodeSlider"
            );

            switch (true) {
                case valenceValue.value == 4:
                    myRedColorNodeSlider.style.backgroundColor = COLOUR.red3;
                    myGreenColorNodeSlider.style.backgroundColor = COLOUR.green3;
                    store.cam.updateElement("Node", "value", 0);
                    break;

                case valenceValue.value <= 3:
                    const colourPaletteRed = [
                        "white",
                        COLOUR.red1,
                        COLOUR.red2,
                        COLOUR.red3,
                    ];
                    myRedColorNodeSlider.style.backgroundColor =
                        colourPaletteRed[valenceValue.value];
                    store.cam.updateElement("Node", "value", valenceValue.value - 4);
                    break;

                case valenceValue.value >= 5:
                    const colourPaletteGreen = [
                        "white",
                        COLOUR.green3,
                        COLOUR.green2,
                        COLOUR.green1,
                    ];
                    myGreenColorNodeSlider.style.backgroundColor =
                        colourPaletteGreen[valenceValue.value - 4];
                    store.cam.updateElement("Node", "value", valenceValue.value - 4);
                    break;
            }

            store.cam.draw();
        });

        $("#checkboxAmbivalent").on("click", function (event) {
            var myValueCheckbox = document.querySelector("#checkboxAmbivalent")
                .checked;

            if (myValueCheckbox === true) {
                toastr.info(store.language.ndw_01ambivalentConcept);
                store.ui.counterChangeAmbiConcept++;
                if (store.ui.counterChangeAmbiConcept == 2) {
                    $(this).off(event);
                }
            }
        });

        $("#checkboxAmbivalent").on("input", function () {
            var myValueCheckbox = document.querySelector("#checkboxAmbivalent")
                .checked;
            document.getElementById("nodeSlider").value = 4;

            if (myValueCheckbox === true) {
                document.getElementById("nodeSlider").disabled = true;
                store.cam.updateElement("Node", "value", 10);
            } else {
                document.getElementById("nodeSlider").disabled = false;
                store.cam.updateElement("Node", "value", 0);
            }
            store.cam.draw();
        });

        // > comment
        $("#inpcommentnode").on("input", function () {
            store.cam.updateElement("Node", "comment", this.value);
            store.cam.draw();
        });

        // > delete
        $("#deleteNode").on("click", () => {
            console.log("Deleted using botton");
            store.cam.currentNode.enterLog({
                type: "node was deleted",
                value: -99,
            });
            store.cam.deleteElement();

            $("#dialogInteractionNode").dialog("close");
        });

        $(document).keyup(function (e) {
            if (e.keyCode == 46) {
                if (store.cam.currentNode != null) {
                    console.log("Deleted using keypress");
                    store.cam.currentNode.enterLog({
                        type: "node was deleted",
                        value: -77,
                    });
                    store.cam.deleteElement();
                    $("#dialogInteractionNode").dialog("close");
                } else if (store.cam.currentConnector != null) {
                    console.log("Deleted using keypress");
                    store.cam.currentConnector.enterLog({
                        type: "connector was deleted",
                        value: -77,
                    });
                    store.cam.deleteElement();
                    $("#dialogInteractionEdge").dialog("close");
                }
            }
        });

        $("#ResErasabilityNode").on("click", () => {
            if (store.cam.currentNode != null) {
                if (store.cam.currentNode.isDeletable == true) {
                    store.cam.currentNode.setIsDeletable(false);
                    toastr.info("The node is now not deletable.");
                } else if (store.cam.currentNode.isDeletable == false) {
                    store.cam.currentNode.setIsDeletable(true);
                    toastr.info("The node is now deletable.");
                }
            }
        });

        $("#ResManoeuvrability").on("click", () => {
            if (store.cam.currentNode != null) {
                if (store.cam.currentNode.isDraggable == true) {
                    store.cam.currentNode.setIsDraggable(false);
                    toastr.info("The node is now not draggable.");
                } else if (store.cam.currentNode.isDraggable == false) {
                    store.cam.currentNode.setIsDraggable(true);
                    toastr.info("The node is now draggable.");
                }
            }
        });

        $("#TextChangeableNode").on("click", () => {
            if (store.cam.currentNode != null) {
                if (store.cam.currentNode.isTextChangeable == true) {
                    store.cam.currentNode.setIsTextChangeable(false);
                    toastr.info("The text of the node is now not changeable.");
                } else if (store.cam.currentNode.isTextChangeable == false) {
                    store.cam.currentNode.setIsTextChangeable(true);
                    toastr.info("The text of the node is now changeable.");
                }
            }
        });
    });

    // hide ambivalent nodes
    if (store.config.enableAmbivalent) {
        $("#hideAmvivalentNode").hide();
        $(function () {
            $("#hideAmvivalentNode").hide();
        });
    } else {
        $("#hideAmvivalentNode").show();
        $(function () {
            $("#hideAmvivalentNode").show();
        });
    }
}

export { initInteractionNodeDialog };
