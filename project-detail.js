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
    const projectData = {
        santos: {
            title: "Santos Portrait Session",
            category: "Portrait / Lifestyle",
            description: "An editorial portrait session featuring natural expressions, rich sunset golden-hour lighting, and authentic lifestyle concepts.",
            location: "NJ Outdoor & Studio Session",
            camera: "Sony A7R V",
            lens: "FE 85mm f/1.4 GM",
            exif: "85mm · f/1.8 · 1/250s · ISO 100",
            images: [
                "IMG_6250-Edit.jpg", "IMG_6262-Edit.jpg", "IMG_6267-Edit.jpg", "IMG_6296-Edit.jpg", 
                "IMG_6300-Edit.jpg", "IMG_6300-Edit-2.jpg", "IMG_6301-Edit.jpg", "IMG_6301-Edit-2.jpg", 
                "IMG_6312.jpg", "IMG_6318-Edit.jpg", "IMG_6318-Edit-2.jpg", "IMG_6392.jpg", 
                "IMG_6415-Edit.jpg", "IMG_6447-Edit.jpg", "IMG_6466-Edit.jpg", "IMG_6482-Edit.jpg", 
                "IMG_6489-Edit.jpg", "IMG_6500-Recovered.jpg", "IMG_6516-Edit.jpg", "IMG_6520-Edit.jpg", 
                "IMG_6533-Edit.jpg"
            ]
        },
        graduation: {
            title: "Jade's Graduation",
            category: "Event / Portrait",
            description: "Professional graduation portraits capturing the milestones, achievements, and academic pride on campus.",
            location: "University Campus",
            camera: "Sony A7R V",
            lens: "FE 70-200mm f/2.8 GM II",
            exif: "135mm · f/2.8 · 1/400s · ISO 200",
            images: [
                "IMG_7282-Edit.png", "IMG_7296-Edit.png", "IMG_7318-Edit.png", "IMG_7329-Edit-2.png", 
                "IMG_7341.png", "IMG_7355-Edit.png", "IMG_7400-Edit.png", "IMG_7402-Edit.png", 
                "IMG_7412-Edit.png", "IMG_7416-Edit.png", "IMG_7432-Edit.png", "IMG_7439-Edit.png", 
                "IMG_7440-Edit.png", "IMG_7485-Edit.JPG", "IMG_7563-Edit.jpg", "IMG_7594-Edit.jpg", 
                "IMG_7600-Edit-2.png", "IMG_7630-Edit.jpg", "IMG_7634-Edit.JPG", "IMG_7636-Edit.png"
            ]
        },
        headshots: {
            title: "Studio Headshots",
            category: "Corporate / Corporate Portrait",
            description: "High-end corporate and creative client headshots capturing authentic, professional expressions in a controlled home studio environment.",
            location: "Sayreville, NJ",
            camera: "Sony A7R V",
            lens: "FE 85mm f/1.4 GM",
            exif: "85mm · f/4.0 · 1/160s · ISO 100 (Studio Flash)",
            images: [
                "DSC01224-Edit-3.png", "DSC01252-Edit.png", "DSC01291-Edit.png", "DSC01319-Edit.png", 
                "DSC01347-Edit.png", "DSC01366-Edit.png", "IMG_6731-Edit.jpg", "IMG_6732-Edit.jpg", 
                "IMG_6734-Edit.jpg", "IMG_6735-Edit.jpg"
            ]
        },
        birthdays: {
            title: "Birthday & Celebrations",
            category: "Event / Lifestyle",
            description: "Preserving genuine connections, toasts, and details of intimate birthday events and milestone celebrations.",
            location: "Private Venues",
            camera: "Sony A7R V",
            lens: "FE 24-70mm f/2.8 GM II",
            exif: "35mm · f/2.8 · 1/125s · ISO 1250",
            images: [
                "IMG_5817-Edit.jpg", "IMG_5842-Edit.jpg", "IMG_5844-Edit-2.jpg", "IMG_5854-Edit.jpg", 
                "IMG_5858-Edit.jpg", "IMG_5867-Edit.jpg", "IMG_5868-Edit.jpg", "IMG_5869-Edit.jpg", 
                "IMG_5353-Edit.jpg", "IMG_5357-Edit.jpg", "IMG_5383-Edit.jpg", "IMG_5420-Edit.jpg", 
                "IMG_5434-Edit.jpg", "IMG_5436-Edit.jpg", "IMG_5440-Edit.jpg", "IMG_5455-Edit.jpg", 
                "IMG_5554-Edit.jpg", "IMG_5560-Edit.jpg", "IMG_5577-Edit.jpg", "IMG_5588-Edit.jpg", 
                "IMG_5610.jpg", "IMG_5616-Edit.jpg"
            ]
        },
        creative: {
            title: "Creative Concept Session",
            category: "Artistic Portraiture",
            description: "Conceptual and portrait photography focusing on artistic direction, controlled mood lighting, shadows, and styling.",
            location: "Studio Session",
            camera: "Sony A7R V",
            lens: "FE 50mm f/1.2 GM",
            exif: "50mm · f/1.2 · 1/200s · ISO 100",
            images: [
                "IMG_5179-Edit.jpg", "IMG_5224-Edit.jpg", "IMG_5256-Edit.jpg", "IMG_5261-Edit.jpg"
            ]
        }
    };

    // --- 3. Dynamic Page Rendering ---
    const urlParams = new URLSearchParams(window.location.search);
    const projKey = urlParams.get('project') || 'santos';
    const project = projectData[projKey];

    if (!project) {
        // Fallback to santos if project key invalid
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
        
        const path = `images/work/${projKey}/${imgFilename}`;
        
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
                        <span class="view-icon">+</span>
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
        const path = `images/work/${projKey}/${imgFilename}`;
        
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
