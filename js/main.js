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
