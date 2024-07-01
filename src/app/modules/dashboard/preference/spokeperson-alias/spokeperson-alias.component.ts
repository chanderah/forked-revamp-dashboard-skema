import { Component } from '@angular/core';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
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
import { CalendarModule } from 'primeng/calendar';
import { SpokepersonAlias } from '../../../../core/models/influencer.model';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';

@Component({
  selector: 'app-spokeperson-alias',
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
    AvatarModule,
    FileUploadModule,
    ImgFallbackDirective,
  ],
  providers: [MessageService],
  templateUrl: './spokeperson-alias.component.html',
  styleUrl: './spokeperson-alias.component.scss',
})
export class SpokepersonAliasComponent{ filter: any; ngOnDestroy(){this.filter?.unsubscribe?.()}
  categories: SpokepersonAlias[] = [];
  totalRecords!: number;
  loading: boolean = false;
  page: number = 0;
  first: number = 0;
  rows: number = 10;

  modalAddOpen: boolean = false;
  createValues = new FormGroup({
    spokeperson: new FormControl('', [Validators.required]),
  });
  isCreating: boolean = false;

  selectedSpokeperson: SpokepersonAlias | null = null;

  uploadedImageURL: SafeUrl | null = null;
  uploadedImage: any = null;

  modalUpdateOpen: boolean = false;
  editedValues = new FormGroup({
    spokeperson: new FormControl('', [Validators.required]),
    alias: new FormControl(''),
  });

  isDeleting: boolean = false;
  modalDeleteOpen: boolean = false;

  constructor(
    private preferenceService: PreferenceService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData = () => {
    this.loading = true;
    this.preferenceService.getSpokepersonAlias(this.page, 100).subscribe((resp) => {
      this.loading = false;
      this.categories = resp.data.map((val, idx) => ({
        ...val,
        no: idx + 1,
      }));
      this.totalRecords = resp.recordsTotal;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteSpokeperson = (spokeperson: SpokepersonAlias) => {
    this.selectedSpokeperson = spokeperson;
    this.modalDeleteOpen = true;
  };

  confirmDeleteSpokeperson = () => {
    const { influencer } = this.selectedSpokeperson!;
    this.isDeleting = true;
    this.preferenceService
      .deleteSpokeperson(influencer)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${influencer} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedSpokeperson = null;
        this.modalDeleteOpen = false;
      });
  };

  createSpokeperson = () => {
    const { spokeperson } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createSpokeperson(spokeperson.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.spokeperson.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'Spokeperson has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  file2Base64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString() || '');
      reader.onerror = (error) => reject(error);
    });
  };

  updateSpokeperson = async () => {
    const { spokeperson } = this.editedValues.controls;
    const promises = [
      this.preferenceService
        .updateSpokeperson(
          this.selectedSpokeperson?.influencer!,
          spokeperson.value!
        )
        .toPromise(),
    ];

    if (this.uploadedImage) {
      const base64 = await this.file2Base64(this.uploadedImage);
      promises.push(
        this.preferenceService
          .updateSpokepersonImage(this.selectedSpokeperson?.influencer!, {
            base64,
            filename: this.uploadedImage.name,
          })
          .toPromise()
      );
    }
    await Promise.allSettled(promises);
    this.fetchData();
    this.modalUpdateOpen = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Update success',
      detail: 'Spokeperson has been updated.',
    });
  };

  onUpload = (image: any) => {
    const objectURL = URL.createObjectURL(image.currentFiles[0]);
    this.uploadedImage = image.currentFiles[0];
    this.uploadedImageURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  };

  openEditModal = async (spokeperson: SpokepersonAlias) => {
    this.selectedSpokeperson = spokeperson;
    this.editedValues.setValue({
      spokeperson: spokeperson.influencer,
      alias: spokeperson.aliases?.[0] ?? '',
    });
    this.modalUpdateOpen = true;
  };
}
