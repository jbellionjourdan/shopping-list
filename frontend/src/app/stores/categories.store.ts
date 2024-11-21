import {inject, Injectable, signal} from "@angular/core";
import {CategoryService} from "../services/category.service";
import {CategoryModel, CreateCategoryModel} from "../models/category.model";
import {Observable, of, tap} from "rxjs";

@Injectable({providedIn: 'root'})
export class CategoriesStore {

  private readonly _categories = signal<CategoryModel[] | null>(null);

  get categories() {
    return this._categories.asReadonly();
  }

  private readonly categoriesService = inject(CategoryService);

  loadCategories(): Observable<CategoryModel[]> {
    const existingCategories = this._categories();

    return existingCategories ? of(existingCategories) : this.categoriesService.getAllCategories().pipe(
      tap(categories => this._categories.set(categories))
    );
  }

  updateCategory(category: CategoryModel): Observable<CategoryModel> {
    return this.categoriesService.updateCategory(category).pipe(
      tap(updated => this._categories.update(
        existingCategories => existingCategories?.map(
          existing => existing.id === updated.id ? updated : existing
        ) ?? null
      ))
    );
  }

  createCategory(category: CreateCategoryModel): Observable<CategoryModel> {
    return this.categoriesService.createCategory(category).pipe(
      tap(created => this._categories.update(
        existingCategories => [
          ...(existingCategories ?? []),
          created
        ]
      ))
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoriesService.deleteCategory(id).pipe(
      tap(() => this._categories.update(
        existingCategories => existingCategories?.filter(
          existing => existing.id !== id
        ) ?? null
      ))
    );
  }
}
