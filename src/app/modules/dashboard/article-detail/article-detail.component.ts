import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ImgFallbackDirective } from '../../../core/directive/img-fallback.directive';
import { TagComponent } from '../../../core/components/tag/tag.component';
import { Article } from '../../../core/models/article.model';
import { ActivatedRoute } from '@angular/router';
import { TONE_MAP } from '../../../shared/utils/Constants';
import { FormatAmountPipe } from '../../../core/pipes/format-amount.pipe';
import { ArticleService } from '../../../core/services/article.service';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { forkJoin, switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const highlightKeywords = (content: string, keywords: string[]): string => {
  const cleanedKeywords = keywords.map((keyword) => keyword.replace(/"/g, ''));
  const regex = new RegExp(cleanedKeywords.join('|'), 'gi');
  return content.replace(regex, (match) => `<mark>${match}</mark>`);
};

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    DividerModule,
    ImgFallbackDirective,
    TagComponent,
    FormatAmountPipe,
    SpinnerComponent,
    CommonModule,
  ],
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss',
})
export class ArticleDetailComponent {
  article: (Article & { toneLabel: string }) | undefined;
  isLoading: boolean = false;
  sanitizedContent: SafeHtml | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.isLoading = true;
          return forkJoin({
            articleResp: this.articleService.getArticleById(id!),
            keywordResp: this.articleService.getKeywordsByArticleId(id!),
          });
        })
      )
      .subscribe(({ articleResp, keywordResp }) => {
        this.isLoading = false;
        const articleData = articleResp.data;
        const keywordData = keywordResp.data;

        const hightligtedWords = highlightKeywords(
          articleData.content,
          keywordData
        );
        this.sanitizedContent =
          this.sanitizer.bypassSecurityTrustHtml(hightligtedWords);
        this.article = {
          ...articleData,
          toneLabel: TONE_MAP[articleData?.tone ?? 0] ?? '',
        };
      });
  }
}
