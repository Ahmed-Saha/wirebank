// Main JavaScript file for FutureBank website

// Global variables
let particleSystem;
let isLoggedIn = false;
let currentUser = null;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeParticles();
    initializeScrollEffects();
    initializeTestimonialSlider();
    initializeBalanceCounters();
    initializeLoanCalculator();
    initializeNavigation();
});

// Initialize animations
function initializeAnimations() {
    // Typewriter effect for hero text
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['Banking for the Future', 'Your Financial Partner', 'Secure. Smart. Simple.'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // Animate service cards on hover
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            anime({
                targets: this,
                scale: 1.02,
                rotateX: 5,
                rotateY: 5,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
        
        card.addEventListener('mouseleave', function() {
            anime({
                targets: this,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });
}

// Initialize particle system
function initializeParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.3 + 0.1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Initialize scroll effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate balance counters when they come into view
                if (entry.target.classList.contains('balance-counter')) {
                    animateBalanceCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
    
    // Observe balance counters
    document.querySelectorAll('.balance-counter').forEach(el => {
        observer.observe(el);
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    });
}

// Initialize testimonial slider
function initializeTestimonialSlider() {
    if (document.getElementById('testimonial-slider')) {
        new Splide('#testimonial-slider', {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '2rem',
            autoplay: true,
            interval: 5000,
            pauseOnHover: true,
            breakpoints: {
                768: {
                    perPage: 1
                }
            }
        }).mount();
    }
}

// Initialize balance counters
function initializeBalanceCounters() {
    const counters = document.querySelectorAll('.balance-counter');
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (target) {
            counter.textContent = formatCurrency(0);
        }
    });
}

// Animate balance counter
function animateBalanceCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    if (!target) return;
    
    anime({
        targets: { value: 0 },
        value: target,
        duration: 2000,
        easing: 'easeOutQuad',
        update: function(anim) {
            if (element.textContent.includes('$')) {
                element.textContent = formatCurrency(anim.animatables[0].target.value);
            } else if (target < 100) {
                element.textContent = anim.animatables[0].target.value.toFixed(2) + '%';
            } else {
                element.textContent = Math.round(anim.animatables[0].target.value);
            }
        }
    });
}

// Initialize loan calculator
function initializeLoanCalculator() {
    updateLoanCalculator();
}

// Update loan calculator
function updateLoanCalculator() {
    const amount = parseFloat(document.getElementById('loanAmount').value);
    const rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    const years = parseFloat(document.getElementById('loanTerm').value);
    const months = years * 12;
    
    // Update displays
    document.getElementById('loanAmountDisplay').textContent = formatCurrency(amount);
    document.getElementById('interestRateDisplay').textContent = (rate * 12 * 100).toFixed(2) + '%';
    document.getElementById('loanTermDisplay').textContent = years + ' years';
    document.getElementById('numberOfPayments').textContent = months;
    
    // Calculate monthly payment
    const monthlyPayment = amount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - amount;
    
    // Update payment summary
    document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
    document.getElementById('totalAmount').textContent = formatCurrency(totalAmount);
}

// Initialize navigation
function initializeNavigation() {
    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    };
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function showRegisterModal() {
    document.getElementById('registerModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideRegisterModal() {
    document.getElementById('registerModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Form handlers
function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate login
    if (username && password) {
        isLoggedIn = true;
        currentUser = { username: username };
        
        // Show success message
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            hideLoginModal();
            window.location.href = 'online-banking.html';
        }, 1500);
    } else {
        showNotification('Please enter both username and password.', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    
    // Simulate registration
    if (name && email && phone && password) {
        showNotification('Registration successful! Please check your email to verify your account.', 'success');
        
        setTimeout(() => {
            hideRegisterModal();
            showLoginModal();
        }, 2000);
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Account data simulation
const accountData = {
    checking: {
        balance: 12547.89,
        accountNumber: '1234567890',
        recentTransactions: [
            { date: '2026-01-08', description: 'Grocery Store', amount: -127.45, type: 'debit' },
            { date: '2026-01-07', description: 'Direct Deposit', amount: 2850.00, type: 'credit' },
            { date: '2026-01-06', description: 'Gas Station', amount: -45.20, type: 'debit' },
            { date: '2026-01-05', description: 'Restaurant', amount: -68.50, type: 'debit' },
            { date: '2026-01-04', description: 'ATM Withdrawal', amount: -200.00, type: 'debit' }
        ]
    },
    savings: {
        balance: 45678.90,
        accountNumber: '0987654321',
        apy: 3.25,
        recentTransactions: [
            { date: '2026-01-08', description: 'Interest Payment', amount: 123.45, type: 'credit' },
            { date: '2026-01-01', description: 'Automatic Transfer', amount: -500.00, type: 'debit' },
            { date: '2025-12-31', description: 'Year-End Bonus', amount: 2500.00, type: 'credit' },
            { date: '2025-12-15', description: 'Interest Payment', amount: 118.67, type: 'credit' },
            { date: '2025-12-01', description: 'Automatic Transfer', amount: -500.00, type: 'debit' }
        ]
    },
    creditCard: {
        balance: -2341.67,
        limit: 10000,
        available: 7658.33,
        recentTransactions: [
            { date: '2026-01-09', description: 'Online Shopping', amount: -89.99, type: 'debit' },
            { date: '2026-01-08', description: 'Coffee Shop', amount: -5.75, type: 'debit' },
            { date: '2026-01-07', description: 'Payment Received', amount: 500.00, type: 'credit' },
            { date: '2026-01-06', description: 'Uber', amount: -18.50, type: 'debit' },
            { date: '2026-01-05', description: 'Pharmacy', amount: -32.45, type: 'debit' }
        ]
    }
};

// Loan application data
const loanProducts = [
    {
        type: 'Personal Loan',
        minAmount: 5000,
        maxAmount: 50000,
        minRate: 6.99,
        maxRate: 18.99,
        terms: [1, 2, 3, 4, 5],
        description: 'Unsecured personal loans for any purpose'
    },
    {
        type: 'Auto Loan',
        minAmount: 10000,
        maxAmount: 80000,
        minRate: 4.99,
        maxRate: 12.99,
        terms: [2, 3, 4, 5, 6, 7],
        description: 'New and used car financing'
    },
    {
        type: 'Home Equity Loan',
        minAmount: 25000,
        maxAmount: 250000,
        minRate: 5.25,
        maxRate: 8.75,
        terms: [5, 10, 15, 20],
        description: 'Leverage your home equity'
    }
];

// Export functions for other pages
window.FutureBank = {
    accountData,
    loanProducts,
    isLoggedIn,
    currentUser,
    showNotification,
    formatCurrency,
    animateBalanceCounter
};