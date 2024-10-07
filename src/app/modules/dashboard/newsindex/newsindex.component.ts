import { isEmpty, isValidEmail } from './../../../shared/utils/CommonUtils';
import { Component, ViewChild } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { IconPencilComponent } from '../../../core/components/icons/pencil/pencil.component';
import { RouterModule } from '@angular/router';
import { IconInfoComponent } from '../../../core/components/icons/info/info.component';
import { ArticleService } from '../../../core/services/article.service';
import { FilterRequestPayload } from '../../../core/models/request.model';
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
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FilterService } from '../../../core/services/filter.service';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormatAmountPipe } from '../../../core/pipes/format-amount.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { Category } from '../../../core/models/category.model';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getUserFromLocalStorage } from '../../../shared/utils/AuthUtils';
import { User } from '../../../core/models/user.model';
import { ColumnFilter } from 'primeng/table';

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
    FormsModule,
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
  @ViewChild('filterField')
  filterField!: ColumnFilter;
  filter: any;

  articles!: Article[];
  clearArticles!: Article[];
  totalRecords!: number;
  selectedArticles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 10;
  searchForm = this.fb.group({
    query: '',
    field: 'title',
  });
  modalUpdateOpen: boolean = false;
  showSendMailDialog: boolean = false;

  isLoading: boolean = false;
  editedArticle!: Article;
  editedCategories: { category_id: string }[] = [];
  availableCategories: Category[] = [];

  sendMailCtrl: FormControl = new FormControl('', Validators.required);
  editedValues = this.fb.group({
    title: '',
    issue: '',
    summary: '',
  });

  sanitizedContent: SafeHtml | null = null;
  selectedTones: any = [];

  searchFieldOptions = [
    { label: 'Title', value: 'title' },
    { label: 'Content', value: 'content' },
  ];
  toneOptions = Object.keys(TONE_MAP).map((key) => ({
    label: TONE_MAP[key],
    value: key,
  }));

  user: User | null = getUserFromLocalStorage();

  listAction: MenuItem[] = [
    {
      label: 'Download PDF',
      command: () => this.downloadAsPdf(),
    },
    {
      label: 'Download DOC',
      command: () => this.downloadAsDocs(),
    },
    {
      label: 'Send to E-mail',
      command: () => (this.showSendMailDialog = true),
    },
    {
      label: 'Update Tone',
      disabled: !this?.user?.stat_edit,
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

  constructor(
    private articleService: ArticleService,
    private filterService: FilterService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      this.fetchData({ ...filter, page: this.page, size: this.rows });
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((v) => {
        this.page = 0;
        this.first = 0;
        this.fetchData({ page: 0, term: v.query ?? '', size: this.rows });
      });
  }

  fetchData = (filter?: Partial<FilterRequestPayload>) => {
    this.isLoading = true;
    if (this.filterField) {
      this.filterField.overlayVisible = false;
    }

    this.articleService
      .getUserEditing({
        ...this.filterService.filter,
        ...filter,
        term: this.searchForm.get('query')?.value,
        search_field: this.searchForm.get('field')?.value,
      } as FilterRequestPayload)
      .subscribe((resp) => {
        this.isLoading = false;
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
    this.isLoading = true;

    const { title, summary, issue } = this.editedValues.controls;
    const apis = [
      this.articleService.updateArticleSave({
        advalue_bw: `${this.editedArticle.advalue_bw}`,
        advalue_fc: `${this.editedArticle.advalue_fc}`,
        article_id: +this.editedArticle.article_id!,
        category_ids: this.editedCategories.map((val) => val.category_id),
        circulation: `${this.editedArticle.circulation}`,
        datee: this.editedArticle.datee?.split(' ')[0] ?? '',
        media_id: this.editedArticle.media_id!,
        tone: this.editedArticle.tone!,
      }),
    ];

    if (title.dirty) {
      apis.push(
        this.articleService.updateArticleTitle({
          article_id: this.editedArticle?.article_id!,
          category_id: this.editedArticle?.category_id!,
          title: title.value ?? '',
        })
      );
    }

    if (issue.dirty) {
      apis.push(
        this.articleService.updateArticleIssue({
          article_id: [+this.editedArticle?.article_id!],
          new_topic: issue.value ?? '',
          topic: [this.editedArticle?.issue ?? ''],
        })
      );
    }

    if (summary.dirty) {
      apis.push(
        this.articleService.updateArticleSummary({
          article_id: +this.editedArticle?.article_id!,
          category_id: this.editedArticle?.article_id!,
          summary: summary.value ?? '',
        })
      );
    }

    const currentCategories = this.editedCategories.map((v) => v.category_id);
    const deletedCategories = this.editedArticle.categories.filter(
      (v) => !currentCategories.includes(v)
    );

    for (const v of deletedCategories) {
      apis.push(
        this.articleService.deleteCategory({
          article_id: this.editedArticle.article_id,
          category_id: v,
        })
      );
    }

    forkJoin(apis).subscribe({
      next: () => {
        this.fetchData({
          ...this.filterService.filter,
          page: this.page,
          size: this.rows,
        });

        this.modalUpdateOpen = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Updated',
          detail: 'Data has been updated.',
        });
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update data.',
        });
      },
    });
  };

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
    this.isLoading = true;
    this.articleService
      .downloadPdfs(this.selectedArticles)
      .subscribe(({ data }) => {
        this.selectedArticles = [];
        if (data.link) {
          window.open(data.link, '_blank');
        }
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  downloadAsDocs = () => {
    this.isLoading = true;
    this.articleService
      .downloadDocs(this.selectedArticles)
      .subscribe(({ data }) => {
        this.selectedArticles = [];
        if (data) {
          window.open(data, '_blank');
        }
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  sendMail() {
    this.isLoading = true;
    this.articleService
      .sendMail(this.sendMailCtrl.value, this.selectedArticles)
      .subscribe(() => {
        this.selectedArticles = [];
        this.showSendMailDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email sent!',
        });
      })
      .add(() => {
        this.isLoading = false;
      });
  }

  isValidEmail(emails: string): boolean {
    if (isEmpty(emails)) return false;
    return emails.split(',').every((v) => isValidEmail(v.trim()));
  }

  openPreview(article: Article) {
    window.open(article.preview_link, '_blank');
  }

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

  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
}
