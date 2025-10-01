/* ================================
   PORTFOLIO FUNCTIONALITY
   ================================ */

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioFilters();
    initPortfolioLightbox();
    initPortfolioLazyLoading();
});

/* ================================
   PORTFOLIO FILTERS
   ================================ */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length === 0 || portfolioItems.length === 0) return;
    
    // Add click event to filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter portfolio items
            filterPortfolioItems(filter, portfolioItems);
            
            // Animate filtered items
            setTimeout(() => {
                animateVisibleItems();
            }, 300);
        });
    });
}

function filterPortfolioItems(filter, items) {
    items.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        
        if (shouldShow) {
            // Show item with stagger animation
            setTimeout(() => {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px) scale(0.9)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0) scale(1)';
                }, 50);
            }, index * 100);
        } else {
            // Hide item
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px) scale(0.9)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function animateVisibleItems() {
    const visibleItems = document.querySelectorAll('.portfolio-item[style*="opacity: 1"]');
    
    visibleItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0) scale(1)';
            item.classList.add('portfolio-animate');
        }, index * 50);
    });
}

/* ================================
   PORTFOLIO LIGHTBOX
   ================================ */
function initPortfolioLightbox() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const imageSrc = this.style.backgroundImage.slice(5, -2); // Remove url(" and ")
            const title = this.querySelector('.portfolio-overlay h4')?.textContent || 'Portfolio Image';
            const description = this.querySelector('.portfolio-overlay p')?.textContent || '';
            
            openLightbox(imageSrc, title, description);
        });
    });
}

function openLightbox(imageSrc, title, description) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('portfolio-lightbox');
    
    if (!lightbox) {
        lightbox = createLightbox();
        document.body.appendChild(lightbox);
    }
    
    // Update lightbox content
    const img = lightbox.querySelector('.lightbox-image');
    const titleEl = lightbox.querySelector('.lightbox-title');
    const descEl = lightbox.querySelector('.lightbox-description');
    const loader = lightbox.querySelector('.lightbox-loader');
    
    // Show loader
    loader.style.display = 'block';
    img.style.opacity = '0';
    
    // Load image
    const newImg = new Image();
    newImg.onload = function() {
        img.src = this.src;
        img.style.opacity = '1';
        loader.style.display = 'none';
    };
    newImg.src = imageSrc;
    
    titleEl.textContent = title;
    descEl.textContent = description;
    
    // Show lightbox
    lightbox.style.display = 'flex';
    document.body.classList.add('lightbox-open');
    
    // Animate in
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
}

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.id = 'portfolio-lightbox';
    lightbox.className = 'portfolio-lightbox';
    
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
            <div class="lightbox-close">&times;</div>
            <div class="lightbox-loader">
                <div class="loader-spinner"></div>
            </div>
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-info">
                <h3 class="lightbox-title"></h3>
                <p class="lightbox-description"></p>
            </div>
            <div class="lightbox-nav">
                <button class="lightbox-prev">&#8249;</button>
                <button class="lightbox-next">&#8250;</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const overlay = lightbox.querySelector('.lightbox-overlay');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    [overlay, closeBtn].forEach(el => {
        el.addEventListener('click', closeLightbox);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateLightbox('prev');
            if (e.key === 'ArrowRight') navigateLightbox('next');
        }
    });
    
    // Navigation buttons
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox('prev'));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox('next'));
    
    return lightbox;
}

function closeLightbox() {
    const lightbox = document.getElementById('portfolio-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.classList.remove('lightbox-open');
    
    setTimeout(() => {
        lightbox.style.display = 'none';
    }, 300);
}

function navigateLightbox(direction) {
    const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    const visibleItems = Array.from(document.querySelectorAll('.portfolio-item'))
        .filter(item => {
            const category = item.getAttribute('data-category');
            return currentFilter === 'all' || category === currentFilter;
        });
    
    const currentImg = document.querySelector('.lightbox-image').src;
    let currentIndex = visibleItems.findIndex(item => {
        const itemBg = item.style.backgroundImage.slice(5, -2);
        return itemBg === currentImg;
    });
    
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % visibleItems.length;
    } else {
        newIndex = currentIndex === 0 ? visibleItems.length - 1 : currentIndex - 1;
    }
    
    const newItem = visibleItems[newIndex];
    const imageSrc = newItem.style.backgroundImage.slice(5, -2);
    const title = newItem.querySelector('.portfolio-overlay h4')?.textContent || 'Portfolio Image';
    const description = newItem.querySelector('.portfolio-overlay p')?.textContent || '';
    
    // Update lightbox content
    const img = document.querySelector('.lightbox-image');
    const titleEl = document.querySelector('.lightbox-title');
    const descEl = document.querySelector('.lightbox-description');
    const loader = document.querySelector('.lightbox-loader');
    
    // Show loader
    loader.style.display = 'block';
    img.style.opacity = '0';
    
    // Load new image
    const newImg = new Image();
    newImg.onload = function() {
        img.src = this.src;
        img.style.opacity = '1';
        loader.style.display = 'none';
    };
    newImg.src = imageSrc;
    
    titleEl.textContent = title;
    descEl.textContent = description;
}

/* ================================
   LAZY LOADING FOR PORTFOLIO
   ================================ */
function initPortfolioLazyLoading() {
    if ('IntersectionObserver' in window) {
        const portfolioObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    
                    // Add loaded class for animations
                    item.classList.add('portfolio-loaded');
                    
                    // Stop observing this item
                    portfolioObserver.unobserve(item);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        // Observe all portfolio items
        document.querySelectorAll('.portfolio-item').forEach(item => {
            portfolioObserver.observe(item);
        });
    }
}

