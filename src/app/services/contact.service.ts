import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ContactFormData {
  name: string;
  email: string;
  service: string;
  phone?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  submitContactForm(formData: ContactFormData): Observable<{ success: boolean; message: string }> {
    // Simulate API call
    console.log('Submitting contact form:', formData);
    
    // In a real application, this would make an HTTP request
    return of({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.'
    }).pipe(delay(1500));
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

