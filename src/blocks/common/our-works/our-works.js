import Swiper from "swiper";
import { Navigation, EffectFade } from "swiper/modules";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function ourWorks(context = document) {
    const root = context.querySelector("[data-our-works]");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;
    const instances = [];

    const slider = root.querySelector(".slider");
    if (slider) {
        instances.push(
            new Swiper(slider, {
                modules: [Navigation],
                slidesPerView: 2,
                spaceBetween: 20,
                speed: 600,
                watchOverflow: true,
                observer: true,
                observeParents: true
            })
        );
    }

    root.querySelectorAll(".card").forEach((card) => {
        const gallery = card.querySelector(".gallery");
        const galleryNav = card.querySelector(".gallery-nav");
        if (!gallery) return;

        const gallerySwiper = new Swiper(gallery, {
            modules: [Navigation, EffectFade],
            slidesPerView: 1,
            speed: 500,
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },
            watchOverflow: true,
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            navigation: {
                prevEl: card.querySelector(".nav-btn.prev"),
                nextEl: card.querySelector(".nav-btn.next")
            }
        });

        const syncControls = () => syncOverflowControls(gallerySwiper, [galleryNav]);
        const updateGallery = () => {
            gallerySwiper.update();
            gallerySwiper.navigation?.update();
            syncControls();
        };

        gallerySwiper.on("lock", syncControls);
        gallerySwiper.on("unlock", syncControls);
        gallerySwiper.on("resize", syncControls);
        gallerySwiper.on("update", syncControls);
        gallerySwiper.on("slidesLengthChange", syncControls);
        gallerySwiper.on("observerUpdate", updateGallery);
        updateGallery();

        instances.push(gallerySwiper);
    });

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            instances.forEach((instance) => instance.destroy(true, true));
        },
        { once: true, signal }
    );
}
