import {Component, DestroyRef, inject, OnInit, Signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {CategoryModel} from "../../models/category.model";
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {CategorizedItemsComponent} from './categorized-items/categorized-items.component';
import {SortCategoriesPipe} from '../../common/sort-categories.pipe';
import {ItemsStore} from "../../stores/items.store";
import {ListModel} from "../../models/list.model";
import {ListsStore} from "../../stores/lists.store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressBarComponent} from "../shared/progress-bar/progress-bar.component";
import {CategoriesStore} from "../../stores/categories.store";
import {SkeletonModule} from "primeng/skeleton";
import {FieldsetModule} from "primeng/fieldset";
import {InputGroup} from "primeng/inputgroup";
import {Select} from "primeng/select";

@Component({
  selector: 'spl-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, DropdownModule, InputTextModule, RippleModule, CategorizedItemsComponent, SortCategoriesPipe, RouterLink, ButtonModule, ProgressBarComponent, SkeletonModule, FieldsetModule, InputGroup, Select]
})
export class ListComponent implements OnInit {

  listId?: number;
  list?: Signal<ListModel | null>;

  createForm = new FormGroup({
    name: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    }),
    category: new FormControl<CategoryModel | null>(null, Validators.required)
  });

  protected addItemLoading = false;

  protected readonly itemsStore = inject(ItemsStore);
  protected readonly categoriesStore = inject(CategoriesStore);
  private readonly route = inject(ActivatedRoute);
  protected readonly listsStore = inject(ListsStore);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.listId = this.route.snapshot.params['listId'];

    if (!this.listId) {
      return;
    }

    this.listsStore.getList(this.listId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.categoriesStore.loadCategories().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.itemsStore.loadItemsForList(this.listId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.list = this.listsStore.getListSignalById(this.listId);
  }

  addItem() {
    if (!this.listId || !this.createForm.valid) {
      return;
    }

    const name = this.createForm.value.name!;
    const category = this.createForm.value.category!;

    this.addItemLoading = true;

    this.itemsStore.createItem(this.listId, category, {
      name,
      checked: false
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      complete: () => this.addItemLoading = false
    });

    this.createForm.patchValue({
      name: ''
    });
  }
}
