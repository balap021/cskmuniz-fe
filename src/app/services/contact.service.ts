import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  phone?: string;
  message: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  service: string;
  phone?: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/api/contact`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  submitContactForm(formData: ContactFormData): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string; data: ContactMessage }>(
      this.apiUrl,
      formData
    );
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getMessage(id: number): Observable<ContactMessage> {
    return this.http.get<ContactMessage>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  markAsRead(id: number, read: boolean): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${this.apiUrl}/${id}/read`, { read }, {
      headers: this.authService.getAuthHeaders()
    });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  validateForm(formData: ContactFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!formData.name || formData.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!formData.email || formData.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (!formData.service || formData.service.trim().length === 0) {
      errors.push('Please select a service');
    }

    if (!formData.message || formData.message.trim().length === 0) {
      errors.push('Message is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

