// Сохраняем реальную ширину скроллбара в CSS-переменную --scrollbar-width,
// чтобы фиксированный (залипший) хедер мог компенсировать её при открытии
// модалок. Fancybox прячет скроллбар и сдвигает body, но fixed-хедер
// позиционируется от вьюпорта и уезжает на ширину скроллбара.
//
// Своя переменная нужна, потому что Fancybox пересчитывает свою
// (--f-scrollbar-compensate) при каждом открытии и обнуляет её, если скроллбар
// уже скрыт (наложение модалок, повторный вызов) — тогда компенсация ломается.
// Мы же обновляем значение только когда скроллбар реально виден, и никогда не
// затираем его нулём, пока модалка открыта.
export function initScrollbarWidth() {
    const root = document.documentElement;

    const update = () => {
        // Модалка открыта — скроллбар скрыт, замер дал бы 0. Не трогаем.
        if (root.classList.contains("with-fancybox")) return false;

        const width = window.innerWidth - root.clientWidth;
        if (width > 0) {
            root.style.setProperty("--scrollbar-width", `${width}px`);
            return true;
        }
        return false;
    };

    // Скроллбар может появиться только после догрузки ленивого контента —
    // тогда ловим его на первом скролле и снимаем слушатель, чтобы не дёргать
    // layout на каждом событии.
    const onScroll = () => {
        if (update()) window.removeEventListener("scroll", onScroll);
    };

    if (!update()) {
        window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", update, { passive: true });
}
