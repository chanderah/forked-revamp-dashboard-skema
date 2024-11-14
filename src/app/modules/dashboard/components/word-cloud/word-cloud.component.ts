import { Component, Input } from '@angular/core';
import { AngularD3CloudModule } from 'angular-d3-cloud';
import { SpinnerComponent } from '../../../../core/components/spinner/spinner.component';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'word-cloud',
  standalone: true,
  imports: [NgIf, NgStyle, SpinnerComponent, AngularD3CloudModule],
  templateUrl: './word-cloud.component.html',
  styleUrl: './word-cloud.component.scss',
})
export class WordCloudComponent {
  @Input() isLoading: boolean = true;
  @Input() data: { name: string; weight: string; [x: string]: any }[] = [];
  @Input() largestValue: number = 0;
  @Input() width: number = 520;
  @Input() height: number = 200;

  wordCloudFontSizeMapper = (word: any) => {
    const minInput = 0;
    const maxInput = this.largestValue;
    const minOutput = 12;
    const maxOutput = 48;

    const clampedInput = Math.min(Math.max(word.value, minInput), maxInput);

    const scaleFactor = maxInput === Infinity ? maxOutput / (maxOutput - minOutput) : (maxOutput - minOutput) / (maxInput - minInput);

    const scaledOutput = Math.round((clampedInput - minInput) * scaleFactor + minOutput);

    return Math.min(Math.max(scaledOutput, minOutput), maxOutput);
  };
}
