import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortfolioCategoryComponent } from './portfolio-category.component';
import { PortfolioCategoryRoutingModule } from './portfolio-category-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PortfolioCategoryComponent
  ],
  imports: [
    CommonModule,
    PortfolioCategoryRoutingModule,
    SharedModule
  ]
})
export class PortfolioCategoryModule { }

