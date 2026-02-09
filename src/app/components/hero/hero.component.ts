import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { SliderService } from '../../services/slider.service';
import { SliderImage } from '../../models/slider-image.interface';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = 0;
  slides: { src: string; alt: string; id?: string; preloaded?: boolean }[] = [];
  isLoading = true;
  
  private slideInterval?: number;
  private touchStartX = 0;
  private touchEndX = 0;
  private isInitialized = false;
  private isFirstLoad = true;

  constructor(
    private sliderService: SliderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.isLoading = true;
    this.sliderService.getSliders().subscribe({
      next: (sliderImages: SliderImage[]) => {
        this.slides = sliderImages.map((img, index) => ({
          src: img.url,
          alt: img.alt || img.originalName,
          id: img._id,
          preloaded: index === 0 // Preload first image
        }));
        this.isLoading = false;
        // Set first slide as active immediately
        if (this.slides.length > 0) {
          this.currentSlide = 0;
          this.preloadImage(this.slides[0].src);
          // Force change detection to update the view immediately
          this.cdr.detectChanges();
          // Initialize slider immediately without delay
          this.initializeSlider();
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
          this.currentSlide = 0;
          this.cdr.detectChanges();
          this.initializeSlider();
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize immediately if slides are already loaded
    if (this.slides.length > 0 && !this.isInitialized) {
      this.initializeSlider();
    }
  }

  private initializeSlider(): void {
    if (this.isInitialized) return;
    
    // Get all slides
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) {
      // Retry if slides aren't ready yet
      requestAnimationFrame(() => {
        setTimeout(() => this.initializeSlider(), 10);
      });
      return;
    }
    
    this.isInitialized = true;
    
    // Ensure first slide is active immediately
    if (this.currentSlide >= 0 && this.currentSlide < slides.length) {
      const firstSlide = slides[this.currentSlide] as HTMLElement;
      // Add active class immediately for first load (no transition delay)
      if (this.isFirstLoad) {
        firstSlide.classList.add('active', 'initial-load');
        this.isFirstLoad = false;
      } else {
        firstSlide.classList.add('active');
      }
    }
    
    // Start auto-play after initial animation
    setTimeout(() => {
      this.startAutoPlay();
    }, 6000);
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

  private preloadImage(src: string): void {
    const img = new Image();
    img.src = src;
  }

  getImageSrc(slide: { src: string; alt: string; id?: string; preloaded?: boolean }, index: number): string {
    // Always use original image URL for home slider
    return slide.src;
  }

  isSlideActive(index: number): boolean {
    return index === this.currentSlide;
  }

  onSlideImageLoad(index: number): void {
    // Image loaded successfully
    if (index === this.currentSlide) {
      // Remove initial-load class after first image loads to enable transitions
      const slides = document.querySelectorAll('.hero-slide');
      if (slides[index]) {
        slides[index].classList.remove('initial-load');
      }
      // Preload next slide for smoother transition
      const nextIndex = (index + 1) % this.slides.length;
      if (this.slides[nextIndex] && !this.slides[nextIndex].preloaded) {
        this.preloadImage(this.getImageSrc(this.slides[nextIndex], nextIndex));
        this.slides[nextIndex].preloaded = true;
      }
    }
  }

  onSlideImageError(slide: { src: string; alt: string; id?: string }, index: number): void {
    // Fallback to original src if dynamic resizing fails
    if (slide.id && slide.src !== this.getImageSrc(slide, index)) {
      // Retry with original src
      const img = document.querySelector(`.hero-slide:nth-child(${index + 1}) img`) as HTMLImageElement;
      if (img) {
        img.src = slide.src;
      }
    }
  }
}

