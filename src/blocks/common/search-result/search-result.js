export function searchResult(context = document) {
    const roots = context.querySelectorAll(".search-result");
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const limit = Number(root.dataset.limit) || 8;
        const items = root.querySelectorAll(".catalog-card");

        items.forEach((item, index) => {
            item.classList.toggle("catalog-card--hidden", index >= limit);
        });
    });
}
