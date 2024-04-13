import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconPencilComponent } from '../../../../core/components/icons/pencil/pencil.component';
import { RouterModule } from '@angular/router';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { Article } from '../../../../core/models/article.model';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagComponent } from '../../../../core/components/tag/tag.component';
import { TONE_MAP } from '../../../../shared/utils/Constants';
import { ButtonSecondaryComponent } from '../../../../core/components/button-secondary/button-secondary.component';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { Media, MediaListUpdate } from '../../../../core/models/media.model';
import { ToastModule } from 'primeng/toast';
import { IconAlertComponent } from '../../../../core/components/icons/alert/alert.component';
import { TreeSelectModule } from 'primeng/treeselect';

@Component({
  selector: 'app-media-list',
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
  templateUrl: './media-list.component.html',
  styleUrl: './media-list.component.scss',
})
export class MediaListComponent {
  medias!: Media[];
  totalRecords!: number;
  loading: boolean = false;
  page: number = 0;
  first: number = 0;
  rows: number = 10;

  modalAddOpen: boolean = false;
  createValues = new FormGroup({
    media: new FormControl('', [Validators.required]),
  });
  isCreating: boolean = false;

  selectedMedia: Media | null = null;

  modalUpdateOpen: boolean = false;
  selectedMediaGroups: any[] = [];
  mediaGroupsOptions: any[] = [];
  editedValues = new FormGroup({
    media: new FormControl('', [Validators.required]),
  });

  isDeleting: boolean = false;
  modalDeleteOpen: boolean = false;

  constructor(
    private preferenceService: PreferenceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData = () => {
    this.loading = true;
    this.preferenceService.getMedias().subscribe((resp) => {
      this.loading = false;
      this.medias = resp.results;
      this.totalRecords = resp.count;
    });
  };

  onPageChange = (event: any) => {
    this.page = event.page;
    this.rows = event.rows;
    this.first = event.first;
  };

  deleteMedia = (media: Media) => {
    this.selectedMedia = media;
    this.modalDeleteOpen = true;
  };

  confirmDeleteMedia = () => {
    const { user_media_type_id, user_media_type_name_def } =
      this.selectedMedia!;
    this.isDeleting = true;
    this.preferenceService
      .deleteMedia(user_media_type_id)
      .subscribe(() => {
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Delete success',
          detail: `${user_media_type_name_def} has been deleted.`,
        });
      })
      .add(() => {
        this.isDeleting = false;
        this.selectedMedia = null;
        this.modalDeleteOpen = false;
      });
  };

  createMedia = () => {
    const { media } = this.createValues.controls;
    this.isCreating = true;
    this.preferenceService
      .createMedia(media.value!)
      .subscribe(() => {
        this.modalAddOpen = false;
        this.createValues.controls.media.setValue('');
        this.fetchData();
        this.messageService.add({
          severity: 'success',
          summary: 'Create success',
          detail: 'Media has been created.',
        });
      })
      .add(() => {
        this.isCreating = false;
      });
  };

  updateMedia = () => {
    console.log('this.selectedMediaGroups', this.selectedMediaGroups);
    const selectedIds = this.selectedMediaGroups.reduce(
      (mediaGroups, mediaGroup) => {
        if (mediaGroup.isSelectAll || mediaGroup.isParent) return mediaGroups;

        return [...mediaGroups, mediaGroup.media_id];
      },
      []
    );

    const payload = this.mediaGroupsOptions[0].children.reduce(
      (mediaGroups: any[], mediaGroup: any) => {
        let ids: any[] = [];
        mediaGroup.children.forEach((media: any) => {
          const isChosen = selectedIds.includes(media.media_id);
          ids.push({ media_id: `${media.media_id}`, chosen: isChosen });
        });
        return [...mediaGroups, ...ids];
      },
      []
    );

    // const { media } = this.editedValues.controls;
    // this.preferenceService
    //   .updateMedia(this.selectedMedia?.user_media_type_id!, media.value!)
    //   .subscribe(() => {
    //     this.preferenceService
    //       .updateSelectedMediaGroups(
    //         this.selectedMedia?.user_media_type_id!,
    //         payload
    //       )
    //       .subscribe(() => {
    //         this.fetchData();
    //         this.modalUpdateOpen = false;
    //         this.selectedMediaGroups = [];
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Update success',
    //           detail: 'Media has been updated.',
    //         });
    //       });
    //   });
  };

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  getToneLabel(tone: number) {
    return TONE_MAP[tone] ?? '';
  }

  openEditModal = async (media: Media) => {
    this.selectedMedia = media;
    const response = await this.preferenceService
      .getMediaGroups(media.user_media_type_id)
      .toPromise();

    const selectedGroup: any[] = [];
    const actualData =
      response?.data.map((mediaGroup) => {
        let hasChosen = false;
        const children = mediaGroup.media_list.map((mediaList) => {
          hasChosen = mediaList.chosen;
          if (hasChosen) {
            selectedGroup.push({
              ...mediaList,
              key: mediaList.media_id,
              data: mediaList.media_id,
              label: mediaList.media_name,
              isParent: false,
              isSelectAll: false,
            });
          }

          return {
            ...mediaList,
            key: mediaList.media_id,
            data: mediaList.media_id,
            label: mediaList.media_name,
            isParent: false,
            isSelectAll: false,
          };
        });
        return {
          children,
          data: mediaGroup.media_type,
          label: mediaGroup.media_type,
          isParent: true,
          isSelectAll: false,
          partialSelected: hasChosen,
        };
      }) ?? [];

    console.log('data', selectedGroup);
    this.selectedMediaGroups = selectedGroup

    this.mediaGroupsOptions = [
      {
        label: 'Select all',
        data: 'all',
        children: actualData,
        isSelectAll: true,
      },
    ];

    this.editedValues.setValue({
      media: media.user_media_type_name_def ?? '',
    });
    this.modalUpdateOpen = true;
  };
}
