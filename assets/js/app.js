'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const offCanvasClose = document.getElementById('off-canvas-close');
    const offCanvasOverlay = document.querySelector('.off-canvas-overlay');

    mobileMenuToggle.addEventListener('click', () => offCanvasMenu.classList.add('active'));
    offCanvasClose.addEventListener('click', () => offCanvasMenu.classList.remove('active'));
    offCanvasOverlay.addEventListener('click', () => offCanvasMenu.classList.remove('active'));

    // Sticky Header
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Load initial content
    if (typeof DataLoader !== 'undefined') {
        DataLoader.init();
    }
});