"use strict";

/** ===============================
 *  Header Scroll Effect (throttled)
 *  =============================== */
(function () {
    const header = document.getElementById("header");
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const past = window.scrollY > 50;
            header.classList.toggle("bg-black", past);
            header.classList.toggle("shadow-lg", past);
            ticking = false;
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // İlk durum
    onScroll();
})();

/** ===============================
 *  Drawer (Hamburger Menu)
 *  =============================== */
(function () {
    const root = document.getElementById("mobile-drawer");
    const panel = document.getElementById("drawer-panel");
    const backdrop = document.getElementById("drawer-backdrop");
    const openBtn = document.getElementById("btn-open-drawer");
    const closeBtn = document.getElementById("btn-close-drawer");

    if (!root || !panel || !backdrop || !openBtn || !closeBtn) return;

    const setDrawer = (open) => {
        root.classList.toggle("pointer-events-none", !open);
        root.classList.toggle("opacity-100", open);
        root.setAttribute("aria-hidden", String(!open));

        backdrop.classList.toggle("opacity-100", open);
        panel.classList.toggle("translate-x-[-100%]", !open);

        openBtn.setAttribute("aria-expanded", String(open));
        document.documentElement.classList.toggle("overflow-hidden", open);
    };

    openBtn.addEventListener("click", () => setDrawer(true));
    closeBtn.addEventListener("click", () => setDrawer(false));
    backdrop.addEventListener("click", () => setDrawer(false));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setDrawer(false);
    });
})();

/** ===============================
 *  Swiper + "WUDA AGENCY" Fade-Up
 *  (tek instance)
 *  =============================== */
(function () {
    if (typeof Swiper === "undefined") return;

    const resetAllTags = () => {
        document.querySelectorAll(".swiper-slide .hero-tag").forEach((el) => {
            el.classList.remove("fade-up");
            el.style.opacity = "0";
            el.style.transform = "translateY(12px)";
        });
    };

    const animateActiveTag = (swiper) => {
        const active = swiper.slides[swiper.activeIndex];
        if (!active) return;
        const tag = active.querySelector(".hero-tag");
        if (!tag) return;
        tag.style.opacity = "0";
        tag.style.transform = "translateY(12px)";
        requestAnimationFrame(() => {
            tag.classList.add("fade-up");
            tag.style.opacity = "";
            tag.style.transform = "";
        });
    };

    const heroSwiper = new Swiper(".swiper", {
        loop: true,
        speed: 700,
        autoplay: { delay: 4500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        on: {
            init() {
                animateActiveTag(this);
            },
            slideChangeTransitionStart() {
                resetAllTags();
            },
            slideChangeTransitionEnd() {
                animateActiveTag(this);
            },
        },
    });
})();
