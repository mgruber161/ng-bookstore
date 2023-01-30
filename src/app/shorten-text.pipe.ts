import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(text: string, limit: number): string {
    if (!text) { return text; }
    if (!limit) { limit = 20; }
    if (text.length <= limit) { return text; }
    return text.substring(0, limit - 3) + '...';
  }
}
