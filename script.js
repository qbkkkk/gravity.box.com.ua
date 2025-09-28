// JavaScript functionality for Gravity Box landing page

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // System switching functionality
    initSystemSwitching();
    
    // Accordion functionality
    initAccordion();
    
    // Scroll animations
    initScrollAnimations();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
});

// System switching in hero panel
function initSystemSwitching() {
    const systems = {
        power: { icon: 'zap', color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Електроживлення' },
        wifi: { icon: 'wifi', color: 'text-blue-500', bg: 'bg-blue-100', label: 'Інтернет & Wi-Fi' },
        security: { icon: 'shield', color: 'text-green-500', bg: 'bg-green-100', label: 'Охорона' },
        smart: { icon: 'home', color: 'text-purple-500', bg: 'bg-purple-100', label: 'Розумний дім' }
    };

    document.querySelectorAll('.system-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const system = btn.dataset.system;
            const systemData = systems[system];
            
            if (!systemData) return;
            
            // Update button states
            document.querySelectorAll('.system-btn').forEach(b => {
                b.className = 'system-btn p-4 rounded-lg border-2 bg-orange-800 border-orange-600 text-orange-400 hover:border-orange-500 transition-all hover:scale-105';
            });
            
            btn.className = `system-btn p-4 rounded-lg border-2 ${systemData.bg} border-current ${systemData.color} transition-all hover:scale-105`;
            
            // Update active system display
            const activeIcon = document.getElementById('active-system-icon');
            const activeLabel = document.getElementById('active-system-label');
            
            if (activeIcon && activeLabel) {
                activeIcon.setAttribute('data-lucide', systemData.icon);
                activeIcon.className = `w-6 h-6 ${systemData.color}`;
                activeLabel.textContent = systemData.label;
                
                // Reinitialize icons if available
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    });
}

// Accordion functionality
function initAccordion() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const target = document.getElementById(trigger.dataset.target);
            if (!target) return;
            
            const isOpen = target.classList.contains('open');
            
            // Close all accordions
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.classList.remove('open');
            });
            document.querySelectorAll('.accordion-trigger').forEach(t => {
                t.classList.remove('open');
            });
            
            // Open clicked accordion if it wasn't open
            if (!isOpen) {
                target.classList.add('open');
                trigger.classList.add('open');
            }
        });
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - show all elements
        document.querySelectorAll('.animate-card, .animate-step').forEach(el => {
            el.classList.remove('opacity-0');
            el.style.opacity = '1';
        });
        return;
    }

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay) || 0;
                
                setTimeout(() => {
                    if (element.classList.contains('animate-card')) {
                        element.classList.remove('opacity-0');
                        element.classList.add('animate-fade-in-up');
                    } else if (element.classList.contains('animate-step')) {
                        element.classList.remove('opacity-0');
                        element.classList.add('animate-fade-in-left');
                    }
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe animated elements
    document.querySelectorAll('.animate-card, .animate-step').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact form handling (if needed)
function handleContactForm() {
    const forms = document.querySelectorAll('form[data-contact-form]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Here you would typically send the data to your server
            console.log('Contact form submitted:', data);
            
            // Show success message
            showNotification('Дякуємо! Ваша заявка відправлена.', 'success');
            
            // Reset form
            form.reset();
        });
    });
}

// Show notification (utility function)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'
    });
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Lazy loading for images (if needed)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize additional features
function initAdditionalFeatures() {
    // Add hover effects to cards
    document.querySelectorAll('.card, .system-btn').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Add click effects to buttons
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            // Add ripple animation CSS if not exists
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Call additional features after DOM load
document.addEventListener('DOMContentLoaded', initAdditionalFeatures);

// Handle contact button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('button, .btn')) {
        const buttonText = e.target.textContent.trim();
        
        // Handle different button types
        if (buttonText.includes('Замовити') || buttonText.includes('консультацію')) {
            // Scroll to contact section or show contact modal
            showNotification('Дякуємо за інтерес! З вами незабаром зв\'яжуться.', 'success');
        } else if (buttonText.includes('партнером')) {
            showNotification('Заявка на партнерство відправлена!', 'success');
        } else if (buttonText.includes('Скачати') || buttonText.includes('Завантажити')) {
            showNotification('Завантаження розпочато...', 'info');
        }
    }
});

// Mobile menu toggle (if mobile menu is added later)
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
    const mobileMenu = document.querySelector('#mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll-based navbar background change (if navbar is added)
const handleScroll = debounce(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}, 10);

window.addEventListener('scroll', handleScroll);

// Export functions for use in other scripts if needed
window.GravityBoxFunctions = {
    showNotification,
    initSystemSwitching,
    initAccordion,
    initScrollAnimations
};
// Открыть / закрыть модальное окно
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Отправка формы
document.getElementById("leadForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const message = form.message.value;

    try {
        const response = await fetch("https://openapi.keycrm.app/v1/buyer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "NWVjNjViZjAxOGI1Yjg2YTNlN2UwYmU0NDk3OGZjOTM2MmRkMTgzZQ" // <-- замени
            },
            body: JSON.stringify({
                title: `Лид с сайта (${name})`,
                description: message,
                contact: {
                    name: name,
                    email: email,
                    phone: phone
                }
            })
        });

        if (response.ok) {
            document.getElementById("status").innerText = "✅ Заявка отправлена!";
            form.reset();
            setTimeout(() => { modal.style.display = "none"; }, 2000); // закрыть через 2 сек
        } else {
            document.getElementById("status").innerText = "❌ Ошибка отправки";
        }
    } catch (error) {
        document.getElementById("status").innerText = "⚠️ Сбой соединения";
    }
});
