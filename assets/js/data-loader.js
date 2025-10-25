/* ==========================================
   CAFE DOONI - Data Loader Module
   ========================================== */

(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        dataPath: 'assets/data/',
        defaultImage: generatePlaceholderSVG('کافه', '#003046'),
        defaultLogo: generateLogoSVG()
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    /**
     * Generate SVG placeholder for cafe images
     */
    function generatePlaceholderSVG(text, color = '#003046') {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='${encodeURIComponent(color)}' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='white' font-size='48' text-anchor='middle' dy='.3em'%3E☕ ${text}%3C/text%3E%3C/svg%3E`;
    }

    /**
     * Generate logo SVG
     */
    function generateLogoSVG() {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 150'%3E%3Ccircle cx='75' cy='75' r='70' fill='%23f9f9f9'/%3E%3Ctext x='75' y='95' font-size='60' text-anchor='middle' fill='%23003046'%3E☕%3C/text%3E%3C/svg%3E`;
    }

    /**
     * Generate star rating HTML
     */
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let html = '<div class="rating">';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        html += ` <span>(${rating})</span></div>`;
        return html;
    }

    /**
     * Format date to Persian
     */
    function formatPersianDate(dateString) {
        // Simple date formatting - you can enhance this with a proper Persian date library
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('fa-IR', options);
    }

    /**
     * Fetch JSON data
     */
    async function fetchData(filename) {
        try {
            const response = await fetch(CONFIG.dataPath + filename);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            return [];
        }
    }

    // ==========================================
    // RENDER FUNCTIONS
    // ==========================================

    /**
     * Render cafe card
     */
    function renderCafeCard(cafe) {
        const imageUrl = cafe.image || CONFIG.defaultImage;
        const logoUrl = cafe.logo || CONFIG.defaultLogo;
        const specialBadge = cafe.special_offer ? '<span class="special-badge">پیشنهاد ویژه</span>' : '';
        
        return `
            <div class="cafe-card">
                <div class="cafe-card-image">
                    <img src="${imageUrl}" alt="${cafe.name}" loading="lazy">
                    ${specialBadge}
                    <div class="cafe-logo">
                        <img src="${logoUrl}" alt="لوگو ${cafe.name}">
                    </div>
                </div>
                <div class="cafe-card-content">
                    <h3>${cafe.name}</h3>
                    ${generateStarRating(cafe.rating || 0)}
                    <div class="location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${cafe.location.area}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render blog card
     */
    function renderBlogCard(post) {
        const imageUrl = post.image || generatePlaceholderSVG('مقاله', '#140B64');
        const logoUrl = CONFIG.defaultLogo;
        
        return `
            <div class="blog-card">
                <div class="blog-card-image">
                    <img src="${imageUrl}" alt="${post.title}" loading="lazy">
                    <div class="cafe-logo">
                        <img src="${logoUrl}" alt="کافه دونی">
                    </div>
                </div>
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    ${post.rating ? generateStarRating(post.rating) : ''}
                    <div class="blog-meta">
                        <span>
                            <i class="fas fa-clock"></i>
                            ${formatPersianDate(post.date)}
                        </span>
                        <span>
                            <i class="fas fa-comment-dots"></i>
                            ${post.comments || 0} دیدگاه
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // LOAD AND RENDER DATA
    // ==========================================

    /**
     * Load and render special offers
     */
    async function loadSpecialOffers() {
        const container = document.getElementById('specialOffers');
        if (!container) return;

        const cafes = await fetchData('cafes.json');
        const specialOffers = cafes.filter(cafe => cafe.special_offer).slice(0, 4);

        if (specialOffers.length === 0) {
            container.innerHTML = '<p class="text-center">در حال حاضر پیشنهاد ویژه‌ای وجود ندارد.</p>';
            return;
        }

        container.innerHTML = specialOffers.map(cafe => renderCafeCard(cafe)).join('');
    }

    /**
     * Load and render regional cafes
     */
    async function loadRegionalCafes() {
        const cafes = await fetchData('cafes.json');

        const regions = {
            north: { container: document.getElementById('northCafes'), name: 'شمال' },
            east: { container: document.getElementById('eastCafes'), name: 'شرق' },
            west: { container: document.getElementById('westCafes'), name: 'غرب' },
            center: { container: document.getElementById('centerCafes'), name: 'مرکز' }
        };

        Object.keys(regions).forEach(regionKey => {
            const region = regions[regionKey];
            if (!region.container) return;

            const regionalCafes = cafes
                .filter(cafe => cafe.location.zone === regionKey)
                .slice(0, 4);

            if (regionalCafes.length === 0) {
                region.container.innerHTML = `<p class="text-center">کافه‌ای در ${region.name} تهران ثبت نشده است.</p>`;
                return;
            }

            region.container.innerHTML = regionalCafes.map(cafe => renderCafeCard(cafe)).join('');
        });
    }

    /**
     * Load and render blog posts
     */
    async function loadBlogPosts() {
        const container = document.getElementById('blogPosts');
        if (!container) return;

        const posts = await fetchData('blog.json');
        const latestPosts = posts.filter(post => post.category === 'cafe').slice(0, 4);

        if (latestPosts.length === 0) {
            container.innerHTML = '<p class="text-center">مقاله‌ای منتشر نشده است.</p>';
            return;
        }

        container.innerHTML = latestPosts.map(post => renderBlogCard(post)).join('');
    }

    /**
     * Load and render tourism posts
     */
    async function loadTourismPosts() {
        const container = document.getElementById('tourismPosts');
        if (!container) return;

        const posts = await fetchData('blog.json');
        const tourismPosts = posts.filter(post => post.category === 'tourism').slice(0, 4);

        if (tourismPosts.length === 0) {
            container.innerHTML = '<p class="text-center">مقاله گردشگری منتشر نشده است.</p>';
            return;
        }

        container.innerHTML = tourismPosts.map(post => renderBlogCard(post)).join('');
    }

    // ==========================================
    // INITIALIZE
    // ==========================================
    function init() {
        // Check if we're on the home page
        if (document.getElementById('specialOffers') || 
            document.getElementById('northCafes')) {
            
            loadSpecialOffers();
            loadRegionalCafes();
            loadBlogPosts();
            loadTourismPosts();
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();