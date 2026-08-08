/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hide'), 1100);
});

/* ---------- Scroll progress + active nav ---------- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = pct + '%';
});

const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section[id]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      navLinks.forEach(l => l.classList.toggle('active', l.dataset.target === e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Typing animation ---------- */
const phrases = ["Java · Spring Boot · React · MySQL", "REST APIs with JWT security", "From database schema to pixel-perfect UI"];
const typingEl = document.getElementById('typing');
let pIndex = 0, cIndex = 0, deleting = false;
function typeLoop(){
  const current = phrases[pIndex];
  if(!deleting){
    cIndex++;
    typingEl.innerHTML = current.slice(0,cIndex) + '<span class="cursor"></span>';
    if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    cIndex--;
    typingEl.innerHTML = current.slice(0,cIndex) + '<span class="cursor"></span>';
    if(cIndex === 0){ deleting = false; pIndex = (pIndex+1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 28 : 55);
}
typeLoop();

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll('[data-count]');
const decimals = document.querySelectorAll('[data-decimal]');
function animateCount(el){
  const target = parseInt(el.dataset.count, 10);
  let cur = 0;
  const step = Math.max(1, Math.round(target/40));
  const t = setInterval(() => {
    cur += step;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur;
  }, 30);
}
function animateDecimal(el){
  const target = parseFloat(el.dataset.decimal);
  let cur = 0;
  const t = setInterval(() => {
    cur += target/40;
    if(cur >= target){ cur = target; clearInterval(t); }
    el.textContent = cur.toFixed(1);
  }, 30);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      counters.forEach(animateCount);
      decimals.forEach(animateDecimal);
      statObserver.disconnect();
    }
  });
}, { threshold: 0.5 });
statObserver.observe(document.querySelector('.hero-stats'));

