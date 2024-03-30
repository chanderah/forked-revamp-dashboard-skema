import { Component, Input } from '@angular/core';

@Component({
  selector: 'tag',
  standalone: true,
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
})
export class TagComponent {
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
      positive: positiveColor,
      1: positiveColor,
      neutral: neutralColor,
      0: neutralColor,
      negative: negativeColor,
      '-1': negativeColor,
    };

    const bgColorMap: { [x: string]: string } = {
      positive: '#e8f2fc',
      1: '#e8f2fc',
      neutral: '#e6f8f9',
      0: '#e6f8f9',
      negative: '#ffebee',
      '-1': '#ffebee',
    };

    this.bgColor = bgColorMap[this.type] ?? '#e6f8f9';
    this.color = colorMap[this.type] ?? neutralColor;
  }
}
