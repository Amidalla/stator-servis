export function header(context = document) {
    const root = context.querySelector("header.header");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const toggleSticky = () => {
        root.classList.toggle("is-sticky", window.scrollY > 0);
    };

    window.addEventListener("scroll", toggleSticky, { passive: true });
    toggleSticky();

    const phones = root.querySelector(".contacts-header .phones");
    const phonesToggle = phones?.querySelector(".phones-toggle");

    const closePhones = () => {
        if (!phones || !phonesToggle) return;
        phones.classList.remove("is-open");
        phonesToggle.setAttribute("aria-expanded", "false");
    };

    const onPhonesToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = phones.classList.toggle("is-open");
        phonesToggle.setAttribute("aria-expanded", String(isOpen));
    };

    const onDocumentClick = (e) => {
        if (phones && !phones.contains(e.target)) closePhones();
    };

    phonesToggle?.addEventListener("click", onPhonesToggle);
    document.addEventListener("click", onDocumentClick);

    root.addEventListener(
        "destroy",
        () => {
            window.removeEventListener("scroll", toggleSticky);
            phonesToggle?.removeEventListener("click", onPhonesToggle);
            document.removeEventListener("click", onDocumentClick);
        },
        { once: true }
    );
}
