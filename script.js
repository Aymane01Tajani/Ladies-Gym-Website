// ===== DOM ELEMENTS =====
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// ===== NAVIGATION =====
// Toggle mobile menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== HEADER SCROLL EFFECT =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== ACTIVE NAVIGATION LINK =====
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ===== BACK TO TOP BUTTON =====
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== TESTIMONIALS SLIDER =====
const testimonials = document.querySelectorAll('.testimonial__card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.testimonial__btn.prev');
const nextBtn = document.querySelector('.testimonial__btn.next');
let currentSlide = 0;

function showSlide(index) {
    // Handle index bounds
    if (index >= testimonials.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = testimonials.length - 1;
    } else {
        currentSlide = index;
    }
    
    // Hide all slides
    testimonials.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current slide and activate dot
    testimonials[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Navigation buttons
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', () => {
        showSlide(currentSlide + 1);
    });
}

// Dots navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-slide
let slideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Pause on hover
const sliderContainer = document.querySelector('.testimonials__slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    });
}

// ===== CONTACT FORM =====
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.message) {
            showNotification('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Veuillez entrer une adresse email valide.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Message envoyé avec succès ! Nous vous répondrons rapidement.', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification__close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 5px;
        margin-left: auto;
        opacity: 0.8;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ANIMATION ON SCROLL (Simple Implementation) =====
function animateOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            const animation = element.getAttribute('data-aos');
            const delay = element.getAttribute('data-aos-delay') || 0;
            
            setTimeout(() => {
                element.classList.add('aos-animate');
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) translateX(0) scale(1)';
            }, delay);
        }
    });
}

// Set initial styles for animated elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-aos]');
    
    elements.forEach(element => {
        const animation = element.getAttribute('data-aos');
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        switch(animation) {
            case 'fade-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-down':
                element.style.transform = 'translateY(-30px)';
                break;
            case 'fade-left':
                element.style.transform = 'translateX(30px)';
                break;
            case 'fade-right':
                element.style.transform = 'translateX(-30px)';
                break;
            case 'zoom-in':
                element.style.transform = 'scale(0.9)';
                break;
            default:
                element.style.transform = 'translateY(20px)';
        }
    });
    
    // Initial check
    animateOnScroll();
});

window.addEventListener('scroll', animateOnScroll);

// ===== GALLERY LIGHTBOX =====
const galleryItems = document.querySelectorAll('.gallery__item');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
            openLightbox(img.src, img.alt);
        }
    });
});

