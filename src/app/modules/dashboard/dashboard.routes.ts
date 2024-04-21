import { Route } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DashboardComponent } from './dashboard.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { SpokespersonComponent } from './spokesperson/spokesperson.component';
import { PreferenceComponent } from './preference/preference.component';
import { ShareComponent } from './share/share.component';
import { MediaSOVComponent } from './media-sov/media-sov.component';
import { MapComponent } from './map/map.component';
import { OverviewArticlesComponent } from './overview-articles/overview-articles.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { MapArticlesComponent } from './map-articles/map-articles.component';
import { ArticlesByToneComponent } from './articles-by-tone/articles-by-tone.component';
import { NewsindexComponent } from './newsindex/newsindex.component';
import { TopArticlesComponent } from './top-articles/top-articles.component';
import { ArticlesByMediaComponent } from './articles-by-media/articles-by-media.component';
import { SearchComponent } from './search/search.component';

interface ChildrenRoute extends Route {
  withFilter?: boolean;
}

interface DashboardRoutesProps extends Route {
  children: ChildrenRoute[];
}

export const DashboardRoutes: DashboardRoutesProps[] = [
  {
    path: '',
    pathMatch: 'prefix',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        title: 'Overview',
        component: OverviewComponent,
        withFilter: true,
      },
      {
        path: 'analyze',
        title: 'Analyze',
        component: AnalyzeComponent,
        withFilter: true,
      },
      {
        path: 'spokesperson',
        title: 'Spokesperson',
        component: SpokespersonComponent,
        withFilter: true,
      },
      {
        path: 'media-sov',
        title: 'Media SOV',
        component: MediaSOVComponent,
        withFilter: true,
      },
      {
        path: 'map',
        title: 'Map',
        component: MapComponent,
        withFilter: true,
      },{
        path: 'map-articles',
        title: 'Map Articles',
        component: MapArticlesComponent,
        withFilter: true,
      },
      {
        path: 'newsindex',
        title: 'News Index',
        component: NewsindexComponent,
        withFilter: true,
      },
      {
        path: 'preference',
        title: 'Preference',
        component: PreferenceComponent,
        withFilter: true,
      },
      {
        path: 'share',
        title: 'Share',
        component: ShareComponent,
        withFilter: true,
      },
      {
        path: 'overview-articles',
        title: 'Overview Articles',
        component: OverviewArticlesComponent,
        withFilter: true,
      },
      {
        path: 'top-articles',
        title: 'Top Articles',
        component: TopArticlesComponent,
        withFilter: true,
      },
      {
        path: 'articles-by-media',
        title: 'Articles By Media',
        component: ArticlesByMediaComponent,
        withFilter: true,
      },
      {
        path: 'articles-by-tone',
        title: 'Articles By Tone',
        component: ArticlesByToneComponent,
        withFilter: true,
      },
      {
        path: 'articles/:id',
        title: 'Article Detail',
        component: ArticleDetailComponent,
        withFilter: false,
      },
      {
        path: 'search',
        title: 'Search',
        component: SearchComponent,
        withFilter: false,
      },
    ],
  },
];
