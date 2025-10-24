/**
 * Main Application JavaScript
 * Cafe Gardi Tehran
 */

'use strict';

// ==========================================
// Global Variables
// ==========================================

const App = {
    config: {
        apiDelay: 300,
        scrollOffset: 100,
        animationDuration: 300
    },
    
    state: {
        isMenuOpen: false,
        currentPage: 1,
        isLoading: false
    },
    
    elements: {
        header: null,
        mobileMenuToggle: null,
        offCanvasMenu: null,
        offCanvasClose: null,
        offCanvasOverlay: null,
        floatingButton: null
    }
};

// ==========================================
// DOM Ready
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// ==========================================
// Initialize App
// ==========================================

App.init = function() {
    console.log('🚀 Cafe Gardi Tehran - Initialized');
    
    // Cache DOM Elements
    this.cacheElements();
    
    // Initialize Components
    this.initMobileMenu();
    this.initStickyHeader();
    this.initScrollReveal();
    this.initSmoothScroll();
    this.initLazyLoading();
    this.initNewsletterForm();
    this.initBackToTop();
    
    // Load Data
    DataLoader.init();
};

// ==========================================
// Cache DOM Elements
// ==========================================

App.cacheElements = function() {
    this.elements = {
        header: document.getElementById('site-header'),
        mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
        offCanvasMenu: document.getElementById('off-canvas-menu'),
        offCanvasClose: document.getElementById('off-canvas-close'),
        offCanvasOverlay: document.querySelector('.off-canvas-overlay'),
        floatingButton: document.querySelector('.floating-map-button'),
        newsletterForm: document.getElementById('newsletter-form')
    };
};

// ==========================================
// Mobile Menu
// ==========================================

App.initMobileMenu = function() {
    const { mobileMenuToggle, offCanvasMenu, offCanvasClose, offCanvasOverlay } = this.elements;
    
    if (!mobileMenuToggle || !offCanvasMenu) return;
    
    // Open Menu
    mobileMenuToggle.addEventListener('click', () => {
        this.openMobileMenu();
    });
    
    // Close Menu - Close Button
    if (offCanvasClose) {
        offCanvasClose.addEventListener('click', () => {
            this.closeMobileMenu();
        });
    }
    
    // Close Menu - Overlay Click
    if (offCanvasOverlay) {
        offCanvasOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });
    }
    
    // Close Menu - ESC Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.state.isMenuOpen) {
            this.closeMobileMenu();
        }
    });
    
    // Close Menu - On Link Click
    const menuLinks = offCanvasMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            this.closeMobileMenu();
        });
    });
};

App.openMobileMenu = function() {
    const { offCanvasMenu } = this.elements;
    
    offCanvasMenu.classList.add('active');
    this.state.isMenuOpen = true;
    document.body.style.overflow = 'hidden';
};

App.closeMobileMenu = function() {
    const { offCanvasMenu } = this.elements;
    
    offCanvasMenu.classList.remove('active');
    this.state.isMenuOpen = false;
    document.body.style.overflow = '';
};

// ==========================================
// Sticky Header
// ==========================================

App.initStickyHeader = function() {
    const { header } = this.elements;
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > this.config.scrollOffset) {
            header.classList.add('scrolled');
            
            // Hide on scroll down, show on scroll up
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
};

// ==========================================
// Scroll Reveal Animation
// ==========================================

App.initScrollReveal = function() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
};

// ==========================================
// Smooth Scroll
// ==========================================

App.initSmoothScroll = function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.length <= 1) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = App.elements.header?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
};

// ==========================================
// Lazy Loading Images
// ==========================================

App.initLazyLoading = function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
};

// ==========================================
// Newsletter Form
// ==========================================

App.initNewsletterForm = function() {
    const { newsletterForm } = this.elements;
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(newsletterForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone')
        };
        
        // Validate
        if (!data.name || !data.phone) {
            App.showAlert('error', 'لطفاً تمام فیلدها را پر کنید');
            return;
        }
        
        // Phone validation (simple)
        if (!/^[0-9]{10,11}$/.test(data.phone)) {
            App.showAlert('error', 'شماره تماس معتبر نیست');
            return;
        }
        
        // Submit button
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'در حال ارسال...';
        
        try {
            // Simulate API call
            await App.delay(1500);
            
            // Here you would normally send data to your backend
            console.log('Newsletter subscription:', data);
            
            App.showAlert('success', 'عضویت شما با موفقیت ثبت شد');
            newsletterForm.reset();
            
        } catch (error) {
            console.error('Newsletter error:', error);
            App.showAlert('error', 'خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
};

// ==========================================
// Back to Top
// ==========================================

App.initBackToTop = function() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'بازگشت به بالا');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px; /* <--- تغییر به چپ */
        width: 50px;
        height: 50px;
        background: var(--accent-color);
        color: var(--primary-color);
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 800;
        box-shadow: 0 4px 20px rgba(234, 190, 18, 0.4);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};
    document.body.appendChild(backToTopBtn);
    
    // Show/Hide on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// ==========================================
// Utility Functions
// ==========================================

App.showAlert = function(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        max-width: 400px;
        width: 90%;
        animation: slideInDown 0.3s ease-out;
    `;
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    alertDiv.innerHTML = `
        <div class="alert-icon">${icons[type] || 'ℹ'}</div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutUp 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
};

App.delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

App.formatNumber = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

App.truncateText = function(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

App.debounce = function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ==========================================
// Export App
// ==========================================

window.CafeApp = App;