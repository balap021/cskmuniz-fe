import { Component } from '@angular/core';
import { Service } from '../../models/service.interface';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent {
  services: Service[] = [
    {
      id: 'wedding',
      title: 'Wedding Photography',
      description: 'Looking for professional candid wedding photographers? With years of creative expertise, CSK Muniz captures your most heartfelt moments with artistry and precision — preserving them beautifully for a lifetime.',
      image: 'assets/images/our-services-1.jpg'
    },
    {
      id: 'maternity',
      title: 'Maternity Function',
      description: 'Your maternity journey deserves to be remembered forever. CSK Muniz captures the essence of your Maternity Function through heartfelt, timeless photographs filled with emotion and love.',
      image: 'assets/images/our-services-2.jpg'
    },
    {
      id: 'modern',
      title: 'Modern Photography',
      description: 'CSK Muniz specializes in Modern Photography, capturing real stories with artistic precision and a modern edge — perfect for those who love timeless images with a contemporary feel.',
      image: 'assets/images/our-services-3.jpg'
    },
    {
      id: 'puberty',
      title: 'Puberty Function',
      description: 'Your daughter\'s Puberty Function is a once-in-a-lifetime celebration. CSK Muniz captures the beauty, culture, and emotion of the day through stunning, heartfelt photography.',
      image: 'assets/images/our-services-4.jpg'
    },
    {
      id: 'pre-post',
      title: 'Pre & Post Photography',
      description: 'Celebrate love beyond the wedding day with CSK Muniz, experts in Pre & Post Wedding photography — turning your couple moments into timeless, emotion-filled stories.',
      image: 'assets/images/our-services-5.jpg'
    }
  ];
}

