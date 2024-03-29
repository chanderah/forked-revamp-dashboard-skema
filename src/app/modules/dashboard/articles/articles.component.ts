import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute } from '@angular/router';
import { TitleCasePipe } from '../../../core/pipes/titlecase.pipe';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule,
    ImgFallbackDirective,
    PaginatorModule,
    DividerModule,
    TitleCasePipe,
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss',
})
export class ArticlesComponent {
  type: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.type = this.route.snapshot.queryParamMap.get('type');
  }

  articles: any[] = [
    {
      title: 'test title',
      content: 'test contentel jkasjdkj lasdla asdl asdlasld  asldlas dav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Neutral',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Positive',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
    {
      title: 'test title',
      content: 'test contentel jkasjdkjav',
      tone: 'Negative',
      datee: '2021-23-01 09',
      journalist: 'Ahmad',
    },
  ];
  first: number = 0;

  rows: number = 10;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}
