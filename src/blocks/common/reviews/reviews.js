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
        // Раскрытие/сворачивание отзыва меняет разметку внутри слайда — не даём
        // swiper на это реагировать полным пересчётом (иначе моргает пагинация/слайды)
        observeSlideChildren: false,
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
            const collapse = card.querySelector(".collapse");
            if (!text || !expand) return;

            if (card.classList.contains("is-open")) {
                expand.hidden = true;
                if (collapse) collapse.hidden = false;
                return;
            }

            if (collapse) collapse.hidden = true;
            // Одно поле из админки: кнопка только если текст реально обрезан line-clamp
            expand.hidden = text.scrollHeight <= text.clientHeight + 1;
        });
    };

    // Эталонная высота свёрнутой карточки — считается один раз (и при resize),
    // а не при каждом разворачивании, иначе соседние карточки прыгали бы: при
    // открытии одной остальные подстраивались под меньший максимум и обратно.
    let equalHeight = 0;
    // Сколько карточек сейчас анимируется. Пока идёт анимация, перемер высот
    // запрещён: он снимает is-open и обнуляет height у всех карточек и оборвал бы
    // текущий переход. Swiper дёргает resize как раз когда карточка растёт.
    let animatingCount = 0;

    const measureEqualHeight = () => {
        if (animatingCount > 0) return;

        const cards = [...root.querySelectorAll(".card")];
        if (!cards.length) return;

        // Меряем все карточки в свёрнутом виде (is-open временно снимаем)
        const openState = cards.map((card) => card.classList.contains("is-open"));
        cards.forEach((card, i) => {
            card.style.minHeight = "";
            card.style.height = "";
            if (openState[i]) card.classList.remove("is-open");
        });

        let maxHeight = 0;
        cards.forEach((card) => {
            maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height);
        });

        cards.forEach((card, i) => {
            if (openState[i]) card.classList.add("is-open");
        });

        equalHeight = Math.ceil(maxHeight);
        applyEqualHeight();
    };

    // Применяем эталонную высоту к свёрнутым карточкам; открытые — без min-height
    const applyEqualHeight = () => {
        if (!equalHeight) return;
        root.querySelectorAll(".card").forEach((card) => {
            card.style.minHeight = card.classList.contains("is-open") ? "" : `${equalHeight}px`;
        });
    };

    swiper.on("lock", syncControls);
    swiper.on("unlock", syncControls);
    swiper.on("slideChange", syncFraction);
    swiper.on("resize", () => {
        // resize прилетает и когда карточка растёт при разворачивании — тогда ничего
        // не трогаем, иначе оборвём анимацию (measureEqualHeight сам это учитывает)
        if (animatingCount > 0) return;
        syncControls();
        syncExpandButtons();
        measureEqualHeight();
    });
    swiper.on("update", syncControls);
    swiper.on("slidesLengthChange", syncControls);
    swiper.on("observerUpdate", updateSwiper);

    // Разворачивание/сворачивание отзыва с плавной анимацией высоты.
    // Целевую высоту всегда меряем в естественном потоке (height:auto), стартовую
    // фиксируем реальным reflow — переход стабильно идёт from → to без рывков.
    const toggleCard = (card, expand, collapse, open) => {
        if (card.dataset.animating === "1" || card.classList.contains("is-open") === open) return;

        const from = card.getBoundingClientRect().height;

        card.style.minHeight = "";
        card.classList.toggle("is-open", open);
        card.style.height = "auto";
        let to = card.getBoundingClientRect().height;
        // Свёрнутая карточка должна прийти к эталонной высоте ряда (без прыжка в конце)
        if (!open && equalHeight) to = Math.max(to, equalHeight);

        // Возвращаем стартовую высоту и переключаем кнопки до старта анимации
        card.style.height = `${from}px`;
        if (expand) expand.hidden = open;
        if (collapse) collapse.hidden = !open;

        // Форсируем reflow — браузер фиксирует старт перехода на `from`, после чего
        // синхронная установка конечной высоты запускает плавную анимацию.
        // (rAF здесь ненадёжен: в фоновой вкладке колбэк может не сработать.)
        void card.offsetHeight;
        card.dataset.animating = "1";
        animatingCount += 1;
        card.style.height = `${to}px`;

        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            card.removeEventListener("transitionend", onEnd);
            window.clearTimeout(fallbackTimer);
            card.style.height = "auto";
            delete card.dataset.animating;
            animatingCount = Math.max(0, animatingCount - 1);
            // Применяем уже посчитанную эталонную высоту — соседние карточки не трогаем
            applyEqualHeight();
            syncControls();
        };
        const onEnd = (event) => {
            if (event.target === card && event.propertyName === "height") finish();
        };

        const fallbackTimer = window.setTimeout(finish, 600);
        card.addEventListener("transitionend", onEnd);
    };

    root.querySelectorAll(".card").forEach((card) => {
        const expand = card.querySelector(".expand");
        const collapse = card.querySelector(".collapse");

        expand?.addEventListener("click", () => toggleCard(card, expand, collapse, true), { signal });
        collapse?.addEventListener("click", () => toggleCard(card, expand, collapse, false), { signal });
    });

    const refresh = () => {
        updateSwiper();
        syncExpandButtons();
        measureEqualHeight();
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
