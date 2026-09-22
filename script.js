// 1. Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// 2. Markdown Reader Logic (FIXED PARSER)
async function loadPost(filePath) {
  const blogList = document.getElementById('blog-list');
  const blogReader = document.getElementById('blog-reader');
  const postContent = document.getElementById('post-content');

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('Could not fetch markdown post.');
    
    const markdownText = await response.text();
    
    // Parse raw markdown string into formatted HTML
    if (typeof marked.parse === 'function') {
      postContent.innerHTML = marked.parse(markdownText);
    } else if (typeof marked === 'function') {
      postContent.innerHTML = marked(markdownText);
    } else {
      postContent.innerHTML = markdownText;
    }
    
    blogList.classList.add('hidden');
    blogReader.classList.remove('hidden');
    blogReader.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    postContent.innerHTML = `<p style="color:#ef4444;">Error loading post: ${error.message}</p>`;
    blogList.classList.add('hidden');
    blogReader.classList.remove('hidden');
  }
}

function closePost() {
  document.getElementById('blog-list').classList.remove('hidden');
  document.getElementById('blog-reader').classList.add('hidden');
}

// 3. Interactive 3D Tilt Effect on Cards
const tiltElements = document.querySelectorAll('.project-card, .blog-card, .skill-card');

tiltElements.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

// 4. Scroll Reveal Animations
const revealElements = document.querySelectorAll('section');
revealElements.forEach(sec => sec.classList.add('reveal'));

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  revealElements.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < triggerBottom) {
      el.classList.add('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// 5. Dynamic Background Particle System
const canvas = document.createElement('canvas');
canvas.id = 'particles-canvas';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
let particles = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const mouse = { x: null, y: null, radius: 120 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.6;
    this.vy = (Math.random() - 0.5) * 0.6;
  }

  draw() {
    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 3;
        this.y -= (dy / distance) * force * 3;
      }
    }
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();