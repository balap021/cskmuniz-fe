import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SliderService } from '../../../services/slider.service';
import { AuthService } from '../../../services/auth.service';
import { SliderImage } from '../../../models/slider-image.interface';

@Component({
  selector: 'app-sliders',
  templateUrl: './sliders.component.html',
  styleUrls: ['./sliders.component.css']
})
export class SlidersComponent implements OnInit {
  sliders: SliderImage[] = [];
  sliderForm: FormGroup;
  isEditing = false;
  editingSliderId: string | null = null;
  showForm = false;
  errorMessage = '';
  isLoading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private sliderService: SliderService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.sliderForm = this.fb.group({
      alt: ['', [Validators.required]],
      order: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSliders();
  }

  loadSliders(): void {
    this.isLoading = true;
    this.sliderService.getSliders().subscribe({
      next: (sliders) => {
        this.sliders = sliders.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load sliders';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingSliderId = null;
    this.sliderForm.reset({ alt: '', order: 0 });
    this.selectedFile = null;
    this.imagePreview = null;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(slider: SliderImage): void {
    this.isEditing = true;
    // Handle both _id (from MongoDB style) and id (from Sequelize)
    this.editingSliderId = (slider as any)._id || (slider as any).id || null;
    if (!this.editingSliderId) {
      console.error('No ID found for slider:', slider);
      this.errorMessage = 'Error: Slider ID not found';
      return;
    }
    console.log('Editing slider - ID:', this.editingSliderId, 'Full slider:', slider);
    this.sliderForm.patchValue({
      alt: slider.alt,
      order: slider.order
    });
    this.selectedFile = null;
    this.imagePreview = slider.url;
    this.showForm = true;
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.sliderForm.reset();
    this.isEditing = false;
    this.editingSliderId = null;
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
    if (this.sliderForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.isEditing && this.editingSliderId) {
        // Update slider - with or without new image
        console.log('Updating slider with ID:', this.editingSliderId);
        if (this.selectedFile) {
          // Update with new image
          console.log('Updating with new image file');
          this.sliderService.updateSliderWithImage(
            this.editingSliderId,
            this.selectedFile,
            this.sliderForm.value.alt,
            this.sliderForm.value.order
          ).subscribe({
            next: () => {
              this.loadSliders();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update slider';
              this.isLoading = false;
            }
          });
        } else {
          // Update without changing image
          const updateData = {
            alt: this.sliderForm.value.alt,
            order: this.sliderForm.value.order
          };

          this.sliderService.updateSlider(this.editingSliderId, updateData.alt, updateData.order).subscribe({
            next: () => {
              this.loadSliders();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update slider';
              this.isLoading = false;
            }
          });
        }
      } else {
        // Create slider
        if (!this.selectedFile) {
          this.errorMessage = 'Please select an image file';
          this.isLoading = false;
          return;
        }

        this.sliderService.uploadSlider(
          this.selectedFile,
          this.sliderForm.value.alt,
          this.sliderForm.value.order
        ).subscribe({
          next: () => {
            this.loadSliders();
            this.closeForm();
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Failed to upload slider';
            this.isLoading = false;
          }
        });
      }
    }
  }

  getSliderId(slider: SliderImage): string {
    return (slider as any)._id || (slider as any).id || '';
  }

  deleteSlider(id: string): void {
    if (confirm('Are you sure you want to delete this slider image?')) {
      this.isLoading = true;
      this.sliderService.deleteSlider(id).subscribe({
        next: () => {
          this.loadSliders();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete slider';
          this.isLoading = false;
        }
      });
    }
  }
}

