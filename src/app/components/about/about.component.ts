import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  stats = [
    { value: 200, suffix: '+', label: 'Projects Completed' },
    { value: 8, suffix: '+', label: 'Years Experience' },
    { value: 50, suffix: '+', label: 'Employees' }
  ];

  animatedStats = [
    { current: 0, target: 200, suffix: '+', label: 'Projects Completed' },
    { current: 0, target: 8, suffix: '+', label: 'Years Experience' },
    { current: 0, target: 50, suffix: '+', label: 'Employees' }
  ];

  private observer?: IntersectionObserver;
  private hasAnimated = false;

  ngOnInit(): void {
    // Setup observer after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (typeof window === 'undefined') return;

    // Wait for DOM to be ready
    setTimeout(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.animateStats();
              this.hasAnimated = true;
            }
          });
        },
        { threshold: 0.5 }
      );

      const statsElement = document.querySelector('.stats');
      if (statsElement) {
        this.observer.observe(statsElement);
      }
    }, 200);
  }

  private animateStats(): void {
    this.animatedStats.forEach((stat, index) => {
      const duration = 1500;
      const steps = 50;
      const increment = stat.target / steps;
      const stepTime = duration / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timer);
        }
        this.animatedStats[index].current = Math.floor(current);
      }, stepTime);
    });
  }
}

