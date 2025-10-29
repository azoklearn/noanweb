// ========================================
// REGISTER GSAP PLUGINS
// ========================================
function registerScrollTrigger() {
    if (typeof gsap !== 'undefined') {
        // Check if ScrollTrigger is available (either as global or via gsap)
        const ST = typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : (typeof gsap.ScrollTrigger !== 'undefined' ? gsap.ScrollTrigger : null);
        if (ST) {
            gsap.registerPlugin(ST);
            return true;
        }
    }
    return false;
}

// Try to register immediately if available
registerScrollTrigger();

// ========================================
// SCROLL FLOAT ANIMATION
// ========================================
function initScrollFloat() {
    const scrollFloatElements = document.querySelectorAll('.scroll-float');
    
    if (scrollFloatElements.length === 0 || typeof gsap === 'undefined') {
        return;
    }
    
    // Check if ScrollTrigger is available
    const hasScrollTrigger = (typeof ScrollTrigger !== 'undefined' || typeof gsap.ScrollTrigger !== 'undefined');
    if (!hasScrollTrigger) {
        console.warn('ScrollTrigger not loaded. ScrollFloat animation will not work.');
        return;
    }
    
    scrollFloatElements.forEach(el => {
        // Skip if already initialized
        if (el.dataset.scrollFloatInit === '1') return;
        el.dataset.scrollFloatInit = '1';
        
        // Get the original text
        const originalText = el.textContent.trim();
        
        // Create wrapper for text
        const textWrapper = document.createElement('span');
        textWrapper.className = 'scroll-float-text';
        textWrapper.style.display = 'inline-block';
        
        // Split text into characters
        const chars = originalText.split('').map((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char === ' ' ? '\u00A0' : char;
            textWrapper.appendChild(charSpan);
            return charSpan;
        });
        
        // Clear and add wrapper
        el.textContent = '';
        el.appendChild(textWrapper);
        
        // Set initial state
        gsap.set(chars, {
            willChange: 'opacity, transform',
            opacity: 0,
            yPercent: 120,
            scaleY: 2.3,
            scaleX: 0.7,
            transformOrigin: '50% 0%'
        });
        
        // Animate on scroll - démarre encore plus tôt
        gsap.to(chars, {
            duration: 1.2,
            ease: 'back.out(1.7)',
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            stagger: 0.05,
            scrollTrigger: {
                trigger: el,
                start: 'top bottom-=30%',
                toggleActions: 'play reverse play reverse'
            }
        });
    });
}

// Initialize after DOM and GSAP are ready
function tryInitScrollFloat() {
    if (typeof gsap !== 'undefined') {
        registerScrollTrigger();
        initScrollFloat();
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    // Wait for GSAP to be fully loaded
    if (!tryInitScrollFloat()) {
        // Retry after a short delay if GSAP isn't loaded yet
        setTimeout(() => {
            tryInitScrollFloat();
        }, 100);
    }
});

// Also try after window load
window.addEventListener('load', () => {
    setTimeout(() => {
        tryInitScrollFloat();
    }, 200);
});

// ========================================
// PRELOADER ANIMATION - SYNCHRONISÉE
// ========================================
const PRELOADER_TRANSITION_DURATION = 500;
const SCREEN_DELAY = 250; // Délai entre chaque écran

// Activer le preloader au chargement
document.body.classList.add('preloader-active');

window.addEventListener("load", function() {
    const TEST_DELAY = 500;
    
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        const logoPreloader = document.querySelector('.logo-preloader');
        
        if (preloader && logoPreloader) {
            // Fade in du logo
            logoPreloader.style.opacity = '0';
            setTimeout(() => {
                logoPreloader.style.transition = 'opacity 0.5s ease-in';
                logoPreloader.style.opacity = '1';
            }, 100);
            
            // Animation des écrans de couleur en synchronisation
            const screens = preloader.querySelectorAll('.screen');
            screens.forEach((screen, index) => {
                setTimeout(() => {
                    screen.style.transition = 'opacity 0.5s ease-out';
                    screen.style.opacity = '0';
                    setTimeout(() => {
                        screen.classList.add("hide");
                    }, 500);
                }, index * SCREEN_DELAY);
            });
            
            // Calculer le temps total (3 écrans × 250ms = 750ms + 500ms transition)
            const totalAnimationTime = (screens.length - 1) * SCREEN_DELAY + 1000;
            
            // Fade out du logo avant de cacher le preloader
            setTimeout(() => {
                logoPreloader.style.transition = 'opacity 0.5s ease-out';
                logoPreloader.style.opacity = '0';
            }, totalAnimationTime - 500);
            
            setTimeout(() => {
                preloader.classList.add("hide");
                
                // Attendre que le preloader soit complètement caché avant d'afficher le contenu
                setTimeout(() => {
                    document.body.classList.remove('preloader-active');
                    document.body.classList.add('preloader-done');
                    
                    // Afficher le header après le gros logo
                    setTimeout(() => {
                        document.body.classList.add('hero-visible');
                    }, 1500);
                }, 500);
            }, totalAnimationTime);
        }
    }, TEST_DELAY);
});

