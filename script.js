document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
  let isMenuOpen = false;

  if (menuButton && mobileMenu) {
    const toggleMenu = () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('active');
      menuButton.setAttribute('aria-expanded', isMenuOpen);

      if (isMenuOpen) {
        document.addEventListener('keydown', trapFocus);
        mobileMenu.focus(); // Set focus to menu on open
      } else {
        document.removeEventListener('keydown', trapFocus);
        menuButton.focus(); // Return focus to button on close
      }
    };

    menuButton.addEventListener('click', toggleMenu);

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu();
      }
    });

    // Trap focus within the mobile menu
    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        const focusableElements = mobileMenu.querySelectorAll('a[href], button, input, select, textarea');
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Close menu when a link is clicked
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMenu();
            }
        });
    });
  }

  // Smooth Scroll & Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');

  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevButton = testimonialSlider.querySelector('.slider-prev');
    const nextButton = testimonialSlider.querySelector('.slider-next');
    let currentSlide = 0;
    let autoSlideInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      });
    }

    showSlide(currentSlide);
    startAutoSlide();

    // Pause on hover
    testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
    testimonialSlider.addEventListener('mouseleave', startAutoSlide);
  }


  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current item
      item.classList.toggle('open', !isOpen);
      content.setAttribute('aria-hidden', isOpen);
    });
  });

  // Email Capture Validation
  const emailForm = document.querySelector('#email-capture-form');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Simulate submission
      console.log('Email submitted:', email);
      emailInput.value = ''; // Clear the input
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA Click Logging (Stub)
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const utmParams = getUtmParams(); // Implement this function
      console.log('CTA Clicked. UTM Parameters:', utmParams, 'Link:', button.href);
      // In a real application, you'd send this data to your analytics service
    });
  });

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }
});