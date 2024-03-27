import { Routes } from '@angular/router';
import { NewsindexComponent } from './newsindex.component';
import { ClippingComponent } from './clipping/clipping.component';
import { EditingComponent } from './editing/editing.component';

export const NewsIndexRoutes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: NewsindexComponent,
    children: [
      {
        path: '',
        redirectTo: 'clipping',
        pathMatch: 'full',
      },
      {
        path: 'clipping',
        title: 'Clipping',
        component: ClippingComponent,
      },
      {
        path: 'editing',
        title: 'Editing',
        component: EditingComponent,
      },
    ],
  },
];
