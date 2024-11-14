import { Component, Input } from '@angular/core';

@Component({
  selector: 'tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
  filter: any;
  ngOnDestroy() {
    this.filter?.unsubscribe?.();
  }
  @Input() content!: string;
  @Input() type!: 'positive' | 'negative' | 'neutral' | string | number;

  bgColor: string = 'white';
  color: string = 'black';

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const colorMap: { [x: string]: string } = {
      'positive': positiveColor,
      1: positiveColor,
      'neutral': 'gray',
      0: 'gray',
      'negative': negativeColor,
      '-1': negativeColor,
    };

    const bgColorMap: { [x: string]: string } = {
      'positive': '#e8f2fc',
      1: '#e8f2fc',
      'neutral': '#80808021',
      0: '#80808021',
      'negative': '#ffebee',
      '-1': '#ffebee',
    };

    this.bgColor = bgColorMap[this.type] ?? '#80808021';
    this.color = colorMap[this.type] ?? 'gray';
  }
}