/* ---------- Hero 3D tilt (mouse-follow) ---------- */
const heroName = document.getElementById('heroName');
const heroSection = document.getElementById('hero');
heroSection.addEventListener('mousemove', (e) => {
  const r = heroSection.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  heroName.style.transform = `rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
});
heroSection.addEventListener('mouseleave', () => { heroName.style.transform = 'rotateY(0) rotateX(0)'; });

/* ---------- Skills data + circular meters ---------- */
const skillData = {
  programming: [["Java",90],["JavaScript",78],["SQL",82],["Python",70]],
  frontend: [["React.js",78],["HTML5",92],["CSS3",88]],
  backend: [["Spring Boot",85],["Spring MVC",80],["Spring Security",76],["REST APIs",88],["JWT",80],["Hibernate",78],["JPA",78]],
  database: [["MySQL",85]],
  tools: [["Git",88],["Postman",84],["Maven",76],["Eclipse",80],["IntelliJ IDEA",84],["VS Code",90],["Cloudinary",72]]
};
const R = 22, C = 2*Math.PI*R;
function meterSVG(pct){
  return `<div class="meter"><svg width="56" height="56" viewBox="0 0 56 56">
    <circle class="track" cx="28" cy="28" r="${R}"></circle>
    <circle class="fill" cx="28" cy="28" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-target="${C - (pct/100)*C}"></circle>
  </svg><div class="meter-pct">${pct}%</div></div>`;
}
function renderSkillPanel(key){
  const panel = document.querySelector(`.skill-panel[data-panel="${key}"] .skill-orbit`);
  if(panel.dataset.rendered) return;
  panel.dataset.rendered = '1';
  skillData[key].forEach(([name, pct], i) => {
    const chip = document.createElement('div');
    chip.className = 'chip-3d';
    chip.innerHTML = meterSVG(pct) + `<div class="chip-label">${name}</div>`;
    chip.style.animationDelay = (i*70)+'ms';
    panel.appendChild(chip);
    requestAnimationFrame(() => {
      chip.classList.add('show');
      const fill = chip.querySelector('.fill');
      setTimeout(() => { fill.style.strokeDashoffset = fill.dataset.target; }, 120);
    });
  });
}
document.querySelectorAll('.skill-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const key = tab.dataset.skill;
    document.querySelector(`.skill-panel[data-panel="${key}"]`).classList.add('active');
    renderSkillPanel(key);
  });
});
renderSkillPanel('programming');

/* ---------- Tech marquee ---------- */
const techList = ["React.js","Spring Boot","Java","MySQL","JWT","Hibernate","JPA","Cloudinary","REST APIs","Spring Security"];
const marquee = document.getElementById('techMarquee');
[...techList, ...techList].forEach(t => {
  const el = document.createElement('div');
  el.className = 'marquee-item';
  el.textContent = t;
  marquee.appendChild(el);
});

/* ---------- DealHunts feature cards ---------- */
const features = [
  { icon:'CORE', title:'Full-Stack Platform', desc:'Built with React.js, Spring Boot, Java and MySQL end to end.' },
  { icon:'API', title:'REST API Layer', desc:'Designed & implemented REST APIs for product, vendor, inventory, category and brand management.' },
  { icon:'DATA', title:'Persistence Layer', desc:'Integrated JPA/Hibernate ORM with MySQL for efficient database operations.' },
  { icon:'AUTH', title:'Secure Access', desc:'JWT-based authentication with role-based authorization for admins, vendors and users.' },
  { icon:'MEDIA', title:'Media Pipeline', desc:'Cloudinary integration for optimized product image upload, storage and retrieval.' },
  { icon:'UI', title:'Role Dashboards', desc:'Scalable Admin, Vendor and User dashboards tailored to each role.' }
];
const featureGrid = document.getElementById('featureGrid');
features.forEach(f => {
  const card = document.createElement('div');
  card.className = 'feature-card';
  card.innerHTML = `<div class="fc-icon">${f.icon}</div><div class="fc-title">${f.title}</div><div class="fc-desc">${f.desc}</div><div class="fc-toggle">+ expand</div>`;
  card.addEventListener('click', () => card.classList.toggle('open'));
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)/r.width - 0.5;
    const y = (e.clientY - r.top)/r.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = 'none'; });
  featureGrid.appendChild(card);
});

/* ---------- Architecture blueprint (clickable expandable layers) ---------- */
const archLayers = [
  { name:'React.js — UI Layer', detail:'Component-driven storefront, comparison views and role dashboards.' },
  { name:'Spring Boot — REST API', detail:'Controllers and services exposing product, vendor and order endpoints.' },
  { name:'Spring Security + JWT', detail:'Token-based auth with role-based route protection for admin/vendor/user.' },
  { name:'JPA / Hibernate', detail:'ORM layer mapping entities to relational tables with transaction management.' },
  { name:'MySQL', detail:'Relational store for products, vendors, orders and inventory.' },
  { name:'Cloudinary', detail:'Image upload, optimization and CDN delivery for product media.' }
];
const archFlow = document.getElementById('archFlow');
archLayers.forEach((layer, i) => {
  if(i > 0){
    const conn = document.createElement('div');
    conn.className = 'arch-connector';
    archFlow.appendChild(conn);
  }
  const node = document.createElement('div');
  node.className = 'arch-node';
  node.textContent = layer.name;
  node.addEventListener('click', () => node.classList.toggle('open'));
  archFlow.appendChild(node);
  const detail = document.createElement('div');
  detail.className = 'arch-node-detail';
  detail.textContent = layer.detail;
  archFlow.appendChild(detail);
});

/* ---------- Button ripple ---------- */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e){
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - r.left) + 'px';
    ripple.style.top = (e.clientY - r.top) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ---------- Contact form validation + EmailJS ---------- */

const contactForm = document.getElementById('contactForm');

if(contactForm){

contactForm.addEventListener('submit', (e) => {

  e.preventDefault();

  const form = e.target;

  const nameField = form.querySelector('[data-field="name"]');
  const emailField = form.querySelector('[data-field="email"]');
  const msgField = form.querySelector('[data-field="message"]');

  let valid = true;


  // clear previous errors
  [nameField, emailField, msgField].forEach(field => {

    field.classList.remove('invalid');

    const error = field.querySelector('.field-err');

    if(error){
      error.textContent = '';
    }

  });


  const name = nameField.querySelector('input').value.trim();
  const email = emailField.querySelector('input').value.trim();
  const message = msgField.querySelector('textarea').value.trim();



  // validation

  if(!name){

    nameField.classList.add('invalid');

    nameField.querySelector('.field-err').textContent =
      "Please enter your name.";

    valid = false;

  }


  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){


    emailField.classList.add('invalid');


    emailField.querySelector('.field-err').textContent =
      "Please enter a valid email.";

    valid = false;

  }



  if(!message){

    msgField.classList.add('invalid');

    msgField.querySelector('.field-err').textContent =
      "Please add a short message.";

    valid = false;

  }

  const formMsg = document.getElementById('formMsg');


if(!valid){

    formMsg.textContent = "";

    return;

}


// EmailJS sending

const templateParams = {

    name: name,
    email: email,
    message: message

};


emailjs.send(
    "service_nesfbza",     
    "template_6928alm",    
    templateParams
)

.then(() => {

    formMsg.textContent = 
    "Message sent successfully";

    form.reset();

})


.catch((error) => {

    console.log(error);

    formMsg.textContent =
    "Failed to send message ❌";

});


});
}
