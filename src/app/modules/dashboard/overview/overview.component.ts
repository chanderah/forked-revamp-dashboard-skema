import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { OverviewTilesComponent } from './overview-tiles/overview-tiles.component';
import { TopCityComponent } from './top-city/top-city.component';
import { TopArticleComponent } from './top-article/top-article.component';
import { TopMediaComponent } from './top-media/top-media.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    OverviewTilesComponent,
    TopCityComponent,
    TopArticleComponent,
    TopMediaComponent,
    DividerModule,
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {}
