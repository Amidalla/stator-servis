// blocks/common/articles-content/articles-content.js

export function articlesContent(context = document) {
    const roots = context.querySelectorAll(".articles-content");
    if (!roots.length) return;

    roots.forEach((root) => {
        if (root.dataset.init === "true") return;
        root.dataset.init = "true";

        const limit = Number(root.dataset.limit) || 6;
        const items = root.querySelectorAll(".article-card");

        items.forEach((item, index) => {
            item.classList.toggle("article-card--hidden", index >= limit);
        });
    });
}
