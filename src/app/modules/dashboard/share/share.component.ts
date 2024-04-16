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
import { ToastModule } from 'primeng/toast';

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
    ToastModule,
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
    subline: new FormControl('', [Validators.required]),
    editorDesk: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    cc: new FormControl(''),
    media: new FormControl([]),
    image: new FormControl<File | null>(null),
  });
  isSending: boolean = false;

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

  sendEmail = async () => {
    const { cc, content, editorDesk, headline, media, subline, image } =
      this.formGroup.controls;

    let images: any;
    if (image.value) {
      const base64 = await this.file2Base64(image.value!);
      const filename = image.value?.name ?? 'file.jpg';
      images = [{ base64, filename }];
    }

    this.isSending = true;
    this.shareService
      .sendEmail({
        content: content.value!,
        editorial_desk: editorDesk.value!,
        headline: headline.value!,
        subline: subline.value!,
        images: images ?? undefined,
        media_names: media.value ?? undefined,
        client_email: cc.value ?? undefined,
      })
      .subscribe(({ message }) => {
        this.messageService.add({
          severity: 'success',
          detail: message ?? 'Success',
        });
      })
      .add(() => {
        this.isSending = false;
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
}
