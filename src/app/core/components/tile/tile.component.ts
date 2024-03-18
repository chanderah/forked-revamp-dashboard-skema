import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconGlobeComponent } from '../icons/globe/globe.component';
import { CommonModule } from '@angular/common';
import { IconScreenComponent } from '../icons/screen/screen.component';
import { IconNewspaperComponent } from '../icons/newspaper/newspaper.component';
import { IconStackComponent } from '../icons/stack/stack.component';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    IconGlobeComponent,
    IconScreenComponent,
    IconNewspaperComponent,
    IconStackComponent,
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss',
})
export class TileComponent {
  @Input() title!: string;
  @Input() content!: string | number;
  @Input() icon!: string;
  @Input() bgColor!: string;
  @Input() color!: string;
}
