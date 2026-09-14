/* =========================================================
   LOADING.JS — hides #site-loader only once the assets that
   actually matter (hero video + hero/loader gummy models)
   are really ready, so the video never buffers in front of
   the user right after the loader disappears.
   ========================================================= */
(function () {
    var overlay = document.getElementById('site-loader');
    if (!overlay) return;

    document.documentElement.classList.add('is-loading');

    var video = document.getElementById('home-video');
    // Only the loader's own 2 gummies are tracked here — everything else on
    // the page (product-model, leaves, berries, preload block) is
    // loading="lazy" and fetches later on scroll, so waiting on them would
    // just stall the loader behind assets the user can't even see yet.
    var loaderModels = Array.prototype.slice.call(overlay.querySelectorAll('model-viewer'));

    var items = [];
    if (video) items.push({ el: video, kind: 'video', weight: 3, done: false, partial: 0 });
    loaderModels.forEach(function (m) {
        items.push({ el: m, kind: 'model', weight: 1, done: false, partial: 0 });
    });

    var totalWeight = items.reduce(function (s, i) { return s + i.weight; }, 0) || 1;

    var barEl = overlay.querySelector('.loader-bar-fill');
    var pctEl = overlay.querySelector('.loader-percent');
    var noteEl = overlay.querySelector('.loader-note');

    var notes = ['Meracik rasa...', 'Menuang keceriaan...', 'Hampir siap...'];
    var noteIdx = 0;
    var noteTimer = setInterval(function () {
        noteIdx = (noteIdx + 1) % notes.length;
        if (noteEl) noteEl.textContent = notes[noteIdx];
    }, 1700);

    var finished = false;

    function progress() {
        var sum = 0;
        items.forEach(function (i) { sum += i.done ? i.weight : i.partial * i.weight; });
        return Math.min(1, sum / totalWeight);
    }

    function render() {
        var pct = Math.round(progress() * 100);
        if (barEl) barEl.style.width = pct + '%';
        if (pctEl) pctEl.textContent = pct + '%';
    }

    function checkDone() {
        render();
        if (!finished && items.every(function (i) { return i.done; })) finish();
    }

    function finish() {
        if (finished) return;
        finished = true;
        clearInterval(noteTimer);
        if (barEl) barEl.style.width = '100%';
        if (pctEl) pctEl.textContent = '100%';
        overlay.classList.add('is-done');
        document.documentElement.classList.remove('is-loading');
        setTimeout(function () { overlay.remove(); }, 700);
    }

    // ---- video ----
    if (video) {
        var vItem = items[0];
        if (video.readyState >= 3) {
            vItem.done = true;
        } else {
            video.addEventListener('progress', function () {
                try {
                    if (video.buffered.length && video.duration) {
                        vItem.partial = Math.min(1, video.buffered.end(0) / video.duration);
                    }
                } catch (e) {}
                checkDone();
            });
            video.addEventListener('canplaythrough', function () { vItem.done = true; checkDone(); }, { once: true });
            video.addEventListener('loadeddata', function () {
                if (video.readyState >= 3) { vItem.done = true; checkDone(); }
            });
            video.addEventListener('error', function () { vItem.done = true; checkDone(); }, { once: true });
        }
    }

    // ---- model-viewer models ----
    items.filter(function (i) { return i.kind === 'model'; }).forEach(function (item) {
        var el = item.el;
        if (el.loaded) {
            item.done = true;
            return;
        }
        el.addEventListener('progress', function (ev) {
            if (ev.detail && typeof ev.detail.totalProgress === 'number') {
                item.partial = ev.detail.totalProgress;
            }
            checkDone();
        });
        el.addEventListener('load', function () { item.done = true; checkDone(); }, { once: true });
        el.addEventListener('error', function () { item.done = true; checkDone(); }, { once: true });
    });

    render();
    checkDone();

    // Safety net: never trap the user behind the loader for more than 9s
    setTimeout(finish, 9000);
})();
