/* HOME.JS — controls the #home ad video: mute/unmute toggle,
   and pause/play automatically as it enters/leaves the viewport
   (saves resources, avoids audio playing while scrolled away). */

(function () {
    const video = document.getElementById('home-video');
    const toggle = document.getElementById('video-mute-toggle');

    if (!video || !toggle) return;

    let hasTriedAutoplay = false;

    function updateToggleUI() {
        const isUnmuted = !video.muted;
        toggle.classList.toggle('is-unmuted', isUnmuted);
        toggle.setAttribute('aria-pressed', String(isUnmuted));
        toggle.setAttribute('aria-label', isUnmuted ? 'Mute video' : 'Unmute video');
    }

    toggle.addEventListener('click', () => {
        video.muted = !video.muted;
        if (!video.muted) video.play().catch(() => {});
        updateToggleUI();
    });

    // Once the user has interacted with the page at all, browsers allow
    // unmuted playback — use that first interaction to turn the sound on
    // automatically, in case the initial unmuted-autoplay attempt below
    // was blocked.
    function unmuteOnFirstInteraction() {
        const events = ['click', 'touchstart', 'keydown', 'scroll', 'wheel'];
        function unmuteNow() {
            video.muted = false;
            video.play().catch(() => {});
            updateToggleUI();
            events.forEach(evt => window.removeEventListener(evt, unmuteNow));
        }
        events.forEach(evt => window.addEventListener(evt, unmuteNow, { once: true, passive: true }));
    }

    // First time the video comes into view: try to autoplay WITH sound.
    // Most browsers block this unless the user has already interacted
    // with the page/site, so if it's rejected we fall back to muted
    // autoplay and rely on unmuteOnFirstInteraction() to turn sound on
    // the moment the user does anything on the page.
    function attemptAutoplay() {
        video.muted = false;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(updateToggleUI)
                .catch(() => {
                    video.muted = true;
                    video.play().catch(() => {});
                    updateToggleUI();
                    unmuteOnFirstInteraction();
                });
        } else {
            updateToggleUI();
        }
    }

    updateToggleUI();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!hasTriedAutoplay) {
                    hasTriedAutoplay = true;
                    attemptAutoplay();
                } else {
                    video.play().catch(() => {});
                }
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.15 });

    observer.observe(video);
})();
