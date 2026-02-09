import { Component, Input, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-responsive-image',
  templateUrl: './responsive-image.component.html',
  styleUrls: ['./responsive-image.component.css']
})
export class ResponsiveImageComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() src!: string;
  @Input() alt: string = '';
  @Input() sizes: string = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  @Input() lazy: boolean = true;
  @Input() priority: boolean = false; // For above-the-fold images
  @Input() imageId?: string | number; // Optional: ID for dynamic resizing
  @Input() imageType?: 'slider' | 'featured-work' | 'featured-work-image' | 'service'; // Optional: type for dynamic resizing
  
  @ViewChild('imgElement', { static: false }) imgElement?: ElementRef<HTMLImageElement>;
  
  isLoading = true;
  hasError = false;
  imageSrc = '';
  imageSrcset = '';
  observer?: IntersectionObserver;
  private apiUrl = environment.apiUrl;

  ngOnInit(): void {
    if (this.priority || !this.lazy) {
      this.loadImage();
    }
  }

  ngAfterViewInit(): void {
    if (this.lazy && !this.priority) {
      this.setupLazyLoading();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupLazyLoading(): void {
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for browsers without IntersectionObserver
      this.loadImage();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          if (this.observer) {
            this.observer.disconnect();
          }
        }
      });
    }, {
      rootMargin: '50px' // Start loading 50px before image enters viewport
    });

    // Observe after view init
    setTimeout(() => {
      if (this.imgElement?.nativeElement) {
        this.observer?.observe(this.imgElement.nativeElement);
      }
    }, 0);
  }

  private loadImage(): void {
    if (!this.src) {
      this.hasError = true;
      this.isLoading = false;
      return;
    }

    // If imageId and imageType are provided, use dynamic resizing endpoint
    if (this.imageId && this.imageType) {
      this.setupDynamicResizing();
    } else {
      // Fallback to original src
      this.imageSrc = this.src;
      this.imageSrcset = '';
    }
  }

  private setupDynamicResizing(): void {
    const baseUrl = `${this.apiUrl}/api/images/${this.imageType}/${this.imageId}`;
    
    // Create srcset for responsive images
    const srcsetParts: string[] = [];
    srcsetParts.push(`${baseUrl}/thumb 300w`);
    srcsetParts.push(`${baseUrl}/medium 800w`);
    srcsetParts.push(`${baseUrl}/large 1920w`);
    
    this.imageSrcset = srcsetParts.join(', ');
    this.imageSrc = `${baseUrl}/medium`; // Default fallback
  }

  onImageLoad(): void {
    this.isLoading = false;
    this.hasError = false;
  }

  onImageError(): void {
    this.isLoading = false;
    this.hasError = true;
    // Fallback to original src if dynamic resizing fails
    if (this.imageSrc !== this.src && this.imageSrc) {
      this.imageSrc = this.src;
      this.imageSrcset = '';
      // Retry with original src
      setTimeout(() => {
        this.hasError = false;
        this.isLoading = true;
      }, 100);
    }
  }
}

