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
/** ===============================
 *  Swiper + "WUDA AGENCY" Fade-Up
 *  =============================== */

// Mouse Glow Effect
(() => {
    const COLOR = { r: 204, g: 255, b: 0 };   // #ccff00
    const FOLLOW = 0.18;                      // takip hızı (düşür -> daha arkadan)
    const MAX_POINTS = 42;                    // kuyruğun örnek sayısı
    const MIN_DIST = 2;                       // yeni nokta eklemek için min piksel
    const WIDTH_MIN = 1.2;                    // en ince genişlik
    const WIDTH_MAX = 4.0;                    // en kalın genişlik (çekirdeğin kalınlığı)
    const GLOW_MULT = 2.3;                    // dış parıltı strokesi çarpanı
    const SPEED_TO_LEN = 1.35;                // hızdan uzunluğa ölçek
    const LEN_MIN = 16;                       // minimum segment uzunluğu
    const LEN_MAX = 96;                       // maksimum segment uzunluğu

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const canvas = document.getElementById('cursor-trail');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // 1–2 arası
    let w = 0, h = 0;

    function resize() {
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        w = canvas.clientWidth || window.innerWidth;
        h = canvas.clientHeight || window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // retina ölçek
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    // canvas fixed olduğundan client ölçüsü yoksa CSS inset:0 ile viewport kadar düşün
    const ensureSize = () => { canvas.style.width = '100%'; canvas.style.height = '100%'; };
    ensureSize(); resize();
    window.addEventListener('resize', () => { ensureSize(); resize(); });

    // takip edilen ve hedef konum
    let mx = w / 2, my = h / 2;
    let px = mx, py = my;
    let lastMoveTime = performance.now();
    let currLen = LEN_MIN;

    // kuyruğu tut
    const pts = [];

    function onMove(e) {
        if (e.touches && e.touches[0]) {
            mx = e.touches[0].clientX;
            my = e.touches[0].clientY;
        } else {
            mx = e.clientX;
            my = e.clientY;
        }
        lastMoveTime = performance.now();
        if (!raf) raf = requestAnimationFrame(loop);
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    let raf = null;

    function loop() {
        // takip (lerp)
        px += (mx - px) * FOLLOW;
        py += (my - py) * FOLLOW;

        // yeni nokta ekle (yeterince uzaksa)
        const last = pts[pts.length - 1];
        const dx = last ? (px - last.x) : 0;
        const dy = last ? (py - last.y) : 0;
        const dist = last ? Math.hypot(dx, dy) : MIN_DIST + 1;

        if (!last || dist > MIN_DIST) {
            pts.push({ x: px, y: py });
            if (pts.length > MAX_POINTS) pts.shift();
        }

        // hız -> uzunluk
        const vx = mx - px, vy = my - py;
        const speed = Math.hypot(vx, vy);
        const targetLen = Math.min(Math.max(speed * SPEED_TO_LEN, LEN_MIN), LEN_MAX);
        currLen += (targetLen - currLen) * 0.25;

        // kuyruğu kırp: imlecın gerisindeki toplam uzunluk currLen'i aşarsa baştan sil
        let total = 0;
        for (let i = pts.length - 1; i > 0; i--) {
            total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            if (total > currLen) {
                // baştan i-1'e kadar at
                pts.splice(0, i - 1);
                break;
            }
        }

        // çiz
        ctx.clearRect(0, 0, w, h);
        if (pts.length > 1) {
            // "lighter" ile hoş bir parıltı
            ctx.globalCompositeOperation = 'lighter';

            for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[i];
                const p1 = pts[i + 1];
                const t = i / (pts.length - 1);      // 0 (kuyruk ucu) → 1 (imlece yakın)
                const inv = 1 - t;

                // genişlik ve alfa gradienti
                const width = WIDTH_MIN + inv * (WIDTH_MAX - WIDTH_MIN);
                const alphaCore = 0.85 * Math.pow(inv, 0.7);   // çekirdek
                const alphaGlow = 0.22 * Math.pow(inv, 0.9);   // dış parıltı

                // dış parıltı (kalın, yarı saydam, gölgeli)
                ctx.save();
                ctx.lineWidth = width * GLOW_MULT;
                ctx.strokeStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${alphaGlow})`;
                ctx.shadowColor = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},0.45)`;
                ctx.shadowBlur = width * 4.0;
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
                ctx.restore();

                // iç çekirdek (ince, parlak)
                ctx.lineWidth = width;
                ctx.strokeStyle = `rgba(${COLOR.r},${COLOR.g},${COLOR.b},${alphaCore})`;
                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.stroke();
            }

            // compositing’i geri al (ileride başka şey çizecek olursan)
            ctx.globalCompositeOperation = 'source-over';
        }

        // hareketsiz kalırsa bir süre sonra durdur (kaynak tüketimini azalt)
        const idle = (performance.now() - lastMoveTime) > 3000;
        if (idle) { cancelAnimationFrame(raf); raf = null; return; }

        raf = requestAnimationFrame(loop);
    }

    // ilk kare
    raf = requestAnimationFrame(loop);
})();
// Mouse Glow Effect


