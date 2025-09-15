// Monastery360 Main JavaScript

// Global variables
let currentUser = null;
let monasteries = [];
let virtualTours = [];

// Listen for auth state changes via storage (e.g., after login/logout in other tabs)
window.addEventListener('storage', (e) => {
    if (e.key === 'currentUser') {
        try {
            currentUser = e.newValue ? JSON.parse(e.newValue) : null;
        } catch (_) {
            currentUser = null;
        }
        updateNavbarAuthState();
    }
});

// Mock data
const mockMonasteries = [
    {
        id: 'rumtek',
        name: 'Rumtek Monastery',
        description: 'The largest monastery in Sikkim, known for its golden stupa and traditional architecture',
        image: 'https://images.pexels.com/photos/10343245/pexels-photo-10343245.jpeg',
        photos: [
            'https://images.pexels.com/photos/10343245/pexels-photo-10343245.jpeg',
            'https://images.pexels.com/photos/256560/pexels-photo-256560.jpeg',
            'https://images.pexels.com/photos/2902935/pexels-photo-2902935.jpeg'
        ],
        contact: {
            phone: '+91 3592 123456',
            email: 'info@rumtek-monastery.org',
            address: 'Rumtek, East Sikkim 737135'
        },
        nearbySpots: [
            { name: 'Gangtok City Center', distanceKm: 23 },
            { name: 'Tsomgo Lake', distanceKm: 46 },
            { name: 'Enchey Monastery', distanceKm: 21 }
        ],
        location: { lat: 27.3389, lng: 88.5583 },
        established: '1740',
        type: 'Buddhist',
        highlights: ['Golden Stupa', 'Traditional Architecture', 'Spiritual Teachings']
    },
    {
        id: 'enchey',
        name: 'Enchey Monastery',
        description: 'Perched on a hilltop, offering panoramic views of Gangtok and surrounding mountains',
        image: 'https://images.pexels.com/photos/6209505/pexels-photo-6209505.jpeg',
        photos: [
            'https://images.pexels.com/photos/6209505/pexels-photo-6209505.jpeg',
            'https://images.pexels.com/photos/275939/pexels-photo-275939.jpeg',
            'https://images.pexels.com/photos/2902934/pexels-photo-2902934.jpeg'
        ],
        contact: {
            phone: '+91 3592 654321',
            email: 'contact@enchey-monastery.org',
            address: 'Enchey, Gangtok, Sikkim 737101'
        },
        nearbySpots: [
            { name: 'MG Marg', distanceKm: 3.2 },
            { name: 'Himalayan Zoological Park', distanceKm: 5.5 },
            { name: 'Rumtek Monastery', distanceKm: 21 }
        ],
        location: { lat: 27.3314, lng: 88.6138 },
        established: '1840',
        type: 'Buddhist',
        highlights: ['Mountain Views', 'Ancient Murals', 'Meditation Hall']
    },
    {
        id: 'pemayangtse',
        name: 'Pemayangtse Monastery',
        description: 'One of the oldest monasteries in Sikkim with exquisite woodwork and paintings',
        image: 'https://images.pexels.com/photos/8471906/pexels-photo-8471906.jpeg',
        photos: [
            'https://images.pexels.com/photos/8471906/pexels-photo-8471906.jpeg',
            'https://images.pexels.com/photos/207385/pexels-photo-207385.jpeg',
            'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg'
        ],
        contact: {
            phone: '+91 3595 112233',
            email: 'hello@pemayangtse.org',
            address: 'Pelling, West Sikkim 737113'
        },
        nearbySpots: [
            { name: 'Rabdentse Ruins', distanceKm: 1.8 },
            { name: 'Khecheopalri Lake', distanceKm: 24 },
            { name: 'Yuksom', distanceKm: 35 }
        ],
        location: { lat: 27.2051, lng: 88.2063 },
        established: '1705',
        type: 'Buddhist',
        highlights: ['Ancient Woodwork', 'Traditional Paintings', 'Historical Significance']
    }
];

