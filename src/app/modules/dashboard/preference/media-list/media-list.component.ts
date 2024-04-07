import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { RouterModule } from '@angular/router';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { ArticleService } from '../../../../core/services/article.service';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { initialState } from '../../../../core/store/filter/filter.reducer';
import { Article } from '../../../../core/models/article.model';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagComponent } from '../../../../core/components/tag/tag.component';
import {
  NEGATIVE_TONE,
  NEUTRAL_TONE,
  POSITIVE_TONE,
  TONE_MAP,
} from '../../../../shared/utils/Constants';
import { ButtonSecondaryComponent } from '../../../../core/components/button-secondary/button-secondary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FilterService } from '../../../../core/services/filter.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatAmountPipe } from '../../../../core/pipes/format-amount.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ChipModule } from 'primeng/chip';
import { MultiSelectModule } from 'primeng/multiselect';
import { Category } from '../../../../core/models/category.model';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
@Component({
  selector: 'app-media-list',
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
    TabMenuModule,
    TabViewModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.scss',
})
export class MediaListComponent {
  articles!: Article[];
  totalRecords!: number;
  loading: boolean = false;
  selectedArticles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 10;
  searchText$ = new Subject<string>();
  modalUpdateOpen: boolean = false;

  items: MenuItem[] = [
    { label: 'Media List', icon: 'pi pi-fw pi-list' },
    { label: 'Category List', icon: 'pi pi-fw pi-file' },
    { label: 'SubCategory List', icon: 'pi pi-fw pi-list' },
    { label: 'Spokeperson Alias', icon: 'pi pi-fw pi-user' },
    { label: 'Stopword', icon: 'pi pi-fw pi-volume-up' },
    { label: 'File Export', icon: 'pi pi-fw pi-file-export' },
  ];

  editedArticle: Article | null = null;
  editedCategories: { category_id: string }[] = [];
  availableCategories: Category[] = [];
  editedValues = new FormGroup({
    title: new FormControl(''),
    issue: new FormControl(''),
    content: new FormControl(''),
  });

  updateToneItems: MenuItem[] = [
    {
      label: 'Update Tone',
    },
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
  ];

  constructor(
    private articleService: ArticleService,
    private filterService: FilterService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData({ ...filter, page: this.page, maxSize: 10 });
    });
    this.searchText$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.page = 0;
        this.first = 0;
        this.fetchData({ page: 0, term: value });
      });
  }

  fetchData = (filter?: Partial<FilterRequestPayload>) => {
    this.loading = true;
    this.articleService
      .getUserEditing({ ...initialState, ...filter } as FilterRequestPayload)
      .subscribe((resp) => {
        this.loading = false;
        this.articles = resp.data;
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
    this.fetchData({ page: event.page });
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
      this.fetchData({ ...this.filterService.filter, page: 0 });
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
        this.fetchData({ ...this.filterService.filter, page: 0 });
      });
  };

  updateArticle = () => {
    const { title, content, issue } = this.editedValues.controls;
    console.log('title', title.value);
    console.log('content', content.value);
    console.log('issue', issue.value);
    console.log('editedCategories', this.editedCategories);

    const payload = {
      title: title.value,
      content: content.value,
      issue: issue.value,
    };
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
    this.availableCategories = categoriesResp?.results ?? [];
    this.editedArticle = article;
    this.editedCategories = article.categories.map((val) => ({
      category_id: val,
    }));
    this.editedValues.setValue({
      title: article.title ?? '',
      issue: article?.issue ?? '',
      content: article.content ?? '',
    });
    this.modalUpdateOpen = true;
  };

  onRemoveCategory = (category: string) => {
    // this.editedCategories = this.editedCategories.filter(
    //   (categoryStr) => categoryStr !== category
    // );
  };

  openPreview(article: Article) {
    window.open(article.preview_link, '_blank');
  }
}
