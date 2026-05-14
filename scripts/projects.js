(function () {
    const outer = document.getElementById('projects-scroll-outer');
    if (!outer) return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, CustomEase);

    // ── custom eases ────────────────────────────────────────────────────
    CustomEase.create('slideReveal', 'M0,0 C0.25,0.46 0.45,0.94 1,1');
    CustomEase.create('expandFill',  'M0,0 C0.76,0 0.24,1 1,1');

    const slides    = gsap.utils.toArray('.project-slide');
    const numSlides = slides.length;
    if (numSlides === 0) return;

    const elTotal  = document.querySelector('.proj-counter-total');
    const numEl    = document.querySelector('.proj-num-current');

    var isMobile = window.innerWidth <= 900;

    let currentIndex = 0;
    let isAnimating  = false;
    let queuedIndex  = -1;

    outer.style.height = (numSlides * window.innerHeight) + 'px';
    if (elTotal) elTotal.textContent = pad(numSlides);

    // ── SplitText all titles ────────────────────────────────────────────
    const splitTitles = slides.map(function (slide) {
        var el = slide.querySelector('.slide-title');
        return el ? new SplitText(el, { type: 'words' }) : null;
    });

    // ── initial state (all slides hidden; slide 0 reveals after splash) ─
    slides.forEach(function (slide, i) {
        var sp      = splitTitles[i];
        var num     = slide.querySelector('.slide-num');
        var tags    = slide.querySelector('.tags');
        var company = slide.querySelector('.company');
        var imgWrap = slide.querySelector('.slide-img-wrap');

        if (i === 0) {
            gsap.set(slide, { opacity: 1 });
            slide.classList.add('is-active');
        } else {
            gsap.set(slide, { opacity: 0 });
        }

        if (sp)      gsap.set(sp.words,  { y: 28, opacity: 0 });
        if (num)     gsap.set(num,        { y: 20, opacity: 0 });
        if (tags)    gsap.set(tags,       { y: 16, opacity: 0 });
        if (company) gsap.set(company,    { y: 12, opacity: 0 });
        if (imgWrap) gsap.set(imgWrap,    { clipPath: 'inset(0 0 0 100% round 16px)' });
    });
    updateUI(0);

    // ── entrance: reveal first slide after splash (~1700 ms) ───────────
    setTimeout(function () {
        var s0      = slides[0];
        var sp0     = splitTitles[0];
        var num0    = s0.querySelector('.slide-num');
        var tags0   = s0.querySelector('.tags');
        var comp0   = s0.querySelector('.company');
        var img0    = s0.querySelector('.slide-img-wrap');

        var tl = gsap.timeline();
        if (img0)  tl.to(img0,      { clipPath: 'inset(0 0% 0 0% round 16px)', duration: 0.9,  ease: 'slideReveal' }, 0);
        if (num0)  tl.to(num0,      { y: 0, opacity: isMobile ? 1 : 0.06, duration: 0.6, ease: 'power2.out' }, 0.1);
        if (tags0) tl.to(tags0,     { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.2);
        if (sp0)   tl.to(sp0.words, { y: 0, opacity: 1, duration: 0.55, stagger: 0.04, ease: 'power3.out' }, 0.3);
        if (comp0) tl.to(comp0,     { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.5);
    }, 1700);

    // ── transition ──────────────────────────────────────────────────────
    function goToSlide(newIndex) {
        if (newIndex === currentIndex || newIndex < 0 || newIndex >= numSlides) return;
        if (isAnimating) { queuedIndex = newIndex; return; }
        _runTransition(newIndex);
    }

    function _runTransition(newIndex) {
        isAnimating = true;
        queuedIndex = -1;

        var outSlide  = slides[currentIndex];
        var inSlide   = slides[newIndex];
        var dir       = newIndex > currentIndex ? 1 : -1;

        var outImg    = outSlide.querySelector('.slide-img-wrap');
        var inImg     = inSlide.querySelector('.slide-img-wrap');
        var inNum     = inSlide.querySelector('.slide-num');
        var inTags    = inSlide.querySelector('.tags');
        var inCompany = inSlide.querySelector('.company');
        var inSplit   = splitTitles[newIndex];

        var clipStart = dir > 0
            ? 'inset(0 0 0 100% round 16px)'
            : 'inset(0 100% 0 0 round 16px)';
        var clipEnd   = 'inset(0 0% 0 0% round 16px)';
        var DUR       = 0.7;

        // prep in-slide
        inSlide.classList.add('is-active');
        gsap.set(inSlide, { opacity: 1 });
        if (inImg)     gsap.set(inImg,       { clipPath: clipStart });
        if (inNum)     gsap.set(inNum,       { y: 20, opacity: 0 });
        if (inTags)    gsap.set(inTags,      { y: 16, opacity: 0 });
        if (inCompany) gsap.set(inCompany,   { y: 12, opacity: 0 });
        if (inSplit)   gsap.set(inSplit.words, { y: dir > 0 ? 28 : -28, opacity: 0 });

        var tl = gsap.timeline({
            onComplete: function () {
                outSlide.classList.remove('is-active');
                gsap.set(outSlide, { opacity: 0 });
                if (outImg) gsap.set(outImg, { clearProps: 'clipPath' });
                isAnimating = false;
                if (queuedIndex !== -1 && queuedIndex !== currentIndex) {
                    var q = queuedIndex;
                    queuedIndex = -1;
                    _runTransition(q);
                }
            }
        });

        // out: fade whole slide
        tl.to(outSlide, { opacity: 0, duration: DUR * 0.55, ease: 'power2.in' }, 0);

        // in: image clip reveal
        if (inImg) {
            tl.to(inImg, { clipPath: clipEnd, duration: DUR, ease: 'slideReveal' }, 0.05);
        }

        // in: text cascade
        if (inNum)     tl.to(inNum,        { y: 0, opacity: isMobile ? 1 : 0.6, duration: 0.5, ease: 'power2.out' }, 0.15);
        if (inTags)    tl.to(inTags,       { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.22);
        if (inSplit)   tl.to(inSplit.words, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power3.out' }, 0.3);
        if (inCompany) tl.to(inCompany,    { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.45);

        currentIndex = newIndex;
        updateUI(currentIndex, dir);
    }

    // ── scroll to snap point (ScrollToPlugin) ───────────────────────────
    var st;

    function scrollToSlide(index) {
        if (!st) return;
        var progress = numSlides > 1 ? index / (numSlides - 1) : 0;
        var target   = st.start + progress * (st.end - st.start);
        gsap.to(window, { scrollTo: target, duration: 0.65, ease: 'power2.inOut' });
    }

    // ── ScrollTrigger ───────────────────────────────────────────────────
    var navH = window.innerWidth <= 425 ? 64 : 70;
    st = ScrollTrigger.create({
        trigger : outer,
        start   : 'top ' + navH + 'px',
        end     : 'bottom bottom',
        onUpdate: function (self) {
            var snappedIdx = Math.round(self.progress * (numSlides - 1));
            if (snappedIdx !== currentIndex) goToSlide(snappedIdx);
        },
        snap: {
            snapTo  : numSlides > 1 ? 1 / (numSlides - 1) : 1,
            duration: { min: 0.25, max: 0.55 },
            delay   : 0.05,
            ease    : 'power1.inOut',
        },
    });

    // ── keyboard navigation ─────────────────────────────────────────────
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentIndex < numSlides - 1) scrollToSlide(currentIndex + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentIndex > 0) scrollToSlide(currentIndex - 1);
        }
    });

    // ── image hover parallax ────────────────────────────────────────────
    slides.forEach(function (slide) {
        var wrap = slide.querySelector('.slide-img-wrap');
        var img  = wrap && wrap.querySelector('img');
        if (!img) return;

        slide.addEventListener('mousemove', function (e) {
            if (!slide.classList.contains('is-active') || isAnimating) return;
            var rect = wrap.getBoundingClientRect();
            var cx   = (e.clientX - rect.left) / rect.width  - 0.5;
            var cy   = (e.clientY - rect.top)  / rect.height - 0.5;
            gsap.to(img, { x: cx * 22, y: cy * 14, scale: 1.08, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
        });

        slide.addEventListener('mouseleave', function () {
            gsap.to(img, { x: 0, y: 0, scale: 1.06, duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
        });
    });

    // ── click: expand image → navigate ─────────────────────────────────
    slides.forEach(function (slide) {
        slide.addEventListener('click', function (e) {
            e.preventDefault();
            var href = slide.getAttribute('href');
            if (!href) return;

            var wrap = slide.querySelector('.slide-img-wrap');
            if (!wrap) { window.location.href = href; return; }

            var rect  = wrap.getBoundingClientRect();
            var clone = document.createElement('div');
            clone.style.cssText = [
                'position:fixed',
                'top:'    + rect.top    + 'px',
                'left:'   + rect.left   + 'px',
                'width:'  + rect.width  + 'px',
                'height:' + rect.height + 'px',
                'z-index:9998',
                'border-radius:16px',
                'overflow:hidden',
                'pointer-events:none',
            ].join(';');

            var img = wrap.querySelector('img');
            if (img) {
                var ci = img.cloneNode(true);
                ci.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;transform:scale(1.06);';
                clone.appendChild(ci);
            }
            document.body.appendChild(clone);

            gsap.to(clone, {
                top         : 0,
                left        : 0,
                width       : window.innerWidth,
                height      : window.innerHeight,
                borderRadius: 0,
                duration    : 0.65,
                ease        : 'expandFill',
                onComplete  : function () {
                    sessionStorage.setItem('from-projects', '1');
                    window.location.href = href;
                },
            });
        });
    });

    // ── helpers ─────────────────────────────────────────────────────────
    function pad(n) { return String(n).padStart(2, '0'); }

    function updateUI(index, dir) {
        if (dir !== undefined && numEl) {
            _spinCounter(index, dir);
        } else {
            if (numEl) numEl.textContent = pad(index + 1);
        }
    }

    function _spinCounter(newIndex, dir) {
        gsap.to(numEl, {
            y: dir > 0 ? '-110%' : '110%',
            opacity: 0,
            duration: 0.18,
            ease: 'power2.in',
            onComplete: function () {
                numEl.textContent = pad(newIndex + 1);
                gsap.fromTo(numEl,
                    { y: dir > 0 ? '110%' : '-110%', opacity: 0 },
                    { y: '0%', opacity: 1, duration: 0.26, ease: 'power2.out' }
                );
            }
        });
    }
})();
