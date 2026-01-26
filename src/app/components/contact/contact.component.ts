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
  submitMessage = '';

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
          this.submitMessage = response.message;
          this.contactForm.reset();
          this.isSubmitting = false;
          
          setTimeout(() => {
            this.submitMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.submitMessage = 'Sorry, there was an error submitting your message. Please try again.';
          this.isSubmitting = false;
          
          setTimeout(() => {
            this.submitMessage = '';
          }, 3000);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
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

