// --------------------------------------
// Компонент Consent Notice
// --------------------------------------

export function consentNotice(context = document) {
    const root = context.querySelector('[data-consent="notice"]');
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;

    const STORAGE_KEY = "user_consent_accepted";
    const STORAGE_DURATION = 30; // дней

    // Установка значения в localStorage с датой истечения
    const setStorage = (key, value, days) => {
        const item = {
            value,
            expiry: Date.now() + days * 24 * 60 * 60 * 1000
        };
        localStorage.setItem(key, JSON.stringify(item));
    };

    // Получение значения из localStorage с проверкой срока
    const getStorage = (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        } catch {
            return null;
        }
    };

    // Показать уведомление
    const show = () => {
        root.classList.add("is-visible");
    };

    // Скрыть и сохранить согласие
    const accept = () => {
        root.classList.remove("is-visible");
        setStorage(STORAGE_KEY, "true", STORAGE_DURATION);
    };

    // Проверяем, было ли уже принято согласие
    if (getStorage(STORAGE_KEY) !== "true") {
        show();
    }

    // Обработчик кнопки "Принять"
    const acceptBtn = root.querySelector('[data-consent="accept"]');
    if (acceptBtn) {
        acceptBtn.addEventListener("click", accept, { signal });
    }

    // Обработчик кнопки "Закрыть"
    const dismissBtn = root.querySelector('[data-consent="dismiss"]');
    if (dismissBtn) {
        dismissBtn.addEventListener("click", accept, { signal });
    }

    // Очистка при удалении элемента
    root.addEventListener("destroy", () => controller.abort(), { once: true });
}
