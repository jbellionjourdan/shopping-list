import {FormControl} from "@angular/forms";

export interface CreateItemModel {
  name: string,
  checked: boolean
}

export interface ItemModel extends CreateItemModel {
  id: number,
}

export interface ItemFormModel {
  id: FormControl<number>,
  name: FormControl<string>,
  checked: FormControl<boolean>
}
