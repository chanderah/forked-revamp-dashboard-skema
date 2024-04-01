import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
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
import { getUserFromLocalStorage, logout } from '../../shared/utils/AuthUtils';
import { ToggleDarkmodeComponent } from './components/toggle-darkmode/toggle-darkmode.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { IconGlobeComponent } from '../../core/components/icons/globe/globe.component';
import { IconNewspaperComponent } from '../../core/components/icons/newspaper/newspaper.component';

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

  constructor(private router: Router) {
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
    this.navItems = [
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
        routerLink: 'newsindex',
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

    const breadCrumbLabelMap: { [x: string]: string } = {
      overview: 'Overview',
      analyze: 'Analyze',
      spokesperson: 'Spokesperson',
      'media-sov': 'Media SOV',
      newsindex: 'News Index',
      preference: 'Preference',
      'overview-articles': 'Articles',
      'map': 'Map',
      share: 'Share',
    };

    this.router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        const nav = route as NavigationEnd;
        const location = nav.url.split('/')?.pop?.() ?? '';

        this.breadCrumbsItems = [
          { label: 'Dashboard' },
          {
            label: breadCrumbLabelMap[location.split('?')[0]] ?? '-',
          },
        ];
      }
    });

    this.breadCrumbsItems = [
      { label: 'Dashboard' },
      { label: breadCrumbLabelMap[currentLocation?.split('?')[0] ?? ''] },
    ];

    this.profileItems = [
      {
        label: 'Logout',
        icon: 'pi pi-power-off',
        command: () => logout(),
      },
    ];
  }

  onActiveItemChange(event: MenuItem) {
    this.navActiveItem = event.routerLink;
  }
}
