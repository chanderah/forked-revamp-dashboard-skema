import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DashboardComponent } from './dashboard.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { SpokespersonComponent } from './spokesperson/spokesperson.component';
import { NewsindexComponent } from './newsindex/newsindex.component';
import { PreferenceComponent } from './preference/preference.component';
import { ShareComponent } from './share/share.component';

export const DashboardRoutes: Routes = [
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
        path: 'newsindex',
        title: 'News Index',
        component: NewsindexComponent,
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
    ],
  },
];
