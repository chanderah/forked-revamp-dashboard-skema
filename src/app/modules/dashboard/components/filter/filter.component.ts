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
import { FilterService } from '../../../../core/services/filter.service';

interface Option {
  name: string;
  value: string | number;
}

const DEFAULT_CATEGORY: Option = { name: 'All Category', value: initialState.category_set};
const DEFAULT_SUB_CATEGORY: Option = { name: 'All Sub Category', value: initialState.category_id };
const DEFAULT_MEDIA: Option = { name: 'All Media', value: initialState.user_media_type_id };

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [DropdownModule, ButtonModule, FloatLabelModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  filterState: Observable<FilterState>;

  selectedPeriodic: string = initialState.date_type;
  selectedCategory: number = initialState.category_set;
  selectedSubCategory: string = initialState.category_id;
  selectedMedia: number = initialState.user_media_type_id;

  periodicOptions: Option[] = [
    { name: 'Yesterday', value: 'yesterday' },
    { name: 'Last Week', value: 'week' },
    { name: 'Last Month', value: 'month' },
    { name: 'Last Year', value: 'year' },
  ];
  categoryOptions: Option[] = [DEFAULT_CATEGORY];
  subCategoryOptions: Option[] = [DEFAULT_SUB_CATEGORY];
  mediaOptions: Option[] = [DEFAULT_MEDIA];

  constructor(
    private store: Store<AppState>,
    private filterService: FilterService
  ) {
    this.filterState = this.store.select(selectFilterState);
    this.getCategoriesOptions();
    this.getSubCategoriesOptions();
    this.getMediaOptions();
  }

  getCategoriesOptions = () => {
    this.filterService.getCategories().subscribe((response) => {
      const categoryOptions = response.results.map((category) => ({
        name: category.descriptionz,
        value: category.category_set,
      }));
      this.categoryOptions = [...this.categoryOptions, ...categoryOptions];
    });
  };

  getSubCategoriesOptions = () => {
    this.filterService.getSubCategories().subscribe((response) => {
      const subCategoryOptions = response.results.map((category) => ({
        name: category.descriptionz,
        value: category.category_set,
      }));
      this.subCategoryOptions = [...this.subCategoryOptions, ...subCategoryOptions];
    });
  };

  getMediaOptions = () => {
    this.filterService.getMedias().subscribe((response) => {
      const mediaOptions = response.results.map((category) => ({
        name: category.user_media_type_name_def,
        value: category.user_media_type_id,
      }));
      this.mediaOptions = [...this.mediaOptions, ...mediaOptions];
    });
  };

  onSetFilter() {
    const today = moment().format('YYYY-MM-DD');
    const dateRange: any = {
      yesterday: [moment().subtract(1, 'days').format('YYYY-MM-DD'), today],
      week: [moment().subtract(1, 'weeks').format('YYYY-MM-DD'), today],
      month: [moment().subtract(1, 'months').format('YYYY-MM-DD'), today],
      year: [moment().subtract(1, 'years').format('YYYY-MM-DD'), today],
    };

    const filter: FilterState = {
      category_set: this.selectedCategory,
      category_id: this.selectedSubCategory,
      date_type: this.selectedPeriodic,
      user_media_type_id: this.selectedMedia,
      start_date: dateRange[this.selectedPeriodic][0],
      end_date: dateRange[this.selectedPeriodic][1],
    };
    this.store.dispatch(setFilter({ filter }));
  }
}
