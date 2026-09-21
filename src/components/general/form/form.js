export function form(context = document) {
    const roots = context.querySelectorAll(".form[data-validate]");
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const controller = new AbortController();
        const { signal } = controller;

        const submitBtn = root.querySelector('[type="submit"]');
        const requiredFields = root.querySelectorAll("[required]");
        // E-mail проверяем, даже если поле необязательное: пустое — ок,
        // заполненное — должно быть в правильном формате.
        const emailFields = root.querySelectorAll('input[type="email"]');
        const watchedFields = new Set([...requiredFields, ...emailFields]);

        const isFieldValid = (field) => {
            if (field.type === "checkbox") return field.checked;

            const value = field.value.trim();
            // Пустое необязательное поле — валидно; обязательное пустое — нет.
            if (value === "") return !field.required;

            if (field.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            }

            if (field.dataset.mask === "phone") {
                return value.replace(/\D/g, "").length === 11;
            }

            if (field.minLength > 0 && value.length < field.minLength) {
                return false;
            }

            return true;
        };

        const updateSubmitState = () => {
            if (!submitBtn) return;
            // Блокируем сабмит, если не заполнены обязательные поля или
            // введён e-mail в неверном формате
            submitBtn.disabled = ![...watchedFields].every(isFieldValid);
        };

        const showError = (wrapper, message) => {
            let hint = wrapper.querySelector(".field-error");
            if (!hint) {
                hint = document.createElement("span");
                hint.className = "field-error";
                wrapper.appendChild(hint);
            }
            hint.textContent = message;
            wrapper.classList.add("invalid");
            wrapper.classList.remove("valid");
        };

        const clearError = (wrapper) => {
            const hint = wrapper.querySelector(".field-error");
            if (hint) hint.remove();
            wrapper.classList.remove("invalid");
            wrapper.classList.add("valid");
        };

        const validateField = (field) => {
            const wrapper = field.closest(".field") || field.closest(".field-consent");
            if (!wrapper) return;

            if (isFieldValid(field)) {
                clearError(wrapper);
                return;
            }

            // Для e-mail с введённым, но некорректным значением — сообщение
            // про формат; иначе — data-error поля или общий текст
            let message = field.dataset.error || "Заполните поле";
            if (field.type === "email" && field.value.trim() !== "") {
                message = field.dataset.errorFormat || "Заполните e-mail в правильном формате";
            }
            showError(wrapper, message);
        };

        watchedFields.forEach((field) => {
            field.addEventListener(
                "input",
                () => {
                    validateField(field);
                    updateSubmitState();
                },
                { signal }
            );

            field.addEventListener(
                "change",
                () => {
                    validateField(field);
                    updateSubmitState();
                },
                { signal }
            );

            field.addEventListener(
                "blur",
                () => {
                    if (field.type !== "checkbox" && field.value.trim() !== "") {
                        validateField(field);
                    }
                },
                { signal }
            );
        });

        updateSubmitState();

        root.addEventListener("destroy", () => controller.abort(), { once: true });
    });
}
