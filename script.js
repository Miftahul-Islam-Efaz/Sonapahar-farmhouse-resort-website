document.addEventListener('DOMContentLoaded', () => {

  // --- 1. FIXED PILL NAVBAR — subtle glass tint shift on scroll ---
  const header = document.getElementById('mainHeader');
  const heroScrollWrapper = document.getElementById('heroScrollWrapper');
  
  function handleScroll() {
    // Slide navbar up to top only when scrolled past the hero section
    const heroHeight = window.innerHeight * 0.75;
    if (window.scrollY > heroHeight) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Smooth scroll parallax text fade & slide for hero content
    if (heroScrollWrapper) {
      const scrollPos = window.scrollY;
      const opacity = Math.max(0, 1 - scrollPos / 550);
      const translateY = scrollPos * 0.35;
      heroScrollWrapper.style.opacity = opacity;
      heroScrollWrapper.style.transform = `translateY(${translateY}px)`;
    }
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Trigger once on load



  // --- 2. MOBILE MENU NAVIGATION ---
  const menuToggle = document.getElementById('menuToggleBtn');
  const navMenu = document.getElementById('navMenu');
  
  menuToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
  });

  // Close menu when clicking a navigation link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });


  // --- 3. REVEAL ANIMATIONS ON SCROLL ---
  const reveals = document.querySelectorAll('.reveal');
  
  function revealElements() {
    const windowHeight = window.innerHeight;
    reveals.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const revealPoint = 100; // Offset before reveal triggering
      
      if (elementTop < windowHeight - revealPoint) {
        element.addActive = setTimeout(() => {
          element.classList.add('active');
        }, 100);
      }
    });
  }
  
  window.addEventListener('scroll', revealElements);
  revealElements(); // Run once at launch


  // --- 4. VILLA SELECTOR TABS ---
  const tabButtons = document.querySelectorAll('.villas-tab-btn');
  const villaPanels = document.querySelectorAll('.villa-panel');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Deactivate current tabs and panels
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      villaPanels.forEach(panel => panel.classList.remove('active'));
      
      // Activate clicked tab and panel
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      const panelId = button.getAttribute('aria-controls');
      document.getElementById(panelId).classList.add('active');
    });
  });


  // --- 5. INTERACTIVE LIVE BOOKING CALCULATOR ---
  const checkInInput = document.getElementById('checkInDate');
  const checkOutInput = document.getElementById('checkOutDate');
  const villaSelect = document.getElementById('villaSelect');
  const guestCount = document.getElementById('guestCount');
  
  // Receipt elements
  const receiptVillaName = document.getElementById('receiptVillaName');
  const receiptVillaRate = document.getElementById('receiptVillaRate');
  const receiptNights = document.getElementById('receiptNights');
  const receiptGuests = document.getElementById('receiptGuests');
  const receiptTax = document.getElementById('receiptTax');
  const receiptTotal = document.getElementById('receiptTotal');
  
  // Set default dates (Today and Tomorrow)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Format dates for input (YYYY-MM-DD)
  const formatDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  checkInInput.value = formatDateString(today);
  checkOutInput.value = formatDateString(tomorrow);
  
  // Minimum date bounds
  checkInInput.min = formatDateString(today);
  checkOutInput.min = formatDateString(tomorrow);

  function calculateBooking() {
    const checkInDate = new Date(checkInInput.value);
    let checkOutDate = new Date(checkOutInput.value);
    
    // Auto-correct check-out if it's before or equal to check-in
    if (checkOutDate <= checkInDate) {
      checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkOutDate.getDate() + 1);
      checkOutInput.value = formatDateString(checkOutDate);
    }
    
    // Calculate nights
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Get villa pricing info
    const selectedOption = villaSelect.options[villaSelect.selectedIndex];
    const pricePerNight = parseInt(selectedOption.getAttribute('data-price')) || 12500;
    const villaName = selectedOption.text.split(' — ')[0];
    
    // Run Calculations
    const subtotal = pricePerNight * nights;
    const taxRate = 0.15; // 15% VAT & service charge
    const taxAmount = Math.round(subtotal * taxRate);
    const totalAmount = subtotal + taxAmount;
    
    // Update live receipt display
    receiptVillaName.textContent = villaName;
    receiptVillaRate.textContent = `৳ ${pricePerNight.toLocaleString()}`;
    receiptNights.textContent = `${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
    receiptGuests.textContent = `${guestCount.value} ${parseInt(guestCount.value) === 1 ? 'Guest' : 'Guests'}`;
    receiptTax.textContent = `৳ ${taxAmount.toLocaleString()}`;
    receiptTotal.textContent = `৳ ${totalAmount.toLocaleString()}`;
  }

  // Event Listeners for booking fields
  checkInInput.addEventListener('change', () => {
    // Check-out minimum date must be check-in date + 1 day
    const checkIn = new Date(checkInInput.value);
    const minCheckOut = new Date(checkIn);
    minCheckOut.setDate(minCheckOut.getDate() + 1);
    checkOutInput.min = formatDateString(minCheckOut);
    
    calculateBooking();
  });
  
  checkOutInput.addEventListener('change', calculateBooking);
  villaSelect.addEventListener('change', calculateBooking);
  guestCount.addEventListener('change', calculateBooking);
  
  // Run calculation once at startup
  calculateBooking();


  // --- 6. AUTO-SELECT VILLA & SCROLL TO BOOKING ---
  const bookTriggers = document.querySelectorAll('.book-trigger');
  
  bookTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetVilla = trigger.getAttribute('data-villa');
      
      // Select the matching option in native dropdown
      for (let i = 0; i < villaSelect.options.length; i++) {
        if (villaSelect.options[i].text.includes(targetVilla)) {
          villaSelect.selectedIndex = i;
          break;
        }
      }
      
      // Sync the custom dropdown UI
      const villaCustomSelect = document.querySelector('.custom-select[data-target="villaSelect"]');
      if (villaCustomSelect) {
        const customOptions = villaCustomSelect.querySelectorAll('.custom-select-option');
        const valueDisplay = villaCustomSelect.querySelector('.custom-select-value');
        customOptions.forEach(opt => {
          opt.classList.remove('active');
          const optName = opt.querySelector('.option-name');
          if (optName && optName.textContent.includes(targetVilla)) {
            opt.classList.add('active');
            const optPrice = opt.querySelector('.option-price');
            valueDisplay.textContent = `${optName.textContent} — ${optPrice.textContent}`;
          }
        });
      }
      
      // Update receipt calculations
      calculateBooking();
      
      // Smooth scroll to booking section
      const targetSection = document.getElementById('bookingSection');
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });


  // --- 6.5 CUSTOM DROPDOWN INTERACTIONS ---
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(customSelect => {
    const trigger = customSelect.querySelector('.custom-select-trigger');
    const options = customSelect.querySelectorAll('.custom-select-option');
    const valueDisplay = customSelect.querySelector('.custom-select-value');
    const targetId = customSelect.getAttribute('data-target');
    const nativeSelect = document.getElementById(targetId);
    
    // Toggle dropdown open/close
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close all other open dropdowns
      customSelects.forEach(otherSelect => {
        if (otherSelect !== customSelect) {
          otherSelect.classList.remove('open');
        }
      });
      
      customSelect.classList.toggle('open');
    });
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        
        // Update active state visually
        options.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Update display text
        const optionName = option.querySelector('.option-name');
        const optionPrice = option.querySelector('.option-price');
        if (optionName && optionPrice) {
          valueDisplay.textContent = `${optionName.textContent} — ${optionPrice.textContent}`;
        } else {
          valueDisplay.textContent = option.textContent.trim();
        }
        
        // Sync with native select
        nativeSelect.value = value;
        nativeSelect.dispatchEvent(new Event('change'));
        
        // Close dropdown
        customSelect.classList.remove('open');
      });
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    customSelects.forEach(customSelect => {
      customSelect.classList.remove('open');
    });
  });


  // --- 7. BOOKING FORM SUBMISSION & SUCCESS MODAL ---
  const bookingForm = document.getElementById('resortBookingForm');
  const modal = document.getElementById('bookingModal');
  const loader = document.getElementById('bookingLoader');
  const success = document.getElementById('bookingSuccess');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Display Modal with loader
    modal.style.display = 'flex';
    loader.style.display = 'flex';
    success.style.display = 'none';
    
    // Simulate API reservation check (2.5 seconds)
    setTimeout(() => {
      loader.style.display = 'none';
      success.style.display = 'flex';
      bookingForm.reset();
      
      // Reset defaults for dates after form reset
      checkInInput.value = formatDateString(today);
      checkOutInput.value = formatDateString(tomorrow);
      calculateBooking();
    }, 2500);
  });

  // Modal closing functionality
  function closeModal() {
    modal.style.display = 'none';
  }
  
  closeModalBtn.addEventListener('click', closeModal);
  modalOkBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside content area
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });


  // --- 8. IMMERSIVE LIGHTBOX DETAILED VIEW ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  const bentoItems = document.querySelectorAll('.bento-item');
  let currentBentoIndex = 0;

  const bentoData = Array.from(bentoItems).map(item => ({
    src: item.querySelector('img').getAttribute('src'),
    alt: item.querySelector('img').getAttribute('alt'),
    category: item.getAttribute('data-category'),
    title: item.getAttribute('data-title'),
    desc: item.getAttribute('data-desc')
  }));

  function showLightbox(index) {
    if (index < 0) index = bentoData.length - 1;
    if (index >= bentoData.length) index = 0;
    currentBentoIndex = index;

    const data = bentoData[index];

    // Smooth transition
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      lightboxImg.style.opacity = '1';
    }, 150);

    lightboxCategory.textContent = data.category;
    lightboxTitle.textContent = data.title;
    lightboxDesc.textContent = data.desc;

    lightboxModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Stop background scroll
  }

  function closeLightbox() {
    lightboxModal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scroll
  }

  bentoItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showLightbox(index);
    });
  });

  lightboxCloseBtn.addEventListener('click', closeLightbox);

  // Close when clicking background outside container
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Navigation
  lightboxPrevBtn.addEventListener('click', () => {
    showLightbox(currentBentoIndex - 1);
  });

  lightboxNextBtn.addEventListener('click', () => {
    showLightbox(currentBentoIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightboxModal.style.display === 'flex') {
      if (e.key === 'ArrowLeft') {
        showLightbox(currentBentoIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showLightbox(currentBentoIndex + 1);
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    }
  });


  // --- 9. HERO CINEMATIC CAROUSEL (Mini-Preview Carousel) ---
  const previewSlidesInner = document.getElementById('previewSlidesInner');
  const previewLabel = document.getElementById('previewLabel');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const progressBar = document.getElementById('heroProgressBar');

  const slideNames = [
    'AKASH HOUSE',
    'MADHAVILATA',
    'LAKE DECK',
    'GARDEN POOL',
    'WELCOME LOBBY'
  ];

  let currentSlideIndex = 0;
  const totalSlides = slideNames.length;
  const slideDuration = 4500; // 4.5 seconds rotation
  let slideTimer;

  function updateCarousel(newIndex) {
    // Clear existing timer
    clearTimeout(slideTimer);

    // Calculate new index bounds
    if (newIndex < 0) {
      currentSlideIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = newIndex;
    }

    // Slide the track: shift by percentage (each slide occupies 20% of the 500% container)
    if (previewSlidesInner) {
      previewSlidesInner.style.transform = `translateX(-${currentSlideIndex * 20}%)`;
    }

    // Animate preview text transition
    if (previewLabel) {
      previewLabel.style.opacity = '0';
      setTimeout(() => {
        previewLabel.textContent = slideNames[currentSlideIndex];
        previewLabel.style.opacity = '1';
      }, 300);
    }

    // Restart progress bar animation
    resetProgressBar();

    // Start auto-play timer again
    slideTimer = setTimeout(() => {
      updateCarousel(currentSlideIndex + 1);
    }, slideDuration);
  }

  function resetProgressBar() {
    if (progressBar) {
      // Remove animation
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      
      // Force reflow
      progressBar.offsetHeight;

      // Start transition
      progressBar.style.transition = `width ${slideDuration}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  // Navigation button listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateCarousel(currentSlideIndex + 1);
    });
  }

  // Also make clicking the preview image advance the slide
  const previewImageWrapper = document.getElementById('previewImageWrapper');
  if (previewImageWrapper) {
    previewImageWrapper.style.cursor = 'pointer';
    previewImageWrapper.addEventListener('click', () => {
      updateCarousel(currentSlideIndex + 1);
    });
  }

  // Initialize carousel on load
  if (previewSlidesInner) {
    // Add transition utilities to preview label for smooth fade
    if (previewLabel) {
      previewLabel.style.transition = 'opacity 0.3s ease';
      previewLabel.textContent = slideNames[0];
    }

    // Start progress bar and autoplay timer
    resetProgressBar();
    slideTimer = setTimeout(() => {
      updateCarousel(currentSlideIndex + 1);
    }, slideDuration);
  }

});

  document.addEventListener('DOMContentLoaded', () => {
// --- GALLERY RIBBON SCROLL ANIMATION ---
  const ribbonSection = document.getElementById('experienceSection');
  const track1 = document.getElementById('band1-track');
  const track2 = document.getElementById('band2-track');
  const track3 = document.getElementById('band3-track');

  if (ribbonSection && track1 && track2 && track3) {
    function updateRibbonScroll() {
      const rect = ribbonSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress from 0 to 1 as the section scrolls through the viewport
      let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
      
      // Clamp between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      
      // Band 1: 0% to -52%
      const x1 = 0 + progress * (-52 - 0);
      // Band 2: -18% to 22%
      const x3 = 0 + progress * (-40 - 0); // Wait, mapping in reference: Band 2 is -18 to 22, Band 3 is 0 to -40
      const x2 = -18 + progress * (22 - -18);
      
      track1.style.transform = `translateX(${x1}%)`;
      track2.style.transform = `translateX(${x2}%)`;
      track3.style.transform = `translateX(${x3}%)`;
    }

    // Use requestAnimationFrame for smooth updates
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateRibbonScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Initial call
    updateRibbonScroll();
  }

  // --- 11. SHUTTER REVEAL ANIMATION (Word-by-word) ---
  const splitTextElements = document.querySelectorAll('.js-split-text');
  
  splitTextElements.forEach(el => {
    // Save original HTML to handle <br> tags properly
    const htmlLines = el.innerHTML.split('<br>');
    el.innerHTML = '';
    
    let delayCounter = 0;
    const delayStep = 0.015; // 15ms stagger per word (ensures full text reveals within 1.2s)
    
    htmlLines.forEach((line, lineIndex) => {
      // Decode HTML entities if any and get pure text
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = line;
      // Trim to avoid trailing spaces creating empty words
      const text = tempDiv.textContent.trim();
      if (!text) return;

      const words = text.split(' ');
      
      words.forEach((word, wordIndex) => {
        // Outer shutter wrapper (overflow hidden)
        const wordSpan = document.createElement('span');
        wordSpan.className = 'shutter-word';
        
        // Inner content (slides up)
        const innerSpan = document.createElement('span');
        innerSpan.className = 'shutter-inner';
        innerSpan.textContent = word;
        innerSpan.style.transitionDelay = `${delayCounter}s`;
        
        wordSpan.appendChild(innerSpan);
        el.appendChild(wordSpan);
        
        delayCounter += delayStep;
        
        // Add a normal space between words
        if (wordIndex < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });
      
      if (lineIndex < htmlLines.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    });
  });
  
  // Intersection Observer for shutter reveal
  const splitTextObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Play intro animation
        entry.target.classList.add('in-view');
        // Unobserve to only play once as an intro
        splitTextObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });
  
  splitTextElements.forEach(el => splitTextObserver.observe(el));

  // --- 12. SANCTUARY TOGGLE (VERTICAL CAROUSEL) ---
  const sanctuaryToggles = document.querySelectorAll('.sanctuary-toggle .toggle-btn');
  const sanctuaryTrack = document.getElementById('sanctuaryImageTrack');
  
  if (sanctuaryToggles.length > 0 && sanctuaryTrack) {
    sanctuaryToggles.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        sanctuaryToggles.forEach(t => t.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        // Move the image track vertically (each image is 50% of the 200% track height)
        sanctuaryTrack.style.transform = `translateY(-${index * 50}%)`;
      });
    });
  }

});
