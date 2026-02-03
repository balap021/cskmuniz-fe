import { Component, OnInit } from '@angular/core';
import { ContactService, ContactMessage } from '../../../services/contact.service';

@Component({
  selector: 'app-contact-messages',
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.css']
})
export class ContactMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  filteredMessages: ContactMessage[] = [];
  selectedMessage: ContactMessage | null = null;
  isLoading = false;
  errorMessage = '';
  showModal = false;

  // Filter properties
  nameFilter = '';
  serviceFilter = '';
  dateFromFilter = '';
  dateToFilter = '';
  showDateFilters = false;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.isLoading = true;
    this.contactService.getMessages().subscribe({
      next: (messages) => {
        this.messages = messages;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load contact messages';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  applyFilters(): void {
    this.filteredMessages = this.messages.filter(message => {
      // Name filter
      const nameMatch = !this.nameFilter || 
        message.name.toLowerCase().includes(this.nameFilter.toLowerCase()) ||
        message.email.toLowerCase().includes(this.nameFilter.toLowerCase());

      // Service filter
      const serviceMatch = !this.serviceFilter || 
        message.service.toLowerCase().includes(this.serviceFilter.toLowerCase());

      // Date filter
      let dateMatch = true;
      if (this.showDateFilters) {
        const messageDate = new Date(message.createdAt);
        messageDate.setHours(0, 0, 0, 0);

        if (this.dateFromFilter) {
          const fromDate = new Date(this.dateFromFilter);
          fromDate.setHours(0, 0, 0, 0);
          if (messageDate < fromDate) {
            dateMatch = false;
          }
        }

        if (this.dateToFilter) {
          const toDate = new Date(this.dateToFilter);
          toDate.setHours(23, 59, 59, 999);
          if (messageDate > toDate) {
            dateMatch = false;
          }
        }
      }

      return nameMatch && serviceMatch && dateMatch;
    });
  }

  onNameFilterChange(): void {
    this.applyFilters();
  }

  onServiceFilterChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  toggleDateFilters(): void {
    this.showDateFilters = !this.showDateFilters;
    if (!this.showDateFilters) {
      this.dateFromFilter = '';
      this.dateToFilter = '';
    }
    this.applyFilters();
  }

  clearFilters(): void {
    this.nameFilter = '';
    this.serviceFilter = '';
    this.dateFromFilter = '';
    this.dateToFilter = '';
    this.showDateFilters = false;
    this.applyFilters();
  }

  viewMessage(message: ContactMessage): void {
    this.selectedMessage = message;
    this.showModal = true;
    
    // Mark as read if not already read
    if (!message.read) {
      this.contactService.markAsRead(message.id, true).subscribe({
        next: (updatedMessage) => {
          // Update the message in the list
          const index = this.messages.findIndex(m => m.id === message.id);
          if (index !== -1) {
            this.messages[index] = updatedMessage;
          }
          // Reapply filters to update filtered list
          this.applyFilters();
        },
        error: (error) => {
          console.error('Failed to mark message as read:', error);
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedMessage = null;
  }

  deleteMessage(id: number): void {
    if (confirm('Are you sure you want to delete this message?')) {
      this.isLoading = true;
      this.contactService.deleteMessage(id).subscribe({
        next: () => {
          // Remove from messages array
          this.messages = this.messages.filter(m => m.id !== id);
          // Reapply filters
          this.applyFilters();
          this.isLoading = false;
          if (this.selectedMessage?.id === id) {
            this.closeModal();
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete message';
          this.isLoading = false;
        }
      });
    }
  }

  toggleReadStatus(message: ContactMessage): void {
    this.contactService.markAsRead(message.id, !message.read).subscribe({
      next: (updatedMessage) => {
        const index = this.messages.findIndex(m => m.id === message.id);
        if (index !== -1) {
          this.messages[index] = updatedMessage;
        }
        // Reapply filters to update filtered list
        this.applyFilters();
        if (this.selectedMessage?.id === message.id) {
          this.selectedMessage = updatedMessage;
        }
      },
      error: (error) => {
        console.error('Failed to update message status:', error);
      }
    });
  }

  getUnreadCount(): number {
    return this.filteredMessages.filter(m => !m.read).length;
  }

  getTotalCount(): number {
    return this.filteredMessages.length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}

