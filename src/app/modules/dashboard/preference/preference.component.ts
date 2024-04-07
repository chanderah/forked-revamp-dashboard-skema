import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { MediaListComponent } from './media-list/media-list.component';

@Component({
  selector: 'app-preference',
  standalone: true,
  imports: [MediaListComponent, TabViewModule],
  templateUrl: './preference.component.html',
  styleUrl: './preference.component.scss',
})
export class PreferenceComponent {}
