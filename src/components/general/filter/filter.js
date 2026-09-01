export function filterToggle(context = document) {
    const filter = context.querySelector(".filter");
    if (!filter || filter.dataset.init === "true") return;

    filter.dataset.init = "true";

    const header = filter.querySelector("#filterToggle");
    const body = filter.querySelector("#filterBody");

    if (!header || !body) return;

    const LAPTOP_BREAKPOINT = 1365.98;
    let isOpen = false;

    function checkDesktop() {
        const isDesktop = window.innerWidth > LAPTOP_BREAKPOINT;

        if (isDesktop) {
            body.style.display = "block";
            filter.classList.remove("is-open");
            isOpen = false;
        } else {
            body.style.display = "none";
            filter.classList.remove("is-open");
            isOpen = false;
        }
    }

    function openFilter() {
        filter.classList.add("is-open");
        body.style.display = "block";
        isOpen = true;

        setTimeout(() => {
            body.querySelectorAll(".custom-scroll__container").forEach((el) => {
                el.dispatchEvent(new Event("scroll"));
            });
        }, 350);
    }

    function closeFilter() {
        filter.classList.remove("is-open");
        body.style.display = "none";
        isOpen = false;
    }

    function toggleFilter() {
        if (isOpen) {
            closeFilter();
        } else {
            openFilter();
        }
    }

    // Клик по заголовку
    header.addEventListener("click", (e) => {
        e.stopPropagation();
        const isDesktop = window.innerWidth > LAPTOP_BREAKPOINT;
        if (isDesktop) return;

        toggleFilter();
    });

    // Клик вне фильтра
    document.addEventListener("click", (e) => {
        const isDesktop = window.innerWidth > LAPTOP_BREAKPOINT;
        if (isDesktop) return;

        // Проверяем, был ли клик внутри фильтра
        const isClickInside = filter.contains(e.target);

        if (!isClickInside && isOpen) {
            closeFilter();
        }
    });

    // Закрытие при нажатии Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen) {
            const isDesktop = window.innerWidth > LAPTOP_BREAKPOINT;
            if (!isDesktop) {
                closeFilter();
            }
        }
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkDesktop, 250);
    });

    checkDesktop();
}
