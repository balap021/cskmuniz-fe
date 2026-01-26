import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ScrollAnimationsService } from '../../services/scroll-animations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private scrollAnimationsService: ScrollAnimationsService) {}

  ngOnInit(): void {
    // Add loaded class to body for fade-in animation immediately
    document.body.classList.add('loaded');
  }

  ngAfterViewInit(): void {
    // Initialize scroll animations after view init
    setTimeout(() => {
      this.scrollAnimationsService.initScrollAnimations();
      this.scrollAnimationsService.initParallaxEffects();
    }, 200);
  }

  ngOnDestroy(): void {
    this.scrollAnimationsService.cleanup();
  }
}