// Fallback
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        const preloader = document.getElementById("preloader");
        if (preloader && !preloader.classList.contains("hide")) {
            preloader.classList.add("hide");
            document.body.classList.remove('preloader-active');
            document.body.classList.add('preloader-done');
        }
    }, 8000);
});

// ========================================
// HEADER - SCROLL BEHAVIOR
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.section-header');
    
    // Header scroll behavior - apparaît uniquement au scroll
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                header.classList.add('visible');
                header.classList.remove('bigger');
            } else {
                header.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
});

// ========================================
// REVEAL ANIMATION - Hero Title
// ========================================
function setupReveal(el) {
    if (el.dataset.revealInit === "1") return;
    el.dataset.revealInit = "1";

    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = '';

    let wordIndex = 0;

    parts.forEach((line) => {
        const lineEl = document.createElement('span');
        lineEl.className = 'reveal__line';

        const text = line.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const words = text.split(/\s+/).filter(Boolean);

        words.forEach((w) => {
            const wrap = document.createElement('span');
            wrap.className = 'reveal__word';

            const inner = document.createElement('span');
            inner.className = 'reveal__word-inner';
            inner.style.setProperty('--index', wordIndex++);
            inner.textContent = w;

            wrap.appendChild(inner);
            lineEl.appendChild(wrap);
        });

        el.appendChild(lineEl);
    });
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach((el) => {
    setupReveal(el);
    revealObserver.observe(el);
});

// ========================================
// COUNTER ANIMATION - Effet Rouleau
// ========================================
const buildDigitColumn = () => {
    const digit = document.createElement("div");
    digit.className = "digit";
    const roll = document.createElement("div");
    roll.className = "roll";
    
    for (let i = 0; i <= 9; i++) {
        const span = document.createElement("span");
        span.className = "num";
        span.textContent = i;
        roll.appendChild(span);
    }
    digit.appendChild(roll);
    return { digit, roll };
};

const animateDigitTo = (roll, targetEm) => {
    roll.style.transform = "translateY(0)";
    void roll.getBoundingClientRect();

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            roll.style.transform = `translateY(${-targetEm}em)`;
        });
    });
};

const startCounterAnimation = (counter, end) => {
    if (counter.dataset.started === "true") return;
    counter.dataset.started = "true";

    counter.textContent = "";
    const chars = String(end).split("");

    chars.forEach((digitChar, index) => {
        const { digit, roll } = buildDigitColumn();
        counter.appendChild(digit);

        const target = parseInt(digitChar, 10);
        const delay = index * 100;

        setTimeout(() => {
            animateDigitTo(roll, target);
        }, delay);
    });
};

const statsObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const end = counter.getAttribute("data-end") || counter.textContent.trim();

            startCounterAnimation(counter, end);
            statsObserver.unobserve(counter);
        });
    },
    { root: null, rootMargin: "0px", threshold: 0.3 }
);

document.querySelectorAll('.counter').forEach((counter) => {
    statsObserver.observe(counter);
});

// ========================================
// SHOWREEL - SUPPRIMÉ
// ========================================

// ========================================
// DÉFILEMENT HORIZONTAL AUTO - Section raisons
// ========================================
const raisonsGrid = document.querySelector('.raisons-grid');
let isScrollingRaisons = false;

if (raisonsGrid) {
    window.addEventListener('scroll', () => {
        if (!isScrollingRaisons) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const scrollSpeed = 0.5;
                
                // Défilement horizontal basé sur le scroll vertical
                raisonsGrid.scrollLeft = scrolled * scrollSpeed;
                
                isScrollingRaisons = false;
            });
            
            isScrollingRaisons = true;
        }
    });
}

