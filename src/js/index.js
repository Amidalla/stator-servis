import lozad from "lozad";
import AOS from "aos";
import { menu } from "../components/general/menu/menu.js";
import { form } from "../components/general/form/form.js";
import { input } from "../components/general/input/input.js";
import { accordion } from "../components/general/accordion/accordion.js";
import { consentNotice } from "../components/general/consent-notice/consent-notice.js";
import { navigationMobile } from "../components/general/navigation-mobile/navigation-mobile.js";
import { hero } from "../blocks/common/hero/hero.js";
import { directions } from "../blocks/common/directions/directions.js";
import { header } from "../blocks/general/header/header.js";
import { showPopup } from "./utils/popup.js";
import { searchForm } from "../components/general/search-form/search-form.js";
import { ourWorks } from "../blocks/common/our-works/our-works.js";
import { reviews } from "../blocks/common/reviews/reviews.js";
import { usefulMaterials } from "../blocks/common/useful-materials/useful-materials.js";
import { advantages } from "../blocks/common/advantages/advantages.js";
import { popupCallback } from "../components/common/popup-callback/popup-callback.js";
import { popupFeedbackSuccess } from "../components/common/popup-feedback-success/popup-feedback-success.js";

const components = [
    menu,
    form,
    input,
    accordion,
    consentNotice,
    navigationMobile,
    hero,
    directions,
    header,
    searchForm,
    ourWorks,
    reviews,
    usefulMaterials,
    advantages,
    popupCallback,
    popupFeedbackSuccess
];

function init(context = document) {
    components.forEach((fn) => fn(context));
}

const lazyObserver = lozad(".lazy", {
    rootMargin: "1200px 1200px",
    threshold: 0.1,
    enableAutoReload: true
});

function initLazy() {
    lazyObserver.observe();
}

function initAos() {
    AOS.init({
        duration: 1000,
        easing: "ease",
        delay: 0,
        once: true,
        offset: 80
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initLazy();
    init();
    initAos();
});

window.showPopup = showPopup;

window.reinitLazy = initLazy;

window.reinit = (context = document) => {
    init(context);
    initLazy();
    AOS.refreshHard();
};
