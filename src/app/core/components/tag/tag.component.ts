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
  @Input() type!: 'positive' | 'negative' | 'neutral';

  bgColor: string = 'white';
  color: string = 'black';

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const positiveColor = documentStyle.getPropertyValue('--positive-color');
    const negativeColor = documentStyle.getPropertyValue('--negative-color');
    const neutralColor = documentStyle.getPropertyValue('--neutral-color');

    const colorMap: { [x: string]: string } = {
      positive: positiveColor,
      neutral: neutralColor,
      negative: negativeColor,
    };

    const bgColorMap: { [x: string]: string } = {
      positive: '#e8f2fc',
      neutral: '#e6f8f9',
      negative: '#ffebee',
    };

    this.bgColor = bgColorMap[this.type];
    this.color = colorMap[this.type];
  }
}
