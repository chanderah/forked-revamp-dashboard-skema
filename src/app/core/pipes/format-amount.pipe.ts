import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatAmount',
  standalone: true,
})
export class FormatAmountPipe implements PipeTransform {
  transform(value: number): string {
    // Check if the value is a valid number
    if (isNaN(value) || value === null) {
      return '';
    }

    // Convert the number to a string and split it into integer and decimal parts
    const [integerPart, decimalPart] = value.toString().split('.');

    // Add commas as thousand separators to the integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // If there is a decimal part, add it back to the formatted integer part
    if (decimalPart) {
      return `${formattedInteger}.${decimalPart}`;
    } else {
      return formattedInteger;
    }
  }
}
