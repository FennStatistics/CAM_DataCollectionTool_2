import { $, toastr } from "../../app/vendor.js";
import { store } from "../../app/store.js";
import { IncreaseSliderIntensity } from "../../app/constants.js";
import { COLOUR } from "../colours.js";

const interactionEdge = `
<div class="properties" id="interactionEdge">
            <div style="padding-bottom: 30px;">
                <button id="deleteEdge" class="material-icons deleteButton" style="color:red;" title="Delete Connector">
                    delete </button>
            </div>
            

            <!-- > adjust type and strength of connector -->
            <div class="properties-align" style="margin-bottom:20px" id="hideSliderDisAgree">
                <div class="properties-size-naming">
                ${store.language.cd_01}
                </div>

                <div class="spacing-connector">
                    <span class="redColorTick">${store.language.cd_02}</span>
                    <span class="greenColorTick">${store.language.cd_03}</span>
                </div>
                <div class="outerConnectorSlider">
                    <div class="greenConnectorColorSlider">
                        <div class="redColorConnectorSlider">
                            <input type="range" min="1" max="6" step="1" value="4" id="edgeSlider" autofocus>
                        </div>
                    </div>
                    <div class="labelsConnectorSlider">
                        <span>-3</span>
                        <span>-2</span>
                        <span>-1</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                    </div>
                </div>
            </div>


            <div class="properties-align" id="hideSliderAgreementOnly">
                <div class="properties-size-naming">
                ${store.language.cd_01a}
                </div>
                <div class="outerConnectorSlider">
                    <div class="greenConnectorColorSliderAgreementOnly">
                        <input type="range" min="4" max="6" step="1" value="4" id="edgeSliderAgreementOnly" autofocus>
                    </div>
                </div>
                <div class="labelsConnectorSliderAgreementOnly">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                </div>
            </div>




            <!-- > adjust of connectivity of edge -->
            <div id="hideConnectorDirInfluence">
                <div class="properties-size-naming" style="margin-top: 25px;">
                ${store.language.cd_04}
                </div>

                <div style="text-align: center;">
                    <div>
                        <button id="bidirectional" type="button" class="material-icons"
                            title="Concepts influence each other"
                            style="font-size: 50px;">sync_alt</button>
                        <button id="monodirectional" type="button" class="material-icons"
                            title="Concepts influence each other in a one-sided direction. Press button multiple times to change direction"
                            class="connectorButton" style="font-size: 50px;">trending_flat</button>
                    </div>
                </div>
            </div>
            <!-- for researcher only -->
            <div id="hideResearcherButtonsConnector">
                <div style="margin-top: 20px; font-size:16px; font-style: italic;">
                    The following functions are only available to researchers:
                </div>
                <div>
                    <button id="ResErasabilityConnector" type="button" class="typeResearcherButton">
                        deletable
                    </button>
                </div>
            </div>

        </div>`;

var target = document.getElementById("dialogInteractionEdge");
target.innerHTML += interactionEdge;


// language file
$(function () {
    document.getElementById("deleteEdge").title = store.language.cd_07buttonDelete;

    document.getElementById("bidirectional").title = store.language.cd_05button; // buttons top right (btr)
    document.getElementById("monodirectional").title = store.language.cd_06button; // buttons top right (btr)
  });




