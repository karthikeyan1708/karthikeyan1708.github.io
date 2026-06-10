// ══════════════════════════════════════════════
// PARTICLE BACKGROUND
// ══════════════════════════════════════════════
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Mouse interaction
        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
        }
    }
    draw() {
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();
window.addEventListener('resize', initParticles);

function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ══════════════════════════════════════════════
// TYPING EFFECT
// ══════════════════════════════════════════════
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");
const textArray = ["AI Engineer.", "Cybersecurity Analyst.", "ML Researcher.", "Problem Solver."];
const typingDelay = 80;
const erasingDelay = 40;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 800);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});


// ══════════════════════════════════════════════
// SCROLL REVEAL (Intersection Observer)
// ══════════════════════════════════════════════
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Stagger the reveal for sibling elements
            setTimeout(() => {
                entry.target.classList.add("active");
            }, index * 100);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));


// ══════════════════════════════════════════════
// STAT COUNTER ANIMATION
// ══════════════════════════════════════════════
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isFloat = target % 1 !== 0;
                const duration = 1500;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    const current = target * easedProgress;
                    counter.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = isFloat ? target.toFixed(1) : target;
                        if (target === 1.8) counter.textContent = '1.8+';
                        if (target === 2) counter.textContent = '2+';
                    }
                }
                requestAnimationFrame(updateCounter);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) statObserver.observe(aboutStats);


// ══════════════════════════════════════════════
// NAVBAR SCROLL EFFECT
// ══════════════════════════════════════════════
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ══════════════════════════════════════════════
// HAMBURGER MENU
// ══════════════════════════════════════════════
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});


// ══════════════════════════════════════════════
// ACTIVE NAV LINK ON SCROLL
// ══════════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-link');
        }
    });
});
