import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { IconSearchComponent } from '../../../core/components/icons/search/search.component';
import { DropdownModule } from 'primeng/dropdown';
import moment from 'moment';
import { PreferenceService } from '../../../core/services/preference.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../../../core/services/article.service';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { Article } from '../../../core/models/article.model';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { IconArticleNotFoundComponent } from '../../../core/components/icons/article-notfound/article-notfound.component';
import _ from 'lodash';

interface Option {
  name: string;
  value: string | number;
}

const SEARCH_LOCAL_KEY = 'search_terms'

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    InputTextModule,
    CalendarModule,
    ButtonModule,
    IconSearchComponent,
    DropdownModule,
    FormsModule,
    CommonModule,
    SpinnerComponent,
    ArticleListComponent,
    IconArticleNotFoundComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  selectedMedia: string = 'all';
  searchTerm: string = '';
  selectedContent: string = 'title';
  startDate: Date = moment().subtract(1, 'days').toDate();
  endDate: Date = new Date();

  articles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 16;
  totalRecords: number = 0;
  isLoading: boolean = false;

  hasSearched = false;

  contentOptions: Option[] = [
    { name: 'Title', value: 'title' },
    { name: 'Content', value: 'content' },
  ];
  mediaOptions: Option[] = [];

  isLoadingMediaOptions: boolean = true;

  constructor(
    private preferenceService: PreferenceService,
    private articleService: ArticleService,
  ) {
    this.getMediaOptions();
    const existingSearch = window.localStorage.getItem(SEARCH_LOCAL_KEY);
    if (existingSearch) {
      const searchTermsObj = JSON.parse(existingSearch)
      this.selectedMedia = searchTermsObj['media_category'] ?? 'all';
      this.searchTerm = searchTermsObj['term'] ?? '';
      this.selectedContent = searchTermsObj['search_field'] ?? 'title';
      if (searchTermsObj['start_date']) {
        this.startDate = moment(searchTermsObj['start_date']).toDate()
      }
      if (searchTermsObj['end_date']) {
        this.endDate = moment(searchTermsObj['end_date']).toDate()
      }
      const payload: any = {
        start_date: moment(this.startDate).format('YYYY-MM-DD'),
        end_date: moment(this.endDate).format('YYYY-MM-DD'),
        search_field: this.selectedContent,
        media_category: this.selectedMedia,
        page: 0,
        term: this.searchTerm,
      };
      this.fetchArticles(payload);
    }
  }

  getMediaOptions = () => {
    this.preferenceService.getMediaCategories().subscribe(
      (response) => {
        const mediaOptions = response.results.map((category) => ({
          name: category.value,
          value: category.key,
        }));
        this.mediaOptions = [...this.mediaOptions, ...mediaOptions];
      },
      () => {
        // on Error
      },
      () => {
        this.isLoadingMediaOptions = false;
      }
    );
  };

  fetchArticles = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.articleService
      .searchArticles(filter)
      .subscribe(({ results, totalItems }) => {
        this.totalRecords = totalItems;
        this.articles = results;
      })
      .add(() => {
        this.isLoading = false;
        this.hasSearched = true;
      });
  };

  onSearch() {
    const payload: any = {
      start_date: moment(this.startDate).format('YYYY-MM-DD'),
      end_date: moment(this.endDate).format('YYYY-MM-DD'),
      search_field: this.selectedContent,
      media_category: this.selectedMedia,
      page: 0,
      term: this.searchTerm,
    };
    window.localStorage.setItem(SEARCH_LOCAL_KEY, JSON.stringify(payload))
    this.fetchArticles(payload);
  }

  onPageChange = (event: any) => {
    const payload = {
      start_date: moment(this.startDate).format('YYYY-MM-DD'),
      end_date: moment(this.endDate).format('YYYY-MM-DD'),
      search_field: this.selectedContent,
      media_category: 'all',
      page: 0,
      term: this.searchTerm,
    };

    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.fetchArticles({
      ...payload,
      page: event.page,
      size: event.rows,
    });
  };
}
