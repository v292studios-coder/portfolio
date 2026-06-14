/* ==========================================
   VISHNU KUMAR PORTFOLIO - PROJECT DETAIL SCRIPTS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Page Loader Animation ---
    const loaderBar = document.querySelector('.loader-bar');
    const loader = document.getElementById('loader');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 300);
            }, 200);
        }
        if (loaderBar) loaderBar.style.width = `${progress}%`;
    }, 40);

    // --- 2. Project Database ---
    let project = null;
    let projKey = null;

    // --- 3. Dynamic Page Rendering ---
    const urlParams = new URLSearchParams(window.location.search);
    projKey = urlParams.get('project');

    if (typeof portfolioData !== 'undefined' && projKey) {
        for (const cat in portfolioData) {
            const shoot = portfolioData[cat].find(s => s.id === projKey);
            if (shoot) {
                project = {
                    title: shoot.title,
                    category: shoot.category,
                    description: "A showcase of portrait, event, and creative lifestyle photography projects.",
                    location: "Studio Session",
                    camera: "Sony A7R V",
                    lens: "FE 85mm f/1.4 GM",
                    exif: "85mm · f/1.8 · 1/250s · ISO 100",
                    images: shoot.images
                };
                break;
            }
        }
    }

    if (!project) {
        // Fallback to index if project key invalid
        window.location.href = "index.html";
        return;
    }

    // Set page title & text fields
    document.title = `${project.title} | 292 Studios by Vishnu Kumar`;
    document.getElementById('proj-title').textContent = project.title;
    document.getElementById('proj-category').textContent = project.category;
    document.getElementById('proj-location').textContent = project.location;
    document.getElementById('proj-desc').textContent = project.description;

    // Render Grid items
    const grid = document.getElementById('project-grid');
    project.images.forEach((imgFilename, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal-on-scroll';
        item.setAttribute('data-index', idx);
        
        const path = imgFilename;
        
        item.innerHTML = `
            <div class="gallery-card">
                <img src="${path}" alt="${project.title} - Frame ${idx + 1}" class="gallery-img" loading="lazy">
                <div class="card-overlay">
                    <div class="card-info">
                        <span class="card-category">${project.category}</span>
                        <h3 class="card-title">Frame #${idx + 1}</h3>
                        <p class="card-location">${project.location}</p>
                    </div>
                    <div class="card-action">
                        <span class="view-icon" style="display: flex; align-items: center; justify-content: center;">
                            <svg viewBox="0 0 24 24" style="width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(item);
    });

    // --- 4. Lightbox Modal Integration ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    const lbCat = document.getElementById('lightbox-cat');
    const lbTitle = document.getElementById('lightbox-title');
    const lbLoc = document.getElementById('lightbox-loc');


    let currentPhotoIndex = 0;

    const loadLightboxPhoto = (index) => {
        currentPhotoIndex = index;
        const imgFilename = project.images[index];
        const path = imgFilename;
        
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.98)';
        
        lbCat.textContent = project.category;
        lbTitle.textContent = `${project.title} #${index + 1}`;
        lbLoc.textContent = project.location;

        
        lightboxImg.src = path;
        lightboxImg.alt = `${project.title} - Frame ${index + 1}`;
        
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        };
    };

    const openLightbox = (index) => {
        loadLightboxPhoto(index);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const navigateLightbox = (direction) => {
        let newIdx = currentPhotoIndex;
        if (direction === 'next') {
            newIdx = (currentPhotoIndex + 1) % project.images.length;
        } else {
            newIdx = (currentPhotoIndex - 1 + project.images.length) % project.images.length;
        }
        loadLightboxPhoto(newIdx);
    };

    // Attach Click Events to Grid Cards
    grid.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            const index = parseInt(item.getAttribute('data-index'));
            openLightbox(index);
        }
    });

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
        lightboxNext.addEventListener('click', () => navigateLightbox('next'));
        
        // Close on clicking the backdrop overlay
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox('next');
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
        });

        // Swipe Gestures Support on Lightbox Image
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
            const threshold = 60; // Swipe threshold
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    navigateLightbox('prev');
                } else {
                    navigateLightbox('next');
                }
            }
        };

        lightboxImg.addEventListener('touchstart', (e) => {
            handleDragStart(e.touches[0].clientX);
        }, { passive: true });

        lightboxImg.addEventListener('touchend', (e) => {
            handleDragEnd(e.changedTouches[0].clientX);
        }, { passive: true });

        lightboxImg.addEventListener('mousedown', (e) => {
            handleDragStart(e.clientX);
            e.preventDefault(); // Prevent native dragging ghost image
        });

        window.addEventListener('mouseup', (e) => {
            if (isDragging) {
                handleDragEnd(e.clientX);
            }
        });
    }

    // --- 5. Scroll-Triggered Reveal Animations ---
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal-on-scroll');
        if ('IntersectionObserver' in window && revealElements.length > 0) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            });
            revealElements.forEach(elem => revealObserver.observe(elem));
        } else {
            revealElements.forEach(elem => elem.classList.add('active'));
        }
    }, 400); // Wait for loader animation to finish

});
