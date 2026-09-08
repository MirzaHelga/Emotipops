/* GALERI.JS — page-specific behaviour (common.js handles bubbles + floating fruit bg) */

// ---- Galeri data ----
// Replace `image` with a real exported photo (e.g. "assets/post-01.jpg") and
// `caption` with the real caption text to make this a 100% real Instagram gallery.
const POSTS = [
    {
        size: 'big',
        theme: 'c-brand',
        title: '#1000CaraSeruEmotiPops',
        time: '2 DAYS AGO',
        caption: "Siapa di sini yang suka nemenin nonton drakor sambil ngemil? 🍭💕\n\nFOX'S Gummy Candy EmotiPops selalu siap jadi teman seru buat momen santaimu — manis, kenyal, dan penuh ekspresi!\n\nCoba juga dan rasakan #1000CaraSeruEmotiPops-mu sendiri.\n\n#FOXSGummyCandy #SoYummySoGummy",
        likes: 482,
        comments: 37,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'normal',
        theme: 'c-happy',
        title: 'Meet Happy 😄',
        time: '4 DAYS AGO',
        caption: "Kenalin, si kuning ceria: Happy! 🍋\n\nRasa manis segar yang bikin mood auto naik setiap gigitan.\n\nMana ekspresi favoritmu — Happy, Sad, Angry, atau Love?\n\n#FOXSGummyCandy #1000CaraSeruEmotiPops",
        likes: 356,
        comments: 21,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'wide',
        theme: 'c-purple',
        title: 'Jakarta Fair 2025',
        time: '1 WEEK AGO',
        caption: "Serunya ketemu langsung sama teman-teman EmotiPops di Jakarta Fair 2025! 🎉\n\nTerima kasih untuk semua yang sudah mampir ke booth kami dan icip-icip semua rasa.\n\nSampai jumpa di event seru berikutnya!\n\n#FOXSGummyCandy #EmotiPops",
        likes: 611,
        comments: 44,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'normal',
        theme: 'c-angry',
        title: 'Meet Angry 😠',
        time: '1 WEEK AGO',
        caption: "Lagi bete? Sama kayak si Angry! 😤\n\nRasa asam segarnya pas banget buat nemenin harimu yang bikin emosi naik turun.\n\nYuk cerita, kapan terakhir kali kamu ngerasa jadi Angry?\n\n#FOXSGummyCandy #1000CaraSeruEmotiPops",
        likes: 298,
        comments: 15,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'normal',
        theme: 'c-sad',
        title: 'Meet Sad 💧',
        time: '2 WEEKS AGO',
        caption: "Kadang butuh waktu buat sedih dulu, gapapa kok. 💙\n\nSi biru lembut, Sad, selalu siap nemenin hari-hari yang berat dengan rasa yang menenangkan.\n\n#FOXSGummyCandy #SoYummySoGummy",
        likes: 274,
        comments: 12,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'tall',
        theme: 'c-love',
        title: 'Meet Love 💕',
        time: '2 WEEKS AGO',
        caption: "Manis lembut yang bikin baper: Love! 💗\n\nFavorit buat dibagi bareng orang tersayang atau dinikmati sendiri sambil nonton drakor.\n\nTag seseorang yang butuh EmotiPops rasa Love hari ini!\n\n#FOXSGummyCandy #1000CaraSeruEmotiPops",
        likes: 523,
        comments: 29,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'normal',
        theme: 'c-brand',
        title: 'So Yummy, So Gummy',
        time: '3 WEEKS AGO',
        caption: "Kenyal, fruity, dan penuh vitamin C — itulah FOX'S Gummy Candy EmotiPops! 🍬\n\nTersedia di Alfamart, Indomaret, dan minimarket favoritmu.\n\nFollow terus @foxsfuntime.id biar nggak ketinggalan promo seru!\n\n#FOXSGummyCandy",
        likes: 401,
        comments: 18,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    },
    {
        size: 'normal',
        theme: 'c-purple',
        title: 'Kue Lapis Challenge',
        time: '3 WEEKS AGO',
        caption: "Efek beli 1 gratis 1 emang selalu bikin nagih! 😅\n\nCobain juga promo seru dari FOX'S Gummy Candy di minimarket terdekat.\n\n#FOXSGummyCandy #1000CaraSeruEmotiPops",
        likes: 189,
        comments: 9,
        link: 'https://www.instagram.com/foxsfuntime.id/'
    }
];

