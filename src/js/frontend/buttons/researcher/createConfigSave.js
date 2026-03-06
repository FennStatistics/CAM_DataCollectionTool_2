import { $ } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";

function initCreateConfigSave() {
    /* add button: */
    const createConfigSave = `
<span style="font-size: 12px; vertical-align: super; margin-left: 5px;">to set up your study click:</span>
<button id="createConfigSave" title="set up your config file and cope & paste the resulting code to set up the experiment" class="material-icons" style="margin-left: 0px; margin-right: -5px">settings</button>
`;
    var target = document.getElementById("hideResearcherButtonsTop");
    target.innerHTML += createConfigSave;

    /* add dialog window */
    const interactionSetUpStudy = `
<div class="properties">
    <!-- > adjust text -->
    <div class="properties-align">
        <div class="properties-size-naming" style="font-size:18px;">
            Define the configuration of your CAM study:
        </div>
        <div class="row" style="background-color:#aaa;">
            <div class="column1">
                Number of nodes necessary to draw (about 10 recommended):
            </div>
            <div class="column2">
            <input type="number" id="setMinNumNodes" min="1" max="50" style="width: 60%; margin-top: 14px;" value="10">
            </div>
        </div>
        <div class="row" style="background-color:#bababa;">
            <div class="column1">
                Maximum number of words for each concept (2-3 recommended):
            </div>
            <div class="column2">
                <input type="number" id="setMaxNumWords" min="1" max="5" style="width: 60%; margin-top: 10px;" value="3">
            </div>
        </div>
        <div class="row" style="background-color:#aaa;">
            <div class="column1">
                Maximum number of characters for each concept (at least 30 recommended):
            </div>
            <div class="column2">
                <input type="number" id="setMaxLengthChars" min="30" max="300" style="width: 60%; margin-top: 10px;" value="30">
            </div>
        </div>

        <div class="row" style="background-color:#bababa;">
            <div class="column1">
                Possibility to draw arrows / directed connections:
            </div>
            <div class="column2">
                <label class="switch" style="margin-top: 8px;">
                <input type="checkbox" id="setenableArrows" checked>
                <div class="slider round">
                </div>
                </label>
            </div>
        </div>

        <div class="row" style="background-color:#aaa;">
            <div class="column1">
                As default the drawn connection is bidirectional:
            </div>
            <div class="column2">
                <label class="switch" style="margin-top: 8px;">
                <input type="checkbox" id="setBidirectionalDefault" checked>
                <div class="slider round">
                </div>
                </label>
            </div>
        </div>

        <div class="row" style="background-color:#bababa;">
            <div class="column1">
                Possibility to draw only supporting connections (no recommendation):
            </div>
            <div class="column2">
                <label class="switch" style="margin-top: 8px;">
                <input type="checkbox" id="setOnlyStraightCon">
                <div class="slider round">
                </div>
                </label>
            </div>
        </div>

        <div class="row" style="background-color:#aaa;">
            <div class="column1">
                Possibility to to draw ambivalent nodes (no recommendation):
            </div>
            <div class="column2">
                <label class="switch" style="margin-top: 8px;">
                <input type="checkbox" id="setenableAmbivalent" checked>
                <div class="slider round">
                </div>
                </label>
            </div>
        </div>
        
        <div class="row" style="background-color:#bababa;">
            <div class="column1">
                Include splotlight feature to move screen (only recommended if large CAMs are expected):
            </div>
            <div class="column2">
                <label class="switch" style="margin-top: 8px;">
                <input type="checkbox" id="setcameraFeature">
                <div class="slider round">
                </div>
                </label>
            </div>
        </div>

        <div class="row" style="background-color:#aaa;">
        <div class="column1">
            Set study to fullscreen mode and collect paradata (recommended):
        </div>
        <div class="column2">
            <label class="switch" style="margin-top: 8px;">
            <input type="checkbox" id="setfullScreen" checked>
            <div class="slider round">
            </div>
            </label>
        </div>
    </div>

    <div class="row" style="background-color:#bababa;">
        <div class="column1">
            Set the language of the Data Collection Tool interface:
        </div>
    <div class="column2">
        <label class="switch" style="margin-top: 8px;">
            <select name="setLanguage" id="setLanguage">
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Spanish">Spanish</option>
            <option value="Chinese">Chinese</option>
            </select> 
        </label>
    </div>
    </div>
    <br>
    <div class="properties-align" style="font-size: 15px;">
       After you have set the configuration click button and copy & paste the code (JSON file) to the administrative:
    </div>
    <div class="centerCopyPaste">
    <button onclick="copyText()" style="height: 45px; width: 75px;">Copy text</button>
    </div>

    <br>
    <div class="properties-align" style="font-size: 15px; font-style: italic;">
    You have generated the following code (! do not change the text except you really know what you are doing):
<textarea id="createdConfigPlusCAM"
    style="width: 97%; text-align: left; margin: auto; display: block;"></textarea>
</div>
</div>
</div>`;

    var dialogTarget = document.getElementById("dialogSetUpStudy");
    dialogTarget.innerHTML += interactionSetUpStudy;

    function copyText() {
        var copyText = document.getElementById("createdConfigPlusCAM");
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
        alert("Copied the text: " + copyText.value);
    }

    function setConfigCAMfile() {
        var setCAMConfig = {
            config: {
                MinNumNodes: $("#setMinNumNodes").val(),
                MaxNumWords: $("#setMaxNumWords").val(),
                MaxLengthChars: $("#setMaxLengthChars").val(),

                enableArrows: null,
                BidirectionalDefault: null,

                OnlyStraightCon: null,

                enableAmbivalent: null,
                cameraFeature: null,
                fullScreen: null,

                setLanguage: $("#setLanguage").val(),

                /* default: */
                LengthSentence: 16,
                LengthWords: 12,
                ShowResearcherButtons: false,
            },
            CAM: {
                nodes: null,
                connectors: null,
            },
        };

        if ($("#setenableArrows").is(":checked")) {
            setCAMConfig.config.enableArrows = false;
        } else {
            setCAMConfig.config.enableArrows = true;
        }

        if ($("#setBidirectionalDefault").is(":checked")) {
            setCAMConfig.config.BidirectionalDefault = true;
        } else {
            setCAMConfig.config.BidirectionalDefault = false;
        }

        if ($("#setenableAmbivalent").is(":checked")) {
            setCAMConfig.config.enableAmbivalent = false;
        } else {
            setCAMConfig.config.enableAmbivalent = true;
        }

        if ($("#setOnlyStraightCon").is(":checked")) {
            setCAMConfig.config.OnlyStraightCon = true;
        } else {
            setCAMConfig.config.OnlyStraightCon = false;
        }

        if ($("#setcameraFeature").is(":checked")) {
            setCAMConfig.config.cameraFeature = true;
        } else {
            setCAMConfig.config.cameraFeature = false;
        }

        if ($("#setfullScreen").is(":checked")) {
            setCAMConfig.config.fullScreen = true;
        } else {
            setCAMConfig.config.fullScreen = false;
        }

        /* set up the CAM */
        // nodes
        let saveNodes = [];
        for (var i = 0; i < store.cam.nodes.length; i++) {
            var elementNode = store.cam.nodes[i];
            var currentNode = {
                id: null,
                value: null,
                text: null,
                position: null,
                isDeletable: null,
                isDraggable: null,
                isTextChangeable: null,
            };

            if (elementNode.isActive) {
                currentNode.id = elementNode.getId();
                currentNode.value = elementNode.getValue();
                currentNode.text = elementNode.getText();
                currentNode.position = elementNode.getPosition();
                currentNode.isDeletable = elementNode.getIsDeletable();
                currentNode.isDraggable = elementNode.getIsDraggable();
                currentNode.isTextChangeable = elementNode.getIsTextChangeable();
                saveNodes.push(currentNode);
            }
        }
        setCAMConfig.CAM.nodes = saveNodes;

        // connectors
        let saveConnectors = [];
        for (var i = 0; i < store.cam.connectors.length; i++) {
            var elementConnector = store.cam.connectors[i];
            var currentConnector = {
                id: null,
                intensity: null,
                agreement: null,
                isBidirectional: null,
                source: null,
                target: null,
                isDeletable: null,
            };

            if (elementConnector.isActive) {
                currentConnector.id = elementConnector.getId();
                currentConnector.intensity = elementConnector.getIntensity();
                currentConnector.agreement = elementConnector.agreement;
                currentConnector.isBidirectional = elementConnector.isBidirectional;
                currentConnector.source = elementConnector.source;
                currentConnector.target = elementConnector.target;
                currentConnector.isDeletable = elementConnector.getIsDeletable();

                saveConnectors.push(currentConnector);
            }
        }
        setCAMConfig.CAM.connectors = saveConnectors;

        $("#createdConfigPlusCAM").text(JSON.stringify(setCAMConfig, null, 1));
    }

    $(function () {
        /* set up dialog */
        $("#dialogSetUpStudy").dialog({
            autoOpen: false,
            modal: true,
            show: "fade",
            hide: false,
            resizable: false,
            draggable: true,
            width: 460,
            maxWidth: 460,
            open: function () {
                $(".ui-dialog-titlebar").hide();
                $(this)
                    .dialog({
                        draggable: false,
                    })
                    .parent()
                    .draggable();

                console.log("dialog got open");

                $(".ui-widget-overlay").on("click", function () {
                    $("#dialogSetUpStudy").dialog("close");
                });
            },
            close: function () {
                console.log("dialog got closed");
            },
            position: {
                my: "center",
                at: "center",
                of: $(".boxCAMSVG"),
            },
        });

        $("#createConfigSave").on("click", () => {
            $("#dialogSetUpStudy").dialog("open");
            setConfigCAMfile();
        });

        $(
            "#setenableArrows, #setBidirectionalDefault, #setfullScreen, #setenableAmbivalent, #setOnlyStraightCon, #setcameraFeature"
        ).click(function () {
            setConfigCAMfile();
        });

        $("#setMinNumNodes,#setMaxNumWords, #setMaxLengthChars, #setLanguage").change(
            function () {
                setConfigCAMfile();
            }
        );
    });

    window.copyText = copyText;
}

export { initCreateConfigSave };
