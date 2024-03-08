import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [CardModule, DividerModule],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {
  @Input() title!: string;
  @Input() content!: string;
  @Input() icon!: string;
  @Input() bgColor!: string;
  @Input() color!: string;
}
