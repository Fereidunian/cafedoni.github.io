// دیتا از JSON لود می‌شود
let cafesData = [];
let blogData = [];

// لود دیتا
async function loadData() {
    try {
        const cafesResponse = await fetch('data/cafes.json');
        cafesData = await cafesResponse.json();
        
        const blogResponse = await fetch('data/blog.json');
        blogData = await blogResponse.json();
        
        renderCafes();
        renderBlog();
    } catch (error) {
        console.error('خطا در بارگذاری دیتا:', error);
    }
}

// نمایش کافه‌ها
function renderCafes() {
    const specialOffersGrid = document.getElementById('special-offers-grid');
    const northCafesGrid = document.getElementById('north-cafes');
    
    // پیشنهادات ویژه
    const specialOffers = cafesData.cafes.filter(cafe => cafe.special_offer);
    specialOffersGrid.innerHTML = specialOffers.map(createCafeCard).join('');
    
    // کافه‌های شمال
    const northCafes = cafesData.cafes.filter(cafe => cafe.location.zone === 'north').slice(0, 4);
    northCafesGrid.innerHTML = northCafes.map(createCafeCard).join('');
}

// ساخت کارت کافه
function createCafeCard(cafe) {
    const stars = '★'.repeat(cafe.rating) + '☆'.repeat(5 - cafe.rating);
    
    return `
        <div class="cafe-card">
            <a href="pages/cafe-detail.html?id=${cafe.id}">
                <img src="${cafe.image}" alt="${cafe.name}" loading="lazy">
                <div class="cafe-card-content">
                    <h3>${cafe.name}</h3>
                    <div class="cafe-rating">${stars}</div>
                    <div class="cafe-location">📍 ${cafe.location.area}</div>
                </div>
            </a>
        </div>
    `;
}

// نمایش بلاگ
function renderBlog() {
    const blogGrid = document.getElementById('blog-posts');
    const posts = blogData.posts.slice(0, 4);
    
    blogGrid.innerHTML = posts.map(post => `
        <div class="blog-card">
            <a href="pages/blog-detail.html?id=${post.id}">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-card-content">
                    <h3>${post.title}</h3>
                    <div class="blog-meta">
                        📅 ${post.date} | 💬 ${post.comments} دیدگاه
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// منوی موبایل
document.querySelector('.mobile-menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.main-nav').classList.toggle('active');
});

// لود دیتا در شروع
document.addEventListener('DOMContentLoaded', loadData);