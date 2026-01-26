import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  scrollTo(section: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    
    if (this.router.url === '/') {
      this.navigationService.scrollToSection(section);
    } else {
      this.router.navigate(['/'], { fragment: section });
    }
  }
}

