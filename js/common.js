/* =========================================================
   COMMON.JS — shared across every EmotiPops page
   1. Bubbles generator (#bubbles-container)
   2. Floating 3D fruit background (#fruit-bg) — only runs
      if that element exists on the page (Flavours / Ingredients)
   ========================================================= */

// ---------- Bubbles Generator ----------
(function initBubbles() {
    const bubblesContainer = document.getElementById('bubbles-container');
    if (!bubblesContainer) return;

    function createBubble() {
        const bubble = document.createElement('img');
        bubble.src = 'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/bubble.png';
        bubble.className = 'bubble-img';
        const size = Math.random() * 20 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = 'auto';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.bottom = '-50px';
        bubble.style.opacity = Math.random() * 0.4 + 0.2;

        const duration = Math.random() * 6 + 4;
        bubble.style.animation = `floatUpImg ${duration}s linear forwards`;

        bubblesContainer.appendChild(bubble);
        setTimeout(() => bubble.remove(), duration * 1000);
    }

    setInterval(createBubble, 400);
})();

// ---------- Floating 3D fruit background ----------
(function initFruitBg() {
    const fruitBg = document.getElementById('fruit-bg');
    if (!fruitBg) return;

    const FRUIT_SOURCES = ['assets/glb/Lychee.glb', 'assets/glb/Wildberry.glb', 'assets/glb/Orange.glb', 'assets/glb/Strawberry.glb', 'assets/glb/Lemon.glb', 'assets/glb/Mango.glb'];
    const ORBIT_STARTS = ['20deg 100deg 105%', '-40deg 70deg 105%', '160deg 50deg 105%', '80deg 130deg 105%', '-100deg 90deg 105%', '200deg 60deg 105%', '30deg 150deg 105%', '-160deg 80deg 105%'];

    function shuffledFruits() {
        return FRUIT_SOURCES.slice().sort(() => Math.random() - 0.5);
    }

    const fruitCount = window.innerWidth <= 860 ? 10 : 16;
    let fruitSequence = [];
    while (fruitSequence.length < fruitCount) fruitSequence = fruitSequence.concat(shuffledFruits());
    fruitSequence = fruitSequence.slice(0, fruitCount);

    fruitSequence.forEach((src, i) => {
        const mv = document.createElement('model-viewer');
        mv.className = 'float-fruit';
        mv.src = src;
        mv.setAttribute('environment-image', 'neutral');
        mv.setAttribute('exposure', '1.1');
        mv.setAttribute('interaction-prompt', 'none');
        mv.setAttribute('camera-orbit', ORBIT_STARTS[i % ORBIT_STARTS.length]);

        const size = Math.round(50 + Math.random() * 80); // 50-130px
        mv.style.width = size + 'px';
        mv.style.height = size + 'px';
        mv.style.top = (Math.random() * 88) + '%';
        mv.style.left = (Math.random() * 92) + '%';
        mv.style.opacity = (0.3 + Math.random() * 0.32).toFixed(2);

        mv.dataset.dur = (8 + Math.random() * 6).toFixed(2);
        mv.dataset.phase = (Math.random() * Math.PI * 2).toFixed(2);
        mv.dataset.driftX = (8 + Math.random() * 14).toFixed(1);
        mv.dataset.driftY = (14 + Math.random() * 18).toFixed(1);
        mv.dataset.rot = (6 + Math.random() * 10).toFixed(1);

        fruitBg.appendChild(mv);
    });

    function animateFruitBg() {
        const time = Date.now() * 0.001;
        document.querySelectorAll('.float-fruit').forEach(el => {
            const dur = parseFloat(el.dataset.dur);
            const phase = parseFloat(el.dataset.phase) + time * (Math.PI * 2 / dur);
            const dX = parseFloat(el.dataset.driftX);
            const dY = parseFloat(el.dataset.driftY);
            const dR = parseFloat(el.dataset.rot);
            const floatY = Math.sin(phase) * dY;
            const floatX = Math.cos(phase * 0.6) * dX;
            const floatAngle = Math.sin(phase * 0.4) * dR;
            el.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${floatAngle}deg)`;
        });
        requestAnimationFrame(animateFruitBg);
    }
    animateFruitBg();

    // Fade the fruit layer in for every section EXCEPT #home and #product
    // (video + the main 3D hero shot need a clean, uncluttered backdrop) —
    // hidden (opacity 0, see base.css) while either is on screen, visible
    // everywhere else (Flavours, Ingredients, Find Us, Meet Us, Galeri).
    // CSS transition handles the smooth fade.
    const hiddenSections = ['home', 'product']
        .map(id => document.getElementById(id))
        .filter(Boolean);

    if (hiddenSections.length) {
        const intersecting = new Set();
        const visibilityObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) intersecting.add(entry.target.id);
                else intersecting.delete(entry.target.id);
            });
            fruitBg.classList.toggle('is-visible', intersecting.size === 0);
        }, { threshold: 0.2 });
        hiddenSections.forEach(sec => visibilityObserver.observe(sec));
    }
})();

// ---------- Safe entrance reveal (fallback kalau GSAP gagal/nyangkut) ----------
window.safeReveal = function (selector, vars) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (typeof gsap === 'undefined') {
        // GSAP gagal load sama sekali -> langsung tampilkan
        els.forEach(el => { el.style.opacity = '1'; el.style.transform = 'none'; });
        return;
    }

    gsap.from(els, { ...vars, clearProps: 'opacity,transform' });

    // Safety net: paksa tampil kalau animasi entah kenapa nggak pernah selesai
    const wait = ((vars.delay || 0) + vars.duration) * 1000 + 1000;
    setTimeout(() => {
        els.forEach(el => {
            if (getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, wait);
};