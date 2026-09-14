import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function reviews(context = document) {
    const root = context.querySelector("[data-reviews]");
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

    // mobile-l: ровно 1 → tablet-l: 1.7 → laptop-l: 1.9 → desktop: 3.35
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
                slidesPerView: 1.7,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 1.9,
                spaceBetween: 20
            },
            1640: {
                slidesPerView: 3.35,
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

    const syncExpandButtons = () => {
        root.querySelectorAll(".card").forEach((card) => {
            const text = card.querySelector(".text");
            const expand = card.querySelector(".expand");
            if (!text || !expand) return;

            if (card.classList.contains("is-open")) {
                expand.hidden = true;
                return;
            }

            // Одно поле из админки: кнопка только если текст реально обрезан line-clamp
            expand.hidden = text.scrollHeight <= text.clientHeight + 1;
        });
    };

    const equalizeCardHeights = () => {
        const cards = [...root.querySelectorAll(".card")];
        const collapsed = cards.filter((card) => !card.classList.contains("is-open"));

        collapsed.forEach((card) => {
            card.style.minHeight = "";
            if (!card.style.height || card.style.height === "auto") {
                card.style.height = "";
            }
        });

        let maxHeight = 0;
        collapsed.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height);
        });

        if (maxHeight > 0) {
            const value = `${Math.ceil(maxHeight)}px`;
            collapsed.forEach((card) => {
                card.style.minHeight = value;
            });
        }
    };

    swiper.on("lock", syncControls);
    swiper.on("unlock", syncControls);
    swiper.on("slideChange", syncFraction);
    swiper.on("resize", () => {
        syncControls();
        syncExpandButtons();
        equalizeCardHeights();
    });
    swiper.on("update", syncControls);
    swiper.on("slidesLengthChange", syncControls);
    swiper.on("observerUpdate", updateSwiper);

    root.querySelectorAll(".card").forEach((card) => {
        const expand = card.querySelector(".expand");
        if (!expand) return;

        expand.addEventListener(
            "click",
            () => {
                if (card.classList.contains("is-open")) return;

                const from = card.getBoundingClientRect().height;
                card.style.minHeight = "";
                card.style.height = `${from}px`;
                card.classList.add("is-open");
                expand.hidden = true;

                const to = card.scrollHeight;

                requestAnimationFrame(() => {
                    card.style.height = `${to}px`;
                });

                const finish = () => {
                    card.style.height = "auto";
                    updateSwiper();
                    equalizeCardHeights();
                };

                const onEnd = (event) => {
                    if (event.target !== card || event.propertyName !== "height") return;
                    card.removeEventListener("transitionend", onEnd);
                    window.clearTimeout(fallbackTimer);
                    finish();
                };

                const fallbackTimer = window.setTimeout(() => {
                    card.removeEventListener("transitionend", onEnd);
                    finish();
                }, 500);

                card.addEventListener("transitionend", onEnd);
            },
            { signal }
        );
    });

    const refresh = () => {
        updateSwiper();
        syncExpandButtons();
        equalizeCardHeights();
    };

    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh, { once: true, signal });

    let resizeTimer;
    window.addEventListener(
        "resize",
        () => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(refresh, 150);
        },
        { signal }
    );

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            swiper.destroy(true, true);
        },
        { once: true, signal }
    );
}
