/* ============================================
   FITZONE - FORM VALIDATION
   Real-time validation, error handling, focus management
   ============================================ */

(function() {
    'use strict';

    // Form elements
    const form = document.getElementById('membership-form');
    const successMessage = document.getElementById('success-message');
    const submittedData = document.getElementById('submitted-data');

    // Validation rules
    const validationRules = {
        first_name: {
            required: true,
            pattern: /^[a-zA-Z\s'-]{2,50}$/,
            errorMessage: 'First name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes'
        },
        last_name: {
            required: true,
            pattern: /^[a-zA-Z\s'-]{2,50}$/,
            errorMessage: 'Last name must be 2-50 characters and contain only letters, spaces, hyphens, or apostrophes'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\d\s\-\+\(\)]{10,20}$/,
            errorMessage: 'Please enter a valid phone number (10-20 characters)'
        },
        dob: {
            required: true,
            custom: validateDateOfBirth,
            errorMessage: 'You must be at least 13 years old to join'
        },
        height: {
            required: true,
            custom: validateHeight,
            errorMessage: 'Height must be between 50 and 300 cm'
        },
        weight: {
            required: true,
            custom: validateWeight,
            errorMessage: 'Weight must be between 20 and 300 kg'
        },
        fitness_level: {
            required: true,
            errorMessage: 'Please select a fitness level'
        },
        address: {
            required: true,
            pattern: /^[a-zA-Z0-9\s.,'-]{5,100}$/,
            errorMessage: 'Please enter a valid street address'
        },
        city: {
            required: true,
            pattern: /^[a-zA-Z\s'-]{2,50}$/,
            errorMessage: 'Please enter a valid city name'
        },
        state: {
            required: true,
            pattern: /^[a-zA-Z\s'-]{2,50}$/,
            errorMessage: 'Please enter a valid state name'
        },
        postal_code: {
            required: true,
            pattern: /^[\d\-]{5,10}$/,
            errorMessage: 'Please enter a valid postal code'
        },
        medical_conditions: {
            required: false,
            errorMessage: 'Medical conditions field is invalid'
        },
        terms: {
            required: true,
            errorMessage: 'You must agree to the Terms & Conditions'
        },
        privacy: {
            required: true,
            errorMessage: 'You must agree to the Privacy Policy'
        }
    };

    /**
     * Validate date of birth (must be 13+ years old)
     */
    function validateDateOfBirth(value) {
        if (!value) return false;
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age >= 13;
    }

    /**
     * Validate height (50-300 cm)
     */
    function validateHeight(value) {
        const height = parseFloat(value);
        return height >= 50 && height <= 300;
    }

    /**
     * Validate weight (20-300 kg)
     */
    function validateWeight(value) {
        const weight = parseFloat(value);
        return weight >= 20 && weight <= 300;
    }

    /**
     * Validate a single field
     */
    function validateField(nameAttr) {
        const field = document.querySelector(`[name="${nameAttr}"]`);
        if (!field) return true;

        const rules = validationRules[nameAttr];
        const value = field.value.trim();
        const errorElement = document.getElementById(`${nameAttr}-error`);

        if (!rules) return true;

        // Check required
        if (rules.required && !value) {
            showError(field, errorElement, `${formatFieldName(nameAttr)} is required`);
            return false;
        }

        // If not required and empty, it's valid
        if (!rules.required && !value) {
            clearError(field, errorElement);
            return true;
        }

        // Check custom validation
        if (rules.custom && !rules.custom(value)) {
            showError(field, errorElement, rules.errorMessage);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(value)) {
            showError(field, errorElement, rules.errorMessage);
            return false;
        }

        // Validation passed
        clearError(field, errorElement);
        return true;
    }

    /**
     * Show error message and mark field as invalid
     */
    function showError(field, errorElement, message) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        // Ensure field has aria-invalid
        field.setAttribute('aria-invalid', 'true');
    }

    /**
     * Clear error message and mark field as valid
     */
    function clearError(field, errorElement) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        field.setAttribute('aria-invalid', 'false');
    }

    /**
     * Format field name for error messages (snake_case to Title Case)
     */
    function formatFieldName(name) {
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    /**
     * Validate all form fields
     */
    function validateForm() {
        const fields = Object.keys(validationRules);
        let isValid = true;

        fields.forEach(fieldName => {
            if (fieldName === 'newsletter') return; // Skip optional newsletter
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });

        // Validate membership plan
        const planRadios = document.getElementsByName('membership_plan');
        const planChecked = Array.from(planRadios).some(radio => radio.checked);
        if (!planChecked) {
            showPlanError();
            isValid = false;
        }

        return isValid;
    }

    /**
     * Show membership plan selection error
     */
    function showPlanError() {
        const options = document.querySelector('.membership-options');
        if (options) {
            options.setAttribute('aria-invalid', 'true');
            let errorElement = options.querySelector('.plan-error');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message plan-error show';
                errorElement.textContent = 'Please select a membership plan';
                errorElement.setAttribute('role', 'alert');
                options.appendChild(errorElement);
            }
        }
    }

    /**
     * Clear membership plan error
     */
    function clearPlanError() {
        const options = document.querySelector('.membership-options');
        if (options) {
            const errorElement = options.querySelector('.plan-error');
            if (errorElement) {
                errorElement.classList.remove('show');
                setTimeout(() => errorElement.remove(), 300);
            }
            options.removeAttribute('aria-invalid');
        }
    }

    /**
     * Display submitted data
     */
    function displaySubmittedData() {
        const formData = new FormData(form);
        let html = '<h4>Your Registration Details:</h4>';

        const displayOrder = [
            'membership_plan',
            'first_name',
            'last_name',
            'email',
            'phone',
            'dob',
            'height',
            'weight',
            'fitness_level',
            'medical_conditions',
            'address',
            'city',
            'state',
            'postal_code',
            'newsletter'
        ];

        displayOrder.forEach(key => {
            const value = formData.get(key);
            if (value) {
                const label = formatFieldName(key);
                html += `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;
            }
        });

        submittedData.innerHTML = html;
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Handle form submission
     */
    function handleSubmit(event) {
        event.preventDefault();

        // Validate form
        if (!validateForm()) {
            // Focus on first invalid field
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) {
                firstInvalid.focus();
                // Announce error to screen readers
                const errorMsg = document.createElement('div');
                errorMsg.setAttribute('role', 'alert');
                errorMsg.className = 'sr-only';
                errorMsg.textContent = 'Form has errors. Please review and correct them.';
                document.body.appendChild(errorMsg);
                setTimeout(() => errorMsg.remove(), 1000);
            }
            return;
        }

        // Hide form and show success message
        form.style.display = 'none';
        document.querySelector('.membership-options').parentElement.style.display = 'none';
        displaySubmittedData();
        successMessage.style.display = 'block';

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth' });

        // Announce success to screen readers
        const successAnnouncement = document.createElement('div');
        successAnnouncement.setAttribute('role', 'alert');
        successAnnouncement.setAttribute('aria-live', 'polite');
        successAnnouncement.className = 'sr-only';
        successAnnouncement.textContent = 'Registration successful!';
        document.body.appendChild(successAnnouncement);
        setTimeout(() => successAnnouncement.remove(), 2000);
    }

    /**
     * Handle form reset
     */
    function handleReset(event) {
        // Clear all validation classes
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.classList.remove('valid', 'invalid');
            field.setAttribute('aria-invalid', 'false');
            const errorElement = document.getElementById(`${field.name}-error`);
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        });

        // Clear plan error
        clearPlanError();

        // Show success message
        successMessage.style.display = 'none';
        document.querySelector('.membership-options').parentElement.style.display = 'block';
        form.style.display = 'block';

        // Focus on first field
        const firstField = form.querySelector('input, select, textarea');
        if (firstField) {
            firstField.focus();
        }
    }

    /**
     * Add real-time validation listeners
     */
    function addValidationListeners() {
        Object.keys(validationRules).forEach(fieldName => {
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                // Validate on blur
                field.addEventListener('blur', function() {
                    validateField(fieldName);
                });

                // Validate on change (for select, radio, checkbox)
                field.addEventListener('change', function() {
                    validateField(fieldName);
                    // Clear plan error when a plan is selected
                    if (fieldName === 'membership_plan' && this.checked) {
                        clearPlanError();
                    }
                });

                // Real-time validation on input (debounced for text fields)
                if (field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number') {
                    let timeout;
                    field.addEventListener('input', function() {
                        clearTimeout(timeout);
                        timeout = setTimeout(() => {
                            validateField(fieldName);
                        }, 300);
                    });
                }
            }
        });

        // Validate membership plan on radio change
        const planRadios = document.getElementsByName('membership_plan');
        planRadios.forEach(radio => {
            radio.addEventListener('change', clearPlanError);
        });
    }

    /**
     * Setup focus management
     */
    function setupFocusManagement() {
        // Track focus for better accessibility
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('input, select, textarea, button, a')) {
                e.target.classList.add('focused');
            }
        });

        document.addEventListener('focusout', function(e) {
            if (e.target.matches('input, select, textarea, button, a')) {
                e.target.classList.remove('focused');
            }
        });

        // Trap focus in success message and show close button if needed
        successMessage.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Reset form
                form.reset();
                handleReset();
            }
        });
    }

    /**
     * Initialize validation on page load
     */
    function init() {
        if (!form) return;

        // Add event listeners
        form.addEventListener('submit', handleSubmit);
        form.addEventListener('reset', handleReset);

        // Setup real-time validation
        addValidationListeners();

        // Setup focus management
        setupFocusManagement();

        // Focus on first field when page loads
        const firstField = form.querySelector('input, select, textarea');
        if (firstField) {
            setTimeout(() => {
                // Don't auto-focus, let user click or tab
                // firstField.focus();
            }, 100);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
