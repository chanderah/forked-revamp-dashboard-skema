import { Component } from '@angular/core';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { AppState } from '../../../../core/store';
import { Store } from '@ngrx/store';
import { FilterRequestPayload } from '../../../../core/models/request.model';
import { ScrollerModule } from 'primeng/scroller';
import { CommonModule } from '@angular/common';
import { ImgFallbackDirective } from '../../../../core/directive/img-fallback.directive';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { IconMicComponent } from '../../../../core/components/icons/mic/mic.component';
import { MediaSOVService } from '../../../../core/services/media-sov.service';
import { FilterService } from '../../../../core/services/filter.service';
import { MediaSOV } from '../../../../core/models/media.model';
import { setMedia } from '../../../../core/store/media-sov/media-sov.actions';

@Component({
  selector: 'app-media-name',
  standalone: true,
  imports: [
    IconMicComponent,
    IconInfoComponent,
    ScrollerModule,
    CommonModule,
    ImgFallbackDirective,
    SpinnerComponent,
    CommonModule
  ],
  templateUrl: './media-name.component.html',
  styleUrl: './media-name.component.scss',
})
export class MediaNameComponent {
  medias: MediaSOV[] = [];
  isLoading: boolean = false;
  selectedMedia: MediaSOV | null = null;

  constructor(
    private mediaSOVService: MediaSOVService,
    private filterService: FilterService,
    private store: Store<AppState>
  ) {}

  fetchData = (filter: FilterRequestPayload) => {
    this.isLoading = true;
    this.mediaSOVService
      .getMedias(filter)
      .subscribe(({ data }) => {
        this.medias = data;
      })
      .add(() => {
        this.isLoading = false;
      });
  };

  ngOnInit() {
    this.filterService.subscribe((filter) => {
      this.fetchData(filter as FilterRequestPayload);
    });
  }

  onClick(media: MediaSOV) {
    this.selectedMedia = media;
    this.store.dispatch(setMedia({ media }));
  }
}
