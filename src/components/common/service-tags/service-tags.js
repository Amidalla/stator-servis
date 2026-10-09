const DURATION = 450;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

export function serviceTags(context = document) {
    const roots = [...context.querySelectorAll("[data-service-tags]")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;

        const more = root.querySelector("[data-service-tags-more]");
        const toggle = root.querySelector("[data-service-tags-toggle]");
        if (!more || !toggle) return;

        root.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;
        const card = root.closest(".card");
        const siblings = card?.parentElement ? [...card.parentElement.children].filter((el) => el !== card) : [];
        let animation = null;

        more.id ||= `service-tags-more-${Math.random().toString(36).slice(2, 9)}`;
        toggle.setAttribute("aria-controls", more.id);

        // Соседние карточки сохраняют свою высоту и не растягиваются вслед за раскрытой
        const lockSiblings = () => {
            const heights = siblings.map((el) => el.offsetHeight);
            siblings.forEach((el, i) => {
                el.style.alignSelf = "start";
                el.style.minHeight = `${heights[i]}px`;
            });
        };

        const unlockSiblings = () => {
            siblings.forEach((el) => {
                el.style.alignSelf = "";
                el.style.minHeight = "";
            });
        };

        // Текущее (в т.ч. промежуточное, если анимация ещё идёт) состояние блока
        const readFrame = () => {
            const styles = getComputedStyle(more);
            return { height: `${more.offsetHeight}px`, marginTop: styles.marginTop, opacity: styles.opacity };
        };

        const setOpen = (open) => {
            const from = readFrame();
            animation?.cancel();

            if (open && !animation) lockSiblings();

            root.classList.toggle("open", open);
            more.inert = !open;
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? toggle.dataset.hideText : toggle.dataset.showText;

            const to = readFrame();
            if (reducedMotion.matches) {
                animation = null;
                if (!open) unlockSiblings();
                return;
            }

            const current = more.animate([from, to], { duration: DURATION, easing: EASING });
            animation = current;
            current.finished.then(
                () => {
                    if (animation !== current) return;
                    animation = null;
                    if (!open) unlockSiblings();
                },
                () => {}
            );
        };

        toggle.addEventListener("click", () => setOpen(!root.classList.contains("open")), { signal });

        root.addEventListener(
            "destroy",
            () => {
                animation?.cancel();
                unlockSiblings();
                controller.abort();
            },
            { once: true, signal }
        );
    });
}
