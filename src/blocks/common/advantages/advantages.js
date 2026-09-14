export function advantages(context = document) {
    const root = context.querySelector("[data-advantages]");
    if (!root || root.dataset.init === "true") return;

    const counters = root.querySelectorAll("[data-digits-counter]");
    if (!counters.length) return;

    root.dataset.init = "true";

    const controller = new AbortController();

    counters.forEach((el) => {
        el.dataset.digitsCounter = el.textContent.trim().replace(/\D/g, "") || "0";
        el.textContent = "0";
    });

    const formatValue = (value, separator) => {
        const str = String(value);
        if (!separator) return str;
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    };

    const animateCounter = (el) => {
        const duration = Number.parseInt(el.dataset.digitsCounterSpeed, 10) || 1800;
        const startValue = Number.parseInt(el.dataset.digitsCounter, 10) || 0;
        const separator = el.dataset.digitsSeparator || "";
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.textContent = formatValue(Math.floor(progress * startValue), separator);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = formatValue(startValue, separator);
            }
        };

        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                counters.forEach(animateCounter);
                observer.disconnect();
            });
        },
        { threshold: 0.35 }
    );

    observer.observe(root);

    root.addEventListener(
        "destroy",
        () => {
            controller.abort();
            observer.disconnect();
        },
        { once: true }
    );
}
