export function accordion(context = document) {
    const roots = context.querySelectorAll('[data-accordion="component"]');
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;

        const items = root.querySelectorAll("[data-accordion-item]");
        if (!items.length) return;

        const collapseItem = (item) => {
            const panel = item.querySelector(".panel");
            const collapse = item.querySelector(".collapse");
            if (collapse && panel) {
                const currentHeight = collapse.scrollHeight;
                collapse.style.maxHeight = `${currentHeight}px`;

                // Форсируем перерисовку
                void collapse.offsetHeight;

                item.classList.remove("is-open");
                panel.setAttribute("aria-expanded", "false");
                collapse.style.maxHeight = "0px";
            }
        };

        const expandItem = (item) => {
            const panel = item.querySelector(".panel");
            const collapse = item.querySelector(".collapse");
            if (collapse && panel) {
                // Добавляем класс
                item.classList.add("is-open");
                panel.setAttribute("aria-expanded", "true");

                // Ждем один кадр, чтобы браузер применил класс
                requestAnimationFrame(() => {
                    // Теперь высота доступна
                    const height = collapse.scrollHeight;
                    collapse.style.maxHeight = `${height}px`;
                });
            }
        };

        const toggleItem = (targetItem) => {
            const isOpen = targetItem.classList.contains("is-open");
            if (isOpen) {
                collapseItem(targetItem);
                return;
            }

            items.forEach((item) => {
                if (item !== targetItem && item.classList.contains("is-open")) {
                    collapseItem(item);
                }
            });
            expandItem(targetItem);
        };

        items.forEach((item) => {
            const panel = item.querySelector(".panel");
            if (!panel) return;

            if (panel.getAttribute("aria-expanded") === "true" || item.classList.contains("is-open")) {
                item.classList.add("is-open");
                panel.setAttribute("aria-expanded", "true");
                const collapse = item.querySelector(".collapse");
                if (collapse) {
                    collapse.style.maxHeight = `${collapse.scrollHeight}px`;
                }
            }

            panel.addEventListener("click", () => toggleItem(item), { signal });
        });

        root.addEventListener("destroy", () => controller.abort(), { once: true });
    });
}
