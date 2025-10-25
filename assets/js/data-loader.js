'use strict';

const DataLoader = {
    async init() {
        const dynamicContent = document.getElementById('dynamic-content');
        if (!dynamicContent) return;

        try {
            const response = await fetch('/assets/data/cafes.json');
            const data = await response.json();
            this.renderSections(data.cafes, dynamicContent);
        } catch (error) {
            dynamicContent.innerHTML = '<div class="error-message">خطا در بارگذاری محتوا.</div>';
        }
    },

    renderSections(cafes, container) {
        const sections = [
            { id: 'special-offers-grid', title: 'پیشنهادات ویژه', filter: cafe => cafe.special_offer, limit: 4 },
            { id: 'north-cafes-grid', title: 'کافه‌های شمال تهران', filter: cafe => cafe.location.zone === 'north', limit: 4 },
        ];

        let html = '';
        sections.forEach(section => {
            const filteredCafes = cafes.filter(section.filter).slice(0, section.limit);
            html += `
                <section class="cafe-listing-section">
                    <div class="container">
                        <div class="section-header">
                            <h2>${section.title}</h2>
                            <a href="/pages/places.html?filter=${section.id}" class="view-all-link">مشاهده همه &rarr;</a>
                        </div>
                        <div class="cafe-grid">
                            ${filteredCafes.map(this.createCafeCard).join('')}
                        </div>
                    </div>
                </section>
            `;
        });

        container.innerHTML = html;
    },

 // در فایل data-loader.js

createCafeCard(cafe) {
    const imageSrc = cafe.image ? `/${cafe.image}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='100' fill='%23cccccc'%3E☕%3C/text%3E%3C/svg%3E";
    
    return `
        <div class="cafe-card">
            <a href="/pages/cafe-detail.html?id=${cafe.id}">
                <div class="cafe-card-image">
                    <img src="${imageSrc}" alt="${cafe.name}" loading="lazy">
                </div>
                <div class="cafe-card-content">
                    <h3>${cafe.name}</h3>
                    <div class="cafe-location">📍 ${cafe.location.area}</div>
                </div>
            </a>
        </div>
    `;
}