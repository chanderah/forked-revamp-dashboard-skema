import { Component } from '@angular/core';
import { TileComponent } from '../../../../core/components/tile/tile.component';

@Component({
  selector: 'app-overview-tiles',
  standalone: true,
  imports: [TileComponent],
  templateUrl: './overview-tiles.component.html',
  styleUrl: './overview-tiles.component.scss'
})
export class OverviewTilesComponent {

}
