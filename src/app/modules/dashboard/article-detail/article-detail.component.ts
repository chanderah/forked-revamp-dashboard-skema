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
import { CommonModule, Location } from '@angular/common';
import { forkJoin, switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FilterService } from '../../../core/services/filter.service';

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
    private sanitizer: DomSanitizer,
    private location: Location,
    private filterService: FilterService
  ) {}

  extractDateFromUrl = (url: string) => {
    // Get the part of the URL after the last '/'
    const isUrl = url.startsWith('http');
    if (!isUrl) return url;

    const lastPart = url.substring(url.lastIndexOf('/') + 1);

    // Use a regular expression to match the date at the beginning of the string
    const dateRegex = /^(\d{4}-\d{2}-\d{2})/;
    const match = lastPart.match(dateRegex);

    if (match) {
      return match[1]; // Return the captured date
    } else {
      console.error('Date not found in the last part of the URL');
      return null;
    }
  };

  ngOnInit() {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          this.isLoading = true;
          return forkJoin({
            articleResp: this.articleService.getArticleById(id!),
          });
        })
      )
      .subscribe(({ articleResp }) => {
        this.isLoading = false;
        const articleData = articleResp.data;
        this.filterService.subscribe((filter) => {
          const hightligtedWords = highlightKeywords(
            articleData.content,
            articleData?.keywords ?? []
          );
          this.sanitizedContent =
            this.sanitizer.bypassSecurityTrustHtml(hightligtedWords);
        });
        let file = articleData?.file_pdf;
        if (articleData?.media_type === 'media cetak') {
          const parsed = this.extractDateFromUrl(file)?.split('-');
          const fileName = file.substring(file.lastIndexOf('/') + 1);
          if (parsed) {
            file = `https://api.skema.co.id/media/pdf_images/${parsed[0]}/${parsed[1]}/${parsed[2]}/${fileName}`;
          }
        } else if (articleData?.media_type === 'media tv') {
          const parsed = this.extractDateFromUrl(file)?.split('-');
          const fileName = file.substring(file.lastIndexOf('/') + 1);
          if (parsed) {
            file = `https://api.skema.co.id/media/media_tv/${parsed[0]}/${parsed[1]}/${parsed[2]}/${fileName}`;
          }
        }

        this.article = {
          ...articleData,
          file_pdf: file,
          toneLabel: TONE_MAP[articleData?.tone ?? 0] ?? '',
        };
      });
  }

  goBack = () => {
    this.location.back();
  };
}
