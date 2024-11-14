import { Component } from '@angular/core';
import { ArticleListComponent } from '../../../core/components/article-list/article-list.component';
import { Article } from '../../../core/models/article.model';
import { MediaCount } from '../../../core/models/media-count.model';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { TitleCasePipe } from '../../../core/pipes/titlecase.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from '../../../core/services/map.service';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { initialState } from '../../../core/store/filter/filter.reducer';
import { FilterService } from '../../../core/services/filter.service';

@Component({
  selector: 'app-map-articles',
  standalone: true,
  imports: [ArticleListComponent, SpinnerComponent, TitleCasePipe],
  templateUrl: './map-articles.component.html',
  styleUrl: './map-articles.component.scss',
})
export class MapArticlesComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  location: string | null = null;
  articles: Article[] = [];
  page: number = 0;
  first: number = 0;
  rows: number = 16;
  totalRecords: number = 0;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    const location = this.route.snapshot.queryParamMap.get('location');
    this.location = location;
    if (location) {
      this.filter = this.filterService.subscribe((filter) => {
        this.fetchArticlesByGeo(location, 0, 6, filter);
      });
    } else {
      this.router.navigateByUrl('/dashboard/map');
    }
  }

  fetchArticlesByGeo = (location: string, page: number, rows: number, filter: any) => {
    this.isLoading = true;
    this.mapService
      .getArticleByGeo({
        page,
        size: rows,
        geo_loc: location,
        ...filter,
      })
      .subscribe((data) => {
        this.isLoading = false;
        this.articles = data.data;
        this.totalRecords = data.recordsTotal;
      });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
    this.fetchArticlesByGeo(this.location!, event.page, event.rows, this.filterService.filter);
  };
}
