/* LANDING-NAV.JS — highlights the matching nav item as the
   user scrolls through the single-page layout. Purely additive:
   doesn't touch any of the original per-page scripts. */

(function () {
    const navLinks = Array.from(document.querySelectorAll('.nav-item'));
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    function setActive(id) {
        navLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: '-45% 0px -50% 0px', // trigger when section crosses the middle of the viewport
        threshold: 0
    });

    sections.forEach(sec => observer.observe(sec));
})();
