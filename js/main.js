/**
 * Tashra Humayra Chowdhury - Personal Portfolio
 * Modern, lightweight Vanilla ES6 JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const statNumbers = document.querySelectorAll('.stat-val');
  const projectModal = document.getElementById('project-modal');
  const contactModal = document.getElementById('contact-modal');
  const contactForm = document.getElementById('contact-form');

  // 2. Mobile Menu Toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a navigation item is clicked
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          menuToggle.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // 3. Navbar scroll elevation
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 4. Active section link on scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // 5. Fade Up Reveal Animations
  const revealElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 6. Number Counter Animation for Competitive Programming Stats
  let statsCounted = false;
  const cpSection = document.getElementById('cp');

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const targetStr = counter.getAttribute('data-target');
      if (!targetStr) return;

      const hasPlus = targetStr.includes('+');
      const target = parseInt(targetStr.replace('+', ''), 10);
      const duration = 1500;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target + (hasPlus ? '+' : '');
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
      }, stepTime);
    });
  };

  if (cpSection) {
    const cpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          animateCounters();
        }
      });
    }, { threshold: 0.25 });
    cpObserver.observe(cpSection);
  }

  // 7. Modals helper
  const openModal = (modal) => {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Close modals on clicking overlay or close button
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.modal-close')) {
        closeModal(modal);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) closeModal(activeModal);
    }
  });

  // Project Modal Trigger
  const viewProjectBtn = document.getElementById('view-project-btn');
  if (viewProjectBtn && projectModal) {
    viewProjectBtn.addEventListener('click', () => {
      openModal(projectModal);
    });
  }

  // 8. Contact Form Handling (Respectful client-side handling without fake backend)
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        alert('Please fill out all fields before submitting.');
        return;
      }

      // Display clean status in contact modal
      const modalSenderName = document.getElementById('modal-sender-name');
      if (modalSenderName) {
        modalSenderName.textContent = name;
      }

      if (contactModal) {
        openModal(contactModal);
      }

      contactForm.reset();
    });
  }
});
