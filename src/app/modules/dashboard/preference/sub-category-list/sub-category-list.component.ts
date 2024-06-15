import { Component } from '@angular/core';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TONE_MAP } from '../../../../shared/utils/Constants';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PreferenceService } from '../../../../core/services/preference.service';
import { ToastModule } from 'primeng/toast';
import { IconAlertComponent } from '../../../../core/components/icons/alert/alert.component';
import { Category } from '../../../../core/models/category.model';
import { CalendarModule } from 'primeng/calendar';
import moment from 'moment';

@Component({
  selector: 'app-sub-category-list',
  standalone: true,
  imports: [
    IconPencilComponent,
    ButtonModule,
    TableModule,
    InputTextModule,
    TieredMenuModule,
    PaginatorModule,
    CommonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextareaModule,
    MultiSelectModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    CalendarModule,
    IconAlertComponent,
  ],
  providers: [MessageService],
  templateUrl: './sub-category-list.component.html',
  styleUrl: './sub-category-list.component.scss',
})
export class SubCategoryListComponent {
  categories: Category[] = [];
  totalRecords!: number;
  loading: boolean = false;
  page: number = 0;
  first: number = 0;
  rows: number = 10;

  modalAddOpen: boolean = false;
  createValues = new FormGroup({
    category: new FormControl('', [Validators.required]),
  });
  isCreating: boolean = false;

  selectedCategory: Category | null = null;

  modalUpdateOpen: boolean = false;
  selectedSubCategories: any[] = [];
  subCategoryOptions: any[] = [];
  editedValues = new FormGroup({
    category: new FormControl('', [Validators.required]),
    keyword: new FormControl(''),
    startDate: new FormControl(''),
    expired: new FormControl(''),
  });
  existingKeywords: string[] = [];

  isDeleting: boolean = false;
  modalDeleteOpen: boolean = false;

  modalRestreamOpen: boolean = false;
  restreamValues = new FormGroup({
    category: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
  });

  constructor(
    private preferenceService: PreferenceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData = (categoryId?: any) => {
    this.loading = true;
    this.preferenceService.getSubCategoriesCollections().subscribe((resp) => {
      this.loading = false;
      this.categories = resp.results.map((val, idx) => ({
        ...val,
        no: idx + 1,
      }));
      if (categoryId) {
        const categSel =
          resp.results.find((categ) => {
            return categ.category_id === categoryId;
          }) ?? null;
        this.selectedCategory = categSel;
      }
      this.totalRecords = resp.count;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteSubCategory = (category: Category) => {
    this.selectedCategory = category;
    this.modalDeleteOpen = true;
  };

  confirmDeleteSubCategory = () => {
    const { category_id } = this.selectedCategory!;
    this.isDeleting = true;
    this.preferenceService
      .deleteSubCategory(category_id)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${category_id} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedCategory = null;
        this.modalDeleteOpen = false;
      });
  };

  createSubCategory = () => {
    const { category } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createSubCategory(category.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.category.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'SubCategory has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  deleteKeyword = (keyword: string) => {
    this.preferenceService
      .deleteCategoryKeyword(this.selectedCategory?.category_id!, keyword)
      .subscribe(() => {
        this.preferenceService
          .getCategoryKeywords(this.selectedCategory?.category_id!)
          .subscribe((response) => {
            this.existingKeywords = response?.data ?? [];
          });
      });
  };

  updateCategory = async () => {
    const { category, expired, startDate, keyword } =
      this.editedValues.controls;

    const promises = [
      this.preferenceService
        .updateSubCategory(this.selectedCategory?.category_id!, category.value!)
        .toPromise(),
    ];

    if (keyword.value && startDate.value && expired.value) {
      const payload: any = {
        category_id: category.value!,
        keyword: keyword.value,
        start_date: moment(startDate.value).format('YYYY-MM-DD'),
        end_date: moment(expired.value).format('YYYY-MM-DD'),
      };

      promises.push(
        this.preferenceService.createCategoryKeyword(payload).toPromise()
      );
    }

    await Promise.allSettled(promises);
    this.fetchKeyword(category.value!);
    this.fetchData(category.value!);
    this.selectedSubCategories = [];
    this.messageService.add({
      severity: 'success',
      summary: 'Update success',
      detail: 'SubCategory has been updated.',
    });

    if (!expired.value || !startDate.value || !expired.value) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Keyword or Dates is required',
      });
    }
  };

  checkRestream = () => {
    this.preferenceService.checkRestream().subscribe(({ message, status }) => {
      this.messageService.add({
        severity: status ? 'success' : 'error',
        detail: message,
      });
    });
  };

  submitRestream = () => {
    const { category, endDate, startDate } = this.restreamValues.controls;

    const start = moment(startDate.value).format('YYYY-MM-DD');
    const end = moment(endDate.value).format('YYYY-MM-DD');

    this.preferenceService
      .restream([category.value!], start, end)
      .subscribe(() => {
        this.modalRestreamOpen = false;
        this.messageService.add({
          severity: 'success',
          detail: 'Restream success.',
        });
      });
  };

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getToneLabel(tone: number) {
    return TONE_MAP[tone] ?? '';
  }

  fetchKeyword = (category: any) => {
    this.preferenceService
      .getCategoryKeywords(category)
      .subscribe((response) => {
        this.editedValues.setValue({
          category: category ?? '',
          keyword: '',
          startDate: '',
          expired: '',
        });
        this.existingKeywords = response?.data ?? [];
        this.modalUpdateOpen = true;
      });
  };

  openEditModal = async (category: Category) => {
    this.selectedCategory = category;
    this.fetchKeyword(category.category_id);
  };
}
