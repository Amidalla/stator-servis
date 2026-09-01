// blocks/common/certificates/certificates.js
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

export function certificates(context = document) {
    const root = context.querySelector(".certificates");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const links = root.querySelectorAll('[data-fancybox="certificates"]');
    if (links.length) {
        Fancybox.bind(links, {});
    }

    const wrapper = root.querySelector(".certificates__slider-wrapper");
    const slider = root.querySelector(".certificates__slider");

    function checkOverflow() {
        if (!wrapper || !slider) return;

        // Считаем ширину контента
        let totalWidth = 0;
        const items = slider.querySelectorAll(".certificates__item");
        const gap = 20;

        items.forEach((item, index) => {
            totalWidth += item.offsetWidth;
            if (index < items.length - 1) {
                totalWidth += gap;
            }
        });

        const wrapperWidth = wrapper.clientWidth;

        if (totalWidth > wrapperWidth) {
            wrapper.classList.add("has-scroll");
        } else {
            wrapper.classList.remove("has-scroll");
        }
    }

    setTimeout(checkOverflow, 100);

    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkOverflow, 200);
    });

    // Также проверяем при загрузке изображений
    const images = slider.querySelectorAll("img");
    if (images.length) {
        let loaded = 0;
        images.forEach((img) => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener("load", () => {
                    loaded++;
                    if (loaded === images.length) {
                        setTimeout(checkOverflow, 50);
                    }
                });
            }
        });
    }

    root.addEventListener(
        "destroy",
        () => {
            Fancybox.unbind(links);
            window.removeEventListener("resize", checkOverflow);
        },
        { once: true }
    );
}
