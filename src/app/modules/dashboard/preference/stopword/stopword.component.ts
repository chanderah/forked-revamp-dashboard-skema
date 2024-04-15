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

interface StopwordData {
  stopword: string;
  no: number;
}
@Component({
  selector: 'app-stopword',
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
  ],
  providers: [MessageService],
  templateUrl: './stopword.component.html',
  styleUrl: './stopword.component.scss',
})
export class StopwordComponent {
  stopwords: StopwordData[] = [];
  totalRecords!: number;
  loading: boolean = false;
  page: number = 0;
  first: number = 0;
  rows: number = 10;

  modalAddOpen: boolean = false;
  createValues = new FormGroup({
    stopword: new FormControl('', [Validators.required]),
  });
  isCreating: boolean = false;

  selectedStopword: StopwordData | null = null;

  modalUpdateOpen: boolean = false;
  editedValues = new FormGroup({
    stopword: new FormControl('', [Validators.required]),
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
    this.preferenceService.getStopwords(this.page, 100).subscribe((resp) => {
      this.loading = false;
      this.stopwords = resp.data.map((val, idx) => ({
        stopword: val,
        no: idx + 1,
      }));
      this.totalRecords = resp?.data?.length ?? [];
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteStopword = (stopword: StopwordData) => {
    this.selectedStopword = stopword;
    this.modalDeleteOpen = true;
  };

  confirmDeleteCategory = () => {
    const { stopword } = this.selectedStopword!;
    this.isDeleting = true;
    this.preferenceService
      .deleteStopword(stopword)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${stopword} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedStopword = null;
        this.modalDeleteOpen = false;
      });
  };

  createStopword = () => {
    const { stopword } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createStopword(stopword.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.stopword.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'Stopword has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  updateCategory = () => {
    const { stopword } = this.editedValues.controls;
    this.preferenceService
      .updateStopword(this.selectedStopword?.stopword!, stopword.value!)
      .subscribe(() => {
        this.fetchData();
        this.modalUpdateOpen = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Update success',
          detail: 'Stopword has been updated.',
        });
      });
  };

  openEditModal = async (stopword: StopwordData) => {
    this.selectedStopword = stopword;
    this.editedValues.setValue({
      stopword: stopword?.stopword ?? '',
    });
    this.modalUpdateOpen = true;
  };
}
