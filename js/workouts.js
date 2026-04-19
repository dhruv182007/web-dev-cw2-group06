/* ============================================
   FITZONE - WORKOUTS.JS
   jQuery Click-Reveal, Accordion, Carousel
   ============================================ */

$(document).ready(function() {
    // Initialize all jQuery interactions
    initMuscleGroupButtons();
    initAccordionFunctionality();
    initCarouselAutoRotate();
    initCarouselControls();

    // Track workout selection
    trackWorkoutSelection();
});

// ============================================
// MUSCLE GROUP BUTTONS - CLICK REVEAL
// ============================================

/**
 * Initialize muscle group button click handlers
 * Shows/reveals corresponding accordion sections
 */
function initMuscleGroupButtons() {
    $('.muscle-btn').on('click', function() {
        const selectedMuscle = $(this).attr('data-muscle');

        // Remove active class from all buttons
        $('.muscle-btn').removeClass('active');

        // Add active class to clicked button
        $(this).addClass('active');

        // Hide all accordions with slideUp animation
        $('.accordion').slideUp(300, function() {
            $(this).hide();
        });

        // Show selected accordion with slideDown animation
        $('#' + selectedMuscle + '-accordion').slideDown(400);

        // Save last viewed muscle group
        saveLastMuscleGroup(selectedMuscle);

        // Log activity
        logActivity('Muscle group selected', { muscle: selectedMuscle });
    });
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================

/**
 * Initialize accordion click handlers
 * Uses jQuery slideDown/slideUp for smooth animations
 */
function initAccordionFunctionality() {
    $('.accordion-header').on('click', function() {
        const content = $(this).next('.accordion-content');
        const toggle = $(this).find('.accordion-toggle');
        const accordionItem = $(this).parent('.accordion-item');

        // Check if this item is already open
        const isOpen = content.is(':visible');

        // Close all other items in the same accordion (optional - for single-open behavior)
        $(this).closest('.accordion').find('.accordion-content').not(content).slideUp(300);
        $(this).closest('.accordion').find('.accordion-toggle').not(toggle).text('+');

        // Toggle current item
        if (isOpen) {
            content.slideUp(300);
            toggle.text('+');
        } else {
            content.slideDown(300);
            toggle.text('−');
        }

        // Add animation class to content
        content.toggleClass('expanded');

        // Log activity
        logActivity('Accordion toggled', {
            muscle: $(this).closest('.accordion').attr('data-muscle'),
            exercise: $(this).find('h4').text(),
            action: isOpen ? 'closed' : 'opened'
        });
    });

    // Prevent content from collapsing when clicking inside it
    $('.accordion-content').on('click', function(e) {
        e.stopPropagation();
    });
}

// ============================================
// CAROUSEL AUTO-ROTATE
// ============================================

let currentSlide = 0;
let autoRotateInterval = null;
const carouselSpeed = 5000; // 5 seconds

/**
 * Initialize carousel auto-rotation
 */
function initCarouselAutoRotate() {
    startCarouselAutoRotate();

    // Pause on mouse hover
    $('.carousel-wrapper').on('mouseenter', function() {
        stopCarouselAutoRotate();
    });

    // Resume on mouse leave
    $('.carousel-wrapper').on('mouseleave', function() {
        startCarouselAutoRotate();
    });
}

/**
 * Start auto-rotating carousel
 */
function startCarouselAutoRotate() {
    autoRotateInterval = setInterval(function() {
        currentSlide = (currentSlide + 1) % 4; // 4 slides
        updateCarouselSlide(currentSlide);
    }, carouselSpeed);
}

/**
 * Stop auto-rotating carousel
 */
function stopCarouselAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

/**
 * Update carousel to show specific slide
 * @param {number} slideIndex - Index of slide to show (0-3)
 */
function updateCarouselSlide(slideIndex) {
    const totalSlides = 4;

    // Validate slide index
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    if (slideIndex >= totalSlides) slideIndex = 0;

    currentSlide = slideIndex;

    // Calculate offset
    const offset = -slideIndex * 100;

    // Animate slide transition
    $('.carousel-slides').animate({ left: offset + '%' }, 500, 'swing');

    // Update dots
    updateCarouselDots(slideIndex);

    // Log activity
    logActivity('Carousel slide changed', { slide: slideIndex + 1, total: totalSlides });
}

/**
 * Update carousel dot indicators
 * @param {number} activeSlide - Index of active slide
 */
function updateCarouselDots(activeSlide) {
    $('.dot').removeClass('active');
    $('.dot[data-slide="' + activeSlide + '"]').addClass('active');
}

// ============================================
// CAROUSEL CONTROLS
// ============================================

/**
 * Initialize carousel prev/next buttons
 */
function initCarouselControls() {
    // Next button
    $('.carousel-next').on('click', function() {
        stopCarouselAutoRotate();
        currentSlide = (currentSlide + 1) % 4;
        updateCarouselSlide(currentSlide);
        startCarouselAutoRotate();
    });

    // Previous button
    $('.carousel-prev').on('click', function() {
        stopCarouselAutoRotate();
        currentSlide = (currentSlide - 1 + 4) % 4;
        updateCarouselSlide(currentSlide);
        startCarouselAutoRotate();
    });

    // Dot indicators
    $('.dot').on('click', function() {
        stopCarouselAutoRotate();
        currentSlide = parseInt($(this).attr('data-slide'));
        updateCarouselSlide(currentSlide);
        startCarouselAutoRotate();
    });
}

// ============================================
// WORKOUT TRACKING
// ============================================

/**
 * Track which workouts are being viewed
 */
function trackWorkoutSelection() {
    // Get last viewed muscle group from localStorage
    const lastMuscle = getLastMuscleGroup();

    if (lastMuscle && lastMuscle !== 'chest') {
        // If remembered selection is not chest, load it
        $('[data-muscle="' + lastMuscle + '"]').trigger('click');
    }
}

// ============================================
// ANIMATION HELPER FUNCTIONS
// ============================================

/**
 * Fade out an element
 * @param {jQuery} element - Element to fade out
 * @param {number} duration - Animation duration in ms
 */
function fadeOutElement(element, duration = 300) {
    element.fadeOut(duration);
}

/**
 * Fade in an element
 * @param {jQuery} element - Element to fade in
 * @param {number} duration - Animation duration in ms
 */
function fadeInElement(element, duration = 300) {
    element.fadeIn(duration);
}

/**
 * Slide down an element with callback
 * @param {jQuery} element - Element to slide down
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Function to run after animation
 */
function slideDownElement(element, duration = 300, callback) {
    element.slideDown(duration, callback);
}

/**
 * Slide up an element with callback
 * @param {jQuery} element - Element to slide up
 * @param {number} duration - Animation duration in ms
 * @param {function} callback - Function to run after animation
 */
function slideUpElement(element, duration = 300, callback) {
    element.slideUp(duration, callback);
}

// ============================================
// KEYBOARD NAVIGATION (ACCESSIBILITY)
// ============================================

$(document).on('keydown', function(e) {
    // Arrow keys for carousel
    if ($('.carousel-wrapper').is(':visible')) {
        if (e.key === 'ArrowRight') {
            $('.carousel-next').trigger('click');
        } else if (e.key === 'ArrowLeft') {
            $('.carousel-prev').trigger('click');
        }
    }

    // Tab key for accordion
    if (e.key === 'Tab') {
        const focused = $(':focus');
        if (focused.hasClass('accordion-header')) {
            e.preventDefault();
            focused.trigger('click');
        }
    }
});

// ============================================
// RESPONSIVE CAROUSEL ADJUSTMENTS
// ============================================

$(window).on('resize', function() {
    // Adjust carousel on window resize
    updateCarouselSlide(currentSlide);
});
