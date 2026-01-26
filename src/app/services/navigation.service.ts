import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private activeSectionSubject = new BehaviorSubject<string>('home');
  public activeSection$: Observable<string> = this.activeSectionSubject.asObservable();

  private isScrolledSubject = new BehaviorSubject<boolean>(false);
  public isScrolled$: Observable<boolean> = this.isScrolledSubject.asObservable();

  constructor() {
    this.initScrollListener();
  }

  private initScrollListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        this.isScrolledSubject.next(scrollY > 50);
        this.updateActiveSection();
      });
    }
  }

  private updateActiveSection(): void {
    if (typeof window === 'undefined') return;

    const sections = document.querySelectorAll('section[id]');
    let current = 'home';

    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id') || 'home';
      }
    });

    this.activeSectionSubject.next(current);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