function openLightbox(src, alt) {
    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox__overlay"></div>
        <div class="lightbox__content">
            <img src="${src}" alt="${alt}">
            <button class="lightbox__close"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    const overlay = lightbox.querySelector('.lightbox__overlay');
    overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
    `;
    
    const content = lightbox.querySelector('.lightbox__content');
    content.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90vh;
        animation: scaleIn 0.3s ease;
    `;
    
    const image = lightbox.querySelector('img');
    image.style.cssText = `
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    `;
    
    const closeBtn = lightbox.querySelector('.lightbox__close');
    closeBtn.style.cssText = `
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 10px;
        transition: transform 0.2s ease;
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scaleIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    const closeLightbox = () => {
        lightbox.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', closeLightbox);
    
    // Close on escape key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Animate experience counter when visible
const experienceNumber = document.querySelector('.experience__number');
let counterAnimated = false;

if (experienceNumber) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterAnimated) {
                animateCounter(experienceNumber, 27);
                counterAnimated = true;
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(experienceNumber);
}

// ===== SERVICE CARDS HOVER EFFECT =====
const serviceCards = document.querySelectorAll('.service__card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('featured')) {
            this.style.transform = 'translateY(0)';
        }
    });
});

// ===== FORM INPUT ANIMATION =====
const formInputs = document.querySelectorAll('.form__group input, .form__group textarea, .form__group select');

formInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
    // Page is fully loaded
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        animateOnScroll();
    }, 100);
});

// ===== PARALLAX EFFECT FOR HERO =====
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
}

// ===== TYPING EFFECT FOR HERO TITLE (Optional Enhancement) =====
// Uncomment if you want a typing effect
/*
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}
*/

// ===== COUNTRY CODE SELECTOR =====
const countrySelector = document.getElementById('countrySelector');
const selectedCountry = document.getElementById('selectedCountry');
const countryDropdown = document.getElementById('countryDropdown');
const countryCodeInput = document.getElementById('countryCode');
const customCountryCodeInput = document.getElementById('customCountryCode');

if (selectedCountry && countryDropdown) {
    // Scope options to ONLY the contact form dropdown
    const countryOptions = countryDropdown.querySelectorAll('.country-option');

    // Toggle dropdown
    selectedCountry.addEventListener('click', (e) => {
        e.stopPropagation();
        countrySelector.classList.toggle('open');
        countryDropdown.classList.toggle('show');
    });

    // Select country
    countryOptions.forEach(option => {
        option.addEventListener('click', () => {
            const code = option.getAttribute('data-code');
            const country = option.getAttribute('data-country');
            
            // Check if "Autre" is selected
            if (country === 'other') {
                // Show custom input field
                selectedCountry.innerHTML = `
                    <span class="other-icon"><i class="fas fa-globe"></i></span>
                    <span class="country-dial-code">Autre</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                customCountryCodeInput.style.display = 'block';
                customCountryCodeInput.focus();
                countryCodeInput.value = '';
            } else {
                // Hide custom input field
                customCountryCodeInput.style.display = 'none';
                customCountryCodeInput.value = '';
                
                // Update selected display
                selectedCountry.innerHTML = `
                    <span class="fi fi-${country}"></span>
                    <span class="country-dial-code">${code}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                
                // Update hidden input
                countryCodeInput.value = code;
            }
            
            // Close dropdown
            countrySelector.classList.remove('open');
            countryDropdown.classList.remove('show');
        });
    });

    // Update hidden input when custom code is entered
    if (customCountryCodeInput) {
        customCountryCodeInput.addEventListener('input', () => {
            countryCodeInput.value = customCountryCodeInput.value;
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!countrySelector.contains(e.target)) {
            countrySelector.classList.remove('open');
            countryDropdown.classList.remove('show');
        }
    });
}

// ===== BOOKING FORM COUNTRY SELECTOR =====
const bookingCountrySelector = document.getElementById('bookingCountrySelector');
const bookingSelectedCountry = document.getElementById('bookingSelectedCountry');
const bookingCountryDropdown = document.getElementById('bookingCountryDropdown');
const bookingCountryCodeInput = document.getElementById('bookingCountryCode');
const bookingCustomCountryCodeInput = document.getElementById('bookingCustomCountryCode');

if (bookingCountrySelector && bookingSelectedCountry && bookingCountryDropdown) {
    // Toggle dropdown
    bookingSelectedCountry.addEventListener('click', (e) => {
        e.stopPropagation();
        bookingCountrySelector.classList.toggle('open');
        bookingCountryDropdown.classList.toggle('show');
    });

    // Select country from dropdown (scoped to booking dropdown only)
    const bookingCountryOptions = bookingCountryDropdown.querySelectorAll('.country-option');
    bookingCountryOptions.forEach(option => {
        option.addEventListener('click', () => {
            const code = option.getAttribute('data-code');
            const country = option.getAttribute('data-country');

            if (country === 'other') {
                // Show custom input for "Autre pays"
                bookingSelectedCountry.innerHTML = `
                    <span class="other-icon"><i class="fas fa-globe"></i></span>
                    <span class="country-dial-code">Autre</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                bookingCountryCodeInput.value = '';
                bookingCustomCountryCodeInput.style.display = 'block';
                bookingCustomCountryCodeInput.required = true;
                bookingCustomCountryCodeInput.focus();
            } else {
                // Use predefined country
                bookingSelectedCountry.innerHTML = `
                    <span class="fi fi-${country}"></span>
                    <span class="country-dial-code">${code}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                bookingCountryCodeInput.value = code;
                bookingCustomCountryCodeInput.style.display = 'none';
                bookingCustomCountryCodeInput.required = false;
                bookingCustomCountryCodeInput.value = '';
            }

            // Close dropdown
            bookingCountrySelector.classList.remove('open');
            bookingCountryDropdown.classList.remove('show');
        });
    });

    // Update hidden input when custom code is entered
    if (bookingCustomCountryCodeInput) {
        bookingCustomCountryCodeInput.addEventListener('input', () => {
            bookingCountryCodeInput.value = bookingCustomCountryCodeInput.value;
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!bookingCountrySelector.contains(e.target)) {
            bookingCountrySelector.classList.remove('open');
            bookingCountryDropdown.classList.remove('show');
        }
    });
}

// ===== BOOKING FORM LOGIC =====
const bookingForm = document.getElementById('bookingForm');
const bookingType = document.getElementById('booking-type');
const servicesInterestGroup = document.getElementById('services-interest-group');
const emsConfirmationGroup = document.getElementById('ems-confirmation-group');
const bilanDoneCheckbox = document.getElementById('bilan-done');
const submitBtnText = document.getElementById('submit-btn-text');

if (bookingType) {
    bookingType.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        
        if (selectedType === 'bilan') {
            // Show services interest, hide EMS confirmation
            servicesInterestGroup.style.display = 'block';
            emsConfirmationGroup.style.display = 'none';
            bilanDoneCheckbox.required = false;
            bilanDoneCheckbox.disabled = true;
            bilanDoneCheckbox.checked = false;
            submitBtnText.textContent = 'Réserver mon bilan gratuit';
        } else if (selectedType === 'ems') {
            // Hide services interest, show EMS confirmation
            servicesInterestGroup.style.display = 'none';
            emsConfirmationGroup.style.display = 'block';
            bilanDoneCheckbox.required = true;
            bilanDoneCheckbox.disabled = false;
            submitBtnText.textContent = 'Réserver ma séance EMS';
        } else {
            // Reset
            servicesInterestGroup.style.display = 'block';
            emsConfirmationGroup.style.display = 'none';
            bilanDoneCheckbox.required = false;
            bilanDoneCheckbox.disabled = true;
            bilanDoneCheckbox.checked = false;
            submitBtnText.textContent = 'Réserver mon bilan gratuit';
        }
    });
}

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const bookingTypeValue = formData.get('bookingType');
        
        // Validate EMS booking
        if (bookingTypeValue === 'ems' && !bilanDoneCheckbox.checked) {
            showNotification('Veuillez confirmer que vous avez déjà effectué votre bilan initial.', 'error');
            return;
        }
        
        // Collect form data
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            bookingType: bookingTypeValue,
            date: formData.get('date'),
            time: formData.get('time')
        };
        
        if (bookingTypeValue === 'bilan') {
            const interests = formData.getAll('interests[]');
            data.interests = interests.join(', ') || 'Non spécifié';
        }
        
        console.log('Booking data:', data);
        
        // Show success message
        const message = bookingTypeValue === 'bilan' 
            ? 'Votre demande de bilan initial a été enregistrée ! Nous vous contacterons rapidement pour confirmer votre rendez-vous.'
            : 'Votre réservation de séance EMS a été enregistrée ! Nous vous contacterons pour confirmation.';
        
        showNotification(message, 'success');
        bookingForm.reset();
        
        // Reset visibility
        servicesInterestGroup.style.display = 'block';
        emsConfirmationGroup.style.display = 'none';
    });
}

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
            question.setAttribute('aria-expanded', 'true');
        }
    });
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ladies Coaching website loaded successfully!');
    
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
