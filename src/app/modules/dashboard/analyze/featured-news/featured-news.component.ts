import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-news',
  standalone: true,
  imports: [IconInfoComponent, IconNewspaperComponent, ScrollerModule, CommonModule],
  templateUrl: './featured-news.component.html',
  styleUrl: './featured-news.component.scss'
})
export class FeaturedNewsComponent {
  articles: any[] = [
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09'
    },
  ]
}
