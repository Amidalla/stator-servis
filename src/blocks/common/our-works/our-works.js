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

    // Сначала галереи внутри карточек — иначе внешний слайдер перехватывает клики
    root.querySelectorAll(".card").forEach((card) => {
        const gallery = card.querySelector(".gallery");
        const galleryNav = card.querySelector(".gallery-nav");
        if (!gallery) return;

        const gallerySwiper = new Swiper(gallery, {
            modules: [Navigation, EffectFade],
            nested: true,
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
                prevEl: card.querySelector(".gallery-nav .nav-btn.prev"),
                nextEl: card.querySelector(".gallery-nav .nav-btn.next")
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

    const slider = root.querySelector(".slider");
    const mobileNav = root.querySelector(".mobile-nav");
    const prevEl = mobileNav?.querySelector(".nav-btn.prev");
    const nextEl = mobileNav?.querySelector(".nav-btn.next");
    const fractionEl = mobileNav?.querySelector(".fraction");

    if (slider) {
        const swiper = new Swiper(slider, {
            modules: [Navigation],
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 600,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            navigation: {
                prevEl,
                nextEl
            },
            breakpoints: {
                598: {
                    slidesPerView: 2,
                    spaceBetween: 20
                }
            }
        });

        const syncFraction = () => {
            if (!fractionEl) return;

            const slides = [...(swiper.slides || [])].filter(
                (slide) => !slide.classList.contains("swiper-slide-duplicate")
            );
            const current = (swiper.realIndex ?? swiper.activeIndex ?? 0) + 1;
            fractionEl.textContent = `${current}/${slides.length || 1}`;
        };

        const syncControls = () => {
            syncOverflowControls(swiper, [mobileNav]);
            syncFraction();
        };

        swiper.on("lock", syncControls);
        swiper.on("unlock", syncControls);
        swiper.on("slideChange", syncFraction);
        swiper.on("resize", syncControls);
        swiper.on("update", syncControls);
        swiper.on("slidesLengthChange", syncControls);

        requestAnimationFrame(syncControls);
        instances.push(swiper);
    }

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            instances.forEach((instance) => instance.destroy(true, true));
        },
        { once: true, signal }
    );
}
