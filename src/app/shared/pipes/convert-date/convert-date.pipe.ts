import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDate',
})
export class ConvertDatePipe implements PipeTransform {
  transform(value: string): Date {
    if (!value) return null;
    const parts = value.split('/');
    const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return date;
  }
}
