export function navigationMobile(context = document) {
    const root = context.querySelector("[data-navigation-mobile]");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;

    const toggleSubmenu = (e) => {
        const btn = e.currentTarget;
        const li = btn.closest("li");
        const submenu = li.querySelector(":scope > .submenu");
        const isOpen = li.classList.contains("is-open");

        if (isOpen) {
            li.classList.remove("is-open");
            btn.setAttribute("aria-expanded", "false");
            submenu.style.maxHeight = null;
        } else {
            li.classList.add("is-open");
            btn.setAttribute("aria-expanded", "true");
            submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        }
    };

    const toggles = root.querySelectorAll("[data-toggle-submenu]");
    toggles.forEach((btn) => btn.addEventListener("click", toggleSubmenu, { signal }));

    root.addEventListener("destroy", () => controller.abort(), { once: true });
}
