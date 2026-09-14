/* FIND-US.JS — page-specific behaviour (common.js handles bubbles + floating fruit bg) */

// Entrance animation
safeReveal('.page-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' });
safeReveal('.page-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.15, ease: 'power2.out' });
safeReveal('.map-card, .info-panel', { opacity: 0, y: 40, duration: 0.8, delay: 0.25, stagger: 0.15, ease: 'power2.out' });

// ---- Distribution data ----
// Keyed by ISO 3166-1 numeric id (matches world-atlas topojson feature ids)
const DISTRIBUTED = {
    360: { code: 'ID', flag: '🇮🇩', name: 'Indonesia', blurb: 'Home base, from Sabang to Merauke, EmotiPops started here.' },
    458: { code: 'MY', flag: '🇲🇾', name: 'Malaysia', blurb: "A favourite snack across Kuala Lumpur and Penang." },
    702: { code: 'SG', flag: '🇸🇬', name: 'Singapore', blurb: 'Compact but mighty — found in convenience stores islandwide.' },
    764: { code: 'TH', flag: '🇹🇭', name: 'Thailand', blurb: 'Sweet, sour, and a little spicy — a natural fit for Thai taste buds.' },
    418: { code: 'LA', flag: '🇱🇦', name: 'Laos', blurb: "Making its way through Vientiane's local markets." },
    704: { code: 'VN', flag: '🇻🇳', name: 'Vietnam', blurb: 'Bright colours and bold fruit flavours loved in Hanoi and Ho Chi Minh City.' },
    116: { code: 'KH', flag: '🇰🇭', name: 'Cambodia', blurb: 'Now on shelves from Phnom Penh to Siem Reap.' },
    608: { code: 'PH', flag: '🇵🇭', name: 'Philippines', blurb: 'A tropical fruit lineup that fits right into Filipino snacking culture.' },
    356: { code: 'IN', flag: '🇮🇳', name: 'India', blurb: 'Distributed across major cities, from Mumbai to Delhi.' },
    586: { code: 'PK', flag: '🇵🇰', name: 'Pakistan', blurb: 'Growing fast in Karachi and Lahore.' },
    '096': { code: 'BN', flag: '🇧🇳', name: 'Brunei', blurb: 'A small nation with a big sweet tooth.' },
    104: { code: 'MM', flag: '🇲🇲', name: 'Myanmar', blurb: "Reaching Yangon's busiest snack aisles." },
    524: { code: 'NP', flag: '🇳🇵', name: 'Nepal', blurb: 'From the valleys of Kathmandu to local corner shops.' },
    '050': { code: 'BD', flag: '🇧🇩', name: 'Bangladesh', blurb: 'A rising favourite in Dhaka and Chittagong.' },
    156: { code: 'CN', flag: '🇨🇳', name: 'China', blurb: "EmotiPops' largest market by reach, from Shanghai to Chengdu." }
};

const infoEmpty = document.getElementById('info-empty');
const infoContent = document.getElementById('info-content');
const infoFlag = document.getElementById('info-flag');
const infoName = document.getElementById('info-name');
const infoBlurb = document.getElementById('info-blurb');
const infoFlagBg = document.getElementById('info-flag-bg');
const infoFlagImg = document.getElementById('info-flag-img');
const cultureGrid = document.getElementById('culture-grid');
const chipGrid = document.getElementById('chip-grid');

let activeId = null;

const CULTURE_CONTENT = {
    ID: [
        { icon: '🛕', title: 'Borobudur', desc: "World's largest Buddhist temple, Central Java.", wiki: 'Borobudur' },
        { icon: '🍛', title: 'Nasi Goreng', desc: "Indonesia's iconic fried rice, a daily staple.", wiki: 'Nasi_goreng' },
        { icon: '🎭', title: 'Wayang Kulit', desc: 'Traditional shadow puppet theatre.', wiki: 'Wayang_kulit' }
    ],
    MY: [
        { icon: '🏙️', title: 'Petronas Towers', desc: 'Once the tallest twin towers in the world, KL.', wiki: 'Petronas_Towers' },
        { icon: '🍚', title: 'Nasi Lemak', desc: "Coconut rice with sambal, Malaysia's national breakfast.", wiki: 'Nasi_lemak' },
        { icon: '🏮', title: 'Thaipusam', desc: 'Colourful Hindu festival of penance and devotion.', wiki: 'Thaipusam' }
    ],
    SG: [
        { icon: '🌇', title: 'Marina Bay Sands', desc: "Singapore's iconic skyline over the bay.", wiki: 'Marina_Bay_Sands' },
        { icon: '🦀', title: 'Chili Crab', desc: "Singapore's signature spicy-sweet seafood dish.", wiki: 'Chili_crab' },
        { icon: '🍜', title: 'Hawker Culture', desc: 'UNESCO-listed street food tradition.', wiki: 'Hawker_centre' }
    ],
    TH: [
        { icon: '🛕', title: 'Wat Arun', desc: 'Temple of Dawn on the Chao Phraya River.', wiki: 'Wat_Arun' },
        { icon: '🍜', title: 'Pad Thai', desc: "Stir-fried noodles, Thailand's most famous dish.", wiki: 'Pad_thai' },
        { icon: '💦', title: 'Songkran', desc: 'New Year water festival celebrated nationwide.', wiki: 'Songkran' }
    ],
    LA: [
        { icon: '🛕', title: 'Pha That Luang', desc: "Golden stupa, Laos' most sacred monument.", wiki: 'Pha_That_Luang' },
        { icon: '🍚', title: 'Sticky Rice', desc: 'Eaten by hand with nearly every meal.', wiki: 'Glutinous_rice' },
        { icon: '🙏', title: 'Alms Giving', desc: 'Monks collect morning alms in Luang Prabang.', wiki: 'Luang_Prabang' }
    ],
    VN: [
        { icon: '⛰️', title: 'Ha Long Bay', desc: 'Limestone karsts rising from emerald water.', wiki: 'Ha_Long_Bay' },
        { icon: '🍜', title: 'Phở', desc: "Vietnam's beloved noodle soup.", wiki: 'Pho' },
        { icon: '🧧', title: 'Tết', desc: 'Lunar New Year, the biggest holiday of the year.', wiki: 'Tết' }
    ],
    KH: [
        { icon: '🛕', title: 'Angkor Wat', desc: "World's largest religious monument.", wiki: 'Angkor_Wat' },
        { icon: '🍛', title: 'Fish Amok', desc: "Steamed curry mousse, Cambodia's national dish.", wiki: 'Fish_amok' },
        { icon: '🎉', title: 'Khmer New Year', desc: 'Three days of games, dance, and family visits.', wiki: 'Khmer_New_Year' }
    ],
    PH: [
        { icon: '⛰️', title: 'Chocolate Hills', desc: 'Over 1,200 cone-shaped hills in Bohol.', wiki: 'Chocolate_Hills' },
        { icon: '🍖', title: 'Adobo', desc: 'Vinegar-soy braised dish, the unofficial national food.', wiki: 'Adobo' },
        { icon: '🎊', title: 'Sinulog Festival', desc: "Grand street party honouring the Santo Niño.", wiki: 'Sinulog' }
    ],
    IN: [
        { icon: '🕌', title: 'Taj Mahal', desc: 'Marble mausoleum, a monument to eternal love.', wiki: 'Taj_Mahal' },
        { icon: '🍛', title: 'Biryani', desc: 'Spiced layered rice found in countless regional styles.', wiki: 'Biryani' },
        { icon: '🪔', title: 'Diwali', desc: 'Festival of lights celebrated across the country.', wiki: 'Diwali' }
    ],
    PK: [
        { icon: '🕌', title: 'Badshahi Mosque', desc: "One of the world's largest mosques, Lahore.", wiki: 'Badshahi_Mosque' },
        { icon: '🍛', title: 'Biryani & Karahi', desc: 'Fragrant rice and rich meat curries.', wiki: 'Chicken_karahi' },
        { icon: '🪁', title: 'Basant', desc: "Spring kite-flying festival over Lahore's rooftops.", wiki: 'Basant_(festival)' }
    ],
    BN: [
        { icon: '🕌', title: 'Omar Ali Mosque', desc: "Golden-domed landmark on Bandar Seri Begawan's lagoon.", wiki: 'Omar_Ali_Saifuddien_Mosque' },
        { icon: '🍲', title: 'Ambuyat', desc: 'Sago starch dish eaten with tangy dips.', wiki: 'Ambuyat' },
        { icon: '🌙', title: 'Hari Raya', desc: 'Homes open their doors for Eid celebrations.', wiki: 'Eid_al-Fitr' }
    ],
    MM: [
        { icon: '🛕', title: 'Shwedagon Pagoda', desc: 'Gilded stupa said to enshrine relics of the Buddha.', wiki: 'Shwedagon_Pagoda' },
        { icon: '🍜', title: 'Mohinga', desc: 'Fish and rice noodle soup, often called the national dish.', wiki: 'Mohinga' },
        { icon: '💦', title: 'Thingyan', desc: 'Water festival marking the Burmese New Year.', wiki: 'Thingyan' }
    ],
    NP: [
        { icon: '🏔️', title: 'Mount Everest', desc: "The world's highest peak, on the Nepal-China border.", wiki: 'Mount_Everest' },
        { icon: '🥟', title: 'Momo', desc: 'Steamed dumplings loved across the Himalayas.', wiki: 'Momo_(food)' },
        { icon: '🪁', title: 'Dashain', desc: "Nepal's longest and most important festival.", wiki: 'Dashain' }
    ],
    BD: [
        { icon: '🐯', title: 'Sundarbans', desc: 'The largest mangrove forest, home to Bengal tigers.', wiki: 'Sundarbans' },
        { icon: '🐟', title: 'Hilsa Curry', desc: 'The national fish, central to Bengali cuisine.', wiki: 'Ilish' },
        { icon: '🎉', title: 'Pohela Boishakh', desc: 'Bengali New Year with parades and fairs.', wiki: 'Pohela_Boishakh' }
    ],
    CN: [
        { icon: '🏯', title: 'Great Wall', desc: 'Ancient fortification stretching thousands of kilometres.', wiki: 'Great_Wall_of_China' },
        { icon: '🥟', title: 'Dumplings', desc: 'Jiaozi, a Lunar New Year and everyday favourite.', wiki: 'Jiaozi' },
        { icon: '🐉', title: 'Chinese New Year', desc: 'Lion dances, red envelopes, family reunions.', wiki: 'Chinese_New_Year' }
    ]
};

const wikiPhotoCache = {};

function applyCulturePhoto(wrapEl, src) {
    const media = wrapEl.querySelector('.culture-photo-media');
    if (!media) return;
    media.style.backgroundImage = `url("${src}")`;
    wrapEl.classList.add('has-photo');
}

async function loadCulturePhoto(wikiTitle, wrapEl) {
    if (!wikiTitle) return;
    if (wikiPhotoCache[wikiTitle]) {
        applyCulturePhoto(wrapEl, wikiPhotoCache[wikiTitle]);
        return;
    }
    try {
        const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
        if (!res.ok) return;
        const data = await res.json();
        const src = data.thumbnail && data.thumbnail.source;
        if (src) {
            wikiPhotoCache[wikiTitle] = src;
            applyCulturePhoto(wrapEl, src);
        }
    } catch (e) {
        // Silently keep the emoji/icon fallback if the fetch fails
    }
}

function buildCultureSlots(code) {
    cultureGrid.innerHTML = '';
    const items = CULTURE_CONTENT[code] || [];
    items.forEach(item => {
        const wrap = document.createElement('div');
        wrap.className = 'culture-photo';
        wrap.title = item.desc;
        wrap.innerHTML = `
            <div class="culture-photo-media"></div>
            <div class="culture-icon">${item.icon}</div>
            <div class="culture-label">${item.title}</div>
        `;
        cultureGrid.appendChild(wrap);
        loadCulturePhoto(item.wiki, wrap);
    });
}

const DISTRIBUTED_FLAG_LOOKUP = {};
Object.values(DISTRIBUTED).forEach(d => { DISTRIBUTED_FLAG_LOOKUP[d.code] = d.flag; });

function selectCountry(id) {
    const data = DISTRIBUTED[id];
    if (!data) return;
    activeId = String(id);

    infoEmpty.style.display = 'none';
    infoContent.classList.add('active');
    infoFlag.innerHTML = `<img src="https://flagcdn.com/w160/${data.code.toLowerCase()}.png" alt="${data.name} flag" />`;
    infoName.textContent = data.name;
    infoBlurb.textContent = data.blurb;
    infoFlagImg.src = `https://flagcdn.com/w640/${data.code.toLowerCase()}.png`;
    infoFlagImg.alt = `${data.name} flag`;
    infoFlagBg.classList.add('active');
    buildCultureSlots(data.code);

    document.querySelectorAll('.country, .pulse-dot-group').forEach(el => {
        el.classList.toggle('hovered', el.dataset.id === activeId);
    });
    document.querySelectorAll('.country-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.id === activeId);
    });

    gsap.fromTo(infoContent, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
}

// Build country chip list (sorted alphabetically)
Object.entries(DISTRIBUTED)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .forEach(([id, data]) => {
        const chip = document.createElement('button');
        chip.className = 'country-chip';
        chip.dataset.id = id;
        chip.innerHTML = `<img class="chip-flag" src="https://flagcdn.com/w40/${data.code.toLowerCase()}.png" alt="" /> ${data.name}`;
        chip.addEventListener('click', () => selectCountry(id));
        chipGrid.appendChild(chip);
    });

// Wire up hover/click on the pre-rendered static map (no fetch, no d3, no external data needed)
document.querySelectorAll('#countries-layer .country.is-live, #dots-layer .pulse-dot-group').forEach(el => {
    el.addEventListener('mouseenter', () => selectCountry(el.dataset.id));
    el.addEventListener('click', () => selectCountry(el.dataset.id));
});

// Distribution tab switcher
document.querySelectorAll('.dist-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.dist-tab').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.dist-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        document.getElementById(tab.dataset.panel).classList.add('active');
        if (tab.dataset.panel === 'panel-store') {
            gsap.fromTo('#store-grid .store-card', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' });
        }
    });
});
