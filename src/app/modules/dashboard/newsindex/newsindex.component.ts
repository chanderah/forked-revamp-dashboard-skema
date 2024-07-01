import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { IconPencilComponent } from '../../../core/components/icons/pencil/pencil.component';
import { RouterModule } from '@angular/router';
import { IconInfoComponent } from '../../../core/components/icons/info/info.component';
import { ArticleService } from '../../../core/services/article.service';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { initialState } from '../../../core/store/filter/filter.reducer';
import { Article } from '../../../core/models/article.model';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagComponent } from '../../../core/components/tag/tag.component';
import {
  NEGATIVE_TONE,
  NEUTRAL_TONE,
  POSITIVE_TONE,
  TONE_MAP,
} from '../../../shared/utils/Constants';
import { ButtonSecondaryComponent } from '../../../core/components/button-secondary/button-secondary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FilterService } from '../../../core/services/filter.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatAmountPipe } from '../../../core/pipes/format-amount.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { Category } from '../../../core/models/category.model';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import _ from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const highlightKeywords = (content: string, keywords: string[]): string => {
  const cleanedKeywords = keywords.map((keyword) => keyword.replace(/"/g, ''));
  const regex = new RegExp(cleanedKeywords.join('|'), 'gi');
  return content.replace(regex, (match) => `<mark>${match}</mark>`);
};

@Component({
  selector: 'app-newsindex',
  standalone: true,
  imports: [
    DividerModule,
    IconNewspaperComponent,
    IconPencilComponent,
    RouterModule,
    IconInfoComponent,
    TagModule,
    ButtonModule,
    TableModule,
    TagComponent,
    ButtonSecondaryComponent,
    InputTextModule,
    TieredMenuModule,
    PaginatorModule,
    CommonModule,
    ConfirmPopupModule,
    DialogModule,
    ReactiveFormsModule,
    FormatAmountPipe,
    InputTextareaModule,
    ChipModule,
    MultiSelectModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './newsindex.component.html',
  styleUrl: './newsindex.component.scss',
})
export class NewsindexComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  articles!: Article[];
  clearArticles!: Article[];
  totalRecords!: number;
  loading: boolean = false;
  selectedArticles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 10;
  searchText$ = new Subject<string>();
  modalUpdateOpen: boolean = false;

  isUpdating: boolean = false;
  editedArticle: Article | null = null;
  editedCategories: { category_id: string }[] = [];
  availableCategories: Category[] = [];
  editedValues = new FormGroup({
    title: new FormControl(''),
    issue: new FormControl(''),
    summary: new FormControl(''),
  });

  selectedTones: any = [];
  toneOptions = Object.keys(TONE_MAP).map((key) => ({
    label: TONE_MAP[key],
    value: key,
  }));

  filterCallback() {
    const selectedToneValues = this.selectedTones.map(
      (option: any) => +option.value
    );
    if (this.selectedTones.length) {
      this.articles = this.clearArticles.filter((article) =>
        selectedToneValues.includes(article.tone)
      );
    } else {
      this.articles = this.clearArticles;
    }
  }

  clear() {
    this.selectedTones = [];
    this.articles = this.clearArticles;
  }

  updateToneItems: MenuItem[] = [
    {
      label: 'Download pdf',
      command: () => this.downloadAsPdf(),
    },
    {
      label: 'Download Doc',
      command: () => this.downloadAsDocs(),
    },
    {
      label: 'Update Tone',
      items: [
        {
          label: 'Posivite',
          command: () => this.updateTone(POSITIVE_TONE),
        },
        {
          label: 'Neutral',
          command: () => this.updateTone(NEUTRAL_TONE),
        },
        {
          label: 'Negative',
          command: () => this.updateTone(NEGATIVE_TONE),
        },
      ],
    },
  ];
  sanitizedContent: SafeHtml | null = null;

  constructor(
    private articleService: ArticleService,
    private filterService: FilterService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      this.fetchData({ ...filter, page: this.page, size: this.rows });
    });
    this.searchText$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.page = 0;
        this.first = 0;
        this.fetchData({ page: 0, term: value, size: this.rows });
      });
  }

  fetchData = (filter?: Partial<FilterRequestPayload>) => {
    this.loading = true;
    this.articleService
      .getUserEditing({ ...initialState, ...filter } as FilterRequestPayload)
      .subscribe((resp) => {
        this.loading = false;
        const selectedToneValues = this.selectedTones.map(
          (option: any) => +option.value
        );
        if (this.selectedTones.length) {
          this.articles = resp.data.filter((article) =>
            selectedToneValues.includes(article.tone)
          );
        } else {
          this.articles = resp.data;
        }
        this.clearArticles = resp.data;
        this.totalRecords = resp.recordsTotal;
      });
  };

  onSelectionChange(value = []) {
    this.selectedArticles = value;
  }

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.fetchData({ page: event.page, size: event.rows });
  };

  deleteArticle = (event: Event) => {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete this record(s)?',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-sm',
      accept: this.confirmDeleteArticle,
    });
  };

  confirmDeleteArticle = () => {
    const articleIds = this.selectedArticles.map(({ article_id }) => ({
      article_id,
    }));

    this.articleService.deleteArticle(articleIds).subscribe(() => {
      this.fetchData({
        ...this.filterService.filter,
        page: 0,
        size: this.rows,
      });
      this.selectedArticles = [];
    });
  };

  updateTone = async (tone: number) => {
    const article_id = this.selectedArticles.map(
      ({ article_id }) => article_id
    );
    const category_id =
      this.selectedArticles.map(({ category_id }) => category_id ?? '') ?? [];

    this.articleService
      .updateArticleTone({
        article_id,
        category_id,
        tone: tone,
      })
      .subscribe(() => {
        this.selectedArticles = [];
        this.fetchData({
          ...this.filterService.filter,
          page: 0,
          size: this.rows,
        });
      });
  };

  updateArticle = async () => {
    try {
      const { title, summary, issue } = this.editedValues.controls;

      const promises = [];
      if (title.dirty && title.value) {
        promises.push(
          this.articleService
            .updateArticleTitle({
              article_id: this.editedArticle?.article_id!,
              category_id: this.editedArticle?.category_id!,
              title: title.value,
            })
            .toPromise()
        );
      }

      if (issue.dirty && issue.value) {
        promises.push(
          this.articleService
            .updateArticleIssue({
              article_id: [+this.editedArticle?.article_id!],
              new_topic: issue.value,
              topic: [this.editedArticle?.issue ?? ''],
            })
            .toPromise()
        );
      }

      if (summary.dirty && summary.value) {
        promises.push(
          this.articleService
            .updateArticleSummary({
              article_id: +this.editedArticle?.article_id!,
              category_id: this.editedArticle?.article_id!,
              summary: summary.value,
            })
            .toPromise()
        );
      }

      if (
        !_.isEqual(
          this.editedArticle?.categories,
          this.editedCategories.map((val) => val.category_id)
        )
      ) {
        const {
          advalue_bw,
          advalue_fc,
          article_id,
          circulation,
          datee,
          media_id,
          tone,
        } = this.editedArticle ?? {};
        promises.push(
          this.articleService
            .updateArticleSave({
              advalue_bw: `${advalue_bw}`,
              advalue_fc: `${advalue_fc}`,
              article_id: +article_id!,
              category_ids: this.editedCategories.map((val) => val.category_id),
              circulation: `${circulation}`,
              datee: datee?.split(' ')[0] ?? '',
              media_id: media_id!,
              tone: tone!,
            })
            .toPromise()
        );
      }

      this.isUpdating = true;
      await Promise.allSettled(promises);
      this.fetchData({
        ...this.filterService.filter,
        page: 0,
        size: this.rows,
      });
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: 'Data has been updated.',
      });
    } finally {
      this.modalUpdateOpen = false;
      this.isUpdating = false;
    }
  };

  search(searchTerm: string) {
    this.searchText$.next(searchTerm);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getToneLabel(tone: number) {
    return TONE_MAP[tone] ?? '';
  }

  openEditModal = async (article: Article) => {
    const categoriesResp = await this.articleService
      .getSubCategoriesDistinct()
      .toPromise();

    const keywordRes = await this.articleService
      .getKeywordsByArticleId(article.article_id)
      .toPromise();

    const hightligtedWords = highlightKeywords(
      article.content,
      keywordRes?.data ?? []
    );
    this.sanitizedContent =
      this.sanitizer.bypassSecurityTrustHtml(hightligtedWords);

    this.availableCategories = categoriesResp?.results ?? [];
    this.editedArticle = article;
    this.editedCategories = article.categories.map((val) => ({
      category_id: val,
    }));
    this.editedValues.setValue({
      title: article.title ?? '',
      issue: article?.issue ?? '',
      summary: article?.summary ?? '',
    });
    this.modalUpdateOpen = true;
  };

  downloadAsPdf = () => {
    this.loading = true;
    this.articleService
      .downloadPdfs(this.selectedArticles)
      .subscribe(({ data }) => {
        if (data.link) {
          window.open(data.link, '_blank');
        }
      })
      .add(() => {
        this.loading = false;
        this.selectedArticles = [];
      });
  };

  downloadAsDocs = () => {
    this.loading = true;
    this.articleService
      .downloadDocs(this.selectedArticles)
      .subscribe(({ data }) => {
        if (data) {
          window.open(data, '_blank');
        }
      })
      .add(() => {
        this.loading = false;
        this.selectedArticles = [];
      });
  };

  openPreview(article: Article) {
    window.open(article.preview_link, '_blank');
  }
}
