export function directions(context = document) {
    const root = context.querySelector(".directions");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";

    const controller = new AbortController();
    const { signal } = controller;
    const wraps = [...root.querySelectorAll(".tags")];

    const layoutTagGroup = (wrap) => {
        const tags = [...wrap.querySelectorAll(":scope > a")];
        const styles = getComputedStyle(wrap);
        const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
        const half = (wrap.clientWidth - gap) / 2;

        tags.forEach((tag) => {
            const probe = tag.cloneNode(true);
            probe.classList.remove("wide");
            probe.style.cssText =
                "position:fixed;left:0;top:0;display:block;flex:none;width:max-content;min-width:0;max-width:none;white-space:nowrap;pointer-events:none;";
            wrap.append(probe);
            const fitsHalf = probe.offsetWidth <= half + 1;
            probe.remove();
            tag.classList.toggle("wide", !fitsHalf);
        });
    };

    const layoutAll = () => wraps.forEach(layoutTagGroup);
    const observer = new ResizeObserver(layoutAll);

    wraps.forEach((wrap) => observer.observe(wrap));
    layoutAll();

    window.addEventListener("load", layoutAll, { signal });

    if (document.fonts) {
        document.fonts.ready.then(layoutAll, () => {});
        document.fonts.addEventListener("loadingdone", layoutAll, { signal });
    }

    root.addEventListener(
        "destroy",
        () => {
            observer.disconnect();
            controller.abort();
        },
        { once: true, signal }
    );
}
