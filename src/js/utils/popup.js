import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

/**
 * Показать popup по id
 * @param {string} id - id элемента popup (например, "popup-feedback-success")
 */
export function showPopup(id) {
    if (id === "popup-feedback-success" && window.PopupFeedbackSuccess?.open) {
        window.PopupFeedbackSuccess.open();
        return;
    }

    Fancybox.show([
        {
            src: `#${id}`,
            type: "inline"
        }
    ]);
}
