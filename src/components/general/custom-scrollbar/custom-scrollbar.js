// Кастомная горизонтальная полоса прокрутки для таблиц: нативная полоса
// скрывается (CSS), а её вид рисуется отдельным элементом по макету.
// Компонент навешивается на каждый .table-wrap и синхронизирует бегунок
// со scrollLeft, поддерживает перетаскивание и клик по дорожке.
export function customScrollbar(context = document) {
    const wraps = context.querySelectorAll(".table-wrap");
    if (!wraps.length) return;

    // За сколько пикселей до конца прокрутки скрывать правую границу
    // (не дожидаясь, пока докрутят строго до упора).
    const EDGE_THRESHOLD = 30;

    wraps.forEach((wrap) => {
        if (wrap.dataset.scrollbarInit === "true") return;
        wrap.dataset.scrollbarInit = "true";

        const controller = new AbortController();
        const { signal } = controller;

        const bar = document.createElement("div");
        bar.className = "table-scrollbar";
        bar.setAttribute("aria-hidden", "true");

        const thumb = document.createElement("div");
        thumb.className = "table-scrollbar__thumb";
        bar.appendChild(thumb);
        wrap.after(bar);

        // Горизонтальные отступы дорожки (padding-left + padding-right)
        const trackGap = () => {
            const cs = getComputedStyle(bar);
            return parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        };

        const update = () => {
            const overflow = wrap.scrollWidth - wrap.clientWidth;
            const scrollable = overflow > 1;
            // Правую границу (класс .is-scrollable, CSS рисует по нему бордер,
            // как в макете) показываем, пока справа ещё есть что прокручивать:
            // видна с самого начала и во время прокрутки, а когда до конца
            // остаётся меньше EDGE_THRESHOLD — исчезает чуть раньше, чем
            // докрутили строго до упора.
            const hasMoreRight = scrollable && wrap.scrollLeft < overflow - EDGE_THRESHOLD;
            wrap.classList.toggle("is-scrollable", hasMoreRight);
            if (!scrollable) {
                bar.hidden = true;
                return;
            }
            bar.hidden = false;

            const trackW = bar.clientWidth - trackGap();
            const thumbW = Math.max(32, (wrap.clientWidth / wrap.scrollWidth) * trackW);
            const maxX = trackW - thumbW;
            const x = maxX > 0 ? maxX * (wrap.scrollLeft / overflow) : 0;

            thumb.style.width = `${thumbW}px`;
            thumb.style.transform = `translateX(${x}px)`;
        };

        wrap.addEventListener("scroll", update, { passive: true, signal });
        window.addEventListener("resize", update, { signal });

        let resizeObserver = null;
        if (window.ResizeObserver) {
            resizeObserver = new ResizeObserver(update);
            resizeObserver.observe(wrap);
            const inner = wrap.firstElementChild;
            if (inner) resizeObserver.observe(inner);
        }

        // Перетаскивание бегунка
        let dragging = false;
        let startX = 0;
        let startScroll = 0;

        thumb.addEventListener(
            "pointerdown",
            (e) => {
                dragging = true;
                startX = e.clientX;
                startScroll = wrap.scrollLeft;
                thumb.setPointerCapture?.(e.pointerId);
                document.body.style.userSelect = "none";
                e.preventDefault();
            },
            { signal }
        );

        window.addEventListener(
            "pointermove",
            (e) => {
                if (!dragging) return;
                const overflow = wrap.scrollWidth - wrap.clientWidth;
                const maxX = bar.clientWidth - trackGap() - thumb.offsetWidth;
                if (maxX <= 0) return;
                wrap.scrollLeft = startScroll + ((e.clientX - startX) / maxX) * overflow;
                update();
            },
            { signal }
        );

        window.addEventListener(
            "pointerup",
            (e) => {
                if (!dragging) return;
                dragging = false;
                thumb.releasePointerCapture?.(e.pointerId);
                document.body.style.userSelect = "";
            },
            { signal }
        );

        // Клик по дорожке — перемотка к позиции
        bar.addEventListener(
            "pointerdown",
            (e) => {
                if (e.target === thumb) return;
                const overflow = wrap.scrollWidth - wrap.clientWidth;
                const cs = getComputedStyle(bar);
                const padL = parseFloat(cs.paddingLeft);
                const maxX = bar.clientWidth - trackGap() - thumb.offsetWidth;
                if (maxX <= 0) return;
                const clickX = e.clientX - bar.getBoundingClientRect().left - padL - thumb.offsetWidth / 2;
                const ratio = Math.max(0, Math.min(1, clickX / maxX));
                wrap.scrollLeft = ratio * overflow;
                update();
            },
            { signal }
        );

        update();

        wrap.addEventListener(
            "destroy",
            () => {
                controller.abort();
                wrap.classList.remove("is-scrollable");
                resizeObserver?.disconnect();
                bar.remove();
                delete wrap.dataset.scrollbarInit;
            },
            { once: true }
        );
    });
}
