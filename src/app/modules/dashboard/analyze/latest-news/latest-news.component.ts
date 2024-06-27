import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { selectAnalyzeState } from '../../../../core/store/analyze/analyze.selectors';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { AppState } from '../../../../core/store';
import { Store } from '@ngrx/store';
import { AnalyzeState } from '../../../../core/store/analyze/analyze.reducer';
import { Observable } from 'rxjs';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { getHighlights } from '../../../../core/store/analyze/analyze.actions';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { Article } from '../../../../core/models/article.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { RouterLink } from '@angular/router';
import { FilterService } from '../../../../core/services/filter.service';
import { ArticleService } from '../../../../core/services/article.service';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [
    CarouselModule,
    IconNewspaperComponent,
    IconInfoComponent,
    AvatarModule,
    CommonModule,
    SpinnerComponent,
    ImgFallbackDirective,
    RouterLink,
  ],
  templateUrl: './latest-news.component.html',
  styleUrl: './latest-news.component.scss',
})
export class LatestNewsComponent {
  analyzeState: Observable<AnalyzeState>;
  filterState: Observable<FilterState>;
  articles: Article[] = [];
  isLoading: boolean = false;
  responsiveOptions:
    | { breakpoint: string; numVisible: number; numScroll: number }[]
    | undefined;

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService,
    private articleService: ArticleService
  ) {
    this.analyzeState = this.store.select(selectAnalyzeState);
    this.filterState = this.store.select(selectFilterState);

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.isLoading = true;

      this.articleService
        .getHighlights(filter)
        .subscribe((data) => {
          this.articles = data.data;
        })
        .add(() => {
          this.isLoading = false;
        });
    });
  }
}
