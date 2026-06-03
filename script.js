/* ==========================================
   VISHNU KUMAR PHOTOGRAPHY PORTFOLIO SCRIPTS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Page Loader Animation ---
    const loaderBar = document.querySelector('.loader-bar');
    const loader = document.getElementById('loader');
    
    // Simulate initial loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 300);
            }, 300);
        }
        if (loaderBar) loaderBar.style.width = `${progress}%`;
    }, 50);

    // --- 2. Navigation Scroll Effect ---
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on load

    // --- 3. Hero Parallax Effect ---
    const heroImg = document.querySelector('.hero-bg-img');
    const heroSection = document.getElementById('home');
    
    if (heroImg && heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            // Only perform calculation if hero is visible on screen
            if (scrollPos <= heroHeight) {
                const translation = scrollPos * 0.4;
                const scale = 1.05 + (scrollPos / heroHeight) * 0.05;
                heroImg.style.transform = `translate3d(0, ${translation}px, 0) scale(${scale})`;
            }
        });
    }

    // --- 4. Mobile Menu Navigation ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const mobileOverlay = document.getElementById('mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    
    const toggleMenu = () => {
        const isOpen = menuToggleBtn.classList.toggle('open');
        mobileOverlay.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (menuToggleBtn && mobileOverlay) {
        menuToggleBtn.addEventListener('click', toggleMenu);
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Smooth close when clicking a link
                if (menuToggleBtn.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- 7. Scroll-Triggered Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            threshold: 0.12, // Element is 12% visible before triggering
            rootMargin: '0px 0px -50px 0px' // Adjust trigger offset slightly
        });
        
        revealElements.forEach(elem => revealObserver.observe(elem));
    } else {
        // Fallback for older browsers
        revealElements.forEach(elem => elem.classList.add('active'));
    }

    // --- 8. Contact Form Validation & Submission ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast-success-icon">✓</span>
            <span class="toast-msg">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger show animation
        setTimeout(() => toast.classList.add('show'), 50);
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    };

    const validateField = (field, errorElId, validationFn) => {
        const isValid = validationFn(field.value.trim());
        const formGroup = field.closest('.form-group');
        
        if (isValid) {
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
        }
        
        return isValid;
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameField = document.getElementById('contact-name');
            const emailField = document.getElementById('contact-email');
            const subjectField = document.getElementById('contact-subject');
            const messageField = document.getElementById('contact-message');
            
            // Validators
            const isNameValid = validateField(nameField, 'error-name', val => val.length > 0);
            const isEmailValid = validateField(emailField, 'error-email', val => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(val);
            });
            const isSubjectValid = validateField(subjectField, 'error-subject', val => val.length > 0);
            const isMessageValid = validateField(messageField, 'error-message', val => val.length > 0);
            
            if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                // Form is valid - enter loading state
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                const formData = new FormData(contactForm);
                const urlEncodedData = new URLSearchParams(formData);
                const scriptURL = 'https://script.google.com/macros/s/AKfycbyga1IE1K-SRkHBT0m7im6vmnRJiHpKwPNSfovqLPWHpaCV-hdztdqTAVfx4rIGFD_zhA/exec';

                fetch(scriptURL, { method: 'POST', body: urlEncodedData })
                    .then(response => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                        
                        // Reset Form fields & display notification
                        contactForm.reset();
                        document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));
                        
                        showToast("Message received! I'll get back to you shortly.");
                    })
                    .catch(error => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                        showToast("Oops! Something went wrong. Please try again.");
                        console.error('Error!', error.message);
                    });
            }
        });

        // Add keyup/blur dynamic cleanup of errors
        const setupRealtimeValidation = (field, validationFn) => {
            ['blur', 'input'].forEach(evt => {
                field.addEventListener(evt, () => {
                    const formGroup = field.closest('.form-group');
                    if (formGroup.classList.contains('invalid')) {
                        validateField(field, null, validationFn);
                    }
                });
            });
        };

        setupRealtimeValidation(document.getElementById('contact-name'), val => val.length > 0);
        setupRealtimeValidation(document.getElementById('contact-email'), val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
        setupRealtimeValidation(document.getElementById('contact-subject'), val => val.length > 0);
        setupRealtimeValidation(document.getElementById('contact-message'), val => val.length > 0);
    }

    // --- 9. About Section Photo Carousel ---
    const carouselPhotos = [
        'images/photo1.jpg',
        'images/photo2.jpg',
        'images/photo3.jpg',
        'images/photo4.jpg'
    ];

    const carouselImg  = document.getElementById('about-carousel-img');
    const carouselFade = document.getElementById('carousel-fade');
    const prevBtn      = document.getElementById('about-prev');
    const nextBtn      = document.getElementById('about-next');
    const dots         = document.querySelectorAll('.carousel-dot');
    let carouselIndex  = 0;

    const goToPhoto = (index) => {
        if (!carouselImg || !carouselFade) return;
        
        // Add fading transition class
        carouselFade.classList.add('fading');
        
        setTimeout(() => {
            // Set the onload handler before assigning the source to avoid race conditions!
            carouselImg.onload = () => {
                carouselFade.classList.remove('fading');
            };
            
            carouselImg.src = carouselPhotos[index];
            
            // Fallback for cached images where onload might not trigger
            if (carouselImg.complete) {
                carouselFade.classList.remove('fading');
            }
        }, 220);
        
        // Update dots styling
        dots.forEach(d => d.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
        
        carouselIndex = index;
    };

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            goToPhoto((carouselIndex - 1 + carouselPhotos.length) % carouselPhotos.length);
        });
        nextBtn.addEventListener('click', () => {
            goToPhoto((carouselIndex + 1) % carouselPhotos.length);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'));
            if (idx !== carouselIndex) goToPhoto(idx);
        });
    });

    // --- Drag & Swipe Gesture Support ---
    const imgFrame = document.querySelector('.about-img-frame');
    if (imgFrame) {
        let dragStartX = 0;
        let isDragging = false;

        const handleDragStart = (x) => {
            dragStartX = x;
            isDragging = true;
        };

        const handleDragEnd = (x) => {
            if (!isDragging) return;
            isDragging = false;
            
            const diffX = x - dragStartX;
            const threshold = 50; // swipe threshold in pixels
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swiped Right -> Previous image
                    goToPhoto((carouselIndex - 1 + carouselPhotos.length) % carouselPhotos.length);
                } else {
                    // Swiped Left -> Next image
                    goToPhoto((carouselIndex + 1) % carouselPhotos.length);
                }
            }
        };

        // Touch event support
        imgFrame.addEventListener('touchstart', (e) => {
            handleDragStart(e.touches[0].clientX);
        }, { passive: true });

        imgFrame.addEventListener('touchend', (e) => {
            handleDragEnd(e.changedTouches[0].clientX);
        }, { passive: true });

        // Mouse event support
        imgFrame.addEventListener('mousedown', (e) => {
            handleDragStart(e.clientX);
            e.preventDefault(); // Prevents default browser image drag preview
        });

        // Event listener on window to handle when the user releases outside the image frame
        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                handleDragEnd(e.clientX);
            }
        });
    }

});
