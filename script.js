document.addEventListener('DOMContentLoaded', () => {
    // 1. Envelope Animation
    const envelope = document.getElementById('envelope');
    const envelopeWrapper = document.querySelector('.envelope-wrapper');

    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            envelope.classList.add('open');
            
            // Background Music Play
            const music = document.getElementById('bg-music');
            if (music) {
                music.play().catch(error => {
                    console.log("Autoplay was prevented by the browser. Interaction required.", error);
                });
            }

            // 1.5. Reveal Site Content
            const siteContent = document.getElementById('site-content');
            if (siteContent) {
                siteContent.style.display = 'block';
                // Report height after a short delay to allow for animations
                setTimeout(reportHeight, 500); 
            }
        });
    }

    // 2. Countdown Timer Logic
    const targetDate = new Date('May 22, 2026 9:00:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if(daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if(hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if(minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if(secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    if (daysEl) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // 3. Scroll Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
});

// ==========================================
// Height reporting for iframe embed
// ==========================================
let lastHeight = 0;

function reportHeight() {
    const height = Math.ceil(document.documentElement.scrollHeight || document.body.scrollHeight);
    if (Math.abs(height - lastHeight) > 5) {
        window.parent.postMessage({ type: 'SET_HEIGHT', height: height }, '*');
        lastHeight = height;
    }
}

// Initial height report
reportHeight();

// Re-report on window resize and load
window.addEventListener('resize', reportHeight);
window.addEventListener('load', reportHeight);

// Periodic check for dynamic content changes
setInterval(reportHeight, 1500);

// Watch for content changes in the DOM
if (typeof document !== 'undefined' && document.body) {
    const heightObserver = new MutationObserver(reportHeight);
    heightObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
}
