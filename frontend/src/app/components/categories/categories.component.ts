import {Component, computed, DestroyRef, inject, OnInit} from '@angular/core';
import {CategoryFormModel, CategoryModel} from "../../models/category.model";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfirmationService, PrimeTemplate} from "primeng/api";
import {InputTextModule} from 'primeng/inputtext';
import {Button, ButtonDirective} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TableModule} from 'primeng/table';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {SortCategoriesPipe} from '../../common/sort-categories.pipe';
import {RouterLink} from "@angular/router";
import {CategoriesStore} from "../../stores/categories.store";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ProgressBarComponent} from "../shared/progress-bar/progress-bar.component";
import {InputGroup} from "primeng/inputgroup";

type CategoryWithFormGroup = CategoryModel & { formGroup: FormGroup<CategoryFormModel>, loading: boolean };

@Component({
  selector: 'spl-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [ReactiveFormsModule, InputTextModule, ButtonDirective, RippleModule, TableModule, PrimeTemplate, ConfirmDialogModule, SortCategoriesPipe, RouterLink, ProgressBarComponent, Button, InputGroup],
  providers: [ConfirmationService]
})
export class CategoriesComponent implements OnInit {

  protected createForm = new FormGroup({
    name: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true
    })
  });

  protected categories = computed<CategoryWithFormGroup[] | undefined>(
    () => this.categoriesStore.categories()?.map(category => ({
      ...category,
      formGroup: this.getFormGroup(category),
      loading: false
    }))
  );

  protected createLoading = false;

  private readonly categoriesStore = inject(CategoriesStore);
  private readonly confirmationService = inject(ConfirmationService)
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.categoriesStore.loadCategories().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  private getFormGroup(category: CategoryModel): FormGroup<CategoryFormModel> {
    return new FormGroup({
      id: new FormControl(category.id, {
        validators: [Validators.required, Validators.min(1)],
        nonNullable: true
      }),
      name: new FormControl(category.name, {
        validators: Validators.required,
        nonNullable: true
      })
    });
  }

  updateCategory(category: CategoryWithFormGroup): void {
    if (category.formGroup.valid) {
      category.loading = true;
      this.categoriesStore.updateCategory(category.formGroup.getRawValue())
        .subscribe({
          complete: () => category.loading = false
        });
    }
  }

  createCategory() {
    if (this.createForm.valid) {
      this.createLoading = true;
      this.categoriesStore.createCategory(this.createForm.getRawValue())
        .subscribe({
          complete: () => {
            this.createLoading = false;
            this.createForm.reset();
          }
        });
    }
  }

  deleteCategory(category: CategoryWithFormGroup) {
    this.confirmationService.confirm({
      message: `Supprimer la catégorie ${category.name} ?`,
      accept: () => {
        category.loading = true;
        this.categoriesStore.deleteCategory(category.id).subscribe()
      }
    });
  }

  protected typeCategory(untyped: any): CategoryWithFormGroup {
    return untyped as CategoryWithFormGroup;
  }
}
