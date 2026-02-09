import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ResponsiveImageComponent } from './components/responsive-image/responsive-image.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ResponsiveImageComponent
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ResponsiveImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }

