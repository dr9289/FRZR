# FreshKeep - Smart Food Tracker

## Project Overview

FreshKeep is a progressive web application (PWA) designed for smart grocery management. The app helps users track food items across different storage locations (pantry, fridge, freezer) with expiration monitoring and a modern, mobile-first interface.

## Architecture

**Frontend**: Pure HTML/CSS/JavaScript (no framework)
**Styling**: CSS Custom Properties with Material Design principles
**Backend**: Firebase (integration in progress)
**Theme Support**: Light/Dark mode with system preference detection

## File Structure

```
FRZR/
├── index.html          # Landing/welcome page that redirects to dashboard
├── dashboard.html      # Main dashboard with stats and overview
├── pantry.html         # Grocery management (pantry, fridge, freezer)
├── add.html           # Add new food items
├── scan.html          # Barcode scanning functionality
├── family.html        # Family/household management
├── settings.html      # App settings and preferences
├── firebase-config.js  # Firebase integration and offline-first data sync
├── shared.css         # Global styles and theme variables
└── shared.js          # Shared JavaScript utilities
```

## Key Features

### Theme System
- **Location**: shared.js:4-61
- Light/dark mode toggle with Material Design colors
- System preference detection and auto-switching
- Persistent user preference storage
- Mobile browser theme-color meta tag updates

### Navigation
- **Location**: shared.js:64-83
- Mobile-first bottom navigation
- Active page highlighting
- Multi-page application structure

### Core Pages
1. **Landing Page** (index.html) - Welcome page with auto-redirect for returning users
2. **Dashboard** (dashboard.html) - Stats grid and overview
3. **Groceries** (pantry.html) - Grocery management with search and filtering across all storage locations
4. **Add Items** (add.html) - Form for adding new food items
5. **Scanner** (scan.html) - Barcode scanning functionality
6. **Family** (family.html) - Household member management
7. **Settings** (settings.html) - Comprehensive settings with user profile, household management, theme persistence, data export, and preferences

### Styling System
- **Location**: CSS custom properties in index.html:14-86
- Material Design color scheme
- Responsive grid layouts
- Mobile-first design approach
- Elevation and shadow system
- Status and location-based color coding

### Mobile Optimization
- **Location**: shared.js:135-142
- Viewport height handling for mobile browsers
- Touch-friendly interface elements
- Apple PWA meta tags and icons
- User-scalable disabled for app-like experience

## Development Notes

### Current State
- Static HTML pages with shared styling
- Theme system fully implemented
- **Add Item functionality completely working** (add.html)
- **Grocery management fully functional** (pantry.html)
- **Scanner functionality fully implemented** (scan.html)
- **Settings page fully functional** (settings.html)
- **Firebase integration with offline-first data sync** (firebase-config.js)
- **Unified navigation system with header navigation** (shared.js)
- **Form validation implemented across all inputs**
- localStorage data persistence implemented
- Mobile-responsive design complete

### Key Functions

#### Theme Management
```javascript
initializeTheme()    // Initialize theme on page load
setTheme(theme)      // Apply light/dark theme
toggleTheme()        // Switch between themes
```

#### Navigation
```javascript
setActiveNavItem(pageId)         // Highlight current page
insertHeaderNavigation(page)     // Add unified header navigation
createHeaderNavigation()         // Generate header HTML
goBack()                        // Smart back navigation
toggleUserMenu()                // Show/hide user menu
```

#### Data Management
```javascript
// Add Item (add.html:430-485)
addNewItem()                 // Process form submission with Firebase/localStorage sync
showNotification(msg, type)  // Display success/error messages

// Grocery Management (pantry.html:467-716)
loadInventoryData()          // Load items from Firebase/localStorage
handleSearch()               // Filter items by search term
handleSort()                 // Sort items by various criteria
deleteItem(itemId)           // Remove item from storage
editItem(itemId)             // Edit item (placeholder)
updateDisplay()              // Refresh item display
switchTab(location)          // Switch between pantry/fridge/freezer tabs

// Scanner Functions (scan.html:328-567)
startScanner()               // Initialize QuaggaJS barcode scanner
stopScanner()                // Stop scanner and clean up resources
toggleBatchMode()            // Enable batch scanning mode
addToBatchQueue()            // Add scanned items to batch queue
lookupProduct(barcode)       // Lookup product and redirect to add form

// Firebase Integration (firebase-config.js)
FreshKeepDB.addItem()        // Add item with Firebase/localStorage sync
FreshKeepDB.getItems()       // Get items with offline-first approach
FreshKeepDB.deleteItem()     // Delete with sync
FreshKeepDB.updateItem()     // Update with sync

// Settings Management (settings.html:420-700)
loadSettings()               // Load settings from localStorage
saveSettings()               // Save settings to localStorage
updateUI()                   // Update UI with current settings
editProfile()                // Edit user profile with validation
saveHouseholdName()          // Save household name with validation
addFamilyMember()            // Add family member with validation
toggleAutoTheme()            // Toggle automatic theme switching
exportData()                 // Export all app data as JSON
clearLocalData()             // Clear all local storage data
showNotification()           // Display success/error notifications

// Validation Functions (add.html:411-464, settings.html:521-564)
validateForm(item)           // Validate add item form
validateProfileName(name)    // Validate user profile name
validateHouseholdName(name)  // Validate household name
validateFamilyMemberName()   // Validate family member name
```

#### Page Initialization
```javascript
initializePage()             // Main initialization function
```

### Tech Stack
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: ES6+ features, localStorage
- **PWA**: Service worker ready, app manifest
- **Firebase**: Backend integration (in development)

### Design Principles
- Mobile-first responsive design
- Material Design color system
- Accessibility compliance
- Performance optimization
- Progressive enhancement

## Testing Commands

No specific test framework detected. Manual testing recommended for:
- Theme switching functionality
- Mobile responsiveness
- Navigation between pages
- Local storage persistence

## Build Process

No build system detected - static files served directly.

## Deployment

Static files can be deployed to any web server. Firebase hosting integration planned.