// blocks/common/photos/photos.js
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";

export function photos(context = document) {
    const roots = [...context.querySelectorAll(".photos")];

    if (context.nodeType === 1) {
        if (context.matches(".photos")) {
            roots.push(context);
        } else {
            const closest = context.closest(".photos");
            if (closest) roots.push(closest);
        }
    }

    if (!roots.length) return;

    [...new Set(roots)].forEach((root) => {
        if (root.dataset.init !== "true") {
            root.dataset.init = "true";

            const limit = Number(root.dataset.limit) || 6;
            const items = root.querySelectorAll(".photo-card");

            items.forEach((item, index) => {
                item.classList.toggle("photo-card--hidden", index >= limit);
            });
        }

        const links = root.querySelectorAll('[data-fancybox="photos"]');
        if (!links.length) return;

        Fancybox.unbind(links);
        Fancybox.bind(links, {});
    });
}
