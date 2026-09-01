export function header(context = document) {
    const root = context.querySelector("header.header");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const toggleSticky = () => {
        root.classList.toggle("is-sticky", window.scrollY > 0);
    };

    window.addEventListener("scroll", toggleSticky, { passive: true });
    toggleSticky();

    root.addEventListener(
        "destroy",
        () => {
            window.removeEventListener("scroll", toggleSticky);
        },
        { once: true }
    );
}
