import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function usefulMaterials(context = document) {
    const root = context.querySelector("[data-useful-materials]");
    if (!root || root.dataset.init === "true") return;

    const slider = root.querySelector(".slider");
    const controls = root.querySelector(".controls");
    const prevEl = root.querySelector(".nav-btn.prev");
    const nextEl = root.querySelector(".nav-btn.next");
    const paginationEl = root.querySelector(".pagination");
    const dotsEl = root.querySelector(".pagination-dots");

    if (!slider || !prevEl || !nextEl || !paginationEl) return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;

    // mobile-l: 1 → tablet-l: 2 → desktop: auto (415px)
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
            prevEl,
            nextEl
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
            1024: {
                slidesPerView: "auto",
                spaceBetween: 20
            }
        }
    });

    const syncControls = () => syncOverflowControls(swiper, [controls, dotsEl]);

    const syncDots = () => {
        if (!dotsEl) return;

        const slides = [...(swiper.slides || [])].filter(
            (slide) => !slide.classList.contains("swiper-slide-duplicate")
        );
        const active = swiper.realIndex ?? swiper.activeIndex ?? 0;

        if (dotsEl.children.length !== slides.length) {
            dotsEl.replaceChildren(
                ...slides.map((_, index) => {
                    const dot = document.createElement("button");
                    dot.type = "button";
                    dot.className = `dot${index === active ? " is-active" : ""}`;
                    dot.setAttribute("aria-label", `Материал ${index + 1}`);
                    return dot;
                })
            );
            return;
        }

        [...dotsEl.children].forEach((dot, index) => {
            dot.classList.toggle("is-active", index === active);
        });
    };

    const updateSwiper = () => {
        swiper.update();
        swiper.navigation?.update();
        swiper.pagination?.render();
        swiper.pagination?.update();
        syncControls();
        syncDots();
    };

    swiper.on("lock", syncControls);
    swiper.on("unlock", syncControls);
    swiper.on("slideChange", syncDots);
    swiper.on("resize", () => {
        syncControls();
        syncDots();
    });
    swiper.on("update", () => {
        syncControls();
        syncDots();
    });
    swiper.on("slidesLengthChange", () => {
        syncControls();
        syncDots();
    });
    swiper.on("observerUpdate", updateSwiper);

    if (dotsEl) {
        dotsEl.addEventListener(
            "click",
            (event) => {
                const dot = event.target.closest(".dot");
                if (!dot || !dotsEl.contains(dot)) return;

                const index = [...dotsEl.children].indexOf(dot);
                if (index >= 0) swiper.slideTo(index);
            },
            { signal }
        );
    }

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
