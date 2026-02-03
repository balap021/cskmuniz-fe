import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  activeSection = 'home';
  isMobileMenuOpen = false;
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.navigationService.isScrolled$.subscribe(scrolled => {
        this.isScrolled = scrolled;
      })
    );

    this.subscriptions.add(
      this.navigationService.activeSection$.subscribe(section => {
        this.activeSection = section;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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

  isActive(section: string): boolean {
    return this.activeSection === section;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
}

