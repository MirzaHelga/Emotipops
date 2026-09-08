/* INGREDIENTS.JS — page-specific behaviour (common.js handles bubbles + floating fruit bg) */

// Entrance animation
gsap.from('.page-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
gsap.from('.page-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.15, ease: 'power2.out' });
gsap.from('.ingredient-card', { opacity: 0, y: 40, duration: 0.8, delay: 0.25, stagger: 0.15, ease: 'power2.out' });

// Language toggle per card
document.querySelectorAll('.lang-toggle').forEach(toggle => {
    const group = toggle.dataset.group;
    toggle.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            toggle.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
            document.querySelectorAll(`.comp-block[data-group="${group}"]`).forEach(block => {
                const show = block.dataset.lang === lang;
                if (show) {
                    block.classList.add('active');
                    gsap.fromTo(block, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
                } else {
                    block.classList.remove('active');
                }
            });
        });
    });
});