const IG_ICON = '<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="6" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.5" stroke="#fff" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/></svg>';
const PLAY_ICON = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';

const galeriGrid = document.getElementById('galeri-grid');

POSTS.forEach((post, i) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    const tile = document.createElement('div');
    tile.className = 'galeri-tile';
    tile.dataset.index = i;
    tile.innerHTML = `
        <div class="galeri-tile-media ${post.theme}">
            <h3>${post.title}</h3>
        </div>
        <span class="galeri-tile-icon">${IG_ICON}</span>
        <div class="galeri-tile-overlay">${PLAY_ICON}</div>
    `;
    tile.addEventListener('click', () => openModal(i));
    slide.appendChild(tile);
    galeriGrid.appendChild(slide);
});

// ---- Swiper carousel (smooth drag/swipe through the gallery) ----
const galeriSwiper = new Swiper('.galeri-swiper', {
    slidesPerView: 1.6,
    spaceBetween: 14,
    grabCursor: true,
    centeredSlides: false,
    speed: 550,
    pagination: {
        el: '.galeri-swiper .swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.galeri-swiper .swiper-button-next',
        prevEl: '.galeri-swiper .swiper-button-prev',
    },
    breakpoints: {
        560: { slidesPerView: 2.2, spaceBetween: 16 },
        860: { slidesPerView: 3.2, spaceBetween: 18 },
        1100: { slidesPerView: 4.2, spaceBetween: 20 },
    }
});

// ---- Lightbox modal ----
const igModal = document.getElementById('igModal');
const igModalImage = document.getElementById('igModalImage');
const igModalTime = document.getElementById('igModalTime');
const igModalCaption = document.getElementById('igModalCaption');
const igModalLink = document.getElementById('igModalLink');
const igModalLikes = document.getElementById('igModalLikes');
const igModalComments = document.getElementById('igModalComments');

let activePostIndex = 0;

function openModal(index) {
    activePostIndex = index;
    renderModal();
    igModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    igModal.classList.remove('active');
    document.body.style.overflow = '';
}

function renderModal() {
    const post = POSTS[activePostIndex];
    igModalImage.innerHTML = `<div class="galeri-tile-media ${post.theme}"><h3>${post.title}</h3></div>`;
    igModalTime.textContent = post.time;
    igModalCaption.textContent = post.caption;
    igModalLink.href = post.link;
    igModalLikes.textContent = post.likes;
    igModalComments.textContent = post.comments;
}

document.getElementById('igModalClose').addEventListener('click', closeModal);
igModal.addEventListener('click', (e) => { if (e.target === igModal) closeModal(); });

document.getElementById('igNavPrev').addEventListener('click', () => {
    activePostIndex = (activePostIndex - 1 + POSTS.length) % POSTS.length;
    renderModal();
});
document.getElementById('igNavNext').addEventListener('click', () => {
    activePostIndex = (activePostIndex + 1) % POSTS.length;
    renderModal();
});

document.addEventListener('keydown', (e) => {
    if (!igModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') document.getElementById('igNavPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('igNavNext').click();
});

// Entrance animation
gsap.from('.page-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
gsap.from('.page-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.15, ease: 'power2.out' });
gsap.from('.galeri-tile', { opacity: 0, y: 40, duration: 0.6, delay: 0.2, stagger: 0.06, ease: 'power2.out' });
