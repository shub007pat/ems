import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobileFormat'
})
export class MobileFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Remove any non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as (+91) 12345 12345
    if (cleaned.length === 10) {
      return `(+91) ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    
    // If already has country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `(+91) ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    
    // Return original if format doesn't match
    return value;
  }
}
