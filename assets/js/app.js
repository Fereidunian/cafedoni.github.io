/* ==========================================
   CAFE DOONI - Main Application JavaScript
   ========================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', openMobileMenu);
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', closeMobileMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ==========================================
    // STICKY HEADER
    // ==========================================
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // DROPDOWN FILTERS
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Toggle current dropdown
            const dropdown = this.nextElementSibling;
            const isActive = dropdown.classList.contains('active');
            
            // Close all dropdowns
            document.querySelectorAll('.filter-dropdown').forEach(d => {
                d.classList.remove('active');
            });
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Open clicked dropdown if it wasn't active
            if (!isActive) {
                dropdown.classList.add('active');
                this.classList.add('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.classList.remove('active');
        });
    });

    // Prevent dropdown from closing when clicking inside
    document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // ==========================================
    // SEARCH FORM HANDLER
    // ==========================================
    const searchForm = document.getElementById('searchForm');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const searchName = document.getElementById('searchName').value;
            const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
                .map(cb => cb.value);
            const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
                .map(cb => cb.value);
            const selectedFacilities = Array.from(document.querySelectorAll('input[name="facilities"]:checked'))
                .map(cb => cb.value);

            console.log('Search Parameters:', {
                name: searchName,
                types: selectedTypes,
                locations: selectedLocations,
                facilities: selectedFacilities
            });

            // Here you would typically filter the cafes
            // For now, we'll just show an alert
            alert('جستجو با موفقیت انجام شد! نتایج در کنسول مشاهده کنید.');
        });
    }

    // ==========================================
    // NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(newsletterForm);
            const name = formData.get('name') || this.querySelector('input[type="text"]').value;
            const phone = formData.get('phone') || this.querySelector('input[type="tel"]').value;

            console.log('Newsletter Subscription:', { name, phone });

            // Show success message
            alert('✓ عضویت شما با موفقیت انجام شد!');
            newsletterForm.reset();
        });
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================
    // LAZY LOADING IMAGES
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // ANIMATIONS ON SCROLL
    // ==========================================
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.cafe-card, .blog-card, .category-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation styles
    document.querySelectorAll('.cafe-card, .blog-card, .category-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // ==========================================
    // CONSOLE MESSAGE
    // ==========================================
    console.log('%c🎉 Welcome to Cafe Dooni!', 'font-size: 20px; color: #003046; font-weight: bold;');
    console.log('%c☕ Developed with ❤️', 'font-size: 14px; color: #EABE12;');
});