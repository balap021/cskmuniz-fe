export interface FeaturedWorkImage {
  _id?: string;
  id?: number;
  featuredWorkId?: number;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  order: number;
  createdAt?: string;
}

export interface FeaturedWork {
  _id?: string;
  id?: number;
  filename: string;
  originalName: string;
  path: string;
  url: string;
  heading: string;
  order: number;
  images?: FeaturedWorkImage[];
  createdAt?: string;
}



