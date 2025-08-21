// < !--Scroll Effect Script-- >
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (window.scrollY > 50) {
        header.classList.add("bg-black", "shadow-lg");
    } else {
        header.classList.remove("bg-black", "shadow-lg");
    }
});
// < !--Scroll Effect Script-- >


// SwiperJS
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});
// SwiperJS

// < !--Scroll Effect Script-- >
const heroSwiper = new Swiper('.swiper', {
    loop: true,
    speed: 700,
    autoplay: { delay: 4500, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },

    on: {
        init: function () {
            animateActiveTag(this);
        },
        slideChangeTransitionStart: function () {
            resetAllTags();
        },
        slideChangeTransitionEnd: function () {
            animateActiveTag(this);
        }
    }
});

function resetAllTags() {
    document.querySelectorAll('.swiper-slide .hero-tag').forEach(el => {
        el.classList.remove('fade-up');
        el.style.opacity = '0';
        el.style.transform = 'translateY(12px)';
    });
}

function animateActiveTag(swiper) {
    const active = swiper.slides[swiper.activeIndex];
    const tag = active.querySelector('.hero-tag');
    if (!tag) return;
    tag.style.opacity = '0';
    tag.style.transform = 'translateY(12px)';
    requestAnimationFrame(() => {
        tag.classList.add('fade-up');
        tag.style.opacity = '';
        tag.style.transform = '';
    });
}
// < !--Scroll Effect Script-- >