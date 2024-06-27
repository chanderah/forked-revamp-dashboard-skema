import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import {
  DomUtil,
  MapOptions,
  circle,
  control,
  geoJSON,
  latLng,
  polygon,
  tileLayer,
} from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapService } from '../../../core/services/map.service';
import {
  FilterState,
  initialState,
} from '../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../core/models/request.model';
import { AllCount } from '../../../core/models/all-count.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../core/store';
import { selectFilterState } from '../../../core/store/filter/filter.selectors';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { Article } from '../../../core/models/article.model';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../core/components/spinner/spinner.component';
import { Router, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../core/services/filter.service';

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

  filterState: Observable<FilterState>;

  constructor(
    private mapService: MapService,
    private store: Store<AppState>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private filterService: FilterService
  ) {
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit(): void {
    this.filterState.subscribe(this.onFilterChange);
  }

  navigateInsideZone(article_id: string) {
    this.ngZone.run(() => {
      this.router.navigate([`/dashboard/articles/${article_id}`]);
    });
  }

  fetchAllCount = (
    filter: FilterRequestPayload | FilterState = initialState
  ) => {
    this.mapService
      .getAllCount(filter as FilterRequestPayload)
      .subscribe((data) => {
        this.addGeoJSONLayer(filter, data);
        this.selectedLoc = null;
      });
  };

  fetchArticlesByGeo = (
    filter: FilterRequestPayload | FilterState | null,
    location = this.selectedLoc
  ) => {
    this.selectedLoc = location;
    let reqFilter = filter ?? initialState;
    if (location)
      // @ts-ignore
      reqFilter = { ...reqFilter, geo_loc: location } as FilterRequestPayload;
    this.isLoadingArticles = true;
    this.mapService
      .getArticleByGeo(reqFilter as FilterRequestPayload)
      .subscribe((data) => {
        this.isLoadingArticles = false;
        this.articles = data.data;
        this.cdr.detectChanges(); // Trigger change detection
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
      return data.data.find(
        (location) => location.key.toUpperCase() === featureName
      );
    };

    const getOpacity = (value: number) => {
      let opacity = 0.2;
      if (value >= 1) opacity = 0.2;
      if (value >= 5) opacity = 0.4;
      if (value >= 10) opacity = 0.6;
      if (value >= 15) opacity = 0.8;
      if (value >= 20) opacity = 1;

      return opacity;
    };

    this.mapService.getGeoJsonData().subscribe((data) => {
      if (!this.map) return;
      this.geoJsonLayer = geoJSON(data, {
        onEachFeature: (feature, layer) => {
          const featureName = feature.properties.name;
          const tooltipContent = `${featureName}: ${
            getDataByLocation(featureName)?.value ?? 0
          }`;
          layer.bindTooltip(tooltipContent);
          layer.on({
            click: (e) => {
              const clickedFeatureName = e.target.feature.properties.name;
              this.fetchArticlesByGeo(filter, clickedFeatureName);
            },
            mouseover: (e) => {
              const hoveredLayer = e.target;
              hoveredLayer.setStyle({ fillColor: '#1999DC', fillOpacity: 1 });
            },
            mouseout: (e) => {
              const hoveredLayer = e.target;
              hoveredLayer.setStyle({
                fillColor: '#8A90AB',
                fillOpacity: getOpacity(
                  getDataByLocation(featureName)?.value ?? 0
                ),
              });
            },
          });
        },
        style: (feature) => {
          const featureName = feature?.properties.name;
          const value = getDataByLocation(featureName);
          const opacity = getOpacity(value?.value ?? 0);
          return {
            fillColor: '#8A90AB',
            fillOpacity: opacity,
            color: 'white', // Border color
            weight: 1, // Border weight (in pixels)
          };
        },
      }).addTo(this.map);
    });
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
