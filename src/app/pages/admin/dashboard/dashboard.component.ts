import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SliderService } from '../../../services/slider.service';
import { User } from '../../../models/user.interface';
import { SliderImage } from '../../../models/slider-image.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers = 0;
  totalSliders = 0;
  recentUsers: User[] = [];
  recentSliders: SliderImage[] = [];

  constructor(
    private userService: UserService,
    private sliderService: SliderService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getUsers().subscribe(users => {
      this.totalUsers = users.length;
      this.recentUsers = users.slice(0, 5);
    });

    this.sliderService.getSliders().subscribe(sliders => {
      this.totalSliders = sliders.length;
      this.recentSliders = sliders.slice(0, 5);
    });
  }
}

