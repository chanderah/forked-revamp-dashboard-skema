import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { Article } from '../../models/article.model';
import { ImgFallbackDirective } from '../../directive/img-fallback.directive';
import { PaginatorModule } from 'primeng/paginator';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'article-list',
  standalone: true,
  imports: [RouterModule, AvatarModule, CommonModule, ImgFallbackDirective, PaginatorModule, DividerModule],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.scss'
})
export class ArticleListComponent {
  @Input() articles!: Article[];
  @Input() first!: number;
  @Input() rows!: number;
  @Input() totalRecords!: number;
  @Input() onPageChange!: (e: any) => void;
}