$(function () {
    if(store.config.ShowResearcherButtons){
        $('#hideResearcherButtonsNode').show();
        $('#hideResearcherButtonsConnector').show();
        $('#hideResearcherButtonsTop').show();
    }else{
        $('#hideResearcherButtonsNode').hide();
        $('#hideResearcherButtonsConnector').hide();
        $('#hideResearcherButtonsTop').hide();
    }
    if(store.config.OnlyStraightCon){
        $('#hideSliderDisAgree').hide();
        $('#hideSliderAgreementOnly').show();
    }else{
        $('#hideSliderDisAgree').show();
        $('#hideSliderAgreementOnly').hide();
    }




    $('#edgeSlider').on("input", function () {


        var intensitySlider = document.querySelector('#edgeSlider');
        var intensity = 0;

        var myGreenColorSlider = document.querySelector('.greenConnectorColorSlider');
        var myGreenColorTick = document.querySelector('.greenColorTick');

        var myRedColorSlider = document.querySelector('.redColorConnectorSlider');
        var myRedColorTick = document.querySelector('.redColorTick');

        // console.log("intensitySlider.value:", intensitySlider.value)

        // background-color to white

        const colourPalette = [COLOUR.white, COLOUR.red1, COLOUR.red2, COLOUR.red3, COLOUR.green3, COLOUR.green2, COLOUR.green1];

        var agreement = intensitySlider.value <= 3 ? false : true;
        store.cam.currentConnector.setAgreement(agreement);

        myRedColorSlider.style.backgroundColor = intensitySlider.value <= 3 ? colourPalette[intensitySlider.value] : colourPalette[0];
        myRedColorTick.style.backgroundColor = intensitySlider.value <= 3 ? colourPalette[intensitySlider.value] : colourPalette[0];

        myGreenColorSlider.style.backgroundColor = intensitySlider.value > 3 ? colourPalette[intensitySlider.value] : colourPalette[0];
        myGreenColorTick.style.backgroundColor = intensitySlider.value > 3 ? colourPalette[intensitySlider.value] : colourPalette[0];

        intensity = intensitySlider.value <= 3 ? (4 - intensitySlider.value) * IncreaseSliderIntensity : (intensitySlider.value - 3) * IncreaseSliderIntensity;

        store.cam.currentConnector.intensity = intensity
        store.cam.currentConnector.value = intensitySlider.value
        store.cam.draw();
    });


    $('#edgeSliderAgreementOnly').on("input", function () {


        var intensitySlider = document.querySelector('#edgeSliderAgreementOnly');
        var intensity = 0;

        var myGreenColorSlider = document.querySelector('.greenConnectorColorSliderAgreementOnly');

        // console.log("intensitySlider.value:", intensitySlider.value)

        // background-color to white

        const colourPalette = [COLOUR.white, COLOUR.red1, COLOUR.red2, COLOUR.red3, COLOUR.green3, COLOUR.green2, COLOUR.green1];


        myGreenColorSlider.style.backgroundColor = intensitySlider.value > 3 ? colourPalette[intensitySlider.value] : colourPalette[0];

        intensity = intensitySlider.value <= 3 ? (4 - intensitySlider.value) * IncreaseSliderIntensity : (intensitySlider.value - 3) * IncreaseSliderIntensity;

        store.cam.currentConnector.intensity = intensity
        store.cam.currentConnector.value = intensitySlider.value
        store.cam.draw();
    });
    



    $("#bidirectional").on("click", () => {
        if (store.cam.currentConnector != null) {
            store.cam.updateElement("Connector", "bidirection", true)
            store.cam.draw();
        }
    });

    $("#monodirectional").on("click", () => {
        if (store.cam.currentConnector != null) {
            store.cam.updateElement("Connector", "direction", null)
            store.cam.draw();
        }
    });

    // > delete
    $("#deleteEdge").on("click", (evt) => {
        store.cam.currentConnector.enterLog({
            type: "connector was deleted",
            value: -99
        });
        store.cam.deleteElement();
        $("#dialogInteractionEdge").dialog('close'); // close pop-up
    });

    $("#ResErasabilityConnector").on("click", (evt) => {
        if (store.cam.currentConnector != null) {
            if (store.cam.currentConnector.isDeletable == true) {
                store.cam.currentConnector.setIsDeletable(false);
                toastr.info('The connector is now not deletable.');
            } else if (store.cam.currentConnector.isDeletable == false) {
                store.cam.currentConnector.setIsDeletable(true);
                toastr.info('The connector is now deletable.');
            }
        }
    });
})

// hide arrows
if (store.config.enableArrows) {
    $('#hideConnectorDirInfluence').hide();
    $(function () {
        $('#hideConnectorDirInfluence').hide();
    });
}else{
    $('#hideConnectorDirInfluence').show();
    $(function () {
        $('#hideConnectorDirInfluence').show();
    });
}



// hide / show slider reference 
if (store.config.OnlyStraightCon) {
    $(function () {
        $('#hideSliderDisAgreeRef').hide();
        $('#hideSliderDisAgreeRef2').hide();
        $('#showSliderAgreeOnlyRef').show();
    });
}else{
    $(function () {
        $('#hideSliderDisAgreeRef').show();
        $('#hideSliderDisAgreeRef2').show();
        $('#showSliderAgreeOnlyRef').hide();
    });
}


