import { Pipe, PipeTransform } from '@angular/core';
import {ItemModel} from '../models/item.model';
import {CategoryModel} from "../models/category.model";

@Pipe({
    name: 'sortCategories',
    standalone: true
})
export class SortCategoriesPipe implements PipeTransform {

  transform<T extends CategoryModel> (value: T[]|undefined|null, ...args: unknown[]): T[] {
    if(!value){
      return [];
    }

    return value.sort(
      (left, right) => {
        return left.name.localeCompare(right.name);
      }
    )
  }

}
