
        // Portfolio Data
        const portfolioData = {
            items: [
                {
                    id: 'morrison-family',
                    name: 'The Morrison Family',
                    description: 'Spring Family Session',
                    category: 'family',
                    date: '2024-03',
                    image: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'morrison-family'
                },
                {
                    id: 'parker-family',
                    name: 'The Parker Family',
                    description: 'Winter Family Portraits',
                    category: 'family',
                    date: '2024-02',
                    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'parker-family'
                },
                {
                    id: 'baby-olivia',
                    name: 'Baby Olivia',
                    description: 'Newborn Session at 8 days',
                    category: 'newborn',
                    date: '2024-03',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'baby-olivia'
                },
                {
                    id: 'sofia-birthday',
                    name: "Sofia's 3rd Birthday",
                    description: 'Princess Theme Celebration',
                    category: 'birthday',
                    date: '2024-03',
                    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'sofia-birthday'
                },
                {
                    id: 'ashley-shower',
                    name: "Ashley's Baby Shower",
                    description: 'Boho Chic Theme',
                    category: 'baby-shower',
                    date: '2024-03',
                    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'ashley-shower'
                },
                {
                    id: 'rachel-maternity',
                    name: "Rachel's Maternity",
                    description: 'Golden Hour Session',
                    category: 'maternity',
                    date: '2024-03',
                    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
                    galleryId: 'rachel-maternity'
                }
            ]
        };

        // Static reviews (would typically come from Google Business API)
        const reviewsData = [
            {
                name: 'The Morrison Family',
                type: 'Family Session Client',
                text: 'Sarah captured our family perfectly! The photos are absolutely beautiful and we\'ll treasure them forever. She made everyone feel comfortable and the whole experience was so enjoyable.',
                rating: 5
            },
            {
                name: 'Baby Olivia\'s Parents',
                type: 'Newborn Session Client',
                text: 'Working with Sarah for our newborn session was amazing. She was so patient and gentle with our little one. The photos exceeded all our expectations - they\'re absolutely perfect!',
                rating: 5
            },
            {
                name: 'Sofia\'s Family',
                type: 'Birthday Session Client',
                text: 'Our daughter\'s birthday photos are incredible! Sarah captured all the joy and excitement of the day. We can\'t wait to book our next session with her.',
                rating: 5
            }
        ];

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            loadPortfolioItems();
            loadReviews();
            setupFilters();
        });

        // Portfolio Functions
        function loadPortfolioItems() {
            const grid = document.getElementById('portfolioGrid');
            grid.innerHTML = '';
            
            portfolioData.items.forEach(item => {
                const categoryMap = {
                    'family': 'Family Session',
                    'newborn': 'Newborn Session',
                    'birthday': 'Birthday Session',
                    'baby-shower': 'Baby Shower',
                    'maternity': 'Maternity Session'
                };

                const dateObj = new Date(item.date + '-01');
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

                const portfolioHTML = `
                    <div class="portfolio-item" data-category="${item.category}" data-date="${item.date}">
                        <div class="portfolio-image" style="background-image: url('${item.image}');">
                            <div class="portfolio-overlay">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                                <div class="portfolio-details">
                                    <span class="session-type">${categoryMap[item.category]}</span>
                                    <span class="session-date">${formattedDate}</span>
                                </div>
                                <button class="view-gallery-btn" onclick="openGallery('${item.galleryId}')">View Gallery</button>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += portfolioHTML;
            });
        }

        function setupFilters() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    portfolioItems.forEach(item => {
                        const category = item.getAttribute('data-category');
                        
                        if (filter === 'all' || category === filter) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                });
            });
        }

        function openGallery(galleryId) {
            alert('Gallery viewer would open here showing the full session for: ' + galleryId);
        }

        function loadMorePortfolio() {
            alert('This would load more portfolio sessions from previous years.');
        }

        // Reviews Functions
        function loadReviews() {
            const grid = document.getElementById('reviewsGrid');
            grid.innerHTML = '';
            
            reviewsData.forEach(review => {
                const stars = '⭐'.repeat(review.rating);
                const reviewHTML = `
                    <div class="testimonial-card">
                        <div class="testimonial-content">
                            <p>"${review.text}"</p>
                            <div class="testimonial-author">
                                <div class="author-info">
                                    <strong>${review.name}</strong>
                                    <span>${review.type}</span>
                                </div>
                                <div class="testimonial-rating">${stars}</div>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += reviewHTML;
            });
        }
