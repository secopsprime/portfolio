/* ============================================
   John Recker Portfolio - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTypingAnimations();
  initScrollReveal();
  initFilterTags();
  initSearchFilter();
  initCopyButtons();
  initContactForm();
  setCurrentYear();
});


document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("certModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close-modal");

    document.querySelectorAll(".cert-image").forEach(img => {

        img.addEventListener("click", () => {

            modal.classList.add("active");
            modalImage.src = img.src;

        });

    });

    closeModal.addEventListener("click", () => {

        modal.classList.remove("active");

    });

    modal.addEventListener("click", (e) => {

        if(e.target === modal){

            modal.classList.remove("active");

        }

    });

    document.addEventListener("keydown", (e) => {

        if(e.key === "Escape"){

            modal.classList.remove("active");

        }

    });

});


/* ----------- Mobile Menu ----------- */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const isOpen = nav.classList.contains('open');
    toggle.innerHTML = isOpen ? '✕' : '☰';
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click (mobile)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('open');
        toggle.innerHTML = '☰';
      }
    });
  });
}

/* ----------- Typing Animations ----------- */
function initTypingAnimations() {
  const typingElements = document.querySelectorAll('[data-typing]');

  typingElements.forEach((el, index) => {
    const text = el.getAttribute('data-typing');
    const speed = parseInt(el.getAttribute('data-typing-speed')) || 35;
    const delay = parseInt(el.getAttribute('data-typing-delay')) || (index * 400);
    const showCursor = el.getAttribute('data-typing-cursor') !== 'false';

    el.textContent = '';
    el.style.minHeight = '1em';

    setTimeout(() => {
      typeText(el, text, speed, showCursor);
    }, delay);
  });
}

function typeText(el, text, speed, showCursor) {
  let i = 0;
  let cursor;

  if (showCursor) {
    cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    el.appendChild(cursor);
  }

  const interval = setInterval(() => {
    if (i < text.length) {
      const char = document.createTextNode(text.charAt(i));
      if (cursor) {
        el.insertBefore(char, cursor);
      } else {
        el.appendChild(char);
      }
      i++;
    } else {
      clearInterval(interval);
      // Remove cursor after delay if specified
      if (cursor && el.getAttribute('data-typing-cursor-stay') === 'false') {
        setTimeout(() => cursor.remove(), 2000);
      }
    }
  }, speed);
}

/* ----------- Terminal sequence animation (home hero terminal) ----------- */
function initTerminalSequence() {
  const seq = document.getElementById('terminal-sequence');
  if (!seq) return;

  const lines = Array.from(seq.querySelectorAll('.terminal-line'));
  lines.forEach(line => {
    line.style.opacity = '0';
  });

  let delay = 600;
  lines.forEach((line, i) => {
    setTimeout(() => {
      line.style.transition = 'opacity 0.3s ease';
      line.style.opacity = '1';
    }, delay);
    delay += parseInt(line.getAttribute('data-delay')) || 500;
  });
}

/* ----------- Scroll Reveal ----------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Mark body as JS-ready so reveal hidden state applies
  document.body.classList.add('js-ready');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 100px 0px' });

  elements.forEach(el => observer.observe(el));

  // Safety net: if for any reason elements aren't revealed after 4s, show them
  setTimeout(() => {
    elements.forEach(el => el.classList.add('visible'));
  }, 4000);
}

/* ----------- Project Filter Tags ----------- */
function initFilterTags() {
  const tags = document.querySelectorAll('.filter-tag');
  const cards = document.querySelectorAll('[data-project-tags]');

  if (!tags.length || !cards.length) return;

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.getAttribute('data-filter');
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  const cards = document.querySelectorAll('[data-project-tags]');
  const searchInput = document.querySelector('.search-box input');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

  cards.forEach(card => {
    const tags = (card.getAttribute('data-project-tags') || '').toLowerCase();
    const title = (card.querySelector('.project-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.project-desc')?.textContent || '').toLowerCase();

    const matchesFilter = filter === 'all' || tags.includes(filter.toLowerCase());
    const matchesSearch = !searchTerm || title.includes(searchTerm) || desc.includes(searchTerm) || tags.includes(searchTerm);

    card.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
  });
}

/* ----------- Search Filter ----------- */
function initSearchFilter() {
  const input = document.querySelector('.search-box input');
  if (!input) return;

  input.addEventListener('input', () => {
    const activeTag = document.querySelector('.filter-tag.active');
    const filter = activeTag ? activeTag.getAttribute('data-filter') : 'all';
    filterProjects(filter);
  });
}

/* ----------- Copy Buttons ----------- */
function initCopyButtons() {
  const buttons = document.querySelectorAll('.copy-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const target = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(target);
        const original = btn.innerHTML;
        btn.innerHTML = '✓';
        btn.style.color = 'var(--green-primary)';
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.color = '';
        }, 1500);
      } catch (e) {
        console.error('Copy failed:', e);
      }
    });
  });
}

/* ----------- Contact Form ----------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value;

    // Open default mail client with prefilled message
    const mailto = `mailto:johnrecker0@protonmail.com?subject=${encodeURIComponent(subject || 'Contact from portfolio')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;
  });
}

/* ----------- Current year in footer ----------- */
function setCurrentYear() {
  const elements = document.querySelectorAll('[data-year]');
  const year = new Date().getFullYear();
  elements.forEach(el => el.textContent = year);
}

/* ------------ Certifications -----------------*/

const certImages = document.querySelectorAll('.cert-image');
const modal = document.getElementById('certModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-modal');

certImages.forEach(img => {
    img.addEventListener('click', () => {
        modal.style.display = 'block';
        modalImg.src = img.src;
    });
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});