import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

const popupOptions = {
    closeButton: false,
    dragToClose: false,
    backdropClick: "close",
    mainClass: "popup-feedback-success-fancybox",
    mainStyle: {
        "--fancybox-backdrop-bg": "rgba(0, 0, 0, 0.50)"
    },
    Carousel: {
        Navigation: false
    }
};

export function popupFeedbackSuccess(context = document) {
    const popup = document.querySelector("#popup-feedback-success");
    if (!popup) return;

    const triggers = context.querySelectorAll('[data-src="popup-feedback-success"]');
    const closeBtn = popup.querySelector(".popup-feedback-success-close");

    function openPopup(e) {
        e?.preventDefault();
        Fancybox.show(
            [
                {
                    src: "#popup-feedback-success",
                    type: "inline"
                }
            ],
            popupOptions
        );
    }

    function closePopup(e) {
        e?.preventDefault();
        Fancybox.close();
    }

    triggers.forEach((trigger) => {
        if (trigger.dataset.init === "true") return;
        trigger.dataset.init = "true";

        trigger.addEventListener("click", openPopup);
    });

    if (closeBtn && closeBtn.dataset.init !== "true") {
        closeBtn.dataset.init = "true";
        closeBtn.addEventListener("click", closePopup);
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
