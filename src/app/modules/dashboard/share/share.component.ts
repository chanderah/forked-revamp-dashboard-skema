import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ShareService } from '../../../core/services/share.service';
import { WartawanMedia } from '../../../core/models/media.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FileUploadComponent } from '../../../core/components/file-upload/file-upload.component';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [
    InputTextModule,
    DividerModule,
    InputTextareaModule,
    MultiSelectModule,
    ButtonModule,
    SelectButtonModule,
    ReactiveFormsModule,
    FileUploadComponent,
  ],
  providers: [MessageService],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss',
})
export class ShareComponent {
  isLoadingMedias: boolean = false;
  mediaOptions: WartawanMedia[] = [];
  editorDeskOptions: { name: string; value: string }[] = [
    { name: 'National', value: 'National' },
    { name: 'Business', value: 'Business' },
    { name: 'Legal', value: 'Legal' },
  ];

  formGroup = new FormGroup({
    headline: new FormControl('', [Validators.required]),
    cc: new FormControl(''),
    subline: new FormControl('', [Validators.required]),
    editorDesk: new FormControl('', [Validators.required]),
    media: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    image: new FormControl(''),
  });

  constructor(
    private shareService: ShareService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchMedia();
  }

  fetchMedia = () => {
    this.isLoadingMedias = true;
    this.shareService.getMedias().subscribe((resp) => {
      this.isLoadingMedias = false;
      this.mediaOptions = resp?.results ?? [];
    });
  };

  sendEmail = () => {
    const { cc, content, editorDesk, headline, media, subline, image } =
      this.formGroup.controls;

    console.log('cc.value', cc.value);
    console.log('content.value', content.value);
    console.log('editorDesk.value', editorDesk.value);
    console.log('headline.value', headline.value);
    console.log('media.value', media.value);
    console.log('subline.value', subline.value);
    console.log('image.value', image.value);
  };
}
