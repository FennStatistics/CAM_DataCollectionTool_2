import { store } from "../../app/store.js";

function initConfirmDeleteDialog() {
    const confirmDeleteCAM = `
<div class="reference">
<div id="informationDefault" class="confirm-save">
${store.language.confirmDeleting_01text}
</div>
</div>
`;

    var target = document.getElementById("dialogConfirmDelete");
    target.innerHTML += confirmDeleteCAM;
}

export { initConfirmDeleteDialog };
