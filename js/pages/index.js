/* INDEX.JS — page-specific behaviour (common.js handles bubbles + floating fruit bg) */

const modelViewer = document.querySelector('#product-model');
const berriesFG = document.querySelector('.berries-container');
const berriesBG = document.querySelector('.berries-container-bg');
const leavesBG = document.querySelector('.leaves-container');
const allBerries = document.querySelectorAll('.berry');
const cards = document.querySelectorAll('.card');
let isSwitching = false;
let switchSpin = 0;

const GUMMY_GLB = {
    'love-angry': 'assets/glb/Gummy2.glb',
    'happy-sad': 'assets/glb/Gummy1.glb'
};
// Mix of fruit models per flavor variant
const FRUIT_GLB = {
    'love-angry': ['assets/glb/Lychee.glb', 'assets/glb/Wildberry.glb', 'assets/glb/Orange.glb'],
    'happy-sad': [
        'https://api.getlayers.ai/storage/v1/object/public/public/assets/soda-14ff8a788d/blueberry.glb', // Blackcurrant
        'assets/glb/Strawberry.glb',
        'assets/glb/Lemon.glb',
        'assets/glb/Mango.glb'
    ]
};
function randomFruit(flavor) {
    const list = FRUIT_GLB[flavor];
    return list[Math.floor(Math.random() * list.length)];
}
const variantLogo = document.querySelector('#variant-logo');
const LOGO_IMG = {
    'love-angry': { src: 'assets/picture/Emotipops_LoveAngry.png', alt: 'EmotiPops Love & Angry' },
    'happy-sad': { src: 'assets/picture/Emotipops_HappySad.png', alt: 'EmotiPops Happy & Sad' }
};
const variantTitleLine1 = document.querySelector('#variant-title-line1');
const variantTitleLine2 = document.querySelector('#variant-title-line2');
const VARIANT_TITLE = {
    'love-angry': { line1: 'Love &', line2: 'Angry' },
    'happy-sad': { line1: 'Happy &', line2: 'Sad' }
};

cards.forEach(card => {
    card.addEventListener('click', () => {
        if (isSwitching) return;
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const flavor = card.dataset.flavor;
        switchFlavor(flavor);
    });
});

async function switchFlavor(flavor) {
    if (isSwitching) return;
    isSwitching = true;
    const body = document.body;
    const berries = document.querySelectorAll('.berry');
    const heroCenter = document.querySelector('.hero-center');

    // 1. Background Animation
    const targetColors = flavor === 'happy-sad' ?
        { inner: '#0b4f8a', mid: '#04294e', outer: '#010c14' } :
        { inner: '#8a0b2c', mid: '#4e041d', outer: '#140108' };

    gsap.to(body, {
        '--bg-inner': targetColors.inner,
        '--bg-mid': targetColors.mid,
        '--bg-outer': targetColors.outer,
        duration: 1.5,
        ease: 'power2.inOut'
    });

    // 1b. Logo & Title Out Animation
    if (variantLogo) {
        gsap.to(variantLogo, {
            opacity: 0,
            scale: 0.7,
            y: -20,
            rotate: flavor === 'happy-sad' ? -8 : 8,
            duration: 0.4,
            ease: 'power2.in'
        });
    }
    if (variantTitleLine1 && variantTitleLine2) {
        gsap.to([variantTitleLine1, variantTitleLine2], {
            opacity: 0,
            y: -15,
            duration: 0.35,
            ease: 'power2.in'
        });
    }

    // 2. Product Spin Animation (Simple 360 spin + blur with back settle)
    const spinObj = { val: 0, blur: 0 };
    gsap.to(spinObj, {
        val: 360,
        blur: 15,
        duration: 0.6,
        ease: "power2.in",
        onUpdate: () => {
            switchSpin = spinObj.val;
            modelViewer.style.filter = `blur(${spinObj.blur}px)`;
        },
        onComplete: async () => {
            // SWAP at peak
            if (flavor === 'happy-sad') {
                body.classList.add('blue-theme');
            } else {
                body.classList.remove('blue-theme');
            }
            modelViewer.src = GUMMY_GLB[flavor];
            if (variantLogo && LOGO_IMG[flavor]) {
                variantLogo.src = LOGO_IMG[flavor].src;
                variantLogo.alt = LOGO_IMG[flavor].alt;
                gsap.fromTo(variantLogo,
                    { opacity: 0, scale: 0.7, y: 20, rotate: flavor === 'happy-sad' ? 8 : -8 },
                    { opacity: 1, scale: 1, y: 0, rotate: 0, duration: 0.7, ease: 'back.out(1.7)' }
                );
            }
            if (variantTitleLine1 && variantTitleLine2 && VARIANT_TITLE[flavor]) {
                variantTitleLine1.textContent = VARIANT_TITLE[flavor].line1;
                variantTitleLine2.textContent = VARIANT_TITLE[flavor].line2;
                gsap.fromTo([variantTitleLine1, variantTitleLine2],
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.06 }
                );
            }


            gsap.to(spinObj, {
                val: 720,
                blur: 0,
                duration: 1.5,
                ease: "back.out(0.7)",
                onUpdate: () => {
                    switchSpin = spinObj.val;
                    modelViewer.style.filter = `blur(${spinObj.blur}px)`;
                },
                onComplete: () => {
                    switchSpin = 0;
                    modelViewer.style.filter = 'none';
                }
            });
        }
    });

    // 3. Berries "Hide & Reveal" with Dynamic Positioning
    let completedBerries = 0;
    berries.forEach((berry, i) => {
        const bW = berry.offsetWidth / 2;
        const bH = berry.offsetHeight / 2;
        const centerX = (window.innerWidth / 2 - berry.offsetLeft - bW);
        const centerY = (window.innerHeight / 2 - berry.offsetTop - bH);

        const startAngle = parseFloat(berry.dataset.angle) || 0;
        const currentBaseX = parseFloat(berry.dataset.baseX) || 0;
        const currentBaseY = parseFloat(berry.dataset.baseY) || 0;

        // New random target position
        const nextBaseX = (Math.random() - 0.5) * 140;
        const nextBaseY = (Math.random() - 0.5) * 140;

        gsap.set(berry, {
            rotation: startAngle,
            x: currentBaseX,
            y: currentBaseY
        });

        const berryTl = gsap.timeline();

        berryTl.to(berry, {
            x: centerX,
            y: centerY,
            rotation: startAngle + 45,
            scale: 0.1,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => {
                berry.src = randomFruit(flavor);
                heroCenter.style.zIndex = 50;
            }
        })
        .to(berry, {
            duration: 0.3
        })
        .to(berry, {
            onStart: () => {
                heroCenter.style.zIndex = 1;
            },
            x: nextBaseX,
            y: nextBaseY,
            rotation: startAngle + 90,
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.5)",
            onComplete: () => {
                berry.dataset.angle = startAngle + 90;
                berry.dataset.baseX = nextBaseX;
                berry.dataset.baseY = nextBaseY;
                berry.dataset.rx = 0;
                berry.dataset.ry = 0;

                completedBerries++;
                if (completedBerries === berries.length) {
                    isSwitching = false;
                }
            }
        });
    });
}

