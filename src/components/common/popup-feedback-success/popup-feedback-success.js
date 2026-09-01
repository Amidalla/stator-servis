import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

export function popupFeedbackSuccess(context = document) {
    // Открытие по клику на кнопки с data-src
    const triggers = context.querySelectorAll('[data-src="popup-feedback-success"]');

    triggers.forEach((trigger) => {
        if (trigger.dataset.init === "true") return;
        trigger.dataset.init = "true";

        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            openPopup();
        });
    });

    // Функция открытия
    function openPopup() {
        Fancybox.show([
            {
                src: "#popup-feedback-success",
                type: "inline"
            }
        ]);
    }

    // Функция закрытия
    function closePopup() {
        Fancybox.close();
    }

    window.PopupFeedbackSuccess = {
        open: openPopup,
        close: closePopup
    };

    return {
        open: openPopup,
        close: closePopup
    };
}