// ========================================
// SMOOTH SCROLL pour les liens d'ancrage
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// SELECTION GLITCH EFFECT
// ========================================
(function() {
    const colorWhite = 'rgb(255, 255, 255)';
    const colorBlack = 'rgb(0, 0, 0)';
    const colorGray = 'rgb(170, 170, 170)';

    function getRandomOffset() {
        return Math.floor(Math.random() * 5) - 2;
    }

    function updateSelectionStyle() {
        const x1 = getRandomOffset();
        const y1 = getRandomOffset();
        const x2 = getRandomOffset();
        const y2 = getRandomOffset();

        const style = document.getElementById('selection-glitch-style') || (() => {
            const s = document.createElement('style');
            s.id = 'selection-glitch-style';
            document.head.appendChild(s);
            return s;
        })();

        style.innerHTML = `
            ::selection {
                background: transparent;
                color: ${colorWhite};
                text-shadow: ${x1}px ${y1}px 0 ${colorWhite}, ${x2}px ${y2}px 0 ${colorBlack};
            }
            ::-moz-selection {
                background: transparent;
                color: ${colorWhite};
                text-shadow: ${x1}px ${y1}px 0 ${colorWhite}, ${x2}px ${y2}px 0 ${colorBlack};
            }
        `;
    }

    setInterval(updateSelectionStyle, 90);
})();

// ========================================
// PARALLAX EFFECT sur les cartes
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    const cards = document.querySelectorAll('.bloc-prestation');
    cards.forEach((card, index) => {
        const speed = 0.5 + (index % 3) * 0.1;
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos * 0.05}px)`;
    });
});

// ========================================
// CONSOLE MESSAGE (Easter egg)
// ========================================
console.log('%c🚀 NOAN WEB - Des sites qui brillent!', 'color: #FFFFFF; background: #000000; font-size: 20px; padding: 10px; font-weight: bold;');
console.log('%cVous cherchez à voir comment ce site est construit? Bravo! Vous êtes curieux comme nous 😉', 'color: #AAAAAA; font-size: 12px;');

// ========================================
// FORMULAIRE DE CONTACT (si vous en ajoutez un)
// ========================================
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Ajoutez ici votre logique d'envoi de formulaire
        alert('Formulaire soumis ! Merci pour votre message.');
    });
}

// ========================================
// INTERSECTION OBSERVER - Animations au scroll
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Ajouter l'animation aux éléments
document.querySelectorAll('.bloc-prestation, .chiffre-cle, .resume').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
    fadeInObserver.observe(el);
});

// ========================================
// ANIMATION TRANSITION PAGE 1 -> PAGE 2 (Glissement)
// ========================================
function initSectionTransition() {
    const heroSection = document.querySelector('.section-hero-accueil');
    const secondSection = document.querySelector('.section-white');
    
    if (!heroSection || !secondSection || typeof gsap === 'undefined') {
        return;
    }
    
    const hasScrollTrigger = (typeof ScrollTrigger !== 'undefined' || typeof gsap.ScrollTrigger !== 'undefined');
    if (!hasScrollTrigger) {
        return;
    }
    
    // Positionner la section pour qu'elle puisse glisser par-dessus la hero
    secondSection.style.position = 'relative';
    secondSection.style.zIndex = '10';
    secondSection.style.width = '100%';
    secondSection.style.overflow = 'hidden';
    
    // État initial - la deuxième section commence à droite, hors écran
    gsap.set(secondSection, {
        x: '100%'
    });
    
    // Animation de glissement - la deuxième section glisse par-dessus la première
    gsap.to(secondSection, {
        x: '0%',
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// ========================================
// ANIMATION TITRE "POURQUOI AVOIR UN SITE WEB" (Glissement gauche -> droite)
// ========================================
function initPourquoiTitleAnimation() {
    const pourquoiSection = document.querySelector('#pourquoi');
    const pourquoiTitle = pourquoiSection ? pourquoiSection.querySelector('.title-section-center') : null;
    
    if (!pourquoiTitle || typeof gsap === 'undefined') {
        return;
    }
    
    const hasScrollTrigger = (typeof ScrollTrigger !== 'undefined' || typeof gsap.ScrollTrigger !== 'undefined');
    if (!hasScrollTrigger) {
        return;
    }
    
    // État initial - le titre commence à gauche, hors écran
    gsap.set(pourquoiTitle, {
        x: '-100%'
    });
    
    // Animation de glissement - le titre glisse de gauche vers la droite
    gsap.to(pourquoiTitle, {
        x: '0%',
        ease: 'power2.out',
        scrollTrigger: {
            trigger: pourquoiSection,
            start: 'top bottom-=30%',
            end: 'top center',
            scrub: false,
            toggleActions: 'play none none none'
        }
    });
}

// Initialiser après le chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initSectionTransition();
            initPourquoiTitleAnimation();
        }, 100);
    });
} else {
    setTimeout(() => {
        initSectionTransition();
        initPourquoiTitleAnimation();
    }, 100);
}

// ========================================
// PERFORMANCE - Désactiver les animations sur mobile si nécessaire
// ========================================
if (window.innerWidth < 768) {
    document.body.classList.add('mobile');
}

// ========================================
// RESIZE HANDLER - Debounced
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth < 768) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }, 250);
});

console.log('✅ Noan Web - Site initialisé avec succès !');
