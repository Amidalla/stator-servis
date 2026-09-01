import Swiper from "swiper";
import { Navigation } from "swiper/modules";

export function similarProducts(context = document) {
    const root = context.querySelector(".similar-products");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const slider = root.querySelector(".similar-products__slider");
    if (!slider) return;

    const swiper = new Swiper(slider, {
        modules: [Navigation],
        slidesPerView: 4,
        spaceBetween: 35,
        speed: 600,
        navigation: {
            nextEl: root.querySelector(".similar-products__next"),
            prevEl: root.querySelector(".similar-products__prev")
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 0
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 14
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            1200: {
                slidesPerView: 4,
                spaceBetween: 35
            }
        },
        observer: true,
        observeParents: true,
        watchSlidesProgress: true
    });

    // Обновляем слайдер при загрузке изображений
    const images = slider.querySelectorAll("img");
    if (images.length) {
        let loaded = 0;
        images.forEach((img) => {
            if (img.complete) {
                loaded++;
            } else {
                img.addEventListener("load", () => {
                    loaded++;
                    if (loaded === images.length) {
                        swiper.update();
                    }
                });
            }
        });
        if (loaded === images.length) {
            swiper.update();
        }
    }

    // Обработчик ресайза
    let resizeTimer;
    const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            swiper.update();
        }, 250);
    };
    window.addEventListener("resize", handleResize);

    // Очистка при уничтожении
    root.addEventListener(
        "destroy",
        () => {
            window.removeEventListener("resize", handleResize);
            swiper.destroy(true, true);
        },
        { once: true }
    );

    return swiper;
}
