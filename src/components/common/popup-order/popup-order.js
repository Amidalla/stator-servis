import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

const popupOptions = {
    closeButton: false,
    dragToClose: false,
    backdropClick: "close",
    mainClass: "popup-order-fancybox",
    mainStyle: {
        "--fancybox-backdrop-bg": "rgba(0, 0, 0, 0.50)"
    },
    Carousel: {
        Navigation: false
    }
};

export function popupOrder(context = document) {
    const popup = document.querySelector("#popup-order");
    const triggers = context.querySelectorAll('*[data-src="popup-order"]');
    if (!popup || !triggers.length) return;

    const closeBtn = popup.querySelector(".popup-order-close");
    const serviceField = popup.querySelector("#popup-order-service");

    const openPopup = (e) => {
        e?.preventDefault();
        e?.stopPropagation();

        // Подставляем название услуги из триггера
        if (serviceField) {
            serviceField.value = e?.currentTarget?.dataset.service || "";
        }

        requestAnimationFrame(() => {
            Fancybox.show(
                [
                    {
                        src: "#popup-order",
                        type: "inline"
                    }
                ],
                popupOptions
            );
        });
    };

    const closePopup = (e) => {
        e?.preventDefault();
        Fancybox.close();
    };

    triggers.forEach((item) => {
        if (item.dataset.init === "true") return;
        item.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;

        item.addEventListener("click", openPopup, { signal });
        item.addEventListener("destroy", () => controller.abort(), { once: true });
    });

    if (closeBtn && closeBtn.dataset.init !== "true") {
        closeBtn.dataset.init = "true";
        closeBtn.addEventListener("click", closePopup);
    }
}
