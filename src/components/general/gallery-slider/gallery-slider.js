// components/general/gallery-slider/gallery-slider.js
import Swiper from "swiper";
import { Thumbs, EffectFade } from "swiper/modules";

// Регистрируем модули
Swiper.use([Thumbs, EffectFade]);

export function gallerySlider(context = document) {
    const roots = context.querySelectorAll("[data-gallery-slider]");
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const mainSlider = root.querySelector(".gallery-slider__main");
        const thumbSlider = root.querySelector(".gallery-slider__thumb");

        if (!mainSlider || !thumbSlider) return;

        // thumbSwiper
        const thumbSwiper = new Swiper(thumbSlider, {
            slidesPerView: 4,
            spaceBetween: 10,
            watchSlidesProgress: true,
            navigation: {
                nextEl: root.querySelector(".gallery-slider__next"),
                prevEl: root.querySelector(".gallery-slider__prev")
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 8
                },
                430: {
                    slidesPerView: 2,
                    spaceBetween: 8
                },
                650: {
                    slidesPerView: 3,
                    spaceBetween: 10
                },
                1200: {
                    slidesPerView: 4,
                    spaceBetween: 10
                }
            }
        });

        // Дополнительные обработчики для стрелок
        const prevEl = root.querySelector(".gallery-slider__prev");
        const nextEl = root.querySelector(".gallery-slider__next");

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

        // mainSwiper с FADE эффектом (как в productCard)
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

        // Очистка при уничтожении
        root.addEventListener(
            "destroy",
            () => {
                mainSwiper.destroy(true, true);
                thumbSwiper.destroy(true, true);
            },
            { once: true }
        );
    });
}
