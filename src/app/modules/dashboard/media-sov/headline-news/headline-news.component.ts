import { Component } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { TagComponent } from '../../../../core/components/tag/tag.component';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';

@Component({
  selector: 'app-headline-news',
  standalone: true,
  imports: [
    IconNewspaperComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    TagComponent,
    ImgFallbackDirective
  ],
  templateUrl: './headline-news.component.html',
  styleUrl: './headline-news.component.scss',
})
export class HeadlineNewsComponent {
  articles: any[] = [
    {
      title: 'test title',
      content: 'test contentel jkasjdkj lasdla asdl asdlasld  asldlas dav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Neutral',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
    },
  ];
}