const mockVirtualTours = [
    {
        id: 'tour1',
        monasteryId: 'rumtek',
        title: 'Rumtek Monastery Grand Hall',
        description: 'Explore the magnificent main prayer hall with its intricate decorations and peaceful ambiance',
        image: 'https://images.pexels.com/photos/10343245/pexels-photo-10343245.jpeg',
        duration: '8 minutes',
        featured: true
    },
    {
        id: 'tour2',
        monasteryId: 'enchey',
        title: 'Enchey Monastery Panoramic Views',
        description: 'Experience breathtaking 360° views from the monastery courtyard overlooking Gangtok',
        image: 'https://images.pexels.com/photos/6209505/pexels-photo-6209505.jpeg',
        duration: '6 minutes',
        featured: true
    },
    {
        id: 'tour3',
        monasteryId: 'pemayangtse',
        title: 'Pemayangtse Sacred Chambers',
        description: 'Discover ancient chambers filled with traditional art and spiritual artifacts',
        image: 'https://images.pexels.com/photos/8471906/pexels-photo-8471906.jpeg',
        duration: '12 minutes',
        featured: true
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadContent();
    updateNavbarAuthState();
});

function initializeApp() {
    // Load data (prefer external content if provided)
    if (window.MONASTERY_CONTENT) {
        monasteries = Array.isArray(window.MONASTERY_CONTENT.monasteries) && window.MONASTERY_CONTENT.monasteries.length
            ? window.MONASTERY_CONTENT.monasteries
            : mockMonasteries;
        virtualTours = Array.isArray(window.MONASTERY_CONTENT.tours) && window.MONASTERY_CONTENT.tours.length
            ? window.MONASTERY_CONTENT.tours
            : mockVirtualTours;
        // Store archives and events in localStorage for other modules
        if (Array.isArray(window.MONASTERY_CONTENT.archives)) {
            saveToLocalStorage('archives', window.MONASTERY_CONTENT.archives);
        }
        if (Array.isArray(window.MONASTERY_CONTENT.events)) {
            saveToLocalStorage('calendarEvents', window.MONASTERY_CONTENT.events);
        }
    } else {
        monasteries = mockMonasteries;
        virtualTours = mockVirtualTours;
    }
    
    // Check for logged in user
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try { currentUser = JSON.parse(userData); } catch (_) { currentUser = null; }
    }
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup mobile menu
    setupMobileMenu();
}

function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Archive item clicks (open modal)
    document.querySelectorAll('.archive-item').forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h3')?.textContent || 'Archive Item';
            openArchiveModal({ title });
        });
    });
}

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/95');
            navbar.classList.remove('bg-white/90');
        } else {
            navbar.classList.add('bg-white/90');
            navbar.classList.remove('bg-white/95');
        }
    }
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .timeline-event, .archive-item').forEach(el => {
        observer.observe(el);
    });
}

function loadContent() {
    loadVirtualTours();
    loadArchivesSection();
    setupRealtimeCalendar();
}

function loadVirtualTours() {
    const toursGrid = document.getElementById('tours-grid');
    if (!toursGrid) return;
    
    toursGrid.innerHTML = '';
    
    virtualTours.forEach(tour => {
        const monastery = monasteries.find(m => m.id === tour.monasteryId);
        const tourCard = createTourCard(tour, monastery);
        toursGrid.appendChild(tourCard);
    });
}

