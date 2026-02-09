import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../services/service.service';
import { AuthService } from '../../../services/auth.service';
import { Service } from '../../../models/service.interface';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  serviceForm: FormGroup;
  isEditing = false;
  editingServiceId: string | null = null;
  showForm = false;
  errorMessage = '';
  isLoading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      order: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.errorMessage = 'Failed to load services: ' + (error.error?.error || error.message);
        this.isLoading = false;
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingServiceId = null;
    this.serviceForm.reset({ title: '', description: '', order: 0 });
    this.selectedFile = null;
    this.imagePreview = null;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(service: Service): void {
    this.isEditing = true;
    this.editingServiceId = (service as any)._id || (service as any).id || null;
    if (!this.editingServiceId) {
      console.error('No ID found for service:', service);
      this.errorMessage = 'Error: Service ID not found';
      return;
    }
    this.serviceForm.patchValue({
      title: service.title,
      description: service.description,
      order: service.order || 0
    });
    this.selectedFile = null;
    this.imagePreview = service.url || service.image || null;
    this.showForm = true;
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.serviceForm.reset();
    this.isEditing = false;
    this.editingServiceId = null;
    this.selectedFile = null;
    this.imagePreview = null;
    this.errorMessage = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.isEditing && this.editingServiceId) {
        if (this.selectedFile) {
          // Update with new image
          this.serviceService.updateServiceWithImage(
            this.editingServiceId,
            this.selectedFile,
            this.serviceForm.value.title,
            this.serviceForm.value.description,
            this.serviceForm.value.order
          ).subscribe({
            next: () => {
              this.isLoading = false;
              this.loadServices();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update service';
              this.isLoading = false;
              console.error('Update service error:', error);
            }
          });
        } else {
          // Update without new image
          this.serviceService.updateService(
            this.editingServiceId,
            {
              title: this.serviceForm.value.title,
              description: this.serviceForm.value.description,
              order: this.serviceForm.value.order
            }
          ).subscribe({
            next: () => {
              this.isLoading = false;
              this.loadServices();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update service';
              this.isLoading = false;
              console.error('Update service error:', error);
            }
          });
        }
      } else {
        // Create new service
        if (!this.selectedFile) {
          this.errorMessage = 'Please select an image file';
          this.isLoading = false;
          return;
        }

        const formData = new FormData();
        formData.append('image', this.selectedFile);
        formData.append('title', this.serviceForm.value.title);
        formData.append('description', this.serviceForm.value.description);
        formData.append('order', this.serviceForm.value.order.toString());

        this.serviceService.createService(formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.loadServices();
            this.closeForm();
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Failed to create service';
            this.isLoading = false;
            console.error('Create service error:', error);
          }
        });
      }
    }
  }

  getServiceId(service: Service): string {
    return (service as any)._id || (service as any).id?.toString() || '';
  }

  deleteService(id: string): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.isLoading = true;
      this.errorMessage = '';
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadServices();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete service';
          this.isLoading = false;
          console.error('Delete service error:', error);
        }
      });
    }
  }
}

