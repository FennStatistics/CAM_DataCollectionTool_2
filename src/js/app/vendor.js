import $ from "jquery";
import toastr from "toastr";
import cytoscape from "cytoscape";
import { v4 as uuidv4 } from "uuid";
import { Base64 } from "js-base64";

window.$ = $;
window.jQuery = $;
window.toastr = toastr;

export { $, toastr, cytoscape, uuidv4, Base64 };
