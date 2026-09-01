export function searchForm(context = document) {
    const root = context.querySelector(".search-form");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const toggle = root.querySelector(".search-toggle");
    const dropdown = root.querySelector(".search-dropdown");
    const input = root.querySelector(".search-header input");
    const allResultsBtn = root.querySelector(".search-all-results");
    const wrap = root.closest(".wrap");
    let isOpen = false;

    const open = () => {
        if (isOpen) return;
        isOpen = true;
        root.classList.add("is-active");
        if (wrap) wrap.style.background = "var(--color-red)";
        setTimeout(() => input?.focus(), 300);
    };

    const close = () => {
        if (!isOpen) return;
        isOpen = false;
        root.classList.remove("is-active");
        if (wrap) wrap.style.background = "";
        if (input) {
            input.value = "";
            input.blur();
        }
    };

    const toggleSearch = (e) => {
        e.stopPropagation();
        isOpen ? close() : open();
    };

    // События
    toggle?.addEventListener("click", toggleSearch);

    document.addEventListener("click", (e) => {
        if (!root.contains(e.target)) {
            close();
        }
    });

    input?.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            close();
        }
    });

    // Закрытие при клике на ссылки внутри результатов (кроме кнопки "Показать все")
    dropdown?.addEventListener("click", (e) => {
        const target = e.target.closest("a");
        if (target && !target.classList.contains("search-all-results")) {
            setTimeout(close, 200);
        }
    });

    // Кнопка "Показать все результаты" - не закрывает поиск, просто переходит по ссылке
    allResultsBtn?.addEventListener("click", () => {
        // Ничего не делаем, просто переходим по ссылке
    });

    root.addEventListener(
        "destroy",
        () => {
            // Очистка при необходимости
        },
        { once: true }
    );

    return { open, close, toggle: () => (isOpen ? close() : open()) };
}
