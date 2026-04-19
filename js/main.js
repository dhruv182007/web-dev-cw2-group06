/* ============================================
   FITZONE - MAIN.JS
   Date/Time, Cookie Consent, Storage Utilities
   ============================================ */

// ============================================
// COOKIE CONSENT BANNER
// ============================================

$(document).ready(function() {
    // Initialize cookie consent banner
    initCookieConsent();

    // Initialize localStorage preference
    initDarkModePreference();

    // Update live date/time
    updateDateTimeFooter();
    setInterval(updateDateTimeFooter, 1000);

    // Save last viewed workout to localStorage
    trackWorkoutView();
});

/**
 * Initialize Cookie Consent Banner
 * GDPR compliant popup for tracking cookies
 */
function initCookieConsent() {
    const consentBanner = $('#cookie-consent');
    const acceptBtn = $('#accept-cookies');
    const declineBtn = $('#decline-cookies');

    // Check if user has already made a choice
    if (localStorage.getItem('cookieConsent') === null) {
        // Show banner after 2 seconds if not already consented
        setTimeout(function() {
            consentBanner.removeClass('hidden');
            consentBanner.slideDown(300);
        }, 2000);
    }

    // Handle Accept button
    acceptBtn.on('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        createCookie('fitzone_tracking', 'true', 365);
        consentBanner.slideUp(300, function() {
            consentBanner.addClass('hidden');
        });
    });

    // Handle Decline button
    declineBtn.on('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        consentBanner.slideUp(300, function() {
            consentBanner.addClass('hidden');
        });
    });
}

// ============================================
// COOKIE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Create a cookie with specified name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Days until cookie expires
 */
function createCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Read a cookie by name
 * @param {string} name - Cookie name to read
 * @returns {string|null} Cookie value or null if not found
 */
function readCookie(name) {
    let nameEQ = name + "=";
    let cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name to delete
 */
function deleteCookie(name) {
    createCookie(name, "", -1);
}

// ============================================
// LOCALSTORAGE FOR WORKOUTS & PREFERENCES
// ============================================

/**
 * Track the last viewed workout muscle group
 * Saves to localStorage for persistence
 */
function trackWorkoutView() {
    // Save current page as last viewed if on workouts page
    if (window.location.pathname.includes('workouts.html')) {
        let lastWorkoutTime = new Date().toLocaleString();
        localStorage.setItem('lastWorkoutView', lastWorkoutTime);
    }
}

/**
 * Get the last viewed workout time
 * @returns {string|null} Last workout view timestamp
 */
function getLastWorkoutView() {
    return localStorage.getItem('lastWorkoutView');
}

/**
 * Save the last selected muscle group
 * @param {string} muscleGroup - Name of muscle group (chest, back, legs, shoulders)
 */
function saveLastMuscleGroup(muscleGroup) {
    localStorage.setItem('lastMuscleGroup', muscleGroup);
}

/**
 * Get the last selected muscle group
 * @returns {string|null} Last muscle group viewed
 */
function getLastMuscleGroup() {
    return localStorage.getItem('lastMuscleGroup');
}

// ============================================
// DARK MODE PREFERENCE (FUTURE ENHANCEMENT)
// ============================================

/**
 * Initialize dark mode preference from localStorage
 */
function initDarkModePreference() {
    let darkModePreference = localStorage.getItem('darkModePreference');

    // Default to light mode if not set
    if (darkModePreference === null) {
        localStorage.setItem('darkModePreference', 'light');
    }

    applyDarkMode(darkModePreference === 'dark');
}

/**
 * Toggle dark mode on/off
 */
function toggleDarkMode() {
    let currentPreference = localStorage.getItem('darkModePreference');
    let newPreference = currentPreference === 'dark' ? 'light' : 'dark';

    localStorage.setItem('darkModePreference', newPreference);
    applyDarkMode(newPreference === 'dark');

    // Save preference cookie as well
    createCookie('darkModePreference', newPreference, 365);
}

/**
 * Apply dark mode styles to the page
 * @param {boolean} isDarkMode - Whether to enable dark mode
 */
function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        $('body').addClass('dark-mode');
        localStorage.setItem('darkModePreference', 'dark');
    } else {
        $('body').removeClass('dark-mode');
        localStorage.setItem('darkModePreference', 'light');
    }
}

// ============================================
// LIVE DATE & TIME DISPLAY
// ============================================

/**
 * Update the footer with current date and time
 */
function updateDateTimeFooter() {
    let now = new Date();

    // Format: Monday, January 15, 2024 - 3:45:30 PM
    let options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };

    let dateTimeString = now.toLocaleDateString('en-US', options);

    $('#current-date-time').text('Updated: ' + dateTimeString);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format a date object to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    let options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format a time to readable string
 * @param {Date} date - Date to format time from
 * @returns {string} Formatted time string
 */
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Clear all FitZone related localStorage items
 */
function clearFitZoneData() {
    localStorage.removeItem('lastWorkoutView');
    localStorage.removeItem('lastMuscleGroup');
    localStorage.removeItem('darkModePreference');
    localStorage.removeItem('cookieConsent');
}

/**
 * Log user activity to console (for debugging)
 * @param {string} action - Action being performed
 * @param {object} data - Additional data about the action
 */
function logActivity(action, data) {
    if (console && console.log) {
        console.log('[FitZone Activity] ' + action + ':', data);
    }
}
