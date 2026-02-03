import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SliderService } from '../../../services/slider.service';
import { ContactService, ContactMessage } from '../../../services/contact.service';
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
  totalMessages = 0;
  unreadMessages = 0;
  recentUsers: User[] = [];
  recentSliders: SliderImage[] = [];
  recentMessages: ContactMessage[] = [];

  constructor(
    private userService: UserService,
    private sliderService: SliderService,
    private contactService: ContactService
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

    this.contactService.getMessages().subscribe(messages => {
      this.totalMessages = messages.length;
      this.unreadMessages = messages.filter(m => !m.read).length;
      this.recentMessages = messages.slice(0, 5);
    });
  }
}