function createTourCard(tour, monastery) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer';
    
    card.innerHTML = `
        <div class="relative">
            <img src="${tour.image}" alt="${tour.title}" class="w-full h-48 object-cover">
            <div class="absolute top-4 right-4">
                <span class="bg-monastery-gold text-white px-3 py-1 text-sm rounded-full">360°</span>
            </div>
            <div class="absolute bottom-4 left-4">
                <span class="bg-black/70 text-white px-3 py-1 text-sm rounded-full">${tour.duration}</span>
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">${tour.title}</h3>
            <p class="text-gray-600 mb-4">${tour.description}</p>
            <div class="flex items-center justify-between">
                <div class="flex items-center text-sm text-gray-500">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                    </svg>
                    ${monastery ? monastery.name : 'Unknown'}
                </div>
                <button onclick="openTourModal('${tour.id}')" 
                        class="bg-prayer-blue text-white px-4 py-2 rounded-lg hover:bg-prayer-blue/90 transition-colors text-sm">
                    Start Tour
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function scrollToTours() {
    const toursSection = document.getElementById('tours');
    if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToMap() {
    const mapSection = document.getElementById('map');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function openTourModal(tourId) {
    const tour = virtualTours.find(t => t.id === tourId);
    const monastery = monasteries.find(m => m.id === tour.monasteryId);
    if (!tour) return;

    const modal = document.getElementById('tour-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');

    if (modal && modalTitle && modalImage && modalDescription) {
        modalTitle.textContent = tour.title;
        modalImage.style.backgroundImage = `url('${tour.image}')`;
        modalDescription.textContent = tour.description;

        // Optional enhanced content containers
        const details = document.getElementById('tour-details');
        if (details) {
            const photos = (monastery?.photos || [tour.image]).slice(0, 8).map(src => `<img src="${src}" class="w-24 h-24 object-cover rounded-lg mr-2 mb-2" alt="photo">`).join('');
            const nearby = (monastery?.nearbySpots || []).map(s => `<li class="flex items-center text-sm text-gray-200 mb-1">• ${s.name} <span class="text-gray-400 ml-2">(${s.distanceKm} km)</span></li>`).join('');
            const contact = monastery?.contact ? `
                <div class="text-sm text-gray-200">
                    <div><span class="font-medium">Phone:</span> ${monastery.contact.phone}</div>
                    <div><span class="font-medium">Email:</span> ${monastery.contact.email}</div>
                    <div><span class="font-medium">Address:</span> ${monastery.contact.address}</div>
                </div>` : '';
            const mapIframe = monastery?.location ? `<iframe class="w-full h-64 rounded-lg border" loading="lazy" allowfullscreen
                src="https://www.google.com/maps?q=${monastery.location.lat},${monastery.location.lng}&z=14&output=embed"></iframe>` : '';
            const videoUrl = tour.video360Url || 'https://www.youtube.com/embed/8pR8F8aG8Zk';

            details.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <div>
                        <h4 class="font-semibold text-white mb-2">360° View</h4>
                        <div class="w-full h-64 bg-black/30 rounded-lg overflow-hidden flex items-center justify-center text-white">
                            <iframe width="100%" height="100%" src="${videoUrl}" title="360 View" frameborder="0" allowfullscreen></iframe>
                        </div>
                        <h4 class="font-semibold text-white mt-4 mb-2">Photo Gallery</h4>
                        <div class="flex flex-wrap">${photos}</div>
                    </div>
                    <div>
                        <h4 class="font-semibold text-white mb-2">Location</h4>
                        ${mapIframe}
                        <h4 class="font-semibold text-white mt-4 mb-2">Contact</h4>
                        ${contact}
                        <h4 class="font-semibold text-white mt-4 mb-2">Nearby Tourist Spots</h4>
                        <ul>${nearby}</ul>
                    </div>
                </div>`;
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeTourModal() {
    const modal = document.getElementById('tour-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function openMapModal() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Initialize basic interactive map embed and list if containers exist
        const mapContainer = document.getElementById('map-embed');
        const listContainer = document.getElementById('map-list');
        if (mapContainer && monasteries.length) {
            const first = monasteries[0];
            mapContainer.innerHTML = `<iframe class="w-full h-full rounded-lg border" loading="lazy" allowfullscreen src="https://www.google.com/maps?q=${first.location.lat},${first.location.lng}&z=12&output=embed"></iframe>`;
        }
        if (listContainer) {
            listContainer.innerHTML = monasteries.map(m => `
                <button class="w-full text-left px-3 py-2 rounded hover:bg-gray-100" data-mid="${m.id}">${m.name}</button>
            `).join('');
            listContainer.querySelectorAll('button[data-mid]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const m = monasteries.find(x => x.id === btn.getAttribute('data-mid'));
                    const mapContainer2 = document.getElementById('map-embed');
                    if (m && mapContainer2) {
                        mapContainer2.innerHTML = `<iframe class="w-full h-full rounded-lg border" loading="lazy" allowfullscreen src="https://www.google.com/maps?q=${m.location.lat},${m.location.lng}&z=13&output=embed"></iframe>`;
                    }
                });
            });
        }
    }
}

