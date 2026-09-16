// Показываем цифры «404» только после загрузки шрифта Tektur.
// Иначе они на мгновение отрисовываются запасным шрифтом, а затем
// резко подменяются на Tektur (font-display: swap) — виден «скачок».
export function notFound(context = document) {
    const section = context.querySelector(".not-found");

    if (!section) {
        return;
    }

    const reveal = () => section.classList.add("is-font-ready");

    // Font Loading API недоступно — просто показываем цифры
    if (!document.fonts || !document.fonts.load) {
        reveal();
        return;
    }

    // Ждём готовности Tektur, но не дольше 3 с — на случай, если шрифт
    // не загрузится (офлайн и т. п.), цифры всё равно появятся.
    const fontReady = document.fonts.load('600 1em "Tektur"').then(() => undefined);
    const fallback = new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });

    Promise.race([fontReady, fallback]).then(reveal);
}
