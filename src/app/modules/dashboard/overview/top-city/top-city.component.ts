import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AngularD3CloudModule } from 'angular-d3-cloud';
import { IconCarComponent } from '../../../../core/components/icons/car/car.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { OverviewState } from '../../../../core/store/overview/overview.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../../../core/store';
import { selectOverviewState } from '../../../../core/store/overview/overview.selectors';
import { Location } from '../../../../core/models/all-count.model';
import { getAllCount, getWordCloud } from '../../../../core/store/overview/overview.actions';
import { CommonModule } from '@angular/common';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { FilterState, initialState } from '../../../../core/store/filter/filter.reducer';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { RouterLink } from '@angular/router';
import { OverviewService } from '../../../../core/services/overview.service';
import { FilterService } from '../../../../core/services/filter.service';

@Component({
  selector: 'app-top-city',
  standalone: true,
  imports: [TableModule, AngularD3CloudModule, IconCarComponent, IconInfoComponent, CommonModule, SpinnerComponent, RouterLink],
  templateUrl: './top-city.component.html',
  styleUrl: './top-city.component.scss',
})
export class TopCityComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  overviewState: Observable<OverviewState>;
  cities: Location[] = [];
  totalArticles: number = 0;
  wordCloud: { text: string; value: number }[] = [];
  largestWordValue: number = 0;
  isAllCountLoading: boolean = false;
  isWordCloudLoading: boolean = false;

  constructor(
    private store: Store<AppState>,
    private overviewService: OverviewService,
    private filterService: FilterService
  ) {
    this.overviewState = this.store.select(selectOverviewState);
  }

  ngOnInit() {
    this.filter = this.filterService.subscribe((filter) => {
      this.isAllCountLoading = true;
      this.overviewService
        .getAllCount(filter)
        .subscribe((data) => {
          this.cities = data?.top_location.location ?? [];
          this.totalArticles = data?.top_location.total_top_location_article ?? 0;
        })
        .add(() => {
          this.isAllCountLoading = false;
        });

      this.isWordCloudLoading = true;
      this.overviewService
        .getWordCloud(filter)
        .subscribe((data) => {
          this.wordCloud = data.data.map((word) => ({
            text: word.name,
            value: word.weight,
          }));
          this.largestWordValue = data.data?.[0]?.weight ?? 0;
        })
        .add(() => {
          this.isWordCloudLoading = false;
        });
    });
    // const initialFilter = initialState as FilterRequestPayload;
    // this.store.dispatch(getAllCount({ filter: initialFilter }));
    // this.store.dispatch(getWordCloud({ filter: initialFilter }));

    // this.overviewState.subscribe(({ allCount, wordCloud }) => {
    //   // this.isAllCountLoading = allCount.isLoading;
    //   // this.cities = allCount.data?.top_location.location ?? [];
    //   this.isWordCloudLoading = wordCloud.isLoading;
    //   // this.totalArticles =
    //   //   allCount.data?.top_location.total_top_location_article ?? 0;
    //   this.wordCloud = wordCloud.data.map((word) => ({
    //     text: word.name,
    //     value: word.weight,
    //   }));
    //   this.largestWordValue = wordCloud.data?.[0]?.weight ?? 0;
    // });

    // this.filterState.subscribe(this.onFilterChange);
  }

  // onFilterChange = (filterState: FilterState) => {
  //   const filter = { ...filterState } as FilterRequestPayload;
  //   this.store.dispatch(getAllCount({ filter }));
  //   this.store.dispatch(getWordCloud({ filter }));
  // };

  wordCloudFontSizeMapper = (word: any) => {
    const minInput = 0;
    const maxInput = this.largestWordValue;
    const minOutput = 12;
    const maxOutput = 48;

    const clampedInput = Math.min(Math.max(word.value, minInput), maxInput);

    const scaleFactor = maxInput === Infinity ? maxOutput / (maxOutput - minOutput) : (maxOutput - minOutput) / (maxInput - minInput);

    const scaledOutput = Math.round((clampedInput - minInput) * scaleFactor + minOutput);

    return Math.min(Math.max(scaledOutput, minOutput), maxOutput);
  };
}
