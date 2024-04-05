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

@Component({
  selector: 'app-map-articles',
  standalone: true,
  imports: [ArticleListComponent, SpinnerComponent, TitleCasePipe],
  templateUrl: './map-articles.component.html',
  styleUrl: './map-articles.component.scss',
})
export class MapArticlesComponent {
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
    private mapService: MapService
  ) {}

  ngOnInit() {
    const location = this.route.snapshot.queryParamMap.get('location');
    this.location = location;
    if (location) {
      this.fetchArticlesByGeo(location, 0, 6);
    } else {
      this.router.navigateByUrl('/dashboard/map');
    }
  }

  fetchArticlesByGeo = (location: string, page: number, rows: number) => {
    this.isLoading = true;
    this.mapService
      .getArticleByGeo({
        ...(initialState as FilterRequestPayload),
        page,
        size: rows,
        geo_loc: location,
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
    this.fetchArticlesByGeo(this.location!, event.page, event.rows);
  };
}
