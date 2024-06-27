import { Component } from '@angular/core';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MessageService } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DialogModule } from 'primeng/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormatAmountPipe } from '../../../../core/pipes/format-amount.pipe';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { PreferenceService } from '../../../../core/services/preference.service';
import { ToastModule } from 'primeng/toast';
import { IconAlertComponent } from '../../../../core/components/icons/alert/alert.component';
import { Column } from '../../../../core/models/file-export.model';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-file-export  ',
  standalone: true,
  imports: [
    DropdownModule,
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
  ],
  providers: [MessageService],
  templateUrl: './file-export.component.html',
  styleUrl: './file-export.component.scss',
})
export class FileExportComponent {
  columns: Column[] = [];
  totalRecords!: number;
  loading: boolean = false;
  page: number = 0;
  first: number = 0;
  rows: number = 10;

  statusOptions = [
    { label: 'Auto Check', value: true },
    { label: 'Manual Check', value: false },
  ];

  modalAddOpen: boolean = false;
  createValues = new FormGroup({
    name: new FormControl('', [Validators.required]),
    autoCheck: new FormControl(true, [Validators.required]),
  });
  isCreating: boolean = false;

  selectedColumn: Column | null = null;

  modalUpdateOpen: boolean = false;
  editedValues = new FormGroup({
    name: new FormControl('', [Validators.required]),
    autoCheck: new FormControl(true, [Validators.required]),
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
    this.preferenceService.getColumns().subscribe((resp) => {
      this.loading = false;
      this.columns = (resp.data ?? []).map((result, idx) => ({
        ...result,
        idx: idx + 1,
      }));
      this.totalRecords = resp?.data?.length ?? 0;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteColumn = (column: Column) => {
    this.selectedColumn = column;
    this.modalDeleteOpen = true;
  };

  confirmDeleteColumn = () => {
    const { id, name } = this.selectedColumn!;
    this.isDeleting = true;
    this.preferenceService
      .deleteColumn(id)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${name} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedColumn = null;
        this.modalDeleteOpen = false;
      });
  };

  createColumn = () => {
    const { name, autoCheck } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createColumn(name.value!, autoCheck.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.name.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'Column has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  updateColumn = () => {
    const { name, autoCheck } = this.editedValues.controls;
    this.preferenceService
      .updateColumn(this.selectedColumn?.id!, name.value!, autoCheck.value!)
      .subscribe(() => {
        this.fetchData();
        this.modalUpdateOpen = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Update success',
          detail: 'Column has been updated.',
        });
      });
  };

  openEditModal = async (column: Column) => {
    this.selectedColumn = column;
    this.editedValues.setValue({
      name: column?.name ?? '',
      autoCheck: column?.checked ?? true,
    });
    this.modalUpdateOpen = true;
  };
}
