import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { User } from '../../core/models/user.model';
import {
  USER_KEY,
  getUserFromLocalStorage,
} from '../../shared/utils/AuthUtils';
import { FilterComponent } from './components/filter/filter.component';
import { ToggleDarkmodeComponent } from './components/toggle-darkmode/toggle-darkmode.component';

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
    ToggleDarkmodeComponent,
    TieredMenuModule,
    AngularSvgIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  navItems: MenuItem[] | undefined;
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

  breadCrumbLabelMap: { [x: string]: string } = {
    overview: 'Overview',
    analyze: 'Analyze',
    spokesperson: 'Spokesperson',
    'media-sov': 'Media SOV',
    'news-index': 'News Index',
    'social-media-index': 'Social Media Index',
    'social-media-overview': 'Social Media Overview',
    preference: 'Preference',
    'overview-articles': 'Articles',
    map: 'Map',
    'map-articles': 'Map Articles',
    articles: 'Article',
    share: 'Share',
    search: 'Search',
  };

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      let currentRoute = this.router.routerState.root;
      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.showFilter = !!(currentRoute.routeConfig as any).withFilter;
    });
  }

  ngOnInit() {
    const allNavItems: { label: string; routerLink: string; icon: string }[] = [
      {
        label: 'Overview',
        routerLink: 'overview',
        icon: '../../../assets/icons/home.svg',
      },
      {
        label: 'Analyze',
        routerLink: 'analyze',
        icon: '../../../assets/icons/chart.svg',
      },
      {
        label: 'Media SOV',
        routerLink: 'media-sov',
        icon: '../../../assets/icons/newspaper.svg',
      },
      {
        label: 'Map',
        routerLink: 'map',
        icon: '../../../assets/icons/globe.svg',
      },
      {
        label: 'Spokesperson',
        routerLink: 'spokesperson',
        icon: '../../../assets/icons/people.svg',
      },
      {
        label: 'News Index',
        routerLink: 'news-index',
        icon: '../../../assets/icons/notes.svg',
      },
      {
        label: 'Social Media Index',
        routerLink: 'social-media-index',
        icon: '../../../assets/icons/home.svg',
      },
      {
        label: 'Social Media Overview',
        routerLink: 'social-media-overview',
        icon: '../../../assets/icons/home.svg',
      },
      {
        label: 'Preference',
        routerLink: 'preference',
        icon: '../../../assets/icons/settings.svg',
      },
      {
        label: 'Share',
        routerLink: 'share',
        icon: '../../../assets/icons/cable.svg',
      },
    ];

    // TODO: REMOVE
    this.user?.menu.push('social-media-overview');
    this.user?.menu.push('social-media-index');

    this.navItems = allNavItems.filter((navItem: any) => {
      return this.user?.menu
        ?.map((m) => m.toLowerCase())
        .includes(navItem.routerLink);
    });

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

    this.updateBreadCrumbs();
    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) this.updateBreadCrumbs();
    });
  }

  updateBreadCrumbs() {
    const breadCrumbsItems = [{ label: 'Dashboard' }];
    if (this.breadCrumbLabelMap[this.currentRoute]) {
      breadCrumbsItems.push({
        label: this.breadCrumbLabelMap[this.currentRoute],
      });
    }
    this.breadCrumbsItems = breadCrumbsItems;
  }

  get currentRoute(): string {
    const url = this.router.url.split('?')[0];
    return url.split('/').pop() ?? '';
  }
}
