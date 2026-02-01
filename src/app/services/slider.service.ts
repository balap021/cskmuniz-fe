import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { SliderImage } from "../models/slider-image.interface";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SliderService {
  private apiUrl = `${environment.apiUrl}/api/sliders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  getSliders(): Observable<SliderImage[]> {
    return this.http.get<SliderImage[]>(this.apiUrl).pipe(
      map((sliders) => {
        // Transform the URL to include full backend URL if it's a relative path
        // Also map 'id' to '_id' for compatibility
        return sliders.map((slider: any) => ({
          ...slider,
          _id: slider.id ? slider.id.toString() : slider._id,
          url: slider.url.startsWith("http")
            ? slider.url
            : `${environment.apiUrl}${slider.url}`,
        }));
      }),
      catchError((error) => {
        console.error("Error fetching sliders:", error);
        // Return fallback sliders if API fails
        return of(this.getFallbackSliders());
      }),
    );
  }

  getSliderById(id: string): Observable<SliderImage> {
    return this.http.get<SliderImage>(`${this.apiUrl}/${id}`).pipe(
      map((slider: any) => ({
        ...slider,
        _id: slider.id ? slider.id.toString() : slider._id,
        url: slider.url.startsWith("http")
          ? slider.url
          : `${environment.apiUrl}${slider.url}`,
      })),
      catchError((error) => {
        console.error("Error fetching slider:", error);
        throw error;
      }),
    );
  }

  uploadSlider(
    image: File,
    alt?: string,
    order?: number,
  ): Observable<SliderImage> {
    const formData = new FormData();
    formData.append("image", image);
    if (alt) formData.append("alt", alt);
    if (order !== undefined) formData.append("order", order.toString());

    return this.http
      .post<SliderImage>(this.apiUrl, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((slider: any) => ({
          ...slider,
          _id: slider.id ? slider.id.toString() : slider._id,
          url: slider.url.startsWith("http")
            ? slider.url
            : `${environment.apiUrl}${slider.url}`,
        })),
        catchError((error) => {
          console.error("Error uploading slider:", error);
          throw error;
        }),
      );
  }

  updateSlider(
    id: string,
    alt?: string,
    order?: number,
  ): Observable<SliderImage> {
    const body: any = {};
    if (alt !== undefined) body.alt = alt;
    if (order !== undefined) body.order = order;

    return this.http
      .put<SliderImage>(`${this.apiUrl}/${id}`, body, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((slider: any) => ({
          ...slider,
          _id: slider.id ? slider.id.toString() : slider._id,
          url: slider.url.startsWith("http")
            ? slider.url
            : `${environment.apiUrl}${slider.url}`,
        })),
        catchError((error) => {
          console.error("Error updating slider:", error);
          throw error;
        }),
      );
  }

  updateSliderWithImage(
    id: string,
    image: File,
    alt?: string,
    order?: number,
  ): Observable<SliderImage> {
    const formData = new FormData();
    formData.append("image", image);
    if (alt) formData.append("alt", alt);
    if (order !== undefined) formData.append("order", order.toString());

    return this.http
      .put<SliderImage>(`${this.apiUrl}/${id}/image`, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((slider: any) => ({
          ...slider,
          _id: slider.id ? slider.id.toString() : slider._id,
          url: slider.url.startsWith("http")
            ? slider.url
            : `${environment.apiUrl}${slider.url}`,
        })),
        catchError((error) => {
          console.error("Error updating slider with image:", error);
          throw error;
        }),
      );
  }

  deleteSlider(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("Error deleting slider:", error);
          throw error;
        }),
      );
  }

  private getFallbackSliders(): SliderImage[] {
    // Fallback to original hardcoded sliders if API is unavailable
    return [
      {
        _id: "1",
        filename: "slider-img1.jpg",
        originalName: "slider-img1.jpg",
        path: "assets/images/slider-img1.jpg",
        url: "assets/images/slider-img1.jpg",
        alt: "Modern Wedding Photography",
        order: 0,
      },
      {
        _id: "2",
        filename: "slider-img2.jpg",
        originalName: "slider-img2.jpg",
        path: "assets/images/slider-img2.jpg",
        url: "assets/images/slider-img2.jpg",
        alt: "Creative Photography Portfolio",
        order: 1,
      },
      {
        _id: "3",
        filename: "slider-img3.jpg",
        originalName: "slider-img3.jpg",
        path: "assets/images/slider-img3.jpg",
        url: "assets/images/slider-img3.jpg",
        alt: "Professional Photography Showcase",
        order: 2,
      },
    ];
  }
}
