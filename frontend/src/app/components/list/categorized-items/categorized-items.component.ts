import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input} from '@angular/core';
import {CategorizedItemsModel} from "../../../models/category.model";
import {ItemFormModel, ItemModel} from "../../../models/item.model";
import {FieldsetModule} from 'primeng/fieldset';
import {CheckboxModule} from 'primeng/checkbox';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {Button} from 'primeng/button';
import {SortItemsPipe} from '../../../common/sort-items.pipe';
import {ItemsStore} from "../../../stores/items.store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Inplace, InplaceModule} from "primeng/inplace";
import {InputTextModule} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";

type ItemWithFormGroup = ItemModel & { formGroup: FormGroup<ItemFormModel>, loading: boolean };
type CategorizedItemsWithFormGroups = Omit<CategorizedItemsModel, 'items'> & { items: ItemWithFormGroup[] };

@Component({
  selector: 'spl-categorized-items',
  templateUrl: './categorized-items.component.html',
  styleUrls: ['./categorized-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldsetModule, CheckboxModule, FormsModule, NgClass, Button, SortItemsPipe, InplaceModule, InputTextModule, ReactiveFormsModule, InputGroup]
})
export class CategorizedItemsComponent {

  @Input({required: true}) set categorizedItems(val: CategorizedItemsModel) {
    this._categorizedItems = {
      ...val,
      items: val.items.map(item => ({
        ...item,
        loading: false,
        formGroup: this.getFormGroup(item)
      }))
    };
    this.completed = val.items.every(itm => itm.checked);
  };

  @Input({required: true}) listId!: number;

  protected _categorizedItems!: CategorizedItemsWithFormGroups;
  protected completed = false;

  private readonly itemsStore = inject(ItemsStore);
  private readonly destroyRef = inject(DestroyRef);

  protected deleteItem(item: ItemWithFormGroup): void {
    item.loading = true;
    this.itemsStore.deleteItem(this.listId, item.id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      complete: () => item.loading = false
    });
  }

  protected updateItem(item: ItemWithFormGroup, inplace?: Inplace): void {
    if (inplace) {
      inplace.active = false;
    }

    if (item.name === item.formGroup.value.name && item.checked === item.formGroup.value.checked) {
      return;
    }

    if (item.formGroup.valid) {
      item.loading = true;
      this.itemsStore.updateItem(this.listId, item.formGroup.getRawValue()).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        complete: () => item.loading = false
      });
    }
  }

  private getFormGroup(item: ItemModel): FormGroup<ItemFormModel> {
    return new FormGroup({
      id: new FormControl(item.id, {
        validators: Validators.required,
        nonNullable: true
      }),
      name: new FormControl(item.name, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true
      }),
      checked: new FormControl(item.checked, {
        validators: Validators.required,
        nonNullable: true
      })
    });
  }
}
