/* ==========================================================================
   AURA STUDIO — MASTER LOGIC, INTERACTIVE GRAPHICS & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Vector Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Global states
    const mouse = { x: 0, y: 0 };
    let isMobile = window.innerWidth < 992;

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 992;
    });

    // ==========================================================================
    // 2. Custom Cursor with Elastic Follower
    // ==========================================================================
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    const cursorText = follower ? follower.querySelector('.cursor-text') : null;

    if (cursor && follower && !isMobile) {
        // High-performance GSAP quickTo tracking
        const cursorX = gsap.quickTo(cursor, "left", { duration: 0.1, ease: "power3.out" });
        const cursorY = gsap.quickTo(cursor, "top", { duration: 0.1, ease: "power3.out" });
        
        const followerX = gsap.quickTo(follower, "left", { duration: 0.35, ease: "power3.out" });
        const followerY = gsap.quickTo(follower, "top", { duration: 0.35, ease: "power3.out" });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            cursorX(mouse.x);
            cursorY(mouse.y);
            
            followerX(mouse.x);
            followerY(mouse.y);
        });

        // Hover States: Magnetic Items, Links & Buttons
        const hoverables = document.querySelectorAll('a, button, .btn-magnetic, .faq-header, .service-card');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                follower.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('hovered');
            });
        });

        // View Mode States: Featured Project Landscape Slides
        const projectCards = document.querySelectorAll('.project-slide-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                follower.classList.add('view-mode');
                if (cursorText) cursorText.textContent = "VIEW";
            });
            card.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('view-mode');
            });
        });

        // Showcase Mode State: Hero Section Hover
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', (e) => {
                if (!e.target.closest('a, button, .btn-magnetic')) {
                    cursor.classList.add('hovered');
                    follower.classList.add('showcase-mode');
                    if (cursorText) cursorText.textContent = "VIEW SHOWCASE";
                }
            });
            
            heroSection.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('showcase-mode');
            });

            // Prevent cursor text when hovering over buttons inside hero
            const heroButtons = heroSection.querySelectorAll('a, button');
            heroButtons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    follower.classList.remove('showcase-mode');
                    follower.classList.add('hovered');
                });
                btn.addEventListener('mouseleave', () => {
                    follower.classList.remove('hovered');
                    follower.classList.add('showcase-mode');
                    if (cursorText) cursorText.textContent = "VIEW SHOWCASE";
                });
            });
        }
    }

    // ==========================================================================
    // 3. Interactive WebGL-Style Fluid Backdrop Canvas (with Neon Scratches)
    // ==========================================================================
    const canvas = document.getElementById('canvas-backdrop');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let sparks = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // 3a. Interactive "Scratch" Spark particle trail blueprint
        class ScratchSpark {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                
                // Random velocity with minor drag friction
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.8 + 0.8;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.drag = 0.96;
                
                // Neon scratch metrics: thin, rotating strokes
                this.length = Math.random() * 18 + 8;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.08;
                
                this.alpha = 1.0;
                this.decay = Math.random() * 0.02 + 0.015; // Smooth fade decay
                
                // Colors matched to cinematic cosmic aura-orbs: glowing violet, radiant cyan, hot pink, pure white
                const colors = ['#7000FF', '#00F0FF', '#FF007A', '#FFFFFF'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.lineWidth = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= this.drag;
                this.vy *= this.drag;
                
                this.rotation += this.rotationSpeed;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                
                // High-performance neon shadow glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                
                ctx.beginPath();
                ctx.moveTo(-this.length / 2, 0);
                ctx.lineTo(this.length / 2, 0);
                
                ctx.strokeStyle = this.color;
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
                
                ctx.restore();
            }
        }

        // Global mouse listener inside canvas block to spawn scratches
        window.addEventListener('mousemove', (e) => {
            if (!isMobile) {
                // Spawn glowing neon scratches dynamically
                const count = Math.random() < 0.35 ? 2 : 1;
                for (let i = 0; i < count; i++) {
                    sparks.push(new ScratchSpark(e.clientX, e.clientY));
                }
                
                // Cap the array for optimal memory and rendering performance
                if (sparks.length > 120) {
                    sparks.shift();
                }
            }
        });

        // 3b. Fluid Particle blueprint
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                // Organic sine wave parameter drift
                this.angle = Math.random() * Math.PI * 2;
                this.speed = Math.random() * 0.15 + 0.05;
                this.amplitude = Math.random() * 0.2 + 0.05;
                
                this.radius = Math.random() * 2.0 + 0.5;
                this.density = (Math.random() * 25) + 12;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
                ctx.fill();
            }

            update(mouseX, mouseY) {
                // Undulating drift using trigonometric wave vectors
                this.angle += 0.002;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.amplitude;

                // Bounce boundaries
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Elastic deflection away from cursor coordinate pull
                if (mouseX && mouseY && !isMobile) {
                    let dx = mouseX - this.x;
                    let dy = mouseY - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    // Interaction bounds
                    let maxDistance = 200;
                    let force = (maxDistance - distance) / maxDistance;
                    
                    if (distance < maxDistance) {
                        let directionX = forceDirectionX * force * this.density * 0.15;
                        let directionY = forceDirectionY * force * this.density * 0.15;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }
        }

        // Initialize particles
        const initParticles = () => {
            particles = [];
            const count = Math.min(Math.floor((width * height) / 16000), 90);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();
        window.addEventListener('resize', initParticles);

        // Core render cycle
        const animateCanvas = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connecting mesh vectors
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouse.x, mouse.y);
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 140) {
                        let alpha = (140 - dist) / 140 * 0.05;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.55;
                        ctx.stroke();
                    }
                }
            }

            // Draw and prune active scratch sparks
            for (let i = sparks.length - 1; i >= 0; i--) {
                const s = sparks[i];
                s.update();
                if (s.alpha <= 0) {
                    sparks.splice(i, 1);
                } else {
                    s.draw();
                }
            }

            requestAnimationFrame(animateCanvas);
        };
        animateCanvas();
    }

    // ==========================================================================
    // 4. Lenis Smooth Scroll Engine & GSAP Synchronization
    // ==========================================================================
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxury inertia easeOut
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1.0,
            smoothTouch: false,
            infinite: false
        });

        // Loop animation ticks
        const scrollRaf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(scrollRaf);
        };
        requestAnimationFrame(scrollRaf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // Lock scroll while preloader is running
        lenis.stop();
    }

    // ==========================================================================
    // 5. Preloader & Cinematic Entrance Timeline (Flashing Words)
    // ==========================================================================
    const preloader = document.getElementById('preloader');
    const loaderBar = document.querySelector('.loader-bar');
    const progressText = document.querySelector('.loader-progress');
    const flashWords = document.querySelectorAll('.loader-word');

    if (preloader && loaderBar && progressText && flashWords.length > 0) {
        let progress = 0;
        const duration = 2000;
        const intervalTime = 20;
        const step = 100 / (duration / intervalTime);

        const progressInterval = setInterval(() => {
            progress += step + (Math.random() * 2.5);
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                triggerEntrance();
            }
            
            const roundedProgress = Math.floor(progress);
            const paddedProgress = roundedProgress < 10 ? '0' + roundedProgress : roundedProgress;
            progressText.textContent = `${paddedProgress}%`;
            loaderBar.style.width = `${roundedProgress}%`;

            // Flash luxury concepts at milestones (0%, 20%, 40%, 60%, 80%)
            const wordIndex = Math.min(Math.floor(roundedProgress / 20), flashWords.length - 1);
            flashWords.forEach((word, idx) => {
                if (idx === wordIndex) {
                    word.classList.add('active');
                } else {
                    word.classList.remove('active');
                }
            });

        }, intervalTime);

        const triggerEntrance = () => {
            const entTimeline = gsap.timeline({
                onComplete: () => {
                    preloader.style.display = 'none';
                    if (lenis) lenis.start();
                }
            });

            // Slide out loading stats and panel layers
            entTimeline.to(['.loader-top-meta', '.loader-word-wrapper', '.loader-logo', '.loader-bar-bg', '.loader-progress'], {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: 'power3.in'
            });

            // Dual panels clip reveal
            entTimeline.to(preloader, {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                duration: 1.2,
                ease: 'power4.inOut'
            }, '-=0.2');

            // Fade in header navigation
            entTimeline.fromTo('.header-nav', {
                opacity: 0,
                y: -20
            }, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.4');

            // Hero typography letter sweep
            entTimeline.to('.hero-headline .word', {
                y: '0%',
                duration: 1.3,
                stagger: 0.12,
                ease: 'power4.out'
            }, '-=0.8');

            // Subtitle and taglines reveal
            entTimeline.fromTo('.hero-tagline-wrapper, .hero-subtitle, .hero-actions', {
                opacity: 0,
                y: 20
            }, {
                opacity: 1,
                y: 0,
                duration: 1.0,
                stagger: 0.15,
                ease: 'power3.out'
            }, '-=0.9');
        };
    } else {
        if (lenis) lenis.start();
    }

    // ==========================================================================
    // 6. Sticky Navbar Scrolled State & Section Highlighting (Hero Scroll Indicator Removed)
    // ==========================================================================
    const header = document.querySelector('.header-nav');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Toggle sticky state border and background opacity
        if (scrollPos > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Highlight active link based on scroll coordinate range
        let currentSectionId = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Smooth navigation anchor clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection && lenis) {
                const scrollOffset = window.innerWidth > 991 ? -120 : -70;
                lenis.scrollTo(targetSection, { offset: scrollOffset });
            }
        });
    });

    // Mobile Navigation Toggle drawer mechanics
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileDrawer) {
        const toggleMobileMenu = () => {
            mobileToggle.classList.toggle('open');
            mobileDrawer.classList.toggle('open');
            
            if (mobileDrawer.classList.contains('open')) {
                if (lenis) lenis.stop();
            } else {
                if (lenis) lenis.start();
            }
        };

        mobileToggle.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                toggleMobileMenu();
                
                if (targetSection && lenis) {
                    setTimeout(() => {
                        const scrollOffset = window.innerWidth > 991 ? -120 : -70;
                        lenis.scrollTo(targetSection, { offset: scrollOffset });
                    }, 500);
                }
            });
        });
    }

    // ==========================================================================
    // 7. Magnetic Button Force Physics
    // ==========================================================================
    const magneticBtns = document.querySelectorAll('.btn-magnetic');
    
    if (!isMobile) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - (rect.width / 2);
                const y = e.clientY - rect.top - (rect.height / 2);
                
                gsap.to(btn, {
                    x: x * 0.35,
                    y: y * 0.35,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                const label = btn.querySelector('span, i');
                if (label) {
                    gsap.to(label, {
                        x: x * 0.15,
                        y: y * 0.15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.4)"
                });
                
                const label = btn.querySelector('span, i');
                if (label) {
                    gsap.to(label, {
                        x: 0,
                        y: 0,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.4)"
                    });
                }
            });
        });
    }

    // ==========================================================================
    // 8. Services Card Accordion & Height Transition
    // ==========================================================================
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        const header = card.querySelector('.service-card-header');
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            
            serviceCards.forEach(otherCard => {
                otherCard.classList.remove('active');
            });

            if (!isActive) {
                card.classList.add('active');
            }
            
            setTimeout(() => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 600);
        });
    });

    // ==========================================================================
    // 9. GSAP ScrollTrigger Cinematic Horizontal Pin Scroll
    // ==========================================================================
    if (typeof ScrollTrigger !== 'undefined' && !isMobile) {
        const scrollContainer = document.getElementById('projects-horizontal-scroll');
        
        if (scrollContainer) {
            // GSAP Pin and slide horizontally on vertical scroll
            gsap.to(scrollContainer, {
                x: () => -(scrollContainer.scrollWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: '.projects-section',
                    pin: true,
                    scrub: 1.0,
                    start: 'top top',
                    end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
                    invalidateOnRefresh: true,
                    // Refresh triggers when coordinates update
                    onUpdate: (self) => {
                        // Refresh cursor view tags if scrolling shifts elements elastically
                    }
                }
            });
            
            // Subtle mockups parallax shift inside cards
            const mockups = document.querySelectorAll('.project-mockup-content');
            mockups.forEach(mockup => {
                gsap.to(mockup, {
                    xPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.projects-section',
                        scrub: true,
                        start: 'top bottom',
                        end: 'bottom top'
                    }
                });
            });
        }
    }

    // ==========================================================================
    // 10. GSAP ScrollTrigger Reveals (Cinematic Cascades)
    // ==========================================================================
    if (typeof ScrollTrigger !== 'undefined') {
        const scrollSections = document.querySelectorAll('.scroll-reveal-section');
        scrollSections.forEach(sec => {
            gsap.fromTo(sec, {
                opacity: 0,
                y: 60
            }, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sec,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });
    } else {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.scroll-reveal-section').forEach(sec => {
            observer.observe(sec);
        });
    }

    // ==========================================================================
    // 11. Scroll Triggered Ticker Stats Counters
    // ==========================================================================
    const statsItems = document.querySelectorAll('.stat-item');
    
    if (typeof ScrollTrigger !== 'undefined') {
        statsItems.forEach(item => {
            const numEl = item.querySelector('.stat-number');
            const target = parseInt(numEl.getAttribute('data-target'), 10);
            
            const countObj = { val: 0 };
            
            gsap.to(countObj, {
                val: target,
                duration: 2.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate: () => {
                    numEl.textContent = Math.floor(countObj.val);
                }
            });
        });
    } else {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const numEl = entry.target.querySelector('.stat-number');
                    const target = parseInt(numEl.getAttribute('data-target'), 10);
                    let start = 0;
                    const duration = 1500;
                    const step = Math.ceil(target / (duration / 30));
                    
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= target) {
                            numEl.textContent = target;
                            clearInterval(timer);
                        } else {
                            numEl.textContent = start;
                        }
                    }, 30);
                    
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsItems.forEach(item => {
            counterObserver.observe(item);
        });
    }

    // ==========================================================================
    // 12. Testimonials Slider Carousel & Progress Bar Fill
    // ==========================================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.getElementById('slider-dots');
    const prevBtn = document.getElementById('btn-prev-slide');
    const nextBtn = document.getElementById('btn-next-slide');
    const progressFill = document.getElementById('slider-progress-fill');
    let currentSlide = 0;

    if (slides.length > 0) {
        const dots = document.querySelectorAll('.slider-dot');

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');

            // Update Progress Bar Fill percentage (e.g. 1st slide -> 33.33%, 2nd slide -> 66.66%, 3rd slide -> 100%)
            if (progressFill) {
                const percentage = ((currentSlide + 1) / slides.length) * 100;
                progressFill.style.width = `${percentage}%`;
            }
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
            });
        });

        // Initialize progress bar width on load
        showSlide(0);
    }

    // ==========================================================================
    // 13. FAQ Accordion Heights & Rotates
    // ==========================================================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        const body = item.querySelector('.faq-body');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-body').style.maxHeight = 0;
            });

            if (!isActive) {
                item.classList.add('active');
                body.style.maxHeight = body.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                body.style.maxHeight = 0;
            }

            setTimeout(() => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 600);
        });
    });

    // ==========================================================================
    // 14. High-End Contact Form Logic with Transmission Overlay
    // ==========================================================================
    const form = document.getElementById('contact-form');
    const successOverlay = document.getElementById('form-success');
    const submitBtn = document.getElementById('btn-form-submit');

    if (form && successOverlay) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const groups = form.querySelectorAll('.form-group');

            groups.forEach(group => {
                const input = group.querySelector('.form-input');
                if (input) {
                    if (input.required && !input.value.trim()) {
                        group.classList.add('invalid');
                        isValid = false;
                    } else if (input.type === 'email' && input.value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value.trim())) {
                            group.classList.add('invalid');
                            isValid = false;
                        } else {
                            group.classList.remove('invalid');
                        }
                    } else {
                        group.classList.remove('invalid');
                    }
                }
            });

            groups.forEach(group => {
                const input = group.querySelector('.form-input');
                if (input) {
                    input.addEventListener('focus', () => {
                        group.classList.remove('invalid');
                    });
                }
            });

            if (isValid) {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.querySelector('span').textContent = 'TRANSMITTING...';
                }

                setTimeout(() => {
                    successOverlay.classList.add('show');
                    form.reset();
                    
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.querySelector('span').textContent = 'Transmit Brief';
                        }
                    }, 1000);
                }, 1500);
            }
        });

        successOverlay.addEventListener('click', () => {
            successOverlay.classList.remove('show');
        });
    }

    // ==========================================================================
    // 15. Cinematic Showreel Video Theater Logic
    // ==========================================================================
    const playShowreelBtn = document.getElementById('btn-play-showreel');
    const closeTheaterBtn = document.getElementById('btn-close-theater');
    const theaterModal = document.getElementById('showreel-theater');
    const showreelVideo = document.getElementById('showreel-video');
    const muteBtn = document.getElementById('btn-video-mute');
    const muteIcon = document.getElementById('mute-icon');

    if (playShowreelBtn && closeTheaterBtn && theaterModal && showreelVideo) {
        
        playShowreelBtn.addEventListener('click', () => {
            theaterModal.classList.add('active');
            showreelVideo.play();
            if (lenis) lenis.stop(); // Lock page scrolling
            
            // Sync with Custom Cursor Follower text
            const follower = document.getElementById('custom-cursor-follower');
            if (follower) {
                follower.classList.add('hovered');
            }
        });

        const closeTheater = () => {
            theaterModal.classList.remove('active');
            showreelVideo.pause();
            showreelVideo.currentTime = 0;
            if (lenis) lenis.start(); // Unlock page scrolling
        };

        closeTheaterBtn.addEventListener('click', closeTheater);
        theaterModal.querySelector('.theater-backdrop').addEventListener('click', closeTheater);

        // Escape Key close support
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && theaterModal.classList.contains('active')) {
                closeTheater();
            }
        });

        // Mute / Unmute controller
        if (muteBtn && muteIcon) {
            muteBtn.addEventListener('click', () => {
                showreelVideo.muted = !showreelVideo.muted;
                if (showreelVideo.muted) {
                    muteIcon.setAttribute('data-lucide', 'volume-x');
                } else {
                    muteIcon.setAttribute('data-lucide', 'volume-2');
                }
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons(); // Redraw Lucide vectors
                }
            });
        }
    }

    // ==========================================================================
    // 16. Click-to-Spawn Floating AI Graphic (The "Aura Image Spark" Effect)
    // ==========================================================================
    const clickPoolImages = ['vespera.png', 'ethera.png', 'lumen.png'];
    let imagePoolIndex = 0;

    window.addEventListener('click', (e) => {
        // Prevent spawning when clicking on interactive assets
        if (e.target.closest('a, button, input, textarea, label, .service-card-header, .faq-header, .slider-dot, #mobile-toggle')) {
            return;
        }

        // Spawn a glassmorphic floating image
        const imgPath = clickPoolImages[imagePoolIndex];
        imagePoolIndex = (imagePoolIndex + 1) % clickPoolImages.length;

        const container = document.createElement('div');
        container.className = 'floating-click-image';
        container.style.left = `${e.clientX}px`;
        container.style.top = `${e.clientY}px`;

        const imgEl = document.createElement('img');
        imgEl.src = imgPath;
        if (imgPath === 'lumen.png') {
            imgEl.className = 'lumen-hue-filter';
        }
        
        container.appendChild(imgEl);
        document.body.appendChild(container);

        // High-end cinematic float reveal and fade with GSAP
        const randomRotate = (Math.random() - 0.5) * 35; // Random tilt between -17.5 and 17.5 degrees
        const floatUpOffset = 70 + Math.random() * 40;   // Random float up distance

        gsap.timeline({
            onComplete: () => container.remove()
        })
        .fromTo(container, {
            scale: 0.15,
            opacity: 0,
            rotation: randomRotate * 0.4,
            filter: 'blur(15px)'
        }, {
            scale: 1,
            opacity: 0.8,
            rotation: randomRotate,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power2.out'
        })
        .to(container, {
            y: -floatUpOffset,
            opacity: 0,
            scale: 0.85,
            rotation: randomRotate + (Math.random() - 0.5) * 10,
            duration: 0.8,
            ease: 'power2.in',
            delay: 0.3
        });
    });

    // ==========================================================================
    // 17. Cinematic Project Case Details Drawer Logic
    // ==========================================================================
    const caseDrawer = document.getElementById('case-drawer');
    const closeDrawerBtn = document.getElementById('btn-close-drawer');
    const drawerBackdrop = document.getElementById('case-drawer-backdrop');
    
    // Dynamic project content data sets
    const caseData = {
        'proj-vespera': {
            title: 'VESPERA OS',
            category: 'SYSTEMS ARCHITECTURE / DIGITAL UI',
            year: '2026',
            client: 'VESPERA Corp',
            specs: 'Spatial UI/UX, Premium WebGL Shader Engine, Performance Telemetry',
            image: 'vespera.png',
            desc1: 'Vespera OS was commissioned to conceptualize a cinematic operating system dashboard for next-generation digital terminals. The client required extreme UI density, zero interface latency, and a spatial dark velvet layout that feels highly futuristic.',
            desc2: 'We built a micro-engineered frontend architecture using high-performance drawing loops, canvas graphs, and responsive matrix transformations. The resulting dashboard achieves 120 FPS performance while displaying real-time digital latency feeds and visual diagnostic grids.'
        },
        'proj-ethera': {
            title: 'ETHERA INHALATION',
            category: 'SPATIAL BRANDING / E-COMMERCE',
            year: '2026',
            client: 'ETHERA Fragrance Group',
            specs: 'Art & Editorial Direction, Liquid Motion Design, E-Commerce Systems',
            image: 'ethera.png',
            desc1: 'Ethera Inhalation represents the absolute intersection of biological essence and sensory web art. The design brief called for an ultra-luxury editorial website to launch their signature botanical vapor series.',
            desc2: 'To capture the weightlessness of mist and fragrance, we engineered a floating canvas fluid mesh backdrop that deflects on cursor movements, paired with a custom horizontal scrolling panner. This draws the viewer into a cinematic editorial journey, shifting consumer purchasing from a standard transaction into a rich visual experience.'
        },
        'proj-lumen': {
            title: 'LUMEN ARCHITECTURAL',
            category: 'MINIMALIST COMMERCE / EDITORIAL',
            year: '2025',
            client: 'LUMEN Group',
            specs: 'Geometric Front-End, Design Tokens, Spatial Interface Direction',
            image: 'lumen.png',
            desc1: 'Lumen Architectural stands as a monument to minimalist structural design. Stripped of all compromise and visual noise, it showcases premium spatial layouts, contrasting typography weights, and delicate geometric divisions.',
            desc2: 'The frontend utilizes high-end GSAP clip-path animations, image transitions shifting from heavy blurring to absolute sharpness on scrolling, and an ambient golden-amber color scheme. The interface acts as a digital gallery, emphasizing pure spacing and structural proportions above all else.'
        }
    };

    if (caseDrawer) {
        // Select all slide cards
        const projectCards = document.querySelectorAll('.project-slide-card');
        
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Find slide parent ID (proj-vespera, proj-ethera, proj-lumen)
                const slideParent = card.closest('.project-slide');
                if (!slideParent) return;
                
                const slideId = slideParent.getAttribute('id');
                const data = caseData[slideId];
                
                if (data) {
                    // Populate case drawer elements dynamically
                    const heroImg = document.getElementById('drawer-hero-img');
                    if (heroImg) {
                        heroImg.src = data.image;
                        // Toggle hue filter on Lumen image
                        if (data.image === 'lumen.png') {
                            heroImg.className = 'lumen-hue-filter';
                        } else {
                            heroImg.className = '';
                        }
                    }
                    
                    const caseCategory = document.getElementById('drawer-case-category');
                    if (caseCategory) caseCategory.textContent = data.category;

                    const caseTitle = document.getElementById('drawer-case-title');
                    if (caseTitle) caseTitle.textContent = data.title;

                    const caseYear = document.getElementById('drawer-case-year');
                    if (caseYear) caseYear.textContent = data.year;

                    const caseClient = document.getElementById('drawer-case-client');
                    if (caseClient) caseClient.textContent = data.client;

                    const caseSpecs = document.getElementById('drawer-case-specs');
                    if (caseSpecs) caseSpecs.textContent = data.specs;

                    const caseDesc1 = document.getElementById('drawer-case-desc1');
                    if (caseDesc1) caseDesc1.textContent = data.desc1;

                    const caseDesc2 = document.getElementById('drawer-case-desc2');
                    if (caseDesc2) caseDesc2.textContent = data.desc2;
                    
                    // Redraw lucide icons in CTA if any
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                    
                    // Activate drawer
                    caseDrawer.classList.add('active');
                    if (lenis) lenis.stop(); // Lock page scroll
                }
            });
        });

        // Close drawer actions
        const closeCaseDrawer = () => {
            caseDrawer.classList.remove('active');
            if (lenis) lenis.start(); // Unlock page scroll
        };

        if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeCaseDrawer);
        if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeCaseDrawer);

        // Escape Key support
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && caseDrawer.classList.contains('active')) {
                closeCaseDrawer();
            }
        });

        // Dynamic click action on commission button to scroll to contact
        const commissionBtn = document.getElementById('btn-drawer-cta');
        if (commissionBtn) {
            commissionBtn.addEventListener('click', () => {
                closeCaseDrawer();
                const contactSection = document.getElementById('contact');
                if (contactSection && lenis) {
                    setTimeout(() => {
                        const scrollOffset = window.innerWidth > 991 ? -120 : -70;
                        lenis.scrollTo(contactSection, { offset: scrollOffset });
                    }, 500);
                }
            });
        }
    }

    // ==========================================================================
    // 18. Premium Scroll-Triggered Clip-Path reveals
    // ==========================================================================
    if (typeof ScrollTrigger !== 'undefined') {
        const revealImages = document.querySelectorAll('.project-image-wrapper');
        
        revealImages.forEach(wrap => {
            gsap.fromTo(wrap, {
                clipPath: isMobile ? 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                scale: 0.95,
                opacity: 0.4
            }, {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: wrap,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // ==========================================================================
    // 19. Sensory Archive Gallery Scroll Triggers & Parallax Float
    // ==========================================================================
    if (typeof ScrollTrigger !== 'undefined') {
        const sensoryNodes = document.querySelectorAll('.sensory-node-card');
        
        sensoryNodes.forEach(node => {
            // Emergence fade-in & scale reveal on scroll entrance
            gsap.fromTo(node, {
                opacity: 0,
                y: 100,
                scale: 0.9,
                filter: 'blur(10px)'
            }, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                duration: 1.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: node,
                    start: 'top 92%',
                    onEnter: () => node.classList.add('emerged')
                }
            });

            // Parallax floating shift bound to scroll position
            if (!isMobile) {
                gsap.to(node, {
                    yPercent: -15,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: node,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.2
                    }
                });
            }

            // Card Hover SVG Circular Score Animation
            if (!isMobile) {
                const fillPaths = node.querySelectorAll('.circle-fill');
                
                node.addEventListener('mouseenter', () => {
                    fillPaths.forEach(path => {
                        const targetScore = parseFloat(path.getAttribute('data-target-score'));
                        // Spin and fill SVG circle using GSAP
                        gsap.fromTo(path, {
                            strokeDasharray: '0, 100'
                        }, {
                            strokeDasharray: `${targetScore}, 100`,
                            duration: 1.2,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });
                        
                        // Count up score numbers inside dials
                        const scoreNumEl = path.closest('.score-dial-item').querySelector('.score-number');
                        if (scoreNumEl) {
                            const scoreVal = { val: 0 };
                            const finalScore = targetScore / 10;
                            gsap.fromTo(scoreVal, {
                                val: 0
                            }, {
                                val: finalScore,
                                duration: 1.2,
                                ease: 'power2.out',
                                onUpdate: () => {
                                    scoreNumEl.textContent = scoreVal.val.toFixed(1);
                                }
                            });
                        }
                    });
                });
                
                node.addEventListener('mouseleave', () => {
                    fillPaths.forEach(path => {
                        gsap.to(path, {
                            strokeDasharray: '0, 100',
                            duration: 0.5,
                            ease: 'power2.inOut',
                            overwrite: 'auto'
                        });
                        
                        const scoreNumEl = path.closest('.score-dial-item').querySelector('.score-number');
                        if (scoreNumEl) {
                            const finalScore = parseFloat(path.getAttribute('data-target-score')) / 10;
                            scoreNumEl.textContent = finalScore.toFixed(1);
                        }
                    });
                });
            }
        });
    }

    // ==========================================================================
    // 20. Cinematic Sensory Detail Modal & Dynamic Audio Engine
    // ==========================================================================
    const sensoryModal = document.getElementById('sensory-modal');
    const closeSensoryBtn = document.getElementById('btn-close-sensory');
    const sensoryBackdrop = document.getElementById('sensory-modal-backdrop');
    
    // Web Audio Synthesizer Engine (Self-contained, luxury audio waves)
    let sensoryAudioCtx;
    const playSensoryChord = (frequencies, waveType = 'sine', duration = 1.6) => {
        try {
            if (!sensoryAudioCtx) {
                sensoryAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (sensoryAudioCtx.state === 'suspended') {
                sensoryAudioCtx.resume();
            }
            
            const now = sensoryAudioCtx.currentTime;
            frequencies.forEach(freq => {
                const osc = sensoryAudioCtx.createOscillator();
                const gain = sensoryAudioCtx.createGain();
                
                osc.type = waveType;
                osc.frequency.setValueAtTime(freq, now);
                
                // Luxury frequency glide
                osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration);
                
                // Luxury soft envelope fade
                gain.gain.setValueAtTime(0.05 / frequencies.length, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
                
                osc.connect(gain);
                gain.connect(sensoryAudioCtx.destination);
                
                osc.start(now);
                osc.stop(now + duration);
            });
        } catch (e) {
            console.warn('Audio API synthesis blocked or unsupported by browser client policies.');
        }
    };

    // Modal data sets mapping
    const sensoryData = {
        'node-ethera': {
            title: 'ETHERA FLUID',
            badge: '04.A / MEMBRANE PROTOCOL',
            img: 'ethera.png',
            glowColor: 'radial-gradient(circle, rgba(0, 240, 255, 0.4) 0%, transparent 70%)',
            intensity: '120 FPS MEMBRANE LIQUID',
            audio: 'CYAN COORD CHORD (220Hz / 330Hz)',
            highlight: 'An exploration of fluid weightlessness and organic deflections.',
            body: 'Inspired by botanical dispersion, this experience uses mathematical vector grids and elastic cursor friction. When the user interacts, the particle mesh bends and deflects, creating an ambient visual membrane that simulates luxury organic chemistry in real-time.',
            frequencies: [220, 330],
            wave: 'triangle',
            isHueFilter: false,
            isVioletFilter: false,
            scores: { des: 9.4, cre: 9.7, usa: 9.1, con: 9.3 }
        },
        'node-vespera': {
            title: 'VESPERA CORE',
            badge: '04.B / TELEMETRY NODE',
            img: 'vespera.png',
            glowColor: 'radial-gradient(circle, rgba(112, 0, 255, 0.4) 0%, transparent 70%)',
            intensity: 'ZERO DENSITY LATENCY PROTOCOL',
            audio: 'VELVET VIOLET SWEEP (147Hz / 294Hz)',
            highlight: 'An operational dashboard displaying hyper-detailed telemetry diagnostic feeds.',
            body: 'Built with micro-engineered drawing loops and hardware-accelerated grid arrays. This console features real-time FPS monitors, pixel-perfect latency graphs, and dynamic numeric counters, presenting diagnostic telemetry in a striking, ultra-minimal cosmic design.',
            frequencies: [147, 294],
            wave: 'sine',
            isHueFilter: false,
            isVioletFilter: false,
            scores: { des: 9.2, cre: 9.4, usa: 9.6, con: 8.9 }
        },
        'node-lumen': {
            title: 'LUMEN GOLD',
            badge: '04.C / ARCHITECTURAL GEOMETRY',
            img: 'lumen.png',
            glowColor: 'radial-gradient(circle, rgba(255, 170, 0, 0.35) 0%, transparent 70%)',
            intensity: 'GEOMETRIC SYMMETRY REFRACT',
            audio: 'GOLDEN AMBER DRIFT (196Hz / 293.6Hz)',
            highlight: 'Stripped of all redundancy to focus on pure structural proportions.',
            body: 'A digital architectural gallery centered around luxury typography weights, bold contrasting divisions, and an elegant golden-amber hue-shift filter. It represents visual silence in its most perfect physical and digital manifestation.',
            frequencies: [196, 293.66],
            wave: 'sine',
            isHueFilter: true,
            isVioletFilter: false,
            scores: { des: 9.6, cre: 9.2, usa: 9.0, con: 9.4 }
        },
        'node-aurora': {
            title: 'AURORA GLITCH',
            badge: '04.D / COSMIC MATRIX',
            img: 'vespera.png',
            glowColor: 'radial-gradient(circle, rgba(255, 0, 122, 0.35) 0%, transparent 70%)',
            intensity: '100% RESPONSIVE SYNTHESIS',
            audio: 'MATRIX NOISE SWEET (165Hz / 247.5Hz)',
            highlight: 'A beautiful glitching synthesis celebrating synthetic interactive textures.',
            body: 'Using digital matrix scanlines, neon violet chromatic aberration, and dynamic glitch states, this card represents the intersection between structural code and random organic degradation. Interactive buttons allow triggering custom scanner effects dynamically.',
            frequencies: [165, 247.5],
            wave: 'sawtooth',
            isHueFilter: false,
            isVioletFilter: true,
            scores: { des: 9.1, cre: 9.6, usa: 9.3, con: 9.2 }
        }
    };

    let activeNodeId = null;

    if (sensoryModal) {
        const nodes = document.querySelectorAll('.sensory-node-card');
        
        nodes.forEach(card => {
            card.addEventListener('click', () => {
                const nodeId = card.getAttribute('data-sensory-id');
                const data = sensoryData[nodeId];
                
                if (data) {
                    activeNodeId = nodeId;
                    
                    // Populate modal contents
                    const modalImg = document.getElementById('sensory-modal-img');
                    const modalGlow = sensoryModal.querySelector('.sensory-modal-glow');
                    const modalBadge = document.getElementById('sensory-modal-badge');
                    const modalTitle = document.getElementById('sensory-modal-title');
                    const modalSpecIntensity = document.getElementById('sensory-modal-spec-intensity');
                    const modalSpecAudio = document.getElementById('sensory-modal-spec-audio');
                    const modalDescHighlight = document.getElementById('sensory-modal-desc-highlight');
                    const modalDescBody = document.getElementById('sensory-modal-desc-body');
                    
                    if (modalImg) {
                        modalImg.src = data.img;
                        // Apply filters
                        if (data.isHueFilter) {
                            modalImg.className = 'lumen-hue-filter';
                        } else if (data.isVioletFilter) {
                            modalImg.className = 'aurora-violet-filter';
                        } else {
                            modalImg.className = '';
                        }
                    }
                    
                    if (modalGlow) {
                        modalGlow.style.background = data.glowColor;
                    }
                    
                    if (modalBadge) modalBadge.textContent = data.badge;
                    if (modalTitle) modalTitle.textContent = data.title;
                    if (modalSpecIntensity) modalSpecIntensity.textContent = data.intensity;
                    if (modalSpecAudio) modalSpecAudio.textContent = data.audio;
                    if (modalDescHighlight) modalDescHighlight.textContent = data.highlight;
                    if (modalDescBody) modalDescBody.textContent = data.body;
                    
                    // Reset modal score indicators immediately
                    const categories = ['des', 'cre', 'usa', 'con'];
                    categories.forEach(cat => {
                        const circle = document.getElementById(`modal-circle-${cat}`);
                        const num = document.getElementById(`modal-val-${cat}`);
                        if (circle) circle.setAttribute('stroke-dasharray', '0, 100');
                        if (num) num.textContent = '0.0';
                    });

                    // Make sure glitch state is cleared initially
                    sensoryModal.classList.remove('glitch-active');
                    
                    // Open Modal with high-performance ease
                    sensoryModal.classList.add('active');
                    if (lenis) lenis.stop(); // Lock main page scroll
                    
                    // Animate scorecard rating dials inside modal
                    if (data.scores) {
                        categories.forEach((cat, index) => {
                            const circle = document.getElementById(`modal-circle-${cat}`);
                            const scoreEl = document.getElementById(`modal-val-${cat}`);
                            const targetVal = data.scores[cat]; // e.g. 9.4
                            
                            if (circle && scoreEl) {
                                // Spin & fill SVG circle using GSAP
                                gsap.fromTo(circle, {
                                    strokeDasharray: '0, 100'
                                }, {
                                    strokeDasharray: `${targetVal * 10}, 100`,
                                    duration: 1.4,
                                    delay: 0.35 + index * 0.1,
                                    ease: 'power3.out',
                                    overwrite: 'auto'
                                });
                                
                                // Count up text numbers inside dials
                                const scoreVal = { val: 0 };
                                gsap.fromTo(scoreVal, {
                                    val: 0
                                }, {
                                    val: targetVal,
                                    duration: 1.4,
                                    delay: 0.35 + index * 0.1,
                                    ease: 'power3.out',
                                    onUpdate: () => {
                                        scoreEl.textContent = scoreVal.val.toFixed(1);
                                    },
                                    overwrite: 'auto'
                                });
                            }
                        });
                    }

                    // Play introductory luxury chord
                    playSensoryChord(data.frequencies, data.wave, 1.8);
                }
            });
        });

        // Close Modal handler
        const closeSensoryModal = () => {
            sensoryModal.classList.remove('active');
            sensoryModal.classList.remove('glitch-active');
            if (lenis) lenis.start(); // Unlock main page scroll
            activeNodeId = null;

            // Reset modal score indicators to zero on close
            const categories = ['des', 'cre', 'usa', 'con'];
            categories.forEach(cat => {
                const circle = document.getElementById(`modal-circle-${cat}`);
                const num = document.getElementById(`modal-val-${cat}`);
                if (circle) gsap.set(circle, { strokeDasharray: '0, 100' });
                if (num) num.textContent = '0.0';
            });
        };

        if (closeSensoryBtn) closeSensoryBtn.addEventListener('click', closeSensoryModal);
        if (sensoryBackdrop) sensoryBackdrop.addEventListener('click', closeSensoryModal);

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sensoryModal.classList.contains('active')) {
                closeSensoryModal();
            }
        });

        // Glitch Mode Toggler with dynamic digital glitches
        const btnGlitch = document.getElementById('btn-glitch-mode');
        if (btnGlitch) {
            btnGlitch.addEventListener('click', () => {
                sensoryModal.classList.toggle('glitch-active');
                
                if (sensoryModal.classList.contains('glitch-active')) {
                    // Play short, high-fidelity neon glitch beep sweeps
                    playSensoryChord([440, 660, 880], 'sawtooth', 0.25);
                } else {
                    playSensoryChord([220, 330], 'sine', 0.3);
                }
            });
        }

        // Dynamic Audio Sweep button
        const btnAudio = document.getElementById('btn-sensory-audio-toggle');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                if (activeNodeId) {
                    const data = sensoryData[activeNodeId];
                    if (data) {
                        // Play a deeper, lingering sensory sound swell
                        playSensoryChord(data.frequencies.map(f => f * 0.5), data.wave, 2.2);
                        playSensoryChord(data.frequencies, data.wave, 2.0);
                    }
                }
            });
        }
    }

});
