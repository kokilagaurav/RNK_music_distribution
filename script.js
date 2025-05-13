document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll behavior
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animation on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .zoom-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // For stat counters
                if (entry.target.classList.contains('stat-value')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Enhanced counter animation with easing
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2500; // Slightly longer for better visual effect
        const start = 0;
        const startTime = performance.now();
        
        function easeOutCubic(t) {
            return (--t) * t * t + 1;
        }
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(start + (target - start) * easeOutCubic(progress));
            element.textContent = new Intl.NumberFormat().format(value);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = new Intl.NumberFormat().format(target);
                // Add a small pulse animation when counting completes
                element.classList.add('counter-complete');
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Hover effect for features
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / this.clientWidth) - 0.5;
            const y = ((e.clientY - rect.top) / this.clientHeight) - 0.5;
            
            this.style.transform = `translateY(-10px) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Add particles background to hero section (optional)
    if (typeof particlesJS !== 'undefined') {
        particlesJS("hero-particles", {
            particles: {
                number: { value: 80 },
                color: { value: "#ffffff" },
                opacity: { value: 0.5 },
                size: { value: 3 },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#ffffff",
                    opacity: 0.4,
                    width: 1
                },
                move: { enable: true, speed: 2 }
            }
        });
    }
    
    // Interactive hover effects on navigation
    const navLinks = document.querySelectorAll('.nav-links a:not(.button)');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const otherLinks = [...navLinks].filter(item => item !== link);
            otherLinks.forEach(otherLink => {
                otherLink.style.opacity = '0.6';
                otherLink.style.transform = 'scale(0.95)';
            });
        });
        
        link.addEventListener('mouseleave', () => {
            navLinks.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            });
        });
    });
    
    // Add parallax scrolling effect to hero section
    const hero = document.querySelector('.hero');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (hero) {
            hero.style.backgroundPosition = `center ${scrolled * 0.4}px`;
        }
    });
    
    // Typed.js integration for hero heading if library is available
    if (typeof Typed !== 'undefined') {
        const headingElement = document.querySelector('.hero h1');
        
        if (headingElement) {
            const originalText = headingElement.textContent;
            headingElement.textContent = '';
            
            new Typed(headingElement, {
                strings: [originalText],
                typeSpeed: 50,
                backSpeed: 0,
                loop: false,
                cursorChar: '|',
                onComplete: (self) => {
                    setTimeout(() => {
                        self.cursor.style.display = 'none';
                    }, 500);
                }
            });
        }
    }
    
    // Dynamic music visualizer effect (simplified version)
    const createMusicVisualizer = () => {
        const visualizer = document.createElement('div');
        visualizer.className = 'music-visualizer';
        
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            const height = Math.floor(Math.random() * 50) + 10;
            const delay = Math.random();
            
            bar.style.height = `${height}px`;
            bar.style.animationDelay = `${delay}s`;
            visualizer.appendChild(bar);
        }
        
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.appendChild(visualizer);
        }
    };
    
    createMusicVisualizer();
    
    // Enhance feature cards with tilt effect
    const tiltCards = document.querySelectorAll('.feature-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function handleTilt(e) {
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const maxRotation = 10; // Max degrees of rotation
        
        // Calculate rotation based on mouse position relative to center
        const rotateY = maxRotation * (mouseX - centerX) / (cardRect.width / 2);
        const rotateX = -maxRotation * (mouseY - centerY) / (cardRect.height / 2);
        
        // Apply transform
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        
        // Add shine effect
        const shine = card.querySelector('.card-shine');
        if (!shine) {
            const shineElement = document.createElement('div');
            shineElement.classList.add('card-shine');
            card.appendChild(shineElement);
        }
    }
    
    function resetTilt() {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        const shine = this.querySelector('.card-shine');
        if (shine) shine.remove();
    }
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .button');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        ripple.style.width = ripple.style.height = `${diameter}px`;
        ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Interactive stat items
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.querySelector('i').classList.add('pulse-animation');
            item.classList.add('stat-highlight');
        });
        
        item.addEventListener('mouseleave', () => {
            item.querySelector('i').classList.remove('pulse-animation');
            item.classList.remove('stat-highlight');
        });
    });
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.onload = () => img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Preloader (optional)
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('preloader-finish');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000);
    }
});
