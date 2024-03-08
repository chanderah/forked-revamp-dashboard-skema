import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { ScrollerModule } from 'primeng/scroller';

@Component({
  selector: 'app-top-article',
  standalone: true,
  imports: [DataViewModule, CommonModule, ScrollerModule],
  templateUrl: './top-article.component.html',
  styleUrl: './top-article.component.scss',
})
export class TopArticleComponent {
  products: any[] = [
    {
      name: 'test 1',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
    {
      name: 'test 2',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
    {
      name: 'test 3',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
    {
      name: 'test 4',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
    {
      name: 'test 5',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
    {
      name: 'test 6',
      category: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ....',
    },
  ];
}
