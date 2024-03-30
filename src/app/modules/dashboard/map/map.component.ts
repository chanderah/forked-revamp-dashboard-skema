import { Component } from '@angular/core';
import Leaflet, { latLng, tileLayer } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  // @ts-ignore
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909),
  };


  onMapReady(map: L.Map) {
    setTimeout(function () { map.invalidateSize() }, 800);
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
