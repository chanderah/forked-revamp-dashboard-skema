import { Component } from '@angular/core';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TONE_MAP } from '../../../../shared/utils/Constants';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatAmountPipe } from '../../../../core/pipes/format-amount.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PreferenceService } from '../../../../core/services/preference.service';
import { ToastModule } from 'primeng/toast';
import { IconAlertComponent } from '../../../../core/components/icons/alert/alert.component';
import { TreeSelectModule } from 'primeng/treeselect';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    IconPencilComponent,
    ButtonModule,
    TableModule,
    InputTextModule,
    TieredMenuModule,
    PaginatorModule,
    CommonModule,
    ConfirmPopupModule,
    DialogModule,
    ReactiveFormsModule,
    FormatAmountPipe,
    InputTextareaModule,
    MultiSelectModule,
    TabMenuModule,
    TabViewModule,
    ToastModule,
    IconAlertComponent,
    TreeSelectModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
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
  });

  isDeleting: boolean = false;
  modalDeleteOpen: boolean = false;

  constructor(
    private preferenceService: PreferenceService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData = () => {
    this.loading = true;
    this.preferenceService.getCategories().subscribe((resp) => {
      this.loading = false;
      this.categories = resp.results.map((result, idx) => ({
        ...result,
        idx: idx + 1,
      }));
      this.totalRecords = resp.count;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteCategory = (category: Category) => {
    this.selectedCategory = category;
    this.modalDeleteOpen = true;
  };

  confirmDeleteCategory = () => {
    const { category_set, descriptionz } = this.selectedCategory!;
    this.isDeleting = true;
    this.preferenceService
      .deleteCategory(category_set)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${descriptionz} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedCategory = null;
        this.modalDeleteOpen = false;
      });
  };

  createCategory = () => {
    const { category } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createCategory(category.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.category.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'Category has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  updateCategory = () => {
    const selectedIds = this.selectedSubCategories.reduce((subCategories, subCategory) => {
      if (subCategory.isSelectAll || subCategory.isParent) return subCategories;
      return [...subCategories, subCategory.data];
    }, []);

    const payload = this.subCategoryOptions[0].children.reduce((subCategories: any[], subCategory: any) => {
      let ids: any[] = [];
      const isChosen = selectedIds.includes(subCategory.data);
      ids.push({
        category_id: `${subCategory.data}`,
        chosen: isChosen,
      });
      return [...subCategories, ...ids];
    }, []);

    const { category } = this.editedValues.controls;
    this.preferenceService.updateCategoryName(this.selectedCategory?.category_set!, category.value!).subscribe(() => {
      this.preferenceService.updateSubCategoriesChosen(this.selectedCategory?.category_set!, payload).subscribe({
        next: () => {
          this.fetchData();
          this.modalUpdateOpen = false;
          this.selectedSubCategories = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Update success',
            detail: 'Category has been updated.',
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update category.',
          });
        },
      });
    });
  };

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getToneLabel(tone: number) {
    return TONE_MAP[tone] ?? '';
  }

  openEditModal = async (category: Category) => {
    this.selectedCategory = category;
    this.preferenceService.getSubCategoriesChosen(category.category_set).subscribe((res) => {
      const selected: any[] = [];
      const actualData =
        res?.data.map((categoryChosen) => {
          if (categoryChosen.chosen) {
            selected.push({
              key: categoryChosen.category_id,
              data: categoryChosen.category_id,
              label: categoryChosen.category_id,
              isSelectAll: false,
            });
          }

          return {
            key: categoryChosen.category_id,
            data: categoryChosen.category_id,
            label: categoryChosen.category_id,
            isSelectAll: false,
          };
        }) ?? [];

      this.selectedSubCategories = selected;

      this.subCategoryOptions = [
        {
          label: 'Select all',
          data: 'all',
          children: actualData,
          isSelectAll: true,
        },
      ];

      this.editedValues.setValue({
        category: category.descriptionz ?? '',
      });
      this.modalUpdateOpen = true;
    });
  };
}
