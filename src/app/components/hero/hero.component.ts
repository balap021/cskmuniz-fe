import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { SliderService } from '../../services/slider.service';
import { SliderImage } from '../../models/slider-image.interface';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  slides: { src: string; alt: string }[] = [];
  isLoading = true;
  
  private slideInterval?: number;
  private touchStartX = 0;
  private touchEndX = 0;
  private isInitialized = false;

  constructor(private sliderService: SliderService) {}

  ngOnInit(): void {
    // Start with no slide active to trigger initial animation
    this.currentSlide = -1;
    this.loadSliders();
  }

  loadSliders(): void {
    this.isLoading = true;
    this.sliderService.getSliders().subscribe({
      next: (sliderImages: SliderImage[]) => {
        this.slides = sliderImages.map(img => ({
          src: img.url,
          alt: img.alt || img.originalName
        }));
        this.isLoading = false;
        // Initialize slider after data is loaded
        if (this.slides.length > 0) {
          setTimeout(() => {
            this.initializeSlider();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error loading sliders:', error);
        this.isLoading = false;
        // Fallback to empty or default slides
        if (this.slides.length === 0) {
          this.slides = [
            { src: 'assets/images/slider-img1.jpg', alt: 'Modern Wedding Photography' },
            { src: 'assets/images/slider-img2.jpg', alt: 'Creative Photography Portfolio' },
            { src: 'assets/images/slider-img3.jpg', alt: 'Professional Photography Showcase' }
          ];
          setTimeout(() => {
            this.initializeSlider();
          }, 100);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      this.initializeSlider();
    }, 50);
  }

  private initializeSlider(): void {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    // Get all slides
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) {
      // Retry if slides aren't ready yet
      setTimeout(() => this.initializeSlider(), 100);
      return;
    }
    
    // Remove active from all slides first
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Force a reflow to ensure initial state is set
    void (slides[0] as HTMLElement).offsetHeight;
    
    // Now set first slide as active and trigger animation
    this.currentSlide = 0;
    
    // Use requestAnimationFrame to ensure the transition triggers
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slides[0].classList.add('active');
        
        // Start auto-play after initial animation
        setTimeout(() => {
          this.startAutoPlay();
        }, 6000);
      });
    });
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  showSlide(index: number): void {
    // Update current slide
    this.currentSlide = index;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.restartAutoPlay();
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.restartAutoPlay();
  }

  goToSlide(index: number): void {
    this.showSlide(index);
    this.restartAutoPlay();
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.slideInterval = window.setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = undefined;
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.stopAutoPlay();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.startAutoPlay();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  private handleSwipe(): void {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }
}

