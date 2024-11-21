import {Pipe, PipeTransform} from '@angular/core';
import {ItemModel} from '../models/item.model';

@Pipe({
  name: 'sortItems',
  standalone: true
})
export class SortItemsPipe implements PipeTransform {

  transform<T extends ItemModel>(value: T[] | undefined | null, ...args: unknown[]): T[] {
    if (!value) {
      return [];
    }

    return value.sort(
      (left, right) => {
        if (left.checked && !right.checked) {
          return 1;
        }

        if (!left.checked && right.checked) {
          return -1;
        }

        return left.name.localeCompare(right.name);
      }
    )
  }

}
