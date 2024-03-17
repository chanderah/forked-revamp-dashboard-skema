import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  navItems: MenuItem[] | undefined;
  navActiveItem: string | undefined;
  breadCrumbsItems: MenuItem[] | undefined;
  profileItems: MenuItem[] | undefined;

  user: User | null = getUserFromLocalStorage();

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

    this.breadCrumbsItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
      },
      {
        id: 'overview',
        label: 'Overview',
      },
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
