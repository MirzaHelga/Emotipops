/* FLAVOURS.JS — page-specific behaviour (common.js handles bubbles + floating fruit bg) */

// Entrance animation
gsap.from('.page-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
gsap.from('.page-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.15, ease: 'power2.out' });
gsap.from('.flavour-card', { opacity: 0, y: 40, duration: 0.8, delay: 0.25, stagger: 0.15, ease: 'power2.out' });

// ---- Swiper carousel (smooth swipe between flavour packs, especially on mobile) ----
const flavourSwiper = new Swiper('.flavour-swiper', {
    slidesPerView: 1,
    spaceBetween: 24,
    grabCursor: true,
    speed: 550,
    pagination: {
        el: '.flavour-swiper .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.flavour-swiper .swiper-button-next',
        prevEl: '.flavour-swiper .swiper-button-prev',
    },
    breakpoints: {
        860: {
            slidesPerView: 2,
            spaceBetween: 40,
            allowTouchMove: false,
        }
    }
});
