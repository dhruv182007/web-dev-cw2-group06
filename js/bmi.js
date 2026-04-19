/* ============================================
   FITZONE - BMI CALCULATOR
   Interactive BMI widget with real-time calculation
   ============================================ */

(function() {
    'use strict';

    // BMI Widget elements
    const calculateBtn = document.getElementById('calculate-bmi');
    const bmiResult = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');

    // BMI Categories and their thresholds
    const BMI_CATEGORIES = {
        underweight: {
            min: 0,
            max: 18.5,
            label: 'Underweight',
            description: 'You may want to focus on building muscle and maintaining overall fitness.'
        },
        normal: {
            min: 18.5,
            max: 25,
            label: 'Normal Weight',
            description: 'Great! You\'re maintaining a healthy weight. Keep up your fitness routine!'
        },
        overweight: {
            min: 25,
            max: 30,
            label: 'Overweight',
            description: 'Consider incorporating more cardio and balanced nutrition into your routine.'
        },
        obese: {
            min: 30,
            max: Infinity,
            label: 'Obese',
            description: 'We recommend consulting with a healthcare professional and our trainers for a personalized fitness plan.'
        }
    };

    /**
     * Calculate BMI from height (cm) and weight (kg)
     * Formula: weight (kg) / (height (m))^2
     */
    function calculateBMI(heightCm, weightKg) {
        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            return null;
        }

        const heightM = heightCm / 100;
        const bmi = weightKg / (heightM * heightM);
        return Math.round(bmi * 10) / 10; // Round to 1 decimal place
    }

    /**
     * Get BMI category based on BMI value
     */
    function getBMICategory(bmi) {
        for (const [key, category] of Object.entries(BMI_CATEGORIES)) {
            if (bmi >= category.min && bmi < category.max) {
                return {
                    key: key,
                    ...category
                };
            }
        }
        return BMI_CATEGORIES.obese;
    }

    /**
     * Display BMI result
     */
    function displayBMIResult(bmi, category) {
        bmiValue.textContent = bmi;

        // Update category display
        bmiCategory.textContent = `${category.label}: ${category.description}`;

        // Update result container classes for styling
        bmiResult.classList.remove('underweight', 'normal', 'overweight', 'obese');
        bmiResult.classList.add(category.key);

        // Show result
        bmiResult.style.display = 'block';

        // Announce to screen readers
        announceToScreenReader(`Your BMI is ${bmi}, which is ${category.label.toLowerCase()}. ${category.description}`);
    }

    /**
     * Hide BMI result
     */
    function hideBMIResult() {
        bmiResult.style.display = 'none';
        bmiValue.textContent = '';
        bmiCategory.textContent = '';
    }

    /**
     * Announce text to screen readers
     */
    function announceToScreenReader(text) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = text;
        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            announcement.remove();
        }, 2000);
    }

    /**
     * Validate BMI inputs
     */
    function validateBMIInputs() {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        const errors = [];

        if (!height || height <= 0 || height < 50 || height > 300) {
            errors.push('Height must be between 50 and 300 cm');
        }

        if (!weight || weight <= 0 || weight < 20 || weight > 300) {
            errors.push('Weight must be between 20 and 300 kg');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Handle Calculate BMI button click
     */
    function handleCalculate() {
        const validation = validateBMIInputs();

        if (!validation.valid) {
            // Show error
            const errorText = validation.errors.join(' and ');
            announceToScreenReader(`Error: ${errorText}`);
            hideBMIResult();
            return;
        }

        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const bmi = calculateBMI(height, weight);

        if (bmi === null) {
            hideBMIResult();
            announceToScreenReader('Please enter valid height and weight values');
            return;
        }

        const category = getBMICategory(bmi);
        displayBMIResult(bmi, category);
    }

    /**
     * Auto-calculate BMI when height or weight changes (optional real-time)
     */
    function setupAutoCalculate() {
        heightInput.addEventListener('change', function() {
            if (weightInput.value && heightInput.value) {
                handleCalculate();
            }
        });

        weightInput.addEventListener('change', function() {
            if (heightInput.value && weightInput.value) {
                handleCalculate();
            }
        });

        // Also support Enter key
        heightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleCalculate();
            }
        });

        weightInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleCalculate();
            }
        });
    }

    /**
     * Initialize BMI Calculator
     */
    function init() {
        if (!calculateBtn || !heightInput || !weightInput) {
            return;
        }

        // Add click event to calculate button
        calculateBtn.addEventListener('click', handleCalculate);

        // Setup auto-calculate on field changes
        setupAutoCalculate();

        // Add keyboard accessibility
        calculateBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCalculate();
            }
        });

        // Focus styles for accessibility
        calculateBtn.addEventListener('focus', function() {
            this.classList.add('focused');
        });

        calculateBtn.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
