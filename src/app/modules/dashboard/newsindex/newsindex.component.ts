import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { IconNewspaperComponent } from '../../../core/components/icons/newspaper/newspaper.component';
import { IconPencilComponent } from '../../../core/components/icons/pencil/pencil.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-newsindex',
  standalone: true,
  imports: [DividerModule, IconNewspaperComponent, IconPencilComponent, RouterModule],
  templateUrl: './newsindex.component.html',
  styleUrl: './newsindex.component.scss',
})
export class NewsindexComponent {
  // constructor(private router: Router) {
  //   console.log(this.router.url.split[]); //  /routename
  // }
}
