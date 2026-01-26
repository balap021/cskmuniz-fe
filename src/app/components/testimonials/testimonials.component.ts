import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Testimonial } from '../../models/testimonial.interface';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  testimonials: Testimonial[] = [
    {
      image: 'assets/images/testimonial-1.jpg',
      text: '"CSK Muniz Photography captured our wedding day perfectly. Every moment was preserved with such artistry and attention to detail. The results exceeded our expectations!"',
      author: 'Tamilrasan R'
    },
    {
      image: 'assets/images/testimonial-2.jpg',
      text: '"Professional, creative, and incredibly talented. The portrait session was comfortable and fun, and the final images are absolutely stunning."',
      author: 'Balakumar P'
    },
    {
      image: 'assets/images/testimonial-3.jpg',
      text: '"Working with CSK Muniz was a fantastic experience. They understood our brand vision perfectly and delivered commercial photography that truly represents our company."',
      author: 'Balaji bala'
    },
    {
      image: 'assets/images/testimonial-4.jpg',
      text: '"Exceptional work! The attention to detail and creative vision brought our family portraits to life in ways we never imagined."',
      author: 'Veerakumar A'
    },
    {
      image: 'assets/images/testimonial-5.jpg',
      text: '"From concept to final delivery, the entire process was seamless. The results speak for themselves - absolutely breathtaking work."',
      author: 'Vignesh Vinay'
    }
  ];

  currentSlide = 0;
  private slideInterval?: number;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngAfterViewInit(): void {
    // Wait for DOM to be ready
    setTimeout(() => {
      this.scrollToSlide(this.currentSlide);
    }, 100);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.scrollToSlide(index);
    this.restartAutoPlay();
  }

  private scrollToSlide(index: number): void {
    if (this.slider && this.slider.nativeElement) {
      const slides = this.slider.nativeElement.querySelectorAll('.testimonial-slide');
      if (slides[index]) {
        const slide = slides[index] as HTMLElement;
        const slideLeft = slide.offsetLeft - this.slider.nativeElement.offsetLeft;
        this.slider.nativeElement.scrollTo({
          left: slideLeft,
          behavior: 'smooth'
        });
      }
    }
  }

  private startAutoPlay(): void {
    this.stopAutoPlay();
    this.slideInterval = window.setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.testimonials.length;
      this.scrollToSlide(this.currentSlide);
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
}

