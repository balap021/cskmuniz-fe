import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User, RegisterRequest } from '../../../models/user.interface';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  isEditing = false;
  editingUserId: string | null = null;
  showForm = false;
  errorMessage = '';
  isLoading = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load users';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  openAddForm(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(user: User): void {
    this.isEditing = true;
    this.editingUserId = user._id || null;
    this.userForm.patchValue({
      name: user.name,
      username: user.username
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
    this.errorMessage = '';
  }

  closeForm(): void {
    this.showForm = false;
    this.userForm.reset();
    this.isEditing = false;
    this.editingUserId = null;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const userData: RegisterRequest = this.userForm.value;

      if (this.isEditing && this.editingUserId) {
        // Update user
        const updateData: any = {
          name: userData.name,
          username: userData.username
        };
        if (userData.password) {
          updateData.password = userData.password;
        }

        this.userService.updateUser(this.editingUserId, updateData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeForm();
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Failed to update user';
            this.isLoading = false;
          }
        });
      } else {
        // Create user
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.loadUsers();
            this.closeForm();
          },
          error: (error) => {
            this.errorMessage = error.error?.error || 'Failed to create user';
            this.isLoading = false;
          }
        });
      }
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isLoading = true;
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete user';
          this.isLoading = false;
        }
      });
    }
  }
}

