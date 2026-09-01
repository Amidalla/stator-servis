export function menu(context = document) {
    const root = context.querySelector('[data-dropdown="menu"]');
    if (!root || root.dataset.init === "true") return;

    const toggles = context.querySelectorAll('[data-toggle="menu"]');
    if (!toggles.length) return;

    root.dataset.init = "true";

    const body = document.body;

    // Создаём оверлей, если его нет
    let overlay = document.querySelector(".overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 101;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.70);
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
    }

    const controller = new AbortController();
    const { signal } = controller;

    root.setAttribute("aria-hidden", "true");
    toggles.forEach((btn) => btn.setAttribute("aria-expanded", "false"));

    const open = () => {
        root.classList.add("is-open");
        root.setAttribute("aria-hidden", "false");
        body.classList.add("is-fixed");
        overlay.style.opacity = "1";
        overlay.style.visibility = "visible";
        overlay.style.pointerEvents = "auto";
        toggles.forEach((btn) => {
            btn.classList.add("is-active");
            btn.setAttribute("aria-expanded", "true");
        });
    };

    const close = () => {
        if (root.contains(document.activeElement)) {
            toggles[0]?.focus();
        }

        root.classList.remove("is-open");
        root.setAttribute("aria-hidden", "true");
        body.classList.remove("is-fixed");
        overlay.style.opacity = "0";
        overlay.style.visibility = "hidden";
        overlay.style.pointerEvents = "none";
        toggles.forEach((btn) => {
            btn.classList.remove("is-active");
            btn.setAttribute("aria-expanded", "false");
        });
    };

    const toggle = (e) => {
        e.preventDefault();
        root.classList.contains("is-open") ? close() : open();
    };

    const onDocClick = (e) => {
        if (!document.contains(root)) return;
        if (e.target.closest('[data-dropdown="menu"], [data-toggle="menu"]')) return;
        close();
    };

    const onEsc = (e) => {
        if (e.key === "Escape" && root.classList.contains("is-open")) {
            close();
        }
    };

    toggles.forEach((btn) => btn.addEventListener("click", toggle, { signal }));
    overlay.addEventListener("click", close, { signal });

    document.addEventListener("click", onDocClick, { signal });
    document.addEventListener("keydown", onEsc, { signal });

    // авто-очистка при удалении компонента
    root.addEventListener("destroy", () => controller.abort(), { once: true });
}
