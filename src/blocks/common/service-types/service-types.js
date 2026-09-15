import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { syncOverflowControls } from "../../../js/utils/swiper-controls.js";

export function serviceTypes(context = document) {
    const root = context.querySelector("[data-service-types]");
    if (!root || root.dataset.init === "true") return;

    const slider = root.querySelector(".slider");
    const prevEl = root.querySelector(".nav .nav-btn.prev");
    const nextEl = root.querySelector(".nav .nav-btn.next");
    const paginationEl = root.querySelector(".nav .pagination");
    const nav = root.querySelector(".nav");
    const mobileNav = root.querySelector(".mobile-nav");
    const mobilePrev = mobileNav?.querySelector(".nav-btn.prev");
    const mobileNext = mobileNav?.querySelector(".nav-btn.next");
    const fractionEl = mobileNav?.querySelector(".fraction");

    if (!slider || !prevEl || !nextEl || !paginationEl) return;

    root.dataset.init = "true";

    const swiper = new Swiper(slider, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        spaceBetween: 20,
        speed: 600,
        watchOverflow: true,
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1300: {
                slidesPerView: 3
            },
            1850: {
                slidesPerView: 4
            }
        },
        navigation: {
            prevEl: [prevEl, mobilePrev].filter(Boolean),
            nextEl: [nextEl, mobileNext].filter(Boolean)
        },
        pagination: {
            el: paginationEl,
            clickable: true
        },
        on: {
            init(instance) {
                syncOverflowControls(instance, [nav, mobileNav]);
                syncFraction(instance);
            },
            resize(instance) {
                syncOverflowControls(instance, [nav, mobileNav]);
            },
            slideChange(instance) {
                syncFraction(instance);
            }
        }
    });

    function syncFraction(instance) {
        if (!fractionEl) return;

        const slides = [...(instance.slides || [])].filter(
            (slide) => !slide.classList.contains("swiper-slide-duplicate")
        );
        const current = (instance.realIndex ?? instance.activeIndex ?? 0) + 1;
        fractionEl.textContent = `${current}/${slides.length || 1}`;
    }

    root.addEventListener("destroy", () => swiper.destroy(true, true), { once: true });
}