// loading screen
(function () {
    // === Ayarlar ===
    const DURATION_SIM_MS = 2200;     // Yüzde sayacının tahmini süre (ms)
    const REVEAL_STAGGER = 20;       // Her parçanın gecikmesi (ms)
    const REVEAL_LAST_EXTRA = 400;    // Son parça sonrası overlay’i kaldırma gecikmesi (ms)
    // =================

    const root = document.getElementById('page-loader');
    const p1 = document.getElementById('loader-phase-1');
    const p2 = document.getElementById('loader-phase-2');
    const percentEl = document.getElementById('loader-percent');
    const barEl = document.getElementById('loader-bar');
    const pieces = [];

    // Parça nodelarını topla (sırayla)
    (function collectPieces() {
        const nodes = (p2 && p2.querySelectorAll('.piece')) || [];
        nodes.forEach(n => pieces.push(n));
    })();

    // ===== AŞAMA 1: % SAYACI =====
    let start = performance.now();
    let done = false;
    let rafId = null;

    function tick(now) {
        const t = Math.min(1, (now - start) / DURATION_SIM_MS);
        const eased = easeOutCubic(t); // daha “premium” akış
        const pct = Math.floor(eased * 100);
        percentEl.textContent = pct;
        barEl.style.width = pct + '%';

        if (t < 1 && !done) {
            rafId = requestAnimationFrame(tick);
        } else {
            finishPhase1();
        }
    }

    // İsteğe bağlı: Sayfa tamamen yüklendiğinde %’yi hızlıca 100’e taşı
    window.addEventListener('load', () => {
        if (!done) {
            start = performance.now() - (DURATION_SIM_MS * 0.05); // hızlandır
        }
    });

    function finishPhase1() {
        done = true;
        // Yazıyı ve barı fade-out yap
        p1.classList.add('fade-out');

        // Aşama 2’ye geç: parçalı reveal
        setTimeout(() => {
            p1.classList.add('hidden');
            p2.classList.remove('hidden');
            startPiecesReveal();
        }, 450);
    }

    function startPiecesReveal() {
        pieces.forEach((piece, i) => {
            setTimeout(() => {
                piece.classList.add('reveal');
            }, i * REVEAL_STAGGER);
        });

        // Son parça devreye girdikten kısa süre sonra overlay’i kaldır
        const totalRevealTime = (pieces.length - 1) * REVEAL_STAGGER + 900 + REVEAL_LAST_EXTRA;
        setTimeout(removeOverlay, totalRevealTime);
    }

    function removeOverlay() {
        root.style.transition = 'opacity .7s ease';
        root.style.opacity = '0';
        setTimeout(() => root.remove(), 700);
    }

    // Easing
    function easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    // Başlat
    rafId = requestAnimationFrame(tick);
})();
// loading screen 


// <!-- Progress bars: animate on view -->
(function () {
    const root = document.getElementById('mission');
    if (!root) return;

    const items = root.querySelectorAll('.js-bar');
    const pctTexts = root.querySelectorAll('.js-pct-text');

    function animateBars() {
        items.forEach((bar, i) => {
            const pct = parseInt(bar.dataset.percent || '0', 10);
            // width animasyonu
            requestAnimationFrame(() => {
                bar.style.width = pct + '%';
                bar.setAttribute('aria-valuenow', String(pct));
            });
            // yüzde sayacı (basit)
            const textEl = pctTexts[i];
            if (!textEl) return;
            let from = 0;
            const to = pct;
            const start = performance.now();
            const dur = 900;
            function step(now) {
                const t = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
                const val = Math.round(from + (to - from) * eased);
                textEl.textContent = val;
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries, obs) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    animateBars();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.3 });
        io.observe(root);
    } else {
        // Fallback
        animateBars();
    }
})();
// <!-- Progress bars: animate on view -->

// About section
(function () {
    const about = document.getElementById('about');
    if (!about) return;
    const els = about.querySelectorAll('.js-stat');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.textContent = e.dataset.to || '0'); return; }

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const to = parseInt(el.dataset.to || '0', 10);
            const start = performance.now(), dur = 900;
            function step(now) {
                const t = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - t, 3);
                el.textContent = Math.round(to * eased);
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
        });
    }, { threshold: 0.25 });
    els.forEach(el => io.observe(el));
})();
// About section
