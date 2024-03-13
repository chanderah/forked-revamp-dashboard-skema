import { Component } from '@angular/core';
import { IconNewspaperComponent } from '../../../../core/components/icons/newspaper/newspaper.component';
import { IconInfoComponent } from '../../../../core/components/icons/info/info.component';

@Component({
  selector: 'app-top-issue',
  standalone: true,
  imports: [IconNewspaperComponent, IconInfoComponent],
  templateUrl: './top-issue.component.html',
  styleUrl: './top-issue.component.scss'
})
export class TopIssueComponent {

}
