import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Service } from "../models/service.interface";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  private apiUrl = `${environment.apiUrl}/api/services`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  private mapService(service: any): Service {
    const mappedUrl =
      service.url && typeof service.url === "string"
        ? service.url.startsWith("http")
          ? service.url
          : `${environment.apiUrl}${service.url}`
        : service.image || service.url;

    return {
      ...service,
      _id: service.id ? service.id.toString() : service._id,
      url: mappedUrl,
      image: mappedUrl, // For backward compatibility
    };
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl).pipe(
      map((services) => {
        if (!Array.isArray(services)) {
          return [];
        }
        return services.map((service: any) => this.mapService(service));
      }),
      catchError((error) => {
        console.error("Error fetching services:", error);
        return [];
      }),
    );
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
      map((service: any) => this.mapService(service)),
      catchError((error) => {
        console.error("Error fetching service:", error);
        throw error;
      }),
    );
  }

  createService(formData: FormData): Observable<Service> {
    return this.http
      .post<Service>(this.apiUrl, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((service: any) => this.mapService(service)),
        catchError((error) => {
          console.error("Error creating service:", error);
          throw error;
        }),
      );
  }

  updateService(id: string, serviceData: Partial<Service>): Observable<Service> {
    return this.http
      .put<Service>(`${this.apiUrl}/${id}`, serviceData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((service: any) => this.mapService(service)),
        catchError((error) => {
          console.error("Error updating service:", error);
          throw error;
        }),
      );
  }

  updateServiceWithImage(
    id: string,
    image: File,
    title?: string,
    description?: string,
    order?: number,
  ): Observable<Service> {
    const formData = new FormData();
    formData.append("image", image);
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (order !== undefined) formData.append("order", order.toString());

    return this.http
      .put<Service>(`${this.apiUrl}/${id}/image`, formData, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        map((service: any) => this.mapService(service)),
        catchError((error) => {
          console.error("Error updating service image:", error);
          throw error;
        }),
      );
  }

  deleteService(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: this.authService.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error("Error deleting service:", error);
          throw error;
        }),
      );
  }
}

