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

let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.nav__link');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 70;
        let height = sec.offsetHeight;
        let id = sec.getAttribute ('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('.nav__link[href*=' + id + ']').classList.add('active');
            });
        };
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