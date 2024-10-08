import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'replaceEmptyValue',
})
export class ReplaceEmptyValuePipe implements PipeTransform {
  transform(value: string | number | any, defaultValue: string = ''): string {
    if (typeof value === 'number') return value.toString();
    if (!value || !value.toString().trim()) {
      return defaultValue;
    }
    return value;
  }
}
