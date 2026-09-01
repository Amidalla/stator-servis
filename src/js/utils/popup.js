import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

/**
 * Показать popup по id
 * @param {string} id - id элемента popup (например, "popup-feedback-success")
 */
export function showPopup(id) {
    Fancybox.show([
        {
            src: `#${id}`,
            type: "inline"
        }
    ]);
}
