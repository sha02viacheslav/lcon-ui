import { Pipe, PipeTransform } from '@angular/core';
import { SearchKey } from '@enums';
import { SEARCH_LABELS } from '../../../@core/constants';

@Pipe({
  name: 'searchLabel',
})
export class SearchLabelPipe implements PipeTransform {
  transform(searchKey: SearchKey): string {
    return SEARCH_LABELS[searchKey] || searchKey;
  }
}
