// src/js/utils/custom-scroll.js
export function initCustomScroll(context = document) {
    const customScrolls = context.querySelectorAll(".custom-scroll");

    customScrolls.forEach((scroll) => {
        const container = scroll.querySelector(".custom-scroll__container");
        const track = scroll.querySelector(".custom-scroll__track");
        const thumb = scroll.querySelector(".custom-scroll__thumb");

        if (!container || !track || !thumb) return;

        // Проверяем, инициализирован ли уже этот скролл
        if (scroll.dataset.initialized === "true") return;
        scroll.dataset.initialized = "true";

        // Функция обновления позиции thumb
        function updateThumb() {
            const scrollHeight = container.scrollHeight;
            const clientHeight = container.clientHeight;

            if (scrollHeight <= clientHeight) {
                track.style.display = "none";
                return;
            }

            track.style.display = "block";

            const scrollTop = container.scrollTop;
            const maxScrollTop = scrollHeight - clientHeight;
            const thumbHeight = Math.max(20, (clientHeight / scrollHeight) * track.clientHeight);

            thumb.style.height = `${thumbHeight}px`;

            const thumbTop = (scrollTop / maxScrollTop) * (track.clientHeight - thumbHeight);
            thumb.style.top = `${thumbTop}px`;
        }

        // Обновляем при скролле
        container.addEventListener("scroll", updateThumb);

        // Перетаскивание thumb
        let isDragging = false;

        thumb.addEventListener("mousedown", (e) => {
            e.preventDefault();
            isDragging = true;
            const startY = e.clientY;
            const startTop = parseFloat(thumb.style.top) || 0;

            function onMouseMove(e) {
                if (!isDragging) return;

                const deltaY = e.clientY - startY;
                const trackHeight = track.clientHeight;
                const thumbHeight = thumb.clientHeight;
                const maxTop = trackHeight - thumbHeight;

                let newTop = startTop + deltaY;
                newTop = Math.max(0, Math.min(newTop, maxTop));

                thumb.style.top = `${newTop}px`;

                // Прокручиваем контейнер
                const scrollRatio = newTop / maxTop;
                const maxScrollTop = container.scrollHeight - container.clientHeight;
                container.scrollTop = scrollRatio * maxScrollTop;
            }

            function onMouseUp() {
                isDragging = false;
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        // Обновляем при ресайзе
        const resizeObserver = new ResizeObserver(() => {
            updateThumb();
        });
        resizeObserver.observe(container);

        // Обновляем при изменении содержимого
        const mutationObserver = new MutationObserver(() => {
            updateThumb();
        });
        mutationObserver.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Первоначальное обновление
        setTimeout(updateThumb, 100);
    });
}
