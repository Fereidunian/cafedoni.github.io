/**
 * Data Loader Module
 * Loads data from JSON files and renders content
 */

'use strict';

const DataLoader = {
    data: {
        cafes: [],
        blog: [],
        categories: []
    },
    
    config: {
        dataPath: 'assets/data/',
        defaultImage: 'assets/images/placeholder.jpg'
    }
};

// ==========================================
// Initialize
// ==========================================

DataLoader.init = async function() {
    try {
        await this.loadAllData();
        this.renderContent();
    } catch (error) {
        console.error('Error loading data:', error);
        this.showError();
    }
};

// ==========================================
// Load Data
// ==========================================

DataLoader.loadAllData = async function() {
    try {
        const [cafesData, blogData, categoriesData] = await Promise.all([
            this.loadJSON('cafes.json'),
            this.loadJSON('blog.json'),
            this.loadJSON('categories.json')
        ]);
        
        this.data.cafes = cafesData.cafes || [];
        this.data.blog = blogData.posts || [];
        this.data.categories = categoriesData.categories || [];
        
        console.log('✅ Data loaded:', {
            cafes: this.data.cafes.length,
            blog: this.data.blog.length,
            categories: this.data.categories.length
        });
        
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
};

DataLoader.loadJSON = async function(filename) {
    try {
        const response = await fetch(this.config.dataPath + filename);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return {};
    }
};

// ==========================================
// Render Content
// ==========================================

DataLoader.renderContent = function() {
    this.renderSpecialOffers();
    this.renderNorthCafes();
    this.renderEastCafes();
    this.renderWestCafes();
    this.renderCenterCafes();
    this.renderBlog();
    this.renderTourismBlog();
};

// ==========================================
// Render Special Offers
// ==========================================

DataLoader.renderSpecialOffers = function() {
    const container = document.getElementById('special-offers-grid');
    if (!container) return;
    
    const specialOffers = this.data.cafes
        .filter(cafe => cafe.special_offer)
        .slice(0, 4);
    
    if (specialOffers.length === 0) {
        container.innerHTML = this.getEmptyState('هیچ پیشنهاد ویژه‌ای موجود نیست');
        return;
    }
    
    container.innerHTML = specialOffers.map(cafe => this.createCafeCard(cafe, true)).join('');
};

// ==========================================
// Render Cafes by Location
// ==========================================

DataLoader.renderNorthCafes = function() {
    this.renderCafesByZone('north-cafes-grid', 'north', 4);
};

DataLoader.renderEastCafes = function() {
    this.renderCafesByZone('east-cafes-grid', 'east', 4);
};

DataLoader.renderWestCafes = function() {
    this.renderCafesByZone('west-cafes-grid', 'west', 4);
};

DataLoader.renderCenterCafes = function() {
    this.renderCafesByZone('center-cafes-grid', 'center', 4);
};

DataLoader.renderCafesByZone = function(containerId, zone, limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const cafes = this.data.cafes
        .filter(cafe => cafe.location && cafe.location.zone === zone)
        .slice(0, limit);
    
    if (cafes.length === 0) {
        container.innerHTML = this.getEmptyState('کافه‌ای در این منطقه یافت نشد');
        return;
    }
    
    container.innerHTML = cafes.map(cafe => this.createCafeCard(cafe)).join('');
};

// ==========================================
// Render Blog
// ==========================================

DataLoader.renderBlog = function() {
    const container = document.getElementById('blog-grid');
    if (!container) return;
    
    const posts = this.data.blog
        .filter(post => post.category === 'cafe')
        .slice(0, 4);
    
    if (posts.length === 0) {
        container.innerHTML = this.getEmptyState('مقاله‌ای موجود نیست');
        return;
    }
    
    container.innerHTML = posts.map(post => this.createBlogCard(post)).join('');
};

DataLoader.renderTourismBlog = function() {
    const container = document.getElementById('tourism-grid');
    if (!container) return;
    
    const posts = this.data.blog
        .filter(post => post.category === 'tourism')
        .slice(0, 4);
    
    if (posts.length === 0) {
        container.innerHTML = this.getEmptyState('مقاله‌ای موجود نیست');
        return;
    }
    
    container.innerHTML = posts.map(post => this.createBlogCard(post)).join('');
};

// ==========================================
// Create Cafe Card
// ==========================================

DataLoader.createCafeCard = function(cafe, showBadge = false) {
    const stars = this.createStarRating(cafe.rating || 0);
    const image = cafe.image || this.config.defaultImage;
    const logo = cafe.logo || 'assets/images/logo.svg';
    
    return `
        <div class="cafe-card reveal">
            <a href="pages/cafe-detail.html?id=${cafe.id}">
                <div class="cafe-card-image">
                    <img src="${image}" alt="${cafe.name}" loading="lazy">
                    ${showBadge ? '<div class="cafe-badge">پیشنهاد ویژه</div>' : ''}
                    <div class="cafe-logo">
                        <img src="${logo}" alt="${cafe.name} logo" loading="lazy">
                    </div>
                </div>
                <div class="cafe-card-content">
                    <h3 class="cafe-name">${cafe.name}</h3>
                    <div class="cafe-rating">${stars}</div>
                    <div class="cafe-location">
                        📍 ${cafe.location?.area || 'تهران'}
                    </div>
                </div>
            </a>
        </div>
    `;
};

// ==========================================
// Create Blog Card
// ==========================================

DataLoader.createBlogCard = function(post) {
    const stars = this.createStarRating(post.rating || 0);
    const image = post.image || this.config.defaultImage;
    
    return `
        <div class="blog-card reveal">
            <a href="pages/blog-detail.html?id=${post.id}">
                <div class="blog-card-image">
                    <img src="${image}" alt="${post.title}" loading="lazy">
                    <div class="blog-logo-overlay">
                        <img src="assets/images/logo-white.svg" alt="Logo" loading="lazy">
                    </div>
                </div>
                <div class="blog-card-content">
                    <h3 class="blog-title">${post.title}</h3>
                    ${post.rating ? `<div class="blog-rating">${stars}</div>` : ''}
                    <div class="blog-meta">
                        <div class="blog-meta-item">
                            📅 ${post.date || ''}
                        </div>
                        <div class="blog-meta-item">
                            💬 ${post.comments || 0} دیدگاه
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `;
};

// ==========================================
// Create Star Rating
// ==========================================

DataLoader.createStarRating = function(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star-full">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<span class="star-half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star-empty">☆</span>';
    }
    
    return stars;
};

// ==========================================
// Empty State
// ==========================================

DataLoader.getEmptyState = function(message) {
    return `
        <div class="empty-state">
            <div class="empty-state-icon">📭</div>
            <p>${message}</p>
        </div>
    `;
};

// ==========================================
// Error State
// ==========================================

DataLoader.showError = function() {
    const containers = [
        'special-offers-grid',
        'north-cafes-grid',
        'east-cafes-grid',
        'west-cafes-grid',
        'center-cafes-grid',
        'blog-grid',
        'tourism-grid'
    ];
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    خطا در بارگذاری اطلاعات. لطفاً صفحه را دوباره بارگذاری کنید.
                </div>
            `;
        }
    });
};

// ==========================================
// Export
// ==========================================

window.DataLoader = DataLoader;