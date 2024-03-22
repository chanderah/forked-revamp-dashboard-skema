import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[imgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  /**
   *
   * *img path for invalid src
   */
  @Input()
  imgFallback?: string;

  /**
   *
   * @param event
   */
  @HostListener('error', ['$event'])
  handleImageError(event: Event): void {
    const image = event.target as HTMLInputElement;
    image.src =
      this.imgFallback ?? 'https://placehold.co/600x400?text=Hello+World';
  }
}
