import Swiper from "swiper";
import { Thumbs, EffectFade } from "swiper/modules"; // 👈 Добавили EffectFade
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

// 👇 Регистрируем модули
Swiper.use([Thumbs, EffectFade]);

export function productCard(context = document) {
    const root = context.querySelector(".product-card");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const mainSlider = root.querySelector(".product-card__main-slider");
    const thumbSlider = root.querySelector(".product-card__thumb-slider");

    if (!mainSlider || !thumbSlider) return;

    // thumbSwiper
    const thumbSwiper = new Swiper(thumbSlider, {
        slidesPerView: 3,
        spaceBetween: 10,
        watchSlidesProgress: true,
        navigation: {
            nextEl: ".product-card__thumb-next",
            prevEl: ".product-card__thumb-prev"
        },
        breakpoints: {
            320: {
                slidesPerView: 2.5,
                spaceBetween: 8
            },
            768: {
                slidesPerView: 3.5,
                spaceBetween: 10
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 10
            }
        }
    });

    const prevEl = root.querySelector(".product-card__thumb-prev");
    const nextEl = root.querySelector(".product-card__thumb-next");

    if (prevEl) {
        prevEl.addEventListener("click", (e) => {
            e.stopPropagation();
            thumbSwiper.slidePrev();
        });
    }
    if (nextEl) {
        nextEl.addEventListener("click", (e) => {
            e.stopPropagation();
            thumbSwiper.slideNext();
        });
    }

    // mainSwiper с FADE эффектом (как в hero)
    const mainSwiper = new Swiper(mainSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        thumbs: {
            swiper: thumbSwiper
        }
    });

    // Пагинация вручную
    const paginationContainer = root.querySelector(".product-card__pagination");
    if (paginationContainer) {
        paginationContainer.innerHTML = "";
        const slidesCount = mainSwiper.slides.length;

        for (let i = 0; i < slidesCount; i++) {
            const bullet = document.createElement("span");
            bullet.className = "product-card__bullet";
            if (i === 0) bullet.classList.add("product-card__bullet--active");
            bullet.dataset.index = i;
            bullet.addEventListener("click", () => {
                mainSwiper.slideTo(i);
            });
            paginationContainer.appendChild(bullet);
        }
    }

    mainSwiper.on("slideChange", function () {
        const activeIndex = this.realIndex;
        const bullets = paginationContainer.querySelectorAll(".product-card__bullet");
        bullets.forEach((bullet, index) => {
            bullet.classList.toggle("product-card__bullet--active", index === activeIndex);
        });
    });

    window.__productCard = {
        mainSwiper,
        thumbSwiper
    };

    const zoomLinks = root.querySelectorAll('[data-fancybox="product-gallery"]');
    if (zoomLinks.length) {
        Fancybox.bind(zoomLinks, {});
    }
}
