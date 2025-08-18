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
