import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeaturedWork, FeaturedWorkImage } from '../models/featured-work.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FeaturedWorkService {
  private apiUrl = 'http://localhost:3000/api/featured-works';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private mapFeaturedWork(work: any): FeaturedWork {
    const mappedUrl = work.url && typeof work.url === 'string' 
      ? (work.url.startsWith('http') ? work.url : `http://localhost:3000${work.url}`)
      : work.url;
    
    return {
      ...work,
      _id: work.id ? work.id.toString() : work._id,
      url: mappedUrl,
      images: work.images ? work.images.map((img: any) => {
        const imgUrl = img.url && typeof img.url === 'string'
          ? (img.url.startsWith('http') ? img.url : `http://localhost:3000${img.url}`)
          : img.url;
        return {
          ...img,
          _id: img.id ? img.id.toString() : img._id,
          url: imgUrl
        };
      }) : []
    };
  }

  getFeaturedWorks(): Observable<FeaturedWork[]> {
    console.log('🔄 Fetching featured works from:', this.apiUrl);
    return this.http.get<FeaturedWork[]>(this.apiUrl).pipe(
      map(featuredWorks => {
        console.log('📦 Raw response from API:', featuredWorks);
        if (!Array.isArray(featuredWorks)) {
          console.error('❌ Response is not an array:', featuredWorks);
          return [];
        }
        const mapped = featuredWorks.map((work: any) => {
          console.log('📝 Mapping work:', work);
          const mappedWork = this.mapFeaturedWork(work);
          console.log('✅ Mapped work:', mappedWork);
          return mappedWork;
        });
        console.log('✅ All mapped works:', mapped);
        return mapped;
      }),
      catchError(error => {
        console.error('❌ Error fetching featured works:', error);
        return of([]);
      })
    );
  }

  getFeaturedWorkById(id: string): Observable<FeaturedWork> {
    return this.http.get<FeaturedWork>(`${this.apiUrl}/${id}`).pipe(
      map((work: any) => this.mapFeaturedWork(work)),
      catchError(error => {
        console.error('Error fetching featured work:', error);
        throw error;
      })
    );
  }

  uploadFeaturedWork(image: File, heading: string, order?: number): Observable<FeaturedWork> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('heading', heading);
    if (order !== undefined) formData.append('order', order.toString());

    return this.http.post<FeaturedWork>(this.apiUrl, formData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((work: any) => this.mapFeaturedWork(work)),
      catchError(error => {
        console.error('Error uploading featured work:', error);
        throw error;
      })
    );
  }

  updateFeaturedWork(id: string, heading?: string, order?: number): Observable<FeaturedWork> {
    const body: any = {};
    if (heading !== undefined) body.heading = heading;
    if (order !== undefined) body.order = order;

    return this.http.put<FeaturedWork>(`${this.apiUrl}/${id}`, body, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((work: any) => this.mapFeaturedWork(work)),
      catchError(error => {
        console.error('Error updating featured work:', error);
        throw error;
      })
    );
  }

  updateFeaturedWorkWithImage(id: string, image: File, heading?: string, order?: number): Observable<FeaturedWork> {
    const formData = new FormData();
    formData.append('image', image);
    if (heading) formData.append('heading', heading);
    if (order !== undefined) formData.append('order', order.toString());

    return this.http.put<FeaturedWork>(`${this.apiUrl}/${id}/image`, formData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((work: any) => this.mapFeaturedWork(work)),
      catchError(error => {
        console.error('Error updating featured work with image:', error);
        throw error;
      })
    );
  }

  deleteFeaturedWork(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error deleting featured work:', error);
        throw error;
      })
    );
  }

  // Internal Images Management
  getInternalImages(featuredWorkId: string): Observable<FeaturedWorkImage[]> {
    return this.http.get<FeaturedWorkImage[]>(`${this.apiUrl}/${featuredWorkId}/images`).pipe(
      map(images => {
        return images.map((img: any) => ({
          ...img,
          _id: img.id ? img.id.toString() : img._id,
          url: img.url && typeof img.url === 'string' && !img.url.startsWith('http')
            ? `http://localhost:3000${img.url}`
            : img.url
        }));
      }),
      catchError(error => {
        console.error('Error fetching internal images:', error);
        throw error;
      })
    );
  }

  uploadInternalImage(featuredWorkId: string, image: File, order?: number): Observable<FeaturedWorkImage> {
    const formData = new FormData();
    formData.append('image', image);
    if (order !== undefined) formData.append('order', order.toString());

    return this.http.post<FeaturedWorkImage>(`${this.apiUrl}/${featuredWorkId}/images`, formData, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      map((img: any) => ({
        ...img,
        _id: img.id ? img.id.toString() : img._id,
        url: img.url && typeof img.url === 'string' && !img.url.startsWith('http')
          ? `http://localhost:3000${img.url}`
          : img.url
      })),
      catchError(error => {
        console.error('Error uploading internal image:', error);
        throw error;
      })
    );
  }

  deleteInternalImage(featuredWorkId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${featuredWorkId}/images/${imageId}`, {
      headers: this.authService.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error deleting internal image:', error);
        throw error;
      })
    );
  }
}

