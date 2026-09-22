import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function articleOthers(context = document) {
    const root = context.querySelector("[data-article-others]");
    if (!root || root.dataset.init === "true") return;

    const slider = root.querySelector(".slider");
    const controls = root.querySelector(".controls");
    const prevEl = root.querySelector(".controls .nav-btn.prev");
    const nextEl = root.querySelector(".controls .nav-btn.next");
    const paginationEl = root.querySelector(".controls .pagination");
    const mobileNav = root.querySelector(".mobile-nav");
    const mobilePrev = mobileNav?.querySelector(".nav-btn.prev");
    const mobileNext = mobileNav?.querySelector(".nav-btn.next");
    const fractionEl = mobileNav?.querySelector(".fraction");

    if (!slider || !prevEl || !nextEl || !paginationEl) return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;

    // mobile-l: 1 → tablet-l: 2 → tablet-xl: 3 → desktop: 4
    const swiper = new Swiper(slider, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 600,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        navigation: {
            prevEl: [prevEl, mobilePrev].filter(Boolean),
            nextEl: [nextEl, mobileNext].filter(Boolean)
        },
        pagination: {
            el: paginationEl,
            clickable: true
        },
        breakpoints: {
            598: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            833: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1439: {
                slidesPerView: 4,
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
        syncOverflowControls(swiper, [controls, mobileNav]);
        syncFraction();
    };

    const updateSwiper = () => {
        swiper.update();
        swiper.navigation?.update();
        swiper.pagination?.render();
        swiper.pagination?.update();
        syncControls();
    };

    swiper.on("lock", syncControls);
    swiper.on("unlock", syncControls);
    swiper.on("slideChange", syncFraction);
    swiper.on("resize", syncControls);
    swiper.on("update", syncControls);
    swiper.on("slidesLengthChange", syncControls);
    swiper.on("observerUpdate", updateSwiper);

    requestAnimationFrame(updateSwiper);
    window.addEventListener("load", updateSwiper, { once: true, signal });

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            swiper.destroy(true, true);
        },
        { once: true, signal }
    );
}
