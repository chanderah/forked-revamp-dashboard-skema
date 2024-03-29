import { Route } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DashboardComponent } from './dashboard.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { SpokespersonComponent } from './spokesperson/spokesperson.component';
import { PreferenceComponent } from './preference/preference.component';
import { ShareComponent } from './share/share.component';
import { NewsIndexRoutes } from './newsindex/newsindex.routes';
import { MediaSOVComponent } from './media-sov/media-sov.component';
import { MapComponent } from './map/map.component';
import { ArticlesComponent } from './articles/articles.component';

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
      },
      {
        path: 'analyze',
        title: 'Analyze',
        component: AnalyzeComponent,
      },
      {
        path: 'spokesperson',
        title: 'Spokesperson',
        component: SpokespersonComponent,
      },
      {
        path: 'media-sov',
        title: 'Media SOV',
        component: MediaSOVComponent,
      },
      {
        path: 'map',
        title: 'Map',
        component: MapComponent,
      },
      {
        path: 'newsindex',
        title: 'News Index',
        children: NewsIndexRoutes,
      },
      {
        path: 'preference',
        title: 'Preference',
        component: PreferenceComponent,
      },
      {
        path: 'share',
        title: 'Share',
        component: ShareComponent,
      },
      {
        path: 'articles',
        title: 'Articles',
        component: ArticlesComponent,
        withFilter: true,
      },
    ],
  },
];
