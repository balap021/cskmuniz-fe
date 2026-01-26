import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollAnimationsService {
  private observer?: IntersectionObserver;

  constructor(private ngZone: NgZone) {}

  initScrollAnimations(): void {
    if (typeof window === 'undefined') return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      this.ngZone.run(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      });
    }, observerOptions);

      // Observe elements after a short delay to ensure DOM is ready
    setTimeout(() => {
      // Observe elements that already have animate-on-scroll class
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach((el) => {
        this.observer?.observe(el);
      });

      // Add stagger class to grid containers and observe them
      const staggerContainers = document.querySelectorAll('.gallery-grid, .services-showcase, .stats');
      staggerContainers.forEach((container) => {
        if (!container.classList.contains('stagger-children')) {
          container.classList.add('stagger-children');
        }
        this.observer?.observe(container);
      });
    }, 300);
  }

  initParallaxEffects(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('scroll', () => {
      this.ngZone.run(() => {
        const scrolled = window.scrollY;
        
        // Parallax for hero slider
        const heroSlider = document.querySelector('.hero-slider');
        if (heroSlider && scrolled < window.innerHeight) {
          const rate = scrolled * 0.15;
          (heroSlider as HTMLElement).style.transform = `translateY(${rate}px)`;
        }

        // Parallax for hero images
        const heroSlides = document.querySelectorAll('.hero-slide img');
        if (scrolled < window.innerHeight) {
          heroSlides.forEach((img) => {
            (img as HTMLElement).style.transform = `scale(${1 + scrolled * 0.0002}) translateY(${scrolled * 0.3}px)`;
          });
        }

        // Parallax for about image
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
          const aboutRect = (aboutImage as HTMLElement).getBoundingClientRect();
          if (aboutRect.top < window.innerHeight && aboutRect.bottom > 0) {
            const rate = (aboutRect.top - window.innerHeight / 2) * 0.05;
            (aboutImage as HTMLElement).style.transform = `translateY(${rate}px)`;
          }
        }
      });
    });
  }

  cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

