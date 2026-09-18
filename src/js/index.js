import lozad from "lozad";
import AOS from "aos";
import { menu } from "../components/general/menu/menu.js";
import { form } from "../components/general/form/form.js";
import { input } from "../components/general/input/input.js";
import { accordion } from "../components/general/accordion/accordion.js";
import { consentNotice } from "../components/general/consent-notice/consent-notice.js";
import { navigationMobile } from "../components/general/navigation-mobile/navigation-mobile.js";
import { tabs } from "../components/general/tabs/tabs.js";
import { hero } from "../blocks/common/hero/hero.js";
import { directions } from "../blocks/common/directions/directions.js";
import { header } from "../blocks/general/header/header.js";
import { notFound } from "../blocks/general/not-found/not-found.js";
import { showPopup } from "./utils/popup.js";
import { initScrollbarWidth } from "./utils/scrollbar.js";
import { searchForm } from "../components/general/search-form/search-form.js";
import { ourWorks } from "../blocks/common/our-works/our-works.js";
import { serviceDetailHero } from "../blocks/common/service-detail-hero/service-detail-hero.js";
import { reviews } from "../blocks/common/reviews/reviews.js";
import { usefulMaterials } from "../blocks/common/useful-materials/useful-materials.js";
import { articleOthers } from "../blocks/common/article-others/article-others.js";
import { advantages } from "../blocks/common/advantages/advantages.js";
import { serviceTypes } from "../blocks/common/service-types/service-types.js";
import { popupCallback } from "../components/common/popup-callback/popup-callback.js";
import { popupOrder } from "../components/common/popup-order/popup-order.js";
import { popupFeedbackSuccess } from "../components/common/popup-feedback-success/popup-feedback-success.js";

const components = [
    menu,
    form,
    input,
    accordion,
    consentNotice,
    navigationMobile,
    tabs,
    hero,
    directions,
    header,
    notFound,
    searchForm,
    ourWorks,
    serviceDetailHero,
    reviews,
    usefulMaterials,
    articleOthers,
    advantages,
    serviceTypes,
    popupCallback,
    popupOrder,
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
    initScrollbarWidth();
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
