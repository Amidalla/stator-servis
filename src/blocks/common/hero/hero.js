import Swiper from "swiper";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

export function hero(context = document) {
    const root = context.querySelector(".hero");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const swiper = new Swiper(root.querySelector(".slider"), {
        modules: [Pagination, Autoplay, EffectFade],
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 800,
        effect: "fade",
        fadeEffect: {
            crossFade: true
        },
        loop: true,
        autoplay: {
            delay: 5500,
            disableOnInteraction: false
        },
        pagination: {
            el: root.querySelector(".swiper-pagination"),
            clickable: true
        }
    });

    root.addEventListener(
        "destroy",
        () => {
            swiper.destroy(true, true);
        },
        { once: true }
    );
}
