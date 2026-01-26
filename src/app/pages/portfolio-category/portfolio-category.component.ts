import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioService } from '../../services/portfolio.service';
import { PortfolioCategory, PortfolioCategoryType, PortfolioItem } from '../../models/portfolio-item.interface';

@Component({
  selector: 'app-portfolio-category',
  templateUrl: './portfolio-category.component.html',
  styleUrls: ['./portfolio-category.component.css']
})
export class PortfolioCategoryComponent implements OnInit {
  category: PortfolioCategory | null = null;
  categoryType!: PortfolioCategoryType;
  currentImageIndex = 0;
  showImageViewer = false;
  currentImage: PortfolioItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryParam = params['category'] as PortfolioCategoryType;
      this.categoryType = categoryParam;
      const categoryData = this.portfolioService.getCategorySync(categoryParam);
      
      if (categoryData) {
        this.category = categoryData;
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  openImageViewer(index: number): void {
    if (this.category) {
      this.currentImageIndex = index;
      this.currentImage = this.category.images[index];
      this.showImageViewer = true;
    }
  }

  closeImageViewer(): void {
    this.showImageViewer = false;
    this.currentImage = null;
  }

  navigateImage(direction: number): void {
    if (this.category) {
      const newIndex = this.currentImageIndex + direction;
      if (newIndex >= 0 && newIndex < this.category.images.length) {
        this.openImageViewer(newIndex);
      }
    }
  }

  goToHome(): void {
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        const portfolioSection = document.getElementById('portfolio');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  }
}