// Track berry states for smoothing
allBerries.forEach(b => {
    b.dataset.rx = 0; b.dataset.ry = 0; b.dataset.angle = Math.random() * 360;
    b.dataset.baseX = 0; b.dataset.baseY = 0;
    b.dataset.targetRx = 0; b.dataset.targetRy = 0;
});

let mouse = { x: 0, y: 0, px: 0, py: 0 };
let currentMouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) - 0.5;
    mouse.y = (e.clientY / window.innerHeight) - 0.5;
    mouse.px = e.clientX;
    mouse.py = e.clientY;
});

function animate() {
    const time = Date.now() * 0.001;
    currentMouse.x += (mouse.x - currentMouse.x) * 0.05;
    currentMouse.y += (mouse.y - currentMouse.y) * 0.05;

    // Tilt the product + add switch spin
    modelViewer.cameraOrbit = `${(currentMouse.x * 40) + switchSpin}deg ${90 + (currentMouse.y * 20)}deg 380%`;

    berriesFG.style.transform = `translate(${currentMouse.x * 60}px, ${currentMouse.y * 60}px)`;
    berriesBG.style.transform = `translate(${currentMouse.x * -30}px, ${currentMouse.y * -30}px)`;
    leavesBG.style.transform = `translate(${currentMouse.x * -15}px, ${currentMouse.y * -15}px)`;

    if (!isSwitching) {
        allBerries.forEach((berry, i) => {
            const berryRect = berry.getBoundingClientRect();
            const berryX = berryRect.left + berryRect.width / 2;
            const berryY = berryRect.top + berryRect.height / 2;

            const diffX = mouse.px - berryX;
            const diffY = mouse.py - berryY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);

            let targetRx = 0, targetRy = 0, speedMult = 1;

            if (distance < 400) {
                const force = (400 - distance) / 400;
                targetRx = (diffX / distance) * force * -80;
                targetRy = (diffY / distance) * force * -80;
                speedMult = 1 + force * 5;
            }

            let rx = parseFloat(berry.dataset.rx) || 0;
            let ry = parseFloat(berry.dataset.ry) || 0;
            let angle = parseFloat(berry.dataset.angle) || 0;
            let baseX = parseFloat(berry.dataset.baseX) || 0;
            let baseY = parseFloat(berry.dataset.baseY) || 0;

            rx += (targetRx - rx) * 0.1;
            ry += (targetRy - ry) * 0.1;
            angle += 0.2 * speedMult;

            berry.dataset.rx = rx;
            berry.dataset.ry = ry;
            berry.dataset.angle = angle;

            const dur = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10][i % 9];
            const phase = (time + i * 0.7) * (Math.PI * 2 / dur);
            const floatY = Math.sin(phase) * 15;
            const floatAngle = Math.cos(phase) * 6;

            berry.style.transform = `translate(calc(${rx + baseX}px), calc(${ry + baseY}px + ${floatY}px)) rotate(calc(${angle}deg + ${floatAngle}deg))`;
        });
    }

    document.querySelectorAll('.leaf').forEach((leaf, i) => {
        const dur = 10 + i * 2;
        const phase = (time + i * 1.2) * (Math.PI * 2 / dur);
        const floatY = Math.sin(phase) * 20;
        const floatX = Math.cos(phase * 0.5) * 15;
        const floatAngle = Math.sin(phase * 0.3) * 15;
        leaf.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${floatAngle}deg)`;
    });

    requestAnimationFrame(animate);
}

animate();