function closeMapModal() {
    const modal = document.getElementById('map-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function updateNavbarAuthState() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const loginLinks = nav.querySelectorAll('a[href="login.html"]');
    const registerLinks = nav.querySelectorAll('a[href="register.html"]');

    const ensureAccountMenu = (container) => {
        if (!container) return;
        if (container.querySelector('#nav-account-menu')) return; // already exists
        const name = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : '';
        const initials = getUserInitials(currentUser);
        const isAdmin = currentUser && ['monk','archivist','tourism_official','super_admin'].includes(currentUser.role);
        const wrapper = document.createElement('div');
        wrapper.id = 'nav-account-menu';
        wrapper.className = 'relative';
        wrapper.innerHTML = `
            <button id="nav-account-btn" class="flex items-center text-gray-700 hover:text-prayer-blue">
                <div class="w-8 h-8 bg-monastery-gold rounded-full flex items-center justify-center text-white text-sm font-semibold mr-2">${initials}</div>
                <span class="hidden lg:inline">${name || 'Account'}</span>
                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>
            </button>
            <div id="nav-account-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden">
                <a href="user-dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</a>
                ${isAdmin ? '<a href="admin-dashboard.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin</a>' : ''}
                <button id="nav-logout" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
            </div>`;
        container.appendChild(wrapper);
        const btn = wrapper.querySelector('#nav-account-btn');
        const dd = wrapper.querySelector('#nav-account-dropdown');
        btn.addEventListener('click', (e) => { e.stopPropagation(); dd.classList.toggle('hidden'); });
        document.addEventListener('click', () => dd.classList.add('hidden'));
        wrapper.querySelector('#nav-logout').addEventListener('click', handleLogout);
    };

    if (currentUser) {
        loginLinks.forEach(a => a.classList.add('hidden'));
        registerLinks.forEach(a => a.classList.add('hidden'));
        // Desktop container
        const desktopContainer = (loginLinks[0] && loginLinks[0].parentElement) || (registerLinks[0] && registerLinks[0].parentElement);
        ensureAccountMenu(desktopContainer);
        // Mobile container
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            // hide mobile login/register row
            mobileMenu.querySelectorAll('a[href="login.html"], a[href="register.html"]').forEach(a => a.parentElement?.classList.add('hidden'));
            // ensure account button at end of mobile menu
            const mobileContainer = mobileMenu.querySelector('.px-2.pt-2.pb-3');
            ensureAccountMenu(mobileContainer);
        }
    } else {
        // Not logged in => show login/register and remove account menus if present
        loginLinks.forEach(a => a.classList.remove('hidden'));
        registerLinks.forEach(a => a.classList.remove('hidden'));
        nav.querySelectorAll('#nav-account-menu').forEach(n => n.remove());
    }
}

function getUserInitials(user) {
    if (!user) return 'U';
    const fn = (user.firstName || '').trim();
    const ln = (user.lastName || '').trim();
    const a = fn ? fn[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U');
    const b = ln ? ln[0].toUpperCase() : '';
    return `${a}${b}`;
}

function handleLogout() {
    if (window.Auth && typeof window.Auth.logout === 'function') {
        window.Auth.logout();
        return;
    }
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Close modals on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTourModal();
        closeMapModal();
    }
});

