import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImgFallbackDirective } from '../../directive/img-fallback.directive';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'file-upload',
  standalone: true,
  imports: [ReactiveFormsModule, ImgFallbackDirective, CommonModule, ButtonModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
})
export class FileUploadComponent {
  @Input() form!: FormGroup;

  uploadedImageURL: SafeUrl | null = null;
  file: File | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    this.onFileSelected(files);
  }

  onFileSelected(files: FileList): void {
    const objectURL = URL.createObjectURL(files?.[0]!);
    this.file = files?.[0];
    this.uploadedImageURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.form.patchValue({ image: files?.[0] });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    const objectURL = URL.createObjectURL(file!);
    this.file = file ?? null;
    this.uploadedImageURL = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    this.form.patchValue({ image: file });
  }

  removeImage() {
    this.file = null;
    this.uploadedImageURL = null;
    this.form.patchValue({ image: null });
  }
}
