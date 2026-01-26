import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeaturedWorkService } from '../../../services/featured-work.service';
import { AuthService } from '../../../services/auth.service';
import { FeaturedWork, FeaturedWorkImage } from '../../../models/featured-work.interface';

@Component({
  selector: 'app-featured-works',
  templateUrl: './featured-works.component.html',
  styleUrls: ['./featured-works.component.css']
})
export class FeaturedWorksComponent implements OnInit {
  featuredWorks: FeaturedWork[] = [];
  featuredWorkForm: FormGroup;
  isEditing = false;
  editingFeaturedWorkId: string | null = null;
  showForm = false;
  errorMessage = '';
  isLoading = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  // Internal images popup
  showImagePopup = false;
  currentFeaturedWork: FeaturedWork | null = null;
  internalImages: FeaturedWorkImage[] = [];
  selectedInternalFile: File | null = null;
  internalImagePreview: string | null = null;

  constructor(
    private featuredWorkService: FeaturedWorkService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.featuredWorkForm = this.fb.group({
      heading: ['', [Validators.required]],
      order: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadFeaturedWorks();
  }

  loadFeaturedWorks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log('🔄 Loading featured works...');
    this.featuredWorkService.getFeaturedWorks().subscribe({
      next: (featuredWorks) => {
        console.log('✅ Received featured works:', featuredWorks);
        console.log('✅ Count:', featuredWorks.length);
        if (featuredWorks.length > 0) {
          console.log('✅ First item:', featuredWorks[0]);
          console.log('✅ First item URL:', featuredWorks[0].url);
        }
        this.featuredWorks = featuredWorks.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading featured works:', error);
        this.errorMessage = 'Failed to load featured works: ' + (error.error?.error || error.message);
        this.isLoading = false;
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingFeaturedWorkId = null;
    this.featuredWorkForm.reset({ heading: '', order: 0 });
    this.selectedFile = null;
    this.imagePreview = null;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(featuredWork: FeaturedWork): void {
    this.isEditing = true;
    this.editingFeaturedWorkId = (featuredWork as any)._id || (featuredWork as any).id || null;
    if (!this.editingFeaturedWorkId) {
      console.error('No ID found for featured work:', featuredWork);
      this.errorMessage = 'Error: Featured work ID not found';
      return;
    }
    this.featuredWorkForm.patchValue({
      heading: featuredWork.heading,
      order: featuredWork.order
    });
    this.selectedFile = null;
    this.imagePreview = featuredWork.url;
    this.showForm = true;
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.featuredWorkForm.reset();
    this.isEditing = false;
    this.editingFeaturedWorkId = null;
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
    if (this.featuredWorkForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      if (this.isEditing && this.editingFeaturedWorkId) {
        if (this.selectedFile) {
          this.featuredWorkService.updateFeaturedWorkWithImage(
            this.editingFeaturedWorkId,
            this.selectedFile,
            this.featuredWorkForm.value.heading,
            this.featuredWorkForm.value.order
          ).subscribe({
            next: () => {
              this.loadFeaturedWorks();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update featured work';
              this.isLoading = false;
            }
          });
        } else {
          this.featuredWorkService.updateFeaturedWork(
            this.editingFeaturedWorkId,
            this.featuredWorkForm.value.heading,
            this.featuredWorkForm.value.order
          ).subscribe({
            next: () => {
              this.loadFeaturedWorks();
              this.closeForm();
            },
            error: (error) => {
              this.errorMessage = error.error?.error || 'Failed to update featured work';
              this.isLoading = false;
            }
          });
        }
      } else {
        if (!this.selectedFile) {
          this.errorMessage = 'Please select an image file';
          this.isLoading = false;
          return;
        }

        this.featuredWorkService.uploadFeaturedWork(
          this.selectedFile,
          this.featuredWorkForm.value.heading,
          this.featuredWorkForm.value.order
        ).subscribe({
          next: (result) => {
            console.log('✅ Featured work uploaded:', result);
            this.loadFeaturedWorks();
            this.closeForm();
          },
          error: (error) => {
            console.error('❌ Upload error:', error);
            this.errorMessage = error.error?.error || 'Failed to upload featured work';
            this.isLoading = false;
          }
        });
      }
    }
  }

  getFeaturedWorkId(featuredWork: FeaturedWork): string {
    return (featuredWork as any)._id || (featuredWork as any).id || '';
  }

  deleteFeaturedWork(id: string): void {
    if (confirm('Are you sure you want to delete this featured work?')) {
      this.isLoading = true;
      this.featuredWorkService.deleteFeaturedWork(id).subscribe({
        next: () => {
          this.loadFeaturedWorks();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete featured work';
          this.isLoading = false;
        }
      });
    }
  }

  // Internal Images Popup
  openImagePopup(featuredWork: FeaturedWork): void {
    this.currentFeaturedWork = featuredWork;
    this.showImagePopup = true;
    this.loadInternalImages();
  }

  closeImagePopup(): void {
    this.showImagePopup = false;
    this.currentFeaturedWork = null;
    this.internalImages = [];
    this.selectedInternalFile = null;
    this.internalImagePreview = null;
  }

  loadInternalImages(): void {
    if (!this.currentFeaturedWork) return;
    const id = this.getFeaturedWorkId(this.currentFeaturedWork);
    this.featuredWorkService.getInternalImages(id).subscribe({
      next: (images) => {
        this.internalImages = images.sort((a, b) => (a.order || 0) - (b.order || 0));
      },
      error: (error) => {
        console.error('Error loading internal images:', error);
      }
    });
  }

  onInternalFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedInternalFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.internalImagePreview = e.target.result;
      };
      reader.readAsDataURL(this.selectedInternalFile);
    }
  }

  uploadInternalImage(): void {
    if (!this.currentFeaturedWork || !this.selectedInternalFile) {
      this.errorMessage = 'Please select an image file';
      return;
    }

    const id = this.getFeaturedWorkId(this.currentFeaturedWork);
    this.isLoading = true;
    this.featuredWorkService.uploadInternalImage(id, this.selectedInternalFile).subscribe({
      next: () => {
        this.loadInternalImages();
        this.loadFeaturedWorks(); // Refresh main list to update image count
        this.selectedInternalFile = null;
        this.internalImagePreview = null;
        this.isLoading = false;
        const fileInput = document.getElementById('internal-image-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to upload internal image';
        this.isLoading = false;
      }
    });
  }

  deleteInternalImage(imageId: string): void {
    if (!this.currentFeaturedWork) return;
    
    if (confirm('Are you sure you want to delete this internal image?')) {
      const featuredWorkId = this.getFeaturedWorkId(this.currentFeaturedWork);
      this.isLoading = true;
      this.featuredWorkService.deleteInternalImage(featuredWorkId, imageId).subscribe({
        next: () => {
          this.loadInternalImages();
          this.loadFeaturedWorks(); // Refresh main list
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete internal image';
          this.isLoading = false;
        }
      });
    }
  }

  getInternalImageId(image: FeaturedWorkImage): string {
    return (image as any)._id || (image as any).id || '';
  }

  trackById(index: number, item: FeaturedWork): any {
    return item.id || item._id || index;
  }

  onImageError(event: any, featuredWork: FeaturedWork): void {
    console.error('❌ Image load error for:', featuredWork.url);
    console.error('❌ Featured work:', featuredWork);
  }

  onImageLoad(event: any): void {
    console.log('✅ Image loaded successfully:', event.target.src);
  }
}

