import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MediaListComponent } from './media-list/media-list.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { SubCategoryListComponent } from './sub-category-list/sub-category-list.component';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [MediaListComponent, CategoryListComponent, TabViewModule, SubCategoryListComponent],
  templateUrl: './preference.component.html',
  styleUrl: './preference.component.scss',
})
export class PreferenceComponent {}
