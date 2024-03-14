import { Component } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-headline-news',
  standalone: true,
  imports: [IconNewspaperComponent, IconInfoComponent, ScrollerModule, CommonModule],
  templateUrl: './headline-news.component.html',
  styleUrl: './headline-news.component.scss',
})
export class HeadlineNewsComponent {
  articles: any[] = [
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      journalist: 'journalis',
      datee: '2021-23-01 09',
    },
  ];
}
