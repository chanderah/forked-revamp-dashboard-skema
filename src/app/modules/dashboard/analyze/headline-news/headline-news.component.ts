import { Component } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';

@Component({
  selector: 'app-headline-news',
  standalone: true,
  imports: [IconNewspaperComponent, IconInfoComponent],
  templateUrl: './headline-news.component.html',
  styleUrl: './headline-news.component.scss',
})
export class HeadlineNewsComponent {}
