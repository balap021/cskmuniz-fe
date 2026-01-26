export interface PortfolioItem {
  src: string;
  title: string;
  description: string;
}

export interface PortfolioCategory {
  title: string;
  images: PortfolioItem[];
}

export type PortfolioCategoryType = 'portrait' | 'wedding' | 'architecture' | 'landscape' | 'fashion';

