import { Component, OnInit } from '@angular/core';
import { Service } from '../../models/service.interface';
import { ServiceService } from '../../services/service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  isLoading = false;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.services = services.sort((a, b) => (a.order || 0) - (b.order || 0));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
        // Keep empty array on error - component will handle gracefully
        this.services = [];
      }
    });
  }
}