/* ================================
   PORTFOLIO MASONRY LAYOUT (Optional)
   ================================ */
function initMasonryLayout() {
    const grid = document.querySelector('.portfolio-grid');
    if (!grid) return;
    
    // Simple masonry-like layout
    function arrangeMasonry() {
        const items = Array.from(grid.children);
        const columnCount = getComputedStyle(grid).getPropertyValue('grid-template-columns').split(' ').length;
        const columnHeights = new Array(columnCount).fill(0);
        
        items.forEach((item, index) => {
            const columnIndex = index % columnCount;
            const yPos = columnHeights[columnIndex];
            
            item.style.transform = `translateY(${yPos}px)`;
            columnHeights[columnIndex] += item.offsetHeight + 20; // 20px gap
        });
        
        // Update grid height
        grid.style.height = `${Math.max(...columnHeights)}px`;
    }
    
    // Arrange on load and resize
    window.addEventListener('load', arrangeMasonry);
    window.addEventListener('resize', debounce(arrangeMasonry, 250));
}

/* ================================
   PORTFOLIO HOVER EFFECTS
   ================================ */
function initPortfolioHoverEffects() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            
            if (overlay) {
                overlay.style.transform = 'translateY(0)';
                overlay.style.opacity = '1';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            if (overlay) {
                overlay.style.transform = 'translateY(100%)';
                overlay.style.opacity = '0';
            }
        });
    });
}

/* ================================
   PORTFOLIO SEARCH FUNCTIONALITY
   ================================ */
function initPortfolioSearch() {
    const searchInput = document.getElementById('portfolio-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.toLowerCase();
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        portfolioItems.forEach(item => {
            const title = item.querySelector('.portfolio-overlay h4')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.portfolio-overlay p')?.textContent.toLowerCase() || '';
            const category = item.getAttribute('data-category') || '';
            
            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                category.includes(searchTerm);
            
            if (matchesSearch) {
                item.style.display = 'block';
                item.classList.add('search-match');
            } else {
                item.style.display = 'none';
                item.classList.remove('search-match');
            }
        });
        
        // Update visible count
        const visibleCount = document.querySelectorAll('.portfolio-item[style*="block"]').length;
        updatePortfolioCount(visibleCount);
    }, 300));
}

function updatePortfolioCount(count) {
    let countElement = document.getElementById('portfolio-count');
    
    if (!countElement) {
        countElement = document.createElement('div');
        countElement.id = 'portfolio-count';
        countElement.style.cssText = `
            text-align: center;
            margin: 20px 0;
            font-weight: 600;
            color: #666;
        `;
        
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (portfolioGrid) {
            portfolioGrid.parentNode.insertBefore(countElement, portfolioGrid.nextSibling);
        }
    }
    
    countElement.textContent = `Showing ${count} ${count === 1 ? 'item' : 'items'}`;
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add portfolio-specific CSS
const portfolioStyles = `
    <style>
    .portfolio-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .portfolio-lightbox.active {
        opacity: 1;
    }
    
    .lightbox-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    }
    
    .portfolio-lightbox.active .lightbox-content {
        transform: scale(1);
    }
    
    .lightbox-close {
        position: absolute;
        top: 15px;
        right: 20px;
        font-size: 30px;
        color: white;
        cursor: pointer;
        z-index: 10001;
        background: rgba(0, 0, 0, 0.5);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    }
    
    .lightbox-close:hover {
        background: rgba(0, 0, 0, 0.8);
    }
    
    .lightbox-image {
        width: 100%;
        height: auto;
        max-height: 70vh;
        object-fit: contain;
        transition: opacity 0.3s ease;
    }
    
    .lightbox-info {
        padding: 20px;
        background: white;
    }
    
    .lightbox-title {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 1.5rem;
    }
    
    .lightbox-description {
        margin: 0;
        color: #666;
        line-height: 1.6;
    }
    
    .lightbox-nav {
        position: absolute;
        top: 50%;
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        transform: translateY(-50%);
        pointer-events: none;
    }
    
    .lightbox-prev,
    .lightbox-next {
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        transition: background 0.3s ease;
        pointer-events: auto;
    }
    
    .lightbox-prev:hover,
    .lightbox-next:hover {
        background: rgba(0, 0, 0, 0.8);
    }
    
    .lightbox-loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
    }
    
    .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .portfolio-item {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .portfolio-loaded {
        opacity: 1;
        transform: translateY(0);
    }
    
    .portfolio-animate {
        animation: portfolioSlideIn 0.6s ease-out;
    }
    
    @keyframes portfolioSlideIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    body.lightbox-open {
        overflow: hidden;
    }
    
    /* Mobile lightbox adjustments */
    @media (max-width: 768px) {
        .lightbox-content {
            max-width: 95vw;
            max-height: 95vh;
        }
        
        .lightbox-image {
            max-height: 60vh;
        }
        
        .lightbox-info {
            padding: 15px;
        }
        
        .lightbox-title {
            font-size: 1.3rem;
        }
        
        .lightbox-prev,
        .lightbox-next {
            width: 40px;
            height: 40px;
            font-size: 20px;
        }
        
        .lightbox-nav {
            padding: 0 10px;
        }
    }
    </style>
`;

// Insert portfolio styles
document.head.insertAdjacentHTML('beforeend', portfolioStyles);