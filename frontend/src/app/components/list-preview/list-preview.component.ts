import {Component, DestroyRef, inject, Input, signal, Signal} from '@angular/core';
import {CategorizedItemsModel} from "../../models/category.model";
import {SkeletonModule} from 'primeng/skeleton';
import {NgClass} from '@angular/common';
import {SortItemsPipe} from '../../common/sort-items.pipe';
import {SortCategoriesPipe} from '../../common/sort-categories.pipe';
import {ItemsStore} from "../../stores/items.store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'spl-list-preview',
  templateUrl: './list-preview.component.html',
  styleUrls: ['./list-preview.component.scss'],
  standalone: true,
  //changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkeletonModule, NgClass, SortItemsPipe, SortCategoriesPipe]
})
export class ListPreviewComponent {

  @Input() set listId(id: number) {
    this.itemsStore.loadItemsForList(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.categorizedItems = this.itemsStore.getItemsSignalForList(id);
  }

  protected categorizedItems: Signal<CategorizedItemsModel[] | null> = signal(null);

  private itemsStore = inject(ItemsStore);
  private destroyRef = inject(DestroyRef);

  completed(category: CategorizedItemsModel): boolean {
    return category.items.every(itm => itm.checked);
  }
}
