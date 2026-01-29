/**
 * Main Interactive Logic
 */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScroll();
});

function initScrollAnimations() {
    // Animate elements on scroll
    gsap.utils.toArray('.bento-item').forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1
        });
    });

    // Animate comparison section
    gsap.from('.comparison-side.before', {
        scrollTrigger: {
            trigger: '.comparison',
            start: 'top 70%'
        },
        x: -50,
        opacity: 0,
        duration: 1
    });

    gsap.from('.comparison-side.after', {
        scrollTrigger: {
            trigger: '.comparison',
            start: 'top 70%'
        },
        x: 50,
        opacity: 0,
        duration: 1
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.metric-value');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 },
                    onUpdate: function () {
                        counter.innerHTML = Math.ceil(counter.innerHTML);
                    }
                });
            }
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: target,
                    ease: 'power2.inOut'
                });
            }
        });
    });
}
