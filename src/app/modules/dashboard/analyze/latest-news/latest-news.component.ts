import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-latest-news',
  standalone: true,
  imports: [
    CarouselModule,
    IconNewspaperComponent,
    IconInfoComponent,
    AvatarModule,
    CommonModule,
  ],
  templateUrl: './latest-news.component.html',
  styleUrl: './latest-news.component.scss',
})
export class LatestNewsComponent {
  products: any[] = [
    {
      id: 1,
      name: 'Development in Indonesia is very rapid',
      price:
        'Augue interdum velit euismod in pellentesque. Dolor sed viverra ipsum nunc. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Vulputate eu scelerisque felis imperdiet proin fermentum. Leo vel orci porta non pulvinar neque laoreet suspendisse.',
    },
    {
      id: 2,
      name: 'Development in Indonesia is very rapid',
      price:
        'Augue interdum velit euismod in pellentesque. Dolor sed viverra ipsum nunc. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Vulputate eu scelerisque felis imperdiet proin fermentum. Leo vel orci porta non pulvinar neque laoreet suspendisse.',
    },
    {
      id: 3,
      name: 'Development in Indonesia is very rapid',
      price:
        'Augue interdum velit euismod in pellentesque. Dolor sed viverra ipsum nunc. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Vulputate eu scelerisque felis imperdiet proin fermentum. Leo vel orci porta non pulvinar neque laoreet suspendisse.',
    },
    {
      id: 4,
      name: 'Development in Indonesia is very rapid',
      price:
        'Augue interdum velit euismod in pellentesque. Dolor sed viverra ipsum nunc. Eros donec ac odio tempor orci dapibus ultrices in iaculis. Vulputate eu scelerisque felis imperdiet proin fermentum. Leo vel orci porta non pulvinar neque laoreet suspendisse.',
    },
  ];

  responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
