document.addEventListener('DOMContentLoaded', () => {
    const donationGrid = document.getElementById('donation-grid');
    const categoryFilter = document.getElementById('category-filter');
    let donations = [];
    let selectedCategory = 'All';
    
    // Load external JSON
    fetch('data/donations.json')
        .then(response => response.json())
        .then(data => {
            donations = data.donations;
            renderCategories();
            renderDonations();
        })
        .catch(err => console.error('Error loading donations.json:', err));
    
    // Render category buttons dynamically
    function renderCategories() {
        if (!categoryFilter) return;
        
        const categories = ['All', ...new Set(donations.map(org => org.category))];
        categoryFilter.innerHTML = '';
        
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.textContent = cat;
            btn.className = `
                px-3 py-2 rounded-full font-semibold border transition-all duration-300
                ${cat === selectedCategory ? 'bg-primary text-white border-primary' : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'}
            `;
            btn.addEventListener('click', () => {
                selectedCategory = cat;
                renderCategories();
                renderDonations();
            });
            categoryFilter.appendChild(btn);
        });
    }
    
    // Render donation cards (filtered)
    function renderDonations() {
        if (!donationGrid) return;
        donationGrid.innerHTML = '';
        
        const filtered = selectedCategory === 'All' ?
            donations :
            donations.filter(org => org.category === selectedCategory);
        
        filtered.forEach((org, index) => {
            const card = document.createElement('div');
            card.className = 'flex flex-col opacity-0 card-fade-in donation-card';
            card.style.animationDelay = `${index * 100}ms`;
            card.innerHTML = `
                <div class="p-6 flex-grow">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-16 h-16 bg-transparent rounded-full flex items-center justify-center font-extrabold text-2xl mr-4 flex-shrink-0">
                            ${org.url ? `<img src="${org.url}" alt="${org.name} logo">` : org.logo_text}
                        </div>
                        <span class="text-xs font-semibold py-1 px-3 rounded-full card-category">${org.category}</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${org.name}</h3>
                    <p class="text-gray-600 text-sm flex-grow">${org.description}</p>
                </div>
                <div class="bg-gray-50 p-5 mt-auto">
                    <a href="${org.link}" target="_blank" rel="noopener noreferrer" class="block w-full text-center text-white font-bold py-3 px-4 rounded-lg btn-gradient transform hover:scale-105 duration-300">
                        Donate Now
                    </a>
                </div>
            `;
            donationGrid.appendChild(card);
        });
    }
});