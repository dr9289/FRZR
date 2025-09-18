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