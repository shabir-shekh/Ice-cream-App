// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const modal = document.getElementById('orderModal');
const orderButtons = document.querySelectorAll('.order-button');
const closeModalBtn = document.querySelector('.close-modal');
const orderForm = document.getElementById('orderForm');
const flavorInput = document.getElementById('flavorInput');
const quantityInput = document.getElementById('quantityInput');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = mobileMenuBtn.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 6px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(5px, -6px)' : '';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Modal Functions
function openModal(flavor) {
    modal.classList.add('active');
    flavorInput.value = flavor;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    orderForm.reset();
    clearErrors();
}

// Event Listeners for Modal
orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        const flavor = button.getAttribute('data-flavor');
        openModal(flavor);
    });
});

closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Form Validation Functions
function showError(input, message) {
    const errorSpan = input.nextElementSibling;
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
    input.style.borderColor = '#ff0000';
}

function clearError(input) {
    const errorSpan = input.nextElementSibling;
    errorSpan.style.display = 'none';
    input.style.borderColor = '#ddd';
}

function clearErrors() {
    [quantityInput, nameInput, emailInput].forEach(input => clearError(input));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

// Form submission handler function
async function handleFormSubmit(e, form) {
    e.preventDefault();
    let isValid = true;
    clearErrors();

    // Validate quantity
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity < 1 || quantity > 10) {
        showError(quantityInput, 'Please enter a quantity between 1 and 10');
        isValid = false;
    }

    // Validate name
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Please enter your name');
        isValid = false;
    }

    // Validate email
    if (!validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    if (isValid) {
        try {
            // Simulate order processing
            const submitButton = form.querySelector('.submit-button');
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create success message
            const modalContent = document.querySelector('.modal-content');
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <h2>Order Confirmed! 🎉</h2>
                <p>Thank you ${nameInput.value} for your order!</p>
                <p>We'll send a confirmation email to ${emailInput.value}</p>
                <p>Order Details:</p>
                <ul>
                    <li>Flavor: ${flavorInput.value}</li>
                    <li>Quantity: ${quantity} scoops</li>
                </ul>
            `;
            
            // Replace form with success message
            modalContent.innerHTML = '';
            modalContent.appendChild(successMessage);
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-modal';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                closeModal();
                // Reset modal content after closing
                setTimeout(() => {
                    modalContent.innerHTML = document.getElementById('orderModal').querySelector('.modal-content').innerHTML;
                    // Reinitialize form elements and listeners
                    initializeFormElements();
                }, 300);
            });
            modalContent.appendChild(closeBtn);

        } catch (error) {
            console.error('Error processing order:', error);
            showError(submitButton, 'An error occurred. Please try again.');
        }
    }
}

// Add submit handler to initial form
orderForm.addEventListener('submit', (e) => handleFormSubmit(e, orderForm));

// Initialize form elements and listeners
function initializeFormElements() {
    // Re-query DOM elements after modal content reset
    const newForm = document.getElementById('orderForm');
    const newCloseBtn = document.querySelector('.close-modal');
    
    if (newForm) {
        newForm.addEventListener('submit', (e) => handleFormSubmit(e, newForm));
    }
    
    if (newCloseBtn) {
        newCloseBtn.addEventListener('click', closeModal);
    }
}

// Add success message styles
const style = document.createElement('style');
style.textContent = `
    .success-message {
        text-align: center;
        padding: 2rem;
    }
    .success-message h2 {
        color: #4ecdc4;
        margin-bottom: 1rem;
    }
    .success-message p {
        margin-bottom: 1rem;
    }
    .success-message ul {
        list-style: none;
        padding: 0;
    }
    .success-message li {
        margin: 0.5rem 0;
        color: #666;
    }
`;
document.head.appendChild(style);
