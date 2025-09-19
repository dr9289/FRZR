/* FreshKeep Shared JavaScript - Mobile First with Dark Mode Support */

// Theme Management
function initializeTheme() {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('freshkeep-theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = savedTheme;
    if (!theme) {
        theme = systemPrefersDark ? 'dark' : 'light';
    }

    setTheme(theme);

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('freshkeep-theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

function setTheme(theme) {
    const html = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');

    if (theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.textContent = '☀️';
    } else {
        html.removeAttribute('data-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme === 'dark' ? '#141218' : '#667eea');
    }
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
    localStorage.setItem('freshkeep-theme', newTheme);

    // Add a subtle animation to indicate the change
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 150);
    }
}

// Navigation helpers
function setActiveNavItem(pageId) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current page - try both data-page and direct matching
    let activeItem = document.querySelector(`[data-page="${pageId}"]`);

    // Fallback: match by href if data-page doesn't work
    if (!activeItem) {
        const currentFile = `${pageId}.html`;
        activeItem = document.querySelector(`.nav-item[href="${currentFile}"]`);
    }

    // Special case for add.html - it's not in bottom nav, so skip if not found
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Unified header navigation component
function createHeaderNavigation(currentPage = '', showBackButton = false, customTitle = '') {
    const pageTitles = {
        'dashboard': 'Dashboard',
        'inventory': 'Groceries',
        'add': 'Add Item',
        'scan': 'Scanner',
        'family': 'Family',
        'settings': 'Settings'
    };

    const pageTitle = customTitle || pageTitles[currentPage] || 'FreshKeep';
    const isDashboard = currentPage === 'dashboard';

    return `
        <header class="app-header">
            <div class="header-content">
                ${showBackButton ? `
                    <button class="back-button" onclick="goBack()">
                        <span class="material-icons">arrow_back</span>
                    </button>
                ` : ''}
                <div class="header-branding">
                    <div class="app-logo">🥬</div>
                    <h1 class="page-title">${isDashboard ? 'FreshKeep' : pageTitle}</h1>
                    ${isDashboard ? '<div class="app-subtitle">Smart Food Tracker</div>' : ''}
                </div>
                <div class="header-actions">
                    <button class="theme-toggle" onclick="toggleTheme()">
                        <span class="theme-icon">🌙</span>
                    </button>
                    ${currentPage !== 'add' && currentPage !== 'scan' ? `
                        <a href="add.html" class="add-button" title="Add Item">
                            <span class="material-icons">add</span>
                        </a>
                    ` : ''}
                </div>
            </div>
        </header>
    `;
}

// Insert header navigation into page
function insertHeaderNavigation(currentPage = '', showBackButton = false, customTitle = '') {
    const body = document.body;
    const headerHTML = createHeaderNavigation(currentPage, showBackButton, customTitle);

    // Insert at the beginning of body
    body.insertAdjacentHTML('afterbegin', headerHTML);

    // Initialize theme icon
    initializeTheme();

    // Initialize scroll-responsive header
    initializeScrollResponsiveHeader(currentPage);
}

// Back navigation helper
function goBack() {
    // If there's history, go back, otherwise go to dashboard
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Scroll-responsive header functionality
function initializeScrollResponsiveHeader(currentPage) {
    const header = document.querySelector('.app-header');
    const headerBranding = document.querySelector('.header-branding');

    if (!header || !headerBranding) return;

    const scrollThreshold = 60;
    let isScrolled = false;
    let ticking = false;

    const pageTitles = {
        'dashboard': 'Dashboard',
        'inventory': 'Groceries',
        'add': 'Add Item',
        'scan': 'Scanner',
        'family': 'Family',
        'settings': 'Settings'
    };

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeScrolled = scrollTop > scrollThreshold;

        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            updateHeader();
        }
    }

    function updateHeader() {
        header.classList.toggle('scrolled', isScrolled);
        headerBranding.classList.toggle('scrolled', isScrolled);

        const pageTitle = header.querySelector('.page-title');
        const appSubtitle = header.querySelector('.app-subtitle');

        if (pageTitle) {
            if (isScrolled) {
                // Scrolled state: show compact page title
                if (currentPage === 'dashboard') {
                    pageTitle.textContent = 'Dashboard';
                } else {
                    pageTitle.textContent = pageTitles[currentPage] || 'FreshKeep';
                }
            } else {
                // Initial state: show full branding or page title
                if (currentPage === 'dashboard') {
                    pageTitle.textContent = 'FreshKeep';
                } else {
                    pageTitle.textContent = pageTitles[currentPage] || 'FreshKeep';
                }
            }
        }
    }

    // Throttled scroll listener for performance
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        header.style.transition = 'none';
        if (headerBranding) headerBranding.style.transition = 'none';
    }
}

// Firebase utility functions (placeholder - will be filled based on current implementation)
let currentUser = null;
let currentHousehold = null;

// Connection status management
function updateConnectionStatus(status) {
    console.log('Connection status:', status);
    // This will be implemented based on the specific page needs
}

// User menu management
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        const isVisible = userMenu.style.display === 'block';
        userMenu.style.display = isVisible ? 'none' : 'block';
    }
}

// Initialize page
function initializePage() {
    initializeTheme();

    // Set up event listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }

        // User profile button
        const userProfileBtn = document.getElementById('userProfileBtn');
        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', toggleUserMenu);
        }

        // Close user menu when clicking outside
        document.addEventListener('click', function(event) {
            const userMenu = document.getElementById('userMenu');
            const userProfileBtn = document.getElementById('userProfileBtn');

            if (userMenu && userProfileBtn &&
                !userMenu.contains(event.target) &&
                !userProfileBtn.contains(event.target)) {
                userMenu.style.display = 'none';
            }
        });

        // Handle mobile viewport height issues
        function setMobileVH() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        setMobileVH();
        window.addEventListener('resize', setMobileVH);
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        setTheme,
        toggleTheme,
        setActiveNavItem,
        updateConnectionStatus,
        toggleUserMenu,
        initializePage
    };
}

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
    initializePage();
}