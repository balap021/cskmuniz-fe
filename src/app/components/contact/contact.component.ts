import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  showAlert = false;
  alertType: 'success' | 'error' = 'success';
  alertMessage = '';

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      service: ['', [Validators.required]],
      phone: [''],
      message: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.contactForm.value;

      this.contactService.submitContactForm(formData).subscribe({
        next: (response) => {
          this.showAlertPopup('success', response.message || 'Thank you for your message! We will get back to you within 24 hours.');
          this.contactForm.reset();
          this.isSubmitting = false;
        },
        error: (error) => {
          const errorMsg = error.error?.error || error.error?.message || 'Sorry, there was an error submitting your message. Please try again.';
          this.showAlertPopup('error', errorMsg);
          this.isSubmitting = false;
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  showAlertPopup(type: 'success' | 'error', message: string): void {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  closeAlert(): void {
    this.showAlert = false;
    this.alertMessage = '';
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required') && field.touched) {
      return 'This field is required';
    }
    if (field?.hasError('email') && field.touched) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}

