import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { TagComponent } from '../../../core/components/tag/tag.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [DividerModule, ImgFallbackDirective, TagComponent],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent {

}