// Archives dynamic rendering
function loadArchivesSection() {
    const archivesContainerParent = document.querySelector('#archives');
    if (!archivesContainerParent) return;

    const contentColumn = archivesContainerParent.querySelector('.grid > div');
    if (!contentColumn) return;

    // Try external archives first
    const archives = getFromLocalStorage('archives', []);
    if (!archives || !archives.length) return;

    // Replace the existing list with generated cards
    const listWrapper = document.createElement('div');
    listWrapper.className = 'space-y-4';
    listWrapper.innerHTML = archives.map(a => `
        <div class="archive-item bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" data-arch="${a.id}">
            <div class="flex items-center">
                <img src="${a.image}" alt="${a.title}" class="w-16 h-16 rounded-lg object-cover mr-4"/>
                <div>
                    <h3 class="font-semibold text-lg">${a.title}</h3>
                    <p class="text-gray-600 line-clamp-2">${a.description || ''}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Replace the first archives list div
    const originalList = contentColumn.querySelector('.space-y-4');
    if (originalList) originalList.replaceWith(listWrapper);

    // Bind click events
    listWrapper.querySelectorAll('[data-arch]').forEach(el => {
        el.addEventListener('click', () => {
            const id = el.getAttribute('data-arch');
            const item = archives.find(x => x.id === id);
            openArchiveModal({
                title: item?.title,
                description: item?.description,
                fileUrl: item?.fileUrl
            });
            const bodyEl = document.getElementById('archive-modal-body');
            if (bodyEl && item) {
                bodyEl.innerHTML = `
                    <div class="space-y-3 text-gray-700">
                        <p>${item.description || ''}</p>
                        ${item.fileUrl ? `<a href="${item.fileUrl}" target="_blank" class="inline-flex items-center bg-prayer-blue text-white px-4 py-2 rounded-lg hover:bg-prayer-blue/90">View / Download</a>` : ''}
                    </div>`;
            }
        });
    });
}

// Calendar real-time via Firebase if available, fallback otherwise
function setupRealtimeCalendar() {
    // If Firebase SDK and config available, try Firestore-based live updates
    const hasFirebase = typeof window !== 'undefined' && window.firebase && window.FIREBASE_CONFIG;
    if (hasFirebase) {
        try {
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(window.FIREBASE_CONFIG);
            }
            if (firebase.firestore) {
                const db = firebase.firestore();
                db.collection('events').onSnapshot((snap) => {
                    const events = [];
                    snap.forEach(doc => {
                        const d = doc.data();
                        events.push({
                            date: d.date || '',
                            title: d.title || '',
                            desc: d.desc || '',
                            badge: d.badge || 'Event',
                            color: d.color || 'bg-prayer-blue'
                        });
                    });
                    saveToLocalStorage('calendarEvents', events);
                    loadCalendar();
                }, (err) => {
                    console.warn('Firestore events subscription failed, fallback to local.', err);
                    loadCalendar();
                });
                return;
            }
        } catch (e) {
            console.warn('Firebase init for calendar failed, fallback to local.', e);
        }
    }
    // Fallback to local content
    loadCalendar();
}

// Utility functions
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

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

function openArchiveModal(item) {
    const existing = document.getElementById('archive-modal');
    if (!existing) return;
    const titleEl = document.getElementById('archive-modal-title');
    const bodyEl = document.getElementById('archive-modal-body');
    if (titleEl && bodyEl) {
        titleEl.textContent = item.title || 'Archive Item';
        bodyEl.innerHTML = `
            <div class="space-y-3 text-gray-700">
                <p>High-resolution scans and metadata will be displayed here.</p>
                <button class="bg-prayer-blue text-white px-4 py-2 rounded-lg hover:bg-prayer-blue/90">Download</button>
            </div>`;
    }
    existing.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeArchiveModal() {
    const modal = document.getElementById('archive-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function loadCalendar() {
    const container = document.querySelector('#calendar .timeline-container');
    if (!container) return;
    const events = getFromLocalStorage('calendarEvents', null) || [
        { date: 'Mar 15', title: 'Losar Festival', desc: 'Tibetan New Year celebration at Rumtek Monastery', badge: 'Festival', color: 'bg-prayer-red' },
        { date: 'Apr 22', title: 'Buddha Jayanti', desc: 'Birth anniversary of Buddha across all monasteries', badge: 'Sacred Day', color: 'bg-monastery-gold' },
        { date: 'Jun 08', title: 'Hemis Festival', desc: 'Masked dance ceremony honoring Guru Padmasambhava', badge: 'Ceremony', color: 'bg-prayer-blue' },
        { date: 'Sep 12', title: 'Drupka Teshi', desc: 'First sermon of Buddha commemoration', badge: 'Teaching', color: 'bg-prayer-green' }
    ];

    // Clear existing children except the line
    container.innerHTML = '<div class="timeline-line"></div>' + events.map(ev => `
        <div class="timeline-event">
            <div class="timeline-date">${ev.date}</div>
            <div class="timeline-content">
                <h3 class="font-semibold text-lg mb-2">${ev.title}</h3>
                <p class="text-gray-600 mb-2">${ev.desc}</p>
                <span class="inline-block ${ev.color} text-white px-3 py-1 rounded-full text-sm">${ev.badge}</span>
            </div>
        </div>`).join('');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full`;
    
    switch (type) {
        case 'success':
            notification.classList.add('bg-prayer-green');
            break;
        case 'error':
            notification.classList.add('bg-prayer-red');
            break;
        case 'warning':
            notification.classList.add('bg-prayer-yellow');
            break;
        default:
            notification.classList.add('bg-prayer-blue');
    }
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white/80 hover:text-white">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// LocalStorage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

// Export for use in other files
window.Monastery360 = {
    showNotification,
    saveToLocalStorage,
    getFromLocalStorage,
    formatDate,
    debounce
};