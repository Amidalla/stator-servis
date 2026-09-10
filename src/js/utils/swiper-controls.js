/**
 * Hides nav/pagination when slides don't overflow the viewport.
 * @param {import("swiper").Swiper} swiper
 * @param {Array<Element | null | undefined>} elements
 */
export function syncOverflowControls(swiper, elements = []) {
    if (!swiper || swiper.destroyed) return;

    swiper.checkOverflow?.();

    const slides = [...(swiper.slides || [])].filter(
        (slide) => !slide.classList.contains("swiper-slide-duplicate")
    );
    const count = slides.length;
    const perView = swiper.params.slidesPerView;

    let hide;

    if (typeof perView === "number") {
        // reviews: 3.35, gallery: 1 — стрелки только если слайдов больше, чем видно
        hide = count <= perView;
    } else {
        hide = Boolean(swiper.isLocked) || (swiper.snapGrid?.length ?? 0) <= 1 || count <= 1;
    }

    elements.forEach((el) => {
        if (!el) return;
        el.hidden = hide;
        el.setAttribute("aria-hidden", hide ? "true" : "false");
    });
}
