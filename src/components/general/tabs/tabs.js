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

        // Панели ищем по группе, чтобы несколько наборов табов не мешали друг другу.
        const panelSelector = group ? `[data-tab-panel][data-tabs-group="${group}"]` : "[data-tab-panel]";
        const panels = Array.from(document.querySelectorAll(panelSelector));

        // Длительности анимаций (синхронно с @keyframes в SCSS).
        const LEAVE_MS = 200;
        const ENTER_MS = 400;
        let switchTimer = null;

        const reinitLazy = () => {
            if (typeof window.reinitLazy === "function") window.reinitLazy();
        };

        // Показать панель с плавным появлением (CSS-анимация tab-panel-in).
        // Класс снимаем по таймеру — в покое панель всегда видима (opacity 1).
        const showPanel = (panel) => {
            panel.hidden = false;
            panel.classList.remove("is-leaving");
            panel.classList.add("active", "is-entering");
            window.setTimeout(() => panel.classList.remove("is-entering"), ENTER_MS);
            reinitLazy();
        };

        // Мгновенно завершить незаконченное гашение (при быстрых кликах).
        const finishLeaving = () => {
            panels.forEach((panel) => {
                if (panel.classList.contains("is-leaving")) {
                    panel.hidden = true;
                    panel.classList.remove("is-leaving", "active");
                }
            });
        };

        const activate = (id) => {
            // Подсветку таба меняем сразу — интерфейс отзывчивый.
            tabButtons.forEach((btn) => {
                const isActive = btn.dataset.tab === id;
                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-selected", isActive ? "true" : "false");
            });

            if (switchTimer) {
                clearTimeout(switchTimer);
                switchTimer = null;
                finishLeaving();
            }

            const next = panels.find((panel) => panel.dataset.tabPanel === id);
            if (!next) return;

            const current = panels.find((panel) => !panel.hidden && panel !== next);
            if (!current) {
                showPanel(next);
                return;
            }
            if (current === next) return;

            // Кросс-фейд: сначала плавно гасим текущую панель, затем показываем новую.
            current.classList.add("is-leaving");
            switchTimer = window.setTimeout(() => {
                switchTimer = null;
                current.hidden = true;
                current.classList.remove("is-leaving", "active");
                showPanel(next);
            }, LEAVE_MS);
        };

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
                controller.abort();
            },
            { once: true }
        );
    });
}
