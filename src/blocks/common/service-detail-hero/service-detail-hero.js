import Swiper from "swiper";
import { Thumbs, EffectFade } from "swiper/modules";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function serviceDetailHero(context = document) {
    const root = context.querySelector("[data-detail-gallery]");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const mainEl = root.querySelector("[data-main]");
    if (!mainEl) return;

    const thumbsEl = root.querySelector("[data-thumbs]");
    const counterCurrent = root.querySelector(".counter b");
    const counterTotal = root.querySelector(".counter .total");
    const thumbsNav = root.querySelector(".thumbs-nav");

    const controller = new AbortController();
    const { signal } = controller;
    const instances = [];

    let thumbsSwiper = null;

    if (thumbsEl) {
        thumbsSwiper = new Swiper(thumbsEl, {
            direction: "vertical",
            slidesPerView: "auto",
            spaceBetween: 13,
            watchSlidesProgress: true,
            observer: true,
            observeParents: true
        });
        instances.push(thumbsSwiper);
    }

    const mainSwiper = new Swiper(mainEl, {
        modules: [Thumbs, EffectFade],
        slidesPerView: 1,
        speed: 500,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        watchOverflow: true,
        observer: true,
        observeParents: true,
        thumbs: {
            swiper: thumbsSwiper
        }
    });
    instances.push(mainSwiper);

    if (counterTotal) {
        counterTotal.textContent = mainSwiper.slides.length || 1;
    }

    const syncCounter = () => {
        if (!counterCurrent) return;
        counterCurrent.textContent = (mainSwiper.activeIndex ?? 0) + 1;
    };

    const syncControls = () => {
        if (thumbsSwiper) syncOverflowControls(thumbsSwiper, [thumbsNav]);
        syncCounter();
    };

    mainSwiper.on("slideChange", syncCounter);
    ["lock", "unlock", "resize", "update", "slidesLengthChange"].forEach((event) => {
        mainSwiper.on(event, syncControls);
        if (thumbsSwiper) thumbsSwiper.on(event, syncControls);
    });

    // Стрелка листает ленту миниатюр (не основной слайдер), по кругу
    if (thumbsNav && thumbsSwiper) {
        thumbsNav.addEventListener(
            "click",
            () => {
                if (thumbsSwiper.isEnd) {
                    thumbsSwiper.slideTo(0);
                } else {
                    thumbsSwiper.slideNext();
                }
            },
            { signal }
        );
    }

    requestAnimationFrame(syncControls);

    // Увеличение фото по клику
    Fancybox.bind(root, '[data-fancybox="service-detail-gallery"]', {
        groupAll: false
    });

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            instances.forEach((instance) => instance.destroy(true, true));
            Fancybox.unbind(root);
            Fancybox.close();
        },
        { once: true, signal }
    );
}
