import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { Store } from '@ngrx/store';
import { DomUtil, MapOptions, control, geoJSON, latLng, tileLayer } from 'leaflet';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { AllCount, Location } from '../../../core/models/all-count.model';
import { Article } from '../../../core/models/article.model';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { FilterService } from '../../../core/services/filter.service';
import { MapService } from '../../../core/services/map.service';
import { AppState } from '../../../core/store';
import { FilterState, initialState } from '../../../core/store/filter/filter.reducer';
import { isDarkMode } from '../../../shared/utils/CommonUtils';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    LeafletModule,
    DividerModule,
    IconNewspaperComponent,
    CommonModule,
    SpinnerComponent,
    RouterModule,
    DropdownModule,
    FormsModule,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }

  mapLocationData: Location[] = [];
  map: L.Map | null = null;
  geoJsonLayer: L.GeoJSON | null = null;
  selectedLoc: string | null = null;
  articles: Article[] = [];
  isLoadingArticles: boolean = false;

  selectedFilter: string = 'article';
  filterOptions = [
    { name: 'Article', value: 'article' },
    { name: 'Media', value: 'media' },
  ];

  options: MapOptions = {
    layers: [
      tileLayer('', {
        maxZoom: 8,
        minZoom: 5,
      }),
    ],
    zoom: 5,
    center: latLng(-0.1, 117.816666),
    zoomControl: false,
  };

  constructor(
    private mapService: MapService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.filter = this.filterService.subscribe(this.onFilterChange);
  }

  navigateInsideZone(article_id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`/dashboard/articles/${article_id}`]);
    });
  }

  fetchAllCount = (filter: FilterRequestPayload | FilterState = initialState) => {
    this.mapService.getAllCount(filter as FilterRequestPayload).subscribe((res) => {
      this.mapLocationData = res.data;
      this.addGeoJSONLayer(filter, res);
      this.selectedLoc = null;
    });
  };

  fetchArticlesByGeo = (filter: FilterRequestPayload | FilterState | null, location = this.selectedLoc) => {
    this.isLoadingArticles = true;
    this.selectedLoc = location;

    let req = filter ?? initialState;
    if (location) req = { ...req, geo_loc: location };

    this.mapService.getArticleByGeo(req).subscribe((res) => {
      this.isLoadingArticles = false;
      this.articles = res.data;
      this.cdr.detectChanges();
    });
  };

  addLegendControl = () => {
    if (!this.map) return;
    const legendControl = control.layers(undefined, undefined, {
      position: 'bottomright',
    });
    legendControl.onAdd = () => {
      const legendContainer = DomUtil.create('div', 'legend');
      const legendContent = `
        <div style="background: linear-gradient(to right, rgba(138, 144, 171, 0.2), rgba(138, 144, 171, 1))" class="w-12rem h-1rem"></div>
        <div class="flex justify-content-between">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
        </div>
      `;
      legendContainer.innerHTML = legendContent;
      return legendContainer;
    };
    legendControl.addTo(this.map);
  };

  addGeoJSONLayer(filter: any, data: AllCount): void {
    const getDataByLocation = (featureName: string) => {
      return data.data.find((location) => location.key.toUpperCase() === featureName);
    };

    this.mapService.getGeoJsonData().subscribe((data) => {
      if (!this.map) return;
      this.geoJsonLayer = geoJSON(data, {
        onEachFeature: (feature, layer) => {
          const featureName = feature.properties.name;
          const tooltipContent = `${featureName}: ${getDataByLocation(featureName)?.value ?? 0}`;

          layer.bindTooltip(tooltipContent, {
            className: 'bg-color',
            // permanent: true,
          });

          layer.on({
            click: (e) => {
              const clickedFeatureName = e.target.feature.properties.name;
              this.fetchArticlesByGeo(filter, clickedFeatureName);
            },
            mouseover: (e) => {
              const hoveredLayer = e.target;
              hoveredLayer.setStyle({ fillColor: isDarkMode() ? '#f1f4fa' : '#111827', fillOpacity: 1 });
            },
            mouseout: (e) => {
              const hoveredLayer = e.target;
              const featureData = getDataByLocation(featureName);

              hoveredLayer.setStyle({
                fillColor: this.getMapColor(featureData?.value ?? 0),
                fillOpacity: 1,
              });
            },
          });
        },
        style: (feature) => {
          const featureName = feature?.properties.name;
          const featureData = getDataByLocation(featureName);

          return {
            fillColor: this.getMapColor(featureData?.value ?? 0),
            fillOpacity: 1,
            color: isDarkMode() ? '#19182b' : '#f1f4fa',
            weight: 1,
          };
        },
      }).addTo(this.map);
    });
  }

  getLevel(num: number, min: number, max: number) {
    if (num === 0) return 5;

    const range = max - min;
    const levelRange = range / 4;

    if (num <= min + levelRange) return 4;
    else if (num <= min + 2 * levelRange) return 3;
    else if (num <= min + 3 * levelRange) return 2;
    return 1;
  }

  getMapColor(value: number) {
    const colorGroup: { [x: number]: string } = {
      1: '#04351d',
      2: '#074727',
      3: '#0c643a',
      4: '#2e8d58',
      5: '#6ab277',
    };

    const min = Math.min(...this.mapLocationData.map((v) => v.value));
    const max = Math.max(...this.mapLocationData.map((v) => v.value));
    const level = this.getLevel(value, min, max);
    return colorGroup[level];
  }

  onMapReady(map: L.Map) {
    this.map = map;
    const customZoomControl = control.zoom({
      position: 'bottomleft',
    });
    this.map.addControl(customZoomControl);
    this.addLegendControl();
  }

  onFilterTypeChange = (type_location: string) => {
    if (this.geoJsonLayer) {
      this.geoJsonLayer.removeFrom(this.map!);
    }
    this.fetchAllCount({ ...this.filterService.filter, type_location });
  };

  onFilterChange = (filterState: FilterState) => {
    if (this.geoJsonLayer) {
      this.geoJsonLayer.removeFrom(this.map!);
    }
    this.fetchAllCount(filterState);
  };
}
