import { $ } from "../../../app/vendor.js";
import { store } from "../../../app/store.js";

const ref = `

<div class="reference">
    <div class="tab">
        <button class="tablinks" onclick="openTab(event, 'QRLegend')">${store.language.qr_tab_01}</button>
        <button class="tablinks" onclick="openTab(event, 'QRusingConcepts')">${store.language.qr_tab_02}</button>
        <button class="tablinks" onclick="openTab(event, 'QRusingConnections')">${store.language.qr_tab_03}</button>
        <button class="tablinks" onclick="openTab(event, 'QRButtons')">${store.language.qr_tab_04}</button>
    </div>
    <!-- interactive component: DEFAULT -->
    <div id="informationDefault" class="tab-defaulttext">
        <i>${store.language.qr_start}</i>  
    </div>
    
    
    <div id="QRLegend" class="tabcontent">

        <h3>${store.language.qr_legend_10}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
            <li><img src="./img/pos_node.svg#svgView(viewBox(0,5,210,110))" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_11}</li>
            <li><img src="./img/neg_node.svg#svgView(viewBox(5,5,250,120))" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_12}</li>
            <div id="hideAmvivalentNode">
                <li><img src="./img/ambivalent_node.svg#svgView(viewBox(5,5,250,120))" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_13}</li>
            </div>
            <li><img src="./img/neutral_node.svg#svgView(viewBox(0,5,180,120))" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_14}</li>
            <h3>${store.language.qr_legend_20}</h3>
            <li><img src="./img/solid_lini_mini.svg" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_21}
            </li>
            <div id="hideSliderDisAgreeRef">
                <li><img src="./img/dashed_lini_mini.svg" alt=""
                    style="width: 50px; height: 40px; vertical-align:middle;"> ${store.language.qr_legend_22}
                </li>
            </div>
            <div id="showCameraFeature">
                <h3>${store.language.qr_legend_30}</h3> ${store.language.qr_legend_31}
                <img src="./img/cameraFeature.JPG" alt=""
                    style="width: 260px; height: 120px; vertical-align:text-top;">
            </div>
        </ul>
    </div>

    <div id="QRusingConcepts" class="tabcontent">
        <h3>${store.language.qr_concept_10}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
            <li>${store.language.qr_concept_11}</li>
            <li>${store.language.qr_concept_12}</li>
            <li>${store.language.qr_concept_13}</li>
        </ul>

        <h3>${store.language.qr_concept_20}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
            <li>${store.language.qr_concept_21}</li>
            <li>${store.language.qr_concept_22}</li>
            <li>${store.language.qr_concept_23}</li>
        </ul>
    </div>

    <div id="QRusingConnections" class="tabcontent">
        <h3>${store.language.qr_connection_10}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
            <li>${store.language.qr_connection_11}</li>
            <li>${store.language.qr_connection_12}</li>
            <li>${store.language.qr_connection_13}</li>
        </ul>

        <h3>${store.language.qr_connection_20}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
        <div id="hideSliderDisAgreeRef2">
            <li>${store.language.qr_connection_21}</li>
        </div>
        <div id="showSliderAgreeOnlyRef">
            <li>${store.language.qr_connection_21a}</li>
        </div>

        
            <div id="hideConnectorDirInfluence">
            <li style="margin-top: 10px;"><b>${store.language.qr_connection_22}</b> </li>
            <li style="padding-left: 10px;"><span style="vertical-align:middle;"
                    class="material-icons">sync_alt</span> ${store.language.qr_connection_23}</li>
            <li style="padding-left: 10px;"><span style="vertical-align:middle;"
                    class="material-icons">trending_flat</span> ${store.language.qr_connection_24}</li>
                </div>
        </ul>
    </div>

    <div id="QRButtons" class="tabcontent">

        <h3>${store.language.qr_buttons_10}</h3>
        <ul style="list-style-type:none; margin: 0px; padding: 0px;">
            <li>
                <div class="material-icons" style="vertical-align:middle;">save</div> ${store.language.qr_buttons_11}
            </li>
            <br>
            <li>
                <div class="material-icons" style="vertical-align:middle;">crop_original</div> ${store.language.qr_buttons_12}
            </li>
            <br>
            <li>
                <div class="material-icons" style="color:red; vertical-align:middle;">delete</div> ${store.language.qr_buttons_13}
            </li>
        </ul>

    </div>
</div>`;

var target = document.getElementById("dialogReference");
target.innerHTML += ref;


// language file
$(function () {
    document.getElementById("dialogReference").title = store.language.qr_top; // title
    document.getElementById("quickref").title = store.language.btr_01; // buttons top right (btr)
});

$(function () {
    if (store.config.cameraFeature) {
        $("#showCameraFeature").show();
    } else {
        $("#showCameraFeature").hide();
    }
});


// hide arrows edges
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


// hide ambivalent nodes
if(store.config.enableAmbivalent){
    $('#hideAmvivalentNode').hide();
    $(function () {
        $('#hideAmvivalentNode').hide();
    });
}else{
    $('#hideAmvivalentNode').show();
    $(function () {
        $('#hideAmvivalentNode').show();
    });
}
