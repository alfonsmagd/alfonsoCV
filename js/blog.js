// Blog JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Demo launch functionality
    const featuredExpandBtn = document.querySelector('.featured-expand-btn');
    const expandedContent = document.querySelector('.expanded-content');
    let isExpanded = false;

    if (featuredExpandBtn && expandedContent) {
        // Soporte para PC
        featuredExpandBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleExpandedContent();
        });
        
        // Soporte táctil para dispositivos móviles
        featuredExpandBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleExpandedContent();
        });
        
        // Estilo para feedback táctil
        featuredExpandBtn.style.webkitTapHighlightColor = 'transparent';
        featuredExpandBtn.style.touchAction = 'manipulation';
    }

    function toggleExpandedContent() {
        if (!isExpanded) {
            // Expand
            expandedContent.style.maxHeight = expandedContent.scrollHeight + 'px';
            expandedContent.classList.add('active');
            featuredExpandBtn.textContent = '← Show Less';
            isExpanded = true;
            
            // Smooth scroll to expanded content after animation
            setTimeout(() => {
                const cardRect = document.querySelector('.featured-card').getBoundingClientRect();
                const headerOffset = 100;
                const scrollPosition = window.pageYOffset + cardRect.top - headerOffset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 300);
            
        } else {
            // Collapse
            expandedContent.style.maxHeight = '0px';
            expandedContent.classList.remove('active');
            featuredExpandBtn.textContent = 'Read More →';
            isExpanded = false;
            
            // Scroll back to the card
            setTimeout(() => {
                const cardRect = document.querySelector('.featured-card').getBoundingClientRect();
                const headerOffset = 100;
                const scrollPosition = window.pageYOffset + cardRect.top - headerOffset;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }

    // Demo launch button functionality
    const demoLaunchBtn = document.querySelector('.demo-launch-btn');
    if (demoLaunchBtn) {
        demoLaunchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Interactive demo will be available soon! This is a preview of the blog post format.', 'info');
        });
    }

    // Share buttons functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const buttonText = this.textContent;
            
            if (buttonText.includes('Share')) {
                // Email share
                const subject = encodeURIComponent('Check out this graphics programming demo');
                const body = encodeURIComponent('I found this interesting graphics programming demo: ' + window.location.href);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            } else if (buttonText.includes('Copy')) {
                // Copy link
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                }).catch(() => {
                    showNotification('Could not copy link. Please copy manually.', 'error');
                });
            }
        });
    });

    // Contact links functionality
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        if (link.href === '#' || !link.href.includes('mailto:')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification('Contact information will be updated soon!', 'info');
            });
        }
    });

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: '600',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        });

        // Set background color based on type
        switch(type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #4caf50, #81c784)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #f44336, #e57373)';
                break;
            case 'info':
            default:
                notification.style.background = 'linear-gradient(45deg, #00ffff, #0080ff)';
                break;
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Scroll animations for content cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to cards
    const animatedElements = document.querySelectorAll('.featured-card');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    console.log('Simple blog functionality initialized successfully!');
});