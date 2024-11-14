import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FilterComponent } from './components/filter/filter.component';
import { IconHomeComponent } from '../../core/components/icons/home/home.component';
import { IconCableComponent } from '../../core/components/icons/cable/cable.component';
import { IconChartComponent } from '../../core/components/icons/chart/chart.component';
import { IconNotesComponent } from '../../core/components/icons/notes/notes.component';
import { IconPeopleComponent } from '../../core/components/icons/people/people.component';
import { IconPreferenceComponent } from '../../core/components/icons/preference/preference.component';
import { User } from '../../core/models/user.model';
import { USER_KEY, getUserFromLocalStorage } from '../../shared/utils/AuthUtils';
import { ToggleDarkmodeComponent } from './components/toggle-darkmode/toggle-darkmode.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { IconGlobeComponent } from '../../core/components/icons/globe/globe.component';
import { IconNewspaperComponent } from '../../core/components/icons/newspaper/newspaper.component';
import { FilterService } from '../../core/services/filter.service';
import { AppState } from '../../core/store';
import { Store } from '@ngrx/store';
import { setFilter } from '../../core/store/filter/filter.actions';
import { initialState } from '../../core/store/filter/filter.reducer';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    TabMenuModule,
    InputSwitchModule,
    AvatarModule,
    BreadcrumbModule,
    ToolbarModule,
    DividerModule,
    DropdownModule,
    FloatLabelModule,
    FilterComponent,
    RouterOutlet,
    RouterLink,
    IconHomeComponent,
    IconCableComponent,
    IconChartComponent,
    IconNotesComponent,
    IconPeopleComponent,
    IconPreferenceComponent,
    ToggleDarkmodeComponent,
    TieredMenuModule,
    IconGlobeComponent,
    IconNewspaperComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  navItems: MenuItem[] | undefined;
  navActiveItem: string | undefined;
  breadCrumbsItems: MenuItem[] | undefined;
  profileItems: MenuItem[] | undefined;
  showFilter: boolean = true;

  user: User | null = getUserFromLocalStorage();

  userCompLevelMap: { [x: string]: string } = {
    1: 'Viewer',
    2: 'Editor',
    3: 'Admin Analyst',
    4: 'Custom',
    6: 'Super Admin',
    7: 'Analyst',
  };

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    this.router.events.subscribe(() => {
      let currentRoute = this.router.routerState.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }
      if ((currentRoute.routeConfig as any).withFilter !== undefined) {
        this.showFilter = (currentRoute.routeConfig as any).withFilter;
      }
    });
  }

  ngOnInit() {
    const currentLocation = window.location.href.split('/').pop();
    this.navActiveItem = currentLocation;
    const navItems: any = [
      {
        label: 'Overview',
        routerLink: 'overview',
      },
      {
        label: 'Analyze',
        routerLink: 'analyze',
      },
      {
        label: 'Media SOV',
        routerLink: 'media-sov',
      },
      {
        label: 'Map',
        routerLink: 'map',
      },
      {
        label: 'Spokesperson',
        routerLink: 'spokesperson',
      },
      {
        label: 'News Index',
        routerLink: 'news-index',
      },
      {
        label: 'Preference',
        routerLink: 'preference',
      },
      {
        label: 'Share',
        routerLink: 'share',
      },
    ];
    this.navItems = navItems.filter((navItem: any) => {
      return this.user?.menu?.map((m) => m.toLowerCase()).includes(navItem.routerLink);
    });

    const breadCrumbLabelMap: { [x: string]: string } = {
      'overview': 'Overview',
      'analyze': 'Analyze',
      'spokesperson': 'Spokesperson',
      'media-sov': 'Media SOV',
      'news-index': 'News Index',
      'preference': 'Preference',
      'overview-articles': 'Articles',
      'map': 'Map',
      'map-articles': 'Map Articles',
      'articles': 'Article',
      'share': 'Share',
      'search': 'Search',
    };

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        const nav = route as NavigationEnd;
        const location = nav.url.split('/')?.pop?.() ?? '';
        const breadCrumbsItems = [{ label: 'Dashboard' }];

        if (breadCrumbLabelMap[location.split('?')[0]]) {
          breadCrumbsItems.push({
            label: breadCrumbLabelMap[location.split('?')[0]],
          });
        }

        this.breadCrumbsItems = breadCrumbsItems;
      }
    });

    const breadCrumbsItems = [{ label: 'Dashboard' }];

    if (breadCrumbLabelMap[currentLocation?.split('?')[0] ?? '']) {
      breadCrumbsItems.push({
        label: breadCrumbLabelMap[currentLocation?.split('?')[0] ?? ''],
      });
    }

    this.breadCrumbsItems = breadCrumbsItems;

    this.profileItems = [
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: () => {
          window.localStorage.removeItem(USER_KEY);
          this.router.navigateByUrl('login');
        },
      },
    ];
  }

  onActiveItemChange(event: MenuItem) {
    this.navActiveItem = event.routerLink;
  }
}
