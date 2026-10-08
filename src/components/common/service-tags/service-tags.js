export function serviceTags(context = document) {
    const roots = [...context.querySelectorAll("[data-service-tags]")];

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

        const setOpen = (open) => {
            if (open) lockSiblings();

            root.classList.toggle("open", open);
            more.inert = !open;
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? toggle.dataset.hideText : toggle.dataset.showText;
        };

        toggle.addEventListener("click", () => setOpen(!root.classList.contains("open")), { signal });

        more.addEventListener(
            "transitionend",
            (event) => {
                if (event.target !== more || event.propertyName !== "grid-template-rows") return;
                if (!root.classList.contains("open")) unlockSiblings();
            },
            { signal }
        );

        root.addEventListener(
            "destroy",
            () => {
                unlockSiblings();
                controller.abort();
            },
            { once: true, signal }
        );
    });
}
