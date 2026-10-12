// Fallback image if a photo fails to load
document.querySelectorAll('img:not(.logo-img)').forEach((im, i) => im.addEventListener('error', () => { im.src = 'https://picsum.photos/seed/mnr' + i + (im.classList.contains('bg') ? '/1600/800' : '/600/400') }, { once: true }));
// Animated counters
const io = new IntersectionObserver((es, o) => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to; let n = 0;
    const t = setInterval(() => { n = Math.min(to, n + Math.ceil(to / 50)); el.textContent = n; if (n >= to) clearInterval(t) }, 30); o.unobserve(el)
}), { threshold: .5 });
document.querySelectorAll('.cnt').forEach(c => io.observe(c));

document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(a => a.addEventListener('click', e => {
    const t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }) }
}));

// Ticker: repeat set so the loop is seamless
const tr = document.getElementById('track'); tr.innerHTML = tr.innerHTML.repeat(6);
// Hero slider
const sl = [...document.querySelectorAll('.hero .bg')], dt = [...document.querySelectorAll('.dots i')]; let ci = 0, tm;
function go(n) { sl[ci].classList.remove('active'); dt[ci].classList.remove('on'); ci = (n + sl.length) % sl.length; sl[ci].classList.add('active'); dt[ci].classList.add('on') }
function auto() { clearInterval(tm); tm = setInterval(() => go(ci + 1), 5000) } auto();
document.querySelector('.arr.l').onclick = () => { go(ci - 1); auto() };
document.querySelector('.arr.r').onclick = () => { go(ci + 1); auto() };
dt.forEach((d, i) => d.onclick = () => { go(i); auto() });
// Sticky header shadow, back-to-top
const hd = document.querySelector('.hdr'), tt = document.getElementById('toTop');
addEventListener('scroll', () => { hd.classList.toggle('sc', scrollY > 10); tt.classList.toggle('show', scrollY > 600) });
tt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
// Scroll reveal
const rv = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); o.unobserve(e.target) } }), { threshold: .08 });
document.querySelectorAll('.sec').forEach(x => { x.classList.add('rv'); rv.observe(x) });
// Active nav link
const links = [...document.querySelectorAll('.pillnav a:not(.ap), .dock a.nl')];
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.classList.toggle('act', l.getAttribute('href') === '#' + e.target.id)) }), { rootMargin: '-45% 0px -50% 0px' });
['home', 'about', 'programs', 'advantage', 'placements', 'admission'].forEach(id => spy.observe(document.getElementById(id)));
// Admission steps: click to tick off
document.querySelectorAll('.step').forEach(st => st.onclick = () => st.classList.toggle('done'));
// Apply form validation

// Bottom dock appears on scroll
const dk = document.getElementById('dock');
let fv = false; const chk = () => dk.classList.toggle('show', scrollY > 300 && !fv); chk(); addEventListener('scroll', chk);
new IntersectionObserver(es => { fv = es[0].isIntersecting; chk() }, { threshold: .6 }).observe(document.querySelector('footer'));
// Hero form
const hf = document.getElementById('heroForm');
hf.addEventListener('submit', e => {
    e.preventDefault(); hf.classList.add('was-validated');
    if (hf.checkValidity()) { hf.classList.add('d-none'); document.querySelector('#heroFormBox .ok').classList.remove('d-none') }
});
// Image accordion (Latest Update)
const ips = [...document.querySelectorAll('.ip')];
ips.forEach(p => {
    const a = () => { ips.forEach(x => x.classList.remove('active')); p.classList.add('active') };
    p.onclick = a; p.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); a() } }
});

// ==========================================
// Facilities (Spaces Built for Legal Practice)
// ==========================================
const labBtns = [...document.querySelectorAll('.lt button')];
const labPanels = [...document.querySelectorAll('.lv .lp')];
const labViewer = document.querySelector('.lv');
const lvBadge = document.getElementById('lvBadge');
const lvPrev = document.getElementById('lvPrev');
const lvNext = document.getElementById('lvNext');

let curLabIdx = 0;

function switchFacility(idx) {
    if (!labPanels.length) return;
    curLabIdx = (idx + labPanels.length) % labPanels.length;

    labBtns.forEach((btn, i) => {
        const isActive = (i === curLabIdx);
        btn.classList.toggle('on', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    labPanels.forEach((panel, i) => {
        panel.classList.toggle('on', i === curLabIdx);
    });

    if (lvBadge) {
        lvBadge.textContent = `Facility ${curLabIdx + 1} of ${labPanels.length}`;
    }
}

if (labBtns.length) {
    labBtns.forEach((btn, i) => {
        btn.onclick = () => switchFacility(i);
        btn.onkeydown = e => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIdx = (i + 1) % labBtns.length;
                labBtns[nextIdx].focus();
                switchFacility(nextIdx);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIdx = (i - 1 + labBtns.length) % labBtns.length;
                labBtns[prevIdx].focus();
                switchFacility(prevIdx);
            }
        };
    });

    if (lvPrev) {
        lvPrev.onclick = () => switchFacility(curLabIdx - 1);
    }
    if (lvNext) {
        lvNext.onclick = () => switchFacility(curLabIdx + 1);
    }

    // Touch swipe support for mobile
    if (labViewer) {
        let touchStartX = 0;
        let touchStartY = 0;

        labViewer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].clientX;
            touchStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        labViewer.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            // Trigger swipe only when horizontal gesture is dominant (>40px)
            if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    switchFacility(curLabIdx + 1); // Swiped left -> next
                } else {
                    switchFacility(curLabIdx - 1); // Swiped right -> prev
                }
            }
        }, { passive: true });
    }
}



