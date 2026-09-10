export function hero(context = document) {
    const root = context.querySelector(".hero");
    if (!root || root.dataset.init === "true") return;

    root.dataset.init = "true";
}
