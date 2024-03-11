import { Component } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/store';
import { FormsModule } from '@angular/forms';
import {
  FilterState,
  initialState,
} from '../../../../core/store/filter/filter.reducer';
import { Observable } from 'rxjs';
import { selectFilterState } from '../../../../core/store/filter/filter.selectors';
import { setFilter } from '../../../../core/store/filter/filter.actions';
import moment from 'moment';

interface Option {
  name: string;
  value: string;
}

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [DropdownModule, ButtonModule, FloatLabelModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  selectedPeriodic: string = initialState.date_type;
  selectedCategory: string = initialState.category_id;
  selectedSubCategory: number = initialState.category_set;
  selectedMedia: string = initialState.media_id;
  filterState: Observable<FilterState>;

  periodicOptions: Option[] = [
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'Last Week', value: 'week' },
    { name: 'Last Month', value: 'month' },
    { name: 'Last Year', value: 'year' },
  ];

  constructor(private store: Store<AppState>) {
    this.filterState = this.store.select(selectFilterState);
  }

  ngOnInit() {
    console.log('this.selectedPeriodic', this.selectedPeriodic);
    console.log('this.selectedCategory', this.selectedCategory);
    console.log('this.selectedSubCategory', this.selectedSubCategory);
    console.log('this.selectedMedia', this.selectedMedia);
  }

  onSetFilter() {
    const today = moment().format('YYYY-MM-DD');
    const dateRange: any = {
      yesterday: [moment().subtract(1, 'days').format('YYYY-MM-DD'), today],
      week: [moment().subtract(1, 'weeks').format('YYYY-MM-DD'), today],
      month: [moment().subtract(1, 'months').format('YYYY-MM-DD'), today],
      year: [moment().subtract(1, 'years').format('YYYY-MM-DD'), today],
    } 

    const filter: FilterState = {
      category_id: this.selectedCategory,
      category_set: this.selectedSubCategory,
      date_type: this.selectedPeriodic,
      media_id: this.selectedMedia,
      start_date: dateRange[this.selectedPeriodic][0],
      end_date: dateRange[this.selectedPeriodic][1]
    };
    this.store.dispatch(setFilter({ filter }));
  }
}
