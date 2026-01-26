import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PortfolioCategory, PortfolioCategoryType, PortfolioItem } from '../models/portfolio-item.interface';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioData: Record<PortfolioCategoryType, PortfolioCategory> = {
    portrait: {
      title: "Portrait Photography",
      images: [
        {
          src: "assets/images/portfolio-portrait-1.jpg",
          title: "Editorial Portrait",
          description: "Contemporary portraiture with modern aesthetic sensibilities",
        },
        {
          src: "assets/images/portrait-2.jpg",
          title: "Studio Portrait",
          description: "Professional headshot with dramatic lighting",
        },
        {
          src: "assets/images/portrait-3.jpg",
          title: "Environmental Portrait",
          description: "Lifestyle photography capturing personality and character",
        },
        {
          src: "assets/images/portfolio-portrait-1.jpg",
          title: "Editorial Portrait 2",
          description: "Contemporary portraiture with modern aesthetic sensibilities",
        },
        {
          src: "assets/images/portrait-2.jpg",
          title: "Studio Portrait 2",
          description: "Professional headshot with dramatic lighting",
        },
        {
          src: "assets/images/portrait-3.jpg",
          title: "Environmental Portrait 2",
          description: "Lifestyle photography capturing personality and character",
        },
        {
          src: "assets/images/portfolio-portrait-1.jpg",
          title: "Editorial Portrait 3",
          description: "Contemporary portraiture with modern aesthetic sensibilities",
        },
        {
          src: "assets/images/portrait-2.jpg",
          title: "Studio Portrait 3",
          description: "Professional headshot with dramatic lighting",
        },
        {
          src: "assets/images/portrait-3.jpg",
          title: "Environmental Portrait 3",
          description: "Lifestyle photography capturing personality and character",
        },
      ],
    },
    wedding: {
      title: "Wedding Photography",
      images: [
        {
          src: "assets/images/portfolio-wedding-1.jpg",
          title: "Modern Wedding",
          description: "Contemporary wedding documentation with artistic flair",
        },
        {
          src: "assets/images/wedding-2.jpg",
          title: "Wedding Ceremony",
          description: "Sacred moments captured with emotional depth",
        },
        {
          src: "assets/images/wedding-3.jpg",
          title: "Wedding Reception",
          description: "Joyful celebration and intimate moments",
        },
      ],
    },
    architecture: {
      title: "Architecture Photography",
      images: [
        {
          src: "assets/images/portfolio-architecture-1.jpg",
          title: "Architectural Study",
          description: "Urban geometry and structural design elements",
        },
        {
          src: "assets/images/architecture-2.jpg",
          title: "Contemporary Building",
          description: "Modern architectural photography with clean lines",
        },
        {
          src: "assets/images/architecture-3.jpg",
          title: "Architectural Detail",
          description: "Geometric composition and design elements",
        },
      ],
    },
    landscape: {
      title: "Landscape Photography",
      images: [
        {
          src: "assets/images/portfolio-landscape-1.jpg",
          title: "Natural Landscapes",
          description: "Environmental storytelling through dramatic lighting",
        },
        {
          src: "assets/images/landscape-2.jpg",
          title: "Coastal Scene",
          description: "Seascape photography capturing natural beauty",
        },
        {
          src: "assets/images/landscape-3.jpg",
          title: "Forest Path",
          description: "Nature photography with artistic composition",
        },
      ],
    },
    fashion: {
      title: "Fashion Photography",
      images: [
        {
          src: "assets/images/portfolio-fashion-1.jpg",
          title: "Fashion Editorial",
          description: "Contemporary style with bold creative direction",
        },
        {
          src: "assets/images/fashion-2.jpg",
          title: "Studio Session",
          description: "Commercial fashion photography with modern elegance",
        },
        {
          src: "assets/images/fashion-3.jpg",
          title: "Street Style",
          description: "Urban fashion photography with creative styling",
        },
      ],
    },
  };

  getCategory(category: PortfolioCategoryType): Observable<PortfolioCategory> {
    return of(this.portfolioData[category]);
  }

  getCategorySync(category: PortfolioCategoryType): PortfolioCategory {
    return this.portfolioData[category];
  }

  getAllCategories(): Observable<Record<PortfolioCategoryType, PortfolioCategory>> {
    return of(this.portfolioData);
  }

  getCategoryByTitle(title: string): PortfolioCategoryType | null {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("portrait")) {
      return "portrait";
    } else if (lowerTitle.includes("wedding")) {
      return "wedding";
    } else if (lowerTitle.includes("architectural") || lowerTitle.includes("architecture")) {
      return "architecture";
    } else if (lowerTitle.includes("landscape") || lowerTitle.includes("natural")) {
      return "landscape";
    } else if (lowerTitle.includes("fashion") || lowerTitle.includes("editorial")) {
      return "fashion";
    }
    return null;
  }
}

