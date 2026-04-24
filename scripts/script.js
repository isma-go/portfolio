// page transition
let splash = document.querySelector('.splash');
let logo = document.querySelector('.logo-splash');
let logoSpan = document.querySelectorAll('.logo-s');

window.addEventListener('DOMContentLoaded', () => {

  // Coming from the projects slider: skip logo animation, dismiss quickly
  if (sessionStorage.getItem('from-projects')) {
    sessionStorage.removeItem('from-projects');
    if (splash) {
      setTimeout(function () {
        splash.style.transition = 'top 0.4s cubic-bezier(0.76,0,0.24,1)';
        splash.style.top = '-100vh';
      }, 80);
    }
    return;
  }

  setTimeout(() => {

    logoSpan.forEach((span, idx) => {
      setTimeout(() => {
        span.classList.add('active');
      }, (idx + 1) * 200)
    });

    setTimeout(() => {
      logoSpan.forEach((span, idx) => {

        setTimeout(() => {
          span.classList.remove('active');
          span.classList.add('fade');
        }, (idx + 1) * 50)
      })
    },2000);

    setTimeout(() => {
      splash.style.top = '-100vh';
    },1600)
  })
})

// nav logo animation
window.addEventListener('DOMContentLoaded', () => {
  const logoWrapper = document.querySelector('.logo');
  if (!logoWrapper) return;

  const extraLetters = document.querySelectorAll('.logo--font .extra');
  if (!extraLetters.length) return;

  // Set inline-block so width is measurable and animatable
  gsap.set(extraLetters, { display: 'inline-block', overflow: 'hidden' });

  // Measure natural width of each letter, then collapse to 0
  extraLetters.forEach(span => { span.style.width = 'auto'; });
  const widths = Array.from(extraLetters).map(span => span.offsetWidth);
  gsap.set(extraLetters, { width: 0 });

  const expand = () => gsap.to(extraLetters, {
    width: i => widths[i],
    duration: 0.4,
    stagger: 0.03,
    ease: 'power2.out'
  });

  const collapse = () => gsap.to(extraLetters, {
    width: 0,
    duration: 0.25,
    stagger: { each: 0.025, from: 'end' },
    ease: 'power2.in'
  });

  // Landing: trigger after splash finishes sliding away (~2000ms)
  setTimeout(() => {
    const tl = gsap.timeline();
    tl.add(expand())
      .to({}, { duration: 1 })
      .add(collapse());
  }, 2000);

  // Hover
  logoWrapper.addEventListener('mouseenter', () => expand());
  logoWrapper.addEventListener('mouseleave', () => collapse());
});

// pointer

window.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
  
    if (!cursor) return;
  
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });
  
    const interactiveElements = document.querySelectorAll('a, button');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  });

// scroll

let sections = document.querySelectorAll('section[id], footer[id]');
let navLinks = document.querySelectorAll('.nav__link');

window.onscroll = () => {
    let top = window.scrollY;
    let sectionsArray = Array.from(sections);

    sectionsArray.forEach((sec, index) => {
        let offset = sec.offsetTop - 70;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');
        let isLast = index === sectionsArray.length - 1;

        let inSection = isLast ? top >= offset : (top >= offset && top < offset + height);

        if (inSection) {
            navLinks.forEach(links => links.classList.remove('active'));
            let activeLink = document.querySelector('.nav__link[href*=' + id + ']');
            if (activeLink) activeLink.classList.add('active');
        }
    });
};

// // color theme
document.addEventListener("DOMContentLoaded", function () {
  const themes = ['theme--default', 'theme--01', 'theme--02'];
  const body = document.body;
  const toggleBtn = document.getElementById('theme-toggle');

  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && themes.includes(savedTheme)) {
    body.classList.remove(...themes);
    body.classList.add(savedTheme);
  }

  toggleBtn.addEventListener('click', () => {
    const current = themes.find(t => body.classList.contains(t));
    const nextIndex = (themes.indexOf(current) + 1) % themes.length;

    body.classList.remove(...themes);
    const nextTheme = themes[nextIndex];
    body.classList.add(nextTheme);
    localStorage.setItem("theme", nextTheme);
  });
});


// slider
const track = document.querySelector('.slider-track');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.left');
const nextBtn = document.querySelector('.right');
const indicators = document.querySelector('.indicators');
let currentIndex = 0;
let startX = 0;
let isSwiping = false;

// Create indicator dots
slides.forEach((_, index) => {
const dot = document.createElement('button');
dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
});
indicators.appendChild(dot);
});

const updateSlider = () => {
const offset = -currentIndex * 100;
track.style.transform = `translateX(${offset}%)`;
document.querySelectorAll('.indicators button').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
});
};

prevBtn.addEventListener('click', () => {
currentIndex = (currentIndex - 1 + slides.length) % slides.length;
updateSlider();
});

nextBtn.addEventListener('click', () => {
currentIndex = (currentIndex + 1) % slides.length;
updateSlider();
});


// Init
updateSlider();


// image effect
document.querySelectorAll('.hero--fade').forEach(image => {
  const img = image.querySelector('img');

  image.addEventListener('mousemove', (e) => {
    const rect = image.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -4;
    const rotateY = x * 4;

    img.style.transform = `scale(1.005) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    img.style.transition = 'transform 0.2s ease-out';
  });

  image.addEventListener('mouseleave', () => {
    img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
  });
});