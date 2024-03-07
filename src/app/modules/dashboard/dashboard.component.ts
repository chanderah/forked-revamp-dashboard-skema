import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { TabMenuModule } from 'primeng/tabmenu';
import { RouterModule } from '@angular/router';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  items: MenuItem[] | undefined;
  breadCrumbs: MenuItem[] | undefined;

  ngOnInit() {
    this.breadCrumbs = [{ label: 'Dashboard' }, { label: 'Overview' }];

    this.items = [
      { label: 'Overview', icon: 'pi pi-fw pi-home' },
      { label: 'Analyze', icon: 'pi pi-fw pi-chart-bar' },
      { label: 'Spokesperson', icon: 'pi pi-fw pi-users' },
      { label: 'News Index', icon: 'pi pi-fw pi-book' },
      { label: 'Preference', icon: 'pi pi-fw pi-cog' },
      { label: 'Share', icon: 'pi pi-fw pi-mobile' },
    ];
  }
}
