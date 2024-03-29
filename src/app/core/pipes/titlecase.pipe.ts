import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCase',
  standalone: true,
})
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (!value || typeof value !== 'string') {
      return value;
    }

    // Split the string into words
    const words = value.split(' ');

    // Transform each word
    const transformedWords = words.map((word) => {
      // If the word has only 2 characters, capitalize it
      if (word.length === 2) {
        return word.toUpperCase();
      }
      // Otherwise, apply normal title case transformation
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    // Join the transformed words back into a string
    return transformedWords.join(' ');
  }
}
