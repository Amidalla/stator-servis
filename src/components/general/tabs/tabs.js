export function tabs(context = document) {
    const roots = context.querySelectorAll('[data-component="tabs"]');
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;

        const navItems = root.querySelectorAll("[data-tabs-nav]");
        const panels = root.querySelectorAll("[data-tabs-panel]");
        const panelsContainer = root.querySelector(".panels");

        if (!navItems.length || !panels.length || !panelsContainer) return;

        let isTransitioning = false;
        // let currentHeight = 0; // Удалено - не используется

        // Функция обновления высоты контейнера
        const updateContainerHeight = (index) => {
            const activePanel = panels[index];
            if (!activePanel) return;

            // Показываем панель временно для измерения
            const wasHidden = activePanel.hidden;
            if (wasHidden) {
                activePanel.hidden = false;
                activePanel.style.position = "absolute";
                activePanel.style.opacity = "0";
                activePanel.style.visibility = "hidden";
            }

            // Получаем высоту
            const height = activePanel.scrollHeight;

            if (wasHidden) {
                activePanel.hidden = true;
                activePanel.style.position = "";
                activePanel.style.opacity = "";
                activePanel.style.visibility = "";
            }

            // Устанавливаем высоту контейнера
            if (height > 0) {
                panelsContainer.style.minHeight = `${height}px`;
                // currentHeight = height; // Удалено - не используется
            }
        };

        // Функция активации таба
        const activateTab = (index) => {
            if (isTransitioning) return;
            if (navItems[index].classList.contains("is-active")) return;

            isTransitioning = true;

            // Обновляем навигацию
            navItems.forEach((item, i) => {
                const isActive = i === index;
                item.classList.toggle("is-active", isActive);
                item.setAttribute("aria-selected", isActive ? "true" : "false");
            });

            // Сначала обновляем высоту контейнера под новую панель
            updateContainerHeight(index);

            // Переключаем панели с задержкой для плавности
            setTimeout(() => {
                panels.forEach((panel, i) => {
                    const isActive = i === index;

                    if (isActive) {
                        panel.hidden = false;
                        // Небольшая задержка для запуска анимации
                        requestAnimationFrame(() => {
                            panel.classList.add("is-active");
                        });
                    } else {
                        panel.classList.remove("is-active");
                        // Скрываем после завершения анимации
                        setTimeout(() => {
                            if (!panel.classList.contains("is-active")) {
                                panel.hidden = true;
                            }
                        }, 400);
                    }
                });

                setTimeout(() => {
                    isTransitioning = false;
                }, 400);
            }, 50);
        };

        // Обработчики кликов
        navItems.forEach((item, index) => {
            item.addEventListener(
                "click",
                () => {
                    activateTab(index);
                },
                { signal }
            );

            item.addEventListener(
                "keydown",
                (e) => {
                    let newIndex;

                    if (e.key === "ArrowRight") {
                        newIndex = (index + 1) % navItems.length;
                    } else if (e.key === "ArrowLeft") {
                        newIndex = (index - 1 + navItems.length) % navItems.length;
                    } else if (e.key === "Home") {
                        newIndex = 0;
                    } else if (e.key === "End") {
                        newIndex = navItems.length - 1;
                    } else {
                        return;
                    }

                    e.preventDefault();
                    navItems[newIndex].focus();
                    activateTab(newIndex);
                },
                { signal }
            );
        });

        // Инициализация — устанавливаем высоту для активной панели
        const activeIndex = Array.from(panels).findIndex((p) => p.classList.contains("is-active"));
        if (activeIndex !== -1) {
            setTimeout(() => {
                updateContainerHeight(activeIndex);
            }, 100);
        } else if (panels.length > 0) {
            // Если нет активной — активируем первую
            panels[0].classList.add("is-active");
            panels[0].hidden = false;
            setTimeout(() => {
                updateContainerHeight(0);
            }, 100);
        }

        // Обновляем высоту при ресайзе
        const handleResize = () => {
            const activeIndex = Array.from(panels).findIndex((p) => p.classList.contains("is-active"));
            if (activeIndex !== -1) {
                updateContainerHeight(activeIndex);
            }
        };

        window.addEventListener("resize", handleResize);

        // Используем ResizeObserver для отслеживания изменения размера панелей
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(() => {
                const activeIndex = Array.from(panels).findIndex((p) => p.classList.contains("is-active"));
                if (activeIndex !== -1) {
                    updateContainerHeight(activeIndex);
                }
            });

            panels.forEach((panel) => {
                resizeObserver.observe(panel);
            });

            root._resizeObserver = resizeObserver;
        }

        // Cleanup
        root.addEventListener(
            "destroy",
            () => {
                controller.abort();
                window.removeEventListener("resize", handleResize);
                if (root._resizeObserver) {
                    root._resizeObserver.disconnect();
                }
            },
            { once: true }
        );
    });
}
