import lozad from "lozad";
import { menu } from "../components/general/menu/menu.js";
import { form } from "../components/general/form/form.js";
import { input } from "../components/general/input/input.js";
import { tabs } from "../components/general/tabs/tabs.js";
import { accordion } from "../components/general/accordion/accordion.js";
import { consentNotice } from "../components/general/consent-notice/consent-notice.js";
import { navigationMobile } from "../components/general/navigation-mobile/navigation-mobile.js";
import { hero } from "../blocks/common/hero/hero.js";
import { directions } from "../blocks/common/directions/directions.js";
import { header } from "../blocks/general/header/header.js";
import { showPopup } from "./utils/popup.js";
import { searchForm } from "../components/general/search-form/search-form.js";
import { searchResult } from "../blocks/common/search-result/search-result.js";
import { initCustomScroll } from "./utils/custom-scroll.js";
import { catalogContent } from "../blocks/common/catalog-content/catalog-content.js";
import { filterToggle } from "../components/general/filter/filter.js";
import { productCard } from "../blocks/common/product-card/product-card.js";
import { similarProducts } from "../blocks/common/similar-products/similar-products.js";
import { gallerySlider } from "../components/general/gallery-slider/gallery-slider.js";
import { certificates } from "../blocks/common/certificates/certificates.js";
import { photos } from "../blocks/common/photos/photos.js";
import { articlesContent } from "../blocks/common/articles-content/articles-content.js";
import { ourWorks } from "../blocks/common/our-works/our-works.js";
import { reviews } from "../blocks/common/reviews/reviews.js";
import { popupCallback } from "../components/common/popup-callback/popup-callback.js";
import { popupFeedbackSuccess } from "../components/common/popup-feedback-success/popup-feedback-success.js";

const components = [
    menu,
    form,
    input,
    tabs,
    accordion,
    consentNotice,
    navigationMobile,
    hero,
    directions,
    header,
    searchForm,
    searchResult,
    catalogContent,
    filterToggle,
    productCard,
    similarProducts,
    gallerySlider,
    certificates,
    photos,
    articlesContent,
    ourWorks,
    reviews,
    popupCallback,
    popupFeedbackSuccess
];

function init(context = document) {
    components.forEach((fn) => fn(context));
    initCustomScroll(context);
}

const lazyObserver = lozad(".lazy", {
    rootMargin: "1200px 1200px",
    threshold: 0.1,
    enableAutoReload: true
});

function initLazy() {
    lazyObserver.observe();
}

document.addEventListener("DOMContentLoaded", () => {
    initLazy();
    init();
});

window.showPopup = showPopup;

window.reinitLazy = initLazy;

window.reinit = (context = document) => {
    init(context);
    initLazy();
};
