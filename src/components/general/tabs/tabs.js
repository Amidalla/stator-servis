// Табы-фильтры (логика как на porozhek.ru/vopros-otvet/):
// все элементы выводятся одним списком [data-tabs-list="group"], у каждого
// элемента data-tag="id категории" (можно несколько через пробел).
// Клик по табу [data-tab="id"] показывает только элементы с этим тегом,
// таб data-tab="all" показывает все элементы.
//
// Служебные элементы внутри списка (пагинация, «Показать ещё», пустое
// состояние и т.п.) привязываются к табу атрибутом data-tab-only="id"
// (можно несколько через пробел) — видны только на этих табах, включая "all".
// Элементы без data-tag / data-tab-only видны всегда.
export function tabs(context = document) {
    const roots = context.querySelectorAll("[data-tabs]");

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;

        const group = root.dataset.tabs || "";
        const tabButtons = Array.from(root.querySelectorAll("[data-tab]"));
        if (!tabButtons.length) return;

        // Список ищем по группе, чтобы несколько наборов табов на странице не мешали друг другу.
        const list = document.querySelector(group ? `[data-tabs-list="${group}"]` : "[data-tabs-list]");
        if (!list) return;
        // Элементы ищем при каждом переключении — подгруженные позже (AJAX,
        // «Показать ещё») тоже фильтруются без переинициализации.
        const getItems = () => list.querySelectorAll("[data-tag], [data-tab-only]");

        // Длительности анимаций (синхронно с @keyframes в SCSS).
        const LEAVE_MS = 200;
        const ENTER_MS = 400;
        let switchTimer = null;
        let enterTimer = null;
        let heightCleanup = null;

        const reinitLazy = () => {
            if (typeof window.reinitLazy === "function") window.reinitLazy();
        };

        // После смены высоты списка секции ниже сдвигаются — AOS должен пересчитать
        // их позиции, иначе анимация появления срабатывает на старом месте (или никогда).
        const refreshAos = () => {
            if (typeof window.refreshAos === "function") window.refreshAos();
        };

        const prefersReducedMotion = () =>
            window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const tagsOf = (value) => value.trim().split(/\s+/);
        const matches = (item, id) => {
            if (item.dataset.tabOnly !== undefined) return tagsOf(item.dataset.tabOnly).includes(id);
            return id === "all" || tagsOf(item.dataset.tag).includes(id);
        };

        // Показать элементы выбранной категории, остальные скрыть.
        const applyFilter = (id) => {
            getItems().forEach((item) => {
                item.hidden = !matches(item, id);
            });
            reinitLazy();
        };

        const setActiveTab = (id) => {
            tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === id));
        };

        // Плавно анимируем высоту списка: в категориях разное количество
        // элементов, и без этого блок ниже «прыгает» рывком при переключении.
        const animateHeight = (from, to) => {
            if (heightCleanup) heightCleanup();
            if (from === to || prefersReducedMotion()) {
                refreshAos();
                return;
            }

            list.style.height = `${from}px`;
            list.style.overflow = "hidden";
            void list.offsetHeight; // reflow — фиксируем стартовую высоту
            list.style.transition = `height ${ENTER_MS}ms ease`;
            list.style.height = `${to}px`;

            const cleanup = () => {
                list.style.height = "";
                list.style.overflow = "";
                list.style.transition = "";
                list.removeEventListener("transitionend", onEnd);
                window.clearTimeout(fallback);
                heightCleanup = null;
                refreshAos();
            };
            const onEnd = (e) => {
                if (e.target === list && e.propertyName === "height") cleanup();
            };
            list.addEventListener("transitionend", onEnd);
            const fallback = window.setTimeout(cleanup, ENTER_MS + 80);
            heightCleanup = cleanup;
        };

        const activate = (id) => {
            if (root.dataset.active === id) return;
            root.dataset.active = id;

            // Подсветку таба меняем сразу — интерфейс отзывчивый.
            setActiveTab(id);

            if (switchTimer) {
                clearTimeout(switchTimer);
                switchTimer = null;
            }

            if (prefersReducedMotion()) {
                list.classList.remove("is-leaving", "is-entering");
                applyFilter(id);
                refreshAos();
                return;
            }

            // Кросс-фейд: гасим список, меняем состав элементов, показываем снова.
            list.classList.remove("is-entering");
            list.classList.add("is-leaving");
            switchTimer = window.setTimeout(() => {
                switchTimer = null;

                if (heightCleanup) heightCleanup();
                const fromHeight = list.offsetHeight;

                applyFilter(id);
                list.classList.remove("is-leaving");
                list.classList.add("is-entering");
                window.clearTimeout(enterTimer);
                enterTimer = window.setTimeout(() => list.classList.remove("is-entering"), ENTER_MS);

                animateHeight(fromHeight, list.offsetHeight);
            }, LEAVE_MS);
        };

        // Начальное состояние — по активному табу (без анимации).
        const initial = tabButtons.find((btn) => btn.classList.contains("active")) || tabButtons[0];
        root.dataset.active = initial.dataset.tab;
        setActiveTab(initial.dataset.tab);
        applyFilter(initial.dataset.tab);

        tabButtons.forEach((btn) => {
            btn.addEventListener(
                "click",
                () => {
                    if (btn.dataset.tab) activate(btn.dataset.tab);
                },
                { signal }
            );
        });

        root.addEventListener(
            "destroy",
            () => {
                if (switchTimer) clearTimeout(switchTimer);
                window.clearTimeout(enterTimer);
                if (heightCleanup) heightCleanup();
                controller.abort();
            },
            { once: true }
        );
    });
}
