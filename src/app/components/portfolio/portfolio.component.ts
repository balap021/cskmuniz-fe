import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { FeaturedWorkService } from '../../services/featured-work.service';
import { PortfolioCategoryType, PortfolioCategory, PortfolioItem } from '../../models/portfolio-item.interface';
import { FeaturedWork, FeaturedWorkImage } from '../../models/featured-work.interface';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  featuredItems: any[] = [];
  featuredWorks: FeaturedWork[] = [];
  isLoading = false;

  showCategoryModal = false;
  showImageViewer = false;
  showInternalImagesModal = false;
  showEnlargedImageModal = false;
  currentCategory: PortfolioCategory | null = null;
  currentCategoryType: PortfolioCategoryType | null = null;
  currentImageIndex = 0;
  currentImage: PortfolioItem | null = null;
  currentFeaturedWork: FeaturedWork | null = null;
  internalImages: FeaturedWorkImage[] = [];
  currentInternalImageIndex = 0;
  enlargedImage: FeaturedWorkImage | null = null;
  enlargedImageLoading = false;

  constructor(
    private router: Router,
    private portfolioService: PortfolioService,
    private featuredWorkService: FeaturedWorkService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedWorks();
    // Add hover effects to gallery items after view init
    setTimeout(() => {
      this.initGalleryHoverEffects();
    }, 200);
  }

  loadFeaturedWorks(): void {
    this.isLoading = true;
    this.featuredWorkService.getFeaturedWorks().subscribe({
      next: (works) => {
        this.featuredWorks = works.sort((a, b) => (a.order || 0) - (b.order || 0));
        // Convert featured works to featuredItems format for display
        this.featuredItems = this.featuredWorks.map((work, index) => ({
          image: work.url,
          title: work.heading,
          featuredWork: work,
          isFeaturedWork: true
        }));
        this.isLoading = false;
        // Re-initialize hover effects after data loads
        setTimeout(() => {
          this.initGalleryHoverEffects();
        }, 100);
      },
      error: (error) => {
        console.error('Error loading featured works:', error);
        // Fallback to default items if API fails
        this.featuredItems = [
          {
            image: 'assets/images/portfolio-portrait-n1.jpg',
            title: 'Wedding Photography',
            category: 'wedding' as PortfolioCategoryType
          },
          {
            image: 'assets/images/portfolio-portrait-n2.jpg',
            title: 'Baby Shower',
            category: 'portrait' as PortfolioCategoryType
          },
          {
            image: 'assets/images/portfolio-portrait-n3.jpg',
            title: 'Modern Photography',
            category: 'portrait' as PortfolioCategoryType
          },
          {
            image: 'assets/images/portfolio-portrait-n4.jpg',
            title: 'Puberty Function',
            category: 'portrait' as PortfolioCategoryType
          },
          {
            image: 'assets/images/portfolio-portrait-n5.jpg',
            title: 'Pre & Post Wedding',
            category: 'wedding' as PortfolioCategoryType
          }
        ];
        this.isLoading = false;
      }
    });
  }

  private initGalleryHoverEffects(): void {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item) => {
      item.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = (item as HTMLElement).getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        (item as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      item.addEventListener('mouseleave', () => {
        (item as HTMLElement).style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  ngOnDestroy(): void {
    this.closeModal();
    this.closeImageViewer();
  }

  openCategory(category: PortfolioCategoryType | FeaturedWork | any, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Check if it's a featured work - FeaturedWork has 'heading' and 'url' properties
    if (category && typeof category === 'object' && 'heading' in category && 'url' in category) {
      const featuredWork = category as FeaturedWork;
      console.log('Opening featured work modal:', featuredWork);
      this.openInternalImagesModal(featuredWork);
      return;
    }
    
    // Original portfolio category logic
    const categoryData = this.portfolioService.getCategorySync(category as PortfolioCategoryType);
    if (categoryData) {
      this.currentCategory = categoryData;
      this.currentCategoryType = category as PortfolioCategoryType;
      this.showCategoryModal = true;
      document.body.style.overflow = 'hidden';
    }
  }

  openInternalImagesModal(featuredWork: FeaturedWork): void {
    console.log('Opening internal images modal for:', featuredWork);
    this.currentFeaturedWork = featuredWork;
    this.internalImages = featuredWork.images || [];
    this.currentInternalImageIndex = 0;
    this.showInternalImagesModal = true;
    this.showEnlargedImageModal = false;
    this.enlargedImage = null;
    document.body.style.overflow = 'hidden';
    console.log('Modal should be visible now. Internal images count:', this.internalImages.length);
  }

  closeInternalImagesModal(): void {
    this.showInternalImagesModal = false;
    this.showEnlargedImageModal = false;
    this.currentFeaturedWork = null;
    this.internalImages = [];
    this.currentInternalImageIndex = 0;
    this.enlargedImage = null;
    document.body.style.overflow = '';
  }

  openEnlargedImage(image: FeaturedWorkImage, index: number): void {
    this.currentInternalImageIndex = index;
    this.enlargedImageLoading = true;
    this.showEnlargedImageModal = true;
    this.enlargedImage = null; // Clear previous image
    
    // Preload the image before setting it
    const img = new Image();
    img.onload = () => {
      // Small delay to ensure image is fully rendered
      setTimeout(() => {
        this.enlargedImage = image;
        this.enlargedImageLoading = false;
      }, 50);
    };
    img.onerror = () => {
      // Even on error, show the image (browser will handle broken image)
      this.enlargedImage = image;
      this.enlargedImageLoading = false;
    };
    
    // Set src and check if already cached
    img.src = image.url;
    
    // If image is already cached, onload might not fire, so check complete
    if (img.complete && img.naturalWidth > 0) {
      setTimeout(() => {
        this.enlargedImage = image;
        this.enlargedImageLoading = false;
      }, 50);
    }
  }

  closeEnlargedImageModal(): void {
    this.showEnlargedImageModal = false;
    this.enlargedImage = null;
    this.enlargedImageLoading = false;
  }

  onImageLoaded(): void {
    // Ensure image is fully rendered
    this.enlargedImageLoading = false;
  }

  navigateEnlargedImage(direction: number): void {
    if (this.internalImages.length === 0) return;
    const newIndex = this.currentInternalImageIndex + direction;
    if (newIndex >= 0 && newIndex < this.internalImages.length) {
      this.currentInternalImageIndex = newIndex;
      this.enlargedImageLoading = true;
      this.enlargedImage = null; // Clear previous image
      
      // Preload the new image before setting it
      const img = new Image();
      img.onload = () => {
        // Small delay to ensure image is fully rendered
        setTimeout(() => {
          this.enlargedImage = this.internalImages[newIndex];
          this.enlargedImageLoading = false;
        }, 50);
      };
      img.onerror = () => {
        // Even on error, show the image (browser will handle broken image)
        this.enlargedImage = this.internalImages[newIndex];
        this.enlargedImageLoading = false;
      };
      
      // Set src and check if already cached
      img.src = this.internalImages[newIndex].url;
      
      // If image is already cached, onload might not fire, so check complete
      if (img.complete && img.naturalWidth > 0) {
        setTimeout(() => {
          this.enlargedImage = this.internalImages[newIndex];
          this.enlargedImageLoading = false;
        }, 50);
      }
    }
  }


  closeModal(): void {
    this.showCategoryModal = false;
    document.body.style.overflow = '';
  }

  openImageViewer(imageIndex: number): void {
    if (this.currentCategory) {
      this.currentImageIndex = imageIndex;
      this.currentImage = this.currentCategory.images[imageIndex];
      this.showCategoryModal = false;
      this.showImageViewer = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeImageViewer(): void {
    this.showImageViewer = false;
    this.currentImage = null;
    document.body.style.overflow = '';
  }

  navigateImage(direction: number): void {
    if (this.currentCategory) {
      const newIndex = this.currentImageIndex + direction;
      if (newIndex >= 0 && newIndex < this.currentCategory.images.length) {
        this.openImageViewer(newIndex);
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.showEnlargedImageModal) {
      if (event.key === 'Escape') {
        this.closeEnlargedImageModal();
      } else if (event.key === 'ArrowLeft') {
        this.navigateEnlargedImage(-1);
      } else if (event.key === 'ArrowRight') {
        this.navigateEnlargedImage(1);
      }
    } else if (this.showImageViewer) {
      if (event.key === 'Escape') {
        this.closeImageViewer();
      } else if (event.key === 'ArrowLeft') {
        this.navigateImage(-1);
      } else if (event.key === 'ArrowRight') {
        this.navigateImage(1);
      }
    } else if (this.showInternalImagesModal) {
      if (event.key === 'Escape') {
        this.closeInternalImagesModal();
      }
    } else if (this.showCategoryModal && event.key === 'Escape') {
      this.closeModal();
    }
  }

  onModalBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      if (this.showEnlargedImageModal) {
        this.closeEnlargedImageModal();
      } else if (this.showImageViewer) {
        this.closeImageViewer();
      } else if (this.showInternalImagesModal) {
        this.closeInternalImagesModal();
      } else if (this.showCategoryModal) {
        this.closeModal();
      }
    }
  }
}

