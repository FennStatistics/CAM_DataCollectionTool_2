import { $ } from "../../app/vendor.js";
import { store } from "../../app/store.js";

const contentFirstReminder = `
You have only <b>3 minutes</b> left to draw your <i>Cognitive-Affective Map</i> (CAM). Please begin to wrap up and keep the following in mind:
<ul style="font-size: 14px;">
  <li>Use no more than three words per concept and do not leave any drawn concept blank.</li>
  <li>Connect all the concepts you have drawn.</li>
</ul>
<br>
Please click on the background to continue.
`;

const contentFinalReminder = `
Please finish drawing the <i>Cognitive-Affective Map</i> (CAM) now and consider the following:
<ul style="font-size: 14px;">
  <li>Do not leave any drawn concept blank.</li>
  <li>Connect all the concepts you have drawn.</li>
</ul>
<br>
Please click on the background to continue and click the disk icon in the top right corner to save your CAM.
`;

function initReminderDialogs() {
    var startTimeMS = 0; // EPOCH Time of event count started
    var timerStepFirst = 720000; // 1000; // Time first reminder
    var timerStepFinal = 900000; // Time final reminder

    function firstReminder() {
        $("#dialogReminder").dialog("open");
        $("#textDialogReminder")[0].innerHTML = contentFirstReminder;
    }

    function finalReminder() {
        $("#dialogReminder").dialog("open");
        $("#textDialogReminder")[0].innerHTML = contentFinalReminder;
    }

    function startTimer() {
        startTimeMS = new Date().getTime();
        setTimeout(firstReminder, timerStepFirst);
        setTimeout(finalReminder, timerStepFinal);
    }

    function getRemainingTime() {
        var remainingTimeFirst =
            timerStepFirst - (new Date().getTime() - startTimeMS);
        var remainingTimeFinal =
            timerStepFinal - (new Date().getTime() - startTimeMS);

        console.log("remaining time first reminder:", remainingTimeFirst);
        console.log("remaining time final reminder:", remainingTimeFinal);
    }

    if (store.config.setReminder) {
        startTimer();
    }
}

export { initReminderDialogs };
